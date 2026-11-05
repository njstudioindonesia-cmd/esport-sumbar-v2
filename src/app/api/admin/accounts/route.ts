import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("accounts")
      .select("id, email, role, assigned_region_id, is_active, created_at, regions(name, code)")
      .in("role", ["platform_operator", "prov_admin", "region_admin"])
      .order("created_at", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message, accounts: [] }, { status: 500 });
    }

    const accounts = (data || []).map((acc: any) => ({
      id: acc.id,
      name:
        acc.role === "platform_operator"
          ? "Operator Platform"
          : acc.role === "prov_admin"
          ? "Pengprov ESI Sumbar"
          : `Pengcab ESI ${acc.regions?.name || "Daerah"}`,
      email: acc.email,
      role: acc.role,
      assignedRegionCode: acc.regions?.code || (acc.role === "prov_admin" ? "SUMBAR" : "-"),
      assignedRegionName: acc.regions?.name || (acc.role === "prov_admin" ? "Seluruh Sumatera Barat" : "Pusat"),
      status: acc.is_active ? "active" : "inactive",
      lastLogin: "Aktif",
      createdAt: new Date(acc.created_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    }));

    return NextResponse.json({ accounts });
  } catch (err: any) {
    console.error("API /api/admin/accounts error:", err);
    return NextResponse.json({ error: err.message, accounts: [] }, { status: 500 });
  }
}
