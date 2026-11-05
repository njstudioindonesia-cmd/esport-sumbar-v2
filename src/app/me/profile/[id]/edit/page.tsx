import React from "react";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DesktopUserShell } from "@/components/dashboard/DesktopUserShell";
import { EditProfileClientForm } from "./EditProfileClientForm";
import { MobileProfileEditView } from "@/components/mobile/MobileProfileEditView";
import type { Metadata } from "next";

export const instant = false;

export const metadata: Metadata = {
  title: "Edit Profil | ESPORT SUMBAR™",
  description: "Perbarui identitas profil digital PBESI Sumatera Barat Anda.",
};

export default async function EditProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData?.user) {
    redirect(`/login?redirect=/me/profile/${id}/edit`);
  }

  // 1. Ambil data profil publik
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !profile) {
    notFound();
  }

  // Verifikasi kepemilikan
  if (profile.account_id !== authData.user.id) {
    redirect("/dashboard");
  }

  // 2. Ambil data privat dari profile_private jika ada
  const { data: privateData } = await supabase
    .from("profile_private")
    .select("*")
    .eq("profile_id", id)
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
      {/* Mobile Flow (< 1024px): Dedicated Ergonomic Mobile Form */}
      <div className="block lg:hidden min-h-[100dvh] w-full">
        <MobileProfileEditView
          profileId={profile.id}
          entityType={profile.entity_type}
          initialDisplayName={profile.display_name}
          initialIgn={profile.ign || ""}
          initialBio={profile.bio || ""}
          initialRoleName={profile.role_name || ""}
          initialAttributes={initialAttributes}
          verificationStatus={profile.verification_status}
          slug={profile.slug}
        />
      </div>

      {/* Desktop Flow (>= 1024px): Full Shell with Sidebar */}
      <div className="hidden lg:block w-full min-h-screen">
        <DesktopUserShell breadcrumb="Edit Profil">
          <div className="max-w-4xl mx-auto py-4">
            <EditProfileClientForm
              profileId={profile.id}
              entityType={profile.entity_type}
              initialDisplayName={profile.display_name}
              initialIgn={profile.ign || ""}
              initialBio={profile.bio || ""}
              initialRoleName={profile.role_name || ""}
              initialAttributes={initialAttributes}
              verificationStatus={profile.verification_status}
              slug={profile.slug}
            />
          </div>
        </DesktopUserShell>
      </div>
    </main>
  );
}
