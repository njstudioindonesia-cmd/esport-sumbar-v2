import { DirectoryProfileRecord } from "./types";
import { directoryCache } from "./cache";
import {
  withIdempotency,
  generateDeterministicIdempotencyKey,
  clearIdempotencyStore,
  logger,
} from "@esport-sumbar/lib";
import { EntityType, RarityTier, VerificationStatus } from "@/lib/supabase/database.types";

/**
 * Penyimpanan Proyeksi Model Baca Direktori (In-Memory Hot Projections)
 * Terindeks berdasarkan profileId dan slug untuk performa pencarian sub-milidetik.
 */
export const directoryProjections = new Map<string, DirectoryProfileRecord>();
export const slugToIdIndex = new Map<string, string>();

export function clearDirectoryProjections(): void {
  directoryProjections.clear();
  slugToIdIndex.clear();
  directoryCache.invalidateAll();
  clearIdempotencyStore();
}

/**
 * 1. Proyektor: ProfileCreated
 */
export async function projectProfileCreated(
  event: {
    profileId: string;
    accountId: string;
    entityType: EntityType;
    displayName: string;
    slug: string;
    regionId: string;
    regionCode?: string;
    regionName?: string;
    mainGameId?: string | null;
    mainGameName?: string | null;
    roleName?: string | null;
    ign?: string | null;
    avatarUrl?: string | null;
    coverUrl?: string | null;
    bio?: string | null;
    rarityTier?: RarityTier;
    completenessScore?: number;
    isDemo?: boolean;
    createdAt?: string;
    esportId?: string;
    verificationStatus?: VerificationStatus;
    verifiedBadgeNo?: string | null;
    verifiedAt?: string | null;
  }
): Promise<{ success: boolean; handled: boolean }> {
  const idempotencyKey = generateDeterministicIdempotencyKey("project-profile-created", event.profileId);

  const { result } = await withIdempotency(idempotencyKey, async () => {
    const existing = directoryProjections.get(event.profileId);
    const now = new Date().toISOString();
    const record: DirectoryProfileRecord = {
      id: event.profileId,
      accountId: event.accountId,
      entityType: event.entityType,
      esportId: event.esportId || existing?.esportId || `ESP-SB-${event.entityType.slice(0, 2).toUpperCase()}-000000`,
      slug: event.slug,
      displayName: event.displayName,
      ign: event.ign || null,
      regionId: event.regionId,
      regionName: event.regionName || "Sumatera Barat",
      regionCode: event.regionCode || "SB",
      mainGameId: event.mainGameId || null,
      mainGameName: event.mainGameName || null,
      roleName: event.roleName || null,
      avatarUrl: event.avatarUrl || null,
      coverUrl: event.coverUrl || null,
      bio: event.bio || null,
      rarityTier: event.rarityTier || existing?.rarityTier || "rookie",
      completenessScore: event.completenessScore || existing?.completenessScore || 50,
      verificationStatus: event.verificationStatus || existing?.verificationStatus || "unverified",
      verifiedBadgeNo: event.verifiedBadgeNo !== undefined ? event.verifiedBadgeNo : (existing?.verifiedBadgeNo || null),
      verifiedAt: event.verifiedAt !== undefined ? event.verifiedAt : (existing?.verifiedAt || null),
      activeRelationsCount: existing?.activeRelationsCount || 0,
      confirmedPartners: existing?.confirmedPartners || [],
      isPublished: true,
      isSuspended: false,
      isDemo: event.isDemo || false,
      createdAt: event.createdAt || existing?.createdAt || now,
      updatedAt: now,
    };

    directoryProjections.set(record.id, record);
    slugToIdIndex.set(record.slug, record.id);

    // Invalidate cache
    directoryCache.invalidateTag("directory:all");
    directoryCache.invalidateTag("directory:stats");
    directoryCache.invalidateTag(`directory:entity:${record.entityType}`);

    logger.info("Projected ProfileCreated into Directory Read Model", {
      profileId: record.id,
      slug: record.slug,
    });

    return { handled: true };
  });

  return { success: true, handled: result.handled };
}

