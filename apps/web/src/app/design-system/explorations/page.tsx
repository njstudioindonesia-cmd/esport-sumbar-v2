"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  Layers,
  Monitor,
  Smartphone,
  Tablet,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Share2,
  Lock,
  Eye,
  Edit3,
  Calendar,
  MapPin,
  Trophy,
  Users,
  Gamepad2,
  Building2,
  GraduationCap,
  Briefcase,
  Play,
  Pause,
  Sliders,
  Check,
} from "lucide-react";
import { BrandLogo } from "@/components/brand";

type Direction = "A" | "B" | "C";
type ViewKey = "home" | "profile" | "onboarding";
type Viewport = "1920" | "1440" | "1280" | "tablet" | "mobile";

export default function VisualExplorationPage() {
  const [direction, setDirection] = useState<Direction>("B");
  const [view, setView] = useState<ViewKey>("home");
  const [viewport, setViewport] = useState<Viewport>("1440");
  const [isPlayingBanner, setIsPlayingBanner] = useState(true);
  const [activeBannerSlide, setActiveBannerSlide] = useState(0);
  const [selectedBranch, setSelectedBranch] = useState("player");
  const [ownerMode, setOwnerMode] = useState(true);

  // 7 Bidang Resmi (Section 3.6: satu kata + satu ikon)
  const BRANCHES = [
    { id: "player", label: "Pemain", icon: Gamepad2, desc: "Atlet kompetitif" },
    { id: "coach", label: "Pelatih", icon: Trophy, desc: "Peracik strategi" },
    { id: "team", label: "Tim", icon: Users, desc: "Klub & roster" },
    { id: "community", label: "Komunitas", icon: Sparkles, desc: "Pegiat & suporter" },
    { id: "venue", label: "Venue", icon: Building2, desc: "Arena & gaming cafe" },
    { id: "campus", label: "Kampus", icon: GraduationCap, desc: "Unit kegiatan kampus" },
    { id: "school", label: "Sekolah", icon: Briefcase, desc: "Ekskul & akademi" },
  ];

  const VIEWPORT_WIDTHS: Record<Viewport, string> = {
    "1920": "max-w-[1920px]",
    "1440": "max-w-[1440px]",
    "1280": "max-w-[1280px]",
    tablet: "max-w-[768px]",
    mobile: "max-w-[390px]",
  };

  return (
    <div className="min-h-screen bg-[#03030E] text-white flex flex-col font-sans selection:bg-[#FF1752]/30 selection:text-white">
      {/* TOP CONTROLLER BAR */}
      <header className="sticky top-0 z-50 bg-[#05051A]/95 backdrop-blur-md border-b border-white/[0.08] px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/design-system"
              className="text-xs text-white/50 hover:text-white transition-colors"
            >
              ← Desain Sistem
            </Link>
            <span className="text-white/20">|</span>
            <span className="text-xs font-mono font-bold text-[#FF1752] uppercase tracking-wider">
              Bagian 4.3: Eksplorasi 3 Arah Visual
            </span>
          </div>

          {/* VIEW SWITCHER */}
          <div className="flex items-center bg-[#0C0C26] p-1 rounded-lg border border-white/10 text-xs">
            <button
              onClick={() => setView("home")}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                view === "home"
                  ? "bg-[#FF1752] text-white"
                  : "text-white/70 hover:text-white"
              }`}
            >
              1. Beranda
            </button>
            <button
              onClick={() => setView("profile")}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                view === "profile"
                  ? "bg-[#FF1752] text-white"
                  : "text-white/70 hover:text-white"
              }`}
            >
              2. Profil / Mode Pemilik
            </button>
            <button
              onClick={() => setView("onboarding")}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                view === "onboarding"
                  ? "bg-[#FF1752] text-white"
                  : "text-white/70 hover:text-white"
              }`}
            >
              3. Pilih Bidang
            </button>
          </div>

          {/* DIRECTION SWITCHER */}
          <div className="flex items-center bg-[#0C0C26] p-1 rounded-lg border border-white/10 text-xs">
            <button
              onClick={() => setDirection("A")}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                direction === "A"
                  ? "bg-white text-black font-bold shadow"
                  : "text-white/70 hover:text-white"
              }`}
            >
              A. Obsidian Editorial
            </button>
            <button
              onClick={() => setDirection("B")}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                direction === "B"
                  ? "bg-[#D4AF37] text-black font-bold shadow"
                  : "text-white/70 hover:text-white"
              }`}
            >
              B. Matte Glass (Default)
            </button>
            <button
              onClick={() => setDirection("C")}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                direction === "C"
                  ? "bg-[#FF1752] text-white font-bold shadow"
                  : "text-white/70 hover:text-white"
              }`}
            >
              C. Arena Poster
            </button>
          </div>

          {/* VIEWPORT CONTROLLER */}
          <div className="flex items-center gap-1 bg-[#0C0C26] p-1 rounded-lg border border-white/10 text-xs">
            <button
              onClick={() => setViewport("1920")}
              className={`p-1.5 rounded hover:bg-white/10 transition-colors ${
                viewport === "1920" ? "text-[#FF1752]" : "text-white/50"
              }`}
              title="1920px (Ultra-wide)"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewport("1440")}
              className={`p-1.5 rounded hover:bg-white/10 transition-colors ${
                viewport === "1440" ? "text-[#FF1752]" : "text-white/50"
              }`}
              title="1440px (Desktop)"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewport("1280")}
              className={`p-1.5 rounded hover:bg-white/10 transition-colors ${
                viewport === "1280" ? "text-[#FF1752]" : "text-white/50"
              }`}
              title="1280px (Laptop)"
            >
              <span className="text-[10px] font-mono font-bold">1280</span>
            </button>
            <button
              onClick={() => setViewport("tablet")}
              className={`p-1.5 rounded hover:bg-white/10 transition-colors ${
                viewport === "tablet" ? "text-[#FF1752]" : "text-white/50"
              }`}
              title="768px (Tablet)"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewport("mobile")}
              className={`p-1.5 rounded hover:bg-white/10 transition-colors ${
                viewport === "mobile" ? "text-[#FF1752]" : "text-white/50"
              }`}
              title="390px (Mobile)"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* METADATA BANNER & DIRECTION SUMMARY */}
      <div className="bg-[#0A0A24] border-b border-white/[0.06] px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between text-xs gap-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-white/10 font-mono text-[10px] text-white/80">
              Arah Aktif: {direction === "A" ? "A. Obsidian Editorial" : direction === "B" ? "B. Matte Glass" : "C. Arena Poster"}
            </span>
            <span className="text-white/60">
              {direction === "A" && "Tipografis, lapang, foto besar, tanpa kontainer bertumpuk, elegan hening."}
              {direction === "B" && "Permukaan matte bertingkat, header/overlay berkaca halus, kartu seperti objek nyata."}
              {direction === "C" && "Blok geometris miring 15°, tipografi poster atletik, energi turnamen disiplin."}
            </span>
          </div>
          <div className="flex items-center gap-2 text-white/40 font-mono text-[11px]">
            <span>[DATA SIMULASI RISET DESAIN — BEBAS DUMMY]</span>
          </div>
        </div>
      </div>

      {/* PREVIEW CONTAINER */}
      <main className="flex-1 flex justify-center p-4 md:p-8 overflow-x-auto">
        <div
          className={`w-full ${VIEWPORT_WIDTHS[viewport]} transition-all duration-300 bg-[#05051A] rounded-2xl border border-white/10 overflow-hidden shadow-2xl flex flex-col`}
        >
          {/* DIRECTION-AWARE NAV HEADER */}
          <NavHeader direction={direction} />

          {/* VIEW CONTENT */}
          {view === "home" && (
            <HomeView
              direction={direction}
              isPlayingBanner={isPlayingBanner}
              setIsPlayingBanner={setIsPlayingBanner}
              activeBannerSlide={activeBannerSlide}
              setActiveBannerSlide={setActiveBannerSlide}
            />
          )}

          {view === "profile" && (
            <ProfileView
              direction={direction}
              ownerMode={ownerMode}
              setOwnerMode={setOwnerMode}
            />
          )}

          {view === "onboarding" && (
            <OnboardingView
              direction={direction}
              branches={BRANCHES}
              selectedBranch={selectedBranch}
              setSelectedBranch={setSelectedBranch}
            />
          )}

          {/* MINIMALIST FOOTER */}
          <NavFooter direction={direction} />
        </div>
      </main>
    </div>
  );
}

