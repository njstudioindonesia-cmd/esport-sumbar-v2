"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ShieldCheck, Sparkles, MapPin, Award } from "lucide-react";

// Approximate coordinates for the 19 nodes in minimal SVG map
const NODES_19 = [
  { id: "PAS", x: 135, y: 35 },
  { id: "PSB", x: 95, y: 55 },
  { id: "AGM", x: 125, y: 75 },
  { id: "BKT", x: 145, y: 78 },
  { id: "LPK", x: 180, y: 70 },
  { id: "PYK", x: 170, y: 82 },
  { id: "PPJ", x: 140, y: 98 },
  { id: "TND", x: 160, y: 102 },
  { id: "PRM", x: 110, y: 110 },
  { id: "PDP", x: 122, y: 116 },
  { id: "PDG", x: 130, y: 140 },
  { id: "SWL", x: 190, y: 115 },
  { id: "SLK", x: 162, y: 130 },
  { id: "KSL", x: 172, y: 148 },
  { id: "SJJ", x: 205, y: 135 },
  { id: "DHM", x: 230, y: 168 },
  { id: "SLS", x: 185, y: 182 },
  { id: "PSS", x: 150, y: 210 },
  { id: "MTW", x: 50, y: 170 },
];

export function MobileOnboarding() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  const triggerHaptic = () => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(12);
      } catch {
        // Ignored on unsupported browsers
      }
    }
  };

  const handleNext = () => {
    triggerHaptic();
    if (currentSlide < 2) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      router.push("/register");
    }
  };

  const handleSkip = () => {
    triggerHaptic();
    router.push("/register");
  };

  const handleDragEnd = (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
    const threshold = 50;
    if (info.offset.x < -threshold && currentSlide < 2) {
      triggerHaptic();
      setCurrentSlide((prev) => prev + 1);
    } else if (info.offset.x > threshold && currentSlide > 0) {
      triggerHaptic();
      setCurrentSlide((prev) => prev - 1);
    }
  };

  return (
    <div className="relative w-full h-[100dvh] max-w-[420px] mx-auto bg-[#07080C] text-white flex flex-col justify-between p-6 overflow-hidden select-none">
      {/* Background Ambience (Radial Glow Halus) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[320px] h-[320px] bg-gradient-to-b from-[#D4AF37]/10 via-[#4C7DFF]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* TOP BAR: LEWATI (Kecil di kanan atas) */}
      <div className="w-full flex items-center justify-between z-20 pt-2">
        <div className="flex h-2 w-7 rounded-full overflow-hidden opacity-80">
          <span className="w-1/3 bg-[#C8102E]" />
          <span className="w-1/3 bg-[#D4AF37]" />
          <span className="w-1/3 bg-black" />
        </div>
        <button
          onClick={handleSkip}
          className="px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] backdrop-blur-md text-xs font-heading font-medium text-white/60 hover:text-white transition-colors"
        >
          Lewati
        </button>
      </div>

      {/* CENTER VISUAL AREA (Gesture Drag x / Parallax) */}
      <div className="relative flex-1 w-full flex items-center justify-center my-auto">
        <AnimatePresence mode="wait">
          {/* SLIDE 1: Tumpukan 3 Kartu Melayang dengan Parallax */}
          {currentSlide === 0 && (
            <motion.div
              key="slide-1"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              className="w-full flex flex-col items-center justify-center cursor-grab active:cursor-grabbing"
            >
              <div className="relative w-56 h-76 flex items-center justify-center">
                {/* Background Card Left */}
                <motion.div
                  animate={{ rotate: -12, x: -28, y: 10 }}
                  transition={{ type: "spring", damping: 20 }}
                  className="absolute w-44 h-64 rounded-[18px] bg-[#161A24]/90 border border-white/[0.08] shadow-lg opacity-60 flex flex-col p-3 justify-between"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-[#4C7DFF]/50" />
                  <div className="text-[10px] font-mono text-white/30 text-center">CONTENDER</div>
                </motion.div>

                {/* Background Card Right */}
                <motion.div
                  animate={{ rotate: 12, x: 28, y: 10 }}
                  transition={{ type: "spring", damping: 20 }}
                  className="absolute w-44 h-64 rounded-[18px] bg-[#161A24]/90 border border-white/[0.08] shadow-lg opacity-60 flex flex-col p-3 justify-between"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-[#22C55E]/50 ml-auto" />
                  <div className="text-[10px] font-mono text-white/30 text-center">ELITE</div>
                </motion.div>

                {/* Hero Foreground Card */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                  className="relative z-10 w-48 h-68 rounded-[18px] bg-gradient-to-b from-[#1F2433] to-[#0F1118] border border-[#D4AF37]/40 shadow-[0_16px_40px_rgba(212,175,55,0.18)] p-4 flex flex-col justify-between overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#D4AF37]/10 to-transparent pointer-events-none" />
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono font-bold text-[#D4AF37]">LEGEND TIER</span>
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-2xl bg-[#07080C] border border-[#D4AF37]/40 flex items-center justify-center shadow-inner">
                      <Award className="w-8 h-8 text-[#D4AF37]" />
                    </div>
                    <span className="mt-2 text-xs font-heading font-black tracking-wider text-white">
                      ATLET SUMBAR
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-white/[0.08]">
                    <span className="text-[8px] font-mono text-white/50">ESI-SB-2026</span>
                    <span className="text-[8px] font-mono text-[#D4AF37]">OVR 94</span>
                  </div>
                </motion.div>
              </div>

              {/* Teks: Satu kalimat maks 6 kata + tanpa subjudul */}
              <h2 className="mt-8 text-center font-heading font-semibold text-[22px] leading-tight text-white px-4">
                Identitas Digital Esport Sumatera Barat
              </h2>
            </motion.div>
          )}

          {/* SLIDE 2: Peta Sumatera Barat Minimalis (19 Titik Bercahaya) */}
          {currentSlide === 1 && (
            <motion.div
              key="slide-2"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              className="w-full flex flex-col items-center justify-center cursor-grab active:cursor-grabbing"
            >
              <div className="relative w-64 h-64 flex items-center justify-center">
                <svg
                  viewBox="0 0 280 250"
                  className="w-full h-full select-none"
                >
                  {/* Subtle Boundary Grid */}
                  <rect
                    x="10"
                    y="10"
                    width="260"
                    height="230"
                    rx="16"
                    fill="none"
                    stroke="rgba(255,255,255,0.04)"
                    strokeDasharray="4 4"
                  />

                  {/* Network Connectors */}
                  {NODES_19.slice(0, 15).map((node, i) => {
                    const next = NODES_19[(i + 3) % NODES_19.length];
                    return (
                      <line
                        key={`line-${node.id}`}
                        x1={node.x}
                        y1={node.y}
                        x2={next.x}
                        y2={next.y}
                        stroke="rgba(212,175,55,0.18)"
                        strokeWidth="1"
                        strokeDasharray="2 3"
                      />
                    );
                  })}

                  {/* 19 Glowing Nodes (Kota & Kabupaten) */}
                  {NODES_19.map((node, index) => (
                    <g key={node.id}>
                      {/* Pulse Ring */}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={index === 10 ? 8 : 4}
                        fill="none"
                        stroke="#D4AF37"
                        strokeWidth="0.8"
                        opacity={index === 10 ? 0.6 : 0.3}
                      />
                      {/* Central Glowing Dot */}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={index === 10 ? 3.5 : 2.5}
                        fill={index === 10 ? "#D4AF37" : "#FFFFFF"}
                      />
                    </g>
                  ))}
                </svg>

                {/* Floating Map Label Badge */}
                <div className="absolute bottom-2 px-3 py-1 rounded-full bg-[#161A24]/90 border border-white/[0.08] backdrop-blur-md flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-[#D4AF37]" />
                  <span className="text-[11px] font-mono text-white/80">19 KOTA / KABUPATEN</span>
                </div>
              </div>

              {/* Teks: Maks 6 kata, tanpa subjudul */}
              <h2 className="mt-8 text-center font-heading font-semibold text-[22px] leading-tight text-white px-4">
                Jejaring 19 Wilayah Ranah Minang
              </h2>
            </motion.div>
          )}

          {/* SLIDE 3: Kartu dengan Lencana Emas Menyala */}
          {currentSlide === 2 && (
            <motion.div
              key="slide-3"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              className="w-full flex flex-col items-center justify-center cursor-grab active:cursor-grabbing"
            >
              <div className="relative w-56 h-76 flex items-center justify-center">
                {/* Glowing Aura Behind Card */}
                <div className="absolute inset-0 bg-[#D4AF37]/25 rounded-[22px] blur-2xl animate-pulse pointer-events-none" />

                {/* TCG Card with Gold Verified Badge */}
                <div className="relative z-10 w-50 h-72 rounded-[18px] bg-gradient-to-b from-[#1C202C] to-[#0A0D14] border border-[#D4AF37]/60 shadow-[0_0_36px_rgba(212,175,55,0.3)] p-4 flex flex-col justify-between overflow-hidden">
                  {/* Subtle Holographic Light Beam */}
                  <motion.div
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/15 to-transparent skew-x-12 pointer-events-none"
                  />

                  {/* Top: Verification Badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 px-2.5 py-0.8 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40">
                      <ShieldCheck className="w-3 h-3 text-[#D4AF37]" />
                      <span className="text-[9px] font-mono font-bold text-[#D4AF37] uppercase">VERIFIED</span>
                    </div>
                    <span className="text-[8px] font-mono text-white/40">ESI PENGPROV</span>
                  </div>

                  {/* Center Emblem */}
                  <div className="flex flex-col items-center my-auto">
                    <div className="relative w-18 h-18 rounded-2xl bg-gradient-to-tr from-[#0F1118] to-[#1A1E29] border border-[#D4AF37]/50 flex items-center justify-center shadow-[0_0_24px_rgba(212,175,55,0.35)]">
                      <ShieldCheck className="w-9 h-9 text-[#D4AF37]" />
                    </div>
                    <div className="mt-2.5 text-center">
                      <div className="text-xs font-heading font-black text-white tracking-wide">
                        LENCANA EMAS
                      </div>
                      <div className="text-[9px] font-mono text-[#D4AF37] font-semibold mt-0.5">
                        ESI-SB-VER-2026
                      </div>
                    </div>
                  </div>

                  {/* Bottom Strip */}
                  <div className="text-center pt-2 border-t border-white/[0.08]">
                    <span className="text-[9px] font-mono text-white/50 tracking-wider">
                      TERVERIFIKASI RESMI
                    </span>
                  </div>
                </div>
              </div>

              {/* Teks: Maks 6 kata, tanpa subjudul */}
              <h2 className="mt-8 text-center font-heading font-semibold text-[22px] leading-tight text-white px-4">
                Satu Kartu Menuju Panggung Juara
              </h2>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* BOTTOM SECTION: DOTS + ACTION BUTTON */}
      <div className="w-full flex flex-col items-center gap-6 z-20 pb-4">
        {/* Indikator Titik (3 Dots) */}
        <div className="flex items-center gap-2">
          {[0, 1, 2].map((idx) => (
            <button
              key={idx}
              onClick={() => {
                triggerHaptic();
                setCurrentSlide(idx);
              }}
              aria-label={`Ke slide ${idx + 1}`}
              className={`h-1.5 transition-all duration-300 rounded-full ${
                currentSlide === idx
                  ? "w-7 bg-[#D4AF37]"
                  : "w-1.5 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>

        {/* Tombol Aksi Utama: "Mulai" di slide terakhir atau "Lanjut" (Pill penuh, lebar penuh, h-14) */}
        <button
          onClick={handleNext}
          className={`w-full h-14 rounded-full font-heading font-bold text-sm tracking-wider uppercase transition-all duration-200 active:scale-[0.98] shadow-lg flex items-center justify-center ${
            currentSlide === 2
              ? "bg-[#D4AF37] text-[#07080C] hover:bg-[#E5C158] shadow-[0_8px_24px_rgba(212,175,55,0.3)]"
              : "bg-[#4C7DFF] text-white hover:bg-[#3B6BE8] shadow-[0_8px_24px_rgba(76,125,255,0.25)]"
          }`}
        >
          {currentSlide === 2 ? "Mulai" : "Lanjut"}
        </button>
      </div>
    </div>
  );
}
