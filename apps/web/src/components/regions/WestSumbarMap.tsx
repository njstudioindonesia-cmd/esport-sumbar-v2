"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MapPin, ShieldCheck, Award, ArrowRight } from "lucide-react";
import { REGIONS_DETAIL, RegionDetail } from "@/data/regions";

interface MapNode {
  code: string;
  x: number;
  y: number;
  radius: number;
}

// Approximate schematic layout coordinates for 19 regions of West Sumatra
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

export function WestSumbarMap() {
  const [selectedRegion, setSelectedRegion] = useState<RegionDetail>(
    REGIONS_DETAIL.find((r) => r.code === "PDG") || REGIONS_DETAIL[0]
  );
  const [hoveredRegion, setHoveredRegion] = useState<RegionDetail | null>(null);

  const activeRegion = hoveredRegion || selectedRegion;

  return (
    <div className="w-full flex flex-col lg:flex-row items-center gap-8 p-6 md:p-8 rounded-2xl bg-[#12151C] border border-[#262B38] shadow-2xl">
      {/* MAP SVG CANVAS */}
      <div className="relative w-full lg:w-3/5 h-[380px] sm:h-[450px] bg-[#0E1117] rounded-xl border border-[#262B38] overflow-hidden flex items-center justify-center p-4">
        {/* Ambient Map Gradients */}
        <div className="absolute inset-0 bg-minang-subtle opacity-30 pointer-events-none" />
        <div className="absolute -top-10 -left-10 w-48 h-48 bg-[#C8102E]/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#D4AF37]/10 blur-3xl pointer-events-none" />

        <svg
          viewBox="0 0 620 520"
          className="w-full h-full max-h-[440px] select-none"
        >
          {/* Schematic Connectivity Mesh between neighboring administrative nodes */}
          <g stroke="#262B38" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6">
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
            {/* Mentawai sea corridor connection */}
            <line x1="305" y1="295" x2="120" y2="360" stroke="#3B82F6" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
          </g>

          {/* Interactive Region Nodes */}
          {REGIONS_DETAIL.map((region) => {
            const coords = REGION_COORDINATES[region.code] || { x: 300, y: 250 };
            const isSelected = selectedRegion.code === region.code;
            const isHovered = hoveredRegion?.code === region.code;
            const isCity = region.type === "kota";

            return (
              <g
                key={region.code}
                className="cursor-pointer transition-transform duration-200"
                onClick={() => setSelectedRegion(region)}
                onMouseEnter={() => setHoveredRegion(region)}
                onMouseLeave={() => setHoveredRegion(null)}
              >
                {/* Outer Glow Halo for Pilot or Active Nodes */}
                {(isSelected || isHovered || region.isPilot) && (
                  <circle
                    cx={coords.x}
                    cy={coords.y}
                    r={isSelected ? 22 : 16}
                    fill={
                      region.isPilot
                        ? "rgba(212, 175, 55, 0.25)"
                        : "rgba(59, 130, 246, 0.2)"
                    }
                    className="animate-pulse"
                  />
                )}

                {/* Node Shape: Octagon / Diamond for Kota, Circle for Kabupaten */}
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r={isCity ? 11 : 9}
                  fill={isSelected ? "#D4AF37" : "#22C55E"}
                  stroke="#0B0D12"
                  strokeWidth="2.5"
                />

                {/* Inner Center Dot */}
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r="3"
                  fill="#0B0D12"
                />

                {/* Label text */}
                <text
                  x={coords.x}
                  y={coords.y - 14}
                  textAnchor="middle"
                  className={`text-[9px] font-heading uppercase font-bold tracking-wider pointer-events-none ${
                    isSelected
                      ? "fill-[#D4AF37] text-[11px]"
                      : isHovered
                      ? "fill-white"
                      : "fill-gray-400"
                  }`}
                >
                  {region.code}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Legend Overlay on Map */}
        <div className="absolute bottom-3 left-3 bg-[#0B0D12]/90 border border-[#262B38] rounded-lg px-2.5 py-1.5 backdrop-blur-md flex items-center gap-3 text-[9px] font-mono">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
            <span className="text-gray-300">Admin Aktif</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />
            <span className="text-gray-300">Fallback Provinsi</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
            <span className="text-gray-300">Terpilih</span>
          </div>
        </div>
      </div>

      {/* REGION INFO CARD (RIGHT PANEL) */}
      <div className="w-full lg:w-2/5 flex flex-col justify-between gap-5 bg-[#0B0D12] border border-[#262B38] rounded-xl p-5 shadow-lg">
        <div>
          {/* Badges */}
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded-full bg-[#1A1E28] border border-[#262B38] text-[10px] font-mono text-[#D4AF37] font-bold">
              KODE: {activeRegion.code}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-heading font-bold uppercase bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30">
              {activeRegion.type === "kota" ? "Kota Otonom" : "Kabupaten"}
            </span>
            {activeRegion.isPilot && (
              <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 text-[9px] font-heading font-black">
                PILOT
              </span>
            )}
          </div>

          <h3 className="text-2xl font-heading font-bold text-white uppercase tracking-tight">
            {activeRegion.name}
          </h3>
          <p className="text-xs text-[#9AA3B2] leading-relaxed mt-2">
            {activeRegion.description}
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-[#262B38]">
            <div className="p-2 rounded bg-[#161922] text-center">
              <span className="text-sm font-heading font-bold text-white block">
                {activeRegion.playerCount}
              </span>
              <span className="text-[9px] text-[#9AA3B2] uppercase font-mono">
                Pemain
              </span>
            </div>
            <div className="p-2 rounded bg-[#161922] text-center">
              <span className="text-sm font-heading font-bold text-[#3B82F6] block">
                {activeRegion.teamCount}
              </span>
              <span className="text-[9px] text-[#9AA3B2] uppercase font-mono">
                Klub / Tim
              </span>
            </div>
            <div className="p-2 rounded bg-[#161922] text-center">
              <span className="text-sm font-heading font-bold text-[#D4AF37] block">
                {activeRegion.verifiedCount}
              </span>
              <span className="text-[9px] text-[#9AA3B2] uppercase font-mono">
                Verified
              </span>
            </div>
          </div>

          {/* Layanan Terpadu Summary */}
          <div className="mt-4 p-3 rounded-lg bg-[#161922] border border-[#262B38] text-xs">
            <span className="text-[10px] uppercase font-mono text-[#9AA3B2] block mb-0.5">
              Layanan Administrasi
            </span>
            <p className="font-semibold text-gray-200 text-[11px] leading-tight">
              ESPORT SUMBAR Terpadu (Verifikasi Langsung Satu Tahap)
            </p>
          </div>
        </div>

        {/* Link Button to Region Page */}
        <Link
          href={`/regions/${activeRegion.slug}`}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E5C358] hover:brightness-110 text-black text-xs font-heading font-extrabold uppercase tracking-wider shadow-md transition-all"
        >
          <span>Buka Data {activeRegion.name}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
