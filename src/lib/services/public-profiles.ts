import { createPublicServerClient } from "@/lib/supabase/server";
import type { EntityType, RarityTier, VerificationStatus } from "@/lib/supabase/database.types";
import { GALLERY_CARDS } from "@/data/mockCards";

export interface UnifiedProfileDetail {
  id: string;
  accountId: string;
  entityType: EntityType;
  esportId: string;
  slug: string;
  displayName: string;
  ign?: string | null;
  regionId: string;
  regionName: string;
  regionCode: string;
  regionType?: string;
  mainGameId?: string | null;
  mainGameName?: string;
  mainGameShort?: string;
  roleName?: string | null;
  avatarUrl?: string | null;
  coverUrl?: string | null;
  bio?: string | null;
  attributes: Record<string, any>;
  visibility: Record<string, boolean>;
  verificationStatus: VerificationStatus;
  verifiedAt?: string | null;
  verificationExpiresAt?: string | null;
  verifiedBadgeNo?: string | null;
  rarityTier: RarityTier;
  completenessScore: number;
  isDemo: boolean;
  createdAt: string;
  updatedAt?: string;

  // Relasi & Turunan
  relations?: {
    id: string;
    roleInRelation: string;
    status: string;
    targetProfile: {
      id: string;
      displayName: string;
      ign?: string | null;
      avatarUrl?: string | null;
      slug: string;
      entityType: EntityType;
      rarityTier: RarityTier;
      verificationStatus: VerificationStatus;
    };
  }[];
  achievements?: {
    id: string;
    title: string;
    eventName: string;
    placement: string;
    year: number;
    level: "district" | "province" | "national" | "international";
    isVerified: boolean;
  }[];
  gallery?: {
    id: string;
    url: string;
    caption?: string;
    sortOrder: number;
  }[];
  isOwner?: boolean;
}

/**
 * Mengambil profil publik secara lengkap berdasarkan slug dari VIEW public_profiles
 */
