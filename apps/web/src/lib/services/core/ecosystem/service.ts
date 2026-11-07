/**
 * Layanan Subdomain Core: Ecosystem
 * Menegakkan aturan relasi kemitraan ekosistem (relation_rules):
 * 1. Validasi pasangan entitas yang valid.
 * 2. Batas maksimum relasi aktif (maxActiveLimit).
 * 3. Kesesuaian game jika gameMatchRequired = true.
 * 4. Kaskade pengakhiran relasi saat profil dinonaktifkan.
 * 5. Emisi peristiwa domain ke Transactional Outbox.
 */

import crypto from "crypto";
import {
  EcosystemRelationRule,
  EntityRelationRecord,
  RequestRelationParams,
} from "./types";
import { createOutboxEvent, publishOutboxEvent } from "@esport-sumbar/lib";
import { recordAuditLog } from "@/lib/services/verification/audit";
import { createAdminClient, createPublicServerClient } from "@/lib/supabase/server";

const inMemoryRules: EcosystemRelationRule[] = [];
const inMemoryRelations = new Map<string, EntityRelationRecord>();

export function clearEcosystemStore(): void {
  inMemoryRelations.clear();
  inMemoryRules.length = 0;
}

export function registerMockRules(rules: EcosystemRelationRule[]): void {
  inMemoryRules.push(...rules);
}

export function registerMockRelation(relation: EntityRelationRecord): void {
  inMemoryRelations.set(relation.id, { ...relation });
}

/**
 * Mengambil aturan relasi ekosistem
 */
export async function getRelationRules(): Promise<EcosystemRelationRule[]> {
  if (inMemoryRules.length > 0) return inMemoryRules;

  const isTest = process.env.NODE_ENV === "test";
  const isPlaceholder = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").includes("placeholder");

  if (isTest || isPlaceholder) {
    return inMemoryRules;
  }

  try {
    const supabase = createPublicServerClient();
    const { data, error } = await (supabase.from("relation_rules") as any)
      .select("*")
      .eq("is_active", true);

    if (error || !data) return [];

    return data.map((r: any) => ({
      id: r.id,
      sourceEntityType: r.source_entity_type,
      targetEntityType: r.target_entity_type,
      relationType: r.relation_type,
      requiresApproval: r.requires_approval,
      maxActiveLimit: r.max_active_limit,
      gameMatchRequired: r.game_match_required,
      isActive: r.is_active,
    }));
  } catch (err) {
    console.error("Gagal membaca relation_rules:", err);
    return [];
  }
}

/**
 * Mengajukan permohonan relasi kemitraan ekosistem baru
 */
export async function requestRelation(params: RequestRelationParams): Promise<EntityRelationRecord> {
  // 1. Ambil aturan relasi yang berlaku
  const rules = await getRelationRules();
  const rule = rules.find(
    (r) =>
      r.sourceEntityType === params.sourceEntityType &&
      r.targetEntityType === params.targetEntityType &&
      r.relationType === params.relationType
  );

  if (!rule) {
    throw new Error(
      `Hubungan antara ${params.sourceEntityType} dan ${params.targetEntityType} dengan jenis "${params.relationType}" tidak diizinkan oleh aturan ekosistem.`
    );
  }

  // 2. Validasi kesesuaian game jika dipersyaratkan
  if (rule.gameMatchRequired) {
    const game = params.gameId || params.sourceGameId;
    if (!game || (params.targetGameId && game !== params.targetGameId)) {
      throw new Error(
        `Kemitraan jenis "${params.relationType}" mensyaratkan divisi game yang sama antara kedua pihak.`
      );
    }
  }

  // 3. Validasi batas maksimum relasi aktif
  const existingActive = Array.from(inMemoryRelations.values()).filter(
    (r) =>
      r.sourceProfileId === params.sourceProfileId &&
      r.relationType === params.relationType &&
      r.status === "active"
  );

  if (existingActive.length >= rule.maxActiveLimit) {
    throw new Error(
      `Batas maksimum relasi aktif untuk jenis "${params.relationType}" (${rule.maxActiveLimit}) telah tercapai.`
    );
  }

  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const status = rule.requiresApproval ? "pending" : "active";

  const relation: EntityRelationRecord = {
    id,
    sourceProfileId: params.sourceProfileId,
    targetProfileId: params.targetProfileId,
    relationType: params.relationType,
    gameId: params.gameId || params.sourceGameId || null,
    status,
    initiatedBy: params.sourceProfileId,
    respondedBy: null,
    startedAt: status === "active" ? now : null,
    endedAt: null,
    createdAt: now,
    updatedAt: now,
  };

  inMemoryRelations.set(id, relation);

  const isTest = process.env.NODE_ENV === "test";
  const isPlaceholder = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").includes("placeholder");

  if (!isTest && !isPlaceholder) {
    try {
      const admin = createAdminClient();
      await (admin.from("entity_relations") as any).insert({
        id: relation.id,
        source_profile_id: relation.sourceProfileId,
        target_profile_id: relation.targetProfileId,
        relation_type: relation.relationType,
        game_id: relation.gameId,
        status: relation.status,
        initiated_by: relation.initiatedBy,
        started_at: relation.startedAt,
      });
    } catch (err) {
      console.error("Gagal menyimpan entity_relations:", err);
    }
  }

  // 4. Catat Audit Log
  await recordAuditLog({
    actorAccountId: params.sourceProfileId,
    actorRole: "user",
    action: "ECOSYSTEM_RELATION_REQUESTED",
    targetType: "relation",
    targetId: id,
    newStatus: status,
    reason: `Pengajuan kemitraan ${params.relationType}`,
    metadata: { source: params.sourceProfileId, target: params.targetProfileId },
  });

  // 5. Emit Outbox Event
  try {
    const outbox = createOutboxEvent({
      eventName: "RelationRequested",
      aggregateType: "relation",
      aggregateId: id,
      data: {
        relationId: id,
        sourceProfileId: params.sourceProfileId,
        targetProfileId: params.targetProfileId,
        relationType: params.relationType,
        expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
      },
    });

    if (!isTest && !isPlaceholder) {
      const admin = createAdminClient();
      await publishOutboxEvent(admin as any, outbox);
    }
  } catch (err) {
    console.error("Gagal menulis outbox RelationRequested:", err);
  }

  return relation;
}

