"use client";

import React, { useState } from "react";
import { X, Save, Loader2, CheckCircle2, AlertTriangle, User, Gamepad2, MapPin } from "lucide-react";
import { Button, Input, Textarea, Select } from "@esport-sumbar/ui";
import { REGIONS, OFFICIAL_GAMES } from "@esport-sumbar/contracts";
import type { UnifiedProfileDetail } from "@/lib/services/public-profiles";
import { updateProfileAction } from "@/app/actions/profile";

export interface ProfileEditDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UnifiedProfileDetail;
  onSuccess?: () => void;
}

export function ProfileEditDrawer({
  isOpen,
  onClose,
  profile,
  onSuccess,
}: ProfileEditDrawerProps) {
  const [displayName, setDisplayName] = useState(profile.displayName || "");
  const [ign, setIgn] = useState(profile.ign || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [roleName, setRoleName] = useState(profile.roleName || "");
  const [game, setGame] = useState(
    profile.mainGameName || profile.attributes?.primary_game || "Mobile Legends: Bang Bang"
  );
  const [regionCode, setRegionCode] = useState(profile.regionCode || "PDG");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl || "");
  const [isLookingForTeam, setIsLookingForTeam] = useState(
    profile.attributes?.is_looking_for_team ?? false
  );

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const result = await updateProfileAction(profile.id, {
        displayName,
        ign,
        bio,
        roleName,
        avatarUrl: avatarUrl || undefined,
        metadata: {
          ...profile.attributes,
          primary_game: game,
          region_code: regionCode,
          is_looking_for_team: isLookingForTeam,
        },
      });

      if (result.success) {
        setMessage({ type: "success", text: "Profil berhasil diperbarui!" });
        if (onSuccess) onSuccess();
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setMessage({
          type: "error",
          text: result.error || "Gagal memperbarui data profil.",
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan sistem.";
      setMessage({ type: "error", text: msg });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Surface */}
      <div className="relative w-full max-w-lg bg-[#0C0C26] border-l border-white/10 h-full overflow-y-auto flex flex-col z-10 shadow-2xl p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-5 mb-6">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-[#FF1752] font-bold uppercase tracking-wider">
              Mode Pemilik
            </span>
            <h2 className="text-xl font-extrabold text-white">Edit Profil Saya</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message notification */}
        {message && (
          <div
            className={`p-3.5 rounded-xl text-xs flex items-center gap-2 mb-6 ${
              message.type === "success"
                ? "bg-[#2BB673]/15 border border-[#2BB673]/30 text-[#2BB673]"
                : "bg-[#F04438]/15 border border-[#F04438]/30 text-[#F04438]"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-1">
          {/* Display Name */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-white/80">Nama Lengkap / Identitas</label>
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Nama lengkap resmi..."
              required
            />
          </div>

          {/* IGN */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-white/80">In-Game Name (IGN) / Alias</label>
            <Input
              value={ign}
              onChange={(e) => setIgn(e.target.value)}
              placeholder="Nickname resmi..."
            />
          </div>

          {/* Game Selection */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-white/80">Cabang Game Utama</label>
            <Select
              value={game}
              onChange={(e) => setGame(e.target.value)}
            >
              {OFFICIAL_GAMES.map((g) => (
                <option key={g.id} value={g.name} className="bg-[#0C0C26] text-white">
                  {g.name} ({g.genre})
                </option>
              ))}
            </Select>
          </div>

          {/* Region Selection */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-white/80">Kota / Kabupaten Domisili</label>
            <Select
              value={regionCode}
              onChange={(e) => setRegionCode(e.target.value)}
            >
              {REGIONS.map((r) => (
                <option key={r.code} value={r.code} className="bg-[#0C0C26] text-white">
                  {r.name} ({r.code})
                </option>
              ))}
            </Select>
          </div>

          {/* Peran / Role */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-white/80">Peran / Posisi dalam Tim</label>
            <Input
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="Contoh: Midlaner / Rusher / IGL..."
            />
          </div>

          {/* Avatar URL */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-white/80">URL Foto Profil / Kartu</label>
            <Input
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>

          {/* Bio */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-white/80">Bio / Profil Singkat</label>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="Ceritakan pengalaman dan fokus esport Anda..."
            />
          </div>

          {/* Looking for Team Toggle */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white">Status Mencari Tim</span>
              <span className="text-[11px] text-white/50">
                Tampilkan lencana &quot;Looking for Team&quot; di profil publik
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsLookingForTeam(!isLookingForTeam)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                isLookingForTeam ? "bg-[#FF1752]" : "bg-white/20"
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  isLookingForTeam ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>

          {/* Footer Submit */}
          <div className="pt-6 border-t border-white/[0.08] mt-auto flex items-center gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isSaving}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSaving}
              className="flex-1"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-1.5" />
                  <span>Simpan Perubahan</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
