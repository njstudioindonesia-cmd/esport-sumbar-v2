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
  ExternalLink,
  Users,
  Trophy,
  Filter,
  Gamepad2,
  Building,
  GraduationCap,
  Flame,
} from "lucide-react";
import { MockCardVariant } from "@/data/mockCards";
import { REGIONS_DETAIL } from "@/data/regions";
import { OFFICIAL_GAMES } from "@/data/games";
import { EsportCard } from "@/components/card/EsportCard";
import { GlassSurface } from "@/components/glass/GlassSurface";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassBadge, GlassStatusBadge, GlassRarityBadge } from "@/components/glass/GlassBadge";
import { GlassButton } from "@/components/glass/GlassButton";

export function DesktopExplore() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab");

  // State Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEntity, setSelectedEntity] = useState<string>(initialTab || "all");
  const [selectedGame, setSelectedGame] = useState<string>("all");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedVerif, setSelectedVerif] = useState<string>("all");
  const [selectedRarity, setSelectedRarity] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"recent" | "rarity" | "name">("recent");

  // View mode & mobile filter sheet
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [previewCard, setPreviewCard] = useState<MockCardVariant | null>(null);
  const [regionFilterSearch, setRegionFilterSearch] = useState("");
  const [dbCards, setDbCards] = useState<MockCardVariant[] | null>(null);

  // Fetch live profiles from Supabase API
  useEffect(() => {
    async function fetchLiveProfiles() {
      try {
        const res = await fetch("/api/profiles?limit=100");
        if (res.ok) {
          const json = await res.json();
          if (json.profiles) {
            setDbCards(
              json.profiles.map((p: any) => ({
                id: p.id,
                type: p.entityType,
                rarity: p.rarityTier,
                verification: p.verificationStatus,
                data: {
                  displayName: p.displayName,
                  ign: p.ign || undefined,
                  role: p.roleName || "Member",
                  game: p.mainGameName || "Esport",
                  team: (p.attributes as any)?.team_name
                    ? { name: (p.attributes as any).team_name }
                    : undefined,
                  region: { name: p.regionName, code: p.regionCode },
                  esportId: p.esportId,
                  avatarUrl: p.avatarUrl || undefined,
                },
              }))
            );
          }
        } else {
          setDbCards([]);
        }
      } catch {
        setDbCards([]);
      }
    }
    fetchLiveProfiles();
  }, []);

  // Sync initialTab if url changes
  useEffect(() => {
    if (initialTab) {
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

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedEntity !== "all" ||
    selectedGame !== "all" ||
    selectedRegion !== "all" ||
    selectedVerif !== "all" ||
    selectedRarity !== "all";

  // Filtered Cards calculation
  const filteredCards = useMemo(() => {
    const list = (dbCards !== null ? dbCards : []).filter((card) => {
      // Entity filter
      if (selectedEntity !== "all" && card.type !== selectedEntity) return false;
      // Game filter
      if (selectedGame !== "all" && card.data.game !== selectedGame) return false;
      // Region filter
      if (selectedRegion !== "all" && card.data.region.code !== selectedRegion) return false;
      // Single-tier verification filter
      if (selectedVerif !== "all") {
        if (selectedVerif === "verified" && card.verification !== "verified") return false;
        if (selectedVerif === "pending" && card.verification !== "reverify") return false;
        if (selectedVerif === "unverified" && card.verification === "verified") return false;
      }
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
    dbCards,
    selectedEntity,
    selectedGame,
    selectedRegion,
    selectedVerif,
    selectedRarity,
    searchQuery,
    sortBy,
  ]);

  const filteredRegionsList = useMemo(() => {
    if (!regionFilterSearch.trim()) return REGIONS_DETAIL;
    return REGIONS_DETAIL.filter((r) =>
      r.name.toLowerCase().includes(regionFilterSearch.toLowerCase())
    );
  }, [regionFilterSearch]);

  const getProfileSlug = (card: MockCardVariant) => {
    const name = card.data.ign || card.data.displayName;
    const slug = name.toLowerCase().replace(/\s+/g, "-");
    switch (card.type) {
      case "player": return `/player/${slug}`;
      case "coach": return `/coach/${slug}`;
      case "team": return `/team/${slug}`;
      case "community": return `/community/${slug}`;
      case "venue": return `/venue/${slug}`;
      case "campus": return `/campus/${slug}`;
      case "school": return `/school/${slug}`;
      default: return `/player/${slug}`;
    }
  };

  const entityTabs = [
    { id: "all", label: "Semua", icon: Users },
    { id: "player", label: "Pemain", icon: Gamepad2 },
    { id: "coach", label: "Pelatih", icon: Award },
    { id: "team", label: "Tim", icon: Trophy },
    { id: "community", label: "Komunitas", icon: Flame },
    { id: "venue", label: "Venue", icon: Building },
    { id: "campus", label: "Kampus", icon: GraduationCap },
    { id: "school", label: "Sekolah", icon: Building },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* 1. TOP LARGE LIQUID GLASS SEARCH BAR */}
      <div className="max-w-2xl mx-auto mb-8 flex flex-col items-center">
        <GlassSurface
          variant="standard"
          elevation="glass"
          radius="full"
          className="relative w-full p-1.5 flex items-center border-white/15 shadow-xl"
        >
          <Search className="w-5 h-5 text-[#FF1752] ml-3.5 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama atlet, IGN, klub, nomor ESPORT ID, atau game..."
            className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="mr-3 text-white/50 hover:text-white transition-colors"
              aria-label="Hapus pencarian"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </GlassSurface>
      </div>

      {/* 2. 7-ENTITY SEGMENTED TABS */}
      <div className="flex items-center justify-start sm:justify-center gap-1.5 mb-8 overflow-x-auto pb-2 scrollbar-none">
        {entityTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = selectedEntity === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedEntity(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-heading font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                isActive
                  ? "bg-[#FF1752] text-white shadow-md shadow-[#FF1752]/20 border border-white/20"
                  : "bg-white/[0.05] text-white/60 hover:text-white hover:bg-white/[0.08] border border-white/[0.08]"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* MOBILE FILTER TRIGGER BUTTON (< 1024px) */}
      <div className="flex lg:hidden items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="font-heading font-black text-sm uppercase text-white">
            {filteredCards.length} Profil Terdata
          </span>
          {hasActiveFilters && (
            <span className="text-[10px] font-mono text-[#FF4D77] bg-[#FF1752]/10 px-2 py-0.5 rounded-full border border-[#FF1752]/30">
              Filter Aktif
            </span>
          )}
        </div>

        <GlassButton
          variant="secondary"
          size="sm"
          onClick={() => setMobileFilterOpen(true)}
          className="font-mono text-xs flex items-center gap-1.5"
        >
          <Filter className="w-3.5 h-3.5 text-[#FF1752]" />
          <span>Filter &amp; Opsi</span>
        </GlassButton>
      </div>

      {/* MAIN TWO-COLUMN LAYOUT (DESKTOP) / STACK (MOBILE) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: FILTERS SIDEBAR (3 COLS ON DESKTOP, HIDDEN ON MOBILE) */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6">
          <GlassSurface
            variant="standard"
            elevation="glass"
            radius="2xl"
            className="p-5 space-y-6 border-white/10"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-heading font-black uppercase tracking-wider text-white">
                Filter Pencarian
              </span>
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="text-[10px] font-mono text-[#FF4D77] hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* GAME FILTER */}
            <div className="space-y-2">
              <label className="text-[11px] font-heading font-bold uppercase text-white/50 tracking-wider">
                Divisi Game
              </label>
              <select
                value={selectedGame}
                onChange={(e) => setSelectedGame(e.target.value)}
                className="w-full bg-white/[0.06] border border-white/10 text-xs text-white rounded-xl px-3 py-2 outline-none focus:border-[#FF1752]/50"
              >
                <option value="all" className="bg-[#0A0D15]">Semua Game</option>
                {OFFICIAL_GAMES.map((g) => (
                  <option key={g.id} value={g.name} className="bg-[#0A0D15]">
                    {g.shortName}
                  </option>
                ))}
              </select>
            </div>

            {/* REGION FILTER */}
            <div className="space-y-2">
              <label className="text-[11px] font-heading font-bold uppercase text-white/50 tracking-wider">
                Wilayah Geografis (19)
              </label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full bg-white/[0.06] border border-white/10 text-xs text-white rounded-xl px-3 py-2 outline-none focus:border-[#FF1752]/50"
              >
                <option value="all" className="bg-[#0A0D15]">Semua Wilayah</option>
                {REGIONS_DETAIL.map((r) => (
                  <option key={r.code} value={r.code} className="bg-[#0A0D15]">
                    {r.name} ({r.code})
                  </option>
                ))}
              </select>
            </div>

            {/* VERIFICATION FILTER */}
            <div className="space-y-2">
              <label className="text-[11px] font-heading font-bold uppercase text-white/50 tracking-wider">
                Verifikasi Standar
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: "all", label: "Semua" },
                  { id: "verified", label: "Terverifikasi" },
                  { id: "pending", label: "Menunggu" },
                  { id: "unverified", label: "Belum" },
                ].map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVerif(v.id)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold transition-all ${
                      selectedVerif === v.id
                        ? "bg-[#D4AF37] text-black shadow-sm"
                        : "bg-white/[0.05] text-white/60 hover:text-white border border-white/10"
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

            {/* RARITY TIER FILTER */}
            <div className="space-y-2">
              <label className="text-[11px] font-heading font-bold uppercase text-white/50 tracking-wider">
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
                        ? "bg-[#FF1752] text-white shadow-sm"
                        : "bg-white/[0.05] text-white/60 hover:text-white border border-white/10"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          </GlassSurface>
        </aside>

        {/* RIGHT COLUMN: RESULTS AREA (9 COLS ON DESKTOP, 12 ON MOBILE) */}
        <section className="col-span-1 lg:col-span-9 space-y-6">
          {/* HEADER BAR: RESULT COUNT, SORT, VIEW TOGGLE (DESKTOP) */}
          <GlassSurface
            variant="standard"
            elevation="glass"
            radius="2xl"
            className="hidden lg:flex items-center justify-between p-4 border-white/10"
          >
            <div className="flex items-center gap-3">
              <span className="font-heading font-black text-sm uppercase text-white">
                {filteredCards.length} Profil Terdata
              </span>
              {hasActiveFilters && (
                <span className="text-[10px] font-mono text-[#FF4D77] bg-[#FF1752]/10 px-2 py-0.5 rounded-full border border-[#FF1752]/30">
                  Filter Aktif
                </span>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* SORT CONTROL */}
              <div className="flex items-center bg-black/40 border border-white/10 rounded-full p-0.5 text-xs">
                <button
                  onClick={() => setSortBy("recent")}
                  className={`px-3 py-1 rounded-full transition-all ${
                    sortBy === "recent"
                      ? "bg-white/15 text-white font-bold"
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  Terbaru
                </button>
                <button
                  onClick={() => setSortBy("rarity")}
                  className={`px-3 py-1 rounded-full transition-all ${
                    sortBy === "rarity"
                      ? "bg-white/15 text-white font-bold"
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  Rarity
                </button>
                <button
                  onClick={() => setSortBy("name")}
                  className={`px-3 py-1 rounded-full transition-all ${
                    sortBy === "name"
                      ? "bg-white/15 text-white font-bold"
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  Nama
                </button>
              </div>

              {/* VIEW MODE TOGGLE */}
              <div className="flex items-center bg-black/40 border border-white/10 rounded-full p-0.5 text-white/50">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-full transition-all ${
                    viewMode === "grid" ? "bg-[#FF1752] text-white" : "hover:text-white"
                  }`}
                  title="Tampilan Kartu"
                  aria-label="Tampilan Kartu"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-1.5 rounded-full transition-all ${
                    viewMode === "table" ? "bg-[#FF1752] text-white" : "hover:text-white"
                  }`}
                  title="Tampilan Tabel"
                  aria-label="Tampilan Tabel"
                >
                  <ListIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </GlassSurface>

          {/* EMPTY STATE */}
          {filteredCards.length === 0 && (
            <GlassSurface
              variant="subtle"
              elevation="flat"
              radius="2xl"
              className="p-14 text-center flex flex-col items-center border-white/10"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-white/40 mb-3">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="text-base font-heading font-black uppercase text-white">
                Tidak Ada Profil Ditemukan
              </h3>
              <p className="text-xs text-white/50 mt-1 max-w-sm">
                Coba sesuaikan kata kunci pencarian atau reset pilihan filter.
              </p>
              <GlassButton
                variant="primary"
                size="sm"
                onClick={handleResetFilters}
                className="mt-5 text-xs font-heading font-black uppercase"
              >
                Reset Filter
              </GlassButton>
            </GlassSurface>
          )}

          {/* VIEW 1: GRID MODE */}
          {viewMode === "grid" && filteredCards.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCards.map((card) => (
                <div
                  key={card.id}
                  onClick={() => setPreviewCard(card)}
                  className="group flex flex-col items-center cursor-pointer transition-all duration-300 hover:-translate-y-1"
                >
                  <EsportCard
                    type={card.type}
                    rarity={card.rarity}
                    verification={card.verification}
                    data={card.data}
                    size="fluid"
                    interactive={true}
                  />
                  <div className="mt-2.5 flex items-center justify-between w-full max-w-[280px] px-2 text-xs">
                    <span className="font-heading font-bold text-white group-hover:text-pink-300 transition-colors truncate">
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

          {/* VIEW 2: TABLE MODE */}
          {viewMode === "table" && filteredCards.length > 0 && (
            <GlassSurface
              variant="standard"
              elevation="glass"
              radius="2xl"
              className="border-white/10 overflow-x-auto"
            >
              <table className="w-full text-left text-xs min-w-[600px]">
                <thead className="bg-black/40 border-b border-white/10 text-white/50 font-mono text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Profil / Atlet</th>
                    <th className="py-3 px-4">Game &amp; Peran</th>
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
                      className="hover:bg-white/[0.04] transition-colors cursor-pointer group"
                      onClick={() => setPreviewCard(card)}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center font-heading font-black text-pink-300 text-xs shrink-0">
                            {(card.data.ign || card.data.displayName).slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-heading font-bold text-white group-hover:text-pink-300 block truncate max-w-[140px]">
                              {card.data.ign || card.data.displayName}
                            </span>
                            <span className="text-[10px] text-white/40 font-mono">
                              {card.data.displayName}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-white/90 block">{card.data.game}</span>
                        <span className="text-[10px] text-white/50">{card.data.role || "Member"}</span>
                      </td>
                      <td className="py-3 px-4 font-mono text-white/70">
                        {card.data.region.name}
                      </td>
                      <td className="py-3 px-4">
                        <GlassRarityBadge tier={card.rarity} size="sm" />
                      </td>
                      <td className="py-3 px-4">
                        <GlassStatusBadge
                          status={card.verification === "verified" ? "verified" : card.verification === "regional" ? "verified" : "unregistered"}
                          size="sm"
                        />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href={getProfileSlug(card)}
                          onClick={(e) => e.stopPropagation()}
                          className="px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-[#FF1752] hover:text-white border border-white/10 text-[10px] font-heading font-bold uppercase tracking-wider text-white/70 transition-all inline-flex items-center gap-1"
                        >
                          <span>Buka</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </GlassSurface>
          )}
        </section>
      </div>

      {/* QUICK PREVIEW DRAWER (BOTH MOBILE & DESKTOP) */}
      <AnimatePresence>
        {previewCard && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewCard(null)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 280 }}
              className="relative w-full max-w-md bg-[#0A0D15] border-l border-white/15 h-full shadow-2xl z-10 flex flex-col p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <span className="text-xs font-mono text-[#D4AF37] font-bold">
                  Pratinjau Paspor Digital
                </span>
                <button
                  onClick={() => setPreviewCard(null)}
                  className="w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white"
                  aria-label="Tutup pratinjau"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex justify-center mb-6">
                <EsportCard
                  type={previewCard.type}
                  rarity={previewCard.rarity}
                  verification={previewCard.verification}
                  data={previewCard.data}
                  size="fluid"
                  interactive={true}
                />
              </div>

              <div className="space-y-3 text-xs flex-1">
                <GlassSurface variant="subtle" radius="xl" className="p-4 space-y-2 border-white/10">
                  <div className="flex justify-between">
                    <span className="text-white/50">ESPORT ID:</span>
                    <span className="font-mono text-[#D4AF37] font-bold">
                      {previewCard.data.esportId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Divisi Game:</span>
                    <span className="font-bold text-white">{previewCard.data.game}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Wilayah:</span>
                    <span className="font-bold text-white">
                      {previewCard.data.region.name} ({previewCard.data.region.code})
                    </span>
                  </div>
                </GlassSurface>
              </div>

              <div className="pt-6 border-t border-white/10">
                <Link
                  href={getProfileSlug(previewCard)}
                  className="w-full"
                >
                  <GlassButton variant="primary" size="md" className="w-full text-xs font-heading font-black uppercase tracking-wider">
                    <span>Buka Profil Lengkap</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                  </GlassButton>
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MOBILE FILTER MODAL SHEET */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFilterOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 280 }}
              className="relative w-full max-w-lg bg-[#0A0D15] border-t sm:border border-white/15 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl z-10 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <span className="text-sm font-heading font-black uppercase text-white">
                  Opsi Filter
                </span>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white"
                  aria-label="Tutup filter"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {/* GAME */}
                <div>
                  <label className="text-xs font-mono text-white/50 block mb-1">Divisi Game</label>
                  <select
                    value={selectedGame}
                    onChange={(e) => setSelectedGame(e.target.value)}
                    className="w-full bg-white/[0.06] border border-white/10 text-xs text-white rounded-xl px-3 py-2.5 outline-none"
                  >
                    <option value="all" className="bg-[#0A0D15]">Semua Game</option>
                    {OFFICIAL_GAMES.map((g) => (
                      <option key={g.id} value={g.name} className="bg-[#0A0D15]">
                        {g.shortName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* REGION */}
                <div>
                  <label className="text-xs font-mono text-white/50 block mb-1">Wilayah Geografis</label>
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="w-full bg-white/[0.06] border border-white/10 text-xs text-white rounded-xl px-3 py-2.5 outline-none"
                  >
                    <option value="all" className="bg-[#0A0D15]">Semua Wilayah (19)</option>
                    {REGIONS_DETAIL.map((r) => (
                      <option key={r.code} value={r.code} className="bg-[#0A0D15]">
                        {r.name} ({r.code})
                      </option>
                    ))}
                  </select>
                </div>

                {/* ACTIONS */}
                <div className="pt-4 flex gap-3">
                  <GlassButton
                    variant="secondary"
                    size="md"
                    onClick={handleResetFilters}
                    className="flex-1 font-mono text-xs"
                  >
                    Reset
                  </GlassButton>
                  <GlassButton
                    variant="primary"
                    size="md"
                    onClick={() => setMobileFilterOpen(false)}
                    className="flex-1 font-mono text-xs font-bold"
                  >
                    Terapkan ({filteredCards.length})
                  </GlassButton>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
