"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Trophy,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { Footer } from "@/components/layout/Footer";
import { QuietSurface } from "@/components/glass/QuietSurface";

interface AchievementItem {
  id: string;
  profileName: string;
  ign: string;
  esportId: string;
  tournamentName: string;
  organizer: string;
  game: string;
  placement: string;
  year: number;
  status: "verified" | "pending" | "rejected";
  tierTier: "Elite" | "Master" | "Challenger";
}

export default function AdminAchievementsPage() {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const achievements: AchievementItem[] = [
    {
      id: "ach-1",
      profileName: "Fajar Nugraha",
      ign: "MINANG_ACE",
      esportId: "ESP-SB-VER-2026-0012",
      tournamentName: "Piala Gubernur Sumatera Barat 2025",
      organizer: "Komunitas Esport Padang",
      game: "Mobile Legends: Bang Bang",
      placement: "Juara 1",
      year: 2025,
      status: "verified",
      tierTier: "Elite",
    },
    {
      id: "ach-2",
      profileName: "Dedi Kurniawan",
      ign: "SUMBAR_RUSHER",
      esportId: "ESP-SB-VER-2026-0088",
      tournamentName: "Turnamen Terbuka Ranah Minang 2026",
      organizer: "Bukittinggi Gaming Hub",
      game: "PUBG Mobile",
      placement: "Juara 2",
      year: 2026,
      status: "pending",
      tierTier: "Master",
    },
    {
      id: "ach-3",
      profileName: "Rian Pratama",
      ign: "PADANG_SNIPER",
      esportId: "ESP-SB-VER-2026-0104",
      tournamentName: "Liga Pelajar Esport Payakumbuh",
      organizer: "SMK Negeri 1 Payakumbuh",
      game: "Free Fire",
      placement: "Juara 1",
      year: 2025,
      status: "verified",
      tierTier: "Challenger",
    },
  ];

  const filtered = achievements.filter((a) => {
    const matchesSearch =
      a.tournamentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.profileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.ign.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || a.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#07080C] text-slate-100 flex flex-col font-sans">
      <AdminNavbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
              <Trophy className="w-6 h-6 text-pink-500" />
              Validasi Prestasi & Riwayat Turnamen
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Verifikasi rekam jejak turnamen dan pencapaian atlet untuk penentuan tier kartu paspor.
            </p>
          </div>
        </div>

        {/* Search & Filter */}
        <QuietSurface radius="2xl" elevation="raised" className="mb-6 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari turnamen, atlet, atau IGN..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-800/80 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
            />
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs text-slate-400">Status:</span>
            {["all", "verified", "pending", "rejected"].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1 rounded-lg text-xs capitalize transition-colors ${
                  filterStatus === s
                    ? "bg-pink-600 text-white font-medium"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {s === "all" ? "Semua" : s === "verified" ? "Terverifikasi" : s === "pending" ? "Menunggu" : "Ditolak"}
              </button>
            ))}
          </div>
        </QuietSurface>

        {/* Tabel Prestasi */}
        <QuietSurface radius="2xl" elevation="raised" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-white/10">
                <tr>
                  <th className="px-4 py-3.5">Turnamen & Penyelenggara</th>
                  <th className="px-4 py-3.5">Atlet / Profil</th>
                  <th className="px-4 py-3.5">Game</th>
                  <th className="px-4 py-3.5">Capaian</th>
                  <th className="px-4 py-3.5 text-center">Status</th>
                  <th className="px-4 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-200">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3.5">
                      <p className="font-semibold text-white">{item.tournamentName}</p>
                      <p className="text-[11px] text-slate-400">
                        {item.organizer} · {item.year}
                      </p>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-medium text-slate-200">{item.profileName}</p>
                      <p className="text-[11px] font-mono text-pink-400">
                        {item.ign} ({item.esportId})
                      </p>
                    </td>
                    <td className="px-4 py-3.5 text-slate-300">{item.game}</td>
                    <td className="px-4 py-3.5">
                      <span className="font-bold text-amber-400">{item.placement}</span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-medium ${
                          item.status === "verified"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : item.status === "pending"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        }`}
                      >
                        {item.status === "verified" && <CheckCircle2 className="w-3 h-3" />}
                        {item.status === "pending" && <Clock className="w-3 h-3" />}
                        {item.status === "rejected" && <XCircle className="w-3 h-3" />}
                        {item.status === "verified"
                          ? "Terverifikasi"
                          : item.status === "pending"
                          ? "Menunggu"
                          : "Ditolak"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-200 transition-colors">
                        Validasi Berkas
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </QuietSurface>
      </main>

      <Footer />
    </div>
  );
}
