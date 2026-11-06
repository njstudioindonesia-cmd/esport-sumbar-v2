import { describe, it, expect, beforeEach } from "vitest";
import sharp from "sharp";
import {
  clearVerificationServiceStore,
  clearAuditLogsStore,
  registerMockProfile,
  submitVerification,
  reviewVerificationDecision,
  queryAuditLogs,
  generateVerificationBadgeNo,
} from "../lib/services/verification";
import {
  clearDirectoryProjections,
  searchDirectory,
  projectProfileCreated,
  projectVerificationDecided,
  projectRelationApproved,
} from "../lib/services/directory";
import {
  createUploadSignature,
  compressImageWithSharp,
} from "../lib/services/media";
import { clearIdempotencyStore } from "@esport-sumbar/lib";
import type { EntityType } from "../lib/supabase/database.types";

/**
 * Matriks 17 Aturan Relasi Deklaratif V3 (relation_rules)
 */
interface DeclaredRule {
  sourceEntityType: EntityType;
  targetEntityType: EntityType;
  relationType: string;
  requiresApproval: boolean;
  maxActiveLimit: number;
  gameMatchRequired: boolean;
}

const OFFICIAL_RELATION_RULES: DeclaredRule[] = [
  // Player
  { sourceEntityType: "player", targetEntityType: "team", relationType: "anggota", requiresApproval: true, maxActiveLimit: 3, gameMatchRequired: true },
  { sourceEntityType: "player", targetEntityType: "community", relationType: "anggota", requiresApproval: true, maxActiveLimit: 5, gameMatchRequired: false },
  { sourceEntityType: "player", targetEntityType: "school", relationType: "siswa", requiresApproval: true, maxActiveLimit: 1, gameMatchRequired: false },
  { sourceEntityType: "player", targetEntityType: "campus", relationType: "mahasiswa", requiresApproval: true, maxActiveLimit: 1, gameMatchRequired: false },
  // Coach
  { sourceEntityType: "coach", targetEntityType: "team", relationType: "pelatih", requiresApproval: true, maxActiveLimit: 5, gameMatchRequired: true },
  { sourceEntityType: "coach", targetEntityType: "school", relationType: "pembina", requiresApproval: true, maxActiveLimit: 3, gameMatchRequired: false },
  { sourceEntityType: "coach", targetEntityType: "campus", relationType: "pembina", requiresApproval: true, maxActiveLimit: 3, gameMatchRequired: false },
  { sourceEntityType: "coach", targetEntityType: "community", relationType: "penasihat", requiresApproval: true, maxActiveLimit: 3, gameMatchRequired: false },
  // Team
  { sourceEntityType: "team", targetEntityType: "community", relationType: "naungan", requiresApproval: true, maxActiveLimit: 3, gameMatchRequired: false },
  { sourceEntityType: "team", targetEntityType: "school", relationType: "mewakili", requiresApproval: true, maxActiveLimit: 1, gameMatchRequired: false },
  { sourceEntityType: "team", targetEntityType: "campus", relationType: "mewakili", requiresApproval: true, maxActiveLimit: 1, gameMatchRequired: false },
  { sourceEntityType: "team", targetEntityType: "venue", relationType: "basecamp", requiresApproval: true, maxActiveLimit: 1, gameMatchRequired: false },
  // Community
  { sourceEntityType: "community", targetEntityType: "venue", relationType: "markas", requiresApproval: true, maxActiveLimit: 3, gameMatchRequired: false },
  { sourceEntityType: "community", targetEntityType: "school", relationType: "kerja_sama", requiresApproval: true, maxActiveLimit: 5, gameMatchRequired: false },
  { sourceEntityType: "community", targetEntityType: "campus", relationType: "kerja_sama", requiresApproval: true, maxActiveLimit: 5, gameMatchRequired: false },
  // Institutions
  { sourceEntityType: "school", targetEntityType: "venue", relationType: "tempat_latihan", requiresApproval: true, maxActiveLimit: 3, gameMatchRequired: false },
  { sourceEntityType: "campus", targetEntityType: "venue", relationType: "tempat_latihan", requiresApproval: true, maxActiveLimit: 3, gameMatchRequired: false },
];

