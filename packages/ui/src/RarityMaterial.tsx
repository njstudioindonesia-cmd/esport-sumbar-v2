import React from "react";
import { rarityMaterials, RarityTierKey } from "@esport-sumbar/design-tokens";

export interface RarityMaterialProps {
  tier: RarityTierKey;
  size?: "sm" | "md";
  className?: string;
}

export function RarityMaterialTag({
  tier,
  size = "md",
  className = "",
}: RarityMaterialProps) {
  const config = rarityMaterials[tier] || rarityMaterials.rookie;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
  }[size];

  return (
    <span
      style={{
        borderColor: config.colors.border,
        color: config.colors.text,
      }}
      className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-wider rounded-md border bg-[#0C0C26] select-none ${sizeClasses} ${className}`}
    >
      <span
        style={{ backgroundColor: config.colors.badge }}
        className="w-1.5 h-1.5 rounded-full"
      />
      <span>{config.label}</span>
      <span className="text-[10px] font-normal opacity-60 font-sans">({config.material})</span>
    </span>
  );
}
