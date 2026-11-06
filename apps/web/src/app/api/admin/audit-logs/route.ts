import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { verifyAdminAuth } from "@/lib/auth/api-guard";
import { FLAGS } from "@/lib/config/flags";
import { queryAuditLogs } from "@/lib/services/verification";

export async function GET(request: NextRequest) {
  const { auth, errorResponse } = await verifyAdminAuth(["platform_admin"]);
  if (errorResponse) return errorResponse;

  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "100", 10);
    const action = searchParams.get("action") || undefined;
    const targetType = searchParams.get("target_type") || undefined;

    // Sub-langkah 7.4: Gunakan Layanan Audit Anti-Manipulasi jika Feature Flag aktif
    if (FLAGS.USE_VERIFICATION_SERVICE) {
      const { logs } = await queryAuditLogs({
        limit,
        action,
        targetType,
      });

      const formatted = logs.map((l) => ({
        id: l.id,
        timestamp: new Date(l.occurredAt).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }) + " WIB",
        actorName: l.actorAccountId ? `Admin (${l.actorAccountId.slice(0, 8)})` : "Platform Admin",
        actorRole: l.actorRole === "platform_admin" ? "Platform Admin" : "Sistem ESPORT SUMBAR",
        action: l.action || "Verifikasi",
        targetName: (l.metadata && (l.metadata as any).target_name) || l.targetId || "Entitas",
        targetId: l.targetId || "-",
        regionCode: "SB",
        reason: l.reason || "Pemeriksaan kelengkapan berkas",
        logHash: l.logHash,
      }));

      return NextResponse.json({ logs: formatted });
    }

    // Jalur Monolitik Warisan (Rollback Path)
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("audit_logs")
      .select("id, occurred_at, actor_account_id, actor_role, region_id, action, target_type, target_id, previous_status, new_status, reason, metadata_jsonb, regions(name, code), accounts(email)")
      .order("occurred_at", { ascending: false })
      .limit(limit);

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
      actorName: l.accounts?.email ? l.accounts.email.split("@")[0] : "Platform Admin",
      actorRole: l.actor_role === "platform_admin" ? "Platform Admin" : "Sistem ESPORT SUMBAR",
      action: l.action || "Verifikasi",
      targetName: (l.metadata_jsonb && l.metadata_jsonb.target_name) || l.target_id || "Entitas",
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
