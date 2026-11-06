import { createClient, createAdminClient, createPublicServerClient } from "@/lib/supabase/server";
import {
  DirectoryProfileRecord,
  DirectorySearchOptions,
  DirectorySearchResult,
  DirectoryStats,
  ReconciliationReport,
} from "./types";
import { directoryCache } from "./cache";
import {
  directoryProjections,
  slugToIdIndex,
  projectProfileCreated,
  projectProfileDeleted,
} from "./projections";
import { FLAGS } from "@/lib/config/flags";
import { logger, createResiliencePolicy } from "@esport-sumbar/lib";
import { EntityType, RarityTier, VerificationStatus } from "@/lib/supabase/database.types";

export const directoryResiliencePolicy = createResiliencePolicy({
  name: "directory-service",
  timeoutMs: 3000,
  retry: { maxAttempts: 2, baseDelayMs: 50 },
  circuitBreaker: { failureThreshold: 5, recoveryTimeoutMs: 15000 },
});

const CACHE_TTL_SECONDS = 60; // 1 menit

function isTestOrPlaceholder(client?: any): boolean {
  if (client) return false;
  const isPlaceholder = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").includes("placeholder");
  const isTest = process.env.NODE_ENV === "test";
  return isTest || isPlaceholder;
}

/**
 * 1. PENCARIAN & FILTER DIREKTORI PUBLIK (READ MODEL FAST PATH)
 */
export async function searchDirectory(
  options: DirectorySearchOptions = {},
  client?: any
): Promise<DirectorySearchResult> {
  const page = Math.max(1, options.page || 1);
  const limit = Math.min(100, Math.max(1, options.limit || 20));
  const offset = (page - 1) * limit;

  // 1. Periksa Cache Cepat Berbasis Tag
  const cacheKey = directoryCache.generateQueryKey("dir:search", options);
  const cached = directoryCache.get<DirectorySearchResult>(cacheKey);
  if (cached) {
    return {
      ...cached,
      fromCache: true,
    };
  }

  // 2. Jika Proyeksi In-Memory Masih Kosong dan bukan Test Mock, Muat dari Database Sekali
  if (directoryProjections.size === 0 && !isTestOrPlaceholder(client)) {
    try {
      const supabase = client || createPublicServerClient();
      const { data } = await supabase.from("public_profiles").select("*").limit(200);
      if (data && data.length > 0) {
        for (const p of data) {
          await projectProfileCreated({
            profileId: p.id,
            accountId: p.account_id,
            entityType: p.entity_type as EntityType,
            displayName: p.display_name,
            slug: p.slug,
            regionId: p.region_id,
            regionCode: p.region_code,
            regionName: p.region_name,
            mainGameId: p.main_game_id,
            mainGameName: p.main_game_name,
            roleName: p.role_name,
            ign: p.ign,
            avatarUrl: p.avatar_url,
            coverUrl: p.cover_url,
            bio: p.bio,
            rarityTier: p.rarity_tier as RarityTier,
            completenessScore: p.completeness_score,
            isDemo: p.is_demo,
            createdAt: p.created_at,
          });
        }
      }
    } catch {
      // Abaikan jika database belum siap
    }
  }

  // 3. Filter Data dari In-Memory Projections
  let records = Array.from(directoryProjections.values());

  // Kebijakan Visibilitas: hanya profil yang dipublikasi dan tidak disuspend
  records = records.filter((r) => r.isPublished && !r.isSuspended);

  // Kepatuhan Demo Flag
  if (!FLAGS.SHOW_DEMO_DATA && !options.includeDemo) {
    records = records.filter((r) => !r.isDemo);
  }

  // Filter Kategori Entitas
  if (options.entityType) {
    records = records.filter((r) => r.entityType === options.entityType);
  }

  // Filter Wilayah (19 Kota / Kabupaten)
  if (options.regionCode) {
    records = records.filter((r) => r.regionCode.toLowerCase() === options.regionCode?.toLowerCase());
  }

  // Filter Game Utama
  if (options.gameId) {
    records = records.filter((r) => r.mainGameId === options.gameId);
  }

  // Filter Status Verifikasi
  if (options.verificationStatus) {
    records = records.filter((r) => r.verificationStatus === options.verificationStatus);
  }

  // Filter Tingkat Kelangkaan
  if (options.rarityTier) {
    records = records.filter((r) => r.rarityTier === options.rarityTier);
  }

  // Filter Pencarian Teks (Nama, IGN, Nomor Seri ID)
  if (options.search && options.search.trim().length > 0) {
    const q = options.search.trim().toLowerCase();
    records = records.filter(
      (r) =>
        r.displayName.toLowerCase().includes(q) ||
        (r.ign && r.ign.toLowerCase().includes(q)) ||
        r.esportId.toLowerCase().includes(q)
    );
  }

  // 4. Pengurutan Data
  switch (options.sortBy) {
    case "completeness":
      records.sort((a, b) => b.completenessScore - a.completenessScore);
      break;
    case "name":
      records.sort((a, b) => a.displayName.localeCompare(b.displayName));
      break;
    case "relations":
      records.sort((a, b) => b.activeRelationsCount - a.activeRelationsCount);
      break;
    case "newest":
    default:
      records.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
      break;
  }

  // 5. Paginasi
  const total = records.length;
  const totalPages = Math.ceil(total / limit);
  const items = records.slice(offset, offset + limit);

  const result: DirectorySearchResult = {
    items,
    total,
    page,
    limit,
    totalPages,
    fromCache: false,
    timestamp: "2026-01-01T00:00:00.000Z",
  };

  // Simpan ke Cache
  const tags = ["directory:all"];
  if (options.entityType) tags.push(`directory:entity:${options.entityType}`);
  directoryCache.set(cacheKey, result, CACHE_TTL_SECONDS, tags);

  return result;
}

