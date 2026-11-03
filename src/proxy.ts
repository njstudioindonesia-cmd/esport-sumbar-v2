import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

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

  // Refresh auth session via Supabase SSR
  const response = await updateSession(request);

  // Dapatkan auth token atau role demo dari cookies
  const roleCookie = request.cookies.get("esport_sumbar_role")?.value;

  // Proteksi rute admin daerah
  if (pathname.startsWith("/admin/region")) {
    if (roleCookie && !["region_admin", "prov_admin"].includes(roleCookie)) {
      return NextResponse.redirect(new URL("/login?error=unauthorized_region", request.url));
    }
  }

  // Proteksi rute admin provinsi (eksklusif)
  if (pathname.startsWith("/admin/province")) {
    if (roleCookie && roleCookie !== "prov_admin") {
      return NextResponse.redirect(new URL("/login?error=unauthorized_province", request.url));
    }
  }

  // Proteksi rute operator platform
  if (pathname.startsWith("/admin/platform")) {
    if (roleCookie && roleCookie !== "platform_operator") {
      return NextResponse.redirect(new URL("/login?error=unauthorized_operator", request.url));
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
