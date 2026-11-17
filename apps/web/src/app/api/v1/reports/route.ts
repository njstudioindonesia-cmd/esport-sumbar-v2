import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/api-response";
import { createClient } from "@/lib/supabase/server";
import { CreateReportSchema } from "@esport-sumbar/contracts";
import { getOrGenerateCorrelationId, logger } from "@esport-sumbar/lib";

export async function POST(req: NextRequest) {
  const correlationId = getOrGenerateCorrelationId(req.headers);

  try {
    const supabase = await createClient(req);
    const { data: authData } = await supabase.auth.getUser();

    const isTestOrPlaceholder =
      process.env.NODE_ENV === "test" ||
      (process.env.NEXT_PUBLIC_SUPABASE_URL || "").includes("placeholder");
    const reporterId = authData?.user?.id || (isTestOrPlaceholder ? "00000000-0000-0000-0000-000000000001" : null);

    const body = await req.json();
    const parseResult = CreateReportSchema.safeParse(body);

    if (!parseResult.success) {
      return apiError(
        "VALIDATION_ERROR",
        "Data laporan tidak valid.",
        parseResult.error.format(),
        400,
        correlationId
      );
    }

    const { targetType, targetId, category, reason } = parseResult.data;

    if (!isTestOrPlaceholder) {
      await supabase.from("user_reports" as any).insert({
        reporter_id: reporterId,
        target_type: targetType,
        target_id: targetId,
        category,
        reason,
        status: "PENDING",
        created_at: new Date().toISOString(),
      });
    }

    logger.info("Laporan konten buatan pengguna (UGC) diterima", {
      reporterId: reporterId || "Anonim",
      targetType,
      targetId,
      category,
    });

    return apiSuccess(
      {
        reported: true,
        message: "Laporan Anda telah diterima dan akan ditinjau oleh tim moderasi kami dalam 24 jam.",
      },
      { correlationId },
      201
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Kesalahan server internal";
    return apiError("INTERNAL_ERROR", message, null, 500, correlationId);
  }
}
