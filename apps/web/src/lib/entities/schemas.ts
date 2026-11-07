import { z } from "zod";

// Helper sanitasi teks: menghapus tag HTML dan script untuk mencegah Stored XSS
const sanitizeText = (val: string) =>
  val
    .replace(/<[^>]*>?/gm, "")
    .replace(/javascript:/gi, "")
    .trim();

export const sanitizedString = (min: number, max: number, messageRequired?: string) =>
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

export const optionalSanitizedString = (max: number) =>
  z
    .string()
    .optional()
    .transform((val) => (val ? sanitizeText(val) : undefined))
    .pipe(z.string().max(max, { message: `Maksimal ${max} karakter.` }).optional());

// Normalisasi WhatsApp ke format internasional E.164 (+62...)
export const e164PhoneSchema = z
  .string()
  .transform((val) => {
    let clean = val.replace(/[\s-]/g, "");
    if (clean.startsWith("0")) {
      clean = "+62" + clean.slice(1);
    } else if (clean.startsWith("62")) {
      clean = "+" + clean;
    } else if (!clean.startsWith("+")) {
      clean = "+62" + clean;
    }
    return clean;
  })
  .refine((val) => /^\+[1-9]\d{7,14}$/.test(val), {
    message: "Nomor WhatsApp tidak valid (format: 0812... atau +62812...).",
  });

export const optionalE164PhoneSchema = z
  .string()
  .optional()
  .transform((val) => {
    if (!val || !val.trim()) return undefined;
    let clean = val.replace(/[\s-]/g, "");
    if (clean.startsWith("0")) {
      clean = "+62" + clean.slice(1);
    } else if (clean.startsWith("62")) {
      clean = "+" + clean;
    } else if (!clean.startsWith("+")) {
      clean = "+62" + clean;
    }
    return clean;
  })
  .refine((val) => !val || /^\+[1-9]\d{7,14}$/.test(val), {
    message: "Nomor WhatsApp tidak valid.",
  });

// ==============================================================================
// 1. SKEMA DATA PRIBADI (PROFILE_PRIVATE - 1:1 DENGAN PROFILES)
// ==============================================================================
export const profilePrivateSchema = z.object({
  full_name: sanitizedString(2, 150, "Nama lengkap sesuai identitas wajib diisi untuk verifikasi ESPORT SUMBAR."),
  whatsapp_e164: e164PhoneSchema,
  contact_email: z.string().email("Format email tidak valid.").optional().or(z.literal("")),
  birth_date: z.string().optional(),
  gender: z.enum(["male", "female", "prefer_not_to_say"]).optional(),
  address_street: optionalSanitizedString(255),
  kecamatan: optionalSanitizedString(100),
  nagari_kelurahan: optionalSanitizedString(100),
  game_account_id: optionalSanitizedString(100),
  game_server: optionalSanitizedString(100),
  guardian_name: optionalSanitizedString(150),
  guardian_whatsapp: optionalE164PhoneSchema,
  guardian_relationship: optionalSanitizedString(50),
  rate_note: optionalSanitizedString(255),
  manager_name: optionalSanitizedString(150),
  manager_role: optionalSanitizedString(100),
  manager_whatsapp: optionalE164PhoneSchema,
});

// ==============================================================================
// 2. SKEMA UMUM PROFIL PUBLIK (PROFILES)
// ==============================================================================
export const commonProfileSchema = z.object({
  display_name: sanitizedString(2, 100, "Nama tampil wajib diisi."),
  region_id: z.string().min(1, { message: "Wilayah Kota/Kabupaten wajib dipilih." }),
  avatar_url: z.string().optional(),
  cover_url: z.string().optional(),
  bio: optionalSanitizedString(300),
  main_game_id: z.string().optional(),
});

