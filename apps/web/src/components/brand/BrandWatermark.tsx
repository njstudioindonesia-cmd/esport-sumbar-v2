"use client";

import React from "react";
import Image from "next/image";

interface BrandWatermarkProps {
  className?: string;
  opacity?: number; // 0.03 to 0.08
  position?: "top-right" | "bottom-right" | "center" | "bottom-left" | "top-left";
  size?: number; // width in px, default 480
  variant?: "pink" | "white";
}

export function BrandWatermark({
  className = "",
  opacity = 0.04,
  position = "top-right",
  size = 520,
  variant = "pink",
}: BrandWatermarkProps) {
  const positionClasses = {
    "top-right": "-top-12 -right-16 md:-top-20 md:-right-24",
    "bottom-right": "-bottom-12 -right-16 md:-bottom-20 md:-right-24",
    center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
    "bottom-left": "-bottom-12 -left-16 md:-bottom-20 md:-left-24",
    "top-left": "-top-12 -left-16 md:-top-20 md:-left-24",
  };

  const imageSrc =
    variant === "white"
      ? "/brand/logo-mark-white.png"
      : "/brand/logo-mark-pink.png";

  return (
    <div
      className={`absolute pointer-events-none select-none z-0 overflow-hidden ${positionClasses[position]} ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <div style={{ width: size, height: size * 0.55 }} className="relative">
        <Image
          src={imageSrc}
          alt=""
          fill
          sizes="(max-width: 768px) 320px, 600px"
          className="object-contain"
          priority={false}
        />
      </div>
    </div>
  );
}
