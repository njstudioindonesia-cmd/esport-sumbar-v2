"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Shield,
  ShieldCheck,
  Trophy,
  Award,
  Users,
  MapPin,
  Calendar,
  Gamepad2,
  CheckCircle2,
  Briefcase,
  Quote,
} from "lucide-react";
import type { UnifiedProfileDetail } from "@/lib/services/public-profiles";
import { SharedProfileActions, VerificationStatusBadge } from "./SharedProfileHeader";
import { InitialsAvatar } from "@/components/ui/InitialsAvatar";

export function CoachProfileTemplate({ profile }: { profile: UnifiedProfileDetail }) {
  const [activeTab, setActiveTab] = useState<"summary" | "teams" | "achievements">("summary");

  const { attributes, achievements = [] } = profile;
  const experienceYears = attributes.experience_years || 1;
  const isAvailable = attributes.is_active_coaching ?? true;
  const philosophy = attributes.coaching_philosophy;

  return (
    <div className="w-full flex flex-col gap-8">
      {/* 1. HERO SECTION: KARTU PELATIH + STATISTIK OTORITAS */}
      <div className="grid grid-cols-12 gap-6 lg:gap-10 items-start">
        {/* Kolom Kartu TCG Pelatih (5/12) */}
        <div className="col-span-12 lg:col-span-5 flex flex-col items-center">
          <div className="relative w-full max-w-[320px] rounded-[24px] bg-gradient-to-b from-[#241A2F] via-[#161020] to-[#0A0C13] border-2 border-purple-500/40 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_25px_rgba(168,85,247,0.2)] p-4 flex flex-col justify-between overflow-hidden">
            <div className="w-full flex items-center justify-between z-10 mb-3">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/50 text-[9px] font-mono font-bold text-purple-300 uppercase">
                PELATIH • {profile.rarityTier.toUpperCase()}
              </span>
              <VerificationStatusBadge status={profile.verificationStatus} badgeNo={profile.verifiedBadgeNo} />
            </div>

            {/* Foto Profil Pelatih 4:5 */}
            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-[#0F1118] my-2">
              {profile.avatarUrl ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={profile.avatarUrl} alt={profile.displayName} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </>
              ) : (
                <InitialsAvatar name={profile.displayName} entityType="coach" size="full" />
              )}
            </div>

            {/* Nama & Gelar Pelatih */}
            <div className="text-center mt-2">
              <h1 className="text-lg font-heading font-black text-white tracking-wide truncate">
                {profile.displayName}
              </h1>
              <div className="text-xs font-mono font-bold text-purple-300">
                HEAD COACH • {profile.regionName}
              </div>
            </div>

            <div className="w-full pt-3 mt-3 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono text-white/70">
              <span className="text-purple-300 font-semibold truncate max-w-[150px]">
                {profile.mainGameName}
              </span>
              <span className="px-2 py-0.5 rounded bg-white/[0.06] text-[#D4AF37] font-bold">
                {profile.regionCode}
              </span>
            </div>
          </div>
        </div>

        {/* Kolom Detail Kanan (7/12) */}
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-white/50">{profile.esportId}</span>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold border ${
                  isAvailable
                    ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
                    : "bg-white/[0.05] border-white/10 text-white/40"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? "bg-emerald-400 animate-pulse" : "bg-white/40"}`} />
                {isAvailable ? "TERSEDIA UNTUK MELATIH" : "TIDAK AKTIF MELATIH"}
              </span>
            </div>
            <SharedProfileActions profile={profile} isOwner={profile.isOwner} />
          </div>

          {/* Filosofi Melatih 1 Baris */}
          {philosophy && (
            <div className="p-4 rounded-2xl bg-[#171221] border border-purple-500/20 flex items-start gap-3">
              <Quote className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
              <p className="text-xs text-purple-100/90 leading-relaxed italic">
                &ldquo;{philosophy}&rdquo;
              </p>
            </div>
          )}

          {/* BARIS ANGKA BESAR OTORITAS */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-[#12151F] border border-white/[0.06] text-center">
              <div className="text-2xl font-heading font-black text-white">{experienceYears}</div>
              <div className="text-[10px] font-mono text-white/40 uppercase mt-0.5">Tahun Melatih</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#12151F] border border-white/[0.06] text-center">
              <div className="text-2xl font-heading font-black text-purple-300">
                {profile.relations?.length || 1}
              </div>
              <div className="text-[10px] font-mono text-white/40 uppercase mt-0.5">Tim Dibina</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#12151F] border border-white/[0.06] text-center">
              <div className="text-2xl font-heading font-black text-[#D4AF37]">
                {achievements.length}
              </div>
              <div className="text-[10px] font-mono text-white/40 uppercase mt-0.5">Gelar Juara</div>
            </div>
          </div>

          {/* SEKSI SPESIALISASI GAME */}
          <div>
            <span className="text-[11px] font-mono uppercase text-white/50 block mb-2">Spesialisasi Game</span>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-xl bg-purple-500/15 border border-purple-500/30 text-xs font-bold text-purple-200">
                {profile.mainGameName}
              </span>
              {attributes.game_specialization &&
                Array.isArray(attributes.game_specialization) &&
                attributes.game_specialization.map((g: string, idx: number) => (
                  <span key={idx} className="px-3 py-1 rounded-xl bg-white/[0.05] border border-white/10 text-xs text-white/70">
                    {g}
                  </span>
                ))}
            </div>
          </div>

          {/* NAVIGASI TAB */}
          <div className="flex items-center gap-2 border-b border-white/[0.08] pt-2">
            {[
              { id: "summary", label: "Ringkasan" },
              { id: "teams", label: "Tim yang Dilatih" },
              { id: "achievements", label: `Prestasi (${achievements.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 text-xs font-heading font-black tracking-wider uppercase transition-all relative ${
                  activeTab === tab.id ? "text-purple-300" : "text-white/50 hover:text-white"
                }`}
              >
                <span>{tab.label}</span>
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 inset-x-0 h-0.5 bg-purple-400" />
                )}
              </button>
            ))}
          </div>

          {/* ISI TAB */}
          <div className="min-h-[160px]">
            {activeTab === "summary" && (
              <div className="p-4 rounded-2xl bg-[#12151F] border border-white/[0.06] text-xs text-white/70">
                <span className="font-semibold text-white block mb-1">Kredensial Resmi:</span>
                <p>
                  Pelatih berlisensi dan terafiliasi dengan Wilayah ESPORT SUMBAR {profile.regionName}. Terdaftar aktif dalam pembinaan atlet esport daerah.
                </p>
              </div>
            )}

            {activeTab === "teams" && (
              <div className="py-6 text-center text-xs text-white/40 bg-white/[0.02] rounded-2xl border border-white/[0.04]">
                Sedang mengasuh tim divisi {profile.mainGameName}.
              </div>
            )}

            {activeTab === "achievements" && (
              <div className="flex flex-col gap-2.5">
                {achievements.length > 0 ? (
                  achievements.map((ach) => (
                    <div key={ach.id} className="p-3.5 rounded-xl bg-[#12151F] border border-white/[0.06] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Trophy className="w-4 h-4 text-[#D4AF37] shrink-0" />
                        <div>
                          <div className="text-xs font-bold text-white">{ach.title}</div>
                          <div className="text-[10px] font-mono text-white/40">{ach.eventName} • {ach.year}</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/[0.06] text-white/60">
                        {ach.level}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-xs text-white/40 bg-white/[0.02] rounded-2xl border border-white/[0.04]">
                    Belum ada prestasi terverifikasi.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
