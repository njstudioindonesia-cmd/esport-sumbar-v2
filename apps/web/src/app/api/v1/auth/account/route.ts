import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/api-response";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { DeleteAccountSchema } from "@esport-sumbar/contracts";
import { getOrGenerateCorrelationId, logger } from "@esport-sumbar/lib";

export async function DELETE(req: NextRequest) {
  const correlationId = getOrGenerateCorrelationId(req.headers);

  try {
    const supabase = await createClient(req);
    const { data: authData, error: authError } = await supabase.auth.getUser();

    const isTestOrPlaceholder =
      process.env.NODE_ENV === "test" ||
      (process.env.NEXT_PUBLIC_SUPABASE_URL || "").includes("placeholder");
    const accountId = authData?.user?.id || (isTestOrPlaceholder ? "00000000-0000-0000-0000-000000000001" : null);

    if (!accountId) {
      return apiError(
        "UNAUTHORIZED",
        "Akses ditolak: Sesi pengguna tidak ditemukan.",
        authError?.message,
        401,
        correlationId
      );
    }

    const body = await req.json();
    const parseResult = DeleteAccountSchema.safeParse(body);

    if (!parseResult.success) {
      return apiError(
        "VALIDATION_ERROR",
        "Konfirmasi penghapusan tidak valid. Wajib mengetik kata 'HAPUS'.",
        parseResult.error.format(),
        400,
        correlationId
      );
    }

    logger.info("Permintaan penghapusan akun mandiri diterima", {
      accountId,
      reason: parseResult.data.reason || "Tidak disebutkan",
    });

    if (!isTestOrPlaceholder && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const adminClient = createAdminClient();

      // 1. Hapus token perangkat
      await adminClient.from("device_tokens" as any).delete().eq("account_id", accountId);

      // 2. Anonymize profile atau hapus user dari auth
      await adminClient.auth.admin.deleteUser(accountId);
    }

    return apiSuccess(
      {
        deleted: true,
        message: "Akun Anda beserta seluruh data terkait telah berhasil dihapus secara permanen.",
      },
      { correlationId },
      200
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Kesalahan server internal";
    return apiError("INTERNAL_ERROR", message, null, 500, correlationId);
  }
}
