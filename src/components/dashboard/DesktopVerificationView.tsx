"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Lock,
  Clock,
  FileText,
  Calendar,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export function DesktopVerificationView() {
  const [activeHighlight, setActiveHighlight] = useState<string | null>(null);

  // Verification Steps (Package Tracker style)
  const steps = [
    { id: 1, name: "Diajukan", date: "12 Jan 2026", status: "completed" },
    { id: 2, name: "Daerah", date: "15 Jan 2026", status: "completed" },
    { id: 3, name: "Provinsi", date: "Dalam Review", status: "active" },
    { id: 4, name: "Selesai", date: "Mendatang", status: "upcoming" },
  ];

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-black text-white tracking-tight">
            Status Verifikasi Resmi
          </h1>
          <p className="text-xs text-white/50 mt-1">
            Pelacakan validasi berjenjang oleh Pengcab Kota/Kabupaten dan Pengprov ESI Sumatera Barat.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-xs font-mono text-[#D4AF37]">
          <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
          <span>TAHAP 3 • PROVINSI</span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. TRACKER HORIZONTAL BERGAYA PELACAK PAKET               */}
      {/* ========================================================= */}
      <div className="p-8 rounded-3xl bg-[#0F1118]/80 border border-white/[0.08] shadow-2xl backdrop-blur-xl">
        <div className="relative flex items-center justify-between max-w-4xl mx-auto px-8">
          {/* Connecting Line */}
          <div className="absolute left-16 right-16 top-6 h-0.5 bg-white/[0.08] -z-0">
            <div className="h-full bg-gradient-to-r from-emerald-500 via-[#D4AF37] to-transparent w-[65%]" />
          </div>

          {/* Stepper Nodes */}
          {steps.map((st) => (
            <div key={st.id} className="relative z-10 flex flex-col items-center">
              {st.status === "completed" ? (
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              ) : st.status === "active" ? (
                <div className="relative w-12 h-12 rounded-2xl bg-[#D4AF37]/20 border-2 border-[#D4AF37] text-[#D4AF37] flex items-center justify-center shadow-[0_0_24px_rgba(212,175,55,0.5)]">
                  <span className="w-4 h-4 rounded-full bg-[#D4AF37] animate-pulse" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-[#161A24] border border-white/[0.08] text-white/30 flex items-center justify-center">
                  <span className="font-mono text-sm font-bold">04</span>
                </div>
              )}

              <div className="text-center mt-3">
                <div
                  className={`text-sm font-heading font-bold ${
                    st.status === "active"
                      ? "text-[#D4AF37]"
                      : st.status === "completed"
                      ? "text-white"
                      : "text-white/40"
                  }`}
                >
                  {st.name}
                </div>
                <div className="text-[10px] font-mono text-white/40 mt-0.5">
                  {st.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. PANEL "PERLU REVISI" KUNING (MAKS 2 BARIS + CHIP)      */}
      {/* ========================================================= */}
      <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-black text-sm text-amber-400">
                Catatan Pemeriksaan Pengcab Padang
              </span>
              <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-amber-500/20 text-amber-300">
                REVISI RINGAN
              </span>
            </div>
            <p className="text-xs text-white/80 leading-relaxed mt-1 max-w-2xl">
              Foto identitas KTP/KIA buram pada bagian NIK. Piagam turnamen belum mencantumkan stempel legalisir panitia resmi.
            </p>
          </div>
        </div>

        {/* Clickable Field Chips */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveHighlight("ktp")}
            className="px-3 py-1.5 rounded-xl bg-[#0F1118] hover:bg-black border border-amber-500/40 text-amber-300 text-xs font-mono font-bold transition-all"
          >
            # Foto KTP
          </button>
          <button
            type="button"
            onClick={() => setActiveHighlight("piagam")}
            className="px-3 py-1.5 rounded-xl bg-[#0F1118] hover:bg-black border border-amber-500/40 text-amber-300 text-xs font-mono font-bold transition-all"
          >
            # Piagam Turnamen
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. DUA KOLOM: 3 TILE BUKTI BESAR & CINCIN MASA BERLAKU    */}
      {/* ========================================================= */}
      <div className="grid grid-cols-12 gap-8 items-start">
        {/* KOLOM KIRI (8 COLS): 3 TILE BESAR UNGGAH BUKTI */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-heading font-black text-base text-white">
              Dokumen Bukti Pendukung
            </h3>
            <span className="text-[11px] font-mono text-white/40">
              Enkripsi AES-256 • Sesuai UU PDP No. 27/2022
            </span>
          </div>

          {/* 3 Large Tiles (Seret-Lepas) dengan Ikon Gembok */}
          {[
            {
              id: "ktp",
              title: "Kartu Tanda Penduduk / KIA",
              desc: "KTP asli domisili Sumatera Barat untuk verifikasi NIK dan usia.",
              fileName: "ktp_sutan_harimau_padang.jpg",
              status: "Perlu Upload Ulang",
            },
            {
              id: "piagam",
              title: "Piagam Juara / Prestasi Turnamen",
              desc: "Sertifikat turnamen resmi PBESI atau Kejurda tingkat kota/provinsi.",
              fileName: "sertifikat_juara_walikota_2025.pdf",
              status: "Perlu Stempel",
            },
            {
              id: "rekomendasi",
              title: "Surat Rekomendasi Klub / Pengcab",
              desc: "Surat pengantar resmi dari pengurus cabang atau manajer tim terdaftar.",
              fileName: "surat_rekomendasi_pbesi_pdg.pdf",
              status: "Terverifikasi",
            },
          ].map((tile) => {
            const isHighlighted = activeHighlight === tile.id;
            return (
              <div
                key={tile.id}
                className={`p-6 rounded-3xl bg-[#0F1118]/80 border transition-all flex items-center justify-between group ${
                  isHighlighted
                    ? "border-amber-400 ring-2 ring-amber-400/30 bg-amber-500/5 shadow-xl"
                    : "border-white/[0.08] hover:border-white/20"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#161A24] border border-white/10 flex items-center justify-center text-[#D4AF37] group-hover:scale-105 transition-transform shrink-0">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-black text-sm text-white">
                        {tile.title}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                          tile.status === "Terverifikasi"
                            ? "bg-emerald-500/15 text-emerald-400"
                            : "bg-amber-500/15 text-amber-400"
                        }`}
                      >
                        {tile.status}
                      </span>
                    </div>
                    <p className="text-xs text-white/50 leading-relaxed mt-0.5">
                      {tile.desc}
                    </p>
                    <span className="text-[10px] font-mono text-white/40 block mt-1">
                      File: {tile.fileName}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => alert(`Membuka dialog unggah file untuk: ${tile.title}`)}
                  className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-[#D4AF37] hover:text-[#07080C] border border-white/10 text-xs font-mono font-bold text-white transition-all flex items-center gap-1.5 shrink-0"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Unggah Baru</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* KOLOM KANAN (4 COLS): CINCIN SISA MASA BERLAKU & BADGE */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          {/* Cincin Sisa Masa Berlaku */}
          <div className="p-6 rounded-3xl bg-[#0F1118]/80 border border-white/[0.08] flex flex-col items-center text-center">
            <span className="text-xs font-mono uppercase tracking-widest text-white/40 mb-4">
              MASA BERLAKU LISENSI
            </span>

            {/* Circular Gauge Ring */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="#D4AF37"
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 50}
                  strokeDashoffset={2 * Math.PI * 50 * (1 - 312 / 365)}
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="font-mono font-black text-2xl text-white">
                  312
                </span>
                <span className="text-[10px] font-mono text-white/40 uppercase">
                  HARI TERSISA
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/[0.08] w-full text-xs">
              <div className="flex items-center justify-between text-white/60 font-mono">
                <span>Berlaku s/d:</span>
                <span className="text-white font-bold">24 Des 2026</span>
              </div>
              <div className="flex items-center justify-between text-white/60 font-mono mt-1">
                <span>No. Lencana:</span>
                <span className="text-[#D4AF37] font-bold">ESI-SB-2025-0042</span>
              </div>
            </div>
          </div>

          {/* Otoritas PBESI Sumbar Guarantee */}
          <div className="p-5 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-xs font-heading font-black text-[#D4AF37]">
                Jaminan Pengprov ESI Sumbar
              </span>
            </div>
            <p className="text-[11px] text-white/70 leading-relaxed">
              Verifikasi kartu paspor resmi dikeluarkan secara tunggal oleh Pengprov ESI Sumatera Barat sesuai AD/ART PBESI.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