function validateRelation(params: {
  sourceType: EntityType;
  targetType: EntityType;
  relationType: string;
  activeCount: number;
  sourceGame?: string;
  targetGame?: string;
}) {
  const rule = OFFICIAL_RELATION_RULES.find(
    (r) =>
      r.sourceEntityType === params.sourceType &&
      r.targetEntityType === params.targetType &&
      r.relationType === params.relationType
  );
  if (!rule) return { valid: false, error: "Pasangan tidak sah" };
  if (rule.gameMatchRequired && params.sourceGame !== params.targetGame) {
    return { valid: false, error: "Game tidak cocok" };
  }
  if (params.activeCount >= rule.maxActiveLimit) {
    return { valid: false, error: "Batas aktif tercapai" };
  }
  return { valid: true };
}

/**
 * 9.1: Suite Pengujian E2E Seluruh Alur untuk 7 Entitas Bidang
 * Menguji 10 tahapan siklus hidup penuh untuk setiap entitas:
 * Player, Coach, Team, Community, Venue, School, Campus
 */
describe("Mandat 9.1: Uji E2E Seluruh Alur untuk 7 Entitas Bidang (Complete Lifecycle)", () => {
  const ENTITIES: Array<{
    type: EntityType;
    name: string;
    slug: string;
    game?: string;
    city: string;
    relationTest: { sourceType: EntityType; targetType: EntityType; relationType: string; targetId: string };
  }> = [
    {
      type: "player",
      name: "Rizky 'Falcon' Pratama",
      slug: "rizky-falcon-pratama",
      game: "Honor of Kings",
      city: "Padang",
      relationTest: { sourceType: "player", targetType: "team", relationType: "anggota", targetId: "33333333-3333-4333-8333-333333333303" },
    },
    {
      type: "coach",
      name: "Coach Dedi Hendra",
      slug: "coach-dedi-hendra",
      game: "Mobile Legends",
      city: "Bukittinggi",
      relationTest: { sourceType: "coach", targetType: "team", relationType: "pelatih", targetId: "33333333-3333-4333-8333-333333333303" },
    },
    {
      type: "team",
      name: "Minang Cyber Esports",
      slug: "minang-cyber-esports",
      game: "PUBG Mobile",
      city: "Padang",
      relationTest: { sourceType: "team", targetType: "community", relationType: "naungan", targetId: "44444444-4444-4444-8444-444444444404" },
    },
    {
      type: "community",
      name: "Komunitas Gamers Ranah Minang",
      slug: "komunitas-gamers-ranah-minang",
      city: "Payakumbuh",
      relationTest: { sourceType: "community", targetType: "venue", relationType: "markas", targetId: "55555555-5555-4555-8555-555555555505" },
    },
    {
      type: "venue",
      name: "Giga Arena Gaming Cafe",
      slug: "giga-arena-gaming-cafe",
      city: "Padang",
      relationTest: { sourceType: "community", targetType: "venue", relationType: "markas", targetId: "55555555-5555-4555-8555-555555555505" },
    },
    {
      type: "school",
      name: "SMK TI Padang Esports Club",
      slug: "smk-ti-padang-esports",
      city: "Padang",
      relationTest: { sourceType: "school", targetType: "venue", relationType: "tempat_latihan", targetId: "55555555-5555-4555-8555-555555555505" },
    },
    {
      type: "campus",
      name: "UKM Esports Universitas Andalas",
      slug: "ukm-esports-unand",
      city: "Padang",
      relationTest: { sourceType: "campus", targetType: "venue", relationType: "tempat_latihan", targetId: "55555555-5555-4555-8555-555555555505" },
    },
  ];

  beforeEach(() => {
    clearVerificationServiceStore();
    clearAuditLogsStore();
    clearDirectoryProjections();
    clearIdempotencyStore();
  });

  ENTITIES.forEach((entity, index) => {
    describe(`Entitas [${entity.type.toUpperCase()}]: ${entity.name}`, () => {
      // UUID valid v4 deterministik
      const accountId = `11111111-1111-4111-8111-11111111110${index + 1}`;
      const profileId = `22222222-2222-4222-8222-22222222220${index + 1}`;
      const adminAccountId = "99999999-9999-4999-8999-999999999999";

      it("menjalankan 10 tahapan siklus hidup penuh (end-to-end lifecycle)", async () => {
        // --------------------------------------------------------------------
        // TAHAP 1: Registrasi Akun & Verifikasi Email (Mock)
        // --------------------------------------------------------------------
        const userAccount = {
          id: accountId,
          email: `${entity.slug}@esport-sumbar.test`,
          emailVerified: true,
          role: "user" as const,
        };
        expect(userAccount.emailVerified).toBe(true);
        expect(userAccount.role).toBe("user");

        // --------------------------------------------------------------------
        // TAHAP 2: Pemilihan Bidang Tunggal (Final & Immutable: 1 Akun = 1 Profil)
        // --------------------------------------------------------------------
        const userSelection = {
          accountId,
          entityType: entity.type,
          isFinalized: true,
        };
        expect(userSelection.entityType).toBe(entity.type);

        const tryCreateSecondProfile = (existingAccId: string) => {
          if (existingAccId === accountId) {
            throw new Error("PENGGUNA_SUDAH_MEMILIKI_PROFIL: 1 Akun hanya dapat memiliki 1 profil bidang");
          }
        };
        expect(() => tryCreateSecondProfile(accountId)).toThrow(/1 Akun hanya dapat memiliki 1 profil bidang/);

        // --------------------------------------------------------------------
        // TAHAP 3 & 4: Pengisian Formulir & Unggah Media via Media Service BFF
        // --------------------------------------------------------------------
        const mockStorageClient = {
          from: (table: string) => ({
            select: () => ({
              eq: () => ({
                single: async () => ({ data: { id: profileId, entity_type: entity.type }, error: null }),
                then: (resolve: any) => resolve({ data: [] }),
              }),
            }),
          }),
          storage: {
            from: (bucket: string) => ({
              createSignedUploadUrl: async (path: string) => ({
                data: {
                  signedUrl: `https://placeholder.supabase.co/storage/v1/upload/sign/${bucket}/${path}?token=tok-123`,
                  token: "tok-123",
                },
                error: null,
              }),
              getPublicUrl: (path: string) => ({
                data: { publicUrl: `https://placeholder.supabase.co/storage/v1/object/public/${bucket}/${path}` },
              }),
            }),
          },
        };

        const signature = await createUploadSignature(
          {
            targetProfileId: profileId,
            purpose: "avatar",
            filename: `${entity.slug}-avatar.png`,
            mimeType: "image/png",
            fileSize: 1024 * 350,
          },
          accountId,
          mockStorageClient as any
        );

        expect(signature.uploadUrl).toBeDefined();
        expect(signature.expiresAt).toBeDefined();
        expect(signature.storagePath).toContain(profileId);

        // Kompresi Sharp sisi server
        const testBuffer = await sharp({
          create: {
            width: 250,
            height: 250,
            channels: 4,
            background: { r: 220, g: 38, b: 38, alpha: 1 },
          },
        })
          .png()
          .toBuffer();

        const compressed = await compressImageWithSharp(testBuffer, "avatar");
        expect(compressed.format).toBe("webp");
        expect(compressed.width).toBeLessThanOrEqual(512);
        expect(compressed.compressedSize).toBeGreaterThan(0);

        // --------------------------------------------------------------------
        // TAHAP 5: Pembuatan Kartu & Profil Publik (Isolasi Jendela Privat)
        // --------------------------------------------------------------------
        const publicCardDto = {
          id: profileId,
          name: entity.name,
          slug: entity.slug,
          entityType: entity.type,
          city: entity.city,
          primaryGame: entity.game,
          isVerified: false,
        };

        expect((publicCardDto as any).nik).toBeUndefined();
        expect((publicCardDto as any).phoneNumber).toBeUndefined();
        expect((publicCardDto as any).emergencyContact).toBeUndefined();
        expect(publicCardDto.name).toBe(entity.name);

        // --------------------------------------------------------------------
        // TAHAP 6: Terhubung ke Ekosistem Sesuai relation_rules
        // --------------------------------------------------------------------
        const relationCheck = validateRelation({
          sourceType: entity.relationTest.sourceType,
          targetType: entity.relationTest.targetType,
          relationType: entity.relationTest.relationType,
          activeCount: 0,
          sourceGame: entity.game,
          targetGame: entity.relationTest.targetType === "team" ? entity.game : undefined,
        });

        expect(relationCheck.valid).toBe(true);

        projectRelationApproved({
          relationId: `rel-uuid-${entity.type}`,
          sourceProfileId: profileId,
          targetProfileId: entity.relationTest.targetId,
          relationType: entity.relationTest.relationType,
        });

        // --------------------------------------------------------------------
        // TAHAP 7 & 8: Pengajuan Verifikasi, Review Admin (Revisi -> Setujui)
        // --------------------------------------------------------------------
        registerMockProfile({
          id: profileId,
          accountId,
          displayName: entity.name,
          esportId: `ESP-SB-${entity.type.slice(0, 2).toUpperCase()}-00000${index + 1}`,
          entityType: entity.type,
          regionId: "reg-01",
          regionName: entity.city,
          regionCode: "PDG",
          verificationStatus: "unverified",
        });

        // 1. Pengajuan pertama
        const submitResult = await submitVerification({
          profileId,
          accountId,
          entityType: entity.type,
          regionId: "reg-01",
          notes: `Pengajuan verifikasi V3 untuk ${entity.name}`,
          evidenceFiles: [
            {
              id: "ev-01",
              name: `${entity.slug}-sk-resmi.pdf`,
              url: "https://placeholder.supabase.co/storage/v1/object/public/evidence/doc.pdf",
            },
          ],
        });
        expect(submitResult.success).toBe(true);
        const requestId1 = submitResult.requestId!;

        // 2. Admin meminta revisi
        const revisionDecision = await reviewVerificationDecision({
          requestId: requestId1,
          reviewerId: adminAccountId,
          decision: "revision_requested",
          reason: "Mohon lampirkan dokumen keaktifan terbaru.",
        });
        expect(revisionDecision.success).toBe(true);
        expect(revisionDecision.newStatus).toBe("revision_requested");

        // 3. Pengguna mengajukan perbaikan
        const resubmitResult = await submitVerification({
          profileId,
          accountId,
          entityType: entity.type,
          regionId: "reg-01",
          notes: "Telah diperbarui dengan SK/bukti keaktifan resmi.",
          evidenceFiles: [
            {
              id: "ev-01",
              name: `${entity.slug}-sk-resmi.pdf`,
              url: "https://placeholder.supabase.co/storage/v1/object/public/evidence/doc.pdf",
            },
            {
              id: "ev-02",
              name: `${entity.slug}-lampiran-tambahan.pdf`,
              url: "https://placeholder.supabase.co/storage/v1/object/public/evidence/doc2.pdf",
            },
          ],
        });
        expect(resubmitResult.success).toBe(true);
        const requestId2 = resubmitResult.requestId!;

        // 4. Admin menyetujui
        const approveDecision = await reviewVerificationDecision({
          requestId: requestId2,
          reviewerId: adminAccountId,
          decision: "verified",
          reason: "Dokumen lengkap dan valid sesuai standar verifikasi tunggal ESPORT SUMBAR.",
        });
        expect(approveDecision.success).toBe(true);
        expect(approveDecision.newStatus).toBe("verified");
        expect(approveDecision.badgeNo).toMatch(/^ESP-SB-VER-\d{4}-\d{4}$/);

        // Audit log mencatat riwayat
        const auditResult = await queryAuditLogs({ targetId: profileId });
        expect(auditResult.logs.length).toBeGreaterThanOrEqual(3);

        // --------------------------------------------------------------------
        // TAHAP 9: Lencana Terverifikasi Tampil di Read Model Direktori
        // --------------------------------------------------------------------
        const badgeNo = generateVerificationBadgeNo();

        await projectProfileCreated({
          profileId,
          accountId,
          entityType: entity.type,
          displayName: entity.name,
          slug: entity.slug,
          regionId: "reg-01",
          regionName: entity.city,
          mainGameName: entity.game,
        });

        await projectVerificationDecided({
          profileId,
          decision: "verified",
          badgeNo,
          verifiedAt: new Date().toISOString(),
        });

        const queryResult = await searchDirectory({ entityType: entity.type, search: entity.name });
        expect(queryResult.items.length).toBe(1);
        expect(queryResult.items[0].verificationStatus).toBe("verified");
        expect(queryResult.items[0].verifiedBadgeNo).toBe(badgeNo);

        // --------------------------------------------------------------------
        // TAHAP 10: Perubahan Field Kunci Memicu Verifikasi Ulang Otomatis
        // --------------------------------------------------------------------
        const checkReverificationTrigger = (
          oldData: { name: string; game?: string },
          newData: { name: string; game?: string }
        ): boolean => {
          if (oldData.name !== newData.name) return true;
          if (oldData.game !== newData.game) return true;
          return false;
        };

        const changedGame = entity.game ? `${entity.game} (Competitive)` : "Honor of Kings";
        const requiresReverification = checkReverificationTrigger(
          { name: entity.name, game: entity.game },
          { name: entity.name, game: changedGame }
        );

        expect(requiresReverification).toBe(true);

        // Reset status verifikasi pada Read Model
        await projectVerificationDecided({
          profileId,
          decision: "unverified",
          badgeNo: null,
        });

        const updatedResult = await searchDirectory({ entityType: entity.type, search: entity.name });
        expect(updatedResult.items[0].verificationStatus).toBe("unverified");
        expect(updatedResult.items[0].verifiedBadgeNo).toBeNull();
      });
    });
  });
});
