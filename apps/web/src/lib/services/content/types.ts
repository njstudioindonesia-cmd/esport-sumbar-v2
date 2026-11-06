/**
 * Tipe dan Kontrak Layanan Konten & Berita V3 (Sub-langkah 7.5)
 * Mendefinisikan model artikel berita, alur kerja editorial,
 * taksonomi kategori, dan proyeksi baca publik resmi ESPORT SUMBAR.
 */

import { ArticleCategory, ArticleStatus } from "@esport-sumbar/contracts";

export interface ContentArticleRecord {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  content: string;
  category: ArticleCategory;
  coverImageUrl: string | null;
  regionId: string | null;
  regionName?: string;
  primaryGameId: string | null;
  gameName?: string;
  tags: string[];
  status: ArticleStatus;
  authorId: string | null;
  authorName?: string;
  viewCount: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ContentSearchOptions {
  category?: ArticleCategory | "all";
  regionId?: string | "all";
  primaryGameId?: string;
  status?: ArticleStatus | "all";
  tag?: string;
  q?: string;
  page?: number;
  limit?: number;
}

export interface ContentSearchResult {
  articles: ContentArticleRecord[];
  total: number;
  page: number;
  limit: number;
  fromCache?: boolean;
}

export interface EditorialTransitionParams {
  articleId: string;
  targetStatus: ArticleStatus;
  actorId: string;
  actorRole: "platform_admin" | "user" | "system_worker";
  reason?: string;
}

export interface ContentStats {
  totalArticles: number;
  publishedCount: number;
  draftCount: number;
  editorialReviewCount: number;
  archivedCount: number;
  categoryBreakdown: Record<string, number>;
}
