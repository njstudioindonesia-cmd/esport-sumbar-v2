import { NextRequest } from "next/server";
import { getRegionsList } from "@/lib/services/regions";
import { REGIONS_DETAIL } from "@/data/regions";
import { apiSuccess, apiError } from "@/lib/api-response";
import { getOrGenerateCorrelationId } from "@esport-sumbar/lib";

export async function GET(request: NextRequest) {
  const correlationId = getOrGenerateCorrelationId(request.headers);
  try {
    let regions = await getRegionsList();
    if (!regions || regions.length === 0) {
      regions = REGIONS_DETAIL.map((r) => ({
        id: r.id,
        name: r.name,
        code: r.code,
        slug: r.slug,
        type: r.type,
        logoUrl: null,
        esiContactName: null,
        esiSecretariat: null,
        description: r.description,
        adminMode: "active" as const,
        isPilot: r.isPilot || false,
      }));
    }
    return apiSuccess(regions, { correlationId });
  } catch (err: any) {
    return apiError("REGIONS_FETCH_FAILED", "Gagal memuat daftar wilayah", err?.message, 500, correlationId);
  }
}
