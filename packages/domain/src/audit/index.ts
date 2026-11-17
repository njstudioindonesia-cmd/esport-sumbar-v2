import { SupabaseClient } from "@supabase/supabase-js";

export interface AuditLogEntry {
  actorId: string;
  actorRole: string;
  action: string;
  entityType: string;
  entityId: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Mencatat peristiwa administratif ke dalam tabel audit_logs (append-only).
 */
export async function recordAuditLog(
  supabase: SupabaseClient,
  entry: AuditLogEntry
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from("audit_logs").insert({
      actor_id: entry.actorId,
      actor_role: entry.actorRole,
      action: entry.action,
      entity_type: entry.entityType,
      entity_id: entry.entityId,
      details: entry.details || {},
      ip_address: entry.ipAddress || null,
      user_agent: entry.userAgent || null,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal mencatat audit log" };
  }
}
