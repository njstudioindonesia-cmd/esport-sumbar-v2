import React from "react";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfileByAccountId } from "@/lib/services/core/profile";
import { DesktopUserShell } from "@/components/dashboard/DesktopUserShell";
import { EditProfileClientForm } from "@/app/me/profile/[id]/edit/EditProfileClientForm";
import { QuietSurface } from "@/components/glass/QuietSurface";
import type { Metadata } from "next";

export const instant = false;

export const metadata: Metadata = {
  title: "Edit Profil | ESPORT SUMBAR™",
  description: "Perbarui identitas profil digital ESPORT SUMBAR Anda.",
};

export default async function EditMyProfilePage() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData?.user) {
    redirect("/login?redirect=/me/edit");
  }

  // Ambil profil akun aktif via layanan core profile
  const profile = await getProfileByAccountId(authData.user.id);

  if (!profile) {
    redirect("/onboarding");
  }

  // Ambil data privat dari profile_private jika ada
  const { data: privateData } = await supabase
    .from("profile_private")
    .select("*")
    .eq("profile_id", profile.id)
    .maybeSingle();

  // Gabungkan atribut untuk form awal
  const initialAttributes = {
    ...((profile.attributes as Record<string, any>) || {}),
    ...(privateData
      ? {
          full_name: privateData.full_name,
          whatsapp: privateData.whatsapp_e164,
          email: privateData.contact_email,
          gender: privateData.gender,
          address_street: privateData.address_street,
          kecamatan: privateData.kecamatan,
          nagari_kelurahan: privateData.nagari_kelurahan,
          game_account_id: privateData.game_account_id,
          game_server: privateData.game_server,
          rate_note: privateData.rate_note,
          manager_name: privateData.manager_name,
          manager_role: privateData.manager_role,
          manager_whatsapp: privateData.manager_whatsapp,
        }
      : {}),
  };

  return (
    <main className="min-h-screen w-full bg-[#07080C]">
      <DesktopUserShell breadcrumb="Edit Profil">
        <div className="max-w-4xl mx-auto py-4">
          <QuietSurface elevation="raised" radius="3xl" className="p-6 sm:p-8">
            <EditProfileClientForm
              profileId={profile.id}
              entityType={profile.entityType}
              initialDisplayName={profile.displayName}
              initialIgn={profile.ign || ""}
              initialBio={profile.bio || ""}
              initialRoleName={profile.roleName || ""}
              initialAttributes={initialAttributes}
              verificationStatus={profile.verificationStatus as any}
              slug={profile.slug}
            />
          </QuietSurface>
        </div>
      </DesktopUserShell>
    </main>
  );
}
