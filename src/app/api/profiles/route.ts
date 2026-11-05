import { NextRequest, NextResponse } from "next/server";
import { getPublicProfilesList } from "@/lib/services/public-profiles";
import type { EntityType, RarityTier, VerificationStatus } from "@/lib/supabase/database.types";


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const entityType = searchParams.get("entity_type") as EntityType | null;
    const regionCode = searchParams.get("region_code") || undefined;
    const gameId = searchParams.get("game_id") || undefined;
    const verificationStatus = searchParams.get("verification_status") as VerificationStatus | null;
    const rarityTier = searchParams.get("rarity_tier") as RarityTier | null;
    const search = searchParams.get("search") || undefined;
    const sortBy = (searchParams.get("sort_by") as "newest" | "completeness" | "name") || "newest";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "24", 10);

    const result = await getPublicProfilesList({
      entityType: entityType || undefined,
      regionCode,
      gameId,
      verificationStatus: verificationStatus || undefined,
      rarityTier: rarityTier || undefined,
      search,
      sortBy,
      page,
      limit,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("API /api/profiles error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil daftar profil publik" },
      { status: 500 }
    );
  }
}
