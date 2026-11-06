"use client";

import React, { useState, useEffect } from "react";
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
  Edit,
  UserCheck,
  PlusCircle,
  Building,
  GraduationCap,
} from "lucide-react";
import { EsportCard } from "@/components/card/EsportCard";
import { ShareCardModal } from "@/components/card/ShareCardModal";
import { mapVerificationToCard } from "@/types/card";

export function DesktopDashboardView() {
  const [showShareModal, setShowShareModal] = useState(false);
  const [liveProfiles, setLiveProfiles] = useState<any[] | null>(null);
  const [selectedProfileIndex, setSelectedProfileIndex] = useState(0);
  const [userSession, setUserSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadMyProfile() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/me/profiles");
        if (res.ok) {
          const json = await res.json();
          if (json.profiles) {
            setLiveProfiles(json.profiles);
          }
          if (json.user) {
            setUserSession(json.user);
          }
        }
      } catch (err) {
        console.warn("Failed to load profiles:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadMyProfile();
  }, []);

  const activeProfile = liveProfiles && liveProfiles.length > 0 ? liveProfiles[selectedProfileIndex] || liveProfiles[0] : null;
  const entityType = activeProfile?.entityType || "player";

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
          role: activeProfile.roleName || (entityType === "team" ? "Organisasi Tim" : "Athlete"),
          game: activeProfile.mainGameName || "Esport",
          region: { name: activeProfile.regionName, code: activeProfile.regionCode },
          esportId: activeProfile.esportId,
          avatarUrl: activeProfile.avatarUrl || undefined,
        },
      }
    : null;

  const completeness = activeProfile ? (activeProfile.completenessScore || 75) : 0;
  const isVerified = activeProfile?.verificationStatus === "verified";
  const verificationStatus = activeProfile?.verificationStatus || "unverified";

  // Contextual "Langkah Berikut" logic based on Entity Type & Verification
  const getNextStepInfo = () => {
    if (verificationStatus === "unverified") {
      if (entityType === "team") {
        return {
          title: "Ajukan Legalisasi Klub PBESI",
          desc: "Daftarkan tim resmi untuk berpartisipasi dalam Kejurda & Liga Esport Sumatera Barat.",
          actionText: "Ajukan",
          href: "/me/verification",
        };
      }
      if (entityType === "coach") {
        return {
          title: "Ajukan Sertifikasi Pelatih ESI",
          desc: "Lengkapi sertifikat kepelatihan atau lisensi wasit untuk verifikasi lencana resmi.",
          actionText: "Ajukan",
          href: "/me/verification",
        };
      }
      if (entityType === "school" || entityType === "campus") {
        return {
          title: "Pengesahan Ekstrakurikuler PBESI",
          desc: "Lampirkan SK Kepala Sekolah/Dekan untuk pembinaan atlet pelajar resmi daerah.",
          actionText: "Ajukan",
          href: "/me/verification",
        };
      }
      return {
        title: "Ajukan Lisensi Resmi PBESI",
        desc: "Lengkapi 1 piagam prestasi untuk peningkatan Tier dan Lencana Emas Pengprov.",
        actionText: "Ajukan",
        href: "/me/verification",
      };
    }
    if (verificationStatus === "submitted" || verificationStatus === "in_review_regional") {
      return {
        title: `Dalam Telaah Pengcab ${activeProfile?.regionName || "Daerah"}`,
        desc: "Berkas Anda sedang dalam antrean verifikasi pengurus cabang. Estimasi 1-3 hari kerja.",
        actionText: "Pantau Status",
        href: "/me/verification",
      };
    }
    if (verificationStatus === "revision_requested") {
      return {
        title: "Perlu Revisi Dokumen",
        desc: "Pengcab ESI meminta perbaikan berkas. Klik untuk memeriksa catatan verifikator.",
        actionText: "Perbaiki",
        href: "/me/verification",
      };
    }
    if (verificationStatus === "regional_checked") {
      return {
        title: "Menunggu Pengesahan Pengprov",
        desc: "Lolos verifikasi daerah! Berkas kini di meja Pengprov ESI Sumbar untuk lencana emas.",
        actionText: "Lihat",
        href: "/me/verification",
      };
    }
    return {
      title: "Profil Terverifikasi Resmi",
      desc: "Lencana Emas aktif! Identitas Anda diakui secara penuh di ekosistem PBESI Sumbar.",
      actionText: "Lihat Lisensi",
      href: "/me/verification",
    };
  };

  const nextStep = getNextStepInfo();

  return (
    <div className="w-full flex flex-col gap-6">
      {/* ========================================================= */}
      {/* PROFILE SELECTOR STRIP (MULTI-ENTITY SWITCHER)           */}
      {/* ========================================================= */}
      {liveProfiles && liveProfiles.length > 1 && (
        <div className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#0F1118]/80 border border-white/[0.08] backdrop-blur-md">
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-[11px] font-mono text-white/40 uppercase tracking-wider px-2 shrink-0">
              PILIH PROFIL:
            </span>
            {liveProfiles.map((p, idx) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedProfileIndex(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all shrink-0 ${
                  selectedProfileIndex === idx
                    ? "bg-gradient-to-r from-[#D4AF37] to-amber-400 text-black shadow-md shadow-amber-950/40"
                    : "bg-white/[0.04] text-white/70 hover:text-white hover:bg-white/[0.08] border border-white/[0.08]"
                }`}
              >
                <span>{p.displayName}</span>
                <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-black/20">
                  {p.entityType}
                </span>
              </button>
            ))}
          </div>

          <Link
            href="/me/profile/new"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-dashed border-white/20 text-xs font-mono text-white/70 hover:text-white shrink-0 transition-all ml-2"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Tambah Entitas</span>
          </Link>
        </div>
      )}

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
                KARTU UTAMA • {entityType.toUpperCase()}
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
                <div className="w-full mt-6 pt-4 border-t border-white/[0.08] flex flex-col gap-2.5">
                  <div className="grid grid-cols-2 gap-2.5">
                    <Link
                      href={`/me/profile/${activeProfile.id}/edit`}
                      className="h-10 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-heading font-bold text-white flex items-center justify-center gap-2 transition-all"
                    >
                      <Edit className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Edit Profil</span>
                    </Link>

                    {entityType === "team" ? (
                      <Link
                        href={`/me/team/${activeProfile.id}/roster`}
                        className="h-10 rounded-xl bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 border border-[#D4AF37]/40 text-xs font-heading font-bold text-[#D4AF37] flex items-center justify-center gap-2 transition-all"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>Kelola Roster</span>
                      </Link>
                    ) : (
                      <Link
                        href="/me/verification"
                        className="h-10 rounded-xl bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 border border-[#D4AF37]/40 text-xs font-heading font-bold text-[#D4AF37] flex items-center justify-center gap-2 transition-all"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Verifikasi</span>
                      </Link>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setShowShareModal(true)}
                      className="h-9 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] text-xs font-mono text-white/70 hover:text-white flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Share2 className="w-3 h-3 text-[#D4AF37]" />
                      <span>Bagikan</span>
                    </button>

                    <Link
                      href={`/${userCard.type}/${userCard.slug}`}
                      target="_blank"
                      className="h-9 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] text-xs font-mono text-white/70 hover:text-white flex items-center justify-center gap-1.5 transition-all"
                    >
                      <ExternalLink className="w-3 h-3 text-white/40" />
                      <span>Lihat Publik</span>
                    </Link>
                  </div>
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
        {/* 2. BENTO KANAN: LANGKAH BERIKUT, PROGRES, STATUS, BIDANG */}
        {/* ======================================================= */}
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">
          {/* BARIS ATAS: LANGKAH BERIKUT (KONTEKSTUAL ENTITAS) */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-[#D4AF37]/10 via-[#161A24] to-[#0F1118] border border-[#D4AF37]/30 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#D4AF37] text-[#07080C] flex items-center justify-center font-bold shadow-[0_0_20px_rgba(212,175,55,0.4)] shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
                  LANGKAH BERIKUT
                </span>
                <h3 className="text-base font-heading font-black text-white">
                  {nextStep.title}
                </h3>
                <p className="text-xs text-white/60">
                  {nextStep.desc}
                </p>
              </div>
            </div>

            <Link
              href={nextStep.href}
              className="px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#07080C] font-heading font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-md self-start sm:self-auto"
            >
              <span>{nextStep.actionText}</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* BARIS TENGAH: CINCIN PROGRES KELENGKAPAN & STATUS VERIFIKASI */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Cincin Progres Kelengkapan Profil */}
            <div className="p-6 rounded-3xl bg-[#0F1118]/80 border border-white/[0.08] flex items-center gap-5">
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
                  Kelengkapan {entityType === "team" ? "Profil Tim" : "Profil"}
                </span>
                <span className="text-[11px] text-white/50 mt-0.5">
                  {entityType === "team"
                    ? "Logo, deskripsi tim, dan divisi terisi. Tambahkan sosmed resmi."
                    : "Foto, IGN, Game, dan Wilayah terisi. Tambahkan sosmed."}
                </span>
                <Link
                  href={activeProfile ? `/me/profile/${activeProfile.id}/edit` : "/me/profile/new"}
                  className="text-[11px] font-mono text-[#D4AF37] hover:underline mt-2 font-semibold"
                >
                  Lengkapi Data &rarr;
                </Link>
              </div>
            </div>

            {/* Status Verifikasi Ringkas */}
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
                    {isVerified
                      ? "Terverifikasi Resmi"
                      : verificationStatus === "submitted"
                      ? "Diajukan (Tahap 2)"
                      : verificationStatus === "in_review_regional"
                      ? "Telaah Pengcab"
                      : verificationStatus === "regional_checked"
                      ? "Lolos Pengcab"
                      : verificationStatus === "revision_requested"
                      ? "Perlu Revisi"
                      : "Belum Verifikasi"}
                  </div>
                  <div className="text-[10px] font-mono text-white/40">
                    {activeProfile?.esportId || "Belum Ada ID"}
                  </div>
                </div>
              </div>

              <div className="text-[11px] font-mono text-white/60 pt-2 border-t border-white/[0.06] flex items-center justify-between">
                <span>{activeProfile?.regionName || "Sumatera Barat"}</span>
                <Link href="/me/verification" className="text-brand-pink hover:underline">
                  Detail Berkas &rarr;
                </Link>
              </div>
            </div>
          </div>

          {/* BARIS BAWAH: WIDGET DINAMIS SESUAI BIDANG (TEAM vs PLAYER vs LAINNYA) */}
          {entityType === "team" ? (
            <div className="p-6 rounded-3xl bg-[#0F1118]/80 border border-white/[0.08] flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-xs font-heading font-black text-white uppercase tracking-wider">
                    Roster &amp; Manajemen Tim: {activeProfile?.displayName}
                  </span>
                </div>
                <Link
                  href={`/me/team/${activeProfile?.id}/roster`}
                  className="text-[11px] font-mono text-[#D4AF37] hover:underline"
                >
                  Kelola Roster &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#161A24] border border-white/[0.06]">
                  <span className="text-[10px] font-mono text-white/40 block">Divisi Game</span>
                  <span className="text-xs font-bold text-white mt-0.5 block truncate">
                    {activeProfile?.mainGameName || "Esport"}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#161A24] border border-white/[0.06]">
                  <span className="text-[10px] font-mono text-white/40 block">Wilayah Homebase</span>
                  <span className="text-xs font-bold text-[#D4AF37] mt-0.5 block truncate">
                    {activeProfile?.regionName || "Sumatera Barat"}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#161A24] border border-white/[0.06]">
                  <span className="text-[10px] font-mono text-white/40 block">Status Rekrutmen</span>
                  <span className="text-xs font-bold text-emerald-400 mt-0.5 block truncate">
                    Roster Aktif
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-[11px] text-white/50">
                  Perlu menambah pemain atau kapten tim?
                </span>
                <Link
                  href={`/me/team/${activeProfile?.id}/roster`}
                  className="px-4 py-1.5 rounded-xl bg-white/[0.06] hover:bg-[#D4AF37] hover:text-black text-xs font-heading font-bold text-white transition-all flex items-center gap-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Atur Anggota Roster</span>
                </Link>
              </div>
            </div>
          ) : entityType === "school" || entityType === "campus" ? (
            <div className="p-6 rounded-3xl bg-[#0F1118]/80 border border-white/[0.08] flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-xs font-heading font-black text-white uppercase tracking-wider">
                    Ekstrakurikuler / UKM Esport Pendidikan
                  </span>
                </div>
                <Link
                  href={`/me/profile/${activeProfile?.id}/edit`}
                  className="text-[11px] font-mono text-[#D4AF37] hover:underline"
                >
                  Edit Data &rarr;
                </Link>
              </div>

              <div className="p-4 rounded-2xl bg-[#161A24] border border-white/[0.06] flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-heading font-bold text-white">
                    {activeProfile?.displayName}
                  </span>
                  <span className="text-[10px] font-mono text-white/50 mt-0.5">
                    Afiliasi Pengcab ESI {activeProfile?.regionName} • Pembinaan Pelajar
                  </span>
                </div>
                <Link
                  href="/me/verification"
                  className="px-3.5 py-1.5 rounded-xl bg-[#D4AF37]/15 text-[#D4AF37] text-xs font-mono font-bold hover:bg-[#D4AF37]/25 transition-all"
                >
                  Ajukan SK Sekolah
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-3xl bg-[#0F1118]/80 border border-white/[0.08] flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-xs font-heading font-black text-white uppercase tracking-wider">
                    Relasi Tim &amp; Kejuaraan Atlet
                  </span>
                </div>
                <Link
                  href="/me/memberships"
                  className="text-[11px] font-mono text-[#D4AF37] hover:underline"
                >
                  Status Klub &rarr;
                </Link>
              </div>

              <div className="p-4 rounded-2xl bg-[#161A24] border border-white/[0.06] flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-heading font-bold text-white">
                    {activeProfile?.ign ? `IGN: ${activeProfile.ign}` : activeProfile?.displayName}
                  </span>
                  <span className="text-[10px] font-mono text-white/50 mt-0.5">
                    Game: {activeProfile?.mainGameName || "Esport"} • Peran: {activeProfile?.roleName || "Athlete"}
                  </span>
                </div>
                <Link
                  href="/teams"
                  className="px-3.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white text-xs font-mono font-bold transition-all"
                >
                  Jelajah Tim PBESI
                </Link>
              </div>
            </div>
          )}
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
