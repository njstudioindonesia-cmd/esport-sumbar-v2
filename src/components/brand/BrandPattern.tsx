"use client";

import React from "react";

interface BrandPatternProps {
  className?: string;
  opacity?: number; // 0.02 to 0.08
  variant?: "diagonal" | "grid" | "dots";
}

export function BrandPattern({
  className = "",
  opacity = 0.03,
  variant = "diagonal",
}: BrandPatternProps) {
  const getPatternStyle = () => {
    if (variant === "dots") {
      return {
        backgroundImage: "radial-gradient(rgba(255, 23, 82, 0.4) 1px, transparent 0)",
        backgroundSize: "24px 24px",
      };
    }

    if (variant === "grid") {
      return {
        backgroundImage:
          "linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      };
    }

    // Default diagonal slashes matching mark angle (-45deg / -8deg)
    return {
      backgroundImage:
        "repeating-linear-gradient(-45deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.06) 1px, transparent 1px, transparent 12px)",
    };
  };

  return (
    <div
      className={`absolute inset-0 pointer-events-none select-none z-0 ${className}`}
      style={{ opacity, ...getPatternStyle() }}
      aria-hidden="true"
    />
  );
}
