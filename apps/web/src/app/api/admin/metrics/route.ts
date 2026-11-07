import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { verifyAdminAuth } from "@/lib/auth/api-guard";

export async function GET(request: NextRequest) {
  const { auth, errorResponse } = await verifyAdminAuth(["platform_admin"]);
  if (errorResponse) return errorResponse;

  try {
    const admin = createAdminClient();

    const [
      { count: totalUsers },
      { count: totalCards },
      { count: playerCount },
      { count: coachCount },
      { count: teamCount },
      { count: totalArticles },
      { count: draftArticles },
      { count: totalReports },
      { count: goldActive },
      { count: pendingVerifications },
    ] = await Promise.all([
      admin.from("accounts").select("*", { count: "exact", head: true }),
      admin.from("profiles").select("*", { count: "exact", head: true }),
      admin.from("profiles").select("*", { count: "exact", head: true }).eq("entity_type", "player"),
      admin.from("profiles").select("*", { count: "exact", head: true }).eq("entity_type", "coach"),
      admin.from("profiles").select("*", { count: "exact", head: true }).eq("entity_type", "team"),
      admin.from("articles").select("*", { count: "exact", head: true }),
      admin.from("articles").select("*", { count: "exact", head: true }).eq("status", "draft"),
      admin.from("reports").select("*", { count: "exact", head: true }).eq("status", "pending"),
      admin.from("profiles").select("*", { count: "exact", head: true }).eq("verification_status", "verified"),
      admin.from("verification_requests").select("*", { count: "exact", head: true }).in("status", ["submitted", "under_review"]),
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
        pendingVerification: pendingVerifications || 0,
        verifiedProfiles: goldActive || 0,
      },
      verification: {
        pending: pendingVerifications || 0,
        verified: goldActive || 0,
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
        pendingVerification: 0,
        verifiedProfiles: 0,
      },
      verification: { pending: 0, verified: 0 },
    });
  }
}
