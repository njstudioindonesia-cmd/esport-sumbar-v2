"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  checkRateLimit,
  recordFailedAttempt,
  clearRateLimit,
} from "@/lib/security/rate-limit";

// ==============================================================================
// SKEMA VALIDASI ZOD (SERVER-SIDE INPUT VALIDATION)
// ==============================================================================

const signUpSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Alamat email wajib diisi." })
    .email({ message: "Format alamat email tidak valid." }),
  password: z
    .string()
    .min(8, { message: "Kata sandi minimal harus 8 karakter." })
    .regex(/[A-Z]/, { message: "Kata sandi harus mengandung minimal 1 huruf kapital." })
    .regex(/[0-9]/, { message: "Kata sandi harus mengandung minimal 1 angka." }),
  birthDate: z.string().optional(),
});

const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Alamat email wajib diisi." })
    .email({ message: "Format alamat email tidak valid." }),
  password: z
    .string()
    .min(1, { message: "Kata sandi wajib diisi." }),
});

const resetPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Alamat email wajib diisi." })
    .email({ message: "Format alamat email tidak valid." }),
});

export interface AuthActionResult {
  success: boolean;
  message?: string;
  error?: string;
  needsConfirmation?: boolean;
  role?: string;
  user?: {
    id: string;
    email: string;
    role: string;
    assignedRegionId?: string | null;
  };
}

/**
 * Registrasi Pengguna Baru via Supabase Auth + Trigger Sinkronisasi Accounts
 */
