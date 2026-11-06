import React from "react";
import { Sparkles, Trophy, Crown, Flame } from "lucide-react";
import { CardRarity } from "@/types/card";

interface RarityTagProps {
  rarity: CardRarity | string;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
}

export function RarityTag({
  rarity,
  size = "md",
  showIcon = true,
  className = "",
}: RarityTagProps) {
  const normalized = rarity.toLowerCase();

  const configs: Record<
    string,
    { label: string; icon: React.ComponentType<{ className?: string }>; bg: string; border: string; text: string }
  > = {
    rookie: {
      label: "Rookie",
      icon: Sparkles,
      bg: "bg-[#161922]",
      border: "border-[#3B4254]",
      text: "text-gray-300",
    },
    contender: {
      label: "Contender",
      icon: Trophy,
      bg: "bg-[#22C55E]/15",
      border: "border-[#22C55E]/40",
      text: "text-[#22C55E]",
    },
    elite: {
      label: "Elite",
      icon: Flame,
      bg: "bg-[#3B82F6]/15",
      border: "border-[#3B82F6]/40",
      text: "text-[#60A5FA]",
    },
    legend: {
      label: "Legend",
      icon: Crown,
      bg: "bg-gradient-to-r from-[#D4AF37]/25 to-[#F3DE8A]/25",
      border: "border-[#D4AF37]/60",
      text: "text-[#D4AF37]",
    },
  };

  const config = configs[normalized] || configs.rookie;
  const Icon = config.icon;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[9px] gap-1",
    md: "px-2.5 py-0.5 text-[10px] gap-1.5",
    lg: "px-3.5 py-1 text-xs gap-1.5",
  };

  const iconSizes = {
    sm: "w-2.5 h-2.5",
    md: "w-3 h-3",
    lg: "w-3.5 h-3.5",
  };

  return (
    <span
      className={`inline-flex items-center rounded-lg font-heading font-black uppercase tracking-wider border shadow-sm ${config.bg} ${config.border} ${config.text} ${sizeClasses[size]} ${className}`}
    >
      {showIcon && <Icon className={`${iconSizes[size]} shrink-0`} />}
      <span>{config.label}</span>
    </span>
  );
}
