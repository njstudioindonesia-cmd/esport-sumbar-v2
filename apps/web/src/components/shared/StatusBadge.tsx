import React from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Award,
  AlertOctagon,
  RefreshCw,
  Clock,
} from "lucide-react";
import { CardVerification } from "@/types/card";

interface StatusBadgeProps {
  status: CardVerification | string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function StatusBadge({ status, size = "md", className = "" }: StatusBadgeProps) {
  const normalized = status.toLowerCase();

  const configs: Record<
    string,
    { label: string; icon: React.ComponentType<{ className?: string }>; bg: string; border: string; text: string }
  > = {
    unverified: {
      label: "Belum Verifikasi",
      icon: ShieldAlert,
      bg: "bg-[#1E232F]/80",
      border: "border-[#3B4254]",
      text: "text-gray-400",
    },
    regional: {
      label: "Regional Checked",
      icon: ShieldCheck,
      bg: "bg-[#22C55E]/15",
      border: "border-[#22C55E]/40",
      text: "text-[#22C55E]",
    },
    verified: {
      label: "Verified (Resmi)",
      icon: Award,
      bg: "bg-gradient-to-r from-[#D4AF37]/20 to-[#E5C358]/20",
      border: "border-[#D4AF37]/60",
      text: "text-[#D4AF37]",
    },
    suspended: {
      label: "Ditangguhkan",
      icon: AlertOctagon,
      bg: "bg-red-950/80",
      border: "border-red-700",
      text: "text-red-400",
    },
    reverify: {
      label: "Perlu Verifikasi Ulang",
      icon: RefreshCw,
      bg: "bg-amber-950/80",
      border: "border-amber-700",
      text: "text-amber-400",
    },
  };

  const config = configs[normalized] || configs.unverified;
  const Icon = config.icon;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[9px] gap-1",
    md: "px-2.5 py-1 text-[10px] gap-1.5",
    lg: "px-3 py-1.5 text-xs gap-2",
  };

  const iconSizes = {
    sm: "w-2.5 h-2.5",
    md: "w-3 h-3",
    lg: "w-3.5 h-3.5",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-mono font-bold uppercase border shadow-sm ${config.bg} ${config.border} ${config.text} ${sizeClasses[size]} ${className}`}
    >
      <Icon className={`${iconSizes[size]} shrink-0`} />
      <span>{config.label}</span>
    </span>
  );
}
