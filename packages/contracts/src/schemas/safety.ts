import { z } from "zod";

export const CreateReportSchema = z.object({
  targetType: z.enum(["profile", "card", "comment", "media"]),
  targetId: z.string().uuid(),
  category: z.enum(["inappropriate_content", "spam", "harassment", "impersonation", "other"]),
  reason: z.string().min(5).max(1000),
});
export type CreateReport = z.infer<typeof CreateReportSchema>;

export const DeleteAccountSchema = z.object({
  confirmation: z.literal("HAPUS"),
  password: z.string().min(6).optional(),
  reason: z.string().max(500).optional(),
});
export type DeleteAccount = z.infer<typeof DeleteAccountSchema>;