// =========================================================================
// 1. MINIMALIST HEADER COMPONENT (Section 3.7)
// =========================================================================
function NavHeader({ direction }: { direction: Direction }) {
  return (
    <header
      className={`w-full px-6 py-4 flex items-center justify-between border-b ${
        direction === "A"
          ? "bg-[#05051A] border-white/[0.08]"
          : direction === "B"
          ? "bg-[#05051A]/80 backdrop-blur-md border-white/[0.08]"
          : "bg-[#080820] border-white/[0.12] border-b-2 border-b-[#FF1752]/40"
      }`}
    >
      {/* KIRI: Logo Mark V-S Transparan */}
      <div className="flex items-center gap-3">
        <BrandLogo variant="responsive" size="md" withLink={false} />
      </div>

      {/* TENGAH: 5 Tautan Teks Maksimal */}
      <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
        <span className="text-white relative cursor-pointer pb-1">
          Jelajah
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF1752] rounded-full" />
        </span>
        <span className="text-white/70 hover:text-white transition-colors cursor-pointer">
          Ekosistem
        </span>
        <span className="text-white/70 hover:text-white transition-colors cursor-pointer">
          Berita
        </span>
        <span className="text-white/70 hover:text-white transition-colors cursor-pointer">
          Daerah
        </span>
        <span className="text-white/70 hover:text-white transition-colors cursor-pointer">
          Tentang
        </span>
      </nav>

      {/* KANAN: Search (⌘K) & Satu Tombol Primer / Avatar */}
      <div className="flex items-center gap-3">
        <button
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white/50 hover:text-white/80 transition-colors"
          title="Pencarian Cepat"
        >
          <span>Cari...</span>
          <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono">⌘K</kbd>
        </button>

        <button
          className={`px-4 py-2 text-xs font-bold transition-all ${
            direction === "A"
              ? "rounded-md bg-[#FF1752] text-white hover:bg-[#E01246]"
              : direction === "B"
              ? "rounded-lg bg-[#FF1752] text-white shadow-md hover:bg-[#E01246]"
              : "rounded-none skew-x-[-10deg] bg-[#FF1752] text-white px-5 uppercase tracking-wider"
          }`}
        >
          <span className={direction === "C" ? "inline-block skew-x-[10deg]" : ""}>
            Masuk
          </span>
        </button>
      </div>
    </header>
  );
}

