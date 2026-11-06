import { z } from "zod";

export const NotificationChannelSchema = z.enum(["email", "in_app"]);
export type NotificationChannel = z.infer<typeof NotificationChannelSchema>;

export const NotificationTypeSchema = z.enum([
  "verification_approved",
  "verification_revision",
  "verification_rejected",
  "relation_requested",
  "relation_approved",
  "relation_ended",
  "security_alert",
]);
export type NotificationType = z.infer<typeof NotificationTypeSchema>;

export const NotificationPayloadSchema = z.object({
  recipientAccountId: z.string().uuid(),
  recipientEmail: z.string().email().optional(),
  type: NotificationTypeSchema,
  channel: NotificationChannelSchema,
  title: z.string().min(1).max(150),
  body: z.string().min(1).max(1000),
  actionUrl: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).default({}),
});
export type NotificationPayload = z.infer<typeof NotificationPayloadSchema>;

export const NotificationPreferenceSchema = z.object({
  accountId: z.string().uuid(),
  emailNotifications: z.boolean().default(true),
  relationAlerts: z.boolean().default(true),
  marketingEmails: z.boolean().default(false),
  updatedAt: z.string().datetime(),
});
export type NotificationPreference = z.infer<typeof NotificationPreferenceSchema>;
