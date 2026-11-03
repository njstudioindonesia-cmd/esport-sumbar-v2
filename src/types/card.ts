export type CardRarity = "rookie" | "contender" | "elite" | "legend";

export type CardVerification =
  | "unverified"
  | "regional"
  | "verified"
  | "suspended"
  | "reverify";

export type CardSize = "sm" | "md" | "lg";

export interface CardAchievement {
  title: string;
  level: "kota" | "provinsi" | "nasional" | "lainnya";
  placement: string;
  year: string;
  isValidated?: boolean;
}

export interface CardTeamHistory {
  teamName: string;
  period: string;
  role: string;
}

export interface PlayerCardData {
  ign: string;
  displayName: string;
  avatarUrl: string;
  game: string;
  gameIcon?: string;
  role: string;
  team?: {
    name: string;
    logoUrl?: string;
  };
  region: {
    name: string;
    code: string; // e.g. "PDG", "PDP", "BKT", "SLK"
  };
  esportId: string; // e.g. "ESB-PDG-PL-000124"
  badgeNumber?: string; // e.g. "ESI-SB-2026-0042"
  achievements?: CardAchievement[];
  history?: CardTeamHistory[];
  joinedAt?: string;
}

export interface EsportCardProps {
  rarity: CardRarity;
  verification: CardVerification;
  data: PlayerCardData;
  size?: CardSize;
  interactive?: boolean;
  className?: string;
  initialFlipped?: boolean;
}
