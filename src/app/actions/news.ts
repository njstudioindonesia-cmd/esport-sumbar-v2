"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";

export interface ArticleInput {
  id?: string;
  title: string;
  slug?: string;
  summary?: string;
  content: string;
  category: string;
  coverImageUrl?: string;
  regionId?: string | null;
  status?: "draft" | "published" | "archived";
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Simpan atau perbarui artikel ke tabel Supabase public.articles
 */
export async function saveArticleAction(data: ArticleInput) {
  try {
    const admin = createAdminClient();
    const slug = data.slug || generateSlug(data.title);

    if (data.id) {
      // Update
      const { data: updated, error } = await admin
        .from("articles")
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
        } as any)
        .eq("id", data.id)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      revalidatePath("/news");
      revalidatePath(`/news/${slug}`);
      revalidatePath("/");
      revalidatePath("/admin/platform/news");

      return { success: true, article: updated };
    } else {
      // Insert
      const { data: inserted, error } = await admin
        .from("articles")
        .insert({
          title: data.title,
          slug,
          summary: data.summary || null,
          content: data.content,
          category: data.category,
          cover_image_url: data.coverImageUrl || null,
          region_id: data.regionId || null,
          status: data.status || "published",
          published_at: data.status === "published" ? new Date().toISOString() : null,
        } as any)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      revalidatePath("/news");
      revalidatePath(`/news/${slug}`);
      revalidatePath("/");
      revalidatePath("/admin/platform/news");

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
    const admin = createAdminClient();
    const { error } = await admin.from("articles").delete().eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/news");
    revalidatePath("/");
    revalidatePath("/admin/platform/news");

    return { success: true };
  } catch (err: any) {
    console.error("deleteArticleAction error:", err);
    return { success: false, error: err.message || "Gagal menghapus artikel" };
  }
}
