"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  ShieldCheck,
  Shield,
  Trophy,
  Calendar,
  MapPin,
  Gamepad2,
  UserPlus,
  Sparkles,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import type { UnifiedProfileDetail } from "@/lib/services/public-profiles";
import { SharedProfileActions, VerificationStatusBadge } from "./SharedProfileHeader";
import { InitialsAvatar } from "@/components/ui/InitialsAvatar";

export function TeamProfileTemplate({ profile }: { profile: UnifiedProfileDetail }) {
  const [activeTab, setActiveTab] = useState<"roster" | "achievements" | "about">("roster");
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [joinSuccess, setJoinSuccess] = useState(false);

  const { attributes, achievements = [], relations = [] } = profile;
  const isRecruiting = attributes.is_recruiting ?? false;
  const teamTag = attributes.team_tag || "TM";
  const foundedYear = attributes.founded_year || 2023;
  const homebase = attributes.homebase || profile.regionName;

  // Anggota roster aktif (hanya yang disetujui)
  const rosterMembers = relations.filter((r) => r.status === "approved");
  const rosterCount = rosterMembers.length;
  const maxQuota = 7;

  return (
    <div className="w-full flex flex-col gap-8">
      {/* 1. HEADER TIM: LOGO BESAR + TAG + DIVISI + REKRUTMEN */}
      <div className="p-6 lg:p-8 rounded-3xl bg-gradient-to-r from-[#17130F] via-[#10131B] to-[#0A0C13] border border-amber-500/20 shadow-2xl flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          {/* Logo Persegi Tim 1:1 */}
          <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-xl bg-[#0F1118] shrink-0">
            {profile.avatarUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={profile.avatarUrl} alt={profile.displayName} className="w-full h-full object-cover" />
            ) : (
              <InitialsAvatar name={profile.displayName} entityType="team" size="full" />
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-xs font-bold">
                [{teamTag}]
              </span>
              <span className="text-xs font-mono text-white/50">{profile.esportId}</span>
              <VerificationStatusBadge status={profile.verificationStatus} badgeNo={profile.verifiedBadgeNo} />
            </div>

            <h1 className="text-2xl font-heading font-black text-white tracking-wide">
              {profile.displayName}
            </h1>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2 text-xs font-mono text-white/60">
              <span className="text-[#4C7DFF] font-semibold">{attributes.game_division || profile.mainGameName}</span>
              <span>•</span>
              <span>Homebase: {homebase}</span>
              <span>•</span>
              <span>Est. {foundedYear}</span>
            </div>
          </div>
        </div>

        {/* Tindakan Tim & Status Rekrutmen */}
        <div className="flex flex-col sm:flex-row md:flex-col items-center md:items-end gap-3 shrink-0">
          <SharedProfileActions profile={profile} isOwner={profile.isOwner} />

          {/* Penanda Status Rekrutmen */}
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold border ${
                isRecruiting
                  ? "bg-amber-500/15 border-amber-500/40 text-amber-300"
                  : "bg-white/[0.04] border-white/10 text-white/40"
              }`}
            >
              {isRecruiting ? "REKRUTMEN TERBUKA" : "ROSTER TERKUNCI"}
            </span>

            {isRecruiting && (
              <button
                type="button"
                onClick={() => setJoinModalOpen(true)}
                className="px-3.5 py-1 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#07080C] text-[11px] font-heading font-bold shadow-md transition-all"
              >
                Ajukan Gabung
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. NAVIGASI TAB: Roster | Prestasi | Tentang */}
      <div className="flex items-center gap-2 border-b border-white/[0.08]">
        {[
          { id: "roster", label: `Roster Aktif (${rosterCount}/${maxQuota})` },
          { id: "achievements", label: `Prestasi (${achievements.length})` },
          { id: "about", label: "Tentang Tim" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 text-xs font-heading font-black tracking-wider uppercase transition-all relative ${
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

      {/* 3. ISI TAB ROSTER TIM */}
      {activeTab === "roster" && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {rosterMembers.length > 0 ? (
              rosterMembers.map((member) => (
                <Link
                  key={member.id}
                  href={`/player/${member.targetProfile.slug}`}
                  className="p-3.5 rounded-2xl bg-[#12151F] border border-white/[0.06] hover:border-[#D4AF37]/50 flex items-center gap-3.5 transition-all group"
                >
                  <div className="w-12 h-14 rounded-xl overflow-hidden bg-black/40 border border-white/10 shrink-0">
                    {member.targetProfile.avatarUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={member.targetProfile.avatarUrl}
                        alt={member.targetProfile.displayName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <InitialsAvatar
                        name={member.targetProfile.displayName}
                        entityType="player"
                        size="full"
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-heading font-bold text-white truncate group-hover:text-[#D4AF37] transition-colors">
                      {member.targetProfile.displayName}
                    </div>
                    <div className="text-[10px] font-mono text-white/50 truncate">
                      {member.targetProfile.ign ? `@${member.targetProfile.ign}` : member.roleInRelation}
                    </div>
                    <span className="inline-block mt-1 px-1.5 py-0.2 rounded bg-white/[0.04] text-[9px] font-mono text-amber-300">
                      {member.roleInRelation}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full py-10 text-center text-xs text-white/40 bg-white/[0.02] rounded-2xl border border-white/[0.04]">
                Roster resmi belum ditautkan. Hubungi manajer tim untuk pendaftaran roster.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. ISI TAB PRESTASI */}
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
            <div className="py-8 text-center text-xs text-white/40 bg-white/[0.02] rounded-2xl border border-white/[0.04]">
              Belum ada gelar juara yang terverifikasi.
            </div>
          )}
        </div>
      )}

      {/* 5. ISI TAB TENTANG */}
      {activeTab === "about" && (
        <div className="p-6 rounded-2xl bg-[#12151F] border border-white/[0.06] flex flex-col gap-4 text-xs text-white/70">
          <div>
            <span className="font-semibold text-white block mb-1">Profil Tim:</span>
            <p className="leading-relaxed">
              {profile.bio || "Organisasi esport kompetitif resmi Sumatera Barat yang berkomitmen membina talenta atlet daerah."}
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div>
              <span className="text-[10px] font-mono text-white/40 block">Wilayah Wilayah</span>
              <span className="font-bold text-white">{profile.regionName}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-white/40 block">Tahun Berdiri</span>
              <span className="font-bold text-white">{foundedYear}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-white/40 block">Status Keanggotaan</span>
              <span className="font-bold text-emerald-400">Aktif ESPORT SUMBAR</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-white/40 block">Divisi Game</span>
              <span className="font-bold text-[#D4AF37]">{attributes.game_division || profile.mainGameName}</span>
            </div>
          </div>
        </div>
      )}

      {/* MODAL AJUKAN GABUNG TIM */}
      {joinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-sm bg-[#0E121B] border border-white/15 rounded-3xl p-6 text-center shadow-2xl">
            <h3 className="text-base font-heading font-black text-white mb-2">
              Ajukan Bergabung ke {profile.displayName}
            </h3>
            <p className="text-xs text-white/60 mb-5">
              Permintaan bergabung akan dikirim langsung ke Manajer Tim beserta profil paspor esport Anda.
            </p>

            {joinSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400">
                Permintaan bergabung berhasil diajukan!
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setJoinModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-white/60"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setJoinSuccess(true);
                    setTimeout(() => {
                      setJoinModalOpen(false);
                      setJoinSuccess(false);
                    }, 1800);
                  }}
                  className="px-5 py-2 rounded-xl bg-[#D4AF37] text-[#07080C] text-xs font-heading font-bold"
                >
                  Kirim Pengajuan
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
