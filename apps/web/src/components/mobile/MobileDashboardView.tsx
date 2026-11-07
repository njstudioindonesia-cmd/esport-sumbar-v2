"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Edit,
  Share2,
  ExternalLink,
  Users,
  LogOut,
  PlusCircle,
  Trophy,
  GraduationCap,
} from "lucide-react";
import { EsportCard } from "@/components/card/EsportCard";
import { ShareCardModal } from "@/components/card/ShareCardModal";
import { MobileBottomBar } from "@/components/mobile/MobileBottomBar";
import { mapVerificationToCard } from "@/types/card";
import { signOutAction } from "@/app/actions/auth";

export function MobileDashboardView() {
  const router = useRouter();
  const [liveProfiles, setLiveProfiles] = useState<any[] | null>(null);
  const [selectedProfileIndex, setSelectedProfileIndex] = useState(0);
  const [userSession, setUserSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);

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

  const handleSignOut = async () => {
    await signOutAction();
    router.push("/login");
    router.refresh();
  };

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

  return (
    <div className="relative w-full min-h-[100dvh] max-w-[420px] mx-auto bg-[#07080C] text-white flex flex-col justify-between pb-24 select-none">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#D4AF37]/8 rounded-full blur-3xl pointer-events-none" />

      {/* TOP HEADER */}
      <header className="sticky top-0 z-30 px-5 pt-4 pb-3 bg-[#07080C]/85 backdrop-blur-xl border-b border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#D4AF37] to-[#B38F24] flex items-center justify-center text-black font-extrabold text-sm border border-[#D4AF37]/40 shadow-md">
            {activeProfile?.displayName?.charAt(0) || userSession?.email?.charAt(0).toUpperCase() || "A"}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-heading font-black text-white truncate max-w-[170px]">
              {activeProfile?.displayName || userSession?.email?.split("@")[0] || "Dashboard Saya"}
            </span>
            <span className="text-[9px] font-mono text-[#D4AF37] uppercase tracking-wider">
              {entityType.toUpperCase()} • {activeProfile?.regionName || "SUMBAR"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {userSession?.role === "platform_admin" && (
            <Link
              href="/admin"
              className="px-2.5 py-1 rounded-lg bg-[#D4AF37] text-black text-[10px] font-heading font-black uppercase tracking-wider shadow-md hover:brightness-110"
            >
              Admin
            </Link>
          )}

          <button
            type="button"
            onClick={handleSignOut}
            className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-white/50 hover:text-red-400"
            title="Keluar"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* MAIN BODY */}
      <main className="flex-1 px-4 py-4 flex flex-col gap-4">
        {/* MULTI-ENTITY SWITCHER (Jika memiliki lebih dari 1 kartu) */}
        {liveProfiles && liveProfiles.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {liveProfiles.map((p, idx) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedProfileIndex(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 shrink-0 transition-all ${
                  selectedProfileIndex === idx
                    ? "bg-[#D4AF37] text-black shadow-md shadow-amber-950/40"
                    : "bg-white/[0.04] text-white/60 border border-white/[0.08]"
                }`}
              >
                <span className="truncate max-w-[110px]">{p.displayName}</span>
                <span className="text-[9px] uppercase px-1 rounded bg-black/20">
                  {p.entityType}
                </span>
              </button>
            ))}
            <Link
              href="/me/profile/new"
              className="px-2.5 py-1.5 rounded-xl bg-white/[0.04] border border-dashed border-white/20 text-xs font-mono text-white/60 flex items-center gap-1 shrink-0"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Tambah</span>
            </Link>
          </div>
        )}

        {/* KARTU UTAMA 3D */}
        <div className="w-full p-4 rounded-2xl bg-[#0F1118]/80 border border-white/[0.08] shadow-xl flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-3 text-[10px] font-mono uppercase tracking-wider text-white/50">
            <span>KARTU PASPOR DIGITAL</span>
            <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] font-bold">
              {userCard ? userCard.rarity : "BELUM ADA"}
            </span>
          </div>

          {isLoading ? (
            <div className="py-16 flex items-center justify-center">
              <div className="w-7 h-7 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : userCard ? (
            <>
              <EsportCard
                type={userCard.type}
                rarity={userCard.rarity}
                verification={userCard.verification}
                data={userCard.data}
                size="mobile"
                interactive={true}
              />

              {/* Quick Action Buttons */}
              <div className="w-full mt-4 pt-3 border-t border-white/[0.08] grid grid-cols-2 gap-2">
                <Link
                  href={`/me/profile/${activeProfile.id}/edit`}
                  className="h-9 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-heading font-bold text-white flex items-center justify-center gap-1.5"
                >
                  <Edit className="w-3 h-3 text-[#D4AF37]" />
                  <span>Edit Profil</span>
                </Link>

                {entityType === "team" ? (
                  <Link
                    href={`/me/team/${activeProfile.id}/roster`}
                    className="h-9 rounded-xl bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 border border-[#D4AF37]/40 text-xs font-heading font-bold text-[#D4AF37] flex items-center justify-center gap-1.5"
                  >
                    <Users className="w-3 h-3" />
                    <span>Roster Tim</span>
                  </Link>
                ) : (
                  <Link
                    href="/me/verification"
                    className="h-9 rounded-xl bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 border border-[#D4AF37]/40 text-xs font-heading font-bold text-[#D4AF37] flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verifikasi</span>
                  </Link>
                )}

                <button
                  type="button"
                  onClick={() => setShowShareModal(true)}
                  className="h-8 rounded-lg bg-white/[0.03] text-xs font-mono text-white/70 flex items-center justify-center gap-1.5"
                >
                  <Share2 className="w-3 h-3 text-[#D4AF37]" />
                  <span>Bagikan</span>
                </button>

                <Link
                  href={`/${userCard.type}/${userCard.slug}`}
                  className="h-8 rounded-lg bg-white/[0.03] text-xs font-mono text-white/70 flex items-center justify-center gap-1.5"
                >
                  <ExternalLink className="w-3 h-3 text-white/40" />
                  <span>Lihat Publik</span>
                </Link>
              </div>
            </>
          ) : (
            <div className="py-8 flex flex-col items-center text-center gap-2">
              <ShieldCheck className="w-10 h-10 text-[#FF1752]" />
              <h4 className="font-heading font-bold text-white text-sm">Belum Ada Kartu Paspor</h4>
              <p className="text-[11px] text-white/50 max-w-xs">
                Buat paspor digital Anda untuk mendapatkan kartu identitas berstandar ESPORT SUMBAR.
              </p>
              <Link href="/me/profile/new" className="btn-brand-primary text-xs py-2 px-4 mt-2">
                <span>Buat Kartu Baru</span>
              </Link>
            </div>
          )}
        </div>

        {/* STATUS VERIFIKASI & KELENGKAPAN */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-[#0F1118]/80 border border-white/[0.08] flex flex-col justify-between">
            <span className="text-[9px] font-mono uppercase tracking-wider text-white/40">
              STATUS VERIFIKASI
            </span>
            <div className="my-1.5 flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isVerified ? "bg-emerald-500/15 text-emerald-400" : "bg-amber-500/15 text-amber-400"}`}>
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="flex flex-col truncate">
                <span className="text-xs font-heading font-bold text-white truncate">
                  {isVerified ? "Lencana Emas" : verificationStatus === "submitted" ? "Diajukan" : "Belum Verif"}
                </span>
                <span className="text-[9px] font-mono text-white/40 truncate">
                  {activeProfile?.esportId || "Belum Ada ID"}
                </span>
              </div>
            </div>
            <Link href="/me/verification" className="text-[10px] font-mono text-[#D4AF37] hover:underline">
              Detail Status →
            </Link>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0F1118]/80 border border-white/[0.08] flex flex-col justify-between">
            <span className="text-[9px] font-mono uppercase tracking-wider text-white/40">
              KELENGKAPAN
            </span>
            <div className="my-1.5 flex items-center gap-2">
              <span className="text-xl font-heading font-black text-[#D4AF37]">
                {completeness}%
              </span>
              <span className="text-[10px] text-white/50 leading-tight">
                {entityType === "team" ? "Profil & Logo Tim" : "Profil & Atribut"}
              </span>
            </div>
            <Link
              href={activeProfile ? `/me/profile/${activeProfile.id}/edit` : "/me/profile/new"}
              className="text-[10px] font-mono text-[#D4AF37] hover:underline"
            >
              Lengkapi Data →
            </Link>
          </div>
        </div>

        {/* WIDGET ENTITAS KHUSUS */}
        {entityType === "team" ? (
          <div className="p-4 rounded-2xl bg-[#0F1118]/80 border border-white/[0.08] flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-xs font-heading font-bold text-white">
                  Roster & Manajemen Tim
                </span>
              </div>
              <Link
                href={`/me/team/${activeProfile?.id}/roster`}
                className="text-[10px] font-mono text-[#D4AF37] hover:underline"
              >
                Kelola →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#161A24]">
                <span className="text-[9px] font-mono text-white/40 block">Divisi Game</span>
                <span className="font-bold text-white truncate block">{activeProfile?.mainGameName || "Esport"}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#161A24]">
                <span className="text-[9px] font-mono text-white/40 block">Wilayah Asal</span>
                <span className="font-bold text-[#D4AF37] truncate block">{activeProfile?.regionName || "Sumatera Barat"}</span>
              </div>
            </div>
          </div>
        ) : entityType === "school" || entityType === "campus" ? (
          <div className="p-4 rounded-2xl bg-[#0F1118]/80 border border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GraduationCap className="w-6 h-6 text-[#D4AF37]" />
              <div className="flex flex-col">
                <span className="text-xs font-heading font-bold text-white">Ekskul / UKM Esport</span>
                <span className="text-[10px] font-mono text-white/50">Binaan Wilayah {activeProfile?.regionName}</span>
              </div>
            </div>
            <Link
              href="/me/verification"
              className="px-3 py-1.5 rounded-xl bg-[#D4AF37]/15 text-[#D4AF37] text-xs font-mono font-bold"
            >
              Ajukan SK
            </Link>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-[#0F1118]/80 border border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="w-5 h-5 text-[#D4AF37]" />
              <div className="flex flex-col">
                <span className="text-xs font-heading font-bold text-white">Kompetisi Daerah</span>
                <span className="text-[10px] text-white/50">Sirkuit & Kejuaraan ESPORT SUMBAR</span>
              </div>
            </div>
            <Link
              href="/tournaments"
              className="px-3 py-1.5 rounded-xl bg-white/[0.06] text-white text-xs font-heading font-bold"
            >
              Lihat Sirkuit
            </Link>
          </div>
        )}
      </main>

      {/* MOBILE BOTTOM NAV */}
      <MobileBottomBar />

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
