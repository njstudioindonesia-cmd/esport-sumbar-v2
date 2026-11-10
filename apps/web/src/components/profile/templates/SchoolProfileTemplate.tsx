"use client";

import React from "react";
import Link from "next/link";
import {
  GraduationCap,
  Users,
  Trophy,
  ShieldCheck,
  Lock,
  Calendar,
  Gamepad2,
  ShieldAlert,
} from "lucide-react";
import type { UnifiedProfileDetail } from "@/lib/services/public-profiles";
import { SharedProfileActions, VerificationStatusBadge } from "./SharedProfileHeader";
import { InitialsAvatar } from "@/components/ui/InitialsAvatar";
import { ProfileEcosystemSection } from "@/components/profile/ProfileEcosystemSection";

export function SchoolProfileTemplate({ profile }: { profile: UnifiedProfileDetail }) {
  const { attributes, achievements = [], relations = [] } = profile;
  const schoolName = attributes.school_name || profile.displayName;
  const eduLevel = attributes.education_level || "SMA";
  const extraName = attributes.extracurricular_name || "Ekskul Esport";
  
  const registeredStudents = profile.groupedRelations?.anggota ||
    relations.filter((r) => (r.roleInRelation === "member" || r.roleInRelation === "student" || r.targetProfile?.entityType === "player") && (r.status === "active" || r.status === "approved"));
  const studentCount = typeof attributes.student_count === "number" ? attributes.student_count : registeredStudents.length;

  const advisor = attributes.advisor_name || "Guru Pembina Ekskul";

  return (
    <div className="w-full flex flex-col gap-8">
      {/* 1. HEADER SEKOLAH */}
      <div className="p-6 lg:p-8 rounded-3xl bg-gradient-to-r from-[#1E1C0F] via-[#141512] to-[#0A0C13] border border-yellow-500/20 shadow-2xl flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-yellow-500/50 shadow-xl bg-[#1A1808] shrink-0">
            {profile.avatarUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={profile.avatarUrl} alt={profile.displayName} className="w-full h-full object-cover" />
            ) : (
              <InitialsAvatar name={profile.displayName} entityType="school" size="full" />
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-300 font-mono text-xs font-bold">
                {eduLevel}
              </span>
              <span className="text-xs font-mono text-white/50">{profile.esportId}</span>
              <VerificationStatusBadge status={profile.verificationStatus} badgeNo={profile.verifiedBadgeNo} />
            </div>

            <h1 className="text-2xl font-heading font-black text-white">{extraName}</h1>
            <p className="text-sm font-semibold text-yellow-200 mt-0.5">{schoolName}</p>
            <p className="text-xs font-mono text-white/50 mt-1">Pembinaan Tingkat Pelajar Wilayah {profile.regionName}</p>
          </div>
        </div>

        <SharedProfileActions profile={profile} isOwner={profile.isOwner} />
      </div>

      {/* 2. BANNER PERLINDUNGAN DATA PELAJAR */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
        <Lock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="text-xs font-heading font-black text-amber-300 block mb-0.5">
            Kebijakan Privasi Pelajar
          </span>
          <p className="text-[11px] text-white/70 leading-relaxed">
            Sistem ESPORT SUMBAR tidak mempublikasikan daftar nama, foto wajah, maupun kontak siswa di bawah umur untuk publik. Hanya statistik binaan dan prestasi terverifikasi yang ditampilkan.
          </p>
        </div>
      </div>

      {/* 3. BARIS ANGKA BESAR SEKOLAH */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-[#12151F] border border-white/[0.06] text-center">
          <div className="text-2xl font-heading font-black text-yellow-400">{studentCount}</div>
          <div className="text-[10px] font-mono text-white/40 uppercase mt-0.5">Siswa Terdaftar (Angka)</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#12151F] border border-white/[0.06] text-center">
          <div className="text-2xl font-heading font-black text-white">{eduLevel}</div>
          <div className="text-[10px] font-mono text-white/40 uppercase mt-0.5">Jenjang Pendidikan</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#12151F] border border-white/[0.06] text-center">
          <div className="text-2xl font-heading font-black text-[#D4AF37]">{achievements.length}</div>
          <div className="text-[10px] font-mono text-white/40 uppercase mt-0.5">Gelar Juara Pelajar</div>
        </div>
      </div>

      {/* 4. TENTANG PEMBINAAN SEKOLAH */}
      <div className="p-6 rounded-2xl bg-[#12151F] border border-white/[0.06] flex flex-col gap-4 text-xs text-white/70">
        <div>
          <span className="font-semibold text-white block mb-1">Pembina Ekskul:</span>
          <span className="text-sm font-bold text-white">{advisor}</span>
        </div>

        <div>
          <span className="font-semibold text-white block mb-1">Visi Pembinaan:</span>
          <p className="leading-relaxed">
            Menyalurkan minat dan bakat esport pelajar {schoolName} ke arah positif, berprestasi, berdisiplin tinggi, serta seimbang dengan capaian akademik.
          </p>
        </div>
      </div>

      {/* 5. EKOSISTEM EKSKUL PELAJAR */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-mono uppercase text-white/60 tracking-wider">
          Ekosistem Ekskul Pelajar ({Object.values(profile.groupedRelations || {}).flat().length || profile.relations?.length || 0})
        </h3>
        <ProfileEcosystemSection profile={profile} isOwner={profile.isOwner} />
      </div>
    </div>
  );
}