// =========================================================================
// 2. MINIMALIST FOOTER COMPONENT (Section 3.7)
// =========================================================================
function NavFooter({ direction }: { direction: Direction }) {
  return (
    <footer
      className={`w-full mt-auto border-t ${
        direction === "A"
          ? "border-white/[0.06] bg-[#03030E] p-8 md:p-12"
          : direction === "B"
          ? "border-white/[0.08] bg-[#05051A] p-8 md:p-12"
          : "border-white/[0.12] bg-[#07071E] p-8 md:p-12"
      }`}
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* BRAND COLUMN */}
          <div className="flex flex-col gap-3 md:col-span-1">
            <BrandLogo variant="lockup" size="sm" withLink={false} />
            <p className="text-xs text-white/50 leading-relaxed max-w-xs">
              Rumah resmi ekosistem olahraga elektronik 19 Kota dan Kabupaten Sumatera Barat.
            </p>
          </div>

          {/* 3 LINK COLUMNS */}
          <div className="flex flex-col gap-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Platform</h4>
            <span className="text-xs text-white/60 hover:text-white cursor-pointer transition-colors">
              Jelajah Direktori
            </span>
            <span className="text-xs text-white/60 hover:text-white cursor-pointer transition-colors">
              Penerbitan Kartu
            </span>
            <span className="text-xs text-white/60 hover:text-white cursor-pointer transition-colors">
              Standar Verifikasi
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Informasi</h4>
            <span className="text-xs text-white/60 hover:text-white cursor-pointer transition-colors">
              Tentang Kami
            </span>
            <span className="text-xs text-white/60 hover:text-white cursor-pointer transition-colors">
              Warta & Prestasi
            </span>
            <span className="text-xs text-white/60 hover:text-white cursor-pointer transition-colors">
              Hubungi Pengurus
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Legalitas</h4>
            <span className="text-xs text-white/60 hover:text-white cursor-pointer transition-colors">
              Syarat & Ketentuan
            </span>
            <span className="text-xs text-white/60 hover:text-white cursor-pointer transition-colors">
              Kebijakan Privasi
            </span>
            <span className="text-xs text-white/60 hover:text-white cursor-pointer transition-colors">
              Pedoman Konten
            </span>
          </div>
        </div>

        {/* BOTTOM LEGAL BAR */}
        <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between text-[11px] text-white/40 gap-3">
          <span>© 2026 ESPORT SUMBAR. Hak cipta dilindungi undang-undang.</span>
          <span>Perkumpulan Olahraga Elektronik Sumatera Barat.</span>
        </div>
      </div>
    </footer>
  );
}

