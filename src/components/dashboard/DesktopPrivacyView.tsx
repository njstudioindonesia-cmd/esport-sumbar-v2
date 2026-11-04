"use client";

import React, { useState } from "react";
import {
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertTriangle,
  Trash2,
  Check,
  X,
  ExternalLink,
  Info,
} from "lucide-react";
import { EsportCard } from "@/components/card/EsportCard";
import { GALLERY_CARDS } from "@/data/mockCards";

export function DesktopPrivacyView() {
  const [privacySettings, setPrivacySettings] = useState({
    contact: false, // private
    birthDate: false, // private
    stats: true, // public
    teamHistory: true, // public
    socialLinks: true, // public
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showDangerModal, setShowDangerModal] = useState(false);
  const [confirmIgnInput, setConfirmIgnInput] = useState("");

  const toggleField = (key: keyof typeof privacySettings) => {
    setPrivacySettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  // User card for preview
  const baseCard = GALLERY_CARDS[2];

  // Masked card data for public preview based on active toggles
  const publicPreviewData = {
    ...baseCard.data,
    displayName: baseCard.data.displayName,
    ign: baseCard.data.ign,
    history: privacySettings.teamHistory ? baseCard.data.history : [],
    achievements: privacySettings.stats ? baseCard.data.achievements : [],
  };

  return (
    <div className="w-full flex flex-col gap-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-heading font-black text-white tracking-tight">
          Privasi &amp; Perlindungan Data
        </h1>
        <p className="text-xs text-white/50 mt-1">
          Kontrol visibilitas data publik paspor atlet Anda sesuai amanat Undang-Undang Perlindungan Data Pribadi (UU PDP No. 27/2022).
        </p>
      </div>

      {/* ========================================================= */}
      {/* DUA KOLOM: KIRI TABEL TOGGLE, KANAN PRATINJAU PUBLIK     */}
      {/* ========================================================= */}
      <div className="grid grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* KOLOM KIRI (7/12): TABEL TOGGLE MATA / GEMBOK */}
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">
          <div className="p-7 rounded-3xl bg-[#0F1118]/80 border border-white/[0.08] shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] mb-4">
              <span className="text-xs font-heading font-bold text-white uppercase tracking-wider">
                Pengaturan Visibilitas Field
              </span>
              <span className="text-[10px] font-mono text-white/40">
                Klik ikon untuk mengubah
              </span>
            </div>

            {/* Field Rows */}
            <div className="flex flex-col gap-3">
              {/* 1. NOMOR KONTAK / WA */}
              <div className="p-4 rounded-2xl bg-[#161A24] border border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      privacySettings.contact
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-amber-500/10 text-amber-400"
                    }`}
                  >
                    {privacySettings.contact ? <Eye className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="text-xs font-heading font-bold text-white">
                      Nomor WhatsApp &amp; Kontak Pribadi
                    </div>
                    <div className="text-[11px] text-white/40">
                      {privacySettings.contact
                        ? "Publik dapat melihat nomor kontak Anda"
                        : "Terkunci: Hanya Pengurus ESI yang dapat menghubungi"}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleField("contact")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border ${
                    privacySettings.contact
                      ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                      : "bg-amber-500/15 border-amber-500/30 text-amber-400"
                  }`}
                >
                  {privacySettings.contact ? "PUBLIK" : "PRIVAT"}
                </button>
              </div>

              {/* 2. TANGGAL LAHIR */}
              <div className="p-4 rounded-2xl bg-[#161A24] border border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      privacySettings.birthDate
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-amber-500/10 text-amber-400"
                    }`}
                  >
                    {privacySettings.birthDate ? <Eye className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="text-xs font-heading font-bold text-white">
                      Tanggal Lahir &amp; Usia
                    </div>
                    <div className="text-[11px] text-white/40">
                      {privacySettings.birthDate
                        ? "Tanggal lahir ditampilkan di profil publik"
                        : "Terkunci: Disembunyikan dari profil publik"}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleField("birthDate")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border ${
                    privacySettings.birthDate
                      ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                      : "bg-amber-500/15 border-amber-500/30 text-amber-400"
                  }`}
                >
                  {privacySettings.birthDate ? "PUBLIK" : "PRIVAT"}
                </button>
              </div>

              {/* 3. STATISTIK & PRESTASI */}
              <div className="p-4 rounded-2xl bg-[#161A24] border border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      privacySettings.stats
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-amber-500/10 text-amber-400"
                    }`}
                  >
                    {privacySettings.stats ? <Eye className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="text-xs font-heading font-bold text-white">
                      Statistik &amp; Piagam Prestasi
                    </div>
                    <div className="text-[11px] text-white/40">
                      {privacySettings.stats
                        ? "Terbuka untuk scouting tim & publik"
                        : "Terkunci: Disembunyikan"}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleField("stats")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border ${
                    privacySettings.stats
                      ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                      : "bg-amber-500/15 border-amber-500/30 text-amber-400"
                  }`}
                >
                  {privacySettings.stats ? "PUBLIK" : "PRIVAT"}
                </button>
              </div>

              {/* 4. RIWAYAT TIM */}
              <div className="p-4 rounded-2xl bg-[#161A24] border border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      privacySettings.teamHistory
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-amber-500/10 text-amber-400"
                    }`}
                  >
                    {privacySettings.teamHistory ? <Eye className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="text-xs font-heading font-bold text-white">
                      Riwayat Transfer &amp; Tim Sebelumnya
                    </div>
                    <div className="text-[11px] text-white/40">
                      {privacySettings.teamHistory
                        ? "Menampilkan rekam jejak tim terdahulu"
                        : "Terkunci"}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleField("teamHistory")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border ${
                    privacySettings.teamHistory
                      ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                      : "bg-amber-500/15 border-amber-500/30 text-amber-400"
                  }`}
                >
                  {privacySettings.teamHistory ? "PUBLIK" : "PRIVAT"}
                </button>
              </div>

              {/* 5. NIK / IDENTITAS HUKUM (PERMANENTLY LOCKED) */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.04] flex items-center justify-between opacity-70">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.04] text-white/40 flex items-center justify-center shrink-0">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-heading font-bold text-white">
                      Nomor Induk Kependudukan (NIK)
                    </div>
                    <div className="text-[11px] text-white/40">
                      Wajib Terkunci (Dilindungi UU PDP No. 27/2022)
                    </div>
                  </div>
                </div>
                <span className="px-3 py-1 rounded text-[10px] font-mono text-white/40 bg-white/[0.06]">
                  TERKUNCI
                </span>
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-6 pt-5 border-t border-white/[0.08] flex items-center justify-between">
              {savedSuccess ? (
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                  <Check className="w-4 h-4" />
                  <span>Pengaturan privasi tersimpan.</span>
                </div>
              ) : (
                <div className="text-[11px] font-mono text-white/40">
                  Perubahan langsung diterapkan ke profil publik.
                </div>
              )}

              <button
                type="button"
                onClick={handleSave}
                className="px-6 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#07080C] font-heading font-black text-xs uppercase tracking-wider transition-all shadow-md"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN (5/12): PRATINJAU "TAMPILAN PUBLIK" LANGSUNG */}
        <div className="col-span-12 lg:col-span-5 sticky top-20 flex flex-col items-center">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono text-white/60 mb-5">
            <Eye className="w-3.5 h-3.5 text-[#4C7DFF]" />
            <span>PRATINJAU TAMPILAN PUBLIK</span>
          </div>

          {/* Interactive Card Showing Public View */}
          <div className="p-6 rounded-3xl bg-[#0F1118]/80 border border-white/[0.08] flex flex-col items-center">
            <EsportCard
              type="player"
              rarity="elite"
              verification="verified"
              data={publicPreviewData}
              size="md"
              interactive={true}
            />

            <div className="mt-4 pt-3 border-t border-white/[0.06] w-full text-center">
              <span className="text-[11px] font-mono text-white/40 block">
                Pengunjung luar tidak dapat melihat data bertanda Privat.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* ZONA BERBAHAYA (DANGER ZONE) DENGAN KONFIRMASI 2 LANGKAH */}
      {/* ========================================================= */}
      <div className="p-8 rounded-3xl bg-red-950/20 border border-red-500/30 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <h3 className="font-heading font-black text-base text-red-400 uppercase tracking-wider">
            Zona Berbahaya
          </h3>
        </div>
        <p className="text-xs text-white/60 leading-relaxed max-w-2xl">
          Tindakan di bawah ini bersifat permanen. Menghapus kartu atau menonaktifkan akun akan mencabut nomor verifikasi dan menghapus riwayat kartu Anda dari direktori publik ESPORT SUMBAR™.
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-red-500/20">
          <div>
            <span className="text-xs font-heading font-bold text-white block">
              Hapus Kartu Atlet
            </span>
            <span className="text-[11px] text-white/40">
              Mencabut kartu atlet dari database ESPORT SUMBAR™.
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowDangerModal(true)}
            className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/40 text-red-400 hover:text-red-300 font-heading font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Hapus Kartu</span>
          </button>
        </div>
      </div>

      {/* MODAL KONFIRMASI 2 LANGKAH */}
      {showDangerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl bg-[#0E1118] border border-red-500/40 p-6 flex flex-col gap-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2 text-red-400">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-heading font-black text-sm uppercase">
                  Konfirmasi Hapus Kartu
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowDangerModal(false);
                  setConfirmIgnInput("");
                }}
                className="text-white/40 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-white/70 leading-relaxed">
              Ketik IGN Anda: <strong className="text-[#D4AF37] font-mono">HARIMAU_AIM</strong> di bawah ini untuk mengonfirmasi penghapusan permanen.
            </p>

            <input
              type="text"
              value={confirmIgnInput}
              onChange={(e) => setConfirmIgnInput(e.target.value.toUpperCase())}
              placeholder="HARIMAU_AIM"
              className="w-full h-11 bg-[#161A24] border border-white/10 rounded-xl px-3 font-mono text-sm text-[#D4AF37] placeholder-white/20 outline-none focus:border-red-500"
            />

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => {
                  setShowDangerModal(false);
                  setConfirmIgnInput("");
                }}
                className="px-4 py-2 rounded-xl text-xs font-mono text-white/60 hover:text-white"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={confirmIgnInput !== "HARIMAU_AIM"}
                onClick={() => {
                  setShowDangerModal(false);
                  alert("Kartu paspor berhasil dinonaktifkan.");
                }}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-heading font-black text-xs uppercase tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Hapus Permanen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
