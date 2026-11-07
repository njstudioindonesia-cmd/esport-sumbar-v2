import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfileByAccountId } from "@/lib/services/core/profile";

export const instant = false;

/**
 * Smart redirector untuk navigasi "Profil Saya" (SPEC 2.4).
 * Mengarahkan pengguna langsung ke profil terdaftarnya sendiri via Profile Service,
 * atau ke wizard pendaftaran jika belum memiliki profil.
 */
export default async function MyProfileRedirectPage() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData?.user) {
    redirect("/login?redirect=/me/profile");
  }

  // Cari profil yang dimiliki akun ini via layanan core profile
  const profile = await getProfileByAccountId(authData.user.id);

  if (profile) {
    redirect("/me/edit");
  }

  // Jika belum punya profil sama sekali, arahkan untuk buat kartu pertama via alur onboarding terpadu
  redirect("/onboarding");
}
