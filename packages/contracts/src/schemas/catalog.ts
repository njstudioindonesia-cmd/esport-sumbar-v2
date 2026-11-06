import { z } from "zod";

export const GameGenreSchema = z.enum([
  "moba",
  "battle_royale",
  "fps",
  "sports",
  "fighting",
  "racing",
  "strategy",
  "other",
]);
export type GameGenre = z.infer<typeof GameGenreSchema>;

export const GamePlatformSchema = z.enum([
  "mobile",
  "pc",
  "console",
  "cross_platform",
]);
export type GamePlatform = z.infer<typeof GamePlatformSchema>;

export const GameCatalogItemSchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  title: z.string(),
  genre: GameGenreSchema,
  platform: GamePlatformSchema,
  isActive: z.boolean(),
  iconUrl: z.string().nullable().optional(),
});
export type GameCatalogItem = z.infer<typeof GameCatalogItemSchema>;

export const GameRoleSchema = z.object({
  id: z.string().uuid(),
  gameId: z.string().uuid(),
  roleName: z.string(),
  description: z.string().optional(),
  sortOrder: z.number().int(),
});
export type GameRole = z.infer<typeof GameRoleSchema>;

export const GameRankSchema = z.object({
  id: z.string().uuid(),
  gameId: z.string().uuid(),
  tierName: z.string(),
  tierLevel: z.number().int(),
  sortOrder: z.number().int(),
});
export type GameRank = z.infer<typeof GameRankSchema>;
