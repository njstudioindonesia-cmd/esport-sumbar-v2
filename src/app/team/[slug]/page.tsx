import React from "react";
import Link from "next/link";
import { PublicProfileView } from "@/components/profile/PublicProfileView";
import { GALLERY_CARDS } from "@/data/mockCards";

export function generateStaticParams() {
  return GALLERY_CARDS.filter((c) => c.type === "team").map((c) => ({
    slug: (c.data.teamName || c.data.displayName).toLowerCase().replace(/\s+/g, "-"),
  }));
}

export default async function TeamProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const card = GALLERY_CARDS.find(
    (c) =>
      c.type === "team" &&
      (c.data.teamName || c.data.displayName).toLowerCase().replace(/\s+/g, "-") === slug
  );

  if (!card) {
    return (
      <div className="min-h-screen bg-[#0B0D12] text-white flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-heading font-bold text-[#D4AF37] mb-2">
          Profil Tim Tidak Ditemukan
        </h1>
        <p className="text-sm text-gray-400 mb-6">
          Klub dengan slug &ldquo;{slug}&rdquo; tidak terdaftar atau belum dipublikasikan.
        </p>
        <Link
          href="/explore?tab=team"
          className="px-5 py-2.5 rounded-xl bg-[#D4AF37] text-black font-heading font-bold text-xs uppercase"
        >
          Kembali ke Direktori Tim
        </Link>
      </div>
    );
  }

  return <PublicProfileView card={card} />;
}
