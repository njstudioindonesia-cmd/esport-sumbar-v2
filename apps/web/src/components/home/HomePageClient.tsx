"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Compass,
  ChevronRight,
  ShieldCheck,
  Award,
  RotateCw,
  MapPin,
  Trophy,
  ArrowRight,
  Database,
  CheckCircle2,
  FileCheck,
  Newspaper,
  Users,
  Gamepad2,
  Building2,
  GraduationCap,
  Flame,
  Layers,
  Share2,
} from "lucide-react";
import { FLAGS } from "@/lib/config/flags";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EsportCard } from "@/components/card/EsportCard";
import { StatNumber } from "@/components/shared/StatNumber";
import {
  BrandLogo,
  BrandSlash,
  BrandWatermark,
  IssuedBy,
} from "@/components/brand";
import { GlassSurface } from "@/components/glass/GlassSurface";
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from "@/components/glass/GlassCard";
import { GlassBadge, GlassStatusBadge } from "@/components/glass/GlassBadge";
import { GlassButton } from "@/components/glass/GlassButton";
import { SpecularLayer } from "@/components/glass/SpecularLayer";
import {
  GlassNumberCounter,
  ScrollReveal,
  MOTION_SPRINGS,
  MOTION_DURATIONS,
  MOTION_EASINGS,
} from "@/components/glass";
import { mapVerificationToCard } from "@/types/card";
import { GALLERY_CARDS } from "@/data/mockCards";
import { MOCK_NEWS } from "@/data/mockNews";
import { REGIONS_DETAIL } from "@/data/regions";
import { createClient } from "@/lib/supabase/client";
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
  const [liveArticles, setLiveArticles] = useState<PublicArticle[]>(articles);
  const [activeHeroIdx, setActiveHeroIdx] = useState(0);

  useEffect(() => {
    setLiveArticles(articles);
  }, [articles]);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("home-news-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "articles",
        },
        async () => {
          try {
            const res = await fetch("/api/news?status=published");
            if (res.ok) {
              const json = await res.json();
              if (json.articles) setLiveArticles(json.articles);
            }
          } catch {
            // Ignored
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Hero cards: dari database (prioritaskan profil terverifikasi) atau fallback ke mock
  const sortedProfiles = [...profiles].sort((a, b) => {
    if (a.verificationStatus === "verified" && b.verificationStatus !== "verified") return -1;
    if (a.verificationStatus !== "verified" && b.verificationStatus === "verified") return 1;
    return 0;
  });

  const heroCards = sortedProfiles.length >= 3
    ? sortedProfiles.slice(0, 3).map((p) => ({
        id: p.id,
        slug: p.slug,
        type: p.entityType,
        rarity: p.rarityTier,
        verification: mapVerificationToCard(p.verificationStatus),
        data: {
          slug: p.slug,
          displayName: p.displayName,
          ign: p.ign || undefined,
          role: p.roleName || "Athlete",
          game: p.mainGameName || "Esport",
          region: { name: p.regionName, code: p.regionCode },
          esportId: p.esportId,
          badgeNumber: p.verifiedBadgeNo || undefined,
          avatarUrl: p.avatarUrl || undefined,
        },
      }))
    : [
        GALLERY_CARDS.find((c) => c.id === "pl-contender") || GALLERY_CARDS[1],
        GALLERY_CARDS.find((c) => c.id === "pl-elite") || GALLERY_CARDS[2],
        GALLERY_CARDS.find((c) => c.id === "tm-elite") || GALLERY_CARDS[10],
      ];

  // News bento articles (1 headline + sub articles)
  const headlineArticle = liveArticles.length > 0
    ? {
        id: liveArticles[0].id,
        title: liveArticles[0].title,
        slug: liveArticles[0].slug,
        category: liveArticles[0].category,
        date: new Date(liveArticles[0].publishedAt).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        readTime: "3 min baca",
        imageUrl: liveArticles[0].coverImageUrl || "/images/news-placeholder.jpg",
      }
    : (FLAGS.SHOW_DEMO_DATA ? (MOCK_NEWS.find((n) => n.isHeadline) || MOCK_NEWS[0]) : null);

  const subArticles = liveArticles.length > 1
    ? liveArticles.slice(1, 4).map((a) => ({
        id: a.id,
        title: a.title,
        slug: a.slug,
        category: a.category,
        date: new Date(a.publishedAt).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        imageUrl: a.coverImageUrl || "/images/news-placeholder.jpg",
      }))
    : (FLAGS.SHOW_DEMO_DATA && headlineArticle
        ? MOCK_NEWS.filter((n) => n.id !== headlineArticle.id).slice(0, 3)
        : []);

  // Featured profiles for carousel/grid
  const featuredCards = profiles.length > 0
    ? profiles.map((p) => ({
        id: p.id,
        slug: p.slug,
        type: p.entityType,
        rarity: p.rarityTier,
        verification: mapVerificationToCard(p.verificationStatus),
        data: {
          slug: p.slug,
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

  const workflowSteps = [
    {
      num: "01",
      title: "Pilih 1 Bidang",
      desc: "Satu akun terikat pada satu identitas bidang spesifik dalam ekosistem.",
      badge: "Integritas 1 Akun",
    },
    {
      num: "02",
      title: "Terbitkan Kartu",
      desc: "Dapatkan paspor digital ber-ESPORT ID unik dengan frame kelangkaan.",
      badge: "Paspor Digital",
    },
    {
      num: "03",
      title: "Koneksi 7 Entitas",
      desc: "Hubungkan profil ke klub, pelatih, komunitas, kampus, atau markas latihan.",
      badge: "Relasi Tercatat",
    },
    {
      num: "04",
      title: "Verifikasi Standar",
      desc: "Kurasi bukti identitas mandiri menghasilkan lencana standar ESP-SB-VER.",
      badge: "Satu Tingkat",
    },
    {
      num: "05",
      title: "Tampil di Roster",
      desc: "Masuk direktori publik terdaftar Sumatera Barat dan terdata di turnamen.",
      badge: "Katalog Terbuka",
    },
  ];

  const entityPillars = [
    { name: "Pemain", href: "/players", icon: Gamepad2, count: stats?.totalPlayers ?? 0, color: "text-rose-400" },
    { name: "Pelatih", href: "/coaches", icon: Award, count: stats?.totalCoaches ?? 0, color: "text-amber-400" },
    { name: "Tim", href: "/teams", icon: Users, count: stats?.totalTeams ?? 0, color: "text-sky-400" },
    { name: "Komunitas", href: "/communities", icon: Flame, count: stats?.totalCommunities ?? 0, color: "text-emerald-400" },
    { name: "Venue", href: "/venues", icon: Building2, count: stats?.totalVenues ?? 0, color: "text-purple-400" },
    { name: "Kampus", href: "/campuses", icon: GraduationCap, count: stats?.totalCampuses ?? 0, color: "text-indigo-400" },
    { name: "Sekolah", href: "/schools", icon: Building2, count: stats?.totalSchools ?? 0, color: "text-teal-400" },
  ];

  const currentHeroCard = heroCards[activeHeroIdx] || heroCards[0];

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-white flex flex-col selection:bg-[#FF1752]/30 selection:text-white">
      <Navbar />

      <main className="flex-1 flex flex-col items-center overflow-x-hidden">
        {/* ==================== 1. HERO SECTION (CINEMATIC ESPORTS ARENA VENUE) ==================== */}
        <section className="relative w-full min-h-[calc(100vh-64px)] flex flex-col justify-center items-center overflow-hidden border-b border-white/[0.06]">
          {/* 1A. High-Tech Esports Arena Background with Multi-Tier Ambient Scrim */}
          <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden select-none">
            {/* Arena Stage Background Image */}
            <Image
              src="/images/esport-arena-stage.webp"
              alt="Esport Sumbar Championship Arena Stage"
              fill
              priority
              quality={75}
              className="object-cover object-center scale-105 opacity-30 sm:opacity-35 filter contrast-125 brightness-90 saturate-110"
            />

            {/* Seamless Top Fade into Fixed Navbar */}
            <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-[var(--bg-base)] via-[var(--bg-base)]/85 to-transparent" />

            {/* Seamless Bottom Fade into Statistics Section */}
            <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[var(--bg-base)] via-[var(--bg-base)]/90 to-transparent" />

            {/* Horizontal Scrim (Protect headline readability on left, reveal arena crowd & stage lights on right) */}
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-base)] via-[var(--bg-base)]/90 sm:via-[var(--bg-base)]/75 to-[var(--bg-base)]/80 lg:to-transparent" />

            {/* Radial Vignette & Atmospheric Neon Lightings */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,var(--bg-base)_95%)] opacity-85" />
            <div className="absolute -top-24 right-1/4 w-[500px] h-[500px] bg-[#FF1752]/[0.12] blur-[150px] rounded-full" />
            <div className="absolute top-1/3 left-1/4 w-[450px] h-[450px] bg-[#00004F]/60 blur-[140px] rounded-full" />
            <div className="absolute bottom-1/4 right-10 w-[350px] h-[350px] bg-[#3B82F6]/[0.10] blur-[120px] rounded-full" />
          </div>

          <BrandWatermark opacity={0.03} size={720} position="top-right" />

          {/* 1B. Hero Content Container (Constrained to max-w-7xl) */}
          <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14">
            {/* Left Column: Headlines & Action Buttons (Cinematic Stagger) */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: MOTION_DURATIONS.cinematic, ease: MOTION_EASINGS.standardOut }}
              className="relative z-10 flex-1 flex flex-col items-center lg:items-start text-center lg:text-left max-w-2xl"
            >
            {/* Brand Ownership Pill */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...MOTION_SPRINGS.snappy, delay: 0.05 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/10 mb-6 shadow-sm backdrop-blur-md"
            >
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
                Pusat Data ESPORT SUMBAR™
              </span>
            </motion.div>

            {/* Main Headline (Brand Slanted Style) */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...MOTION_SPRINGS.fluid, delay: 0.15 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black uppercase tracking-tight text-white leading-[1.05] mb-5"
            >
              BANGUN NAMAMU DI{" "}
              <span className="text-[#FF1752] display-skew inline-block">ARENA SUMBAR</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...MOTION_SPRINGS.fluid, delay: 0.25 }}
              className="text-sm sm:text-base lg:text-lg text-white/70 leading-relaxed mb-8 max-w-xl"
            >
              Pusat data olahraga elektronik, paspor digital ber-ESPORT ID, dan jaringan keterhubungan 7 entitas Sumatera Barat.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...MOTION_SPRINGS.snappy, delay: 0.35 }}
              className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto"
            >
              <Link href="/register" className="w-full sm:w-auto">
                <GlassButton variant="primary" size="lg" className="w-full sm:w-auto text-sm font-heading font-black uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Buat Paspor Kartu
                </GlassButton>
              </Link>

              <Link href="/explore" className="w-full sm:w-auto">
                <GlassButton variant="secondary" size="lg" className="w-full sm:w-auto text-sm font-heading font-black uppercase tracking-wider">
                  <Compass className="w-4 h-4 mr-2 text-[#FF4D77]" />
                  Jelajahi Roster
                </GlassButton>
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...MOTION_SPRINGS.gentle, delay: 0.45 }}
              className="mt-8 pt-6 border-t border-white/[0.08] w-full flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs text-white/60"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Terhubung 19 Wilayah Sumbar</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#D4AF37]" />
                <span>Verifikasi Standar Tunggal</span>
              </div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-sky-400" />
                <span>1 Akun = 1 Profil Terdaftar</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: 3D Cinematic Glass Stage */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ ...MOTION_SPRINGS.fluid, delay: 0.2 }}
            className="relative z-10 flex-1 w-full flex flex-col items-center justify-center py-4"
          >
            <div className="relative p-5 sm:p-8 flex flex-col items-center max-w-[360px] sm:max-w-[380px] w-full rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] border border-white/20 bg-[#0B0E17]/85 backdrop-blur-xl overflow-visible">
              {/* Card Switcher Pills */}
              <div className="w-full flex items-center justify-between gap-1 mb-4 pb-3 border-b border-white/10 text-xs font-mono">
                <span className="text-white/60 text-[10px] uppercase tracking-wider font-semibold">Panggung Kartu</span>
                <div className="flex items-center gap-1.5">
                  {heroCards.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveHeroIdx(idx)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                        activeHeroIdx === idx
                          ? "bg-[#FF1752] text-white shadow-md shadow-pink-500/30 ring-1 ring-white/30"
                          : "bg-white/10 text-white/60 hover:bg-white/20"
                      }`}
                      aria-label={`Lihat kartu ${idx + 1}`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3D Interactive Card Component with Fluid Morph Switch */}
              <div className="w-full flex justify-center py-2 min-h-[420px] items-center overflow-visible">
                <div
                  key={activeHeroIdx}
                  className="w-full max-w-[300px] sm:max-w-[320px] h-[420px] flex justify-center items-center overflow-visible"
                >
                  <EsportCard
                    type={currentHeroCard.type as any}
                    rarity={currentHeroCard.rarity as any}
                    verification={currentHeroCard.verification}
                    data={currentHeroCard.data}
                    size="md"
                    interactive={true}
                    enableGyroscope={false}
                  />
                </div>
              </div>

              {/* Card Meta Bar */}
              <div className="w-full mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/70 font-mono">
                <span className="text-[11px] uppercase font-bold text-[#D4AF37]">
                  {currentHeroCard.data.esportId}
                </span>
                <Link
                  href={`/${currentHeroCard.type || "player"}/${(currentHeroCard as any).slug || (currentHeroCard.data as any).slug || currentHeroCard.data.ign?.toLowerCase() || "profile"}`}
                  className="text-[11px] text-pink-300 hover:text-pink-200 flex items-center gap-1 font-semibold transition-colors group"
                >
                  Buka Profil
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

        {/* ==================== 2. PLATFORM STATISTICS BAR ==================== */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ScrollReveal direction="up" threshold={0.1}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <GlassCard variant="standard" elevation="glass" radius="2xl" className="p-5 text-center">
                <span className="text-xs font-mono text-white/50 uppercase tracking-wider block mb-1">
                  Profil Terdaftar
                </span>
                <GlassNumberCounter
                  value={stats?.totalEntities ?? 0}
                  numberClassName="text-3xl sm:text-4xl text-white"
                />
                <span className="text-[10px] font-mono text-rose-400 mt-1 block">7 Entitas Terhubung</span>
              </GlassCard>

              <GlassCard variant="standard" elevation="glass" radius="2xl" className="p-5 text-center">
                <span className="text-xs font-mono text-white/50 uppercase tracking-wider block mb-1">
                  Terverifikasi
                </span>
                <GlassNumberCounter
                  value={stats?.verifiedCount ?? 0}
                  numberClassName="text-3xl sm:text-4xl text-[#D4AF37]"
                />
                <span className="text-[10px] font-mono text-emerald-400 mt-1 block">Standar ESP-SB-VER</span>
              </GlassCard>

              <GlassCard variant="standard" elevation="glass" radius="2xl" className="p-5 text-center">
                <span className="text-xs font-mono text-white/50 uppercase tracking-wider block mb-1">
                  Wilayah Terjangkau
                </span>
                <GlassNumberCounter
                  value={stats?.activeRegions ?? 0}
                  numberClassName="text-3xl sm:text-4xl text-white"
                />
                <span className="text-[10px] font-mono text-sky-400 mt-1 block">Kota &amp; Kabupaten</span>
              </GlassCard>

              <GlassCard variant="standard" elevation="glass" radius="2xl" className="p-5 text-center">
                <span className="text-xs font-mono text-white/50 uppercase tracking-wider block mb-1">
                  Klub &amp; Tim Aktif
                </span>
                <GlassNumberCounter
                  value={stats?.totalTeams ?? 0}
                  numberClassName="text-3xl sm:text-4xl text-white"
                />
                <span className="text-[10px] font-mono text-amber-400 mt-1 block">Divisi Kompetitif</span>
              </GlassCard>
            </div>
          </ScrollReveal>
        </section>

        {/* ==================== 3. CARA KERJA SISTEM V3 (5 LANGKAH) ==================== */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <ScrollReveal direction="up" threshold={0.1}>
            <div className="flex flex-col items-center text-center mb-10">
              <span className="px-3 py-1 rounded-full bg-[#FF1752]/10 border border-[#FF1752]/30 text-pink-300 text-xs font-mono font-bold uppercase tracking-widest mb-3">
                Protokol Platform
              </span>
              <h2 className="text-2xl sm:text-4xl font-heading font-black uppercase text-white tracking-tight">
                Cara Kerja Sistem V3
              </h2>
              <p className="text-xs sm:text-sm text-white/60 max-w-xl mt-2 leading-relaxed">
                Lima tahapan terstruktur dari penerbitan identitas hingga partisipasi turnamen terbuka.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {workflowSteps.map((step, idx) => (
                <GlassCard
                  key={idx}
                  variant="standard"
                  elevation="glass"
                  radius="2xl"
                  specular={true}
                  className="p-5 flex flex-col justify-between group hover:border-[#FF1752]/40 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-heading font-black text-[#FF1752] opacity-80 group-hover:opacity-100 transition-opacity">
                        {step.num}
                      </span>
                      <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                        {step.badge}
                      </span>
                    </div>
                    <h3 className="text-base font-heading font-black uppercase text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-xs text-white/60 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </GlassCard>
              ))}
            </div>
          </ScrollReveal>
        </section>

        {/* ==================== 4. EKOSISTEM 7 BIDANG (VISUAL KETERHUBUNGAN) ==================== */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <ScrollReveal direction="up" threshold={0.1}>
            <GlassSurface
              variant="elevated"
              elevation="glass"
              radius="3xl"
              specular={true}
              className="p-6 sm:p-10 border-white/15"
            >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-white/10">
              <div>
                <span className="text-xs font-mono font-bold tracking-widest text-[#FF4D77] uppercase block mb-1">
                  Arsitektur Terhubung
                </span>
                <h2 className="text-2xl sm:text-3xl font-heading font-black uppercase text-white">
                  Jaringan Ekosistem 7 Bidang
                </h2>
                <p className="text-xs sm:text-sm text-white/60 mt-1 max-w-xl">
                  Setiap profil terikat relasi dua arah: tim menaungi atlet, pelatih mendampingi skuad, komunitas dan kampus mencetak bibit talenta.
                </p>
              </div>

              <Link href="/ecosystem">
                <GlassButton variant="secondary" size="sm" className="font-mono text-xs">
                  <span>Lihat Peta Lengkap</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </GlassButton>
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {entityPillars.map((p, idx) => {
                const Icon = p.icon;
                return (
                  <Link
                    key={idx}
                    href={p.href}
                    className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:border-white/20 hover:bg-white/[0.08] transition-all flex flex-col items-center text-center group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                      <Icon className={`w-5 h-5 ${p.color}`} />
                    </div>
                    <span className="text-xs font-heading font-black uppercase text-white tracking-wide">
                      {p.name}
                    </span>
                    <span className="text-[10px] font-mono text-white/50 mt-1">
                      {p.count} Data
                    </span>
                  </Link>
                );
              })}
            </div>
          </GlassSurface>
        </ScrollReveal>
      </section>

        {/* ==================== 5. BERITA & WARTA TERBARU ==================== */}
        {headlineArticle && (
          <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <ScrollReveal direction="up" threshold={0.1}>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="text-xs font-mono font-bold tracking-widest text-[#FF4D77] uppercase block mb-1">
                    Warta Terkini
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-heading font-black uppercase text-white">
                    Kabar Turnamen &amp; Agenda
                  </h2>
                </div>

                <Link href="/news">
                  <GlassButton variant="ghost" size="sm" className="font-mono text-xs text-white/70 hover:text-white">
                    <span>Semua Berita</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </GlassButton>
                </Link>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Headline Card (7 Cols) */}
                <Link
                  href={`/news/${headlineArticle.slug}`}
                  className="lg:col-span-7 group block"
                >
                  <GlassSurface
                    variant="standard"
                    elevation="glass"
                    radius="2xl"
                    specular={true}
                    className="p-6 h-full flex flex-col justify-between hover:border-[#FF1752]/40 transition-colors"
                  >
                    <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden mb-4 bg-black/40 border border-white/10">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={headlineArticle.imageUrl}
                        alt={headlineArticle.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[10px] font-mono font-bold text-pink-300 uppercase">
                          {headlineArticle.category}
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-3 text-xs font-mono text-white/50 mb-2">
                        <span>{headlineArticle.date}</span>
                        <span>•</span>
                        <span>{headlineArticle.readTime}</span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-heading font-black text-white group-hover:text-pink-300 transition-colors line-clamp-2">
                        {headlineArticle.title}
                      </h3>
                    </div>
                  </GlassSurface>
                </Link>

                {/* Sub Articles (5 Cols) */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                  {subArticles.map((article) => (
                    <Link
                      key={article.id}
                      href={`/news/${article.slug}`}
                      className="group block"
                    >
                      <GlassSurface
                        variant="standard"
                        elevation="glass"
                        radius="xl"
                        className="p-4 flex gap-4 items-center hover:border-white/20 transition-colors"
                      >
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-black/40 border border-white/10">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={article.imageUrl}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-mono text-pink-400 font-bold uppercase block mb-1">
                            {article.category}
                          </span>
                          <h4 className="text-sm font-heading font-black text-white group-hover:text-pink-300 transition-colors line-clamp-2">
                            {article.title}
                          </h4>
                          <span className="text-[10px] font-mono text-white/40 block mt-1">
                            {article.date}
                          </span>
                        </div>
                      </GlassSurface>
                    </Link>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </section>
        )}

        {/* ==================== 6. PROFIL UNGGULAN TERVERIFIKASI ==================== */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <ScrollReveal direction="up" threshold={0.1}>
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-mono font-bold tracking-widest text-[#FF4D77] uppercase block mb-1">
                  Katalog Publik
                </span>
                <h2 className="text-2xl sm:text-3xl font-heading font-black uppercase text-white">
                  Roster Terverifikasi
                </h2>
              </div>

              <Link href="/explore">
                <GlassButton variant="ghost" size="sm" className="font-mono text-xs text-white/70 hover:text-white">
                  <span>Eksplorasi Lengkap</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </GlassButton>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
              {featuredCards.slice(0, 4).map((card, idx) => (
                <div key={card.id || idx} className="w-full max-w-[280px] sm:max-w-[300px] flex flex-col items-center">
                  <EsportCard
                    type={card.type as any}
                    rarity={card.rarity as any}
                    verification={card.verification}
                    data={card.data}
                    size="mobile"
                    interactive={true}
                  />
                  <Link
                    href={`/${card.type || "player"}/${(card as any).slug || (card.data as any).slug || card.data.ign?.toLowerCase() || "profile"}`}
                    className="mt-3 text-xs text-pink-400 hover:text-pink-300 flex items-center gap-1 font-mono transition-colors"
                  >
                    <span>Lihat Profil</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </section>

        {/* ==================== 7. HIGH-IMPACT CTA BANNER ==================== */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <ScrollReveal direction="up" threshold={0.1}>
            <GlassSurface
              variant="prominent"
              elevation="overlay"
              radius="3xl"
              specular={true}
              className="p-8 sm:p-14 text-center relative overflow-hidden border-[#FF1752]/30"
            >
              <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-pink-300 text-xs font-mono font-bold uppercase tracking-wider mb-4">
                  Bergabung Sekarang
                </span>
                <h2 className="text-3xl sm:text-5xl font-heading font-black uppercase text-white tracking-tight leading-tight mb-4">
                  Daftarkan Identitasmu di{" "}
                  <span className="text-[#FF1752] display-skew inline-block">ESPORT SUMBAR™</span>
                </h2>
                <p className="text-sm sm:text-base text-white/70 leading-relaxed mb-8 max-w-xl">
                  Satu akun terikat pada satu identitas bidang spesifik. Dapatkan kartu identitas digital, kode verifikasi tunggal, dan keterhubungan ekosistem se-Sumatera Barat.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                  <Link href="/register" className="w-full sm:w-auto">
                    <GlassButton variant="primary" size="lg" className="w-full sm:w-auto font-heading font-black uppercase tracking-wider">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Mulai Pendaftaran
                    </GlassButton>
                  </Link>
                  <Link href="/verification-standard" className="w-full sm:w-auto">
                    <GlassButton variant="secondary" size="lg" className="w-full sm:w-auto font-heading font-black uppercase tracking-wider">
                      <ShieldCheck className="w-4 h-4 mr-2 text-emerald-400" />
                      Standar Verifikasi
                    </GlassButton>
                  </Link>
                </div>
              </div>
            </GlassSurface>
          </ScrollReveal>
        </section>
      </main>

      <Footer />
    </div>
  );
}
