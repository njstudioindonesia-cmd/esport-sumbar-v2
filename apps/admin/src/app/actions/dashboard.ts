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
      accountsRes,
      profilesRes,
      verifiedRes,
      articlesRes,
      reportsRes,
      unverifiedProfilesRes,
      verificationRequestsRes,
    ] = await Promise.all([
      admin
        .from("accounts")
        .select("*", { count: "exact", head: true })
        .neq("is_active", false)
        .then((res) => res, () => ({ count: 0, data: null, error: null })),
      admin
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .then((res) => res, () => ({ count: 0, data: null, error: null })),
      admin
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("verification_status", "verified")
        .then((res) => res, () => ({ count: 0, data: null, error: null })),
      admin
        .from("articles")
        .select("*", { count: "exact", head: true })
        .eq("status", "published")
        .then((res) => res, () => ({ count: 0, data: null, error: null })),
      admin
        .from("reports")
        .select("*", { count: "exact", head: true })
        .then((res) => res, () => ({ count: 0, data: null, error: null })),
      admin
        .from("profiles")
        .select("id, esport_id, display_name, ign, entity_type, verification_status, avatar_url, created_at, regions(name, code), games(name)")
        .neq("verification_status", "verified")
        .order("created_at", { ascending: false })
        .limit(10)
        .then((res) => res, () => ({ data: [], count: null, error: null })),
      admin
        .from("verification_requests")
        .select("id, status, submitted_at, profile_id, notes")
        .in("status", ["submitted", "under_review"])
        .then((res) => res, () => ({ data: [], count: null, error: null })),
    ]);

    const totalAccounts = accountsRes.count ?? 0;
    const totalProfiles = profilesRes.count ?? 0;
    const verifiedProfiles = verifiedRes.count ?? 0;
    const totalArticles = articlesRes.count ?? 0;
    const totalReports = reportsRes.count ?? 0;
    const unverifiedProfiles = unverifiedProfilesRes.data ?? [];
    const verificationRequests = verificationRequestsRes.data ?? [];

    const pendingCount =
      verificationRequests.length > 0
        ? verificationRequests.length
        : unverifiedProfiles.length;

    const recentQueue = (unverifiedProfiles || []).map((p: any) => ({
      id: p.id || Math.random().toString(),
      profileId: p.id || "",
      name: p.display_name || "Tanpa Nama",
      ign: p.ign || "-",
      esportId: p.esport_id || "-",
      type: p.entity_type || "player",
      game: (p.games && typeof p.games === "object" ? p.games.name : null) || "Esport",
      region: (p.regions && typeof p.regions === "object" ? p.regions.name : null) || "Sumatera Barat",
      status: p.verification_status || "unverified",
      submittedDate: p.created_at || new Date().toISOString(),
      avatarUrl: p.avatar_url || undefined,
    }));

    return {
      success: true,
      data: {
        pendingVerifications: pendingCount,
        verifiedProfiles,
        totalArticles,
        totalReports,
        totalAccounts,
        totalProfiles,
        recentQueue,
      },
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan internal";
    console.error("Dashboard metrics error:", errorMsg);
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
