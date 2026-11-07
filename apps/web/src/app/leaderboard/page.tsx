"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Trophy,
  Medal,
  Award,
  Crown,
  Search,
  Filter,
  MapPin,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MOCK_CIRCUIT_LEADERBOARD } from "@/data/tournaments";
import { FLAGS } from "@/lib/config/flags";

export default function LeaderboardPage() {
  const [selectedGame, setSelectedGame] = useState("all");

  const circuitList = FLAGS.SHOW_DEMO_DATA ? MOCK_CIRCUIT_LEADERBOARD : [];

  const filteredLeaderboard = selectedGame === "all"
    ? circuitList
    : circuitList.filter((entry) => entry.game.toLowerCase().includes(selectedGame.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#0B0D12] text-[#F3F4F6] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* HEADER */}
        <div className="flex flex-col gap-3 mb-8">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-brand-pink/15 border border-brand-pink/30 text-brand-pink text-xs font-heading font-extrabold uppercase tracking-wider flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5" />
              Sirkuit Kompetisi Sumatera Barat
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-black uppercase text-white tracking-tight">
            Klasemen <span className="text-brand-pink">Sirkuit Tim</span> 2026
          </h1>
          <p className="text-sm text-[#9AA3B2] max-w-2xl leading-relaxed">
            Peringkat akumulasi poin tim esport se-Sumatera Barat dari turnamen dan kompetisi terverifikasi di platform ESPORT SUMBAR™.
          </p>
        </div>

        {/* KONTEN KLASEMEN ATAU EMPTY STATE BERSIH */}
        {filteredLeaderboard.length === 0 ? (
          <div className="w-full p-16 text-center rounded-3xl bg-[#12151C] border border-[#262B38] flex flex-col items-center justify-center shadow-xl">
            <Trophy className="w-14 h-14 text-[#D4AF37]/40 mb-3" />
            <h3 className="font-heading font-black text-xl text-white uppercase tracking-tight">
              Klasemen Sirkuit Belum Berjalan
            </h3>
            <p className="text-xs text-white/50 max-w-md mt-1 leading-relaxed">
              Akumulasi poin sirkuit tim se-Sumatera Barat akan diperbarui secara otomatis setelah turnamen perdana musim kompetisi 2026 selesai diselenggarakan oleh ESPORT SUMBAR &amp; komunitas daerah.
            </p>
          </div>
        ) : (
          <>
            {/* PODIUM TOP 3 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 items-end">
              {/* RANK 2 */}
              {filteredLeaderboard[1] && (
                <div className="p-6 rounded-2xl bg-[#12151C] border border-[#262B38] flex flex-col items-center text-center shadow-lg relative order-2 md:order-1">
                  <div className="w-12 h-12 rounded-full bg-gray-400/20 border border-gray-400 flex items-center justify-center text-gray-300 font-heading font-black text-xl mb-3">
                    #2
                  </div>
                  <h2 className="text-lg font-heading font-black text-white">{filteredLeaderboard[1].teamName}</h2>
                  <span className="text-xs text-gray-400 font-mono">{filteredLeaderboard[1].regionName}</span>
                  <div className="mt-4 p-2.5 rounded-xl bg-[#1A1E28] border border-[#262B38] w-full">
                    <span className="text-[10px] text-gray-400 uppercase font-mono block">Akumulasi Poin</span>
                    <span className="text-xl font-heading font-black text-gray-200">{filteredLeaderboard[1].points} PTS</span>
                  </div>
                </div>
              )}

              {/* RANK 1 (CHAMPION) */}
              {filteredLeaderboard[0] && (
                <div className="p-8 rounded-3xl bg-gradient-to-b from-[#1C180F] to-[#12151C] border-2 border-[#D4AF37] flex flex-col items-center text-center shadow-[0_0_50px_rgba(212,175,55,0.25)] relative order-1 md:order-2 -translate-y-2">
                  <Crown className="w-8 h-8 text-[#D4AF37] animate-bounce mb-2" />
                  <div className="w-16 h-16 rounded-full bg-[#D4AF37]/20 border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] font-heading font-black text-2xl mb-3 shadow-lg">
                    #1
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-mono uppercase font-bold mb-1">
                    Peringkat 1 Sirkuit Sumbar
                  </span>
                  <h2 className="text-2xl font-heading font-black text-white">{filteredLeaderboard[0].teamName}</h2>
                  <span className="text-xs text-gray-400 font-mono">{filteredLeaderboard[0].regionName}</span>
                  <div className="mt-5 p-3 rounded-xl bg-[#1A1E28] border border-[#D4AF37]/40 w-full">
                    <span className="text-[10px] text-gray-400 uppercase font-mono block">Total Circuit Points</span>
                    <span className="text-2xl font-heading font-black text-[#D4AF37]">{filteredLeaderboard[0].points} PTS</span>
                  </div>
                </div>
              )}

              {/* RANK 3 */}
              {filteredLeaderboard[2] && (
                <div className="p-6 rounded-2xl bg-[#12151C] border border-[#262B38] flex flex-col items-center text-center shadow-lg relative order-3">
                  <div className="w-12 h-12 rounded-full bg-[#F59E0B]/20 border border-[#F59E0B] flex items-center justify-center text-[#F59E0B] font-heading font-black text-xl mb-3">
                    #3
                  </div>
                  <h2 className="text-lg font-heading font-black text-white">{filteredLeaderboard[2].teamName}</h2>
                  <span className="text-xs text-gray-400 font-mono">{filteredLeaderboard[2].regionName}</span>
                  <div className="mt-4 p-2.5 rounded-xl bg-[#1A1E28] border border-[#262B38] w-full">
                    <span className="text-[10px] text-gray-400 uppercase font-mono block">Akumulasi Poin</span>
                    <span className="text-xl font-heading font-black text-[#F59E0B]">{filteredLeaderboard[2].points} PTS</span>
                  </div>
                </div>
              )}
            </div>

        {/* LEADERBOARD TABLE */}
        <div className="rounded-3xl bg-[#12151C] border border-[#262B38] shadow-xl overflow-hidden">
          <div className="p-6 border-b border-[#262B38] flex flex-col sm:flex-row items-center justify-between gap-4">
            <h2 className="text-lg font-heading font-black uppercase text-white">
              Tabel Peringkat Lengkap Sirkuit Sumbar
            </h2>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-mono uppercase">Filter Divisi:</span>
              <select
                value={selectedGame}
                onChange={(e) => setSelectedGame(e.target.value)}
                aria-label="Filter Divisi Game"
                className="bg-[#1A1E28] border border-[#262B38] text-xs text-white rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="all">Semua Divisi Game</option>
                <option value="Mobile Legends">Mobile Legends</option>
                <option value="PUBG Mobile">PUBG Mobile</option>
                <option value="Free Fire">Free Fire</option>
                <option value="Valorant">Valorant</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#262B38] bg-[#161B24] text-[10px] font-mono text-[#9AA3B2] uppercase tracking-wider">
                  <th className="py-3 px-4 text-center w-16">Rank</th>
                  <th className="py-3 px-4">Nama Tim / Klub</th>
                  <th className="py-3 px-4">Wilayah Asal</th>
                  <th className="py-3 px-4">Divisi Utama</th>
                  <th className="py-3 px-4 text-center">Medali (E / P / P)</th>
                  <th className="py-3 px-4 text-right">Poin Sirkuit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262B38] text-xs">
                {filteredLeaderboard.map((item) => (
                  <tr key={item.rank} className="hover:bg-[#1A1E28]/60 transition-colors">
                    <td className="py-3.5 px-4 text-center font-heading font-black">
                      <span
                        className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs ${
                          item.rank === 1
                            ? "bg-[#D4AF37] text-black"
                            : item.rank === 2
                            ? "bg-gray-400 text-black"
                            : item.rank === 3
                            ? "bg-[#F59E0B] text-black"
                            : "bg-[#1A1E28] text-gray-300 font-mono"
                        }`}
                      >
                        {item.rank}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-extrabold text-white">{item.teamName}</span>
                        <span className="px-1.5 py-0.5 rounded bg-black/40 text-[10px] font-mono text-gray-400">
                          {item.teamTag}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-gray-300">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-[#D4AF37]" />
                        <span>{item.regionName}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-gray-300 font-mono text-[11px]">
                      {item.game}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono">
                      <span className="text-[#D4AF37] font-bold">{item.goldMedals}</span>
                      <span className="text-gray-500 mx-1">/</span>
                      <span className="text-gray-300 font-bold">{item.silverMedals}</span>
                      <span className="text-gray-500 mx-1">/</span>
                      <span className="text-[#F59E0B] font-bold">{item.bronzeMedals}</span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-heading font-black text-sm text-[#D4AF37]">
                      {item.points.toLocaleString("id-ID")} PTS
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </>
    )}
      </main>

      <Footer />
    </div>
  );
}
