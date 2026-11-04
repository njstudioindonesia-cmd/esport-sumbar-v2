import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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
      title: "Profil Tidak Ditemukan | ESPORT SUMBAR™",
      description: "Profil tidak ditemukan di pangkalan data ESPORT SUMBAR™.",
    };
  }

  const title = `${profile.displayName} (${profile.esportId}) | ESPORT SUMBAR™`;
  const description = profile.bio || `Identitas digital ${profile.displayName} pada ekosistem ESPORT SUMBAR™.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: profile.avatarUrl ? [profile.avatarUrl] : [],
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: profile.avatarUrl ? [profile.avatarUrl] : [],
    },
  };
}

export default async function UniversalProfilePage({
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
          Profil Tidak Ditemukan
        </h1>
        <p className="text-xs text-white/50 mb-5 max-w-sm">
          Profil dengan slug &quot;{slug}&quot; tidak terdaftar atau belum dipublikasikan.
        </p>
        <Link
          href="/explore"
          className="px-5 py-2.5 rounded-full bg-[#161A24] border border-white/10 text-white font-heading font-bold text-xs uppercase hover:bg-white/10 transition-colors"
        >
          Kembali ke Direktori
        </Link>
      </div>
    );
  }

  return <EntityProfileDispatcher profile={profile} />;
}
