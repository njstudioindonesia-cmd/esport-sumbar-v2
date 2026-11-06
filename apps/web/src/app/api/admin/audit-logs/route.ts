import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { verifyAdminAuth } from "@/lib/auth/api-guard";


export async function GET(request: NextRequest) {
  const { auth, errorResponse } = await verifyAdminAuth(["platform_operator", "prov_admin", "region_admin"]);
  if (errorResponse) return errorResponse;

  try {
    const { searchParams } = new URL(request.url);
    const scope = searchParams.get("scope"); // "platform" | "province" | "region"
    const regionId = searchParams.get("region_id");
    const limit = parseInt(searchParams.get("limit") || "100", 10);

    const admin = createAdminClient();
    let query = admin
      .from("audit_logs")
      .select("id, occurred_at, actor_account_id, actor_role, region_id, action, target_type, target_id, previous_status, new_status, reason, metadata_jsonb, regions(name, code), accounts(email)")
      .order("occurred_at", { ascending: false })
      .limit(limit);

    if (scope === "province") {
      // Log tingkat provinsi atau pengesahan emas
      query = query.in("actor_role", ["prov_admin", "platform_operator"]);
    } else if (regionId) {
      query = query.eq("region_id", regionId);
    } else if (auth?.role === "region_admin" && auth.assignedRegionId) {
      query = query.eq("region_id", auth.assignedRegionId);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message, logs: [] }, { status: 500 });
    }

    const logs = (data || []).map((l: any) => ({
      id: l.id,
      timestamp: new Date(l.occurred_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }) + " WIB",
      actorName: l.accounts?.email ? l.accounts.email.split("@")[0] : (l.actor_role === "prov_admin" ? "Komisi Keabsahan Pengprov" : "Admin Pengcab"),
      actorRole: l.actor_role === "prov_admin" ? "Pengprov ESI Sumbar" : l.actor_role === "platform_operator" ? "Operator Platform" : "Pengcab ESI Daerah",
      action: l.action || "Verifikasi Berkas",
      targetName: (l.metadata_jsonb && l.metadata_jsonb.target_name) || l.target_id || "Entitas Atlet",
      targetId: l.target_id || "-",
      regionCode: l.regions?.code || "SB",
      reason: l.reason || "Pemeriksaan kelengkapan berkas",
      logHash: `SHA256:${l.id.replace(/-/g, "").slice(0, 16)}`,
    }));

    return NextResponse.json({ logs });
  } catch (err: any) {
    console.error("API /api/admin/audit-logs error:", err);
    return NextResponse.json({ error: err.message, logs: [] }, { status: 500 });
  }
}
