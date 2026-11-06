"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Users,
  Trophy,
  Calendar,
  Gamepad2,
  ShieldCheck,
  Building,
  Lock,
} from "lucide-react";
import type { UnifiedProfileDetail } from "@/lib/services/public-profiles";
import { SharedProfileActions, VerificationStatusBadge } from "./SharedProfileHeader";
import { InitialsAvatar } from "@/components/ui/InitialsAvatar";

export function CampusProfileTemplate({ profile }: { profile: UnifiedProfileDetail }) {
  const [activeTab, setActiveTab] = useState<"about" | "achievements">("about");

  const { attributes, achievements = [] } = profile;
  const campusName = attributes.campus_name || profile.displayName;
  const ukmName = attributes.ukm_name || "UKM Esport";
  const memberCount = attributes.member_count || 30;
  const advisor = attributes.advisor_name || "Dosen Pembina UKM";

  return (
    <div className="w-full flex flex-col gap-8">
      {/* 1. HEADER KAMPUS */}
      <div className="p-6 lg:p-8 rounded-3xl bg-gradient-to-r from-[#0C1724] via-[#0E1520] to-[#0A0C13] border border-cyan-500/20 shadow-2xl flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-cyan-500/50 shadow-xl bg-[#081720] shrink-0">
            {profile.avatarUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={profile.avatarUrl} alt={profile.displayName} className="w-full h-full object-cover" />
            ) : (
              <InitialsAvatar name={profile.displayName} entityType="campus" size="full" />
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
              <span className="text-xs font-mono text-white/50">{profile.esportId}</span>
              <VerificationStatusBadge status={profile.verificationStatus} badgeNo={profile.verifiedBadgeNo} />
            </div>

            <h1 className="text-2xl font-heading font-black text-white">{ukmName}</h1>
            <p className="text-sm font-semibold text-cyan-300 mt-0.5">{campusName}</p>
            <p className="text-xs font-mono text-white/50 mt-1">Afiliasi Komunitas Esport {profile.regionName}</p>
          </div>
        </div>

        <SharedProfileActions profile={profile} isOwner={profile.isOwner} />
      </div>

      {/* 2. BARIS ANGKA BESAR KAMPUS */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-[#12151F] border border-white/[0.06] text-center">
          <div className="text-2xl font-heading font-black text-cyan-400">{memberCount}</div>
          <div className="text-[10px] font-mono text-white/40 uppercase mt-0.5">Mahasiswa Terdaftar</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#12151F] border border-white/[0.06] text-center">
          <div className="text-2xl font-heading font-black text-white">1</div>
          <div className="text-[10px] font-mono text-white/40 uppercase mt-0.5">Divisi Kampus</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#12151F] border border-white/[0.06] text-center">
          <div className="text-2xl font-heading font-black text-[#D4AF37]">{achievements.length}</div>
          <div className="text-[10px] font-mono text-white/40 uppercase mt-0.5">Prestasi Liga Mahasiswa</div>
        </div>
      </div>

      {/* 3. TENTANG & STRUKTUR PENGURUS */}
      <div className="p-6 rounded-2xl bg-[#12151F] border border-white/[0.06] flex flex-col gap-4 text-xs text-white/70">
        <div>
          <span className="font-semibold text-white block mb-1">Pembinaan UKM:</span>
          <p className="leading-relaxed">
            Wadah resmi pengembangan bakat atlet esport mahasiswa {campusName} di bawah bimbingan kemahasiswaan dan ESPORT SUMBAR.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <span className="text-[10px] font-mono text-white/40 block">Dosen Pembina</span>
            <span className="font-bold text-white">{advisor}</span>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <span className="text-[10px] font-mono text-white/40 block">Status Perlindungan Data</span>
            <span className="font-bold text-cyan-300 flex items-center gap-1">
              <Lock className="w-3 h-3" /> Privasi Mahasiswa Terjaga
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
