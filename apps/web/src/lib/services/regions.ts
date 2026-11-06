import { createPublicServerClient } from "@/lib/supabase/server";

export interface PublicRegion {
  id: string;
  name: string;
  code: string;
  slug: string;
  type: "kota" | "kabupaten";
  logoUrl: string | null;
  esiContactName: string | null;
  esiSecretariat: string | null;
  description: string | null;
  adminMode: "active" | "fallback";
  isPilot: boolean;
}

/**
 * Mengambil daftar seluruh 19 kota & kabupaten di Sumatera Barat
 */
export async function getRegionsList(): Promise<PublicRegion[]> {
  try {
    const supabase = createPublicServerClient();
    const { data, error } = await supabase
      .from("regions")
      .select("*")
      .order("type", { ascending: false }) // Kota dulu baru Kabupaten
      .order("name", { ascending: true });

    if (!error && data && data.length > 0) {
      return data.map((r) => ({
        id: r.id,
        name: r.name,
        code: r.code,
        slug: r.slug,
        type: r.type,
        logoUrl: r.logo_url,
        esiContactName: r.esi_contact_name,
        esiSecretariat: r.esi_secretariat,
        description: r.description,
        adminMode: r.admin_mode,
        isPilot: r.is_pilot,
      }));
    }
  } catch (err) {
    console.warn("Regions query warning:", err);
  }

  return [];
}

/**
 * Mengambil detail wilayah berdasarkan slug
 */
export async function getRegionBySlug(slug: string): Promise<PublicRegion | null> {
  try {
    const supabase = createPublicServerClient();
    const { data, error } = await supabase
      .from("regions")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (!error && data) {
      return {
        id: data.id,
        name: data.name,
        code: data.code,
        slug: data.slug,
        type: data.type,
        logoUrl: data.logo_url,
        esiContactName: data.esi_contact_name,
        esiSecretariat: data.esi_secretariat,
        description: data.description,
        adminMode: data.admin_mode,
        isPilot: data.is_pilot,
      };
    }
  } catch (err) {
    console.warn("Region detail query warning:", err);
  }

  return null;
}
