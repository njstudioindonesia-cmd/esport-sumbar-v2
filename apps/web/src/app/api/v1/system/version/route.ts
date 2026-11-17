import { NextRequest } from "next/server";
import { apiSuccess } from "@/lib/api-response";
import { getOrGenerateCorrelationId } from "@esport-sumbar/lib";
import { SystemVersion } from "@esport-sumbar/contracts";

export async function GET(req: NextRequest) {
  const correlationId = getOrGenerateCorrelationId(req.headers);

  const systemVersion: SystemVersion = {
    minVersion: "1.0.0",
    latestVersion: "1.0.0",
    forceUpdate: false,
    maintenance: false,
    maintenanceMessage: "Layanan ESPORT SUMBAR beroperasi normal.",
    storeUrl: {
      android: "https://play.google.com/store/apps/details?id=com.esportsumbar.app",
      ios: "https://apps.apple.com/app/id6400000000",
    },
  };

  return apiSuccess(systemVersion, { correlationId });
}