/**
 * 2. Proyektor: ProfileUpdated
 */
export async function projectProfileUpdated(
  event: {
    profileId: string;
    changedFields?: Record<string, any>;
    updatedAt?: string;
  }
): Promise<{ success: boolean; handled: boolean }> {
  const idempotencyKey = generateDeterministicIdempotencyKey(
    "project-profile-updated",
    event.profileId,
    JSON.stringify(event.changedFields || {})
  );

  const { result } = await withIdempotency(idempotencyKey, async () => {
    const existing = directoryProjections.get(event.profileId);
    if (!existing) {
      return { handled: false };
    }

    const updates = event.changedFields || {};
    const oldSlug = existing.slug;
    const newSlug = updates.slug || existing.slug;

    if (oldSlug !== newSlug) {
      slugToIdIndex.delete(oldSlug);
      slugToIdIndex.set(newSlug, existing.id);
    }

    const updatedRecord: DirectoryProfileRecord = {
      ...existing,
      ...updates,
      updatedAt: event.updatedAt || new Date().toISOString(),
    };

    directoryProjections.set(event.profileId, updatedRecord);

    directoryCache.invalidateTag("directory:all");
    directoryCache.invalidateTag(`directory:profile:${oldSlug}`);
    directoryCache.invalidateTag(`directory:profile:${newSlug}`);
    directoryCache.invalidateTag(`directory:entity:${updatedRecord.entityType}`);

    return { handled: true };
  });

  return { success: true, handled: result.handled };
}

/**
 * 3. Proyektor: ProfileDeleted
 */
export async function projectProfileDeleted(
  event: {
    profileId: string;
  }
): Promise<{ success: boolean; handled: boolean }> {
  const idempotencyKey = generateDeterministicIdempotencyKey("project-profile-deleted", event.profileId);

  const { result } = await withIdempotency(idempotencyKey, async () => {
    const existing = directoryProjections.get(event.profileId);
    if (existing) {
      slugToIdIndex.delete(existing.slug);
      directoryProjections.delete(event.profileId);

      directoryCache.invalidateTag("directory:all");
      directoryCache.invalidateTag("directory:stats");
      directoryCache.invalidateTag(`directory:profile:${existing.slug}`);
      directoryCache.invalidateTag(`directory:entity:${existing.entityType}`);
    }
    return { handled: true };
  });

  return { success: true, handled: result.handled };
}

/**
 * 4. Proyektor: ProfileSuspended
 */
export async function projectProfileSuspended(
  event: {
    profileId: string;
    reason: string;
  }
): Promise<{ success: boolean; handled: boolean }> {
  const idempotencyKey = generateDeterministicIdempotencyKey("project-profile-suspended", event.profileId);

  const { result } = await withIdempotency(idempotencyKey, async () => {
    const existing = directoryProjections.get(event.profileId);
    if (existing) {
      existing.isSuspended = true;
      existing.isPublished = false;
      existing.verificationStatus = "suspended";
      existing.updatedAt = new Date().toISOString();

      directoryCache.invalidateTag("directory:all");
      directoryCache.invalidateTag("directory:stats");
      directoryCache.invalidateTag(`directory:profile:${existing.slug}`);
    }
    return { handled: true };
  });

  return { success: true, handled: result.handled };
}

/**
 * 5. Proyektor: VerificationDecided
 */
