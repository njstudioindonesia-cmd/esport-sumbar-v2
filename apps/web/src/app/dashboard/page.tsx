import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfileByAccountId } from "@/lib/services/core/profile";

/**
 * Pengalihan Arsitektur W1: Profil Terpadu (Tanpa Dashboard Terpisah)
 * Mengalihkan /dashboard langsung ke halaman profil publik pemilik resmi.
 */
export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData?.user) {
    redirect("/login?redirect=/dashboard");
  }

  const profile = await getProfileByAccountId(authData.user.id);

  if (!profile || !profile.slug) {
    redirect("/onboarding");
  }

  redirect(`/${profile.entityType}/${profile.slug}`);
}
