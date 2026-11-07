"use client";

import React from "react";
import Link from "next/link";
import {
  Users,
  Gamepad2,
  Building2,
  GraduationCap,
  Flame,
  Award,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  Lock,
  Sparkles,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import type { UnifiedProfileDetail } from "@/lib/services/public-profiles";
import type { ActiveRelationItem } from "@/lib/services/relations";
import type { EntityType } from "@/lib/supabase/database.types";
import { InitialsAvatar } from "@/components/ui/InitialsAvatar";

interface ProfileEcosystemSectionProps {
  profile: UnifiedProfileDetail;
  isOwner?: boolean;
}

export function ProfileEcosystemSection({
  profile,
  isOwner = false,
}: ProfileEcosystemSectionProps) {
  const grouped = profile.groupedRelations || {};

  // Flatten all active relations if groupedRelations is available
  const allActive: ActiveRelationItem[] = Object.values(grouped).flat();

  // Helper to extract relations by otherProfile.entityType and/or relationType
  const filterRelations = (targetEntityType?: EntityType, relationType?: string) => {
    return allActive.filter((item) => {
      const matchEntity = !targetEntityType || item.otherProfile.entityType === targetEntityType;
      const matchType = !relationType || item.relationType === relationType;
      return matchEntity && matchType;
    });
  };

  const getProfileUrl = (other: ActiveRelationItem["otherProfile"]) => {
    switch (other.entityType) {
      case "player":
        return `/player/${other.slug}`;
      case "coach":
        return `/coach/${other.slug}`;
      case "team":
        return `/team/${other.slug}`;
      case "community":
        return `/community/${other.slug}`;
      case "venue":
        return `/venue/${other.slug}`;
      case "campus":
        return `/campus/${other.slug}`;
      case "school":
        return `/school/${other.slug}`;
      default:
        return `/profile/${other.slug}`;
    }
  };

  const getEntityBadgeColor = (type: EntityType) => {
    switch (type) {
      case "player":
        return "bg-blue-500/15 border-blue-500/30 text-blue-400";
      case "team":
        return "bg-amber-500/15 border-amber-500/30 text-amber-300";
      case "coach":
        return "bg-purple-500/15 border-purple-500/30 text-purple-300";
      case "community":
        return "bg-rose-500/15 border-rose-500/30 text-rose-300";
      case "venue":
        return "bg-fuchsia-500/15 border-fuchsia-500/30 text-fuchsia-300";
      case "campus":
        return "bg-cyan-500/15 border-cyan-500/30 text-cyan-300";
      case "school":
        return "bg-yellow-500/15 border-yellow-500/30 text-yellow-300";
      default:
        return "bg-white/10 border-white/20 text-white/70";
    }
  };

  const renderRelationCard = (item: ActiveRelationItem, subtitleCustom?: string) => {
    const other = item.otherProfile;
    const url = getProfileUrl(other);
    const badgeColor = getEntityBadgeColor(other.entityType);

    return (
      <Link
        key={item.id}
        href={url}
        className="p-3.5 rounded-2xl bg-[#12151F] border border-white/[0.08] hover:border-[#D4AF37]/50 transition-all flex items-center justify-between group shadow-sm"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-xl overflow-hidden bg-black/40 border border-white/10 shrink-0">
            {other.avatarUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={other.avatarUrl}
                alt={other.displayName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            ) : (
              <InitialsAvatar
                name={other.displayName}
                entityType={other.entityType}
                size="full"
              />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-black text-xs text-white group-hover:text-[#D4AF37] transition-colors truncate">
                {other.displayName}
              </span>
              {other.verificationStatus === "verified" && (
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              )}
            </div>
            <div className="text-[10px] font-mono text-white/40 truncate">
              {subtitleCustom || (other.ign ? `@${other.ign}` : other.esportId)}
            </div>
            <span
              className={`inline-block mt-1 px-1.5 py-0.2 rounded border text-[9px] font-mono uppercase ${badgeColor}`}
            >
              {other.entityType} • {item.relationType}
            </span>
          </div>
        </div>

        <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-[#D4AF37] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
      </Link>
    );
  };

  // 1. ATLET (PLAYER)
  if (profile.entityType === "player") {
    const teams = filterRelations("team");
    const communities = filterRelations("community");
    const institutions = filterRelations(undefined).filter(
      (r) => r.otherProfile.entityType === "school" || r.otherProfile.entityType === "campus"
    );

    return (
      <div className="flex flex-col gap-6">
        {/* Tim Terdaftar */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-heading font-black uppercase text-amber-300 flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              <span>Klub / Tim ({teams.length}/3)</span>
            </h3>
            {isOwner && (
              <Link
                href="/me/memberships"
                className="text-[10px] font-mono text-[#D4AF37] hover:underline"
              >
                + Hubungkan Tim
              </Link>
            )}
          </div>
          {teams.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {teams.map((t) => renderRelationCard(t, "Roster Tim"))}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] text-xs text-white/40">
              Saat ini berstatus <strong className="text-white">Free Agent</strong> (Belum terdaftar di tim).
            </div>
          )}
        </div>

        {/* Komunitas Afiliasi */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-heading font-black uppercase text-rose-300 flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-400" />
              <span>Komunitas Naungan ({communities.length}/5)</span>
            </h3>
          </div>
          {communities.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {communities.map((c) => renderRelationCard(c, "Komunitas Asal"))}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] text-xs text-white/40">
              Belum terhubung dengan komunitas esports regional.
            </div>
          )}
        </div>

        {/* Sekolah / Kampus */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-heading font-black uppercase text-cyan-300 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-cyan-400" />
              <span>Asal Sekolah / Kampus ({institutions.length}/1)</span>
            </h3>
          </div>
          {institutions.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {institutions.map((inst) =>
                renderRelationCard(inst, `Institusi Pendidikan (${inst.otherProfile.entityType})`)
              )}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] text-xs text-white/40">
              Belum ada data sekolah atau kampus terafiliasi.
            </div>
          )}
        </div>
      </div>
    );
  }

  // 2. TIM (TEAM)
  if (profile.entityType === "team") {
    const rosters = filterRelations("player", "anggota");
    const coaches = filterRelations("coach", "pelatih");
    const community = filterRelations("community", "naungan");
    const institution = filterRelations(undefined, "mewakili").filter(
      (r) => r.otherProfile.entityType === "school" || r.otherProfile.entityType === "campus"
    );
    const basecamp = filterRelations("venue", "basecamp");

    return (
      <div className="flex flex-col gap-6">
        {/* Roster Pemain */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-heading font-black uppercase text-amber-300 flex items-center gap-2">
              <Gamepad2 className="w-4 h-4 text-amber-400" />
              <span>Roster Pemain Aktif ({rosters.length}/7)</span>
            </h3>
            {isOwner && (
              <Link
                href="/me/memberships"
                className="text-[10px] font-mono text-[#D4AF37] hover:underline"
              >
                + Tambah Roster
              </Link>
            )}
          </div>
          {rosters.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {rosters.map((r) => renderRelationCard(r, r.otherProfile.ign || "Athlete"))}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] text-xs text-white/40">
              Belum ada atlet terdaftar di roster tim ini.
            </div>
          )}
        </div>

        {/* Pelatih */}
        <div>
          <h3 className="text-xs font-heading font-black uppercase text-purple-300 flex items-center gap-2 mb-3">
            <Award className="w-4 h-4 text-purple-400" />
            <span>Pelatih / Analis Tim ({coaches.length}/5)</span>
          </h3>
          {coaches.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {coaches.map((c) => renderRelationCard(c, "Pelatih Tim"))}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] text-xs text-white/40">
              Belum ada pelatih terverifikasi yang didaftarkan.
            </div>
          )}
        </div>

        {/* Komunitas Naungan, Institusi, dan Basecamp */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Komunitas Naungan */}
          <div className="p-4 rounded-2xl bg-[#0D1017] border border-white/[0.06]">
            <span className="text-[10px] font-mono text-white/40 uppercase block mb-2">
              Komunitas Naungan
            </span>
            {community.length > 0 ? (
              community.map((c) => renderRelationCard(c))
            ) : (
              <span className="text-xs text-white/40 italic">Tim Independen</span>
            )}
          </div>

          {/* Institusi Diwakili */}
          <div className="p-4 rounded-2xl bg-[#0D1017] border border-white/[0.06]">
            <span className="text-[10px] font-mono text-white/40 uppercase block mb-2">
              Institusi Pendidikan
            </span>
            {institution.length > 0 ? (
              institution.map((inst) => renderRelationCard(inst))
            ) : (
              <span className="text-xs text-white/40 italic">Klub Non-Akademik</span>
            )}
          </div>

          {/* Basecamp Venue */}
          <div className="p-4 rounded-2xl bg-[#0D1017] border border-white/[0.06]">
            <span className="text-[10px] font-mono text-white/40 uppercase block mb-2">
              Basecamp Latihan
            </span>
            {basecamp.length > 0 ? (
              basecamp.map((b) => renderRelationCard(b))
            ) : (
              <span className="text-xs text-white/40 italic">Latihan Daring (Online)</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 3. PELATIH (COACH)
  if (profile.entityType === "coach") {
    const teams = filterRelations("team", "pelatih");
    const institutions = filterRelations(undefined).filter(
      (r) =>
        r.otherProfile.entityType === "school" ||
        r.otherProfile.entityType === "campus" ||
        r.otherProfile.entityType === "community"
    );

    return (
      <div className="flex flex-col gap-6">
        <div>
          <h3 className="text-xs font-heading font-black uppercase text-purple-300 flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-purple-400" />
            <span>Tim / Klub yang Dilatih ({teams.length}/5)</span>
          </h3>
          {teams.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {teams.map((t) => renderRelationCard(t, "Klub Binaan"))}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] text-xs text-white/40">
              Belum terhubung dengan klub binaan.
            </div>
          )}
        </div>

        <div>
          <h3 className="text-xs font-heading font-black uppercase text-cyan-300 flex items-center gap-2 mb-3">
            <GraduationCap className="w-4 h-4 text-cyan-400" />
            <span>Afiliasi Pembina Institusi / Komunitas ({institutions.length}/3)</span>
          </h3>
          {institutions.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {institutions.map((i) => renderRelationCard(i, "Pembina / Penasihat"))}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] text-xs text-white/40">
              Belum ada pembinaan lembaga sekolah atau perguruan tinggi.
            </div>
          )}
        </div>
      </div>
    );
  }

  // 4. KOMUNITAS (COMMUNITY)
  if (profile.entityType === "community") {
    const teams = filterRelations("team", "naungan");
    const markas = filterRelations("venue", "markas");
    const partners = filterRelations(undefined, "kerja_sama").filter(
      (r) => r.otherProfile.entityType === "school" || r.otherProfile.entityType === "campus"
    );
    const members = filterRelations("player", "anggota");

    return (
      <div className="flex flex-col gap-6">
        <div>
          <h3 className="text-xs font-heading font-black uppercase text-rose-300 flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-rose-400" />
            <span>Tim & Klub di Bawah Naungan ({teams.length})</span>
          </h3>
          {teams.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {teams.map((t) => renderRelationCard(t, "Klub Binaan"))}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] text-xs text-white/40">
              Belum ada tim terdaftar di bawah naungan komunitas ini.
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h3 className="text-xs font-heading font-black uppercase text-fuchsia-300 flex items-center gap-2 mb-3">
              <Building2 className="w-4 h-4 text-fuchsia-400" />
              <span>Markas ({markas.length}/3)</span>
            </h3>
            {markas.length > 0 ? (
              markas.map((m) => renderRelationCard(m, "Sentra Latihan & Kumpul"))
            ) : (
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] text-xs text-white/40">
                Belum menentukan venue markas.
              </div>
            )}
          </div>

          <div>
            <h3 className="text-xs font-heading font-black uppercase text-yellow-300 flex items-center gap-2 mb-3">
              <GraduationCap className="w-4 h-4 text-yellow-400" />
              <span>Kerja Sama Pendidikan ({partners.length}/5)</span>
            </h3>
            {partners.length > 0 ? (
              partners.map((p) => renderRelationCard(p, "Mitra Pembinaan Pelajar"))
            ) : (
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] text-xs text-white/40">
                Belum ada kemitraan sekolah atau kampus aktif.
              </div>
            )}
          </div>
        </div>

        {/* Ringkasan Anggota */}
        <div className="p-4 rounded-2xl bg-[#0D1017] border border-white/[0.06] flex items-center justify-between">
          <div>
            <span className="font-heading font-bold text-xs text-white">
              Total Anggota Atlet Terhubung
            </span>
            <p className="text-[11px] text-white/50">
              Terverifikasi di sistem pendaftaran terpadu ESPORT SUMBAR.
            </p>
          </div>
          <span className="text-lg font-heading font-black text-[#D4AF37]">
            {members.length} Atlet
          </span>
        </div>
      </div>
    );
  }

  // 5. VENUE
  if (profile.entityType === "venue") {
    const basecamps = filterRelations("team", "basecamp");
    const communities = filterRelations("community", "markas");
    const schools = filterRelations(undefined, "tempat_latihan").filter(
      (r) => r.otherProfile.entityType === "school" || r.otherProfile.entityType === "campus"
    );

    return (
      <div className="flex flex-col gap-6">
        <div>
          <h3 className="text-xs font-heading font-black uppercase text-amber-300 flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-amber-400" />
            <span>Tim Berbasis di Sini (Basecamp) ({basecamps.length})</span>
          </h3>
          {basecamps.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {basecamps.map((b) => renderRelationCard(b, "Tim Residen"))}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] text-xs text-white/40">
              Belum ada tim yang mendaftarkan venue ini sebagai basecamp.
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h3 className="text-xs font-heading font-black uppercase text-rose-300 flex items-center gap-2 mb-3">
              <Flame className="w-4 h-4 text-rose-400" />
              <span>Markas Komunitas ({communities.length})</span>
            </h3>
            {communities.length > 0 ? (
              communities.map((c) => renderRelationCard(c, "Komunitas Residen"))
            ) : (
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] text-xs text-white/40">
                Belum ada komunitas yang menetapkan venue ini sebagai markas.
              </div>
            )}
          </div>

          <div>
            <h3 className="text-xs font-heading font-black uppercase text-yellow-300 flex items-center gap-2 mb-3">
              <GraduationCap className="w-4 h-4 text-yellow-400" />
              <span>Mitra Latihan Sekolah & Kampus ({schools.length})</span>
            </h3>
            {schools.length > 0 ? (
              schools.map((s) => renderRelationCard(s, "Latihan Ekskul/UKM"))
            ) : (
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] text-xs text-white/40">
                Belum ada jadwal latihan institusi pendidikan terdaftar.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 6 & 7. KAMPUS & SEKOLAH
  const isSchool = profile.entityType === "school";
  const teams = filterRelations("team", "mewakili");
  const coaches = filterRelations("coach", "pembina");
  const venues = filterRelations("venue", "tempat_latihan");
  const studentMembers = filterRelations("player", isSchool ? "siswa" : "mahasiswa");

  return (
    <div className="flex flex-col gap-6">
      {/* Peringatan PDP Siswa di Bawah 18 Tahun */}
      {isSchool && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
          <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-[11px] text-white/70 leading-relaxed">
            Perlindungan Data Pribadi (UU PDP No. 27/2022): Data identitas siswa di bawah 18 tahun tidak
            ditampilkan ke publik tanpa persetujuan tertulis wali murid. Anggota binaan aktif:{" "}
            <strong className="text-white font-mono">{studentMembers.length} Pelajar Terdaftar</strong>.
          </p>
        </div>
      )}

      {/* Tim Perwakilan */}
      <div>
        <h3 className="text-xs font-heading font-black uppercase text-amber-300 flex items-center gap-2 mb-3">
          <Gamepad2 className="w-4 h-4 text-amber-400" />
          <span>Tim Perwakilan ({teams.length})</span>
        </h3>
        {teams.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {teams.map((t) => renderRelationCard(t, "Tim Ekskul / UKM"))}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] text-xs text-white/40">
            Belum ada tim kompetisi perwakilan terdaftar.
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Guru / Dosen Pembina */}
        <div>
          <h3 className="text-xs font-heading font-black uppercase text-purple-300 flex items-center gap-2 mb-3">
            <Award className="w-4 h-4 text-purple-400" />
            <span>Pelatih & Pembina ({coaches.length})</span>
          </h3>
          {coaches.length > 0 ? (
            coaches.map((c) => renderRelationCard(c, "Pembina Terverifikasi"))
          ) : (
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] text-xs text-white/40">
              Belum ada pembina atau pelatih lisensi tertaut.
            </div>
          )}
        </div>

        {/* Tempat Latihan Mitra */}
        <div>
          <h3 className="text-xs font-heading font-black uppercase text-fuchsia-300 flex items-center gap-2 mb-3">
            <Building2 className="w-4 h-4 text-fuchsia-400" />
            <span>Fasilitas & Venue Latihan ({venues.length})</span>
          </h3>
          {venues.length > 0 ? (
            venues.map((v) => renderRelationCard(v, "Tempat Latihan Rekanan"))
          ) : (
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] text-xs text-white/40">
              Latihan dilakukan di laboratorium sekolah / kampus sendiri.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
