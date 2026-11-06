import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/auth/api-guard";
import { reviewVerificationDecision } from "@/lib/services/verification";
import { z } from "zod";

const DecideBodySchema = z.object({
  requestId: z.string().uuid("ID permohonan harus berformat UUID."),
  decision: z.enum(["verified", "revision_requested", "rejected", "suspended"]),
  reason: z.string().min(5, "Alasan wajib diisi minimal 5 karakter."),
  notes: z.string().optional(),
  revisionFields: z.array(z.string()).optional(),
  badgeNo: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const { auth, errorResponse } = await verifyAdminAuth(["platform_admin"]);
  if (errorResponse || !auth) {
    return errorResponse || NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const rawBody = await request.json();
    const parseResult = DecideBodySchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Payload keputusan tidak valid",
          details: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { requestId, decision, reason, notes, revisionFields, badgeNo } = parseResult.data;

    const result = await reviewVerificationDecision({
      requestId,
      reviewerId: auth.userId,
      reviewerRole: "platform_admin",
      decision,
      reason,
      notes,
      revisionFields,
      badgeNo,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Gagal memproses keputusan telaah verifikasi." },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: `Keputusan telaah verifikasi berhasil ditetapkan menjadi "${decision}".`,
    });
  } catch (err: any) {
    console.error("API /api/admin/verification/decide error:", err);
    return NextResponse.json(
      { error: err.message || "Terjadi kesalahan internal server." },
      { status: 500 }
    );
  }
}
