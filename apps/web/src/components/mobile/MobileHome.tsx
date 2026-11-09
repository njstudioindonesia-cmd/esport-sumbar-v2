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
  CheckCircle2,
} from "lucide-react";
import { FLAGS } from "@/lib/config/flags";
import { mapVerificationToCard } from "@/types/card";
import { GALLERY_CARDS } from "@/data/mockCards";
import { MOCK_NEWS } from "@/data/mockNews";
import { MobileBottomBar } from "./MobileBottomBar";
import { EsportCard } from "@/components/card/EsportCard";
import { BrandLogo, BrandWatermark, IssuedBy, OwnershipNote } from "@/components/brand";
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
        slug: profiles[0].slug,
        type: profiles[0].entityType,
        rarity: profiles[0].rarityTier,
        verification: mapVerificationToCard(profiles[0].verificationStatus),
        data: {
          slug: profiles[0].slug,
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

  const triggerHaptic = (ms = 12) => {
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
    }, 700);
  };

  const handleShareCard = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      const slug = (heroCard as any).slug || (heroCard.data as any).slug || heroCard.data.ign?.toLowerCase() || "profile";
      navigator.clipboard.writeText(`https://esport-sumbar-v2.vercel.app/${heroCard.type || "player"}/${slug}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="relative w-full min-h-[100dvh] max-w-[420px] mx-auto bg-[#07080C] text-white flex flex-col pb-28 overflow-x-hidden select-none">
      {/* Background Ambience & Brand Watermark */}
      <BrandWatermark opacity={0.04} size={360} position="top-right" />
      <div className="absolute top-1/6 -left-16 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-16 w-64 h-64 bg-[#C8102E]/10 rounded-full blur-3xl pointer-events-none" />

      {/* PULL TO REFRESH INDICATOR */}
      <div className="w-full flex justify-center pt-2">
        <button
          onClick={handlePullToRefresh}
          className="text-[10px] font-mono text-white/30 hover:text-[#D4AF37] transition-colors uppercase tracking-widest flex items-center gap-1.5"
        >
          {isRefreshing ? (
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
          )}
          <span>{isRefreshing ? "Memperbarui..." : "Tarik Refresh"}</span>
        </button>
      </div>

      <div className="px-5 pt-2 flex flex-col gap-5">
        {/* ==================== BLOK 1: HEADER MOBILE ==================== */}
        <header className="w-full flex items-center justify-between z-10 pt-1">
          <BrandLogo variant="lockup" size="sm" withLink={true} priority={true} />

          <div className="flex items-center gap-2">
            <Link
              href="/me/settings"
              onClick={() => triggerHaptic()}
              className="relative w-9 h-9 rounded-xl bg-[#0F121C]/90 border border-white/10 flex items-center justify-center text-white/70 hover:text-white backdrop-blur-md"
              aria-label="Notifikasi"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#D4AF37] ring-2 ring-[#07080C] shadow-[0_0_8px_#D4AF37]" />
            </Link>

            <Link
              href="/me/profile"
              onClick={() => triggerHaptic()}
              className="w-9 h-9 rounded-xl overflow-hidden border border-[#D4AF37]/50 shadow-md bg-[#0F121C]"
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
        <section className="w-full flex flex-col gap-3 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F121C]/80 border border-white/10 w-fit backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-white/80">
              Platform Digital ESPORT SUMBAR
            </span>
          </div>

          <h1 className="text-3xl font-heading font-black uppercase text-white tracking-tight leading-none">
            PASPOR ATLET DIGITAL <span className="text-[#D4AF37] display-skew">SUMATERA BARAT</span>
          </h1>

          <p className="text-xs text-white/60 leading-relaxed">
            Identitas digital atlet, rekam jejak turnamen, dan lisensi terverifikasi berstandar Wilayah &amp; ESPORT SUMBAR.
          </p>

          <Link
            href="/me/profile/new"
            onClick={() => triggerHaptic()}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F59E0B] to-[#D4AF37] text-black font-heading font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_4px_24px_rgba(212,175,55,0.35)] hover:brightness-110 active:scale-[0.99] transition-all"
          >
            <Sparkles className="w-4 h-4 fill-black" />
            <span>Terbitkan Paspor Digital Sekarang</span>
          </Link>
        </section>

        {/* ==================== BLOK 3: KARTU UTAMA 3D (THE ARENA STAGE) ==================== */}
        <section className="w-full flex flex-col items-center z-10 relative">
          {/* Radial Ambient Glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-30 transition-colors duration-500"
            style={{
              backgroundColor:
                heroCard.rarity === "legend"
                  ? "rgba(192, 132, 252, 0.5)"
                  : heroCard.rarity === "elite"
                  ? "rgba(212, 175, 55, 0.45)"
                  : heroCard.rarity === "contender"
                  ? "rgba(148, 163, 184, 0.35)"
                  : "rgba(140, 90, 60, 0.35)",
            }}
          />

          <EsportCard
            type={heroCard.type as any}
            rarity={heroCard.rarity as any}
            verification={heroCard.verification}
            data={heroCard.data}
            size="mobile"
            interactive={true}
            enableGyroscope={true}
          />

          {/* Quick Action Dock */}
          <div className="w-full max-w-[340px] flex items-center justify-between gap-2 mt-4 px-1">
            <Link
              href="/me/verification"
              onClick={() => triggerHaptic()}
              className="flex-1 h-10 rounded-xl bg-[#0F121C]/80 border border-white/10 hover:border-[#22C55E]/40 flex items-center justify-center gap-1.5 text-[#22C55E] backdrop-blur-md transition-all shadow-sm"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Verifikasi ID</span>
            </Link>

            <Link
              href="/me/cards"
              onClick={() => triggerHaptic()}
              className="flex-1 h-10 rounded-xl bg-[#0F121C]/80 border border-white/10 hover:border-[#D4AF37]/40 flex items-center justify-center gap-1.5 text-[#D4AF37] backdrop-blur-md transition-all shadow-sm"
            >
              <Award className="w-3.5 h-3.5" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Dompet Kartu</span>
            </Link>

            <button
              onClick={handleShareCard}
              className="w-10 h-10 rounded-xl bg-[#0F121C]/80 border border-white/10 hover:border-[#D4AF37] flex items-center justify-center text-white/70 hover:text-[#D4AF37] backdrop-blur-md transition-all shadow-sm shrink-0"
              aria-label="Bagikan Kartu"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
          {copiedLink && (
            <span className="text-[9px] font-mono text-[#D4AF37] mt-1.5 font-bold">
              ✓ Tautan Paspor Disalin ke Papan Klip!
            </span>
          )}
        </section>

        {/* ==================== BLOK 4: STRUKTUR VERIFIKASI (KACA FROSTED) ==================== */}
        <section className="w-full flex flex-col gap-2.5 z-10">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-sm uppercase text-white tracking-wide">
              Struktur Platform &amp; Verifikasi
            </h3>
            <Link href="/about" className="text-[10px] font-mono text-[#D4AF37] hover:underline">
              Detail &rarr;
            </Link>
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-5 px-5 snap-x">
            {/* Card 1: Dikelola ESPORT SUMBAR */}
            <div className="flex-shrink-0 w-64 p-4 rounded-2xl bg-[#0F121C]/80 border border-white/10 backdrop-blur-md snap-start flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex items-center gap-2 mb-2 text-[#D4AF37]">
                  <Database className="w-4 h-4" />
                  <span className="font-heading font-black text-xs uppercase text-white tracking-wider">
                    ESPORT SUMBAR™
                  </span>
                </div>
                <span className="text-[9px] font-mono text-[#D4AF37] uppercase font-bold block mb-2">
                  Dikelola Kami
                </span>
                <p className="text-[11px] text-white/60 leading-relaxed">
                  Penerbitan kartu identitas atlet, keamanan data profil, ekosistem turnamen, dan media publik.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-white/5 text-[9px] font-mono text-white/40">
                Merek &amp; Platform Teknologi
              </div>
            </div>

            {/* Card 2: Diverifikasi Tim Kurasi */}
            <div className="flex-shrink-0 w-64 p-4 rounded-2xl bg-[#0F121C]/80 border border-white/10 backdrop-blur-md snap-start flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex items-center gap-2 mb-2 text-[#22C55E]">
                  <FileCheck className="w-4 h-4" />
                  <span className="font-heading font-black text-xs uppercase text-white tracking-wider">
                    tim kurasi ESPORT SUMBAR
                  </span>
                </div>
                <span className="text-[9px] font-mono text-[#22C55E] uppercase font-bold block mb-2">
                  Diverifikasi Mitra
                </span>
                <p className="text-[11px] text-white/60 leading-relaxed">
                  Pemeriksaan validitas data profil dan keabsahan domisili atlet oleh tim kurasi ESPORT SUMBAR.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-white/5 text-[9px] font-mono text-white/40">
                19 Wilayah &amp; ESPORT SUMBAR
              </div>
            </div>
          </div>
        </section>

        {/* ==================== BLOK 5: STATISTIK TABULAR ==================== */}
        <section className="w-full grid grid-cols-3 gap-2 py-1">
          <div className="h-20 rounded-2xl bg-[#0F121C]/80 border border-white/10 backdrop-blur-md flex flex-col items-center justify-center shadow-md">
            <span className="font-heading font-black text-2xl text-white tracking-tight">
              {stats?.totalPlayers ?? 0}
            </span>
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider mt-0.5">
              Pemain
            </span>
          </div>

          <div className="h-20 rounded-2xl bg-[#0F121C]/80 border border-white/10 backdrop-blur-md flex flex-col items-center justify-center shadow-md">
            <span className="font-heading font-black text-2xl text-[#D4AF37] tracking-tight">
              {stats?.totalTeams ?? 0}
            </span>
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider mt-0.5">
              Tim
            </span>
          </div>

          <div className="h-20 rounded-2xl bg-[#0F121C]/80 border border-white/10 backdrop-blur-md flex flex-col items-center justify-center shadow-md">
            <span className="font-heading font-black text-2xl text-[#22C55E] tracking-tight">
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
              className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider flex items-center gap-1 hover:underline"
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
                  className="relative flex-shrink-0 w-64 h-36 rounded-2xl overflow-hidden border border-white/10 shadow-lg snap-start group bg-[#0F121C]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={news.imageUrl}
                    alt={news.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07080C] via-[#07080C]/60 to-transparent" />

                  <div className="absolute bottom-3 left-3 right-3 z-10">
                    <span className="text-[8px] font-mono text-[#D4AF37] uppercase tracking-widest block mb-1 font-bold">
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
            <div className="p-6 rounded-2xl bg-[#0F121C]/80 border border-white/10 text-center flex flex-col items-center">
              <Newspaper className="w-6 h-6 text-white/30 mb-2" />
              <p className="text-xs font-heading font-bold text-white uppercase">Belum Ada Warta Berita</p>
              <p className="text-[10px] text-white/40 mt-1">Siaran warta akan tampil di sini setelah diterbitkan.</p>
            </div>
          )}
        </section>

        {/* ==================== BLOK 7: KETERANGAN KEPEMILIKAN ==================== */}
        <section className="w-full pt-1">
          <OwnershipNote />
        </section>
      </div>

      {/* FLOATING BOTTOM BAR (4 TAB PILL) */}
      <MobileBottomBar />
    </div>
  );
}
