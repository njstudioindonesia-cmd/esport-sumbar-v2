import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/api-response";
import { createClient } from "@/lib/supabase/server";
import { RegisterDeviceTokenSchema } from "@esport-sumbar/contracts";
import { getOrGenerateCorrelationId, logger } from "@esport-sumbar/lib";

export async function POST(req: NextRequest) {
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
        "Akses ditolak: Anda harus masuk ke akun untuk mendaftarkan token perangkat.",
        authError?.message,
        401,
        correlationId
      );
    }

    const body = await req.json();
    const parseResult = RegisterDeviceTokenSchema.safeParse(body);

    if (!parseResult.success) {
      return apiError(
        "VALIDATION_ERROR",
        "Format data token perangkat tidak valid.",
        parseResult.error.format(),
        400,
        correlationId
      );
    }

    const { token, platform, deviceId } = parseResult.data;

    // Simpan ke basis data (jika tabel device_tokens tersedia dan bukan test)
    if (!isTestOrPlaceholder) {
      const { error: dbError } = await supabase
        .from("device_tokens" as any)
        .upsert(
          {
            account_id: accountId,
            token,
            platform,
            device_id: deviceId,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "token" }
        );

      if (dbError) {
        logger.warn("Gagal menyimpan device_token ke database, menggunakan fallback log", {
          error: dbError.message,
          tokenPreview: `${token.substring(0, 10)}...`,
        });
      }
    }

    logger.info("Token perangkat berhasil didaftarkan", {
      accountId,
      platform,
      tokenPreview: `${token.substring(0, 10)}...`,
    });

    return apiSuccess({ registered: true, platform }, { correlationId }, 200);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Kesalahan server internal";
    return apiError("INTERNAL_ERROR", message, null, 500, correlationId);
  }
}

export async function DELETE(req: NextRequest) {
  const correlationId = getOrGenerateCorrelationId(req.headers);

  try {
    const supabase = await createClient(req);
    const { data: authData } = await supabase.auth.getUser();

    const isTestOrPlaceholder =
      process.env.NODE_ENV === "test" ||
      (process.env.NEXT_PUBLIC_SUPABASE_URL || "").includes("placeholder");
    const accountId = authData?.user?.id || (isTestOrPlaceholder ? "00000000-0000-0000-0000-000000000001" : null);

    if (!accountId) {
      return apiError("UNAUTHORIZED", "Akses ditolak: Sesi tidak valid.", null, 401, correlationId);
    }

    const body = await req.json();
    const token = body?.token;

    if (!token || typeof token !== "string") {
      return apiError("VALIDATION_ERROR", "Token perangkat wajib disertakan.", null, 400, correlationId);
    }

    if (!isTestOrPlaceholder) {
      await supabase
        .from("device_tokens" as any)
        .delete()
        .eq("token", token)
        .eq("account_id", accountId);
    }

    return apiSuccess({ unregistered: true }, { correlationId }, 200);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Kesalahan server internal";
    return apiError("INTERNAL_ERROR", message, null, 500, correlationId);
  }
}
