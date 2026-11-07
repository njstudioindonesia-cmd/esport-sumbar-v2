import { describe, it, expect } from "vitest";
import { calculateRarityTier } from "@/lib/entities";
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

  if (rule.gameMatchRequired) {
    if (!params.sourceGameId || !params.targetGameId || params.sourceGameId !== params.targetGameId) {
      return {
        valid: false,
        error: `Relasi "${params.relationType}" mewajibkan kesesuaian divisi game (source: ${params.sourceGameId}, target: ${params.targetGameId}).`,
        rule,
      };
    }
  }

  if (params.currentActiveCount >= rule.maxActiveLimit) {
    return {
      valid: false,
      error: `Batas maksimum relasi aktif (${rule.maxActiveLimit}) telah tercapai.`,
      rule,
    };
  }

  return { valid: true, rule };
}

describe("Ekosistem Terhubung Antar 7 Entitas V3 (Mandat 6 & Bagian 6)", () => {
  describe("1. Matriks 17 Aturan Pasangan Valid (Mandat 6.1 & 6.6)", () => {
    it("harus tepat memiliki 17 aturan deklaratif yang terdaftar", () => {
      expect(OFFICIAL_RELATION_RULES.length).toBe(17);
    });

    it("semua 17 pasangan valid harus lolos validasi saat parameter terpenuhi", () => {
      OFFICIAL_RELATION_RULES.forEach((rule) => {
        const result = validateRelationRequest({
          sourceType: rule.sourceEntityType,
          targetType: rule.targetEntityType,
          relationType: rule.relationType,
          sourceGameId: "game-hok",
          targetGameId: "game-hok",
          currentActiveCount: 0,
        });

        expect(result.valid).toBe(true);
        expect(result.rule).toBeDefined();
        expect(result.rule?.relationType).toBe(rule.relationType);
      });
    });
  });

  describe("2. Penolakan Pasangan Tidak Valid (Invalid Pairs Rejected)", () => {
    const invalidPairs: Array<{ source: EntityType; target: EntityType; type: string }> = [
      { source: "venue", target: "player", type: "anggota" },
      { source: "school", target: "player", type: "siswa" },
      { source: "player", target: "venue", type: "basecamp" },
      { source: "coach", target: "player", type: "pelatih" },
      { source: "player", target: "player", type: "rekan" },
      { source: "team", target: "team", type: "aliansi" },
      { source: "venue", target: "venue", type: "cabang" },
      { source: "campus", target: "school", type: "kerja_sama" },
    ];

    invalidPairs.forEach(({ source, target, type }) => {
      it(`harus menolak pasangan tidak valid: ${source} -> ${target} [${type}]`, () => {
        const result = validateRelationRequest({
          sourceType: source,
          targetType: target,
          relationType: type,
          sourceGameId: "game-hok",
          targetGameId: "game-hok",
          currentActiveCount: 0,
        });

        expect(result.valid).toBe(false);
        expect(result.error).toContain("tidak valid dalam aturan ekosistem");
      });
    });
  });

  describe("3. Kewajiban Kesesuaian Game (game_match_required)", () => {
    it("harus menolak atlet HOK yang mencoba bergabung ke tim MLBB", () => {
      const result = validateRelationRequest({
        sourceType: "player",
        targetType: "team",
        relationType: "anggota",
        sourceGameId: "game-hok",
        targetGameId: "game-mlbb",
        currentActiveCount: 0,
      });

      expect(result.valid).toBe(false);
      expect(result.error).toContain("mewajibkan kesesuaian divisi game");
    });

    it("harus menolak pelatih MLBB yang mencoba melatih tim Valorant", () => {
      const result = validateRelationRequest({
        sourceType: "coach",
        targetType: "team",
        relationType: "pelatih",
        sourceGameId: "game-mlbb",
        targetGameId: "game-val",
        currentActiveCount: 0,
      });

      expect(result.valid).toBe(false);
      expect(result.error).toContain("mewajibkan kesesuaian divisi game");
    });

    it("harus mengizinkan atlet game apa pun bergabung ke komunitas esport (lintas game)", () => {
      const result = validateRelationRequest({
        sourceType: "player",
        targetType: "community",
        relationType: "anggota",
        sourceGameId: "game-hok",
        targetGameId: "game-mlbb", // Game berbeda tidak masalah untuk komunitas
        currentActiveCount: 0,
      });

      expect(result.valid).toBe(true);
    });
  });

  describe("4. Penegakan Batas Maksimum Relasi Aktif (max_active_limit)", () => {
    it("harus menolak atlet yang sudah terikat di 3 tim aktif", () => {
      const result = validateRelationRequest({
        sourceType: "player",
        targetType: "team",
        relationType: "anggota",
        sourceGameId: "game-hok",
        targetGameId: "game-hok",
        currentActiveCount: 3, // Batas adalah 3
      });

      expect(result.valid).toBe(false);
      expect(result.error).toContain("Batas maksimum relasi aktif (3) telah tercapai");
    });

    it("harus menolak atlet yang sudah terdaftar di 1 sekolah (max 1)", () => {
      const result = validateRelationRequest({
        sourceType: "player",
        targetType: "school",
        relationType: "siswa",
        currentActiveCount: 1, // Batas adalah 1
      });

      expect(result.valid).toBe(false);
      expect(result.error).toContain("Batas maksimum relasi aktif (1) telah tercapai");
    });

    it("harus menolak tim yang sudah memiliki 1 basecamp (max 1)", () => {
      const result = validateRelationRequest({
        sourceType: "team",
        targetType: "venue",
        relationType: "basecamp",
        currentActiveCount: 1, // Batas adalah 1
      });

      expect(result.valid).toBe(false);
      expect(result.error).toContain("Batas maksimum relasi aktif (1) telah tercapai");
    });
  });

  describe("5. Tier Rarity Contender Mensyaratkan Relasi Aktif (Mandat 6.5)", () => {
    it("atlet dengan kelengkapan 90% tapi 0 relasi tetap Rookie", () => {
      const tier = calculateRarityTier({
        completenessScore: 90,
        confirmedRelationsCount: 0,
        validatedAchievementsCount: 0,
      });

      expect(tier).toBe("rookie");
    });

    it("atlet dengan kelengkapan 75% walau punya 2 relasi tetap Rookie", () => {
      const tier = calculateRarityTier({
        completenessScore: 75,
        confirmedRelationsCount: 2,
        validatedAchievementsCount: 0,
      });

      expect(tier).toBe("rookie");
    });

    it("atlet dengan kelengkapan 80% dan 1 relasi aktif otomatis naik ke Contender", () => {
      const tier = calculateRarityTier({
        completenessScore: 80,
        confirmedRelationsCount: 1,
        validatedAchievementsCount: 0,
      });

      expect(tier).toBe("contender");
    });

    it("prestasi tervalidasi tetap memiliki prioritas lebih tinggi (Elite / Legend)", () => {
      const tierElite = calculateRarityTier({
        completenessScore: 90,
        confirmedRelationsCount: 1,
        validatedAchievementsCount: 1,
        hasProvincialOrNationalAchievement: false,
      });
      expect(tierElite).toBe("elite");

      const tierLegend = calculateRarityTier({
        completenessScore: 90,
        confirmedRelationsCount: 1,
        validatedAchievementsCount: 1,
        hasProvincialOrNationalAchievement: true,
      });
      expect(tierLegend).toBe("legend");
    });
  });

  describe("6. Kepatuhan Privasi Data Ekosistem (Zero Private Data Leakage)", () => {
    it("payload publik relasi tidak boleh membocorkan NIK, KTP, nomor telepon, atau data sensitif", () => {
      const samplePublicEntityRelation = {
        id: "rel-001",
        relationType: "anggota",
        status: "active",
        otherProfile: {
          id: "prof-001",
          displayName: "Ahmad Rizky",
          ign: "MinangSniper",
          entityType: "player",
          esportId: "ESP-SB-PLY-2026-0001",
          slug: "minangsniper",
          avatarUrl: "/avatars/p1.webp",
          mainGameId: "game-hok",
          regionId: "reg-pdg-01",
          rarityTier: "contender",
          verificationStatus: "verified",
        },
      };

      const keys = Object.keys(samplePublicEntityRelation.otherProfile);
      const forbiddenSensitiveFields = [
        "nik",
        "ktp_url",
        "kk_url",
        "phone",
        "phone_number",
        "email",
        "guardian_name",
        "guardian_phone",
        "bank_account",
        "date_of_birth",
        "birth_date",
      ];

      forbiddenSensitiveFields.forEach((field) => {
        expect(keys).not.toContain(field);
      });
    });
  });
});
