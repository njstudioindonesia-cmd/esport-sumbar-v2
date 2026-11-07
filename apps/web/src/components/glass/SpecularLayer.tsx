"use client";

import React from "react";

interface SpecularLayerProps {
  className?: string;
  intensity?: "soft" | "normal" | "strong";
  pointerInteractive?: boolean;
}

export function SpecularLayer({
  className = "",
  intensity = "normal",
  pointerInteractive = true,
}: SpecularLayerProps) {
  const opacity =
    intensity === "soft" ? "opacity-40" : intensity === "strong" ? "opacity-90" : "opacity-70";

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none rounded-[inherit] overflow-hidden ${opacity} ${
        pointerInteractive ? "glass-specular" : ""
      } ${className}`}
    >
      {/* Light edge rim on top and left */}
      <div className="absolute inset-0 rounded-[inherit] border border-white/20 mask-gradient" />
    </div>
  );
}
