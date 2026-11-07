"use client";

import React, { useState } from "react";
import type { EntityType } from "@/lib/supabase/database.types";
import { OFFICIAL_GAMES } from "@/data/games";
import {
  Lock,
  Globe,
  MapPin,
  Check,
  Crosshair,
  ShieldAlert,
  Info,
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
  { id: "console", label: "PlayStation 5 / Nintendo" },
  { id: "ac", label: "Ruangan Ber-AC" },
  { id: "dedicated_fiber", label: "Dedicated Fiber 100+ Mbps" },
  { id: "canteen", label: "Kantin / Kafe Gaming" },
  { id: "tournament_stage", label: "Panggung Turnamen" },
  { id: "streaming_room", label: "Ruang Live Streaming" },
  { id: "smoker_area", label: "Area Khusus Merokok" },
];

function FieldBadge({
  required,
  visibility,
}: {
  required: boolean;
  visibility: "PB" | "P";
}) {
  return (
    <div className="flex items-center gap-1.5 shrink-0">
      <span
        className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
          required
            ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
            : "bg-white/[0.06] text-white/50 border border-white/10"
        }`}
      >
        {required ? "WAJIB" : "OPSIONAL"}
      </span>
      <span
        className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-mono ${
          visibility === "P"
            ? "bg-amber-400/15 text-amber-300 border border-amber-400/30"
            : "bg-emerald-400/15 text-emerald-300 border border-emerald-400/30"
        }`}
        title={visibility === "P" ? "Privat: Hanya untuk Anda dan Admin Platform" : "Publik: Tampil pada kartu & profil"}
      >
        {visibility === "P" ? <Lock className="w-2.5 h-2.5" /> : <Globe className="w-2.5 h-2.5" />}
        <span>{visibility === "P" ? "PRIVAT" : "PUBLIK"}</span>
      </span>
    </div>
  );
}

