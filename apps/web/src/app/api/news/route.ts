import { NextRequest, NextResponse } from "next/server";
import { getLatestArticles } from "@/lib/services/news";


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    const regionId = searchParams.get("region_id") || undefined;
    const statusParam = searchParams.get("status");
    const status = (statusParam === "all" || statusParam === "draft" || statusParam === "published" || statusParam === "archived")
      ? statusParam
      : undefined;

    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const articles = await getLatestArticles({
      category: category === "all" ? undefined : category,
      regionId: regionId === "all" ? undefined : regionId,
      status,
      limit,
    });

    return NextResponse.json({ articles });
  } catch (error: any) {
    console.error("API /api/news error:", error);
    return NextResponse.json(
      { error: "Gagal memuat artikel berita", articles: [] },
      { status: 500 }
    );
  }
}
