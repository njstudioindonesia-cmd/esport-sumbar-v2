import { NextRequest, NextResponse } from "next/server";

const ALLOWED_METHODS = "GET, POST, PUT, PATCH, DELETE, OPTIONS";
const ALLOWED_HEADERS = "Content-Type, Authorization, X-Service-Token, X-Request-ID, Accept";
const MAX_AGE = "86400"; // 24 jam

/**
 * Mengambil daftar origin yang diizinkan dari variabel lingkungan atau default.
 */
export function getAllowedOrigins(): string[] {
  const origins: string[] = [];

  if (process.env.NEXT_PUBLIC_SITE_URL) {
    try {
      const url = new URL(process.env.NEXT_PUBLIC_SITE_URL);
      origins.push(url.origin);
    } catch {
      origins.push(process.env.NEXT_PUBLIC_SITE_URL);
    }
  }

  // Tambahkan origin localhost untuk mode pengembangan/testing lokal
  origins.push("http://localhost:3000");
  origins.push("http://127.0.0.1:3000");

  if (process.env.ADDITIONAL_ALLOWED_ORIGINS) {
    const extras = process.env.ADDITIONAL_ALLOWED_ORIGINS.split(",").map((o) => o.trim());
    origins.push(...extras);
  }

  return [...new Set(origins)];
}

/**
 * Memeriksa apakah origin pengirim diizinkan secara ketat.
 */
export function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false;
  const allowed = getAllowedOrigins();
  return allowed.includes(origin);
}

/**
 * Menerapkan header CORS ketat pada respons Next.js.
 */
export function applyCorsHeaders(response: NextResponse, request: NextRequest): NextResponse {
  const origin = request.headers.get("origin");

  if (origin && isOriginAllowed(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Credentials", "true");
    response.headers.set("Access-Control-Allow-Methods", ALLOWED_METHODS);
    response.headers.set("Access-Control-Allow-Headers", ALLOWED_HEADERS);
    response.headers.set("Access-Control-Max-Age", MAX_AGE);
    response.headers.set("Vary", "Origin");
  }

  return response;
}

/**
 * Menangani permintaan preflight OPTIONS dengan status 204 No Content.
 */
export function handleCorsPreflight(request: NextRequest): NextResponse {
  const origin = request.headers.get("origin");

  if (origin && isOriginAllowed(origin)) {
    return new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": ALLOWED_METHODS,
        "Access-Control-Allow-Headers": ALLOWED_HEADERS,
        "Access-Control-Max-Age": MAX_AGE,
        "Vary": "Origin",
      },
    });
  }

  // Jika origin tidak diizinkan, kembalikan 403 Forbidden
  return new NextResponse(null, { status: 403 });
}
