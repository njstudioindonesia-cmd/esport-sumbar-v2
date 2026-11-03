"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Filter,
  MapPin,
  ShieldCheck,
  Calendar,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Gamepad2,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MOCK_COMMUNITIES } from "@/data/ecosystem";
import { REGIONS_DETAIL } from "@/data/regions";

export default function CommunitiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");

  const filteredCommunities = useMemo(() => {
    return MOCK_COMMUNITIES.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
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
              <Users className="w-3.5 h-3.5" />
              Ekosistem Komunitas
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-black uppercase text-white tracking-tight">
            Direktori <span className="text-[#D4AF37]">Komunitas Esport</span> Sumbar
          </h1>
          <p className="text-sm text-[#9AA3B2] max-w-2xl leading-relaxed">
            Wadah berkumpul, mabar, dan pembinaan atlet akar rumput di 19 Kota dan Kabupaten Sumatera Barat yang terdaftar di ESI.
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
              placeholder="Cari nama komunitas / game..."
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
              <option value="all">Semua Kota & Kabupaten</option>
              {REGIONS_DETAIL.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* COMMUNITIES GRID */}
        {filteredCommunities.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#12151C] border border-[#262B38]">
            <Users className="w-10 h-10 text-gray-500 mx-auto mb-2" />
            <p className="text-sm font-heading text-gray-300">Tidak ada komunitas yang cocok.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredCommunities.map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-2xl bg-[#12151C] border border-[#262B38] hover:border-[#D4AF37]/50 transition-all flex flex-col justify-between shadow-lg group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 blur-xl pointer-events-none" />

                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span className="px-2.5 py-0.5 rounded bg-[#1A1E28] border border-[#262B38] text-[10px] font-mono text-[#D4AF37] uppercase font-bold">
                        {item.category}
                      </span>
                      <h2 className="text-lg font-heading font-extrabold text-white mt-1 group-hover:text-[#D4AF37] transition-colors">
                        {item.name}
                      </h2>
                    </div>

                    {item.verifiedStatus === "verified" && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#22C55E]/20 border border-[#22C55E]/40 text-[#22C55E] text-[10px] font-heading font-bold shrink-0">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Terdaftar ESI
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#9AA3B2] line-clamp-2 leading-relaxed mb-4">
                    {item.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-300 border-t border-[#262B38] pt-3 mb-4">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{item.regionName}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-blue-400" />
                      <span>{item.memberCount.toLocaleString("id-ID")} Anggota</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-purple-400" />
                      <span>Didirikan {item.foundedYear}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{item.socialMedia}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#262B38]">
                  <span className="text-[11px] text-gray-400 font-mono">
                    Ketua: <strong className="text-white">{item.leaderName}</strong>
                  </span>

                  <a
                    href={`https://wa.me/${item.contactWa.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#1A1E28] hover:bg-[#262B38] text-xs font-heading font-bold text-[#D4AF37] transition-colors"
                  >
                    <span>Hubungi Pengurus</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
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
