import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createProfile, getProfileByAccountId } from "@/lib/services/core/profile/service";
import { getPublicProfilesList } from "@/lib/services/public-profiles";
import { apiSuccess, apiError } from "@/lib/api-response";
import { getOrGenerateCorrelationId } from "@esport-sumbar/lib";
import { CreateProfileInputSchema } from "@esport-sumbar/contracts";
import type { EntityType, RarityTier, VerificationStatus } from "@/lib/supabase/database.types";

export async function POST(request: NextRequest) {
  const correlationId = getOrGenerateCorrelationId(request.headers);
  try {
    const supabase = await createClient(request);
    const { data: authData, error: authErr } = await supabase.auth.getUser();

    let accountId = authData?.user?.id;
    if (!accountId) {
      // Izinkan testing / mock account fallback jika di environment test
      if (process.env.NODE_ENV === "test") {
        accountId = request.headers.get("x-test-account-id") || "00000000-0000-0000-0000-000000000001";
      } else {
        return apiError("UNAUTHORIZED", "Sesi autentikasi diperlukan untuk membuat profil", null, 401, correlationId);
      }
    }

    const body = await request.json().catch(() => ({}));
    const parseResult = CreateProfileInputSchema.safeParse(body);

    if (!parseResult.success) {
      return apiError(
        "VALIDATION_ERROR",
        "Data formulir profil tidak valid",
        parseResult.error.format(),
        400,
        correlationId
      );
    }

    const input = parseResult.data;

    // 1. Cek apakah akun sudah memiliki profil bidang (Enforce Satu Akun Satu Bidang)
    const existing = await getProfileByAccountId(accountId);
    if (existing) {
      return apiError(
        "PROFILE_ALREADY_EXISTS",
        "Satu akun hanya untuk satu bidang. Pilihan ini tidak dapat diubah setelah dikonfirmasi.",
        { existingProfileId: existing.id, entityType: existing.entityType },
        409,
        correlationId
      );
    }

    // 2. Buat profil baru melalui domain service
    const created = await createProfile({
      accountId,
      entityType: input.entityType,
      displayName: input.displayName,
      ign: input.ign,
      regionId: input.regionId,
      mainGameId: input.mainGameId,
      bio: input.bio,
      attributes: input.attributes,
    });

    return apiSuccess(created, { correlationId }, 201);
  } catch (err: any) {
    if (err?.message?.includes("Pelanggaran integritas: Akun ini telah memiliki profil")) {
      return apiError(
        "PROFILE_ALREADY_EXISTS",
        "Satu akun hanya untuk satu bidang. Pilihan ini tidak dapat diubah setelah dikonfirmasi.",
        null,
        409,
        correlationId
      );
    }
    return apiError("PROFILE_CREATION_FAILED", "Gagal membuat profil bidang", err?.message, 500, correlationId);
  }
}

export async function GET(request: NextRequest) {
  const correlationId = getOrGenerateCorrelationId(request.headers);
  try {
    const { searchParams } = new URL(request.url);
    const entityType = searchParams.get("entity_type") as EntityType | null;
    const regionCode = searchParams.get("region_code") || undefined;
    const gameId = searchParams.get("game_id") || undefined;
    const search = searchParams.get("search") || undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const result = await getPublicProfilesList({
      entityType: entityType || undefined,
      regionCode,
      gameId,
      search,
      page,
      limit,
    });

    return apiSuccess(result.profiles, {
      correlationId,
      page: result.page,
      pageSize: result.limit,
      hasMore: result.page < result.totalPages,
    });
  } catch (err: any) {
    return apiError("PROFILES_FETCH_FAILED", "Gagal memuat profil publik", err?.message, 500, correlationId);
  }
}
