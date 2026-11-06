import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const requestId = request.headers.get("x-request-id") || `req-${crypto.randomUUID()}`;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-request-id", requestId);

  let response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  response.headers.set("x-request-id", requestId);

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

  const path = request.nextUrl.pathname;

  // 1. Proteksi Rute /admin: Hanya untuk role platform_admin
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
      // Tolak akses jika bukan platform_admin
      const dashboardUrl = new URL("/dashboard", request.url);
      dashboardUrl.searchParams.set("error", "unauthorized_admin");
      return NextResponse.redirect(dashboardUrl);
    }
  }

  // 2. Proteksi Rute Member / Autentikasi Pengguna
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
    "/admin/:path*",
    "/dashboard/:path*",
    "/wizard/:path*",
    "/profile/:path*",
    "/verification/:path*",
    "/ecosystem/:path*",
  ],
};
