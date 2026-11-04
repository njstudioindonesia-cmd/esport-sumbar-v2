import { z } from "zod";

// Helper sanitasi teks: menghapus tag HTML dan script untuk mencegah Stored XSS
const sanitizeText = (val: string) =>
  val
    .replace(/<[^>]*>?/gm, "")
    .replace(/javascript:/gi, "")
    .trim();

const sanitizedString = (min: number, max: number, messageRequired?: string) =>
  z
    .string()
    .min(1, { message: messageRequired || "Kolom ini wajib diisi." })
    .transform(sanitizeText)
    .pipe(
      z
        .string()
        .min(min, { message: `Minimal ${min} karakter.` })
        .max(max, { message: `Maksimal ${max} karakter.` })
    );

const optionalSanitizedString = (max: number) =>
  z
    .string()
    .optional()
    .transform((val) => (val ? sanitizeText(val) : undefined))
    .pipe(z.string().max(max, { message: `Maksimal ${max} karakter.` }).optional());

// ==============================================================================
// 1. SKEMA UMUM (SEMUA BIDANG)
// ==============================================================================
export const commonProfileSchema = z.object({
  display_name: sanitizedString(2, 100, "Nama resmi wajib diisi."),
  region_id: z.string().min(1, { message: "Wilayah Kota/Kabupaten wajib dipilih." }),
  avatar_url: z.string().optional(),
  cover_url: z.string().optional(),
  bio: optionalSanitizedString(160),
  main_game_id: z.string().optional(),
});

// ==============================================================================
// 2. SKEMA 1: ATLET (PLAYER)
// ==============================================================================
export const playerAttributesSchema = z.object({
  ign: sanitizedString(2, 50, "In-Game Name (IGN) wajib diisi."),
  game_id: z.string().min(1, { message: "Game utama wajib dipilih." }),
  role: sanitizedString(2, 50, "Role bermain wajib dipilih."),
  rank: optionalSanitizedString(50),
  game_account_id: optionalSanitizedString(100),
  year_started: z
    .number()
    .int()
    .min(2010, { message: "Tahun mulai tidak valid." })
    .max(new Date().getFullYear(), { message: "Tahun tidak boleh melebihi tahun sekarang." })
    .optional(),
  is_looking_for_team: z.boolean().default(false),
  social_media: z
    .object({
      instagram: optionalSanitizedString(100),
      youtube: optionalSanitizedString(100),
      tiktok: optionalSanitizedString(100),
      x: optionalSanitizedString(100),
    })
    .optional(),
});

// ==============================================================================
// 3. SKEMA 2: PELATIH (COACH)
// ==============================================================================
export const coachAttributesSchema = z.object({
  game_specialization: z
    .array(z.string())
    .min(1, { message: "Pilih minimal 1 game spesialisasi melatih." }),
  experience_years: z
    .number()
    .int()
    .min(0, { message: "Tahun pengalaman minimal 0." })
    .max(40, { message: "Tahun pengalaman maksimal 40." }),
  certifications: z
    .array(
      z.object({
        title: sanitizedString(2, 100),
        issuer: sanitizedString(2, 100),
        year: z.number().int().min(2010).max(new Date().getFullYear()).optional(),
      })
    )
    .optional(),
  coaching_philosophy: optionalSanitizedString(140),
  is_active_coaching: z.boolean().default(true),
  social_media: z
    .object({
      instagram: optionalSanitizedString(100),
      youtube: optionalSanitizedString(100),
      linkedin: optionalSanitizedString(100),
    })
    .optional(),
});

// ==============================================================================
// 4. SKEMA 3: KLUB & TIM (TEAM)
// ==============================================================================
export const teamAttributesSchema = z.object({
  team_name: sanitizedString(2, 100, "Nama tim wajib diisi."),
  team_tag: z
    .string()
    .trim()
    .toUpperCase()
    .min(2, { message: "Singkatan tim minimal 2 huruf." })
    .max(5, { message: "Singkatan tim maksimal 5 huruf." }),
  game_division: sanitizedString(2, 100, "Divisi game utama wajib dipilih."),
  founded_year: z
    .number()
    .int()
    .min(2015, { message: "Tahun berdiri minimal 2015." })
    .max(new Date().getFullYear(), { message: "Tahun berdiri tidak valid." }),
  recruitment_status: z.object({
    isOpen: z.boolean().default(false),
    rolesNeeded: z.array(z.string()).optional(),
  }),
  homebase: sanitizedString(2, 100, "Homebase kota/kabupaten wajib diisi."),
  social_media: z
    .object({
      instagram: optionalSanitizedString(100),
      youtube: optionalSanitizedString(100),
      tiktok: optionalSanitizedString(100),
    })
    .optional(),
});

