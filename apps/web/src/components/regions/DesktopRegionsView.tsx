"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  ArrowRight,
} from "lucide-react";
import { REGIONS_DETAIL, RegionDetail } from "@/data/regions";

// Schematic coordinates for 19 regions of West Sumatra
const REGION_COORDINATES: Record<string, { x: number; y: number }> = {
  PAS: { x: 320, y: 80 },   // Pasaman (Utara)
  PSB: { x: 230, y: 120 },  // Pasaman Barat
  AGM: { x: 300, y: 160 },  // Agam
  BKT: { x: 345, y: 165 },  // Bukittinggi
  LPK: { x: 420, y: 150 },  // Lima Puluh Kota
  PYK: { x: 400, y: 175 },  // Payakumbuh
  PPJ: { x: 330, y: 205 },  // Padang Panjang
  TND: { x: 375, y: 215 },  // Tanah Datar
  PRM: { x: 260, y: 230 },  // Pariaman
  PDP: { x: 285, y: 245 },  // Padang Pariaman
  PDG: { x: 305, y: 295 },  // Padang
  SWL: { x: 440, y: 240 },  // Sawahlunto
  SLK: { x: 380, y: 275 },  // Kota Solok
  KSL: { x: 400, y: 310 },  // Kab Solok
  SJJ: { x: 470, y: 280 },  // Sijunjung
  DHM: { x: 530, y: 350 },  // Dharmasraya
  SLS: { x: 430, y: 380 },  // Solok Selatan
  PSS: { x: 350, y: 440 },  // Pesisir Selatan
  MTW: { x: 120, y: 360 },  // Kepulauan Mentawai (Barat Daya)
};

