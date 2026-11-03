"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Filter,
  X,
  Grid,
  List,
  Sparkles,
  Gamepad2,
  Users,
  GraduationCap,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Award,
  ChevronDown,
  RotateCcw,
  ExternalLink,
  SlidersHorizontal,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EsportCard } from "@/components/card/EsportCard";
import { VerificationBadge } from "@/components/card/VerificationBadge";
import { GALLERY_CARDS, MockCardVariant } from "@/data/mockCards";
import { REGIONS } from "@/data/regions";
import { OFFICIAL_GAMES } from "@/data/games";
import {
  CardEntityType,
  CardRarity,
  CardVerification,
} from "@/types/card";

function ExploreContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") as CardEntityType | null;

  // State
  const [selectedEntity, setSelectedEntity] = useState<CardEntityType | "all">(
    initialTab || "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGame, setSelectedGame] = useState<string>("all");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedVerif, setSelectedVerif] = useState<CardVerification | "all">("all");
  const [selectedRarity, setSelectedRarity] = useState<CardRarity | "all">("all");
  const [sortBy, setSortBy] = useState<"newest" | "name" | "rarity">("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(9);

  // Active filter count
  const activeFiltersCount = [
    selectedGame !== "all",
    selectedRegion !== "all",
    selectedVerif !== "all",
    selectedRarity !== "all",
    Boolean(searchQuery),
  ].filter(Boolean).length;

  // Filter logic
  const filteredData = useMemo(() => {
    let result = GALLERY_CARDS.filter((card) => {
      // Entity match
      if (selectedEntity !== "all" && card.type !== selectedEntity) return false;

      // Game match
      if (selectedGame !== "all" && !card.data.game.toLowerCase().includes(selectedGame.toLowerCase())) {
        return false;
      }

      // Region match
      if (selectedRegion !== "all" && card.data.region.code !== selectedRegion) {
        return false;
      }

      // Verification match
      if (selectedVerif !== "all" && card.verification !== selectedVerif) {
        return false;
      }

      // Rarity match
      if (selectedRarity !== "all" && card.rarity !== selectedRarity) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName =
          card.data.displayName.toLowerCase().includes(q) ||
          (card.data.ign && card.data.ign.toLowerCase().includes(q)) ||
          (card.data.teamName && card.data.teamName.toLowerCase().includes(q)) ||
          card.data.esportId.toLowerCase().includes(q);
        if (!matchName) return false;
      }

      return true;
    });

    // Sorting
    result = [...result].sort((a, b) => {
      if (sortBy === "name") {
        const nameA = a.data.ign || a.data.teamName || a.data.displayName;
        const nameB = b.data.ign || b.data.teamName || b.data.displayName;
        return nameA.localeCompare(nameB);
      }
      if (sortBy === "rarity") {
        const tierWeights = { rookie: 1, contender: 2, elite: 3, legend: 4 };
        return tierWeights[b.rarity] - tierWeights[a.rarity];
      }
      return 0; // Default order
    });

    return result;
  }, [
    selectedEntity,
    selectedGame,
    selectedRegion,
    selectedVerif,
    selectedRarity,
    searchQuery,
    sortBy,
  ]);

  const resetFilters = () => {
    setSelectedEntity("all");
    setSelectedGame("all");
    setSelectedRegion("all");
    setSelectedVerif("all");
    setSelectedRarity("all");
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-[#0B0D12] text-[#F3F4F6] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* HEADER SECTION */}
        <div className="flex flex-col gap-2 mb-8">
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#D4AF37] uppercase">
            <span>Pangkalan Data Terbuka</span>
            <span>•</span>
            <span>19 Wilayah Sumatera Barat</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-black uppercase text-white tracking-tight">
            Jelajah Direktori Ekosistem
          </h1>
          <p className="text-sm text-[#9AA3B2] max-w-2xl">
            Cari dan verifikasi data resmi seluruh atlet, pelatih berlisensi, dan klub esport terdaftar se-Sumatera Barat.
          </p>
        </div>

        {/* SEARCH & ENTITY TABS */}
        <div className="flex flex-col gap-4 mb-8">
          {/* Large Search Input */}
          <div className="relative w-full">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari pemain (IGN), nama pelatih, klub/tim, atau ESPORT ID..."
              className="w-full bg-[#12151C] border border-[#262B38] focus:border-[#D4AF37] rounded-xl pl-12 pr-10 py-3.5 text-sm sm:text-base text-white placeholder-gray-500 shadow-lg focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Entity Tabs (Active and Upcoming) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: "all", label: "Semua Entitas", icon: Sparkles, count: 12 },
              { id: "player", label: "Player (Atlet)", icon: Gamepad2, count: 4 },
              { id: "coach", label: "Coach (Pelatih)", icon: GraduationCap, count: 4 },
              { id: "team", label: "Team (Klub)", icon: Users, count: 4 },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = selectedEntity === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedEntity(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-all shrink-0 ${
                    isActive
                      ? "bg-[#D4AF37] text-black shadow-md"
                      : "bg-[#161922] text-gray-300 hover:text-white hover:bg-[#1A1E28] border border-[#262B38]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? "bg-black/20 text-black" : "bg-[#262B38] text-gray-400"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}

            {/* Upcoming Entity Tabs (Fase 2 - PRD) */}
            {["Komunitas", "Venue & Arena", "Kampus & Sekolah"].map((future) => (
              <div
                key={future}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-heading text-gray-500 bg-[#0E1117] border border-[#262B38]/50 shrink-0 cursor-not-allowed opacity-60"
                title="Akan hadir di Fase 2 Roadmap"
              >
                <span>{future}</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#1A1E28] text-[#9AA3B2]">
                  Fase 2
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ACTIVE FILTER CHIPS BAR */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6 p-3 rounded-xl bg-[#12151C] border border-[#262B38]">
            <span className="text-xs font-heading font-semibold text-[#9AA3B2] uppercase">
              Filter Aktif ({activeFiltersCount}):
            </span>

            {selectedGame !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#1A1E28] border border-[#262B38] text-xs text-white">
                Game: {selectedGame}
                <X
                  className="w-3 h-3 cursor-pointer text-gray-400 hover:text-white"
                  onClick={() => setSelectedGame("all")}
                />
              </span>
            )}

            {selectedRegion !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#1A1E28] border border-[#262B38] text-xs text-white">
                Wilayah: {REGIONS.find((r) => r.code === selectedRegion)?.name || selectedRegion}
                <X
                  className="w-3 h-3 cursor-pointer text-gray-400 hover:text-white"
                  onClick={() => setSelectedRegion("all")}
                />
              </span>
            )}

            {selectedVerif !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#1A1E28] border border-[#262B38] text-xs text-white">
                Verifikasi: {selectedVerif}
                <X
                  className="w-3 h-3 cursor-pointer text-gray-400 hover:text-white"
                  onClick={() => setSelectedVerif("all")}
                />
              </span>
            )}

            {selectedRarity !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#1A1E28] border border-[#262B38] text-xs text-white">
                Rarity: {selectedRarity}
                <X
                  className="w-3 h-3 cursor-pointer text-gray-400 hover:text-white"
                  onClick={() => setSelectedRarity("all")}
                />
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#1A1E28] border border-[#262B38] text-xs text-white">
                Cari: &ldquo;{searchQuery}&rdquo;
                <X
                  className="w-3 h-3 cursor-pointer text-gray-400 hover:text-white"
                  onClick={() => setSearchQuery("")}
                />
              </span>
            )}

            <button
              type="button"
              onClick={resetFilters}
              className="ml-auto flex items-center gap-1 text-xs text-[#D4AF37] hover:underline"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Semua</span>
            </button>
          </div>
        )}

        {/* MAIN LAYOUT: SIDEBAR FILTERS (DESKTOP) + CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* DESKTOP SIDEBAR FILTER */}
          <aside className="hidden lg:flex flex-col gap-5 p-5 rounded-2xl bg-[#12151C] border border-[#262B38] h-fit sticky top-24">
            <div className="flex items-center justify-between border-b border-[#262B38] pb-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#D4AF37]" />
                <h3 className="font-heading font-bold text-sm uppercase text-white">
                  Filter Direktori
                </h3>
              </div>
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-[11px] text-[#9AA3B2] hover:text-white"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Game Filter */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-heading font-semibold text-gray-300 uppercase">
                Cabang Game
              </label>
              <select
                value={selectedGame}
                onChange={(e) => setSelectedGame(e.target.value)}
                className="w-full bg-[#1A1E28] border border-[#262B38] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="all">Semua Game</option>
                {OFFICIAL_GAMES.map((g) => (
                  <option key={g.id} value={g.name}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Region Filter (19 Kota/Kabupaten) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-heading font-semibold text-gray-300 uppercase">
                Kota / Kabupaten (19)
              </label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full bg-[#1A1E28] border border-[#262B38] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="all">Semua Wilayah</option>
                <optgroup label="7 Kota">
                  {REGIONS.filter((r) => r.type === "kota").map((r) => (
                    <option key={r.code} value={r.code}>
                      {r.name} {r.isPilot ? "★ (Pilot)" : ""}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="12 Kabupaten">
                  {REGIONS.filter((r) => r.type === "kabupaten").map((r) => (
                    <option key={r.code} value={r.code}>
                      {r.name} {r.isPilot ? "★ (Pilot)" : ""}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Verification Status Filter */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-heading font-semibold text-gray-300 uppercase">
                Status Verifikasi ESI
              </label>
              <select
                value={selectedVerif}
                onChange={(e) => setSelectedVerif(e.target.value as any)}
                className="w-full bg-[#1A1E28] border border-[#262B38] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="all">Semua Status</option>
                <option value="verified">Verified (ESI Sumbar Emas)</option>
                <option value="regional">Regional Checked (ESI Daerah Hijau)</option>
                <option value="unverified">Unverified (Mandiri)</option>
              </select>
            </div>

            {/* Rarity Tier Filter */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-heading font-semibold text-gray-300 uppercase">
                Tier Frame Rarity
              </label>
              <select
                value={selectedRarity}
                onChange={(e) => setSelectedRarity(e.target.value as any)}
                className="w-full bg-[#1A1E28] border border-[#262B38] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="all">Semua Tier</option>
                <option value="legend">Tier 4 - Legend (Kristal)</option>
                <option value="elite">Tier 3 - Elite (Emas)</option>
                <option value="contender">Tier 2 - Contender (Perak)</option>
                <option value="rookie">Tier 1 - Rookie (Perunggu)</option>
              </select>
            </div>
          </aside>

          {/* MAIN RESULTS CONTAINER */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            {/* View Mode & Sorter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[#12151C] border border-[#262B38]">
              {/* Result counter & Mobile filter button */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1A1E28] border border-[#262B38] text-xs font-heading font-bold text-white"
                >
                  <Filter className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Filter ({activeFiltersCount})</span>
                </button>

                <span className="text-xs text-[#9AA3B2] font-mono">
                  Menampilkan <strong className="text-white">{filteredData.length}</strong> profil
                </span>
              </div>

              {/* Sorter & Mode Toggles */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs text-[#9AA3B2]">
                  <span className="hidden sm:inline font-heading uppercase">Urutkan:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-[#1A1E28] border border-[#262B38] rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none"
                  >
                    <option value="newest">Terbaru</option>
                    <option value="rarity">Tier Tertinggi</option>
                    <option value="name">Nama A-Z</option>
                  </select>
                </div>

                {/* Grid / List View Toggle */}
                <div className="flex items-center bg-[#1A1E28] p-1 rounded-lg border border-[#262B38]">
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    className={`p-1 rounded ${
                      viewMode === "grid" ? "bg-[#D4AF37] text-black" : "text-gray-400 hover:text-white"
                    }`}
                    title="Tampilan Kartu"
                  >
                    <Grid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className={`p-1 rounded ${
                      viewMode === "list" ? "bg-[#D4AF37] text-black" : "text-gray-400 hover:text-white"
                    }`}
                    title="Tampilan Daftar Baris"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* RESULTS CONTENT */}
            {filteredData.length === 0 ? (
              /* EMPTY STATE */
              <div className="p-12 text-center rounded-2xl bg-[#12151C] border border-[#262B38] flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#1A1E28] flex items-center justify-center text-gray-500">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-lg text-white">
                  Belum Ada Profil yang Cocok
                </h3>
                <p className="text-xs text-[#9AA3B2] max-w-sm">
                  Tidak ditemukan hasil untuk kombinasi filter Anda saat ini. Coba sesuaikan kata kunci atau atur ulang filter.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-2 px-4 py-2 rounded-xl bg-[#D4AF37] text-black text-xs font-heading font-bold uppercase tracking-wider"
                >
                  Reset Semua Filter
                </button>
              </div>
            ) : viewMode === "grid" ? (
              /* GRID VIEW (Cards) */
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-center">
                {filteredData.slice(0, visibleCount).map((item) => (
                  <div key={item.id} className="flex flex-col items-center gap-2">
                    <EsportCard
                      type={item.type}
                      rarity={item.rarity}
                      verification={item.verification}
                      data={item.data}
                      size="sm"
                      interactive={true}
                    />
                    <Link
                      href={`/${item.type}/${(item.data.ign || item.data.teamName || item.data.displayName).toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-[11px] font-heading font-bold uppercase text-[#D4AF37] hover:underline flex items-center gap-1 mt-1"
                    >
                      <span>Buka Profil Publik</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              /* LIST VIEW (Table / Rows) */
              <div className="flex flex-col gap-2.5">
                {filteredData.slice(0, visibleCount).map((item) => {
                  const targetSlug = (item.data.ign || item.data.teamName || item.data.displayName)
                    .toLowerCase()
                    .replace(/\s+/g, "-");
                  return (
                    <div
                      key={item.id}
                      className="p-3 sm:p-4 rounded-xl bg-[#12151C] border border-[#262B38] hover:border-[#D4AF37]/50 flex items-center justify-between gap-3 transition-colors"
                    >
                      {/* Avatar & Identifiers */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#161922] shrink-0 border border-[#262B38]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.data.avatarUrl || item.data.logoUrl}
                            alt={item.data.displayName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-heading font-bold text-sm text-white truncate">
                              {item.type === "team"
                                ? item.data.teamName
                                : item.data.ign || item.data.displayName}
                            </span>
                            <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#1A1E28] text-[#D4AF37] border border-[#262B38]">
                              {item.rarity}
                            </span>
                          </div>
                          <span className="text-xs text-[#9AA3B2] truncate">
                            {item.data.displayName} • {item.data.game}
                          </span>
                        </div>
                      </div>

                      {/* Region & Verification Badge */}
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="hidden sm:flex flex-col items-end text-right">
                          <span className="text-xs text-gray-300 font-medium">
                            {item.data.region.name}
                          </span>
                          <span className="text-[9px] font-mono text-[#9AA3B2]">
                            {item.data.esportId}
                          </span>
                        </div>

                        <VerificationBadge
                          status={item.verification}
                          regionCode={item.data.region.code}
                          size="sm"
                        />

                        <Link
                          href={`/${item.type}/${targetSlug}`}
                          className="p-2 rounded-lg bg-[#1A1E28] hover:bg-[#D4AF37] hover:text-black text-gray-300 transition-colors"
                          title="Lihat Profil"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Load More Button */}
            {visibleCount < filteredData.length && (
              <div className="flex justify-center pt-4">
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + 6)}
                  className="px-6 py-2.5 rounded-xl bg-[#161922] hover:bg-[#1A1E28] border border-[#262B38] text-xs font-heading font-bold uppercase tracking-wider text-white transition-colors"
                >
                  Muat Lebih Banyak Profil
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* MOBILE BOTTOM SHEET FOR FILTERS */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm lg:hidden animate-in fade-in duration-200">
          <div className="w-full max-h-[85vh] bg-[#12151C] border-t border-[#262B38] rounded-t-2xl p-5 overflow-y-auto flex flex-col gap-4 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between border-b border-[#262B38] pb-3">
              <h3 className="font-heading font-bold text-base uppercase text-white">
                Filter Pencarian
              </h3>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Game */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-heading font-semibold text-gray-300 uppercase">
                Cabang Game
              </label>
              <select
                value={selectedGame}
                onChange={(e) => setSelectedGame(e.target.value)}
                className="w-full bg-[#1A1E28] border border-[#262B38] rounded-lg p-2.5 text-xs text-white"
              >
                <option value="all">Semua Game</option>
                {OFFICIAL_GAMES.map((g) => (
                  <option key={g.id} value={g.name}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Region */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-heading font-semibold text-gray-300 uppercase">
                Kota / Kabupaten
              </label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full bg-[#1A1E28] border border-[#262B38] rounded-lg p-2.5 text-xs text-white"
              >
                <option value="all">Semua Wilayah</option>
                {REGIONS.map((r) => (
                  <option key={r.code} value={r.code}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Verif */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-heading font-semibold text-gray-300 uppercase">
                Status Verifikasi
              </label>
              <select
                value={selectedVerif}
                onChange={(e) => setSelectedVerif(e.target.value as any)}
                className="w-full bg-[#1A1E28] border border-[#262B38] rounded-lg p-2.5 text-xs text-white"
              >
                <option value="all">Semua</option>
                <option value="verified">Verified (ESI Sumbar Emas)</option>
                <option value="regional">Regional Checked (ESI Daerah Hijau)</option>
                <option value="unverified">Unverified</option>
              </select>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 pt-3 border-t border-[#262B38] mt-2">
              <button
                type="button"
                onClick={resetFilters}
                className="flex-1 py-2.5 rounded-xl bg-[#1A1E28] text-xs font-heading font-bold text-gray-300"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#D4AF37] text-black text-xs font-heading font-extrabold uppercase"
              >
                Terapkan Filter
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0B0D12] text-white flex items-center justify-center">Memuat Direktori...</div>}>
      <ExploreContent />
    </Suspense>
  );
}
