"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import {
  RotateCw,
  Trophy,
  History,
  Calendar,
  Gamepad2,
  Users,
  MapPin,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Shield,
} from "lucide-react";
import { EsportCardProps, CardRarity } from "@/types/card";
import { VerificationBadge } from "./VerificationBadge";

// Helper color and styling mapping for Rarity Tiers
const RARITY_CONFIG: Record<
  CardRarity,
  {
    name: string;
    label: string;
    frameBorder: string;
    badgeBg: string;
    badgeText: string;
    glowColor: string;
    accentGlow: string;
    bgGradient: string;
  }
> = {
  rookie: {
    name: "Rookie",
    label: "TIER 1 • ROOKIE",
    frameBorder: "border-[#8C5A3C] shadow-[0_0_15px_rgba(140,90,60,0.35)]",
    badgeBg: "bg-gradient-to-r from-[#5E3821] to-[#8C5A3C]",
    badgeText: "text-[#E6B89C]",
    glowColor: "rgba(140, 90, 60, 0.4)",
    accentGlow: "from-[#8C5A3C]/20 to-transparent",
    bgGradient: "from-[#191412] via-[#12151C] to-[#0E1015]",
  },
  contender: {
    name: "Contender",
    label: "TIER 2 • CONTENDER",
    frameBorder: "border-[#94A3B8] shadow-[0_0_20px_rgba(148,163,184,0.4)]",
    badgeBg: "bg-gradient-to-r from-[#475569] to-[#94A3B8]",
    badgeText: "text-[#F1F5F9]",
    glowColor: "rgba(148, 163, 184, 0.45)",
    accentGlow: "from-[#94A3B8]/20 to-transparent",
    bgGradient: "from-[#141820] via-[#12151C] to-[#0E1015]",
  },
  elite: {
    name: "Elite",
    label: "TIER 3 • ELITE",
    frameBorder:
      "border-[#D4AF37] shadow-[0_0_25px_rgba(212,175,55,0.55)] ring-1 ring-[#D4AF37]/40",
    badgeBg: "bg-gradient-to-r from-[#996515] via-[#D4AF37] to-[#FFA751]",
    badgeText: "text-[#12151C] font-extrabold",
    glowColor: "rgba(212, 175, 55, 0.6)",
    accentGlow: "from-[#D4AF37]/25 via-[#C8102E]/10 to-transparent",
    bgGradient: "from-[#1E1A11] via-[#12151C] to-[#0E1015]",
  },
  legend: {
    name: "Legend",
    label: "TIER 4 • LEGEND",
    frameBorder:
      "border-transparent bg-gradient-to-br from-[#C084FC] via-[#60A5FA] to-[#34D399] p-[1.5px] shadow-[0_0_35px_rgba(192,132,252,0.6)] animate-crystal",
    badgeBg: "bg-gradient-to-r from-[#7C3AED] via-[#3B82F6] to-[#06B6D4]",
    badgeText: "text-white font-black",
    glowColor: "rgba(192, 132, 252, 0.7)",
    accentGlow: "from-[#C084FC]/30 via-[#3B82F6]/20 to-transparent",
    bgGradient: "from-[#191224] via-[#12151C] to-[#0E1015]",
  },
};

const SIZE_CLASSES = {
  sm: "w-[240px] h-[336px] text-xs",
  md: "w-[300px] h-[420px] text-sm",
  lg: "w-[360px] h-[504px] text-base",
};

