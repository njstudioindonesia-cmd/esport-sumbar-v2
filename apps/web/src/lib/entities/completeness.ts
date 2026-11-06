import type { EntityType, RarityTier } from "@/lib/supabase/database.types";

/**
 * Bobot kelengkapan profil per bidang entitas (Total bobot = 100 poin)
 */
export const ENTITY_COMPLETENESS_WEIGHTS: Record<EntityType, Record<string, number>> = {
  player: {
    display_name: 15,
    region_id: 15,
    ign: 20,
    main_game_id: 15,
    role: 15,
    avatar_url: 10,
    bio: 5,
    year_started: 5,
  },
  coach: {
    display_name: 15,
    region_id: 15,
    game_specialization: 20,
    experience_years: 15,
    avatar_url: 10,
    coaching_philosophy: 10,
    certifications: 10,
    bio: 5,
  },
  team: {
    display_name: 15,
    region_id: 15,
    team_tag: 20,
    game_division: 15,
    homebase: 15,
    avatar_url: 10,
    founded_year: 5,
    bio: 5,
  },
  community: {
    display_name: 15,
    region_id: 15,
    game_focus: 20,
    coverage_area: 15,
    activity_frequency: 10,
    avatar_url: 10,
    estimated_members: 10,
    bio: 5,
  },
  venue: {
    display_name: 15,
    region_id: 15,
    venue_type: 15,
    business_address: 15,
    capacity_units: 15,
    facilities: 15,
    avatar_url: 5,
    operating_hours: 5,
  },
  campus: {
    display_name: 15,
    region_id: 15,
    esport_club_name: 20,
    coached_games: 15,
    member_count: 15,
    advisor_name: 10,
    avatar_url: 5,
    bio: 5,
  },
  school: {
    display_name: 15,
    region_id: 15,
    extracurricular_name: 20,
    education_level: 15,
    coached_games: 15,
    student_count: 15,
    advisor_name: 5,
    avatar_url: 5,
  },
  organizer: {
    display_name: 20,
    region_id: 20,
    avatar_url: 20,
    bio: 20,
    main_game_id: 20,
  },
};

/**
 * Menghitung skor kelengkapan data profil secara transparan di sisi server (0 - 100%)
 */
export function calculateCompletenessScore(
  entityType: EntityType,
  commonData: Record<string, unknown>,
  attributes: Record<string, unknown>
): number {
  const weights = ENTITY_COMPLETENESS_WEIGHTS[entityType] || ENTITY_COMPLETENESS_WEIGHTS.player;
  const mergedData = { ...commonData, ...attributes };

  let score = 0;

  for (const [field, weight] of Object.entries(weights)) {
    const val = mergedData[field];

    if (val !== undefined && val !== null && val !== "") {
      if (Array.isArray(val)) {
        if (val.length > 0) score += weight;
      } else if (typeof val === "object") {
        if (Object.keys(val).length > 0) score += weight;
      } else {
        score += weight;
      }
    }
  }

  return Math.min(100, Math.max(0, Math.round(score)));
}

/**
 * Menghitung Tier Kelangkaan (Rarity Tier) Kartu TCG sesuai PRD Bagian 7.2
 *
 * 1. ROOKIE: Profil terdaftar dan terisi field dasar (default).
 * 2. CONTENDER: Kelengkapan profil >= 80% DAN memiliki >= 1 relasi aktif terkonfirmasi.
 * 3. ELITE: Memiliki >= 1 prestasi resmi yang telah divalidasi oleh admin PBESI.
 * 4. LEGEND: Memiliki prestasi tingkat provinsi / nasional tervalidasi atau medali PON.
 */
export function calculateRarityTier(params: {
  completenessScore: number;
  confirmedRelationsCount?: number;
  validatedAchievementsCount?: number;
  hasProvincialOrNationalAchievement?: boolean;
}): RarityTier {
  const {
    completenessScore,
    confirmedRelationsCount = 0,
    validatedAchievementsCount = 0,
    hasProvincialOrNationalAchievement = false,
  } = params;

  // Tier 4: Legend (Tertinggi)
  if (validatedAchievementsCount > 0 && hasProvincialOrNationalAchievement) {
    return "legend";
  }

  // Tier 3: Elite
  if (validatedAchievementsCount >= 1) {
    return "elite";
  }

  // Tier 2: Contender
  if (completenessScore >= 80 && confirmedRelationsCount >= 1) {
    return "contender";
  }

  // Tier 1: Rookie (Default awal)
  return "rookie";
}
