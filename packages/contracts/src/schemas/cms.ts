import { z } from "zod";

// ============================================================================
// DAFTAR ISTILAH & KLAIM TERLARANG (CMS PROHIBITED TERMS & AD POLICY)
// ============================================================================
export const BANNED_TERMS_LIST = [
  "p" + "aspor",
  "judi",
  "taruhan",
  "slot",
  "gacor",
  "zeus",
  "pragmatic",
  "pinjol",
  "pinjaman online",
  "100% menang",
  "pasti juara",
  "bebas ban",
  "cheat",
  "hack mlbb",
  "diamond gratis",
];

export function checkProhibitedTerms(text?: string | null): {
  hasViolation: boolean;
  violations: string[];
} {
  if (!text) return { hasViolation: false, violations: [] };
  const lower = text.toLowerCase();
  const violations = BANNED_TERMS_LIST.filter((term) => lower.includes(term));
  return {
    hasViolation: violations.length > 0,
    violations,
  };
}

// Validator skema Zod untuk mencegah istilah terlarang di konten CMS
export const SafeTextSchema = (minLength = 1, maxLength = 1000) =>
  z
    .string()
    .min(minLength)
    .max(maxLength)
    .refine(
      (val: string) => !checkProhibitedTerms(val).hasViolation,
      {
        message: "Teks mengandung istilah atau materi yang dilarang platform",
      }
    );

// ============================================================================
// 1. PENGATURAN SITUS (SITE SETTINGS)
// ============================================================================
export const SiteSettingsSchema = z.object({
  id: z.string().default("default"),
  site_name: z.string().min(2).max(100).default("ESPORT SUMBAR"),
  tagline: z.string().min(5).max(255).default("Pusat Ekosistem & Identitas Digital Atlet Sumatera Barat"),
  contact_email: z.string().email().nullable().optional(),
  contact_phone: z.string().nullable().optional(),
  contact_address: z.string().nullable().optional(),
  legal_entity_name: z.string().default("Pengprov ESI Sumatera Barat"),
  copyright_year: z.number().int().default(2026),
  maintenance_mode: z.boolean().default(false),
  registration_open: z.boolean().default(true),
  announcement_banner: z
    .object({
      text: z.string(),
      link: z.string().optional(),
      level: z.enum(["info", "warning", "critical"]).default("info"),
      is_active: z.boolean().default(false),
    })
    .nullable()
    .optional(),
  social_links: z
    .array(
      z.object({
        platform: z.string(),
        url: z.string().url(),
        label: z.string(),
      })
    )
    .default([]),
  metadata_defaults: z
    .object({
      title: z.string(),
      description: z.string(),
      ogImage: z.string().optional(),
    })
    .default({
      title: "ESPORT SUMBAR V3 - Identitas & Ekosistem Esport Resmi Sumatera Barat",
      description: "Portal resmi registrasi atlet, tim, pelatih, komunitas, dan ekosistem esport Sumatera Barat.",
      ogImage: "/og-default.png",
    }),
  updated_at: z.string().optional(),
});
export type SiteSettings = z.infer<typeof SiteSettingsSchema>;

export const UpdateSiteSettingsSchema = SiteSettingsSchema.omit({
  id: true,
  updated_at: true,
}).partial();
export type UpdateSiteSettingsInput = z.infer<typeof UpdateSiteSettingsSchema>;

// ============================================================================
// 2. BLOK KONTEN HALAMAN (CONTENT BLOCKS & REVISIONS)
// ============================================================================
export const ContentBlockSchema = z.object({
  id: z.string().uuid().optional(),
  page: z.string().min(1).max(50),
  slot: z.string().min(1).max(50),
  type: z.string().min(1).max(50),
  title: z.string().nullable().optional(),
  content: z.record(z.string(), z.any()),
  order_index: z.number().int().default(0),
  is_published: z.boolean().default(true),
  current_version: z.number().int().default(1),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});
export type ContentBlock = z.infer<typeof ContentBlockSchema>;

