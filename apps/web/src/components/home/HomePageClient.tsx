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
  CreditCard,
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
import { REGIONS_DETAIL } from "@/data/regions";
import { createClient } from "@/lib/supabase/client";
import type { PlatformStats } from "@/lib/services/stats";
import type { PublicArticle } from "@/lib/services/news";
import type { UnifiedProfileDetail } from "@/lib/services/public-profiles";
import type { Banner, ContentBlock } from "@esport-sumbar/contracts";
import { AccessibleBannerSlider } from "@/components/banner/AccessibleBannerSlider";

interface HomePageClientProps {
  stats: PlatformStats;
  articles: PublicArticle[];
  profiles: UnifiedProfileDetail[];
  topBanners?: Banner[];
  middleBanners?: Banner[];
  heroBlock?: ContentBlock | null;
  initialMyProfile?: UnifiedProfileDetail | null;
}

export function HomePageClient({
  stats,
  articles,
  profiles,
  topBanners = [],
  middleBanners = [],
  heroBlock,
  initialMyProfile,
}: HomePageClientProps) {
  const [productCardFlipped, setProductCardFlipped] = useState(false);
  const [liveArticles, setLiveArticles] = useState<PublicArticle[]>(articles);
  const [activeHeroIdx, setActiveHeroIdx] = useState(0);
  const [currentUserProfile, setCurrentUserProfile] = useState<UnifiedProfileDetail | null>(
    initialMyProfile || null
  );

  useEffect(() => {
    setLiveArticles(articles);
  }, [articles]);

  // Pantau profil pengguna yang terdaftar / login (sinkronisasi SSR & Client Session)
  useEffect(() => {
    let isMounted = true;
    async function fetchMyProfile() {
      try {
        const res = await fetch("/api/me/profiles");
        if (res.ok) {
          const json = await res.json();
          if (isMounted) {
            const userProfile =
              Array.isArray(json.profiles) && json.profiles.length > 0
                ? json.profiles[0]
                : json.profile || null;
            if (userProfile) {
              setCurrentUserProfile({
                id: userProfile.id,
                accountId: json.user?.id || userProfile.id,
                entityType: userProfile.entityType,
                esportId: userProfile.esportId,
                slug: userProfile.slug,
                displayName: userProfile.displayName,
                ign: userProfile.ign,
                regionId: userProfile.regionId || "",
                regionName: userProfile.regionName || "Sumatera Barat",
                regionCode: userProfile.regionCode || "SB",
                mainGameName: userProfile.mainGameName || "Esport",
                roleName: userProfile.roleName || "Athlete",
                avatarUrl: userProfile.avatarUrl,
                verificationStatus: userProfile.verificationStatus,
                rarityTier: userProfile.rarityTier || "rookie",
                verifiedBadgeNo: userProfile.verifiedBadgeNo,
                completenessScore: userProfile.completenessScore || 0,
                attributes: userProfile.attributes || {},
                visibility: {},
                isDemo: userProfile.isDemo || false,
                createdAt: userProfile.createdAt || "",
              });
            } else if (!json.user) {
              setCurrentUserProfile(null);
            }
          }
        }
      } catch {
        // Silently ignored
      }
    }

    fetchMyProfile();

    const supabase = createClient();
    const { data: authSub } = supabase.auth.onAuthStateChange((event) => {
      if (
        event === "SIGNED_IN" ||
        event === "USER_UPDATED" ||
        event === "TOKEN_REFRESHED"
      ) {
        fetchMyProfile();
      } else if (event === "SIGNED_OUT") {
        setCurrentUserProfile(null);
      }
    });

    return () => {
      isMounted = false;
      authSub.subscription.unsubscribe();
    };
  }, []);

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

  const brandArchetypeCards = [
    {
      id: "archetype-player",
      slug: "register",
      type: "player" as const,
      rarity: "elite" as const,
      verification: "verified" as const,
      data: {
        slug: "register",
        displayName: "Pemain Esport",
        ign: "ATLET_SUMBAR",
        role: "Atlet Terdaftar",
        game: "Esport Sumbar",
        region: { name: "Sumatera Barat", code: "SB" },
        esportId: "ESB-SB-PL-100001",
        badgeNumber: "ESP-SB-VER-2026-0001",
        avatarUrl: undefined,
      },
    },
    {
      id: "archetype-team",
      slug: "register",
      type: "team" as const,
      rarity: "master" as const,
      verification: "verified" as const,
      data: {
        slug: "register",
        displayName: "Klub Esport",
        ign: "TIM_SUMBAR",
        role: "Roster Tim",
        game: "Esport Sumbar",
        region: { name: "Sumatera Barat", code: "SB" },
        esportId: "ESB-SB-TM-100001",
        badgeNumber: "ESP-SB-VER-2026-0002",
        avatarUrl: undefined,
      },
    },
    {
      id: "archetype-campus",
      slug: "register",
      type: "campus" as const,
      rarity: "contender" as const,
      verification: "verified" as const,
      data: {
        slug: "register",
        displayName: "UKM Komunitas",
        ign: "KOMUNITAS_SUMBAR",
        role: "Divisi Kampus",
        game: "Esport Sumbar",
        region: { name: "Sumatera Barat", code: "SB" },
        esportId: "ESB-SB-CP-100001",
        badgeNumber: "ESP-SB-VER-2026-0003",
        avatarUrl: undefined,
      },
    },
  ];

  // 1. Kartu Pengguna yang Login (Slot #1 jika sudah terdaftar)
  const myHeroCard = currentUserProfile
    ? {
        id: currentUserProfile.id,
        slug: currentUserProfile.slug,
        type: currentUserProfile.entityType,
        rarity: currentUserProfile.rarityTier || "rookie",
        verification: mapVerificationToCard(currentUserProfile.verificationStatus),
        isMyCard: true,
        data: {
          slug: currentUserProfile.slug,
          displayName: currentUserProfile.displayName,
          ign: currentUserProfile.ign || undefined,
          role: currentUserProfile.roleName || "Athlete",
          game: currentUserProfile.mainGameName || "Esport",
          region: {
            name: currentUserProfile.regionName,
            code: currentUserProfile.regionCode,
          },
          esportId: currentUserProfile.esportId,
          badgeNumber: currentUserProfile.verifiedBadgeNo || undefined,
          avatarUrl: currentUserProfile.avatarUrl || undefined,
        },
      }
    : null;

  // 2. Kartu Komunitas / Terverifikasi Lainnya (dari database)
  const otherProfiles = sortedProfiles.filter(
    (p) => !currentUserProfile || p.id !== currentUserProfile.id
  );

  const communityCards = otherProfiles.map((p) => ({
    id: p.id,
    slug: p.slug,
    type: p.entityType,
    rarity: p.rarityTier,
    verification: mapVerificationToCard(p.verificationStatus),
    isMyCard: false,
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
  }));

  // 3. Rakit heroCards: Kartu pengguna selalu menjadi kartu utama di indeks 0
  let heroCards: Array<{
    id: string;
    slug: string;
    type: any;
    rarity: any;
    verification: any;
    isMyCard: boolean;
    data: any;
  }> = [];

  if (myHeroCard) {
    heroCards = [myHeroCard, ...communityCards.slice(0, 2)];
    if (heroCards.length < 3) {
      const needed = 3 - heroCards.length;
      const archetypesToAdd = brandArchetypeCards.slice(0, needed).map((a) => ({
        ...a,
        isMyCard: false,
      }));
      heroCards.push(...archetypesToAdd);
    }
  } else {
    const cards: any[] = communityCards.slice(0, 3).map((c) => ({ ...c, isMyCard: false }));
    if (cards.length > 0 && cards.length < 3) {
      const needed = 3 - cards.length;
      const archetypesToAdd = brandArchetypeCards.slice(0, needed).map((a) => ({
        ...a,
        isMyCard: false,
      }));
      cards.push(...archetypesToAdd);
    }
    heroCards = cards.length > 0 ? cards : brandArchetypeCards.map((a) => ({ ...a, isMyCard: false }));
  }

  // News bento articles (hanya dari database berita nyata)
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
    : null;

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
    : [];

  // Featured profiles for carousel/grid (Tampilkan seluruh profil terverifikasi yang ada)
  const featuredCards =
    profiles.length > 0
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
            badgeNumber: p.verifiedBadgeNo || undefined,
            avatarUrl: p.avatarUrl || undefined,
          },
        }))
      : [];

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
        <section className="relative isolate w-full min-h-[calc(100vh-64px)] flex flex-col justify-center items-center overflow-hidden border-b border-white/[0.06]">
          {/* 1A. High-Tech Esports Arena Background with Guaranteed Stacking (Pure Brand CSS/SVG, Zero ROG Watermark) */}
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#07090E]">
            {/* Cinematic Stadium Lighting & Mesh Atmosphere */}
            <div
              className="absolute inset-0 opacity-70 pointer-events-none"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 50% -10%, rgba(255, 23, 82, 0.32) 0%, transparent 65%),
                  radial-gradient(circle at 15% 30%, rgba(0, 80, 220, 0.25) 0%, transparent 55%),
                  radial-gradient(circle at 85% 30%, rgba(255, 23, 82, 0.20) 0%, transparent 55%),
                  linear-gradient(to bottom, rgba(7, 9, 14, 0.1) 0%, rgba(7, 9, 14, 0.95) 100%)
                `,
              }}
            />

            {/* Futuristic Perspective Stage Grid Floor */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
                `,
                backgroundSize: "60px 60px",
                transform: "perspective(600px) rotateX(60deg) translateY(120px) scale(1.6)",
                transformOrigin: "bottom center",
              }}
            />

            {/* Seamless Top Fade into Fixed Navbar */}
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#07090E] via-[#07090E]/60 to-transparent" />

            {/* Seamless Bottom Fade into Statistics Section */}
            <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#07090E] via-[#07090E]/70 to-transparent" />

            {/* Left Readability Scrim */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#07090E]/90 via-[#07090E]/40 to-transparent" />

            {/* Ambient Neon Glows matching Esport Sumbar Brand (Zero-blur GPU radial gradients) */}
            <div
              className="absolute -top-20 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(circle, rgba(255, 23, 82, 0.22) 0%, rgba(255, 23, 82, 0.05) 45%, transparent 70%)",
              }}
            />
            <div
              className="absolute top-1/3 left-1/4 w-[450px] h-[450px] rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(circle, rgba(0, 0, 79, 0.55) 0%, transparent 70%)",
              }}
            />
            <div
              className="absolute bottom-1/4 right-10 w-[350px] h-[350px] rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(circle, rgba(59, 130, 246, 0.20) 0%, transparent 70%)",
              }}
            />
          </div>

          <BrandWatermark opacity={0.03} size={720} position="top-right" />

          {/* 1B. Hero Content Container (Constrained to max-w-7xl, z-10) */}
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14">
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
              {currentUserProfile ? (
                <span className="text-[11px] font-mono font-bold tracking-wider text-emerald-400 uppercase flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Kartu Digital Terdaftar
                </span>
              ) : (
                <span className="text-[11px] font-mono font-bold tracking-wider text-white/80 uppercase">
                  Pusat Data ESPORT SUMBAR™
                </span>
              )}
            </motion.div>

            {/* Main Headline (Brand Slanted Style) */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...MOTION_SPRINGS.fluid, delay: 0.15 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black uppercase tracking-tight text-white leading-[1.05] mb-5 drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]"
            >
              Identitas Resmi{" "}
              <span className="text-[#FF1752] display-skew inline-block drop-shadow-[0_0_25px_rgba(255,23,82,0.4)]">Esport Sumbar</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...MOTION_SPRINGS.fluid, delay: 0.25 }}
              className="text-sm sm:text-base lg:text-lg text-white/80 leading-relaxed mb-8 max-w-xl drop-shadow-md"
            >
              {currentUserProfile
                ? `Selamat datang kembali, ${currentUserProfile.displayName}. Kartu digital resmi Anda telah aktif di ekosistem Esport Sumbar.`
                : "Satu kartu digital untuk pemain, tim, dan ekosistem kompetisi."}
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...MOTION_SPRINGS.snappy, delay: 0.35 }}
              className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto"
            >
              {currentUserProfile ? (
                <Link href="/me" className="w-full sm:w-auto">
                  <GlassButton
                    variant="primary"
                    size="lg"
                    className="w-full sm:w-auto text-sm font-heading font-black uppercase tracking-wider shadow-lg shadow-[#FF1752]/20"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Lihat Kartu Saya
                  </GlassButton>
                </Link>
              ) : (
                <Link href="/register" className="w-full sm:w-auto">
                  <GlassButton
                    variant="primary"
                    size="lg"
                    className="w-full sm:w-auto text-sm font-heading font-black uppercase tracking-wider"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Buat Kartu
                  </GlassButton>
                </Link>
              )}

              <Link href="/explore" className="w-full sm:w-auto">
                <GlassButton variant="secondary" size="lg" className="w-full sm:w-auto text-sm font-heading font-black uppercase tracking-wider">
                  <Compass className="w-4 h-4 mr-2 text-[#FF4D77]" />
                  Jelajahi
                </GlassButton>
              </Link>
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
                <div className="flex items-center gap-2">
                  <span className="text-white/60 text-[10px] uppercase tracking-wider font-semibold">Panggung Kartu</span>
                  {currentHeroCard.isMyCard && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FF1752]/20 text-[#FF4D77] border border-[#FF1752]/40">
                      <Sparkles className="w-2.5 h-2.5" />
                      Kartu Anda
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  {heroCards.map((card, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveHeroIdx(idx)}
                      className={`px-2 h-7 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                        activeHeroIdx === idx
                          ? "bg-[#FF1752] text-white shadow-md shadow-pink-500/30 ring-1 ring-white/30"
                          : "bg-white/10 text-white/60 hover:bg-white/20"
                      }`}
                      aria-label={card.isMyCard ? "Lihat Kartu Saya" : `Lihat kartu ${idx + 1}`}
                    >
                      {card.isMyCard ? "Saya" : idx + 1}
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
                  href={
                    currentHeroCard.isMyCard
                      ? "/me"
                      : `/${currentHeroCard.type || "player"}/${currentHeroCard.slug || (currentHeroCard.data as any).slug || currentHeroCard.data.ign?.toLowerCase() || "profile"}`
                  }
                  className="text-[11px] text-pink-300 hover:text-pink-200 flex items-center gap-1 font-semibold transition-colors group"
                >
                  {currentHeroCard.isMyCard ? "Kelola Profil Saya" : "Buka Profil"}
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

        {/* ==================== BANNER ATAS (HOME TOP) ==================== */}
        {topBanners && topBanners.length > 0 && (
          <AccessibleBannerSlider
            banners={topBanners}
            autoPlayIntervalMs={6000}
            className="my-3"
            ariaLabel="Banner Pengumuman & Sponsor Teratas"
          />
        )}

        {/* ==================== 2. PLATFORM STATISTICS BAR ==================== */}
        {stats && stats.totalEntities >= 3 && (
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
        )}

        {/* ==================== 3. EKOSISTEM 7 BIDANG ==================== */}
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

              <Link href="/explore">
                <GlassButton variant="secondary" size="sm" className="font-mono text-xs">
                  <span>Jelajahi Direktori</span>
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

        {/* ==================== BANNER TENGAH (HOME MIDDLE) ==================== */}
        {middleBanners && middleBanners.length > 0 && (
          <AccessibleBannerSlider
            banners={middleBanners}
            autoPlayIntervalMs={7000}
            className="my-4"
            ariaLabel="Banner Sorotan Komunitas & Promosi Tengah"
          />
        )}

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

            {featuredCards.length > 0 ? (
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
            ) : (
              <GlassSurface
                variant="subtle"
                elevation="flat"
                radius="2xl"
                className="p-8 sm:p-12 text-center max-w-xl mx-auto flex flex-col items-center border-dashed border-white/10"
              >
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-pink-400 mb-4">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-heading font-black uppercase text-white mb-2">
                  Belum Ada Roster Terverifikasi
                </h3>
                <p className="text-xs sm:text-sm text-white/60 mb-6 leading-relaxed max-w-md">
                  Roster publik hanya menampilkan atlet dan entitas resmi Sumatera Barat yang telah terverifikasi. Daftarkan dan verifikasi profil Anda sekarang!
                </p>
                <Link href="/register">
                  <GlassButton variant="primary" size="sm" className="font-mono text-xs uppercase tracking-wider">
                    <span>Daftarkan Profil Sekarang</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </GlassButton>
                </Link>
              </GlassSurface>
            )}
          </ScrollReveal>
        </section>

        {/* ==================== 6. CTA PENUTUP (1 KALIMAT + 1 TOMBOL) ==================== */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <ScrollReveal direction="up" threshold={0.1}>
            <GlassSurface
              variant="prominent"
              elevation="overlay"
              radius="2xl"
              specular={true}
              className="p-8 sm:p-12 text-center relative overflow-hidden border-white/10"
            >
              <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
                <h2 className="text-2xl sm:text-3xl font-heading font-black uppercase text-white tracking-tight mb-6">
                  Mulai daftarkan profilmu di ekosistem resmi.
                </h2>
                <Link href="/register">
                  <GlassButton variant="primary" size="lg" className="font-heading font-bold uppercase tracking-wider">
                    Daftar Sekarang
                  </GlassButton>
                </Link>
              </div>
            </GlassSurface>
          </ScrollReveal>
        </section>
      </main>

      <Footer />
    </div>
  );
}
