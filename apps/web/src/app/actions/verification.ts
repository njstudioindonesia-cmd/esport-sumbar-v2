"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { FLAGS } from "@/lib/config/flags";
import {
  submitVerification,
  reviewVerificationDecision,
} from "@/lib/services/verification";

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

export async function submitVerificationAction(
  profileId: string,
  regionId: string,
  notes: string,
  evidenceFiles: { name: string; url: string; size: string }[]
): Promise<VerificationActionResult> {
  try {
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();

    // Verifikasi otentikasi
    const userId = authData?.user?.id;
    const isPlaceholder = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").includes("placeholder");

    if (!userId && !isPlaceholder) {
      return { success: false, error: "Akses ditolak: Anda harus masuk ke akun untuk mengajukan verifikasi." };
    }

    // Verifikasi kepemilikan profil (Mencegah pengajuan atas nama atlet lain)
    let entityType = "player";
    if (userId) {
      const { data: profileRecord } = await supabase
        .from("profiles")
        .select("account_id, entity_type")
        .eq("id", profileId)
        .single();

      if (profileRecord && profileRecord.account_id !== userId) {
        return { success: false, error: "Akses ditolak: Anda tidak memiliki hak atas profil ini." };
      }
      if (profileRecord?.entity_type) {
        entityType = profileRecord.entity_type;
      }
    }

    // Jalur Layanan Baru jika Feature Flag aktif (Sub-langkah 7.4)
    if (FLAGS.USE_VERIFICATION_SERVICE) {
      const serviceResult = await submitVerification({
        profileId,
        accountId: userId || "placeholder-user",
        entityType,
        regionId,
        notes,
        evidenceFiles,
      });

      if (!serviceResult.success) {
        return {
          success: false,
          error: serviceResult.errors?.join(", ") || "Gagal memvalidasi berkas bukti verifikasi.",
        };
      }

      revalidatePath("/verification");
      revalidatePath("/admin/verification");
      revalidatePath("/admin");
      revalidatePath("/dashboard");

      return {
        success: true,
        message: "Berkas verifikasi berhasil dikirim ke antrean telaah ESPORT SUMBAR.",
        newStatus: "submitted",
      };
    }

    // Jalur Monolitik Warisan (Rollback Path)
    const { error: requestError } = await supabase
      .from("verification_requests")
      .insert({
        profile_id: profileId,
        region_id: regionId,
        status: "submitted",
        notes: notes?.slice(0, 1000) || "",
        evidence_files: (evidenceFiles || []) as any,
        submitted_at: new Date().toISOString(),
      });

    if (requestError && !isPlaceholder) {
      return { success: false, error: requestError.message };
    }

    if (userId) {
      await supabase
        .from("profiles")
        .update({
          verification_status: "submitted",
          updated_at: new Date().toISOString(),
        })
        .eq("id", profileId)
        .eq("account_id", userId);
    }

    revalidatePath("/verification");
    revalidatePath("/admin/verification");
    revalidatePath("/admin");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Berkas verifikasi berhasil dikirim ke antrean telaah ESPORT SUMBAR.",
      newStatus: "submitted",
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Gagal mengajukan verifikasi berkas";
    return { success: false, error: errorMsg };
  }
}

export async function transitionVerificationAction(
  input: VerificationReviewInput
): Promise<VerificationActionResult> {
  if (!input.requestId || !input.newStatus) {
    return { success: false, error: "ID permohonan dan target status wajib ditentukan." };
  }

  if (["revision_requested", "rejected", "suspended"].includes(input.newStatus) && (!input.reason || !input.reason.trim())) {
    return { success: false, error: "Alasan keputusan telaah wajib disertakan." };
  }

  try {
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();
    const reviewerId = authData?.user?.id;

    // Jalur Layanan Baru jika Feature Flag aktif (Sub-langkah 7.4)
    if (FLAGS.USE_VERIFICATION_SERVICE && reviewerId) {
      const decisionResult = await reviewVerificationDecision({
        requestId: input.requestId,
        reviewerId,
        reviewerRole: "platform_admin",
        decision: input.newStatus,
        reason: input.reason,
        notes: input.notes,
        revisionFields: input.revisionFields,
        badgeNo: input.badgeNo,
      });

      if (!decisionResult.success) {
        return {
          success: false,
          error: decisionResult.error || "Gagal memproses keputusan verifikasi.",
        };
      }

      revalidatePath("/admin");
      revalidatePath("/admin/verification");
      revalidatePath("/verification");
      revalidatePath("/dashboard");
      revalidatePath("/explore");
      revalidatePath("/");

      return {
        success: true,
        message: `Status permohonan berhasil diperbarui menjadi "${input.newStatus}".`,
        newStatus: decisionResult.newStatus,
        badgeNo: decisionResult.badgeNo,
      };
    }

    // Jalur Monolitik Warisan (Rollback Path via RPC transition_verification)
    const { data, error } = await supabase.rpc("transition_verification", {
      p_request_id: input.requestId,
      p_new_status: input.newStatus,
      p_reason: input.reason.trim(),
      p_notes: input.notes?.trim() || null,
      p_revision_fields: (input.revisionFields || []) as any,
      p_badge_no: input.badgeNo || null,
    });

    if (error) {
      return {
        success: false,
        error: `Otorisasi ditolak oleh database: ${error.message}`,
      };
    }

    const result = data as any;
    revalidatePath("/admin");
    revalidatePath("/admin/verification");
    revalidatePath("/verification");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: `Status permohonan berhasil diperbarui menjadi "${input.newStatus}".`,
      newStatus: result?.newStatus || input.newStatus,
      badgeNo: result?.badgeNo,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan saat memproses keputusan verifikasi";
    return { success: false, error: errorMsg };
  }
}
