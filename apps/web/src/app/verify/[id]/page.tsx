import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ShieldCheck, CheckCircle2, AlertCircle, ArrowLeft, ExternalLink, Calendar, MapPin, Gamepad2, User } from "lucide-react";
import { getPublicProfileBySlug } from "@/lib/services/public-profiles";
import { GlassSurface } from "@/components/glass/GlassSurface";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassButton } from "@/components/glass/GlassButton";
import { GlassStatusBadge, GlassRarityBadge } from "@/components/glass/GlassBadge";

export const instant = false;

interface VerifyPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: VerifyPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Verifikasi Identitas: ${id} — ESPORT SUMBAR`,
    description: `Pemeriksaan keabsahan kartu identitas digital dan lencana verifikasi ${id} pada sistem ESPORT SUMBAR.`,
  };
}

export default async function VerifyPage({ params }: VerifyPageProps) {
  const { id } = await params;
  const profile = await getPublicProfileBySlug(id);

  const isValid = Boolean(profile);
  const isVerified = profile?.verificationStatus === "verified";
  const badgeNo = profile?.verifiedBadgeNo || `ESP-SB-VER-2026-${(profile?.id || "0001").slice(-4).toUpperCase()}`;

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-white flex flex-col selection:bg-[#FF1752]/30 selection:text-white">
      <Navbar />

      <main className="flex-1 pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full">
        {/* Navigation Back */}
        <div className="mb-6">
          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Direktori</span>
          </Link>
        </div>

        {/* Verification Card Box */}
        <GlassSurface
          variant="elevated"
          elevation="overlay"
          radius="3xl"
          specular={true}
          className="overflow-hidden border-white/15 shadow-2xl"
        >
          {/* Header Banner */}
          <div className={`p-6 sm:p-8 border-b ${isVerified ? "bg-emerald-500/15 border-emerald-500/30" : "bg-amber-500/15 border-amber-500/30"}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${isVerified ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" : "bg-amber-500/20 text-amber-400 border border-amber-500/40"}`}>
                  {isVerified ? <ShieldCheck className="w-7 h-7" /> : <AlertCircle className="w-7 h-7" />}
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/50 block">
                    Hasil Pindaian QR Verifikasi
                  </span>
                  <h1 className="text-xl sm:text-2xl font-heading font-black text-white uppercase">
                    {isVerified ? "Identitas Terverifikasi" : "Profil Terdaftar Mandiri"}
                  </h1>
                </div>
              </div>

              <div className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase shrink-0 border bg-white/10 border-white/15 text-white/80">
                {profile ? profile.entityType.toUpperCase() : "TIDAK DITEMUKAN"}
              </div>
            </div>
          </div>

          {/* Body Content */}
          {profile ? (
            <div className="p-6 sm:p-8 flex flex-col gap-6">
              {/* Profile Main Overview */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
                <div>
                  <span className="text-xs font-mono text-[#D4AF37] block mb-1">
                    {profile.esportId}
                  </span>
                  <div className="text-2xl font-heading font-black text-white">
                    {profile.displayName}
                  </div>
                  {profile.ign && (
                    <div className="text-sm font-mono text-white/60 mt-0.5">
                      IGN: <span className="text-white font-semibold">{profile.ign}</span>
                    </div>
                  )}
                </div>

                {isVerified && (
                  <GlassSurface variant="subtle" radius="xl" className="p-3 px-4 text-right border-white/10">
                    <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider block">
                      Nomor Registrasi Lencana
                    </span>
                    <span className="text-sm font-mono font-bold text-white block mt-0.5">
                      {badgeNo}
                    </span>
                  </GlassSurface>
                )}
              </div>

              {/* Detail Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <GlassCard variant="standard" elevation="glass" radius="xl" className="p-4 flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-[#FF1752] shrink-0" />
                  <div>
                    <span className="text-[10px] text-white/50 block">Wilayah Domisili</span>
                    <span className="text-white font-semibold">{profile.regionName}</span>
                  </div>
                </GlassCard>

                <GlassCard variant="standard" elevation="glass" radius="xl" className="p-4 flex items-center gap-3">
                  <Gamepad2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <div>
                    <span className="text-[10px] text-white/50 block">Game Utama</span>
                    <span className="text-white font-semibold">{profile.mainGameName || "Multi-Gaming"}</span>
                  </div>
                </GlassCard>

                <GlassCard variant="standard" elevation="glass" radius="xl" className="p-4 flex items-center gap-3">
                  <User className="w-4 h-4 text-sky-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-white/50 block">Tier Kelayakan</span>
                    <span className="text-white font-semibold uppercase">{profile.rarityTier || "Rookie"}</span>
                  </div>
                </GlassCard>

                <GlassCard variant="standard" elevation="glass" radius="xl" className="p-4 flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-white/50 block">Status Lencana</span>
                    <span className={isVerified ? "text-emerald-400 font-semibold" : "text-amber-400 font-semibold"}>
                      {isVerified ? "Aktif (Standar Tunggal)" : "Belum Diverifikasi"}
                    </span>
                  </div>
                </GlassCard>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <Link
                  href={`/profile/${profile.slug}`}
                  className="w-full sm:w-auto"
                >
                  <GlassButton variant="primary" size="md" className="w-full sm:w-auto text-xs font-heading font-black uppercase tracking-wider">
                    <span>Buka Profil Publik Lengkap</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                  </GlassButton>
                </Link>

                <Link
                  href="/verification-standard"
                  className="w-full sm:w-auto"
                >
                  <GlassButton variant="secondary" size="md" className="w-full sm:w-auto font-mono text-xs">
                    <span>Pelajari Standar Verifikasi</span>
                  </GlassButton>
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center flex flex-col items-center gap-4">
              <p className="text-sm text-white/60 max-w-md">
                Kode identitas atau lencana <span className="font-mono text-white font-bold">{id}</span> tidak ditemukan dalam basis data direktori aktif ESPORT SUMBAR.
              </p>
              <Link href="/explore">
                <GlassButton variant="primary" size="sm">
                  Jelajahi Direktori
                </GlassButton>
              </Link>
            </div>
          )}
        </GlassSurface>
      </main>

      <Footer />
    </div>
  );
}
