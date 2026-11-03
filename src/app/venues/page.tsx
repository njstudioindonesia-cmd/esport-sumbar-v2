"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Building2,
  Search,
  Filter,
  MapPin,
  ShieldCheck,
  Wifi,
  Monitor,
  Smartphone,
  Phone,
  CheckCircle2,
  Navigation,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MOCK_VENUES } from "@/data/ecosystem";
import { REGIONS_DETAIL } from "@/data/regions";

export default function VenuesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");

  const filteredVenues = useMemo(() => {
    return MOCK_VENUES.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.address.toLowerCase().includes(searchQuery.toLowerCase());
      const matchRegion =
        selectedRegion === "all" || item.regionId === selectedRegion;
      return matchSearch && matchRegion;
    });
  }, [searchQuery, selectedRegion]);

  return (
    <div className="min-h-screen bg-[#0B0D12] text-[#F3F4F6] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* HEADER */}
        <div className="flex flex-col gap-3 mb-8">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-heading font-extrabold uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              Sentra Latihan & Arena
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-black uppercase text-white tracking-tight">
            Gaming House & <span className="text-[#D4AF37]">Venue Esport</span> Sumbar
          </h1>
          <p className="text-sm text-[#9AA3B2] max-w-2xl leading-relaxed">
            Direktori arena turnamen, cyber lounge spek kompetisi, dan bootcamp station terakreditasi Pengprov ESI Sumatera Barat.
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
              placeholder="Cari nama venue / alamat..."
              className="w-full bg-[#1A1E28] border border-[#262B38] focus:border-[#D4AF37] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-[#D4AF37] shrink-0" />
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              aria-label="Filter Wilayah Kota atau Kabupaten"
              className="w-full sm:w-56 bg-[#1A1E28] border border-[#262B38] text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="all">Semua Wilayah Sumbar</option>
              {REGIONS_DETAIL.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* VENUES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredVenues.map((v) => (
            <div
              key={v.id}
              className="p-6 rounded-2xl bg-[#12151C] border border-[#262B38] hover:border-[#D4AF37]/50 transition-all flex flex-col justify-between shadow-lg group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="px-2.5 py-0.5 rounded bg-[#1A1E28] border border-[#262B38] text-[10px] font-mono text-[#D4AF37] uppercase font-bold">
                      {v.category}
                    </span>
                    <h2 className="text-xl font-heading font-extrabold text-white mt-1 group-hover:text-[#D4AF37] transition-colors">
                      {v.name}
                    </h2>
                  </div>

                  {v.verifiedByEsi && (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#22C55E]/20 border border-[#22C55E]/40 text-[#22C55E] text-[10px] font-heading font-extrabold shrink-0">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Akreditasi ESI
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
                  <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                  <span>{v.address}</span>
                </div>

                {/* SPECS STRIP */}
                <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-[#1A1E28] border border-[#262B38] text-center mb-4">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-mono block">PC Gaming</span>
                    <span className="text-sm font-heading font-black text-white">{v.pcCount || 0} Unit</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-mono block">Mobile Booth</span>
                    <span className="text-sm font-heading font-black text-white">{v.mobileStations || 0} Seat</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-mono block">Dedicated ISP</span>
                    <span className="text-sm font-heading font-black text-[#22C55E]">{v.internetSpeedMbps} Mbps</span>
                  </div>
                </div>

                {/* FACILITIES */}
                <div className="mb-4">
                  <span className="text-[10px] font-mono uppercase text-gray-400 block mb-2">Fasilitas Standar Turnamen:</span>
                  <ul className="flex flex-col gap-1.5">
                    {v.facilities.map((fac, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-gray-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                        <span>{fac}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#262B38]">
                <div className="flex items-center gap-1.5 text-xs text-gray-300 font-mono">
                  <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{v.contactPhone}</span>
                </div>

                <a
                  href={`https://maps.google.com/?q=${v.coordinates.lat},${v.coordinates.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E5C358] text-black text-xs font-heading font-extrabold uppercase tracking-wider"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Petunjuk Arah</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
