import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { OFFICIAL_GAMES, findGameByIdOrSlug, getGenreLabel } from "@/data/games";
import { Gamepad2, ArrowLeft, Trophy, Users, Shield, Layers, ExternalLink, ArrowRight } from "lucide-react";

export const instant = false;

interface GameDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: GameDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const game = findGameByIdOrSlug(slug);
  if (!game) return { title: "Game Tidak Ditemukan — ESPORT SUMBAR" };

  return {
    title: `${game.name} (${game.shortName}) — Cabang Game ESPORT SUMBAR`,
    description: `Panduan cabang game kompetitif ${game.name}: aturan posisi peran, pembagian tier rank, dan turnamen daerah Sumatera Barat.`,
  };
}

export default async function GameDetailPage({ params }: GameDetailPageProps) {
  const { slug } = await params;
  const game = findGameByIdOrSlug(slug);

  if (!game) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#07080C] text-white flex flex-col selection:bg-[#FF1752]/30 selection:text-white">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-white/50 mb-6">
          <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
          <span>/</span>
          <Link href="/games" className="hover:text-white transition-colors">Katalog Game</Link>
          <span>/</span>
          <span className="text-[#FF1752]">{game.name}</span>
        </div>

        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/games"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Katalog Game</span>
          </Link>
        </div>

        {/* Hero Section */}
        <header className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#FF1752]/15 via-[#0F1118] to-[#0F1118] border border-white/[0.08] mb-10 shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-2.5 mb-4">
              <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-[#FF1752] text-white font-bold uppercase tracking-wider shadow-md shadow-[#FF1752]/30">
                {getGenreLabel(game.genre)}
              </span>
              <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-white/10 text-white/80 uppercase">
                Platform: {game.platform}
              </span>
              <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 uppercase font-semibold">
                Status: Kompetitif Aktif
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-heading font-black uppercase tracking-tight text-white mb-3">
              {game.name}
            </h1>

            <p className="text-sm sm:text-base text-white/70 max-w-2xl leading-relaxed mb-6">
              Kategori kompetitif {game.category || game.genre} di Sumatera Barat.
            </p>

            <div className="flex flex-wrap items-center gap-6 text-xs font-mono text-white/60 pt-4 border-t border-white/[0.06]">
              <div>
                <span className="text-white/40 block text-[10px] uppercase">Publisher</span>
                <span className="text-white font-semibold">{game.publisher || "Penerbit Terdaftar"}</span>
              </div>
              <div>
                <span className="text-white/40 block text-[10px] uppercase">Kategori</span>
                <span className="text-white font-semibold">{game.category || getGenreLabel(game.genre)}</span>
              </div>
              <div>
                <span className="text-white/40 block text-[10px] uppercase">Platform</span>
                <span className="text-white font-semibold capitalize">{game.platform}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Roles & Positions Breakdown */}
        {game.roles && game.roles.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-heading font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#FF1752]" />
              <span>Divisi Role &amp; Posisi Pertandingan</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {game.roles.map((role, idx) => (
                <div
                  key={role}
                  className="p-4 rounded-2xl bg-[#0F1118]/80 border border-white/[0.08] text-center flex flex-col items-center justify-center gap-1"
                >
                  <span className="text-[10px] font-mono text-[#FF1752]">ROLE 0{idx + 1}</span>
                  <span className="text-sm font-heading font-bold text-white">{role}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Rank Tiers Ladder */}
        {game.ranks && game.ranks.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-heading font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#D4AF37]" />
              <span>Tangga Rank Tier Kompetitif</span>
            </h2>

            <div className="p-6 rounded-2xl bg-[#0F1118]/80 border border-white/[0.08] flex flex-wrap gap-2.5">
              {game.ranks.map((rank, idx) => (
                <div
                  key={rank}
                  className="px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center gap-2 text-xs font-mono"
                >
                  <span className="text-[10px] text-white/40">{idx + 1}.</span>
                  <span className="text-white font-semibold">{rank}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Navigation Action Strip */}
        <section className="p-6 rounded-3xl bg-[#0F1118] border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-heading font-bold text-white text-base">
              Mulai Karier Atlet di Cabang {game.shortName || game.name}
            </h3>
            <p className="text-xs text-white/60 mt-1">
              Daftarkan kartu paspor digital Anda atau jelajahi atlet dan tim terdata di cabang ini.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              href="/me/profile/new"
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-[#FF1752] hover:bg-[#E01447] text-white font-heading font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-[#FF1752]/20 transition-all"
            >
              <span>Buat Kartu Atlet</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/explore"
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/10 text-white font-mono text-xs flex items-center justify-center gap-2 transition-all border border-white/10"
            >
              <span>Cari Atlet</span>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
