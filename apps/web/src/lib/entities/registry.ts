import type { EntityType, RarityTier } from "@/lib/supabase/database.types";
import type { EntityDefinition } from "./types";
import {
  playerAttributesSchema,
  coachAttributesSchema,
  teamAttributesSchema,
  communityAttributesSchema,
  venueAttributesSchema,
  campusAttributesSchema,
  schoolAttributesSchema,
  commonProfileSchema,
} from "./schemas";

// ==============================================================================
// 1. FEATURE FLAG: ENTITAS YANG DIAKTIFKAN DI SISTEM
// ==============================================================================
const DEFAULT_ENABLED_TYPES: EntityType[] = [
  "player",
  "coach",
  "team",
  "community",
  "venue",
  "campus",
  "school",
];

export function getEnabledEntityTypes(): EntityType[] {
  const envFlag = process.env.NEXT_PUBLIC_ENABLED_ENTITY_TYPES;
  if (!envFlag) return DEFAULT_ENABLED_TYPES;

  const parsed = envFlag
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean) as EntityType[];

  return parsed.length > 0 ? parsed : DEFAULT_ENABLED_TYPES;
}

export function isEntityTypeEnabled(type: string): boolean {
  return getEnabledEntityTypes().includes(type as EntityType);
}

// ==============================================================================
// 2. REGISTRY RESMI KE-7 BIDANG EKOSISTEM ESPORT SUMBAR
// ==============================================================================
export const ENTITY_REGISTRY: Record<EntityType, EntityDefinition> = {
  // ----------------------------------------------------------------------------
  // BIDANG 1: ATLET (PLAYER)
  // ----------------------------------------------------------------------------
  player: {
    type: "player",
    code: "PL",
    label: "Atlet / Player",
    singularLabel: "Atlet",
    description: "Identitas digital atlet esport kompetitif dengan rekam jejak turnamen terverifikasi.",
    badgeColor: "from-blue-500/20 to-blue-600/30 text-blue-400 border-blue-500/40",
    accentGradient: "from-blue-500 to-indigo-600",
    defaultRarity: "rookie",
    defaultVisibility: {
      email: false,
      phone: false,
      realName: false,
      game_account_id: false,
      history: true,
      achievements: true,
    },
    schema: playerAttributesSchema,
    fields: [
      {
        name: "ign",
        label: "In-Game Name (IGN)",
        type: "text",
        placeholder: "mis. SUTAN_AIM",
        required: true,
        weight: 20,
      },
      {
        name: "game_id",
        label: "Game Utama",
        type: "select",
        required: true,
        weight: 15,
      },
      {
        name: "role",
        label: "Role Bermain",
        type: "select",
        placeholder: "mis. Roamer / Rusher",
        required: true,
        weight: 15,
      },
      {
        name: "rank",
        label: "Tier / Rank Tertinggi",
        type: "text",
        placeholder: "mis. Mythic Glory 120★",
        weight: 5,
      },
      {
        name: "game_account_id",
        label: "ID Akun Game / Server (Privat)",
        type: "text",
        placeholder: "mis. 128475821 (Server 2021)",
        isPrivateByDefault: true,
        weight: 5,
      },
      {
        name: "year_started",
        label: "Tahun Mulai Bermain Kompetitif",
        type: "number",
        placeholder: "mis. 2021",
        weight: 5,
      },
      {
        name: "is_looking_for_team",
        label: "Status Mencari Tim / Terbuka Rekrutmen",
        type: "boolean",
        weight: 5,
      },
    ],
  },

  // ----------------------------------------------------------------------------
  // BIDANG 2: PELATIH (COACH)
  // ----------------------------------------------------------------------------
  coach: {
    type: "coach",
    code: "CO",
    label: "Pelatih / Coach",
    singularLabel: "Pelatih",
    description: "Sertifikasi dan lisensi resmi pelatih taktis & analis esport Sumatera Barat.",
    badgeColor: "from-amber-500/20 to-amber-600/30 text-[#D4AF37] border-[#D4AF37]/40",
    accentGradient: "from-amber-500 to-yellow-600",
    defaultRarity: "rookie",
    defaultVisibility: {
      email: false,
      phone: false,
      realName: true,
      certifications: true,
      coaching_philosophy: true,
    },
    schema: coachAttributesSchema,
    fields: [
      {
        name: "game_specialization",
        label: "Spesialisasi Game",
        type: "multiselect",
        required: true,
        weight: 20,
      },
      {
        name: "experience_years",
        label: "Pengalaman Melatih (Tahun)",
        type: "number",
        placeholder: "mis. 4",
        required: true,
        weight: 15,
      },
      {
        name: "coaching_philosophy",
        label: "Filosofi Melatih (Maks 140 karakter)",
        type: "textarea",
        placeholder: "Disiplin rotasi, mental juara, dan adaptasi makro dinamis.",
        weight: 10,
      },
      {
        name: "is_active_coaching",
        label: "Ketersediaan Melatih",
        type: "boolean",
        weight: 5,
      },
    ],
  },

  // ----------------------------------------------------------------------------
  // BIDANG 3: KLUB & TIM (TEAM)
  // ----------------------------------------------------------------------------
  team: {
    type: "team",
    code: "TM",
    label: "Klub & Tim Esport",
    singularLabel: "Tim",
    description: "Registrasi klub esport dengan roster resmi dan keanggotaan terverifikasi.",
    badgeColor: "from-purple-500/20 to-purple-600/30 text-purple-400 border-purple-500/40",
    accentGradient: "from-purple-500 to-violet-600",
    defaultRarity: "rookie",
    defaultVisibility: {
      email: false,
      phone: false,
      roster: true,
      achievements: true,
    },
    schema: teamAttributesSchema,
    fields: [
      {
        name: "team_name",
        label: "Nama Tim / Organisasi",
        type: "text",
        placeholder: "mis. Singkarak Esports",
        required: true,
        weight: 15,
      },
      {
        name: "team_tag",
        label: "Singkatan / Tag Tim (2-5 Karakter)",
        type: "text",
        placeholder: "mis. SKR",
        required: true,
        weight: 20,
      },
      {
        name: "game_division",
        label: "Divisi Game Utama",
        type: "select",
        required: true,
        weight: 15,
      },
      {
        name: "homebase",
        label: "Homebase Kota / Kabupaten",
        type: "text",
        placeholder: "mis. Kota Padang",
        required: true,
        weight: 15,
      },
      {
        name: "founded_year",
        label: "Tahun Berdiri",
        type: "number",
        placeholder: "mis. 2022",
        weight: 5,
      },
    ],
  },

  // ----------------------------------------------------------------------------
  // BIDANG 4: KOMUNITAS (COMMUNITY)
  // ----------------------------------------------------------------------------
  community: {
    type: "community",
    code: "CM",
    label: "Komunitas Esport",
    singularLabel: "Komunitas",
    description: "Wadah komunitas penggemar game lokal dengan agenda turnamen dan pertemuan.",
    badgeColor: "from-emerald-500/20 to-emerald-600/30 text-emerald-400 border-emerald-500/40",
    accentGradient: "from-emerald-500 to-teal-600",
    defaultRarity: "rookie",
    defaultVisibility: {
      email: false,
      official_contact: false,
      leadership: true,
      public_group_link: true,
    },
    schema: communityAttributesSchema,
    fields: [
      {
        name: "game_focus",
        label: "Fokus Game Komunitas",
        type: "multiselect",
        required: true,
        weight: 20,
      },
      {
        name: "coverage_area",
        label: "Cakupan Wilayah",
        type: "text",
        placeholder: "mis. Luak Limopuluah (Payakumbuh & 50 Kota)",
        required: true,
        weight: 15,
      },
      {
        name: "activity_frequency",
        label: "Frekuensi Kegiatan",
        type: "select",
        options: [
          { value: "mingguan", label: "Mingguan" },
          { value: "dua_mingguan", label: "Dua Mingguan" },
          { value: "bulanan", label: "Bulanan" },
          { value: "insidental", label: "Insidental / Musiman" },
        ],
        required: true,
        weight: 10,
      },
      {
        name: "estimated_members",
        label: "Estimasi Jumlah Anggota Aktif",
        type: "number",
        placeholder: "mis. 250",
        weight: 10,
      },
      {
        name: "public_group_link",
        label: "Tautan Grup Komunitas (WhatsApp / Discord)",
        type: "text",
        placeholder: "mis. https://chat.whatsapp.com/...",
        weight: 5,
      },
    ],
  },

  // ----------------------------------------------------------------------------
  // BIDANG 5: VENUE & ARENA (VENUE)
  // ----------------------------------------------------------------------------
  venue: {
    type: "venue",
    code: "VN",
    label: "Venue & Gaming Hub",
    singularLabel: "Venue",
    description: "Tempat bertanding resmi, iCafe, dan bootcamp station terakreditasi ESI.",
    badgeColor: "from-orange-500/20 to-orange-600/30 text-orange-400 border-orange-500/40",
    accentGradient: "from-orange-500 to-amber-600",
    defaultRarity: "rookie",
    defaultVisibility: {
      email: false,
      business_address: true,
      business_contact: true,
      facilities: true,
      hardware_specs: true,
    },
    schema: venueAttributesSchema,
    fields: [
      {
        name: "venue_type",
        label: "Kategori Usaha / Venue",
        type: "select",
        options: [
          { value: "icafe", label: "iCafe / Gaming Lounge" },
          { value: "warnet", label: "Warnet Esport" },
          { value: "arena", label: "Arena Turnamen Resmi" },
          { value: "warkop_gaming", label: "Warkop Gaming" },
          { value: "bootcamp", label: "Bootcamp Station" },
        ],
        required: true,
        weight: 15,
      },
      {
        name: "business_address",
        label: "Alamat Lengkap Usaha",
        type: "text",
        placeholder: "Jl. Khatib Sulaiman No. 45, Padang Barat",
        required: true,
        weight: 15,
      },
      {
        name: "capacity_units",
        label: "Kapasitas Unit Gaming (PC / Station)",
        type: "number",
        placeholder: "mis. 32",
        required: true,
        weight: 15,
      },
      {
        name: "facilities",
        label: "Fasilitas Tersedia",
        type: "chips",
        required: true,
        weight: 15,
      },
      {
        name: "is_tournament_ready",
        label: "Kesiapan Menyelenggarakan Turnamen",
        type: "boolean",
        weight: 5,
      },
    ],
  },

  // ----------------------------------------------------------------------------
  // BIDANG 6: KAMPUS / UKM (CAMPUS)
  // ----------------------------------------------------------------------------
  campus: {
    type: "campus",
    code: "CP",
    label: "Kampus / UKM Perguruan Tinggi",
    singularLabel: "Kampus",
    description: "Unit Kegiatan Mahasiswa (UKM) cabang olahraga esport di tingkat universitas.",
    badgeColor: "from-cyan-500/20 to-cyan-600/30 text-cyan-400 border-cyan-500/40",
    accentGradient: "from-cyan-500 to-blue-600",
    defaultRarity: "rookie",
    defaultVisibility: {
      email: false,
      phone: false,
      advisor_name: true,
      leader_name: true,
      coached_games: true,
    },
    schema: campusAttributesSchema,
    fields: [
      {
        name: "campus_name",
        label: "Nama Perguruan Tinggi / Universitas",
        type: "text",
        placeholder: "mis. Universitas Andalas",
        required: true,
        weight: 15,
      },
      {
        name: "esport_club_name",
        label: "Nama UKM / Klub Kampus",
        type: "text",
        placeholder: "mis. UKM Esport Unand (Green Marawa)",
        required: true,
        weight: 20,
      },
      {
        name: "coached_games",
        label: "Divisi Game yang Dibina",
        type: "multiselect",
        required: true,
        weight: 15,
      },
      {
        name: "member_count",
        label: "Jumlah Mahasiswa Anggota Aktif",
        type: "number",
        placeholder: "mis. 85",
        weight: 15,
      },
      {
        name: "advisor_name",
        label: "Dosen Pembina UKM",
        type: "text",
        placeholder: "mis. Dr. Ir. Rahmat, M.Kom",
        weight: 10,
      },
    ],
  },

  // ----------------------------------------------------------------------------
  // BIDANG 7: SEKOLAH / PELAJAR (SCHOOL) - DATA SISWA DILINDUNGI
  // ----------------------------------------------------------------------------
  school: {
    type: "school",
    code: "SC",
    label: "Sekolah / Ekstrakurikuler Pelajar",
    singularLabel: "Sekolah",
    description: "Pembinaan minat dan bakat esport tingkat SMP/SMA dengan perlindungan data pelajar.",
    badgeColor: "from-emerald-500/20 to-teal-600/30 text-teal-400 border-teal-500/40",
    accentGradient: "from-teal-500 to-emerald-600",
    defaultRarity: "rookie",
    defaultVisibility: {
      email: false,
      phone: false,
      advisor_name: true,
      // PENTING: Daftar nama siswa dan kontak siswa DILINDUNGI & TIDAK TAMPIL PUBLIK
    },
    schema: schoolAttributesSchema,
    fields: [
      {
        name: "school_name",
        label: "Nama Satuan Pendidikan / Sekolah",
        type: "text",
        placeholder: "mis. SMAN 1 Padang",
        required: true,
        weight: 15,
      },
      {
        name: "education_level",
        label: "Jenjang Pendidikan",
        type: "select",
        options: [
          { value: "SMP", label: "SMP (Sekolah Menengah Pertama)" },
          { value: "MTs", label: "MTs (Madrasah Tsanawiyah)" },
          { value: "SMA", label: "SMA (Sekolah Menengah Atas)" },
          { value: "SMK", label: "SMK (Sekolah Menengah Kejuruan)" },
          { value: "MA", label: "MA (Madrasah Aliyah)" },
        ],
        required: true,
        weight: 15,
      },
      {
        name: "extracurricular_name",
        label: "Nama Klub / Ekstrakurikuler Esport",
        type: "text",
        placeholder: "mis. Smansa Gaming Club",
        required: true,
        weight: 20,
      },
      {
        name: "coached_games",
        label: "Game Cabang Olahraga yang Dibina",
        type: "multiselect",
        required: true,
        weight: 15,
      },
      {
        name: "student_count",
        label: "Jumlah Pelajar Terbina (Angka Saja)",
        type: "number",
        placeholder: "mis. 35",
        weight: 15,
      },
      {
        name: "advisor_name",
        label: "Guru Pembina Ekstrakurikuler",
        type: "text",
        placeholder: "mis. H. Ahmad Fauzi, S.Pd",
        weight: 5,
      },
    ],
  },

  // Bidang Organizer (Opsional untuk EO/Penyelenggara)
  organizer: {
    type: "organizer",
    code: "EO",
    label: "Event Organizer",
    singularLabel: "Organizer",
    description: "Penyelenggara turnamen resmi berizin rekomendasi Pengprov ESI Sumatera Barat.",
    badgeColor: "from-rose-500/20 to-red-600/30 text-rose-400 border-rose-500/40",
    accentGradient: "from-rose-500 to-red-600",
    defaultRarity: "rookie",
    defaultVisibility: {
      email: false,
      phone: false,
    },
    schema: commonProfileSchema,
    fields: [
      {
        name: "display_name",
        label: "Nama Penyelenggara",
        type: "text",
        required: true,
        weight: 20,
      },
    ],
  },
};

/**
 * Mengambil metadata definisi bidang entitas resmi
 */
export function getEntityDefinition(type: EntityType): EntityDefinition {
  return ENTITY_REGISTRY[type] || ENTITY_REGISTRY.player;
}
