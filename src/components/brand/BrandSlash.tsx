"use client";

import React from "react";

interface BrandSlashProps {
  className?: string;
  variant?: "pink" | "navy" | "subtle" | "glow";
  height?: number; // px, default 40
  angle?: "left" | "right";
}

export function BrandSlash({
  className = "",
  variant = "pink",
  height = 36,
  angle = "right",
}: BrandSlashProps) {
  const isRight = angle === "right";
  // SVG slanted divider polygon
  return (
    <div
      className={`w-full overflow-hidden relative select-none pointer-events-none ${className}`}
      style={{ height: `${height}px` }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1200 40"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="slashPinkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF1752" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#FF4D77" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#00004F" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="slashNavyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0A0A2E" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#03031A" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {variant === "pink" && (
          <polygon
            points={isRight ? "0,0 1200,20 1200,40 0,40" : "0,20 1200,0 1200,40 0,40"}
            fill="url(#slashPinkGrad)"
          />
        )}

        {variant === "navy" && (
          <polygon
            points={isRight ? "0,0 1200,30 1200,40 0,40" : "0,30 1200,0 1200,40 0,40"}
            fill="url(#slashNavyGrad)"
          />
        )}

        {variant === "subtle" && (
          <polygon
            points={isRight ? "0,15 1200,5 1200,40 0,40" : "0,5 1200,15 1200,40 0,40"}
            fill="rgba(255, 255, 255, 0.03)"
          />
        )}

        {variant === "glow" && (
          <>
            <polygon
              points={isRight ? "0,10 1200,25 1200,40 0,40" : "0,25 1200,10 1200,40 0,40"}
              fill="rgba(10, 10, 46, 0.7)"
            />
            <line
              x1="0"
              y1={isRight ? "10" : "25"}
              x2="1200"
              y2={isRight ? "25" : "10"}
              stroke="#FF1752"
              strokeWidth="2"
              strokeOpacity="0.6"
            />
          </>
        )}
      </svg>
    </div>
  );
}
