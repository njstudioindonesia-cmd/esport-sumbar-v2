import { describe, it, expect, beforeEach } from "vitest";
import {
  IdentityModule,
  ProfileModule,
  EcosystemModule,
  CatalogModule,
} from "../lib/services/core";
import { clearAuditLogsStore } from "../lib/services/verification/audit";
import { clearIdempotencyStore } from "@esport-sumbar/lib";

describe("Sub-langkah 7.6: Modularisasi Subdomain Core (Identity, Profile, Ecosystem, Catalog)", () => {
  beforeEach(() => {
    IdentityModule.clearIdentityStore();
    ProfileModule.clearProfileStore();
    EcosystemModule.clearEcosystemStore();
    CatalogModule.clearCatalogStore();
    clearAuditLogsStore();
    clearIdempotencyStore();
  });

  describe("1. Subdomain Core: Identity", () => {
    it("harus mengambil akun berdasarkan ID murni tanpa bergantung pada profil", async () => {
      IdentityModule.registerMockAccount({
        id: "acc-admin-1",
        email: "admin.platform@esportsumbar.com",
        role: "platform_admin",
        isActive: true,
        createdAt: new Date().toISOString(),
      });

      const account = await IdentityModule.getAccountById("acc-admin-1");
      expect(account).toBeDefined();
      expect(account?.role).toBe("platform_admin");
      expect(account?.email).toBe("admin.platform@esportsumbar.com");
    });

    it("harus memvalidasi peran platform_admin dan menolak akun non-aktif", async () => {
      IdentityModule.registerMockAccount({
        id: "acc-user-banned",
        email: "banned@user.com",
        role: "user",
        isActive: false,
        createdAt: new Date().toISOString(),
      });

      const res = await IdentityModule.verifyUserRole("acc-user-banned", "user");
      expect(res.isAuthorized).toBe(false);
      expect(res.error).toContain("Akun telah dinonaktifkan");
    });
  });

  describe("2. Subdomain Core: Profile (1 Akun = 1 Profil & Immutabilitas)", () => {
    it("harus menegakkan aturan 1 akun = 1 profil (UNIQUE account_id)", async () => {
      await ProfileModule.createProfile({
        accountId: "acc-player-1",
        entityType: "player",
        displayName: "Fajar Ramadhan",
        regionId: "reg-pdg",
      });

      // Percobaan membuat profil kedua untuk akun yang sama harus melempar error
      await expect(
        ProfileModule.createProfile({
          accountId: "acc-player-1",
          entityType: "coach",
          displayName: "Coach Fajar",
          regionId: "reg-pdg",
        })
      ).rejects.toThrow(/Akun ini telah memiliki profil.*Satu akun hanya boleh memiliki 1 profil bidang/);
    });

    it("harus menegakkan bahwa jenis entitas (entityType) bersifat permanen dan tidak dapat diubah", async () => {
      const prof = await ProfileModule.createProfile({
        accountId: "acc-player-2",
        entityType: "player",
        displayName: "Budi Pratama",
        regionId: "reg-bkt",
      });

      // Percobaan mengubah entityType dari player menjadi team harus melempar error
      await expect(
        ProfileModule.updateProfile({
          id: prof.id,
          attemptedEntityTypeChange: "team",
        })
      ).rejects.toThrow(/Jenis entitas profil \(player\) bersifat permanen dan tidak dapat diubah/);
    });

    it("harus mengecualikan seluruh data sensitif (NIK/KK/KTP) demi perlindungan data pribadi", async () => {
      const prof = await ProfileModule.createProfile({
        accountId: "acc-player-3",
        entityType: "player",
        displayName: "Aldo Saputra",
        regionId: "reg-slk",
        attributes: {
          ign: "AldoS",
          nik: "1371010101990001", // Percobaan menyisipkan NIK
          ktp: "file-ktp.jpg",
          jerseySize: "XL",
        },
      });

      // Atribut sensitif harus dihapus oleh layanan profil
      expect((prof.attributes as any).nik).toBeUndefined();
      expect((prof.attributes as any).ktp).toBeUndefined();
      expect(prof.attributes.jerseySize).toBe("XL");
    });
  });

  describe("3. Subdomain Core: Ecosystem (Penegakan Aturan Relasi)", () => {
    beforeEach(() => {
      EcosystemModule.registerMockRules([
        {
          id: "rule-player-team",
          sourceEntityType: "player",
          targetEntityType: "team",
          relationType: "roster_member",
          requiresApproval: true,
          maxActiveLimit: 1, // Atlet hanya boleh bergabung ke 1 tim aktif
          gameMatchRequired: true,
          isActive: true,
        },
      ]);
    });

    it("harus menolak permohonan relasi jika pasangan entitas tidak ada dalam relation_rules", async () => {
      await expect(
        EcosystemModule.requestRelation({
          sourceProfileId: "prof-venue-1",
          sourceEntityType: "venue",
          targetProfileId: "prof-player-1",
          targetEntityType: "player",
          relationType: "roster_member",
        })
      ).rejects.toThrow(/tidak diizinkan oleh aturan ekosistem/);
    });

    it("harus menolak permohonan relasi jika game tidak cocok padahal gameMatchRequired = true", async () => {
      await expect(
        EcosystemModule.requestRelation({
          sourceProfileId: "prof-player-1",
          sourceEntityType: "player",
          sourceGameId: "valorant",
          targetProfileId: "prof-team-1",
          targetEntityType: "team",
          targetGameId: "mlbb",
          relationType: "roster_member",
        })
      ).rejects.toThrow(/mensyaratkan divisi game yang sama/);
    });

    it("harus menolak permohonan relasi jika batas maksimum relasi aktif terlampaui", async () => {
      // Daftarkan relasi yang sudah aktif untuk pemain
      EcosystemModule.registerMockRelation({
        id: "rel-active-1",
        sourceProfileId: "prof-p1",
        targetProfileId: "prof-team-old",
        relationType: "roster_member",
        gameId: "valorant",
        status: "active",
        initiatedBy: "prof-p1",
        respondedBy: "prof-team-old",
        startedAt: new Date().toISOString(),
        endedAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // Permohonan kedua ke tim lain harus ditolak karena limit = 1
      await expect(
        EcosystemModule.requestRelation({
          sourceProfileId: "prof-p1",
          sourceEntityType: "player",
          sourceGameId: "valorant",
          targetProfileId: "prof-team-new",
          targetEntityType: "team",
          targetGameId: "valorant",
          relationType: "roster_member",
          gameId: "valorant",
        })
      ).rejects.toThrow(/Batas maksimum relasi aktif.*telah tercapai/);
    });

    it("harus mengakhiri seluruh relasi secara otomatis saat profil dinonaktifkan (Kaskade)", async () => {
      EcosystemModule.registerMockRelation({
        id: "rel-1",
        sourceProfileId: "prof-suspended",
        targetProfileId: "prof-team-1",
        relationType: "roster_member",
        gameId: "valorant",
        status: "active",
        initiatedBy: "prof-suspended",
        respondedBy: "prof-team-1",
        startedAt: new Date().toISOString(),
        endedAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      const endedCount = await EcosystemModule.cascadeEndRelationsOnProfileTermination(
        "prof-suspended",
        "Profil ditangguhkan karena pelanggaran"
      );

      expect(endedCount).toBe(1);
    });
  });

  describe("4. Subdomain Core: Catalog (Katalog Game Dinamis & HOK)", () => {
    it("harus menyediakan Honor of Kings (HOK) dalam daftar game aktif", async () => {
      const games = await CatalogModule.getActiveGames();
      const hok = games.find((g) => g.slug === "honor-of-kings" || g.id === "game-hok");

      expect(hok).toBeDefined();
      expect(hok?.name).toBe("Honor of Kings");
      expect(hok?.genre).toBe("moba");
      expect(hok?.roles).toContain("Clash Lane");
      expect(hok?.ranks).toContain("Grandmaster");
    });

    it("harus mengambil metadata game berdasarkan slug atau ID tanpa dependensi profil", async () => {
      const game = await CatalogModule.getGameByIdOrSlug("honor-of-kings");
      expect(game).toBeDefined();
      expect(game?.name).toBe("Honor of Kings");
    });
  });

  describe("5. Isolasi Batas Modul & Zero-JOIN Data Hydration", () => {
    it("harus menghidrasi relasi antar entitas menggunakan ID murni tanpa perintah SQL JOIN", async () => {
      // 1. Akun di modul Identity
      IdentityModule.registerMockAccount({
        id: "acc-p100",
        email: "player100@sumbar.com",
        role: "user",
        isActive: true,
        createdAt: new Date().toISOString(),
      });

      // 2. Profil di modul Profile (merujuk account_id dan main_game_id murni)
      const profile = await ProfileModule.createProfile({
        accountId: "acc-p100",
        entityType: "player",
        displayName: "Rizky Firmansyah",
        regionId: "reg-padang",
        mainGameId: "game-hok",
      });

      // 3. Hidrasi nama game dari modul Catalog via ID murni
      const game = await CatalogModule.getGameByIdOrSlug(profile.mainGameId!);

      expect(profile.accountId).toBe("acc-p100");
      expect(profile.mainGameId).toBe("game-hok");
      expect(game?.name).toBe("Honor of Kings");
    });
  });
});
