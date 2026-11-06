import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import type { AccountRole } from "@/lib/supabase/database.types";
import { verifyServiceToken, ServiceTokenPayload } from "./service-token";

export interface AuthenticatedUserContext {
  userId: string;
  email: string;
  role: AccountRole;
  isPlatformAdmin: boolean;
  isServiceToken?: boolean;
  servicePayload?: ServiceTokenPayload;
}

export interface AuthenticatedAdminContext {
  userId: string;
  email: string;
  role: AccountRole;
  assignedRegionId: string | null;
  isServiceToken?: boolean;
}

/**
 * Ekstraksi token dari header HTTP (Authorization Bearer atau X-Service-Token).
 */
function extractTokens(request?: NextRequest | Request): {
  bearerToken: string | null;
  serviceToken: string | null;
} {
  if (!request) return { bearerToken: null, serviceToken: null };

  const headers = request.headers;
  const serviceToken = headers.get("x-service-token");

  const authHeader = headers.get("authorization") || headers.get("Authorization");
  let bearerToken: string | null = null;

  if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
    bearerToken = authHeader.slice(7).trim();
  }

  return { bearerToken, serviceToken };
}

/**
 * Memverifikasi konteks otentikasi umum (BFF API Guard).
 * Mendukung 3 moda secara hierarkis:
 * 1. Token Layanan Antar-Layanan (X-Service-Token atau Bearer st_*) berumur pendek (5 menit).
 * 2. Supabase JWT Bearer Token (Authorization: Bearer <jwt>).
 * 3. Cookie Sesi Browser (SSR Cookies).
 */
export async function verifyAuthContext(
  request?: NextRequest | Request
): Promise<{ auth: AuthenticatedUserContext | null; errorResponse: NextResponse | null }> {
  try {
    const { bearerToken, serviceToken } = extractTokens(request);

    // 1. Periksa Token Layanan Antar-Layanan (Inter-service Token)
    const rawServiceToken = serviceToken || (bearerToken?.startsWith("st_") ? bearerToken.slice(3) : null);
    if (rawServiceToken) {
      const res = verifyServiceToken(rawServiceToken);
      if (res.valid && res.payload) {
        return {
          auth: {
            userId: res.payload.sub,
            email: `service@${res.payload.sub}.internal`,
            role: "platform_admin", // Token layanan internal memiliki hak platform_admin
            isPlatformAdmin: true,
            isServiceToken: true,
            servicePayload: res.payload,
          },
          errorResponse: null,
        };
      } else {
        return {
          auth: null,
          errorResponse: NextResponse.json(
            { success: false, error: `Unauthorized: Token layanan tidak sah (${res.error || "invalid"})` },
            { status: 401 }
          ),
        };
      }
    }

    // 2. Periksa Supabase JWT Bearer Token atau Sesi Cookie
    let authUser: { id: string; email?: string } | null = null;

    if (bearerToken && !bearerToken.startsWith("st_")) {
      try {
        const { createPublicServerClient } = await import("@/lib/supabase/server");
        const publicClient = createPublicServerClient();
        const { data, error } = await publicClient.auth.getUser(bearerToken);
        if (!error && data?.user) {
          authUser = data.user;
        }
      } catch {
        // Fallback jika verifikasi bearer token gagal
      }
    }

    // Jika belum ditemukan, periksa sesi cookie browser
    if (!authUser) {
      try {
        const supabase = await createClient();
        const { data, error } = await supabase.auth.getUser();
        if (!error && data?.user) {
          authUser = data.user;
        }
      } catch {
        // Jika cookie storage tidak tersedia (misal di test runner), anggap sesi kosong
        authUser = null;
      }
    }

    if (!authUser) {
      return {
        auth: null,
        errorResponse: NextResponse.json(
          { success: false, error: "Unauthorized: Otentikasi sesi atau token JWT diperlukan." },
          { status: 401 }
        ),
      };
    }

    // 3. Ambil peran pengguna dari pangkalan data
    const admin = createAdminClient();
    const { data: account, error: accError } = await admin
      .from("accounts")
      .select("role, is_active")
      .eq("id", authUser.id)
      .single();

    if (accError || !account || !account.is_active) {
      return {
        auth: null,
        errorResponse: NextResponse.json(
          { success: false, error: "Forbidden: Akun tidak aktif atau tidak ditemukan." },
          { status: 403 }
        ),
      };
    }

    const role = (account.role || "user") as AccountRole;

    return {
      auth: {
        userId: authUser.id,
        email: authUser.email || "",
        role,
        isPlatformAdmin: role === "platform_admin",
        isServiceToken: false,
      },
      errorResponse: null,
    };
  } catch (err: any) {
    return {
      auth: null,
      errorResponse: NextResponse.json(
        { success: false, error: err.message || "Internal auth verification error" },
        { status: 500 }
      ),
    };
  }
}

/**
 * Memvalidasi sesi dan otorisasi peran (RBAC) pada endpoint API admin.
 * Di ESPORT SUMBAR V3, hanya 'platform_admin' yang berwenang mengakses panel admin.
 */
export async function verifyAdminAuth(
  allowedRoles: AccountRole[] = ["platform_admin"],
  request?: NextRequest | Request
): Promise<{ auth: AuthenticatedAdminContext | null; errorResponse: NextResponse | null }> {
  const { auth, errorResponse } = await verifyAuthContext(request);

  if (errorResponse || !auth) {
    return { auth: null, errorResponse };
  }

  if (!allowedRoles.includes(auth.role)) {
    return {
      auth: null,
      errorResponse: NextResponse.json(
        { success: false, error: "Forbidden: Hanya Administrator ESPORT SUMBAR yang berwenang mengakses modul ini." },
        { status: 403 }
      ),
    };
  }

  return {
    auth: {
      userId: auth.userId,
      email: auth.email,
      role: auth.role,
      assignedRegionId: null,
      isServiceToken: auth.isServiceToken,
    },
    errorResponse: null,
  };
}
