/**
 * Subdomain Core: Profile (Sub-langkah 7.6)
 * Mengelola 7 entitas profil ESPORT SUMBAR dengan aturan tegas:
 * 1 akun = 1 profil (UNIQUE(account_id)), jenis entitas permanen (immutable),
 * dan pemisahan data sensitif (kepatuhan UU PDP No. 27/2022).
 */

export type EntityType =
  | "player"
  | "coach"
  | "team"
  | "community"
  | "venue"
  | "school"
  | "campus";

export interface ProfileRecord {
  id: string;
  accountId: string; // Foreign ID murni (tanpa foreign key join)
  entityType: EntityType;
  esportId: string;
  slug: string;
  displayName: string;
  ign: string | null;
  regionId: string; // Foreign ID murni
  mainGameId: string | null; // Foreign ID murni
  roleName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  attributes: Record<string, unknown>;
  verificationStatus: string;
  verifiedBadgeNo: string | null;
  rarityTier: string;
  completenessScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProfileParams {
  accountId: string;
  entityType: EntityType;
  displayName: string;
  slug?: string;
  ign?: string;
  regionId: string;
  mainGameId?: string | null;
  roleName?: string;
  bio?: string;
  attributes?: Record<string, unknown>;
}

export interface UpdateProfileParams {
  id: string;
  displayName?: string;
  ign?: string;
  bio?: string;
  avatarUrl?: string;
  mainGameId?: string | null;
  roleName?: string;
  attributes?: Record<string, unknown>;
}