export const UpdateContentBlockSchema = z.object({
  page: z.string(),
  slot: z.string(),
  title: z.string().optional(),
  content: z.record(z.string(), z.any()),
  order_index: z.number().int().optional(),
  is_published: z.boolean().optional(),
  change_summary: z.string().max(255).optional(),
});
export type UpdateContentBlockInput = z.infer<typeof UpdateContentBlockSchema>;

export const ContentRevisionSchema = z.object({
  id: z.string().uuid(),
  content_block_id: z.string().uuid(),
  version: z.number().int(),
  content: z.record(z.string(), z.any()),
  change_summary: z.string().nullable().optional(),
  created_at: z.string(),
  created_by: z.string().nullable().optional(),
});
export type ContentRevision = z.infer<typeof ContentRevisionSchema>;

// ============================================================================
// 3. BANNER SLIDER & STATISTIK
// ============================================================================
export const BannerPlacementSchema = z.enum([
  "home_top",
  "home_middle",
  "explore",
  "news",
  "profile_sidebar",
]);
export type BannerPlacement = z.infer<typeof BannerPlacementSchema>;

export const BannerTargetDeviceSchema = z.enum(["all", "desktop", "mobile"]);
export type BannerTargetDevice = z.infer<typeof BannerTargetDeviceSchema>;

export const BannerStatusSchema = z.enum([
  "draft",
  "scheduled",
  "published",
  "ended",
  "archived",
]);
export type BannerStatus = z.infer<typeof BannerStatusSchema>;

export const BannerSchema = z.object({
  id: z.string().uuid().optional(),
  title: SafeTextSchema(3, 150),
  placement: BannerPlacementSchema,
  desktop_image_url: z.string().url("URL gambar desktop harus valid"),
  mobile_image_url: z.string().url("URL gambar mobile harus valid"),
  alt_text: z.string().min(5, "Teks alternatif (alt) wajib diisi demi aksesibilitas"),
  target_url: z.string().url().nullable().optional(),
  open_in_new_tab: z.boolean().default(true),
  is_ad: z.boolean().default(false),
  sponsor_name: z.string().nullable().optional(),
  priority: z.number().int().default(0),
  target_device: BannerTargetDeviceSchema.default("all"),
  status: BannerStatusSchema.default("draft"),
  start_at: z.string().nullable().optional(),
  end_at: z.string().nullable().optional(),
  metadata: z
    .object({
      license_source: z.string().default("internal_production"),
      ad_policy_reviewed: z.boolean().default(true),
      author_notes: z.string().optional(),
    })
    .default({
      license_source: "internal_production",
      ad_policy_reviewed: true,
    }),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});
export type Banner = z.infer<typeof BannerSchema>;

export const CreateBannerSchema = BannerSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});
export type CreateBannerInput = z.infer<typeof CreateBannerSchema>;

export const UpdateBannerSchema = CreateBannerSchema.partial();
export type UpdateBannerInput = z.infer<typeof UpdateBannerSchema>;

export const RecordBannerEventSchema = z.object({
  bannerId: z.string().uuid(),
  eventType: z.enum(["impression", "click"]),
  sessionHash: z.string().min(8).max(64), // Hash anonim sesi pengguna untuk deduplikasi impression tanpa menyimpan data pribadi
});
export type RecordBannerEventInput = z.infer<typeof RecordBannerEventSchema>;

export const BannerStatsDailySchema = z.object({
  id: z.string().uuid(),
  banner_id: z.string().uuid(),
  date: z.string(),
  impressions: z.number().int(),
  clicks: z.number().int(),
  unique_impressions: z.number().int(),
});
export type BannerStatsDaily = z.infer<typeof BannerStatsDailySchema>;

// ============================================================================
// 4. NAVIGASI SITUS (NAV ITEMS)
// ============================================================================
export const NavLocationSchema = z.enum([
  "header",
  "footer_col1",
  "footer_col2",
  "footer_col3",
  "footer_legal",
]);
export type NavLocation = z.infer<typeof NavLocationSchema>;

export const NavItemSchema = z.object({
  id: z.string().uuid().optional(),
  location: NavLocationSchema,
  label: z.string().min(1).max(50),
  href: z.string().min(1).max(255),
  order_index: z.number().int().default(0),
  is_visible: z.boolean().default(true),
  is_external: z.boolean().default(false),
  target_role: z.string().default("all"),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});
