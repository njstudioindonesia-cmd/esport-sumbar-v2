import { z } from "zod";

export const ArticleCategorySchema = z.enum([
  "turnamen",
  "komunitas",
  "prestasi",
  "edukasi",
  "pengumuman",
  "umum",
]);
export type ArticleCategory = z.infer<typeof ArticleCategorySchema>;

export const ArticleStatusSchema = z.enum([
  "draft",
  "editorial_review",
  "published",
  "archived",
]);
export type ArticleStatus = z.infer<typeof ArticleStatusSchema>;

export const CreateArticleSchema = z.object({
  title: z.string().min(5, "Judul artikel minimal 5 karakter").max(200),
  slug: z.string().min(3).max(100).optional(),
  summary: z.string().max(500).optional(),
  content: z.string().min(20, "Konten artikel minimal 20 karakter"),
  category: ArticleCategorySchema.default("umum"),
  coverImageUrl: z.string().url().nullable().optional(),
  regionId: z.string().nullable().optional(),
  primaryGameId: z.string().nullable().optional(),
  tags: z.array(z.string()).optional().default([]),
  status: ArticleStatusSchema.default("draft"),
});
export type CreateArticleInput = z.input<typeof CreateArticleSchema>;

export const UpdateArticleSchema = CreateArticleSchema.partial().extend({
  id: z.string().uuid(),
});
export type UpdateArticleInput = z.input<typeof UpdateArticleSchema>;

export const ArticleFilterSchema = z.object({
  category: ArticleCategorySchema.or(z.literal("all")).optional(),
  regionId: z.string().optional(),
  primaryGameId: z.string().optional(),
  status: ArticleStatusSchema.or(z.literal("all")).optional(),
  tag: z.string().optional(),
  q: z.string().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});
export type ArticleFilter = z.infer<typeof ArticleFilterSchema>;
