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
    // Tangani error jaringan saat offline/dev
    user = null;
  }

  // 1. Proteksi Rute Pengguna Terdaftar (/me/*)
  if (pathname.startsWith("/me")) {
    // Jika tidak terotentikasi dan bukan offline dev placeholder
    if (!user && !supabaseUrl.includes("placeholder")) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Proteksi Rute Tingkat Admin (/admin/*)
  if (pathname.startsWith("/admin")) {
    if (!user && !supabaseUrl.includes("placeholder")) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (user) {
      // Ambil peran resmi pengguna dari tabel accounts
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
  }

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/me/:path*",
  ],
};
