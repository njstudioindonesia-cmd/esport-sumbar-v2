/**
 * Layanan Inti Konten & Berita ESPORT SUMBAR (Content Service V3)
 * Menyatukan Alur Kerja Editorial, Caching Berbasis Tag Reaktif,
 * Integrasi Jejak Audit Kriptografis, dan Emisi Peristiwa Outbox Domain.
 */

import crypto from "crypto";
import {
  CreateArticleInput,
  UpdateArticleInput,
} from "@esport-sumbar/contracts";
import {
  ContentArticleRecord,
  ContentSearchOptions,
  ContentSearchResult,
  ContentStats,
  EditorialTransitionParams,
} from "./types";
import {
  generateArticleSlug,
  validateEditorialTransition,
  canTransitionArticle,
} from "./workflow";
import {
  getContentCache,
  setContentCache,
  invalidateContentTags,
  clearContentCache,
} from "./cache";
import { recordAuditLog } from "@/lib/services/verification/audit";
import { createOutboxEvent, publishOutboxEvent } from "@esport-sumbar/lib";
import { createAdminClient, createPublicServerClient } from "@/lib/supabase/server";

// In-Memory store untuk unit testing dan fallback
const inMemoryArticles: Map<string, ContentArticleRecord> = new Map();

/**
 * Membersihkan store internal layanan (khusus suite pengujian)
 */
export function clearContentServiceStore(): void {
  inMemoryArticles.clear();
  clearContentCache();
}

/**
 * Mendaftarkan artikel contoh ke in-memory store (untuk pengujian)
 */
export function registerMockArticle(article: ContentArticleRecord): void {
  inMemoryArticles.set(article.id, { ...article });
}

/**
 * Mencari dan mengambil daftar artikel berita dengan filter dan paginasi
 */
export async function searchArticles(
  options: ContentSearchOptions = {}
): Promise<ContentSearchResult> {
  const page = options.page || 1;
  const limit = options.limit || 20;
  const category = options.category || "all";
  const regionId = options.regionId || "all";
  const status = options.status || "published";

  const cacheKey = `content:query:${category}:${regionId}:${status}:${options.tag || ""}:${options.q || ""}:${page}:${limit}`;

  // 1. Coba baca dari cache berbasis tag
  const cached = getContentCache<ContentSearchResult>(cacheKey);
  if (cached) {
    return { ...cached, fromCache: true };
  }

  const isTest = process.env.NODE_ENV === "test";
  const isPlaceholder = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").includes("placeholder");

  let allRecords: ContentArticleRecord[] = [];

  // 2. Baca dari in-memory atau basis data Supabase
  if (isTest || isPlaceholder) {
    allRecords = Array.from(inMemoryArticles.values());
  } else {
    try {
      const supabase = createPublicServerClient();
      let query = (supabase.from("articles") as any)
        .select("id, title, slug, summary, content, category, cover_image_url, region_id, status, published_at, created_at, updated_at, regions(name)")
        .order("published_at", { ascending: false });

      if (status !== "all") {
        query = query.eq("status", status);
      }
      if (category !== "all") {
        query = query.eq("category", category);
      }
      if (regionId !== "all") {
        query = query.eq("region_id", regionId);
      }

      const { data, error } = await query;
      if (!error && data) {
        allRecords = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          slug: item.slug,
          summary: item.summary,
          content: item.content,
          category: item.category,
          coverImageUrl: item.cover_image_url,
          regionId: item.region_id,
          regionName: item.regions?.name,
          primaryGameId: null,
          tags: [],
          status: item.status,
          authorId: null,
          viewCount: 0,
          publishedAt: item.published_at,
          createdAt: item.created_at || new Date().toISOString(),
          updatedAt: item.updated_at || new Date().toISOString(),
        }));
      }
    } catch (err) {
      console.warn("Kueri artikel Supabase gagal, fallback ke in-memory:", err);
      allRecords = Array.from(inMemoryArticles.values());
    }
  }

  // 3. Terapkan filter di sisi server
  let filtered = allRecords.filter((art) => {
    if (status !== "all" && art.status !== status) return false;
    if (category !== "all" && art.category !== category) return false;
    if (regionId !== "all" && art.regionId !== regionId) return false;
    if (options.primaryGameId && art.primaryGameId !== options.primaryGameId) return false;
    if (options.tag && !art.tags.includes(options.tag)) return false;
    if (options.q) {
      const qLower = options.q.toLowerCase();
      const matchTitle = art.title.toLowerCase().includes(qLower);
      const matchSummary = (art.summary || "").toLowerCase().includes(qLower);
      if (!matchTitle && !matchSummary) return false;
    }
    return true;
  });

  // 4. Urutkan berdasarkan publishedAt terbaru
  filtered.sort((a, b) => {
    const timeA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const timeB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return timeB - timeA;
  });

  const total = filtered.length;
  const startIndex = (page - 1) * limit;
  const paginated = filtered.slice(startIndex, startIndex + limit);

  const result: ContentSearchResult = {
    articles: paginated,
    total,
    page,
    limit,
    fromCache: false,
  };

  // 5. Simpan ke Cache dengan Tag Relevan
  const cacheTags = [
    "content:all",
    category !== "all" ? `content:category:${category}` : null,
    regionId !== "all" ? `content:region:${regionId}` : null,
  ].filter(Boolean) as string[];

  setContentCache(cacheKey, result, cacheTags);

  return result;
}

