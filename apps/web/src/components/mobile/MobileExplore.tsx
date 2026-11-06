"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  X,
  LayoutGrid,
  List as ListIcon,
  ShieldCheck,
  Award,
  RotateCcw,
  MapPin,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { GALLERY_CARDS, MockCardVariant } from "@/data/mockCards";
import { REGIONS_DETAIL } from "@/data/regions";
import { OFFICIAL_GAMES } from "@/data/games";
import { MobileBottomBar } from "./MobileBottomBar";

export function MobileExplore() {
  const router = useRouter();

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<"all" | "player" | "coach" | "team">("all");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedGame, setSelectedGame] = useState<string>("all");
  const [selectedRarity, setSelectedRarity] = useState<string>("all");
  const [selectedVerif, setSelectedVerif] = useState<string>("all");

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [filterRegionSearch, setFilterRegionSearch] = useState("");
  const [dbCards, setDbCards] = useState<MockCardVariant[] | null>(null);

  React.useEffect(() => {
    async function loadLiveCards() {
      try {
        const res = await fetch("/api/profiles?limit=60");
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
          } else {
            setDbCards([]);
          }
        } else {
          setDbCards([]);
        }
      } catch {
        setDbCards([]);
      }
    }
    loadLiveCards();
  }, []);

  const triggerHaptic = (ms = 10) => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(ms);
      } catch {
        // Ignored
      }
    }
  };

  const handleResetFilters = () => {
    triggerHaptic();
    setSearchQuery("");
    setSelectedEntity("all");
    setSelectedRegion("all");
    setSelectedGame("all");
    setSelectedRarity("all");
    setSelectedVerif("all");
  };

  // Filtered Cards
  const filteredCards = useMemo(() => {
    return (dbCards !== null ? dbCards : []).filter((card) => {
      // Entity match
      if (selectedEntity !== "all" && card.type !== selectedEntity) return false;
      // Region match
      if (selectedRegion !== "all" && card.data.region.code !== selectedRegion) return false;
      // Game match
      if (selectedGame !== "all" && card.data.game !== selectedGame) return false;
      // Rarity match
      if (selectedRarity !== "all" && card.rarity !== selectedRarity) return false;
      // Verification match
      if (selectedVerif !== "all" && card.verification !== selectedVerif) return false;
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = card.data.displayName.toLowerCase().includes(q);
        const matchIgn = card.data.ign?.toLowerCase().includes(q);
        const matchGame = card.data.game.toLowerCase().includes(q);
        const matchRegion = card.data.region.name.toLowerCase().includes(q);
        if (!matchName && !matchIgn && !matchGame && !matchRegion) return false;
      }
      return true;
    });
  }, [selectedEntity, selectedRegion, selectedGame, selectedRarity, selectedVerif, searchQuery]);

  const activeFilterCount = [
    selectedRegion !== "all",
    selectedGame !== "all",
    selectedRarity !== "all",
    selectedVerif !== "all",
  ].filter(Boolean).length;

  return (
    <div className="relative w-full min-h-[100dvh] max-w-[420px] mx-auto bg-[#07080C] text-white flex flex-col pb-28 overflow-x-hidden select-none">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-gradient-to-b from-[#4C7DFF]/10 via-[#D4AF37]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* TOP BAR: SEARCH BAR PILL KACA + FILTER ICON */}
      <div className="sticky top-0 z-30 px-5 pt-3 pb-2 bg-[#07080C]/90 backdrop-blur-xl flex items-center gap-2.5">
        {/* Search Bar Pill Kaca (Placeholder "Cari") */}
        <div
          onClick={() => {
            triggerHaptic();
            setIsSearchOpen(true);
          }}
          className="flex-1 h-12 rounded-full bg-[#161A24]/90 border border-white/[0.08] px-4 flex items-center gap-2.5 cursor-pointer hover:border-white/20 transition-all shadow-md"
        >
          <Search className="w-4 h-4 text-white/40" />
          <span className="text-sm font-medium text-white/40">
            {searchQuery || "Cari"}
          </span>
          {searchQuery && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSearchQuery("");
              }}
              className="ml-auto p-1 text-white/40 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Tombol Filter Ikon (Membuka Bottom Sheet) */}
        <button
          onClick={() => {
            triggerHaptic();
            setIsFilterSheetOpen(true);
          }}
          className={`relative w-12 h-12 rounded-full border flex items-center justify-center transition-all ${
            activeFilterCount > 0
              ? "bg-[#D4AF37] border-[#D4AF37] text-[#07080C] shadow-[0_4px_16px_rgba(212,175,55,0.3)]"
              : "bg-[#161A24] border-white/[0.08] text-white/70 hover:text-white"
          }`}
          aria-label="Filter"
        >
          <SlidersHorizontal className="w-4 h-4" />
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#EF4444] text-[9px] font-mono font-bold text-white flex items-center justify-center shadow">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      <div className="px-5 flex flex-col gap-5 pt-2">
        {/* CHIP ENTITAS DAPAT DIGESER (Semua, Player, Pelatih, Tim) */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5">
          {[
            { id: "all", label: "Semua" },
            { id: "player", label: "Player" },
            { id: "coach", label: "Pelatih" },
            { id: "team", label: "Tim" },
          ].map((tab) => {
            const isActive = selectedEntity === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  triggerHaptic();
                  setSelectedEntity(tab.id as "all" | "player" | "coach" | "team");
                }}
                className={`px-4 py-2 rounded-full text-xs font-heading font-bold uppercase tracking-wider transition-all border whitespace-nowrap ${
                  isActive
                    ? "bg-[#4C7DFF] text-white border-[#4C7DFF] shadow-[0_4px_16px_rgba(76,125,255,0.3)]"
                    : "bg-[#161A24] text-white/60 border-white/[0.08] hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* SEKSI "PER WILAYAH": 19 EMBLEM BULAT + TOMBOL PETA */}
        <div className="w-full flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/50">
              19 Wilayah
            </span>
            <Link
              href="/map"
              onClick={() => triggerHaptic()}
              className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider flex items-center gap-1 hover:underline"
            >
              <MapPin className="w-3 h-3" />
              <span>Peta</span>
            </Link>
          </div>

          <div className="flex gap-2.5 overflow-x-auto no-scrollbar -mx-5 px-5 py-1">
            {/* Tombol Reset Wilayah (Semua) */}
            <button
              onClick={() => {
                triggerHaptic();
                setSelectedRegion("all");
              }}
              className={`flex-shrink-0 w-11 h-11 rounded-full border text-[10px] font-mono font-bold flex items-center justify-center transition-all ${
                selectedRegion === "all"
                  ? "bg-[#D4AF37] text-[#07080C] border-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.4)]"
                  : "bg-[#161A24] text-white/60 border-white/[0.08] hover:text-white"
              }`}
            >
              ALL
            </button>

            {/* 19 Emblem Wilayah */}
            {REGIONS_DETAIL.map((reg) => {
              const isSelected = selectedRegion === reg.code;
              return (
                <button
                  key={reg.id}
                  onClick={() => {
                    triggerHaptic();
                    setSelectedRegion(isSelected ? "all" : reg.code);
                  }}
                  className={`flex-shrink-0 w-11 h-11 rounded-full border text-[10px] font-mono font-bold flex flex-col items-center justify-center transition-all ${
                    isSelected
                      ? "bg-[#D4AF37] text-[#07080C] border-[#D4AF37] shadow-[0_0_16px_rgba(212,175,55,0.4)] scale-105"
                      : "bg-[#161A24] text-white/70 border-white/[0.08] hover:text-white hover:border-white/20"
                  }`}
                  title={reg.name}
                >
                  <span>{reg.code}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* HEADER HASIL & TOGGLE VIEW MODE (GRID 2 KOLOM / LIST) */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-white/40">
              {filteredCards.length} Kartu
            </span>
            {selectedRegion !== "all" && (
              <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[9px] font-mono text-[#D4AF37]">
                {selectedRegion}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 bg-[#161A24] p-1 rounded-full border border-white/[0.08]">
            <button
              onClick={() => {
                triggerHaptic();
                setViewMode("grid");
              }}
              className={`p-1.5 rounded-full transition-colors ${
                viewMode === "grid" ? "bg-white/10 text-white" : "text-white/40"
              }`}
              aria-label="Grid"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                triggerHaptic();
                setViewMode("list");
              }}
              className={`p-1.5 rounded-full transition-colors ${
                viewMode === "list" ? "bg-white/10 text-white" : "text-white/40"
              }`}
              aria-label="List"
            >
              <ListIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ================================================================== */}
        {/* HASIL: GRID 2 KOLOM KARTU MINI BERGAYA TCG (Frame + Lencana Jelas) */}
        {/* ================================================================== */}
        {filteredCards.length > 0 ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-2 gap-3">
              {filteredCards.map((card) => {
                const isLegend = card.rarity === "legend";
                const isElite = card.rarity === "elite";
                const isContender = card.rarity === "contender";

                const frameBorder = isLegend
                  ? "border-[#C084FC] shadow-[0_0_16px_rgba(192,132,252,0.35)]"
                  : isElite
                  ? "border-[#D4AF37] shadow-[0_0_14px_rgba(212,175,55,0.35)]"
                  : isContender
                  ? "border-[#94A3B8] shadow-[0_0_12px_rgba(148,163,184,0.25)]"
                  : "border-[#8C5A3C] shadow-[0_0_10px_rgba(140,90,60,0.25)]";

                const badgeColor =
                  card.verification === "verified"
                    ? "text-[#D4AF37]"
                    : card.verification === "regional"
                    ? "text-[#22C55E]"
                    : "text-white/40";

                return (
                  <motion.div
                    key={card.id}
                    layoutId={`card-${card.id}`}
                    onClick={() => {
                      triggerHaptic();
                      router.push(
                        card.type === "player"
                          ? `/player/${card.data.ign?.toLowerCase() || "profile"}`
                          : card.type === "coach"
                          ? `/coach/${card.data.displayName.toLowerCase().replace(/\s+/g, "_")}`
                          : `/team/${card.data.displayName.toLowerCase().replace(/\s+/g, "-")}`
                      );
                    }}
                    className={`relative w-full h-64 rounded-[18px] bg-gradient-to-b from-[#1C202C] to-[#0A0D14] border-2 ${frameBorder} p-3 flex flex-col justify-between overflow-hidden cursor-pointer active:scale-[0.98] transition-all`}
                  >
                    {/* Header: Rarity Tag & Lencana Terpisah */}
                    <div className="w-full flex items-center justify-between text-[8px] font-mono z-10">
                      <span className="font-bold text-white/70 uppercase">
                        {card.rarity}
                      </span>
                      <div className={`flex items-center gap-1 ${badgeColor}`}>
                        <ShieldCheck className="w-3 h-3" />
                      </div>
                    </div>

                    {/* Avatar */}
                    <div className="relative w-full flex-1 flex flex-col items-center justify-center my-1 z-10">
                      <div className="w-20 h-20 rounded-xl overflow-hidden border border-white/10 shadow bg-[#07080C]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={card.data.avatarUrl}
                          alt={card.data.displayName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-center mt-2 w-full px-1">
                        <div className="text-xs font-heading font-black text-white truncate">
                          {card.data.displayName}
                        </div>
                        <div className="text-[9px] font-mono text-[#D4AF37] font-semibold truncate">
                          @{card.data.ign || card.data.role}
                        </div>
                      </div>
                    </div>

                    {/* Footer: Game + Region Code */}
                    <div className="w-full pt-1.5 border-t border-white/[0.08] flex items-center justify-between text-[8px] font-mono text-white/60 z-10">
                      <span className="truncate max-w-[80px]">{card.data.game}</span>
                      <span className="text-[#D4AF37] font-bold">{card.data.region.code}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            /* LIST VIEW MODE */
            <div className="flex flex-col gap-2">
              {filteredCards.map((card) => (
                <div
                  key={card.id}
                  onClick={() => {
                    triggerHaptic();
                    router.push(`/player/${card.data.ign?.toLowerCase() || "profile"}`);
                  }}
                  className="h-18 rounded-2xl bg-[#161A24] border border-white/[0.08] p-3 flex items-center justify-between cursor-pointer hover:border-[#D4AF37]/50 active:scale-[0.99] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={card.data.avatarUrl}
                        alt={card.data.displayName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-heading font-bold text-sm text-white">
                        {card.data.displayName}
                      </div>
                      <div className="text-[10px] font-mono text-[#D4AF37]">
                        @{card.data.ign} • {card.data.game}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-white block">
                      {card.data.region.code}
                    </span>
                    <span className="text-[9px] font-mono text-white/40 uppercase">
                      {card.rarity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          /* ================================================================ */
          /* STATE KOSONG: Ikon Besar + 3 Kata + Tombol "Reset"               */
          /* ================================================================ */
          <div className="w-full py-16 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#161A24] border border-white/[0.08] flex items-center justify-center text-white/30 mb-4">
              <Search className="w-8 h-8" />
            </div>
            {/* Teks: Tepat 3 Kata */}
            <h3 className="font-heading font-bold text-lg text-white mb-4">
              Data Tidak Ditemukan
            </h3>
            {/* Tombol: Tepat 1 Kata */}
            <button
              onClick={handleResetFilters}
              className="h-11 px-6 rounded-full bg-[#D4AF37] text-[#07080C] font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_4px_16px_rgba(212,175,55,0.3)]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        )}
      </div>

      {/* FULL-SCREEN SEARCH OVERLAY (Pencarian Layar Penuh + Chip Riwayat & Saran) */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-50 bg-[#07080C] p-6 flex flex-col gap-6"
          >
            {/* Top Bar with Input & Close */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-14 rounded-full bg-[#161A24] border border-white/[0.08] px-5 flex items-center gap-3">
                <Search className="w-5 h-5 text-[#4C7DFF]" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari atlet, tim, game..."
                  className="w-full bg-transparent text-base font-medium text-white placeholder-white/30 outline-none"
                />
              </div>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="w-12 h-12 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Riwayat & Saran Berupa Chip */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
                Saran Pencarian
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  "Mobile Legends",
                  "Free Fire",
                  "Padang",
                  "Bukittinggi",
                  "Legend Tier",
                  "Verified ESI",
                ].map((sug) => (
                  <button
                    key={sug}
                    onClick={() => {
                      triggerHaptic();
                      setSearchQuery(sug);
                      setIsSearchOpen(false);
                    }}
                    className="px-3.5 py-1.5 rounded-full bg-[#161A24] border border-white/[0.08] text-xs text-white/80 hover:text-white hover:border-[#D4AF37]"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BOTTOM SHEET: FILTER LENGKAP (Tanpa Teks Penjelasan di Sheet) */}
      <AnimatePresence>
        {isFilterSheetOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterSheetOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed bottom-0 left-0 right-0 max-w-[420px] mx-auto max-h-[85vh] bg-[#0F1118]/95 border-t border-white/[0.08] backdrop-blur-2xl rounded-t-[28px] p-5 z-50 flex flex-col justify-between overflow-y-auto no-scrollbar shadow-2xl"
            >
              <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-3" />

              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-bold text-lg text-white">Filter</h3>
                <button
                  onClick={handleResetFilters}
                  className="text-xs font-mono text-[#D4AF37] uppercase tracking-wider"
                >
                  Reset
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {/* 1. Game (Grid Logo / Tombol) */}
                <div>
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block mb-2">
                    Game
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {OFFICIAL_GAMES.map((g) => {
                      const isSelected = selectedGame === g.name;
                      return (
                        <button
                          key={g.id}
                          onClick={() => {
                            triggerHaptic();
                            setSelectedGame(isSelected ? "all" : g.name);
                          }}
                          className={`h-11 px-3 rounded-xl border text-xs font-heading font-bold text-left truncate transition-all ${
                            isSelected
                              ? "bg-[#4C7DFF] text-white border-[#4C7DFF]"
                              : "bg-[#161A24] text-white/60 border-white/[0.08]"
                          }`}
                        >
                          {g.shortName}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Rarity Tier (Chips) */}
                <div>
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block mb-2">
                    Rarity
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {["rookie", "contender", "elite", "legend"].map((tier) => {
                      const isSelected = selectedRarity === tier;
                      return (
                        <button
                          key={tier}
                          onClick={() => {
                            triggerHaptic();
                            setSelectedRarity(isSelected ? "all" : tier);
                          }}
                          className={`px-3 py-1.5 rounded-full text-xs font-mono uppercase transition-all border ${
                            isSelected
                              ? "bg-[#D4AF37] text-[#07080C] font-bold border-[#D4AF37]"
                              : "bg-[#161A24] text-white/60 border-white/[0.08]"
                          }`}
                        >
                          {tier}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Lencana Verifikasi (Chips) */}
                <div>
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block mb-2">
                    Lencana
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: "verified", label: "Verified ESI" },
                      { id: "regional", label: "Terverifikasi" },
                      { id: "unverified", label: "Unverified" },
                    ].map((v) => {
                      const isSelected = selectedVerif === v.id;
                      return (
                        <button
                          key={v.id}
                          onClick={() => {
                            triggerHaptic();
                            setSelectedVerif(isSelected ? "all" : v.id);
                          }}
                          className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all border ${
                            isSelected
                              ? "bg-[#22C55E] text-[#07080C] font-bold border-[#22C55E]"
                              : "bg-[#161A24] text-white/60 border-white/[0.08]"
                          }`}
                        >
                          {v.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Tombol Terapkan (Maks 1 Kata) */}
              <div className="pt-6">
                <button
                  onClick={() => {
                    triggerHaptic();
                    setIsFilterSheetOpen(false);
                  }}
                  className="w-full h-14 rounded-full bg-[#D4AF37] text-[#07080C] font-heading font-bold text-sm uppercase tracking-wider shadow-lg"
                >
                  Terapkan
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* FLOATING BOTTOM BAR (Tab Jelajah Aktif) */}
      <MobileBottomBar />
    </div>
  );
}
