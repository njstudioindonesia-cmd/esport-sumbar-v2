import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const instant = false;

/**
 * Smart redirector untuk navigasi "Profil Saya" (SPEC 2.4).
 * Mengarahkan pengguna langsung ke profil publik resminya sendiri,
 * atau ke wizard pendaftaran jika belum memiliki profil.
 */
export default async function MyProfileRedirectPage() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData?.user) {
    redirect("/login?redirect=/me/profile");
  }

  // Cari profil yang dimiliki akun ini
  const { data: profiles } = await supabase
    .from("profiles")
    .select("entity_type, slug")
    .eq("account_id", authData.user.id)
    .order("created_at", { ascending: false })
    .limit(1);

  if (profiles && profiles.length > 0) {
    const profile = profiles[0];
    redirect(`/${profile.entity_type}/${profile.slug}`);
  }

  // Jika belum punya profil sama sekali, arahkan untuk buat kartu pertama
  redirect("/me/profile/new");
}