export function EsportCard({
  rarity = "rookie",
  verification = "unverified",
  data,
  size = "md",
  interactive = true,
  className = "",
  initialFlipped = false,
}: EsportCardProps) {
  const [isFlipped, setIsFlipped] = useState(initialFlipped);
  const [reducedMotion, setReducedMotion] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      mediaQuery.addEventListener("change", listener);
      return () => mediaQuery.removeEventListener("change", listener);
    }
  }, []);

  // Motion values for 3D tilt
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rotateX = useSpring(
    useTransform(mouseY, [0, 1], reducedMotion ? [0, 0] : [14, -14]),
    { stiffness: 220, damping: 20 }
  );
  const rotateY = useSpring(
    useTransform(mouseX, [0, 1], reducedMotion ? [0, 0] : [-14, 14]),
    { stiffness: 220, damping: 20 }
  );

  // Dynamic glare positioning
  const glareX = useTransform(mouseX, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(mouseY, [0, 1], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || reducedMotion) return;
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    if (!interactive || reducedMotion) return;
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  const handleFlip = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  const config = RARITY_CONFIG[rarity];
  const publicUrl = `https://esportsumbar.id/player/${data.ign.toLowerCase()}`;

  return (
    <div
      className={`perspective-1000 select-none ${SIZE_CLASSES[size]} ${className}`}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="w-full h-full relative preserve-3d cursor-pointer rounded-[16px]"
        style={{
          rotateX: isFlipped ? 0 : rotateX,
          rotateY: isFlipped ? 180 : rotateY,
          transformStyle: "preserve-3d",
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        onClick={() => interactive && handleFlip()}
      >
        {/* ==================== SISI DEPAN (FRONT) ==================== */}
        <div
          className={`absolute inset-0 w-full h-full rounded-[16px] overflow-hidden backface-hidden bg-gradient-to-b ${config.bgGradient} ${
            rarity === "legend"
              ? "p-[2px] bg-gradient-to-br from-[#C084FC] via-[#60A5FA] to-[#34D399]"
              : `border ${config.frameBorder}`
          }`}
        >
          {/* Inner Card Container */}
          <div className="relative w-full h-full rounded-[14px] overflow-hidden bg-[#0D1017] flex flex-col justify-between">
            {/* Holographic / Shimmer Texture for Elite & Legend */}
            {rarity === "elite" && (
              <div className="absolute inset-0 opacity-15 pointer-events-none bg-gradient-to-tr from-transparent via-[#D4AF37]/40 to-transparent animate-shimmer" />
            )}
            {rarity === "legend" && (
              <div className="absolute inset-0 opacity-20 pointer-events-none bg-gradient-to-tr from-[#7C3AED]/30 via-[#3B82F6]/30 to-[#34D399]/30 animate-shimmer" />
            )}

            {/* Dynamic Glare Overlay */}
            {!reducedMotion && interactive && !isFlipped && (
              <motion.div
                className="absolute inset-0 pointer-events-none z-30 opacity-25"
                style={{
                  background: `radial-gradient(circle at ${glareX.get()} ${glareY.get()}, rgba(255,255,255,0.4) 0%, transparent 60%)`,
                }}
              />
            )}

            {/* TOP BAR: Rarity Tier (Left) & Verification Badge (Right) */}
            <div className="relative z-20 flex items-center justify-between p-2.5 pb-0">
              {/* Rarity Label Badge */}
              <div
                className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${config.badgeBg} shadow-sm`}
              >
                {rarity === "legend" ? (
                  <Sparkles className="w-2.5 h-2.5 text-white animate-spin" />
                ) : (
                  <Shield className="w-2.5 h-2.5 text-white/90" />
                )}
                <span
                  className={`font-heading uppercase tracking-wider text-[9px] ${config.badgeText}`}
                >
                  {config.name}
                </span>
              </div>

              {/* Institutional Verification Badge */}
              <div className="flex items-center gap-1.5">
                <VerificationBadge
                  status={verification}
                  regionCode={data.region.code}
                  badgeNumber={data.badgeNumber}
                  size={size}
                />
              </div>
            </div>

            {/* PLAYER AVATAR & VISUAL HERO */}
            <div className="relative w-full flex-1 overflow-hidden mt-1 mx-auto px-2">
              <div className="relative w-full h-full rounded-t-[10px] overflow-hidden bg-[#161922] border border-[#262B38]/60 flex items-center justify-center">
                {/* Subtle Minang Motif Behind Portrait */}
                <div className="absolute inset-0 bg-minang-subtle opacity-40 pointer-events-none" />

                {/* Avatar Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={data.avatarUrl}
                  alt={data.ign}
                  className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
                  onError={(e) => {
                    // Fallback avatar placeholder
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=400&auto=format&fit=crop";
                  }}
                />

                {/* Dramatic Gradient Overlay at Bottom of Image */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1017] via-[#0D1017]/40 to-transparent" />

                {/* Role Pill Overlay */}
                <div className="absolute bottom-2 left-2 z-10 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#0B0D12]/85 border border-[#262B38] backdrop-blur-md">
                  <Gamepad2 className="w-3 h-3 text-[#3B82F6]" />
                  <span className="text-[10px] font-heading font-medium tracking-wide text-gray-200">
                    {data.game} • <span className="text-[#3B82F6]">{data.role}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* PLAYER IDENTIFIERS & META INFO */}
            <div className="relative z-20 px-3 pt-2 pb-2.5 flex flex-col gap-1.5 bg-[#0D1017]">
              {/* IGN & Display Name */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between">
                  <h3
                    className={`font-heading font-extrabold uppercase tracking-tight leading-none text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] ${
                      size === "sm" ? "text-base" : size === "md" ? "text-xl" : "text-2xl"
                    }`}
                  >
                    {data.ign}
                  </h3>
                  {/* Subtle Marawa Ribbon Indicator */}
                  <div className="flex h-2 w-5 rounded-sm overflow-hidden" title="Minang Heritage Accent">
                    <span className="w-1/3 bg-[#C8102E]" />
                    <span className="w-1/3 bg-[#D4AF37]" />
                    <span className="w-1/3 bg-black" />
                  </div>
                </div>
                <span className="text-[11px] text-[#9AA3B2] font-sans truncate font-medium">
                  {data.displayName}
                </span>
              </div>

              {/* Team & Region Info Pill */}
              <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-[#262B38]/60">
                <div className="flex items-center gap-1.5 overflow-hidden">
                  <Users className="w-3 h-3 text-[#9AA3B2] shrink-0" />
                  <span className="text-[10px] text-gray-300 truncate font-medium">
                    {data.team?.name || "Free Agent"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 overflow-hidden justify-end">
                  <MapPin className="w-3 h-3 text-[#D4AF37] shrink-0" />
                  <span className="text-[10px] text-gray-300 truncate font-medium">
                    {data.region.name}
                  </span>
                </div>
              </div>

              {/* CARD FOOTER: ESPORT ID + MINI QR */}
              <div className="mt-1 pt-1.5 border-t border-[#262B38]/80 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[7px] uppercase font-mono tracking-widest text-[#9AA3B2]">
                    ESPORT ID
                  </span>
                  <span className="text-[9px] font-mono font-bold tracking-tight text-[#D4AF37]">
                    {data.esportId}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleFlip}
                    className="p-1 rounded bg-[#1A1E28] hover:bg-[#262B38] text-gray-400 hover:text-white transition-colors"
                    title="Balik kartu (Rekam Jejak)"
                  >
                    <RotateCw className="w-3 h-3" />
                  </button>
                  <div className="p-0.5 bg-white rounded-[3px] shadow-sm">
                    <QRCodeSVG
                      value={publicUrl}
                      size={size === "sm" ? 20 : 24}
                      level="L"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== SISI BELAKANG (BACK) ==================== */}
        <div
          className={`absolute inset-0 w-full h-full rounded-[16px] overflow-hidden backface-hidden rotate-y-180 bg-gradient-to-b ${config.bgGradient} ${
            rarity === "legend"
              ? "p-[2px] bg-gradient-to-br from-[#C084FC] via-[#60A5FA] to-[#34D399]"
              : `border ${config.frameBorder}`
          }`}
        >
          <div className="relative w-full h-full rounded-[14px] overflow-hidden bg-[#0D1017] p-3 flex flex-col justify-between">
            {/* Header Rekam Jejak */}
            <div>
              <div className="flex items-center justify-between border-b border-[#262B38] pb-1.5">
                <div className="flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="font-heading uppercase tracking-wider text-xs font-bold text-white">
                    Rekam Jejak Atlet
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleFlip}
                  className="p-1 rounded bg-[#1A1E28] hover:bg-[#262B38] text-gray-400 hover:text-white transition-colors"
                  title="Kembali ke depan"
                >
                  <RotateCw className="w-3 h-3" />
                </button>
              </div>

              {/* Prestasi Pilihan (Max 3) */}
              <div className="mt-2.5">
                <span className="text-[9px] uppercase font-mono tracking-widest text-[#9AA3B2] block mb-1">
                  Prestasi Pilihan
                </span>
                {data.achievements && data.achievements.length > 0 ? (
                  <div className="flex flex-col gap-1.5">
                    {data.achievements.slice(0, 3).map((item, idx) => (
                      <div
                        key={idx}
                        className="p-1.5 rounded-md bg-[#161922] border border-[#262B38]/80 flex items-start justify-between gap-1"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-semibold text-gray-200 truncate">
                            {item.title}
                          </p>
                          <p className="text-[9px] text-[#9AA3B2]">
                            {item.placement} • Tk. {item.level} ({item.year})
                          </p>
                        </div>
                        {item.isValidated && (
                          <div
                            className="shrink-0 flex items-center gap-0.5 text-[#22C55E]"
                            title="Prestasi Terverifikasi ESI"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-[#9AA3B2] italic p-1.5 bg-[#161922] rounded border border-[#262B38]/50">
                    Belum ada prestasi resmi tercatat.
                  </p>
                )}
              </div>

              {/* Riwayat Tim (Max 3) */}
              <div className="mt-2.5">
                <span className="text-[9px] uppercase font-mono tracking-widest text-[#9AA3B2] block mb-1 flex items-center gap-1">
                  <History className="w-2.5 h-2.5" /> Riwayat Tim
                </span>
                {data.history && data.history.length > 0 ? (
                  <div className="flex flex-col gap-1">
                    {data.history.slice(0, 3).map((hist, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-[10px] px-1.5 py-0.5 rounded bg-[#161922]/70"
                      >
                        <span className="font-medium text-gray-300 truncate">
                          {hist.teamName}
                        </span>
                        <span className="text-[9px] text-[#9AA3B2] shrink-0">
                          {hist.period}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-[#9AA3B2] italic">
                    Belum ada riwayat tim sebelumnya.
                  </p>
                )}
              </div>
            </div>

            {/* Bottom Authenticity & Large QR */}
            <div className="mt-2 pt-2 border-t border-[#262B38] flex flex-col items-center text-center">
              <div className="p-1.5 bg-white rounded-md shadow-md mb-1.5">
                <QRCodeSVG
                  value={publicUrl}
                  size={size === "sm" ? 54 : 64}
                  level="M"
                />
              </div>
              <span className="text-[9px] text-gray-300 font-mono font-medium">
                Pindai untuk memeriksa keaslian data
              </span>
              <div className="flex items-center gap-1.5 text-[8px] text-[#D4AF37] mt-0.5">
                <span>ESPORT SUMBAR</span>
                <span>•</span>
                <span>ESI SUMBAR</span>
              </div>
              {data.joinedAt && (
                <div className="flex items-center gap-1 text-[8px] text-[#9AA3B2] mt-1">
                  <Calendar className="w-2.5 h-2.5" />
                  <span>Terdaftar sejak {data.joinedAt}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
