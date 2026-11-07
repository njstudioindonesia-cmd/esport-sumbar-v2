/**
 * Alur Kerja Editorial Berita & Pengumuman (Editorial Workflow V3)
 * Menegakkan transisi status editorial (draft -> editorial_review -> published -> archived)
 * dan otorisasi platform_admin untuk publikasi artikel ESPORT SUMBAR.
 */

import { ArticleStatus } from "@esport-sumbar/contracts";
import { EditorialTransitionParams } from "./types";

export const VALID_EDITORIAL_TRANSITIONS: Record<ArticleStatus, ArticleStatus[]> = {
  draft: ["editorial_review", "published", "archived"],
  editorial_review: ["draft", "published", "archived"],
  published: ["archived", "draft"],
  archived: ["draft", "published"],
};

/**
 * Memeriksa apakah transisi editorial dari status lama ke status baru valid
 */
export function canTransitionArticle(
  from: ArticleStatus,
  to: ArticleStatus
): boolean {
  if (from === to) return true;
  const allowed = VALID_EDITORIAL_TRANSITIONS[from];
  return Boolean(allowed && allowed.includes(to));
}

/**
 * Memvalidasi otorisasi dan aturan transisi editorial
 */
export function validateEditorialTransition(params: EditorialTransitionParams): void {
  const { targetStatus, actorRole, reason } = params;

  // 1. Otorisasi Peran: Hanya platform_admin yang berwenang mempublikasikan atau mengarsipkan artikel
  if (["published", "archived"].includes(targetStatus) && actorRole !== "platform_admin") {
    throw new Error(
      "Akses ditolak: Hanya platform_admin ESPORT SUMBAR yang berwenang mempublikasikan atau mengarsipkan artikel."
    );
  }

  // 2. Alasan pengarsipan wajib jika status adalah archived
  if (targetStatus === "archived" && (!reason || reason.trim().length < 5)) {
    throw new Error("Alasan pengarsipan artikel wajib disertakan minimal 5 karakter.");
  }
}

/**
 * Menghasilkan slug URL ramah SEO dan unik
 */
export function generateArticleSlug(title: string, existingSlug?: string): string {
  if (existingSlug && /^[a-z0-9-]+$/.test(existingSlug)) {
    return existingSlug.toLowerCase();
  }

  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return base || `artikel-esport-sumbar-${Date.now()}`;
}
