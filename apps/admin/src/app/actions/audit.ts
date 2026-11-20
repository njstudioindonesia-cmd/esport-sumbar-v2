"use server";

import { createAdminClient } from "@/lib/supabase/server";

export interface AuditLogItem {
  id: string;
  occurredAt: string;
  actor: string;
  role: string;
  action: string;
  targetType: string;
  targetId: string;
  reason: string;
}

export async function getAuditLogsAction(): Promise<{
  success: boolean;
  logs: AuditLogItem[];
  error?: string;
}> {
  try {
    const admin = createAdminClient();
    const { data: logs, error } = await admin
      .from("audit_logs")
      .select("id, occurred_at, actor_account_id, actor_role, action, target_type, target_id, reason")
      .order("occurred_at", { ascending: false })
      .limit(100);

    if (error) throw new Error(error.message);

    const formatted: AuditLogItem[] = (logs || []).map((l: any) => ({
      id: l.id,
      occurredAt: l.occurred_at ? new Date(l.occurred_at).toLocaleString("id-ID") : "-",
      actor: l.actor_account_id ? `${l.actor_account_id.slice(0, 8)}...` : "Sistem Otomatis",
      role: l.actor_role || "admin",
      action: l.action || "-",
      targetType: l.target_type || "-",
      targetId: l.target_id ? `${l.target_id.slice(0, 8)}...` : "-",
      reason: l.reason || "-",
    }));

    return { success: true, logs: formatted };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Gagal memuat log audit";
    return { success: false, logs: [], error: errorMsg };
  }
}
