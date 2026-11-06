import { describe, it, expect, beforeEach } from "vitest";
import {
  searchDirectory,
  getDirectoryProfileBySlug,
  getDirectoryStats,
  reconcileDirectoryReadModel,
  projectProfileCreated,
  projectProfileUpdated,
  projectProfileDeleted,
  projectProfileSuspended,
  projectVerificationDecided,
  projectRelationApproved,
  projectRelationEnded,
  clearDirectoryProjections,
  directoryProjections,
  directoryCache,
} from "@/lib/services/directory";
import { FLAGS } from "@/lib/config/flags";

describe("Sub-langkah 7.3: Ekstraksi Layanan Direktori (Directory Service - Read Model & Caching)", () => {
  const athleteId = "a1111111-2222-3333-4444-555555555551";
  const athleteSlug = "fajar-ramadhan";
  const teamId = "b1111111-2222-3333-4444-555555555552";
  const teamSlug = "padang-pride-team";

  beforeEach(() => {
    clearDirectoryProjections();
  });

  describe("1. Proyeksi Berbasis Peristiwa (Event-Driven Projections)", () => {
    it("harus memproyeksikan ProfileCreated ke dalam Read Model direktori secara idempoten", async () => {
      const event = {
        profileId: athleteId,
        accountId: "acc-001",
        entityType: "player" as const,
        displayName: "Fajar Ramadhan",
        slug: athleteSlug,
        regionId: "reg-01",
        regionCode: "PDG",
        regionName: "Kota Padang",
        mainGameId: "game-hok",
        mainGameName: "Honor of Kings",
        roleName: "Clash Lane",
        ign: "FajarSlayer",
        completenessScore: 85,
      };

      const res1 = await projectProfileCreated(event);
      expect(res1.success).toBe(true);

      const record = directoryProjections.get(athleteId);
      expect(record).toBeDefined();
      expect(record?.displayName).toBe("Fajar Ramadhan");
      expect(record?.regionCode).toBe("PDG");
      expect(record?.verificationStatus).toBe("unverified");

      // Idempotensi: pemanggilan kedua tidak merusak data
      const res2 = await projectProfileCreated(event);
      expect(res2.success).toBe(true);
      expect(directoryProjections.size).toBe(1);
    });

    it("harus memperbarui Read Model saat peristiwa ProfileUpdated diterima", async () => {
      await projectProfileCreated({
        profileId: athleteId,
        accountId: "acc-001",
        entityType: "player",
        displayName: "Fajar Ramadhan",
        slug: athleteSlug,
        regionId: "reg-01",
      });

      await projectProfileUpdated({
        profileId: athleteId,
        changedFields: {
          displayName: "Fajar Ramadhan V3",
          bio: "Pro player Honor of Kings Sumatera Barat.",
        },
      });

      const updated = directoryProjections.get(athleteId);
      expect(updated?.displayName).toBe("Fajar Ramadhan V3");
      expect(updated?.bio).toContain("Pro player");
    });

    it("harus menyembunyikan profil saat ProfileSuspended diterima", async () => {
      await projectProfileCreated({
        profileId: athleteId,
        accountId: "acc-001",
        entityType: "player",
        displayName: "Fajar Ramadhan",
        slug: athleteSlug,
        regionId: "reg-01",
      });

      await projectProfileSuspended({
        profileId: athleteId,
        reason: "Pelanggaran kode etik komunitas",
      });

      const suspended = directoryProjections.get(athleteId);
      expect(suspended?.isSuspended).toBe(true);
      expect(suspended?.isPublished).toBe(false);

      // Pastikan tidak muncul pada pencarian publik
      const searchRes = await searchDirectory();
      expect(searchRes.items.some((i) => i.id === athleteId)).toBe(false);
    });

    it("harus memperbarui status verifikasi dan nomor registrasi saat VerificationDecided diterima", async () => {
      await projectProfileCreated({
        profileId: athleteId,
        accountId: "acc-001",
        entityType: "player",
        displayName: "Fajar Ramadhan",
        slug: athleteSlug,
        regionId: "reg-01",
      });

      await projectVerificationDecided({
        profileId: athleteId,
        decision: "verified",
        badgeNo: "ESP-SB-VER-2026-0045",
      });

      const verifiedRecord = directoryProjections.get(athleteId);
      expect(verifiedRecord?.verificationStatus).toBe("verified");
      expect(verifiedRecord?.verifiedBadgeNo).toBe("ESP-SB-VER-2026-0045");
      // Promosi otomatis dari rookie ke contender
      expect(verifiedRecord?.rarityTier).toBe("contender");
    });

    it("harus menghubungkan kemitraan secara otomatis saat RelationApproved dan melepasnya saat RelationEnded", async () => {
      // Buat 2 entitas: Atlet dan Tim
      await projectProfileCreated({
        profileId: athleteId,
        accountId: "acc-001",
        entityType: "player",
        displayName: "Fajar Ramadhan",
        slug: athleteSlug,
        regionId: "reg-01",
      });

      await projectProfileCreated({
        profileId: teamId,
        accountId: "acc-002",
        entityType: "team",
        displayName: "Padang Pride",
        slug: teamSlug,
        regionId: "reg-01",
      });

      // RelationApproved
      await projectRelationApproved({
        relationId: "rel-101",
        sourceProfileId: teamId,
        targetProfileId: athleteId,
        relationType: "Roster Atlet",
      });

      const athlete = directoryProjections.get(athleteId);
      const team = directoryProjections.get(teamId);

      expect(athlete?.activeRelationsCount).toBe(1);
      expect(athlete?.confirmedPartners[0].displayName).toBe("Padang Pride");

      expect(team?.activeRelationsCount).toBe(1);
      expect(team?.confirmedPartners[0].displayName).toBe("Fajar Ramadhan");

      // RelationEnded
      await projectRelationEnded({
        relationId: "rel-101",
        sourceProfileId: teamId,
        targetProfileId: athleteId,
      });

      expect(directoryProjections.get(athleteId)?.activeRelationsCount).toBe(0);
      expect(directoryProjections.get(teamId)?.activeRelationsCount).toBe(0);
    });

    it("harus menghapus profil dari direktori saat ProfileDeleted diterima", async () => {
      await projectProfileCreated({
        profileId: athleteId,
        accountId: "acc-001",
        entityType: "player",
        displayName: "Fajar Ramadhan",
        slug: athleteSlug,
        regionId: "reg-01",
      });

      expect(directoryProjections.has(athleteId)).toBe(true);

      await projectProfileDeleted({ profileId: athleteId });
      expect(directoryProjections.has(athleteId)).toBe(false);
    });
  });

  describe("2. Kepatuhan Privasi UU PDP No. 27/2022 pada Read Model Publik", () => {
    it("model baca direktori publik TIDAK PERNAH memuat data pribadi sensitif", async () => {
      await projectProfileCreated({
        profileId: athleteId,
        accountId: "acc-001",
        entityType: "player",
        displayName: "Fajar Ramadhan",
        slug: athleteSlug,
        regionId: "reg-01",
      });

      const record: any = directoryProjections.get(athleteId);
      expect(record.nik).toBeUndefined();
      expect(record.nisn).toBeUndefined();
      expect(record.phone).toBeUndefined();
      expect(record.phoneNumber).toBeUndefined();
      expect(record.parentName).toBeUndefined();
      expect(record.addressDetail).toBeUndefined();
      expect(record.ktpUrl).toBeUndefined();
      expect(record.kkUrl).toBeUndefined();
    });
  });

  describe("3. Pencarian, Filter & Paginasi Direktori Cepat", () => {
    beforeEach(async () => {
      // Seed 3 profil uji
      await projectProfileCreated({
        profileId: "p1",
        accountId: "a1",
        entityType: "player",
        displayName: "Aldo Saputra",
        ign: "AldoKing",
        slug: "aldo-saputra",
        regionId: "r1",
        regionCode: "PDG",
        mainGameId: "game-hok",
        completenessScore: 90,
      });

      await projectProfileCreated({
        profileId: "p2",
        accountId: "a2",
        entityType: "player",
        displayName: "Budi Pratama",
        ign: "BudiML",
        slug: "budi-pratama",
        regionId: "r2",
        regionCode: "BKT",
        mainGameId: "game-mlbb",
        completenessScore: 70,
      });

      await projectProfileCreated({
        profileId: "t1",
        accountId: "a3",
        entityType: "team",
        displayName: "Padang Thunder",
        slug: "padang-thunder",
        regionId: "r1",
        regionCode: "PDG",
        mainGameId: "game-hok",
        completenessScore: 95,
      });
    });

    it("harus menyaring berdasarkan entityType", async () => {
      const res = await searchDirectory({ entityType: "team" });
      expect(res.total).toBe(1);
      expect(res.items[0].displayName).toBe("Padang Thunder");
    });

    it("harus menyaring berdasarkan regionCode (PDG vs BKT)", async () => {
      const res = await searchDirectory({ regionCode: "BKT" });
      expect(res.total).toBe(1);
      expect(res.items[0].displayName).toBe("Budi Pratama");
    });

    it("harus menyaring berdasarkan gameId (game-hok)", async () => {
      const res = await searchDirectory({ gameId: "game-hok" });
      expect(res.total).toBe(2);
    });

    it("harus mencari berdasarkan teks (nama atau IGN)", async () => {
      const res = await searchDirectory({ search: "aldoking" });
      expect(res.total).toBe(1);
      expect(res.items[0].displayName).toBe("Aldo Saputra");
    });

    it("harus mengurutkan berdasarkan kelengkapan profil (completeness)", async () => {
      const res = await searchDirectory({ sortBy: "completeness" });
      expect(res.items[0].completenessScore).toBe(95); // Padang Thunder
      expect(res.items[1].completenessScore).toBe(90); // Aldo
      expect(res.items[2].completenessScore).toBe(70); // Budi
    });

    it("harus membagi hasil dalam paginasi secara presisi", async () => {
      const page1 = await searchDirectory({ page: 1, limit: 2 });
      expect(page1.items.length).toBe(2);
      expect(page1.total).toBe(3);
      expect(page1.totalPages).toBe(2);

      const page2 = await searchDirectory({ page: 2, limit: 2 });
      expect(page2.items.length).toBe(1);
    });
  });

  describe("4. Caching & Revalidasi Berbasis Peristiwa", () => {
    it("panggilan kedua harus membaca dari cache (fromCache = true)", async () => {
      await projectProfileCreated({
        profileId: athleteId,
        accountId: "acc-001",
        entityType: "player",
        displayName: "Fajar Ramadhan",
        slug: athleteSlug,
        regionId: "reg-01",
      });

      const res1 = await searchDirectory({ entityType: "player" });
      expect(res1.fromCache).toBe(false);

      const res2 = await searchDirectory({ entityType: "player" });
      expect(res2.fromCache).toBe(true);
    });

    it("peristiwa baru harus membatalkan cache tag yang relevan secara otomatis", async () => {
      await projectProfileCreated({
        profileId: athleteId,
        accountId: "acc-001",
        entityType: "player",
        displayName: "Fajar Ramadhan",
        slug: athleteSlug,
        regionId: "reg-01",
      });

      await searchDirectory({ entityType: "player" }); // Mengisi cache

      // Kirim pembaruan profil yang memicu invalidasi cache
      await projectProfileUpdated({
        profileId: athleteId,
        changedFields: { displayName: "Fajar Ramadhan Baru" },
      });

      // Panggilan berikutnya harus cache miss (segar)
      const freshRes = await searchDirectory({ entityType: "player" });
      expect(freshRes.fromCache).toBe(false);
      expect(freshRes.items[0].displayName).toBe("Fajar Ramadhan Baru");
    });
  });

  describe("5. Agregasi Statistik Direktori Platform", () => {
    it("harus menghitung ringkasan statistik entitas dan wilayah aktif", async () => {
      await projectProfileCreated({
        profileId: "p1",
        accountId: "a1",
        entityType: "player",
        displayName: "P1",
        slug: "p1",
        regionId: "r1",
        regionCode: "PDG",
      });

      await projectProfileCreated({
        profileId: "c1",
        accountId: "a2",
        entityType: "coach",
        displayName: "C1",
        slug: "c1",
        regionId: "r2",
        regionCode: "BKT",
      });

      await projectProfileCreated({
        profileId: "t1",
        accountId: "a3",
        entityType: "team",
        displayName: "T1",
        slug: "t1",
        regionId: "r1",
        regionCode: "PDG",
      });

      await projectVerificationDecided({
        profileId: "p1",
        decision: "verified",
        badgeNo: "ESP-SB-VER-001",
      });

      const stats = await getDirectoryStats();
      expect(stats.totalEntities).toBe(3);
      expect(stats.totalPlayers).toBe(1);
      expect(stats.totalCoaches).toBe(1);
      expect(stats.totalTeams).toBe(1);
      expect(stats.activeRegions).toBe(2); // PDG, BKT
      expect(stats.verifiedCount).toBe(1);
    });
  });

  describe("6. Rekonsiliasi Model Baca Terjadwal", () => {
    it("harus mendeteksi drift antara basis data inti dan model baca dalam mode dry-run", async () => {
      // Simulasikan DB memiliki 1 profil yang belum masuk proyeksi
      const mockClient = {
        from: () => ({
          select: () =>
            Promise.resolve({
              data: [
                {
                  id: "missing-prof-1",
                  account_id: "acc-m1",
                  entity_type: "player",
                  display_name: "Missing Player",
                  slug: "missing-player",
                  verification_status: "verified",
                  is_published: true,
                },
              ],
              error: null,
            }),
        }),
      };

      const report = await reconcileDirectoryReadModel(true, mockClient as any);
      expect(report.isDryRun).toBe(true);
      expect(report.missingProjectionsCount).toBe(1);
      expect(report.details.missing).toContain("missing-prof-1");
      expect(report.fixedCount).toBe(0); // Dry-run tidak mengubah data
    });

    it("harus menyinkronkan data yang tertinggal dalam mode rekonsiliasi aktif (dryRun = false)", async () => {
      const mockClient = {
        from: () => ({
          select: () =>
            Promise.resolve({
              data: [
                {
                  id: "missing-prof-1",
                  account_id: "acc-m1",
                  entity_type: "player",
                  display_name: "Missing Player",
                  slug: "missing-player",
                  verification_status: "verified",
                  is_published: true,
                },
              ],
              error: null,
            }),
        }),
      };

      const report = await reconcileDirectoryReadModel(false, mockClient as any);
      expect(report.isDryRun).toBe(false);
      expect(report.missingProjectionsCount).toBe(1);
      expect(report.fixedCount).toBeGreaterThan(0);
      expect(directoryProjections.has("missing-prof-1")).toBe(true);
    });
  });

  describe("7. Kontrol Feature Flag & Rencana Rollback", () => {
    it("harus mengaktifkan USE_DIRECTORY_SERVICE secara default", () => {
      expect(FLAGS.USE_DIRECTORY_SERVICE).toBe(true);
    });

    it("harus mendukung fallback aman jika FEATURE_FLAG_DIRECTORY_SERVICE diset ke false", () => {
      const originalEnv = process.env.FEATURE_FLAG_DIRECTORY_SERVICE;
      try {
        process.env.FEATURE_FLAG_DIRECTORY_SERVICE = "false";
        expect(FLAGS.USE_DIRECTORY_SERVICE).toBe(false);
      } finally {
        if (originalEnv === undefined) {
          delete process.env.FEATURE_FLAG_DIRECTORY_SERVICE;
        } else {
          process.env.FEATURE_FLAG_DIRECTORY_SERVICE = originalEnv;
        }
      }
    });
  });
});