/**
 * Mengambil detail artikel berdasarkan slug publik
 */
export async function getArticleBySlug(slug: string): Promise<ContentArticleRecord | null> {
  const cacheKey = `content:slug:${slug}`;
  const cached = getContentCache<ContentArticleRecord>(cacheKey);
  if (cached) return cached;

  const isTest = process.env.NODE_ENV === "test";
  const isPlaceholder = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").includes("placeholder");

  let article: ContentArticleRecord | null = null;

  if (isTest || isPlaceholder) {
    for (const item of inMemoryArticles.values()) {
      if (item.slug === slug) {
        article = item;
        break;
      }
    }
  } else {
    try {
      const supabase = createPublicServerClient();
      const { data, error } = await (supabase.from("articles") as any)
        .select("id, title, slug, summary, content, category, cover_image_url, region_id, status, published_at, created_at, updated_at, regions(name)")
        .eq("slug", slug)
        .maybeSingle();

      if (!error && data) {
        article = {
          id: data.id,
          title: data.title,
          slug: data.slug,
          summary: data.summary,
          content: data.content,
          category: data.category,
          coverImageUrl: data.cover_image_url,
          regionId: data.region_id,
          regionName: data.regions?.name,
          primaryGameId: null,
          tags: [],
          status: data.status,
          authorId: null,
          viewCount: 0,
          publishedAt: data.published_at,
          createdAt: data.created_at || new Date().toISOString(),
          updatedAt: data.updated_at || new Date().toISOString(),
        };
      }
    } catch (err) {
      console.warn("Gagal membaca artikel slug dari database:", err);
    }
  }

  if (article) {
    setContentCache(cacheKey, article, ["content:all", `content:slug:${slug}`, `content:category:${article.category}`]);
  }

  return article;
}

/**
 * Membuat artikel berita atau pengumuman baru
 */
export async function createArticle(
  input: CreateArticleInput,
  authorId?: string,
  actorRole: "platform_admin" | "user" | "system_worker" = "platform_admin"
): Promise<ContentArticleRecord> {
  const id = crypto.randomUUID();
  const slug = generateArticleSlug(input.title, input.slug);
  const now = new Date().toISOString();
  const status = input.status || "draft";
  const publishedAt = status === "published" ? now : null;

  const record: ContentArticleRecord = {
    id,
    slug,
    title: input.title,
    summary: input.summary || null,
    content: input.content,
    category: input.category || "umum",
    coverImageUrl: input.coverImageUrl || null,
    regionId: input.regionId || null,
    primaryGameId: input.primaryGameId || null,
    tags: input.tags || [],
    status,
    authorId: authorId || null,
    viewCount: 0,
    publishedAt,
    createdAt: now,
    updatedAt: now,
  };

  inMemoryArticles.set(id, record);

  const isTest = process.env.NODE_ENV === "test";
  const isPlaceholder = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").includes("placeholder");

  if (!isTest && !isPlaceholder) {
    try {
      const admin = createAdminClient();
      await (admin.from("articles") as any).insert({
        id,
        title: record.title,
        slug: record.slug,
        summary: record.summary,
        content: record.content,
        category: record.category,
        cover_image_url: record.coverImageUrl,
        region_id: record.regionId,
        status: record.status,
        published_at: record.publishedAt,
      });
    } catch (err) {
      console.error("Gagal menyimpan artikel ke Supabase:", err);
    }
  }

  // Rekam Jejak Audit Append-Only
  await recordAuditLog({
    actorAccountId: authorId,
    actorRole,
    action: "ARTICLE_CREATED",
    targetType: "article",
    targetId: id,
    newStatus: status,
    reason: `Pembuatan artikel baru: "${record.title.slice(0, 40)}"`,
    metadata: { slug, category: record.category },
  });

  // Emisi Outbox Event jika langsung dipublikasikan
  if (status === "published") {
    try {
      const outbox = createOutboxEvent({
        eventName: "ArticlePublished",
        aggregateType: "content",
        aggregateId: id,
        data: {
          articleId: id,
          slug,
          title: record.title,
          category: record.category,
          authorId: authorId || null,
          publishedAt: now,
        },
      });

      if (!isTest && !isPlaceholder) {
        const admin = createAdminClient();
        await publishOutboxEvent(admin as any, outbox);
      }
    } catch (outboxErr) {
      console.error("Gagal menulis event ArticlePublished:", outboxErr);
    }

    invalidateContentTags(["content:all", `content:category:${record.category}`]);
  }

  return record;
}