/**
 * 2. MENGAMBIL PROFIL LENGKAP BERDASARKAN SLUG (DENORMALIZED READ MODEL)
 */
export async function getDirectoryProfileBySlug(
  slug: string,
  client?: any
): Promise<DirectoryProfileRecord | null> {
  // 1. Cek Cache
  const cacheKey = `dir:slug:${slug}`;
  const cached = directoryCache.get<DirectoryProfileRecord>(cacheKey);
  if (cached) {
    return cached;
  }

  // 2. Cek In-Memory Projections via Index
  const profileId = slugToIdIndex.get(slug);
  if (profileId) {
    const record = directoryProjections.get(profileId);
    if (record && record.isPublished && !record.isSuspended) {
      directoryCache.set(cacheKey, record, CACHE_TTL_SECONDS, [
        `directory:profile:${slug}`,
        `directory:entity:${record.entityType}`,
      ]);
      return record;
    }
  }

  // 3. Fallback ke DB jika bukan mock
  if (!isTestOrPlaceholder(client)) {
    try {
      const supabase = client || createPublicServerClient();
      const { data: p } = await supabase
        .from("public_profiles")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (p) {
        await projectProfileCreated({
          profileId: p.id,
          accountId: p.account_id,
          entityType: p.entity_type as EntityType,
          displayName: p.display_name,
          slug: p.slug,
          regionId: p.region_id,
          regionCode: p.region_code,
          regionName: p.region_name,
          mainGameId: p.main_game_id,
          mainGameName: p.main_game_name,
          roleName: p.role_name,
          ign: p.ign,
          avatarUrl: p.avatar_url,
          coverUrl: p.cover_url,
          bio: p.bio,
          rarityTier: p.rarity_tier as RarityTier,
          completenessScore: p.completeness_score,
          isDemo: p.is_demo,
          createdAt: p.created_at,
        });

        const createdRecord = directoryProjections.get(p.id);
        if (createdRecord) {
          directoryCache.set(cacheKey, createdRecord, CACHE_TTL_SECONDS, [
            `directory:profile:${slug}`,
            `directory:entity:${createdRecord.entityType}`,
          ]);
          return createdRecord;
        }
      }
    } catch {
      // Abaikan jika query DB gagal
    }
  }

  return null;
}

/**
 * 3. STATISTIK DIREKTORI TERAGREGASI (CACHED PLATFORM STATS)
 */
