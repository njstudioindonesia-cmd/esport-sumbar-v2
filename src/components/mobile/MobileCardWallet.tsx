"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Share2,
  Download,
  QrCode,
  Info,
  RotateCw,
  Plus,
  ShieldCheck,
  Shield,
  Award,
  Trophy,
  Users,
  Check,
  X,
  Sparkles,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { GALLERY_CARDS, MockCardVariant } from "@/data/mockCards";
import { mapVerificationToCard } from "@/types/card";
import { MobileBottomBar } from "./MobileBottomBar";

export function MobileCardWallet() {
  const router = useRouter();

  const [dbCards, setDbCards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Muat kartu nyata pengguna dari Supabase database
  useEffect(() => {
    async function loadUserCards() {
      try {
        const res = await fetch("/api/me/profiles");
        if (res.ok) {
          const json = await res.json();
          if (json.profiles && json.profiles.length > 0) {
            const mapped = json.profiles.map((p: any) => ({
              id: p.id,
              type: p.entityType || "player",
              rarity: p.rarityTier || "rookie",
              verification: mapVerificationToCard(p.verificationStatus),
              slug: p.slug,
              data: {
                esportId: p.esportId,
                displayName: p.displayName,
                ign: p.ign || undefined,
                avatarUrl: p.avatarUrl || undefined,
                region: {
                  name: p.regionName || "Sumatera Barat",
                  code: p.regionCode || "SB",
                },
                game: p.mainGameName || "Esport",
                role: p.roleName || undefined,
              },
            }));
            setDbCards(mapped);
          }
        }
      } catch (e) {
        console.warn("MobileCardWallet load error:", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadUserCards();
  }, []);

  const myCards = dbCards.length > 0 ? dbCards : [];

  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Sheets state
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [shareFormat, setShareFormat] = useState<"story" | "feed">("story");
  const [copiedLink, setCopiedLink] = useState(false);

  const activeCard = myCards[activeCardIndex] || myCards[0] || null;

  const triggerHaptic = (ms = 12) => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(ms);
      } catch {
        // Ignored
      }
    }
  };

  const handleFlip = () => {
    triggerHaptic(15);
    setIsFlipped(!isFlipped);
  };

  const handleSelectCard = (idx: number) => {
    if (idx !== activeCardIndex) {
      triggerHaptic(10);
      setActiveCardIndex(idx);
      setIsFlipped(false);
    }
  };

  // Color theme mapping by rarity
  const rarityMap = {
    legend: {
      border: "border-[#D4AF37]",
      glow: "rgba(212, 175, 55, 0.35)",
      accent: "#D4AF37",
      label: "LEGEND",
    },
    elite: {
      border: "border-[#22C55E]",
      glow: "rgba(34, 197, 94, 0.3)",
      accent: "#22C55E",
      label: "ELITE",
    },
    contender: {
      border: "border-[#4C7DFF]",
      glow: "rgba(76, 125, 255, 0.3)",
      accent: "#4C7DFF",
      label: "CONTENDER",
    },
    rookie: {
      border: "border-[#8C5A3C]",
      glow: "rgba(140, 90, 60, 0.3)",
      accent: "#8C5A3C",
      label: "ROOKIE",
    },
  };
  const currentRarityKey = (activeCard?.rarity as keyof typeof rarityMap) || "rookie";
  const rarityTheme = rarityMap[currentRarityKey] || rarityMap.rookie;

  return (
    <div className="relative w-full min-h-[100dvh] max-w-[420px] mx-auto bg-[#07080C] text-white flex flex-col justify-between pb-28 overflow-x-hidden select-none">
      {/* Background Ambience (Radial Glow Sesuai Rarity Kartu Aktif) */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-colors duration-500"
        style={{ backgroundColor: rarityTheme.glow }}
      />

      {/* TOP HEADER: JUDUL MAKS 2 KATA + INFO ICON + TOMBOL TAMBAH KARTU */}
      <div className="sticky top-0 z-30 px-5 pt-3 pb-2 bg-[#07080C]/80 backdrop-blur-xl flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">
            Dompet Digital
          </span>
          <h1 className="font-heading font-bold text-xl text-white">Kartu Saya</h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Ikon i: Membuka Bottom Sheet Info Tier & Lencana */}
          <button
            onClick={() => {
              triggerHaptic();
              setIsInfoOpen(true);
            }}
            className="w-9 h-9 rounded-full bg-[#161A24] border border-white/[0.08] flex items-center justify-center text-white/70 hover:text-white"
            aria-label="Info Kartu"
          >
            <Info className="w-4 h-4" />
          </button>

          {/* Tombol "+" Mengambang: Buat Profil / Kartu Baru */}
          <Link
            href="/me/profile/new"
            onClick={() => triggerHaptic()}
            className="h-9 px-3 rounded-full bg-[#D4AF37] text-[#07080C] font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-[0_4px_16px_rgba(212,175,55,0.3)]"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Baru</span>
          </Link>
        </div>
      </div>

      {activeCard ? (
        <>
          {/* STACK SELECTOR MINI DI ATAS (3 Kartu Pengguna Tersusun Rapi) */}
      <div className="px-5 pt-1 flex items-center gap-2 z-20">
        {myCards.map((c, idx) => {
          const isActive = idx === activeCardIndex;
          return (
            <button
              key={c.id}
              onClick={() => handleSelectCard(idx)}
              className={`flex-1 h-9 rounded-xl border text-[11px] font-mono font-bold uppercase transition-all truncate px-2 ${
                isActive
                  ? "bg-white/10 text-white border-white/30 shadow-md"
                  : "bg-[#161A24]/60 text-white/40 border-white/[0.04] hover:text-white/70"
              }`}
            >
              {c.type === "player" ? "Player" : c.type === "coach" ? "Pelatih" : "Tim"}
            </button>
          );
        })}
      </div>

      {/* DETAIL KARTU HERO DI TENGAH: 3D TILT & FLIP VERTICAL */}
      <div className="relative w-full flex-1 flex flex-col items-center justify-center px-6 py-4 z-10 [perspective:1200px]">
        {/* Flip Instruction Hint (1 baris teks kecil) */}
        <div
          onClick={handleFlip}
          className="mb-2 text-[10px] font-mono text-white/40 flex items-center gap-1 cursor-pointer hover:text-white/70 transition-colors"
        >
          <RotateCw className="w-3 h-3" />
          <span>Ketuk untuk membalik kartu</span>
        </div>

        {/* 3D FLIPPABLE CARD CONTAINER */}
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ type: "spring", damping: 22, stiffness: 180 }}
          onClick={handleFlip}
          className="relative w-64 h-96 [transform-style:preserve-3d] cursor-pointer"
        >
          {/* ============================================================== */}
          {/* SISI DEPAN: KARTU IDENTITAS DIGITAL TCG                        */}
          {/* ============================================================== */}
          <div
            className={`absolute inset-0 [backface-visibility:hidden] rounded-[22px] bg-gradient-to-b from-[#1C202E] via-[#121622] to-[#0A0D15] border-2 ${rarityTheme.border} p-4 flex flex-col justify-between overflow-hidden shadow-2xl`}
            style={{ boxShadow: `0 16px 40px ${rarityTheme.glow}` }}
          >
            {/* Top Row: Rarity Tag + Verification Badge (Dua Elemen Terpisah) */}
            <div className="w-full flex items-center justify-between z-10">
              <span
                className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider"
                style={{ backgroundColor: `${rarityTheme.accent}25`, color: rarityTheme.accent }}
              >
                {rarityTheme.label}
              </span>

              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-[8px] font-mono">
                {activeCard.verification === "verified" ? (
                  <>
                    <ShieldCheck className="w-3 h-3 text-[#D4AF37]" />
                    <span className="text-[#D4AF37] font-bold">VERIFIED</span>
                  </>
                ) : activeCard.verification === "regional" ? (
                  <>
                    <ShieldCheck className="w-3 h-3 text-[#22C55E]" />
                    <span className="text-[#22C55E] font-bold">REGIONAL</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-3 h-3 text-white/40" />
                    <span className="text-white/40">UNVERIFIED</span>
                  </>
                )}
              </div>
            </div>

            {/* Avatar / Photo */}
            <div className="relative w-full flex-1 flex flex-col items-center justify-center my-1 z-10">
              <div className="relative w-28 h-28 rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-[#07080C]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeCard.data.avatarUrl}
                  alt={activeCard.data.displayName}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="text-center mt-2.5">
                <h2 className="font-heading font-black text-lg text-white tracking-wide">
                  {activeCard.data.displayName}
                </h2>
                <span className="text-xs font-mono font-bold text-[#D4AF37] block mt-0.5">
                  @{activeCard.data.ign || activeCard.data.displayName}
                </span>
              </div>
            </div>

            {/* Footer: Game, Role, ESPORT ID */}
            <div className="w-full pt-2 border-t border-white/[0.08] flex items-center justify-between text-[9px] font-mono text-white/70 z-10">
              <span className="truncate max-w-[120px] text-white/80">
                {activeCard.data.game} • {activeCard.data.role}
              </span>
              <span className="font-bold text-[#D4AF37]">{activeCard.data.region.code}</span>
            </div>
          </div>

          {/* ============================================================== */}
          {/* SISI BELAKANG: PRESTASI & RIWAYAT (Ikon + Angka + Nama Singkat)*/}
          {/* ============================================================== */}
          <div
            className={`absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-[22px] bg-gradient-to-b from-[#141824] via-[#0E111A] to-[#07090F] border-2 ${rarityTheme.border} p-4 flex flex-col justify-between overflow-hidden shadow-2xl`}
            style={{ boxShadow: `0 16px 40px ${rarityTheme.glow}` }}
          >
            {/* Header Belakang: OVR & ESPORT ID */}
            <div className="w-full flex items-center justify-between border-b border-white/[0.08] pb-2 text-[10px] font-mono">
              <span className="text-[#D4AF37] font-bold">REKAM JEJAK</span>
              <span className="text-white/40">{activeCard.data.esportId}</span>
            </div>

            {/* Konten Prestasi & Riwayat Singkat */}
            <div className="flex-1 flex flex-col justify-center gap-3 py-2">
              {/* Prestasi */}
              <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-heading font-bold text-white block">
                    Juara 1 • Walikota Padang
                  </span>
                  <span className="text-[9px] font-mono text-white/40">2026 • Kota</span>
                </div>
              </div>

              {/* Riwayat Tim */}
              <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#4C7DFF]/20 flex items-center justify-center text-[#4C7DFF]">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-heading font-bold text-white block">
                    Singkarak Esports
                  </span>
                  <span className="text-[9px] font-mono text-white/40">2025 - Sekarang</span>
                </div>
              </div>

              {/* Rating OVR */}
              <div className="flex items-center justify-around py-1 text-center">
                <div>
                  <span className="text-2xl font-heading font-black text-white block">88</span>
                  <span className="text-[9px] font-mono text-white/40 uppercase">OVR</span>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div>
                  <span className="text-2xl font-heading font-black text-[#22C55E] block">67%</span>
                  <span className="text-[9px] font-mono text-white/40 uppercase">Win Rate</span>
                </div>
              </div>
            </div>

            {/* Footer Belakang: QR Hint */}
            <div className="w-full text-center pt-2 border-t border-white/[0.08]">
              <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">
                Paspor Digital ESPORT SUMBAR™
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 3 AKSI IKON BULAT (Bagikan, Unduh, QR) + 1 TOMBOL UTAMA KONTEKSTUAL */}
      <div className="px-6 flex flex-col gap-3.5 z-20">
        {/* Baris 3 Aksi Ikon Bulat */}
        <div className="flex items-center justify-center gap-5">
          {/* 1. Bagikan */}
          <button
            onClick={() => {
              triggerHaptic();
              setIsShareOpen(true);
            }}
            className="w-13 h-13 rounded-full bg-[#161A24] border border-white/[0.08] hover:border-[#D4AF37] text-white/80 hover:text-[#D4AF37] flex items-center justify-center shadow-lg transition-all active:scale-95"
            aria-label="Bagikan"
          >
            <Share2 className="w-5 h-5" />
          </button>

          {/* 2. Unduh Kartu */}
          <button
            onClick={() => {
              triggerHaptic(25);
              alert("Kartu atlet berhasil disimpan ke perangkat.");
            }}
            className="w-13 h-13 rounded-full bg-[#161A24] border border-white/[0.08] hover:border-[#4C7DFF] text-white/80 hover:text-[#4C7DFF] flex items-center justify-center shadow-lg transition-all active:scale-95"
            aria-label="Unduh"
          >
            <Download className="w-5 h-5" />
          </button>

          {/* 3. Tampilkan QR Code */}
          <button
            onClick={() => {
              triggerHaptic();
              setIsQrOpen(true);
            }}
            className="w-13 h-13 rounded-full bg-[#161A24] border border-white/[0.08] hover:border-[#D4AF37] text-white/80 hover:text-[#D4AF37] flex items-center justify-center shadow-lg transition-all active:scale-95"
            aria-label="QR Code"
          >
            <QrCode className="w-5 h-5" />
          </button>
        </div>

        {/* SATU TOMBOL UTAMA KONTEKSTUAL (Lebar Penuh, Tinggi 56px) */}
        <Link
          href="/me/verification"
          onClick={() => triggerHaptic()}
          className="w-full h-14 rounded-full bg-[#D4AF37] text-[#07080C] hover:bg-[#E5C158] font-heading font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_8px_24px_rgba(212,175,55,0.3)] transition-all active:scale-[0.98]"
        >
          <span>Ajukan Verifikasi</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </>
  ) : (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center gap-4 z-20">
      <div className="w-16 h-16 rounded-full bg-[#FF1752]/10 border border-[#FF1752]/30 flex items-center justify-center text-[#FF1752] shadow-lg shadow-[#FF1752]/15">
        <Sparkles className="w-8 h-8" />
      </div>
      <div>
        <h3 className="font-heading font-black text-xl text-white">Belum Ada Kartu Paspor</h3>
        <p className="text-xs text-white/50 max-w-xs mt-1 leading-relaxed">
          Anda belum memiliki kartu paspor digital resmi PBESI Sumatera Barat. Daftarkan identitas Anda sekarang untuk mendapatkan identitas esport resmi.
        </p>
      </div>
      <Link
        href="/me/profile/new"
        onClick={() => triggerHaptic()}
        className="btn-brand-primary text-xs py-3 px-6 flex items-center gap-2 mt-2"
      >
        <Plus className="w-4 h-4" />
        <span>Buat Kartu Pertama</span>
      </Link>
    </div>
  )}

      {/* ==================================================================== */}
      {/* BOTTOM SHEET 1: QR CODE BESAR & SATU BARIS ESPORT ID                 */}
      {/* ==================================================================== */}
      <AnimatePresence>
        {isQrOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsQrOpen(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed bottom-0 left-0 right-0 max-w-[420px] mx-auto bg-[#0F1118]/95 border-t border-white/[0.08] backdrop-blur-2xl rounded-t-[28px] p-6 z-50 flex flex-col items-center gap-5 shadow-2xl"
            >
              <div className="w-10 h-1 rounded-full bg-white/20 mx-auto" />

              <h3 className="font-heading font-bold text-lg text-white">ESPORT QR</h3>

              {/* QR Code Besar di Tengah */}
              <div className="p-4 rounded-2xl bg-white shadow-xl">
                <QRCodeSVG
                  value={`https://esport-sumbar-v2.vercel.app/player/${activeCard.data.ign?.toLowerCase() || "profile"}`}
                  size={180}
                  level="H"
                />
              </div>

              {/* Satu Baris ESPORT ID (Font Mono) */}
              <div className="text-center">
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">
                  Identitas Terdaftar
                </span>
                <span className="font-mono font-bold text-base text-[#D4AF37] tracking-wider">
                  {activeCard.data.esportId}
                </span>
              </div>

              {/* Tombol Tutup (1 Kata) */}
              <button
                onClick={() => setIsQrOpen(false)}
                className="w-full h-12 rounded-full bg-[#161A24] border border-white/[0.08] text-white font-heading font-semibold text-xs tracking-wider uppercase mt-1"
              >
                Tutup
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ==================================================================== */}
      {/* BOTTOM SHEET 2: BAGIKAN (Pratinjau Story 9:16 & Feed 1:1)             */}
      {/* ==================================================================== */}
      <AnimatePresence>
        {isShareOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsShareOpen(false)}
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

              <div className="flex items-center justify-between">
                <h3 className="font-heading font-bold text-lg text-white">Bagikan Kartu</h3>
                {/* Format Toggle: Story 9:16 vs Feed 1:1 */}
                <div className="flex bg-[#161A24] p-1 rounded-full border border-white/[0.08]">
                  <button
                    onClick={() => {
                      triggerHaptic();
                      setShareFormat("story");
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${
                      shareFormat === "story" ? "bg-[#D4AF37] text-black font-bold" : "text-white/60"
                    }`}
                  >
                    Story
                  </button>
                  <button
                    onClick={() => {
                      triggerHaptic();
                      setShareFormat("feed");
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${
                      shareFormat === "feed" ? "bg-[#D4AF37] text-black font-bold" : "text-white/60"
                    }`}
                  >
                    Feed
                  </button>
                </div>
              </div>

              {/* Box Pratinjau */}
              <div className="w-full h-44 rounded-2xl bg-[#07080C] border border-white/10 flex items-center justify-center p-3">
                <div
                  className={`rounded-xl bg-gradient-to-b from-[#1C202E] to-[#0A0D15] border border-[#D4AF37]/50 flex flex-col items-center justify-center text-center p-2 shadow-lg transition-all ${
                    shareFormat === "story" ? "w-24 h-38" : "w-32 h-32"
                  }`}
                >
                  <span className="text-[8px] font-mono text-[#D4AF37] font-bold">ESPORT SUMBAR</span>
                  <div className="w-10 h-10 rounded-full overflow-hidden my-1 border border-white/20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={activeCard.data.avatarUrl}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[9px] font-heading font-bold text-white truncate max-w-[80px]">
                    {activeCard.data.displayName}
                  </span>
                </div>
              </div>

              {/* 2 Tombol: Simpan & Bagikan */}
              <div className="grid grid-cols-2 gap-3 mt-1">
                <button
                  onClick={() => {
                    triggerHaptic();
                    alert("Gambar kartu berhasil disimpan.");
                  }}
                  className="h-12 rounded-full bg-[#161A24] border border-white/[0.08] text-white font-heading font-semibold text-xs tracking-wider uppercase"
                >
                  Simpan
                </button>
                <button
                  onClick={() => {
                    triggerHaptic();
                    if (typeof navigator !== "undefined" && navigator.clipboard) {
                      navigator.clipboard.writeText(
                        `https://esport-sumbar-v2.vercel.app/player/${activeCard.data.ign?.toLowerCase() || "profile"}`
                      );
                      alert("Tautan profil berhasil disalin!");
                    }
                  }}
                  className="h-12 rounded-full bg-[#D4AF37] text-[#07080C] font-heading font-bold text-xs tracking-wider uppercase shadow-md"
                >
                  Bagikan
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ==================================================================== */}
      {/* BOTTOM SHEET 3: INFO TIER & ARTI LENCANA                             */}
      {/* ==================================================================== */}
      <AnimatePresence>
        {isInfoOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsInfoOpen(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed bottom-0 left-0 right-0 max-w-[420px] mx-auto bg-[#0F1118]/95 border-t border-white/[0.08] backdrop-blur-2xl rounded-t-[28px] p-6 z-50 flex flex-col gap-5 shadow-2xl"
            >
              <div className="w-10 h-1 rounded-full bg-white/20 mx-auto" />

              <h3 className="font-heading font-bold text-lg text-white">Kenapa Tier Ini?</h3>

              {/* Checklist Kriteria dengan Ikon Centang */}
              <div className="flex flex-col gap-2.5">
                {[
                  "Profil dasar & domisili lengkap",
                  "Minimal 2 turnamen resmi terdata",
                  "Rating OVR berada di kelas Contender (75-84)",
                ].map((crit, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-white/80">
                    <div className="w-5 h-5 rounded-full bg-[#22C55E]/15 text-[#22C55E] flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[2.5]" />
                    </div>
                    <span>{crit}</span>
                  </div>
                ))}
              </div>

              {/* Arti Lencana (4 Baris Ikon + 1 Kata) */}
              <div className="pt-2 border-t border-white/[0.08]">
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block mb-2.5">
                  Arti Lencana
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-[#161A24] border border-white/[0.06]">
                    <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                    <span className="text-xs font-mono font-bold text-[#D4AF37]">Verified</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-[#161A24] border border-white/[0.06]">
                    <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
                    <span className="text-xs font-mono font-bold text-[#22C55E]">Regional</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-[#161A24] border border-white/[0.06]">
                    <Shield className="w-4 h-4 text-white/40" />
                    <span className="text-xs font-mono text-white/60">Unverified</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-[#161A24] border border-white/[0.06]">
                    <Shield className="w-4 h-4 text-[#EF4444]" />
                    <span className="text-xs font-mono text-[#EF4444]">Suspended</span>
                  </div>
                </div>
              </div>

              {/* Tombol Tutup */}
              <button
                onClick={() => setIsInfoOpen(false)}
                className="w-full h-12 rounded-full bg-[#161A24] border border-white/[0.08] text-white font-heading font-semibold text-xs tracking-wider uppercase mt-1"
              >
                Tutup
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* FLOATING BOTTOM BAR (Tab Kartu Aktif di Tengah) */}
      <MobileBottomBar />
    </div>
  );
}