/**
 * Memperbarui artikel yang sudah ada
 */
export async function updateArticle(
  input: UpdateArticleInput,
  actorId?: string,
  actorRole: "platform_admin" | "user" | "system_worker" = "platform_admin"
): Promise<ContentArticleRecord> {
  let existing = inMemoryArticles.get(input.id);
  const now = new Date().toISOString();

  if (!existing) {
    const fromDb = await getArticleBySlug(input.slug || input.id);
    if (fromDb) {
      existing = fromDb;
    }
  }

  if (!existing) {
    throw new Error(`Artikel dengan ID ${input.id} tidak ditemukan.`);
  }

  const updatedSlug = input.slug ? generateArticleSlug(input.title || existing.title, input.slug) : existing.slug;
  const isNowPublished = existing.status !== "published" && input.status === "published";
  const publishedAt = isNowPublished ? now : (input.status === "published" ? existing.publishedAt || now : null);

  const updated: ContentArticleRecord = {
    ...existing,
    title: input.title || existing.title,
    slug: updatedSlug,
    summary: input.summary !== undefined ? (input.summary || null) : existing.summary,
    content: input.content || existing.content,
    category: input.category || existing.category,
    coverImageUrl: input.coverImageUrl !== undefined ? (input.coverImageUrl || null) : existing.coverImageUrl,
    regionId: input.regionId !== undefined ? (input.regionId || null) : existing.regionId,
    primaryGameId: input.primaryGameId !== undefined ? (input.primaryGameId || null) : existing.primaryGameId,
    tags: input.tags || existing.tags,
    status: input.status || existing.status,
    publishedAt,
    updatedAt: now,
  };

  inMemoryArticles.set(input.id, updated);

  const isTest = process.env.NODE_ENV === "test";
  const isPlaceholder = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").includes("placeholder");

  if (!isTest && !isPlaceholder) {
    try {
      const admin = createAdminClient();
      await (admin.from("articles") as any)
        .update({
          title: updated.title,
          slug: updated.slug,
          summary: updated.summary,
          content: updated.content,
          category: updated.category,
          cover_image_url: updated.coverImageUrl,
          region_id: updated.regionId,
          status: updated.status,
          published_at: updated.publishedAt,
          updated_at: now,
        })
        .eq("id", input.id);
    } catch (err) {
      console.error("Gagal memperbarui artikel di Supabase:", err);
    }
  }

  // Rekam Jejak Audit
  await recordAuditLog({
    actorAccountId: actorId,
    actorRole,
    action: "ARTICLE_UPDATED",
    targetType: "article",
    targetId: input.id,
    previousStatus: existing.status,
    newStatus: updated.status,
    reason: `Pembaruan artikel: "${updated.title.slice(0, 40)}"`,
    metadata: { slug: updated.slug },
  });

  // Emisi Outbox Event
  try {
    const outbox = createOutboxEvent({
      eventName: isNowPublished ? "ArticlePublished" : "ArticleUpdated",
      aggregateType: "content",
      aggregateId: input.id,
      data: {
        articleId: input.id,
        slug: updated.slug,
        title: updated.title,
        changedFields: ["title", "content", "status"],
        updatedAt: now,
      },
    });

    if (!isTest && !isPlaceholder) {
      const admin = createAdminClient();
      await publishOutboxEvent(admin as any, outbox);
    }
  } catch (err) {
    console.error("Gagal menulis outbox event artikel:", err);
  }

  // Revalidasi Cache
  invalidateContentTags([
    "content:all",
    `content:slug:${existing.slug}`,
    `content:slug:${updated.slug}`,
    `content:category:${updated.category}`,
  ]);

  return updated;
}

