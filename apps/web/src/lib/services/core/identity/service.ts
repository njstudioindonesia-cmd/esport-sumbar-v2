/**
 * Layanan Subdomain Core: Identity
 * Berkomunikasi hanya dengan tabel accounts; tidak melakukan join ke profiles atau domain lain.
 */

import { IdentityAccount, VerifyRoleResult } from "./types";
import { createAdminClient } from "@/lib/supabase/server";

// In-Memory store untuk penanganan mock testing dan fallback
const inMemoryAccounts = new Map<string, IdentityAccount>();

export function clearIdentityStore(): void {
  inMemoryAccounts.clear();
}

export function registerMockAccount(account: IdentityAccount): void {
  inMemoryAccounts.set(account.id, { ...account });
}

/**
 * Mengambil akun berdasarkan ID tanpa melakukan JOIN lintas domain
 */
export async function getAccountById(accountId: string): Promise<IdentityAccount | null> {
  const isTest = process.env.NODE_ENV === "test";
  const isPlaceholder = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").includes("placeholder");

  if (isTest || isPlaceholder) {
    return inMemoryAccounts.get(accountId) || null;
  }

  try {
    const admin = createAdminClient();
    const { data, error } = await (admin.from("accounts") as any)
      .select("id, email, role, is_active, last_sign_in_at, created_at")
      .eq("id", accountId)
      .maybeSingle();

    if (error || !data) return null;

    return {
      id: data.id,
      email: data.email,
      role: data.role as any,
      isActive: Boolean(data.is_active),
      lastSignInAt: data.last_sign_in_at,
      createdAt: data.created_at,
    };
  } catch (err) {
    console.error("IdentityService getAccountById error:", err);
    return null;
  }
}

/**
 * Memverifikasi peran akun secara aman (RBAC V3)
 */
export async function verifyUserRole(
  accountId: string,
  requiredRole: "user" | "platform_admin"
): Promise<VerifyRoleResult> {
  const account = await getAccountById(accountId);
  if (!account) {
    return {
      isAuthorized: false,
      role: "user",
      error: "Akun tidak ditemukan.",
    };
  }

  if (!account.isActive) {
    return {
      isAuthorized: false,
      role: account.role,
      error: "Akun telah dinonaktifkan.",
    };
  }

  const isAuthorized = account.role === requiredRole || account.role === "platform_admin";
  return {
    isAuthorized,
    role: account.role,
  };
}

/**
 * Memeriksa apakah suatu akun adalah platform_admin ESPORT SUMBAR
 */
export async function isPlatformAdmin(accountId: string): Promise<boolean> {
  const result = await verifyUserRole(accountId, "platform_admin");
  return result.isAuthorized && result.role === "platform_admin";
}
