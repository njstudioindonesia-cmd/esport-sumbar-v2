"use client";

import React, { useState } from "react";
import {
  X,
  Lock,
  Eye,
  EyeOff,
  ShieldAlert,
  Save,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import { Button } from "@esport-sumbar/ui";
import type { UnifiedProfileDetail } from "@/lib/services/public-profiles";

export interface PrivacySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UnifiedProfileDetail;
}

export function PrivacySettingsModal({
  isOpen,
  onClose,
  profile,
}: PrivacySettingsModalProps) {
  const [hideContact, setHideContact] = useState(
    profile.attributes?.hide_contact ?? true
  );
  const [hideExactLocation, setHideExactLocation] = useState(
    profile.attributes?.hide_exact_location ?? true
  );
  const [allowSearchIndexing, setAllowSearchIndexing] = useState(
    profile.attributes?.allow_search_indexing ?? true
  );
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Surface */}
      <div className="relative w-full max-w-lg bg-[#0C0C26] border border-white/10 rounded-2xl p-6 sm:p-8 z-10 shadow-2xl flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#FF1752]/10 text-[#FF1752] border border-[#FF1752]/20">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Privasi &amp; Izin Data</h3>
              <p className="text-[11px] text-white/50">Kepatuhan UU Perlindungan Data Pribadi (UU PDP)</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success Notice */}
        {isSaved && (
          <div className="p-3.5 rounded-xl bg-[#2BB673]/15 border border-[#2BB673]/30 text-[#2BB673] text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Pengaturan privasi berhasil diperbarui!</span>
          </div>
        )}

        {/* Toggles */}
        <div className="flex flex-col gap-4">
          {/* Toggle 1: Contact info */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white">Lindungi Kontak Pribadi</span>
              <span className="text-[11px] text-white/50">
                Sembunyikan alamat surel dan nomor kontak dari pengunjung publik tanpa login
              </span>
            </div>
            <button
              type="button"
              onClick={() => setHideContact(!hideContact)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                hideContact ? "bg-[#2BB673]" : "bg-white/20"
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  hideContact ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>

          {/* Toggle 2: Location */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white">Privasi Lokasi Domisili</span>
              <span className="text-[11px] text-white/50">
                Hanya tampilkan Kota / Kabupaten, sembunyikan alamat jalan atau kecamatan
              </span>
            </div>
            <button
              type="button"
              onClick={() => setHideExactLocation(!hideExactLocation)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                hideExactLocation ? "bg-[#2BB673]" : "bg-white/20"
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  hideExactLocation ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>

          {/* Toggle 3: Search indexing */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white">Indeks Mesin Pencari</span>
              <span className="text-[11px] text-white/50">
                Izinkan profil muncul dalam pencarian direktori publik ESPORT SUMBAR
              </span>
            </div>
            <button
              type="button"
              onClick={() => setAllowSearchIndexing(!allowSearchIndexing)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                allowSearchIndexing ? "bg-[#FF1752]" : "bg-white/20"
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  allowSearchIndexing ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/[0.08] flex items-center justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button type="button" variant="primary" onClick={handleSave}>
            <Save className="w-4 h-4 mr-1.5" />
            <span>Terapkan Pengaturan</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