/**
 * Menjalankan transisi status editorial artikel
 */
export async function transitionArticleStatus(
  params: EditorialTransitionParams
): Promise<ContentArticleRecord> {
  const existing = inMemoryArticles.get(params.articleId);
  if (!existing) {
    throw new Error(`Artikel dengan ID ${params.articleId} tidak ditemukan.`);
  }

  if (!canTransitionArticle(existing.status, params.targetStatus)) {
    throw new Error(
      `Transisi editorial tidak valid: Tidak dapat mengubah status dari "${existing.status}" ke "${params.targetStatus}".`
    );
  }

  validateEditorialTransition(params);

  const now = new Date().toISOString();
  const isNowPublished = params.targetStatus === "published";
  const publishedAt = isNowPublished ? (existing.publishedAt || now) : existing.publishedAt;

  existing.status = params.targetStatus;
  existing.publishedAt = publishedAt;
  existing.updatedAt = now;

  // Rekam Audit
  await recordAuditLog({
    actorAccountId: params.actorId,
    actorRole: params.actorRole,
    action: "ARTICLE_STATUS_TRANSITION",
    targetType: "article",
    targetId: params.articleId,
    previousStatus: existing.status,
    newStatus: params.targetStatus,
    reason: params.reason || `Transisi status menjadi ${params.targetStatus}`,
    metadata: { slug: existing.slug },
  });

  // Emit Event
  try {
    const eventName = isNowPublished
      ? "ArticlePublished"
      : params.targetStatus === "archived"
      ? "ArticleArchived"
      : "ArticleUpdated";

    const outbox = createOutboxEvent({
      eventName,
      aggregateType: "content",
      aggregateId: params.articleId,
      data: {
        articleId: params.articleId,
        slug: existing.slug,
        title: existing.title,
        category: existing.category,
        authorId: params.actorId,
        publishedAt: now,
      },
    });

    const isTest = process.env.NODE_ENV === "test";
    const isPlaceholder = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").includes("placeholder");

    if (!isTest && !isPlaceholder) {
      const admin = createAdminClient();
      await publishOutboxEvent(admin as any, outbox);
    }
  } catch (err) {
    console.error("Gagal menulis outbox event status editorial:", err);
  }

  invalidateContentTags([
    "content:all",
    `content:slug:${existing.slug}`,
    `content:category:${existing.category}`,
  ]);

  return existing;
}

/**
 * Menghapus artikel secara permanen atau mengarsipkannya
 */
export async function deleteArticle(
  articleId: string,
  actorId?: string,
  actorRole: "platform_admin" | "user" | "system_worker" = "platform_admin"
): Promise<{ success: boolean; articleId: string }> {
  const existing = inMemoryArticles.get(articleId);
  if (existing) {
    inMemoryArticles.delete(articleId);
    invalidateContentTags(["content:all", `content:slug:${existing.slug}`]);
  }

  const isTest = process.env.NODE_ENV === "test";
  const isPlaceholder = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").includes("placeholder");

  if (!isTest && !isPlaceholder) {
    try {
      const admin = createAdminClient();
      await (admin.from("articles") as any).delete().eq("id", articleId);
    } catch (err) {
      console.error("Gagal menghapus artikel dari Supabase:", err);
    }
  }

  await recordAuditLog({
    actorAccountId: actorId,
    actorRole,
    action: "ARTICLE_DELETED",
    targetType: "article",
    targetId: articleId,
    reason: "Penghapusan artikel oleh administrator",
    metadata: {},
  });

  return { success: true, articleId };
}

/**
 * Menghitung metrik statistik konten platform
 */
export async function getContentStats(): Promise<ContentStats> {
  const articles = Array.from(inMemoryArticles.values());

  const publishedCount = articles.filter((a) => a.status === "published").length;
  const draftCount = articles.filter((a) => a.status === "draft").length;
  const editorialReviewCount = articles.filter((a) => a.status === "editorial_review").length;
  const archivedCount = articles.filter((a) => a.status === "archived").length;

  const categoryBreakdown: Record<string, number> = {};
  for (const art of articles) {
    categoryBreakdown[art.category] = (categoryBreakdown[art.category] || 0) + 1;
  }

  return {
    totalArticles: articles.length,
    publishedCount,
    draftCount,
    editorialReviewCount,
    archivedCount,
    categoryBreakdown,
  };
}