export async function signUpAction(formData: FormData): Promise<AuthActionResult> {
  const rawEmail = formData.get("email")?.toString();
  const rawPassword = formData.get("password")?.toString();
  const rawBirthDate = formData.get("birthDate")?.toString();

  // 1. Validasi Zod
  const validation = signUpSchema.safeParse({
    email: rawEmail,
    password: rawPassword,
    birthDate: rawBirthDate,
  });

  if (!validation.success) {
    const firstError = validation.error.issues[0]?.message || "Input tidak valid.";
    return { success: false, error: firstError };
  }

  // 1b. Periksa Toggle Pendaftaran Publik (Soft Launch Mode / Keputusan P11)
  if (process.env.NEXT_PUBLIC_ENABLE_REGISTRATION === "false") {
    return {
      success: false,
      error: "Pendaftaran publik dibatasi untuk kelompok uji terbatas selama masa peluncuran terkendali (soft launch).",
    };
  }

  const { email, password, birthDate } = validation.data;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  try {
    const supabase = await createClient();
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    let userId: string;

    if (serviceKey) {
      // 2. Gunakan Admin API agar email_confirm langsung true dan TIDAK PERNAH terblokir SMTP rate limit
      const adminClient = createAdminClient();
      const { data: adminData, error: adminError } = await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          birth_date: birthDate || null,
        },
      });

      if (adminError) {
        const msg = adminError.message.toLowerCase();
        if (msg.includes("already registered") || msg.includes("already been registered")) {
          return {
            success: false,
            error: "Alamat email ini sudah terdaftar. Silakan masuk dengan email dan kata sandi Anda.",
          };
        }
        return { success: false, error: adminError.message };
      }

      if (!adminData.user) {
        return { success: false, error: "Gagal membuat akun." };
      }

      userId = adminData.user.id;
    } else {
      // Fallback jika SERVICE_ROLE_KEY tidak ada
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${siteUrl}/auth/callback?next=/me/profile/new`,
          data: {
            birth_date: birthDate || null,
          },
        },
      });

      if (authError) {
        const msg = authError.message.toLowerCase();
        if (msg.includes("already registered")) {
          return {
            success: false,
            error: "Alamat email ini sudah terdaftar. Silakan masuk atau gunakan fitur lupa kata sandi.",
          };
        }
        return { success: false, error: authError.message };
      }

      if (!authData.user) {
        return { success: false, error: "Gagal membuat sesi pendaftaran." };
      }

      userId = authData.user.id;
    }

    // 3. Pastikan baris accounts tersinkronisasi jika trigger belum aktif
    try {
      await supabase.from("accounts").upsert(
        {
          id: userId,
          email: email.toLowerCase(),
          role: "user",
          assigned_region_id: null,
          birth_date: birthDate || null,
          is_active: true,
        },
        { onConflict: "id" }
      );
    } catch {
      // Trigger on_auth_user_created di PostgreSQL menangani sinkronisasi ini secara otomatis
    }

    // 4. Masuk otomatis (Sign in) agar cookie sesi tersimpan langsung di browser pengguna
    try {
      await supabase.auth.signInWithPassword({
        email,
        password,
      });
    } catch (e) {
      console.warn("Auto sign-in warning:", e);
    }

    revalidatePath("/dashboard");
    revalidatePath("/me/cards");
    revalidatePath("/login");

    return {
      success: true,
      needsConfirmation: false,
      message: "Pendaftaran berhasil! Mengalihkan ke pembuatan kartu...",
      role: "user",
      user: {
        id: userId,
        email,
        role: "user",
        assignedRegionId: null,
      },
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan sistem saat mendaftar.";
    return { success: false, error: errorMsg };
  }
}

/**
 * Masuk Pengguna dengan Rate Limiting Sederhana
 */
export async function signInAction(formData: FormData): Promise<AuthActionResult> {
  const rawEmail = formData.get("email")?.toString();
  const rawPassword = formData.get("password")?.toString();

  // 1. Validasi Zod
  const validation = signInSchema.safeParse({
    email: rawEmail,
    password: rawPassword,
  });

  if (!validation.success) {
    const firstError = validation.error.issues[0]?.message || "Email dan kata sandi wajib diisi.";
    return { success: false, error: firstError };
  }

  const { email, password } = validation.data;
  const rateLimitKey = `login:${email.toLowerCase()}`;

  // 2. Rate Limiting Check (Maksimal 5 percobaan dalam 15 menit)
  const rateCheck = checkRateLimit(rateLimitKey, 5, 15 * 60 * 1000);
  if (!rateCheck.allowed) {
    const minutesLeft = Math.ceil(rateCheck.retryAfterSeconds / 60);
    return {
      success: false,
      error: `Terlalu banyak percobaan masuk yang salah. Demi keamanan, akun ini ditangguhkan sementara. Coba lagi dalam ${minutesLeft} menit.`,
    };
  }

  try {
    const supabase = await createClient();

    // 3. Otentikasi pengguna via Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      recordFailedAttempt(rateLimitKey);

      if (authError.message.toLowerCase().includes("email not confirmed")) {
        return {
          success: false,
          error: "Email Anda belum dikonfirmasi. Silakan periksa email aktivasi yang telah kami kirimkan.",
        };
      }

      if (authError.message.toLowerCase().includes("invalid login credentials")) {
        return {
          success: false,
          error: "Alamat email atau kata sandi tidak cocok. Sisa percobaan: " + (rateCheck.remaining - 1),
        };
      }

      return { success: false, error: authError.message };
    }

    // Login Sukses -> Reset counter rate limit
    clearRateLimit(rateLimitKey);

    const userId = authData.user.id;

    // 4. Ambil peran pengguna dari tabel accounts di database
    const { data: accountData } = await supabase
      .from("accounts")
      .select("role, assigned_region_id")
      .eq("id", userId)
      .single();

    const role = accountData?.role || "user";
    const assignedRegionId = accountData?.assigned_region_id || null;

    revalidatePath("/dashboard");
    revalidatePath("/me/cards");

    return {
      success: true,
      message: "Masuk berhasil! Mengalihkan ke dashboard...",
      role,
      user: {
        id: userId,
        email: authData.user.email || email,
        role,
        assignedRegionId,
      },
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan sistem saat mencoba masuk.";
    return { success: false, error: errorMsg };
  }
}

/**
 * Permintaan Reset Kata Sandi
 */
export async function resetPasswordAction(formData: FormData): Promise<{ success: boolean; message?: string; error?: string }> {
  const rawEmail = formData.get("email")?.toString();

  const validation = resetPasswordSchema.safeParse({ email: rawEmail });
  if (!validation.success) {
    return { success: false, error: "Masukkan alamat email yang valid." };
  }

  const { email } = validation.data;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://esport-sumbar-v2.vercel.app";

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/auth/callback?next=/reset-password`,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return {
      success: true,
      message: "Instruksi pengaturan ulang kata sandi telah dikirim ke email Anda. Silakan periksa inbox atau folder spam.",
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Gagal mengirim permintaan reset kata sandi.";
    return { success: false, error: errorMsg };
  }
}

/**
 * Keluar (Sign Out) dan Bersihkan Sesi Server & Cookie
 */
export async function signOutAction(): Promise<{ success: boolean }> {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch (err) {
    console.warn("Sign out exception:", err);
  }

  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/login");
  return { success: true };
}

/**
 * Ambil Identitas Pengguna yang Sedang Login dari Sesi Server
 */
export async function getCurrentUser() {
  try {
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();

    if (!authData?.user) {
      return null;
    }

    const { data: accountData } = await supabase
      .from("accounts")
      .select("role, assigned_region_id, birth_date")
      .eq("id", authData.user.id)
      .single();

    return {
      id: authData.user.id,
      email: authData.user.email || "",
      role: accountData?.role || "user",
      assignedRegionId: accountData?.assigned_region_id || null,
      birthDate: accountData?.birth_date || null,
    };
  } catch {
    return null;
  }
}
