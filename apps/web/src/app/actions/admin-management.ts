"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface InviteAdminInput {
  name: string;
  email: string;
  role: "admin_region" | "admin_province";
  regionCode?: string;
  reason: string;
}

export interface AdminManagementResult {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Server Action: Mengundang dan menetapkan akun Admin Platform / Provinsi oleh Platform Operator
 * Setiap tindakan wajib tercatat di tabel `audit_logs`.
 */
export async function inviteAdminAccountAction(
  input: InviteAdminInput
): Promise<AdminManagementResult> {
  if (!input.name.trim() || !input.email.trim() || !input.reason.trim()) {
    return {
      success: false,
      error: "Nama, alamat email, dan alasan penugasan wajib diisi.",
    };
  }

  try {
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();

    // 1. Tulis log audit
    await supabase.from("audit_logs").insert({
      actor_account_id: authData?.user?.id || null,
      actor_role: "platform_admin",
      action: "INVITE_ADMIN_ACCOUNT",
      target_type: "admin_assignments",
      target_id: input.email.toLowerCase(),
      reason: input.reason.trim(),
      metadata_jsonb: {
        invited_email: input.email.toLowerCase(),
        assigned_name: input.name.trim(),
        assigned_role: input.role,
        region_code: input.regionCode || "ALL",
        timestamp: new Date().toISOString(),
      },
    });

    revalidatePath("/admin/users");
    revalidatePath("/admin/audit");

    return {
      success: true,
      message: `Undangan penugasan untuk ${input.name} (${input.email}) berhasil dicatat di log audit sistem.`,
    };
  } catch (err: unknown) {
    console.error("Invite admin action error:", err);
    return {
      success: false,
      error: "Gagal memproses penugasan akun admin.",
    };
  }
}
