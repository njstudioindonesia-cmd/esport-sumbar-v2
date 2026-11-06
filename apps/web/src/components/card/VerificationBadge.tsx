"use client";

import React from "react";
import { ShieldCheck, Award, PauseCircle, Clock } from "lucide-react";
import { CardVerification, CardSize } from "@/types/card";

interface VerificationBadgeProps {
  status: CardVerification | "verified" | "under_review" | "suspended" | "unverified";
  regionCode?: string;
  badgeNumber?: string;
  size?: CardSize;
}

export function VerificationBadge({
  status,
  regionCode = "SB",
  badgeNumber,
  size = "md",
}: VerificationBadgeProps) {
  if (status === "unverified" || !status) {
    return null;
  }

  const isSmall = size === "sm";

  if (status === "verified" || status === "regional") {
    return (
      <div
        className="relative group flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gradient-to-r from-[#1A1810]/95 via-[#231F10]/95 to-[#1A1810]/95 border border-[#D4AF37]/80 shadow-[0_0_15px_rgba(212,175,55,0.4)] backdrop-blur-md"
        title="Diverifikasi Resmi oleh ESPORT SUMBAR"
      >
        <Award className={isSmall ? "w-3 h-3 text-[#D4AF37]" : "w-3.5 h-3.5 text-[#D4AF37]"} />
        <div className="flex flex-col leading-none">
          <span className={`font-heading uppercase tracking-wider font-extrabold text-[#D4AF37] ${isSmall ? "text-[9px]" : "text-[10px]"}`}>
            ESPORT SUMBAR
          </span>
          {badgeNumber && !isSmall && (
            <span className="text-[7px] text-[#D4AF37]/80 font-mono tracking-tighter">
              {badgeNumber}
            </span>
          )}
        </div>
      </div>
    );
  }

  if (status === "reverify" || status === "under_review") {
    return (
      <div
        className="relative flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#1A1810]/95 border border-[#F59E0B]/70 shadow-[0_0_14px_rgba(245,158,11,0.35)] backdrop-blur-md"
        title="Dalam Proses Telaah Verifikasi ESPORT SUMBAR"
      >
        <Clock className={isSmall ? "w-3 h-3 text-[#F59E0B]" : "w-3.5 h-3.5 text-[#F59E0B]"} />
        <span className={`font-heading uppercase tracking-wider font-bold text-[#F59E0B] ${isSmall ? "text-[9px]" : "text-[10px]"}`}>
          PROSES TELAAH
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-ping ml-0.5" />
      </div>
    );
  }

  if (status === "suspended") {
    return (
      <div
        className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#1C1D22]/90 border border-[#6B7280]/60 shadow-[0_0_8px_rgba(107,114,128,0.25)] backdrop-blur-md"
        title="Verifikasi Ditangguhkan"
      >
        <PauseCircle className={isSmall ? "w-3 h-3 text-[#9CA3AF]" : "w-3.5 h-3.5 text-[#9CA3AF]"} />
        <span className={`font-heading uppercase tracking-wider font-medium text-[#9CA3AF] ${isSmall ? "text-[9px]" : "text-[10px]"}`}>
          DITANGGUHKAN
        </span>
      </div>
    );
  }

  return null;
}
