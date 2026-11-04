"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ShieldCheck,
  Shield,
  Clock,
  AlertTriangle,
  Check,
  Upload,
  Camera,
  Lock,
  GraduationCap,
  FileText,
  Gamepad2,
  ChevronRight,
  Info,
  Sparkles,
  Award,
} from "lucide-react";

type VerificationStatusType = "in_progress" | "revision" | "verified";

export function MobileVerificationTracker() {
  const router = useRouter();

  // Demo status state: "in_progress", "revision", "verified"
  const [status, setStatus] = useState<VerificationStatusType>("in_progress");

  // Uploaded proofs mock state
  const [proofs, setProofs] = useState({
    kartuPelajar: true,
    suratRekomendasi: false,
    tangkapanAkun: true,
  });

  // Warning bottom sheet for changing key verified fields
  const [showEditWarningSheet, setShowEditWarningSheet] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerHaptic = (ms = 10) => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(ms);
      } catch {
        // Ignored
      }
    }
  };

  const handleProofUpload = (key: keyof typeof proofs) => {
    triggerHaptic(20);
    setProofs((prev) => ({ ...prev, [key]: !prev[key] }));
    setToastMessage("Berkas berhasil diperbarui.");
    setTimeout(() => setToastMessage(null), 1800);
  };

  // Stepper Steps configuration
  const steps = [
    { id: 1, label: "Diajukan", icon: FileText, date: "01 Nov" },
    { id: 2, label: "Daerah", icon: Shield, date: status !== "revision" ? "02 Nov" : undefined },
    { id: 3, label: "Provinsi", icon: Award, date: status === "verified" ? "03 Nov" : undefined },
    { id: 4, label: "Selesai", icon: ShieldCheck, date: status === "verified" ? "04 Nov" : undefined },
  ];

  const currentStep = status === "verified" ? 4 : status === "revision" ? 2 : 3;

  return (
    <div className="relative w-full min-h-[100dvh] max-w-[420px] mx-auto bg-[#07080C] text-white flex flex-col justify-between pb-24 overflow-x-hidden select-none">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#D4AF37]/8 rounded-full blur-3xl pointer-events-none" />

      {/* TOP HEADER: BACK + STATUS SIMULATOR TOGGLE + PROGRESS RING MASA BERLAKU */}
      <header className="sticky top-0 z-30 px-5 pt-3 pb-2 bg-[#07080C]/85 backdrop-blur-xl flex items-center justify-between">
        <button
          onClick={() => {
            triggerHaptic();
            router.back();
          }}
          className="w-10 h-10 rounded-full bg-[#161A24] border border-white/[0.08] flex items-center justify-center text-white/70 hover:text-white"
          aria-label="Kembali"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        {/* Demo Status Switcher (Kecil di Tengah) */}
        <div className="flex bg-[#161A24] p-1 rounded-full border border-white/[0.08]">
          {(["in_progress", "revision", "verified"] as VerificationStatusType[]).map((st) => (
            <button
              key={st}
              onClick={() => {
                triggerHaptic();
                setStatus(st);
              }}
              className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono uppercase transition-all ${
                status === st ? "bg-[#D4AF37] text-[#07080C] font-bold" : "text-white/40"
              }`}
            >
              {st === "in_progress" ? "Proses" : st === "revision" ? "Revisi" : "Lolos"}
            </button>
          ))}
        </div>

        {/* Cincin Progres Kecil: Sisa Hari Masa Berlaku */}
        <div className="flex items-center gap-1.5" title="Masa Berlaku">
          <div className="relative w-9 h-9 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-white/[0.08]"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[#D4AF37]"
                strokeDasharray="75, 100"
                strokeWidth="3"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-[9px] font-mono font-bold text-[#D4AF37]">
              240
            </span>
          </div>
        </div>
      </header>

      {/* CENTER CONTENT */}
      <div className="px-5 flex flex-col gap-5 pt-3">
        {/* ================================================================== */}
        {/* 1. ATAS: STATUS SAAT INI SEBAGAI SATU KATA BESAR + IKON STATUS     */}
        {/* ================================================================== */}
        <div className="w-full flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">
              Status Verifikasi
            </span>
            <h1 className="font-heading font-black text-3xl tracking-tight text-white mt-0.5">
              {status === "verified"
                ? "TERVERIFIKASI"
                : status === "revision"
                ? "PERLU REVISI"
                : "DIPROSES"}
            </h1>
          </div>

          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-lg ${
              status === "verified"
                ? "bg-[#D4AF37]/15 border-[#D4AF37]/40 text-[#D4AF37]"
                : status === "revision"
                ? "bg-[#F5A524]/15 border-[#F5A524]/40 text-[#F5A524]"
                : "bg-[#4C7DFF]/15 border-[#4C7DFF]/40 text-[#4C7DFF]"
            }`}
          >
            {status === "verified" ? (
              <ShieldCheck className="w-6 h-6" />
            ) : status === "revision" ? (
              <AlertTriangle className="w-6 h-6" />
            ) : (
              <Clock className="w-6 h-6" />
            )}
          </div>
        </div>

        {/* ================================================================== */}
        {/* 2. TENGAH: STEPPER HORIZONTAL GAYA PELACAK PAKET                  */}
        {/* ================================================================== */}
        <div className="w-full p-4 rounded-2xl bg-[#0F1118] border border-white/[0.08] shadow-md">
          <div className="relative w-full flex items-center justify-between">
            {/* Garis Horizontal Penghubung */}
            <div className="absolute top-5 left-6 right-6 h-0.5 bg-white/[0.08] -z-0" />
            <div
              className="absolute top-5 left-6 h-0.5 bg-[#D4AF37] -z-0 transition-all duration-500"
              style={{
                width: `${((currentStep - 1) / (steps.length - 1)) * 82}%`,
              }}
            />

            {/* 4 Titik Stepper */}
            {steps.map((st) => {
              const Icon = st.icon;
              const isCompleted = st.id < currentStep || (status === "verified" && st.id === 4);
              const isCurrent = st.id === currentStep && status !== "verified";

              return (
                <div key={st.id} className="relative z-10 flex flex-col items-center">
                  {/* Titik Icon */}
                  <div
                    className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isCompleted
                        ? "bg-[#D4AF37] text-[#07080C] shadow-[0_0_14px_rgba(212,175,55,0.4)]"
                        : isCurrent
                        ? "bg-[#161A24] border-2 border-[#D4AF37] text-[#D4AF37]"
                        : "bg-[#161A24] border border-white/10 text-white/30"
                    }`}
                  >
                    {isCurrent && (
                      <span className="absolute inset-0 rounded-full bg-[#D4AF37]/30 animate-ping" />
                    )}
                    {isCompleted ? (
                      <Check className="w-4 h-4 stroke-[2.5]" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>

                  {/* Label 1 Kata */}
                  <span
                    className={`text-[10px] font-heading font-bold mt-2 uppercase tracking-wider ${
                      isCompleted || isCurrent ? "text-white" : "text-white/40"
                    }`}
                  >
                    {st.label}
                  </span>

                  {/* Tanggal Singkat Tanpa Nama Admin */}
                  <span className="text-[8px] font-mono text-white/40 mt-0.5">
                    {st.date || "—"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================================================================== */}
        {/* 3. KONDISI "PERLU REVISI": KARTU KUNING + ALASAN + FIELD REVISI   */}
        {/* ================================================================== */}
        {status === "revision" && (
          <div className="p-4 rounded-2xl bg-[#F5A524]/10 border border-[#F5A524]/30 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-[#F5A524]">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-xs font-heading font-bold uppercase tracking-wider">
                Catatan Pemeriksa
              </span>
            </div>

            {/* Alasan Maksimal 2 Baris */}
            <p className="text-xs text-white/90 leading-snug">
              Foto kartu pelajar tidak terbaca jelas. Mohon unggah ulang dengan pencahayaan terang.
            </p>

            {/* Daftar Field yang Perlu Diperbaiki sebagai Chip yang Bisa Diketuk */}
            <div className="flex flex-wrap gap-2 pt-1">
              {["Kartu Pelajar", "In-Game Name"].map((field) => (
                <button
                  key={field}
                  onClick={() => triggerHaptic()}
                  className="px-3 py-1 rounded-full bg-[#F5A524]/20 border border-[#F5A524]/50 text-xs font-mono font-semibold text-[#F5A524] flex items-center gap-1.5 hover:bg-[#F5A524]/30"
                >
                  <span>{field}</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* 4. UNGGAH BUKTI: TIGA TILE IKON BESAR (Kamera/Galeri, Tanpa KTP)  */}
        {/* ================================================================== */}
        <div className="w-full flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/50">
              Dokumen Pendukung
            </span>
            {/* Teks 1 Baris Kepatuhan Privasi: Ikon Gembok + "Hanya dilihat admin" */}
            <div className="flex items-center gap-1 text-[9px] font-mono text-[#22C55E]">
              <Lock className="w-3 h-3" />
              <span>Hanya dilihat admin</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {/* Tile 1: Kartu Pelajar */}
            <div
              onClick={() => handleProofUpload("kartuPelajar")}
              className={`h-28 rounded-2xl border p-2.5 flex flex-col justify-between cursor-pointer transition-all active:scale-95 ${
                proofs.kartuPelajar
                  ? "bg-[#D4AF37]/10 border-[#D4AF37]/40 text-white"
                  : "bg-[#161A24] border-white/[0.08] text-white/50 hover:text-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <GraduationCap className={`w-5 h-5 ${proofs.kartuPelajar ? "text-[#D4AF37]" : ""}`} />
                {proofs.kartuPelajar ? (
                  <Check className="w-3.5 h-3.5 text-[#22C55E] stroke-[3]" />
                ) : (
                  <Camera className="w-3.5 h-3.5 text-white/40" />
                )}
              </div>
              <div>
                <span className="text-[11px] font-heading font-bold block leading-tight">
                  Kartu Pelajar
                </span>
                <span className="text-[8px] font-mono text-white/40">
                  {proofs.kartuPelajar ? "Terunggah" : "Ketuk Unggah"}
                </span>
              </div>
            </div>

            {/* Tile 2: Surat Rekomendasi */}
            <div
              onClick={() => handleProofUpload("suratRekomendasi")}
              className={`h-28 rounded-2xl border p-2.5 flex flex-col justify-between cursor-pointer transition-all active:scale-95 ${
                proofs.suratRekomendasi
                  ? "bg-[#D4AF37]/10 border-[#D4AF37]/40 text-white"
                  : "bg-[#161A24] border-white/[0.08] text-white/50 hover:text-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <FileText className={`w-5 h-5 ${proofs.suratRekomendasi ? "text-[#D4AF37]" : ""}`} />
                {proofs.suratRekomendasi ? (
                  <Check className="w-3.5 h-3.5 text-[#22C55E] stroke-[3]" />
                ) : (
                  <Camera className="w-3.5 h-3.5 text-white/40" />
                )}
              </div>
              <div>
                <span className="text-[11px] font-heading font-bold block leading-tight">
                  Rekomendasi
                </span>
                <span className="text-[8px] font-mono text-white/40">
                  {proofs.suratRekomendasi ? "Terunggah" : "Ketuk Unggah"}
                </span>
              </div>
            </div>

            {/* Tile 3: Tangkapan Akun */}
            <div
              onClick={() => handleProofUpload("tangkapanAkun")}
              className={`h-28 rounded-2xl border p-2.5 flex flex-col justify-between cursor-pointer transition-all active:scale-95 ${
                proofs.tangkapanAkun
                  ? "bg-[#D4AF37]/10 border-[#D4AF37]/40 text-white"
                  : "bg-[#161A24] border-white/[0.08] text-white/50 hover:text-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <Gamepad2 className={`w-5 h-5 ${proofs.tangkapanAkun ? "text-[#D4AF37]" : ""}`} />
                {proofs.tangkapanAkun ? (
                  <Check className="w-3.5 h-3.5 text-[#22C55E] stroke-[3]" />
                ) : (
                  <Camera className="w-3.5 h-3.5 text-white/40" />
                )}
              </div>
              <div>
                <span className="text-[11px] font-heading font-bold block leading-tight">
                  Tangkapan Akun
                </span>
                <span className="text-[8px] font-mono text-white/40">
                  {proofs.tangkapanAkun ? "Terunggah" : "Ketuk Unggah"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FIXED BOTTOM ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[420px] mx-auto p-5 bg-[#07080C]/90 backdrop-blur-xl border-t border-white/[0.08] z-30">
        {status === "revision" ? (
          <button
            onClick={() => {
              triggerHaptic(20);
              setStatus("in_progress");
              setToastMessage("Pengajuan revisi dikirim.");
              setTimeout(() => setToastMessage(null), 2000);
            }}
            className="w-full h-14 rounded-full bg-[#F5A524] text-[#07080C] font-heading font-bold text-sm tracking-wider uppercase shadow-[0_8px_24px_rgba(245,165,36,0.3)] transition-all active:scale-[0.98]"
          >
            Perbaiki
          </button>
        ) : status === "verified" ? (
          <button
            onClick={() => {
              triggerHaptic();
              setShowEditWarningSheet(true);
            }}
            className="w-full h-14 rounded-full bg-[#161A24] border border-white/[0.08] hover:border-[#D4AF37] text-white font-heading font-bold text-sm tracking-wider uppercase transition-all active:scale-[0.98]"
          >
            Ubah Data
          </button>
        ) : (
          <button
            onClick={() => {
              triggerHaptic(20);
              setToastMessage("Data verifikasi telah tersimpan.");
              setTimeout(() => setToastMessage(null), 1800);
            }}
            className="w-full h-14 rounded-full bg-[#D4AF37] text-[#07080C] font-heading font-bold text-sm tracking-wider uppercase shadow-[0_8px_24px_rgba(212,175,55,0.3)] transition-all active:scale-[0.98]"
          >
            Simpan Bukti
          </button>
        )}
      </div>

      {/* FEEDBACK TOAST */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-[#D4AF37] text-[#07080C] font-heading font-bold text-xs uppercase shadow-xl z-50 flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BOTTOM SHEET: KONFIRMASI RINGKAS SEBELUM MENGUBAH DATA TERVERIFIKASI */}
      <AnimatePresence>
        {showEditWarningSheet && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEditWarningSheet(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed bottom-0 left-0 right-0 max-w-[420px] mx-auto bg-[#0F1118]/95 border-t border-white/[0.08] backdrop-blur-2xl rounded-t-[28px] p-6 z-50 flex flex-col gap-4 shadow-2xl"
            >
              <div className="w-10 h-1 rounded-full bg-white/20 mx-auto" />

              <div className="flex items-center gap-2.5 text-[#F5A524]">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-heading font-bold text-lg text-white">Ubah Data Kunci?</h3>
              </div>

              {/* Teks Maksimal 2 Baris */}
              <p className="text-xs text-white/80 leading-snug">
                Mengubah data kunci akan memicu verifikasi ulang berjenjang oleh ESI Pengprov Sumbar.
              </p>

              {/* 2 Tombol: Lanjut Ubah & Batal */}
              <div className="grid grid-cols-2 gap-3 mt-2">
                <button
                  onClick={() => setShowEditWarningSheet(false)}
                  className="h-12 rounded-full bg-[#161A24] border border-white/[0.08] text-white font-heading font-semibold text-xs uppercase tracking-wider"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    triggerHaptic();
                    setShowEditWarningSheet(false);
                    router.push("/me/settings");
                  }}
                  className="h-12 rounded-full bg-[#F5A524] text-[#07080C] font-heading font-bold text-xs uppercase tracking-wider shadow-md"
                >
                  Lanjut Ubah
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