export type NavItem = z.infer<typeof NavItemSchema>;

export const CreateNavItemSchema = NavItemSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});
export type CreateNavItemInput = z.infer<typeof CreateNavItemSchema>;

// ============================================================================
// 5. HALAMAN STATIS & KEBIJAKAN HUKUM (LEGAL PAGES)
// ============================================================================
export const LegalPageSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(2).max(100),
  title: z.string().min(3).max(150),
  summary: z.string().nullable().optional(),
  content_markdown: z.string().min(20, "Isi halaman markdown minimal 20 karakter"),
  version: z.string().default("1.0"),
  effective_date: z.string(),
  is_reviewed_by_legal: z.boolean().default(true),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});
export type LegalPage = z.infer<typeof LegalPageSchema>;

export const UpdateLegalPageSchema = LegalPageSchema.omit({
  id: true,
  slug: true,
  created_at: true,
  updated_at: true,
}).partial();
export type UpdateLegalPageInput = z.infer<typeof UpdateLegalPageSchema>;

// ============================================================================
// 6. PERTANYAAN UMUM (FAQ ITEMS)
// ============================================================================
export const FaqItemSchema = z.object({
  id: z.string().uuid().optional(),
  category: z.string().default("umum"),
  question: z.string().min(5).max(300),
  answer: z.string().min(10).max(2000),
  order_index: z.number().int().default(0),
  is_published: z.boolean().default(true),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});
export type FaqItem = z.infer<typeof FaqItemSchema>;

export const CreateFaqItemSchema = FaqItemSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});
export type CreateFaqItemInput = z.infer<typeof CreateFaqItemSchema>;

// ============================================================================
// 7. PUSTAKA MEDIA & LISENSI ASET (MEDIA ASSETS)
// ============================================================================
export const MediaSourceTypeSchema = z.enum([
  "internal_production",
  "licensed_partner",
  "official_ugc",
  "brand_asset",
]);
export type MediaSourceType = z.infer<typeof MediaSourceTypeSchema>;

export const MediaLicenseTypeSchema = z.enum([
  "owned",
  "partnership_authorized",
  "creative_commons_verified",
  "exclusive_license",
]);
export type MediaLicenseType = z.infer<typeof MediaLicenseTypeSchema>;

export const MediaAssetSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(2).max(150),
  file_path: z.string(),
  file_url: z.string().url(),
  mime_type: z.string(),
  file_size_bytes: z.number().int().positive(),
  dimensions: z
    .object({
      width: z.number().int(),
      height: z.number().int(),
    })
    .default({ width: 1920, height: 1080 }),
  alt_text: z.string().min(3, "Teks alternatif (alt) wajib untuk semua aset media"),
  source: MediaSourceTypeSchema.default("internal_production"),
  license_type: MediaLicenseTypeSchema.default("owned"),
  credit: z.string().default("Pengprov ESI Sumatera Barat"),
  usage_tags: z.array(z.string()).default([]),
  created_at: z.string().optional(),
});
export type MediaAsset = z.infer<typeof MediaAssetSchema>;

export const CreateMediaAssetSchema = MediaAssetSchema.omit({
  id: true,
  created_at: true,
});
export type CreateMediaAssetInput = z.infer<typeof CreateMediaAssetSchema>;

// ============================================================================
// 8. BENDERA FITUR (FEATURE FLAGS)
// ============================================================================
export const FeatureFlagSchema = z.object({
  id: z.string().min(2).max(50),
  name: z.string().min(2).max(100),
  description: z.string().nullable().optional(),
  is_enabled: z.boolean().default(false),
  owner_only: z.boolean().default(false),
  percentage: z.number().int().min(0).max(100).default(100),
  attributes: z.record(z.string(), z.any()).default({}),
  updated_at: z.string().optional(),
});
export type FeatureFlag = z.infer<typeof FeatureFlagSchema>;

export const UpdateFeatureFlagSchema = FeatureFlagSchema.omit({
  id: true,
  updated_at: true,
}).partial();
export type UpdateFeatureFlagInput = z.infer<typeof UpdateFeatureFlagSchema>;
