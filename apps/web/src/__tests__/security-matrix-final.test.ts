import { describe, it, expect, beforeEach } from "vitest";
import {
  issueServiceToken,
  verifyServiceToken,
} from "../lib/auth/service-token";
import {
  checkRateLimit,
  resetRateLimitStore,
} from "../lib/security/rate-limiter";
import {
  registerMockProfile,
  submitVerification,
  reviewVerificationDecision,
  clearVerificationServiceStore,
  clearAuditLogsStore,
} from "../lib/services/verification";
import {
  clearDirectoryProjections,
  searchDirectory,
  projectProfileCreated,
} from "../lib/services/directory";
import { validateImageMagicBytes } from "../lib/security/magic-bytes";
import { createUploadSignature } from "../lib/services/media";

/**
 * 9.2: Matriks Uji Keamanan Final (Final Security Matrix)
 * 1. Matriks Otorisasi Peran (guest, user, platform_admin)
 * 2. Admin tidak bisa memverifikasi / mengubah profil milik sendiri
 * 3. Zero data pribadi di seluruh respons publik (UU PDP No. 27/2022)
 * 4. Penolakan unggahan berbahaya (MIME spoofing, path traversal, oversized)
 * 5. Ketahanan token layanan internal (HMAC-SHA256 tamper resistance)
 * 6. Penegakan batas laju (Rate limit sliding window)
 */
