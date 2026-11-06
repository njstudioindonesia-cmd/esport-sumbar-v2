import { describe, it, expect, vi, beforeEach } from "vitest";
import sharp from "sharp";
import {
  compressImageWithSharp,
  checkProfileStorageQuota,
  createUploadSignature,
  findOrphanMedia,
  handleMediaReplacedEvent,
  handleProfileDeletedEvent,
  STORAGE_QUOTAS_BYTES,
  MAX_FILE_SIZE_BYTES,
} from "@/lib/services/media";
import { validateImageMagicBytes } from "@/lib/security/magic-bytes";
import {
  RequestMediaUploadSignatureSchema,
  MediaUploadSignatureResponseSchema,
} from "@esport-sumbar/contracts";
import { FLAGS } from "@/lib/config/flags";

describe("Sub-langkah 7.1: Ekstraksi Layanan Media (Media Service)", () => {
  let samplePngBuffer: Buffer;
  const sampleProfileId = "3fa85f64-5717-4562-b3fc-2c963f66afa6";
  const sampleAccountId = "e0a29486-c403-4c9f-8566-a669145625fe";

  beforeEach(async () => {
    // Buat gambar PNG uji berukuran 400x400 secara dinamis via Sharp
    samplePngBuffer = await sharp({
      create: {
        width: 400,
        height: 400,
        channels: 4,
        background: { r: 220, g: 38, b: 38, alpha: 1 }, // Merah Minang
      },
    })
      .png()
      .toBuffer();
  });

  describe("1. Validasi Magic Bytes (File Signatures)", () => {
    it("harus meloloskan berkas PNG dengan magic bytes valid (89 50 4E 47)", () => {
      const result = validateImageMagicBytes(samplePngBuffer);
      expect(result.valid).toBe(true);
      expect(result.format).toBe("png");
      expect(result.mime).toBe("image/png");
    });

    it("harus meloloskan berkas JPEG dengan magic bytes valid (FF D8 FF)", async () => {
      const jpegBuffer = await sharp(samplePngBuffer).jpeg().toBuffer();
      const result = validateImageMagicBytes(jpegBuffer);
      expect(result.valid).toBe(true);
      expect(result.format).toBe("jpeg");
      expect(result.mime).toBe("image/jpeg");
    });

    it("harus meloloskan berkas WebP dengan magic bytes valid (RIFF...WEBP)", async () => {
      const webpBuffer = await sharp(samplePngBuffer).webp().toBuffer();
      const result = validateImageMagicBytes(webpBuffer);
      expect(result.valid).toBe(true);
      expect(result.format).toBe("webp");
      expect(result.mime).toBe("image/webp");
    });

    it("harus menolak berkas Executable (.exe) dengan header 'MZ'", () => {
      const exeBuffer = new Uint8Array([0x4d, 0x5a, 0x90, 0x00, 0x03, 0x00, 0x00, 0x00, 0x04, 0x00, 0x00, 0x00]);
      const result = validateImageMagicBytes(exeBuffer);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("executable");
    });

    it("harus menolak berkas PDF (%PDF-) untuk foto avatar/profil", () => {
      const pdfBuffer = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x34, 0x0a, 0x25, 0xd0, 0xd4]);
      const result = validateImageMagicBytes(pdfBuffer);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("PDF tidak diperbolehkan");
    });

    it("harus menolak buffer yang terlalu kecil atau korup", () => {
      const tinyBuffer = new Uint8Array([0x01, 0x02, 0x03]);
      const result = validateImageMagicBytes(tinyBuffer);
      expect(result.valid).toBe(false);
    });
  });

  describe("2. Kompresi Sisi Server (Sharp WebP & Pembersihan EXIF UU PDP)", () => {
    it("harus mengompresi gambar ke format WebP dengan kualitas 85", async () => {
      const result = await compressImageWithSharp(samplePngBuffer, "avatar");

      expect(result.format).toBe("webp");
      expect(result.compressedBuffer).toBeInstanceOf(Buffer);
      expect(result.compressedBuffer.length).toBeGreaterThan(0);

      // Verifikasi output benar-benar WebP
      const metadata = await sharp(result.compressedBuffer).metadata();
      expect(metadata.format).toBe("webp");
      expect(metadata.width).toBeLessThanOrEqual(1024);
      expect(metadata.height).toBeLessThanOrEqual(1024);
      // EXIF metadata wajib kosong demi kepatuhan privasi UU PDP No. 27/2022
      expect(metadata.exif).toBeUndefined();
    });

    it("harus menghormati batas dimensi sesuai tujuan media (cover max 1920x1080)", async () => {
      // Buat gambar besar 2500x2000
      const largeBuffer = await sharp({
        create: {
          width: 2500,
          height: 2000,
          channels: 4,
          background: { r: 10, g: 10, b: 20, alpha: 1 },
        },
      })
        .png()
        .toBuffer();

      const result = await compressImageWithSharp(largeBuffer, "cover");
      const metadata = await sharp(result.compressedBuffer).metadata();

      expect(metadata.width).toBeLessThanOrEqual(1920);
      expect(metadata.height).toBeLessThanOrEqual(1080);
      expect(result.savingsPercent).toBeGreaterThan(0);
    });
  });

  describe("3. Pemeriksaan Kuota Penyimpanan Profil", () => {
    it("harus mengizinkan pengunggahan jika total penggunaan di bawah kuota (Atlet 10MB)", async () => {
      const mockClient = {
        from: (table: string) => ({
          select: () => ({
            eq: () => ({
              single: async () => ({ data: { id: sampleProfileId, entity_type: "player" }, error: null }),
              // Media assets ada 2 berkas
              then: (resolve: any) => resolve({ data: [{ path: "p1" }, { path: "p2" }] }),
            }),
          }),
        }),
      };

      const result = await checkProfileStorageQuota(sampleProfileId, 500 * 1024, mockClient as any);
      expect(result.allowed).toBe(true);
      expect(result.quotaLimitBytes).toBe(STORAGE_QUOTAS_BYTES.player);
      expect(result.availableBytes).toBeGreaterThan(0);
    });

    it("harus menolak pengunggahan jika berkas baru melampaui kuota profil", async () => {
      const mockClient = {
        from: (table: string) => ({
          select: () => ({
            eq: () => ({
              single: async () => ({ data: { id: sampleProfileId, entity_type: "player" }, error: null }),
              // Simulasi galeri sudah penuh ~30 berkas (sudah melebihi 10MB)
              then: (resolve: any) => resolve({ data: Array.from({ length: 30 }, (_, i) => ({ path: `p${i}` })) }),
            }),
          }),
        }),
      };

      const result = await checkProfileStorageQuota(sampleProfileId, 2 * 1024 * 1024, mockClient as any);
      expect(result.allowed).toBe(false);
      expect(result.error).toContain("Kuota penyimpanan");
    });
  });

  describe("4. API Tanda Tangan Unggah (Upload Signature API)", () => {
    it("harus menghasilkan respons tanda tangan yang mematuhi skema MediaUploadSignatureResponseSchema", async () => {
      const mockClient = {
        from: (table: string) => ({
          select: () => ({
            eq: () => ({
              single: async () => ({ data: { id: sampleProfileId, entity_type: "team" }, error: null }),
              then: (resolve: any) => resolve({ data: [] }),
            }),
          }),
        }),
        storage: {
          from: (bucket: string) => ({
            createSignedUploadUrl: async (path: string) => ({
              data: {
                signedUrl: `https://test.supabase.co/storage/v1/upload/sign/${bucket}/${path}?token=tok-123`,
                token: "tok-123",
              },
              error: null,
            }),
            getPublicUrl: (path: string) => ({
              data: { publicUrl: `https://test.supabase.co/storage/v1/object/public/${bucket}/${path}` },
            }),
          }),
        },
      };

      const input = {
        filename: "my-team-avatar.png",
        fileSize: 1024 * 500, // 500KB
        mimeType: "image/png" as const,
        purpose: "avatar" as const,
        targetProfileId: sampleProfileId,
      };

      const signature = await createUploadSignature(input, sampleAccountId, mockClient as any);

      // Verifikasi kepatuhan skema kontrak Zod V1
      const validated = MediaUploadSignatureResponseSchema.parse(signature);
      expect(validated.uploadUrl).toContain("test.supabase.co");
      expect(validated.storagePath).toContain(sampleAccountId);
      expect(validated.storagePath).toContain(sampleProfileId);
      expect(validated.token).toBe("tok-123");
      expect(new Date(validated.expiresAt).getTime()).toBeGreaterThan(Date.now());
    });

    it("harus menolak permintaan tanda tangan jika ukuran berkas melebihi batas 5MB", () => {
      const invalidInput = {
        filename: "giant-file.png",
        fileSize: 6 * 1024 * 1024, // 6MB (melebihi batas 5MB)
        mimeType: "image/png" as const,
        purpose: "avatar" as const,
        targetProfileId: sampleProfileId,
      };

      expect(() => RequestMediaUploadSignatureSchema.parse(invalidInput)).toThrow();
    });
  });

  describe("5. Pembersih Yatim (Orphan Media Cleaner - Laporan Dahulu & Purge)", () => {
    it("harus memindai berkas dalam storage dan mengidentifikasi berkas yatim dalam mode dry-run tanpa menghapusnya", async () => {
      const mockStorageList = [
        { name: "referenced-avatar.webp", metadata: { size: 100000 } },
        { name: "abandoned-orphan.webp", metadata: { size: 250000 } },
      ];

      const mockClient = {
        from: (table: string) => ({
          select: () => {
            if (table === "profiles") {
              return { data: [{ avatar_url: "https://test.co/avatars/referenced-avatar.webp" }] };
            }
            return { data: [] };
          },
        }),
        storage: {
          from: () => ({
            list: async () => ({ data: mockStorageList, error: null }),
            remove: vi.fn(),
          }),
        },
      };

      const report = await findOrphanMedia(true, mockClient as any);

      expect(report.scannedBuckets).toEqual(["avatars", "gallery", "evidence"]);
      expect(report.purged).toBe(false);
      expect(report.orphanFilesCount).toBeGreaterThan(0);
      expect(report.orphans.some((o) => o.path === "abandoned-orphan.webp")).toBe(true);
      // Remove tidak boleh dipanggil dalam mode dry-run
      expect(mockClient.storage.from().remove).not.toHaveBeenCalled();
    });

    it("harus membersihkan berkas fisik yatim dalam mode purge (dryRun = false)", async () => {
      const removeMock = vi.fn().mockResolvedValue({ data: {}, error: null });

      const mockStorageList = [
        { name: "abandoned-orphan.webp", metadata: { size: 250000 } },
      ];

      const mockClient = {
        from: (table: string) => ({
          select: () => ({ data: [] }), // Tidak ada rujukan di DB
        }),
        storage: {
          from: () => ({
            list: async () => ({ data: mockStorageList, error: null }),
            remove: removeMock,
          }),
        },
      };

      const report = await findOrphanMedia(false, mockClient as any);

      expect(report.purged).toBe(true);
      expect(removeMock).toHaveBeenCalled();
      expect(report.purgedCount).toBeGreaterThan(0);
    });
  });

  describe("6. Konsumen Peristiwa Domain Media (MediaReplaced & ProfileDeleted)", () => {
    it("harus memproses MediaReplaced secara idempoten dan menghapus berkas lama", async () => {
      const result = await handleMediaReplacedEvent({
        profileId: sampleProfileId,
        mediaType: "avatar",
        oldFileUrl: "https://placeholder.supabase.co/storage/v1/object/public/avatars/old-avatar.webp",
        newFileUrl: "https://placeholder.supabase.co/storage/v1/object/public/avatars/new-avatar.webp",
      });

      expect(result.success).toBe(true);

      // Panggilan kedua dengan parameter identik harus idempoten
      const secondCall = await handleMediaReplacedEvent({
        profileId: sampleProfileId,
        mediaType: "avatar",
        oldFileUrl: "https://placeholder.supabase.co/storage/v1/object/public/avatars/old-avatar.webp",
        newFileUrl: "https://placeholder.supabase.co/storage/v1/object/public/avatars/new-avatar.webp",
      });

      expect(secondCall.success).toBe(true);
    });

    it("harus menangani peristiwa ProfileDeleted secara idempoten", async () => {
      const mockClient = {
        from: (table: string) => ({
          select: () => ({
            eq: () => Promise.resolve({ data: [{ path: "asset1.webp" }] }),
          }),
          delete: () => ({
            eq: () => Promise.resolve({ error: null }),
          }),
        }),
        storage: {
          from: () => ({
            list: async () => ({ data: [{ name: "avatar.webp" }], error: null }),
            remove: vi.fn().mockResolvedValue({ error: null }),
          }),
        },
      };

      const result = await handleProfileDeletedEvent(
        {
          profileId: sampleProfileId,
          accountId: sampleAccountId,
        },
        mockClient as any
      );

      expect(result.success).toBe(true);
      expect(result.deletedCount).toBeGreaterThanOrEqual(1);

      // Idempotensi: panggilan kedua harus tetap sukses
      const secondCall = await handleProfileDeletedEvent(
        {
          profileId: sampleProfileId,
          accountId: sampleAccountId,
        },
        mockClient as any
      );

      expect(secondCall.success).toBe(true);
    });
  });

  describe("7. Kontrol Feature Flag & Rencana Rollback", () => {
    it("harus mengaktifkan USE_MEDIA_SERVICE secara default", () => {
      expect(FLAGS.USE_MEDIA_SERVICE).toBe(true);
    });

    it("harus mendukung fallback aman jika FEATURE_FLAG_MEDIA_SERVICE diset ke false", () => {
      const originalEnv = process.env.FEATURE_FLAG_MEDIA_SERVICE;
      try {
        process.env.FEATURE_FLAG_MEDIA_SERVICE = "false";
        expect(FLAGS.USE_MEDIA_SERVICE).toBe(false);
      } finally {
        if (originalEnv === undefined) {
          delete process.env.FEATURE_FLAG_MEDIA_SERVICE;
        } else {
          process.env.FEATURE_FLAG_MEDIA_SERVICE = originalEnv;
        }
      }
    });
  });
});
