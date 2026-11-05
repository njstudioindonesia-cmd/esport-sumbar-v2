import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("reports")
      .select("id, reporter_account_id, target_profile_id, category, reason, evidence_urls, status, created_at, profiles(display_name, ign, esport_id)")
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
      regionCode: "PDG",
      regionName: "Sumatera Barat",
      reporterName: r.reporter_account_id ? "Pengguna Terverifikasi" : "Masyarakat Umum",
      reasonCategory: (r.category || "fake_identity") as any,
      description: r.reason || "-",
      evidenceUrl: Array.isArray(r.evidence_urls) && r.evidence_urls.length > 0 ? r.evidence_urls[0] : undefined,
      status: r.status === "forwarded_to_esi" ? "forwarded_to_province" : r.status === "resolved" ? "reviewed_clean" : "pending",
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
  try {
    const body = await request.json();
    const { reportId, status, resolutionNotes } = body;

    if (!reportId || !status) {
      return NextResponse.json({ error: "Missing reportId or status" }, { status: 400 });
    }

    const admin = createAdminClient();
    const dbStatus =
      status === "forwarded_to_province"
        ? "forwarded_to_esi"
        : status === "reviewed_clean"
        ? "resolved"
        : status;

    const { error } = await admin
      .from("reports")
      .update({
        status: dbStatus,
        resolution_notes: resolutionNotes || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", reportId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
