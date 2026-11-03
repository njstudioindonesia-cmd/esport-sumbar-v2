export interface GameCategory {
  id: string;
  name: string;
  slug: string;
  shortName: string;
  roles: string[];
}

export const OFFICIAL_GAMES: GameCategory[] = [
  {
    id: "game-mlbb",
    name: "Mobile Legends: Bang Bang",
    shortName: "MLBB",
    slug: "mlbb",
    roles: ["Roamer", "Mid Laner", "Gold Laner", "EXP Laner", "Jungler"],
  },
  {
    id: "game-ff",
    name: "Free Fire",
    shortName: "Free Fire",
    slug: "free-fire",
    roles: ["Rusher", "Sniper", "Support", "Shotcaller / IGL"],
  },
  {
    id: "game-pubgm",
    name: "PUBG Mobile",
    shortName: "PUBGM",
    slug: "pubgm",
    roles: ["IGL", "Rusher", "Sniper", "Support", "Scout"],
  },
  {
    id: "game-val",
    name: "Valorant",
    shortName: "Valorant",
    slug: "valorant",
    roles: ["Duelist", "Initiator", "Controller", "Sentinel", "Flex"],
  },
  {
    id: "game-efootball",
    name: "eFootball / FC Mobile",
    shortName: "eFootball",
    slug: "efootball",
    roles: ["Solo Player", "Duo / Co-op"],
  },
];
