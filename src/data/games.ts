export interface GameCategory {
  id: string;
  name: string;
  slug: string;
  shortName: string;
  roles: string[];
  publisher?: string;
  category?: string;
  isActive?: boolean;
}

export type GameMaster = GameCategory;

export const OFFICIAL_GAMES: GameCategory[] = [
  {
    id: "game-mlbb",
    name: "Mobile Legends: Bang Bang",
    shortName: "MLBB",
    slug: "mlbb",
    publisher: "Moonton",
    category: "MOBA Mobile",
    isActive: true,
    roles: ["Roamer", "Mid Laner", "Gold Laner", "EXP Laner", "Jungler"],
  },
  {
    id: "game-ff",
    name: "Free Fire",
    shortName: "Free Fire",
    slug: "free-fire",
    publisher: "Garena",
    category: "Battle Royale Mobile",
    isActive: true,
    roles: ["Rusher", "Sniper", "Support", "Shotcaller / IGL"],
  },
  {
    id: "game-pubgm",
    name: "PUBG Mobile",
    shortName: "PUBGM",
    slug: "pubgm",
    publisher: "Tencent / Level Infinite",
    category: "Battle Royale Mobile",
    isActive: true,
    roles: ["IGL", "Rusher", "Sniper", "Support", "Scout"],
  },
  {
    id: "game-val",
    name: "Valorant",
    shortName: "Valorant",
    slug: "valorant",
    publisher: "Riot Games",
    category: "Tactical Shooter PC",
    isActive: true,
    roles: ["Duelist", "Initiator", "Controller", "Sentinel", "Flex"],
  },
  {
    id: "game-efootball",
    name: "eFootball / FC Mobile",
    shortName: "eFootball",
    slug: "efootball",
    publisher: "Konami / EA Sports",
    category: "Sports Simulation",
    isActive: true,
    roles: ["Solo Player", "Duo / Co-op"],
  },
];

export const MASTER_GAMES = OFFICIAL_GAMES;
