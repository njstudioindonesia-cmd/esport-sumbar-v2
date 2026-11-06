import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/lib/supabase/database.types";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Lewati static assets, internal next, api, dan callback auth
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/brand") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-esport-sumbar.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({
          request: { headers: request.headers },
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // Ambil sesi resmi pengguna dari Supabase Auth
  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    user = null;
  }

  // 1. Jika sudah masuk dan mengakses /login atau /register, arahkan ke dashboard
  if (user && (pathname === "/login" || pathname === "/register")) {
    const redirectUrl = request.nextUrl.searchParams.get("redirect") || "/dashboard";
    const redirectRes = NextResponse.redirect(new URL(redirectUrl, request.url));
    response.headers.getSetCookie().forEach((c) => {
      redirectRes.headers.append("set-cookie", c);
    });
    return redirectRes;
  }

  // 2. Proteksi Rute Pengguna Terdaftar (/dashboard dan /me/*)
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/me")) {
    if (!user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      const loginRes = NextResponse.redirect(loginUrl);
      response.headers.getSetCookie().forEach((c) => {
        loginRes.headers.append("set-cookie", c);
      });
      return loginRes;
    }
  }

  // 3. Proteksi Rute Tingkat Admin (/admin/*)
  if (pathname.startsWith("/admin")) {
    if (!user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      const loginRes = NextResponse.redirect(loginUrl);
      response.headers.getSetCookie().forEach((c) => {
        loginRes.headers.append("set-cookie", c);
      });
      return loginRes;
    }

    // Ambil peran resmi pengguna dari tabel accounts di database PostgreSQL
    const { data: account } = await supabase
      .from("accounts")
      .select("role, assigned_region_id")
      .eq("id", user.id)
      .single();

    const role = account?.role || "user";

    // 1. Operator Platform & Pengprov ESI Sumbar
    if (pathname.startsWith("/admin/platform") && !["platform_operator", "prov_admin"].includes(role)) {
      const unauthRes = NextResponse.redirect(new URL("/dashboard?error=unauthorized_operator", request.url));
      response.headers.getSetCookie().forEach((c) => {
        unauthRes.headers.append("set-cookie", c);
      });
      return unauthRes;
    }

    // 2. Pengprov ESI Sumbar (prov_admin atau platform_operator)
    if (pathname.startsWith("/admin/province") && !["prov_admin", "platform_operator"].includes(role)) {
      const unauthRes = NextResponse.redirect(new URL("/dashboard?error=unauthorized_province", request.url));
      response.headers.getSetCookie().forEach((c) => {
        unauthRes.headers.append("set-cookie", c);
      });
      return unauthRes;
    }

    // 3. Pengcab ESI Daerah (Admin Daerah, Pengprov, atau Platform Operator)
    if (pathname.startsWith("/admin/region") && !["region_admin", "prov_admin", "platform_operator"].includes(role)) {
      const unauthRes = NextResponse.redirect(new URL("/dashboard?error=unauthorized_region", request.url));
      response.headers.getSetCookie().forEach((c) => {
        unauthRes.headers.append("set-cookie", c);
      });
      return unauthRes;
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/me/:path*",
    "/dashboard",
    "/dashboard/:path*",
    "/login",
    "/register",
  ],
};
