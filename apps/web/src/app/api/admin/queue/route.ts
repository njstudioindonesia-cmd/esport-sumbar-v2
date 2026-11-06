import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { verifyAdminAuth } from "@/lib/auth/api-guard";


export async function GET(request: NextRequest) {
  // Guard otentikasi & peran: operator platform, pengprov, dan admin pengcab daerah
  const { auth, errorResponse } = await verifyAdminAuth(["platform_operator", "prov_admin", "region_admin"]);
  if (errorResponse) return errorResponse;

  try {
    const { searchParams } = new URL(request.url);
    const scope = searchParams.get("scope"); // "province" | "region"
    const regionId = searchParams.get("region_id");
    const id = searchParams.get("id");

    const admin = createAdminClient();
    let query = admin
      .from("verification_requests")
      .select("id, profile_id, status, region_id, submitted_at, notes, evidence_files, profiles(id, display_name, ign, entity_type, esport_id, rarity_tier, avatar_url, bio, games(name)), regions(name, code)")
      .order("submitted_at", { ascending: false });

    if (id) {
      query = query.eq("id", id);
    } else if (scope === "province") {
      query = query.in("status", ["regional_checked", "in_review_provincial"]);
    } else if (regionId) {
      query = query.eq("region_id", regionId);
    } else if (auth?.role === "region_admin" && auth.assignedRegionId) {
      // Pembatasan otomatis yurisdiksi Pengcab daerah
      query = query.eq("region_id", auth.assignedRegionId);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message, items: [] }, { status: 500 });
    }

    const items = (data || []).map((q: any) => {
      // Konversi bukti berkas atau sediakan fallback terstruktur
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
              title: "Bukti Identitas / Berkas Pendukung Pengajuan",
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
        submittedDate: new Date(q.submitted_at).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        waitingDays: Math.max(0, Math.floor((Date.now() - new Date(q.submitted_at).getTime()) / (1000 * 60 * 60 * 24))),
        slaStatus: "normal",
        reviewer: "-",
        notes: q.notes || "",
        documents,
        // Profil detail untuk 3D Card
        profileData: {
          id: q.profiles?.id || q.profile_id,
          displayName: q.profiles?.display_name || "Tanpa Nama",
          ign: q.profiles?.ign || undefined,
          entityType: q.profiles?.entity_type || "player",
          esportId: q.profiles?.esport_id || "-",
          rarityTier: q.profiles?.rarity_tier || "rookie",
          avatarUrl: q.profiles?.avatar_url || undefined,
          bio: q.profiles?.bio || undefined,
          gameName: q.profiles?.games?.name || "Esport",
          regionName: q.regions?.name || "Sumatera Barat",
          regionCode: q.regions?.code || "SB",
        },
      };
    });

    if (id) {
      return NextResponse.json({ item: items[0] || null });
    }

    return NextResponse.json({ items });
  } catch (err: any) {
    console.error("API /api/admin/queue error:", err);
    return NextResponse.json({ error: err.message, items: [] }, { status: 500 });
  }
}
