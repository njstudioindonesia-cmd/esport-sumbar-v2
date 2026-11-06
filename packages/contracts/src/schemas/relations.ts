import { z } from "zod";

export const EntityTypeSchema = z.enum([
  "player",
  "coach",
  "team",
  "community",
  "venue",
  "school",
  "campus",
]);
export type EntityType = z.infer<typeof EntityTypeSchema>;

export const RelationStatusSchema = z.enum([
  "pending",
  "active",
  "rejected",
  "cancelled",
  "expired",
  "ended",
]);
export type RelationStatus = z.infer<typeof RelationStatusSchema>;

export const RequestRelationSchema = z.object({
  targetProfileId: z.string().uuid(),
  relationType: z.string().min(2).max(50),
  gameId: z.string().uuid().optional(),
  message: z.string().max(250).optional(),
});
export type RequestRelationInput = z.infer<typeof RequestRelationSchema>;

export const RespondRelationSchema = z.object({
  relationId: z.string().uuid(),
  action: z.enum(["accept", "reject"]),
  reason: z.string().max(250).optional(),
});
export type RespondRelationInput = z.infer<typeof RespondRelationSchema>;
