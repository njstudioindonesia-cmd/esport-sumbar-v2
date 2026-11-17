/**
 * Layanan Domain CMS & Manajemen Konten Platform V3
 * Menyediakan fungsi-fungsi transaksi, pengambilan data terproyeksi,
 * rollback versi, dan pelacakan banner bagi apps/admin dan apps/web.
 */

import type {
  SiteSettings,
  UpdateSiteSettingsInput,
  ContentBlock,
  UpdateContentBlockInput,
  Banner,
  CreateBannerInput,
  UpdateBannerInput,
  BannerPlacement,
  BannerTargetDevice,
  NavItem,
  NavLocation,
  LegalPage,
  UpdateLegalPageInput,
  FaqItem,
  FeatureFlag,
} from "@esport-sumbar/contracts";
import { validateBannerContent } from "./validator";
import { sanitizeContent } from "./sanitizer";

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  id: "default",
  site_name: "ESPORT SUMBAR",
  tagline: "Pusat Ekosistem & Identitas Digital Atlet Sumatera Barat",
  contact_email: "kontak@esportsumbar.com",
  contact_phone: "+62 751 123456",
  contact_address: "Padang, Sumatera Barat, Indonesia",
  legal_entity_name: "Pengprov ESI Sumatera Barat",
  copyright_year: 2026,
  maintenance_mode: false,
  registration_open: true,
  announcement_banner: null,
  social_links: [
    { platform: "instagram", url: "https://instagram.com/esi_sumbar", label: "Instagram Resmi" },
    { platform: "youtube", url: "https://youtube.com/@esisumbar", label: "YouTube Channel" },
    { platform: "discord", url: "https://discord.gg/esportsumbar", label: "Komunitas Discord" },
  ],
  metadata_defaults: {
    title: "ESPORT SUMBAR V3 - Identitas & Ekosistem Esport Resmi Sumatera Barat",
    description: "Portal resmi registrasi atlet, tim, pelatih, komunitas, dan ekosistem esport Sumatera Barat.",
    ogImage: "/og-default.png",
  },
};

