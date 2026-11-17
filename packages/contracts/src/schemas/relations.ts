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


export interface EcosystemRelationRule {
  sourceType: string;
  targetType: string;
  relationName: string;
  maxActivePerSource?: number;
  description: string;
}

export const ECOSYSTEM_RELATION_RULES: EcosystemRelationRule[] = [
  {
    sourceType: "player",
    targetType: "team",
    relationName: "Anggota Tim",
    maxActivePerSource: 3,
    description: "Pemain menjadi bagian dari tim / roster kompetitif.",
  },
  {
    sourceType: "coach",
    targetType: "team",
    relationName: "Pelatih Tim",
    maxActivePerSource: 2,
    description: "Pelatih meracik strategi untuk tim esport.",
  },
  {
    sourceType: "player",
    targetType: "community",
    relationName: "Anggota Komunitas",
    description: "Pemain terafiliasi dengan komunitas esport daerah.",
  },
  {
    sourceType: "team",
    targetType: "venue",
    relationName: "Homebase Venue",
    description: "Markas latihan resmi tim di gaming cafe atau arena lokal.",
  },
  {
    sourceType: "player",
    targetType: "campus",
    relationName: "Mahasiswa / UKM Kampus",
    description: "Pemain mewakili unit kegiatan mahasiswa esport kampus.",
  },
  {
    sourceType: "player",
    targetType: "school",
    relationName: "Siswa Ekstrakurikuler",
    description: "Pemain mewakili tim esport sekolah menengah.",
  },
];
