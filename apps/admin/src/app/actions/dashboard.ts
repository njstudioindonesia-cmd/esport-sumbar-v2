"use server";

import { createAdminClient } from "@/lib/supabase/server";

export interface DashboardMetrics {
  pendingVerifications: number;
  verifiedProfiles: number;
  totalArticles: number;
  totalReports: number;
  totalAccounts: number;
  totalProfiles: number;
  recentQueue: Array<{
    id: string;
    profileId: string;
    name: string;
    ign: string;
    esportId: string;
    type: string;
    game: string;
    region: string;
    status: string;
    submittedDate: string;
    avatarUrl?: string;
  }>;
}

export async function getDashboardMetricsAction(): Promise<{
  success: boolean;
  data: DashboardMetrics;
  error?: string;
}> {
  try {
    const admin = createAdminClient();

    const [
      { count: totalAccounts },
      { count: totalProfiles },
      { count: verifiedProfiles },
      { count: totalArticles },
      { count: totalReports },
      { data: unverifiedProfiles },
      { data: verificationRequests },
    ] = await Promise.all([
      admin.from("accounts").select("*", { count: "exact", head: true }),
      admin.from("profiles").select("*", { count: "exact", head: true }),
      admin.from("profiles").select("*", { count: "exact", head: true }).eq("verification_status", "verified"),
      admin.from("articles").select("*", { count: "exact", head: true }).eq("status", "published"),
      admin.from("reports").select("*", { count: "exact", head: true }),
      admin
        .from("profiles")
        .select("id, esport_id, display_name, ign, entity_type, verification_status, avatar_url, created_at, regions(name, code), games(name)")
        .neq("verification_status", "verified")
        .order("created_at", { ascending: false })
        .limit(10),
      admin
        .from("verification_requests")
        .select("id, status, submitted_at, profile_id, notes")
        .in("status", ["submitted", "under_review"]),
    ]);

    const pendingCount =
      (verificationRequests && verificationRequests.length > 0)
        ? verificationRequests.length
        : (unverifiedProfiles ? unverifiedProfiles.length : 0);

    const recentQueue = (unverifiedProfiles || []).map((p: any) => ({
      id: p.id,
      profileId: p.id,
      name: p.display_name || "Tanpa Nama",
      ign: p.ign || "-",
      esportId: p.esport_id || "-",
      type: p.entity_type || "player",
      game: p.games?.name || "Esport",
      region: p.regions?.name || "Sumatera Barat",
      status: p.verification_status || "unverified",
      submittedDate: p.created_at,
      avatarUrl: p.avatar_url,
    }));

    return {
      success: true,
      data: {
        pendingVerifications: pendingCount,
        verifiedProfiles: verifiedProfiles || 0,
        totalArticles: totalArticles || 0,
        totalReports: totalReports || 0,
        totalAccounts: totalAccounts || 0,
        totalProfiles: totalProfiles || 0,
        recentQueue,
      },
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan internal";
    return {
      success: false,
      data: {
        pendingVerifications: 0,
        verifiedProfiles: 0,
        totalArticles: 0,
        totalReports: 0,
        totalAccounts: 0,
        totalProfiles: 0,
        recentQueue: [],
      },
      error: errorMsg,
    };
  }
}
