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
    <div className="min-h-screen bg-[#07080C] text-white flex flex-col select-none">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 lg:px-12 py-10">
        {/* BREADCRUMB */}
        <nav className="flex items-center gap-2 text-xs font-mono text-white/50 mb-8">
          <Link href="/" className="hover:text-white transition-colors">
            Beranda
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-white/30" />
          <Link href="/regions" className="hover:text-white transition-colors">
            Wilayah
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-white/30" />
          <span className="text-[#D4AF37] font-bold">{region.name}</span>
        </nav>

        {/* ========================================================= */}
        {/* 1. HEADER SINEMATIK: LAMBANG BESAR, NAMA, JENIS WILAYAH   */}
        {/* ========================================================= */}
        <section className="relative p-8 lg:p-10 rounded-3xl bg-[#0F1118]/90 border border-white/[0.08] shadow-2xl backdrop-blur-xl mb-10 overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 blur-[100px] pointer-events-none" />

          {/* Left: Emblem + Name + Type */}
          <div className="flex items-center gap-6 z-10">
            {/* Emblem / Shield Badge */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1C2230] to-[#0A0D15] border-2 border-[#D4AF37] flex flex-col items-center justify-center p-2 shadow-[0_0_30px_rgba(212,175,55,0.3)] shrink-0">
              <div className="flex h-3 w-6 rounded-sm overflow-hidden mb-1">
                <span className="w-1/3 bg-[#C8102E]" />
                <span className="w-1/3 bg-[#D4AF37]" />
                <span className="w-1/3 bg-black" />
              </div>
              <span className="font-heading font-black text-sm text-white">{region.code}</span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-[10px] font-mono text-[#D4AF37] font-bold uppercase">
                  {region.type === "kota" ? "KOTA OTONOM" : "KABUPATEN"}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold uppercase">
                  WILAYAH TERDAFTAR
                </span>
                {region.isPilot && (
                  <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 text-[9px] font-mono font-black">
                    PILOT
                  </span>
                )}
              </div>

              <h1 className="text-3xl lg:text-5xl font-heading font-black uppercase text-white tracking-tight">
                {region.name}
              </h1>
            </div>
          </div>

          {/* Right: Quick Action to Register */}
          <div className="z-10 shrink-0">
            <Link
              href="/me/profile/new"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-[#07080C] font-heading font-black text-xs uppercase tracking-wider transition-all shadow-lg hover:brightness-110 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Daftar Atlet Wilayah</span>
            </Link>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 2. BENTO STATISTIK & KARTU LAYANAN WILAYAH                */}
        {/* ========================================================= */}
        <div className="grid grid-cols-12 gap-8 mb-12">
          {/* BENTO STATISTIK (7 COLS): PLAYER, PELATIH, TIM */}
          <div className="col-span-12 lg:col-span-7 grid grid-cols-3 gap-4">
            {/* Stat Player */}
            <div className="p-6 rounded-2xl bg-[#0F1118]/80 border border-white/[0.08] flex flex-col justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
                ATLET TERDATA
              </span>
              <div className="my-2">
                <StatNumber value={playerCount} label="Player" className="text-3xl lg:text-4xl font-mono font-black text-white" />
              </div>
              <span className="text-[10px] font-mono text-[#D4AF37]">Player Terdaftar</span>
            </div>

            {/* Stat Pelatih */}
            <div className="p-6 rounded-2xl bg-[#0F1118]/80 border border-white/[0.08] flex flex-col justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
                PELATIH BERLISENSI
              </span>
              <div className="my-2">
                <StatNumber value={coachCount} label="Pelatih" className="text-3xl lg:text-4xl font-mono font-black text-[#4C7DFF]" />
              </div>
              <span className="text-[10px] font-mono text-white/40">Pelatih Terdaftar</span>
            </div>

            {/* Stat Tim */}
            <div className="p-6 rounded-2xl bg-[#0F1118]/80 border border-white/[0.08] flex flex-col justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
                KLUB &amp; TIM
              </span>
              <div className="my-2">
                <StatNumber value={teamCount} label="Tim" className="text-3xl lg:text-4xl font-mono font-black text-[#D4AF37]" />
              </div>
              <span className="text-[10px] font-mono text-white/40">Klub Terdaftar</span>
            </div>
          </div>

          {/* KARTU PUSAT LAYANAN: PUSAT REGISTRASI & VERIFIKASI LANGSUNG */}
          <div className="col-span-12 lg:col-span-5 p-6 rounded-2xl bg-[#0F1118]/80 border border-white/[0.08] flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#D4AF37]" />
                <span className="font-heading font-black text-xs uppercase text-white tracking-wider">
                  Layanan Wilayah Terpadu
                </span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>

            <div className="my-3 flex flex-col gap-1.5 text-xs">
              <div className="text-sm font-heading font-bold text-white">
                Direktori Wilayah {region.name}
              </div>
              <div className="text-[11px] font-mono text-white/50">
                Pendaftaran dan verifikasi profil dilayani langsung secara mandiri oleh ESPORT SUMBAR.
              </div>
            </div>

            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-white/50">
              <span>Status Operasional:</span>
              <span className="text-emerald-400 font-bold">
                Terhubung Langsung
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3. GRID PROFIL TERDAFTAR DI WILAYAH INI                   */}
        {/* ========================================================= */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-3">
              <Trophy className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="font-heading font-black text-lg text-white uppercase tracking-wider">
                Profil Atlet &amp; Tim di {region.name}
              </h2>
            </div>
            <Link
              href="/explore"
              className="text-xs font-mono text-[#D4AF37] hover:underline flex items-center gap-1"
            >
              <span>Jelajah Semua</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {regionProfiles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {regionProfiles.map((p) => (
                <Link key={p.id} href={`/${p.entityType}/${p.slug}`} className="flex justify-center group">
                  <EsportCard
                    type={p.entityType}
                    rarity={p.rarityTier}
                    verification={mapVerificationToCard(p.verificationStatus)}
                    data={{
                      displayName: p.displayName,
                      ign: p.ign || undefined,
                      role: p.roleName || "Athlete",
                      game: p.mainGameName || "Esport",
                      team: (p.attributes as any)?.team_name ? { name: (p.attributes as any).team_name } : undefined,
                      region: { name: p.regionName, code: p.regionCode },
                      esportId: p.esportId,
                      avatarUrl: p.avatarUrl || undefined,
                    }}
                    size="sm"
                    interactive={true}
                  />
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-xs font-mono bg-[#0F1118]/50 rounded-2xl border border-white/[0.06] p-8 flex flex-col items-center">
              <ShieldCheck className="w-8 h-8 text-white/20 mb-3" />
              <p className="text-white/60 mb-2 font-medium">Belum ada atlet atau klub terdaftar di wilayah {region.name}.</p>
              <p className="text-white/40 mb-6 max-w-sm">Jadilah pionir esport di daerah ini dan buat kartu atlet digital ESPORT SUMBAR™ Anda.</p>
              <Link
                href="/register"
                className="px-4 py-2 rounded-xl btn-brand-primary text-white font-heading font-black text-xs uppercase"
              >
                Daftar Sekarang
              </Link>
            </div>
          )}
        </section>

        {/* ========================================================= */}
        {/* 4. BERITA & AGENDA WILAYAH                                */}
        {/* ========================================================= */}
        <section className="mt-14 flex flex-col gap-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <h2 className="font-heading font-black text-lg text-white uppercase tracking-wider">
              Berita &amp; Agenda Lokal
            </h2>
            <Link href="/news" className="text-xs font-mono text-brand-pink hover:underline">
              Semua Berita &rarr;
            </Link>
          </div>

          {localNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {localNews.map((news) => (
                <Link
                  key={news.id}
                  href={`/news/${news.slug}`}
                  className="group p-5 rounded-2xl bg-[#0F1118]/80 hover:bg-[#161A24] border border-white/[0.08] hover:border-brand-pink/50 flex flex-col justify-between transition-all"
                >
                  <div>
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono text-brand-pink bg-brand-pink/10 uppercase mb-2 inline-block">
                      {news.category}
                    </span>
                    <h3 className="text-sm font-heading font-bold text-white group-hover:text-brand-pink transition-colors line-clamp-2">
                      {news.title}
                    </h3>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/[0.06] text-[10px] font-mono text-white/40 flex items-center justify-between">
                    <span>{new Date(news.publishedAt).toLocaleDateString("id-ID")}</span>
                    <span className="text-white/60">Warta Daerah</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs font-mono text-white/40 bg-[#0F1118]/50 rounded-2xl border border-white/[0.06]">
              Belum ada siaran berita khusus untuk wilayah ini.
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
