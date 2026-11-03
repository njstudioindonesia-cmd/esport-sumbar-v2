"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  MapPin,
  Search,
  ShieldCheck,
  Award,
  ChevronRight,
  Sparkles,
  Building2,
  Users,
  Compass,
  Layers,
  Map,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WestSumbarMap } from "@/components/regions/WestSumbarMap";
import { REGIONS_DETAIL, RegionDetail } from "@/data/regions";

export default function RegionsIndexPage() {
  const [filterType, setFilterType] = useState<"all" | "kota" | "kabupaten">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showMap, setShowMap] = useState(true);

  const filteredRegions = useMemo(() => {
    return REGIONS_DETAIL.filter((region) => {
      const matchType = filterType === "all" || region.type === filterType;
      const matchQuery =
        !searchQuery.trim() ||
        region.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        region.code.toLowerCase().includes(searchQuery.toLowerCase().trim());
      return matchType && matchQuery;
    });
  }, [filterType, searchQuery]);

  return (
    <div className="min-h-screen bg-[#0B0D12] text-[#F3F4F6] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* HEADER */}
        <div className="flex flex-col gap-2 mb-8">
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#D4AF37] uppercase">
            <span>Struktur Wilayah Administratif</span>
            <span>•</span>
            <span>19 Pengcab ESI Daerah</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-heading font-black uppercase text-white tracking-tight">
            19 Kota & Kabupaten Sumatera Barat
          </h1>
          <p className="text-sm text-[#9AA3B2] max-w-2xl leading-relaxed">
            Direktori persebaran data resmi ekosistem esport di seluruh wilayah Ranah Minang dengan mekanisme verifikasi bertingkat bersama Pengcab ESI Kabupaten/Kota.
          </p>
        </div>

        {/* INTERACTIVE MAP COMPONENT TOGGLE */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Map className="w-4 h-4 text-[#D4AF37]" />
              <h2 className="text-base font-heading font-bold uppercase tracking-wider text-white">
                Peta Sebaran Interaktif
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setShowMap(!showMap)}
              className="text-xs font-heading font-semibold text-[#D4AF37] hover:underline"
            >
              {showMap ? "Sembunyikan Peta" : "Tampilkan Peta"}
            </button>
          </div>

          {showMap && <WestSumbarMap />}
        </div>

        {/* CONTROLS BAR: SEARCH & TABS */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8 p-4 rounded-xl bg-[#12151C] border border-[#262B38]">
          {/* Tabs: Semua / 7 Kota / 12 Kabupaten */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: "all", label: "Semua (19)" },
              { id: "kota", label: "7 Kota" },
              { id: "kabupaten", label: "12 Kabupaten" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterType(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                  filterType === tab.id
                    ? "bg-[#D4AF37] text-black shadow-sm"
                    : "bg-[#1A1E28] text-gray-300 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama kota atau kabupaten..."
              className="w-full bg-[#1A1E28] border border-[#262B38] focus:border-[#D4AF37] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none"
            />
          </div>
        </div>

        {/* REGIONS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRegions.map((region) => (
            <Link
              key={region.code}
              href={`/regions/${region.slug}`}
              className="p-5 rounded-2xl bg-[#12151C] border border-[#262B38] hover:border-[#D4AF37]/60 flex flex-col justify-between gap-4 transition-all group hover:scale-[1.01]"
            >
              <div>
                {/* Top status line */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                    <span className="text-[10px] font-mono font-bold text-gray-400 uppercase">
                      {region.code}
                    </span>
                    {region.isPilot && (
                      <span className="px-1.5 py-0.2 rounded bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 text-[9px] font-heading font-black">
                        PILOT
                      </span>
                    )}
                  </div>

                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-full font-heading font-bold uppercase ${
                      region.adminMode === "active"
                        ? "bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30"
                        : "bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30"
                    }`}
                  >
                    {region.adminMode === "active" ? "Pengcab Aktif" : "Fallback Provinsi"}
                  </span>
                </div>

                {/* Region Title */}
                <h3 className="text-xl font-heading font-bold text-white group-hover:text-[#D4AF37] transition-colors uppercase leading-snug">
                  {region.name}
                </h3>
                <p className="text-xs text-[#9AA3B2] line-clamp-2 mt-1.5 leading-relaxed">
                  {region.description}
                </p>
              </div>

              {/* Metrics Bar */}
              <div className="pt-3 border-t border-[#262B38] flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="text-sm font-heading font-bold text-white">
                      {region.playerCount}
                    </span>
                    <span className="text-[9px] text-[#9AA3B2] uppercase font-mono">
                      Pemain
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-heading font-bold text-[#3B82F6]">
                      {region.teamCount}
                    </span>
                    <span className="text-[9px] text-[#9AA3B2] uppercase font-mono">
                      Klub
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-heading font-bold text-[#D4AF37]">
                      {region.verifiedCount}
                    </span>
                    <span className="text-[9px] text-[#9AA3B2] uppercase font-mono">
                      Verified
                    </span>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-[#1A1E28] group-hover:bg-[#D4AF37] group-hover:text-black text-gray-400 flex items-center justify-center transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