// ==============================================================================
// 3. SKEMA ATLET (PLAYER) - SPEC 2.2B (TANPA PERTANYAAN TIM)
// ==============================================================================
export const playerAttributesSchema = z.object({
  ign: sanitizedString(2, 50, "In-Game Name (IGN) wajib diisi."),
  game_id: z.string().min(1, { message: "Game utama wajib dipilih." }),
  role: sanitizedString(2, 50, "Role bermain wajib dipilih."),
  rank: optionalSanitizedString(50),
  current_status: z.enum(["pelajar", "mahasiswa", "bekerja", "lainnya"]).default("pelajar"),
  primary_device: z.enum(["mobile", "pc", "console"]).default("mobile"),
  year_started: z.number().int().min(2010).max(new Date().getFullYear()).optional(),
  play_goal: z.enum(["santai", "kompetitif", "profesional"]).default("kompetitif"),
  training_schedule: optionalSanitizedString(100),
  is_looking_for_team: z.boolean().default(false),
  tournament_experience: optionalSanitizedString(255),
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
// 4. SKEMA PELATIH (COACH) - SPEC 2.2C (TANPA PERTANYAAN TIM YANG DILATIH)
// ==============================================================================
export const coachAttributesSchema = z.object({
  game_specialization: z.array(z.string()).min(1, { message: "Pilih minimal 1 game spesialisasi melatih." }),
  coaching_level: z.enum(["amatir", "semi_pro", "pro"]).default("amatir"),
  experience_years: z.number().int().min(0, "Tahun pengalaman minimal 0.").max(40),
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
  is_available: z.boolean().default(true),
  service_format: z.enum(["tatap_muka", "daring", "hybrid"]).default("hybrid"),
  social_media: z
    .object({
      instagram: optionalSanitizedString(100),
      youtube: optionalSanitizedString(100),
      linkedin: optionalSanitizedString(100),
    })
    .optional(),
});

// ==============================================================================
// 5. SKEMA KLUB & TIM (TEAM) - SPEC 2.2D (TANPA DAFTAR ROSTER)
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
  founded_year: z.number().int().min(2010).max(new Date().getFullYear()).optional(),
  recruitment_status: z.object({
    isOpen: z.boolean().default(false),
    rolesNeeded: z.array(z.string()).optional(),
  }),
  homebase: sanitizedString(2, 100, "Homebase kota/kabupaten wajib diisi."),
  manager_name: sanitizedString(2, 100, "Nama penanggung jawab tim wajib diisi."),
  manager_role: sanitizedString(2, 100, "Jabatan penanggung jawab wajib diisi."),
  manager_whatsapp: e164PhoneSchema,
  team_email: z.string().email("Format email tim tidak valid.").optional().or(z.literal("")),
  social_media: z
    .object({
      instagram: optionalSanitizedString(100),
      youtube: optionalSanitizedString(100),
      tiktok: optionalSanitizedString(100),
    })
    .optional(),
});

// ==============================================================================
// 6. SKEMA KOMUNITAS (COMMUNITY) - SPEC 2.2E (TANPA DAFTAR ANGGOTA)
// ==============================================================================
export const communityAttributesSchema = z.object({
  game_focus: z.array(z.string()).min(1, { message: "Pilih minimal 1 game fokus komunitas." }),
  founded_year: z.number().int().min(2010).max(new Date().getFullYear()).optional(),
  routine_activities: optionalSanitizedString(150),
  activity_frequency: z.enum(["mingguan", "dua_mingguan", "bulanan", "insidental"]).default("bulanan"),
  estimated_members: z.number().int().min(5, { message: "Estimasi anggota minimal 5 orang." }).optional(),
  coverage_area: sanitizedString(2, 100, "Cakupan wilayah wajib diisi."),
  public_group_link: z.string().url({ message: "Tautan grup harus URL valid." }).optional().or(z.literal("")),
  manager_name: sanitizedString(2, 100, "Nama ketua/koordinator komunitas wajib diisi."),
  manager_role: sanitizedString(2, 100, "Jabatan penanggung jawab wajib diisi."),
  manager_whatsapp: e164PhoneSchema,
  secretariat_address: optionalSanitizedString(255),
  social_media: z
    .object({
      instagram: optionalSanitizedString(100),
      discord: optionalSanitizedString(100),
      tiktok: optionalSanitizedString(100),
    })
    .optional(),
});

