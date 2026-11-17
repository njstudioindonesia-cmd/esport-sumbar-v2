import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { applyCorsHeaders, handleCorsPreflight } from "@/lib/security/cors";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const requestId = request.headers.get("x-request-id") || `req-${crypto.randomUUID()}`;

  // 0. Penanganan Mode Pemeliharaan Sistem (Maintenance Mode - Keputusan P14)
  if (
    process.env.MAINTENANCE_MODE === "true" &&
    !path.startsWith("/maintenance") &&
    !path.startsWith("/admin") &&
    !path.startsWith("/api/healthz") &&
    !path.startsWith("/api/admin") &&
    !path.startsWith("/_next") &&
    !path.startsWith("/brand") &&
    !path.startsWith("/icons") &&
    !path.includes(".")
  ) {
    const maintenanceUrl = new URL("/maintenance", request.url);
    return NextResponse.redirect(maintenanceUrl);
  }

  // 0B. Penanganan Pembatasan Pendaftaran (Registration Toggle - Keputusan W9/P11)
  if (
    process.env.NEXT_PUBLIC_ENABLE_REGISTRATION === "false" &&
    path === "/register"
  ) {
    const closedUrl = new URL("/maintenance?reason=registration_paused", request.url);
    return NextResponse.redirect(closedUrl);
  }

  // 1. Penanganan Khusus Permintaan Preflight CORS untuk API (/api/*)
  if (path.startsWith("/api") && request.method === "OPTIONS") {
    return handleCorsPreflight(request);
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-request-id", requestId);

  let response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Terapkan Header Keamanan Standar Industri (OWASP Recommended)
  response.headers.set("x-request-id", requestId);
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");

  // Proteksi Non-Produksi: Cegah pengindeksan mesin pencari pada domain Staging / Preview
  const host = request.headers.get("host") || "";
  const isNonProduction =
    process.env.NEXT_PUBLIC_APP_ENV === "staging" ||
    process.env.VERCEL_ENV === "preview" ||
    host.includes("staging") ||
    (host.includes("vercel.app") && !host.includes("esport-sumbar-v2.vercel.app"));

  if (isNonProduction) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  // Jika permintaan menuju endpoint API (/api/*), terapkan header CORS ketat
  if (path.startsWith("/api")) {
    response = applyCorsHeaders(response, request);
    return response;
  }

  // 2. Autentikasi Supabase untuk Halaman UI Terproteksi
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-esport-sumbar.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 3. Pengalihan Rute Panel Admin UI (/admin/*) ke Deploy Terpisah (Section 6.4 - ADR 002)
  if (path.startsWith("/admin")) {
    const adminBaseUrl =
      process.env.NEXT_PUBLIC_ADMIN_URL ||
      (request.nextUrl.hostname === "localhost"
        ? "http://localhost:3001"
        : request.nextUrl.hostname.includes("staging")
        ? "https://admin-staging.esportsumbar.com"
        : "https://admin.esportsumbar.com");

    const subPath = path.replace(/^\/admin/, "") || "/";
    const targetUrl = new URL(subPath, adminBaseUrl);
    request.nextUrl.searchParams.forEach((val, key) => {
      targetUrl.searchParams.set(key, val);
    });

    return NextResponse.redirect(targetUrl, 301);
  }

  // 4. Proteksi Rute Member / Autentikasi Pengguna UI
  const protectedUserRoutes = ["/dashboard", "/wizard", "/profile/edit", "/verification", "/ecosystem"];
  if (protectedUserRoutes.some((route) => path.startsWith(route))) {
    if (!user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirectTo", path);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|brand/|icons/).*)",
  ],
};
