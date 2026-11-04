import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { getPublicProfileBySlug } from "@/lib/services/public-profiles";
import { EntityProfileDispatcher } from "@/components/profile/EntityProfileDispatcher";

export const instant = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getPublicProfileBySlug(slug);

  if (!profile) {
    return {
      title: "Pelatih Tidak Ditemukan | ESPORT SUMBAR™",
      description: "Profil pelatih tidak ditemukan di pangkalan data ESPORT SUMBAR™.",
    };
  }

  const title = `${profile.displayName} | Pelatih ESPORT SUMBAR™`;
  const description = profile.bio || `Profil pelatih esport ${profile.displayName} wilayah ${profile.regionName}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: profile.avatarUrl ? [profile.avatarUrl] : [],
      type: "profile",
    },
  };
}

export default async function CoachProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const profile = await getPublicProfileBySlug(slug);

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#07080C] text-white flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-xl font-heading font-black text-[#D4AF37] mb-2">
          Pelatih Tidak Ditemukan
        </h1>
        <p className="text-xs text-white/50 mb-5 max-w-sm">
          Profil pelatih tidak terdaftar atau belum dipublikasikan.
        </p>
        <Link
          href="/coaches"
          className="px-5 py-2.5 rounded-full bg-[#161A24] border border-white/10 text-white font-heading font-bold text-xs uppercase hover:bg-white/10 transition-colors"
        >
          Lihat Direktori Pelatih
        </Link>
      </div>
    );
  }

  return <EntityProfileDispatcher profile={profile} />;
}
