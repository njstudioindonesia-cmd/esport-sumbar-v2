"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Trophy,
  Search,
  Filter,
  Calendar,
  MapPin,
  ShieldCheck,
  Users,
  ArrowRight,
  Sparkles,
  Gamepad2,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MOCK_TOURNAMENTS } from "@/data/tournaments";
import { FLAGS } from "@/lib/config/flags";

export default function TournamentsPage() {
  if (!FLAGS.ENABLE_TOURNAMENTS) {
    notFound();
  }

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const tournamentList = FLAGS.SHOW_DEMO_DATA ? MOCK_TOURNAMENTS : [];

  const filteredTournaments = useMemo(() => {
    return tournamentList.filter((item) => {
      const matchSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.game.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.organizer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus =
        statusFilter === "all" || item.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [tournamentList, searchQuery, statusFilter]);

  return (
    <div className="min-h-screen bg-[#0B0D12] text-[#F3F4F6] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* HEADER */}
        <div className="flex flex-col gap-3 mb-8">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-heading font-extrabold uppercase tracking-wider flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5" />
              Sirkuit Kejuaraan Sumbar
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-black uppercase text-white tracking-tight">
            Jadwal <span className="text-[#D4AF37]">Turnamen Esport</span> Sumbar
          </h1>
          <p className="text-sm text-[#9AA3B2] max-w-2xl leading-relaxed">
            Kompetisi sirkuit ESPORT SUMBAR. Raih Circuit Points untuk kualifikasi Kejurda.
          </p>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="p-4 rounded-2xl bg-[#12151C] border border-[#262B38] mb-8 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-lg">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kejuaraan / nomor game..."
              className="w-full bg-[#1A1E28] border border-[#262B38] focus:border-[#D4AF37] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-[#D4AF37] shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter Status Kompetisi"
              className="w-full sm:w-56 bg-[#1A1E28] border border-[#262B38] text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="all">Semua Status Turnamen</option>
              <option value="pendaftaran">Pendaftaran Dibuka</option>
              <option value="berlangsung">Sedang Berlangsung (Live)</option>
              <option value="selesai">Selesai</option>
            </select>
          </div>
        </div>

        {/* TOURNAMENTS LIST */}
        {filteredTournaments.length === 0 ? (
          <div className="w-full p-16 text-center rounded-2xl bg-[#12151C] border border-[#262B38] flex flex-col items-center justify-center">
            <Trophy className="w-12 h-12 text-[#D4AF37]/40 mb-3" />
            <h3 className="font-heading font-black text-xl text-white uppercase tracking-tight">
              Belum Ada Kejuaraan Aktif
            </h3>
            <p className="text-xs text-white/50 max-w-md mt-1 leading-relaxed">
              Kalender Sirkuit Kejuaraan ESPORT SUMBAR musim kompetisi 2026 sedang dalam tahap penyusunan teknis bersama perwakilan 19 Kota/Kabupaten.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {filteredTournaments.map((t) => (
            <div
              key={t.id}
              className="p-6 rounded-2xl bg-[#12151C] border border-[#262B38] hover:border-[#D4AF37]/50 transition-all shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4AF37]/5 blur-2xl pointer-events-none" />

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded bg-[#1A1E28] border border-[#262B38] text-[10px] font-mono text-[#D4AF37] uppercase font-bold">
                    {t.tier}
                  </span>
                  <span className="px-2.5 py-0.5 rounded bg-blue-950/60 border border-blue-800 text-[10px] font-mono text-blue-300 font-bold uppercase">
                    {t.gameShort}
                  </span>

                  {t.isOfficial && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#22C55E]/20 border border-[#22C55E]/40 text-[#22C55E] text-[10px] font-heading font-extrabold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Terverifikasi ESPORT SUMBAR
                    </span>
                  )}

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                      t.status === "berlangsung"
                        ? "bg-[#F04438]/20 border border-[#F04438]/40 text-[#F04438] animate-pulse"
                        : t.status === "pendaftaran"
                        ? "bg-brand-pink/20 border border-brand-pink/40 text-brand-pink"
                        : "bg-gray-800 text-gray-400"
                    }`}
                  >
                    {t.status === "berlangsung" ? "● Sedang Berlangsung" : t.status === "pendaftaran" ? "Pendaftaran Buka" : "Selesai"}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-heading font-black text-white group-hover:text-[#D4AF37] transition-colors leading-tight">
                  {t.title}
                </h2>
                <p className="text-xs text-[#9AA3B2] mt-1 mb-4 leading-relaxed">
                  {t.rulesSummary}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-300">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                    {t.startDate} – {t.endDate}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#C8102E]" />
                    {t.regionName}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-400" />
                    Slot: {t.registeredTeamsCount}/{t.maxTeams} Tim Terdaftar
                  </span>
                </div>
              </div>

              {/* PRIZE POOL & ACTION BUTTON */}
              <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-[#262B38] shrink-0">
                <div className="text-left lg:text-right">
                  <span className="text-[10px] uppercase font-mono text-gray-400 block">Total Hadiah (Prize Pool)</span>
                  <span className="text-xl font-heading font-black text-[#D4AF37]">{t.prizePool}</span>
                </div>

                <Link
                  href={`/tournaments/${t.id}`}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E5C358] text-black text-xs font-heading font-extrabold uppercase tracking-wider shadow-lg hover:brightness-110 transition-all"
                >
                  <span>Bagan & Live Match</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
      </main>

      <Footer />
    </div>
  );
}