export function DesktopRegionsView() {
  const router = useRouter();
  const [filterType, setFilterType] = useState<"all" | "kota" | "kabupaten">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredRegion, setHoveredRegion] = useState<RegionDetail | null>(null);
  const [liveMapStats, setLiveMapStats] = useState<Record<string, any>>({});

  React.useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/stats");
        if (res.ok) {
          const json = await res.json();
          if (json.mapStats) {
            setLiveMapStats(json.mapStats);
          }
        }
      } catch {
        // Ignored
      }
    }
    loadStats();
  }, []);

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
    <div className="w-full flex flex-col gap-8 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#D4AF37] uppercase mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <span>Struktur Administratif ESPORT SUMBAR</span>
          </div>
          <h1 className="text-3xl font-heading font-black text-white tracking-tight">
            19 Wilayah Sumatera Barat
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-white/60">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>19 Wilayah Terpetakan</span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TWO COLUMNS: KIRI PETA SVG INTERAKTIF, KANAN GRID EMBLEM */}
      {/* ========================================================= */}
      <div className="grid grid-cols-12 gap-8 items-start">
        {/* ======================================================= */}
        {/* KOLOM KIRI (5/12): PETA SVG INTERAKTIF BERCAMPUR CAHAYA */}
        {/* ======================================================= */}
        <div className="col-span-12 lg:col-span-5 sticky top-24 flex flex-col gap-4">
          <div className="relative w-full h-[540px] rounded-3xl bg-[#0F1118]/90 border border-white/[0.08] shadow-2xl p-4 flex flex-col justify-between overflow-hidden backdrop-blur-xl">
            {/* Ambient map glows */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#4C7DFF]/10 blur-3xl pointer-events-none" />

            {/* Top map bar */}
            <div className="relative z-10 flex items-center justify-between px-2 pt-1">
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
                PETA INTERAKTIF SEBARAN
              </span>
              <span className="text-[10px] font-mono text-[#D4AF37]">
                Klik daerah untuk membuka
              </span>
            </div>

            {/* SVG MAP */}
            <div className="relative flex-1 flex items-center justify-center">
              <svg viewBox="0 0 620 520" className="w-full h-full max-h-[460px]">
                {/* Connecting Lines */}
                <g stroke="rgba(255,255,255,0.08)" strokeWidth="1.2" strokeDasharray="3 3">
                  <line x1="320" y1="80" x2="230" y2="120" />
                  <line x1="320" y1="80" x2="300" y2="160" />
                  <line x1="300" y1="160" x2="345" y2="165" />
                  <line x1="345" y1="165" x2="400" y2="175" />
                  <line x1="400" y1="175" x2="420" y2="150" />
                  <line x1="345" y1="165" x2="330" y2="205" />
                  <line x1="330" y1="205" x2="375" y2="215" />
                  <line x1="300" y1="160" x2="285" y2="245" />
                  <line x1="285" y1="245" x2="260" y2="230" />
                  <line x1="285" y1="245" x2="305" y2="295" />
                  <line x1="375" y1="215" x2="380" y2="275" />
                  <line x1="380" y1="275" x2="440" y2="240" />
                  <line x1="440" y1="240" x2="470" y2="280" />
                  <line x1="380" y1="275" x2="400" y2="310" />
                  <line x1="470" y1="280" x2="530" y2="350" />
                  <line x1="400" y1="310" x2="430" y2="380" />
                  <line x1="305" y1="295" x2="350" y2="440" />
                  <line x1="305" y1="295" x2="120" y2="360" stroke="#4C7DFF" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
                </g>

                {/* Region Nodes */}
                {REGIONS_DETAIL.map((region) => {
                  const coords = REGION_COORDINATES[region.code] || { x: 300, y: 250 };
                  const isHovered = hoveredRegion?.code === region.code;
                  const isCity = region.type === "kota";

                  return (
                    <g
                      key={region.code}
                      className="cursor-pointer group"
                      onClick={() => router.push(`/regions/${region.slug}`)}
                      onMouseEnter={() => setHoveredRegion(region)}
                      onMouseLeave={() => setHoveredRegion(null)}
                    >
                      {/* Pulse Glow */}
                      {(isHovered || region.isPilot) && (
                        <circle
                          cx={coords.x}
                          cy={coords.y}
                          r={isHovered ? 24 : 16}
                          fill={
                            region.isPilot
                              ? "rgba(212, 175, 55, 0.3)"
                              : "rgba(76, 125, 255, 0.25)"
                          }
                          className="animate-pulse"
                        />
                      )}

                      {/* Main Node Circle */}
                      <circle
                        cx={coords.x}
                        cy={coords.y}
                        r={isCity ? 10 : 8}
                        fill={isHovered ? "#D4AF37" : "#10B981"}
                        stroke="#07080C"
                        strokeWidth="2.5"
                        className="transition-colors duration-150"
                      />

                      {/* Region Label */}
                      <text
                        x={coords.x}
                        y={coords.y - 12}
                        textAnchor="middle"
                        className={`text-[9px] font-mono font-bold transition-all ${
                          isHovered
                            ? "fill-[#D4AF37] text-[11px]"
                            : "fill-white/60"
                        }`}
                      >
                        {region.code}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* FLOATING HOVER TOOLTIP */}
              {hoveredRegion && (
                <div className="absolute bottom-4 left-4 right-4 z-20 p-4 rounded-2xl bg-[#161A24]/95 border border-[#D4AF37]/40 shadow-2xl backdrop-blur-md flex items-center justify-between animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-black text-sm text-white">
                        {hoveredRegion.name}
                      </span>
                      <span className="text-[10px] font-mono text-[#D4AF37] font-bold">
                        {hoveredRegion.code}
                      </span>
                    </div>
                    <span className="text-[11px] text-white/50">
                      {hoveredRegion.type === "kota" ? "Kota Otonom" : "Kabupaten"} • Direktori Terdaftar
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-base font-heading font-black text-[#D4AF37] block">
                        {liveMapStats[hoveredRegion.code]?.verified ?? hoveredRegion.verifiedCount ?? 0}
                      </span>
                      <span className="text-[9px] font-mono text-white/40 uppercase">
                        Terverifikasi
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Legend */}
            <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/[0.06] text-[10px] font-mono text-white/50 px-2">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Aktif
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> Ditangani Provinsi
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37]" /> Wilayah Pilot
              </span>
            </div>
          </div>
        </div>

        {/* ======================================================= */}
        {/* KOLOM KANAN (7/12): DAFTAR 19 WILAYAH DALAM GRID EMBLEM */}
        {/* ======================================================= */}
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">
          {/* Controls Bar: Filter Chips & Search */}
          <div className="p-4 rounded-2xl bg-[#0F1118]/80 border border-white/[0.08] flex items-center justify-between gap-4">
            {/* Filter Chips */}
            <div className="flex items-center gap-2">
              {[
                { id: "all", label: "Semua (19)" },
                { id: "kota", label: "7 Kota" },
                { id: "kabupaten", label: "12 Kabupaten" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilterType(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-heading font-bold transition-all ${
                    filterType === tab.id
                      ? "bg-[#D4AF37] text-[#07080C] shadow-sm"
                      : "bg-[#161A24] text-white/60 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-52">
              <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari wilayah..."
                className="w-full h-9 bg-[#161A24] border border-white/[0.08] rounded-xl pl-8 pr-3 text-xs text-white placeholder-white/30 outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          {/* 19 Regions Emblem Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {filteredRegions.map((region) => {
              return (
                <Link
                  key={region.code}
                  href={`/regions/${region.slug}`}
                  onMouseEnter={() => setHoveredRegion(region)}
                  onMouseLeave={() => setHoveredRegion(null)}
                  className="p-5 rounded-2xl bg-[#0F1118]/80 hover:bg-[#161A24] border border-white/[0.08] hover:border-[#D4AF37]/50 flex flex-col justify-between min-h-[140px] transition-all group"
                >
                  {/* Top row: Code + Status Badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#D4AF37] font-bold">
                      {region.code}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {region.isPilot ? "Pilot" : (region.type === "kota" ? "Kota" : "Kabupaten")}
                    </span>
                  </div>

                  {/* Center Name */}
                  <div className="my-2">
                    <div className="text-sm font-heading font-black text-white group-hover:text-[#D4AF37] transition-colors truncate">
                      {region.name}
                    </div>
                    <div className="text-[10px] font-mono text-white/40 uppercase">
                      {region.type === "kota" ? "Kota" : "Kabupaten"}
                    </div>
                  </div>

                  {/* Bottom strip: Verified count */}
                  <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-white/50">
                    <span>{liveMapStats[region.code]?.verified ?? region.verifiedCount ?? 0} Terverifikasi</span>
                    <ChevronRight className="w-3.5 h-3.5 text-white/30 group-hover:text-[#D4AF37] group-hover:translate-x-0.5 transition-all" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
