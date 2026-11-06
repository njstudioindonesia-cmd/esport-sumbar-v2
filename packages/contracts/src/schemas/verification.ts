import { z } from "zod";

export const VerificationStatusSchema = z.enum([
  "unverified",
  "submitted",
  "under_review",
  "revision_requested",
  "verified",
  "rejected",
  "suspended",
  "expired",
]);
export type VerificationStatus = z.infer<typeof VerificationStatusSchema>;

export const SubmitVerificationSchema = z.object({
  profileId: z.string().uuid(),
  evidenceType: z.enum([
    "in_game_profile",
    "student_card",
    "venue_signage",
    "organization_letter",
    "social_media_official",
  ]),
  evidenceUrl: z.string().url(),
  notes: z.string().max(500).optional(),
});
export type SubmitVerificationInput = z.infer<typeof SubmitVerificationSchema>;

export const TransitionVerificationSchema = z.object({
  requestId: z.string().uuid(),
  targetStatus: VerificationStatusSchema,
  reason: z.string().min(5, "Alasan wajib diisi minimal 5 karakter untuk penolakan/revisi/penangguhan").optional(),
});
export type TransitionVerificationInput = z.infer<typeof TransitionVerificationSchema>;
