/**
 * Layanan Subdomain Core: Catalog
 * Mengambil dan mengelola data game, role, dan rank secara murni dari domain katalog.
 * Tidak memiliki dependensi langsung pada profile, relations, atau verification.
 */

import { CatalogGame, CatalogRank, CatalogRole } from "./types";
import { OFFICIAL_GAMES } from "@/data/games";
import { createAdminClient, createPublicServerClient } from "@/lib/supabase/server";

const inMemoryCatalog = new Map<string, CatalogGame>();

export function clearCatalogStore(): void {
  inMemoryCatalog.clear();
}

export function registerMockGame(game: CatalogGame): void {
  inMemoryCatalog.set(game.id, { ...game });
}

/**
 * Mengambil seluruh game aktif pada katalog
 */
export async function getActiveGames(): Promise<CatalogGame[]> {
  if (inMemoryCatalog.size > 0) {
    return Array.from(inMemoryCatalog.values()).filter((g) => g.isActive);
  }

  const isTest = process.env.NODE_ENV === "test";
  const isPlaceholder = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").includes("placeholder");

  if (isTest || isPlaceholder) {
    return OFFICIAL_GAMES.filter((g) => g.isActive).map((g) => ({
      id: g.id,
      name: g.name,
      slug: g.slug,
      category: g.category || "Esport",
      genre: g.genre,
      platform: [g.platform],
      isActive: g.isActive,
      roles: g.roles,
      ranks: g.ranks || [],
    }));
  }

  try {
    const supabase = createPublicServerClient();
    const { data: games, error } = await (supabase.from("games") as any)
      .select("*")
      .eq("is_active", true)
      .order("name", { ascending: true });

    if (error || !games || games.length === 0) {
      return OFFICIAL_GAMES.filter((g) => g.isActive).map((g) => ({
        id: g.id,
        name: g.name,
        slug: g.slug,
        category: g.category || "Esport",
        genre: g.genre,
        platform: [g.platform],
        isActive: g.isActive,
        roles: g.roles,
        ranks: g.ranks || [],
      }));
    }

    const gameIds = games.map((g: any) => g.id);
    const [rolesRes, ranksRes] = await Promise.all([
      (supabase.from("game_roles") as any).select("*").in("game_id", gameIds).order("sort_order", { ascending: true }),
      (supabase.from("game_ranks") as any).select("*").in("game_id", gameIds).order("sort_order", { ascending: true }),
    ]);

    const rolesByGame = (rolesRes.data || []).reduce((acc: Record<string, string[]>, r: any) => {
      acc[r.game_id] = acc[r.game_id] || [];
      acc[r.game_id].push(r.role_name);
      return acc;
    }, {});

    const ranksByGame = (ranksRes.data || []).reduce((acc: Record<string, string[]>, rk: any) => {
      acc[rk.game_id] = acc[rk.game_id] || [];
      acc[rk.game_id].push(rk.tier_name);
      return acc;
    }, {});

    return games.map((g: any) => ({
      id: g.id,
      name: g.name,
      slug: g.slug,
      category: g.category,
      genre: g.genre,
      platform: Array.isArray(g.platform) ? g.platform : [g.platform],
      isActive: Boolean(g.is_active),
      roles: rolesByGame[g.id] || [],
      ranks: ranksByGame[g.id] || [],
    }));
  } catch (err) {
    console.error("CatalogService getActiveGames error:", err);
    return [];
  }
}

/**
 * Mengambil satu game berdasarkan ID atau slug
 */
export async function getGameByIdOrSlug(idOrSlug: string): Promise<CatalogGame | null> {
  const games = await getActiveGames();
  const match = games.find((g) => g.id === idOrSlug || g.slug === idOrSlug);
  return match || null;
}
