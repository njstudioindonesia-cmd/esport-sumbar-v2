"use client";

import React from "react";

interface BrandBarProps {
  className?: string;
  glow?: boolean;
}

export function BrandBar({ className = "", glow = true }: BrandBarProps) {
  return (
    <div
      className={`w-full h-[2px] relative overflow-hidden bg-gradient-to-r from-transparent via-[#FF1752] to-transparent ${className}`}
      aria-hidden="true"
    >
      <div
        className="w-full h-full animate-brand-bar bg-gradient-to-r from-transparent via-white/80 to-transparent"
        style={{
          backgroundSize: "200% 100%",
        }}
      />
      {glow && (
        <div
          className="absolute inset-0 bg-[#FF1752] blur-[2px] opacity-60 pointer-events-none"
          aria-hidden="true"
        />
      )}
    </div>
  );
}
