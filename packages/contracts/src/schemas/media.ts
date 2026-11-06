import { z } from "zod";

export const MediaPurposeSchema = z.enum(["avatar", "cover", "evidence", "gallery"]);
export type MediaPurpose = z.infer<typeof MediaPurposeSchema>;

export const AllowedMimeTypesSchema = z.enum([
  "image/webp",
  "image/jpeg",
  "image/png",
]);
export type AllowedMimeType = z.infer<typeof AllowedMimeTypesSchema>;

export const RequestMediaUploadSignatureSchema = z.object({
  filename: z.string().min(1).max(255),
  fileSize: z.number().int().positive().max(5 * 1024 * 1024, "Ukuran file maksimum adalah 5MB"),
  mimeType: AllowedMimeTypesSchema,
  purpose: MediaPurposeSchema,
  targetProfileId: z.string().uuid(),
});
export type RequestMediaUploadSignatureInput = z.infer<typeof RequestMediaUploadSignatureSchema>;

export const MediaUploadSignatureResponseSchema = z.object({
  uploadUrl: z.string().url(),
  storagePath: z.string(),
  token: z.string(),
  expiresAt: z.string().datetime(),
  publicUrl: z.string().url(),
});
export type MediaUploadSignatureResponse = z.infer<typeof MediaUploadSignatureResponseSchema>;

export const MediaAssetRecordSchema = z.object({
  id: z.string().uuid(),
  profileId: z.string().uuid(),
  storagePath: z.string(),
  publicUrl: z.string().url(),
  fileSize: z.number().int(),
  mimeType: AllowedMimeTypesSchema,
  purpose: MediaPurposeSchema,
  isCleaned: z.boolean().default(false),
  createdAt: z.string().datetime(),
});
export type MediaAssetRecord = z.infer<typeof MediaAssetRecordSchema>;
