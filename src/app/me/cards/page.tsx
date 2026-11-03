"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Layers,
  PlusCircle,
  Share2,
  Edit,
  Award,
  Lock,
  Info,
  CheckCircle2,
  X,
  Sparkles,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EsportCard } from "@/components/card/EsportCard";
import { ShareCardModal } from "@/components/card/ShareCardModal";
import { GALLERY_CARDS, MockCardVariant } from "@/data/mockCards";
import { CardRarity } from "@/types/card";

export default function MyCardsPage() {
  // Profiles owned by this user account (e.g. Player Profile + Coach Profile)
  const myProfiles = [
    GALLERY_CARDS.find((c) => c.id === "pl-contender") || GALLERY_CARDS[1],
    GALLERY_CARDS.find((c) => c.id === "co-contender") || GALLERY_CARDS[5],
  ];

  const [shareModalCard, setShareModalCard] = useState<MockCardVariant | null>(null);
  const [whyTierModalCard, setWhyTierModalCard] = useState<MockCardVariant | null>(null);

  return (
    <div className="min-h-screen bg-[#0B0D12] text-[#F3F4F6] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#D4AF37] uppercase">
              <span>Koleksi Identitas Digital</span>
              <span>•</span>
              <span>Satu Akun Banyak Profil</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-black uppercase text-white tracking-tight mt-1">
              Kartu ESPORT ID Saya
            </h1>
            <p className="text-xs sm:text-sm text-[#9AA3B2] max-w-xl">
              Kelola seluruh kartu identitas digital atlet, pelatih, atau tim yang terhubung dengan akun Anda.
            </p>
          </div>

          <Link
            href="/me/profile/new"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E5C358] text-black text-xs font-heading font-extrabold uppercase tracking-wider shadow-lg hover:brightness-110 transition-all shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tambah Profil Baru</span>
          </Link>
        </div>

        {/* CARDS LIST CONTAINER */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {myProfiles.map((profile) => (
            <div
              key={profile.id}
              className="p-6 rounded-2xl bg-[#12151C] border border-[#262B38] flex flex-col md:flex-row items-center gap-6 shadow-xl relative overflow-hidden"
            >
              {/* Left / Card Visualization */}
              <div className="shrink-0">
                <EsportCard
                  type={profile.type}
                  rarity={profile.rarity}
                  verification={profile.verification}
                  data={profile.data}
                  size="sm"
                  interactive={true}
                />
              </div>

              {/* Right / Controls & Tier Explanation */}
              <div className="flex-1 flex flex-col justify-between h-full gap-4 w-full">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#1A1E28] text-[#D4AF37] font-bold">
                      {profile.data.esportId}
                    </span>
                    <span className="text-[10px] uppercase font-mono text-gray-400">
                      {profile.type.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-lg text-white uppercase truncate">
                    {profile.type === "team" ? profile.data.teamName : profile.data.ign}
                  </h3>
                  <p className="text-xs text-[#9AA3B2]">
                    {profile.data.displayName} • {profile.data.game}
                  </p>

                  {/* Why this tier button */}
                  <button
                    type="button"
                    onClick={() => setWhyTierModalCard(profile)}
                    className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-heading font-bold uppercase text-[#D4AF37] hover:underline"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>Kenapa Tier {profile.rarity.toUpperCase()}?</span>
                  </button>
                </div>

                {/* Action Buttons Grid */}
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#262B38]">
                  <button
                    type="button"
                    onClick={() => setShareModalCard(profile)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#1A1E28] hover:bg-[#262B38] text-xs font-heading font-bold uppercase text-white transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Bagikan</span>
                  </button>

                  <Link
                    href={`/me/verification`}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#1A1E28] hover:bg-[#262B38] text-xs font-heading font-bold uppercase text-[#22C55E] transition-colors"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>Verifikasi</span>
                  </Link>

                  <Link
                    href={`/me/privacy`}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#1A1E28] hover:bg-[#262B38] text-xs font-heading font-bold uppercase text-gray-300 transition-colors"
                  >
                    <Lock className="w-3.5 h-3.5 text-[#C084FC]" />
                    <span>Privasi</span>
                  </Link>

                  <Link
                    href={`/${profile.type}/${(profile.data.ign || profile.data.teamName || profile.data.displayName).toLowerCase().replace(/\s+/g, "-")}`}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#1A1E28] hover:bg-[#262B38] text-xs font-heading font-bold uppercase text-[#3B82F6] transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Publik</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* MODAL: WHY THIS TIER BREAKDOWN */}
      {whyTierModalCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-[#12151C] border border-[#262B38] p-6 flex flex-col gap-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#262B38] pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <h3 className="font-heading font-bold text-sm uppercase text-white">
                  Evaluasi Kriteria Rarity Kartu
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setWhyTierModalCard(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between bg-[#1A1E28] p-3 rounded-xl border border-[#262B38]">
              <div>
                <span className="text-[10px] uppercase font-mono text-[#9AA3B2] block">
                  Status Rarity Saat Ini:
                </span>
                <span className="font-heading font-bold text-base uppercase text-[#D4AF37]">
                  Tier {whyTierModalCard.rarity.toUpperCase()}
                </span>
              </div>
              <span className="text-xs font-mono text-gray-300">
                Kelengkapan 85%
              </span>
            </div>

            {/* Checklist of tiers */}
            <div className="flex flex-col gap-2.5 text-xs">
              {/* Tier 1 */}
              <div className="p-3 rounded-xl bg-[#161922] border border-[#22C55E]/40 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Tier 1 - Rookie [Terpenuhi]:</strong>
                  <p className="text-[11px] text-[#9AA3B2]">Profil telah didaftarkan dengan field wajib.</p>
                </div>
              </div>

              {/* Tier 2 */}
              <div className="p-3 rounded-xl bg-[#161922] border border-[#22C55E]/40 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Tier 2 - Contender [Terpenuhi]:</strong>
                  <p className="text-[11px] text-[#9AA3B2]">Kelengkapan profil ≥ 80% dan minimal 1 relasi aktif terkonfirmasi.</p>
                </div>
              </div>

              {/* Tier 3 */}
              <div className="p-3 rounded-xl bg-[#161922] border border-[#262B38] flex items-start gap-2.5 opacity-80">
                <span className="w-4 h-4 rounded-full border border-gray-600 flex items-center justify-center text-[10px] text-gray-500 shrink-0 mt-0.5">
                  -
                </span>
                <div>
                  <strong className="text-gray-300">Tier 3 - Elite [Belum]:</strong>
                  <p className="text-[11px] text-[#9AA3B2]">Memerlukan minimal 1 bukti prestasi kejuaraan yang tervalidasi admin ESI.</p>
                </div>
              </div>

              {/* Tier 4 */}
              <div className="p-3 rounded-xl bg-[#161922] border border-[#262B38] flex items-start gap-2.5 opacity-60">
                <span className="w-4 h-4 rounded-full border border-gray-600 flex items-center justify-center text-[10px] text-gray-500 shrink-0 mt-0.5">
                  -
                </span>
                <div>
                  <strong className="text-gray-400">Tier 4 - Legend [Belum]:</strong>
                  <p className="text-[11px] text-[#9AA3B2]">Memerlukan medali tingkat kejurprov/PON/kejurnas tervalidasi.</p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setWhyTierModalCard(null)}
              className="mt-2 w-full py-2.5 rounded-xl bg-[#1A1E28] hover:bg-[#262B38] text-xs font-heading font-bold uppercase text-white"
            >
              Tutup Penjelasan
            </button>
          </div>
        </div>
      )}

      {/* SHARE MODAL */}
      {shareModalCard && (
        <ShareCardModal
          isOpen={true}
          onClose={() => setShareModalCard(null)}
          cardData={shareModalCard}
        />
      )}

      <Footer />
    </div>
  );
}
