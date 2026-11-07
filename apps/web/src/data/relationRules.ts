import type { EntityType } from "@/lib/supabase/database.types";

/**
 * Matriks 17 Aturan Relasi Deklaratif V3 (relation_rules)
 * Sesuai Perubahan 5, Keputusan D5, dan Mandat 6.6
 */
export interface DeclaredRule {
  sourceEntityType: EntityType;
  targetEntityType: EntityType;
  relationType: string;
  requiresApproval: boolean;
  maxActiveLimit: number;
  gameMatchRequired: boolean;
}

export const OFFICIAL_RELATION_RULES: DeclaredRule[] = [
  // 1-4: Player
  { sourceEntityType: "player", targetEntityType: "team", relationType: "anggota", requiresApproval: true, maxActiveLimit: 3, gameMatchRequired: true },
  { sourceEntityType: "player", targetEntityType: "community", relationType: "anggota", requiresApproval: true, maxActiveLimit: 5, gameMatchRequired: false },
  { sourceEntityType: "player", targetEntityType: "school", relationType: "siswa", requiresApproval: true, maxActiveLimit: 1, gameMatchRequired: false },
  { sourceEntityType: "player", targetEntityType: "campus", relationType: "mahasiswa", requiresApproval: true, maxActiveLimit: 1, gameMatchRequired: false },

  // 5-8: Coach
  { sourceEntityType: "coach", targetEntityType: "team", relationType: "pelatih", requiresApproval: true, maxActiveLimit: 5, gameMatchRequired: true },
  { sourceEntityType: "coach", targetEntityType: "school", relationType: "pembina", requiresApproval: true, maxActiveLimit: 3, gameMatchRequired: false },
  { sourceEntityType: "coach", targetEntityType: "campus", relationType: "pembina", requiresApproval: true, maxActiveLimit: 3, gameMatchRequired: false },
  { sourceEntityType: "coach", targetEntityType: "community", relationType: "penasihat", requiresApproval: true, maxActiveLimit: 3, gameMatchRequired: false },

  // 9-12: Team
  { sourceEntityType: "team", targetEntityType: "community", relationType: "naungan", requiresApproval: true, maxActiveLimit: 3, gameMatchRequired: false },
  { sourceEntityType: "team", targetEntityType: "school", relationType: "mewakili", requiresApproval: true, maxActiveLimit: 1, gameMatchRequired: false },
  { sourceEntityType: "team", targetEntityType: "campus", relationType: "mewakili", requiresApproval: true, maxActiveLimit: 1, gameMatchRequired: false },
  { sourceEntityType: "team", targetEntityType: "venue", relationType: "basecamp", requiresApproval: true, maxActiveLimit: 1, gameMatchRequired: false },

  // 13-15: Community
  { sourceEntityType: "community", targetEntityType: "venue", relationType: "markas", requiresApproval: true, maxActiveLimit: 3, gameMatchRequired: false },
  { sourceEntityType: "community", targetEntityType: "school", relationType: "kerja_sama", requiresApproval: true, maxActiveLimit: 5, gameMatchRequired: false },
  { sourceEntityType: "community", targetEntityType: "campus", relationType: "kerja_sama", requiresApproval: true, maxActiveLimit: 5, gameMatchRequired: false },

  // 16-17: Institutions to Venue
  { sourceEntityType: "school", targetEntityType: "venue", relationType: "tempat_latihan", requiresApproval: true, maxActiveLimit: 3, gameMatchRequired: false },
  { sourceEntityType: "campus", targetEntityType: "venue", relationType: "tempat_latihan", requiresApproval: true, maxActiveLimit: 3, gameMatchRequired: false },
];

/**
 * Validator relasi murni (Pure Ecosystem Rule Validator)
 */
export function validateRelationRequest(params: {
  sourceType: EntityType;
  targetType: EntityType;
  relationType: string;
  sourceGameId?: string | null;
  targetGameId?: string | null;
  currentActiveCount: number;
}): { valid: boolean; error?: string; rule?: DeclaredRule } {
  const rule = OFFICIAL_RELATION_RULES.find(
    (r) =>
      r.sourceEntityType === params.sourceType &&
      r.targetEntityType === params.targetType &&
      r.relationType === params.relationType
  );

  if (!rule) {
    return {
      valid: false,
      error: `Pasangan relasi ${params.sourceType} -> ${params.targetType} [${params.relationType}] tidak valid dalam aturan ekosistem.`,
    };
  }

  if (params.currentActiveCount >= rule.maxActiveLimit) {
    return {
      valid: false,
      error: `Batas kuota aktif relasi ${params.sourceType} -> ${params.targetType} telah mencapai batas maksimum (${rule.maxActiveLimit}).`,
    };
  }

  if (rule.gameMatchRequired) {
    if (!params.sourceGameId || !params.targetGameId || params.sourceGameId !== params.targetGameId) {
      return {
        valid: false,
        error: `Relasi ${params.sourceType} -> ${params.targetType} mewajibkan divisi game yang sama.`,
      };
    }
  }

  return { valid: true, rule };
}
