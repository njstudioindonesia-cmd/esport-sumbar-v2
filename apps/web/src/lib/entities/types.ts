import { z } from "zod";
import type { EntityType, RarityTier, VerificationStatus } from "@/lib/supabase/database.types";

// ==============================================================================
// 1. TIPE ATRIBUT KHUSUS UNTUK KE-7 BIDANG ENTITAS
// ==============================================================================

export interface PlayerAttributes {
  ign: string;
  game_id: string;
  role: string;
  rank?: string;
  game_account_id?: string; // privat default
  year_started?: number;
  is_looking_for_team?: boolean;
  social_media?: {
    instagram?: string;
    youtube?: string;
    tiktok?: string;
    x?: string;
  };
}

export interface CoachCertification {
  title: string;
  issuer: string;
  year?: number;
}

export interface CoachAttributes {
  game_specialization: string[];
  experience_years: number;
  certifications?: CoachCertification[];
  coaching_philosophy?: string; // maks 140 karakter
  is_active_coaching: boolean;
  social_media?: {
    instagram?: string;
    youtube?: string;
    linkedin?: string;
  };
}

export interface TeamAttributes {
  team_name: string;
  team_tag: string; // 2-5 huruf kapital
  game_division: string;
  founded_year: number;
  recruitment_status: {
    isOpen: boolean;
    rolesNeeded?: string[];
  };
  homebase: string;
  social_media?: {
    instagram?: string;
    youtube?: string;
    tiktok?: string;
  };
}

export interface CommunityLeader {
  name: string;
  title: string;
  isApproved: boolean;
}

export interface CommunityAttributes {
  game_focus: string[];
  founded_year: number;
  estimated_members: number;
  activity_frequency: "mingguan" | "dua_mingguan" | "bulanan" | "insidental";
  coverage_area: string; // kota/kab, antar-wilayah, provinsi
  leadership?: CommunityLeader[];
  public_group_link?: string;
  official_contact?: string; // privat default
}

export interface VenueOperatingHours {
  open: string;
  close: string;
  days: string;
}

export interface VenueHardwareSpecs {
  cpu?: string;
  gpu?: string;
  monitor?: string;
  internet_mbps?: number;
}

export interface VenueAttributes {
  venue_type: "warnet" | "icafe" | "warkop_gaming" | "arena" | "bootcamp";
  business_address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  capacity_units: number;
  facilities: string[];
  hardware_specs?: VenueHardwareSpecs;
  operating_hours?: VenueOperatingHours;
  starting_rate?: number;
  is_tournament_ready: boolean;
  business_contact?: string;
}

export interface CampusAttributes {
  campus_name: string;
  esport_club_name: string;
  faculty_or_level?: string;
  advisor_name?: string;
  leader_name?: string;
  member_count: number;
  coached_games: string[];
  founded_year: number;
}

export interface SchoolAttributes {
  school_name: string;
  education_level: "SMP" | "MTs" | "SMA" | "SMK" | "MA";
  extracurricular_name: string;
  advisor_name?: string;
  student_count: number; // hanya angka, daftar nama tidak pernah tampil publik
  coached_games: string[];
}

// Union tipe seluruh atribut entitas
export type EntityAttributesMap = {
  player: PlayerAttributes;
  coach: CoachAttributes;
  team: TeamAttributes;
  community: CommunityAttributes;
  venue: VenueAttributes;
  campus: CampusAttributes;
  school: SchoolAttributes;
  organizer: Record<string, unknown>;
};

// ==============================================================================
// 2. DEFINISI BIDANG TUNGGAL (SINGLE SOURCE OF TRUTH)
// ==============================================================================

export interface EntityFieldDefinition {
  name: string;
  label: string;
  type: "text" | "number" | "select" | "multiselect" | "boolean" | "textarea" | "chips";
  placeholder?: string;
  required?: boolean;
  isPrivateByDefault?: boolean;
  weight: number; // Bobot untuk skor kelengkapan (0-100)
  options?: { value: string; label: string }[];
}

export interface EntityDefinition<T extends EntityType = EntityType> {
  type: T;
  code: string; // PL, CO, TM, CM, VN, CP, SC
  label: string;
  singularLabel: string;
  description: string;
  badgeColor: string;
  accentGradient: string;
  defaultRarity: RarityTier;
  defaultVisibility: Record<string, boolean>;
  fields: EntityFieldDefinition[];
  schema: z.ZodType<any>;
}
