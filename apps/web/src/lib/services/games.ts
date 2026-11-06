import { createClient } from "@/lib/supabase/server";
import { OFFICIAL_GAMES, GameCategory } from "@/data/games";

export interface DynamicGameWithDetails extends GameCategory {
  rolesList: { id: string; roleName: string; description: string | null; sortOrder: number }[];
  ranksList: { id: string; tierName: string; tierLevel: number; sortOrder: number }[];
}

/**
 * Mengambil katalog game aktif secara dinamis dari database.
 * Mendukung fallback ke in-memory OFFICIAL_GAMES jika database offline/placeholder.
 */
export async function getGamesCatalog(): Promise<DynamicGameWithDetails[]> {
  try {
    const supabase = await createClient();
    const { data: games, error } = await supabase
      .from("games")
      .select("id, name, short_name, slug, publisher, category, genre, platform, is_active")
      .eq("is_active", true)
      .order("name", { ascending: true });

    if (error || !games || games.length === 0) {
      return OFFICIAL_GAMES.map((og) => ({
        ...og,
        rolesList: og.roles.map((r, i) => ({ id: `${og.id}-role-${i}`, roleName: r, description: null, sortOrder: i + 1 })),
        ranksList: (og.ranks || []).map((rk, i) => ({ id: `${og.id}-rank-${i}`, tierName: rk, tierLevel: i + 1, sortOrder: i + 1 })),
      }));
    }

    // Ambil roles dan ranks secara paralel
    const gameIds = games.map((g) => g.id);
    const [rolesRes, ranksRes] = await Promise.all([
      supabase.from("game_roles").select("id, game_id, role_name, description, sort_order").in("game_id", gameIds).order("sort_order", { ascending: true }),
      supabase.from("game_ranks").select("id, game_id, tier_name, tier_level, sort_order").in("game_id", gameIds).order("sort_order", { ascending: true }),
    ]);

    const rolesByGame = (rolesRes.data || []).reduce((acc: Record<string, any[]>, r) => {
      acc[r.game_id] = acc[r.game_id] || [];
      acc[r.game_id].push({
        id: r.id,
        roleName: r.role_name,
        description: r.description,
        sortOrder: r.sort_order,
      });
      return acc;
    }, {});

    const ranksByGame = (ranksRes.data || []).reduce((acc: Record<string, any[]>, rk) => {
      acc[rk.game_id] = acc[rk.game_id] || [];
      acc[rk.game_id].push({
        id: rk.id,
        tierName: rk.tier_name,
        tierLevel: rk.tier_level,
        sortOrder: rk.sort_order,
      });
      return acc;
    }, {});

    return games.map((g) => {
      const dbRoles = rolesByGame[g.id] || [];
      const dbRanks = ranksByGame[g.id] || [];
      const baseline = OFFICIAL_GAMES.find((og) => og.id === g.id);

      const finalRolesList = dbRoles.length > 0
        ? dbRoles
        : (baseline?.roles || []).map((r, i) => ({ id: `${g.id}-role-${i}`, roleName: r, description: null, sortOrder: i + 1 }));

      const finalRanksList = dbRanks.length > 0
        ? dbRanks
        : (baseline?.ranks || []).map((rk, i) => ({ id: `${g.id}-rank-${i}`, tierName: rk, tierLevel: i + 1, sortOrder: i + 1 }));

      return {
        id: g.id,
        name: g.name,
        shortName: g.short_name,
        slug: g.slug,
        publisher: g.publisher || undefined,
        category: g.category || undefined,
        genre: (g.genre as any) || baseline?.genre || "other",
        platform: (g.platform as any) || baseline?.platform || "mobile",
        isActive: g.is_active,
        roles: finalRolesList.map((r: any) => r.roleName),
        ranks: finalRanksList.map((rk: any) => rk.tierName),
        rolesList: finalRolesList,
        ranksList: finalRanksList,
      };
    });
  } catch {
    return OFFICIAL_GAMES.map((og) => ({
      ...og,
      rolesList: og.roles.map((r, i) => ({ id: `${og.id}-role-${i}`, roleName: r, description: null, sortOrder: i + 1 })),
      ranksList: (og.ranks || []).map((rk, i) => ({ id: `${og.id}-rank-${i}`, tierName: rk, tierLevel: i + 1, sortOrder: i + 1 })),
    }));
  }
}

/**
 * Mengambil detail game beserta role dan rank berdasarkan ID.
 */
export async function getGameById(gameId: string): Promise<DynamicGameWithDetails | null> {
  const catalog = await getGamesCatalog();
  return catalog.find((g) => g.id === gameId || g.slug === gameId) || null;
}
