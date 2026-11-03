export type CardEntityType = "player" | "coach" | "team";

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
  level: "kota" | "provinsi" | "nasional" | "internasional" | "lainnya";
  placement: string;
  year: string;
  isValidated?: boolean;
}

export interface CardTeamHistory {
  teamName: string;
  period: string;
  role: string;
}

export interface TeamRosterMember {
  ign: string;
  role: string;
  avatarUrl?: string;
}

export interface UnifiedCardData {
  // Identifiers
  esportId: string; // e.g. ESB-PDG-PL-000124 or ESB-BKT-CO-000012 or ESB-PDG-TM-000005
  badgeNumber?: string;
  region: {
    name: string;
    code: string;
  };
  game: string; // Main game / Division game / Specialization game

  // Player / Coach specific
  ign?: string;
  displayName: string;
  avatarUrl?: string;
  role?: string; // Player role (e.g. Roamer) or Coach role (e.g. Head Coach / Tactical Analyst)

  // Team relationship
  team?: {
    name: string;
    logoUrl?: string;
  };

  // Coach specific
  certification?: {
    isCertified: boolean;
    name: string;
    issuer: string;
    year?: string;
  };

  // Team specific
  teamName?: string;
  teamTag?: string;
  logoUrl?: string;
  homebase?: string;
  captainOrManager?: {
    name: string;
    role: "Kapten" | "Manajer";
  };
  rosterCount?: {
    current: number;
    max: number;
  };
  rosterMembers?: TeamRosterMember[];
  coachName?: string;

  // Track record & Backside
  achievements?: CardAchievement[];
  history?: CardTeamHistory[]; // Teams played in OR teams coached
  certificationsList?: string[]; // Coach certifications
  joinedAt?: string;
  foundedAt?: string;
}

export interface EsportCardProps {
  type?: CardEntityType;
  rarity: CardRarity;
  verification: CardVerification;
  data: UnifiedCardData;
  size?: CardSize;
  interactive?: boolean;
  className?: string;
  initialFlipped?: boolean;
}
