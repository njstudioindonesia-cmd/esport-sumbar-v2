/**
 * Subdomain Core: Identity (Sub-langkah 7.6)
 * Mengelola akun, otentikasi peran tunggal (user vs platform_admin),
 * dan batas otorisasi pengguna secara terisolasi tanpa relasi langsung ke profil.
 */

export type AccountRole = "user" | "platform_admin";

export interface IdentityAccount {
  id: string;
  email: string;
  role: AccountRole;
  isActive: boolean;
  lastSignInAt?: string | null;
  createdAt: string;
}

export interface VerifyRoleResult {
  isAuthorized: boolean;
  role: AccountRole;
  error?: string;
}
