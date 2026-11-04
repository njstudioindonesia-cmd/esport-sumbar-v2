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
  Lock,
  Building,
  GraduationCap,
  ExternalLink,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
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

  const filteredProfiles = useMemo(() => {
    return initialProfiles.filter((p) => {
      const matchSearch =
        p.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.ign && p.ign.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.esportId && p.esportId.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchRegion = selectedRegion === "all" || p.regionCode === selectedRegion || p.regionId === selectedRegion;
      const matchGame = selectedGame === "all" || p.mainGameId === selectedGame || p.mainGameShort === selectedGame;

      return matchSearch && matchRegion && matchGame;
    });
  }, [initialProfiles, searchQuery, selectedRegion, selectedGame]);

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

  return (
    <div className="min-h-screen bg-[#07080C] text-[#F3F4F6] flex flex-col font-sans selection:bg-[#D4AF37]/20 selection:text-[#D4AF37]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* HEADER DIREKTORI */}
        <div className="flex flex-col gap-2 mb-8">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-heading font-black uppercase tracking-wider">
              DIREKTORI RESMI PBESI SUMBAR
            </span>
            <span className="text-xs font-mono text-white/40">
              {filteredProfiles.length} Terdaftar
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-heading font-black uppercase text-white tracking-tight">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-white/50 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* SEARCH & FILTERS BAR */}
        <div className="p-4 rounded-2xl bg-[#0D1017] border border-white/[0.08] mb-8 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-xl">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, IGN, atau ESPORT ID..."
              className="w-full bg-[#161A24] border border-white/10 focus:border-[#D4AF37] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-white/30 outline-none transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-[#D4AF37] shrink-0" />
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full sm:w-48 bg-[#161A24] border border-white/10 text-xs text-white rounded-xl px-3 py-2.5 outline-none focus:border-[#D4AF37]"
            >
              <option value="all">Semua Wilayah</option>
              {REGIONS_DETAIL.map((r) => (
                <option key={r.code} value={r.code}>
                  {r.name} ({r.code})
                </option>
              ))}
            </select>

            <select
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
              className="w-full sm:w-44 bg-[#161A24] border border-white/10 text-xs text-white rounded-xl px-3 py-2.5 outline-none focus:border-[#D4AF37]"
            >
              <option value="all">Semua Game</option>
              {OFFICIAL_GAMES.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.shortName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* PROFILES GRID */}
        {filteredProfiles.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#0D1017] border border-white/[0.06]">
            <Users className="w-10 h-10 text-white/30 mx-auto mb-2" />
            <p className="text-sm font-heading text-white/70">Tidak ada profil yang cocok dengan kriteria pencarian.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredProfiles.map((p) => {
              const path = getProfilePath(p.slug);

              // 1. KARTU ATLET (PLAYER)
              if (entityType === "player") {
                return (
                  <Link
                    key={p.id}
                    href={path}
                    className="p-4 rounded-2xl bg-[#0D1017] border border-white/[0.08] hover:border-[#D4AF37]/50 transition-all flex flex-col justify-between group shadow-lg"
                  >
                    <div>
                      <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-black/40 border border-white/10 mb-3">
                        {p.avatarUrl ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={p.avatarUrl} alt={p.displayName} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        ) : (
                          <InitialsAvatar name={p.displayName} entityType="player" size="full" />
                        )}
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[8px] font-mono font-bold text-amber-300 uppercase">
                          {p.rarityTier}
                        </span>
                        {p.verificationStatus === "verified" && (
                          <span className="absolute top-2 right-2 p-1 rounded-full bg-[#D4AF37] text-black">
                            <ShieldCheck className="w-3 h-3 stroke-[3]" />
                          </span>
                        )}
                      </div>

                      <h2 className="text-sm font-heading font-black text-white group-hover:text-[#D4AF37] transition-colors truncate">
                        {p.displayName}
                      </h2>
                      <div className="text-xs font-mono text-[#D4AF37] font-semibold truncate">
                        {p.ign ? `@${p.ign}` : `@${p.esportId}`}
                      </div>
                    </div>

                    <div className="pt-3 mt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-white/60">
                      <span className="truncate max-w-[120px]">{p.mainGameName}</span>
                      <span className="px-1.5 py-0.5 rounded bg-white/[0.06] font-bold text-[#D4AF37]">{p.regionCode}</span>
                    </div>
                  </Link>
                );
              }

              // 2. KARTU TIM (TEAM)
              if (entityType === "team") {
                return (
                  <Link
                    key={p.id}
                    href={path}
                    className="p-4 rounded-2xl bg-[#0D1017] border border-white/[0.08] hover:border-amber-500/50 transition-all flex flex-col justify-between group shadow-lg"
                  >
                    <div>
                      <div className="w-full aspect-square rounded-xl overflow-hidden bg-black/40 border border-white/10 mb-3 p-4 flex items-center justify-center">
                        {p.avatarUrl ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={p.avatarUrl} alt={p.displayName} className="w-full h-full object-contain group-hover:scale-105 transition-transform" />
                        ) : (
                          <InitialsAvatar name={p.displayName} entityType="team" size="full" />
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono text-[9px] font-bold">
                          [{p.attributes.team_tag || "TM"}]
                        </span>
                        <span className="text-[10px] font-mono text-white/40">{p.regionCode}</span>
                      </div>

                      <h2 className="text-sm font-heading font-black text-white group-hover:text-amber-400 transition-colors truncate">
                        {p.displayName}
                      </h2>
                      <p className="text-[11px] font-mono text-white/60 truncate mt-0.5">
                        {p.attributes.game_division || p.mainGameName}
                      </p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-white/60">
                      <span>Roster: {p.relations?.length || 5}/7</span>
                      <span className="text-amber-400 font-bold">Lihat Roster →</span>
                    </div>
                  </Link>
                );
              }

              // 3. KARTU VENUE
              if (entityType === "venue") {
                return (
                  <Link
                    key={p.id}
                    href={path}
                    className="p-4 rounded-2xl bg-[#0D1017] border border-white/[0.08] hover:border-fuchsia-500/50 transition-all flex flex-col justify-between group shadow-lg"
                  >
                    <div>
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-black/40 border border-white/10 mb-3">
                        {p.coverUrl ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={p.coverUrl} alt={p.displayName} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        ) : (
                          <InitialsAvatar name={p.displayName} entityType="venue" size="full" />
                        )}
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[9px] font-mono text-fuchsia-300">
                          {p.attributes.capacity_units || 20} Unit Gaming
                        </span>
                      </div>

                      <h2 className="text-sm font-heading font-black text-white group-hover:text-fuchsia-400 transition-colors truncate">
                        {p.displayName}
                      </h2>
                      <p className="text-[11px] font-mono text-white/60 truncate mt-0.5">
                        {p.attributes.business_address || p.regionName}
                      </p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-white/60">
                      <span className="text-emerald-400 font-bold">Buka Hari Ini</span>
                      <span className="text-white/40">{p.regionCode}</span>
                    </div>
                  </Link>
                );
              }

              // 4. KARTU DEFAULT (Pelatih, Komunitas, Kampus, Sekolah)
              return (
                <Link
                  key={p.id}
                  href={path}
                  className="p-4 rounded-2xl bg-[#0D1017] border border-white/[0.08] hover:border-[#D4AF37]/50 transition-all flex flex-col justify-between group shadow-lg"
                >
                  <div>
                    <div className="w-full aspect-square rounded-xl overflow-hidden bg-black/40 border border-white/10 mb-3 p-3 flex items-center justify-center">
                      {p.avatarUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={p.avatarUrl} alt={p.displayName} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      ) : (
                        <InitialsAvatar name={p.displayName} entityType={p.entityType} size="full" />
                      )}
                    </div>

                    <div className="text-[10px] font-mono text-white/40 mb-1">{p.esportId}</div>
                    <h2 className="text-sm font-heading font-black text-white group-hover:text-[#D4AF37] transition-colors truncate">
                      {p.displayName}
                    </h2>
                    <p className="text-[11px] text-white/60 truncate mt-0.5">
                      {p.regionName}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-white/60">
                    <span>{p.mainGameName}</span>
                    <span className="text-[#D4AF37]">Detail →</span>
                  </div>
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
