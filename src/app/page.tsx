"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  ShieldCheck,
  Award,
  ArrowRight,
  ChevronRight,
  Compass,
  Users,
  Gamepad2,
  GraduationCap,
  MapPin,
  Newspaper,
  Calendar,
  CheckCircle2,
  Building2,
  Coffee,
  HelpCircle,
  Clock,
  Layers,
  ChevronLeft,
  Info,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EsportCard } from "@/components/card/EsportCard";
import { GALLERY_CARDS } from "@/data/mockCards";
import { MOCK_NEWS } from "@/data/mockNews";
import { MobileHome } from "@/components/mobile/MobileHome";

export default function HomePage() {
  // Stat counters with animated count-up simulation
  const [stats, setStats] = useState({
    players: 0,
    teams: 0,
    coaches: 0,
    regions: 0,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        players: 1420,
        teams: 185,
        coaches: 48,
        regions: 19,
      });
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  // Three representative cards for the Hero Stack
  const heroCards = [
    GALLERY_CARDS.find((c) => c.id === "pl-contender") || GALLERY_CARDS[1],
    GALLERY_CARDS.find((c) => c.id === "pl-elite") || GALLERY_CARDS[2],
    GALLERY_CARDS.find((c) => c.id === "tm-elite") || GALLERY_CARDS[10],
  ];

  // Featured verified profiles for the Carousel
  const featuredCards = GALLERY_CARDS.filter(
    (c) => c.verification === "verified" || c.verification === "regional"
  );

  const headlineArticle = MOCK_NEWS.find((n) => n.isHeadline) || MOCK_NEWS[0];
  const subArticles = MOCK_NEWS.filter((n) => !n.isHeadline);

  return (
    <>
      {/* Mobile Experience (Phone & PWA Viewport) */}
      <div className="block lg:hidden min-h-screen bg-[#07080C]">
        <MobileHome />
      </div>

      {/* Desktop Landing Page (Large Screen Viewport) */}
      <div className="hidden lg:flex min-h-screen bg-[#0B0D12] text-[#F3F4F6] flex-col selection:bg-[#D4AF37]/20 selection:text-[#D4AF37]">
        <Navbar />

      <main className="flex-1 flex flex-col items-center overflow-x-hidden">
        {/* ==================== 1. HERO SECTION ==================== */}
        <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 md:pt-20 md:pb-24 flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Ambient Lighting Gradients */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C8102E]/10 blur-3xl pointer-events-none rounded-full" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#D4AF37]/10 blur-3xl pointer-events-none rounded-full" />

          {/* Left Column: Headlines & Call to Actions */}
          <div className="relative z-10 flex-1 flex flex-col items-start text-left max-w-2xl">
            {/* Regional Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#12151C] border border-[#262B38] mb-6 shadow-sm">
              <div className="flex h-2.5 w-6 rounded-sm overflow-hidden">
                <span className="w-1/3 bg-[#C8102E]" />
                <span className="w-1/3 bg-[#D4AF37]" />
                <span className="w-1/3 bg-black" />
              </div>
              <span className="text-xs font-heading font-bold uppercase tracking-wider text-gray-300">
                Inisiatif Digital Resmi ESI Sumatera Barat
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black uppercase tracking-tight text-white leading-[1.08] mb-5">
              Pusat Data & <span className="text-[#D4AF37]">Identitas Digital</span> Esport Sumatera Barat
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#9AA3B2] leading-relaxed mb-8 max-w-xl">
              Pangkalan data resmi rekam jejak atlet, pelatih, dan klub kompetitif Ranah Minang yang terintegrasi dengan kartu digital TCG serta verifikasi berjenjang ESI 19 Kota & Kabupaten.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto">
              <Link
                href="/register"
                className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E6CA65] hover:brightness-110 text-[#0B0D12] text-sm font-heading font-extrabold uppercase tracking-wider shadow-[0_0_25px_rgba(212,175,55,0.4)] transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Buat Kartu ESPORT ID-mu</span>
              </Link>

              <Link
                href="/explore"
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#161922] hover:bg-[#1A1E28] border border-[#262B38] text-gray-200 hover:text-white text-sm font-heading font-bold uppercase tracking-wider transition-colors"
              >
                <Compass className="w-4 h-4 text-[#3B82F6]" />
                <span>Jelajahi Ekosistem</span>
              </Link>
            </div>

            {/* Governance Trust Indicators */}
            <div className="mt-8 pt-6 border-t border-[#262B38]/80 flex flex-wrap items-center gap-4 text-xs text-[#9AA3B2]">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
                <span>Verifikasi ESI Berjenjang</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                <span>Tanpa NIK/KTP (Privasi UU PDP)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#3B82F6]" />
                <span>Rarity Otomatis Berbasis Prestasi</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual - Stacked Interactive TCG Cards */}
          <div className="relative z-10 flex-1 w-full flex items-center justify-center lg:justify-end py-6">
            <div className="relative w-[310px] sm:w-[340px] h-[440px] flex items-center justify-center">
              {/* Card 1 (Back left, tilted -12deg) */}
              <div className="absolute top-2 -left-6 sm:-left-12 rotate-[-10deg] opacity-70 hover:opacity-100 hover:scale-105 hover:z-30 transition-all duration-300 pointer-events-auto">
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
              <div className="absolute top-4 -right-6 sm:-right-12 rotate-[12deg] opacity-75 hover:opacity-100 hover:scale-105 hover:z-30 transition-all duration-300 pointer-events-auto">
                <EsportCard
                  type={heroCards[2].type}
                  rarity={heroCards[2].rarity}
                  verification={heroCards[2].verification}
                  data={heroCards[2].data}
                  size="sm"
                  interactive={false}
                />
              </div>

              {/* Card 2 (Center Hero, 3D Interactive) */}
              <div className="relative z-20 shadow-[0_10px_40px_rgba(0,0,0,0.9)]">
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
        </section>

        {/* ==================== 2. STATS BAR ==================== */}
        <section className="w-full bg-[#12151C] border-y border-[#262B38] py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {/* Stat 1 */}
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1.5 text-2xl sm:text-4xl font-heading font-black text-white">
                  <span>{stats.players > 0 ? stats.players.toLocaleString("id-ID") : "1,420"}</span>
                  <span className="text-[#D4AF37]">+</span>
                </div>
                <span className="text-xs sm:text-sm font-heading font-medium text-[#9AA3B2] uppercase tracking-wider mt-1">
                  Pemain Terdaftar
                </span>
              </div>

              {/* Stat 2 */}
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1.5 text-2xl sm:text-4xl font-heading font-black text-white">
                  <span>{stats.teams > 0 ? stats.teams.toLocaleString("id-ID") : "185"}</span>
                  <span className="text-[#3B82F6]">+</span>
                </div>
                <span className="text-xs sm:text-sm font-heading font-medium text-[#9AA3B2] uppercase tracking-wider mt-1">
                  Klub / Tim Aktif
                </span>
              </div>

              {/* Stat 3 */}
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1.5 text-2xl sm:text-4xl font-heading font-black text-white">
                  <span>{stats.coaches > 0 ? stats.coaches.toLocaleString("id-ID") : "48"}</span>
                  <span className="text-[#22C55E]">+</span>
                </div>
                <span className="text-xs sm:text-sm font-heading font-medium text-[#9AA3B2] uppercase tracking-wider mt-1">
                  Pelatih Berlisensi
                </span>
              </div>

              {/* Stat 4 */}
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1.5 text-2xl sm:text-4xl font-heading font-black text-[#D4AF37]">
                  <span>{stats.regions > 0 ? stats.regions : "19"}</span>
                  <span className="text-xs text-white uppercase font-sans font-normal ml-1">/ 19</span>
                </div>
                <span className="text-xs sm:text-sm font-heading font-medium text-[#9AA3B2] uppercase tracking-wider mt-1">
                  Kota & Kab Terdata
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== 3. BERITA TERBARU ==================== */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="flex items-center justify-between mb-8">
            <div className="flex flex-col">
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#D4AF37]">
                Kilas Berita & Agenda
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold uppercase tracking-tight text-white mt-1">
                Kabar Esport Ranah Minang
              </h2>
            </div>
            <Link
              href="/news"
              className="hidden sm:flex items-center gap-1.5 text-xs font-heading font-bold uppercase tracking-wider text-[#D4AF37] hover:underline"
            >
              <span>Lihat Semua Berita</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Large Headline Article */}
            <div className="lg:col-span-7 flex flex-col rounded-2xl bg-[#12151C] border border-[#262B38] overflow-hidden group hover:border-[#D4AF37]/50 transition-colors">
              <div className="relative w-full h-64 sm:h-80 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={headlineArticle.imageUrl}
                  alt={headlineArticle.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#12151C] via-transparent to-transparent" />
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-[#0B0D12]/90 border border-[#262B38] text-[10px] font-heading font-bold uppercase text-[#D4AF37] backdrop-blur-md">
                    {headlineArticle.category}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-[#0B0D12]/90 border border-[#262B38] text-[10px] font-mono text-gray-300 backdrop-blur-md">
                    {headlineArticle.region}
                  </span>
                </div>
              </div>
              <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center gap-3 text-xs text-[#9AA3B2] mb-2 font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {headlineArticle.date}
                    </span>
                    <span>•</span>
                    <span>{headlineArticle.readTime}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-heading font-bold text-white group-hover:text-[#D4AF37] transition-colors leading-snug">
                    {headlineArticle.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#9AA3B2] leading-relaxed mt-2.5 line-clamp-3">
                    {headlineArticle.excerpt}
                  </p>
                </div>
                <Link
                  href={`/news/${headlineArticle.slug}`}
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-heading font-bold uppercase tracking-wider text-[#D4AF37] hover:underline"
                >
                  <span>Baca Selengkapnya</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Sub Articles Column */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {subArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/news/${article.slug}`}
                  className="p-4 rounded-xl bg-[#12151C] border border-[#262B38] hover:border-[#D4AF37]/50 flex gap-4 transition-all group"
                >
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-[#161922]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex flex-col justify-between flex-1 min-w-0">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[9px] font-heading font-bold uppercase text-[#D4AF37] truncate">
                          {article.category}
                        </span>
                        <span className="text-[9px] text-[#9AA3B2] font-mono shrink-0">
                          {article.region}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-heading font-bold text-white group-hover:text-[#D4AF37] transition-colors line-clamp-2 leading-tight">
                        {article.title}
                      </h4>
                    </div>
                    <span className="text-[10px] text-[#9AA3B2] font-mono mt-1">
                      {article.date} • {article.readTime}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== 4. PROFIL UNGGULAN (CAROUSEL) ==================== */}
        <section className="w-full bg-[#0E1117] border-y border-[#262B38] py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex flex-col">
                <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#D4AF37]">
                  Katalog Terverifikasi ESI
                </span>
                <h2 className="text-2xl sm:text-3xl font-heading font-bold uppercase tracking-tight text-white mt-1">
                  Profil & Tim Unggulan
                </h2>
              </div>
              <Link
                href="/gallery"
                className="flex items-center gap-1.5 text-xs font-heading font-bold uppercase tracking-wider text-[#D4AF37] hover:underline"
              >
                <span>Buka Galeri 12 Kartu</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Horizontal Scrollable Carousel */}
            <div className="flex items-center gap-6 overflow-x-auto pb-6 pt-2 scrollbar-thin scrollbar-thumb-[#262B38] scrollbar-track-transparent">
              {featuredCards.map((card) => (
                <div key={card.id} className="shrink-0">
                  <EsportCard
                    type={card.type}
                    rarity={card.rarity}
                    verification={card.verification}
                    data={card.data}
                    size="md"
                    interactive={true}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== 5. CARA KERJA SISTEM ==================== */}
        <section id="how-it-works" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#D4AF37]">
              Mekanisme Tata Kelola
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-black uppercase tracking-tight text-white mt-1 mb-3">
              Bagaimana Verifikasi Bekerja?
            </h2>
            <p className="text-sm text-[#9AA3B2] leading-relaxed">
              Tiga langkah transparan untuk memperoleh identitas digital resmi atlet dan klub esport Sumatera Barat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-[#12151C] border border-[#262B38] flex flex-col gap-4 relative">
              <div className="w-10 h-10 rounded-xl bg-[#1A1E28] border border-[#262B38] flex items-center justify-center font-heading font-black text-lg text-white">
                01
              </div>
              <h3 className="text-lg font-heading font-bold text-white uppercase tracking-wider">
                Daftar & Terbitkan ESPORT ID
              </h3>
              <p className="text-xs text-[#9AA3B2] leading-relaxed">
                Buat akun, pilih peran (Player/Pelatih/Tim), isi data profil dan unggah bukti akun game. Kartu otomatis terbit dengan frame <strong>Rookie</strong>.
              </p>
              <div className="mt-auto pt-3 border-t border-[#262B38]/60 text-[11px] text-gray-400 font-mono">
                Status: <span className="text-gray-300">Submitted</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-[#12151C] border border-[#22C55E]/40 flex flex-col gap-4 relative">
              <div className="w-10 h-10 rounded-xl bg-[#22C55E]/15 border border-[#22C55E]/40 flex items-center justify-center font-heading font-black text-lg text-[#22C55E]">
                02
              </div>
              <h3 className="text-lg font-heading font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <span>Validasi ESI Kab/Kota</span>
              </h3>
              <p className="text-xs text-[#9AA3B2] leading-relaxed">
                Pengurus Cabang ESI di daerah domisili Anda memeriksa kesesuaian data. Setelah lolos, kartu Anda disematkan perisai hijau <strong>Regional Checked</strong>.
              </p>
              <div className="mt-auto pt-3 border-t border-[#262B38]/60 text-[11px] text-[#22C55E] font-mono">
                Status: <span>District Approved</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-[#12151C] border border-[#D4AF37]/40 flex flex-col gap-4 relative">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center font-heading font-black text-lg text-[#D4AF37]">
                03
              </div>
              <h3 className="text-lg font-heading font-bold text-white uppercase tracking-wider">
                Verifikasi Resmi ESI Sumbar
              </h3>
              <p className="text-xs text-[#9AA3B2] leading-relaxed">
                Pengurus Provinsi ESI Sumbar memberikan pengesahan resmi tingkat provinsi, nomor register lencana digital, dan status <strong>Verified</strong> resmi (berlaku 12 bulan).
              </p>
              <div className="mt-auto pt-3 border-t border-[#262B38]/60 text-[11px] text-[#D4AF37] font-mono">
                Status: <span>Verified (Resmi)</span>
              </div>
            </div>
          </div>

          {/* Reminder Notice */}
          <div className="mt-8 p-4 rounded-xl bg-[#1A1E28]/70 border border-[#262B38] flex items-center gap-3 text-xs text-[#9AA3B2] max-w-3xl mx-auto">
            <Info className="w-5 h-5 text-[#D4AF37] shrink-0" />
            <p>
              <strong>Prinsip P1 PRD:</strong> Frame kartu (Rookie/Contender/Elite/Legend) menunjukkan tingkatan prestasi, sedangkan Lencana perisai menunjukkan status legalitas kelembagaan ESI. Keduanya independen.
            </p>
          </div>
        </section>

        {/* ==================== 6. AJAKAN KOLABORASI EKOSISTEM ==================== */}
        <section className="w-full bg-[#12151C] border-t border-[#262B38] py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#D4AF37]">
                Kolaborasi Ekosistem
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold uppercase tracking-tight text-white mt-1">
                Bersama Membangun Esport Sumatera Barat
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Box 1: ESI Daerah */}
              <div className="p-6 rounded-2xl bg-[#0B0D12] border border-[#262B38] flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#1A1E28] flex items-center justify-center text-[#22C55E] mb-4">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-bold text-base text-white uppercase tracking-wider mb-2">
                    Pengurus ESI Kab / Kota
                  </h3>
                  <p className="text-xs text-[#9AA3B2] leading-relaxed mb-4">
                    Akses antrean pemeriksaan wilayah Anda, kelola data pengurus, dan validasi atlet potensial daerah menuju kejuaraan resmi.
                  </p>
                </div>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-[#D4AF37] hover:underline uppercase"
                >
                  <span>Portal Admin Daerah</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Box 2: Komunitas & Sekolah */}
              <div className="p-6 rounded-2xl bg-[#0B0D12] border border-[#262B38] flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#1A1E28] flex items-center justify-center text-[#3B82F6] mb-4">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-bold text-base text-white uppercase tracking-wider mb-2">
                    Ekskul & UKM Kampus
                  </h3>
                  <p className="text-xs text-[#9AA3B2] leading-relaxed mb-4">
                    Daftarkan wadah esports sekolah dan kampus Anda untuk mendapatkan pembinaan terarah serta akses turnamen resmi antar-pelajar.
                  </p>
                </div>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-[#3B82F6] hover:underline uppercase"
                >
                  <span>Daftarkan Organisasi</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Box 3: Venue & iCafe */}
              <div className="p-6 rounded-2xl bg-[#0B0D12] border border-[#262B38] flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#1A1E28] flex items-center justify-center text-[#D4AF37] mb-4">
                    <Coffee className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-bold text-base text-white uppercase tracking-wider mb-2">
                    Venue, iCafe & Arena
                  </h3>
                  <p className="text-xs text-[#9AA3B2] leading-relaxed mb-4">
                    Registrasikan venue Anda ke dalam direktori resmi agar dikenal oleh penyelenggara kompetisi dan komunitas turnamen lokal.
                  </p>
                </div>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-[#D4AF37] hover:underline uppercase"
                >
                  <span>Daftarkan Venue</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      </div>
    </>
  );
}
