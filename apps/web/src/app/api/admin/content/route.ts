import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/auth/api-guard";
import { createArticle, getContentStats } from "@/lib/services/content";
import { CreateArticleSchema } from "@esport-sumbar/contracts";

export async function GET(request: NextRequest) {
  const { errorResponse } = await verifyAdminAuth(["platform_admin"]);
  if (errorResponse) return errorResponse;

  try {
    const stats = await getContentStats();
    return NextResponse.json({ success: true, stats });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { auth, errorResponse } = await verifyAdminAuth(["platform_admin"]);
  if (errorResponse || !auth) {
    return errorResponse || NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const rawBody = await request.json();
    const parseResult = CreateArticleSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Payload artikel tidak valid",
          details: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const created = await createArticle(
      parseResult.data,
      auth.userId,
      "platform_admin"
    );

    return NextResponse.json({
      success: true,
      article: created,
      message: "Artikel berhasil dibuat.",
    });
  } catch (err: any) {
    console.error("API /api/admin/content error:", err);
    return NextResponse.json(
      { error: err.message || "Gagal membuat artikel." },
      { status: 500 }
    );
  }
}