// ==============================================================================
// 7. SKEMA VENUE & ARENA (VENUE) - SPEC 2.2F
// ==============================================================================
export const venueAttributesSchema = z.object({
  venue_type: z.enum(["warnet", "icafe", "warkop_gaming", "arena", "bootcamp"]),
  business_address: sanitizedString(5, 255, "Alamat usaha wajib diisi lengkap."),
  kecamatan: sanitizedString(2, 100, "Kecamatan wajib diisi."),
  nagari_kelurahan: sanitizedString(2, 100, "Nagari / Kelurahan wajib diisi."),
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
  operating_hours: z.object({
    open: z.string(),
    close: z.string(),
    days: z.string(),
  }),
  starting_rate: z.number().optional(),
  is_tournament_ready: z.boolean().default(false),
  tournament_capacity: z.number().int().optional(),
  manager_name: sanitizedString(2, 100, "Nama pengelola usaha wajib diisi."),
  manager_whatsapp: e164PhoneSchema,
  business_email: z.string().email("Format email usaha tidak valid.").optional().or(z.literal("")),
  is_legal_registered: z.boolean().default(false),
});

// ==============================================================================
// 8. SKEMA KAMPUS / UKM (CAMPUS) - SPEC 2.2G (TANPA DAFTAR MAHASISWA)
// ==============================================================================
export const campusAttributesSchema = z.object({
  campus_name: sanitizedString(3, 150, "Nama kampus/perguruan tinggi wajib diisi."),
  esport_club_name: sanitizedString(2, 100, "Nama UKM/komunitas kampus wajib diisi."),
  faculty_or_level: optionalSanitizedString(100),
  founded_year: z.number().int().min(2010).max(new Date().getFullYear()).optional(),
  coached_games: z.array(z.string()).min(1, { message: "Pilih minimal 1 game binaan kampus." }),
  member_count: z.number().int().min(1, { message: "Jumlah anggota minimal 1 orang." }).optional(),
  advisor_name: sanitizedString(2, 100, "Nama pembina UKM wajib diisi."),
  advisor_role: sanitizedString(2, 100, "Jabatan pembina wajib diisi."),
  leader_name: sanitizedString(2, 100, "Nama ketua UKM wajib diisi."),
  official_whatsapp: e164PhoneSchema,
  campus_address: optionalSanitizedString(255),
  social_media: z
    .object({
      instagram: optionalSanitizedString(100),
      youtube: optionalSanitizedString(100),
    })
    .optional(),
});

// ==============================================================================
// 9. SKEMA SEKOLAH / PELAJAR (SCHOOL) - SPEC 2.2H (TANPA DAFTAR SISWA)
// ==============================================================================
export const schoolAttributesSchema = z.object({
  school_name: sanitizedString(3, 150, "Nama sekolah wajib diisi."),
  npsn: optionalSanitizedString(20),
  education_level: z.enum(["SMP", "MTs", "SMA", "SMK", "MA"]),
  extracurricular_name: sanitizedString(2, 100, "Nama ekstrakurikuler wajib diisi."),
  founded_year: z.number().int().min(2010).max(new Date().getFullYear()).optional(),
  coached_games: z.array(z.string()).min(1, { message: "Pilih minimal 1 game binaan sekolah." }),
  student_count: z.number().int().min(1, { message: "Jumlah siswa minimal 1 orang." }).optional(),
  advisor_name: sanitizedString(2, 100, "Nama guru pembina wajib diisi."),
  advisor_role: sanitizedString(2, 100, "Jabatan pembina wajib diisi."),
  advisor_whatsapp: e164PhoneSchema,
  school_address: optionalSanitizedString(255),
  social_media: z
    .object({
      instagram: optionalSanitizedString(100),
      youtube: optionalSanitizedString(100),
    })
    .optional(),
});
