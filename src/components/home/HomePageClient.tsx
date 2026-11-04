"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  Compass,
  ChevronRight,
  ChevronDown,
  Share2,
  ShieldCheck,
  Award,
  RotateCw,
  MapPin,
  Trophy,
  ArrowRight,
  Database,
  CheckCircle2,
  FileCheck,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EsportCard } from "@/components/card/EsportCard";
import { StatNumber } from "@/components/shared/StatNumber";
import {
  BrandLogo,
  BrandSlash,
  BrandWatermark,
  PartnerStrip,
  IssuedBy,
} from "@/components/brand";
import { mapVerificationToCard } from "@/types/card";
import { GALLERY_CARDS } from "@/data/mockCards";
import { MOCK_NEWS } from "@/data/mockNews";
import { REGIONS_DETAIL } from "@/data/regions";
import { MobileHome } from "@/components/mobile/MobileHome";
import type { PlatformStats } from "@/lib/services/stats";
import type { PublicArticle } from "@/lib/services/news";
import type { UnifiedProfileDetail } from "@/lib/services/public-profiles";

interface HomePageClientProps {
  stats: PlatformStats;
  articles: PublicArticle[];
  profiles: UnifiedProfileDetail[];
}

export function HomePageClient({ stats, articles, profiles }: HomePageClientProps) {
  const [productCardFlipped, setProductCardFlipped] = useState(false);

  // Hero cards: dari database atau fallback ke mock
  const heroCards = profiles.length >= 3
    ? profiles.slice(0, 3).map((p) => ({
        type: p.entityType,
        rarity: p.rarityTier,
        verification: mapVerificationToCard(p.verificationStatus),
        data: {
          displayName: p.displayName,
          ign: p.ign || undefined,
          role: p.roleName || "Athlete",
          game: p.mainGameName || "Esport",
          region: { name: p.regionName, code: p.regionCode },
          esportId: p.esportId,
          avatarUrl: p.avatarUrl || undefined,
        },
      }))
    : [
        GALLERY_CARDS.find((c) => c.id === "pl-contender") || GALLERY_CARDS[1],
        GALLERY_CARDS.find((c) => c.id === "pl-elite") || GALLERY_CARDS[2],
        GALLERY_CARDS.find((c) => c.id === "tm-elite") || GALLERY_CARDS[10],
      ];

  // News bento articles (1 headline + sub articles)
  const headlineArticle = articles.length > 0
    ? {
        id: articles[0].id,
        title: articles[0].title,
        slug: articles[0].slug,
        category: articles[0].category,
        date: new Date(articles[0].publishedAt).toLocaleDateString("id-ID"),
        readTime: "3 min baca",
        imageUrl: articles[0].coverImageUrl || "/images/news-placeholder.jpg",
      }
    : (MOCK_NEWS.find((n) => n.isHeadline) || MOCK_NEWS[0]);

  const subArticles = articles.length > 1
    ? articles.slice(1, 4).map((a) => ({
        id: a.id,
        title: a.title,
        slug: a.slug,
        category: a.category,
        date: new Date(a.publishedAt).toLocaleDateString("id-ID"),
        imageUrl: a.coverImageUrl || "/images/news-placeholder.jpg",
      }))
    : MOCK_NEWS.filter((n) => n.id !== headlineArticle.id).slice(0, 3);

  // Featured profiles for carousel
  const featuredCards = profiles.length > 0
    ? profiles.map((p) => ({
        id: p.id,
        slug: p.slug,
        type: p.entityType,
        rarity: p.rarityTier,
        verification: mapVerificationToCard(p.verificationStatus),
        data: {
          displayName: p.displayName,
          ign: p.ign || undefined,
          role: p.roleName || "Athlete",
          game: p.mainGameName || "Esport",
          region: { name: p.regionName, code: p.regionCode },
          esportId: p.esportId,
          avatarUrl: p.avatarUrl || undefined,
        },
      }))
    : GALLERY_CARDS.filter(
        (c) => c.verification === "verified" || c.verification === "regional"
      );

  return (
    <>
      {/* MOBILE EXPERIENCE (< 1024px Viewport) */}
      <div className="block lg:hidden min-h-screen bg-[var(--bg-base)]">
        <MobileHome stats={stats} articles={articles} profiles={profiles} />
      </div>

      {/* DESKTOP EXPERIENCE (≥ 1024px Cinematic Viewport) */}
      <div className="hidden lg:flex min-h-screen bg-[var(--bg-base)] text-[#FFFFFF] flex-col selection:bg-[#FF1752]/30 selection:text-white">
        <Navbar />

        <main className="flex-1 flex flex-col items-center overflow-x-hidden">
          {/* ==================== 1. HERO SECTION (FULL HEIGHT) ==================== */}
          <section className="relative w-full max-w-7xl mx-auto px-6 lg:px-8 min-h-[calc(100vh-70px)] flex items-center justify-between gap-12 py-16 overflow-hidden">
            {/* Ambient Pink & Navy Radial Glows */}
            <div className="absolute -top-10 right-1/4 w-[600px] h-[600px] bg-[#FF1752]/[0.08] blur-[140px] pointer-events-none rounded-full" />
            <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-[#00004F]/50 blur-[130px] pointer-events-none rounded-full" />

            {/* Brand Watermark on Right Edge (Opacity ~5%) */}
            <BrandWatermark opacity={0.05} size={720} position="top-right" />

            {/* Left Column: Headlines & Actions */}
            <div className="relative z-10 flex-1 flex flex-col items-start text-left max-w-2xl">
              {/* Brand Ownership Chip */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A0A2E]/90 border border-white/10 mb-6 shadow-sm backdrop-blur-md">
                <div className="relative w-4 h-2.5">
                  <Image
                    src="/brand/logo-mark-pink.png"
                    alt=""
                    fill
                    sizes="16px"
                    className="object-contain"
                  />
                </div>
                <span className="text-[11px] font-mono font-bold tracking-wider text-white/80 uppercase">
                  Platform oleh ESPORT SUMBAR™
                </span>
                <span className="text-white/30">•</span>
                <span className="text-[10px] font-mono text-white/50">Mitra: ESI Sumbar</span>
              </div>

              {/* Main Headline (Saira Condensed Skewed) */}
              <h1 className="text-5xl xl:text-6xl font-heading font-black uppercase tracking-tight text-white leading-[1.05] mb-5">
                BANGUN NAMAMU DI{" "}
                <span className="text-[#FF1752] display-skew">ARENA SUMBAR</span>
              </h1>

              {/* Punchy Subtitle */}
              <p className="text-base xl:text-lg text-white/70 leading-relaxed mb-8 max-w-xl">
                Pusat data digital, paspor atlet resmi (ESPORT ID), dan ekosistem turnamen esports Sumatera Barat.
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-4">
                <Link
                  href="/me/profile/new"
                  className="btn-brand-primary text-sm py-3.5 px-8"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Buat Paspor Kartu</span>
                </Link>

                <Link
                  href="/explore"
                  className="btn-brand-secondary text-sm py-3.5 px-8"
                >
                  <Compass className="w-4 h-4 text-[#FF4D77]" />
                  <span>Jelajahi Roster</span>
                </Link>
              </div>

              {/* Governance Trust Indicators */}
              <div className="mt-10 pt-6 border-t border-white/[0.08] flex items-center gap-6 text-xs text-white/60">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
                  <span>Verifikasi 19 Wilayah ESI</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#D4AF37]" />
                  <span>Standar Privasi UU PDP</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual (Stacked TCG Cards) */}
            <div className="relative z-10 flex-1 w-full flex items-center justify-end py-6">
              <div className="relative w-[340px] h-[480px] flex items-center justify-center">
                <div className="absolute top-2 -left-12 rotate-[-12deg] opacity-70 hover:opacity-100 hover:scale-105 hover:z-30 transition-all duration-300 pointer-events-auto">
                  <EsportCard
                    type={heroCards[0].type}
                    rarity={heroCards[0].rarity}
                    verification={heroCards[0].verification}
                    data={heroCards[0].data}
                    size="sm"
                    interactive={false}
                  />
                </div>

                <div className="absolute top-4 -right-12 rotate-[12deg] opacity-75 hover:opacity-100 hover:scale-105 hover:z-30 transition-all duration-300 pointer-events-auto">
                  <EsportCard
                    type={heroCards[2].type}
                    rarity={heroCards[2].rarity}
                    verification={heroCards[2].verification}
                    data={heroCards[2].data}
                    size="sm"
                    interactive={false}
                  />
                </div>

                <div className="relative z-20 shadow-[0_24px_70px_rgba(0,0,0,0.9)] pink-glow-sm">
                  <EsportCard
                    type={heroCards[1].type}
                    rarity={heroCards[1].rarity}
                    verification={heroCards[1].verification}
                    data={heroCards[1].data}
                    size="md"
                    interactive={true}
                  />
                </div>
              </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/40 animate-bounce pointer-events-none">
              <span className="text-[10px] font-mono tracking-widest uppercase">Scroll</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#FF1752]" />
            </div>
          </section>

          {/* Slanted Brand Slash Divider */}
          <BrandSlash variant="pink" height={36} angle="right" />

          {/* ==================== 2. STATISTIK TABULAR ==================== */}
          <section className="w-full bg-[#0A0A2E]/80 border-b border-white/[0.08] py-14">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="grid grid-cols-4 gap-8">
                <StatNumber value={stats.totalPlayers} label="Pemain" />
                <StatNumber value={stats.totalTeams} label="Tim" />
                <StatNumber value={stats.totalCoaches} label="Pelatih" />
                <StatNumber value={stats.activeRegions} label="Wilayah" suffix=" / 19" />
              </div>
            </div>
          </section>

          {/* ==================== 3. PERAN KAMI VS MITRA (PROMPT B6) ==================== */}
          <section className="w-full max-w-7xl mx-auto px-6 lg:px-8 py-20">
            <div className="text-center max-w-xl mx-auto mb-12">
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#FF4D77]">
                Struktur Ekosistem
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading font-black uppercase text-white mt-1">
                Dikelola Kami, Diverifikasi Mitra
              </h2>
              <p className="text-xs text-white/60 mt-2">
                Pemisahan tegas peran operasional teknologi dan pengesahan olahraga prestasi.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Panel: ESPORT SUMBAR */}
              <div className="p-7 rounded-2xl bg-[#0A0A2E] border border-white/10 hover:border-[#FF1752]/40 transition-all flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#FF1752]/10 rounded-full blur-2xl group-hover:bg-[#FF1752]/15 transition-all" />

                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-[#FF1752]/15 border border-[#FF1752]/30 flex items-center justify-center text-[#FF1752]">
                      <Database className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-heading font-black text-xl text-white uppercase tracking-wide">
                        ESPORT SUMBAR™
                      </h3>
                      <span className="text-[10px] font-mono text-[#FF4D77] uppercase font-bold">
                        Pemilik & Pengelola Platform
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-3 text-xs text-white/70">
                    <li className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF1752]" />
                      <span><strong>Penerbitan Kartu:</strong> Menerbitkan kartu identitas digital ESPORT ID.</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF1752]" />
                      <span><strong>Infrastruktur Data:</strong> Menjaga basis data, server, dan privasi atlet.</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF1752]" />
                      <span><strong>Media & Direktori:</strong> Menayangkan warta, jadwal turnamen, dan statistik publik.</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-white/40">
                  <span>Kontrol Data & Teknologi</span>
                  <IssuedBy variant="badge" />
                </div>
              </div>

              {/* Right Panel: MITRA KELEMBAGAAN ESI */}
              <div className="p-7 rounded-2xl bg-[#0A0A2E] border border-white/10 hover:border-[#22C55E]/40 transition-all flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#22C55E]/10 rounded-full blur-2xl group-hover:bg-[#22C55E]/15 transition-all" />

                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-[#22C55E]/15 border border-[#22C55E]/30 flex items-center justify-center text-[#22C55E]">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-heading font-black text-xl text-white uppercase tracking-wide">
                        Mitra Kelembagaan ESI
                      </h3>
                      <span className="text-[10px] font-mono text-[#22C55E] uppercase font-bold">
                        Verifikator Data Keolahragaan
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-3 text-xs text-white/70">
                    <li className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                      <span><strong>Pemeriksaan Daerah:</strong> ESI Kota/Kabupaten memeriksa identitas domisili.</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                      <span><strong>Pemberian Lencana:</strong> Menerbitkan status <em>Regional Checked</em>.</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                      <span><strong>Validasi Provinsi:</strong> Pengprov ESI Sumbar mengesahkan status <em>Verified</em>.</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-white/40">
                  <span>Integritas Olahraga Prestasi</span>
                  <Link href="/partners" className="text-[#FF4D77] hover:underline">
                    Lihat 19 Cabang Mitra &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* ==================== 4. KARTU ADALAH PRODUKNYA SECTION ==================== */}
          <section className="w-full max-w-7xl mx-auto px-6 lg:px-8 py-20 flex flex-col md:flex-row items-center justify-between gap-16">
            <div className="flex-1 flex flex-col items-center">
              <div
                onClick={() => setProductCardFlipped(!productCardFlipped)}
                className="cursor-pointer group relative"
              >
                <div className="shadow-[0_24px_80px_rgba(255,23,82,0.15)] rounded-2xl transition-transform group-hover:scale-[1.02]">
                  <EsportCard
                    type="player"
                    rarity="elite"
                    verification="verified"
                    data={{
                      esportId: "ESB-PDG-PL-000124",
                      displayName: "Raka Pratama",
                      ign: "SUTAN_AIM",
                      game: "Mobile Legends",
                      role: "Mid Laner",
                      region: { name: "Kota Padang", code: "PDG" },
                      achievements: [
                        {
                          title: "Juara 1 Porprov Sumbar",
                          level: "provinsi",
                          placement: "1st Place",
                          year: "2025",
                          isValidated: true,
                        },
                      ],
                    }}
                    size="lg"
                    interactive={true}
                  />
                </div>

                <div className="mt-4 flex items-center justify-center gap-1.5 text-xs font-mono text-white/50 group-hover:text-[#FF4D77] transition-colors">
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Klik untuk balik kartu</span>
                </div>
              </div>
            </div>

            {/* Right: Key Value Props */}
            <div className="flex-1 flex flex-col gap-8 max-w-lg">
              <div>
                <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#FF4D77]">
                  Produk Unggulan
                </span>
                <h2 className="text-3xl sm:text-4xl font-heading font-black uppercase text-white mt-1 leading-tight">
                  Paspor Digital & Rekam Jejak
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#0A0A2E] border border-white/10 hover:border-white/20 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-[#FF1752]/10 border border-[#FF1752]/20 flex items-center justify-center text-[#FF4D77] shrink-0">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-white uppercase text-sm tracking-wide">
                      Bagikan Identitas Resmi
                    </h3>
                    <p className="text-xs text-white/50 mt-0.5">
                      Format paspor berstandar QR untuk pendaftaran turnamen dan media sosial.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#0A0A2E] border border-white/10 hover:border-white/20 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-white uppercase text-sm tracking-wide">
                      Divalidasi Mitra ESI
                    </h3>
                    <p className="text-xs text-white/50 mt-0.5">
                      Lencana resmi diterbitkan melalui alur verifikasi pengurus ESI.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#0A0A2E] border border-white/10 hover:border-white/20 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-white uppercase text-sm tracking-wide">
                      Tingkatkan Tingkat Prestasi
                    </h3>
                    <p className="text-xs text-white/50 mt-0.5">
                      Naikkan rarity kartu dari Rookie hingga Elite sesuai torehan medali kejuaraan.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ==================== 5. WARTA BERITA BENTO ==================== */}
          <section className="w-full max-w-7xl mx-auto px-6 lg:px-8 py-20 border-t border-white/[0.08]">
            <div className="flex items-center justify-between mb-10">
              <div>
                <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#FF4D77]">
                  Warta Terkini
                </span>
                <h2 className="text-3xl sm:text-4xl font-heading font-black uppercase text-white mt-1">
                  Kabar Esport Sumbar
                </h2>
              </div>
              <Link
                href="/news"
                className="flex items-center gap-1.5 text-xs font-heading font-bold uppercase tracking-wider text-[#FF4D77] hover:underline"
              >
                <span>Lihat Semua</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-12 gap-6">
              <Link
                href={`/news/${headlineArticle.slug}`}
                className="col-span-12 lg:col-span-7 rounded-2xl bg-[#0A0A2E] border border-white/10 hover:border-[#FF1752]/40 transition-all overflow-hidden group flex flex-col justify-between"
              >
                <div className="relative w-full h-80 overflow-hidden bg-black/40">
                  {headlineArticle.imageUrl && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={headlineArticle.imageUrl}
                      alt={headlineArticle.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A2E] via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-[#03031A]/90 border border-white/10 text-[10px] font-mono text-[#FF4D77] uppercase font-bold">
                      {headlineArticle.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-heading font-bold text-2xl text-white group-hover:text-[#FF4D77] transition-colors leading-snug mb-2">
                    {headlineArticle.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-white/50">
                    <span>{headlineArticle.date}</span>
                    <span>•</span>
                    <span>{headlineArticle.readTime}</span>
                  </div>
                </div>
              </Link>

              <div className="col-span-12 lg:col-span-5 flex flex-col gap-4">
                {subArticles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/news/${article.slug}`}
                    className="p-4 rounded-xl bg-[#0A0A2E] border border-white/10 hover:border-white/20 transition-all flex gap-4 group"
                  >
                    <div className="relative w-24 h-20 rounded-lg overflow-hidden bg-black/40 shrink-0">
                      {article.imageUrl && (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={article.imageUrl}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      )}
                    </div>
                    <div className="flex flex-col justify-between">
                      <span className="text-[10px] font-mono text-[#FF4D77] uppercase font-bold">
                        {article.category}
                      </span>
                      <h4 className="font-heading font-bold text-sm text-white group-hover:text-[#FF4D77] transition-colors line-clamp-2 leading-tight">
                        {article.title}
                      </h4>
                      <span className="text-[11px] text-white/40">{article.date}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* ==================== 6. MITRA STRIP PRE-FOOTER ==================== */}
          <section className="w-full max-w-7xl mx-auto px-6 lg:px-8 pb-16">
            <PartnerStrip variant="horizontal" />
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