export function DynamicEntityFields({
  entityType,
  attributes,
  onChange,
  bio,
  onBioChange,
}: DynamicEntityFieldsProps) {
  const [gpsLoading, setGpsLoading] = useState(false);

  // Toggle fasilitas venue
  const toggleFacility = (facilityId: string) => {
    const currentFacilities = (attributes.facilities as string[]) || [];
    if (currentFacilities.includes(facilityId)) {
      onChange("facilities", currentFacilities.filter((f) => f !== facilityId));
    } else {
      onChange("facilities", [...currentFacilities, facilityId]);
    }
  };

  // Toggle spesialisasi game pelatih
  const toggleGameSpecialization = (gameId: string) => {
    const current = (attributes.game_specialization as string[]) || [];
    if (current.includes(gameId)) {
      onChange("game_specialization", current.filter((g) => g !== gameId));
    } else {
      onChange("game_specialization", [...current, gameId]);
    }
  };

  // Handler tombol "Gunakan Lokasi GPS Saya" untuk Venue
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation tidak didukung oleh browser Anda.");
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsLoading(false);
        onChange("coordinates", {
          lat: parseFloat(pos.coords.latitude.toFixed(6)),
          lng: parseFloat(pos.coords.longitude.toFixed(6)),
        });
      },
      () => {
        setGpsLoading(false);
        alert("Gagal membaca titik lokasi GPS. Silakan masukkan koordinat secara manual.");
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="w-full flex flex-col gap-4 text-left">
      {/* ==================================================================== */}
      {/* 1. ATRIBUT ATLET (PLAYER) - SPEC 2.2B                                */}
      {/* ==================================================================== */}
      {entityType === "player" && (
        <>
          {/* Baris 1: Nama Lengkap (Privat) & IGN (Publik) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-white/70">
                  Nama Lengkap (Sesuai Akta / Identitas)
                </label>
                <FieldBadge required={true} visibility="P" />
              </div>
              <input
                type="text"
                value={attributes.full_name || ""}
                onChange={(e) => onChange("full_name", e.target.value)}
                placeholder="mis. Fikri Alamsyah Putra"
                maxLength={100}
                className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white placeholder-white/30 outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-white/70">
                  In-Game Name (IGN)
                </label>
                <FieldBadge required={true} visibility="PB" />
              </div>
              <input
                type="text"
                value={attributes.ign || ""}
                onChange={(e) => onChange("ign", e.target.value)}
                placeholder="mis. HARIMAU_AIM"
                maxLength={50}
                className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white placeholder-white/30 outline-none"
              />
            </div>
          </div>

          {/* Baris 2: Game Utama, Role & Rank (Dinamis Sesuai Game - Mandat 5.2) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-white/70">
                  Game Utama
                </label>
                <FieldBadge required={true} visibility="PB" />
              </div>
              <select
                value={attributes.game_id || OFFICIAL_GAMES[0].id}
                onChange={(e) => {
                  const newGameId = e.target.value;
                  onChange("game_id", newGameId);
                  const targetGame = OFFICIAL_GAMES.find((g) => g.id === newGameId);
                  if (targetGame && targetGame.roles.length > 0) {
                    onChange("role", targetGame.roles[0]);
                  }
                  if (targetGame && targetGame.ranks && targetGame.ranks.length > 0) {
                    onChange("current_rank", targetGame.ranks[0]);
                  }
                }}
                className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white outline-none cursor-pointer"
              >
                {OFFICIAL_GAMES.map((game) => (
                  <option key={game.id} value={game.id} className="bg-[#161A24]">
                    {game.name} ({game.shortName})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-white/70">
                  Role / Posisi
                </label>
                <FieldBadge required={true} visibility="PB" />
              </div>
              {(() => {
                const curGame = OFFICIAL_GAMES.find((g) => g.id === (attributes.game_id || OFFICIAL_GAMES[0].id)) || OFFICIAL_GAMES[0];
                const availableRoles = curGame.roles;
                return (
                  <select
                    value={attributes.role || (availableRoles[0] || "")}
                    onChange={(e) => onChange("role", e.target.value)}
                    className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white outline-none cursor-pointer"
                  >
                    {availableRoles.map((r) => (
                      <option key={r} value={r} className="bg-[#161A24]">
                        {r}
                      </option>
                    ))}
                    <option value="Flex / Cadangan" className="bg-[#161A24]">Flex / Cadangan</option>
                  </select>
                );
              })()}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-white/70">
                  Tier Rank Saat Ini
                </label>
                <FieldBadge required={false} visibility="PB" />
              </div>
              {(() => {
                const curGame = OFFICIAL_GAMES.find((g) => g.id === (attributes.game_id || OFFICIAL_GAMES[0].id)) || OFFICIAL_GAMES[0];
                const availableRanks = curGame.ranks || [];
                if (availableRanks.length > 0) {
                  return (
                    <select
                      value={attributes.current_rank || availableRanks[0]}
                      onChange={(e) => onChange("current_rank", e.target.value)}
                      className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white outline-none cursor-pointer"
                    >
                      {availableRanks.map((rk) => (
                        <option key={rk} value={rk} className="bg-[#161A24]">
                          {rk}
                        </option>
                      ))}
                    </select>
                  );
                }
                return (
                  <input
                    type="text"
                    value={attributes.current_rank || ""}
                    onChange={(e) => onChange("current_rank", e.target.value)}
                    placeholder="mis. Grandmaster"
                    maxLength={40}
                    className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white placeholder-white/30 outline-none"
                  />
                );
              })()}
            </div>
          </div>

          {/* Baris 3: Status Saat Ini & Perangkat Utama */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-white/70">
                  Status Saat Ini
                </label>
                <FieldBadge required={false} visibility="PB" />
              </div>
              <select
                value={attributes.current_status || "pelajar"}
                onChange={(e) => onChange("current_status", e.target.value)}
                className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white outline-none cursor-pointer"
              >
                <option value="pelajar" className="bg-[#161A24]">Pelajar (SMP/SMA/SMK)</option>
                <option value="mahasiswa" className="bg-[#161A24]">Mahasiswa</option>
                <option value="bekerja" className="bg-[#161A24]">Bekerja</option>
                <option value="lainnya" className="bg-[#161A24]">Lainnya</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-white/70">
                  Perangkat Utama
                </label>
                <FieldBadge required={false} visibility="PB" />
              </div>
              <select
                value={attributes.primary_device || "mobile"}
                onChange={(e) => onChange("primary_device", e.target.value)}
                className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white outline-none cursor-pointer"
              >
                <option value="mobile" className="bg-[#161A24]">Smartphone (Mobile)</option>
                <option value="pc" className="bg-[#161A24]">Personal Computer (PC)</option>
                <option value="console" className="bg-[#161A24]">Konsol (PlayStation / Switch)</option>
              </select>
            </div>
          </div>

          {/* Baris 4: Tujuan Bermain & Jadwal Latihan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-white/70">
                  Tujuan Bermain
                </label>
                <FieldBadge required={false} visibility="PB" />
              </div>
              <select
                value={attributes.play_goal || "kompetitif"}
                onChange={(e) => onChange("play_goal", e.target.value)}
                className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white outline-none cursor-pointer"
              >
                <option value="kompetitif" className="bg-[#161A24]">Kompetitif (Turnamen)</option>
                <option value="profesional" className="bg-[#161A24]">Profesional (Karier Atlet)</option>
                <option value="santai" className="bg-[#161A24]">Santai / Rekreasi</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-white/70">
                  Ketersediaan Latihan
                </label>
                <FieldBadge required={false} visibility="PB" />
              </div>
              <input
                type="text"
                value={attributes.training_schedule || ""}
                onChange={(e) => onChange("training_schedule", e.target.value)}
                placeholder="mis. Senin-Jumat 19:00 - 22:00 WIB"
                maxLength={60}
                className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white placeholder-white/30 outline-none"
              />
            </div>
          </div>

          {/* Baris 5: ID Akun Game & Server (Privat untuk Verifikasi) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-white/70">
                  ID Akun Game
                </label>
                <FieldBadge required={false} visibility="P" />
              </div>
              <input
                type="text"
                value={attributes.game_account_id || ""}
                onChange={(e) => onChange("game_account_id", e.target.value)}
                placeholder="mis. 123456789"
                maxLength={60}
                className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white placeholder-white/30 outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-white/70">
                  Server Akun Game
                </label>
                <FieldBadge required={false} visibility="P" />
              </div>
              <input
                type="text"
                value={attributes.game_server || ""}
                onChange={(e) => onChange("game_server", e.target.value)}
                placeholder="mis. Zone 2104"
                maxLength={40}
                className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white placeholder-white/30 outline-none"
              />
            </div>
          </div>

          {/* Baris 6: Alamat Jalan (Privat) & Pengalaman Turnamen */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-white/70">
                  Alamat Jalan Domisili
                </label>
                <FieldBadge required={false} visibility="P" />
              </div>
              <input
                type="text"
                value={attributes.address_street || ""}
                onChange={(e) => onChange("address_street", e.target.value)}
                placeholder="Nama jalan / RT / RW (privat)"
                maxLength={150}
                className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white placeholder-white/30 outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-white/70">
                  Pengalaman Turnamen Singkat
                </label>
                <FieldBadge required={false} visibility="PB" />
              </div>
              <input
                type="text"
                value={attributes.tournament_experience || ""}
                onChange={(e) => onChange("tournament_experience", e.target.value)}
                placeholder="mis. Juara 2 Piala Walikota Padang 2025"
                maxLength={120}
                className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white placeholder-white/30 outline-none"
              />
            </div>
          </div>

          {/* Toggle Mencari Tim (LFT) */}
          <div className="p-3.5 rounded-xl bg-[#161A24] border border-white/[0.08] flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-white">Status Mencari Tim (Looking For Team)</div>
              <div className="text-[10px] font-mono text-white/40">
                Tampilkan penanda LFT pada kartu agar manajer tim dapat mengirim tawaran relasi
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
      {/* 2. ATRIBUT PELATIH (COACH) - SPEC 2.2C                               */}
      {/* ==================================================================== */}
      {entityType === "coach" && (
        <>
          {/* Baris 1: Nama Lengkap & WhatsApp */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-white/70">
                  Nama Lengkap Pelatih
                </label>
                <FieldBadge required={true} visibility="P" />
              </div>
              <input
                type="text"
                value={attributes.full_name || ""}
                onChange={(e) => onChange("full_name", e.target.value)}
                placeholder="mis. Hendra Kurniawan"
                maxLength={100}
                className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white placeholder-white/30 outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-white/70">
                  Nomor WhatsApp Pelatih
                </label>
                <FieldBadge required={true} visibility="P" />
              </div>
              <input
                type="text"
                value={attributes.whatsapp || ""}
                onChange={(e) => onChange("whatsapp", e.target.value)}
                placeholder="0812xxxxxxxx"
                maxLength={20}
                className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white placeholder-white/30 outline-none font-mono"
              />
            </div>
          </div>

          {/* Baris 2: Level & Pengalaman */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-white/70">
                  Level Kepelatihan
                </label>
                <FieldBadge required={true} visibility="PB" />
              </div>
              <select
                value={attributes.coaching_level || "amatir"}
                onChange={(e) => onChange("coaching_level", e.target.value)}
                className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white outline-none cursor-pointer"
              >
                <option value="amatir" className="bg-[#161A24]">Amatir / Komunitas</option>
                <option value="semi_pro" className="bg-[#161A24]">Semi-Pro / Kualifikasi Daerah</option>
                <option value="pro" className="bg-[#161A24]">Profesional (Tier 1-2)</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-white/70">
                  Pengalaman Melatih (Tahun)
                </label>
                <FieldBadge required={true} visibility="PB" />
              </div>
              <input
                type="number"
                min={0}
                max={40}
                value={attributes.experience_years ?? 1}
                onChange={(e) => onChange("experience_years", parseInt(e.target.value, 10))}
                className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white outline-none"
              />
            </div>
          </div>

          {/* Baris 3: Format Layanan & Tarif Indikatif */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-white/70">
                  Format Layanan
                </label>
                <FieldBadge required={false} visibility="PB" />
              </div>
              <select
                value={attributes.service_format || "hybrid"}
                onChange={(e) => onChange("service_format", e.target.value)}
                className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white outline-none cursor-pointer"
              >
                <option value="hybrid" className="bg-[#161A24]">Hybrid (Tatap Muka & Daring)</option>
                <option value="tatap_muka" className="bg-[#161A24]">Tatap Muka Langsung</option>
                <option value="daring" className="bg-[#161A24]">Daring / Online VOD Review</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-white/70">
                  Tarif Indikatif (Catatan Negosiasi)
                </label>
                <FieldBadge required={false} visibility="P" />
              </div>
              <input
                type="text"
                value={attributes.rate_indicative || ""}
                onChange={(e) => onChange("rate_indicative", e.target.value)}
                placeholder="mis. Negosiasi per sesi turnamen (privat)"
                maxLength={80}
                className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white placeholder-white/30 outline-none"
              />
            </div>
          </div>

          {/* Spesialisasi Game Melatih (Banyak) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-white/70">
                Spesialisasi Game yang Dilatih
              </label>
              <FieldBadge required={true} visibility="PB" />
            </div>
            <div className="flex flex-wrap gap-2">
              {OFFICIAL_GAMES.map((game) => {
                const isSelected = ((attributes.game_specialization as string[]) || []).includes(game.id);
                return (
                  <button
                    key={game.id}
                    type="button"
                    onClick={() => toggleGameSpecialization(game.id)}
                    className={`px-3 py-1.5 rounded-xl border text-[11px] font-mono flex items-center gap-1.5 transition-all ${
                      isSelected
                        ? "bg-[#D4AF37]/20 border-[#D4AF37] text-white font-bold"
                        : "bg-[#161A24] border-white/10 text-white/60 hover:text-white"
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-[#D4AF37]" />}
                    <span>{game.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filosofi Melatih */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-white/70">
                Filosofi Melatih (Maks. 140 Karakter)
              </label>
              <span className="text-[10px] font-mono text-white/40">
                {(attributes.coaching_philosophy || "").length}/140
              </span>
            </div>
            <input
              type="text"
              value={attributes.coaching_philosophy || ""}
              onChange={(e) => onChange("coaching_philosophy", e.target.value.slice(0, 140))}
              placeholder="mis. Disiplin makro, ketenangan mental, dan eksekusi presisi."
              maxLength={140}
              className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white placeholder-white/30 outline-none"
            />
          </div>
        </>
      )}

      {/* ==================================================================== */}
      {/* 3. ATRIBUT TIM (TEAM) - SPEC 2.2D (TANPA INPUT ROSTER)               */}
      {/* ==================================================================== */}
      {entityType === "team" && (
        <>
          {/* Baris 1: Tag Singkatan Tim & Divisi Game */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-white/70">
                  Singkatan / Tag Tim (2-5 Huruf)
                </label>
                <FieldBadge required={true} visibility="PB" />
              </div>
              <input
                type="text"
                value={attributes.team_tag || ""}
                onChange={(e) => onChange("team_tag", e.target.value.toUpperCase().slice(0, 5))}
                placeholder="mis. KNT / MRT / RRQ"
                maxLength={5}
                className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white font-mono uppercase placeholder-white/30 outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-white/70">
                  Divisi Game Utama
                </label>
                <FieldBadge required={true} visibility="PB" />
              </div>
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

          {/* Baris 2: Penanggung Jawab Tim & Jabatan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-white/70">
                  Nama Penanggung Jawab
                </label>
                <FieldBadge required={true} visibility="PB" />
              </div>
              <input
                type="text"
                value={attributes.manager_name || ""}
                onChange={(e) => onChange("manager_name", e.target.value)}
                placeholder="mis. Rian Alfarisyi"
                maxLength={80}
                className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white placeholder-white/30 outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-white/70">
                  Jabatan Penanggung Jawab
                </label>
                <FieldBadge required={true} visibility="PB" />
              </div>
              <select
                value={attributes.manager_role || "Manajer Tim"}
                onChange={(e) => onChange("manager_role", e.target.value)}
                className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white outline-none cursor-pointer"
              >
                <option value="Pemilik / Owner" className="bg-[#161A24]">Pemilik / Owner</option>
                <option value="Manajer Tim" className="bg-[#161A24]">Manajer Tim</option>
                <option value="Kapten Tim" className="bg-[#161A24]">Kapten Tim</option>
                <option value="Pelatih Kepala" className="bg-[#161A24]">Pelatih Kepala</option>
              </select>
            </div>
          </div>

          {/* Baris 3: WhatsApp Penanggung Jawab (Privat) & Email Tim */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-white/70">
                  WhatsApp Penanggung Jawab
                </label>
                <FieldBadge required={true} visibility="P" />
              </div>
              <input
                type="text"
                value={attributes.manager_whatsapp || ""}
                onChange={(e) => onChange("manager_whatsapp", e.target.value)}
                placeholder="0812xxxxxxxx"
                maxLength={20}
                className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white placeholder-white/30 outline-none font-mono"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-white/70">
                  Email Kontak Tim
                </label>
                <FieldBadge required={false} visibility="P" />
              </div>
              <input
                type="email"
                value={attributes.team_email || ""}
                onChange={(e) => onChange("team_email", e.target.value)}
                placeholder="kontak@tim.com"
                maxLength={100}
                className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white placeholder-white/30 outline-none"
              />
            </div>
          </div>

          {/* Notifikasi SPEC 2.2: Tanpa input daftar roster saat pendaftaran */}
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center gap-2.5 text-xs text-white/50">
            <Info className="w-4 h-4 text-[#D4AF37] shrink-0" />
            <span className="text-[11px] leading-relaxed">
              <strong>Catatan Roster:</strong> Daftar atlet tim tidak diisi di sini. Roster terdaftar dibentuk setelah kartu tim terbit melalui kirim undangan atau terima permintaan bergabung.
            </span>
          </div>
        </>
      )}

      {/* ==================================================================== */}
      {/* 4. ATRIBUT KOMUNITAS (COMMUNITY) - SPEC 2.2E                         */}
      {/* ==================================================================== */}
      {entityType === "community" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-white/70">
                  Cakupan Wilayah
                </label>
                <FieldBadge required={true} visibility="PB" />
              </div>
              <input
                type="text"
                value={attributes.coverage_area || ""}
                onChange={(e) => onChange("coverage_area", e.target.value)}
                placeholder="mis. Kota Padang & Sekitarnya"
                maxLength={80}
                className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white placeholder-white/30 outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-white/70">
                  Frekuensi Kegiatan
                </label>
                <FieldBadge required={false} visibility="PB" />
              </div>
              <select
                value={attributes.activity_frequency || "bulanan"}
                onChange={(e) => onChange("activity_frequency", e.target.value)}
                className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white outline-none cursor-pointer"
              >
                <option value="mingguan" className="bg-[#161A24]">Mingguan (Mabar Rutin)</option>
                <option value="dua_mingguan" className="bg-[#161A24]">Dua Mingguan</option>
                <option value="bulanan" className="bg-[#161A24]">Bulanan (Turnamen Mini)</option>
                <option value="insidental" className="bg-[#161A24]">Insidental / Musiman</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-white/70">
                  Nama Ketua / Koordinator
                </label>
                <FieldBadge required={true} visibility="PB" />
              </div>
              <input
                type="text"
                value={attributes.manager_name || ""}
                onChange={(e) => onChange("manager_name", e.target.value)}
                placeholder="Nama Pengurus Komunitas"
                maxLength={80}
                className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white placeholder-white/30 outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-white/70">
                  WhatsApp Pengurus (Privat)
                </label>
                <FieldBadge required={true} visibility="P" />
              </div>
              <input
                type="text"
                value={attributes.manager_whatsapp || ""}
                onChange={(e) => onChange("manager_whatsapp", e.target.value)}
                placeholder="0812xxxxxxxx"
                maxLength={20}
                className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white placeholder-white/30 outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-white/70">
                Tautan Grup Publik (WhatsApp / Discord)
              </label>
              <FieldBadge required={false} visibility="PB" />
            </div>
            <input
              type="url"
              value={attributes.public_group_link || ""}
              onChange={(e) => onChange("public_group_link", e.target.value)}
              placeholder="https://chat.whatsapp.com/..."
              className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white placeholder-white/30 outline-none font-mono"
            />
          </div>
        </>
      )}

      {/* ==================================================================== */}
      {/* 5. ATRIBUT VENUE & ARENA - SPEC 2.2F                                 */}
      {/* ==================================================================== */}
      {entityType === "venue" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-white/70">
                  Jenis Usaha Venue
                </label>
                <FieldBadge required={true} visibility="PB" />
              </div>
              <select
                value={attributes.venue_type || "icafe"}
                onChange={(e) => onChange("venue_type", e.target.value)}
                className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white outline-none cursor-pointer"
              >
                <option value="icafe" className="bg-[#161A24]">iCafe / Arena Gaming</option>
                <option value="warnet" className="bg-[#161A24]">Warnet Standar</option>
                <option value="warkop_gaming" className="bg-[#161A24]">Warkop / Cafe Gaming</option>
                <option value="arena" className="bg-[#161A24]">Arena Khusus Turnamen</option>
                <option value="bootcamp" className="bg-[#161A24]">Fasilitas Bootcamp Tim</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-white/70">
                  Kapasitas Unit (PC / Konsol)
                </label>
                <FieldBadge required={true} visibility="PB" />
              </div>
              <input
                type="number"
                min={1}
                value={attributes.capacity_units ?? 20}
                onChange={(e) => onChange("capacity_units", parseInt(e.target.value, 10))}
                className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-white/70">
                Alamat Usaha Lengkap
              </label>
              <FieldBadge required={true} visibility="PB" />
            </div>
            <input
              type="text"
              value={attributes.business_address || ""}
              onChange={(e) => onChange("business_address", e.target.value)}
              placeholder="Jl. Khatib Sulaiman No. 45"
              maxLength={200}
              className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white placeholder-white/30 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-white/70">
                  Kecamatan
                </label>
                <FieldBadge required={true} visibility="PB" />
              </div>
              <input
                type="text"
                value={attributes.kecamatan || ""}
                onChange={(e) => onChange("kecamatan", e.target.value)}
                placeholder="mis. Padang Utara"
                className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white placeholder-white/30 outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-white/70">
                  Nagari / Kelurahan
                </label>
                <FieldBadge required={true} visibility="PB" />
              </div>
              <input
                type="text"
                value={attributes.nagari_kelurahan || ""}
                onChange={(e) => onChange("nagari_kelurahan", e.target.value)}
                placeholder="mis. Ulak Karang Selatan"
                className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white placeholder-white/30 outline-none"
              />
            </div>
          </div>

          {/* Titik Koordinat GPS Peta */}
          <div className="p-3.5 rounded-xl bg-[#161A24] border border-white/[0.08]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Titik Koordinat Peta (Esports Map)</span>
              </div>
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={gpsLoading}
                className="px-2.5 py-1 rounded-lg bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 text-[#D4AF37] text-[10px] font-mono font-bold flex items-center gap-1 transition-all"
              >
                <Crosshair className={`w-3 h-3 ${gpsLoading ? "animate-spin" : ""}`} />
                <span>{gpsLoading ? "Mencari GPS..." : "Gunakan Lokasi Saya"}</span>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <input
                type="number"
                step="0.000001"
                value={attributes.coordinates?.lat || -0.9471}
                onChange={(e) =>
                  onChange("coordinates", {
                    ...(attributes.coordinates || { lng: 100.3543 }),
                    lat: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="Latitude (mis. -0.9471)"
                className="h-9 bg-[#0E1118] border border-white/10 rounded-lg px-2.5 text-white/80 outline-none"
              />
              <input
                type="number"
                step="0.000001"
                value={attributes.coordinates?.lng || 100.3543}
                onChange={(e) =>
                  onChange("coordinates", {
                    ...(attributes.coordinates || { lat: -0.9471 }),
                    lng: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="Longitude (mis. 100.3543)"
                className="h-9 bg-[#0E1118] border border-white/10 rounded-lg px-2.5 text-white/80 outline-none"
              />
            </div>
          </div>

          {/* Fasilitas Venue */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-white/70">
                Fasilitas Venue (Centang minimal 1)
              </label>
              <FieldBadge required={true} visibility="PB" />
            </div>
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
        </>
      )}

      {/* ==================================================================== */}
      {/* 6. ATRIBUT KAMPUS (CAMPUS) - SPEC 2.2G (TANPA DAFTAR MAHASISWA)      */}
      {/* ==================================================================== */}
      {entityType === "campus" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-white/70">
                  Nama Perguruan Tinggi
                </label>
                <FieldBadge required={true} visibility="PB" />
              </div>
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
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-white/70">
                  Nama UKM / Komunitas Esport
                </label>
                <FieldBadge required={true} visibility="PB" />
              </div>
              <input
                type="text"
                value={attributes.esport_club_name || ""}
                onChange={(e) => onChange("esport_club_name", e.target.value)}
                placeholder="mis. UKM Esports UNAND"
                maxLength={80}
                className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white placeholder-white/30 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-white/70">
                  Nama Dosen Pembina
                </label>
                <FieldBadge required={true} visibility="PB" />
              </div>
              <input
                type="text"
                value={attributes.advisor_name || ""}
                onChange={(e) => onChange("advisor_name", e.target.value)}
                placeholder="Nama Pembina Kemahasiswaan"
                maxLength={80}
                className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white placeholder-white/30 outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-white/70">
                  Nama Ketua UKM
                </label>
                <FieldBadge required={true} visibility="PB" />
              </div>
              <input
                type="text"
                value={attributes.leader_name || ""}
                onChange={(e) => onChange("leader_name", e.target.value)}
                placeholder="Nama Ketua UKM Aktif"
                maxLength={80}
                className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white placeholder-white/30 outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-white/70">
                WhatsApp Kontak UKM
              </label>
              <FieldBadge required={true} visibility="P" />
            </div>
            <input
              type="text"
              value={attributes.official_whatsapp || ""}
              onChange={(e) => onChange("official_whatsapp", e.target.value)}
              placeholder="0812xxxxxxxx"
              maxLength={20}
              className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white placeholder-white/30 outline-none font-mono"
            />
          </div>
        </>
      )}

      {/* ==================================================================== */}
      {/* 7. ATRIBUT SEKOLAH (SCHOOL) - SPEC 2.2H (TANPA DAFTAR SISWA)         */}
      {/* ==================================================================== */}
      {entityType === "school" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-white/70">
                  Nama Sekolah
                </label>
                <FieldBadge required={true} visibility="PB" />
              </div>
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
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-white/70">
                  Jenjang Pendidikan
                </label>
                <FieldBadge required={true} visibility="PB" />
              </div>
              <select
                value={attributes.education_level || "SMA"}
                onChange={(e) => onChange("education_level", e.target.value)}
                className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white outline-none cursor-pointer"
              >
                <option value="SMA" className="bg-[#161A24]">SMA (Sekolah Menengah Atas)</option>
                <option value="SMK" className="bg-[#161A24]">SMK (Sekolah Menengah Kejuruan)</option>
                <option value="MA" className="bg-[#161A24]">MA (Madrasah Aliyah)</option>
                <option value="SMP" className="bg-[#161A24]">SMP (Sekolah Menengah Pertama)</option>
                <option value="MTs" className="bg-[#161A24]">MTs (Madrasah Tsanawiyah)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-white/70">
                  Nama Ekskul Esport
                </label>
                <FieldBadge required={true} visibility="PB" />
              </div>
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
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-white/70">
                  NPSN (Nomor Pokok Sekolah)
                </label>
                <FieldBadge required={false} visibility="PB" />
              </div>
              <input
                type="text"
                value={attributes.npsn || ""}
                onChange={(e) => onChange("npsn", e.target.value)}
                placeholder="8 digit NPSN"
                maxLength={20}
                className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white placeholder-white/30 outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-white/70">
                  Nama Guru Pembina
                </label>
                <FieldBadge required={true} visibility="PB" />
              </div>
              <input
                type="text"
                value={attributes.advisor_name || ""}
                onChange={(e) => onChange("advisor_name", e.target.value)}
                placeholder="Nama Guru Pembina Ekskul"
                maxLength={80}
                className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white placeholder-white/30 outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-white/70">
                  WhatsApp Guru Pembina
                </label>
                <FieldBadge required={true} visibility="P" />
              </div>
              <input
                type="text"
                value={attributes.advisor_whatsapp || ""}
                onChange={(e) => onChange("advisor_whatsapp", e.target.value)}
                placeholder="0812xxxxxxxx"
                maxLength={20}
                className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl px-3.5 text-xs text-white placeholder-white/30 outline-none font-mono"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2.5 text-xs text-amber-300">
            <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400" />
            <span className="text-[11px] leading-relaxed">
              <strong>Perlindungan Privasi Pelajar:</strong> Sesuai UU PDP No. 27/2022, data daftar siswa dan kontak pribadi siswa dilarang dipublikasikan.
            </span>
          </div>
        </>
      )}

      {/* ==================================================================== */}
      {/* BIO SINGKAT UMUM (MAKSIMAL 160 KARAKTER)                             */}
      {/* ==================================================================== */}
      <div className="mt-2">
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[11px] font-mono uppercase tracking-wider text-white/70">
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
