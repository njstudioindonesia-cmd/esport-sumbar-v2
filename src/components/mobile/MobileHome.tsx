"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
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
  ExternalLink,
} from "lucide-react";
import { mapVerificationToCard } from "@/types/card";
import { GALLERY_CARDS } from "@/data/mockCards";
import { MOCK_NEWS } from "@/data/mockNews";
import { MobileBottomBar } from "./MobileBottomBar";
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
        date: new Date(a.publishedAt).toLocaleDateString("id-ID"),
        readTime: "3 min baca",
        imageUrl: a.coverImageUrl || "/images/news-placeholder.jpg",
      }))
    : MOCK_NEWS.slice(0, 3);

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
    <div className="relative w-full min-h-[100dvh] max-w-[420px] mx-auto bg-[#07080C] text-white flex flex-col pb-28 overflow-x-hidden select-none">
      {/* Background Ambience (Radial Gradients Halus) */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#D4AF37]/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-0 w-64 h-64 bg-[#4C7DFF]/6 rounded-full blur-3xl pointer-events-none" />

      {/* PULL TO REFRESH INDICATOR */}
      <div className="w-full flex justify-center pt-2">
        <button
          onClick={handlePullToRefresh}
          className="text-[10px] font-mono text-white/30 hover:text-white/60 transition-colors uppercase tracking-widest flex items-center gap-1.5"
        >
          {isRefreshing ? (
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
          )}
          <span>{isRefreshing ? "Memuat..." : "Tarik Refresh"}</span>
        </button>
      </div>

      <div className="px-5 pt-3 flex flex-col gap-7">
        {/* ==================================================================== */}
        {/* BLOK 1: HEADER (Sapaan Satu Kata + Nama, Avatar, Lonceng Notif) */}
        {/* ==================================================================== */}
        <header className="w-full flex items-center justify-between z-10">
          <div>
            <span className="text-[11px] font-mono text-white/50 uppercase tracking-widest block">
              Halo,
            </span>
            <h1 className="font-heading font-bold text-[22px] tracking-tight text-white leading-none mt-0.5">
              Sutan Aim
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Lonceng Notifikasi dengan Titik Emas */}
            <Link
              href="/me/settings"
              onClick={() => triggerHaptic()}
              className="relative w-10 h-10 rounded-full bg-[#161A24] border border-white/[0.08] flex items-center justify-center text-white/70 hover:text-white"
            >
              <Bell className="w-4 h-4" />
              {/* Titik Emas Notifikasi Belum Dibaca */}
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#D4AF37] ring-2 ring-[#07080C] shadow-[0_0_8px_#D4AF37]" />
            </Link>

            {/* Avatar Kecil */}
            <Link
              href="/me/settings"
              onClick={() => triggerHaptic()}
              className="w-10 h-10 rounded-full overflow-hidden border border-[#D4AF37]/50 shadow-[0_0_12px_rgba(212,175,55,0.2)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroCard.data.avatarUrl}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </Link>
          </div>
        </header>

        {/* ==================================================================== */}
        {/* BLOK 2: KARTU UTAMA PENGGUNA (Dompet Hero TCG Card + Chip Ikon) */}
        {/* ==================================================================== */}
        <section className="w-full flex flex-col items-center">
          {/* Hero TCG Card Container (Lebar Penuh Minus Margin, Tilt Halus) */}
          <div
            onClick={() => {
              triggerHaptic();
              router.push("/me/cards");
            }}
            className="group relative w-full h-96 rounded-[22px] bg-gradient-to-b from-[#1C2130] via-[#121622] to-[#0A0D15] border-2 border-[#4C7DFF] shadow-[0_16px_40px_rgba(76,125,255,0.22)] p-4 flex flex-col justify-between overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.01]"
          >
            {/* Ambient Corner Aura */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-[#4C7DFF]/15 blur-2xl pointer-events-none" />

            {/* Top Row: Rarity (Contender) + Regional Checked Badge */}
            <div className="w-full flex items-center justify-between z-10">
              <span className="px-2.5 py-1 rounded-full bg-[#4C7DFF]/20 border border-[#4C7DFF]/50 text-[9px] font-mono font-bold text-[#4C7DFF] uppercase tracking-wider">
                CONTENDER TIER
              </span>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-[#22C55E]/15 border border-[#22C55E]/30 text-[#22C55E]">
                <ShieldCheck className="w-3 h-3" />
                <span className="text-[8px] font-mono font-bold uppercase">REGIONAL CHECKED</span>
              </div>
            </div>

            {/* Center Area: Big Avatar & IGN */}
            <div className="relative w-full flex-1 flex flex-col items-center justify-center my-2 z-10">
              <div className="relative w-32 h-32 rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-[#07080C]">
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
                <span className="text-xs font-mono font-bold text-[#D4AF37] block mt-0.5">
                  @{heroCard.data.ign}
                </span>
              </div>
            </div>

            {/* Bottom Card Footer: Game, Role, ESPORT ID */}
            <div className="w-full pt-2.5 border-t border-white/[0.08] flex items-center justify-between text-[10px] font-mono text-white/70 z-10">
              <div className="flex items-center gap-2">
                <span className="text-[#4C7DFF] font-semibold">{heroCard.data.game}</span>
                <span>•</span>
                <span>{heroCard.data.role}</span>
              </div>
              <span className="font-bold text-[#D4AF37]">{heroCard.data.region.code}</span>
            </div>
          </div>

          {/* Di Bawah Kartu: Satu Baris Chip Ikon (Tanpa Kalimat) */}
          <div className="w-full flex items-center justify-between gap-2 mt-3 px-1">
            {/* Status Lencana */}
            <div className="flex-1 h-10 rounded-full bg-[#161A24] border border-white/[0.08] flex items-center justify-center gap-1.5 text-[#22C55E]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="text-[10px] font-mono font-bold uppercase">Regional</span>
            </div>

            {/* Tier Kelangkaan */}
            <div className="flex-1 h-10 rounded-full bg-[#161A24] border border-white/[0.08] flex items-center justify-center gap-1.5 text-[#4C7DFF]">
              <Award className="w-3.5 h-3.5" />
              <span className="text-[10px] font-mono font-bold uppercase">Contender</span>
            </div>

            {/* Tombol Bagikan Ikon */}
            <button
              onClick={handleShareCard}
              className="w-10 h-10 rounded-full bg-[#161A24] border border-white/[0.08] hover:border-[#D4AF37] flex items-center justify-center text-white/70 hover:text-[#D4AF37] transition-all"
              aria-label="Bagikan Kartu"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
          {copiedLink && (
            <span className="text-[9px] font-mono text-[#D4AF37] mt-1">Tautan Disalin!</span>
          )}
        </section>

        {/* ==================================================================== */}
        {/* BLOK 3: "LANGKAH BERIKUT" (Satu Kartu Aksi Kontekstual, 3-4 Kata) */}
        {/* ==================================================================== */}
        <section className="w-full">
          <Link
            href="/me/verification"
            onClick={() => triggerHaptic()}
            className="w-full h-15 rounded-2xl bg-gradient-to-r from-[#D4AF37]/15 via-[#161A24] to-[#161A24] border border-[#D4AF37]/40 p-4 flex items-center justify-between group shadow-lg active:scale-[0.99] transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="font-heading font-bold text-sm text-white group-hover:text-[#D4AF37] transition-colors">
                  Ajukan Verifikasi ESI
                </span>
                <span className="text-[9px] font-mono text-white/50 block">
                  Lencana Emas Provinsi
                </span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
          </Link>
        </section>

        {/* ==================================================================== */}
        {/* BLOK STATISTIK TIGA ANGKA BESAR (Pemain, Tim, Wilayah) */}
        {/* ==================================================================== */}
        <section className="w-full grid grid-cols-3 gap-2 py-1">
          <div className="h-20 rounded-2xl bg-[#0F1118] border border-white/[0.06] flex flex-col items-center justify-center">
            <span className="font-heading font-black text-2xl text-white tracking-tight">
              14.8k
            </span>
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider mt-0.5">
              Pemain
            </span>
          </div>

          <div className="h-20 rounded-2xl bg-[#0F1118] border border-white/[0.06] flex flex-col items-center justify-center">
            <span className="font-heading font-black text-2xl text-[#4C7DFF] tracking-tight">
              485
            </span>
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider mt-0.5">
              Tim
            </span>
          </div>

          <div className="h-20 rounded-2xl bg-[#0F1118] border border-white/[0.06] flex flex-col items-center justify-center">
            <span className="font-heading font-black text-2xl text-[#D4AF37] tracking-tight">
              19
            </span>
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider mt-0.5">
              Wilayah
            </span>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* BLOK 4: "TERBARU" (Carousel Berita + Profil Unggulan) */}
        {/* ==================================================================== */}
        <section className="w-full flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-base text-white">Terbaru</h3>
            <Link
              href="/news"
              onClick={() => triggerHaptic()}
              className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider flex items-center gap-1"
            >
              <span>Semua</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Carousel Horizontal Berita (Gambar Penuh, Overlay Gradien, Judul Maks 2 Baris) */}
          <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-5 px-5 snap-x">
            {recentNews.map((news) => (
              <Link
                key={news.id}
                href={`/news/${news.slug}`}
                onClick={() => triggerHaptic()}
                className="relative flex-shrink-0 w-64 h-36 rounded-2xl overflow-hidden border border-white/[0.08] shadow-lg snap-start group"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={news.imageUrl}
                  alt={news.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07080C] via-[#07080C]/60 to-transparent" />

                <div className="absolute bottom-3 left-3 right-3 z-10">
                  <span className="text-[8px] font-mono text-[#D4AF37] uppercase tracking-widest block mb-1">
                    {news.category}
                  </span>
                  <p className="font-heading font-bold text-xs text-white line-clamp-2 leading-snug">
                    {news.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Carousel Kartu Profil Unggulan (Kartu Kecil yang Bisa Digeser) */}
          <div className="flex items-center justify-between mt-2">
            <h4 className="font-heading font-bold text-xs text-white/70 uppercase tracking-wider">
              Atlet Binaan
            </h4>
            <Link
              href="/explore"
              onClick={() => triggerHaptic()}
              className="text-[10px] font-mono text-white/40 uppercase tracking-wider"
            >
              Jelajah
            </Link>
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-5 px-5 snap-x">
            {featuredCards.map((card) => (
              <div
                key={card.id}
                onClick={() => {
                  triggerHaptic();
                  router.push(`/player/${card.data.ign?.toLowerCase() || "profile"}`);
                }}
                className="flex-shrink-0 w-28 h-40 rounded-xl bg-[#121622] border border-white/[0.08] p-2 flex flex-col justify-between cursor-pointer hover:border-[#D4AF37]/50 transition-all snap-start shadow-md"
              >
                <div className="flex items-center justify-between text-[7px] font-mono text-white/50">
                  <span>{card.rarity.toUpperCase()}</span>
                  <span className="text-[#D4AF37]">{card.data.region.code}</span>
                </div>

                <div className="w-12 h-12 rounded-lg overflow-hidden mx-auto my-1 border border-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card.data.avatarUrl}
                    alt={card.data.displayName}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="text-center">
                  <div className="text-[10px] font-heading font-bold text-white truncate">
                    {card.data.displayName}
                  </div>
                  <div className="text-[8px] font-mono text-[#D4AF37]">
                    @{card.data.ign}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* FLOATING BOTTOM BAR (4 TAB PILL) */}
      <MobileBottomBar />
    </div>
  );
}
