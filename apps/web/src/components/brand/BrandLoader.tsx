"use client";

import React from "react";
import Image from "next/image";

interface BrandLoaderProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "fullscreen";
  text?: string;
}

export function BrandLoader({
  className = "",
  size = "md",
  text = "Memuat data...",
}: BrandLoaderProps) {
  const isFullscreen = size === "fullscreen";

  const content = (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      {/* Animated Dual-Wing Mark */}
      <div className="relative w-20 h-12 flex items-center justify-center">
        {/* Ambient Glow */}
        <div className="absolute w-16 h-16 bg-[#FF1752]/20 rounded-full blur-xl animate-pulse pointer-events-none" />

        {/* Central Logo Mark with Spring Pulse */}
        <div className="relative w-16 h-9 animate-brand-pulse">
          <Image
            src="/brand/logo-mark-pink.png"
            alt="ESPORT SUMBAR"
            fill
            sizes="64px"
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Brand Text & Indicator */}
      <div className="flex flex-col items-center gap-1.5 text-center">
        <span className="font-heading font-black text-xs uppercase tracking-[0.2em] text-white/90">
          ESPORT SUMBAR
        </span>
        {text && (
          <span className="text-[11px] text-white/40 font-mono tracking-wide">
            {text}
          </span>
        )}
      </div>

      {/* Thin animated line */}
      <div className="w-24 h-0.5 bg-white/10 rounded-full overflow-hidden relative">
        <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-[#FF1752] to-transparent animate-brand-bar" />
      </div>
    </div>
  );

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-[#03031A]/95 backdrop-blur-md flex items-center justify-center p-6">
        {content}
      </div>
    );
  }

  return content;
}
