"use server";

import { createAdminClient } from "@/lib/supabase/server";
import {
  CmsService,
  triggerTagRevalidation,
  DEFAULT_SITE_SETTINGS,
  recordAuditLog,
} from "@esport-sumbar/domain";
import type {
  Banner,
  CreateBannerInput,
  ContentBlock,
  UpdateContentBlockInput,
  SiteSettings,
  UpdateSiteSettingsInput,
  NavItem,
  LegalPage,
  UpdateLegalPageInput,
  FaqItem,
  CreateFaqItemInput,
} from "@esport-sumbar/contracts";

/**
 * 1. BANNER PROMOSI & SPONSOR
 */
export async function getAdminBannersAction(): Promise<{
  success: boolean;
  banners: (Banner & { stats?: { impressions: number; clicks: number; ctr: number } })[];
  error?: string;
}> {
  try {
    const supabase = createAdminClient() as any;
    const { data: banners, error } = await supabase
      .from("banners")
      .select("*, banner_stats_daily(impressions, clicks)")
      .order("priority", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      return { success: false, banners: [], error: error.message };
    }

    const enhanced = (banners || []).map((b: any) => {
      const statsRows = b.banner_stats_daily || [];
      const totalImp = statsRows.reduce((acc: number, r: any) => acc + (r.impressions || 0), 0);
      const totalClk = statsRows.reduce((acc: number, r: any) => acc + (r.clicks || 0), 0);
      const ctr = totalImp > 0 ? (totalClk / totalImp) * 100 : 0;

      return {
        ...b,
        stats: {
          impressions: totalImp,
          clicks: totalClk,
          ctr: Number(ctr.toFixed(2)),
        },
      };
    });

    return { success: true, banners: enhanced };
  } catch (err: any) {
    return { success: false, banners: [], error: err.message };
  }
}

