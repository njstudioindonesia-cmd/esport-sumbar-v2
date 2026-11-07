"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  MapPin,
  Trophy,
  Users,
  Gamepad2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Shield,
  Clock,
  Building,
  GraduationCap,
  ExternalLink,
  Flame,
  Award,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { GlassSurface } from "@/components/glass/GlassSurface";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassBadge, GlassStatusBadge, GlassRarityBadge } from "@/components/glass/GlassBadge";
import { GlassButton } from "@/components/glass/GlassButton";
import { REGIONS_DETAIL } from "@/data/regions";
import { OFFICIAL_GAMES } from "@/data/games";
import type { UnifiedProfileDetail } from "@/lib/services/public-profiles";
import type { EntityType } from "@/lib/supabase/database.types";
import { InitialsAvatar } from "@/components/ui/InitialsAvatar";

interface EntityDirectoryViewProps {
  entityType: EntityType;
  title: string;
  subtitle: string;
  initialProfiles: UnifiedProfileDetail[];
}

export function EntityDirectoryView({
  entityType,
  title,
  subtitle,
  initialProfiles,
}: EntityDirectoryViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedGame, setSelectedGame] = useState("all");
  const [selectedVerif, setSelectedVerif] = useState<"all" | "verified" | "pending" | "unverified">("all");

  const filteredProfiles = useMemo(() => {
    return initialProfiles.filter((p) => {
      const matchSearch =
        p.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.ign && p.ign.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.esportId && p.esportId.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchRegion = selectedRegion === "all" || p.regionCode === selectedRegion || p.regionId === selectedRegion;
      const matchGame = selectedGame === "all" || p.mainGameId === selectedGame || p.mainGameShort === selectedGame;
      const isPending = p.verificationStatus === "submitted" || p.verificationStatus === "under_review";
      const isVerified = p.verificationStatus === "verified";
      const matchVerif = selectedVerif === "all" || 
        (selectedVerif === "verified" && isVerified) ||
        (selectedVerif === "pending" && isPending) ||
        (selectedVerif === "unverified" && !isVerified && !isPending);

      return matchSearch && matchRegion && matchGame && matchVerif;
    });
  }, [initialProfiles, searchQuery, selectedRegion, selectedGame, selectedVerif]);

  const getProfilePath = (slug: string) => {
    switch (entityType) {
      case "player":
        return `/player/${slug}`;
      case "coach":
        return `/coach/${slug}`;
      case "team":
        return `/team/${slug}`;
      case "community":
        return `/community/${slug}`;
      case "venue":
        return `/venue/${slug}`;
      case "campus":
        return `/campus/${slug}`;
      case "school":
        return `/school/${slug}`;
      default:
        return `/profile/${slug}`;
    }
  };

  const getEntityIcon = () => {
    switch (entityType) {
      case "player": return Gamepad2;
      case "coach": return Award;
      case "team": return Users;
      case "community": return Flame;
      case "venue": return Building;
      case "campus": return GraduationCap;
      case "school": return GraduationCap;
      default: return Users;
    }
  };

  const EntityIcon = getEntityIcon();

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[#FFFFFF] flex flex-col font-sans selection:bg-[#FF1752]/30 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* HEADER DIREKTORI */}
        <div className="flex flex-col gap-2 mb-8">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#FF1752]/15 border border-[#FF1752]/30 text-[#FF4D77] text-xs font-heading font-black uppercase tracking-wider">
              DIREKTORI ESPORT SUMBAR™
            </span>
            <span className="text-xs font-mono text-white/50">
              {filteredProfiles.length} Terdaftar
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-heading font-black uppercase text-white tracking-tight flex items-center gap-3">
            <EntityIcon className="w-7 h-7 sm:w-9 sm:h-9 text-[#FF1752]" />
            <span>{title}</span>
          </h1>
          <p className="text-xs sm:text-sm text-white/60 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* SEARCH & FILTERS BAR (LIQUID GLASS BAR) */}
        <GlassSurface
          variant="standard"
          elevation="glass"
          radius="2xl"
          className="p-4 mb-8 flex flex-col md:flex-row gap-3 items-center justify-between border-white/10 shadow-xl"
        >
          {/* Text Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, IGN, atau ESPORT ID..."
              className="w-full bg-white/[0.06] border border-white/10 focus:border-[#FF1752]/50 focus:ring-1 focus:ring-[#FF1752]/30 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-white/40 outline-none transition-all"
            />
          </div>

          {/* Filter Selects */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full md:w-auto">
            <div className="flex items-center gap-1.5 text-xs text-white/60 font-mono shrink-0">
              <Filter className="w-3.5 h-3.5 text-[#FF1752]" />
              <span className="hidden sm:inline">Filter:</span>
            </div>

            {/* Region Select */}
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="flex-1 sm:w-44 bg-white/[0.06] border border-white/10 text-xs text-white rounded-xl px-3 py-2.5 outline-none focus:border-[#FF1752]/50"
            >
              <option value="all" className="bg-[#0A0D15]">Semua Wilayah (19)</option>
              {REGIONS_DETAIL.map((r) => (
                <option key={r.code} value={r.code} className="bg-[#0A0D15]">
                  {r.name} ({r.code})
                </option>
              ))}
            </select>

            {/* Game Select */}
            <select
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
              className="flex-1 sm:w-40 bg-white/[0.06] border border-white/10 text-xs text-white rounded-xl px-3 py-2.5 outline-none focus:border-[#FF1752]/50"
            >
              <option value="all" className="bg-[#0A0D15]">Semua Game</option>
              {OFFICIAL_GAMES.map((g) => (
                <option key={g.id} value={g.id} className="bg-[#0A0D15]">
                  {g.shortName}
                </option>
              ))}
            </select>

            {/* Verification Status Filter */}
            <select
              value={selectedVerif}
              onChange={(e) => setSelectedVerif(e.target.value as any)}
              className="flex-1 sm:w-36 bg-white/[0.06] border border-white/10 text-xs text-white rounded-xl px-3 py-2.5 outline-none focus:border-[#FF1752]/50"
            >
              <option value="all" className="bg-[#0A0D15]">Semua Status</option>
              <option value="verified" className="bg-[#0A0D15]">Terverifikasi</option>
              <option value="pending" className="bg-[#0A0D15]">Menunggu</option>
              <option value="unverified" className="bg-[#0A0D15]">Belum Mengajukan</option>
            </select>
          </div>
        </GlassSurface>

        {/* PROFILES GRID */}
        {filteredProfiles.length === 0 ? (
          <GlassSurface
            variant="subtle"
            elevation="flat"
            radius="2xl"
            className="p-12 text-center border-white/[0.08]"
          >
            <Users className="w-10 h-10 text-white/30 mx-auto mb-3" />
            <h3 className="text-base font-heading font-black text-white mb-1">
              Tidak Ada Profil Ditemukan
            </h3>
            <p className="text-xs font-mono text-white/50 max-w-md mx-auto">
              Tidak ada profil yang cocok dengan kriteria pencarian atau filter yang dipilih. Coba reset filter.
            </p>
          </GlassSurface>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredProfiles.map((p) => {
              const path = getProfilePath(p.slug);
              const isVerified = p.verificationStatus === "verified";

              return (
                <Link
                  key={p.id}
                  href={path}
                  className="group block"
                >
                  <GlassCard
                    variant="standard"
                    elevation="glass"
                    radius="2xl"
                    specular={true}
                    className="p-4 h-full flex flex-col justify-between group-hover:border-[#FF1752]/50 transition-colors"
                  >
                    <div>
                      {/* Avatar Media Container with Concentric Radius */}
                      <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-black/40 border border-white/10 mb-3">
                        {p.avatarUrl ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={p.avatarUrl}
                            alt={p.displayName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <InitialsAvatar name={p.displayName} entityType={entityType} size="full" />
                        )}

                        {/* Top Badges: Rarity & Verification */}
                        <div className="absolute top-2 left-2 z-10">
                          <GlassRarityBadge tier={(p.rarityTier as any) || "rookie"} size="sm" />
                        </div>

                        {isVerified && (
                          <div className="absolute top-2 right-2 z-10">
                            <span className="p-1 rounded-full bg-[#D4AF37] text-black shadow-sm flex items-center justify-center">
                              <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                            </span>
                          </div>
                        )}

                        {/* Bottom Gradient Scrim */}
                        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />
                      </div>

                      {/* Display Name & Identifier */}
                      <h2 className="text-sm font-heading font-black text-white group-hover:text-pink-300 transition-colors truncate">
                        {p.displayName}
                      </h2>
                      <div className="text-xs font-mono text-[#D4AF37] font-semibold truncate mt-0.5">
                        {p.ign ? `@${p.ign}` : `@${p.esportId}`}
                      </div>
                    </div>

                    {/* Meta Footer */}
                    <div className="pt-3 mt-3 border-t border-white/[0.08] flex items-center justify-between text-[10px] font-mono text-white/60">
                      <span className="truncate max-w-[130px]">{p.mainGameName || "Esport"}</span>
                      <span className="px-1.5 py-0.5 rounded bg-white/[0.08] font-bold text-white/80">
                        {p.regionCode}
                      </span>
                    </div>
                  </GlassCard>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
