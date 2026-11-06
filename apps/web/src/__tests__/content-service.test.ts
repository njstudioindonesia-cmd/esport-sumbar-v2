import { describe, it, expect, beforeEach } from "vitest";
import {
  canTransitionArticle,
  validateEditorialTransition,
  generateArticleSlug,
  searchArticles,
  getArticleBySlug,
  createArticle,
  updateArticle,
  transitionArticleStatus,
  deleteArticle,
  getContentStats,
  clearContentServiceStore,
  registerMockArticle,
} from "../lib/services/content";
import { clearAuditLogsStore, queryAuditLogs } from "../lib/services/verification/audit";
import { clearIdempotencyStore } from "@esport-sumbar/lib";

describe("Sub-langkah 7.5: Ekstraksi Layanan Konten & Berita (Content Service / CMS)", () => {
  beforeEach(() => {
    clearContentServiceStore();
    clearAuditLogsStore();
    clearIdempotencyStore();
  });

  describe("1. Alur Kerja Editorial (Editorial Workflow V3)", () => {
    it("harus mengizinkan transisi status editorial yang sah", () => {
      expect(canTransitionArticle("draft", "editorial_review")).toBe(true);
      expect(canTransitionArticle("editorial_review", "published")).toBe(true);
      expect(canTransitionArticle("published", "archived")).toBe(true);
      expect(canTransitionArticle("archived", "published")).toBe(true);
      expect(canTransitionArticle("archived", "draft")).toBe(true);
    });

    it("harus menolak publikasi atau pengarsipan jika dilakukan oleh non-admin", () => {
      expect(() => {
        validateEditorialTransition({
          articleId: "art-1",
          targetStatus: "published",
          actorId: "user-1",
          actorRole: "user",
        });
      }).toThrow(/Hanya platform_admin ESPORT SUMBAR yang berwenang/);

      expect(() => {
        validateEditorialTransition({
          articleId: "art-1",
          targetStatus: "archived",
          actorId: "user-1",
          actorRole: "user",
          reason: "Artikel sudah usang",
        });
      }).toThrow(/Hanya platform_admin ESPORT SUMBAR yang berwenang/);
    });

    it("harus mewajibkan alasan minimal 5 karakter saat artikel diarsipkan", () => {
      expect(() => {
        validateEditorialTransition({
          articleId: "art-1",
          targetStatus: "archived",
          actorId: "admin-1",
          actorRole: "platform_admin",
          reason: "no",
        });
      }).toThrow(/Alasan pengarsipan artikel wajib disertakan minimal 5 karakter/);
    });

    it("harus menghasilkan slug URL yang bersih, aman, dan ramah SEO", () => {
      const slug = generateArticleSlug("Turnamen Esports Minang Cup 2026 Dibuka!");
      expect(slug).toBe("turnamen-esports-minang-cup-2026-dibuka");
    });
  });

  describe("2. Manajemen Konten & Penyaringan Terindeks", () => {
    it("harus membuat artikel draft baru dan mencatat riwayat audit", async () => {
      const created = await createArticle(
        {
          title: "Pengumuman Pembukaan Pendaftaran Turnamen Valorant Sumbar",
          summary: "Informasi lengkap mengenai jadwal dan tata cara pendaftaran kualifikasi.",
          content: "ESPORT SUMBAR secara resmi membuka pendaftaran kualifikasi terbuka bagi seluruh atlet dan tim.",
          category: "turnamen",
          tags: ["valorant", "turnamen", "padang"],
          status: "draft",
        },
        "admin-editor-1",
        "platform_admin"
      );

      expect(created.id).toBeDefined();
      expect(created.slug).toBe("pengumuman-pembukaan-pendaftaran-turnamen-valorant-sumbar");
      expect(created.status).toBe("draft");
      expect(created.publishedAt).toBeNull();

      // Periksa riwayat audit
      const { logs } = await queryAuditLogs({ targetId: created.id });
      expect(logs.length).toBe(1);
      expect(logs[0].action).toBe("ARTICLE_CREATED");
    });

    it("harus memfilter artikel berdasarkan kategori dan wilayah", async () => {
      registerMockArticle({
        id: "art-1",
        slug: "turnamen-padang",
        title: "Turnamen Kota Padang",
        summary: "Turnamen lokal",
        content: "Konten lengkap turnamen padang.",
        category: "turnamen",
        coverImageUrl: null,
        regionId: "reg-pdg",
        regionName: "Kota Padang",
        primaryGameId: "valorant",
        tags: ["turnamen"],
        status: "published",
        authorId: "admin-1",
        viewCount: 10,
        publishedAt: "2026-11-06T10:00:00.000Z",
        createdAt: "2026-11-06T10:00:00.000Z",
        updatedAt: "2026-11-06T10:00:00.000Z",
      });

      registerMockArticle({
        id: "art-2",
        slug: "komunitas-bkt",
        title: "Kumpul Komunitas Bukittinggi",
        summary: "Gathering komunitas",
        content: "Konten gathering komunitas Bukittinggi.",
        category: "komunitas",
        coverImageUrl: null,
        regionId: "reg-bkt",
        regionName: "Kota Bukittinggi",
        primaryGameId: "mlbb",
        tags: ["komunitas"],
        status: "published",
        authorId: "admin-1",
        viewCount: 5,
        publishedAt: "2026-11-05T10:00:00.000Z",
        createdAt: "2026-11-05T10:00:00.000Z",
        updatedAt: "2026-11-05T10:00:00.000Z",
      });

      // Filter kategori turnamen
      const tournamentRes = await searchArticles({ category: "turnamen" });
      expect(tournamentRes.articles.length).toBe(1);
      expect(tournamentRes.articles[0].id).toBe("art-1");

      // Filter wilayah reg-bkt
      const bktRes = await searchArticles({ regionId: "reg-bkt" });
      expect(bktRes.articles.length).toBe(1);
      expect(bktRes.articles[0].id).toBe("art-2");
    });

    it("harus mencari artikel berdasarkan kata kunci judul dan ringkasan", async () => {
      registerMockArticle({
        id: "art-hok",
        slug: "strategi-honor-of-kings",
        title: "Panduan Taktik Honor of Kings untuk Skuad Pemula",
        summary: "Tips dan trik rotasi lane pada meta terbaru HOK.",
        content: "Honor of Kings menuntut rotasi agresif dan penguasaan objektif peta.",
        category: "edukasi",
        coverImageUrl: null,
        regionId: null,
        primaryGameId: "hok",
        tags: ["hok", "edukasi"],
        status: "published",
        authorId: "admin-1",
        viewCount: 45,
        publishedAt: "2026-11-06T11:00:00.000Z",
        createdAt: "2026-11-06T11:00:00.000Z",
        updatedAt: "2026-11-06T11:00:00.000Z",
      });

      const searchRes = await searchArticles({ q: "honor of kings" });
      expect(searchRes.articles.length).toBe(1);
      expect(searchRes.articles[0].slug).toBe("strategi-honor-of-kings");
    });
  });

  describe("3. Caching Berbasis Tag Reaktif", () => {
    it("panggilan kedua harus membaca dari cache (fromCache = true)", async () => {
      registerMockArticle({
        id: "art-c1",
        slug: "berita-cache-test",
        title: "Berita Pengujian Cache",
        summary: "Ringkasan uji cache",
        content: "Konten uji cache.",
        category: "pengumuman",
        coverImageUrl: null,
        regionId: null,
        primaryGameId: null,
        tags: [],
        status: "published",
        authorId: null,
        viewCount: 0,
        publishedAt: "2026-11-06T12:00:00.000Z",
        createdAt: "2026-11-06T12:00:00.000Z",
        updatedAt: "2026-11-06T12:00:00.000Z",
      });

      const firstCall = await searchArticles({ category: "pengumuman" });
      expect(firstCall.fromCache).toBe(false);

      const secondCall = await searchArticles({ category: "pengumuman" });
      expect(secondCall.fromCache).toBe(true);
      expect(secondCall.articles.length).toBe(1);
    });

    it("pembaruan artikel harus membatalkan cache tag yang relevan secara otomatis", async () => {
      const created = await createArticle(
        {
          title: "Artikel Pertama untuk Cache Invalidation",
          summary: "Ringkasan",
          content: "Isi konten awal yang akan diubah.",
          category: "edukasi",
          status: "published",
        },
        "admin-1",
        "platform_admin"
      );

      // Isi cache
      const initial = await searchArticles({ category: "edukasi" });
      expect(initial.fromCache).toBe(false);

      // Update artikel
      await updateArticle(
        {
          id: created.id,
          title: "Artikel Pertama Setelah Direvisi",
        },
        "admin-1",
        "platform_admin"
      );

      // Kueri berikutnya harus cache-miss dan memuat judul baru
      const afterUpdate = await searchArticles({ category: "edukasi" });
      expect(afterUpdate.fromCache).toBe(false);
      expect(afterUpdate.articles[0].title).toBe("Artikel Pertama Setelah Direvisi");
    });
  });

  describe("4. Transisi Editorial & Emisi Peristiwa Outbox Domain", () => {
    it("harus mempublikasikan artikel draft dan menetapkan publishedAt secara otomatis", async () => {
      const created = await createArticle(
        {
          title: "Panduan Regulasi Turnamen Resmi",
          content: "Regulasi kompetisi resmi yang disusun secara profesional oleh ESPORT SUMBAR.",
          category: "pengumuman",
          status: "draft",
        },
        "admin-1",
        "platform_admin"
      );

      expect(created.publishedAt).toBeNull();

      const published = await transitionArticleStatus({
        articleId: created.id,
        targetStatus: "published",
        actorId: "admin-publisher",
        actorRole: "platform_admin",
      });

      expect(published.status).toBe("published");
      expect(published.publishedAt).toBeDefined();

      // Periksa jejak audit
      const { logs } = await queryAuditLogs({ targetId: created.id });
      const transitionLog = logs.find((l) => l.action === "ARTICLE_STATUS_TRANSITION");
      expect(transitionLog).toBeDefined();
      expect(transitionLog?.newStatus).toBe("published");
    });

    it("harus menghitung metrik statistik konten platform dengan presisi", async () => {
      registerMockArticle({
        id: "a1",
        slug: "a1",
        title: "A1",
        summary: "",
        content: "...",
        category: "turnamen",
        coverImageUrl: null,
        regionId: null,
        primaryGameId: null,
        tags: [],
        status: "published",
        authorId: null,
        viewCount: 0,
        publishedAt: "2026-11-06T00:00:00Z",
        createdAt: "2026-11-06T00:00:00Z",
        updatedAt: "2026-11-06T00:00:00Z",
      });

      registerMockArticle({
        id: "a2",
        slug: "a2",
        title: "A2",
        summary: "",
        content: "...",
        category: "komunitas",
        coverImageUrl: null,
        regionId: null,
        primaryGameId: null,
        tags: [],
        status: "draft",
        authorId: null,
        viewCount: 0,
        publishedAt: null,
        createdAt: "2026-11-06T00:00:00Z",
        updatedAt: "2026-11-06T00:00:00Z",
      });

      const stats = await getContentStats();
      expect(stats.totalArticles).toBe(2);
      expect(stats.publishedCount).toBe(1);
      expect(stats.draftCount).toBe(1);
      expect(stats.categoryBreakdown.turnamen).toBe(1);
      expect(stats.categoryBreakdown.komunitas).toBe(1);
    });
  });
});
