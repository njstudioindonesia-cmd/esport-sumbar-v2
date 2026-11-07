"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ShieldCheck, ChevronRight, Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { MOTION_SPRINGS, MOTION_DURATIONS } from "./MotionPresets";
import { useQualityMode, useIsReducedMotion } from "./useQualityMode";

export interface CardSuccessCelebrationProps {
  esportId: string;
  entityType?: string;
  rarityTier?: string;
  onCopyEsportId?: () => void;
  className?: string;
}

export function CardSuccessCelebration({
  esportId,
  entityType = "player",
  rarityTier = "common",
  onCopyEsportId,
  className,
}: CardSuccessCelebrationProps) {
  const { quality } = useQualityMode();
  const isReducedMotion = useIsReducedMotion();
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(esportId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onCopyEsportId?.();
    }
  };

  return (
    <motion.div
      initial={
        isReducedMotion
          ? { opacity: 0 }
          : { opacity: 0, scale: 0.9, y: 16 }
      }
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={
        isReducedMotion
          ? { duration: MOTION_DURATIONS.instant }
          : MOTION_SPRINGS.fluid
      }
      className={cn(
        "relative p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-[#D4AF37]/40 shadow-2xl overflow-hidden flex flex-col items-center text-center",
        className
      )}
    >
      {/* Liquid Radial Ambient Halo */}
      {quality !== "eco" && !isReducedMotion && (
        <div
          aria-hidden="true"
          className="absolute -top-24 inset-x-0 h-48 bg-gradient-to-b from-[#D4AF37]/20 via-[#FF1752]/10 to-transparent blur-2xl pointer-events-none -z-0"
        />
      )}

      {/* Celebratory Icon Badge */}
      <motion.div
        initial={isReducedMotion ? {} : { scale: 0, rotate: -20 }}
        animate={isReducedMotion ? {} : { scale: 1, rotate: 0 }}
        transition={MOTION_SPRINGS.snappy}
        className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#D4AF37] to-[#F5D77F] p-0.5 shadow-xl shadow-amber-900/30 mb-4 flex items-center justify-center relative z-10"
      >
        <div className="w-full h-full rounded-[22px] bg-slate-950/80 flex items-center justify-center text-[#D4AF37]">
          <Sparkles className="w-8 h-8" />
        </div>
      </motion.div>

      {/* Success Title */}
      <h3 className="text-xl sm:text-2xl font-heading font-black text-white tracking-tight relative z-10">
        Kartu Paspor Berhasil Diterbitkan!
      </h3>
      <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-sm relative z-10">
        Identitas digital terdaftar di database ESPORT SUMBAR. Simpan ESPORT ID unik Anda untuk kebutuhan turnamen.
      </p>

      {/* ESPORT ID Display Box with Copy Action */}
      <div className="mt-5 p-3 sm:p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center gap-3 relative z-10 w-full max-w-xs justify-between">
        <div className="text-left">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
            ESPORT ID Anda
          </span>
          <span className="text-base font-mono font-black text-[#D4AF37] tracking-wider block">
            {esportId}
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Salin ESPORT ID"
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>

      {/* Next Actions: Dashboard & Verification */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-6 relative z-10 w-full">
        <Link
          href="/dashboard"
          className="flex-1 min-w-[140px] px-5 py-3 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#F5D77F] text-slate-950 text-xs font-heading font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-amber-950/20 hover:brightness-110 transition-all min-h-[44px]"
        >
          <span>Dashboard</span>
          <ChevronRight className="w-4 h-4" />
        </Link>

        <Link
          href="/me/verification"
          className="flex-1 min-w-[140px] px-4 py-3 rounded-2xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/15 text-xs font-mono text-white flex items-center justify-center gap-1.5 transition-all min-h-[44px]"
        >
          <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
          <span>Verifikasi</span>
        </Link>
      </div>
    </motion.div>
  );
}
