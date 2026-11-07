import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { OFFICIAL_GAMES, getGenreLabel } from "@/data/games";
import { Gamepad2, ChevronRight, Layers, Users, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Katalog Cabang Game Kompetitif — ESPORT SUMBAR",
  description: "Daftar cabang game kompetitif terdaftar di Sumatera Barat: aturan peran, pembagian tier rank, dan statistik komunitas atlet aktif.",
};

export default function GamesCatalogPage() {
  const activeGames = OFFICIAL_GAMES.filter((g) => g.isActive);

  return (
    <div className="min-h-screen bg-[#07080C] text-white flex flex-col selection:bg-[#FF1752]/30 selection:text-white">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-white/50 mb-6">
          <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
          <span>/</span>
          <span className="text-[#FF1752]">Katalog Game</span>
        </div>

        {/* Hero */}
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF1752]/10 border border-[#FF1752]/30 text-xs font-mono text-[#FF4D77] mb-4">
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Katalog Cabang Game Dinamis</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-heading font-black uppercase tracking-tight text-white mb-4">
            Cabang Game Kompetitif
          </h1>
          <p className="text-sm sm:text-base text-white/70 max-w-2xl leading-relaxed">
            Daftar 11 nomor game yang terintegrasi dalam sistem paspor digital, turnamen daerah, dan pembinaan atlet ESPORT SUMBAR.
          </p>
        </header>

        {/* Game Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeGames.map((game) => (
            <Link
              key={game.id}
              href={`/games/${game.slug}`}
              className="group p-6 rounded-3xl bg-[#0F1118]/80 border border-white/[0.08] hover:border-[#FF1752]/50 hover:bg-[#131622] transition-all flex flex-col justify-between shadow-xl relative overflow-hidden"
            >
              {/* Top Accent Gradient */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FF1752]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[#FF1752]/15 text-[#FF4D77] font-bold uppercase tracking-wider border border-[#FF1752]/30">
                    {getGenreLabel(game.genre)}
                  </span>
                  <span className="text-[10px] font-mono text-white/40 uppercase">
                    {game.platform}
                  </span>
                </div>

                {/* Game Title */}
                <h2 className="text-xl font-heading font-black text-white group-hover:text-[#FF1752] transition-colors mb-1">
                  {game.name}
                </h2>
                <div className="text-xs font-mono text-[#D4AF37] mb-3">
                  Publisher: {game.publisher}
                </div>

                <p className="text-xs text-white/60 line-clamp-2 leading-relaxed mb-4">
                  Kategori kompetitif {game.category || game.genre} di Sumatera Barat.
                </p>

                {/* Roles Pills */}
                {game.roles && game.roles.length > 0 && (
                  <div className="mb-4">
                    <span className="text-[10px] font-mono text-white/40 block mb-1.5 uppercase">
                      Divisi Role Pertandingan ({game.roles.length}):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {game.roles.slice(0, 4).map((role) => (
                        <span
                          key={role}
                          className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.04] text-white/70 border border-white/[0.06]"
                        >
                          {role}
                        </span>
                      ))}
                      {game.roles.length > 4 && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/[0.04] text-white/40">
                          +{game.roles.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Footer */}
              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-white/50 group-hover:text-white transition-colors">
                <span className="flex items-center gap-1.5 text-[11px]">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Lihat Detail Cabang</span>
                </span>
                <ChevronRight className="w-4 h-4 text-[#FF1752] group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