export class CmsService {
  /**
   * 1. Pengaturan Situs (Site Settings)
   */
  static async getSiteSettings(supabase: any): Promise<SiteSettings> {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", "default")
        .maybeSingle();

      if (error || !data) {
        return DEFAULT_SITE_SETTINGS;
      }
      return data as SiteSettings;
    } catch {
      return DEFAULT_SITE_SETTINGS;
    }
  }

  static async updateSiteSettings(
    supabase: any,
    input: UpdateSiteSettingsInput,
    userId?: string
  ): Promise<{ success: boolean; data?: SiteSettings; error?: string }> {
    try {
      const payload: any = {
        ...input,
        updated_at: new Date().toISOString(),
      };
      if (userId) payload.updated_by = userId;

      const { data, error } = await supabase
        .from("site_settings")
        .upsert({ id: "default", ...payload })
        .select("*")
        .single();

      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true, data: data as SiteSettings };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  /**
   * 2. Blok Konten & Riwayat Revisi (Content Blocks & Revisions)
   */
  static async getContentBlocks(
    supabase: any,
    page: string,
    onlyPublished = true
  ): Promise<ContentBlock[]> {
    try {
      let query = supabase.from("content_blocks").select("*").eq("page", page);
      if (onlyPublished) {
        query = query.eq("is_published", true);
      }
      const { data, error } = await query.order("order_index", { ascending: true });
      if (error || !data) return [];
      return data as ContentBlock[];
    } catch {
      return [];
    }
  }

  static async saveContentBlock(
    supabase: any,
    input: UpdateContentBlockInput,
    userId?: string
  ): Promise<{ success: boolean; data?: ContentBlock; error?: string }> {
    try {
      // 1. Dapatkan versi saat ini jika ada
      const { data: existing } = await supabase
        .from("content_blocks")
        .select("id, current_version, content")
        .eq("page", input.page)
        .eq("slot", input.slot)
        .maybeSingle();

      const newVersion = (existing?.current_version || 0) + 1;

      // 2. Simpan atau perbarui content_blocks
      const blockPayload: any = {
        page: input.page,
        slot: input.slot,
        type: (input as any).type || "text_block",
        title: input.title,
        content: input.content,
        order_index: input.order_index ?? 0,
        is_published: input.is_published ?? true,
        current_version: newVersion,
        updated_at: new Date().toISOString(),
      };
      if (userId) blockPayload.updated_by = userId;

      const { data: savedBlock, error: blockError } = await supabase
        .from("content_blocks")
        .upsert(blockPayload, { onConflict: "page,slot" })
        .select("*")
        .single();

      if (blockError || !savedBlock) {
        return { success: false, error: blockError?.message || "Gagal menyimpan blok konten" };
      }

      // 3. Catat riwayat revisi (content_revisions)
      await supabase.from("content_revisions").insert({
        content_block_id: savedBlock.id,
        version: newVersion,
        content: input.content,
        change_summary: input.change_summary || `Revisi versi ${newVersion}`,
        created_by: userId,
      });

      return { success: true, data: savedBlock as ContentBlock };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  static async rollbackContentBlock(
    supabase: any,
    params: { blockId: string; targetVersion: number; userId?: string }
  ): Promise<{ success: boolean; data?: ContentBlock; error?: string }> {
    try {
      // Cari revisi target
      const { data: revision, error: revError } = await supabase
        .from("content_revisions")
        .select("*")
        .eq("content_block_id", params.blockId)
        .eq("version", params.targetVersion)
        .single();

      if (revError || !revision) {
        return { success: false, error: "Versi revisi target tidak ditemukan" };
      }

      // Ambil blok saat ini
      const { data: currentBlock, error: blockError } = await supabase
        .from("content_blocks")
        .select("current_version")
        .eq("id", params.blockId)
        .single();

      if (blockError || !currentBlock) {
        return { success: false, error: "Blok konten tidak ditemukan" };
      }

      const nextVersion = currentBlock.current_version + 1;

      // Update blok dengan konten revisi
      const { data: updatedBlock, error: updateError } = await supabase
        .from("content_blocks")
        .update({
          content: revision.content,
          current_version: nextVersion,
          updated_at: new Date().toISOString(),
          updated_by: params.userId,
        })
        .eq("id", params.blockId)
        .select("*")
        .single();

      if (updateError) {
        return { success: false, error: updateError.message };
      }

      // Catat sebagai revisi baru bertanda rollback
      await supabase.from("content_revisions").insert({
        content_block_id: params.blockId,
        version: nextVersion,
        content: revision.content,
        change_summary: `Rollback dari versi ${params.targetVersion}`,
        created_by: params.userId,
      });

      return { success: true, data: updatedBlock as ContentBlock };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  /**
   * 3. Banner Promosi & Sponsor (Banners & Analytics)
   */
  static async getBanners(
    supabase: any,
    options: {
      placement?: BannerPlacement;
      targetDevice?: BannerTargetDevice;
      includeDrafts?: boolean;
    } = {}
  ): Promise<Banner[]> {
    try {
      let query = supabase.from("banners").select("*");

      if (options.placement) {
        query = query.eq("placement", options.placement);
      }

      if (!options.includeDrafts) {
        query = query.eq("status", "published");
      }

      if (options.targetDevice && options.targetDevice !== "all") {
        query = query.in("target_device", ["all", options.targetDevice]);
      }

      const { data, error } = await query
        .order("priority", { ascending: false })
        .order("created_at", { ascending: false });

      if (error || !data) return [];
      return data as Banner[];
    } catch {
      return [];
    }
  }

  static async saveBanner(
    supabase: any,
    input: CreateBannerInput & { id?: string },
    userId?: string
  ): Promise<{ success: boolean; data?: Banner; error?: string; warnings?: string[] }> {
    try {
      // 1. Validasi Kebijakan Iklan & Istilah Terlarang
      const validation = validateBannerContent({
        title: input.title,
        altText: input.alt_text,
        targetUrl: input.target_url,
        isAd: input.is_ad,
        sponsorName: input.sponsor_name,
      });

      if (!validation.isValid) {
        return {
          success: false,
          error: validation.errors.join("; "),
          warnings: validation.warnings,
        };
      }

      const payload: any = {
        ...input,
        updated_at: new Date().toISOString(),
      };
      if (userId) {
        if (!input.id) payload.created_by = userId;
        payload.updated_by = userId;
      }

      let res;
      if (input.id) {
        res = await supabase
          .from("banners")
          .update(payload)
          .eq("id", input.id)
          .select("*")
          .single();
      } else {
        res = await supabase.from("banners").insert(payload).select("*").single();
      }

      if (res.error) {
        return { success: false, error: res.error.message };
      }

      return {
        success: true,
        data: res.data as Banner,
        warnings: validation.warnings,
      };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  static async recordBannerEvent(
    supabase: any,
    params: {
      bannerId: string;
      eventType: "impression" | "click";
      sessionHash: string;
    }
  ): Promise<{ success: boolean }> {
    try {
      const today = new Date().toISOString().split("T")[0];

      // Ambil row statistik hari ini
      const { data: existing } = await supabase
        .from("banner_stats_daily")
        .select("id, impressions, clicks, unique_impressions")
        .eq("banner_id", params.bannerId)
        .eq("date", today)
        .maybeSingle();

      if (existing) {
        const updatePayload: any = {};
        if (params.eventType === "impression") {
          updatePayload.impressions = existing.impressions + 1;
        } else if (params.eventType === "click") {
          updatePayload.clicks = existing.clicks + 1;
        }

        await supabase
          .from("banner_stats_daily")
          .update(updatePayload)
          .eq("id", existing.id);
      } else {
        await supabase.from("banner_stats_daily").insert({
          banner_id: params.bannerId,
          date: today,
          impressions: params.eventType === "impression" ? 1 : 0,
          clicks: params.eventType === "click" ? 1 : 0,
          unique_impressions: 1,
        });
      }

      return { success: true };
    } catch {
      return { success: false };
    }
  }

  /**
   * 4. Navigasi Header & Footer (Nav Items)
   */
  static async getNavItems(
    supabase: any,
    location?: NavLocation,
    onlyVisible = true
  ): Promise<NavItem[]> {
    try {
      let query = supabase.from("nav_items").select("*");
      if (location) query = query.eq("location", location);
      if (onlyVisible) query = query.eq("is_visible", true);

      const { data, error } = await query.order("order_index", { ascending: true });
      if (error || !data) return [];
      return data as NavItem[];
    } catch {
      return [];
    }
  }

  /**
   * 5. Halaman Statis & Kebijakan Hukum (Legal Pages)
   */
  static async getLegalPage(supabase: any, slug: string): Promise<LegalPage | null> {
    try {
      const { data, error } = await supabase
        .from("legal_pages")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error || !data) return null;
      return data as LegalPage;
    } catch {
      return null;
    }
  }

  static async saveLegalPage(
    supabase: any,
    input: UpdateLegalPageInput & { slug: string; title: string; content_markdown: string },
    userId?: string
  ): Promise<{ success: boolean; data?: LegalPage; error?: string }> {
    try {
      const sanitized = sanitizeContent(input.content_markdown);
      const payload: any = {
        ...input,
        content_markdown: sanitized,
        updated_at: new Date().toISOString(),
      };
      if (userId) payload.updated_by = userId;

      const { data, error } = await supabase
        .from("legal_pages")
        .upsert(payload, { onConflict: "slug" })
        .select("*")
        .single();

      if (error) return { success: false, error: error.message };
      return { success: true, data: data as LegalPage };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  /**
   * 6. Pertanyaan Umum (FAQ Items)
   */
  static async getFaqItems(supabase: any, category?: string): Promise<FaqItem[]> {
    try {
      let query = supabase.from("faq_items").select("*").eq("is_published", true);
      if (category && category !== "all") {
        query = query.eq("category", category);
      }
      const { data, error } = await query.order("order_index", { ascending: true });
      if (error || !data) return [];
      return data as FaqItem[];
    } catch {
      return [];
    }
  }

  /**
   * 7. Bendera Fitur (Feature Flags)
   */
  static async getFeatureFlags(supabase: any): Promise<FeatureFlag[]> {
    try {
      const { data, error } = await supabase.from("feature_flags").select("*");
      if (error || !data) return [];
      return data as FeatureFlag[];
    } catch {
      return [];
    }
  }

  static async updateFeatureFlag(
    supabase: any,
    id: string,
    params: { is_enabled?: boolean; percentage?: number; owner_only?: boolean },
    userId?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const payload: any = {
        ...params,
        updated_at: new Date().toISOString(),
      };
      if (userId) payload.updated_by = userId;

      const { error } = await supabase.from("feature_flags").update(payload).eq("id", id);
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }
}
