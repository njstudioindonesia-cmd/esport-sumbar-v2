export type EntityCategory =
  | "player"
  | "coach"
  | "team"
  | "community"
  | "venue"
  | "campus"
  | "school";

export interface EcosystemRelationRule {
  sourceType: EntityCategory;
  targetType: EntityCategory;
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
    relationName: "Siswa / Ekskul Sekolah",
    description: "Pemain mewakili ekskul esport sekolah menengah.",
  },
];
