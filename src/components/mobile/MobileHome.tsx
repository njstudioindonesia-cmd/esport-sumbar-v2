"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Bell,
  ShieldCheck,
  Award,
  Share2,
  ArrowRight,
  Sparkles,
  Layers,
  ChevronRight,
  Database,
  FileCheck,
  Newspaper,
} from "lucide-react";
import { FLAGS } from "@/lib/config/flags";
import { mapVerificationToCard } from "@/types/card";
import { GALLERY_CARDS } from "@/data/mockCards";
import { MOCK_NEWS } from "@/data/mockNews";
import { MobileBottomBar } from "./MobileBottomBar";
import { BrandLogo, BrandWatermark, IssuedBy, PartnerStrip } from "@/components/brand";
import type { PlatformStats } from "@/lib/services/stats";
import type { PublicArticle } from "@/lib/services/news";
import type { UnifiedProfileDetail } from "@/lib/services/public-profiles";

interface MobileHomeProps {
  stats?: PlatformStats;
  articles?: PublicArticle[];
  profiles?: UnifiedProfileDetail[];
}

export function MobileHome({ stats, articles, profiles }: MobileHomeProps) {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // User's Active Hero Card
  const dbHeroCard = profiles && profiles.length > 0
    ? {
        id: profiles[0].id,
        type: profiles[0].entityType,
        rarity: profiles[0].rarityTier,
        verification: mapVerificationToCard(profiles[0].verificationStatus),
        data: {
          displayName: profiles[0].displayName,
          ign: profiles[0].ign || undefined,
          role: profiles[0].roleName || "Athlete",
          game: profiles[0].mainGameName || "Esport",
          team: (profiles[0].attributes as any)?.team_name
            ? { name: (profiles[0].attributes as any).team_name }
            : undefined,
          region: { name: profiles[0].regionName, code: profiles[0].regionCode },
          esportId: profiles[0].esportId,
          avatarUrl: profiles[0].avatarUrl || undefined,
        },
      }
    : null;

  const heroCard = dbHeroCard || GALLERY_CARDS.find((c) => c.id === "pl-contender") || GALLERY_CARDS[0];

  // Featured Athletes for the mini card carousel
  const featuredCards = profiles && profiles.length > 1
    ? profiles.slice(1, 6).map((p) => ({
        id: p.id,
        type: p.entityType,
        rarity: p.rarityTier,
        verification: mapVerificationToCard(p.verificationStatus),
        data: {
          displayName: p.displayName,
          ign: p.ign || undefined,
          role: p.roleName || "Athlete",
          game: p.mainGameName || "Esport",
          team: (p.attributes as any)?.team_name
            ? { name: (p.attributes as any).team_name }
            : undefined,
          region: { name: p.regionName, code: p.regionCode },
          esportId: p.esportId,
          avatarUrl: p.avatarUrl || undefined,
        },
      }))
    : GALLERY_CARDS.filter((c) => c.id !== heroCard.id).slice(0, 5);

  // Recent 3 News items
  const recentNews = articles && articles.length > 0
    ? articles.slice(0, 3).map((a) => ({
        id: a.id,
        title: a.title,
        slug: a.slug,
        category: a.category,
        region: a.regionName || "Sumatera Barat",
        date: new Date(a.publishedAt).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        readTime: "3 min baca",
        imageUrl: a.coverImageUrl || "/images/news-placeholder.jpg",
      }))
    : (FLAGS.SHOW_DEMO_DATA ? MOCK_NEWS.slice(0, 3) : []);

  const triggerHaptic = (ms = 10) => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(ms);
      } catch {
        // Ignored
      }
    }
  };

  const handlePullToRefresh = () => {
    triggerHaptic(15);
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  const handleShareCard = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(`https://esport-sumbar-v2.vercel.app/player/${heroCard.data.ign?.toLowerCase()}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 1500);
    }
  };

  return (
    <div className="relative w-full min-h-[100dvh] max-w-[420px] mx-auto bg-[#03031A] text-white flex flex-col pb-28 overflow-x-hidden select-none">
      {/* Background Ambience & Brand Watermark */}
      <BrandWatermark opacity={0.05} size={380} position="top-right" />
      <div className="absolute top-1/4 -left-12 w-56 h-56 bg-[#FF1752]/10 rounded-full blur-3xl pointer-events-none" />

      {/* PULL TO REFRESH INDICATOR */}
      <div className="w-full flex justify-center pt-2">
        <button
          onClick={handlePullToRefresh}
          className="text-[10px] font-mono text-white/30 hover:text-white/60 transition-colors uppercase tracking-widest flex items-center gap-1.5"
        >
          {isRefreshing ? (
            <span className="w-2 h-2 rounded-full bg-[#FF1752] animate-ping" />
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
          )}
          <span>{isRefreshing ? "Memuat..." : "Tarik Refresh"}</span>
        </button>
      </div>

      <div className="px-5 pt-2 flex flex-col gap-6">
        {/* ==================== BLOK 1: HEADER MOBILE ==================== */}
        <header className="w-full flex items-center justify-between z-10 pt-1">
          <BrandLogo variant="lockup" size="sm" withLink={true} priority={true} />

          <div className="flex items-center gap-2">
            <Link
              href="/me/settings"
              onClick={() => triggerHaptic()}
              className="relative w-9 h-9 rounded-full bg-[#0A0A2E] border border-white/10 flex items-center justify-center text-white/70 hover:text-white"
              aria-label="Notifikasi"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF1752] ring-2 ring-[#03031A] shadow-[0_0_8px_#FF1752]" />
            </Link>

            <Link
              href="/me/settings"
              onClick={() => triggerHaptic()}
              className="w-9 h-9 rounded-full overflow-hidden border border-[#FF1752]/40 shadow-sm"
              aria-label="Profil Saya"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroCard.data.avatarUrl || "/brand/favicon-32x32.png"}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </Link>
          </div>
        </header>

        {/* ==================== BLOK 2: HERO TITLE & CTA ==================== */}
        <section className="w-full flex flex-col gap-3.5 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A0A2E] border border-white/10 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF1752] animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-white/80">
              Platform oleh ESPORT SUMBAR™
            </span>
          </div>

          <h1 className="text-3xl font-heading font-black uppercase text-white tracking-tight leading-none">
            BANGUN NAMAMU DI <span className="text-[#FF1752] display-skew">ARENA SUMBAR</span>
          </h1>

          <p className="text-xs text-white/60 leading-relaxed">
            Pusat data digital, paspor atlet resmi (ESPORT ID), dan ekosistem esports Sumatera Barat.
          </p>

          <Link
            href="/me/profile/new"
            onClick={() => triggerHaptic()}
            className="btn-brand-primary w-full py-3 text-center text-xs justify-center"
          >
            <Sparkles className="w-4 h-4" />
            <span>Buat Paspor Kartu Sekarang</span>
          </Link>
        </section>

        {/* ==================== BLOK 3: KARTU UTAMA PENGGUNA ==================== */}
        <section className="w-full flex flex-col items-center z-10">
          <div
            onClick={() => {
              triggerHaptic();
              router.push("/me/cards");
            }}
            className="group relative w-full h-96 rounded-[22px] bg-gradient-to-b from-[#0A0A2E] via-[#070724] to-[#03031A] border border-[#FF1752]/30 shadow-[0_16px_40px_rgba(255,23,82,0.15)] p-4 flex flex-col justify-between overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.01]"
          >
            {/* Top Row: Rarity + Regional Checked Badge */}
            <div className="w-full flex items-center justify-between z-10">
              <span className="px-2.5 py-1 rounded-full bg-[#FF1752]/15 border border-[#FF1752]/40 text-[9px] font-mono font-bold text-[#FF4D77] uppercase tracking-wider">
                {heroCard.rarity.toUpperCase()} TIER
              </span>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-[#22C55E]/15 border border-[#22C55E]/30 text-[#22C55E]">
                <ShieldCheck className="w-3 h-3" />
                <span className="text-[8px] font-mono font-bold uppercase">
                  {heroCard.verification === "verified" ? "VERIFIED ESI" : "REGIONAL CHECKED"}
                </span>
              </div>
            </div>

            {/* Center Area: Avatar & IGN */}
            <div className="relative w-full flex-1 flex flex-col items-center justify-center my-2 z-10">
              <div className="relative w-32 h-32 rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-[#03031A]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={heroCard.data.avatarUrl}
                  alt={heroCard.data.displayName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="text-center mt-3">
                <h2 className="font-heading font-black text-xl text-white tracking-wide">
                  {heroCard.data.displayName}
                </h2>
                <span className="text-xs font-mono font-bold text-[#FF4D77] block mt-0.5">
                  @{heroCard.data.ign}
                </span>
              </div>
            </div>

            {/* Bottom Card Footer */}
            <div className="w-full pt-2.5 border-t border-white/[0.08] flex items-center justify-between text-[10px] font-mono text-white/70 z-10">
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold">{heroCard.data.game}</span>
                <span>•</span>
                <span>{heroCard.data.role}</span>
              </div>
              <IssuedBy variant="badge" />
            </div>
          </div>

          {/* Under Card: Action Chips */}
          <div className="w-full flex items-center justify-between gap-2 mt-3 px-1">
            <div className="flex-1 h-10 rounded-full bg-[#0A0A2E] border border-white/10 flex items-center justify-center gap-1.5 text-[#22C55E]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="text-[10px] font-mono font-bold uppercase">Verifikasi ESI</span>
            </div>

            <div className="flex-1 h-10 rounded-full bg-[#0A0A2E] border border-white/10 flex items-center justify-center gap-1.5 text-[#FF4D77]">
              <Award className="w-3.5 h-3.5" />
              <span className="text-[10px] font-mono font-bold uppercase">ESPORT ID</span>
            </div>

            <button
              onClick={handleShareCard}
              className="w-10 h-10 rounded-full bg-[#0A0A2E] border border-white/10 hover:border-[#FF1752] flex items-center justify-center text-white/70 hover:text-[#FF1752] transition-all"
              aria-label="Bagikan Kartu"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
          {copiedLink && (
            <span className="text-[9px] font-mono text-[#FF4D77] mt-1">Tautan Paspor Disalin!</span>
          )}
        </section>

        {/* ==================== BLOK 4: PERAN KAMI VS MITRA (2 HORIZONTAL CARDS) ==================== */}
        <section className="w-full flex flex-col gap-2.5 z-10">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-sm uppercase text-white tracking-wide">
              Struktur Platform & Verifikasi
            </h3>
            <Link href="/about" className="text-[10px] font-mono text-[#FF4D77] hover:underline">
              Detail &rarr;
            </Link>
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-5 px-5 snap-x">
            {/* Card 1: Dikelola ESPORT SUMBAR */}
            <div className="flex-shrink-0 w-64 p-4 rounded-2xl bg-[#0A0A2E] border border-white/10 snap-start flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2 text-[#FF1752]">
                  <Database className="w-4 h-4" />
                  <span className="font-heading font-black text-xs uppercase text-white tracking-wider">
                    ESPORT SUMBAR™
                  </span>
                </div>
                <span className="text-[9px] font-mono text-[#FF4D77] uppercase font-bold block mb-2">
                  Dikelola Kami
                </span>
                <p className="text-[11px] text-white/60 leading-relaxed">
                  Penerbitan kartu identitas atlet, keamanan data profil, ekosistem turnamen, dan media publik.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-white/5 text-[9px] font-mono text-white/40">
                Merek & Platform Teknologi
              </div>
            </div>

            {/* Card 2: Diverifikasi Mitra ESI */}
            <div className="flex-shrink-0 w-64 p-4 rounded-2xl bg-[#0A0A2E] border border-white/10 snap-start flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2 text-[#22C55E]">
                  <FileCheck className="w-4 h-4" />
                  <span className="font-heading font-black text-xs uppercase text-white tracking-wider">
                    Mitra Kelembagaan ESI
                  </span>
                </div>
                <span className="text-[9px] font-mono text-[#22C55E] uppercase font-bold block mb-2">
                  Diverifikasi Mitra
                </span>
                <p className="text-[11px] text-white/60 leading-relaxed">
                  Pemeriksaan keabsahan domisili atlet oleh ESI Kota/Kabupaten dan verifikasi provinsi oleh Pengprov ESI Sumbar.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-white/5 text-[9px] font-mono text-white/40">
                19 Pengcab & Pengprov
              </div>
            </div>
          </div>
        </section>

        {/* ==================== BLOK 5: STATISTIK TABULAR ==================== */}
        <section className="w-full grid grid-cols-3 gap-2 py-1">
          <div className="h-20 rounded-2xl bg-[#0A0A2E] border border-white/10 flex flex-col items-center justify-center">
            <span className="font-heading font-black text-2xl text-white tracking-tight">
              {stats?.totalPlayers ?? 0}
            </span>
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider mt-0.5">
              Pemain
            </span>
          </div>

          <div className="h-20 rounded-2xl bg-[#0A0A2E] border border-white/10 flex flex-col items-center justify-center">
            <span className="font-heading font-black text-2xl text-[#FF4D77] tracking-tight">
              {stats?.totalTeams ?? 0}
            </span>
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider mt-0.5">
              Tim
            </span>
          </div>

          <div className="h-20 rounded-2xl bg-[#0A0A2E] border border-white/10 flex flex-col items-center justify-center">
            <span className="font-heading font-black text-2xl text-[#D4AF37] tracking-tight">
              {stats?.activeRegions ?? 19}
            </span>
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider mt-0.5">
              Wilayah
            </span>
          </div>
        </section>

        {/* ==================== BLOK 6: BERITA TERKINI ==================== */}
        <section className="w-full flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-sm uppercase text-white">Warta Berita</h3>
            <Link
              href="/news"
              onClick={() => triggerHaptic()}
              className="text-[10px] font-mono text-[#FF4D77] uppercase tracking-wider flex items-center gap-1"
            >
              <span>Semua</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {recentNews.length > 0 ? (
            <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-5 px-5 snap-x">
              {recentNews.map((news) => (
                <Link
                  key={news.id}
                  href={`/news/${news.slug}`}
                  onClick={() => triggerHaptic()}
                  className="relative flex-shrink-0 w-64 h-36 rounded-2xl overflow-hidden border border-white/10 shadow-lg snap-start group"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={news.imageUrl}
                    alt={news.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#03031A] via-[#03031A]/60 to-transparent" />

                  <div className="absolute bottom-3 left-3 right-3 z-10">
                    <span className="text-[8px] font-mono text-[#FF4D77] uppercase tracking-widest block mb-1">
                      {news.category}
                    </span>
                    <p className="font-heading font-bold text-xs text-white line-clamp-2 leading-snug">
                      {news.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-[#0A0A2E] border border-white/10 text-center flex flex-col items-center">
              <Newspaper className="w-6 h-6 text-white/30 mb-2" />
              <p className="text-xs font-heading font-bold text-white uppercase">Belum Ada Warta Berita</p>
              <p className="text-[10px] text-white/40 mt-1">Siaran pers resmi akan tampil di sini setelah diterbitkan.</p>
            </div>
          )}
        </section>

        {/* ==================== BLOK 7: MITRA STRIP ==================== */}
        <section className="w-full pt-2">
          <PartnerStrip variant="compact" />
        </section>
      </div>

      {/* FLOATING BOTTOM BAR (4 TAB PILL) */}
      <MobileBottomBar />
    </div>
  );
}
