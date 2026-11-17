import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfileByAccountId } from "@/lib/services/core/profile";

/**
 * Pengalihan Arsitektur W1: Notifikasi Terpadu di Header
 * Mengalihkan /me/notifications ke profil pemilik; panel notifikasi kini dapat
 * diakses langsung melalui ikon lonceng pada Header utama.
 */
export default async function MyNotificationsPage() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData?.user) {
    redirect("/login?redirect=/me/notifications");
  }

  const profile = await getProfileByAccountId(authData.user.id);

  if (!profile || !profile.slug) {
    redirect("/onboarding");
  }

  redirect(`/${profile.entityType}/${profile.slug}`);
}
