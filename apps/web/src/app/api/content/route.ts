import { NextRequest, NextResponse } from "next/server";
import { searchArticles } from "@/lib/services/content";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    const regionId = searchParams.get("region_id") || undefined;
    const primaryGameId = searchParams.get("game_id") || undefined;
    const statusParam = searchParams.get("status") || "published";
    const tag = searchParams.get("tag") || undefined;
    const q = searchParams.get("q") || undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const result = await searchArticles({
      category: category as any,
      regionId: regionId as any,
      primaryGameId,
      status: statusParam as any,
      tag,
      q,
      page,
      limit,
    });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error("API /api/content error:", error);
    return NextResponse.json(
      { error: "Gagal memuat artikel konten", articles: [], total: 0 },
      { status: 500 }
    );
  }
}
