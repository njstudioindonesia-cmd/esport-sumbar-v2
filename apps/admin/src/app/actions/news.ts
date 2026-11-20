"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { recordAuditLog } from "@esport-sumbar/domain";

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

export async function saveArticleAction(data: ArticleInput) {
  try {
    const slug = data.slug || generateSlug(data.title);
    const adminDb = createAdminClient();

    if (data.id) {
      const { data: updated, error } = await adminDb
        .from("articles")
        .update({
          title: data.title,
          slug,
          summary: data.summary || "",
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

      if (error) throw error;

      await recordAuditLog(adminDb as any, {
        actorId: "admin-system",
        actorRole: "admin",
        action: "article_updated",
        entityType: "article",
        entityId: data.id,
        details: { title: data.title, category: data.category, status: data.status },
      });

      revalidatePath("/news");
      return { success: true, article: updated };
    } else {
      const { data: inserted, error } = await adminDb
        .from("articles")
        .insert({
          title: data.title,
          slug,
          summary: data.summary || "",
          content: data.content,
          category: data.category,
          cover_image_url: data.coverImageUrl || null,
          region_id: data.regionId || null,
          status: data.status || "published",
          published_at: new Date().toISOString(),
        } as any)
        .select()
        .single();

      if (error) throw error;

      await recordAuditLog(adminDb as any, {
        actorId: "admin-system",
        actorRole: "admin",
        action: "article_created",
        entityType: "article",
        entityId: inserted?.id || slug,
        details: { title: data.title, category: data.category, status: data.status },
      });

      revalidatePath("/news");
      return { success: true, article: inserted };
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Gagal menyimpan artikel";
    return { success: false, error: errorMsg };
  }
}

export async function deleteArticleAction(id: string) {
  try {
    const adminDb = createAdminClient();
    const { error } = await adminDb.from("articles").delete().eq("id", id);
    if (error) throw error;

    await recordAuditLog(adminDb as any, {
      actorId: "admin-system",
      actorRole: "admin",
      action: "article_deleted",
      entityType: "article",
      entityId: id,
    });

    revalidatePath("/news");
    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Gagal menghapus artikel";
    return { success: false, error: errorMsg };
  }
}

export async function getArticlesAction() {
  try {
    const adminDb = createAdminClient();
    const { data: articles, error } = await adminDb
      .from("articles")
      .select("*, regions(name, code)")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { success: true, articles: articles || [] };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Gagal memuat artikel";
    return { success: false, articles: [], error: errorMsg };
  }
}
