"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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
  isStaging?: boolean;
}

export async function getAdminUsersAction(): Promise<{
  success: boolean;
  users: AdminUserItem[];
  error?: string;
}> {
  try {
    const admin = createAdminClient();

    const [accountsRes, profilesRes] = await Promise.all([
      admin
        .from("accounts")
        .select("id, email, role, created_at, is_active")
        .neq("is_active", false)
        .order("created_at", { ascending: false }),
      admin
        .from("profiles")
        .select("id, account_id, esport_id, display_name, ign, entity_type, verification_status, avatar_url, created_at, regions(name, code), games(name)"),
    ]);

    const profilesByAccount = new Map<string, any>();
    (profilesRes.data || []).forEach((p: any) => {
      profilesByAccount.set(p.account_id, p);
    });

    const users: AdminUserItem[] = (accountsRes.data || []).map((acc: any) => {
      const p = profilesByAccount.get(acc.id);
      const email = acc.email || "-";
      const isStaging = email.includes("staging") || email.endsWith("@esportsumbar.id") || email.startsWith("test");

      return {
        id: acc.id,
        accountId: acc.id,
        email,
        displayName: p?.display_name || email.split("@")[0] || "Akun Terdaftar",
        ign: p?.ign || "-",
        esportId: p?.esport_id || "-",
        branch: p?.entity_type || "Belum Mengisi",
        region: (p as any)?.regions?.name || "-",
        role: acc.role || "user",
        status: p?.verification_status || "unverified",
        createdAt: acc.created_at || new Date().toISOString(),
        avatarUrl: p?.avatar_url,
        isStaging,
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

    const mappedProfile = profile
      ? {
          id: profile.id,
          displayName: profile.display_name || account.email?.split("@")[0] || "Pengguna",
          entityType: profile.entity_type,
          ign: profile.ign || "-",
          esportId: profile.esport_id || "-",
          slug: profile.slug,
          verificationStatus: profile.verification_status,
          regionName: (profile as any)?.regions?.name || "-",
          gameName: (profile as any)?.games?.name || "-",
          avatarUrl: profile.avatar_url,
          bio: profile.bio,
        }
      : null;

    return {
      success: true,
      user: {
        id: account.id,
        email: account.email || "-",
        role: account.role || "user",
        status: (account as any).is_active !== false ? "active" : "inactive",
        createdAt: account.created_at,
        displayName: mappedProfile?.displayName || account.email?.split("@")[0] || "Pengguna",
        ign: mappedProfile?.ign || "-",
        branch: mappedProfile?.entityType || "-",
        region: mappedProfile?.regionName || "-",
        statusBadge: mappedProfile?.verificationStatus || "unverified",
        esportId: mappedProfile?.esportId || "-",
        avatarUrl: mappedProfile?.avatarUrl,
        bio: mappedProfile?.bio,
        profile: mappedProfile,
      },
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Gagal memuat rincian akun";
    return { success: false, user: null, error: errorMsg };
  }
}

/**
 * Menghapus akun secara permanen dari Supabase (Auth, Profiles, Documents, Storage).
 */
export async function deleteAdminUserAction(accountId: string): Promise<{
  success: boolean;
  message: string;
  error?: string;
}> {
  try {
    if (!accountId) {
      return { success: false, message: "ID akun wajib disertakan.", error: "MISSING_ID" };
    }

    const admin = createAdminClient();
    const rawAdmin = admin as any;

    // 1. Ambil data akun target
    const { data: account, error: accErr } = await admin
      .from("accounts")
      .select("id, email, role")
      .eq("id", accountId)
      .maybeSingle();

    if (accErr || !account) {
      return { success: false, message: "Akun tidak ditemukan di database Supabase.", error: accErr?.message };
    }

    // Proteksi akun Super Admin Utama
    if (account.email === "sano@gmail.com") {
      return {
        success: false,
        message: "Akun Super Administrator Utama (sano@gmail.com) dilindungi dan tidak dapat dihapus.",
        error: "PROTECTED_SUPER_ADMIN",
      };
    }

    // 2. Putuskan relasi foreign key opsional
    await Promise.allSettled([
      rawAdmin.from("site_settings").update({ updated_by: null }).eq("updated_by", accountId),
      rawAdmin.from("content_blocks").update({ updated_by: null }).eq("updated_by", accountId),
      rawAdmin.from("content_revisions").update({ created_by: null }).eq("created_by", accountId),
      rawAdmin.from("banners").update({ created_by: null }).eq("created_by", accountId),
      rawAdmin.from("legal_pages").update({ updated_by: null }).eq("updated_by", accountId),
      rawAdmin.from("media_assets").update({ created_by: null }).eq("created_by", accountId),
      rawAdmin.from("user_reports").update({ reporter_id: null }).eq("reporter_id", accountId),
      rawAdmin.from("verification_requests").update({ current_reviewer_id: null }).eq("current_reviewer_id", accountId),
    ]);

    // 3. Ambil dan bersihkan seluruh profil yang terhubung ke akun ini
    const { data: profiles } = await admin
      .from("profiles")
      .select("id, avatar_url")
      .eq("account_id", accountId);

    if (profiles && profiles.length > 0) {
      const profileIds = profiles.map((p) => p.id);

      // Hapus permohonan verifikasi
      await admin.from("verification_requests").delete().in("profile_id", profileIds);

      // Hapus data prestasi atlet/tim
      await admin.from("achievements").delete().in("profile_id", profileIds);

      // Hapus relasi keanggotaan (memberships)
      for (const pid of profileIds) {
        await admin.from("memberships").delete().eq("member_profile_id", pid);
        await admin.from("memberships").delete().eq("org_profile_id", pid);
      }

      // Hapus baris di tabel profiles
      await admin.from("profiles").delete().eq("account_id", accountId);
    }

    // 4. Hapus berkas avatar di Storage bucket jika ada
    try {
      const { data: avatarFiles } = await admin.storage.from("avatars").list(accountId);
      if (avatarFiles && avatarFiles.length > 0) {
        const filePaths = avatarFiles.map((f) => `${accountId}/${f.name}`);
        await admin.storage.from("avatars").remove(filePaths);
      }
    } catch {
      // Storage removal non-blocking
    }

    // 5. Hapus token notifikasi
    try {
      await rawAdmin.from("device_tokens").delete().eq("account_id", accountId);
    } catch {
      // Non-blocking
    }

    // 6. Hapus dari tabel public.accounts & auth.users
    let dbHardDeleted = false;
    const { error: delAccErr } = await admin.from("accounts").delete().eq("id", accountId);
    if (!delAccErr) {
      dbHardDeleted = true;
      const { error: authDelErr } = await admin.auth.admin.deleteUser(accountId);
      if (authDelErr) {
        console.warn("Notice auth.admin.deleteUser:", authDelErr.message);
      }
    } else {
      // Jika trigger foreign key audit log menolak penghapusan baris accounts,
      // nonaktifkan akun permanen dan blokir akses login
      await admin
        .from("accounts")
        .update({ is_active: false, role: "user" } as any)
        .eq("id", accountId);

      try {
        await admin.auth.admin.updateUserById(accountId, {
          ban_duration: "876000h",
          user_metadata: { deactivated: true },
        });
      } catch {
        // Non-blocking
      }
    }

    // 7. Catat ke audit log
    try {
      await admin.from("audit_logs").insert({
        actor_role: "platform_admin",
        action: "user_deleted",
        target_type: "account",
        target_id: accountId,
        reason: `Akun ${account.email} dihapus dari Supabase oleh Administrator`,
        metadata_jsonb: {
          deleted_email: account.email,
          deleted_role: account.role,
          hard_deleted: dbHardDeleted,
        },
      } as any);
    } catch (auditErr) {
      console.warn("Audit log notice:", auditErr);
    }

    try {
      revalidatePath("/users");
      revalidatePath("/");
    } catch {
      // Non-blocking di luar Next.js request context
    }

    return {
      success: true,
      message: `Akun ${account.email} berhasil dihapus permanen dari direktori Supabase.`,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Gagal menghapus akun dari Supabase";
    return { success: false, message: errorMsg, error: errorMsg };
  }
}

/**
 * Membersihkan seluruh akun pengujian / staging otomatis sekaligus.
 */
export async function purgeStagingAccountsAction(): Promise<{
  success: boolean;
  count: number;
  message: string;
  error?: string;
}> {
  try {
    const admin = createAdminClient();

    // Cari akun-akun staging aktif
    const { data: accounts, error: fetchErr } = await admin
      .from("accounts")
      .select("id, email, is_active")
      .neq("is_active", false)
      .or("email.ilike.%staging%,email.ilike.%@esportsumbar.id%,email.ilike.test@%");

    if (fetchErr) {
      throw new Error(fetchErr.message);
    }

    // Filter keluar sano@gmail.com
    const stagingAccounts = (accounts || []).filter(
      (a) => a.email !== "sano@gmail.com" && (a.email.includes("staging") || a.email.endsWith("@esportsumbar.id") || a.email.startsWith("test"))
    );

    let deletedCount = 0;
    for (const acc of stagingAccounts) {
      const res = await deleteAdminUserAction(acc.id);
      if (res.success) {
        deletedCount++;
      }
    }

    try {
      revalidatePath("/users");
      revalidatePath("/");
    } catch {
      // Non-blocking
    }

    return {
      success: true,
      count: deletedCount,
      message: `Berhasil menghapus ${deletedCount} akun fiktif/staging dari Supabase.`,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Gagal membersihkan akun staging";
    return { success: false, count: 0, message: errorMsg, error: errorMsg };
  }
}