// =========================================================================
// 3. BERANDA (HOMEPAGE) VIEW (Section 3.8 & 3.9)
// =========================================================================
function HomeView({
  direction,
  isPlayingBanner,
  setIsPlayingBanner,
  activeBannerSlide,
  setActiveBannerSlide,
}: {
  direction: Direction;
  isPlayingBanner: boolean;
  setIsPlayingBanner: (val: boolean) => void;
  activeBannerSlide: number;
  setActiveBannerSlide: (val: number) => void;
}) {
  const BANNERS = [
    {
      title: "Piala Ranah Minang Esport 2026",
      sponsor: "ESPORT SUMBAR Arena",
      cta: "Lihat Jadwal",
      badge: "Turnamen Terbuka",
    },
    {
      title: "Pendaftaran Verifikasi Liga Sekolah Terbuka",
      sponsor: "Komunitas Esport Pelajar",
      cta: "Daftar Sekolah",
      badge: "Mitra Ekosistem",
    },
  ];

  return (
    <div className="flex flex-col gap-16 md:gap-24 p-6 md:p-12">
      {/* 1. HERO SECTION (Single Value Prop <= 8 kata, 1 Card Object, 1 Primary Button, 1 Text Link) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="inline-flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-[#FF1752]/15 border border-[#FF1752]/30 text-[11px] font-bold text-[#FF4D77] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              Identitas Resmi Olahraga Elektronik
            </span>
          </div>

          {/* Heading <= 8 kata */}
          <h1
            className={`tracking-tight ${
              direction === "A"
                ? "text-4xl sm:text-6xl font-light text-white leading-[1.08]"
                : direction === "B"
                ? "text-4xl sm:text-5xl font-extrabold text-white leading-tight"
                : "text-4xl sm:text-6xl font-black uppercase text-white tracking-tighter"
            }`}
          >
            Rumah Identitas Digital Atlet Sumatera Barat.
          </h1>

          <p className="text-sm sm:text-base text-white/60 leading-relaxed max-w-xl">
            Satu ekosistem terpadu untuk pencatatan prestasi, kartu digital atlet, dan direktori 19 Kota dan Kabupaten.
          </p>

          {/* Satu tombol utama + satu tautan teks */}
          <div className="flex items-center gap-4 pt-2">
            <button
              className={`px-6 py-3 text-sm font-bold transition-all ${
                direction === "A"
                  ? "rounded-md bg-[#FF1752] text-white hover:bg-[#E01246]"
                  : direction === "B"
                  ? "rounded-xl bg-[#FF1752] text-white shadow-lg shadow-[#FF1752]/20 hover:bg-[#E01246]"
                  : "rounded-none skew-x-[-10deg] bg-[#FF1752] text-white px-8 uppercase tracking-wide font-black"
              }`}
            >
              <span className={direction === "C" ? "inline-block skew-x-[10deg]" : ""}>
                Buat Kartu
              </span>
            </button>
            <span className="text-sm font-medium text-white/70 hover:text-white cursor-pointer transition-colors inline-flex items-center gap-1">
              Jelajahi Direktori <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </div>

        {/* HERO VISUAL: Satu Objek Kartu Digital Bersih (Tanpa Orang Palsu) */}
        <div className="lg:col-span-5 flex justify-center">
          <div
            className={`w-72 sm:w-80 aspect-[1/1.55] p-5 flex flex-col justify-between transition-all ${
              direction === "A"
                ? "bg-[#090920] border border-white/10 rounded-xl"
                : direction === "B"
                ? "bg-gradient-to-b from-[#14143A] to-[#0A0A26] border border-white/[0.12] rounded-3xl shadow-2xl relative overflow-hidden"
                : "bg-[#0D0D2E] border-2 border-[#FF1752]/50 rounded-none relative clip-diagonal"
            }`}
          >
            {/* Top Bar of Card */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#FF1752] flex items-center justify-center font-black text-xs">
                  V
                </div>
                <span className="text-xs font-bold text-white/90">ESPORT SUMBAR</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37]">
                TERVERIFIKASI
              </span>
            </div>

            {/* Central Graphic Silhouette (Official V-S Mark, No Fake Stock Photo) */}
            <div className="my-auto flex flex-col items-center justify-center py-6 text-center">
              <div className="w-24 h-24 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center mb-3">
                <Gamepad2 className="w-10 h-10 text-white/60" />
              </div>
              <span className="text-xs font-mono text-white/40">KARTU ATLET RESMI</span>
              <span className="text-lg font-black text-white mt-1">SUMATERA BARAT</span>
            </div>

            {/* Bottom Card Attributes */}
            <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs">
              <div className="flex flex-col">
                <span className="text-[10px] text-white/40">DIVISI</span>
                <span className="font-bold text-white">PRO ATLET</span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-[10px] text-white/40">WILAYAH</span>
                <span className="font-bold text-white">19 DAERAH</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ACCESSIBLE BANNER SLIDER (Section 3.9) */}
      <section
        className={`p-6 border ${
          direction === "A"
            ? "bg-[#06061E] border-white/[0.08] rounded-xl"
            : direction === "B"
            ? "bg-[#0C0C26] border-white/[0.08] rounded-2xl"
            : "bg-[#0B0B2A] border-white/[0.12] rounded-none"
        }`}
        aria-roledescription="carousel"
        aria-label="Pengumuman dan Banner Resmi"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-mono font-bold text-white/70">
              {BANNERS[activeBannerSlide].badge}
            </span>
            <span className="text-xs text-white/50">
              Sponsor: {BANNERS[activeBannerSlide].sponsor}
            </span>
          </div>

          {/* Pause / Play Control (WCAG 2.2.2 requirement) */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlayingBanner(!isPlayingBanner)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 transition-colors"
              aria-label={isPlayingBanner ? "Jeda rotasi otomatis" : "Putar rotasi otomatis"}
            >
              {isPlayingBanner ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <div className="flex gap-1.5">
              {BANNERS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveBannerSlide(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    idx === activeBannerSlide ? "bg-[#FF1752] w-6" : "bg-white/20"
                  }`}
                  aria-label={`Beralih ke slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-2">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              {BANNERS[activeBannerSlide].title}
            </h3>
            <p className="text-xs text-white/60 mt-1">
              Informasi jadwal babak penyisihan dan kualifikasi daerah se-Sumatera Barat.
            </p>
          </div>
          <button className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors">
            {BANNERS[activeBannerSlide].cta}
          </button>
        </div>
      </section>

      {/* 3. EKOSISTEM 7 BIDANG (Connected Visual, No trust badges) */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-white">Ekosistem Olahraga Elektronik</h2>
          <p className="text-xs text-white/50">Tujuh pilar terhubung dalam satu tata kelola resmi.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { label: "Pemain", icon: Gamepad2 },
            { label: "Pelatih", icon: Trophy },
            { label: "Tim", icon: Users },
            { label: "Komunitas", icon: Sparkles },
            { label: "Venue", icon: Building2 },
            { label: "Kampus", icon: GraduationCap },
            { label: "Sekolah", icon: Briefcase },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`p-4 flex flex-col items-center justify-center gap-2.5 text-center transition-all cursor-pointer ${
                direction === "A"
                  ? "border border-white/[0.08] hover:border-white/30 rounded-lg bg-transparent"
                  : direction === "B"
                  ? "bg-[#0C0C26] hover:bg-[#14143A] border border-white/[0.08] rounded-2xl"
                  : "bg-[#0A0A26] border border-white/[0.12] rounded-none hover:border-[#FF1752]"
              }`}
            >
              <item.icon className="w-5 h-5 text-[#FF1752]" />
              <span className="text-xs font-bold text-white">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. STRATEGI SITUS BARU: TAMPILAN KOSONG ELEGAN (Section 3.8: Tidak ada angka 0) */}
      <section
        className={`p-8 text-center flex flex-col items-center justify-center gap-3 border ${
          direction === "A"
            ? "border-white/[0.08] rounded-xl bg-transparent"
            : direction === "B"
            ? "border-white/[0.08] rounded-2xl bg-[#0A0A26]"
            : "border-white/[0.12] rounded-none bg-[#080822]"
        }`}
      >
        <span className="w-10 h-10 rounded-full bg-[#FF1752]/10 flex items-center justify-center text-[#FF1752]">
          <Sparkles className="w-5 h-5" />
        </span>
        <h3 className="text-base font-bold text-white">Jadilah Atlet Terdaftar Pertama</h3>
        <p className="text-xs text-white/50 max-w-md">
          Sistem identitas digital baru saja diluncurkan. Daftarkan diri Anda atau klub Anda untuk mendapatkan nomor lisensi resmi.
        </p>
        <button className="mt-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors">
          Mulai Pendaftaran
        </button>
      </section>

      {/* 5. CLOSING CTA (1 Kalimat + 1 Tombol Sesuai Aturan) */}
      <section className="text-center py-6 flex flex-col items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-white">
          Wujudkan prestasi olahraga elektronik Sumatera Barat sekarang.
        </h2>
        <button
          className={`px-8 py-3.5 text-sm font-bold transition-all ${
            direction === "A"
              ? "rounded-md bg-[#FF1752] text-white hover:bg-[#E01246]"
              : direction === "B"
              ? "rounded-xl bg-[#FF1752] text-white shadow-lg hover:bg-[#E01246]"
              : "rounded-none skew-x-[-10deg] bg-[#FF1752] text-white px-10 uppercase tracking-wide font-black"
          }`}
        >
          <span className={direction === "C" ? "inline-block skew-x-[10deg]" : ""}>
            Daftar Sekarang
          </span>
        </button>
      </section>
    </div>
  );
}

// =========================================================================
// 4. PROFIL PUBLIK / MODE PEMILIK (Section 3.11: Tanpa dashboard shell terpisah)
// =========================================================================
function ProfileView({
  direction,
  ownerMode,
  setOwnerMode,
}: {
  direction: Direction;
  ownerMode: boolean;
  setOwnerMode: (val: boolean) => void;
}) {
  return (
    <div className="flex flex-col gap-8 p-6 md:p-12">
      {/* MODE PEMILIK TOGGLE BAR (Hanya terlihat pemilik, menyatu dalam tata letak utama) */}
      <div
        className={`p-3.5 flex flex-wrap items-center justify-between gap-3 border ${
          direction === "A"
            ? "bg-[#090924] border-white/[0.08] rounded-lg"
            : direction === "B"
            ? "bg-[#0C0C26] border-white/[0.08] rounded-xl"
            : "bg-[#0A0A26] border-l-4 border-l-[#FF1752] border-white/[0.12] rounded-none"
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#2BB673]" />
          <span className="text-xs font-bold text-white">
            {ownerMode ? "Mode Pemilik Aktif" : "Pratinjau Tampilan Publik"}
          </span>
          <span className="text-[11px] text-white/40 hidden sm:inline">
            (Halaman ini adalah profil Anda sendiri)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {ownerMode && (
            <>
              <button className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-xs text-white font-medium flex items-center gap-1.5 transition-colors">
                <Edit3 className="w-3.5 h-3.5" />
                Edit Profil
              </button>
              <button className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-xs text-white font-medium flex items-center gap-1.5 transition-colors">
                <Share2 className="w-3.5 h-3.5" />
                Bagikan
              </button>
              <span className="px-2.5 py-1 rounded-md bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Terverifikasi
              </span>
            </>
          )}

          <button
            onClick={() => setOwnerMode(!ownerMode)}
            className="px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 text-xs text-white/70 font-mono transition-colors"
          >
            {ownerMode ? "Lihat Publik" : "Kembali Mode Pemilik"}
          </button>
        </div>
      </div>

      {/* PROFIL KONTEN DUA KOLOM */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* KOLOM KIRI: KARTU DIGITAL PEMAIN (Bahan Fisik Satin Silver / Contender) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div
            className={`w-full max-w-[340px] aspect-[1/1.55] p-6 flex flex-col justify-between border ${
              direction === "A"
                ? "bg-[#07071E] border-white/10 rounded-xl"
                : direction === "B"
                ? "bg-[#0C0C26] border-white/[0.12] rounded-3xl shadow-xl"
                : "bg-[#0D0D2E] border-2 border-[#FF1752]/40 rounded-none"
            }`}
          >
            {/* Header Kartu */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-white/50">ESB-PDG-PL-0001</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> VERIFIED
              </span>
            </div>

            {/* Avatar & Identitas */}
            <div className="my-auto flex flex-col items-center text-center">
              <div className="w-28 h-28 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-3">
                <Gamepad2 className="w-12 h-12 text-white/50" />
              </div>
              <span className="text-xs text-white/40 uppercase tracking-wider font-mono">Mobile Legends</span>
              <h3 className="text-xl font-black text-white uppercase mt-0.5">Sutan Gamer</h3>
              <span className="text-xs text-white/60">Kota Padang</span>
            </div>

            {/* Rarity & Division */}
            <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-white/40 block">TINGKAT</span>
                <span className="font-bold text-[#D4AF37]">CONTENDER</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-white/40 block">BIDANG</span>
                <span className="font-bold text-white">PEMAIN</span>
              </div>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: DETAIL PROFIL, EKOSISTEM, & PRESTASI */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-black uppercase text-white">Sutan Gamer</h2>
              <span className="p-1 rounded-full bg-[#D4AF37]/20 text-[#D4AF37]">
                <ShieldCheck className="w-4 h-4" />
              </span>
            </div>
            <p className="text-xs sm:text-sm text-white/60">
              Atlet cabang Mobile Legends: Bang Bang asal Kota Padang. Aktif bertanding di turnamen daerah Sumatera Barat.
            </p>
          </div>

          {/* DETAIL METRIK */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-[#0C0C26] border border-white/[0.08] flex flex-col">
              <span className="text-[10px] text-white/40 uppercase font-mono">Wilayah</span>
              <span className="text-sm font-bold text-white mt-1">Kota Padang</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#0C0C26] border border-white/[0.08] flex flex-col">
              <span className="text-[10px] text-white/40 uppercase font-mono">Game Utama</span>
              <span className="text-sm font-bold text-white mt-1">MLBB</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#0C0C26] border border-white/[0.08] flex flex-col">
              <span className="text-[10px] text-white/40 uppercase font-mono">Status Lisensi</span>
              <span className="text-sm font-bold text-[#2BB673] mt-1">Aktif 2026</span>
            </div>
          </div>

          {/* EKOSISTEM TERHUBUNG (Tim & Komunitas) */}
          <div className="flex flex-col gap-3 pt-4 border-t border-white/[0.08]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/70">
              Hubungan Ekosistem
            </h4>
            <div className="p-4 rounded-xl bg-[#0C0C26] border border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-[#FF1752]" />
                <div>
                  <span className="text-xs font-bold text-white block">Minang Pride Esports</span>
                  <span className="text-[11px] text-white/40">Status: Anggota Inti Roster</span>
                </div>
              </div>
              <span className="text-xs text-white/60 font-mono">Terverifikasi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// 5. ONBOARDING (PILIH BIDANG) VIEW (Section 3.6: Anggaran Teks <= 30 kata)
// =========================================================================
function OnboardingView({
  direction,
  branches,
  selectedBranch,
  setSelectedBranch,
}: {
  direction: Direction;
  branches: Array<{ id: string; label: string; icon: any; desc: string }>;
  selectedBranch: string;
  setSelectedBranch: (val: string) => void;
}) {
  return (
    <div className="flex flex-col items-center max-w-3xl mx-auto py-12 px-6 text-center gap-8">
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-mono uppercase tracking-wider text-[#FF1752]">
          Langkah 1 dari 4
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          Pilih Bidang Pendaftaran
        </h2>
        {/* Anggaran teks sangat ketat: hanya 1 kalimat singkat */}
        <p className="text-xs text-white/50">
          Satu akun mewakili satu peran resmi dalam ekosistem.
        </p>
      </div>

      {/* 7 PILIHAN BIDANG (Satu kata + satu ikon per pilihan) */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {branches.map((b) => {
          const isSelected = selectedBranch === b.id;
          return (
            <div
              key={b.id}
              onClick={() => setSelectedBranch(b.id)}
              className={`p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                isSelected
                  ? "border-[#FF1752] bg-[#FF1752]/10"
                  : "border-white/[0.08] bg-[#0C0C26] hover:bg-[#14143A]"
              } ${
                direction === "A"
                  ? "border rounded-md"
                  : direction === "B"
                  ? "border rounded-2xl"
                  : "border-2 rounded-none"
              }`}
            >
              <b.icon className={`w-6 h-6 ${isSelected ? "text-[#FF1752]" : "text-white/60"}`} />
              <span className={`text-xs font-bold ${isSelected ? "text-[#FF1752]" : "text-white"}`}>
                {b.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Satu Tombol Primer Lanjutkan */}
      <div className="pt-4 w-full max-w-xs">
        <button
          className={`w-full py-3 text-xs font-bold transition-all ${
            direction === "A"
              ? "rounded-md bg-[#FF1752] text-white hover:bg-[#E01246]"
              : direction === "B"
              ? "rounded-xl bg-[#FF1752] text-white shadow-lg shadow-[#FF1752]/20 hover:bg-[#E01246]"
              : "rounded-none skew-x-[-10deg] bg-[#FF1752] text-white uppercase tracking-wider font-black"
          }`}
        >
          <span className={direction === "C" ? "inline-block skew-x-[10deg]" : ""}>
            Lanjutkan
          </span>
        </button>
      </div>
    </div>
  );
}
