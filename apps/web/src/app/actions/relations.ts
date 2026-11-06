"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { calculateRarityTier } from "@/lib/entities";
import type { EntityType } from "@/lib/supabase/database.types";

export interface RequestRelationInput {
  targetProfileId: string;
  relationType: string;
  notes?: string;
}

export interface RelationActionResult {
  success: boolean;
  message?: string;
  error?: string;
  relationId?: string;
}

/**
 * Server Action: Ajukan Permohonan / Undangan Relasi Ekosistem (Mandat 6.1)
 */
export async function requestRelationAction(
  input: RequestRelationInput
): Promise<RelationActionResult> {
  try {
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();

    if (!authData?.user) {
      return { success: false, error: "Akses ditolak: Anda harus masuk ke akun Anda." };
    }

    const userId = authData.user.id;

    // 1. Ambil profil aktif pemohon (1 Akun = 1 Profil)
    const { data: sourceProfile, error: srcErr } = await supabase
      .from("profiles")
      .select("id, account_id, entity_type, display_name, main_game_id, completeness_score, rarity_tier, verification_status")
      .eq("account_id", userId)
      .single();

    if (srcErr || !sourceProfile) {
      return { success: false, error: "Anda belum memiliki profil entitas aktif untuk mengajukan relasi." };
    }

    if (sourceProfile.verification_status === "suspended") {
      return { success: false, error: "Profil Anda sedang disuspensi dan tidak dapat membuat relasi baru." };
    }

    if (sourceProfile.id === input.targetProfileId) {
      return { success: false, error: "Profil tidak dapat menghubungkan relasi ke dirinya sendiri." };
    }

    // 2. Ambil profil target
    const admin = createAdminClient();
    const { data: targetProfile, error: tgtErr } = await admin
      .from("profiles")
      .select("id, account_id, entity_type, display_name, main_game_id, completeness_score, rarity_tier, verification_status")
      .eq("id", input.targetProfileId)
      .single();

    if (tgtErr || !targetProfile) {
      return { success: false, error: "Profil target tidak ditemukan di direktori." };
    }

    if (targetProfile.verification_status === "suspended") {
      return { success: false, error: "Profil target sedang disuspensi dan tidak dapat menerima relasi." };
    }

    // 3. Validasi aturan pasangan (relation_rules) Mandat 6.6
    const { data: rule, error: ruleErr } = await admin
      .from("relation_rules")
      .select("*")
      .eq("source_entity_type", sourceProfile.entity_type)
      .eq("target_entity_type", targetProfile.entity_type)
      .eq("relation_type", input.relationType)
      .eq("is_active", true)
      .single();

    if (ruleErr || !rule) {
      return {
        success: false,
        error: `Hubungan "${input.relationType}" antara entitas ${sourceProfile.entity_type} dan ${targetProfile.entity_type} tidak diizinkan oleh sistem ekosistem.`,
      };
    }

    // 4. Validasi kecocokan game (game_match_required)
    if (rule.game_match_required) {
      if (!sourceProfile.main_game_id || !targetProfile.main_game_id || sourceProfile.main_game_id !== targetProfile.main_game_id) {
        return {
          success: false,
          error: `Relasi "${input.relationType}" mewajibkan kesesuaian divisi game antara kedua entitas. Game Anda: ${sourceProfile.main_game_id || "Belum dipilih"}, Game target: ${targetProfile.main_game_id || "Belum dipilih"}.`,
        };
      }
    }

    // 5. Validasi batas relasi aktif maksimum (max_active_limit)
    const { count: activeCount } = await admin
      .from("entity_relations")
      .select("*", { count: "exact", head: true })
      .eq("source_profile_id", sourceProfile.id)
      .eq("relation_type", input.relationType)
      .eq("status", "active");

    if (activeCount !== null && activeCount >= rule.max_active_limit) {
      return {
        success: false,
        error: `Batas maksimum relasi aktif (${rule.max_active_limit}) untuk kategori "${input.relationType}" telah tercapai. Akhiri salah satu relasi aktif sebelum menambah yang baru.`,
      };
    }

    // 6. Cegah duplikasi permohonan yang masih pending atau aktif
    const { data: existingRelation } = await admin
      .from("entity_relations")
      .select("id, status")
      .eq("source_profile_id", sourceProfile.id)
      .eq("target_profile_id", targetProfile.id)
      .eq("relation_type", input.relationType)
      .in("status", ["pending", "active"])
      .single();

    if (existingRelation) {
      return {
        success: false,
        error: `Relasi antara ${sourceProfile.display_name} dan ${targetProfile.display_name} sudah ada dengan status "${existingRelation.status}".`,
      };
    }

    // 7. Simpan relasi dengan status 'pending' (kedaluwarsa 14 hari)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 14);

    const { data: inserted, error: insertErr } = await admin
      .from("entity_relations")
      .insert({
        source_profile_id: sourceProfile.id,
        target_profile_id: targetProfile.id,
        relation_type: input.relationType,
        game_id: sourceProfile.main_game_id || targetProfile.main_game_id || null,
        status: "pending",
        metadata_jsonb: {
          notes: input.notes?.trim() || null,
          requested_by_user_id: userId,
          requested_at: new Date().toISOString(),
        },
        expires_at: expiresAt.toISOString(),
      })
      .select("id")
      .single();

    if (insertErr || !inserted) {
      return { success: false, error: insertErr?.message || "Gagal membuat permohonan relasi." };
    }

    // 8. Catat jejak audit
    await admin.from("audit_logs").insert({
      actor_account_id: userId,
      actor_role: "user",
      action: "ECOSYSTEM_RELATION_REQUESTED",
      target_type: "entity_relations",
      target_id: inserted.id,
      region_id: null,
      previous_status: null,
      new_status: "pending",
      reason: `Permohonan relasi ${input.relationType} dari ${sourceProfile.display_name} kepada ${targetProfile.display_name}`,
      metadata_jsonb: {
        source_id: sourceProfile.id,
        target_id: targetProfile.id,
        relation_type: input.relationType,
      },
    });

    revalidatePath("/me/memberships");
    revalidatePath("/me/ecosystem");
    return {
      success: true,
      message: `Permohonan relasi berhasil dikirim kepada ${targetProfile.display_name}.`,
      relationId: inserted.id,
    };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal mengajukan relasi ekosistem" };
  }
}

