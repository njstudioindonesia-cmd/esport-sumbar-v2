export type CardVerification =
  | "verified"
  | "prov_verified"
  | "suspended"
  | "reverify"
  | "unverified";

export function mapVerificationToCard(status?: string | null): CardVerification {
  if (status === "verified" || status === "prov_verified") return "verified";
  if (status === "suspended") return "suspended";
  if (
    status === "reverify" ||
    status === "under_review" ||
    status === "submitted" ||
    status === "revision_requested"
  ) {
    return "reverify";
  }
  return "unverified";
}

export type CardSize = "sm" | "md" | "lg" | "mobile" | "fluid";

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

export type CardEntityType =
  | "player"
  | "team"
  | "coach"
  | "referee"
  | "caster"
  | "organizer"
  | "media"
  | "brand"
  | "community";

export type CardRarity = "standard" | "bronze" | "silver" | "gold" | "diamond";

export interface UnifiedCardData {
  id: string;
  name: string;
  ign: string;
  esportId: string;
  entityType: CardEntityType;
  rarity?: CardRarity;
  game: string;
  role: string;
  region: string;
  regionCode?: string;
  photoUrl?: string;
  stats?: {
    label: string;
    value: string | number;
  }[];
  verificationStatus?: CardVerification;
  customTierLabel?: string;
  teamHistory?: CardTeamHistory[];
  achievements?: CardAchievement[];
  verifiedAt?: string;
  isProvincial?: boolean;
  division?: string;
}
