import { NextRequest } from "next/server";
import { getGamesCatalog } from "@/lib/services/games";
import { apiSuccess, apiError } from "@/lib/api-response";
import { getOrGenerateCorrelationId } from "@esport-sumbar/lib";

export async function GET(request: NextRequest) {
  const correlationId = getOrGenerateCorrelationId(request.headers);
  try {
    const catalog = await getGamesCatalog();
    return apiSuccess(catalog, { correlationId });
  } catch (err: any) {
    return apiError("CATALOG_FETCH_FAILED", "Gagal memuat katalog game", err?.message, 500, correlationId);
  }
}