/**
 * Merespons permohonan relasi (menyetujui atau menolak)
 */
export async function respondRelation(
  relationId: string,
  accept: boolean,
  responderProfileId: string
): Promise<EntityRelationRecord> {
  const relation = inMemoryRelations.get(relationId);
  if (!relation) {
    throw new Error(`Permohonan relasi dengan ID ${relationId} tidak ditemukan.`);
  }

  if (relation.targetProfileId !== responderProfileId) {
    throw new Error("Akses ditolak: Hanya pihak target yang berhak merespons permohonan relasi.");
  }

  const now = new Date().toISOString();
  relation.status = accept ? "active" : "rejected";
  relation.respondedBy = responderProfileId;
  relation.startedAt = accept ? now : null;
  relation.updatedAt = now;

  // Emit Outbox Event
  if (accept) {
    try {
      const outbox = createOutboxEvent({
        eventName: "RelationApproved",
        aggregateType: "relation",
        aggregateId: relationId,
        data: {
          relationId,
          sourceProfileId: relation.sourceProfileId,
          targetProfileId: relation.targetProfileId,
          approvedAt: now,
        },
      });

      const isTest = process.env.NODE_ENV === "test";
      const isPlaceholder = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").includes("placeholder");

      if (!isTest && !isPlaceholder) {
        const admin = createAdminClient();
        await publishOutboxEvent(admin as any, outbox);
      }
    } catch (err) {
      console.error("Gagal menulis outbox RelationApproved:", err);
    }
  }

  return relation;
}

/**
 * Kaskade pemutusan seluruh relasi aktif saat profil dinonaktifkan/dihapus
 */
export async function cascadeEndRelationsOnProfileTermination(
  profileId: string,
  reason: string
): Promise<number> {
  const now = new Date().toISOString();
  let count = 0;

  for (const relation of inMemoryRelations.values()) {
    if (
      (relation.sourceProfileId === profileId || relation.targetProfileId === profileId) &&
      (relation.status === "pending" || relation.status === "active")
    ) {
      relation.status = "ended";
      relation.endedAt = now;
      relation.updatedAt = now;
      count++;

      // Emit Outbox RelationEnded
      try {
        const outbox = createOutboxEvent({
          eventName: "RelationEnded",
          aggregateType: "relation",
          aggregateId: relation.id,
          data: {
            relationId: relation.id,
            reason: `Pemutusan otomatis kaskade: ${reason}`,
            endedAt: now,
          },
        });

        const isTest = process.env.NODE_ENV === "test";
        const isPlaceholder = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").includes("placeholder");

        if (!isTest && !isPlaceholder) {
          const admin = createAdminClient();
          await publishOutboxEvent(admin as any, outbox);
        }
      } catch (err) {
        console.error("Gagal menulis outbox RelationEnded kaskade:", err);
      }
    }
  }

  return count;
}
