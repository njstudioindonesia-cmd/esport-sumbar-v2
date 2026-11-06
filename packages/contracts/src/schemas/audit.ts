import { z } from "zod";

export const AuditActorRoleSchema = z.enum(["user", "platform_admin", "system_worker"]);
export type AuditActorRole = z.infer<typeof AuditActorRoleSchema>;

export const AuditActionSchema = z.enum([
  "ACCOUNT_CREATED",
  "PROFILE_CREATED",
  "PROFILE_UPDATED",
  "PROFILE_SUSPENDED",
  "VERIFICATION_SUBMITTED",
  "VERIFICATION_APPROVED",
  "VERIFICATION_REJECTED",
  "VERIFICATION_REVISION_REQUESTED",
  "ECOSYSTEM_RELATION_REQUESTED",
  "ECOSYSTEM_RELATION_APPROVED",
  "ECOSYSTEM_RELATION_REJECTED",
  "ECOSYSTEM_RELATION_ENDED",
  "GAME_CREATED",
  "GAME_UPDATED",
  "GAME_DEACTIVATED",
  "MEDIA_UPLOADED",
  "MEDIA_PURGED",
]);
export type AuditAction = z.infer<typeof AuditActionSchema>;

export const AuditLogRecordSchema = z.object({
  id: z.string().uuid(),
  actorAccountId: z.string().uuid().nullable().optional(),
  actorRole: AuditActorRoleSchema,
  action: AuditActionSchema,
  targetType: z.string(),
  targetId: z.string(),
  previousStatus: z.string().nullable().optional(),
  newStatus: z.string().nullable().optional(),
  reason: z.string().nullable().optional(),
  metadata: z.record(z.string(), z.unknown()).default({}),
  createdAt: z.string().datetime(),
});
export type AuditLogRecord = z.infer<typeof AuditLogRecordSchema>;
