"use server";

import { createAdminClient } from "@/lib/supabase/server";

export interface AdminUserItem {
  id: string;
  accountId: string;
  email: string;
  displayName: string;
  ign: string;
  esportId: string;
  branch: string;
  region: string;
  role: string;
  status: string;
  createdAt: string;
  avatarUrl?: string;
}

export async function getAdminUsersAction(): Promise<{
  success: boolean;
  users: AdminUserItem[];
  error?: string;
}> {
  try {
    const admin = createAdminClient();

    const [accountsRes, profilesRes] = await Promise.all([
      admin.from("accounts").select("id, email, role, created_at").order("created_at", { ascending: false }),
      admin.from("profiles").select("id, account_id, esport_id, display_name, ign, entity_type, verification_status, avatar_url, created_at, regions(name, code), games(name)"),
    ]);

    const profilesByAccount = new Map<string, any>();
    (profilesRes.data || []).forEach((p: any) => {
      profilesByAccount.set(p.account_id, p);
    });

    const users: AdminUserItem[] = (accountsRes.data || []).map((acc: any) => {
      const p = profilesByAccount.get(acc.id);
      return {
        id: acc.id,
        accountId: acc.id,
        email: acc.email || "-",
        displayName: p?.display_name || acc.email?.split("@")[0] || "Akun Terdaftar",
        ign: p?.ign || "-",
        esportId: p?.esport_id || "-",
        branch: p?.entity_type || "Belum Mengisi",
        region: p?.regions?.name || "-",
        role: acc.role || "user",
        status: p?.verification_status || "unverified",
        createdAt: acc.created_at || new Date().toISOString(),
        avatarUrl: p?.avatar_url,
      };
    });

    return { success: true, users };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Gagal memuat pengguna";
    return { success: false, users: [], error: errorMsg };
  }
}
