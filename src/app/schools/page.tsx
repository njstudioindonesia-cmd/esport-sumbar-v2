"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Search,
  Filter,
  MapPin,
  ShieldCheck,
  Trophy,
  Users,
  Award,
  ArrowRight,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MOCK_SCHOOLS } from "@/data/ecosystem";
import { REGIONS_DETAIL } from "@/data/regions";

export default function SchoolsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  const filteredSchools = useMemo(() => {
    return MOCK_SCHOOLS.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.clubName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchType = selectedType === "all" || item.type === selectedType;
      return matchSearch && matchType;
    });
  }, [searchQuery, selectedType]);

  return (
    <div className="min-h-screen bg-[#0B0D12] text-[#F3F4F6] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* HEADER */}
        <div className="flex flex-col gap-3 mb-8">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-heading font-extrabold uppercase tracking-wider flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5" />
              Esport Pelajar & Mahasiswa
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-black uppercase text-white tracking-tight">
            Kampus & <span className="text-[#D4AF37]">Sekolah Binaan</span> ESI Sumbar
          </h1>
          <p className="text-sm text-[#9AA3B2] max-w-2xl leading-relaxed">
            Program integrasi esports prestasi dengan dunia akademis di SMA, SMK, dan Perguruan Tinggi terkemuka di Sumatera Barat.
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
              placeholder="Cari nama institusi / klub..."
              className="w-full bg-[#1A1E28] border border-[#262B38] focus:border-[#D4AF37] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-[#D4AF37] shrink-0" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              aria-label="Filter Jenjang Institusi Pendidikan"
              className="w-full sm:w-64 bg-[#1A1E28] border border-[#262B38] text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="all">Semua Jenjang Pendidikan</option>
              <option value="Universitas / Perguruan Tinggi">Perguruan Tinggi / Universitas</option>
              <option value="SMA / SMK">SMA / SMK Sederajat</option>
              <option value="Akademi Olahraga">Akademi Olahraga Khusus</option>
            </select>
          </div>
        </div>

        {/* SCHOOLS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSchools.map((s) => (
            <div
              key={s.id}
              className="p-6 rounded-2xl bg-[#12151C] border border-[#262B38] hover:border-[#D4AF37]/50 transition-all flex flex-col justify-between shadow-lg group relative"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="px-2.5 py-0.5 rounded bg-[#1A1E28] border border-[#262B38] text-[10px] font-mono text-[#D4AF37] uppercase font-bold">
                      {s.type}
                    </span>
                    <h2 className="text-xl font-heading font-extrabold text-white mt-1 group-hover:text-[#D4AF37] transition-colors">
                      {s.name}
                    </h2>
                    <span className="text-xs text-[#D4AF37] font-semibold block mt-0.5">
                      Klub: {s.clubName}
                    </span>
                  </div>

                  {s.supervisedByEsi && (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#22C55E]/20 border border-[#22C55E]/40 text-[#22C55E] text-[10px] font-heading font-extrabold shrink-0">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Binaan Resmi ESI
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#9AA3B2] leading-relaxed my-3">
                  {s.description}
                </p>

                {/* STATS STRIP */}
                <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-[#1A1E28] border border-[#262B38] text-center mb-4">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-mono block">Atlet Pelajar</span>
                    <span className="text-sm font-heading font-black text-white">{s.activePlayersCount} Siswa</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-mono block">Prestasi Resmi</span>
                    <span className="text-sm font-heading font-black text-[#D4AF37]">{s.achievementsCount} Piala</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-mono block">Pelatih Berlisensi</span>
                    <span className="text-xs font-heading font-bold text-gray-200 truncate block mt-0.5">{s.coachName}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#262B38]">
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{s.regionName}</span>
                </div>

                <Link
                  href="/register"
                  className="flex items-center gap-1 text-xs font-heading font-bold text-[#D4AF37] hover:underline"
                >
                  <span>Daftar Lewat Sekolah</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
