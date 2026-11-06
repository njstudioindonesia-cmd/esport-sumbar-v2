import { createPublicServerClient } from "@/lib/supabase/server";

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
  status?: "draft" | "published" | "archived" | "all";
}): Promise<PublicArticle[]> {
  try {
    const supabase = createPublicServerClient();
    let query = supabase
      .from("articles")
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
  try {
    const supabase = createPublicServerClient();
    const { data, error } = await supabase
      .from("articles")
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
    console.warn("Database article query warning:", err);
  }

  return null;
}
