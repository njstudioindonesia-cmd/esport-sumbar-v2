export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type AccountRole = "user" | "platform_admin";
export type EntityType = "player" | "coach" | "team" | "community" | "venue" | "campus" | "school" | "organizer";
export type VerificationStatus =
  | "unverified"
  | "submitted"
  | "under_review"
  | "revision_requested"
  | "verified"
  | "rejected"
  | "suspended"
  | "expired";
export type RarityTier = "rookie" | "contender" | "elite" | "legend";
export type MembershipStatus = "pending" | "accepted" | "declined" | "ended";
export type AchievementLevel = "kota" | "provinsi" | "nasional" | "internasional" | "lainnya";

export type Database = {
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
          contact_name: string | null;
          esi_secretariat: string | null;
          description: string | null;
          status_mode: "active" | "fallback";
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
          contact_name?: string | null;
          esi_secretariat?: string | null;
          description?: string | null;
          status_mode?: "active" | "fallback";
          is_pilot?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          code?: string;
          type?: "kota" | "kabupaten";
          slug?: string;
          logo_url?: string | null;
          contact_name?: string | null;
          esi_secretariat?: string | null;
          description?: string | null;
          status_mode?: "active" | "fallback";
          is_pilot?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      accounts: {
        Row: {
          id: string;
          email: string;
          role: AccountRole;
          assigned_region_id: string | null;
          birth_date: string | null;
          guardian_consent_id: string | null;
          is_demo: boolean;
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
          guardian_consent_id?: string | null;
          is_demo?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: AccountRole;
          assigned_region_id?: string | null;
          birth_date?: string | null;
          guardian_consent_id?: string | null;
          is_demo?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
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
        Update: {
          id?: string;
          account_id?: string;
          guardian_name?: string;
          guardian_contact?: string;
          guardian_relationship?: string;
          consent_version?: string;
          consented_at?: string;
          ip_address?: string | null;
        };
        Relationships: [];
      };
      games: {
        Row: {
          id: string;
          name: string;
          short_name: string;
          slug: string;
          publisher: string | null;
          category: string | null;
          genre: string | null;
          platform: string | null;
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
          genre?: string | null;
          platform?: string | null;
          roles_jsonb?: Json;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          short_name?: string;
          slug?: string;
          publisher?: string | null;
          category?: string | null;
          genre?: string | null;
          platform?: string | null;
          roles_jsonb?: Json;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      game_roles: {
        Row: {
          id: string;
          game_id: string;
          role_name: string;
          description: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          game_id: string;
          role_name: string;
          description?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          game_id?: string;
          role_name?: string;
          description?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      game_ranks: {
        Row: {
          id: string;
          game_id: string;
          tier_name: string;
          tier_level: number;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          game_id: string;
          tier_name: string;
          tier_level?: number;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          game_id?: string;
          tier_name?: string;
          tier_level?: number;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [];
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
          avatar_path: string | null;
          cover_path: string | null;
          bio: string | null;
          attributes: Json;
          metadata_jsonb?: Json;
          visibility_jsonb: Json;
          verification_status: VerificationStatus;
          verified_at: string | null;
          verification_expires_at: string | null;
          verified_badge_no: string | null;
          rarity_tier: RarityTier;
          completeness_score: number;
          is_demo: boolean;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          account_id: string;
          entity_type: EntityType;
          esport_id?: string;
          slug: string;
          display_name: string;
          ign?: string | null;
          region_id: string;
          main_game_id?: string | null;
          role_name?: string | null;
          avatar_url?: string | null;
          avatar_path?: string | null;
          cover_path?: string | null;
          bio?: string | null;
          attributes?: Json;
          metadata_jsonb?: Json;
          visibility_jsonb?: Json;
          verification_status?: VerificationStatus;
          verified_at?: string | null;
          verification_expires_at?: string | null;
          verified_badge_no?: string | null;
          rarity_tier?: RarityTier;
          completeness_score?: number;
          is_demo?: boolean;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          account_id?: string;
          entity_type?: EntityType;
          esport_id?: string;
          slug?: string;
          display_name?: string;
          ign?: string | null;
          region_id?: string;
          main_game_id?: string | null;
          role_name?: string | null;
          avatar_url?: string | null;
          avatar_path?: string | null;
          cover_path?: string | null;
          bio?: string | null;
          attributes?: Json;
          metadata_jsonb?: Json;
          visibility_jsonb?: Json;
          verification_status?: VerificationStatus;
          verified_at?: string | null;
          verification_expires_at?: string | null;
          verified_badge_no?: string | null;
          rarity_tier?: RarityTier;
          completeness_score?: number;
          is_demo?: boolean;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      profile_private: {
        Row: {
          profile_id: string;
          account_id: string;
          full_name: string | null;
          whatsapp_e164: string | null;
          contact_email: string | null;
          birth_date: string | null;
          gender: "male" | "female" | "prefer_not_to_say" | null;
          address_street: string | null;
          kecamatan: string | null;
          nagari_kelurahan: string | null;
          game_account_id: string | null;
          game_server: string | null;
          guardian_name: string | null;
          guardian_whatsapp: string | null;
          guardian_relationship: string | null;
          rate_note: string | null;
          manager_name: string | null;
          manager_role: string | null;
          manager_whatsapp: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          profile_id: string;
          account_id: string;
          full_name?: string | null;
          whatsapp_e164?: string | null;
          contact_email?: string | null;
          birth_date?: string | null;
          gender?: "male" | "female" | "prefer_not_to_say" | null;
          address_street?: string | null;
          kecamatan?: string | null;
          nagari_kelurahan?: string | null;
          game_account_id?: string | null;
          game_server?: string | null;
          guardian_name?: string | null;
          guardian_whatsapp?: string | null;
          guardian_relationship?: string | null;
          rate_note?: string | null;
          manager_name?: string | null;
          manager_role?: string | null;
          manager_whatsapp?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          profile_id?: string;
          account_id?: string;
          full_name?: string | null;
          whatsapp_e164?: string | null;
          contact_email?: string | null;
          birth_date?: string | null;
          gender?: "male" | "female" | "prefer_not_to_say" | null;
          address_street?: string | null;
          kecamatan?: string | null;
          nagari_kelurahan?: string | null;
          game_account_id?: string | null;
          game_server?: string | null;
          guardian_name?: string | null;
          guardian_whatsapp?: string | null;
          guardian_relationship?: string | null;
          rate_note?: string | null;
          manager_name?: string | null;
          manager_role?: string | null;
          manager_whatsapp?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      consents: {
        Row: {
          id: string;
          account_id: string;
          type: "terms_of_service" | "privacy_policy" | "guardian_consent" | "competition_rules";
          version: string;
          accepted_at: string;
          ip_address: string | null;
          user_agent: string | null;
        };
        Insert: {
          id?: string;
          account_id: string;
          type: "terms_of_service" | "privacy_policy" | "guardian_consent" | "competition_rules";
          version?: string;
          accepted_at?: string;
          ip_address?: string | null;
          user_agent?: string | null;
        };
        Update: {
          id?: string;
          account_id?: string;
          type?: "terms_of_service" | "privacy_policy" | "guardian_consent" | "competition_rules";
          version?: string;
          accepted_at?: string;
          ip_address?: string | null;
          user_agent?: string | null;
        };
        Relationships: [];
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
        Update: {
          id?: string;
          member_profile_id?: string;
          org_profile_id?: string;
          role_in_org?: string;
          status?: MembershipStatus;
          initiated_by?: "member" | "org";
          started_at?: string | null;
          ended_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
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
        Update: {
          id?: string;
          profile_id?: string;
          title?: string;
          level?: AchievementLevel;
          placement?: string;
          event_name?: string;
          event_date?: string | null;
          evidence_url?: string | null;
          validation_status?: "pending" | "validated" | "rejected";
          validated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
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
        Update: {
          id?: string;
          profile_id?: string;
          status?: VerificationStatus;
          region_id?: string;
          submitted_at?: string;
          decided_at?: string | null;
          current_reviewer_id?: string | null;
          notes?: string | null;
          revision_fields_jsonb?: Json;
          evidence_files?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
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
        Update: never;
        Relationships: [];
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
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          summary?: string | null;
          content?: string;
          category?: string;
          cover_image_url?: string | null;
          region_id?: string | null;
          author_id?: string | null;
          status?: "draft" | "published" | "archived";
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
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
        Update: {
          id?: string;
          account_id?: string;
          type?: string;
          payload_jsonb?: Json;
          status?: "pending" | "processing" | "sent" | "failed";
          sent_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
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
        Update: {
          id?: string;
          reporter_account_id?: string | null;
          target_profile_id?: string;
          category?: string;
          reason?: string;
          evidence_urls?: Json;
          status?: "pending" | "under_review" | "forwarded_to_esi" | "resolved" | "dismissed";
          resolved_by?: string | null;
          resolution_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      media_assets: {
        Row: {
          id: string;
          profile_id: string;
          kind: "avatar" | "cover" | "gallery";
          path: string;
          width: number | null;
          height: number | null;
          sort_order: number;
          caption: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          kind: "avatar" | "cover" | "gallery";
          path: string;
          width?: number | null;
          height?: number | null;
          sort_order?: number;
          caption?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          kind?: "avatar" | "cover" | "gallery";
          path?: string;
          width?: number | null;
          height?: number | null;
          sort_order?: number;
          caption?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      public_profiles: {
        Row: {
          id: string;
          account_id: string;
          entity_type: EntityType;
          esport_id: string;
          slug: string;
          display_name: string;
          ign: string | null;
          region_id: string;
          region_name: string | null;
          region_code: string | null;
          region_type: string | null;
          main_game_id: string | null;
          main_game_name: string | null;
          main_game_short: string | null;
          role_name: string | null;
          avatar_url: string | null;
          avatar_path: string | null;
          cover_path: string | null;
          bio: string | null;
          attributes: Json;
          visibility_jsonb: Json;
          verification_status: VerificationStatus;
          verified_at: string | null;
          verification_expires_at: string | null;
          verified_badge_no: string | null;
          rarity_tier: RarityTier;
          completeness_score: number;
          is_demo: boolean;
          created_at: string;
          updated_at: string;
        };
        Relationships: [];
      };
    };
    Functions: {
      transition_verification: {
        Args: {
          p_request_id: string;
          p_new_status: string;
          p_reason: string;
          p_notes: string | null;
          p_revision_fields: Json;
          p_badge_no: string | null;
        };
        Returns: Json;
      };
      generate_esport_id: {
        Args: {
          p_region_id: string;
          p_entity_type: string;
        };
        Returns: string;
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
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
