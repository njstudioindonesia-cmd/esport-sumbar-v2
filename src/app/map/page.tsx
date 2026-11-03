"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Map,
  MapPin,
  Building2,
  ShieldCheck,
  Navigation,
  Phone,
  Layers,
  Sparkles,
  Info,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MOCK_VENUES } from "@/data/ecosystem";
import { REGIONS_DETAIL } from "@/data/regions";

export default function EsportsMapPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedPin, setSelectedPin] = useState<{
    id: string;
    title: string;
    subtitle: string;
    type: string;
    address: string;
    phone?: string;
    coords: { lat: number; lng: number };
  } | null>({
    id: "pin-init",
    title: "Minang Cyber Arena Padang",
    subtitle: "Arena Turnamen Resmi & Broadcasting Booth",
    type: "Esports Arena",
    address: "Jl. Veteran No. 45, Padang Barat (Dekat Pantai Padang)",
    phone: "+62 751-897654",
    coords: { lat: -0.9471, lng: 100.3543 },
  });

  // Map markers from venues + ESI secretariats
  const markers = [
    ...MOCK_VENUES.map((v) => ({
      id: v.id,
      title: v.name,
      subtitle: `${v.category} • ${v.internetSpeedMbps} Mbps`,
      type: v.category,
      address: v.address,
      phone: v.contactPhone,
      coords: v.coordinates,
      // Screen positioning coordinates for interactive SVG map representation (normalized %)
      svgX: v.regionId === "reg-pdg" ? 220 : v.regionId === "reg-bkt" ? 310 : 390,
      svgY: v.regionId === "reg-pdg" ? 350 : v.regionId === "reg-bkt" ? 240 : 200,
    })),
    // Sekretariat Pengcab Utama
    {
      id: "esi-pdg",
      title: "Sekretariat Pengcab ESI Kota Padang",
      subtitle: "Pusat Pelatihan Daerah & Verifikasi Berkas",
      type: "Sekretariat ESI",
      address: "Kompleks GOR H. Agus Salim, Padang Barat",
      phone: "+62 812-7001-2026",
      coords: { lat: -0.9238, lng: 100.3601 },
      svgX: 200,
      svgY: 330,
    },
    {
      id: "esi-bkt",
      title: "Sekretariat Pengcab ESI Bukittinggi",
      subtitle: "Gedung Pemuda & Olahraga Gulai Bancah",
      type: "Sekretariat ESI",
      address: "Gedung Pemuda & Olahraga, Gulai Bancah, Bukittinggi",
      phone: "+62 821-6200-2026",
      coords: { lat: -0.3055, lng: 100.3692 },
      svgX: 330,
      svgY: 220,
    },
  ];

  const filteredMarkers = activeCategory === "all"
    ? markers
    : markers.filter((m) => m.type.toLowerCase().includes(activeCategory.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#0B0D12] text-[#F3F4F6] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* HEADER */}
        <div className="flex flex-col gap-3 mb-8">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-heading font-extrabold uppercase tracking-wider flex items-center gap-1.5">
              <Map className="w-3.5 h-3.5" />
              Sistem Informasi Geografis (GIS)
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-black uppercase text-white tracking-tight">
            Esports Map <span className="text-[#D4AF37]">Sumatera Barat</span>
          </h1>
          <p className="text-sm text-[#9AA3B2] max-w-2xl leading-relaxed">
            Peta interaktif persebaran fasilitas arena esport, gaming house terakreditasi, dan kantor sekretariat ESI di seluruh Ranah Minang.
          </p>
        </div>

        {/* MAP CONTROLS & CATEGORY PILLS */}
        <div className="flex flex-wrap items-center gap-2 mb-6 p-2 rounded-2xl bg-[#12151C] border border-[#262B38] w-fit">
          {[
            { id: "all", label: "Semua Titik Fasilitas" },
            { id: "Arena", label: "Esports Arena" },
            { id: "Lounge", label: "Cyber Lounge" },
            { id: "Bootcamp", label: "Bootcamp Station" },
            { id: "Sekretariat", label: "Sekretariat Pengcab ESI" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-all ${
                activeCategory === cat.id
                  ? "bg-[#D4AF37] text-black shadow-md"
                  : "bg-transparent text-gray-400 hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* INTERACTIVE MAP CONTAINER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* MAP CANVAS (VECTOR SVG STYLED TO RANAH MINANG) */}
          <div className="lg:col-span-8 p-6 rounded-3xl bg-[#12151C] border border-[#262B38] shadow-2xl relative overflow-hidden min-h-[500px] flex flex-col justify-between">
            {/* Background Map Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#262B38_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] animate-ping" />
                <span className="text-xs font-mono text-gray-300">Live Spatial Tracking Sumbar</span>
              </div>
              <span className="text-[11px] font-mono text-[#D4AF37] border border-[#D4AF37]/30 px-2 py-0.5 rounded">
                19 Wilayah Terpetakan
              </span>
            </div>

            {/* SVG Visual Map & Interactive Pins */}
            <div className="relative my-6 flex items-center justify-center">
              <svg
                viewBox="0 0 600 500"
                className="w-full max-w-[560px] h-auto drop-shadow-[0_0_30px_rgba(212,175,55,0.15)]"
              >
                {/* Minangkabau Coastline & Topography Representation */}
                <path
                  d="M120,40 L260,30 L450,110 L540,260 L480,450 L350,470 L240,430 L150,380 L80,260 L90,140 Z"
                  fill="#161B26"
                  stroke="#2E374A"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                />
                <path
                  d="M150,80 Q280,120 400,160 T480,380"
                  fill="none"
                  stroke="#C8102E"
                  strokeWidth="1.5"
                  strokeOpacity="0.4"
                />

                {/* Regional Centers */}
                <text x="210" y="325" fill="#6B7280" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
                  PADANG
                </text>
                <text x="310" y="215" fill="#6B7280" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
                  BUKITTINGGI
                </text>
                <text x="390" y="180" fill="#6B7280" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
                  PAYAKUMBUH
                </text>
                <text x="320" y="380" fill="#6B7280" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
                  SOLOK
                </text>

                {/* Render Filtered Markers */}
                {filteredMarkers.map((m) => {
                  const isSelected = selectedPin?.id === m.id;
                  const isEsi = m.type === "Sekretariat ESI";
                  return (
                    <g
                      key={m.id}
                      onClick={() => setSelectedPin(m)}
                      className="cursor-pointer transition-transform hover:scale-125"
                    >
                      <circle
                        cx={m.svgX}
                        cy={m.svgY}
                        r={isSelected ? "14" : "9"}
                        fill={isEsi ? "#C8102E" : "#D4AF37"}
                        fillOpacity={isSelected ? "1" : "0.85"}
                        stroke="#0B0D12"
                        strokeWidth="2"
                      />
                      {isSelected && (
                        <circle
                          cx={m.svgX}
                          cy={m.svgY}
                          r="20"
                          fill="none"
                          stroke={isEsi ? "#C8102E" : "#D4AF37"}
                          strokeWidth="2"
                          strokeDasharray="3 3"
                          className="animate-spin origin-center"
                        />
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="flex flex-wrap items-center justify-between text-[11px] text-gray-400 border-t border-[#262B38] pt-3 relative z-10">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />
                  Gaming Venue & Arena
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C8102E]" />
                  Sekretariat ESI Kota/Kab
                </span>
              </div>
              <span>Klik pada pin untuk meninjau detail titik lokasi</span>
            </div>
          </div>

          {/* DETAIL PANEL ON SELECTION */}
          <div className="lg:col-span-4 p-6 rounded-3xl bg-[#12151C] border border-[#262B38] shadow-xl flex flex-col justify-between">
            {selectedPin ? (
              <div>
                <span className="px-2.5 py-0.5 rounded bg-[#1A1E28] border border-[#262B38] text-[10px] font-mono text-[#D4AF37] uppercase font-bold">
                  {selectedPin.type}
                </span>

                <h2 className="text-2xl font-heading font-black text-white mt-2 leading-tight">
                  {selectedPin.title}
                </h2>
                <p className="text-xs text-[#9AA3B2] mt-1 mb-4">
                  {selectedPin.subtitle}
                </p>

                <div className="p-4 rounded-xl bg-[#1A1E28] border border-[#262B38] flex flex-col gap-3 mb-6">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] uppercase font-mono text-gray-400 block">Alamat Lengkap</span>
                      <span className="text-xs text-gray-200">{selectedPin.address}</span>
                    </div>
                  </div>

                  {selectedPin.phone && (
                    <div className="flex items-start gap-2.5">
                      <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] uppercase font-mono text-gray-400 block">Kontak Narahubung</span>
                        <span className="text-xs text-gray-200 font-mono">{selectedPin.phone}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-2.5">
                    <Navigation className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] uppercase font-mono text-gray-400 block">Koordinat GPS</span>
                      <span className="text-xs font-mono text-gray-400">
                        {selectedPin.coords.lat}, {selectedPin.coords.lng}
                      </span>
                    </div>
                  </div>
                </div>

                <a
                  href={`https://maps.google.com/?q=${selectedPin.coords.lat},${selectedPin.coords.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E5C358] text-black text-xs font-heading font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Buka di Google Maps</span>
                </a>
              </div>
            ) : (
              <div className="p-12 text-center text-gray-400 text-xs">
                Pilih pin pada peta untuk menampilkan profil fasilitas.
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-[#262B38] text-[11px] text-[#9AA3B2] flex items-center gap-2">
              <Info className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>
                Fasilitas Anda belum terdaftar di peta esport Sumbar? Hubungi Pengprov ESI untuk sertifikasi venue.
              </span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
