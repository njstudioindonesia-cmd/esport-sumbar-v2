import { createClient, createAdminClient, createPublicServerClient } from "@/lib/supabase/server";
import type { EntityType } from "@/lib/supabase/database.types";

export interface RelationRuleItem {
  id: string;
  sourceEntityType: EntityType;
  targetEntityType: EntityType;
  relationType: string;
  requiresApproval: boolean;
  maxActiveLimit: number;
  gameMatchRequired: boolean;
  isActive: boolean;
}

export interface ActiveRelationItem {
  id: string;
  relationType: string;
  gameId: string | null;
  status: "pending" | "active" | "rejected" | "cancelled" | "expired" | "ended";
  startedAt: string | null;
  endedAt: string | null;
  createdAt: string;
  otherProfile: {
    id: string;
    displayName: string;
    ign: string | null;
    entityType: EntityType;
    esportId: string;
    slug: string;
    avatarUrl: string | null;
    mainGameId: string | null;
    regionId: string;
    rarityTier: string;
    verificationStatus: string;
  };
  direction: "outgoing" | "incoming";
}

/**
 * Mengambil daftar aturan relasi aktif dari pangkalan data.
 */
export async function getRelationRules(): Promise<RelationRuleItem[]> {
  const supabase = createPublicServerClient();
  const { data, error } = await supabase
    .from("relation_rules")
    .select("*")
    .eq("is_active", true);

  if (error || !data) return [];

  return data.map((r: any) => ({
    id: r.id,
    sourceEntityType: r.source_entity_type as EntityType,
    targetEntityType: r.target_entity_type as EntityType,
    relationType: r.relation_type,
    requiresApproval: r.requires_approval,
    maxActiveLimit: r.max_active_limit,
    gameMatchRequired: r.game_match_required,
    isActive: r.is_active,
  }));
}

/**
 * Mengambil hubungan aktif untuk profil publik tertentu, dikelompokkan berdasarkan tipe hubungan.
 * Menjamin zero data privat bocor (hanya kolom publik).
 */
export async function getPublicProfileRelations(profileId: string): Promise<Record<string, ActiveRelationItem[]>> {
  const supabase = createPublicServerClient();

  const [outgoingRes, incomingRes] = await Promise.all([
    supabase
      .from("entity_relations")
      .select(`
        id, relation_type, game_id, status, started_at, ended_at, created_at,
        target_profile:profiles!entity_relations_target_profile_id_fkey(
          id, display_name, ign, entity_type, esport_id, slug, avatar_url, main_game_id, region_id, rarity_tier, verification_status
        )
      `)
      .eq("source_profile_id", profileId)
      .eq("status", "active"),
    supabase
      .from("entity_relations")
      .select(`
        id, relation_type, game_id, status, started_at, ended_at, created_at,
        source_profile:profiles!entity_relations_source_profile_id_fkey(
          id, display_name, ign, entity_type, esport_id, slug, avatar_url, main_game_id, region_id, rarity_tier, verification_status
        )
      `)
      .eq("target_profile_id", profileId)
      .eq("status", "active"),
  ]);

  const grouped: Record<string, ActiveRelationItem[]> = {};

  (outgoingRes.data || []).forEach((row: any) => {
    if (!row.target_profile) return;
    const item: ActiveRelationItem = {
      id: row.id,
      relationType: row.relation_type,
      gameId: row.game_id,
      status: row.status,
      startedAt: row.started_at,
      endedAt: row.ended_at,
      createdAt: row.created_at,
      otherProfile: row.target_profile,
      direction: "outgoing",
    };
    grouped[row.relation_type] = grouped[row.relation_type] || [];
    grouped[row.relation_type].push(item);
  });

  (incomingRes.data || []).forEach((row: any) => {
    if (!row.source_profile) return;
    const item: ActiveRelationItem = {
      id: row.id,
      relationType: row.relation_type,
      gameId: row.game_id,
      status: row.status,
      startedAt: row.started_at,
      endedAt: row.ended_at,
      createdAt: row.created_at,
      otherProfile: row.source_profile,
      direction: "incoming",
    };
    grouped[row.relation_type] = grouped[row.relation_type] || [];
    grouped[row.relation_type].push(item);
  });

  return grouped;
}

/**
 * Mengambil dasbor ekosistem pengguna terautentikasi (masuk, keluar, aktif, riwayat).
 */
export async function getUserEcosystem(profileId: string) {
  const supabase = await createClient();

  const { data: allRelations, error } = await supabase
    .from("entity_relations")
    .select(`
      id, relation_type, game_id, status, started_at, ended_at, created_at,
      source_profile_id, target_profile_id, rejection_reason,
      source_profile:profiles!entity_relations_source_profile_id_fkey(
        id, display_name, ign, entity_type, esport_id, slug, avatar_url, main_game_id, region_id, rarity_tier, verification_status
      ),
      target_profile:profiles!entity_relations_target_profile_id_fkey(
        id, display_name, ign, entity_type, esport_id, slug, avatar_url, main_game_id, region_id, rarity_tier, verification_status
      )
    `)
    .or(`source_profile_id.eq.${profileId},target_profile_id.eq.${profileId}`)
    .order("created_at", { ascending: false });

  if (error || !allRelations) {
    return {
      incomingPending: [],
      outgoingPending: [],
      active: [],
      history: [],
    };
  }

  const incomingPending: any[] = [];
  const outgoingPending: any[] = [];
  const active: any[] = [];
  const history: any[] = [];

  allRelations.forEach((r: any) => {
    const isSource = r.source_profile_id === profileId;
    const otherProfile = isSource ? r.target_profile : r.source_profile;
    if (!otherProfile) return;

    const formatted = {
      id: r.id,
      relationType: r.relation_type,
      gameId: r.game_id,
      status: r.status,
      isSource,
      startedAt: r.started_at,
      endedAt: r.ended_at,
      createdAt: r.created_at,
      rejectionReason: r.rejection_reason,
      otherProfile,
    };

    if (r.status === "pending") {
      if (isSource) {
        outgoingPending.push(formatted);
      } else {
        incomingPending.push(formatted);
      }
    } else if (r.status === "active") {
      active.push(formatted);
    } else {
      history.push(formatted);
    }
  });

  return { incomingPending, outgoingPending, active, history };
}

/**
 * Menghitung metrik ringkasan ekosistem seluruh Sumatera Barat.
 */
export async function getEcosystemStats() {
  const supabase = createPublicServerClient();

  const [
    { count: totalActiveRelations },
    { count: totalTeams },
    { count: totalCommunities },
    { count: totalVenues },
    { count: totalSchools },
    { count: totalCampuses },
    { count: totalPlayers },
  ] = await Promise.all([
    supabase.from("entity_relations").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("entity_type", "team"),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("entity_type", "community"),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("entity_type", "venue"),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("entity_type", "school"),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("entity_type", "campus"),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("entity_type", "player"),
  ]);

  return {
    totalActiveRelations: totalActiveRelations || 0,
    totalTeams: totalTeams || 0,
    totalCommunities: totalCommunities || 0,
    totalVenues: totalVenues || 0,
    totalSchools: totalSchools || 0,
    totalCampuses: totalCampuses || 0,
    totalPlayers: totalPlayers || 0,
  };
}
