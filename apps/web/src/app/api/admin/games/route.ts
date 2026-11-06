import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/auth/api-guard";
import { getAllGamesForAdmin } from "@/lib/services/games";
import { applyCorsHeaders, handleCorsPreflight } from "@/lib/security/cors";
import { enforceRateLimit } from "@/lib/security/rate-limiter";

export async function OPTIONS(request: NextRequest) {
  return handleCorsPreflight(request);
}

export async function GET(request: NextRequest) {
  // 1. Rate Limiting (admin tier)
  const rateLimitResponse = enforceRateLimit(request, "admin");
  if (rateLimitResponse) return rateLimitResponse;

  // 2. Auth Guard: verifyAdminAuth (platform_admin or short-lived service token)
  const { auth, errorResponse } = await verifyAdminAuth(["platform_admin"], request);
  if (errorResponse) {
    return applyCorsHeaders(errorResponse, request);
  }

  try {
    const games = await getAllGamesForAdmin();
    const response = NextResponse.json({
      success: true,
      games,
      total: games.length,
      requestedBy: auth?.userId,
    });

    return applyCorsHeaders(response, request);
  } catch (err: any) {
    const response = NextResponse.json(
      { success: false, error: err.message || "Gagal memuat katalog game admin" },
      { status: 500 }
    );
    return applyCorsHeaders(response, request);
  }
}
