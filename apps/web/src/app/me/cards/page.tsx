import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfileByAccountId } from "@/lib/services/core/profile";

/**
 * Pengalihan Arsitektur W1: Profil Terpadu
 * Mengalihkan /me/cards langsung ke profil publik pemilik.
 */
export default async function MyCardsPage() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData?.user) {
    redirect("/login?redirect=/me/cards");
  }

  const profile = await getProfileByAccountId(authData.user.id);

  if (!profile || !profile.slug) {
    redirect("/onboarding");
  }

  redirect(`/${profile.entityType}/${profile.slug}`);
}