/**
 * Server Action: Tanggapi Permohonan Relasi (Setujui / Tolak) - Mandat 6.1 & 6.5
 */
export async function respondRelationAction(
  relationId: string,
  decision: "accept" | "reject",
  rejectionReason?: string
): Promise<RelationActionResult> {
  try {
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();

    if (!authData?.user) {
      return { success: false, error: "Akses ditolak: Anda harus masuk ke akun Anda." };
    }

    const userId = authData.user.id;
    const admin = createAdminClient();

    // 1. Ambil relasi dan verifikasi kepemilikan
    const { data: relation, error: relErr } = await admin
      .from("entity_relations")
      .select(`
        id, source_profile_id, target_profile_id, relation_type, game_id, status,
        source:profiles!entity_relations_source_profile_id_fkey(id, account_id, entity_type, display_name, completeness_score, rarity_tier),
        target:profiles!entity_relations_target_profile_id_fkey(id, account_id, entity_type, display_name, completeness_score, rarity_tier)
      `)
      .eq("id", relationId)
      .single();

    if (relErr || !relation) {
      return { success: false, error: "Permohonan relasi tidak ditemukan." };
    }

    if (relation.status !== "pending") {
      return { success: false, error: `Permohonan ini sudah tidak berlaku (status: ${relation.status}).` };
    }

    // Pemilik target profil yang berhak merespons
    const targetAccountId = (relation.target as any)?.account_id;
    if (targetAccountId !== userId) {
      return { success: false, error: "Akses ditolak: Anda bukan pemilik profil target permohonan ini." };
    }

    if (decision === "reject") {
      await admin
        .from("entity_relations")
        .update({
          status: "rejected",
          rejection_reason: rejectionReason?.trim() || "Ditolak oleh pihak penerima",
          ended_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", relationId);

      await admin.from("audit_logs").insert({
        actor_account_id: userId,
        actor_role: "user",
        action: "ECOSYSTEM_RELATION_REJECTED",
        target_type: "entity_relations",
        target_id: relationId,
        region_id: null,
        previous_status: "pending",
        new_status: "rejected",
        reason: rejectionReason?.trim() || "Ditolak oleh penerima",
        metadata_jsonb: { relation_id: relationId },
      });

      revalidatePath("/me/memberships");
      return { success: true, message: "Permohonan relasi telah ditolak." };
    }

    // JIKA DISETUJUI (ACCEPT):
    // Periksa batas relasi aktif target juga
    const { data: rule } = await admin
      .from("relation_rules")
      .select("max_active_limit")
      .eq("source_entity_type", (relation.source as any)?.entity_type)
      .eq("target_entity_type", (relation.target as any)?.entity_type)
      .eq("relation_type", relation.relation_type)
      .single();

    const startedAt = new Date().toISOString();
    await admin
      .from("entity_relations")
      .update({
        status: "active",
        started_at: startedAt,
        approved_by: userId,
        updated_at: startedAt,
      })
      .eq("id", relationId);

    // KEPATUHAN MANDAT 6.5:
    // Hitung ulang relasi aktif dan update tier Contender jika syarat terpenuhi
    const updateRarityIfEligible = async (profileId: string, currentScore: number, currentRarity: string) => {
      const { count: confirmedCount } = await admin
        .from("entity_relations")
        .select("*", { count: "exact", head: true })
        .or(`source_profile_id.eq.${profileId},target_profile_id.eq.${profileId}`)
        .eq("status", "active");

      const newTier = calculateRarityTier({
        completenessScore: currentScore || 0,
        confirmedRelationsCount: confirmedCount || 1,
        validatedAchievementsCount: 0,
      });

      if (newTier !== currentRarity) {
        await admin
          .from("profiles")
          .update({ rarity_tier: newTier, updated_at: new Date().toISOString() })
          .eq("id", profileId);
      }
    };

    const src = relation.source as any;
    const tgt = relation.target as any;
    if (src?.id) await updateRarityIfEligible(src.id, src.completeness_score, src.rarity_tier);
    if (tgt?.id) await updateRarityIfEligible(tgt.id, tgt.completeness_score, tgt.rarity_tier);

    // Catat jejak audit persetujuan
    await admin.from("audit_logs").insert({
      actor_account_id: userId,
      actor_role: "user",
      action: "ECOSYSTEM_RELATION_APPROVED",
      target_type: "entity_relations",
      target_id: relationId,
      region_id: null,
      previous_status: "pending",
      new_status: "active",
      reason: `Relasi ${relation.relation_type} disetujui secara resmi oleh ${tgt?.display_name}`,
      metadata_jsonb: {
        relation_id: relationId,
        source_profile_id: relation.source_profile_id,
        target_profile_id: relation.target_profile_id,
      },
    });

    revalidatePath("/me/memberships");
    revalidatePath("/dashboard");
    return {
      success: true,
      message: `Relasi dengan ${src?.display_name} telah resmi aktif.`,
    };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal menyetujui permohonan relasi" };
  }
}

/**
 * Server Action: Akhiri Relasi Aktif (Mandat 6.4)
 */
export async function endRelationAction(
  relationId: string,
  reason?: string
): Promise<RelationActionResult> {
  try {
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();

    if (!authData?.user) {
      return { success: false, error: "Akses ditolak: Anda harus masuk ke akun Anda." };
    }

    const userId = authData.user.id;
    const admin = createAdminClient();

    const { data: relation, error: relErr } = await admin
      .from("entity_relations")
      .select(`
        id, source_profile_id, target_profile_id, status,
        source:profiles!entity_relations_source_profile_id_fkey(account_id),
        target:profiles!entity_relations_target_profile_id_fkey(account_id)
      `)
      .eq("id", relationId)
      .single();

    if (relErr || !relation) {
      return { success: false, error: "Relasi tidak ditemukan." };
    }

    const isSourceOwner = (relation.source as any)?.account_id === userId;
    const isTargetOwner = (relation.target as any)?.account_id === userId;

    if (!isSourceOwner && !isTargetOwner) {
      return { success: false, error: "Akses ditolak: Anda tidak memiliki wewenang atas relasi ini." };
    }

    const endedAt = new Date().toISOString();
    await admin
      .from("entity_relations")
      .update({
        status: "ended",
        ended_at: endedAt,
        rejection_reason: reason?.trim() || "Diakhiri oleh pengguna",
        updated_at: endedAt,
      })
      .eq("id", relationId);

    await admin.from("audit_logs").insert({
      actor_account_id: userId,
      actor_role: "user",
      action: "ECOSYSTEM_RELATION_ENDED",
      target_type: "entity_relations",
      target_id: relationId,
      region_id: null,
      previous_status: relation.status,
      new_status: "ended",
      reason: reason?.trim() || "Diakhiri secara manual oleh pemilik profil",
      metadata_jsonb: { relation_id: relationId },
    });

    revalidatePath("/me/memberships");
    return { success: true, message: "Relasi telah resmi diakhiri dan dipindahkan ke riwayat." };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal mengakhiri relasi" };
  }
}

/**
 * Server Action: Batalkan Permohonan Relasi yang Masih Pending
 */
export async function cancelRelationAction(relationId: string): Promise<RelationActionResult> {
  try {
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();

    if (!authData?.user) return { success: false, error: "Akses ditolak." };

    const userId = authData.user.id;
    const admin = createAdminClient();

    const { data: relation } = await admin
      .from("entity_relations")
      .select("id, status, source:profiles!entity_relations_source_profile_id_fkey(account_id)")
      .eq("id", relationId)
      .single();

    if (!relation || (relation.source as any)?.account_id !== userId) {
      return { success: false, error: "Akses ditolak: Hanya pengaju yang dapat membatalkan permohonan." };
    }

    await admin
      .from("entity_relations")
      .update({ status: "cancelled", updated_at: new Date().toISOString() })
      .eq("id", relationId);

    revalidatePath("/me/memberships");
    return { success: true, message: "Permohonan relasi berhasil dibatalkan." };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal membatalkan permohonan" };
  }
}
