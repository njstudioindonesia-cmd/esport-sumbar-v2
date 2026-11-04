"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MobileSplashProps {
  onFinish?: () => void;
  durationMs?: number;
}

export function MobileSplash({
  onFinish,
  durationMs = 1500,
}: MobileSplashProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onFinish?.();
    }, durationMs);

    return () => clearTimeout(timer);
  }, [durationMs, onFinish]);

  const handleSkip = () => {
    setIsVisible(false);
    onFinish?.();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="mobile-splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.35, ease: "easeInOut" } }}
          onClick={handleSkip}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#07080C] overflow-hidden select-none cursor-pointer"
        >
          {/* Subtle Ambient Radial Gradients (Emas-Merah Marawa sangat halus) */}
          <div className="absolute w-[340px] h-[340px] rounded-full bg-gradient-to-tr from-[#C8102E]/10 via-[#D4AF37]/15 to-transparent blur-3xl pointer-events-none" />
          <div className="absolute w-[220px] h-[220px] rounded-full bg-[#D4AF37]/8 blur-2xl pointer-events-none" />

          {/* 3D Rotating Empty TCG Card */}
          <div className="relative w-44 h-64 flex items-center justify-center [perspective:1000px]">
            <motion.div
              initial={{ rotateY: -30, rotateX: 10, scale: 0.85, opacity: 0 }}
              animate={{
                rotateY: [ -30, 25, 0 ],
                rotateX: [ 10, -5, 0 ],
                scale: [ 0.85, 1.02, 1 ],
                opacity: 1,
              }}
              transition={{
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1], // Smooth premium spring damping
              }}
              className="relative w-full h-full rounded-[18px] bg-gradient-to-b from-[#161A24]/90 to-[#0F1118]/90 border border-white/10 shadow-[0_12px_40px_rgba(212,175,55,0.12)] p-4 flex flex-col items-center justify-between overflow-hidden"
            >
              {/* Card Inner Holographic Sheen */}
              <motion.div
                initial={{ x: "-150%", opacity: 0 }}
                animate={{ x: "150%", opacity: [0, 0.4, 0] }}
                transition={{ duration: 1.1, delay: 0.2, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none"
              />

              {/* Top Card Header Indicator */}
              <div className="w-full flex items-center justify-between">
                <div className="flex h-1.5 w-5 rounded-full overflow-hidden">
                  <span className="w-1/3 bg-[#C8102E]" />
                  <span className="w-1/3 bg-[#D4AF37]" />
                  <span className="w-1/3 bg-black" />
                </div>
                <div className="w-2 h-2 rounded-full bg-[#D4AF37]/60" />
              </div>

              {/* Central Logo Container (Fade In) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35, duration: 0.5, ease: "easeOut" }}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#07080C] border border-[#D4AF37]/30 shadow-[0_0_24px_rgba(212,175,55,0.2)] flex items-center justify-center">
                  <div className="flex flex-col items-center justify-center">
                    <span className="font-heading font-black text-sm text-white tracking-widest">
                      ESI
                    </span>
                    <span className="text-[8px] font-mono font-bold text-[#D4AF37] leading-none">
                      SUMBAR
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Bottom Card Footer Accent */}
              <div className="w-full text-center">
                <span className="text-[9px] font-mono tracking-widest text-white/30 uppercase">
                  TCG ID
                </span>
              </div>
            </motion.div>
          </div>

          {/* Clean App Title (Fade In) */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="mt-6 flex flex-col items-center"
          >
            <div className="font-heading font-black text-lg tracking-wider text-white">
              ESPORT<span className="text-[#D4AF37]">SUMBAR</span>
            </div>
            <div className="text-[10px] font-mono tracking-widest text-white/40 uppercase mt-0.5">
              Identitas Digital
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
