"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface MobileSplashProps {
  onFinish?: () => void;
  durationMs?: number;
}

export function MobileSplash({
  onFinish,
  durationMs = 1400,
}: MobileSplashProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Skip splash if already seen this session
    const hasSeenSplash = sessionStorage.getItem("esport_sumbar_splash_seen");
    if (hasSeenSplash) {
      setIsVisible(false);
      onFinish?.();
      return;
    }

    sessionStorage.setItem("esport_sumbar_splash_seen", "true");

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
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#03031A] overflow-hidden select-none cursor-pointer"
        >
          {/* Subtle Ambient Pink Glow */}
          <div className="absolute w-[360px] h-[360px] rounded-full bg-[#FF1752]/15 blur-3xl pointer-events-none" />
          <div className="absolute w-[220px] h-[220px] rounded-full bg-[#00004F]/60 blur-2xl pointer-events-none" />

          {/* Central Animated Mark with Spring Movement */}
          <div className="relative z-10 flex flex-col items-center gap-4">
            <motion.div
              initial={{ scale: 0.7, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative w-24 h-14 flex items-center justify-center"
            >
              <Image
                src="/brand/logo-mark-pink.png"
                alt="ESPORT SUMBAR"
                fill
                sizes="96px"
                className="object-contain"
                priority
              />
            </motion.div>

            {/* Skewed Title Sliding In */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
              className="flex flex-col items-center text-center"
            >
              <span className="font-heading font-black text-2xl tracking-wider text-white uppercase display-skew">
                ESPORT <span className="text-[#FF1752]">SUMBAR</span>
              </span>
              <span className="text-[10px] font-mono tracking-[0.25em] text-white/50 uppercase mt-0.5">
                Pusat Data & Identitas
              </span>
            </motion.div>

            {/* Animated Loading Sheen Bar */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 120 }}
              transition={{ duration: 1.0, ease: "easeInOut" }}
              className="h-[2px] bg-gradient-to-r from-transparent via-[#FF1752] to-transparent mt-2 rounded-full"
            />
          </div>

          {/* Skip Notice */}
          <span className="absolute bottom-8 text-[10px] font-mono text-white/30 uppercase tracking-widest">
            Sentuh untuk lewati
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
