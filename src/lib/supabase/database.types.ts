export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type AccountRole = "user" | "region_admin" | "prov_admin" | "platform_operator";
export type EntityType = "player" | "coach" | "team" | "community" | "venue" | "campus" | "school" | "organizer";
export type VerificationStatus =
  | "unverified"
  | "draft"
  | "submitted"
  | "in_review_regional"
  | "regional_checked"
  | "in_review_provincial"
  | "verified"
  | "revision_requested"
  | "rejected"
  | "suspended";
export type RarityTier = "rookie" | "contender" | "elite" | "legend";
export type MembershipStatus = "pending" | "accepted" | "declined" | "ended";
export type AchievementLevel = "kota" | "provinsi" | "nasional" | "internasional" | "lainnya";

export interface Database {
  public: {
    Tables: {
      regions: {
        Row: {
          id: string;
          name: string;
          code: string;
          type: "kota" | "kabupaten";
          slug: string;
          logo_url: string | null;
          esi_contact_name: string | null;
          esi_secretariat: string | null;
          description: string | null;
          admin_mode: "active" | "fallback";
          is_pilot: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          code: string;
          type: "kota" | "kabupaten";
          slug: string;
          logo_url?: string | null;
          esi_contact_name?: string | null;
          esi_secretariat?: string | null;
          description?: string | null;
          admin_mode?: "active" | "fallback";
          is_pilot?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["regions"]["Insert"]>;
      };
      accounts: {
        Row: {
          id: string;
          email: string;
          role: AccountRole;
          assigned_region_id: string | null;
          birth_date: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role?: AccountRole;
          assigned_region_id?: string | null;
          birth_date?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["accounts"]["Insert"]>;
      };
      guardian_consents: {
        Row: {
          id: string;
          account_id: string;
          guardian_name: string;
          guardian_contact: string;
          guardian_relationship: string;
          consent_version: string;
          consented_at: string;
          ip_address: string | null;
        };
        Insert: {
          id?: string;
          account_id: string;
          guardian_name: string;
          guardian_contact: string;
          guardian_relationship?: string;
          consent_version?: string;
          consented_at?: string;
          ip_address?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["guardian_consents"]["Insert"]>;
      };
      games: {
        Row: {
          id: string;
          name: string;
          short_name: string;
          slug: string;
          publisher: string | null;
          category: string | null;
          roles_jsonb: Json;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          short_name: string;
          slug: string;
          publisher?: string | null;
          category?: string | null;
          roles_jsonb?: Json;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["games"]["Insert"]>;
      };
      profiles: {
        Row: {
          id: string;
          account_id: string;
          entity_type: EntityType;
          esport_id: string;
          slug: string;
          display_name: string;
          ign: string | null;
          region_id: string;
          main_game_id: string | null;
          role_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          metadata_jsonb: Json;
          visibility_jsonb: Json;
          verification_status: VerificationStatus;
          verified_at: string | null;
          verification_expires_at: string | null;
          verified_badge_no: string | null;
          rarity_tier: RarityTier;
          completeness_score: number;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          account_id: string;
          entity_type: EntityType;
          esport_id: string;
          slug: string;
          display_name: string;
          ign?: string | null;
          region_id: string;
          main_game_id?: string | null;
          role_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          metadata_jsonb?: Json;
          visibility_jsonb?: Json;
          verification_status?: VerificationStatus;
          verified_at?: string | null;
          verification_expires_at?: string | null;
          verified_badge_no?: string | null;
          rarity_tier?: RarityTier;
          completeness_score?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      memberships: {
        Row: {
          id: string;
          member_profile_id: string;
          org_profile_id: string;
          role_in_org: string;
          status: MembershipStatus;
          initiated_by: "member" | "org";
          started_at: string | null;
          ended_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          member_profile_id: string;
          org_profile_id: string;
          role_in_org: string;
          status?: MembershipStatus;
          initiated_by: "member" | "org";
          started_at?: string | null;
          ended_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["memberships"]["Insert"]>;
      };
      achievements: {
        Row: {
          id: string;
          profile_id: string;
          title: string;
          level: AchievementLevel;
          placement: string;
          event_name: string;
          event_date: string | null;
          evidence_url: string | null;
          validation_status: "pending" | "validated" | "rejected";
          validated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          title: string;
          level: AchievementLevel;
          placement: string;
          event_name: string;
          event_date?: string | null;
          evidence_url?: string | null;
          validation_status?: "pending" | "validated" | "rejected";
          validated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["achievements"]["Insert"]>;
      };
      verification_requests: {
        Row: {
          id: string;
          profile_id: string;
          status: VerificationStatus;
          region_id: string;
          submitted_at: string;
          decided_at: string | null;
          current_reviewer_id: string | null;
          notes: string | null;
          revision_fields_jsonb: Json;
          evidence_files: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          status: VerificationStatus;
          region_id: string;
          submitted_at?: string;
          decided_at?: string | null;
          current_reviewer_id?: string | null;
          notes?: string | null;
          revision_fields_jsonb?: Json;
          evidence_files?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["verification_requests"]["Insert"]>;
      };
      audit_logs: {
        Row: {
          id: string;
          occurred_at: string;
          actor_account_id: string | null;
          actor_role: string;
          actor_ip: string | null;
          region_id: string | null;
          action: string;
          target_type: string;
          target_id: string;
          previous_status: string | null;
          new_status: string | null;
          reason: string;
          metadata_jsonb: Json;
        };
        Insert: {
          id?: string;
          occurred_at?: string;
          actor_account_id?: string | null;
          actor_role: string;
          actor_ip?: string | null;
          region_id?: string | null;
          action: string;
          target_type: string;
          target_id: string;
          previous_status?: string | null;
          new_status?: string | null;
          reason: string;
          metadata_jsonb?: Json;
        };
        Update: never; // Append-only! No updates allowed!
      };
      articles: {
        Row: {
          id: string;
          title: string;
          slug: string;
          summary: string | null;
          content: string;
          category: string;
          cover_image_url: string | null;
          region_id: string | null;
          author_id: string | null;
          status: "draft" | "published" | "archived";
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          summary?: string | null;
          content: string;
          category: string;
          cover_image_url?: string | null;
          region_id?: string | null;
          author_id?: string | null;
          status?: "draft" | "published" | "archived";
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["articles"]["Insert"]>;
      };
      notifications_queue: {
        Row: {
          id: string;
          account_id: string;
          type: string;
          payload_jsonb: Json;
          status: "pending" | "processing" | "sent" | "failed";
          sent_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          account_id: string;
          type: string;
          payload_jsonb?: Json;
          status?: "pending" | "processing" | "sent" | "failed";
          sent_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["notifications_queue"]["Insert"]>;
      };
      reports: {
        Row: {
          id: string;
          reporter_account_id: string | null;
          target_profile_id: string;
          category: string;
          reason: string;
          evidence_urls: Json;
          status: "pending" | "under_review" | "forwarded_to_esi" | "resolved" | "dismissed";
          resolved_by: string | null;
          resolution_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          reporter_account_id?: string | null;
          target_profile_id: string;
          category: string;
          reason: string;
          evidence_urls?: Json;
          status?: "pending" | "under_review" | "forwarded_to_esi" | "resolved" | "dismissed";
          resolved_by?: string | null;
          resolution_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["reports"]["Insert"]>;
      };
    };
    Functions: {
      transition_verification: {
        Args: {
          p_request_id: string;
          p_new_status: string;
          p_reason: string;
          p_notes?: string | null;
          p_revision_fields?: Json;
          p_badge_no?: string | null;
        };
        Returns: Json;
      };
      get_auth_role: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      get_auth_region_id: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
    };
  };
}
