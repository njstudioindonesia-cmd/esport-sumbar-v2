import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { verifyAdminAuth } from "@/lib/auth/api-guard";

export async function GET(request: NextRequest) {
  const { auth, errorResponse } = await verifyAdminAuth(["platform_admin"]);
  if (errorResponse) return errorResponse;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const regionId = searchParams.get("region_id");

    const admin = createAdminClient();
    let query = admin
      .from("verification_requests")
      .select("id, profile_id, status, region_id, submitted_at, notes, evidence_files, profiles(id, account_id, display_name, ign, entity_type, esport_id, rarity_tier, avatar_url, bio, games(name)), regions(name, code)")
      .order("submitted_at", { ascending: true }); // Oldest first (SLA priority)

    if (id) {
      query = query.eq("id", id);
    } else if (regionId) {
      query = query.eq("region_id", regionId);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message, items: [] }, { status: 500 });
    }

    const items = (data || []).map((q: any) => {
      const documents = Array.isArray(q.evidence_files) && q.evidence_files.length > 0
        ? q.evidence_files.map((f: any, idx: number) => ({
            type: f.type || "dokumen_bukti",
            title: f.title || f.name || `Dokumen Bukti #${idx + 1}`,
            url: f.url || "/images/news-placeholder.jpg",
            submittedAt: new Date(q.submitted_at).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
            fileSize: f.size || "1.2 MB",
          }))
        : [
            {
              type: "identitas_resmi",
              title: "Bukti In-Game / Berkas Pengajuan",
              url: "/images/news-placeholder.jpg",
              submittedAt: new Date(q.submitted_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }),
              fileSize: "1.2 MB",
            },
          ];

      return {
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
        submittedDate: q.submitted_at,
        waitingDays: Math.max(0, Math.floor((Date.now() - new Date(q.submitted_at).getTime()) / (1000 * 60 * 60 * 24))),
        notes: q.notes || "",
        documents,
        profileData: {
          id: q.profiles?.id || q.profile_id,
          accountId: q.profiles?.account_id,
          displayName: q.profiles?.display_name || "Tanpa Nama",
          ign: q.profiles?.ign || undefined,
          entityType: q.profiles?.entity_type || "player",
          esportId: q.profiles?.esport_id || "-",
          rarityTier: q.profiles?.rarity_tier || "rookie",
          avatarUrl: q.profiles?.avatar_url || undefined,
          bio: q.profiles?.bio || undefined,
          gameName: q.profiles?.games?.name || "Esport",
          regionName: q.regions?.name || "Sumatera Barat",
        },
      };
    });

    return NextResponse.json({ items });
  } catch (err: any) {
    console.error("API /api/admin/queue error:", err);
    return NextResponse.json({ error: err.message, items: [] }, { status: 500 });
  }
}
