"use client";

import React from "react";
import type { EntityType } from "@/lib/supabase/database.types";
import { OFFICIAL_GAMES } from "@/data/games";
import {
  Gamepad2,
  Trophy,
  Shield,
  Users,
  MapPin,
  Building,
  GraduationCap,
  Sparkles,
  Check,
  Lock,
  Globe,
  Radio,
} from "lucide-react";

interface DynamicEntityFieldsProps {
  entityType: EntityType;
  attributes: Record<string, any>;
  onChange: (key: string, value: any) => void;
  bio: string;
  onBioChange: (bio: string) => void;
}

const VENUE_FACILITIES_OPTIONS = [
  { id: "pc_high_end", label: "PC High-End / RTX" },
  { id: "console", label: "PlayStation / Nintendo" },
  { id: "ac", label: "Ruangan Ber-AC" },
  { id: "dedicated_fiber", label: "Dedicated Fiber 100+ Mbps" },
  { id: "canteen", label: "Kantin / Kafe Gaming" },
  { id: "tournament_stage", label: "Panggung Turnamen" },
  { id: "streaming_room", label: "Ruang Live Streaming" },
  { id: "smoker_area", label: "Area Khusus Merokok" },
];

export function DynamicEntityFields({
  entityType,
  attributes,
  onChange,
  bio,
  onBioChange,
}: DynamicEntityFieldsProps) {
  // Helper untuk toggle fasilitas venue
  const toggleFacility = (facilityId: string) => {
    const currentFacilities = (attributes.facilities as string[]) || [];
    if (currentFacilities.includes(facilityId)) {
      onChange(
        "facilities",
        currentFacilities.filter((f) => f !== facilityId)
      );
    } else {
      onChange("facilities", [...currentFacilities, facilityId]);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 text-left">
      {/* ==================================================================== */}
      {/* 1. ATRIBUT KHUSUS ATLET (PLAYER)                                     */}
      {/* ==================================================================== */}
      {entityType === "player" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1.5">
                In-Game Name (IGN) <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={attributes.ign || ""}
                onChange={(e) => onChange("ign", e.target.value)}
                placeholder="mis. HARIMAU_AIM"
                maxLength={50}
                className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white placeholder-white/30 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1.5">
                Game Utama <span className="text-red-400">*</span>
              </label>
              <select
                value={attributes.game_id || OFFICIAL_GAMES[0].id}
                onChange={(e) => onChange("game_id", e.target.value)}
                className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white outline-none cursor-pointer"
              >
                {OFFICIAL_GAMES.map((game) => (
                  <option key={game.id} value={game.id} className="bg-[#161A24]">
                    {game.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1.5">
                Role Bermain <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={attributes.role || ""}
                onChange={(e) => onChange("role", e.target.value)}
                placeholder="mis. Roamer / Jungler / Duelist"
                maxLength={40}
                className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white placeholder-white/30 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1.5">
                Rank Tertinggi
              </label>
              <input
                type="text"
                value={attributes.rank || ""}
                onChange={(e) => onChange("rank", e.target.value)}
                placeholder="mis. Mythic Glory 120★"
                maxLength={40}
                className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white placeholder-white/30 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-white/60">
                  Game Account ID
                </label>
                <span className="flex items-center gap-1 text-[9px] font-mono text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">
                  <Lock className="w-2.5 h-2.5" /> Privat Default
                </span>
              </div>
              <input
                type="text"
                value={attributes.game_account_id || ""}
                onChange={(e) => onChange("game_account_id", e.target.value)}
                placeholder="ID Akun Game / Server"
                maxLength={60}
                className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white placeholder-white/30 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1.5">
                Tahun Mulai Kompetitif
              </label>
              <input
                type="number"
                min={2010}
                max={new Date().getFullYear()}
                value={attributes.year_started || 2022}
                onChange={(e) => onChange("year_started", parseInt(e.target.value, 10))}
                className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white outline-none"
              />
            </div>
          </div>

          {/* Toggle Mencari Tim (LFT) */}
          <div className="p-3.5 rounded-xl bg-[#161A24] border border-white/[0.08] flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-white">Status Mencari Tim (LFT)</div>
              <div className="text-[10px] font-mono text-white/40">
                Tampilkan lencana &quot;Looking for Team&quot; pada kartu publik Anda
              </div>
            </div>
            <button
              type="button"
              onClick={() => onChange("is_looking_for_team", !attributes.is_looking_for_team)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
                attributes.is_looking_for_team
                  ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                  : "bg-white/[0.04] border-white/10 text-white/40"
              }`}
            >
              {attributes.is_looking_for_team ? "AKTIF" : "TIDAK"}
            </button>
          </div>
        </>
      )}

      {/* ==================================================================== */}
      {/* 2. ATRIBUT KHUSUS PELATIH (COACH)                                    */}
      {/* ==================================================================== */}
      {entityType === "coach" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1.5">
                Pengalaman Melatih (Tahun) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                min={0}
                max={30}
                value={attributes.experience_years || 1}
                onChange={(e) => onChange("experience_years", parseInt(e.target.value, 10))}
                className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1.5">
                Game Spesialisasi Utama
              </label>
              <select
                value={attributes.main_game_id || OFFICIAL_GAMES[0].id}
                onChange={(e) => onChange("main_game_id", e.target.value)}
                className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white outline-none cursor-pointer"
              >
                {OFFICIAL_GAMES.map((game) => (
                  <option key={game.id} value={game.id} className="bg-[#161A24]">
                    {game.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-white/60">
                Filosofi Melatih (Maks 140 Karakter)
              </label>
              <span className="text-[10px] font-mono text-white/40">
                {(attributes.coaching_philosophy || "").length}/140
              </span>
            </div>
            <input
              type="text"
              value={attributes.coaching_philosophy || ""}
              onChange={(e) => onChange("coaching_philosophy", e.target.value)}
              placeholder="mis. Disiplin makro, ketenangan mental, dan eksekusi presisi."
              maxLength={140}
              className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white placeholder-white/30 outline-none"
            />
          </div>

          {/* Toggle Ketersediaan */}
          <div className="p-3.5 rounded-xl bg-[#161A24] border border-white/[0.08] flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-white">Status Ketersediaan Melatih</div>
              <div className="text-[10px] font-mono text-white/40">
                Terbuka untuk tawaran melatih tim esport
              </div>
            </div>
            <button
              type="button"
              onClick={() => onChange("is_active_coaching", !attributes.is_active_coaching)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
                attributes.is_active_coaching
                  ? "bg-purple-500/20 border-purple-500/40 text-purple-400"
                  : "bg-white/[0.04] border-white/10 text-white/40"
              }`}
            >
              {attributes.is_active_coaching ? "TERSEDIA" : "TIDAK AKTIF"}
            </button>
          </div>
        </>
      )}

      {/* ==================================================================== */}
      {/* 3. ATRIBUT KHUSUS TIM (TEAM)                                         */}
      {/* ==================================================================== */}
      {entityType === "team" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1.5">
                Singkatan / Tag Tim (2-5 Karakter) <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={attributes.team_tag || ""}
                onChange={(e) => onChange("team_tag", e.target.value.toUpperCase())}
                placeholder="mis. BTR / RRQ / MRT"
                maxLength={5}
                className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white font-mono uppercase placeholder-white/30 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1.5">
                Divisi Game Utama <span className="text-red-400">*</span>
              </label>
              <select
                value={attributes.game_division || OFFICIAL_GAMES[0].name}
                onChange={(e) => onChange("game_division", e.target.value)}
                className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white outline-none cursor-pointer"
              >
                {OFFICIAL_GAMES.map((game) => (
                  <option key={game.id} value={game.name} className="bg-[#161A24]">
                    {game.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1.5">
                Tahun Berdiri
              </label>
              <input
                type="number"
                min={2000}
                max={new Date().getFullYear()}
                value={attributes.founded_year || 2023}
                onChange={(e) => onChange("founded_year", parseInt(e.target.value, 10))}
                className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1.5">
                Homebase / Markas Tim
              </label>
              <input
                type="text"
                value={attributes.homebase || ""}
                onChange={(e) => onChange("homebase", e.target.value)}
                placeholder="mis. Padang Barat"
                maxLength={60}
                className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white placeholder-white/30 outline-none"
              />
            </div>
          </div>

          {/* Toggle Rekrutmen Pemain */}
          <div className="p-3.5 rounded-xl bg-[#161A24] border border-white/[0.08] flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-white">Status Rekrutmen Tim</div>
              <div className="text-[10px] font-mono text-white/40">
                Buka pendaftaran pemain baru untuk divisi ini
              </div>
            </div>
            <button
              type="button"
              onClick={() => onChange("is_recruiting", !attributes.is_recruiting)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
                attributes.is_recruiting
                  ? "bg-amber-500/20 border-amber-500/40 text-amber-400"
                  : "bg-white/[0.04] border-white/10 text-white/40"
              }`}
            >
              {attributes.is_recruiting ? "BUKA" : "TUTUP"}
            </button>
          </div>
        </>
      )}

      {/* ==================================================================== */}
      {/* 4. ATRIBUT KHUSUS KOMUNITAS (COMMUNITY)                              */}
      {/* ==================================================================== */}
      {entityType === "community" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1.5">
                Estimasi Jumlah Anggota <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                min={1}
                value={attributes.estimated_members || 50}
                onChange={(e) => onChange("estimated_members", parseInt(e.target.value, 10))}
                className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1.5">
                Frekuensi Kegiatan Rutin
              </label>
              <select
                value={attributes.activity_frequency || "mingguan"}
                onChange={(e) => onChange("activity_frequency", e.target.value)}
                className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white outline-none cursor-pointer"
              >
                <option value="mingguan" className="bg-[#161A24]">
                  Mingguan (Mabar / Turnamen Mini)
                </option>
                <option value="dua_mingguan" className="bg-[#161A24]">
                  Dua Mingguan
                </option>
                <option value="bulanan" className="bg-[#161A24]">
                  Bulanan
                </option>
                <option value="insidental" className="bg-[#161A24]">
                  Insidental / Musiman
                </option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1.5">
                Tautan Grup Publik (WhatsApp / Discord)
              </label>
              <input
                type="text"
                value={attributes.public_group_link || ""}
                onChange={(e) => onChange("public_group_link", e.target.value)}
                placeholder="https://chat.whatsapp.com/..."
                className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white placeholder-white/30 outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-white/60">
                  Kontak Resmi Pengurus
                </label>
                <span className="flex items-center gap-1 text-[9px] font-mono text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">
                  <Lock className="w-2.5 h-2.5" /> Privat Default
                </span>
              </div>
              <input
                type="text"
                value={attributes.official_contact || ""}
                onChange={(e) => onChange("official_contact", e.target.value)}
                placeholder="0812xxxxxxxx"
                maxLength={20}
                className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white placeholder-white/30 outline-none"
              />
            </div>
          </div>
        </>
      )}

      {/* ==================================================================== */}
      {/* 5. ATRIBUT KHUSUS VENUE                                              */}
      {/* ==================================================================== */}
      {entityType === "venue" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1.5">
                Jenis Venue <span className="text-red-400">*</span>
              </label>
              <select
                value={attributes.venue_type || "icafe"}
                onChange={(e) => onChange("venue_type", e.target.value)}
                className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white outline-none cursor-pointer"
              >
                <option value="icafe" className="bg-[#161A24]">
                  iCafe / Gaming Arena
                </option>
                <option value="warnet" className="bg-[#161A24]">
                  Warnet Standar
                </option>
                <option value="warkop_gaming" className="bg-[#161A24]">
                  Warkop / Cafe Gaming
                </option>
                <option value="arena" className="bg-[#161A24]">
                  Arena Esport Khusus
                </option>
                <option value="bootcamp" className="bg-[#161A24]">
                  Bootcamp Fasilitas
                </option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1.5">
                Kapasitas Unit (PC / Konsol) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                min={1}
                value={attributes.capacity_units || 20}
                onChange={(e) => onChange("capacity_units", parseInt(e.target.value, 10))}
                className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1.5">
              Alamat Usaha Lengkap <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={attributes.business_address || ""}
              onChange={(e) => onChange("business_address", e.target.value)}
              placeholder="Jl. Khatib Sulaiman No. 45, Padang"
              maxLength={200}
              className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white placeholder-white/30 outline-none"
            />
          </div>

          {/* Fasilitas Venue Multi-Select Chips */}
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-2">
              Fasilitas Unggulan Venue
            </label>
            <div className="flex flex-wrap gap-2">
              {VENUE_FACILITIES_OPTIONS.map((f) => {
                const isSelected = ((attributes.facilities as string[]) || []).includes(f.id);
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => toggleFacility(f.id)}
                    className={`px-3 py-1.5 rounded-xl border text-[11px] font-mono flex items-center gap-1.5 transition-all ${
                      isSelected
                        ? "bg-[#D4AF37]/20 border-[#D4AF37] text-white font-bold"
                        : "bg-[#161A24] border-white/10 text-white/60 hover:text-white"
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-[#D4AF37]" />}
                    <span>{f.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Toggle Siap Turnamen */}
          <div className="p-3.5 rounded-xl bg-[#161A24] border border-white/[0.08] flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-white">Status Siap Turnamen (Tournament Ready)</div>
              <div className="text-[10px] font-mono text-white/40">
                Fasilitas siap dijadikan lokasi kualifikasi turnamen kompetitif daerah
              </div>
            </div>
            <button
              type="button"
              onClick={() => onChange("is_tournament_ready", !attributes.is_tournament_ready)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
                attributes.is_tournament_ready
                  ? "bg-fuchsia-500/20 border-fuchsia-500/40 text-fuchsia-400"
                  : "bg-white/[0.04] border-white/10 text-white/40"
              }`}
            >
              {attributes.is_tournament_ready ? "SIAP" : "BELUM"}
            </button>
          </div>
        </>
      )}

      {/* ==================================================================== */}
      {/* 6. ATRIBUT KHUSUS KAMPUS (CAMPUS)                                    */}
      {/* ==================================================================== */}
      {entityType === "campus" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1.5">
                Nama Perguruan Tinggi <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={attributes.campus_name || ""}
                onChange={(e) => onChange("campus_name", e.target.value)}
                placeholder="mis. Universitas Andalas"
                maxLength={100}
                className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white placeholder-white/30 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1.5">
                Nama UKM / Komunitas Kampus <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={attributes.ukm_name || ""}
                onChange={(e) => onChange("ukm_name", e.target.value)}
                placeholder="mis. UKM Esport UNAND"
                maxLength={80}
                className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white placeholder-white/30 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1.5">
                Nama Pembina / Dosen Pendamping
              </label>
              <input
                type="text"
                value={attributes.advisor_name || ""}
                onChange={(e) => onChange("advisor_name", e.target.value)}
                placeholder="Nama Pembina UKM"
                maxLength={80}
                className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white placeholder-white/30 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1.5">
                Jumlah Anggota Terdaftar (Angka)
              </label>
              <input
                type="number"
                min={1}
                value={attributes.member_count || 30}
                onChange={(e) => onChange("member_count", parseInt(e.target.value, 10))}
                className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white outline-none"
              />
            </div>
          </div>
        </>
      )}

      {/* ==================================================================== */}
      {/* 7. ATRIBUT KHUSUS SEKOLAH (SCHOOL)                                   */}
      {/* ==================================================================== */}
      {entityType === "school" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1.5">
                Nama Sekolah <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={attributes.school_name || ""}
                onChange={(e) => onChange("school_name", e.target.value)}
                placeholder="mis. SMAN 1 Padang"
                maxLength={100}
                className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white placeholder-white/30 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1.5">
                Jenjang Pendidikan <span className="text-red-400">*</span>
              </label>
              <select
                value={attributes.education_level || "SMA"}
                onChange={(e) => onChange("education_level", e.target.value)}
                className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white outline-none cursor-pointer"
              >
                <option value="SMA" className="bg-[#161A24]">
                  SMA (Sekolah Menengah Atas)
                </option>
                <option value="SMK" className="bg-[#161A24]">
                  SMK (Sekolah Menengah Kejuruan)
                </option>
                <option value="MA" className="bg-[#161A24]">
                  MA (Madrasah Aliyah)
                </option>
                <option value="SMP" className="bg-[#161A24]">
                  SMP (Sekolah Menengah Pertama)
                </option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1.5">
                Nama Ekskul Esport <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={attributes.extracurricular_name || ""}
                onChange={(e) => onChange("extracurricular_name", e.target.value)}
                placeholder="mis. Smansa Esports Club"
                maxLength={80}
                className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white placeholder-white/30 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1.5">
                Jumlah Siswa Binaan (Angka Saja)
              </label>
              <input
                type="number"
                min={1}
                value={attributes.student_count || 15}
                onChange={(e) => onChange("student_count", parseInt(e.target.value, 10))}
                className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white outline-none"
              />
            </div>
          </div>

          {/* Banner Proteksi Siswa Sesuai PRD Bab 8.2 */}
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2.5 text-xs text-amber-300">
            <Lock className="w-4 h-4 shrink-0 text-amber-400" />
            <span className="text-[11px] leading-relaxed">
              <strong>Data Siswa Dilindungi:</strong> Sesuai UU PDP No. 27/2022, daftar nama, foto, dan kontak siswa tidak pernah dipublikasikan secara publik.
            </span>
          </div>
        </>
      )}

      {/* ==================================================================== */}
      {/* BIO SINGKAT UMUM (MAKSIMAL 160 KARAKTER)                             */}
      {/* ==================================================================== */}
      <div className="mt-2">
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[11px] font-mono uppercase tracking-wider text-white/60">
            Bio Singkat (Maks. 160 Karakter)
          </label>
          <span className="text-[10px] font-mono text-white/40">{bio.length}/160</span>
        </div>
        <textarea
          value={bio}
          onChange={(e) => onBioChange(e.target.value.slice(0, 160))}
          placeholder="Tuliskan deskripsi ringkas tentang identitas atau profil ini..."
          rows={2}
          className="w-full bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl p-3 text-xs text-white placeholder-white/30 outline-none resize-none"
        />
      </div>
    </div>
  );
}
