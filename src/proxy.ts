import { type NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { Database } from "@/lib/supabase/database.types";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Lewati static assets, internal next, dan api
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
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
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        request.cookies.set({ name, value, ...options });
        response = NextResponse.next({
          request: { headers: request.headers },
        });
        response.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        request.cookies.set({ name, value: "", ...options });
        response = NextResponse.next({
          request: { headers: request.headers },
        });
        response.cookies.set({ name, value: "", ...options });
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
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // 2. Proteksi Rute Pengguna Terdaftar (/dashboard dan /me/*)
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/me")) {
    if (!user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 3. Proteksi Rute Tingkat Admin (/admin/*)
  if (pathname.startsWith("/admin")) {
    if (!user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Ambil peran resmi pengguna dari tabel accounts di database PostgreSQL
    const { data: account } = await supabase
      .from("accounts")
      .select("role, assigned_region_id")
      .eq("id", user.id)
      .single();

    const role = account?.role || "user";

    // Operator Platform Eksklusif
    if (pathname.startsWith("/admin/platform") && role !== "platform_operator") {
      return NextResponse.redirect(new URL("/dashboard?error=unauthorized_operator", request.url));
    }

    // Pengprov ESI Sumbar Eksklusif
    if (pathname.startsWith("/admin/province") && role !== "prov_admin") {
      return NextResponse.redirect(new URL("/dashboard?error=unauthorized_province", request.url));
    }

    // Pengcab ESI Daerah (Admin Daerah atau Pengprov)
    if (pathname.startsWith("/admin/region") && !["region_admin", "prov_admin"].includes(role)) {
      return NextResponse.redirect(new URL("/dashboard?error=unauthorized_region", request.url));
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