export async function getPublicProfileBySlug(
  slug: string,
  currentUserId?: string
): Promise<UnifiedProfileDetail | null> {
  try {
    const supabase = createPublicServerClient();

    // 1. Query view public_profiles
    const { data: profileRecord, error } = await supabase
      .from("public_profiles")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (profileRecord) {
      // 2. Ambil relasi (Roster tim, Pelatih, Naungan) via tabel memberships
      const { data: relationsData } = await supabase
        .from("memberships")
        .select(`
          id,
          role_in_org,
          status,
          member_profile_id,
          profiles!memberships_member_profile_id_fkey (
            id,
            display_name,
            ign,
            avatar_url,
            slug,
            entity_type,
            rarity_tier,
            verification_status
          )
        `)
        .eq("org_profile_id", profileRecord.id)
        .eq("status", "accepted");

      // 3. Ambil prestasi
      const { data: achievementsData } = await supabase
        .from("achievements")
        .select("id, title, event_name, placement, year, level, is_verified")
        .eq("profile_id", profileRecord.id)
        .order("year", { ascending: false });

      // 4. Ambil galeri media
      const { data: galleryData } = await supabase
        .from("media_assets")
        .select("id, path, caption, sort_order")
        .eq("profile_id", profileRecord.id)
        .eq("kind", "gallery")
        .order("sort_order", { ascending: true });

      const mappedRelations = (relationsData || []).map((r: any) => ({
        id: r.id,
        roleInRelation: r.role_in_org || "Anggota",
        status: r.status,
        targetProfile: {
          id: r.profiles?.id || "",
          displayName: r.profiles?.display_name || "",
          ign: r.profiles?.ign,
          avatarUrl: r.profiles?.avatar_url,
          slug: r.profiles?.slug || "",
          entityType: (r.profiles?.entity_type as EntityType) || "player",
          rarityTier: (r.profiles?.rarity_tier as RarityTier) || "rookie",
          verificationStatus: (r.profiles?.verification_status as VerificationStatus) || "unverified",
        },
      }));

      return {
        id: profileRecord.id,
        accountId: profileRecord.account_id,
        entityType: profileRecord.entity_type as EntityType,
        esportId: profileRecord.esport_id,
        slug: profileRecord.slug,
        displayName: profileRecord.display_name,
        ign: profileRecord.ign,
        regionId: profileRecord.region_id,
        regionName: profileRecord.region_name || "Sumatera Barat",
        regionCode: profileRecord.region_code || "SB",
        regionType: profileRecord.region_type || "Kota",
        mainGameId: profileRecord.main_game_id,
        mainGameName: profileRecord.main_game_name || "Esport",
        mainGameShort: profileRecord.main_game_short || "ESP",
        roleName: profileRecord.role_name,
        avatarUrl: profileRecord.avatar_url,
        coverUrl: (profileRecord.attributes as any)?.cover_url || profileRecord.cover_path,
        bio: profileRecord.bio,
        attributes: (profileRecord.attributes as Record<string, any>) || {},
        visibility: (profileRecord.visibility_jsonb as Record<string, boolean>) || {},
        verificationStatus: (profileRecord.verification_status as VerificationStatus) || "unverified",
        verifiedAt: profileRecord.verified_at,
        verificationExpiresAt: profileRecord.verification_expires_at,
        verifiedBadgeNo: profileRecord.verified_badge_no,
        rarityTier: (profileRecord.rarity_tier as RarityTier) || "rookie",
        completenessScore: profileRecord.completeness_score || 50,
        isDemo: profileRecord.is_demo ?? false,
        createdAt: profileRecord.created_at,
        updatedAt: profileRecord.updated_at,
        relations: mappedRelations,
        achievements: (achievementsData as any) || [],
        gallery: (galleryData || []).map((g: any) => ({
          id: g.id,
          url: g.path,
          caption: g.caption,
          sortOrder: g.sort_order,
        })),
        isOwner: currentUserId === profileRecord.account_id,
      };
    }
  } catch (err) {
    console.warn("Database fetch warning (falling back to mock catalog):", err);
  }

  // Fallback: cari dari katalog mockCards jika belum ada di database lokal
  const mockCard = GALLERY_CARDS.find((c) => {
    const slugName = (c.data.ign || c.data.displayName).toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return slugName === slug || c.data.esportId.toLowerCase() === slug.toLowerCase();
  });

  if (!mockCard) return null;

  return {
    id: mockCard.id,
    accountId: "00000000-0000-0000-0000-000000000001",
    entityType: mockCard.type as EntityType,
    esportId: mockCard.data.esportId,
    slug: (mockCard.data.ign || mockCard.data.displayName).toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    displayName: mockCard.data.displayName,
    ign: mockCard.data.ign,
    regionId: "reg-pdg-01",
    regionName: mockCard.data.region.name,
    regionCode: mockCard.data.region.code,
    regionType: "Kota",
    mainGameId: "game-mlbb-01",
    mainGameName: mockCard.data.game,
    mainGameShort: mockCard.data.game.slice(0, 4).toUpperCase(),
    roleName: mockCard.data.role,
    avatarUrl: mockCard.data.avatarUrl || null,
    coverUrl: undefined,
    bio: (mockCard.data as any).bio || "Identitas resmi PBESI Sumatera Barat.",
    attributes: {
      team_name: mockCard.data.team?.name || mockCard.data.teamName,
      social_media: {
        instagram: "@" + (mockCard.data.ign || "esport").toLowerCase(),
      },
    },
    visibility: {
      stats: true,
      history: true,
      achievements: true,
      email: false,
      phone: false,
      realName: true,
    },
    verificationStatus: mockCard.verification as VerificationStatus,
    verifiedAt: mockCard.verification === "verified" ? "2026-01-15T00:00:00Z" : null,
    verifiedBadgeNo: mockCard.data.badgeNumber || null,
    rarityTier: mockCard.rarity as RarityTier,
    completenessScore: mockCard.rarity === "legend" ? 95 : mockCard.rarity === "elite" ? 85 : 70,
    isDemo: true,
    createdAt: "2026-01-01T00:00:00Z",
    relations: [],
    achievements: (mockCard.data.achievements || []).map((ach, idx) => ({
      id: `ach-${idx}`,
      title: ach.title,
      eventName: ach.placement || ach.title,
      placement: ach.placement || ach.title,
      year: parseInt(ach.year, 10) || 2024,
      level: "province",
      isVerified: mockCard.verification === "verified",
    })),
    gallery: [],
    isOwner: false,
  };
}

