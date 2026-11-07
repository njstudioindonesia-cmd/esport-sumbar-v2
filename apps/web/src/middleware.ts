import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { applyCorsHeaders, handleCorsPreflight } from "@/lib/security/cors";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const requestId = request.headers.get("x-request-id") || `req-${crypto.randomUUID()}`;

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

  // 3. Proteksi Rute Panel Admin UI (/admin/*): Wajib peran platform_admin
  if (path.startsWith("/admin")) {
    if (!user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirectTo", path);
      return NextResponse.redirect(loginUrl);
    }

    // Periksa peran akun di tabel accounts
    const { data: account } = await supabase
      .from("accounts")
      .select("role, is_active")
      .eq("id", user.id)
      .single();

    if (!account || !account.is_active || account.role !== "platform_admin") {
      const dashboardUrl = new URL("/dashboard", request.url);
      dashboardUrl.searchParams.set("error", "unauthorized_admin");
      return NextResponse.redirect(dashboardUrl);
    }

    // 3b. Penegakan MFA (AAL2): Admin wajib menyelesaikan tantangan MFA jika terdaftar
    const { data: aalData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (aalData && aalData.nextLevel === "aal2" && aalData.currentLevel !== "aal2") {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("mfa", "required");
      loginUrl.searchParams.set("redirectTo", path);
      return NextResponse.redirect(loginUrl);
    }
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
    "/api/:path*",
    "/admin/:path*",
    "/dashboard/:path*",
    "/wizard/:path*",
    "/profile/:path*",
    "/verification/:path*",
    "/ecosystem/:path*",
  ],
};