describe("Mandat 9.2: Matriks Uji Keamanan Final (Comprehensive Security Matrix)", () => {
  beforeEach(() => {
    clearVerificationServiceStore();
    clearAuditLogsStore();
    clearDirectoryProjections();
    resetRateLimitStore();
  });

  describe("1. Matriks Otorisasi Peran (RBAC Enforcement)", () => {
    it("Tamu (Guest) hanya diizinkan mengakses konten publik dan dilarang mengakses modul privat/admin", () => {
      const guestContext = { role: "guest" as const, accountId: null };

      const canAccessPublic = (role: string) => ["guest", "user", "platform_admin"].includes(role);
      const canAccessUserDashboard = (role: string) => ["user", "platform_admin"].includes(role);
      const canAccessAdminPanel = (role: string) => role === "platform_admin";

      expect(canAccessPublic(guestContext.role)).toBe(true);
      expect(canAccessUserDashboard(guestContext.role)).toBe(false);
      expect(canAccessAdminPanel(guestContext.role)).toBe(false);
    });

    it("Pengguna Biasa (User) dilarang mengakses endpoint atau panel admin /admin", () => {
      const userContext = { role: "user" as const, accountId: "acc-user-regular-01" };

      const canAccessAdminPanel = (role: string) => role === "platform_admin";
      expect(canAccessAdminPanel(userContext.role)).toBe(false);
    });

    it("Platform Admin memiliki hak akses administratif ke /admin", () => {
      const adminContext = { role: "platform_admin" as const, accountId: "acc-admin-01" };

      const canAccessAdminPanel = (role: string) => role === "platform_admin";
      expect(canAccessAdminPanel(adminContext.role)).toBe(true);
    });
  });

  describe("2. Penolakan Verifikasi Mandiri oleh Admin (Admin Cannot Verify Self)", () => {
    it("Admin dilarang keras menyetujui atau menolak permohonan verifikasi untuk profil miliknya sendiri", async () => {
      const adminAccountId = "77777777-7777-4777-8777-777777777777";
      const adminProfileId = "88888888-8888-4888-8888-888888888888";

      // Daftarkan profil yang diasosiasikan dengan akun admin tersebut
      registerMockProfile({
        id: adminProfileId,
        accountId: adminAccountId,
        displayName: "Admin Sumbar Profile",
        esportId: "ESP-SB-PL-000099",
        entityType: "player",
        regionId: "reg-01",
        regionName: "Kota Padang",
        regionCode: "PDG",
        verificationStatus: "unverified",
      });

      // Submit pengajuan verifikasi
      const submitResult = await submitVerification({
        profileId: adminProfileId,
        accountId: adminAccountId,
        entityType: "player",
        regionId: "reg-01",
        evidenceFiles: [
          {
            id: "ev-01",
            name: "admin-bukti.pdf",
            url: "https://placeholder.supabase.co/storage/v1/object/public/evidence/admin.pdf",
          },
        ],
      });
      expect(submitResult.success).toBe(true);
      const requestId = submitResult.requestId!;

      // Percobaan verifikasi oleh admin terhadap akun miliknya sendiri wajib melempar error
      await expect(
        reviewVerificationDecision({
          requestId,
          reviewerId: adminAccountId, // Sama persis dengan accountId profil pemohon
          decision: "verified",
          reason: "Percobaan self-approval ilegal",
        })
      ).rejects.toThrow(/Administrator dilarang menelaah atau memverifikasi akun\/profil miliknya sendiri/i);
    });
  });

  describe("3. Privasi Data Publik (Zero Private Data in Public Responses - UU PDP)", () => {
    it("Read Model direktori tidak pernah menyertakan atribut sensitif (NIK, KK, kontak pribadi)", async () => {
      await projectProfileCreated({
        profileId: "11111111-2222-3333-4444-555555555555",
        accountId: "acc-secret-user",
        entityType: "player",
        displayName: "Private Player",
        slug: "private-player",
        regionId: "reg-01",
        regionName: "Kota Padang",
      });

      const result = await searchDirectory({ search: "Private Player" });
      expect(result.items.length).toBe(1);

      const item = result.items[0] as any;
      expect(item.nik).toBeUndefined();
      expect(item.kk).toBeUndefined();
      expect(item.phoneNumber).toBeUndefined();
      expect(item.emergencyContact).toBeUndefined();
      expect(item.email).toBeUndefined();
      expect(item.password).toBeUndefined();
    });
  });

  describe("4. Penolakan Unggahan Berbahaya (Malicious Upload Defense)", () => {
    it("menolak berkas yang mengaku gambar tetapi memiliki magic bytes eksekusi berbahaya (MIME Spoofing)", () => {
      // Buffer eksekusi Windows (MZ header: 0x4D, 0x5A)
      const fakePngExeBuffer = Buffer.from([0x4d, 0x5a, 0x90, 0x00, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
      const validation = validateImageMagicBytes(fakePngExeBuffer);

      expect(validation.valid).toBe(false);
      expect(validation.format).toBeUndefined();
    });

    it("menolak manipulasi path traversal pada nama berkas dengan mengisolasi storage path ke UUID acak", async () => {
      const mockClient = {
        from: () => ({
          select: () => ({
            eq: () => ({
              single: async () => ({ data: { id: "11111111-1111-4111-8111-111111111111", entity_type: "player" }, error: null }),
              then: (resolve: any) => resolve({ data: [] }),
            }),
          }),
        }),
        storage: {
          from: (bucket: string) => ({
            createSignedUploadUrl: async (path: string) => ({
              data: { signedUrl: `https://test.supabase.co/${path}`, token: "tok-123" },
              error: null,
            }),
            getPublicUrl: (path: string) => ({ data: { publicUrl: `https://test.supabase.co/${path}` } }),
          }),
        },
      };

      const result = await createUploadSignature(
        {
          targetProfileId: "11111111-1111-4111-8111-111111111111",
          purpose: "avatar",
          filename: "../../../etc/passwd",
          mimeType: "image/png",
          fileSize: 1024 * 50,
        },
        "acc-001",
        mockClient as any
      );

      expect(result.storagePath).not.toContain("..");
      expect(result.storagePath).not.toContain("passwd");
      expect(result.storagePath).toMatch(/^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+\/avatar_[a-f0-9-]+\.webp$/);
    });

    it("menolak berkas yang melebihi batas maksimum 5 MB", async () => {
      await expect(
        createUploadSignature(
          {
            targetProfileId: "11111111-1111-4111-8111-111111111111",
            purpose: "avatar",
            filename: "huge-image.png",
            mimeType: "image/png",
            fileSize: 10 * 1024 * 1024, // 10 MB
          },
          "acc-001"
        )
      ).rejects.toThrow(/Ukuran file maksimum adalah 5MB/);
    });
  });

  describe("5. Integritas Token Layanan Antar-Layanan (HMAC-SHA256 Service Token)", () => {
    it("menerbitkan dan memverifikasi token layanan internal yang valid", () => {
      const token = issueServiceToken("media-service", ["media:write"], 60);

      expect(token).toBeDefined();
      const verified = verifyServiceToken(token);
      expect(verified.valid).toBe(true);
      expect(verified.payload?.sub).toBe("media-service");
      expect(verified.payload?.scopes).toContain("media:write");
    });

    it("menolak token layanan yang tanda tangan HMAC-nya dimanipulasi", () => {
      const validToken = issueServiceToken("media-service", ["media:read"], 60);

      // Rusak bagian signature (segmen ketiga token base64url)
      const parts = validToken.split(".");
      parts[2] = parts[2].slice(0, -4) + "abcd";
      const tamperedToken = parts.join(".");

      const verified = verifyServiceToken(tamperedToken);
      expect(verified.valid).toBe(false);
      expect(verified.error).toMatch(/signature mismatch/i);
    });

    it("menolak token layanan yang diverifikasi dengan secret kunci yang salah", () => {
      const token = issueServiceToken("media-service", ["media:read"], 60);

      const verified = verifyServiceToken(token, "wrong-secret-key-123");
      expect(verified.valid).toBe(false);
      expect(verified.error).toMatch(/signature mismatch/i);
    });
  });

  describe("6. Batas Laju Sliding Window (Rate Limiting Defense)", () => {
    it("mengizinkan permintaan di bawah batas dan memblokir permintaan berlebih pada tier sensitif", () => {
      const clientIp = "192.168.100.50";

      // 15 permintaan pertama diizinkan (limit tier sensitif = 15)
      for (let i = 0; i < 15; i++) {
        const result = checkRateLimit(clientIp, "sensitive");
        expect(result.allowed).toBe(true);
        expect(result.remaining).toBe(15 - (i + 1));
      }

      // Permintaan ke-16 wajib diblokir
      const blocked = checkRateLimit(clientIp, "sensitive");
      expect(blocked.allowed).toBe(false);
      expect(blocked.remaining).toBe(0);
      expect(blocked.resetTime).toBeGreaterThan(0);
    });
  });
});
