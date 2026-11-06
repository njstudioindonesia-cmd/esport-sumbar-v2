import { z } from "zod";

/**
 * Schema versi 1 untuk seluruh Peristiwa Domain (Domain Events)
 * Menggunakan pola Transactional Outbox untuk konsumsi asinkron antar-layanan.
 */

export const EventMetadataSchema = z.object({
  eventId: z.string().uuid(),
  eventName: z.string(),
  aggregateType: z.string(),
  aggregateId: z.string(),
  timestamp: z.string().datetime(),
  version: z.literal(1),
  correlationId: z.string().optional(),
  idempotencyKey: z.string().optional(),
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
  regionId: z.string(),
  primaryGameId: z.string().nullable().optional(),
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
  gameId: z.string(),
  title: z.string(),
  action: z.enum(["created", "updated", "deactivated"]),
  changedAt: z.string().datetime(),
});
export type GameChangedEvent = z.infer<typeof GameChangedEventSchema>;

/**
 * Katalog Resmi Peristiwa Domain V3 (Domain Event Catalog)
 * Mendefinisikan setiap peristiwa, produsen, dan layanan konsumen asinkronnya.
 */
export interface EventCatalogEntry {
  eventName: string;
  aggregateType: string;
  description: string;
  producers: string[];
  consumers: string[];
}

export const DOMAIN_EVENT_CATALOG: Record<string, EventCatalogEntry> = {
  AccountCreated: {
    eventName: "AccountCreated",
    aggregateType: "account",
    description: "Akun baru berhasil didaftarkan di sistem ESPORT SUMBAR.",
    producers: ["core-identity"],
    consumers: ["notification"],
  },
  ProfileCreated: {
    eventName: "ProfileCreated",
    aggregateType: "profile",
    description: "Profil entitas tunggal berhasil dibuat untuk akun terautentikasi.",
    producers: ["core-profile"],
    consumers: ["directory", "notification", "audit"],
  },
  ProfileUpdated: {
    eventName: "ProfileUpdated",
    aggregateType: "profile",
    description: "Field profil entitas diperbarui.",
    producers: ["core-profile"],
    consumers: ["directory", "audit"],
  },
  ProfileDeleted: {
    eventName: "ProfileDeleted",
    aggregateType: "profile",
    description: "Profil entitas dihapus; memicu pemutusan seluruh relasi dan pembersihan media.",
    producers: ["core-profile"],
    consumers: ["media", "ecosystem", "directory", "audit"],
  },
  ProfileSuspended: {
    eventName: "ProfileSuspended",
    aggregateType: "profile",
    description: "Profil entitas disuspensi oleh admin platform karena pelanggaran.",
    producers: ["verification", "moderation"],
    consumers: ["ecosystem", "directory", "notification", "audit"],
  },
  MediaReplaced: {
    eventName: "MediaReplaced",
    aggregateType: "media",
    description: "Berkas gambar avatar atau cover diganti dengan berkas baru.",
    producers: ["media"],
    consumers: ["media-cleaner", "audit"],
  },
  MediaDeleted: {
    eventName: "MediaDeleted",
    aggregateType: "media",
    description: "Berkas media dihapus permanen dari storage.",
    producers: ["media"],
    consumers: ["audit"],
  },
  RelationRequested: {
    eventName: "RelationRequested",
    aggregateType: "relation",
    description: "Permohonan relasi ekosistem baru diajukan oleh suatu entitas.",
    producers: ["ecosystem"],
    consumers: ["notification", "audit"],
  },
  RelationApproved: {
    eventName: "RelationApproved",
    aggregateType: "relation",
    description: "Permohonan relasi disetujui pihak target; memicu evaluasi Contender tier.",
    producers: ["ecosystem"],
    consumers: ["directory", "notification", "audit"],
  },
  RelationEnded: {
    eventName: "RelationEnded",
    aggregateType: "relation",
    description: "Relasi ekosistem diakhiri oleh salah satu pihak atau kedaluwarsa.",
    producers: ["ecosystem"],
    consumers: ["directory", "notification", "audit"],
  },
  VerificationSubmitted: {
    eventName: "VerificationSubmitted",
    aggregateType: "verification",
    description: "Berkas pengajuan verifikasi satu tahap resmi diajukan untuk ditinjau.",
    producers: ["verification"],
    consumers: ["notification", "audit"],
  },
  VerificationDecided: {
    eventName: "VerificationDecided",
    aggregateType: "verification",
    description: "Pengajuan verifikasi disetujui/ditolak/diminta revisi oleh ESPORT SUMBAR.",
    producers: ["verification"],
    consumers: ["directory", "notification", "audit"],
  },
  GameChanged: {
    eventName: "GameChanged",
    aggregateType: "catalog",
    description: "Perubahan metadata game, role, atau rank pada katalog dinamis.",
    producers: ["catalog"],
    consumers: ["directory", "audit"],
  },
};
