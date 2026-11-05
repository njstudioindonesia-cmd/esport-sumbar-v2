import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { verifyAdminAuth } from "@/lib/auth/api-guard";


export async function GET(request: NextRequest) {
  // Guard otentikasi & peran: operator platform, pengprov, dan admin pengcab daerah
  const { auth, errorResponse } = await verifyAdminAuth(["platform_operator", "prov_admin", "region_admin"]);
  if (errorResponse) return errorResponse;

  try {
    const admin = createAdminClient();

    // Query counts in parallel
    const [
      { count: totalUsers },
      { count: totalCards },
      { count: playerCount },
      { count: coachCount },
      { count: teamCount },
      { count: totalArticles },
      { count: draftArticles },
      { count: totalReports },
      { count: pendingGold },
      { count: goldActive },
      { count: regionalPending },
      { count: regionalInReview },
      { count: regionalRevision },
    ] = await Promise.all([
      admin.from("accounts").select("*", { count: "exact", head: true }),
      admin.from("profiles").select("*", { count: "exact", head: true }),
      admin.from("profiles").select("*", { count: "exact", head: true }).eq("entity_type", "player"),
      admin.from("profiles").select("*", { count: "exact", head: true }).eq("entity_type", "coach"),
      admin.from("profiles").select("*", { count: "exact", head: true }).eq("entity_type", "team"),
      admin.from("articles").select("*", { count: "exact", head: true }),
      admin.from("articles").select("*", { count: "exact", head: true }).eq("status", "draft"),
      admin.from("reports").select("*", { count: "exact", head: true }).eq("status", "pending"),
      admin.from("verification_requests").select("*", { count: "exact", head: true }).eq("status", "regional_checked"),
      admin.from("profiles").select("*", { count: "exact", head: true }).eq("verification_status", "verified"),
      admin.from("verification_requests").select("*", { count: "exact", head: true }).eq("status", "submitted"),
      admin.from("verification_requests").select("*", { count: "exact", head: true }).eq("status", "in_review_regional"),
      admin.from("verification_requests").select("*", { count: "exact", head: true }).eq("status", "revision_requested"),
    ]);

    return NextResponse.json({
      platform: {
        totalUsers: totalUsers || 0,
        totalCards: totalCards || 0,
        playerCount: playerCount || 0,
        coachCount: coachCount || 0,
        teamCount: teamCount || 0,
        totalArticles: totalArticles || 0,
        draftArticles: draftArticles || 0,
        totalReports: totalReports || 0,
      },
      province: {
        pendingGold: pendingGold || 0,
        goldActive: goldActive || 0,
        fallbackPending: 0,
      },
      region: {
        pending: regionalPending || 0,
        inReview: regionalInReview || 0,
        revision: regionalRevision || 0,
        approvedThisMonth: 0,
      },
    });
  } catch (error: any) {
    console.error("API /api/admin/metrics error:", error);
    return NextResponse.json({
      platform: {
        totalUsers: 0,
        totalCards: 0,
        playerCount: 0,
        coachCount: 0,
        teamCount: 0,
        totalArticles: 0,
        draftArticles: 0,
        totalReports: 0,
      },
      province: { pendingGold: 0, goldActive: 0, fallbackPending: 0 },
      region: { pending: 0, inReview: 0, revision: 0, approvedThisMonth: 0 },
    });
  }
}
