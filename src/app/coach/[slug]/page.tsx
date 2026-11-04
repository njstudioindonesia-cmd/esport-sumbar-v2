import React from "react";
import Link from "next/link";
import { MobilePublicProfile } from "@/components/mobile/MobilePublicProfile";
import { GALLERY_CARDS } from "@/data/mockCards";

export function generateStaticParams() {
  return GALLERY_CARDS.filter((c) => c.type === "coach").map((c) => ({
    slug: (c.data.ign || c.data.displayName).toLowerCase().replace(/\s+/g, "_"),
  }));
}

export default async function CoachProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const card = GALLERY_CARDS.find(
    (c) =>
      c.type === "coach" &&
      (c.data.ign || c.data.displayName).toLowerCase().replace(/\s+/g, "_") === slug
  );

  if (!card) {
    return (
      <div className="min-h-screen bg-[#07080C] text-white flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-xl font-heading font-bold text-[#D4AF37] mb-2">
          Profil Pelatih Tidak Ditemukan
        </h1>
        <Link
          href="/explore"
          className="px-5 py-2.5 rounded-full bg-[#161A24] border border-white/10 text-white font-heading font-bold text-xs uppercase"
        >
          Kembali ke Jelajah
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-[100dvh] w-full bg-[#07080C] flex items-center justify-center p-0 md:p-6 overflow-x-hidden">
      <div className="relative w-full max-w-[420px] min-h-[100dvh] md:min-h-[844px] bg-[#07080C] md:rounded-[36px] md:border md:border-white/10 md:shadow-[0_24px_80px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col">
        <MobilePublicProfile card={card} />
      </div>
    </main>
  );
}
