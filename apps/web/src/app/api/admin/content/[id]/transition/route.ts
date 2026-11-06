import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/auth/api-guard";
import { transitionArticleStatus } from "@/lib/services/content";
import { ArticleStatusSchema } from "@esport-sumbar/contracts";
import { z } from "zod";

const TransitionBodySchema = z.object({
  targetStatus: ArticleStatusSchema,
  reason: z.string().optional(),
});

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { auth, errorResponse } = await verifyAdminAuth(["platform_admin"]);
  if (errorResponse || !auth) {
    return errorResponse || NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const rawBody = await request.json();
    const parseResult = TransitionBodySchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Payload transisi editorial tidak valid",
          details: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { targetStatus, reason } = parseResult.data;

    const updated = await transitionArticleStatus({
      articleId: id,
      targetStatus,
      actorId: auth.userId,
      actorRole: "platform_admin",
      reason,
    });

    return NextResponse.json({
      success: true,
      article: updated,
      message: `Status artikel berhasil diperbarui menjadi "${targetStatus}".`,
    });
  } catch (err: any) {
    console.error("API /api/admin/content/[id]/transition error:", err);
    return NextResponse.json(
      { error: err.message || "Gagal memperbarui status artikel." },
      { status: 422 }
    );
  }
}
