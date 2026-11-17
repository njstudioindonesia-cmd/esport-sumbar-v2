import { createPublicServerClient } from "@/lib/supabase/server";
import {
  CmsService,
  DEFAULT_SITE_SETTINGS,
} from "@esport-sumbar/domain";
import type {
  SiteSettings,
  ContentBlock,
  Banner,
  BannerPlacement,
  NavItem,
  NavLocation,
  LegalPage,
  FaqItem,
} from "@esport-sumbar/contracts";

/**
 * Mengambil pengaturan global situs ESPORT SUMBAR V3
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const supabase = await createPublicServerClient();
    return await CmsService.getSiteSettings(supabase);
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}

/**
 * Mengambil blok konten halaman tertentu
 */
export async function getContentBlocks(page: string): Promise<ContentBlock[]> {
  try {
    const supabase = await createPublicServerClient();
    return await CmsService.getContentBlocks(supabase, page, true);
  } catch {
    return [];
  }
}

/**
 * Mengambil daftar banner aktif berdasarkan penempatan
 */
export async function getActiveBanners(placement: BannerPlacement): Promise<Banner[]> {
  try {
    const supabase = await createPublicServerClient();
    return await CmsService.getBanners(supabase, {
      placement,
      includeDrafts: false,
    });
  } catch {
    return [];
  }
}

/**
 * Mengambil item navigasi situs (header/footer)
 */
export async function getNavItems(location?: NavLocation): Promise<NavItem[]> {
  try {
    const supabase = await createPublicServerClient();
    const items = await CmsService.getNavItems(supabase, location, true);
    if (items.length > 0) return items;
    return getFallbackNavItems(location);
  } catch {
    return getFallbackNavItems(location);
  }
}

/**
 * Mengambil halaman statis atau kebijakan legal berdasarkan slug
 */
export async function getLegalPage(slug: string): Promise<LegalPage | null> {
  try {
    const supabase = await createPublicServerClient();
    return await CmsService.getLegalPage(supabase, slug);
  } catch {
    return null;
  }
}

/**
 * Mengambil daftar pertanyaan umum (FAQ)
 */
export async function getFaqItems(category?: string): Promise<FaqItem[]> {
  try {
    const supabase = await createPublicServerClient();
    const items = await CmsService.getFaqItems(supabase, category);
    if (items.length > 0) return items;
    return getFallbackFaqItems();
  } catch {
    return getFallbackFaqItems();
  }
}

// Fallback jika database belum ada record
function getFallbackNavItems(location?: NavLocation): NavItem[] {
  if (location === "header") {
    return [
      { id: "nav-1", location: "header", label: "Beranda", href: "/", order_index: 0, is_visible: true, is_external: false, target_role: "all" },
      { id: "nav-2", location: "header", label: "Direktori", href: "/explore", order_index: 1, is_visible: true, is_external: false, target_role: "all" },
      { id: "nav-3", location: "header", label: "Ekosistem", href: "/ecosystem", order_index: 2, is_visible: true, is_external: false, target_role: "all" },
      { id: "nav-4", location: "header", label: "Berita", href: "/news", order_index: 3, is_visible: true, is_external: false, target_role: "all" },
      { id: "nav-5", location: "header", label: "Standar Verifikasi", href: "/verification-standard", order_index: 4, is_visible: true, is_external: false, target_role: "all" },
    ];
  }
  return [
    { id: "nav-f1", location: "footer_col1", label: "Tentang Kami", href: "/about", order_index: 0, is_visible: true, is_external: false, target_role: "all" },
    { id: "nav-f2", location: "footer_col1", label: "Cara Kerja", href: "/how-it-works", order_index: 1, is_visible: true, is_external: false, target_role: "all" },
    { id: "nav-f3", location: "footer_col1", label: "Standar Verifikasi", href: "/verification-standard", order_index: 2, is_visible: true, is_external: false, target_role: "all" },
    { id: "nav-f4", location: "footer_legal", label: "Syarat & Ketentuan", href: "/terms", order_index: 0, is_visible: true, is_external: false, target_role: "all" },
    { id: "nav-f5", location: "footer_legal", label: "Kebijakan Privasi", href: "/privacy", order_index: 1, is_visible: true, is_external: false, target_role: "all" },
  ];
}

function getFallbackFaqItems(): FaqItem[] {
  return [
    {
      id: "faq-1",
      category: "pendaftaran",
      question: "Bagaimana cara mendaftarkan diri sebagai atlet esport resmi di Sumatera Barat?",
      answer: "Anda dapat mendaftar dengan membuat akun, memilih bidang Atlet/Pemain, mengisi informasi game utama serta wilayah kabupaten/kota, kemudian mengunggah dokumen pendukung untuk diverifikasi.",
      order_index: 0,
      is_published: true,
    },
    {
      id: "faq-2",
      category: "verifikasi",
      question: "Berapa lama proses verifikasi lencana resmi?",
      answer: "Proses verifikasi oleh tim peninjau Pengprov ESI Sumatera Barat memakan waktu antara 1 hingga 3 hari kerja setelah seluruh dokumen lengkap diunggah.",
      order_index: 1,
      is_published: true,
    },
  ];
}
