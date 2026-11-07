"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Gamepad2,
  Trophy,
  Users,
  MapPin,
  Calendar,
  Sparkles,
  ExternalLink,
  Shield,
  ShieldCheck,
  Globe,
  Play,
  Radio,
  CheckCircle2,
} from "lucide-react";
import type { UnifiedProfileDetail } from "@/lib/services/public-profiles";
import { SharedProfileActions, VerificationStatusBadge } from "./SharedProfileHeader";
import { InitialsAvatar } from "@/components/ui/InitialsAvatar";
import { ProfileEcosystemSection } from "@/components/profile/ProfileEcosystemSection";
import { GlassSurface } from "@/components/glass/GlassSurface";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassBadge, GlassStatusBadge, GlassRarityBadge } from "@/components/glass/GlassBadge";

export function PlayerProfileTemplate({ profile }: { profile: UnifiedProfileDetail }) {
  const [activeTab, setActiveTab] = useState<"summary" | "ecosystem" | "achievements" | "history">("summary");

  const { attributes, achievements = [] } = profile;
  const isLookingForTeam = attributes.is_looking_for_team ?? false;
  const social = attributes.social_media || {};

  return (
    <div className="w-full flex flex-col gap-8">
      {/* 1. HERO SECTION: KARTU TCG BESAR + IDENTITAS PERSONAL */}
      <div className="grid grid-cols-12 gap-6 lg:gap-10 items-start">
        {/* Kolom Kartu TCG Kiri (5/12) */}
        <div className="col-span-12 lg:col-span-5 flex flex-col items-center">
          <GlassSurface
            variant="elevated"
            elevation="overlay"
            radius="3xl"
            specular={true}
            className="relative w-full max-w-[340px] p-5 flex flex-col justify-between border-white/20 shadow-2xl"
          >
            {/* Top Bar Kartu: Rarity & Verification */}
            <div className="w-full flex items-center justify-between z-10 mb-3">
              <GlassRarityBadge tier={(profile.rarityTier as any) || "rookie"} size="sm" />
              <VerificationStatusBadge status={profile.verificationStatus} badgeNo={profile.verifiedBadgeNo} />
            </div>

            {/* Avatar Foto Paspor Atlet 4:5 */}
            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-black/40 my-2">
              {profile.avatarUrl ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={profile.avatarUrl}
                    alt={profile.displayName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                </>
              ) : (
                <InitialsAvatar name={profile.displayName} entityType="player" size="full" />
              )}

              {/* Marawa Micro Bar */}
              <div className="absolute bottom-2.5 right-2.5 flex h-3.5 w-1.5 rounded-sm overflow-hidden opacity-90 shadow-sm">
                <span className="h-1/3 w-full bg-[#C8102E]" />
                <span className="h-1/3 w-full bg-[#D4AF37]" />
                <span className="h-1/3 w-full bg-black" />
              </div>
            </div>

            {/* Nama Atlet & IGN */}
            <div className="text-center mt-2.5">
              <h1 className="text-xl font-heading font-black text-white tracking-wide truncate">
                {profile.displayName}
              </h1>
              <div className="text-xs font-mono font-bold text-[#D4AF37] mt-0.5">
                {profile.ign ? `@${profile.ign}` : `@${profile.esportId}`}
              </div>
            </div>

            {/* Bottom Card Strip */}
            <div className="w-full pt-3 mt-3 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono text-white/70">
              <span className="text-[#FF4D77] font-semibold truncate max-w-[150px]">
                {profile.mainGameName} • {profile.roleName || attributes.role || "Player"}
              </span>
              <span className="px-2 py-0.5 rounded bg-white/[0.08] text-white/90 font-bold">
                {profile.regionCode}
              </span>
            </div>
          </GlassSurface>
        </div>

        {/* Kolom Informasi & Bento 4 Kotak Kanan (7/12) */}
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">
          {/* Header Baris Tindakan */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-white/50">{profile.esportId}</span>
              {isLookingForTeam && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  MENCARI TIM (LFT)
                </span>
              )}
            </div>
            <SharedProfileActions profile={profile} isOwner={profile.isOwner} />
          </div>

          {/* Bio Singkat */}
          {profile.bio && (
            <p className="text-sm text-white/80 leading-relaxed italic border-l-2 border-[#FF1752] pl-3">
              &ldquo;{profile.bio}&rdquo;
            </p>
          )}

          {/* BENTO 4 KOTAK SPESIFIKASI ATLET */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <GlassCard variant="standard" elevation="glass" radius="xl" className="p-3.5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-white/40 mb-2">
                <span className="text-[10px] font-mono uppercase">Game</span>
                <Gamepad2 className="w-3.5 h-3.5 text-[#D4AF37]" />
              </div>
              <div className="text-xs font-bold text-white truncate">{profile.mainGameName}</div>
            </GlassCard>

            <GlassCard variant="standard" elevation="glass" radius="xl" className="p-3.5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-white/40 mb-2">
                <span className="text-[10px] font-mono uppercase">Role</span>
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <div className="text-xs font-bold text-white truncate">
                {profile.roleName || attributes.role || "Flex"}
              </div>
            </GlassCard>

            <GlassCard variant="standard" elevation="glass" radius="xl" className="p-3.5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-white/40 mb-2">
                <span className="text-[10px] font-mono uppercase">Tim</span>
                <Users className="w-3.5 h-3.5 text-pink-400" />
              </div>
              <div className="text-xs font-bold text-white truncate">
                {attributes.team_name || "Free Agent"}
              </div>
            </GlassCard>

            <GlassCard variant="standard" elevation="glass" radius="xl" className="p-3.5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-white/40 mb-2">
                <span className="text-[10px] font-mono uppercase">Wilayah</span>
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-xs font-bold text-white truncate">{profile.regionName}</div>
            </GlassCard>
          </div>

          {/* Media Sosial Publik */}
          {social && (social.instagram || social.youtube || social.tiktok) && (
            <div className="flex items-center gap-3 pt-1">
              <span className="text-[11px] font-mono text-white/40">Media Sosial:</span>
              {social.instagram && (
                <span className="inline-flex items-center gap-1 text-xs text-white/80 font-mono">
                  <Globe className="w-3.5 h-3.5 text-pink-400" />
                  <span>{social.instagram}</span>
                </span>
              )}
              {social.youtube && (
                <span className="inline-flex items-center gap-1 text-xs text-white/80 font-mono">
                  <Play className="w-3.5 h-3.5 text-red-400" />
                  <span>{social.youtube}</span>
                </span>
              )}
            </div>
          )}

          {/* NAVIGASI TAB: Ringkasan | Ekosistem | Prestasi | Riwayat Tim */}
          <div className="flex items-center gap-2 border-b border-white/[0.08] pt-2 overflow-x-auto">
            {[
              { id: "summary", label: "Ringkasan" },
              {
                id: "ecosystem",
                label: `Ekosistem (${Object.values(profile.groupedRelations || {}).flat().length || profile.relations?.length || 0})`,
              },
              { id: "achievements", label: `Prestasi (${achievements.length})` },
              { id: "history", label: "Riwayat Tim" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 text-xs font-heading font-black tracking-wider uppercase transition-all relative shrink-0 ${
                  activeTab === tab.id ? "text-[#D4AF37]" : "text-white/50 hover:text-white"
                }`}
              >
                <span>{tab.label}</span>
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#D4AF37]" />
                )}
              </button>
            ))}
          </div>

          {/* ISI TAB */}
          <div className="min-h-[180px]">
            {activeTab === "summary" && (
              <div className="flex flex-col gap-3">
                <GlassCard variant="standard" elevation="glass" radius="2xl" className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] font-mono text-white/40 block">Rank Tertinggi</span>
                    <span className="font-semibold text-white">{attributes.rank || "-"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-white/40 block">Tahun Mulai</span>
                    <span className="font-semibold text-white">{attributes.year_started || "-"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-white/40 block">Kelengkapan Paspor</span>
                    <span className="font-semibold text-[#D4AF37]">{profile.completenessScore}%</span>
                  </div>
                </GlassCard>
              </div>
            )}

            {activeTab === "ecosystem" && (
              <ProfileEcosystemSection profile={profile} isOwner={profile.isOwner} />
            )}

            {activeTab === "achievements" && (
              <div className="flex flex-col gap-2.5">
                {achievements.length > 0 ? (
                  achievements.map((ach) => (
                    <GlassCard
                      key={ach.id}
                      variant="standard"
                      elevation="glass"
                      radius="xl"
                      className="p-3.5 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <Trophy className="w-4 h-4 text-[#D4AF37] shrink-0" />
                        <div>
                          <div className="text-xs font-bold text-white">{ach.title}</div>
                          <div className="text-[10px] font-mono text-white/40">
                            {ach.eventName} • {ach.year}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/[0.06] text-white/70">
                        {ach.level}
                      </span>
                    </GlassCard>
                  ))
                ) : (
                  <GlassSurface variant="subtle" radius="xl" className="py-8 text-center text-xs text-white/40 border-white/[0.04]">
                    Belum ada prestasi terverifikasi.
                  </GlassSurface>
                )}
              </div>
            )}

            {activeTab === "history" && (
              <GlassSurface variant="subtle" radius="xl" className="py-8 text-center text-xs text-white/50 border-white/[0.04]">
                {attributes.team_name ? (
                  <span>Sedang aktif membela <strong>{attributes.team_name}</strong>.</span>
                ) : (
                  <span>Status agen bebas (Free Agent). Belum ada riwayat tim tercatat.</span>
                )}
              </GlassSurface>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
