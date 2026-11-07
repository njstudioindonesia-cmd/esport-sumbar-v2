import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  ChevronRight,
  ShieldCheck,
  Award,
  Users,
  Gamepad2,
  GraduationCap,
  Calendar,
  Building2,
  Phone,
  Mail,
  ExternalLink,
  Trophy,
  Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EsportCard } from "@/components/card/EsportCard";
import { REGIONS_DETAIL } from "@/data/regions";
import { StatNumber } from "@/components/shared/StatNumber";
import { mapVerificationToCard } from "@/types/card";
import { getPublicProfilesList } from "@/lib/services/public-profiles";
import { getLatestArticles } from "@/lib/services/news";
import { GlassSurface } from "@/components/glass/GlassSurface";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassBadge } from "@/components/glass/GlassBadge";
import { GlassButton } from "@/components/glass/GlassButton";

export const instant = false;

export function generateStaticParams() {
  return REGIONS_DETAIL.map((r) => ({
    slug: r.slug,
  }));
}

export default async function RegionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const region = REGIONS_DETAIL.find((r) => r.slug === slug);

  if (!region) {
    notFound();
  }

  // Query profil publik nyata dari database
  const profilesResult = await getPublicProfilesList({ regionCode: region.code, limit: 24 });
  const regionProfiles = profilesResult.profiles;

  // Query artikel berita lokal nyata
  const localNews = await getLatestArticles({ regionId: region.id, limit: 3 });

  const playerCount = regionProfiles.filter((p) => p.entityType === "player").length;
  const teamCount = regionProfiles.filter((p) => p.entityType === "team").length;
  const coachCount = regionProfiles.filter((p) => p.entityType === "coach").length;

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-white flex flex-col select-none selection:bg-[#FF1752]/30 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* BREADCRUMB */}
        <nav className="flex items-center gap-2 text-xs font-mono text-white/50 mb-8 overflow-x-auto whitespace-nowrap scrollbar-none">
          <Link href="/" className="hover:text-white transition-colors">
            Beranda
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-white/30 shrink-0" />
          <Link href="/regions" className="hover:text-white transition-colors">
            Wilayah
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-white/30 shrink-0" />
          <span className="text-[#D4AF37] font-bold">{region.name}</span>
        </nav>

        {/* 1. HEADER SINEMATIK: EMBLEM, NAMA, JENIS WILAYAH */}
        <GlassSurface
          variant="elevated"
          elevation="overlay"
          radius="3xl"
          specular={true}
          className="relative p-6 sm:p-10 border-white/15 shadow-2xl mb-10 overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF1752]/10 blur-[100px] pointer-events-none" />

          {/* Left: Emblem + Name + Type */}
          <div className="flex items-center gap-5 sm:gap-6 z-10">
            {/* Emblem / Shield Badge */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#1C2230] to-[#0A0D15] border-2 border-[#D4AF37] flex flex-col items-center justify-center p-2 shadow-[0_0_30px_rgba(212,175,55,0.3)] shrink-0">
              <div className="flex h-3 w-6 rounded-sm overflow-hidden mb-1">
                <span className="w-1/3 bg-[#C8102E]" />
                <span className="w-1/3 bg-[#D4AF37]" />
                <span className="w-1/3 bg-black" />
              </div>
              <span className="font-heading font-black text-sm text-white">{region.code}</span>
            </div>

            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-white/[0.08] border border-white/10 text-[10px] font-mono text-[#D4AF37] font-bold uppercase">
                  {region.type === "kota" ? "KOTA OTONOM" : "KABUPATEN"}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold uppercase">
                  WILAYAH TERDATA
                </span>
                {region.isPilot && (
                  <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 text-[9px] font-mono font-black">
                    PILOT
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-heading font-black uppercase text-white tracking-tight">
                {region.name}
              </h1>
            </div>
          </div>

          {/* Right: Quick Action to Register */}
          <div className="z-10 shrink-0 w-full sm:w-auto">
            <Link href="/register" className="w-full sm:w-auto">
              <GlassButton variant="primary" size="md" className="w-full sm:w-auto text-xs font-heading font-black uppercase tracking-wider">
                <Sparkles className="w-4 h-4 mr-2" />
                <span>Daftar di Wilayah Ini</span>
              </GlassButton>
            </Link>
          </div>
        </GlassSurface>

        {/* 2. BENTO STATISTIK & KARTU LAYANAN WILAYAH */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
          {/* BENTO STATISTIK (7 COLS): PLAYER, PELATIH, TIM */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <GlassCard variant="standard" elevation="glass" radius="2xl" className="p-5 flex flex-col justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/50">
                ATLET TERDATA
              </span>
              <div className="my-2">
                <StatNumber value={playerCount} label="Player" className="text-3xl font-mono font-black text-white" />
              </div>
              <span className="text-[10px] font-mono text-[#D4AF37]">Player Terdaftar</span>
            </GlassCard>

            <GlassCard variant="standard" elevation="glass" radius="2xl" className="p-5 flex flex-col justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/50">
                PELATIH TERLISENSI
              </span>
              <div className="my-2">
                <StatNumber value={coachCount} label="Pelatih" className="text-3xl font-mono font-black text-sky-400" />
              </div>
              <span className="text-[10px] font-mono text-white/40">Pelatih Terdaftar</span>
            </GlassCard>

            <GlassCard variant="standard" elevation="glass" radius="2xl" className="p-5 flex flex-col justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/50">
                KLUB &amp; TIM
              </span>
              <div className="my-2">
                <StatNumber value={teamCount} label="Tim" className="text-3xl font-mono font-black text-[#D4AF37]" />
              </div>
              <span className="text-[10px] font-mono text-white/40">Klub Terdaftar</span>
            </GlassCard>
          </div>

          {/* KARTU PUSAT LAYANAN */}
          <GlassSurface variant="standard" elevation="glass" radius="2xl" className="lg:col-span-5 p-5 flex flex-col justify-between border-white/10">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#D4AF37]" />
                <span className="font-heading font-black text-xs uppercase text-white tracking-wider">
                  Direktori Wilayah Terpadu
                </span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>

            <div className="my-3 flex flex-col gap-1.5 text-xs">
              <div className="text-sm font-heading font-bold text-white">
                Wilayah {region.name}
              </div>
              <div className="text-[11px] font-mono text-white/60">
                Pendaftaran dan verifikasi paspor digital atlet dilayani langsung mandiri oleh platform ESPORT SUMBAR.
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/50">
              <span>Status Operasional:</span>
              <span className="text-emerald-400 font-bold">
                Terhubung Langsung
              </span>
            </div>
          </GlassSurface>
        </div>

        {/* 3. GRID PROFIL TERDAFTAR DI WILAYAH INI */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#D4AF37] block">
                ROSTER DAERAH
              </span>
              <h2 className="text-xl sm:text-2xl font-heading font-black uppercase text-white">
                Roster Terdata di {region.name}
              </h2>
            </div>
            <Link
              href={`/explore?region=${region.code}`}
              className="text-xs font-mono text-[#D4AF37] hover:underline"
            >
              Lihat di Direktori →
            </Link>
          </div>

          {regionProfiles.length === 0 ? (
            <GlassSurface variant="subtle" radius="2xl" className="p-12 text-center text-xs text-white/40 border-white/5">
              Belum ada atlet yang terdata di wilayah ini. Jadilah yang pertama mendaftar!
            </GlassSurface>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {regionProfiles.map((p) => {
                const card = {
                  id: p.id,
                  type: p.entityType as any,
                  rarity: p.rarityTier as any,
                  verification: mapVerificationToCard(p.verificationStatus),
                  data: {
                    displayName: p.displayName,
                    ign: p.ign || undefined,
                    role: p.roleName || "Member",
                    game: p.mainGameName || "Esport",
                    region: { name: p.regionName, code: p.regionCode },
                    esportId: p.esportId,
                    avatarUrl: p.avatarUrl || undefined,
                  },
                };

                return (
                  <div key={p.id} className="flex flex-col items-center">
                    <EsportCard
                      type={card.type}
                      rarity={card.rarity}
                      verification={card.verification}
                      data={card.data}
                      size="fluid"
                      interactive={true}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
