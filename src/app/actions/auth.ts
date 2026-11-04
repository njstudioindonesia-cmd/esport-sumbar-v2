"use server";

import { createClient } from "@/lib/supabase/server";
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

  const { email, password, birthDate } = validation.data;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  try {
    const supabase = await createClient();

    // 2. Daftarkan akun di Supabase Auth
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
      if (authError.message.toLowerCase().includes("already registered")) {
        return {
          success: false,
          error: "Alamat email ini sudah terdaftar. Silakan masuk atau gunakan fitur lupa kata sandi.",
        };
      }
      return { success: false, error: authError.message };
    }

    const user = authData.user;
    if (!user) {
      return { success: false, error: "Gagal membuat sesi pendaftaran." };
    }

    // 3. Pastikan baris accounts tersinkronisasi jika trigger belum aktif
    try {
      await supabase.from("accounts").upsert(
        {
          id: user.id,
          email: user.email || email,
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

    // Jika konfirmasi email wajib dan session belum terbit
    const needsConfirmation = !authData.session;

    revalidatePath("/login");
    return {
      success: true,
      needsConfirmation,
      message: needsConfirmation
        ? "Pendaftaran berhasil! Tautan aktivasi telah dikirim ke email Anda. Silakan periksa kotak masuk atau spam Anda."
        : "Pendaftaran berhasil! Akun Anda telah aktif.",
      role: "user",
      user: {
        id: user.id,
        email: user.email || email,
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
 * Masuk Pengguna Resmi dengan Rate Limiting Sederhana
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

    // 3. Otentikasi resmi via Supabase Auth
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

    // 4. Ambil peran resmi pengguna dari tabel accounts di database
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
 * Permintaan Reset Kata Sandi Resmi
 */
export async function resetPasswordAction(formData: FormData): Promise<{ success: boolean; message?: string; error?: string }> {
  const rawEmail = formData.get("email")?.toString();

  const validation = resetPasswordSchema.safeParse({ email: rawEmail });
  if (!validation.success) {
    return { success: false, error: "Masukkan alamat email yang valid." };
  }

  const { email } = validation.data;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/auth/callback?next=/me/settings`,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return {
      success: true,
      message: "Instruksi pengaturan ulang kata sandi telah dikirim ke email Anda.",
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
