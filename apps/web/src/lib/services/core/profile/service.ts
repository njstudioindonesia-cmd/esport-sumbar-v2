/**
 * Layanan Subdomain Core: Profile
 * Menegakkan aturan integritas profil tanpa JOIN lintas schema:
 * 1. 1 Akun = 1 Profil (UNIQUE account_id).
 * 2. Jenis entitas (entityType) bersifat permanen (immutable) setelah pendaftaran.
 * 3. Kepatuhan privasi UU PDP (tanpa NIK, KK, KTP).
 * 4. Emisi peristiwa domain ke Transactional Outbox.
 */

import crypto from "crypto";
import { CreateProfileParams, ProfileRecord, UpdateProfileParams } from "./types";
import { createOutboxEvent, publishOutboxEvent } from "@esport-sumbar/lib";
import { recordAuditLog } from "@/lib/services/verification/audit";
import { createAdminClient } from "@/lib/supabase/server";

const inMemoryProfiles = new Map<string, ProfileRecord>();

export function clearProfileStore(): void {
  inMemoryProfiles.clear();
}

export function registerMockProfile(profile: ProfileRecord): void {
  inMemoryProfiles.set(profile.id, { ...profile });
}

/**
 * Mengambil profil berdasarkan accountId
 */
export async function getProfileByAccountId(accountId: string): Promise<ProfileRecord | null> {
  const isTest = process.env.NODE_ENV === "test";
  const isPlaceholder = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").includes("placeholder");

  if (isTest || isPlaceholder) {
    for (const p of inMemoryProfiles.values()) {
      if (p.accountId === accountId) return p;
    }
    return null;
  }

  try {
    const admin = createAdminClient();
    const { data, error } = await (admin.from("profiles") as any)
      .select("*")
      .eq("account_id", accountId)
      .maybeSingle();

    if (error || !data) return null;

    return {
      id: data.id,
      accountId: data.account_id,
      entityType: data.entity_type,
      esportId: data.esport_id,
      slug: data.slug,
      displayName: data.display_name,
      ign: data.ign,
      regionId: data.region_id,
      mainGameId: data.main_game_id,
      roleName: data.role_name,
      avatarUrl: data.avatar_url,
      bio: data.bio,
      attributes: data.attributes || {},
      verificationStatus: data.verification_status,
      verifiedBadgeNo: data.verified_badge_no,
      rarityTier: data.rarity_tier,
      completenessScore: data.completeness_score || 0,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch (err) {
    console.error("ProfileService getProfileByAccountId error:", err);
    return null;
  }
}

/**
 * Mengambil profil berdasarkan ID profil murni
 */
export async function getProfileById(profileId: string): Promise<ProfileRecord | null> {
  const isTest = process.env.NODE_ENV === "test";
  const isPlaceholder = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").includes("placeholder");

  if (isTest || isPlaceholder) {
    return inMemoryProfiles.get(profileId) || null;
  }

  try {
    const admin = createAdminClient();
    const { data, error } = await (admin.from("profiles") as any)
      .select("*")
      .eq("id", profileId)
      .maybeSingle();

    if (error || !data) return null;

    return {
      id: data.id,
      accountId: data.account_id,
      entityType: data.entity_type,
      esportId: data.esport_id,
      slug: data.slug,
      displayName: data.display_name,
      ign: data.ign,
      regionId: data.region_id,
      mainGameId: data.main_game_id,
      roleName: data.role_name,
      avatarUrl: data.avatar_url,
      bio: data.bio,
      attributes: data.attributes || {},
      verificationStatus: data.verification_status,
      verifiedBadgeNo: data.verified_badge_no,
      rarityTier: data.rarity_tier,
      completenessScore: data.completeness_score || 0,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch (err) {
    console.error("ProfileService getProfileById error:", err);
    return null;
  }
}

/**
 * Membuat profil baru dengan penegakan aturan 1 akun = 1 profil
 */
export async function createProfile(params: CreateProfileParams): Promise<ProfileRecord> {
  // 1. Penegakan 1 Akun = 1 Profil
  const existing = await getProfileByAccountId(params.accountId);
  if (existing) {
    throw new Error(
      `Pelanggaran integritas: Akun ini telah memiliki profil (${existing.entityType}: ${existing.displayName}). Satu akun hanya boleh memiliki 1 profil bidang.`
    );
  }

  const id = crypto.randomUUID();
  const slug = params.slug || `${params.displayName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString().slice(-4)}`;
  const esportId = `ESP-SB-${params.regionId.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date().toISOString();

  // 2. Sanitasi UU PDP: Hapus data identitas sensitif (NIK, KK, KTP)
  const sanitizedAttributes = { ...(params.attributes || {}) };
  delete (sanitizedAttributes as any).nik;
  delete (sanitizedAttributes as any).ktp;
  delete (sanitizedAttributes as any).kk;

  const profile: ProfileRecord = {
    id,
    accountId: params.accountId,
    entityType: params.entityType,
    esportId,
    slug,
    displayName: params.displayName,
    ign: params.ign || null,
    regionId: params.regionId,
    mainGameId: params.mainGameId || null,
    roleName: params.roleName || null,
    avatarUrl: null,
    bio: params.bio || null,
    attributes: sanitizedAttributes,
    verificationStatus: "unverified",
    verifiedBadgeNo: null,
    rarityTier: "rookie",
    completenessScore: 50,
    createdAt: now,
    updatedAt: now,
  };

  inMemoryProfiles.set(id, profile);

  const isTest = process.env.NODE_ENV === "test";
  const isPlaceholder = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").includes("placeholder");

  if (!isTest && !isPlaceholder) {
    try {
      const admin = createAdminClient();
      await (admin.from("profiles") as any).insert({
        id: profile.id,
        account_id: profile.accountId,
        entity_type: profile.entityType,
        esport_id: profile.esportId,
        slug: profile.slug,
        display_name: profile.displayName,
        ign: profile.ign,
        region_id: profile.regionId,
        main_game_id: profile.mainGameId,
        role_name: profile.roleName,
        bio: profile.bio,
        attributes: profile.attributes,
        verification_status: profile.verificationStatus,
        rarity_tier: profile.rarityTier,
        completeness_score: profile.completenessScore,
      });
    } catch (err) {
      console.error("Gagal menyimpan profil ke database:", err);
    }
  }

  // 3. Catat Jejak Audit Append-Only
  await recordAuditLog({
    actorAccountId: params.accountId,
    actorRole: "user",
    action: "PROFILE_CREATED",
    targetType: "profile",
    targetId: id,
    newStatus: "unverified",
    reason: `Pendaftaran profil bidang ${params.entityType}`,
    metadata: { esportId, entityType: params.entityType, regionId: params.regionId },
  });

  // 4. Emit Peristiwa Domain ke Outbox
  try {
    const outbox = createOutboxEvent({
      eventName: "ProfileCreated",
      aggregateType: "profile",
      aggregateId: id,
      data: {
        profileId: id,
        accountId: params.accountId,
        entityType: params.entityType,
        displayName: params.displayName,
        slug: profile.slug,
        regionId: params.regionId,
        primaryGameId: params.mainGameId,
      },
    });

    if (!isTest && !isPlaceholder) {
      const admin = createAdminClient();
      await publishOutboxEvent(admin as any, outbox);
    }
  } catch (err) {
    console.error("Gagal menulis outbox ProfileCreated:", err);
  }

  return profile;
}

/**
 * Memperbarui profil dengan penegakan ketat: entityType TIDAK BISA diubah
 */
export async function updateProfile(
  params: UpdateProfileParams & { attemptedEntityTypeChange?: string }
): Promise<ProfileRecord> {
  const existing = await getProfileById(params.id);
  if (!existing) {
    throw new Error(`Profil dengan ID ${params.id} tidak ditemukan.`);
  }

  // Penegakan Immutabilitas Jenis Entitas
  if (params.attemptedEntityTypeChange && params.attemptedEntityTypeChange !== existing.entityType) {
    throw new Error(
      `Pelanggaran integritas: Jenis entitas profil (${existing.entityType}) bersifat permanen dan tidak dapat diubah.`
    );
  }

  const now = new Date().toISOString();
  const updated: ProfileRecord = {
    ...existing,
    displayName: params.displayName || existing.displayName,
    ign: params.ign !== undefined ? params.ign : existing.ign,
    bio: params.bio !== undefined ? params.bio : existing.bio,
    avatarUrl: params.avatarUrl !== undefined ? params.avatarUrl : existing.avatarUrl,
    mainGameId: params.mainGameId !== undefined ? params.mainGameId : existing.mainGameId,
    roleName: params.roleName !== undefined ? params.roleName : existing.roleName,
    attributes: params.attributes ? { ...existing.attributes, ...params.attributes } : existing.attributes,
    updatedAt: now,
  };

  inMemoryProfiles.set(params.id, updated);

  const isTest = process.env.NODE_ENV === "test";
  const isPlaceholder = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").includes("placeholder");

  if (!isTest && !isPlaceholder) {
    try {
      const admin = createAdminClient();
      await (admin.from("profiles") as any)
        .update({
          display_name: updated.displayName,
          ign: updated.ign,
          bio: updated.bio,
          avatar_url: updated.avatarUrl,
          main_game_id: updated.mainGameId,
          role_name: updated.roleName,
          attributes: updated.attributes,
          updated_at: now,
        })
        .eq("id", params.id);
    } catch (err) {
      console.error("Gagal memperbarui profil di database:", err);
    }
  }

  // Emit Peristiwa ProfileUpdated
  try {
    const outbox = createOutboxEvent({
      eventName: "ProfileUpdated",
      aggregateType: "profile",
      aggregateId: params.id,
      data: {
        profileId: params.id,
        changedFields: ["displayName", "bio", "mainGameId"],
        updatedAt: now,
      },
    });

    if (!isTest && !isPlaceholder) {
      const admin = createAdminClient();
      await publishOutboxEvent(admin as any, outbox);
    }
  } catch (err) {
    console.error("Gagal menulis outbox ProfileUpdated:", err);
  }

  return updated;
}
