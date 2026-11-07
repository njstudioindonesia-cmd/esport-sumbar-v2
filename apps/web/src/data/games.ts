export interface GameCategory {
  id: string;
  name: string;
  slug: string;
  shortName: string;
  genre: "moba" | "battle_royale" | "fps" | "sports" | "other";
  platform: "mobile" | "pc" | "cross_platform";
  roles: string[];
  ranks?: string[];
  publisher?: string;
  category?: string;
  isActive: boolean;
  customIconUrl?: string | null;
}

export type GameMaster = GameCategory;

/**
 * Baseline baku katalog game ESPORT SUMBAR V3.
 * Tersinkronisasi dengan tabel `games`, `game_roles`, dan `game_ranks` di PostgreSQL.
 * Seluruh logo merek digantikan oleh ikon netral berbasis genre sesuai Mandat 5.4.
 */
export const OFFICIAL_GAMES: GameCategory[] = [
  {
    id: "game-hok",
    name: "Honor of Kings",
    shortName: "HOK",
    slug: "honor-of-kings",
    publisher: "Level Infinite / TiMi Studio",
    category: "MOBA Mobile",
    genre: "moba",
    platform: "mobile",
    isActive: true,
    roles: ["Clash Lane", "Jungle", "Mid Lane", "Farm Lane", "Roam"],
    ranks: ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Master", "Grandmaster", "Mythic", "Epic"],
  },
  {
    id: "game-mlbb",
    name: "Mobile Legends: Bang Bang",
    shortName: "MLBB",
    slug: "mlbb",
    publisher: "Moonton",
    category: "MOBA Mobile",
    genre: "moba",
    platform: "mobile",
    isActive: true,
    roles: ["Gold Lane", "EXP Lane", "Mid Lane", "Jungler", "Roamer"],
    ranks: ["Warrior", "Elite", "Master", "Grandmaster", "Epic", "Legend", "Mythic", "Mythical Honor", "Mythical Glory", "Mythical Immortal"],
  },
  {
    id: "game-ff",
    name: "Free Fire",
    shortName: "Free Fire",
    slug: "free-fire",
    publisher: "Garena",
    category: "Battle Royale Mobile",
    genre: "battle_royale",
    platform: "mobile",
    isActive: true,
    roles: ["Rusher", "Supporter", "Sniper", "Flanker", "IGL"],
    ranks: ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Heroic", "Master", "Grandmaster"],
  },
  {
    id: "game-pubgm",
    name: "PUBG Mobile",
    shortName: "PUBGM",
    slug: "pubgm",
    publisher: "Krafton / Level Infinite",
    category: "Battle Royale Mobile",
    genre: "battle_royale",
    platform: "mobile",
    isActive: true,
    roles: ["IGL", "Assaulter", "Support", "Scout / Sniper"],
    ranks: ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Crown", "Ace", "Ace Master", "Ace Dominator", "Conqueror"],
  },
  {
    id: "game-val",
    name: "Valorant",
    shortName: "Valorant",
    slug: "valorant",
    publisher: "Riot Games",
    category: "Tactical FPS PC",
    genre: "fps",
    platform: "pc",
    isActive: true,
    roles: ["Duelist", "Initiator", "Controller", "Sentinel", "IGL"],
    ranks: ["Iron", "Bronze", "Silver", "Gold", "Platinum", "Diamond", "Ascendant", "Immortal", "Radiant"],
  },
  {
    id: "game-codm",
    name: "Call of Duty: Mobile",
    shortName: "CODM",
    slug: "call-of-duty-mobile",
    publisher: "Activision / Garena",
    category: "FPS Mobile",
    genre: "fps",
    platform: "mobile",
    isActive: true,
    roles: ["Slayer", "Anchor", "Support", "OBJ", "Flex"],
    ranks: ["Rookie", "Veteran", "Elite", "Pro", "Master", "Grandmaster", "Legendary"],
  },
  {
    id: "game-wildrift",
    name: "League of Legends: Wild Rift",
    shortName: "Wild Rift",
    slug: "wild-rift",
    publisher: "Riot Games",
    category: "MOBA Mobile",
    genre: "moba",
    platform: "mobile",
    isActive: true,
    roles: ["Baron Lane", "Jungle", "Mid Lane", "Dragon Lane", "Support"],
    ranks: ["Iron", "Bronze", "Silver", "Gold", "Platinum", "Emerald", "Diamond", "Master", "Grandmaster", "Challenger"],
  },
  {
    id: "game-pokemon",
    name: "Pokémon UNITE",
    shortName: "Pokemon Unite",
    slug: "pokemon-unite",
    publisher: "The Pokémon Company",
    category: "MOBA Cross-Platform",
    genre: "moba",
    platform: "cross_platform",
    isActive: true,
    roles: ["Attacker", "Defender", "Speedster", "All-Rounder", "Supporter"],
    ranks: ["Beginner", "Great", "Expert", "Veteran", "Ultra", "Master"],
  },
  {
    id: "game-cs2",
    name: "Counter-Strike 2",
    shortName: "CS2",
    slug: "counter-strike-2",
    publisher: "Valve",
    category: "Tactical FPS PC",
    genre: "fps",
    platform: "pc",
    isActive: true,
    roles: ["Entry Fragger", "AWPer", "Support", "Lurker", "IGL"],
    ranks: ["Silver", "Gold Nova", "Master Guardian", "DMG", "Legendary Eagle", "Supreme", "Global Elite"],
  },
  {
    id: "game-dota2",
    name: "Dota 2",
    shortName: "Dota 2",
    slug: "dota-2",
    publisher: "Valve",
    category: "MOBA PC",
    genre: "moba",
    platform: "pc",
    isActive: true,
    roles: ["Carry (Pos 1)", "Midlaner (Pos 2)", "Offlaner (Pos 3)", "Soft Support (Pos 4)", "Hard Support (Pos 5)"],
    ranks: ["Herald", "Guardian", "Crusader", "Archon", "Legend", "Ancient", "Divine", "Immortal"],
  },
  {
    id: "game-efootball",
    name: "eFootball / FC Mobile",
    shortName: "eFootball",
    slug: "efootball",
    publisher: "Konami / EA Sports",
    category: "Sports Simulation",
    genre: "sports",
    platform: "cross_platform",
    isActive: true,
    roles: ["Solo Player", "Duo / Co-op"],
    ranks: ["Divisi 10", "Divisi 9", "Divisi 8", "Divisi 7", "Divisi 6", "Divisi 5", "Divisi 4", "Divisi 3", "Divisi 2", "Divisi 1"],
  },
];

export const MASTER_GAMES = OFFICIAL_GAMES;

/**
 * Mencari data game berdasarkan ID atau slug.
 */
export function findGameByIdOrSlug(identifier?: string | null): GameCategory | undefined {
  if (!identifier) return undefined;
  const clean = identifier.trim().toLowerCase();
  return OFFICIAL_GAMES.find((g) => g.id.toLowerCase() === clean || g.slug.toLowerCase() === clean);
}

/**
 * Helper nama genre yang mudah dipahami publik.
 */
export function getGenreLabel(genre: GameCategory["genre"]): string {
  switch (genre) {
    case "moba":
      return "MOBA";
    case "battle_royale":
      return "Battle Royale";
    case "fps":
      return "Tactical Shooter";
    case "sports":
      return "Olahraga Elektronik";
    default:
      return "Esport Game";
  }
}
