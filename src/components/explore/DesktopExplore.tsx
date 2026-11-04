"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  X,
  LayoutGrid,
  List as ListIcon,
  SlidersHorizontal,
  RotateCcw,
  ShieldCheck,
  Award,
  Sparkles,
  MapPin,
  ChevronRight,
  Lock,
  ExternalLink,
  User,
  Users,
  Trophy,
  ArrowUpDown,
  Filter,
} from "lucide-react";
import { GALLERY_CARDS, MockCardVariant } from "@/data/mockCards";
import { REGIONS_DETAIL } from "@/data/regions";
import { OFFICIAL_GAMES } from "@/data/games";
import { EsportCard } from "@/components/card/EsportCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { RarityTag } from "@/components/shared/RarityTag";

export function DesktopExplore() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab");

  // State Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEntity, setSelectedEntity] = useState<"all" | "player" | "coach" | "team">(
    initialTab === "player" || initialTab === "coach" || initialTab === "team"
      ? initialTab
      : "all"
  );
  const [selectedGame, setSelectedGame] = useState<string>("all");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedVerif, setSelectedVerif] = useState<string>("all");
  const [selectedRarity, setSelectedRarity] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"recent" | "rarity" | "name">("recent");

  // View mode: 4-col card grid vs compact table
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Quick Preview Drawer card
  const [previewCard, setPreviewCard] = useState<MockCardVariant | null>(null);

  // Region filter search within sidebar
  const [regionFilterSearch, setRegionFilterSearch] = useState("");

  // Sync initialTab if url changes
  useEffect(() => {
    if (initialTab === "player" || initialTab === "coach" || initialTab === "team") {
      setSelectedEntity(initialTab);
    }
  }, [initialTab]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedEntity("all");
    setSelectedGame("all");
    setSelectedRegion("all");
    setSelectedVerif("all");
    setSelectedRarity("all");
    setSortBy("recent");
  };

  // Has active filters
  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedEntity !== "all" ||
    selectedGame !== "all" ||
    selectedRegion !== "all" ||
    selectedVerif !== "all" ||
    selectedRarity !== "all";

  // Filtered Cards calculation
  const filteredCards = useMemo(() => {
    const list = GALLERY_CARDS.filter((card) => {
      // Entity filter
      if (selectedEntity !== "all" && card.type !== selectedEntity) return false;
      // Game filter
      if (selectedGame !== "all" && card.data.game !== selectedGame) return false;
      // Region filter
      if (selectedRegion !== "all" && card.data.region.code !== selectedRegion) return false;
      // Verification filter
      if (selectedVerif !== "all" && card.verification !== selectedVerif) return false;
      // Rarity filter
      if (selectedRarity !== "all" && card.rarity !== selectedRarity) return false;

      // Text Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = card.data.displayName.toLowerCase().includes(q);
        const matchIgn = card.data.ign?.toLowerCase().includes(q) || false;
        const matchGame = card.data.game.toLowerCase().includes(q);
        const matchRegion = card.data.region.name.toLowerCase().includes(q);
        const matchEsportId = card.data.esportId.toLowerCase().includes(q);
        return matchName || matchIgn || matchGame || matchRegion || matchEsportId;
      }

      return true;
    });

    // Sorting
    if (sortBy === "name") {
      list.sort((a, b) =>
        (a.data.ign || a.data.displayName).localeCompare(b.data.ign || b.data.displayName)
      );
    } else if (sortBy === "rarity") {
      const rarityRank: Record<string, number> = {
        legend: 4,
        elite: 3,
        contender: 2,
        rookie: 1,
      };
      list.sort((a, b) => (rarityRank[b.rarity] || 0) - (rarityRank[a.rarity] || 0));
    }

    return list;
  }, [
    selectedEntity,
    selectedGame,
    selectedRegion,
    selectedVerif,
    selectedRarity,
    searchQuery,
    sortBy,
  ]);

  // Filtered regions for the sidebar list
  const filteredRegionsList = useMemo(() => {
    if (!regionFilterSearch.trim()) return REGIONS_DETAIL;
    return REGIONS_DETAIL.filter((r) =>
      r.name.toLowerCase().includes(regionFilterSearch.toLowerCase())
    );
  }, [regionFilterSearch]);

  const getProfileSlug = (card: MockCardVariant) => {
    const name = card.data.ign || card.data.displayName;
    const slug = name.toLowerCase().replace(/\s+/g, "-");
    if (card.type === "player") return `/player/${slug}`;
    if (card.type === "coach") return `/coach/${slug}`;
    return `/team/${slug}`;
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 py-10">
      {/* 1. TOP CENTER LARGE GLASS SEARCH BAR */}
      <div className="max-w-2xl mx-auto mb-8 flex flex-col items-center">
        <div className="relative w-full">
          <Search className="w-5 h-5 text-[#D4AF37] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama atlet, IGN, klub, nomor ID, atau game..."
            className="w-full pl-12 pr-12 py-3.5 rounded-full bg-[#0F1118]/90 border border-white/[0.08] text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/40 shadow-xl backdrop-blur-xl transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 2. ENTITY SEGMENTED TABS (ALL, PLAYER, COACH, TEAM + PHASE 2 LOCKED) */}
      <div className="flex items-center justify-center gap-2 mb-10 overflow-x-auto no-scrollbar pb-2">
        <button
          onClick={() => setSelectedEntity("all")}
          className={`px-5 py-2 rounded-full text-xs font-heading font-bold uppercase tracking-wider transition-all ${
            selectedEntity === "all"
              ? "bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-black shadow-md shadow-amber-950/20"
              : "bg-[#0F1118] text-gray-400 hover:text-white border border-white/[0.08]"
          }`}
        >
          Semua Entitas
        </button>
        <button
          onClick={() => setSelectedEntity("player")}
          className={`px-5 py-2 rounded-full text-xs font-heading font-bold uppercase tracking-wider transition-all ${
            selectedEntity === "player"
              ? "bg-[#D4AF37] text-black shadow-md"
              : "bg-[#0F1118] text-gray-400 hover:text-white border border-white/[0.08]"
          }`}
        >
          Pemain
        </button>
        <button
          onClick={() => setSelectedEntity("coach")}
          className={`px-5 py-2 rounded-full text-xs font-heading font-bold uppercase tracking-wider transition-all ${
            selectedEntity === "coach"
              ? "bg-[#D4AF37] text-black shadow-md"
              : "bg-[#0F1118] text-gray-400 hover:text-white border border-white/[0.08]"
          }`}
        >
          Pelatih
        </button>
        <button
          onClick={() => setSelectedEntity("team")}
          className={`px-5 py-2 rounded-full text-xs font-heading font-bold uppercase tracking-wider transition-all ${
            selectedEntity === "team"
              ? "bg-[#D4AF37] text-black shadow-md"
              : "bg-[#0F1118] text-gray-400 hover:text-white border border-white/[0.08]"
          }`}
        >
          Klub / Tim
        </button>

        {/* Phase 2 Disabled Entity Chips */}
        <div className="hidden xl:flex items-center gap-2 opacity-50 cursor-not-allowed">
          <div className="px-4 py-2 rounded-full bg-white/[0.02] border border-white/[0.05] text-xs font-heading font-medium text-gray-500 flex items-center gap-1.5">
            <Lock className="w-3 h-3" />
            <span>Komunitas</span>
          </div>
          <div className="px-4 py-2 rounded-full bg-white/[0.02] border border-white/[0.05] text-xs font-heading font-medium text-gray-500 flex items-center gap-1.5">
            <Lock className="w-3 h-3" />
            <span>Wasit ESI</span>
          </div>
        </div>
      </div>

      {/* 3. TWO-COLUMN LAYOUT: STICKY SIDEBAR (280px) + MAIN RESULTS */}
      <div className="grid grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: STICKY FILTERS SIDEBAR (280px) */}
        <aside className="col-span-3 sticky top-24 space-y-6 p-5 rounded-2xl bg-[#0F1118] border border-white/[0.08]">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2 text-white font-heading font-black text-sm uppercase tracking-wide">
              <SlidersHorizontal className="w-4 h-4 text-[#D4AF37]" />
              <span>Filter Data</span>
            </div>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-[11px] font-mono text-[#D4AF37] hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* GAME FILTER */}
          <div className="space-y-2">
            <label className="text-[11px] font-heading font-bold uppercase text-gray-400 tracking-wider">
              Divisi Game
            </label>
            <div className="space-y-1 text-xs">
              <button
                onClick={() => setSelectedGame("all")}
                className={`w-full text-left px-3 py-1.5 rounded-lg transition-all ${
                  selectedGame === "all"
                    ? "bg-[#D4AF37]/20 text-[#D4AF37] font-bold"
                    : "text-gray-400 hover:text-white hover:bg-white/[0.03]"
                }`}
              >
                Semua Game
              </button>
              {OFFICIAL_GAMES.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setSelectedGame(g.name)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg transition-all ${
                    selectedGame === g.name
                      ? "bg-[#D4AF37]/20 text-[#D4AF37] font-bold"
                      : "text-gray-400 hover:text-white hover:bg-white/[0.03]"
                  }`}
                >
                  {g.shortName}
                </button>
              ))}
            </div>
          </div>

          {/* WILAYAH / PENGCAB FILTER (SEARCHABLE LIST) */}
          <div className="space-y-2">
            <label className="text-[11px] font-heading font-bold uppercase text-gray-400 tracking-wider">
              19 Wilayah PBESI
            </label>
            <input
              type="text"
              placeholder="Cari kota / kab..."
              value={regionFilterSearch}
              onChange={(e) => setRegionFilterSearch(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]/40"
            />
            <div className="max-h-36 overflow-y-auto space-y-1 text-xs pr-1">
              <button
                onClick={() => setSelectedRegion("all")}
                className={`w-full text-left px-3 py-1 rounded-lg transition-all ${
                  selectedRegion === "all"
                    ? "bg-[#D4AF37]/20 text-[#D4AF37] font-bold"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Semua Wilayah
              </button>
              {filteredRegionsList.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelectedRegion(r.code)}
                  className={`w-full text-left px-3 py-1 rounded-lg transition-all truncate ${
                    selectedRegion === r.code
                      ? "bg-[#D4AF37]/20 text-[#D4AF37] font-bold"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {r.name}
                </button>
              ))}
            </div>
          </div>

          {/* VERIFIKASI STATUS FILTER CHIPS */}
          <div className="space-y-2">
            <label className="text-[11px] font-heading font-bold uppercase text-gray-400 tracking-wider">
              Status Verifikasi
            </label>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: "all", label: "Semua" },
                { id: "verified", label: "Verified" },
                { id: "regional", label: "Daerah" },
                { id: "unverified", label: "Draft" },
              ].map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVerif(v.id)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold transition-all ${
                    selectedVerif === v.id
                      ? "bg-[#D4AF37] text-black"
                      : "bg-white/[0.04] text-gray-400 hover:text-white border border-white/10"
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          {/* RARITY TIER FILTER CHIPS */}
          <div className="space-y-2">
            <label className="text-[11px] font-heading font-bold uppercase text-gray-400 tracking-wider">
              Tier Rarity
            </label>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: "all", label: "Semua" },
                { id: "legend", label: "Legend" },
                { id: "elite", label: "Elite" },
                { id: "contender", label: "Contender" },
                { id: "rookie", label: "Rookie" },
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelectedRarity(r.id)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold transition-all ${
                    selectedRarity === r.id
                      ? "bg-purple-500 text-white"
                      : "bg-white/[0.04] text-gray-400 hover:text-white border border-white/10"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* RIGHT COLUMN: RESULTS AREA (9 COLS) */}
        <section className="col-span-9 space-y-6">
          {/* HEADER BAR: RESULT COUNT, SORT, VIEW TOGGLE */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#0F1118] border border-white/[0.08]">
            <div className="flex items-center gap-3">
              <span className="font-heading font-black text-sm uppercase text-white">
                {filteredCards.length} Profil Terdata
              </span>
              {hasActiveFilters && (
                <span className="text-[10px] font-mono text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded-full border border-[#D4AF37]/30">
                  Filter Aktif
                </span>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* SORT SEGMENTED CONTROL */}
              <div className="flex items-center bg-black/40 border border-white/10 rounded-full p-0.5 text-xs">
                <button
                  onClick={() => setSortBy("recent")}
                  className={`px-3 py-1 rounded-full transition-all ${
                    sortBy === "recent"
                      ? "bg-white/[0.08] text-white font-bold"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Terbaru
                </button>
                <button
                  onClick={() => setSortBy("rarity")}
                  className={`px-3 py-1 rounded-full transition-all ${
                    sortBy === "rarity"
                      ? "bg-white/[0.08] text-white font-bold"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Rarity
                </button>
                <button
                  onClick={() => setSortBy("name")}
                  className={`px-3 py-1 rounded-full transition-all ${
                    sortBy === "name"
                      ? "bg-white/[0.08] text-white font-bold"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Nama
                </button>
              </div>

              {/* VIEW MODE TOGGLE (CARDS / TABLE) */}
              <div className="flex items-center bg-black/40 border border-white/10 rounded-full p-0.5 text-gray-400">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-full transition-all ${
                    viewMode === "grid" ? "bg-[#D4AF37] text-black" : "hover:text-white"
                  }`}
                  title="Tampilan Kartu"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-1.5 rounded-full transition-all ${
                    viewMode === "table" ? "bg-[#D4AF37] text-black" : "hover:text-white"
                  }`}
                  title="Tampilan Tabel"
                >
                  <ListIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* ACTIVE FILTER PILLS */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 flex-wrap text-xs">
              {selectedEntity !== "all" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-gray-300">
                  <span>Entitas: {selectedEntity}</span>
                  <X
                    className="w-3 h-3 cursor-pointer text-gray-400 hover:text-white"
                    onClick={() => setSelectedEntity("all")}
                  />
                </span>
              )}
              {selectedGame !== "all" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-gray-300">
                  <span>Game: {selectedGame}</span>
                  <X
                    className="w-3 h-3 cursor-pointer text-gray-400 hover:text-white"
                    onClick={() => setSelectedGame("all")}
                  />
                </span>
              )}
              {selectedRegion !== "all" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-gray-300">
                  <span>Wilayah: {selectedRegion}</span>
                  <X
                    className="w-3 h-3 cursor-pointer text-gray-400 hover:text-white"
                    onClick={() => setSelectedRegion("all")}
                  />
                </span>
              )}
              {selectedVerif !== "all" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-gray-300">
                  <span>Verifikasi: {selectedVerif}</span>
                  <X
                    className="w-3 h-3 cursor-pointer text-gray-400 hover:text-white"
                    onClick={() => setSelectedVerif("all")}
                  />
                </span>
              )}
              {selectedRarity !== "all" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-gray-300">
                  <span>Rarity: {selectedRarity}</span>
                  <X
                    className="w-3 h-3 cursor-pointer text-gray-400 hover:text-white"
                    onClick={() => setSelectedRarity("all")}
                  />
                </span>
              )}
            </div>
          )}

          {/* EMPTY STATE */}
          {filteredCards.length === 0 && (
            <div className="p-16 rounded-3xl bg-[#0F1118] border border-white/[0.08] text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-gray-500 mb-4">
                <Search className="w-8 h-8 opacity-40" />
              </div>
              <h3 className="text-lg font-heading font-black uppercase text-white">
                Tidak Ada Profil Ditemukan
              </h3>
              <p className="text-xs text-gray-400 mt-1 max-w-sm">
                Coba sesuaikan kata kunci pencarian atau reset pilihan filter.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-6 px-6 py-2.5 rounded-full bg-[#D4AF37] text-black text-xs font-heading font-black uppercase tracking-wider shadow-lg active:scale-95 transition-all"
              >
                Reset Filter
              </button>
            </div>
          )}

          {/* VIEW 1: 4-COLUMN TCG CARD GRID */}
          {viewMode === "grid" && filteredCards.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCards.map((card) => (
                <div
                  key={card.id}
                  onClick={() => setPreviewCard(card)}
                  className="group flex flex-col items-center cursor-pointer transition-all duration-300 hover:-translate-y-2 shadow-xl"
                >
                  <EsportCard
                    type={card.type}
                    rarity={card.rarity}
                    verification={card.verification}
                    data={card.data}
                    size="sm"
                    interactive={true}
                  />
                  <div className="mt-3 flex items-center justify-between w-full px-2 text-xs">
                    <span className="font-heading font-bold text-white group-hover:text-[#D4AF37] transition-colors truncate">
                      {card.data.ign || card.data.displayName}
                    </span>
                    <span className="text-[10px] font-mono text-[#D4AF37] group-hover:translate-x-1 transition-transform">
                      Lihat →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* VIEW 2: COMPACT TABLE VIEW */}
          {viewMode === "table" && filteredCards.length > 0 && (
            <div className="rounded-2xl bg-[#0F1118] border border-white/[0.08] overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-black/40 border-b border-white/[0.08] text-gray-400 font-mono text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Profil / Atlet</th>
                    <th className="py-3 px-4">Game & Peran</th>
                    <th className="py-3 px-4">Wilayah</th>
                    <th className="py-3 px-4">Tier Rarity</th>
                    <th className="py-3 px-4">Verifikasi</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filteredCards.map((card) => (
                    <tr
                      key={card.id}
                      className="hover:bg-white/[0.02] transition-colors cursor-pointer group"
                      onClick={() => setPreviewCard(card)}
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#1A1E28] border border-white/10 flex items-center justify-center font-heading font-black text-[#D4AF37] shrink-0">
                            {(card.data.ign || card.data.displayName).slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-heading font-bold text-white group-hover:text-[#D4AF37] block">
                              {card.data.ign || card.data.displayName}
                            </span>
                            <span className="text-[10px] text-gray-400 font-mono">
                              {card.data.displayName}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-gray-200 block">{card.data.game}</span>
                        <span className="text-[10px] text-gray-400">{card.data.role || "Member"}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-gray-300">
                        {card.data.region.name}
                      </td>
                      <td className="py-3.5 px-4">
                        <RarityTag rarity={card.rarity} />
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={card.verification} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={getProfileSlug(card)}
                          onClick={(e) => e.stopPropagation()}
                          className="px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-[#D4AF37] hover:text-black border border-white/10 text-[10px] font-heading font-bold uppercase tracking-wider text-gray-300 transition-all inline-flex items-center gap-1"
                        >
                          <span>Buka</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {/* QUICK PREVIEW SIDE DRAWER */}
      <AnimatePresence>
        {previewCard && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewCard(null)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            />

            {/* Side Drawer Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 280 }}
              className="relative w-full max-w-md bg-[#0D1017] border-l border-white/[0.08] h-full shadow-2xl z-10 flex flex-col p-6 overflow-y-auto"
            >
              {/* Top Close Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-6">
                <span className="text-xs font-mono text-[#D4AF37] font-bold">
                  Pratinjau Cepat Profil
                </span>
                <button
                  onClick={() => setPreviewCard(null)}
                  className="w-8 h-8 rounded-full bg-white/[0.04] hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Centered TCG Card Preview */}
              <div className="flex justify-center mb-8">
                <EsportCard
                  type={previewCard.type}
                  rarity={previewCard.rarity}
                  verification={previewCard.verification}
                  data={previewCard.data}
                  size="md"
                  interactive={true}
                />
              </div>

              {/* Bio & Details */}
              <div className="space-y-4 text-xs flex-1">
                <div className="p-4 rounded-xl bg-[#0F1118] border border-white/[0.08] space-y-2.5">
                  <div className="flex justify-between">
                    <span className="text-gray-400">ESPORT ID:</span>
                    <span className="font-mono text-white font-bold">
                      {previewCard.data.esportId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Divisi Game:</span>
                    <span className="font-bold text-white">{previewCard.data.game}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Wilayah PBESI:</span>
                    <span className="font-bold text-white">
                      {previewCard.data.region.name} ({previewCard.data.region.code})
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Action: Open Full Profile */}
              <div className="pt-6 border-t border-white/[0.08]">
                <Link
                  href={getProfileSlug(previewCard)}
                  className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B38F24] hover:brightness-110 text-black text-xs font-heading font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-950/30 active:scale-[0.98] transition-all"
                >
                  <span>Buka Profil Lengkap</span>
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
