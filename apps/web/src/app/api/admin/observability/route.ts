import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/auth/api-guard";
import { metricsRegistry } from "@/lib/observability/metrics";
import {
  getAllCircuitBreakers,
  getCircuitBreaker,
  resetAllCircuitBreakers,
} from "@esport-sumbar/lib";
import { applyCorsHeaders, handleCorsPreflight } from "@/lib/security/cors";
import { enforceRateLimit } from "@/lib/security/rate-limiter";

export async function OPTIONS(request: NextRequest) {
  return handleCorsPreflight(request);
}

export async function GET(request: NextRequest) {
  const rateLimitResponse = enforceRateLimit(request, "admin");
  if (rateLimitResponse) return rateLimitResponse;

  const { auth, errorResponse } = await verifyAdminAuth(["platform_admin"], request);
  if (errorResponse) return applyCorsHeaders(errorResponse, request);

  const snapshot = metricsRegistry.getSnapshot();

  const response = NextResponse.json({
    success: true,
    data: snapshot,
    requestedBy: auth?.userId,
  });

  return applyCorsHeaders(response, request);
}

export async function POST(request: NextRequest) {
  const rateLimitResponse = enforceRateLimit(request, "admin");
  if (rateLimitResponse) return rateLimitResponse;

  const { auth, errorResponse } = await verifyAdminAuth(["platform_admin"], request);
  if (errorResponse) return applyCorsHeaders(errorResponse, request);

  try {
    const body = await request.json();
    const { action, name } = body;

    if (action === "reset_circuit_breaker") {
      if (name) {
        const cb = getCircuitBreaker(name);
        if (!cb) {
          return applyCorsHeaders(
            NextResponse.json({ success: false, error: `Circuit breaker '${name}' tidak ditemukan.` }, { status: 404 }),
            request
          );
        }
        cb.reset();
        return applyCorsHeaders(
          NextResponse.json({ success: true, message: `Circuit breaker '${name}' berhasil di-reset ke CLOSED.` }),
          request
        );
      } else {
        resetAllCircuitBreakers();
        return applyCorsHeaders(
          NextResponse.json({ success: true, message: "Seluruh circuit breaker berhasil di-reset ke CLOSED." }),
          request
        );
      }
    }

    if (action === "trip_circuit_breaker" && name) {
      const cb = getCircuitBreaker(name);
      if (!cb) {
        return applyCorsHeaders(
          NextResponse.json({ success: false, error: `Circuit breaker '${name}' tidak ditemukan.` }, { status: 404 }),
          request
        );
      }
      cb.trip();
      return applyCorsHeaders(
        NextResponse.json({ success: true, message: `Circuit breaker '${name}' berhasil di-trip ke OPEN (kill-switch aktif).` }),
        request
      );
    }

    return applyCorsHeaders(
      NextResponse.json({ success: false, error: `Aksi '${action}' tidak dikenali.` }, { status: 400 }),
      request
    );
  } catch (err: any) {
    return applyCorsHeaders(
      NextResponse.json({ success: false, error: err.message || "Gagal memproses aksi observabilitas" }, { status: 500 }),
      request
    );
  }
}
