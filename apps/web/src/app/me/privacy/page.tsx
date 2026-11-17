import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfileByAccountId } from "@/lib/services/core/profile";

/**
 * Pengalihan Arsitektur W1: Profil Terpadu (In-Place Privacy Modal)
 * Mengalihkan /me/privacy langsung ke profil publik dengan modal privasi aktif.
 */
export default async function MyPrivacyPage() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData?.user) {
    redirect("/login?redirect=/me/privacy");
  }

  const profile = await getProfileByAccountId(authData.user.id);

  if (!profile || !profile.slug) {
    redirect("/onboarding");
  }

  redirect(`/${profile.entityType}/${profile.slug}?action=privacy`);
}
