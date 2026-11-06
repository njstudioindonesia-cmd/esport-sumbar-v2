"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Search,
  Building2,
  Users,
  Compass,
  Sparkles,
} from "lucide-react";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { Footer } from "@/components/layout/Footer";
import { REGIONS_DETAIL } from "@/data/regions";

export default function AdminRegionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "kota" | "kabupaten">("all");

  const filteredRegions = REGIONS_DETAIL.filter((r) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      r.name.toLowerCase().includes(q) ||
      r.code.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q);

    const matchesType = filterType === "all" || r.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-white flex flex-col font-sans selection:bg-[#FF1752]/30 selection:text-white">
      <AdminNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono uppercase font-bold tracking-wider">
                DATA GEOGRAFIS RESMI
              </span>
              <span className="text-white/40 text-xs font-mono">• 19 Kota & Kabupaten</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black uppercase text-white tracking-tight mt-1">
              Wilayah Sumatera Barat
            </h1>
            <p className="text-xs sm:text-sm text-white/60">
              Data master geografi 19 kota dan kabupaten untuk domisili profil, kode registrasi ESPORT ID, dan agregasi data.
            </p>
          </div>
        </div>

        {/* SEARCH & FILTER */}
        <div className="p-4 rounded-2xl bg-[#0B0E17] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari wilayah atau kode..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#FF1752]/60"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setFilterType("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                filterType === "all" ? "bg-white/20 text-white" : "bg-white/[0.04] text-white/60 hover:text-white"
              }`}
            >
              Semua (19)
            </button>
            <button
              onClick={() => setFilterType("kota")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                filterType === "kota" ? "bg-[#FF1752] text-white" : "bg-white/[0.04] text-white/60 hover:text-white"
              }`}
            >
              Kota (7)
            </button>
            <button
              onClick={() => setFilterType("kabupaten")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                filterType === "kabupaten" ? "bg-blue-600 text-white" : "bg-white/[0.04] text-white/60 hover:text-white"
              }`}
            >
              Kabupaten (12)
            </button>
          </div>
        </div>

        {/* GRID OF REGIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRegions.map((region) => (
            <div
              key={region.id}
              className="p-5 rounded-2xl bg-[#0B0E17] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between gap-3"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-heading font-black text-sm text-white">
                        {region.name}
                      </h3>
                      <span className="text-[10px] font-mono text-white/40 uppercase">
                        Kode: {region.code} • {region.type}
                      </span>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-white/10 text-white/70">
                    {region.code}
                  </span>
                </div>

                <p className="text-xs text-white/60 leading-relaxed mt-1">
                  {region.description}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-white/40">
                <span>Slug: {region.slug}</span>
                <span className="text-emerald-400">Aktif Geografis</span>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