/**
 * Mengambil daftar profil publik berdasarkan jenis entitas untuk halaman direktori
 */
export async function getPublicProfilesByEntity(
  entityType: EntityType,
  options?: {
    regionCode?: string;
    search?: string;
    limit?: number;
  }
): Promise<UnifiedProfileDetail[]> {
  try {
    const supabase = createPublicServerClient();
    let query = supabase
      .from("public_profiles")
      .select("*")
      .eq("entity_type", entityType)
      .order("created_at", { ascending: false });

    if (options?.regionCode) {
      query = query.eq("region_code", options.regionCode);
    }

    if (options?.search) {
      query = query.ilike("display_name", `%${options.search}%`);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (data && data.length > 0) {
      return data.map((p: any) => ({
        id: p.id,
        accountId: p.account_id,
        entityType: p.entity_type as EntityType,
        esportId: p.esport_id,
        slug: p.slug,
        displayName: p.display_name,
        ign: p.ign,
        regionId: p.region_id,
        regionName: p.region_name || "Sumatera Barat",
        regionCode: p.region_code || "SB",
        regionType: p.region_type,
        mainGameId: p.main_game_id,
        mainGameName: p.main_game_name || "Esport",
        mainGameShort: p.main_game_short || "ESP",
        roleName: p.role_name,
        avatarUrl: p.avatar_url,
        coverUrl: (p.attributes as any)?.cover_url || p.cover_path,
        bio: p.bio,
        attributes: (p.attributes as Record<string, any>) || {},
        visibility: (p.visibility_jsonb as Record<string, boolean>) || {},
        verificationStatus: (p.verification_status as VerificationStatus) || "unverified",
        verifiedAt: p.verified_at,
        verificationExpiresAt: p.verification_expires_at,
        verifiedBadgeNo: p.verified_badge_no,
        rarityTier: (p.rarity_tier as RarityTier) || "rookie",
        completenessScore: p.completeness_score || 50,
        isDemo: p.is_demo ?? false,
        createdAt: p.created_at,
        updatedAt: p.updated_at,
      }));
    }
  } catch (err) {
    console.warn("Query error, using fallback catalog:", err);
  }

  // Fallback: data mockCards yang sesuai entitas
  return GALLERY_CARDS.filter((c) => c.type === entityType).map((c) => ({
    id: c.id,
    accountId: "00000000-0000-0000-0000-000000000001",
    entityType: c.type as EntityType,
    esportId: c.data.esportId,
    slug: (c.data.ign || c.data.displayName).toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    displayName: c.data.displayName,
    ign: c.data.ign,
    regionId: "reg-pdg-01",
    regionName: c.data.region.name,
    regionCode: c.data.region.code,
    regionType: "Kota",
    mainGameId: "game-mlbb-01",
    mainGameName: c.data.game,
    mainGameShort: c.data.game.slice(0, 4).toUpperCase(),
    roleName: c.data.role,
    avatarUrl: c.data.avatarUrl || null,
    coverUrl: undefined,
    bio: (c.data as any).bio || "Identitas resmi PBESI Sumatera Barat.",
    attributes: {
      team_name: c.data.team?.name || c.data.teamName,
    },
    visibility: { stats: true, history: true, achievements: true },
    verificationStatus: c.verification as VerificationStatus,
    verifiedBadgeNo: c.data.badgeNumber || null,
    rarityTier: c.rarity as RarityTier,
    completenessScore: c.rarity === "legend" ? 95 : 75,
    isDemo: true,
    createdAt: "2026-01-01T00:00:00Z",
  }));
}
