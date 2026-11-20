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

export async function getVerificationQueueAction() {
  try {
    const adminDb = createAdminClient();

    // 1. Ambil permohonan dari tabel verification_requests
    const { data: requests, error } = await adminDb
      .from("verification_requests")
      .select("id, profile_id, status, submitted_at, notes, evidence_files, profiles(id, account_id, display_name, ign, entity_type, esport_id, rarity_tier, avatar_url, bio, games(name), regions(name, code))")
      .order("submitted_at", { ascending: true });

    const items: any[] = [];

    if (!error && requests && requests.length > 0) {
      requests.forEach((q: any) => {
        const prof = q.profiles || {};
        items.push({
          id: q.id,
          profileId: q.profile_id,
          name: prof.display_name || "Tanpa Nama",
          ign: prof.ign || "-",
          esportId: prof.esport_id || "-",
          type: prof.entity_type || "player",
          game: prof.games?.name || "Esport",
          region: prof.regions?.name || "Sumatera Barat",
          regionCode: prof.regions?.code || "SB",
          status: q.status || "submitted",
          submittedDate: q.submitted_at || new Date().toISOString(),
          notes: q.notes || "",
          documents: Array.isArray(q.evidence_files) && q.evidence_files.length > 0
            ? q.evidence_files.map((f: any, idx: number) => ({
                type: f.type || "dokumen_bukti",
                title: f.title || f.name || `Dokumen Bukti #${idx + 1}`,
                url: f.url || "/brand/og-image.png",
                fileSize: f.size || "1.2 MB",
              }))
            : [],
        });
      });
    }

    // 2. Jika antrean permohonan kosong, sertakan profil unverified agar admin bisa memverifikasi langsung
    if (items.length === 0) {
      const { data: unverifiedProfiles } = await adminDb
        .from("profiles")
        .select("id, account_id, display_name, ign, entity_type, esport_id, rarity_tier, avatar_url, bio, verification_status, created_at, games(name), regions(name, code)")
        .neq("verification_status", "verified")
        .order("created_at", { ascending: false });

      (unverifiedProfiles || []).forEach((p: any) => {
        items.push({
          id: p.id,
          profileId: p.id,
          name: p.display_name || "Tanpa Nama",
          ign: p.ign || "-",
          esportId: p.esport_id || "-",
          type: p.entity_type || "player",
          game: p.games?.name || "Esport",
          region: p.regions?.name || "Sumatera Barat",
          regionCode: p.regions?.code || "SB",
          status: p.verification_status || "unverified",
          submittedDate: p.created_at || new Date().toISOString(),
          notes: "Profil terdaftar baru, menunggu kurasi status verifikasi.",
          documents: [
            {
              type: "identitas_resmi",
              title: "Kartu Digital Terdaftar",
              url: p.avatar_url || "/brand/og-image.png",
              fileSize: "100% Data Lengkap",
            },
          ],
        });
      });
    }

    return { success: true, items };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Gagal memuat antrean verifikasi";
    return { success: false, items: [], error: errorMsg };
  }
}

export async function getVerificationDetailAction(id: string) {
  try {
    const adminDb = createAdminClient();
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();
    const currentAdminId = authData?.user?.id || null;

    // 1. Cek dari permohonan verifikasi
    const { data: request } = await adminDb
      .from("verification_requests")
      .select("*, profiles(*, regions(name, code), games(name))")
      .or(`id.eq.${id},profile_id.eq.${id}`)
      .maybeSingle();

    if (request) {
      const prof = (request as any).profiles;
      return {
        success: true,
        currentAdminId,
        item: {
          id: request.id,
          profileId: request.profile_id,
          accountId: prof?.account_id,
          name: prof?.display_name || "Tanpa Nama",
          displayName: prof?.display_name || "Tanpa Nama",
          ign: prof?.ign || "-",
          esportId: prof?.esport_id || "-",
          type: prof?.entity_type || "player",
          game: prof?.games?.name || "Esport",
          region: prof?.regions?.name || "Sumatera Barat",
          regionCode: prof?.regions?.code || "SB",
          status: request.status,
          submittedDate: request.submitted_at,
          notes: request.notes || "",
          evidenceFiles: request.evidence_files || [],
          bio: prof?.bio,
          avatarUrl: prof?.avatar_url,
          rarityTier: prof?.rarity_tier || "rookie",
          documents: Array.isArray(request.evidence_files) && request.evidence_files.length > 0
            ? request.evidence_files.map((f: any, idx: number) => ({
                type: f.type || "dokumen_bukti",
                title: f.title || f.name || `Dokumen Bukti #${idx + 1}`,
                url: f.url || "/brand/og-image.png",
                fileSize: f.size || "1.2 MB",
              }))
            : [],
        },
      };
    }

    // 2. Fallback: ambil data profil langsung
    const { data: profile } = await adminDb
      .from("profiles")
      .select("*, regions(name, code), games(name)")
      .eq("id", id)
      .maybeSingle();

    if (profile) {
      return {
        success: true,
        currentAdminId,
        item: {
          id: profile.id,
          profileId: profile.id,
          accountId: profile.account_id,
          name: profile.display_name || "Tanpa Nama",
          displayName: profile.display_name || "Tanpa Nama",
          ign: profile.ign || "-",
          esportId: profile.esport_id || "-",
          type: profile.entity_type || "player",
          game: (profile.games as any)?.name || "Esport",
          region: (profile.regions as any)?.name || "Sumatera Barat",
          regionCode: (profile.regions as any)?.code || "SB",
          status: profile.verification_status || "unverified",
          submittedDate: profile.created_at,
          notes: "Profil terdaftar baru, verifikasi status langsung.",
          evidenceFiles: [],
          bio: profile.bio,
          avatarUrl: profile.avatar_url,
          rarityTier: profile.rarity_tier || "rookie",
          documents: [
            {
              type: "identitas_resmi",
              title: "Kartu Digital Terdaftar",
              url: profile.avatar_url || "/brand/og-image.png",
              fileSize: "100% Data Lengkap",
            },
          ],
        },
      };
    }

    return { success: false, currentAdminId, item: null, error: "Data permohonan tidak ditemukan" };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Gagal memuat detail verifikasi";
    return { success: false, currentAdminId: null, item: null, error: errorMsg };
  }
}
