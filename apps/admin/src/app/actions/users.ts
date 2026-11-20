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

export async function getAdminUserDetailAction(id: string) {
  try {
    const admin = createAdminClient();
    const { data: account, error: accError } = await admin
      .from("accounts")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (accError || !account) {
      return { success: false, user: null, error: accError?.message || "Akun tidak ditemukan" };
    }

    const { data: profile } = await admin
      .from("profiles")
      .select("*, regions(name, code), games(name, short_name)")
      .eq("account_id", id)
      .maybeSingle();

    return {
      success: true,
      user: {
        id: account.id,
        email: account.email || "-",
        role: account.role || "user",
        createdAt: account.created_at,
        displayName: profile?.display_name || account.email?.split("@")[0] || "Pengguna",
        ign: profile?.ign || "-",
        branch: profile?.entity_type || "-",
        region: (profile as any)?.regions?.name || "-",
        status: profile?.verification_status || "unverified",
        esportId: profile?.esport_id || "-",
        avatarUrl: profile?.avatar_url,
        bio: profile?.bio,
        profile,
      },
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Gagal memuat rincian akun";
    return { success: false, user: null, error: errorMsg };
  }
}
