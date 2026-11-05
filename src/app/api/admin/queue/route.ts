import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const scope = searchParams.get("scope"); // "province" | "region"
    const regionId = searchParams.get("region_id");
    const id = searchParams.get("id");

    const admin = createAdminClient();
    let query = admin
      .from("verification_requests")
      .select("id, profile_id, status, region_id, submitted_at, notes, profiles(display_name, ign, entity_type, esport_id, rarity_tier, games(name)), regions(name, code)")
      .order("submitted_at", { ascending: false });

    if (id) {
      query = query.eq("id", id);
    } else if (scope === "province") {
      query = query.in("status", ["regional_checked", "in_review_provincial"]);
    } else if (regionId) {
      query = query.eq("region_id", regionId);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message, items: [] }, { status: 500 });
    }

    const items = (data || []).map((q: any) => ({
      id: q.id,
      profileId: q.profile_id,
      name: q.profiles?.display_name || "Tanpa Nama",
      ign: q.profiles?.ign || "-",
      esportId: q.profiles?.esport_id || "-",
      type: q.profiles?.entity_type || "player",
      game: q.profiles?.games?.name || "Esport",
      region: q.regions?.name || "Sumatera Barat",
      regionCode: q.regions?.code || "PDG",
      status: q.status,
      submittedDate: new Date(q.submitted_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      waitingDays: Math.max(0, Math.floor((Date.now() - new Date(q.submitted_at).getTime()) / (1000 * 60 * 60 * 24))),
      slaStatus: "normal",
      reviewer: "-",
    }));

    if (id) {
      return NextResponse.json({ item: items[0] || null });
    }

    return NextResponse.json({ items });
  } catch (err: any) {
    console.error("API /api/admin/queue error:", err);
    return NextResponse.json({ error: err.message, items: [] }, { status: 500 });
  }
}
