import type { EntityType, RarityTier, VerificationStatus } from "@/lib/supabase/database.types";

/**
 * Dokumen Denormalisasi Model Baca (Read Model) Direktori Publik
 * MEMATUHI UU PDP No. 27/2022:
 * TIDAK PERNAH memuat NIK, NISN, nomor telepon, alamat rumah, atau berkas identitas privat.
 */
export interface DirectoryProfileRecord {
  id: string;
  accountId: string;
  entityType: EntityType;
  esportId: string;
  slug: string;
  displayName: string;
  ign: string | null;
  regionId: string;
  regionName: string;
  regionCode: string;
  mainGameId: string | null;
  mainGameName: string | null;
  roleName: string | null;
  avatarUrl: string | null;
  coverUrl: string | null;
  bio: string | null;
  rarityTier: RarityTier;
  completenessScore: number;
  verificationStatus: VerificationStatus;
  verifiedBadgeNo: string | null;
  verifiedAt: string | null;
  activeRelationsCount: number;
  confirmedPartners: Array<{
    id: string;
    displayName: string;
    entityType: EntityType;
    roleName?: string;
    avatarUrl?: string | null;
    slug: string;
  }>;
  isPublished: boolean;
  isSuspended: boolean;
  isDemo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DirectorySearchOptions {
  entityType?: EntityType;
  regionCode?: string;
  gameId?: string;
  verificationStatus?: VerificationStatus;
  rarityTier?: RarityTier;
  search?: string;
  sortBy?: "newest" | "completeness" | "name" | "relations";
  page?: number;
  limit?: number;
  includeDemo?: boolean;
}

export interface DirectorySearchResult {
  items: DirectoryProfileRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  fromCache: boolean;
  timestamp: string;
}

export interface DirectoryStats {
  totalEntities: number;
  totalPlayers: number;
  totalCoaches: number;
  totalTeams: number;
  totalCommunities: number;
  totalVenues: number;
  totalCampuses: number;
  totalSchools: number;
  activeRegions: number;
  verifiedCount: number;
  fromCache: boolean;
  updatedAt: string;
}

export interface ReconciliationReport {
  scannedCount: number;
  missingProjectionsCount: number;
  staleProjectionsCount: number;
  orphanedProjectionsCount: number;
  fixedCount: number;
  isDryRun: boolean;
  details: {
    missing: string[];
    stale: string[];
    orphaned: string[];
  };
  timestamp: string;
}
