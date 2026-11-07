/**
 * Subdomain Core: Catalog (Sub-langkah 7.6)
 * Mengelola katalog cabang game, role, dan tier rank dinamis
 * dengan dukungan penuh Honor of Kings (HOK) tanpa logika ter-hardcode.
 */

export interface CatalogGame {
  id: string;
  name: string;
  slug: string;
  category: string;
  genre: string;
  platform: string[];
  isActive: boolean;
  roles: string[];
  ranks: string[];
}

export interface CatalogRole {
  id: string;
  gameId: string;
  roleName: string;
  description?: string | null;
  sortOrder: number;
}

export interface CatalogRank {
  id: string;
  gameId: string;
  tierName: string;
  tierLevel: number;
  sortOrder: number;
}
