import React from "react";
import { ShieldCheck, Clock, AlertTriangle, XCircle, CheckCircle2 } from "lucide-react";

export type VerificationState =
  | "verified"
  | "prov_verified"
  | "under_review"
  | "submitted"
  | "pending"
  | "revision"
  | "reverify"
  | "rejected"
  | "suspended"
  | "unverified"
  | (string & {});

export interface StatusBadgeProps {
  status?: VerificationState | null;
  showIcon?: boolean;
  size?: "sm" | "md";
  className?: string;
}

interface BadgeConfig {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  classes: string;
}

const statusConfigs: Record<string, BadgeConfig> = {
  // Emas murni #D4AF37 HANYA untuk lencana terverifikasi
  verified: {
    label: "Terverifikasi",
    icon: ShieldCheck,
    classes: "bg-[#D4AF37]/15 border-[#D4AF37]/40 text-[#D4AF37]",
  },
  prov_verified: {
    label: "Provinsi Terverifikasi",
    icon: ShieldCheck,
    classes: "bg-[#D4AF37]/15 border-[#D4AF37]/40 text-[#D4AF37]",
  },
  under_review: {
    label: "Menunggu Review",
    icon: Clock,
    classes: "bg-[#F2A33A]/15 border-[#F2A33A]/30 text-[#F2A33A]",
  },
  submitted: {
    label: "Menunggu Review",
    icon: Clock,
    classes: "bg-[#F2A33A]/15 border-[#F2A33A]/30 text-[#F2A33A]",
  },
  pending: {
    label: "Menunggu Review",
    icon: Clock,
    classes: "bg-[#F2A33A]/15 border-[#F2A33A]/30 text-[#F2A33A]",
  },
  revision: {
    label: "Perlu Revisi",
    icon: AlertTriangle,
    classes: "bg-[#F2A33A]/15 border-[#F2A33A]/30 text-[#F2A33A]",
  },
  reverify: {
    label: "Telaah Ulang",
    icon: AlertTriangle,
    classes: "bg-[#F2A33A]/15 border-[#F2A33A]/30 text-[#F2A33A]",
  },
  rejected: {
    label: "Ditolak",
    icon: XCircle,
    classes: "bg-[#F04438]/15 border-[#F04438]/30 text-[#F04438]",
  },
  suspended: {
    label: "Ditangguhkan",
    icon: XCircle,
    classes: "bg-[#F04438]/15 border-[#F04438]/30 text-[#F04438]",
  },
  unverified: {
    label: "Belum Verifikasi",
    icon: CheckCircle2,
    classes: "bg-white/5 border-white/10 text-white/50",
  },
};

const fallbackConfig: BadgeConfig = {
  label: "Belum Verifikasi",
  icon: CheckCircle2,
  classes: "bg-white/5 border-white/10 text-white/50",
};

export function StatusBadge({
  status,
  showIcon = true,
  size = "md",
  className = "",
}: StatusBadgeProps) {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px] gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5",
  }[size || "md"] || "px-2.5 py-1 text-xs gap-1.5";

  const key = typeof status === "string" ? status.toLowerCase().trim() : "unverified";
  const config = statusConfigs[key] || fallbackConfig;
  const Icon = config.icon || fallbackConfig.icon;

  return (
    <span
      className={`inline-flex items-center font-bold rounded-full border select-none ${sizeClasses} ${config.classes} ${className}`}
    >
      {showIcon && Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span>{config.label}</span>
    </span>
  );
}
