import { NextRequest, NextResponse } from "next/server";
import { getArticleBySlug } from "@/lib/services/content";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const article = await getArticleBySlug(slug);

    if (!article) {
      return NextResponse.json(
        { error: `Artikel dengan slug "${slug}" tidak ditemukan.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      article,
    });
  } catch (error: any) {
    console.error("API /api/content/[slug] error:", error);
    return NextResponse.json(
      { error: "Gagal memuat detail artikel" },
      { status: 500 }
    );
  }
}