export async function projectVerificationDecided(
  event: {
    profileId: string;
    decision: VerificationStatus;
    badgeNo?: string | null;
    verifiedAt?: string | null;
  }
): Promise<{ success: boolean; handled: boolean }> {
  const idempotencyKey = generateDeterministicIdempotencyKey(
    "project-verification-decided",
    event.profileId,
    event.decision,
    event.badgeNo || ""
  );

  const { result } = await withIdempotency(idempotencyKey, async () => {
    const existing = directoryProjections.get(event.profileId);
    if (existing) {
      existing.verificationStatus = event.decision;
      if (event.decision === "verified") {
        existing.verifiedBadgeNo = event.badgeNo || existing.verifiedBadgeNo;
        existing.verifiedAt = event.verifiedAt || new Date().toISOString();
        if (existing.rarityTier === "rookie") {
          existing.rarityTier = "contender";
        }
      } else if (
        event.decision === "rejected" ||
        event.decision === "suspended" ||
        event.decision === "unverified" ||
        event.decision === "expired"
      ) {
        existing.verifiedBadgeNo = null;
      }
      existing.updatedAt = new Date().toISOString();

      directoryCache.invalidateTag("directory:all");
      directoryCache.invalidateTag("directory:stats");
      directoryCache.invalidateTag(`directory:profile:${existing.slug}`);
      directoryCache.invalidateTag(`directory:entity:${existing.entityType}`);
    }
    return { handled: true };
  });

  return { success: true, handled: result.handled };
}

/**
 * 6. Proyektor: RelationApproved
 */
export async function projectRelationApproved(
  event: {
    relationId: string;
    sourceProfileId: string;
    targetProfileId: string;
    relationType?: string;
  }
): Promise<{ success: boolean; handled: boolean }> {
  const idempotencyKey = generateDeterministicIdempotencyKey(
    "project-relation-approved",
    event.relationId
  );

  const { result } = await withIdempotency(idempotencyKey, async () => {
    const source = directoryProjections.get(event.sourceProfileId);
    const target = directoryProjections.get(event.targetProfileId);

    if (source && target) {
      // Tambah mitra di sisi source jika belum ada
      if (!source.confirmedPartners.some((p) => p.id === target.id)) {
        source.confirmedPartners.push({
          id: target.id,
          displayName: target.displayName,
          entityType: target.entityType,
          roleName: event.relationType || "Partner",
          avatarUrl: target.avatarUrl,
          slug: target.slug,
        });
        source.activeRelationsCount = source.confirmedPartners.length;
      }

      // Tambah mitra di sisi target jika belum ada
      if (!target.confirmedPartners.some((p) => p.id === source.id)) {
        target.confirmedPartners.push({
          id: source.id,
          displayName: source.displayName,
          entityType: source.entityType,
          roleName: event.relationType || "Partner",
          avatarUrl: source.avatarUrl,
          slug: source.slug,
        });
        target.activeRelationsCount = target.confirmedPartners.length;
      }

      directoryCache.invalidateTag("directory:ecosystem");
      directoryCache.invalidateTag(`directory:profile:${source.slug}`);
      directoryCache.invalidateTag(`directory:profile:${target.slug}`);
    }

    return { handled: true };
  });

  return { success: true, handled: result.handled };
}

/**
 * 7. Proyektor: RelationEnded
 */
export async function projectRelationEnded(
  event: {
    relationId: string;
    sourceProfileId: string;
    targetProfileId: string;
  }
): Promise<{ success: boolean; handled: boolean }> {
  const idempotencyKey = generateDeterministicIdempotencyKey(
    "project-relation-ended",
    event.relationId
  );

  const { result } = await withIdempotency(idempotencyKey, async () => {
    const source = directoryProjections.get(event.sourceProfileId);
    const target = directoryProjections.get(event.targetProfileId);

    if (source) {
      source.confirmedPartners = source.confirmedPartners.filter((p) => p.id !== event.targetProfileId);
      source.activeRelationsCount = source.confirmedPartners.length;
      directoryCache.invalidateTag(`directory:profile:${source.slug}`);
    }

    if (target) {
      target.confirmedPartners = target.confirmedPartners.filter((p) => p.id !== event.sourceProfileId);
      target.activeRelationsCount = target.confirmedPartners.length;
      directoryCache.invalidateTag(`directory:profile:${target.slug}`);
    }

    directoryCache.invalidateTag("directory:ecosystem");

    return { handled: true };
  });

  return { success: true, handled: result.handled };
}
