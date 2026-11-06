import { NextRequest, NextResponse } from "next/server";
import { searchDirectory } from "@/lib/services/directory";
import { CORRELATION_HEADER, getOrGenerateCorrelationId } from "@esport-sumbar/lib";
import { EntityType, RarityTier, VerificationStatus } from "@/lib/supabase/database.types";

export async function GET(req: NextRequest) {
  const correlationId = getOrGenerateCorrelationId(req.headers);

  try {
    const { searchParams } = new URL(req.url);

    const entityType = searchParams.get("entityType") as EntityType | null;
    const regionCode = searchParams.get("regionCode") || undefined;
    const gameId = searchParams.get("gameId") || undefined;
    const verificationStatus = searchParams.get("verificationStatus") as VerificationStatus | null;
    const rarityTier = searchParams.get("rarityTier") as RarityTier | null;
    const search = searchParams.get("search") || undefined;
    const sortBy = (searchParams.get("sortBy") as any) || "newest";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const result = await searchDirectory({
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

    return NextResponse.json(result, {
      status: 200,
      headers: {
        [CORRELATION_HEADER]: correlationId,
        "x-cache-hit": result.fromCache ? "HIT" : "MISS",
      },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan internal";
    return NextResponse.json(
      { error: errorMsg },
      { status: 500, headers: { [CORRELATION_HEADER]: correlationId } }
    );
  }
}
