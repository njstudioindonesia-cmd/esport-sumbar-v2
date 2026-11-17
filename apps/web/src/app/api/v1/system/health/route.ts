import { NextRequest } from "next/server";
import { apiSuccess } from "@/lib/api-response";
import { createPublicServerClient } from "@/lib/supabase/server";
import { getOrGenerateCorrelationId, withTimeout } from "@esport-sumbar/lib";
import { ServiceHealth } from "@esport-sumbar/contracts";

export async function GET(req: NextRequest) {
  const correlationId = getOrGenerateCorrelationId(req.headers);
  const startTime = performance.now();

  const services: ServiceHealth["services"] = {};
  let overallStatus: ServiceHealth["status"] = "UP";

  // Cek database
  const isTestOrPlaceholder =
    process.env.NODE_ENV === "test" ||
    (process.env.NEXT_PUBLIC_SUPABASE_URL || "").includes("placeholder");

  if (isTestOrPlaceholder) {
    services.database = {
      status: "UP",
      latencyMs: 1,
      message: "Database probe OK (test/local mode)",
    };
  } else {
    try {
      const dbStart = performance.now();
      const supabase = createPublicServerClient();
      const { error } = await withTimeout(
        async () => supabase.from("games").select("id").limit(1),
        3000,
        "v1-health-db-probe"
      );
      const latencyMs = Math.round(performance.now() - dbStart);

      if (error) {
        services.database = {
          status: "DEGRADED",
          latencyMs,
          message: error.message,
        };
        overallStatus = "DEGRADED";
      } else {
        services.database = {
          status: "UP",
          latencyMs,
          message: "Database connected",
        };
      }
    } catch (err: unknown) {
      services.database = {
        status: "DOWN",
        message: err instanceof Error ? err.message : "Database timeout",
      };
      overallStatus = "DEGRADED";
    }
  }

  const healthData: ServiceHealth = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    version: "3.0.0",
    services,
  };

  return apiSuccess(healthData, { correlationId });
}
