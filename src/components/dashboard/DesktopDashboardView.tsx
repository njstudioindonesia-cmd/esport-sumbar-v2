"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Award,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Upload,
  Users,
  Trophy,
  ExternalLink,
  Share2,
  QrCode,
} from "lucide-react";
import { EsportCard } from "@/components/card/EsportCard";
import { GALLERY_CARDS } from "@/data/mockCards";
import { ShareCardModal } from "@/components/card/ShareCardModal";
import { mapVerificationToCard } from "@/types/card";

export function DesktopDashboardView() {
  const [showShareModal, setShowShareModal] = useState(false);
  const [liveProfiles, setLiveProfiles] = useState<any[] | null>(null);
  const [invitations, setInvitations] = useState([
    {
      id: "inv-1",
      team: "Minang Pride Esports",
      game: "Mobile Legends: Bang Bang",
      role: "Roamer",
      time: "2 jam lalu",
    },
    {
      id: "inv-2",
      team: "Singkarak Legion",
      game: "PUBG Mobile",
      role: "Rusher",
      time: "1 hari lalu",
    },
  ]);

  React.useEffect(() => {
    async function loadMyProfile() {
      try {
        const res = await fetch("/api/me/profiles");
        if (res.ok) {
          const json = await res.json();
          if (json.profiles) {
            setLiveProfiles(json.profiles);
          }
        }
      } catch {
        // Fallback to mock
      }
    }
    loadMyProfile();
  }, []);

  const handleAction = (id: string, action: "accept" | "decline") => {
    setInvitations((prev) => prev.filter((i) => i.id !== id));
  };

  const activeProfile = liveProfiles && liveProfiles.length > 0 ? liveProfiles[0] : null;

  const userCard = activeProfile
    ? {
        id: activeProfile.id,
        type: activeProfile.entityType || "player",
        rarity: (activeProfile.rarityTier as any) || "rookie",
        verification: mapVerificationToCard(activeProfile.verificationStatus),
        slug: activeProfile.slug,
        data: {
          displayName: activeProfile.displayName,
          ign: activeProfile.ign || undefined,
          role: activeProfile.roleName || "Athlete",
          game: activeProfile.mainGameName || "Esport",
          region: { name: activeProfile.regionName, code: activeProfile.regionCode },
          esportId: activeProfile.esportId,
          avatarUrl: activeProfile.avatarUrl || undefined,
        },
      }
    : null;

  const completeness = activeProfile ? (activeProfile.completenessScore || 60) : 0;
  const isVerified = activeProfile?.verificationStatus === "verified";

  return (
    <div className="w-full flex flex-col gap-8">
      {/* ========================================================= */}
      {/* BENTO GRID UTAMA DASHBOARD                                */}
      {/* ========================================================= */}
      <div className="grid grid-cols-12 gap-6 items-start">
        {/* ======================================================= */}
        {/* 1. KARTU UTAMA (BESAR & INTERAKTIF) - 5 COLS           */}
        {/* ======================================================= */}
        <div className="col-span-12 lg:col-span-5 flex flex-col items-center">
          <div className="w-full p-6 rounded-3xl bg-[#0F1118]/80 border border-white/[0.08] shadow-2xl backdrop-blur-xl flex flex-col items-center justify-between">
            <div className="w-full flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-widest text-white/50">
                KARTU UTAMA
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[10px] font-mono text-[#D4AF37] font-bold uppercase">
                {userCard ? `TIER • ${userCard.rarity}` : "BELUM ADA PROFIL"}
              </span>
            </div>

            {/* Interactive 3D Card with Tilt */}
            {userCard ? (
              <>
                <div className="py-2">
                  <EsportCard
                    type={userCard.type}
                    rarity={userCard.rarity}
                    verification={userCard.verification}
                    data={userCard.data}
                    size="md"
                    interactive={true}
                  />
                </div>

                {/* Quick Card Action Buttons */}
                <div className="w-full mt-6 pt-4 border-t border-white/[0.08] grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setShowShareModal(true)}
                    className="h-10 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-[#D4AF37]/40 text-xs font-heading font-bold text-white flex items-center justify-center gap-2 transition-all"
                  >
                    <Share2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Bagikan</span>
                  </button>

                  <Link
                    href={`/${userCard.type}/${userCard.slug}`}
                    target="_blank"
                    className="h-10 rounded-xl bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-xs font-heading font-bold text-[#D4AF37] flex items-center justify-center gap-2 transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Lihat Publik</span>
                  </Link>
                </div>
              </>
            ) : (
              <div className="py-12 flex flex-col items-center text-center gap-3">
                <div className="w-14 h-14 rounded-full bg-[#FF1752]/10 border border-[#FF1752]/30 flex items-center justify-center text-[#FF1752]">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-heading font-black text-white text-base">Belum Ada Kartu Paspor</h4>
                  <p className="text-xs text-white/50 max-w-xs mt-1">
                    Buat paspor digital Anda untuk mendapatkan kartu resmi berstandar PBESI Sumatera Barat.
                  </p>
                </div>
                <Link
                  href="/me/profile/new"
                  className="btn-brand-primary text-xs py-2 px-5 mt-2"
                >
                  <span>Buat Kartu Baru</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* ======================================================= */}
        {/* 2. BENTO KANAN: LANGKAH BERIKUT, PROGRES, STATUS, TIM  */}
        {/* ======================================================= */}
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">
          {/* BARIS ATAS: LANGKAH BERIKUT (SATU KARTU AKSI KONTEKSTUAL) */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-[#D4AF37]/10 via-[#161A24] to-[#0F1118] border border-[#D4AF37]/30 shadow-xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#D4AF37] text-[#07080C] flex items-center justify-center font-bold shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
                  LANGKAH BERIKUT
                </span>
                <h3 className="text-base font-heading font-black text-white">
                  Ajukan Lisensi Resmi PBESI
                </h3>
                <p className="text-xs text-white/60">
                  Lengkapi 1 piagam prestasi untuk peningkatan Tier Legend.
                </p>
              </div>
            </div>

            <Link
              href="/me/verification"
              className="px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#07080C] font-heading font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 shadow-md"
            >
              <span>Ajukan</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* BARIS TENGAH: CINCIN PROGRES KELENGKAPAN & STATUS VERIFIKASI */}
          <div className="grid grid-cols-2 gap-6">
            {/* Cincin Progres Kelengkapan Profil */}
            <div className="p-6 rounded-3xl bg-[#0F1118]/80 border border-white/[0.08] flex items-center gap-5">
              {/* Radial Progress Ring (85%) */}
              <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="6"
                    fill="none"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    stroke="#D4AF37"
                    strokeWidth="6"
                    strokeDasharray={2 * Math.PI * 34}
                    strokeDashoffset={2 * Math.PI * 34 * (1 - completeness / 100)}
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                <span className="absolute font-mono font-black text-lg text-white">
                  {completeness}%
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-xs font-heading font-bold text-white">
                  Profil Lengkap
                </span>
                <span className="text-[11px] text-white/50 mt-0.5">
                  Foto, IGN, Game, dan Wilayah terisi. Tambahkan sosmed.
                </span>
                <Link
                  href="/me/settings"
                  className="text-[11px] font-mono text-[#D4AF37] hover:underline mt-2 font-semibold"
                >
                  Lengkapi Data &rarr;
                </Link>
              </div>
            </div>

            {/* Status Verifikasi Ringkas (Ikon + 1 Kata) */}
            <div className="p-6 rounded-3xl bg-[#0F1118]/80 border border-white/[0.08] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
                  STATUS RESMI
                </span>
                <span className={`w-2 h-2 rounded-full ${isVerified ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
              </div>

              <div className="my-2 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isVerified ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400" : "bg-amber-500/10 border border-amber-500/30 text-amber-400"}`}>
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-base font-heading font-black text-white">
                    {isVerified ? "Terverifikasi" : activeProfile?.verificationStatus === "submitted" ? "Diajukan" : activeProfile?.verificationStatus === "in_review_regional" ? "Review Cabang" : "Belum Verifikasi"}
                  </div>
                  <div className="text-[10px] font-mono text-white/40">
                    {activeProfile?.esportId || "ESB-SB-2026-0001"}
                  </div>
                </div>
              </div>

              <div className="text-[11px] font-mono text-white/60 pt-2 border-t border-white/[0.06] flex items-center justify-between">
                <span>{activeProfile?.regionName || "Wilayah Sumbar"}</span>
                <Link href="/me/verification" className="text-brand-pink hover:underline">
                  Detail &rarr;
                </Link>
              </div>
            </div>
          </div>

          {/* BARIS BAWAH: PERMINTAAN & UNDANGAN MENUNGGU (MAKS 3 BARIS) */}
          <div className="p-6 rounded-3xl bg-[#0F1118]/80 border border-white/[0.08] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-xs font-heading font-black text-white uppercase tracking-wider">
                  Undangan Masuk Tim
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white/[0.06] text-[10px] font-mono text-white/60">
                  {invitations.length}
                </span>
              </div>
              <Link
                href="/me/memberships"
                className="text-[11px] font-mono text-[#D4AF37] hover:underline"
              >
                Lihat Semua &rarr;
              </Link>
            </div>

            {invitations.length > 0 ? (
              <div className="flex flex-col gap-2.5">
                {invitations.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-[#161A24] border border-white/[0.06] flex items-center justify-between"
                  >
                    <div className="flex flex-col">
                      <span className="text-xs font-heading font-bold text-white">
                        {item.team}
                      </span>
                      <span className="text-[10px] font-mono text-white/50">
                        {item.game} • Role: {item.role} • {item.time}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleAction(item.id, "accept")}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold transition-all"
                      >
                        Terima
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAction(item.id, "decline")}
                        className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-mono font-bold transition-all"
                      >
                        Tolak
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-xs font-mono text-white/30">
                Tidak ada undangan menunggu saat ini.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SHARE MODAL DIALOG */}
      {showShareModal && userCard && (
        <ShareCardModal
          cardData={userCard}
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
}