// ==============================================================================
// 5. SKEMA 4: KOMUNITAS ESPORT (COMMUNITY)
// ==============================================================================
export const communityAttributesSchema = z.object({
  game_focus: z.array(z.string()).min(1, { message: "Pilih minimal 1 game fokus komunitas." }),
  founded_year: z
    .number()
    .int()
    .min(2015)
    .max(new Date().getFullYear()),
  estimated_members: z
    .number()
    .int()
    .min(5, { message: "Estimasi anggota minimal 5 orang." }),
  activity_frequency: z.enum(["mingguan", "dua_mingguan", "bulanan", "insidental"]),
  coverage_area: sanitizedString(2, 100, "Cakupan wilayah wajib diisi."),
  leadership: z
    .array(
      z.object({
        name: sanitizedString(2, 100),
        title: sanitizedString(2, 100),
        isApproved: z.boolean().default(false),
      })
    )
    .optional(),
  public_group_link: z.string().url({ message: "Tautan grup harus URL valid." }).optional().or(z.literal("")),
  official_contact: optionalSanitizedString(100),
});

// ==============================================================================
// 6. SKEMA 5: VENUE & ARENA (VENUE)
// ==============================================================================
export const venueAttributesSchema = z.object({
  venue_type: z.enum(["warnet", "icafe", "warkop_gaming", "arena", "bootcamp"]),
  business_address: sanitizedString(5, 255, "Alamat usaha wajib diisi lengkap."),
  coordinates: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }),
  capacity_units: z.number().int().min(1, { message: "Kapasitas minimal 1 unit." }),
  facilities: z.array(z.string()).min(1, { message: "Pilih minimal 1 fasilitas venue." }),
  hardware_specs: z
    .object({
      cpu: optionalSanitizedString(100),
      gpu: optionalSanitizedString(100),
      monitor: optionalSanitizedString(100),
      internet_mbps: z.number().int().optional(),
    })
    .optional(),
  operating_hours: z
    .object({
      open: z.string(),
      close: z.string(),
      days: z.string(),
    })
    .optional(),
  starting_rate: z.number().optional(),
  is_tournament_ready: z.boolean().default(false),
  business_contact: optionalSanitizedString(100),
});

// ==============================================================================
// 7. SKEMA 6: KAMPUS / UKM (CAMPUS)
// ==============================================================================
export const campusAttributesSchema = z.object({
  campus_name: sanitizedString(3, 150, "Nama kampus/perguruan tinggi wajib diisi."),
  esport_club_name: sanitizedString(2, 100, "Nama UKM/komunitas kampus wajib diisi."),
  faculty_or_level: optionalSanitizedString(100),
  advisor_name: optionalSanitizedString(100),
  leader_name: optionalSanitizedString(100),
  member_count: z.number().int().min(1, { message: "Jumlah anggota minimal 1 orang." }),
  coached_games: z.array(z.string()).min(1, { message: "Pilih minimal 1 game binaan kampus." }),
  founded_year: z.number().int().min(2015).max(new Date().getFullYear()),
});

// ==============================================================================
// 8. SKEMA 7: SEKOLAH / PELAJAR (SCHOOL) - PERLINDUNGAN SISWA
// ==============================================================================
export const schoolAttributesSchema = z.object({
  school_name: sanitizedString(3, 150, "Nama sekolah wajib diisi."),
  education_level: z.enum(["SMP", "MTs", "SMA", "SMK", "MA"]),
  extracurricular_name: sanitizedString(2, 100, "Nama ekstrakurikuler wajib diisi."),
  advisor_name: optionalSanitizedString(100),
  student_count: z.number().int().min(1, { message: "Jumlah siswa minimal 1 orang." }),
  coached_games: z.array(z.string()).min(1, { message: "Pilih minimal 1 game binaan sekolah." }),
});
