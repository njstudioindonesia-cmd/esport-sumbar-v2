"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Gamepad2,
  GraduationCap,
  Users,
  Shield,
  ShieldCheck,
  Eye,
  Lock,
  Search,
  Check,
  ArrowLeft,
  Sparkles,
  Upload,
  Calendar,
  AlertCircle,
  Trophy,
  Award,
  ChevronRight,
  CornerDownLeft,
} from "lucide-react";
import { OFFICIAL_GAMES } from "@/data/games";
import { REGIONS_DETAIL } from "@/data/regions";
import { createProfileAction } from "@/app/actions/profile";

export function DesktopCardWizard() {
  const router = useRouter();

  // Wizard Steps (1 - 7), progress is a thin gold line at the top (no "1 dari 7" text)
  const [step, setStep] = useState(1);

  // Form State
  const [role, setRole] = useState<"player" | "coach" | "team">("player");
  const [birthDate, setBirthDate] = useState("2007-06-15");
  const [guardianName, setGuardianName] = useState("");
  const [guardianContact, setGuardianContact] = useState("");
  const [guardianConsent, setGuardianConsent] = useState(false);

  const [displayName, setDisplayName] = useState("Sutan Harimau");
  const [ign, setIgn] = useState("HARIMAU_AIM");

  const [selectedGame, setSelectedGame] = useState("Mobile Legends: Bang Bang");
  const [selectedGameRole, setSelectedGameRole] = useState("Roamer");

  const [regionCode, setRegionCode] = useState("PDG");
  const [regionSearch, setRegionSearch] = useState("");

  const [avatarUrl, setAvatarUrl] = useState(
    "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=400&auto=format&fit=crop"
  );

  const [privacy, setPrivacy] = useState({
    kontak: false, // privat
    tglLahir: false, // privat
    statistik: true, // publik
  });

  const [isFinishing, setIsFinishing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Under 18 detection via useEffect
  const [isUnder18, setIsUnder18] = useState(false);

  useEffect(() => {
    if (!birthDate) {
      setIsUnder18(false);
      return;
    }
    const birthYear = new Date(birthDate).getFullYear();
    const currentYear = new Date().getFullYear();
    setIsUnder18(currentYear - birthYear < 18);
  }, [birthDate]);

  // Selected region details
  const selectedRegion = useMemo(() => {
    return REGIONS_DETAIL.find((r) => r.code === regionCode) || REGIONS_DETAIL[0];
  }, [regionCode]);

  // Active game details
  const activeGame = useMemo(() => {
    return OFFICIAL_GAMES.find((g) => g.name === selectedGame) || OFFICIAL_GAMES[0];
  }, [selectedGame]);

  // Filtered 19 regions for Step 5
  const filteredRegions = useMemo(() => {
    if (!regionSearch.trim()) return REGIONS_DETAIL;
    return REGIONS_DETAIL.filter(
      (r) =>
        r.name.toLowerCase().includes(regionSearch.toLowerCase()) ||
        r.code.toLowerCase().includes(regionSearch.toLowerCase())
    );
  }, [regionSearch]);

  // 3D Tilt Card Motion Values for Right Column Sticky Card
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-200, 200], [14, -14]), {
    stiffness: 180,
    damping: 24,
  });
  const rotateY = useSpring(useTransform(mouseX, [-200, 200], [-14, 14]), {
    stiffness: 180,
    damping: 24,
  });

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleCardMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Step Navigation
  const handleNext = () => {
    setErrorMessage(null);

    // Step-specific validations
    if (step === 2 && isUnder18 && !guardianConsent) {
      setErrorMessage("Persetujuan wali wajib dicentang untuk atlet di bawah 18 tahun.");
      return;
    }

    if (step === 3 && !displayName.trim()) {
      setErrorMessage("Nama lengkap wajib diisi.");
      return;
    }

    if (step < 7) {
      setStep((prev) => prev + 1);
    } else {
      handleFinalSubmit();
    }
  };

  const handleBack = () => {
    setErrorMessage(null);
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  // Keyboard navigation listener (Full keyboard navigation)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in a text input (except for Enter to proceed)
      if (e.key === "Enter") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "Escape" && step > 1) {
        e.preventDefault();
        handleBack();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [step, isUnder18, guardianConsent, displayName]);

  // Final Profile & Card Creation
  const handleFinalSubmit = async () => {
    setIsFinishing(true);

    try {
      await createProfileAction({
        entityType: role,
        displayName: displayName.trim(),
        ign: ign.trim() || undefined,
        regionId: selectedRegion.id,
        regionCode: selectedRegion.code,
        mainGameId: activeGame.id,
        roleName: selectedGameRole,
        avatarUrl: avatarUrl,
        birthDate: birthDate,
        bio: `${role === "player" ? "Atlet" : role === "coach" ? "Pelatih" : "Tim"} ${selectedGame} domisili ${selectedRegion.name}.`,
        guardianConsent:
          isUnder18 && guardianConsent
            ? {
                guardianName: guardianName.trim(),
                guardianContact: guardianContact.trim(),
              }
            : undefined,
        visibility: {
          contact: privacy.kontak,
          birthDate: privacy.tglLahir,
          stats: privacy.statistik,
        },
      });
    } catch {
      // Fallback continuation
    }

    // Delay for shining card animation
    setTimeout(() => {
      router.push("/me/cards");
    }, 1400);
  };

  return (
    <div className="w-full min-h-screen bg-[#07080C] text-white flex flex-col select-none">
      {/* ========================================================= */}
      {/* 1. PROGRESS BAR TIPIS EMAS DI PALING ATAS (TANPA "1 DARI 7") */}
      {/* ========================================================= */}
      <div className="sticky top-0 w-full h-1 bg-white/[0.06] z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#F3E5AB]"
          initial={{ width: "14%" }}
          animate={{ width: `${(step / 7) * 100}%` }}
          transition={{ ease: "easeInOut", duration: 0.35 }}
        />
      </div>

      {/* TOP BAR / BACK NAVIGATION */}
      <header className="w-full border-b border-white/[0.06] bg-[#07080C]/90 backdrop-blur-md px-8 py-3.5 flex items-center justify-between z-40">
        <div className="flex items-center gap-4">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-white/20 text-xs font-mono text-white/70 hover:text-white transition-all group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Kembali</span>
              <kbd className="hidden sm:inline px-1 py-0.2 bg-white/10 rounded text-[9px] text-white/40">
                Esc
              </kbd>
            </button>
          ) : (
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-mono text-white/50 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Batal</span>
            </Link>
          )}

          <div className="h-4 w-px bg-white/10" />

          {/* Marawa Accent & Mode */}
          <div className="flex items-center gap-2">
            <div className="flex h-3 w-1.5 rounded-sm overflow-hidden">
              <span className="h-1/3 w-full bg-[#C8102E]" />
              <span className="h-1/3 w-full bg-[#D4AF37]" />
              <span className="h-1/3 w-full bg-black" />
            </div>
            <span className="text-xs font-mono uppercase tracking-widest text-white/40">
              {step === 1 && "Pilih Peran"}
              {step === 2 && "Tanggal Lahir"}
              {step === 3 && "Nama & IGN"}
              {step === 4 && "Game & Role"}
              {step === 5 && "Wilayah PBESI"}
              {step === 6 && "Foto Profil"}
              {step === 7 && "Privasi & Tinjau"}
            </span>
          </div>
        </div>

        {/* Keyboard Shortcut Hint */}
        <div className="hidden md:flex items-center gap-2 text-[11px] font-mono text-white/40">
          <span>Lanjut</span>
          <kbd className="px-1.5 py-0.5 bg-white/[0.06] border border-white/10 rounded text-[10px] text-[#D4AF37] flex items-center gap-1">
            <CornerDownLeft className="w-3 h-3" /> Enter
          </kbd>
        </div>
      </header>

      {/* ========================================================= */}
      {/* TWO COLUMNS LAYOUT: KIRI FORMULIR, KANAN KARTU PRATINJAU */}
      {/* ========================================================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 lg:px-12 py-8 lg:py-12">
        <div className="grid grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* ======================================================= */}
          {/* KOLOM KIRI (7/12): FORMULIR SATU LANGKAH PER LAYAR     */}
          {/* ======================================================= */}
          <div className="col-span-12 lg:col-span-7 flex flex-col">
            <div className="bg-[#0F1118]/80 border border-white/[0.08] rounded-3xl p-7 lg:p-10 shadow-2xl backdrop-blur-xl flex flex-col justify-between min-h-[520px]">
              <div>
                {/* Alert error */}
                {errorMessage && (
                  <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* ANIMATED STEP CONTENT */}
                <AnimatePresence mode="wait">
                  {/* LANGKAH 1: PERAN (3 KARTU PILIHAN BESAR) */}
                  {step === 1 && (
                    <motion.div
                      key="step-1"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col"
                    >
                      <h2 className="text-2xl font-heading font-black text-white tracking-tight mb-1">
                        Pilih Peran
                      </h2>
                      <p className="text-xs text-white/50 mb-6">
                        Pilih status identitas resmi paspor esport kamu.
                      </p>

                      <div className="grid grid-cols-3 gap-4">
                        {[
                          {
                            id: "player",
                            label: "Player",
                            desc: "Atlet kompetitif individu atau bagian tim",
                            icon: Gamepad2,
                          },
                          {
                            id: "coach",
                            label: "Pelatih",
                            desc: "Pelatih berlisensi atau analisis taktis",
                            icon: GraduationCap,
                          },
                          {
                            id: "team",
                            label: "Tim",
                            desc: "Organisasi atau klub esport resmi",
                            icon: Users,
                          },
                        ].map((p, idx) => {
                          const Icon = p.icon;
                          const isActive = role === p.id;
                          return (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => setRole(p.id as "player" | "coach" | "team")}
                              className={`p-5 rounded-2xl flex flex-col items-start justify-between min-h-[170px] transition-all border text-left relative overflow-hidden group ${
                                isActive
                                  ? "bg-[#D4AF37]/10 border-[#D4AF37] shadow-[0_0_24px_rgba(212,175,55,0.2)]"
                                  : "bg-[#161A24] border-white/[0.08] hover:border-white/20 hover:bg-[#1A1F2C]"
                              }`}
                            >
                              <div className="w-full flex items-center justify-between">
                                <div
                                  className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                                    isActive
                                      ? "bg-[#D4AF37] text-[#07080C]"
                                      : "bg-white/[0.06] text-white/60 group-hover:text-white"
                                  }`}
                                >
                                  <Icon className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-mono text-white/30">
                                  0{idx + 1}
                                </span>
                              </div>

                              <div>
                                <div
                                  className={`text-base font-heading font-black tracking-wide ${
                                    isActive ? "text-[#D4AF37]" : "text-white"
                                  }`}
                                >
                                  {p.label}
                                </div>
                                <p className="text-[11px] text-white/50 leading-relaxed mt-1">
                                  {p.desc}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* LANGKAH 2: TANGGAL LAHIR (PANEL WALI <18 DENGAN PERISAI) */}
                  {step === 2 && (
                    <motion.div
                      key="step-2"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col"
                    >
                      <h2 className="text-2xl font-heading font-black text-white tracking-tight mb-1">
                        Tanggal Lahir
                      </h2>
                      <p className="text-xs text-white/50 mb-6">
                        Verifikasi usia resmi untuk turnamen PBESI dan regulasi perlindungan anak.
                      </p>

                      <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-mono uppercase tracking-wider text-white/60">
                          Tanggal Lahir Atlet
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                            className="w-full h-14 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] rounded-2xl px-4 text-base font-mono text-white outline-none transition-all"
                          />
                        </div>
                      </div>

                      {/* PANEL PERSETUJUAN WALI JIKA < 18 TAHUN */}
                      {isUnder18 && (
                        <div className="mt-6 p-5 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex flex-col gap-3">
                          <div className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-[#D4AF37]" />
                            <span className="text-sm font-heading font-bold text-[#D4AF37]">
                              Persetujuan Wali Terdaftar (&lt; 18 Tahun)
                            </span>
                          </div>
                          <p className="text-xs text-white/70 leading-relaxed">
                            Berdasarkan regulasi PBESI &amp; UU PDP, atlet di bawah 18 tahun membutuhkan persetujuan orang tua/wali resmi.
                          </p>

                          <div className="grid grid-cols-2 gap-3 mt-1">
                            <input
                              type="text"
                              value={guardianName}
                              onChange={(e) => setGuardianName(e.target.value)}
                              placeholder="Nama Lengkap Orang Tua / Wali"
                              className="h-11 bg-[#0F1118] border border-white/10 rounded-xl px-3.5 text-xs text-white placeholder-white/30 outline-none focus:border-[#D4AF37]"
                            />
                            <input
                              type="text"
                              value={guardianContact}
                              onChange={(e) => setGuardianContact(e.target.value)}
                              placeholder="Nomor WhatsApp / Kontak Wali"
                              className="h-11 bg-[#0F1118] border border-white/10 rounded-xl px-3.5 text-xs text-white placeholder-white/30 outline-none focus:border-[#D4AF37]"
                            />
                          </div>

                          <label className="flex items-center gap-2.5 cursor-pointer mt-1 select-none">
                            <input
                              type="checkbox"
                              checked={guardianConsent}
                              onChange={(e) => setGuardianConsent(e.target.checked)}
                              className="w-4 h-4 rounded bg-black/40 border-white/20 text-[#D4AF37] focus:ring-0 cursor-pointer"
                            />
                            <span className="text-xs text-white/80 leading-tight">
                              Saya menyatakan wali menyetujui penerbitan kartu paspor atlet resmi.
                            </span>
                          </label>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* LANGKAH 3: NAMA LENGKAP & IGN */}
                  {step === 3 && (
                    <motion.div
                      key="step-3"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col gap-5"
                    >
                      <div>
                        <h2 className="text-2xl font-heading font-black text-white tracking-tight mb-1">
                          Nama &amp; In-Game Name
                        </h2>
                        <p className="text-xs text-white/50">
                          Nama lengkap sesuai KTP/KIA dan identitas panggung turnamen.
                        </p>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-mono uppercase tracking-wider text-white/60">
                          Nama Lengkap
                        </label>
                        <input
                          type="text"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          placeholder="Nama lengkap atlet"
                          required
                          className="w-full h-13 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] rounded-2xl px-4 text-base font-semibold text-white outline-none transition-all"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-mono uppercase tracking-wider text-white/60">
                            In-Game Name (IGN)
                          </label>
                          <span className="text-[10px] font-mono text-[#D4AF37]">
                            Format: HURUF_KAPITAL
                          </span>
                        </div>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-mono text-[#D4AF37] font-bold">
                            @
                          </span>
                          <input
                            type="text"
                            value={ign}
                            onChange={(e) => setIgn(e.target.value.toUpperCase())}
                            placeholder="HARIMAU_AIM"
                            className="w-full h-13 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] rounded-2xl pl-9 pr-4 text-base font-mono font-bold text-[#D4AF37] outline-none transition-all"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* LANGKAH 4: GAME (GRID LOGO) + ROLE (CHIP) */}
                  {step === 4 && (
                    <motion.div
                      key="step-4"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col"
                    >
                      <h2 className="text-2xl font-heading font-black text-white tracking-tight mb-1">
                        Pilih Game &amp; Role
                      </h2>
                      <p className="text-xs text-white/50 mb-5">
                        Divisi game utama dan spesialisasi posisi kamu di dalam tim.
                      </p>

                      {/* Grid Game */}
                      <label className="text-[11px] font-mono uppercase tracking-wider text-white/60 mb-2">
                        Game Utama
                      </label>
                      <div className="grid grid-cols-3 gap-2.5 mb-5">
                        {OFFICIAL_GAMES.map((g) => {
                          const isSelected = selectedGame === g.name;
                          return (
                            <button
                              key={g.id}
                              type="button"
                              onClick={() => {
                                setSelectedGame(g.name);
                                if (g.roles[0]) setSelectedGameRole(g.roles[0]);
                              }}
                              className={`h-12 px-3.5 rounded-xl border text-xs font-heading font-bold text-left flex items-center justify-between transition-all ${
                                isSelected
                                  ? "bg-[#4C7DFF]/20 border-[#4C7DFF] text-white shadow-[0_0_15px_rgba(76,125,255,0.25)]"
                                  : "bg-[#161A24] border-white/[0.08] text-white/60 hover:text-white hover:border-white/20"
                              }`}
                            >
                              <span className="truncate">{g.shortName}</span>
                              {isSelected && <Check className="w-3.5 h-3.5 text-[#4C7DFF]" />}
                            </button>
                          );
                        })}
                      </div>

                      {/* Role sebagai Chip */}
                      <label className="text-[11px] font-mono uppercase tracking-wider text-white/60 mb-2">
                        Spesialisasi Posisi / Role
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {activeGame.roles.map((r) => {
                          const isSelected = selectedGameRole === r;
                          return (
                            <button
                              key={r}
                              type="button"
                              onClick={() => setSelectedGameRole(r)}
                              className={`px-4 py-2 rounded-xl text-xs font-mono transition-all border ${
                                isSelected
                                  ? "bg-[#D4AF37] text-[#07080C] font-bold border-[#D4AF37] shadow-sm"
                                  : "bg-[#161A24] text-white/70 border-white/[0.08] hover:text-white hover:border-white/20"
                              }`}
                            >
                              {r}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* LANGKAH 5: WILAYAH (19 PENGCAB SUMBAR) */}
                  {step === 5 && (
                    <motion.div
                      key="step-5"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col"
                    >
                      <h2 className="text-2xl font-heading font-black text-white tracking-tight mb-1">
                        Pilih Wilayah
                      </h2>
                      <p className="text-xs text-white/50 mb-4">
                        Pilih Kota atau Kabupaten domisili untuk delegasi verifikasi Pengcab ESI.
                      </p>

                      {/* Search Bar */}
                      <div className="relative w-full mb-3">
                        <input
                          type="text"
                          value={regionSearch}
                          onChange={(e) => setRegionSearch(e.target.value)}
                          placeholder="Ketik nama Kota atau Kabupaten..."
                          className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl pl-9 pr-4 text-xs text-white placeholder-white/30 outline-none"
                        />
                        <Search className="w-4 h-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
                      </div>

                      {/* 19 Regions Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-56 overflow-y-auto no-scrollbar pr-1">
                        {filteredRegions.map((reg) => {
                          const isSelected = regionCode === reg.code;
                          return (
                            <button
                              key={reg.id}
                              type="button"
                              onClick={() => setRegionCode(reg.code)}
                              className={`h-11 px-3 rounded-xl border text-xs font-medium text-left flex items-center justify-between transition-all ${
                                isSelected
                                  ? "bg-[#D4AF37]/15 border-[#D4AF37] text-white font-bold"
                                  : "bg-[#161A24] border-white/[0.06] text-white/60 hover:text-white hover:border-white/20"
                              }`}
                            >
                              <span className="truncate">{reg.name}</span>
                              <span className="text-[9px] font-mono text-[#D4AF37] ml-1 shrink-0">
                                {reg.code}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* LANGKAH 6: FOTO / LOGO (UNGGAH + PRESET) */}
                  {step === 6 && (
                    <motion.div
                      key="step-6"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col"
                    >
                      <h2 className="text-2xl font-heading font-black text-white tracking-tight mb-1">
                        Foto Profil Kartu
                      </h2>
                      <p className="text-xs text-white/50 mb-5">
                        Pilih foto resmi atlet atau gunakan salah satu avatar preset esport.
                      </p>

                      {/* Drag & Drop Simulation Zone */}
                      <div className="w-full p-6 border-2 border-dashed border-white/15 hover:border-[#D4AF37]/50 rounded-2xl bg-[#161A24]/50 flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer mb-5 text-center">
                        <Upload className="w-6 h-6 text-[#D4AF37]" />
                        <span className="text-xs font-heading font-bold text-white">
                          Tarik &amp; lepas foto atlet ke sini
                        </span>
                        <span className="text-[10px] font-mono text-white/40">
                          Format PNG, JPG atau WEBP (Maks 2MB)
                        </span>
                      </div>

                      {/* Quick Avatar Presets */}
                      <label className="text-[11px] font-mono uppercase tracking-wider text-white/60 mb-2">
                        Atau Pilih Avatar Preset Esport
                      </label>
                      <div className="grid grid-cols-4 gap-3 mb-4">
                        {[
                          "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=400&auto=format&fit=crop",
                          "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=300&auto=format&fit=crop",
                          "https://api.dicebear.com/7.x/bottts/svg?seed=MARAWA_KING",
                          "https://api.dicebear.com/7.x/bottts/svg?seed=BukitSlayer",
                        ].map((url, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setAvatarUrl(url)}
                            className={`h-20 rounded-xl overflow-hidden border-2 transition-all ${
                              avatarUrl === url
                                ? "border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.3)] scale-[1.03]"
                                : "border-white/10 opacity-60 hover:opacity-100"
                            }`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={url} alt="Preset" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>

                      {/* URL Langsung */}
                      <div className="relative w-full">
                        <input
                          type="text"
                          value={avatarUrl}
                          onChange={(e) => setAvatarUrl(e.target.value)}
                          placeholder="Tautan Foto / Logo Atlet (https://...)"
                          className="w-full h-11 bg-[#161A24] border border-white/[0.08] rounded-xl px-3 text-xs text-white placeholder-white/30 outline-none"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* LANGKAH 7: PRIVASI & TINJAU RINGKASAN */}
                  {step === 7 && (
                    <motion.div
                      key="step-7"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col"
                    >
                      <h2 className="text-2xl font-heading font-black text-white tracking-tight mb-1">
                        Privasi &amp; Tinjau
                      </h2>
                      <p className="text-xs text-white/50 mb-5">
                        Kontrol visibilitas data pribadi kamu sesuai UU PDP No. 27/2022.
                      </p>

                      {/* Field Privacy Toggles */}
                      <div className="flex flex-col gap-2.5 mb-6">
                        {[
                          {
                            key: "kontak",
                            label: "Nomor Kontak / WhatsApp",
                            isPublic: privacy.kontak,
                          },
                          {
                            key: "tglLahir",
                            label: "Tanggal Lahir & Usia",
                            isPublic: privacy.tglLahir,
                          },
                          {
                            key: "statistik",
                            label: "Statistik Pertandingan & Gelar",
                            isPublic: privacy.statistik,
                          },
                        ].map((item) => (
                          <div
                            key={item.key}
                            className="p-3.5 rounded-xl bg-[#161A24] border border-white/[0.06] flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              {item.isPublic ? (
                                <Eye className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <Lock className="w-4 h-4 text-amber-400" />
                              )}
                              <div>
                                <div className="text-xs font-semibold text-white">
                                  {item.label}
                                </div>
                                <div className="text-[10px] font-mono text-white/40">
                                  {item.isPublic ? "Terlihat oleh Publik" : "Terkunci (Hanya Admin PBESI)"}
                                </div>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                setPrivacy((prev) => ({
                                  ...prev,
                                  [item.key]: !prev[item.key as keyof typeof privacy],
                                }))
                              }
                              className={`px-3 py-1 rounded-lg text-[11px] font-mono font-bold transition-all border ${
                                item.isPublic
                                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                                  : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                              }`}
                            >
                              {item.isPublic ? "PUBLIK" : "PRIVAT"}
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Summary Box */}
                      <div className="p-4 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <Trophy className="w-5 h-5 text-[#D4AF37]" />
                          <div>
                            <span className="font-heading font-black text-white">
                              Kartu Terbit Otomatis: Tier 1 Rookie
                            </span>
                            <p className="text-[11px] text-white/60">
                              Verifikasi resmi PBESI diajukan kemudian ke Pengcab ESI {selectedRegion.name}.
                            </p>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded bg-[#D4AF37] text-[#07080C] text-[10px] font-mono font-black uppercase">
                          SIAP TERBIT
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ACTION BUTTON BAR (SATU TOMBOL UTAMA PER LAYAR) */}
              <div className="pt-6 mt-6 border-t border-white/[0.08] flex items-center justify-between">
                <div>
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="px-5 py-2.5 rounded-xl border border-white/10 hover:border-white/30 text-xs font-mono text-white/70 hover:text-white transition-colors"
                    >
                      Sebelumnya
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={isFinishing}
                  className={`px-8 py-3 rounded-xl font-heading font-black text-xs tracking-wider uppercase transition-all flex items-center gap-2 shadow-lg active:scale-[0.99] disabled:opacity-50 ${
                    step === 7
                      ? "bg-gradient-to-r from-[#D4AF37] via-[#F5D77F] to-[#AA7C11] text-[#07080C] shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:brightness-110"
                      : "bg-[#D4AF37] hover:bg-[#E5C158] text-[#07080C]"
                  }`}
                >
                  {isFinishing ? (
                    <span>Menerbitkan Kartu...</span>
                  ) : step === 7 ? (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Buat Kartu</span>
                    </>
                  ) : (
                    <>
                      <span>Lanjut</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* ======================================================= */}
          {/* KOLOM KANAN (5/12): KARTU PRATINJAU LENGKET (STICKY)    */}
          {/* ======================================================= */}
          <div className="col-span-12 lg:col-span-5 sticky top-20 flex flex-col items-center">
            {/* Top pill badge */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono text-white/60 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>PRATINJAU REAL-TIME</span>
            </div>

            {/* 3D TILT TCG CARD CONTAINER */}
            <div
              ref={cardRef}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              className="relative [perspective:1200px]"
            >
              {/* Card Ambient Glow Behind */}
              <div
                className={`absolute inset-0 w-80 h-110 rounded-3xl blur-3xl pointer-events-none transition-all duration-500 ${
                  isFinishing
                    ? "bg-[#D4AF37]/50 scale-125"
                    : "bg-gradient-to-tr from-[#8C5A3C]/20 via-[#D4AF37]/15 to-transparent"
                }`}
              />

              {/* Animated Tilting Card Frame */}
              <motion.div
                style={{
                  rotateX,
                  rotateY,
                  transformStyle: "preserve-3d",
                }}
                className={`relative w-[320px] h-[460px] rounded-[24px] bg-gradient-to-b from-[#1C1F2B] via-[#12151E] to-[#0A0C13] border-2 border-[#8C5A3C] shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_20px_rgba(140,90,60,0.25)] p-4 flex flex-col justify-between overflow-hidden transition-all duration-300 ${
                  isFinishing
                    ? "ring-4 ring-[#D4AF37] shadow-[0_0_60px_rgba(212,175,55,0.7)] scale-[1.03]"
                    : ""
                }`}
              >
                {/* Shiny Card Light Sweep on Submit */}
                {isFinishing && (
                  <motion.div
                    initial={{ x: "-150%" }}
                    animate={{ x: "200%" }}
                    transition={{ duration: 0.9, ease: "easeInOut" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent skew-x-12 z-40 pointer-events-none"
                  />
                )}

                {/* Top Card Row: Rookie Badge + Unverified Status */}
                <div className="w-full flex items-center justify-between z-10">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#8C5A3C]/30 border border-[#8C5A3C]/70 text-[9px] font-mono font-bold text-[#E6B89C] uppercase tracking-wider">
                    TIER 1 • ROOKIE
                  </span>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-[9px] font-mono text-white/50">
                    <Shield className="w-3 h-3 text-white/40" />
                    <span>UNVERIFIED</span>
                  </div>
                </div>

                {/* Avatar / Photo Real-Time */}
                <div className="relative w-full flex-1 my-3 flex flex-col items-center justify-center">
                  <div className="relative w-28 h-28 rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-[#0F1118]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-1 right-1.5 flex h-3 w-1 rounded-sm overflow-hidden opacity-80">
                      <span className="h-1/3 w-full bg-[#C8102E]" />
                      <span className="h-1/3 w-full bg-[#D4AF37]" />
                      <span className="h-1/3 w-full bg-black" />
                    </div>
                  </div>

                  {/* Live Display Name & IGN */}
                  <div className="text-center mt-2.5">
                    <div className="text-base font-heading font-black tracking-wide text-white truncate max-w-[200px]">
                      {displayName || "Nama Atlet"}
                    </div>
                    <div className="text-xs font-mono font-bold text-[#D4AF37]">
                      {ign ? `@${ign}` : "@IGN"}
                    </div>
                  </div>
                </div>

                {/* Bottom Card Strip: Game + Role + Region */}
                <div className="w-full pt-2.5 border-t border-white/[0.08] flex items-center justify-between text-[10px] font-mono text-white/70 z-10">
                  <div className="truncate max-w-[140px] text-[#4C7DFF] font-semibold">
                    {activeGame.shortName} • {selectedGameRole}
                  </div>
                  <div className="px-2 py-0.5 rounded bg-white/[0.06] text-[#D4AF37] font-bold">
                    {selectedRegion.code}
                  </div>
                </div>
              </motion.div>
            </div>

            <span className="mt-4 text-[11px] font-mono text-white/40 tracking-wider">
              Paspor atlet resmi PBESI Sumatera Barat
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
