"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Gamepad2,
  GraduationCap,
  Users,
  Shield,
  Eye,
  Lock,
  Search,
  Check,
  ArrowLeft,
  Sparkles,
  Award,
  Upload,
  Calendar,
} from "lucide-react";
import { OFFICIAL_GAMES } from "@/data/games";
import { REGIONS_DETAIL } from "@/data/regions";
import { createProfileAction } from "@/app/actions/profile";

export function MobileCardWizard() {
  const router = useRouter();

  // Wizard Steps (1 - 7), progress is a thin gold line at the top (no "1 dari 7" text)
  const [step, setStep] = useState(1);

  // Card State (Live Real-Time Building)
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

  const triggerHaptic = (ms = 10) => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(ms);
      } catch {
        // Ignored
      }
    }
  };

  // Under 18 detection via useEffect to comply with Next.js prerender guidelines
  const [isUnder18, setIsUnder18] = useState(false);

  React.useEffect(() => {
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

  const handleNext = () => {
    triggerHaptic();
    if (step < 7) {
      setStep((prev) => prev + 1);
    } else {
      handleFinalSubmit();
    }
  };

  const handleBack = () => {
    triggerHaptic();
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const handleFinalSubmit = async () => {
    triggerHaptic(30);
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
      });
    } catch {
      // Continue anyway for offline simulation
    }

    // Delay for shining card animation
    setTimeout(() => {
      router.push("/me/cards");
    }, 1200);
  };

  return (
    <div className="relative w-full h-[100dvh] max-w-[420px] mx-auto bg-[#07080C] text-white flex flex-col justify-between overflow-hidden select-none">
      {/* 1. PROGRESS BAR TIPIS EMAS DI ATAS (Tanpa Teks "1 dari 7") */}
      <div className="w-full h-1 bg-white/[0.06] z-30">
        <motion.div
          className="h-full bg-[#D4AF37]"
          initial={{ width: "14%" }}
          animate={{ width: `${(step / 7) * 100}%` }}
          transition={{ ease: "easeInOut", duration: 0.3 }}
        />
      </div>

      {/* TOP BAR / BACK NAVIGATION */}
      <div className="w-full flex items-center justify-between px-5 pt-3 z-30 min-h-[40px]">
        {step > 1 ? (
          <button
            onClick={handleBack}
            className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/70 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex h-1.5 w-6 rounded-full overflow-hidden opacity-70">
            <span className="w-1/3 bg-[#C8102E]" />
            <span className="w-1/3 bg-[#D4AF37]" />
            <span className="w-1/3 bg-black" />
          </div>
        )}
        <div className="text-[10px] font-mono tracking-widest text-white/40 uppercase">
          ROOKIE CARD
        </div>
      </div>

      {/* 2. BAGIAN ATAS (~45% TINGGI LAYAR): KARTU PRATINJAU HIDUP REAL-TIME */}
      <div className="relative w-full h-[40%] flex items-center justify-center px-6 py-2 z-10 [perspective:1000px]">
        {/* Subtle Ambient Background Glow behind Card */}
        <div className="absolute w-44 h-44 rounded-full bg-gradient-to-tr from-[#8C5A3C]/20 via-[#D4AF37]/15 to-transparent blur-3xl pointer-events-none" />

        {/* The Live Hero TCG Card */}
        <motion.div
          animate={{
            rotateY: [ -3, 3, -3 ],
            rotateX: [ 2, -2, 2 ],
            scale: isFinishing ? [1, 1.05, 1.08] : 1,
          }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`relative w-48 h-66 rounded-[18px] bg-gradient-to-b from-[#1C1F2B] via-[#12151E] to-[#0A0C13] border-2 border-[#8C5A3C] shadow-[0_12px_32px_rgba(140,90,60,0.25)] p-3.5 flex flex-col justify-between overflow-hidden transition-all duration-300 ${
            isFinishing ? "ring-4 ring-[#D4AF37] shadow-[0_0_48px_rgba(212,175,55,0.6)]" : ""
          }`}
        >
          {/* Card Gleam Animation on Final Submit */}
          {isFinishing && (
            <motion.div
              initial={{ x: "-150%" }}
              animate={{ x: "200%" }}
              transition={{ duration: 0.9, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent skew-x-12 z-40 pointer-events-none"
            />
          )}

          {/* Top Card Info: Rarity (Rookie) & Unverified Badge */}
          <div className="w-full flex items-center justify-between z-10">
            <span className="px-2 py-0.5 rounded-full bg-[#8C5A3C]/30 border border-[#8C5A3C]/60 text-[8px] font-mono font-bold text-[#E6B89C] uppercase">
              ROOKIE
            </span>
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-white/[0.06] border border-white/10">
              <Shield className="w-2.5 h-2.5 text-white/50" />
              <span className="text-[7px] font-mono text-white/50">UNVERIFIED</span>
            </div>
          </div>

          {/* Avatar / Photo Real-Time */}
          <div className="relative w-full flex-1 my-1.5 flex flex-col items-center justify-center">
            <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-white/10 shadow-md bg-[#0F1118]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Live Name & IGN */}
            <div className="text-center mt-1.5">
              <div className="text-xs font-heading font-black tracking-wide text-white truncate max-w-[150px]">
                {displayName || "Nama Atlet"}
              </div>
              <div className="text-[9px] font-mono text-[#D4AF37] font-semibold">
                {ign ? `@${ign}` : "@IGN"}
              </div>
            </div>
          </div>

          {/* Bottom Card Strip: Game + Role + Region */}
          <div className="w-full pt-1.5 border-t border-white/[0.08] flex items-center justify-between text-[8px] font-mono text-white/70 z-10">
            <div className="truncate max-w-[90px] text-[#4C7DFF]">
              {activeGame.shortName} • {selectedGameRole}
            </div>
            <div className="px-1.5 py-0.5 rounded bg-white/[0.06] text-[#D4AF37] font-bold">
              {regionCode}
            </div>
          </div>
        </motion.div>
      </div>

      {/* 3. BAGIAN BAWAH (~55% TINGGI LAYAR): PANEL INPUT BOTTOM SHEET */}
      <div className="relative w-full h-[58%] rounded-t-[28px] bg-[#0F1118]/95 border-t border-white/[0.08] backdrop-blur-xl p-5 flex flex-col justify-between z-20 shadow-2xl">
        {/* Handle Bar */}
        <div className="w-10 h-1 rounded-full bg-white/20 mx-auto -mt-1 mb-2" />

        {/* STEP CONTENT CONTAINER (Spring transitions) */}
        <div className="flex-1 overflow-y-auto no-scrollbar py-1">
          <AnimatePresence mode="wait">
            {/* LANGKAH 1: PERAN (3 Kartu Besar: Hanya Ikon + 1 Kata) */}
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full flex flex-col"
              >
                <h3 className="font-heading font-bold text-xl text-white mb-4">Pilih Peran</h3>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: "player", label: "Player", icon: Gamepad2 },
                    { id: "coach", label: "Pelatih", icon: GraduationCap },
                    { id: "team", label: "Tim", icon: Users },
                  ].map((p) => {
                    const Icon = p.icon;
                    const isActive = role === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          triggerHaptic();
                          setRole(p.id as "player" | "coach" | "team");
                        }}
                        className={`h-28 rounded-2xl flex flex-col items-center justify-center gap-2.5 transition-all border ${
                          isActive
                            ? "bg-[#D4AF37]/15 border-[#D4AF37] text-white shadow-[0_4px_20px_rgba(212,175,55,0.2)]"
                            : "bg-[#161A24] border-white/[0.08] text-white/50 hover:text-white"
                        }`}
                      >
                        <Icon className={`w-7 h-7 ${isActive ? "text-[#D4AF37]" : ""}`} />
                        <span className="font-heading font-bold text-xs tracking-wider">
                          {p.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* LANGKAH 2: TANGGAL LAHIR (Picker + Sheet Wali <18 Singkat) */}
            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full flex flex-col"
              >
                <h3 className="font-heading font-bold text-xl text-white mb-4">Tanggal Lahir</h3>

                {/* Date Picker Input */}
                <div className="relative w-full">
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full h-14 bg-[#161A24] border border-white/[0.08] focus:border-[#4C7DFF] rounded-[18px] px-4 text-base font-mono text-white outline-none"
                  />
                </div>

                {/* Persetujuan Wali Jika < 18 Tahun (Maks 2 Baris Teks + Ikon Perisai) */}
                {isUnder18 && (
                  <div className="mt-4 p-3.5 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex flex-col gap-2.5">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-[#D4AF37]" />
                      <span className="text-xs font-heading font-bold text-[#D4AF37]">
                        Persetujuan Wali
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={guardianName}
                        onChange={(e) => setGuardianName(e.target.value)}
                        placeholder="Nama Wali"
                        className="h-10 bg-[#0F1118] border border-white/10 rounded-xl px-3 text-xs text-white placeholder-white/30 outline-none"
                      />
                      <input
                        type="text"
                        value={guardianContact}
                        onChange={(e) => setGuardianContact(e.target.value)}
                        placeholder="Kontak Wali"
                        className="h-10 bg-[#0F1118] border border-white/10 rounded-xl px-3 text-xs text-white placeholder-white/30 outline-none"
                      />
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer mt-1">
                      <input
                        type="checkbox"
                        checked={guardianConsent}
                        onChange={(e) => setGuardianConsent(e.target.checked)}
                        className="w-3.5 h-3.5 rounded bg-black/40 border-white/20 text-[#D4AF37] focus:ring-0"
                      />
                      <span className="text-[11px] text-white/80 leading-tight">
                        Wali menyetujui penerbitan kartu atlet resmi.
                      </span>
                    </label>
                  </div>
                )}
              </motion.div>
            )}

            {/* LANGKAH 3: NAMA & IGN (Field Besar, Kartu Menampilkan Langsung) */}
            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full flex flex-col gap-3"
              >
                <h3 className="font-heading font-bold text-xl text-white mb-2">Nama &amp; IGN</h3>
                <div>
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block mb-1">
                    Nama Lengkap
                  </span>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Nama Atlet"
                    className="w-full h-14 bg-[#161A24] border border-white/[0.08] focus:border-[#4C7DFF] rounded-[18px] px-4 text-base font-medium text-white outline-none"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block mb-1">
                    In-Game Name
                  </span>
                  <input
                    type="text"
                    value={ign}
                    onChange={(e) => setIgn(e.target.value.toUpperCase())}
                    placeholder="IGN_GAME"
                    className="w-full h-14 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-[18px] px-4 text-base font-mono text-[#D4AF37] outline-none"
                  />
                </div>
              </motion.div>
            )}

            {/* LANGKAH 4: GAME & ROLE (Grid Game + Role Chip) */}
            {step === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full flex flex-col"
              >
                <h3 className="font-heading font-bold text-xl text-white mb-3">Pilih Game</h3>
                {/* Grid Game */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {OFFICIAL_GAMES.map((g) => {
                    const isSelected = selectedGame === g.name;
                    return (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => {
                          triggerHaptic();
                          setSelectedGame(g.name);
                          if (g.roles[0]) setSelectedGameRole(g.roles[0]);
                        }}
                        className={`h-11 px-3 rounded-xl border text-xs font-heading font-bold text-left truncate transition-all ${
                          isSelected
                            ? "bg-[#4C7DFF]/20 border-[#4C7DFF] text-white"
                            : "bg-[#161A24] border-white/[0.08] text-white/60 hover:text-white"
                        }`}
                      >
                        {g.shortName}
                      </button>
                    );
                  })}
                </div>

                {/* Role sebagai Chip */}
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block mb-1.5">
                  Posisi / Peran
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeGame.roles.map((r) => {
                    const isSelected = selectedGameRole === r;
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => {
                          triggerHaptic();
                          setSelectedGameRole(r);
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all border ${
                          isSelected
                            ? "bg-[#D4AF37] text-[#07080C] font-bold border-[#D4AF37]"
                            : "bg-[#161A24] text-white/70 border-white/[0.08] hover:text-white"
                        }`}
                      >
                        {r}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* LANGKAH 5: WILAYAH (19 Wilayah dengan Pencarian) */}
            {step === 5 && (
              <motion.div
                key="step-5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full flex flex-col"
              >
                <h3 className="font-heading font-bold text-xl text-white mb-2">Pilih Wilayah</h3>

                {/* Search Input */}
                <div className="relative w-full mb-2">
                  <input
                    type="text"
                    value={regionSearch}
                    onChange={(e) => setRegionSearch(e.target.value)}
                    placeholder="Cari wilayah..."
                    className="w-full h-11 bg-[#161A24] border border-white/[0.08] rounded-xl pl-9 pr-3 text-xs text-white placeholder-white/30 outline-none"
                  />
                  <Search className="w-4 h-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>

                {/* Daftar 19 Wilayah */}
                <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto no-scrollbar pr-1">
                  {filteredRegions.map((reg) => {
                    const isSelected = regionCode === reg.code;
                    return (
                      <button
                        key={reg.id}
                        type="button"
                        onClick={() => {
                          triggerHaptic();
                          setRegionCode(reg.code);
                        }}
                        className={`h-10 px-2.5 rounded-xl border text-xs font-medium text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? "bg-[#D4AF37]/15 border-[#D4AF37] text-white font-bold"
                            : "bg-[#161A24] border-white/[0.06] text-white/60 hover:text-white"
                        }`}
                      >
                        <span className="truncate">{reg.name}</span>
                        <span className="text-[9px] font-mono text-[#D4AF37] ml-1">{reg.code}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* LANGKAH 6: FOTO / LOGO (Area Unggah & Preset Avatar) */}
            {step === 6 && (
              <motion.div
                key="step-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full flex flex-col"
              >
                <h3 className="font-heading font-bold text-xl text-white mb-3">Foto Kartu</h3>

                {/* Quick Avatar Presets */}
                <div className="grid grid-cols-4 gap-2.5 mb-3">
                  {[
                    "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=400&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=300&auto=format&fit=crop",
                    "https://api.dicebear.com/7.x/bottts/svg?seed=MARAWA_KING",
                    "https://api.dicebear.com/7.x/bottts/svg?seed=BukitSlayer",
                  ].map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        triggerHaptic();
                        setAvatarUrl(url);
                      }}
                      className={`h-16 rounded-xl overflow-hidden border-2 transition-all ${
                        avatarUrl === url ? "border-[#D4AF37] scale-105" : "border-white/10 opacity-60"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="Preset" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>

                {/* URL Direct Custom */}
                <div className="relative w-full">
                  <input
                    type="text"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="Tautan Foto / Logo"
                    className="w-full h-11 bg-[#161A24] border border-white/[0.08] rounded-xl px-3 text-xs text-white placeholder-white/30 outline-none"
                  />
                </div>
              </motion.div>
            )}

            {/* LANGKAH 7: PRIVASI (Daftar Field dengan Toggle Mata & Gembok) */}
            {step === 7 && (
              <motion.div
                key="step-7"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full flex flex-col gap-2.5"
              >
                <h3 className="font-heading font-bold text-xl text-white mb-2">Atur Privasi</h3>

                {/* Daftar Field dengan Toggle Mata / Gembok (Teks Hanya Nama Field) */}
                {[
                  { key: "kontak", label: "Kontak" },
                  { key: "tglLahir", label: "Tanggal Lahir" },
                  { key: "statistik", label: "Statistik Match" },
                ].map((item) => {
                  const isPublic = privacy[item.key as keyof typeof privacy];
                  return (
                    <div
                      key={item.key}
                      onClick={() => {
                        triggerHaptic();
                        setPrivacy((prev) => ({
                          ...prev,
                          [item.key]: !prev[item.key as keyof typeof privacy],
                        }));
                      }}
                      className="w-full h-12 rounded-xl bg-[#161A24] border border-white/[0.08] px-4 flex items-center justify-between cursor-pointer hover:bg-[#1C202C] transition-all"
                    >
                      <span className="text-sm font-heading font-semibold text-white">
                        {item.label}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono text-white/50 uppercase">
                          {isPublic ? "Publik" : "Privat"}
                        </span>
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center ${
                            isPublic
                              ? "bg-[#4C7DFF]/15 text-[#4C7DFF]"
                              : "bg-[#22C55E]/15 text-[#22C55E]"
                          }`}
                        >
                          {isPublic ? <Eye className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 4. TOMBOL UTAMA SELALU DI BAWAH (Lebar Penuh, Tinggi 56px, Satu-satunya Elemen Menonjol) */}
        <div className="w-full pt-3">
          <button
            onClick={handleNext}
            disabled={isFinishing}
            className={`w-full h-14 rounded-full font-heading font-bold text-sm tracking-wider uppercase transition-all duration-200 active:scale-[0.98] shadow-lg flex items-center justify-center ${
              step === 7
                ? "bg-[#D4AF37] text-[#07080C] hover:bg-[#E5C158] shadow-[0_8px_24px_rgba(212,175,55,0.35)]"
                : "bg-[#4C7DFF] text-white hover:bg-[#3B6BE8] shadow-[0_8px_24px_rgba(76,125,255,0.25)]"
            }`}
          >
            {step === 7 ? "Buat Kartu" : "Lanjut"}
          </button>
        </div>
      </div>
    </div>
  );
}
