"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";
import { FLAGS } from "@/lib/config/flags";
import {
  createArticle,
  updateArticle,
  deleteArticle,
} from "@/lib/services/content";

export interface ArticleInput {
  id?: string;
  title: string;
  slug?: string;
  summary?: string;
  content: string;
  category: string;
  coverImageUrl?: string;
  regionId?: string | null;
  status?: "draft" | "editorial_review" | "published" | "archived";
}

function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || `artikel-${Date.now()}`;
}

/**
 * Simpan atau perbarui artikel ke tabel Supabase public.articles
 */
export async function saveArticleAction(data: ArticleInput) {
  try {
    const slug = data.slug || generateSlug(data.title);

    // Sub-langkah 7.5: Gunakan Layanan Konten jika Feature Flag aktif
    if (FLAGS.USE_CONTENT_SERVICE) {
      if (data.id) {
        const updated = await updateArticle({
          id: data.id,
          title: data.title,
          slug,
          summary: data.summary,
          content: data.content,
          category: (data.category as any) || "umum",
          coverImageUrl: data.coverImageUrl,
          regionId: data.regionId,
          status: data.status,
        });

        revalidatePath("/news");
        revalidatePath(`/news/${updated.slug}`);
        revalidatePath("/");
        revalidatePath("/admin/news");

        return { success: true, article: updated };
      } else {
        const created = await createArticle({
          title: data.title,
          slug,
          summary: data.summary,
          content: data.content,
          category: (data.category as any) || "umum",
          coverImageUrl: data.coverImageUrl,
          regionId: data.regionId,
          tags: [],
          status: data.status || "published",
        });

        revalidatePath("/news");
        revalidatePath(`/news/${created.slug}`);
        revalidatePath("/");
        revalidatePath("/admin/news");

        return { success: true, article: created };
      }
    }

    // Jalur Monolitik Warisan (Rollback Path)
    const admin = createAdminClient();
    if (data.id) {
      const { data: updated, error } = await (admin.from("articles") as any)
        .update({
          title: data.title,
          slug,
          summary: data.summary || null,
          content: data.content,
          category: data.category,
          cover_image_url: data.coverImageUrl || null,
          region_id: data.regionId || null,
          status: data.status || "published",
          updated_at: new Date().toISOString(),
        })
        .eq("id", data.id)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      revalidatePath("/news");
      revalidatePath(`/news/${slug}`);
      revalidatePath("/");
      revalidatePath("/admin/news");

      return { success: true, article: updated };
    } else {
      let finalSlug = slug;
      let { data: inserted, error } = await (admin.from("articles") as any)
        .insert({
          title: data.title,
          slug: finalSlug,
          summary: data.summary || null,
          content: data.content,
          category: data.category,
          cover_image_url: data.coverImageUrl || null,
          region_id: data.regionId || null,
          status: data.status || "published",
          published_at: data.status === "published" ? new Date().toISOString() : null,
        })
        .select()
        .single();

      if (error && (error as any).code === "23505") {
        finalSlug = `${slug}-${Date.now().toString().slice(-4)}`;
        const retry = await (admin.from("articles") as any)
          .insert({
            title: data.title,
            slug: finalSlug,
            summary: data.summary || null,
            content: data.content,
            category: data.category,
            cover_image_url: data.coverImageUrl || null,
            region_id: data.regionId || null,
            status: data.status || "published",
            published_at: data.status === "published" ? new Date().toISOString() : null,
          })
          .select()
          .single();
        inserted = retry.data;
        error = retry.error;
      }

      if (error) {
        return { success: false, error: error.message };
      }

      revalidatePath("/news");
      revalidatePath(`/news/${finalSlug}`);
      revalidatePath("/");
      revalidatePath("/admin/news");

      return { success: true, article: inserted };
    }
  } catch (err: any) {
    console.error("saveArticleAction error:", err);
    return { success: false, error: err.message || "Gagal menyimpan artikel" };
  }
}

/**
 * Hapus artikel dari tabel Supabase public.articles
 */
export async function deleteArticleAction(id: string) {
  try {
    if (FLAGS.USE_CONTENT_SERVICE) {
      await deleteArticle(id);
      revalidatePath("/news");
      revalidatePath("/");
      revalidatePath("/admin/news");
      return { success: true };
    }

    const admin = createAdminClient();
    const { error } = await (admin.from("articles") as any).delete().eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/news");
    revalidatePath("/");
    revalidatePath("/admin/news");

    return { success: true };
  } catch (err: any) {
    console.error("deleteArticleAction error:", err);
    return { success: false, error: err.message || "Gagal menghapus artikel" };
  }
}
