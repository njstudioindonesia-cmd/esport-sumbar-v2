"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { ShieldCheck, Clock, XCircle, AlertCircle, Sparkles } from "lucide-react";

export interface GlassBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "outline" | "success" | "warning" | "danger" | "elite";
  size?: "sm" | "md";
}

export const GlassBadge = forwardRef<HTMLSpanElement, GlassBadgeProps>(
  ({ className, variant = "secondary", size = "md", children, ...props }, ref) => {
    const variantStyles = {
      primary:
        "bg-pink-500/20 text-pink-300 border-pink-500/40 shadow-sm shadow-pink-500/20",
      secondary: "bg-white/10 text-slate-200 border-white/20",
      outline: "bg-transparent text-slate-300 border-white/30",
      success:
        "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/20",
      warning:
        "bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-500/20",
      danger:
        "bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm shadow-rose-500/20",
      // D17: Frame Elite warna emas dengan nuansa border metalik
      elite:
        "bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-200 border-amber-400/50 shadow-sm shadow-amber-500/20",
    };

    const sizeStyles = {
      sm: "px-2 py-0.5 text-[11px] rounded-lg gap-1",
      md: "px-2.5 py-1 text-xs rounded-xl gap-1.5",
    };

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center font-medium border backdrop-blur-md transition-colors select-none",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);
GlassBadge.displayName = "GlassBadge";

/**
 * GlassStatusBadge: Status Verifikasi V3 Tunggal (Terverifikasi, Menunggu, Ditolak, Belum Mengajukan)
 * Sesuai Keputusan D17: Lencana Terverifikasi dibedakan secara tegas melalui ikon PERISAI + CENTANG (ShieldCheck).
 */
export interface GlassStatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  status: "verified" | "pending" | "rejected" | "unregistered";
  size?: "sm" | "md";
  showIcon?: boolean;
}

export const GlassStatusBadge = forwardRef<
  HTMLSpanElement,
  GlassStatusBadgeProps
>(({ className, status, size = "md", showIcon = true, ...props }, ref) => {
  const configs = {
    verified: {
      label: "Terverifikasi",
      icon: ShieldCheck,
      classes:
        "bg-amber-500/20 text-amber-200 border-amber-400/50 shadow-sm shadow-amber-500/30",
    },
    pending: {
      label: "Menunggu Telaah",
      icon: Clock,
      classes: "bg-sky-500/20 text-sky-200 border-sky-400/40",
    },
    rejected: {
      label: "Ditolak",
      icon: XCircle,
      classes: "bg-rose-500/20 text-rose-200 border-rose-400/40",
    },
    unregistered: {
      label: "Belum Mengajukan",
      icon: AlertCircle,
      classes: "bg-slate-500/20 text-slate-300 border-slate-500/40",
    },
  };

  const current = configs[status] || configs.unregistered;
  const Icon = current.icon;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[11px] rounded-lg gap-1",
    md: "px-2.5 py-1 text-xs rounded-xl gap-1.5",
  };

  return (
    <span
      ref={ref}
      aria-label={`Status verifikasi: ${current.label}`}
      className={cn(
        "inline-flex items-center font-semibold border backdrop-blur-md select-none",
        current.classes,
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {showIcon && <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />}
      <span>{current.label}</span>
    </span>
  );
});
GlassStatusBadge.displayName = "GlassStatusBadge";

/**
 * GlassRarityBadge: Tingkat Rarity Profil/Kartu (Rookie, Rising, Contender, Elite, Master, Legendary)
 * Sesuai Keputusan D17: Frame Rarity Elite memakai ikon Sparkles dan frame, bukan perisai verifikasi.
 */
export interface GlassRarityBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  rarity?: "rookie" | "rising" | "contender" | "elite" | "master" | "legendary" | string;
  tier?: string;
  size?: "sm" | "md";
}

export const GlassRarityBadge = forwardRef<
  HTMLSpanElement,
  GlassRarityBadgeProps
>(({ className, rarity, tier, size = "md", ...props }, ref) => {
  const configs: Record<string, { label: string; classes: string }> = {
    rookie: {
      label: "Rookie",
      classes: "bg-slate-500/20 text-slate-300 border-slate-500/30",
    },
    rising: {
      label: "Rising Star",
      classes: "bg-emerald-500/20 text-emerald-200 border-emerald-400/40",
    },
    contender: {
      label: "Contender",
      classes: "bg-sky-500/20 text-sky-200 border-sky-400/40",
    },
    elite: {
      label: "Elite",
      classes:
        "bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-200 border-amber-400/50 shadow-sm shadow-amber-500/20",
    },
    master: {
      label: "Master",
      classes: "bg-purple-500/20 text-purple-200 border-purple-400/40",
    },
    legendary: {
      label: "Legendary",
      classes:
        "bg-gradient-to-r from-rose-500/25 to-pink-500/25 text-pink-200 border-pink-400/50 shadow-sm shadow-pink-500/30",
    },
    legend: {
      label: "Legend",
      classes:
        "bg-gradient-to-r from-rose-500/25 to-pink-500/25 text-pink-200 border-pink-400/50 shadow-sm shadow-pink-500/30",
    },
  };

  const rawRarity = (tier || rarity || "rookie").toLowerCase();
  const current = configs[rawRarity] || configs.rookie;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[11px] rounded-lg gap-1",
    md: "px-2.5 py-1 text-xs rounded-xl gap-1.5",
  };

  return (
    <span
      ref={ref}
      aria-label={`Tingkat kartu: ${current.label}`}
      className={cn(
        "inline-flex items-center font-bold uppercase tracking-wider border backdrop-blur-md select-none",
        current.classes,
        sizeClasses[size],
        className
      )}
      {...props}
    >
      <Sparkles className="w-3 h-3 shrink-0" aria-hidden="true" />
      <span>{current.label}</span>
    </span>
  );
});
GlassRarityBadge.displayName = "GlassRarityBadge";
