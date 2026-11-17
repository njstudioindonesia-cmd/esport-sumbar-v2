import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfileByAccountId } from "@/lib/services/core/profile";

/**
 * Pengalihan Arsitektur W1: Profil Terpadu
 * Mengalihkan /me/card langsung ke kartu pada profil publik pemilik.
 */
export default async function MyCardPage() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData?.user) {
    redirect("/login?redirect=/me/card");
  }

  const profile = await getProfileByAccountId(authData.user.id);

  if (!profile || !profile.slug) {
    redirect("/onboarding");
  }

  redirect(`/${profile.entityType}/${profile.slug}`);
}
