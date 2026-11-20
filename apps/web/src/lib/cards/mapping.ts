import { OFFICIAL_GAMES } from "@/data/games";
import {
  type UnifiedCardData,
  type CardVariantItem,
  type CardEntityType,
  type CardRarity,
  mapVerificationToCard,
} from "@/types/card";

/**
 * Resolves a game identifier or name to the official display name
 */
export function resolveGameName(gameIdentifier?: string | null): string {
  if (!gameIdentifier || typeof gameIdentifier !== "string") return "Esport";
  const trimmed = gameIdentifier.trim().toLowerCase();
  const matched = OFFICIAL_GAMES.find(
    (g) =>
      g.id.toLowerCase() === trimmed ||
      g.slug.toLowerCase() === trimmed ||
      g.shortName.toLowerCase() === trimmed ||
      g.name.toLowerCase() === trimmed
  );
  return matched ? matched.name : gameIdentifier;
}

/**
 * Maps a database profile or public_profiles record to a standardized UnifiedCardData
 * for rendering in EsportCard, ShareCardModal, Wallets, and Dashboards.
 */
export function mapProfileToUnifiedCardData(profile: any): UnifiedCardData {
  if (!profile) {
    return {
      esportId: "ESB-SB-PL-000000",
      displayName: "Atlet Esport",
      region: { name: "Sumatera Barat", code: "SB" },
      game: "Esport",
    };
  }

  const attrs = profile.attributes || profile.metadata_jsonb || profile.metadata || {};
  const entityType: CardEntityType = (profile.entityType || profile.entity_type || "player") as CardEntityType;

  // 1. Resolve Game Name accurately based on entity type
  let resolvedGame = "Esport";
  if (entityType === "team") {
    resolvedGame = resolveGameName(attrs.game_division || profile.mainGameName || profile.main_game_name || attrs.game_id);
  } else if (entityType === "community") {
    const focus = attrs.primary_game || (Array.isArray(attrs.game_focus) && attrs.game_focus.length > 0 ? attrs.game_focus[0] : null);
    resolvedGame = resolveGameName(focus || profile.mainGameName || profile.main_game_name || attrs.game_id);
  } else if (entityType === "campus" || entityType === "school") {
    const coached = Array.isArray(attrs.coached_games) && attrs.coached_games.length > 0 ? attrs.coached_games[0] : null;
    resolvedGame = resolveGameName(coached || profile.mainGameName || profile.main_game_name || attrs.game_id);
  } else if (entityType === "venue") {
    const vType = attrs.venue_type || "Gaming Arena";
    resolvedGame = vType.toUpperCase();
  } else {
    resolvedGame = resolveGameName(profile.mainGameName || profile.main_game_name || attrs.game_division || attrs.primary_game || attrs.game_id);
  }

  // 2. Resolve Role / Tagline accurately
  let resolvedRole: string = profile.roleName || profile.role_name || attrs.role || "";
  if (!resolvedRole) {
    switch (entityType) {
      case "team": resolvedRole = "Divisi Tim"; break;
      case "community": resolvedRole = "Komunitas"; break;
      case "venue": resolvedRole = attrs.venue_type || "Venue"; break;
      case "campus": resolvedRole = "UKM Kampus"; break;
      case "school": resolvedRole = "Ekskul Sekolah"; break;
      case "coach": resolvedRole = "Pelatih"; break;
      default: resolvedRole = "Athlete"; break;
    }
  }

  // 3. Resolve Manager / Captain details
  let captainOrManager: { name: string; role: "Kapten" | "Manajer" } | undefined = undefined;
  if (attrs.manager_name) {
    const mRole = attrs.manager_role === "Kapten Tim" || attrs.manager_role === "Kapten" ? "Kapten" : "Manajer";
    captainOrManager = {
      name: attrs.manager_name,
      role: mRole,
    };
  } else if (attrs.leader_name) {
    captainOrManager = {
      name: attrs.leader_name,
      role: "Kapten",
    };
  } else if (attrs.advisor_name) {
    captainOrManager = {
      name: attrs.advisor_name,
      role: "Manajer",
    };
  }

  // 4. Resolve Homebase / Coverage
  const homebase = attrs.homebase || attrs.coverage_area || profile.regionName || profile.region_name || "Sumatera Barat";

  // 5. Construct UnifiedCardData
  return {
    slug: profile.slug,
    esportId: profile.esportId || profile.esport_id || "ESB-SB-PL-000000",
    badgeNumber: profile.verifiedBadgeNo || profile.verified_badge_no || undefined,
    region: {
      name: profile.regionName || profile.region_name || (typeof profile.region === "object" ? profile.region?.name : profile.region) || "Sumatera Barat",
      code: profile.regionCode || profile.region_code || (typeof profile.region === "object" ? profile.region?.code : "SB") || "SB",
    },
    game: resolvedGame,
    displayName: profile.displayName || profile.display_name || "Nama Entitas",
    ign: profile.ign || undefined,
    avatarUrl: profile.avatarUrl || profile.avatar_url || undefined,
    role: resolvedRole,
    team: attrs.team_name ? { name: attrs.team_name } : undefined,
    homebase,
    captainOrManager,
    joinedAt: profile.createdAt || profile.created_at ? new Date(profile.createdAt || profile.created_at).getFullYear().toString() : undefined,
    foundedAt: attrs.founded_year ? String(attrs.founded_year) : undefined,

    // Community
    community: {
      memberCount: attrs.estimated_members,
      activityFrequency: attrs.activity_frequency,
      focusGames: Array.isArray(attrs.game_focus) ? attrs.game_focus : undefined,
    },

    // Venue
    venue: {
      venueType: attrs.venue_type,
      capacityUnits: attrs.capacity_units,
      address: attrs.business_address,
      isTournamentReady: attrs.is_tournament_ready,
      facilities: Array.isArray(attrs.facilities) ? attrs.facilities : undefined,
    },

    // Campus
    campus: {
      campusName: attrs.campus_name,
      clubName: attrs.esport_club_name,
      memberCount: attrs.member_count,
      coachedGames: Array.isArray(attrs.coached_games) ? attrs.coached_games : undefined,
    },

    // School
    school: {
      schoolName: attrs.school_name,
      educationLevel: attrs.education_level,
      studentCount: attrs.student_count,
      coachedGames: Array.isArray(attrs.coached_games) ? attrs.coached_games : undefined,
    },
  };
}

/**
 * Maps a database profile or public_profiles record to a CardVariantItem for explore/carousel
 */
export function mapProfileToCardVariantItem(profile: any): CardVariantItem {
  const entityType = (profile.entityType || profile.entity_type || "player") as CardEntityType;
  const rarity = (profile.rarityTier || profile.rarity_tier || "rookie") as CardRarity;
  const verification = mapVerificationToCard(profile.verificationStatus || profile.verification_status);
  const data = mapProfileToUnifiedCardData(profile);

  return {
    id: profile.id,
    slug: profile.slug,
    type: entityType,
    rarity,
    verification,
    data,
  };
}