export async function saveAdminBannerAction(
  data: CreateBannerInput & { id?: string }
): Promise<{ success: boolean; data?: Banner; error?: string; warnings?: string[] }> {
  try {
    const supabase = createAdminClient() as any;
    const result = await CmsService.saveBanner(supabase, data);

    if (result.success) {
      // Revalidasi cache web tag 'cms:banners'
      await triggerTagRevalidation({ tags: ["cms:banners"] });

      // Catat jejak audit (append-only)
      await recordAuditLog(supabase, {
        actorId: "admin-system",
        actorRole: "admin",
        action: data.id ? "banner_updated" : "banner_created",
        entityType: "banner",
        entityId: data.id || result.data?.id || "unknown",
        details: { title: data.title, placement: data.placement, is_ad: data.is_ad },
      });
    }

    return result;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteAdminBannerAction(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createAdminClient() as any;
    const { error } = await supabase.from("banners").delete().eq("id", id);
    if (error) return { success: false, error: error.message };

    await triggerTagRevalidation({ tags: ["cms:banners"] });

    await recordAuditLog(supabase, {
      actorId: "admin-system",
      actorRole: "admin",
      action: "banner_deleted",
      entityType: "banner",
      entityId: id,
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * 2. BLOK KONTEN BERANDA & REVISI
 */
export async function getAdminContentBlocksAction(page = "home"): Promise<{
  success: boolean;
  blocks: ContentBlock[];
  revisions?: Record<string, any[]>;
  error?: string;
}> {
  try {
    const supabase = createAdminClient() as any;
    const { data: blocks, error } = await supabase
      .from("content_blocks")
      .select("*")
      .eq("page", page)
      .order("order_index", { ascending: true });

    if (error) return { success: false, blocks: [], error: error.message };

    // Ambil revisi untuk tiap blok
    const blockIds = (blocks || []).map((b: any) => b.id);
    let revisionsMap: Record<string, any[]> = {};

    if (blockIds.length > 0) {
      const { data: revs } = await supabase
        .from("content_revisions")
        .select("*")
        .in("content_block_id", blockIds)
        .order("version", { ascending: false });

      if (revs) {
        revs.forEach((r: any) => {
          if (!revisionsMap[r.content_block_id]) {
            revisionsMap[r.content_block_id] = [];
          }
          revisionsMap[r.content_block_id].push(r);
        });
      }
    }

    return { success: true, blocks: (blocks || []) as ContentBlock[], revisions: revisionsMap };
  } catch (err: any) {
    return { success: false, blocks: [], error: err.message };
  }
}

export async function saveAdminContentBlockAction(
  input: UpdateContentBlockInput
): Promise<{ success: boolean; data?: ContentBlock; error?: string }> {
  try {
    const supabase = createAdminClient() as any;
    const result = await CmsService.saveContentBlock(supabase, input);

    if (result.success) {
      await triggerTagRevalidation({ tags: ["cms:content_blocks"] });
    }

    return result;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function rollbackAdminContentBlockAction(
  blockId: string,
  targetVersion: number
): Promise<{ success: boolean; data?: ContentBlock; error?: string }> {
  try {
    const supabase = createAdminClient() as any;
    const result = await CmsService.rollbackContentBlock(supabase, { blockId, targetVersion });

    if (result.success) {
      await triggerTagRevalidation({ tags: ["cms:content_blocks"] });
    }

    return result;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * 3. PENGATURAN SITUS GLOBAL
 */
export async function getAdminSiteSettingsAction(): Promise<{
  success: boolean;
  settings: SiteSettings;
  error?: string;
}> {
  try {
    const supabase = createAdminClient() as any;
    const settings = await CmsService.getSiteSettings(supabase);
    return { success: true, settings };
  } catch (err: any) {
    return { success: false, settings: DEFAULT_SITE_SETTINGS, error: err.message };
  }
}

export async function updateAdminSiteSettingsAction(
  input: UpdateSiteSettingsInput
): Promise<{ success: boolean; data?: SiteSettings; error?: string }> {
  try {
    const supabase = createAdminClient() as any;
    const result = await CmsService.updateSiteSettings(supabase, input);

    if (result.success) {
      await triggerTagRevalidation({ tags: ["cms:site_settings"] });
    }

    return result;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * 4. NAVIGASI HEADER & FOOTER
 */
export async function getAdminNavItemsAction(): Promise<{
  success: boolean;
  items: NavItem[];
  error?: string;
}> {
  try {
    const supabase = createAdminClient() as any;
    const { data, error } = await supabase
      .from("nav_items")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) return { success: false, items: [], error: error.message };
    return { success: true, items: (data || []) as NavItem[] };
  } catch (err: any) {
    return { success: false, items: [], error: err.message };
  }
}

export async function saveAdminNavItemAction(
  item: Partial<NavItem> & { label: string; href: string; location: string }
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createAdminClient() as any;
    let res;
    if (item.id) {
      res = await supabase.from("nav_items").update(item).eq("id", item.id);
    } else {
      res = await supabase.from("nav_items").insert(item);
    }

    if (res.error) return { success: false, error: res.error.message };
    await triggerTagRevalidation({ tags: ["cms:nav_items"] });
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteAdminNavItemAction(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createAdminClient() as any;
    const { error } = await supabase.from("nav_items").delete().eq("id", id);
    if (error) return { success: false, error: error.message };

    await triggerTagRevalidation({ tags: ["cms:nav_items"] });
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * 5. HALAMAN STATIS & LEGAL
 */
export async function getAdminLegalPagesAction(): Promise<{
  success: boolean;
  pages: LegalPage[];
  error?: string;
}> {
  try {
    const supabase = createAdminClient() as any;
    const { data, error } = await supabase
      .from("legal_pages")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) return { success: false, pages: [], error: error.message };
    return { success: true, pages: (data || []) as LegalPage[] };
  } catch (err: any) {
    return { success: false, pages: [], error: err.message };
  }
}

export async function saveAdminLegalPageAction(
  input: UpdateLegalPageInput & { slug: string; title: string; content_markdown: string }
): Promise<{ success: boolean; data?: LegalPage; error?: string }> {
  try {
    const supabase = createAdminClient() as any;
    const result = await CmsService.saveLegalPage(supabase, input);

    if (result.success) {
      await triggerTagRevalidation({ tags: ["cms:legal_pages"] });
    }

    return result;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * 6. PERTANYAAN UMUM (FAQ)
 */
export async function getAdminFaqItemsAction(): Promise<{
  success: boolean;
  items: FaqItem[];
  error?: string;
}> {
  try {
    const supabase = createAdminClient() as any;
    const { data, error } = await supabase
      .from("faq_items")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) return { success: false, items: [], error: error.message };
    return { success: true, items: (data || []) as FaqItem[] };
  } catch (err: any) {
    return { success: false, items: [], error: err.message };
  }
}

export async function saveAdminFaqItemAction(
  input: CreateFaqItemInput & { id?: string }
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createAdminClient() as any;
    let res;
    if (input.id) {
      res = await supabase.from("faq_items").update(input).eq("id", input.id);
    } else {
      res = await supabase.from("faq_items").insert(input);
    }

    if (res.error) return { success: false, error: res.error.message };
    await triggerTagRevalidation({ tags: ["cms:faq_items"] });
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteAdminFaqItemAction(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createAdminClient() as any;
    const { error } = await supabase.from("faq_items").delete().eq("id", id);
    if (error) return { success: false, error: error.message };

    await triggerTagRevalidation({ tags: ["cms:faq_items"] });
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * 7. PEMICU MANUAL REVALIDASI CACHE
 */
export async function triggerManualRevalidationAction(tags: string[]): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    return await triggerTagRevalidation({ tags });
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}
