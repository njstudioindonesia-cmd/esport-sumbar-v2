"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  MoreVertical,
  ShieldCheck,
  Shield,
  Trophy,
  Users,
  BarChart3,
  Check,
  Share2,
  UserPlus,
  Lock,
  Flag,
  Calendar,
  Sparkles,
  MapPin,
  X,
  Edit3,
} from "lucide-react";
import { MockCardVariant } from "@/data/mockCards";
import { EsportCard } from "@/components/card/EsportCard";

interface MobilePublicProfileProps {
  card: MockCardVariant;
  isQrScan?: boolean;
  isOwner?: boolean;
}

export function MobilePublicProfile({ card, isQrScan = false, isOwner = false }: MobilePublicProfileProps) {
  const router = useRouter();

  // Active tab: Ringkasan, Prestasi, Tim
  const [activeTab, setActiveTab] = useState<"summary" | "achievements" | "team">("summary");

  // Modals & sheets
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [selectedReportReason, setSelectedReportReason] = useState("Data Palsu");
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const triggerHaptic = (ms = 10) => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(ms);
      } catch {
        // Ignored
      }
    }
  };

  const handleActionClick = () => {
    triggerHaptic(20);
    setActionFeedback("Undangan terkirim!");
    setTimeout(() => setActionFeedback(null), 2000);
  };

  const handleShare = () => {
    triggerHaptic();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setActionFeedback("Tautan disalin!");
      setTimeout(() => setActionFeedback(null), 1800);
    }
  };

  const rarityTheme = {
    legend: {
      border: "border-[#D4AF37]",
      glow: "rgba(212, 175, 55, 0.3)",
      accent: "#D4AF37",
    },
    elite: {
      border: "border-[#22C55E]",
      glow: "rgba(34, 197, 94, 0.25)",
      accent: "#22C55E",
    },
    contender: {
      border: "border-[#4C7DFF]",
      glow: "rgba(76, 125, 255, 0.25)",
      accent: "#4C7DFF",
    },
    rookie: {
      border: "border-[#8C5A3C]",
      glow: "rgba(140, 90, 60, 0.25)",
      accent: "#8C5A3C",
    },
  }[card.rarity];

  return (
    <div className="relative w-full min-h-[100dvh] max-w-[420px] mx-auto bg-[#07080C] text-white flex flex-col justify-between pb-24 overflow-x-hidden select-none">
      {/* Background Ambience */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full blur-3xl pointer-events-none transition-colors"
        style={{ backgroundColor: rarityTheme.glow }}
      />

      {/* TOP HEADER: BACK + STATUS BANNER + MORE (3 DOTS) */}
      <header className="sticky top-0 z-30 px-5 pt-3 pb-2 bg-[#07080C]/85 backdrop-blur-xl flex items-center justify-between">
        {/* Tombol Kembali */}
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

        {/* Hasil Scan QR / Status Banner Kecil: Status + Tanggal Berlaku */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0F1118] border border-white/10 shadow-sm">
          {card.verification === "verified" ? (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-[10px] font-mono font-bold text-[#D4AF37] uppercase">
                Terverifikasi
              </span>
              <span className="text-[8px] font-mono text-white/40 ml-0.5">s/d Des 2026</span>
            </>
          ) : card.verification === "regional" ? (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-[#22C55E]" />
              <span className="text-[10px] font-mono font-bold text-[#22C55E] uppercase">
                Regional
              </span>
              <span className="text-[8px] font-mono text-white/40 ml-0.5">2026</span>
            </>
          ) : (
            <>
              <Shield className="w-3.5 h-3.5 text-white/40" />
              <span className="text-[10px] font-mono text-white/40 uppercase">Belum Terdata</span>
            </>
          )}
        </div>

        {/* Ikon Titik Tiga (Laporkan Profil) */}
        <button
          onClick={() => {
            triggerHaptic();
            setIsReportOpen(true);
          }}
          className="w-10 h-10 rounded-full bg-[#161A24] border border-white/[0.08] flex items-center justify-center text-white/70 hover:text-white"
          aria-label="Laporkan"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </header>

      {/* CENTER CONTENT */}
      <div className="px-5 flex flex-col items-center gap-4 pt-2">
        {/* KARTU RESMI 3D PASPOR ATLET */}
        <EsportCard
          type={card.type}
          rarity={card.rarity}
          verification={card.verification}
          data={card.data}
          size="mobile"
          interactive={true}
        />

        {/* DI BAWAH KARTU: 1 BARIS (Nama, Lencana, Wilayah) */}
        <div className="w-full py-1.5 px-3 rounded-full bg-[#161A24]/90 border border-white/[0.08] flex items-center justify-center gap-2 text-xs font-mono text-white/70">
          <span className="font-heading font-bold text-white truncate max-w-[120px]">
            {card.data.displayName}
          </span>
          <span>•</span>
          <span className="text-[#D4AF37] font-semibold">
            {card.verification === "verified" ? "Verified" : "Terdata"}
          </span>
          <span>•</span>
          <span className="text-white/80">{card.data.region.name}</span>
        </div>

        {/* TAB SEGMEN IKON (Ringkasan, Prestasi, Tim) */}
        <div className="w-full flex items-center gap-1.5 p-1 rounded-2xl bg-[#0F1118] border border-white/[0.08]">
          {[
            { id: "summary", label: "Ringkasan", icon: BarChart3 },
            { id: "achievements", label: "Prestasi", icon: Trophy },
            { id: "team", label: "Tim", icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  triggerHaptic();
                  setActiveTab(tab.id as "summary" | "achievements" | "team");
                }}
                className={`flex-1 h-10 rounded-xl flex items-center justify-center gap-1.5 text-xs font-heading font-semibold transition-all ${
                  isActive
                    ? "bg-[#161A24] text-white shadow-sm border border-white/10"
                    : "text-white/50 hover:text-white/80"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#D4AF37]" : ""}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* KONTEN TAB: KARTU KECIL / IKON (Bukan Paragraf) */}
        <div className="w-full min-h-[160px]">
          <AnimatePresence mode="wait">
            {/* 1. RINGKASAN: 3 Angka Besar + Game Tag + Penanda Privasi */}
            {activeTab === "summary" && (
              <motion.div
                key="tab-summary"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="w-full flex flex-col gap-2.5"
              >
                {/* 3 Angka Statistik Besar */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="h-18 rounded-2xl bg-[#161A24] border border-white/[0.06] flex flex-col items-center justify-center">
                    <span className="font-heading font-black text-xl text-white">88</span>
                    <span className="text-[9px] font-mono text-white/40 uppercase">OVR</span>
                  </div>
                  <div className="h-18 rounded-2xl bg-[#161A24] border border-white/[0.06] flex flex-col items-center justify-center">
                    <span className="font-heading font-black text-xl text-[#22C55E]">67%</span>
                    <span className="text-[9px] font-mono text-white/40 uppercase">Win Rate</span>
                  </div>
                  <div className="h-18 rounded-2xl bg-[#161A24] border border-white/[0.06] flex flex-col items-center justify-center">
                    <span className="font-heading font-black text-xl text-[#4C7DFF]">12</span>
                    <span className="text-[9px] font-mono text-white/40 uppercase">Turnamen</span>
                  </div>
                </div>

                {/* Penanda Privasi Aman (Tanpa Data Sensitif Kontak/NIK) */}
                <div className="p-3 rounded-2xl bg-[#0F1118] border border-white/[0.06] flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-white/60">
                    <Lock className="w-3.5 h-3.5 text-[#22C55E]" />
                    <span>Data Pribadi Terlindungi</span>
                  </div>
                  <span className="text-[9px] font-mono text-white/40 uppercase">UU PDP</span>
                </div>
              </motion.div>
            )}

            {/* 2. PRESTASI: Trofi + Tahun + Level Chip + Centang Emas */}
            {activeTab === "achievements" && (
              <motion.div
                key="tab-achievements"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="w-full flex flex-col gap-2"
              >
                {[
                  {
                    title: "Juara 1 • Piala Walikota Padang",
                    year: "2026",
                    level: "Kota",
                    verified: true,
                  },
                  {
                    title: "Runner Up • Kejurprov ESI Sumbar",
                    year: "2025",
                    level: "Provinsi",
                    verified: true,
                  },
                ].map((ach, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-[#161A24] border border-white/[0.08] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/15 text-[#D4AF37] flex items-center justify-center">
                        <Trophy className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-heading font-bold text-xs text-white">
                          {ach.title}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[9px] font-mono text-white/40">
                            {ach.year}
                          </span>
                          <span className="px-1.5 py-0.2 rounded bg-white/[0.06] text-[8px] font-mono text-[#4C7DFF]">
                            {ach.level}
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Centang Emas Tervalidasi */}
                    {ach.verified && (
                      <div
                        className="w-6 h-6 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]"
                        title="Tervalidasi Resmi ESI"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                    )}
                  </div>
                ))}
              </motion.div>
            )}

            {/* 3. TIM: Kartu Tim Ringkas */}
            {activeTab === "team" && (
              <motion.div
                key="tab-team"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="w-full flex flex-col gap-2"
              >
                <div className="p-3.5 rounded-2xl bg-[#161A24] border border-white/[0.08] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0F1118] border border-white/10 flex items-center justify-center text-[#4C7DFF]">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-heading font-bold text-sm text-white">
                        Singkarak Esports
                      </div>
                      <div className="text-[10px] font-mono text-white/50">
                        Divisi MLBB • Starter
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#22C55E]/15 text-[#22C55E] text-[9px] font-mono font-bold">
                    Aktif
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* FIXED BOTTOM BAR: AKSI UTAMA "Ajak Gabung" / "Bagikan" */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[420px] mx-auto p-5 bg-[#07080C]/90 backdrop-blur-xl border-t border-white/[0.08] z-30 flex items-center gap-3">
        {/* Tombol Bagikan Cepat */}
        <button
          onClick={handleShare}
          className="w-14 h-14 rounded-full bg-[#161A24] border border-white/[0.08] hover:border-[#D4AF37] flex items-center justify-center text-white/70 hover:text-[#D4AF37] transition-all"
          aria-label="Bagikan Profil"
        >
          <Share2 className="w-5 h-5" />
        </button>

        {/* Tombol Utama: "Edit Profil" (jika pemilik) atau "Ajak Gabung" (jika publik) */}
        {isOwner ? (
          <Link
            href={`/me/profile/${card.id}/edit`}
            className="flex-1 h-14 rounded-full bg-gradient-to-r from-[#D4AF37] to-amber-400 text-black font-heading font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_8px_24px_rgba(212,175,55,0.3)] transition-all active:scale-[0.98]"
          >
            <Edit3 className="w-4 h-4 text-black" />
            <span>Edit Profil Saya</span>
          </Link>
        ) : (
          <button
            onClick={handleActionClick}
            className="flex-1 h-14 rounded-full bg-[#4C7DFF] text-white hover:bg-[#3B6BE8] font-heading font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_8px_24px_rgba(76,125,255,0.3)] transition-all active:scale-[0.98]"
          >
            <UserPlus className="w-4 h-4" />
            <span>Ajak Gabung</span>
          </button>
        )}
      </div>

      {/* FEEDBACK TOAST RINGKAS */}
      <AnimatePresence>
        {actionFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-[#D4AF37] text-[#07080C] font-heading font-bold text-xs uppercase shadow-xl z-50 flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>{actionFeedback}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BOTTOM SHEET: LAPORKAN PROFIL (Ikon Titik Tiga) */}
      <AnimatePresence>
        {isReportOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsReportOpen(false)}
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

              <div className="flex items-center gap-2">
                <Flag className="w-4 h-4 text-[#EF4444]" />
                <h3 className="font-heading font-bold text-lg text-white">Laporkan Profil</h3>
              </div>

              {/* Pilihan Alasan Pelanggaran sebagai Chip */}
              <div className="flex flex-wrap gap-2 py-1">
                {["Data Palsu", "Joki Akun", "Perilaku Buruk", "Lainnya"].map((reason) => {
                  const isSelected = selectedReportReason === reason;
                  return (
                    <button
                      key={reason}
                      onClick={() => {
                        triggerHaptic();
                        setSelectedReportReason(reason);
                      }}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-heading transition-all border ${
                        isSelected
                          ? "bg-[#EF4444] text-white font-bold border-[#EF4444]"
                          : "bg-[#161A24] text-white/60 border-white/[0.08]"
                      }`}
                    >
                      {reason}
                    </button>
                  );
                })}
              </div>

              {/* Tombol Kirim (1 Kata) */}
              <button
                onClick={() => {
                  triggerHaptic(20);
                  setIsReportOpen(false);
                  setActionFeedback("Laporan terkirim");
                  setTimeout(() => setActionFeedback(null), 2000);
                }}
                className="w-full h-12 rounded-full bg-[#EF4444] text-white font-heading font-bold text-xs uppercase tracking-wider shadow-lg mt-2"
              >
                Kirim
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