export async function getDirectoryStats(client?: any): Promise<DirectoryStats> {
  const cacheKey = "dir:stats";
  const cached = directoryCache.get<DirectoryStats>(cacheKey);
  if (cached) {
    return {
      ...cached,
      fromCache: true,
    };
  }

  let records = Array.from(directoryProjections.values()).filter(
    (r) => r.isPublished && !r.isSuspended
  );

  if (!FLAGS.SHOW_DEMO_DATA) {
    records = records.filter((r) => !r.isDemo);
  }

  const activeRegions = new Set(records.map((r) => r.regionCode).filter(Boolean)).size;

  const stats: DirectoryStats = {
    totalEntities: records.length,
    totalPlayers: records.filter((r) => r.entityType === "player").length,
    totalCoaches: records.filter((r) => r.entityType === "coach").length,
    totalTeams: records.filter((r) => r.entityType === "team").length,
    totalCommunities: records.filter((r) => r.entityType === "community").length,
    totalVenues: records.filter((r) => r.entityType === "venue").length,
    totalCampuses: records.filter((r) => r.entityType === "campus").length,
    totalSchools: records.filter((r) => r.entityType === "school").length,
    activeRegions,
    verifiedCount: records.filter((r) => r.verificationStatus === "verified").length,
    fromCache: false,
    updatedAt: "2026-01-01T00:00:00.000Z",
  };

  directoryCache.set(cacheKey, stats, CACHE_TTL_SECONDS * 2, ["directory:stats"]);
  return stats;
}

/**
 * 4. REKONSILIASI TERJADWAL MODEL BACA DIREKTORI (SCHEDULED RECONCILIATION)
 * Membandingkan basis data transaksional inti dengan Read Model Direktori
 * untuk mendeteksi drift atau proyeksi yang tertinggal.
 */
export async function reconcileDirectoryReadModel(
  dryRun = true,
  client?: any
): Promise<ReconciliationReport> {
  const missing: string[] = [];
  const stale: string[] = [];
  const orphaned: string[] = [];

  const supabase = client || createAdminClient();

  try {
    // 1. Ambil seluruh profil aktif dari Database
    const { data: dbProfiles, error } = await supabase
      .from("profiles")
      .select("id, account_id, entity_type, display_name, slug, verification_status, is_published, verification_badge_no, updated_at");

    if (!error && dbProfiles) {
      const dbIds = new Set(dbProfiles.map((p: any) => p.id));

      // A. Deteksi Missing & Stale
      for (const p of dbProfiles) {
        const proj = directoryProjections.get(p.id);
        if (!proj) {
          missing.push(p.id);
          if (!dryRun) {
            await projectProfileCreated({
              profileId: p.id,
              accountId: p.account_id,
              entityType: p.entity_type,
              displayName: p.display_name,
              slug: p.slug,
              regionId: "default",
            });
          }
        } else {
          // Cek stale
          if (
            proj.verificationStatus !== p.verification_status ||
            proj.displayName !== p.display_name ||
            proj.isPublished !== p.is_published
          ) {
            stale.push(p.id);
            if (!dryRun) {
              proj.verificationStatus = p.verification_status;
              proj.displayName = p.display_name;
              proj.isPublished = p.is_published;
              proj.verifiedBadgeNo = p.verification_badge_no;
              proj.updatedAt = p.updated_at || new Date().toISOString();
            }
          }
        }
      }

      // B. Deteksi Orphaned (ada di proyeksi, tapi sudah dihapus di DB)
      for (const projId of Array.from(directoryProjections.keys())) {
        if (!dbIds.has(projId)) {
          orphaned.push(projId);
          if (!dryRun) {
            await projectProfileDeleted({ profileId: projId });
          }
        }
      }
    }
  } catch (e) {
    logger.warn("Pemeriksaan rekonsiliasi database gagal (menggunakan status lokal)", { error: e });
  }

  if (!dryRun) {
    directoryCache.invalidateAll();
  }

  const fixedCount = dryRun ? 0 : missing.length + stale.length + orphaned.length;

  return {
    scannedCount: directoryProjections.size,
    missingProjectionsCount: missing.length,
    staleProjectionsCount: stale.length,
    orphanedProjectionsCount: orphaned.length,
    fixedCount,
    isDryRun: dryRun,
    details: {
      missing,
      stale,
      orphaned,
    },
    timestamp: "2026-01-01T00:00:00.000Z",
  };
}
