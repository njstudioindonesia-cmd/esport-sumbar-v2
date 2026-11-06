import { z } from "zod";

/**
 * Schema versi 1 untuk seluruh Peristiwa Domain (Domain Events)
 * Menggunakan pola Transactional Outbox untuk konsumsi asinkron antar-layanan.
 */

export const EventMetadataSchema = z.object({
  eventId: z.string().uuid(),
  eventName: z.string(),
  aggregateType: z.string(),
  aggregateId: z.string().uuid(),
  timestamp: z.string().datetime(),
  version: z.literal(1),
  correlationId: z.string().optional(),
});

export type EventMetadata = z.infer<typeof EventMetadataSchema>;

// 1. Account Events
export const AccountCreatedEventSchema = z.object({
  accountId: z.string().uuid(),
  email: z.string().email(),
  role: z.enum(["user", "platform_admin"]),
  createdAt: z.string().datetime(),
});
export type AccountCreatedEvent = z.infer<typeof AccountCreatedEventSchema>;

// 2. Profile Events
export const ProfileCreatedEventSchema = z.object({
  profileId: z.string().uuid(),
  accountId: z.string().uuid(),
  entityType: z.enum(["player", "coach", "team", "community", "venue", "school", "campus"]),
  displayName: z.string(),
  slug: z.string(),
  regionId: z.number().int(),
  primaryGameId: z.string().uuid().nullable().optional(),
});
export type ProfileCreatedEvent = z.infer<typeof ProfileCreatedEventSchema>;

export const ProfileUpdatedEventSchema = z.object({
  profileId: z.string().uuid(),
  changedFields: z.array(z.string()),
  updatedAt: z.string().datetime(),
});
export type ProfileUpdatedEvent = z.infer<typeof ProfileUpdatedEventSchema>;

export const ProfileDeletedEventSchema = z.object({
  profileId: z.string().uuid(),
  accountId: z.string().uuid(),
  reason: z.string(),
  deletedAt: z.string().datetime(),
});
export type ProfileDeletedEvent = z.infer<typeof ProfileDeletedEventSchema>;

export const ProfileSuspendedEventSchema = z.object({
  profileId: z.string().uuid(),
  reason: z.string(),
  suspendedBy: z.string().uuid(),
  suspendedAt: z.string().datetime(),
});
export type ProfileSuspendedEvent = z.infer<typeof ProfileSuspendedEventSchema>;

// 3. Media Events
export const MediaReplacedEventSchema = z.object({
  profileId: z.string().uuid(),
  mediaType: z.enum(["avatar", "banner", "evidence"]),
  oldFileUrl: z.string().nullable().optional(),
  newFileUrl: z.string(),
  fileSize: z.number().int(),
});
export type MediaReplacedEvent = z.infer<typeof MediaReplacedEventSchema>;

export const MediaDeletedEventSchema = z.object({
  fileUrl: z.string(),
  bucket: z.string(),
  deletedAt: z.string().datetime(),
});
export type MediaDeletedEvent = z.infer<typeof MediaDeletedEventSchema>;

// 4. Ecosystem Relation Events
export const RelationRequestedEventSchema = z.object({
  relationId: z.string().uuid(),
  sourceProfileId: z.string().uuid(),
  targetProfileId: z.string().uuid(),
  relationType: z.string(),
  expiresAt: z.string().datetime(),
});
export type RelationRequestedEvent = z.infer<typeof RelationRequestedEventSchema>;

export const RelationApprovedEventSchema = z.object({
  relationId: z.string().uuid(),
  sourceProfileId: z.string().uuid(),
  targetProfileId: z.string().uuid(),
  approvedAt: z.string().datetime(),
});
export type RelationApprovedEvent = z.infer<typeof RelationApprovedEventSchema>;

export const RelationEndedEventSchema = z.object({
  relationId: z.string().uuid(),
  reason: z.string(),
  endedAt: z.string().datetime(),
});
export type RelationEndedEvent = z.infer<typeof RelationEndedEventSchema>;

// 5. Verification Events
export const VerificationSubmittedEventSchema = z.object({
  requestId: z.string().uuid(),
  profileId: z.string().uuid(),
  entityType: z.string(),
  submittedAt: z.string().datetime(),
});
export type VerificationSubmittedEvent = z.infer<typeof VerificationSubmittedEventSchema>;

export const VerificationDecidedEventSchema = z.object({
  requestId: z.string().uuid(),
  profileId: z.string().uuid(),
  decision: z.enum(["verified", "revision_requested", "rejected", "suspended"]),
  reviewerId: z.string().uuid(),
  reason: z.string().nullable().optional(),
  badgeNumber: z.string().nullable().optional(),
  decidedAt: z.string().datetime(),
});
export type VerificationDecidedEvent = z.infer<typeof VerificationDecidedEventSchema>;

// 6. Game Catalog Event
export const GameChangedEventSchema = z.object({
  gameId: z.string().uuid(),
  title: z.string(),
  action: z.enum(["created", "updated", "deactivated"]),
  changedAt: z.string().datetime(),
});
export type GameChangedEvent = z.infer<typeof GameChangedEventSchema>;
