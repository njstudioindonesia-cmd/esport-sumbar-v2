import { createPublicServerClient } from "@/lib/supabase/server";
import { FLAGS } from "@/lib/config/flags";
import {
  searchArticles,
  getArticleBySlug as getContentArticleBySlug,
} from "@/lib/services/content";

export interface PublicArticle {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  content: string;
  category: string;
  coverImageUrl: string | null;
  regionId: string | null;
  regionName?: string;
  authorName?: string;
  status?: string;
  publishedAt: string;
}

/**
 * Mengambil daftar berita dan pengumuman resmi ESPORT SUMBAR yang telah dipublikasikan
 */
export async function getLatestArticles(options?: {
  limit?: number;
  category?: string;
  regionId?: string;
  status?: "draft" | "editorial_review" | "published" | "archived" | "all";
}): Promise<PublicArticle[]> {
  // Sub-langkah 7.5: Rute melalui Layanan Konten jika Feature Flag aktif
  if (FLAGS.USE_CONTENT_SERVICE) {
    try {
      const searchResult = await searchArticles({
        limit: options?.limit,
        category: (options?.category as any) || "all",
        regionId: (options?.regionId as any) || "all",
        status: (options?.status as any) || "published",
      });

      return searchResult.articles.map((item) => ({
        id: item.id,
        title: item.title,
        slug: item.slug,
        summary: item.summary,
        content: item.content,
        category: item.category,
        coverImageUrl: item.coverImageUrl,
        regionId: item.regionId,
        regionName: item.regionName,
        authorName: item.authorName,
        status: item.status,
        publishedAt: item.publishedAt || item.createdAt,
      }));
    } catch (err) {
      console.warn("Layanan Konten gagal, fallback ke kueri Supabase langsung:", err);
    }
  }

  // Jalur Monolitik Warisan (Rollback Path)
  try {
    const supabase = createPublicServerClient();
    let query = (supabase.from("articles") as any)
      .select("id, title, slug, summary, content, category, cover_image_url, region_id, status, published_at, regions(name)")
      .order("published_at", { ascending: false });

    if (options?.status && options.status !== "all") {
      query = query.eq("status", options.status);
    } else if (!options?.status) {
      query = query.eq("status", "published");
    }

    if (options?.category && options.category !== "all") {
      query = query.eq("category", options.category);
    }

    if (options?.regionId && options.regionId !== "all") {
      query = query.eq("region_id", options.regionId);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (!error && data && data.length > 0) {
      return data.map((item: any) => ({
        id: item.id,
        title: item.title,
        slug: item.slug,
        summary: item.summary,
        content: item.content,
        category: item.category,
        coverImageUrl: item.cover_image_url,
        regionId: item.region_id,
        regionName: item.regions?.name,
        status: item.status,
        publishedAt: item.published_at || new Date().toISOString(),
      }));
    }
  } catch (err) {
    console.warn("Database articles query warning:", err);
  }

  return [];
}

/**
 * Mengambil detail satu artikel berdasarkan slug
 */
export async function getArticleBySlug(slug: string): Promise<PublicArticle | null> {
  // Sub-langkah 7.5: Rute melalui Layanan Konten jika Feature Flag aktif
  if (FLAGS.USE_CONTENT_SERVICE) {
    try {
      const article = await getContentArticleBySlug(slug);
      if (article && (article.status === "published" || !FLAGS.USE_CONTENT_SERVICE)) {
        return {
          id: article.id,
          title: article.title,
          slug: article.slug,
          summary: article.summary,
          content: article.content,
          category: article.category,
          coverImageUrl: article.coverImageUrl,
          regionId: article.regionId,
          regionName: article.regionName,
          authorName: article.authorName,
          status: article.status,
          publishedAt: article.publishedAt || article.createdAt,
        };
      }
    } catch (err) {
      console.warn("Layanan Konten gagal untuk getArticleBySlug, fallback:", err);
    }
  }

  // Jalur Monolitik Warisan (Rollback Path)
  try {
    const supabase = createPublicServerClient();
    const { data, error } = await (supabase.from("articles") as any)
      .select("id, title, slug, summary, content, category, cover_image_url, region_id, status, published_at, regions(name)")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (!error && data) {
      return {
        id: data.id,
        title: data.title,
        slug: data.slug,
        summary: data.summary,
        content: data.content,
        category: data.category,
        coverImageUrl: data.cover_image_url,
        regionId: data.region_id,
        regionName: (data as any).regions?.name,
        status: (data as any).status,
        publishedAt: data.published_at || new Date().toISOString(),
      };
    }
  } catch (err) {
    console.warn("Database article by slug warning:", err);
  }

  return null;
}
