import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { verifyAdminAuth } from "@/lib/auth/api-guard";

export async function GET() {
  const { auth, errorResponse } = await verifyAdminAuth(["platform_admin"]);
  if (errorResponse) return errorResponse;

  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("reports")
      .select("id, reporter_account_id, target_profile_id, category, reason, evidence_urls, status, created_at, profiles(display_name, ign, esport_id, entity_type)")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message, reports: [] }, { status: 500 });
    }

    const reports = (data || []).map((r: any) => ({
      id: r.id,
      reportedProfileId: r.target_profile_id,
      reportedProfileName: r.profiles?.display_name || "Profil Dilaporkan",
      reportedEsportId: r.profiles?.esport_id || "-",
      reportedType: (r.profiles?.entity_type ? r.profiles.entity_type.charAt(0).toUpperCase() + r.profiles.entity_type.slice(1) : "Player") as any,
      regionCode: "SB",
      regionName: "Sumatera Barat",
      reporterName: r.reporter_account_id ? "Pengguna Terdaftar" : "Masyarakat Umum",
      reasonCategory: (r.category || "fake_identity") as any,
      description: r.reason || "-",
      evidenceUrl: Array.isArray(r.evidence_urls) && r.evidence_urls.length > 0 ? r.evidence_urls[0] : undefined,
      status: r.status === "resolved" ? "reviewed_clean" : r.status || "pending",
      reportedAt: new Date(r.created_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    }));

    return NextResponse.json({ reports });
  } catch (err: any) {
    console.error("API /api/admin/reports error:", err);
    return NextResponse.json({ error: err.message, reports: [] }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const { auth, errorResponse } = await verifyAdminAuth(["platform_admin"]);
  if (errorResponse) return errorResponse;

  try {
    const body = await request.json();
    const { reportId, status, resolutionNotes } = body;

    if (!reportId || !status) {
      return NextResponse.json({ error: "Missing reportId or status" }, { status: 400 });
    }

    const admin = createAdminClient();
    const { error } = await admin
      .from("reports")
      .update({
        status,
        resolution_notes: resolutionNotes || null,
        resolved_by: auth?.userId || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", reportId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("API PATCH /api/admin/reports error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
