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
import { DesktopRegionsView } from "@/components/regions/DesktopRegionsView";
import { REGIONS_DETAIL } from "@/data/regions";

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
    <div className="min-h-screen bg-[#07080C] text-white flex flex-col">
      <Navbar />

      {/* ========================================================= */}
      {/* DESKTOP VIEW (>= 1024px): DUAL-COLUMN INTERACTIVE MAP     */}
      {/* ========================================================= */}
      <div className="hidden lg:block flex-1 max-w-7xl w-full mx-auto px-8 py-10">
        <DesktopRegionsView />
      </div>

      {/* ========================================================= */}
      {/* MOBILE VIEW (< 1024px): PWA LIST & EMBLEM CARDS           */}
      {/* ========================================================= */}
      <main className="block lg:hidden flex-1 max-w-md w-full mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col gap-1 mb-6">
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#D4AF37] uppercase">
            <span>19 Pengcab ESI Daerah</span>
          </div>
          <h1 className="text-2xl font-heading font-black uppercase text-white tracking-tight">
            Wilayah Sumbar
          </h1>
        </div>

        {/* Search & Filter Tabs */}
        <div className="flex flex-col gap-3 mb-6">
          <div className="flex rounded-xl bg-[#161A24] p-1 border border-white/[0.08]">
            {[
              { id: "all", label: "Semua (19)" },
              { id: "kota", label: "Kota (7)" },
              { id: "kabupaten", label: "Kab (12)" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterType(tab.id as any)}
                className={`flex-1 py-1.5 text-xs font-heading font-bold rounded-lg transition-all ${
                  filterType === tab.id
                    ? "bg-[#D4AF37] text-[#07080C]"
                    : "text-white/60"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari wilayah..."
              className="w-full h-10 bg-[#161A24] border border-white/[0.08] rounded-xl pl-8 pr-3 text-xs text-white placeholder-white/30 outline-none"
            />
          </div>
        </div>

        {/* Region List */}
        <div className="flex flex-col gap-3">
          {filteredRegions.map((region) => (
            <Link
              key={region.code}
              href={`/regions/${region.slug}`}
              className="p-4 rounded-2xl bg-[#0F1118] border border-white/[0.08] flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-heading font-black text-sm text-white">
                    {region.name}
                  </span>
                  <span className="text-[10px] font-mono text-[#D4AF37]">
                    {region.code}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-white/40">
                  {region.verifiedCount} Profil Terverifikasi
                </span>
              </div>

              <ChevronRight className="w-4 h-4 text-white/40" />
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
