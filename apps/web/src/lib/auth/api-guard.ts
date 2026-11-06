import { createClient, createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { AccountRole } from "@/lib/supabase/database.types";

export interface AuthenticatedAdminContext {
  userId: string;
  email: string;
  role: AccountRole;
  assignedRegionId: string | null;
}

/**
 * Memvalidasi sesi dan otorisasi peran (RBAC) pada endpoint API admin.
 * Melindungi dari akses tanpa izin (unauthenticated / unauthorized API calling).
 */
export async function verifyAdminAuth(
  allowedRoles: AccountRole[] = ["platform_operator", "prov_admin", "region_admin"]
): Promise<{ auth: AuthenticatedAdminContext | null; errorResponse: NextResponse | null }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        auth: null,
        errorResponse: NextResponse.json(
          { error: "Unauthorized: Otentikasi sesi diperlukan." },
          { status: 401 }
        ),
      };
    }

    const admin = createAdminClient();
    const { data: account, error: accError } = await admin
      .from("accounts")
      .select("role, assigned_region_id, is_active")
      .eq("id", user.id)
      .single();

    if (accError || !account || !account.is_active) {
      return {
        auth: null,
        errorResponse: NextResponse.json(
          { error: "Forbidden: Akun tidak aktif atau tidak terdaftar dalam sistem administrasi." },
          { status: 403 }
        ),
      };
    }

    if (!allowedRoles.includes(account.role as AccountRole)) {
      return {
        auth: null,
        errorResponse: NextResponse.json(
          { error: "Forbidden: Anda tidak memiliki otoritas peran untuk mengakses endpoint ini." },
          { status: 403 }
        ),
      };
    }

    return {
      auth: {
        userId: user.id,
        email: user.email || "",
        role: account.role as AccountRole,
        assignedRegionId: account.assigned_region_id,
      },
      errorResponse: null,
    };
  } catch (err: any) {
    return {
      auth: null,
      errorResponse: NextResponse.json(
        { error: err.message || "Internal server error" },
        { status: 500 }
      ),
    };
  }
}
