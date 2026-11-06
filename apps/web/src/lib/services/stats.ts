import { createPublicServerClient } from "@/lib/supabase/server";
import { FLAGS } from "@/lib/config/flags";
import { getDirectoryStats } from "@/lib/services/directory";

export interface PlatformStats {
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
}

export interface RegionMapStat {
  regionId: string;
  regionName: string;
  regionCode: string;
  regionSlug: string;
  type: "kota" | "kabupaten";
  totalEntities: number;
  players: number;
  teams: number;
  venues: number;
  verified: number;
}

/**
 * Mengambil ringkasan statistik platform dihitung dari view `public_profiles`
 */
export async function getPlatformStats(): Promise<PlatformStats> {
  // JALUR MIKROLAYANAN DIREKTORI (Sub-langkah 7.3)
  if (FLAGS.USE_DIRECTORY_SERVICE) {
    const dirStats = await getDirectoryStats();
    if (dirStats.totalEntities > 0 || !FLAGS.SHOW_DEMO_DATA) {
      return {
        totalEntities: dirStats.totalEntities,
        totalPlayers: dirStats.totalPlayers,
        totalCoaches: dirStats.totalCoaches,
        totalTeams: dirStats.totalTeams,
        totalCommunities: dirStats.totalCommunities,
        totalVenues: dirStats.totalVenues,
        totalCampuses: dirStats.totalCampuses,
        totalSchools: dirStats.totalSchools,
        activeRegions: dirStats.activeRegions,
        verifiedCount: dirStats.verifiedCount,
      };
    }
  }

  try {
    const supabase = createPublicServerClient();
    let query = supabase.from("public_profiles").select("entity_type, region_code, verification_status, is_demo");

    if (!FLAGS.SHOW_DEMO_DATA) {
      query = query.eq("is_demo", false);
    }

    const { data, error } = await query;

    if (!error && data) {
      const stats: PlatformStats = {
        totalEntities: data.length,
        totalPlayers: data.filter((d) => d.entity_type === "player").length,
        totalCoaches: data.filter((d) => d.entity_type === "coach").length,
        totalTeams: data.filter((d) => d.entity_type === "team").length,
        totalCommunities: data.filter((d) => d.entity_type === "community").length,
        totalVenues: data.filter((d) => d.entity_type === "venue").length,
        totalCampuses: data.filter((d) => d.entity_type === "campus").length,
        totalSchools: data.filter((d) => d.entity_type === "school").length,
        activeRegions: new Set(data.map((d) => d.region_code).filter(Boolean)).size,
        verifiedCount: data.filter((d) => d.verification_status === "verified").length,
      };

      return stats;
    }
  } catch (err) {
    console.warn("Database stats query warning (falling back to baseline numbers):", err);
  }

  // Baseline realistis jika database belum terisi atau anon client offline
  return {
    totalEntities: 0,
    totalPlayers: 0,
    totalCoaches: 0,
    totalTeams: 0,
    totalCommunities: 0,
    totalVenues: 0,
    totalCampuses: 0,
    totalSchools: 0,
    activeRegions: 19,
    verifiedCount: 0,
  };
}

/**
 * Mengambil statistik per-wilayah untuk visualisasi peta Sumatera Barat
 */
export async function getRegionMapStats(): Promise<Record<string, RegionMapStat>> {
  const result: Record<string, RegionMapStat> = {};

  try {
    const supabase = createPublicServerClient();

    // Ambil data wilayah master
    const { data: regionsData } = await supabase
      .from("regions")
      .select("id, name, code, slug, type")
      .order("name");

    // Ambil data profil
    let profilesQuery = supabase
      .from("public_profiles")
      .select("region_id, region_code, entity_type, verification_status, is_demo");

    if (!FLAGS.SHOW_DEMO_DATA) {
      profilesQuery = profilesQuery.eq("is_demo", false);
    }

    const { data: profilesData } = await profilesQuery;

    if (regionsData) {
      for (const reg of regionsData) {
        const regProfiles = (profilesData || []).filter(
          (p) => p.region_id === reg.id || p.region_code === reg.code
        );

        result[reg.code] = {
          regionId: reg.id,
          regionName: reg.name,
          regionCode: reg.code,
          regionSlug: reg.slug,
          type: reg.type,
          totalEntities: regProfiles.length,
          players: regProfiles.filter((p) => p.entity_type === "player").length,
          teams: regProfiles.filter((p) => p.entity_type === "team").length,
          venues: regProfiles.filter((p) => p.entity_type === "venue").length,
          verified: regProfiles.filter((p) => p.verification_status === "verified").length,
        };
      }
      return result;
    }
  } catch (err) {
    console.warn("Region map stats query warning:", err);
  }

  return result;
}
