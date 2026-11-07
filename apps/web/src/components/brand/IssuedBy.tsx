"use client";

import React from "react";
import Image from "next/image";

interface IssuedByProps {
  className?: string;
  variant?: "badge" | "inline" | "stamp";
  theme?: "dark" | "gold" | "card";
}

export function IssuedBy({
  className = "",
  variant = "badge",
  theme = "dark",
}: IssuedByProps) {
  if (variant === "inline") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 text-[10px] tracking-wide uppercase font-mono text-white/50 ${className}`}
      >
        <span className="relative w-3.5 h-2">
          <Image
            src="/brand/logo-mark-pink.png"
            alt=""
            fill
            sizes="14px"
            className="object-contain"
          />
        </span>
        <span>
          Diterbitkan oleh <strong className="text-white/80">ESPORT SUMBAR™</strong>
        </span>
      </span>
    );
  }

  if (variant === "stamp") {
    return (
      <div
        className={`px-3 py-1.5 rounded-lg border border-[#FF1752]/30 bg-[#FF1752]/5 backdrop-blur-sm flex items-center gap-2 ${className}`}
      >
        <div className="relative w-5 h-3 shrink-0">
          <Image
            src="/brand/logo-mark-pink.png"
            alt=""
            fill
            sizes="20px"
            className="object-contain"
          />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-[8px] font-mono tracking-widest text-[#FF4D77] uppercase font-bold">
            Kartu Digital
          </span>
          <span className="text-[10px] font-heading font-black text-white tracking-wider uppercase">
            ESPORT SUMBAR™
          </span>
        </div>
      </div>
    );
  }

  // variant === "badge" (default)
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#03031A]/90 border border-white/10 shadow-sm backdrop-blur-md ${className}`}
    >
      <div className="relative w-4 h-2.5 shrink-0">
        <Image
          src="/brand/logo-mark-pink.png"
          alt=""
          fill
          sizes="16px"
          className="object-contain"
        />
      </div>
      <span className="text-[9px] font-mono uppercase tracking-wider text-white/60">
        Diterbitkan oleh <span className="text-white font-bold">ESPORT SUMBAR™</span>
      </span>
    </div>
  );
}
