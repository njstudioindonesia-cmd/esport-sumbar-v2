"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ShieldCheck, Sparkles, Award, ArrowRight } from "lucide-react";
import { BrandWatermark, IssuedBy } from "@/components/brand";

export function MobileOnboarding() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  const triggerHaptic = () => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(12);
      } catch {
        // Ignored
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

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
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
    <div className="relative w-full h-[100dvh] max-w-[420px] mx-auto bg-[#03031A] text-white flex flex-col justify-between p-6 overflow-hidden select-none">
      {/* Background Ambience & Watermark */}
      <BrandWatermark opacity={0.05} size={360} position="top-right" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-[#FF1752]/10 rounded-full blur-3xl pointer-events-none" />

      {/* TOP BAR: BRAND MARK & LEWATI */}
      <div className="w-full flex items-center justify-between z-20 pt-2">
        <div className="relative w-7 h-4">
          <Image
            src="/brand/logo-mark-pink.png"
            alt="ESPORT SUMBAR"
            fill
            sizes="28px"
            className="object-contain"
          />
        </div>
        <button
          onClick={handleSkip}
          className="px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] backdrop-blur-md text-xs font-heading font-medium text-white/60 hover:text-white transition-colors"
        >
          Lewati
        </button>
      </div>

      {/* CENTER VISUAL AREA */}
      <div className="relative flex-1 w-full flex items-center justify-center my-auto">
        <AnimatePresence mode="wait">
          {/* SLIDE 1: Mark Besar & Tagline (Maks 6 kata) */}
          {currentSlide === 0 && (
            <motion.div
              key="slide-1"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center text-center gap-6"
            >
              <div className="relative w-36 h-20 animate-brand-pulse">
                <Image
                  src="/brand/logo-mark-pink.png"
                  alt="ESPORT SUMBAR"
                  fill
                  sizes="144px"
                  className="object-contain"
                  priority
                />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#FF4D77] font-bold block">
                  ESPORT SUMBAR™
                </span>
                <h2 className="font-heading font-black text-3xl uppercase tracking-tight text-white leading-none">
                  Pusat Data Esport Ranah Minang
                </h2>
                <p className="text-xs text-white/60 max-w-xs mx-auto">
                  Satu platform untuk seluruh atlet dan turnamen Sumatera Barat.
                </p>
              </div>
            </motion.div>
          )}

          {/* SLIDE 2: Kartu Milikmu dengan Tilt (Maks 6 kata) */}
          {currentSlide === 1 && (
            <motion.div
              key="slide-2"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center text-center gap-6"
            >
              {/* Tilted Card Visual */}
              <div className="relative w-44 h-64 rounded-2xl bg-gradient-to-b from-[#0A0A2E] to-[#03031A] border-2 border-[#FF1752]/40 shadow-[0_16px_40px_rgba(255,23,82,0.25)] p-4 flex flex-col justify-between transform -rotate-3 hover:rotate-0 transition-transform">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-mono text-[#FF4D77] uppercase font-bold">
                    ESPORT ID
                  </span>
                  <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-16 h-16 rounded-full bg-[#12123F] border border-white/10 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-[#FF1752]" />
                  </div>
                  <span className="font-heading font-black text-sm text-white uppercase mt-1">
                    Paspor Atlet
                  </span>
                </div>
                <IssuedBy variant="badge" />
              </div>

              <div className="space-y-2">
                <h2 className="font-heading font-black text-3xl uppercase tracking-tight text-white leading-none">
                  Kartu Digital Identitas Pribadimu
                </h2>
                <p className="text-xs text-white/60 max-w-xs mx-auto">
                  Catat statistik turnamen dan tingkatkan tier kartu ke Elite.
                </p>
              </div>
            </motion.div>
          )}

          {/* SLIDE 3: Diverifikasi Mitra ESI (Maks 6 kata) */}
          {currentSlide === 2 && (
            <motion.div
              key="slide-3"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center text-center gap-6"
            >
              <div className="w-20 h-20 rounded-3xl bg-[#0A0A2E] border border-[#22C55E]/40 flex items-center justify-center text-[#22C55E] shadow-[0_0_30px_rgba(34,197,94,0.25)]">
                <ShieldCheck className="w-10 h-10" />
              </div>

              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0A0A2E] border border-white/10 text-[10px] font-mono text-white/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF1752]" />
                  <span>Platform oleh ESPORT SUMBAR™</span>
                </div>

                <h2 className="font-heading font-black text-3xl uppercase tracking-tight text-white leading-none">
                  Diverifikasi Mitra Kelembagaan ESI
                </h2>
                <p className="text-xs text-white/60 max-w-xs mx-auto">
                  Data atlet divalidasi langsung oleh Pengcab & Pengprov ESI Sumbar.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* BOTTOM CONTROLS: INDICATOR DOTS & NEXT BUTTON */}
      <div className="w-full flex flex-col gap-5 z-20 pb-4">
        {/* Slide Dots */}
        <div className="flex items-center justify-center gap-2">
          {[0, 1, 2].map((idx) => (
            <button
              key={idx}
              onClick={() => {
                triggerHaptic();
                setCurrentSlide(idx);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentSlide === idx
                  ? "w-8 bg-[#FF1752]"
                  : "w-2 bg-white/20"
              }`}
              aria-label={`Pindah ke slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Action Button */}
        <button
          onClick={handleNext}
          className="btn-brand-primary w-full py-3.5 text-center text-xs justify-center"
        >
          <span>{currentSlide === 2 ? "Mulai Sekarang" : "Lanjutkan"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
