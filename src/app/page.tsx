"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Compass,
  ChevronRight,
  ChevronDown,
  Share2,
  ShieldCheck,
  Award,
  Layers,
  ArrowRight,
  Calendar,
  RotateCw,
  MapPin,
  HelpCircle,
  Trophy,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EsportCard } from "@/components/card/EsportCard";
import { StatNumber } from "@/components/shared/StatNumber";
import { GALLERY_CARDS } from "@/data/mockCards";
import { MOCK_NEWS } from "@/data/mockNews";
import { REGIONS_DETAIL } from "@/data/regions";
import { MobileHome } from "@/components/mobile/MobileHome";

export default function HomePage() {
  // Center Card Flip State for "Kartu Adalah Produknya" Section
  const [productCardFlipped, setProductCardFlipped] = useState(false);

  // Active Region Tooltip for Quick Map Section
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  // Featured verified profiles
  const featuredCards = GALLERY_CARDS.filter(
    (c) => c.verification === "verified" || c.verification === "regional"
  );

  // Hero cards
  const heroCards = [
    GALLERY_CARDS.find((c) => c.id === "pl-contender") || GALLERY_CARDS[1],
    GALLERY_CARDS.find((c) => c.id === "pl-elite") || GALLERY_CARDS[2],
    GALLERY_CARDS.find((c) => c.id === "tm-elite") || GALLERY_CARDS[10],
  ];

  // News bento articles (1 big headline + 3 sub articles)
  const headlineArticle = MOCK_NEWS.find((n) => n.isHeadline) || MOCK_NEWS[0];
  const subArticles = MOCK_NEWS.filter((n) => n.id !== headlineArticle.id).slice(0, 3);

  return (
    <>
      {/* MOBILE EXPERIENCE (< 1024px Viewport) */}
      <div className="block lg:hidden min-h-screen bg-[#07080C]">
        <MobileHome />
      </div>

      {/* DESKTOP EXPERIENCE (≥ 1024px Cinematic Viewport) */}
      <div className="hidden lg:flex min-h-screen bg-[#07080C] text-[#F3F4F6] flex-col selection:bg-[#D4AF37]/20 selection:text-[#D4AF37]">
        <Navbar />

        <main className="flex-1 flex flex-col items-center overflow-x-hidden">
          {/* ==================== 1. HERO SECTION (FULL HEIGHT) ==================== */}
          <section className="relative w-full max-w-7xl mx-auto px-6 lg:px-8 min-h-[calc(100vh-64px)] flex items-center justify-between gap-12 py-16">
            {/* Subtle Ambient Radial Lighting */}
            <div className="absolute top-1/4 left-1/4 w-[480px] h-[480px] bg-[#C8102E]/[0.06] blur-[120px] pointer-events-none rounded-full" />
            <div className="absolute top-1/3 right-1/4 w-[480px] h-[480px] bg-[#D4AF37]/[0.08] blur-[120px] pointer-events-none rounded-full" />

            {/* Left Column: Headlines & Actions */}
            <div className="relative z-10 flex-1 flex flex-col items-start text-left max-w-2xl">
              {/* Regional Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0F1118] border border-white/[0.08] mb-6 shadow-sm">
                <div className="flex h-2.5 w-6 rounded-sm overflow-hidden">
                  <span className="w-1/3 bg-[#C8102E]" />
                  <span className="w-1/3 bg-[#D4AF37]" />
                  <span className="w-1/3 bg-black" />
                </div>
                <span className="text-xs font-heading font-bold uppercase tracking-wider text-gray-300">
                  Resmi PBESI Sumatera Barat
                </span>
              </div>

              {/* Main Headline (Max 6 words) */}
              <h1 className="text-5xl xl:text-6xl font-heading font-black uppercase tracking-tight text-white leading-[1.08] mb-5">
                Identitas Digital <span className="text-[#D4AF37]">Esport Sumbar</span>
              </h1>

              {/* Subtitle (1 Short Sentence) */}
              <p className="text-base xl:text-lg text-[#9AA3B2] leading-relaxed mb-8 max-w-xl">
                Pusat data resmi rekam jejak atlet dan kartu TCG kebanggaan Ranah Minang.
              </p>

              {/* Action Buttons (Max 2 words each) */}
              <div className="flex items-center gap-4">
                <Link
                  href="/me/profile/new"
                  className="flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B38F24] hover:brightness-110 text-black text-sm font-heading font-black uppercase tracking-wider shadow-[0_0_30px_rgba(212,175,55,0.35)] transition-all active:scale-[0.98]"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Buat Kartu</span>
                </Link>

                <Link
                  href="/explore"
                  className="flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-[#0F1118] hover:bg-[#161A24] border border-white/[0.08] hover:border-white/20 text-white text-sm font-heading font-bold uppercase tracking-wider transition-all"
                >
                  <Compass className="w-4 h-4 text-[#4C7DFF]" />
                  <span>Jelajahi</span>
                </Link>
              </div>

              {/* Governance Trust Indicators */}
              <div className="mt-10 pt-6 border-t border-white/[0.06] flex items-center gap-6 text-xs text-[#9AA3B2]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
                  <span>Verifikasi 19 Wilayah</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#D4AF37]" />
                  <span>Privasi UU PDP</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual - Stacked Interactive TCG Cards */}
            <div className="relative z-10 flex-1 w-full flex items-center justify-end py-6">
              <div className="relative w-[340px] h-[480px] flex items-center justify-center">
                {/* Card 1 (Back left, tilted -12deg) */}
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

                {/* Card 3 (Back right, tilted +12deg) */}
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

                {/* Card 2 (Center Hero, 3D Interactive Tilt) */}
                <div className="relative z-20 shadow-[0_20px_60px_rgba(0,0,0,0.85)]">
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

            {/* Scroll Down Indicator */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gray-500 animate-bounce pointer-events-none">
              <span className="text-[10px] font-mono tracking-widest uppercase">Scroll</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#D4AF37]" />
            </div>
          </section>

          {/* ==================== 2. STATISTIK SECTION (COUNT-UP) ==================== */}
          <section className="w-full bg-[#0F1118]/80 border-y border-white/[0.08] py-14">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="grid grid-cols-4 gap-8">
                <StatNumber value={1420} label="Pemain" />
                <StatNumber value={185} label="Tim" />
                <StatNumber value={48} label="Pelatih" />
                <StatNumber value={19} label="Wilayah" suffix=" / 19" />
              </div>
            </div>
          </section>

          {/* ==================== 3. KARTU ADALAH PRODUKNYA SECTION ==================== */}
          <section className="w-full max-w-7xl mx-auto px-6 lg:px-8 py-28 lg:py-32 flex flex-col md:flex-row items-center justify-between gap-16">
            {/* Left: 1 Large Interactive Card with 3D Flip */}
            <div className="flex-1 flex flex-col items-center">
              <div
                onClick={() => setProductCardFlipped(!productCardFlipped)}
                className="cursor-pointer group relative"
              >
                <div className="shadow-[0_24px_80px_rgba(212,175,55,0.2)] rounded-2xl transition-transform group-hover:scale-[1.02]">
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

                <div className="mt-4 flex items-center justify-center gap-1.5 text-xs font-mono text-gray-400 group-hover:text-[#D4AF37] transition-colors">
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Klik untuk balik kartu</span>
                </div>
              </div>
            </div>

            {/* Right: 3 Key Value Props (Max 4 words each) */}
            <div className="flex-1 flex flex-col gap-8 max-w-lg">
              <div>
                <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#D4AF37]">
                  Produk Utama
                </span>
                <h2 className="text-3xl sm:text-4xl font-heading font-black uppercase text-white mt-2 leading-tight">
                  Kartu Digital Atlet
                </h2>
              </div>

              <div className="space-y-6">
                {/* Point 1: Bagikan */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#0F1118] border border-white/[0.08] hover:border-white/20 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#4C7DFF] shrink-0">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-white uppercase text-sm tracking-wide">
                      Bagikan ke Publik
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Pamerkan kartu identitas kompetisi ke seluruh platform.
                    </p>
                  </div>
                </div>

                {/* Point 2: Verifikasi */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#0F1118] border border-white/[0.08] hover:border-white/20 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-white uppercase text-sm tracking-wide">
                      Divalidasi Resmi Pengprov
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Lencana Emas resmi diterbitkan langsung oleh ESI Sumbar.
                    </p>
                  </div>
                </div>

                {/* Point 3: Koleksi */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#0F1118] border border-white/[0.08] hover:border-white/20 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-white uppercase text-sm tracking-wide">
                      Tingkatkan Hingga Legend
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Naikkan tier kartu dengan rekam jejak prestasi turnamen.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ==================== 4. CARA KERJA SECTION (3 LANGKAH) ==================== */}
          <section className="w-full max-w-7xl mx-auto px-6 lg:px-8 py-24 bg-[#0B0D12] border-t border-white/[0.08]">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#D4AF37]">
                Alur Sistem
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading font-black uppercase text-white mt-2">
                Tiga Langkah Verifikasi
              </h2>
            </div>

            {/* 3 Horizontal Steps with Glowing Connector */}
            <div className="relative grid grid-cols-3 gap-8">
              {/* Glowing Line */}
              <div className="absolute top-1/2 left-1/6 right-1/6 -translate-y-1/2 h-0.5 bg-gradient-to-r from-[#D4AF37]/20 via-[#D4AF37] to-[#D4AF37]/20 pointer-events-none hidden md:block" />

              {/* Step 1 */}
              <div className="relative z-10 flex flex-col items-center text-center p-6 rounded-2xl bg-[#0F1118] border border-white/[0.08]">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1E2330] to-[#12151D] border border-white/10 flex items-center justify-center font-heading font-black text-xl text-[#D4AF37] mb-4 shadow-lg">
                  1
                </div>
                <h3 className="font-heading font-bold text-white uppercase text-base">
                  Daftar Akun
                </h3>
                <p className="text-xs text-gray-400 mt-1">Buat akun 20 detik</p>
              </div>

              {/* Step 2 */}
              <div className="relative z-10 flex flex-col items-center text-center p-6 rounded-2xl bg-[#0F1118] border border-white/[0.08]">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1E2330] to-[#12151D] border border-white/10 flex items-center justify-center font-heading font-black text-xl text-blue-400 mb-4 shadow-lg">
                  2
                </div>
                <h3 className="font-heading font-bold text-white uppercase text-base">
                  Diperiksa
                </h3>
                <p className="text-xs text-gray-400 mt-1">Verifikasi berkas Pengcab daerah</p>
              </div>

              {/* Step 3 */}
              <div className="relative z-10 flex flex-col items-center text-center p-6 rounded-2xl bg-[#0F1118] border border-white/[0.08]">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#B38F24] text-black flex items-center justify-center font-heading font-black text-xl mb-4 shadow-lg shadow-amber-950/30">
                  3
                </div>
                <h3 className="font-heading font-bold text-white uppercase text-base">
                  Terverifikasi
                </h3>
                <p className="text-xs text-gray-400 mt-1">Lencana Emas resmi terbit</p>
              </div>
            </div>

            {/* Disciplinary Distinction Chips */}
            <div className="mt-12 flex items-center justify-center gap-4 flex-wrap">
              <div className="px-4 py-2 rounded-full bg-[#0F1118] border border-white/[0.08] flex items-center gap-2 text-xs text-gray-300">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                <span className="font-heading font-bold text-white">Frame:</span>
                <span>Prestasi Gamifikasi</span>
              </div>
              <div className="px-4 py-2 rounded-full bg-[#0F1118] border border-[#D4AF37]/30 flex items-center gap-2 text-xs text-[#D4AF37]">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                <span className="font-heading font-bold text-white">Lencana:</span>
                <span>Verifikasi Lembaga ESI</span>
              </div>
            </div>
          </section>

          {/* ==================== 5. BERITA BENTO GRID (1 + 3) ==================== */}
          <section className="w-full max-w-7xl mx-auto px-6 lg:px-8 py-28 lg:py-32">
            <div className="flex items-center justify-between mb-10">
              <div>
                <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#D4AF37]">
                  Warta Terkini
                </span>
                <h2 className="text-3xl sm:text-4xl font-heading font-black uppercase text-white mt-2">
                  Kabar Esport Sumbar
                </h2>
              </div>
              <Link
                href="/news"
                className="flex items-center gap-1.5 text-xs font-heading font-bold uppercase tracking-wider text-[#D4AF37] hover:underline"
              >
                <span>Lihat Semua</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Bento Grid: 1 Big Left, 3 Small Right */}
            <div className="grid grid-cols-12 gap-6">
              {/* Big Article (Col 7) */}
              <Link
                href={`/news/${headlineArticle.slug}`}
                className="col-span-7 rounded-2xl bg-[#0F1118] border border-white/[0.08] hover:border-[#D4AF37]/50 transition-all overflow-hidden group flex flex-col justify-between"
              >
                <div className="relative w-full h-80 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={headlineArticle.imageUrl}
                    alt={headlineArticle.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F1118] via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-black/80 border border-white/10 text-[10px] font-mono text-[#D4AF37] uppercase">
                      {headlineArticle.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <span className="text-[11px] font-mono text-gray-400 block mb-2">
                    {headlineArticle.date} · {headlineArticle.readTime}
                  </span>
                  <h3 className="text-2xl font-heading font-black text-white group-hover:text-[#D4AF37] transition-colors leading-tight line-clamp-2">
                    {headlineArticle.title}
                  </h3>
                </div>
              </Link>

              {/* 3 Small Articles (Col 5) */}
              <div className="col-span-5 flex flex-col gap-4">
                {subArticles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/news/${article.slug}`}
                    className="flex items-center gap-4 p-3.5 rounded-2xl bg-[#0F1118] border border-white/[0.08] hover:border-white/20 transition-all group"
                  >
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-black/40 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1">
                      <span className="text-[10px] font-mono text-[#D4AF37] uppercase block mb-1">
                        {article.category} · {article.date}
                      </span>
                      <h4 className="text-sm font-heading font-bold text-white group-hover:text-[#D4AF37] transition-colors line-clamp-2 leading-snug">
                        {article.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* ==================== 6. PROFIL UNGGULAN (VERIFIED CAROUSEL) ==================== */}
          <section className="w-full max-w-7xl mx-auto px-6 lg:px-8 py-20 border-t border-white/[0.08]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#D4AF37]">
                  Talenta Terverifikasi
                </span>
                <h2 className="text-3xl font-heading font-black uppercase text-white mt-1">
                  Atlet Unggulan Sumbar
                </h2>
              </div>
              <Link
                href="/explore"
                className="flex items-center gap-1.5 text-xs font-heading font-bold uppercase tracking-wider text-[#D4AF37] hover:underline"
              >
                <span>Lihat Direktori</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Horizontal Rail of Verified Cards */}
            <div className="flex gap-6 overflow-x-auto no-scrollbar pb-6 pt-2">
              {featuredCards.slice(0, 6).map((card) => (
                <div
                  key={card.id}
                  className="shrink-0 hover:-translate-y-2 transition-transform duration-300 shadow-xl"
                >
                  <EsportCard
                    type={card.type}
                    rarity={card.rarity}
                    verification={card.verification}
                    data={card.data}
                    size="sm"
                    interactive={true}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* ==================== 7. PETA SINGKAT 19 WILAYAH ==================== */}
          <section className="w-full max-w-7xl mx-auto px-6 lg:px-8 py-24 border-t border-white/[0.08]">
            <div className="p-8 rounded-3xl bg-[#0F1118] border border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="max-w-md">
                <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#D4AF37]">
                  Cakupan Wilayah
                </span>
                <h2 className="text-3xl font-heading font-black uppercase text-white mt-2">
                  19 Kota & Kabupaten
                </h2>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                  Struktur kepengurusan cabang terhubung langsung dengan sistem verifikasi resmi Pengprov ESI Sumatera Barat.
                </p>
                <Link
                  href="/regions"
                  className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.05] hover:bg-white/10 border border-white/10 text-xs font-heading font-bold uppercase tracking-wider text-white transition-all"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Jelajahi Peta Wilayah</span>
                </Link>
              </div>

              {/* 19 Glowing Region Badges Grid */}
              <div className="flex-1 grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                {REGIONS_DETAIL.slice(0, 12).map((r) => (
                  <Link
                    key={r.id}
                    href={`/regions/${r.slug}`}
                    className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/5 transition-all text-center group"
                  >
                    <span className="text-xs font-heading font-bold text-white group-hover:text-[#D4AF37] block truncate">
                      {r.name}
                    </span>
                    <span className="text-[10px] font-mono text-gray-500">
                      {r.code} · {r.verifiedCount} atlet
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* ==================== 8. CTA PENUTUP ==================== */}
          <section className="w-full max-w-7xl mx-auto px-6 lg:px-8 py-28 text-center">
            <div className="relative p-12 lg:p-16 rounded-3xl bg-gradient-to-b from-[#121622] to-[#0A0D14] border border-white/[0.08] shadow-2xl overflow-hidden">
              {/* Gold glow in center */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#D4AF37]/10 blur-[100px] pointer-events-none rounded-full" />

              <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
                <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#D4AF37] mb-2">
                  Daftar Sekarang
                </span>
                <h2 className="text-3xl sm:text-4xl font-heading font-black uppercase text-white tracking-tight">
                  Terbitkan Kartu Atletmu
                </h2>
                <p className="text-xs text-gray-400 mt-2 mb-8">
                  Dapatkan ESPORT ID resmi kebanggaan atlet Ranah Minang.
                </p>

                <Link
                  href="/me/profile/new"
                  className="flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B38F24] hover:brightness-110 text-black text-sm font-heading font-black uppercase tracking-wider shadow-[0_0_35px_rgba(212,175,55,0.4)] transition-all active:scale-[0.98]"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Buat Kartu</span>
                </Link>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
