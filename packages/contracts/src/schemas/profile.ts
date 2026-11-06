import { z } from "zod";
import { EntityTypeSchema } from "./relations";
import { VerificationStatusSchema } from "./verification";

export const RarityTierSchema = z.enum(["rookie", "contender", "elite", "legend"]);
export type RarityTier = z.infer<typeof RarityTierSchema>;

export const CreateProfileInputSchema = z.object({
  entityType: EntityTypeSchema,
  displayName: z.string().min(2).max(100),
  ign: z.string().min(2).max(50).optional(),
  regionId: z.string().min(1),
  mainGameId: z.string().optional(),
  bio: z.string().max(500).optional(),
  attributes: z.record(z.string(), z.unknown()).default({}),
});
export type CreateProfileInput = z.infer<typeof CreateProfileInputSchema>;

export const UpdateProfileInputSchema = z.object({
  displayName: z.string().min(2).max(100).optional(),
  ign: z.string().min(2).max(50).optional(),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional(),
  attributes: z.record(z.string(), z.unknown()).optional(),
});
export type UpdateProfileInput = z.infer<typeof UpdateProfileInputSchema>;

export const PublicProfileResponseSchema = z.object({
  id: z.string().uuid(),
  accountId: z.string().uuid(),
  entityType: EntityTypeSchema,
  esportId: z.string(),
  slug: z.string(),
  displayName: z.string(),
  ign: z.string().nullable().optional(),
  regionId: z.string(),
  regionName: z.string(),
  regionCode: z.string(),
  mainGameId: z.string().nullable().optional(),
  mainGameName: z.string().optional(),
  roleName: z.string().nullable().optional(),
  avatarUrl: z.string().nullable().optional(),
  coverUrl: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  rarityTier: RarityTierSchema,
  completenessScore: z.number().int().min(0).max(100),
  verificationStatus: VerificationStatusSchema,
  verifiedBadgeNo: z.string().nullable().optional(),
  createdAt: z.string(),
});
export type PublicProfileResponse = z.infer<typeof PublicProfileResponseSchema>;
