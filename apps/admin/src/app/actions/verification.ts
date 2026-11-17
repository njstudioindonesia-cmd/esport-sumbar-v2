"use server";

import { revalidatePath } from "next/cache";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { recordAuditLog } from "@esport-sumbar/domain";

export interface VerificationReviewInput {
  requestId: string;
  newStatus: "verified" | "revision_requested" | "rejected" | "suspended";
  reason: string;
  notes?: string;
  revisionFields?: string[];
  badgeNo?: string;
}

export interface VerificationActionResult {
  success: boolean;
  message?: string;
  error?: string;
  newStatus?: string;
  badgeNo?: string;
}

export async function transitionVerificationAction(
  input: VerificationReviewInput
): Promise<VerificationActionResult> {
  if (!input.requestId || !input.newStatus) {
    return { success: false, error: "ID permohonan dan target status wajib ditentukan." };
  }

  if (
    ["revision_requested", "rejected", "suspended"].includes(input.newStatus) &&
    (!input.reason || !input.reason.trim())
  ) {
    return { success: false, error: "Alasan keputusan telaah wajib disertakan." };
  }

  try {
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();
    const reviewerId = authData?.user?.id;

    // Use admin client with service role to execute review safely
    const adminDb = createAdminClient();

    // 1. Integritas Admin (Bagian 11.2): Admin dilarang memverifikasi atau mengubah status akun miliknya sendiri
    const { data: requestRecord } = await adminDb
      .from("verification_requests")
      .select("id, profile_id, status, profiles(id, account_id)")
      .eq("id", input.requestId)
      .single();

    if (requestRecord) {
      const targetAccountId = (requestRecord as any)?.profiles?.account_id;
      const targetProfileId = (requestRecord as any)?.profile_id;
      if (reviewerId && (reviewerId === targetAccountId || reviewerId === targetProfileId)) {
        return {
          success: false,
          error: "Pelanggaran Integritas: Administrator dilarang memverifikasi atau mengubah status akun miliknya sendiri.",
        };
      }
    }

    // Call RPC or update record directly
    const { data, error } = await adminDb.rpc("transition_verification", {
      p_request_id: input.requestId,
      p_new_status: input.newStatus,
      p_rejection_reason: input.reason || null,
      p_reviewer_id: reviewerId || null,
    } as any);

    if (error) {
      // Fallback direct update if RPC is missing
      const { error: updateErr } = await adminDb
        .from("verification_requests")
        .update({
          status: input.newStatus,
          rejection_reason: input.reason || null,
          reviewed_by: reviewerId || null,
          reviewed_at: new Date().toISOString(),
        } as any)
        .eq("id", input.requestId);

      if (updateErr) {
        return { success: false, error: updateErr.message };
      }
    }

    // 2. Jejak Audit Append-Only (Bagian 11.2): Seluruh aksi administratif wajib tercatat
    await recordAuditLog(adminDb as any, {
      actorId: reviewerId || "admin-system",
      actorRole: "admin",
      action: `verification_${input.newStatus}`,
      entityType: "verification_request",
      entityId: input.requestId,
      details: {
        previousStatus: (requestRecord as any)?.status,
        newStatus: input.newStatus,
        reason: input.reason || null,
        notes: input.notes || null,
        badgeNo: input.badgeNo || null,
      },
    });

    revalidatePath("/verification");
    revalidatePath("/");

    return {
      success: true,
      message: `Status permohonan berhasil diperbarui menjadi "${input.newStatus}".`,
      newStatus: input.newStatus,
      badgeNo: input.badgeNo,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan internal";
    return { success: false, error: errorMsg };
  }
}
