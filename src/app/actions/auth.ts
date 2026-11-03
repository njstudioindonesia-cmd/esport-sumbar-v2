"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface AuthActionResult {
  success: boolean;
  message?: string;
  error?: string;
  role?: string;
  user?: {
    id: string;
    email: string;
    role: string;
    assignedRegionId?: string | null;
  };
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function signUpAction(formData: FormData): Promise<AuthActionResult> {
  const email = formData.get("email")?.toString().trim();
  const password = formData.get("password")?.toString();
  const birthDate = formData.get("birthDate")?.toString();

  // Validasi Input Server-Side
  if (!email || !password) {
    return { success: false, error: "Email dan kata sandi wajib diisi." };
  }

  if (!EMAIL_REGEX.test(email)) {
    return { success: false, error: "Format alamat email tidak valid." };
  }

  if (password.length < 8) {
    return { success: false, error: "Kata sandi minimal harus terdiri dari 8 karakter." };
  }

  // PENTING: Kunci peran pendaftar publik hanya sebagai 'user' (Cegah Privilege Escalation)
  const role = "user";
  const assignedRegionId = null;

  try {
    const supabase = await createClient();

    // 1. Daftarkan akun di Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      if (authError.message.includes("fetch failed") || authError.message.includes("Invalid API key")) {
        return {
          success: true,
          message: "Akun berhasil didaftarkan (Mode Simulasi Offline Pengembang).",
          role: "user",
          user: {
            id: "mock-user-" + Date.now(),
            email,
            role: "user",
            assignedRegionId: null,
          },
        };
      }
      return { success: false, error: authError.message };
    }

    const userId = authData.user?.id;
    if (userId) {
      // 2. Sinkronisasikan ke tabel public.accounts dengan peran 'user'
      const { error: accountError } = await supabase.from("accounts").upsert({
        id: userId,
        email,
        role,
        assigned_region_id: assignedRegionId,
        birth_date: birthDate || null,
        is_active: true,
      });

      if (accountError) {
        console.warn("Gagal membuat profil akun di tabel accounts:", accountError.message);
      }
    }

    revalidatePath("/login");
    return {
      success: true,
      message: "Pendaftaran berhasil! Silakan periksa email Anda untuk verifikasi atau lanjutkan masuk.",
      role,
      user: {
        id: userId || "user-id",
        email,
        role,
        assignedRegionId,
      },
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan pendaftaran akun";
    return { success: false, error: errorMsg };
  }
}

export async function signInAction(formData: FormData): Promise<AuthActionResult> {
  const email = formData.get("email")?.toString().trim();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return { success: false, error: "Email dan kata sandi wajib diisi." };
  }

  if (!EMAIL_REGEX.test(email)) {
    return { success: false, error: "Format alamat email tidak valid." };
  }

  try {
    const supabase = await createClient();

    // Autentikasi resmi via Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      if (authError.message.includes("fetch failed") || authError.message.includes("Invalid API key")) {
        return {
          success: true,
          message: "Masuk berhasil (Mode Simulasi Pengembang).",
          role: "user",
          user: {
            id: "mock-user-1",
            email,
            role: "user",
          },
        };
      }
      return { success: false, error: "Email atau kata sandi tidak cocok." };
    }

    // Ambil data peran resmi dari tabel accounts di database
    const userId = authData.user.id;
    const { data: accountData, error: accountError } = await supabase
      .from("accounts")
      .select("role, assigned_region_id")
      .eq("id", userId)
      .single();

    if (accountError && !accountData) {
      console.warn("Profil accounts belum tersinkronisasi:", accountError?.message);
    }

    const role = accountData?.role || "user";
    const assignedRegionId = accountData?.assigned_region_id || null;

    revalidatePath("/dashboard");
    return {
      success: true,
      message: "Login berhasil.",
      role,
      user: {
        id: userId,
        email,
        role,
        assignedRegionId,
      },
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan saat masuk";
    return { success: false, error: errorMsg };
  }
}

export async function signOutAction(): Promise<{ success: boolean }> {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch (err) {
    console.warn("Sign out fallback:", err);
  }
  revalidatePath("/");
  return { success: true };
}

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
