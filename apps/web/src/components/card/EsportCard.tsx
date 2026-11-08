"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
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
  Sparkles,
  Shield,
  GraduationCap,
  Crown,
  UserCheck,
  Briefcase,
  Layers,
} from "lucide-react";
import {
  EsportCardProps,
  CardRarity,
  CardEntityType,
  CardSize,
} from "@/types/card";
import { VerificationBadge } from "./VerificationBadge";
import { BrandWatermark, BrandPattern, IssuedBy } from "@/components/brand";

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
    accentGlow: "from-[#D4AF37]/25 via-[#D4AF37]/10 to-transparent",
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

const SIZE_CLASSES: Record<CardSize, string> = {
  sm: "w-[240px] h-[336px] text-xs",
  md: "w-[300px] h-[420px] text-sm",
  lg: "w-[360px] h-[504px] text-base",
  mobile: "w-[280px] min-[360px]:w-[300px] max-w-full h-[392px] min-[360px]:h-[420px] text-sm",
  fluid: "w-full max-w-[340px] h-[420px] text-sm",
};

export function EsportCard({
  type = "player",
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
    { stiffness: 260, damping: 22 }
  );
  const rotateY = useSpring(
    useTransform(mouseX, [0, 1], reducedMotion ? [0, 0] : [-14, 14]),
    { stiffness: 260, damping: 22 }
  );

  // Dynamic glare positioning with real-time reactive useMotionTemplate
  const glareX = useTransform(mouseX, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(mouseY, [0, 1], ["0%", "100%"]);
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.12) 28%, transparent 68%)`;

  // Desktop Mouse Handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || reducedMotion || isFlipped) return;
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(Math.min(Math.max(x, 0), 1));
    mouseY.set(Math.min(Math.max(y, 0), 1));
  };

  const handleMouseLeave = () => {
    if (!interactive || reducedMotion) return;
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  // Track touch start to differentiate drag/tilt from tap/flip
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);
  const isTouchDragging = useRef(false);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    if (!touch) return;
    touchStartPos.current = { x: touch.clientX, y: touch.clientY };
    isTouchDragging.current = false;
  };

  // Mobile Touch Handlers
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!interactive || reducedMotion) return;
    const touch = e.touches[0];
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect || !touch) return;

    if (touchStartPos.current) {
      const dx = Math.abs(touch.clientX - touchStartPos.current.x);
      const dy = Math.abs(touch.clientY - touchStartPos.current.y);
      if (dx > 8 || dy > 8) {
        isTouchDragging.current = true;
      }
    }

    if (!isFlipped) {
      const x = (touch.clientX - rect.left) / rect.width;
      const y = (touch.clientY - rect.top) / rect.height;
      mouseX.set(Math.min(Math.max(x, 0), 1));
      mouseY.set(Math.min(Math.max(y, 0), 1));
    }
  };

  const handleTouchEnd = () => {
    if (!interactive || reducedMotion) return;
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (isTouchDragging.current) {
      isTouchDragging.current = false;
      return;
    }
    if (interactive) {
      handleFlip(e);
    }
  };

  // Mobile Device Gyroscope / Parallax support
  useEffect(() => {
    if (!interactive || reducedMotion || typeof window === "undefined") return;
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null && !isFlipped) {
        // gamma: left-to-right [-90, 90], beta: front-to-back [-180, 180]
        const clampedGamma = Math.min(Math.max(e.gamma, -25), 25);
        const clampedBeta = Math.min(Math.max(e.beta - 45, -25), 25);
        const targetX = (clampedGamma + 25) / 50;
        const targetY = (clampedBeta + 25) / 50;
        mouseX.set(targetX);
        mouseY.set(targetY);
      }
    };

    if (
      window.DeviceOrientationEvent &&
      typeof (DeviceOrientationEvent as any).requestPermission !== "function"
    ) {
      window.addEventListener("deviceorientation", handleOrientation, {
        passive: true,
      });
    }
    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, [interactive, reducedMotion, isFlipped, mouseX, mouseY]);

  const handleFlip = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) e.stopPropagation();
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate([15, 30, 15]);
      } catch {
        // Ignored
      }
    }
    setIsFlipped(!isFlipped);
  };

  const config = RARITY_CONFIG[rarity];
  const slug = (data.ign || data.teamName || data.displayName)
    .toLowerCase()
    .replace(/\s+/g, "-");
  const publicUrl = `https://esportsumbar.id/${type}/${slug}`;

  return (
    <div
      className={`relative perspective-1000 select-none ${SIZE_CLASSES[size]} ${className}`}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      style={{
        perspective: 1000,
        WebkitPerspective: 1000,
      }}
    >
      {/* Layer 1: 3D Tilt Wrapper (Mouse & Gyroscope Parallax) */}
      <motion.div
        className="w-full h-full relative preserve-3d rounded-[16px]"
        style={{
          rotateX: isFlipped ? 0 : rotateX,
          rotateY: isFlipped ? 0 : rotateY,
          transformStyle: "preserve-3d",
          WebkitTransformStyle: "preserve-3d",
        }}
      >
        {/* Layer 2: 3D Flip Wrapper (Smooth 180deg flip between front and back) */}
        <motion.div
          className="w-full h-full relative preserve-3d cursor-pointer rounded-[16px]"
          animate={{
            rotateY: isFlipped ? 180 : 0,
          }}
          transition={{
            duration: 0.6,
            ease: [0.23, 1, 0.32, 1],
          }}
          style={{
            transformStyle: "preserve-3d",
            WebkitTransformStyle: "preserve-3d",
          }}
          onClick={handleCardClick}
        >
          {/* ==================== SISI DEPAN (FRONT) ==================== */}
          <div
            className={`absolute inset-0 w-full h-full rounded-[16px] overflow-hidden backface-hidden bg-gradient-to-b ${config.bgGradient} ${
              rarity === "legend"
                ? "p-[2px] bg-gradient-to-br from-[#C084FC] via-[#60A5FA] to-[#34D399]"
                : `border ${config.frameBorder}`
            }`}
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(0deg) translateZ(1px)",
              WebkitTransform: "rotateY(0deg) translateZ(1px)",
              zIndex: isFlipped ? 0 : 10,
              pointerEvents: isFlipped ? "none" : "auto",
            }}
          >
          {/* Inner Card Frame */}
          <div className="relative w-full h-full rounded-[14px] overflow-hidden bg-[#0D1017] flex flex-col justify-between">
            {/* Shimmer Overlays */}
            {rarity === "elite" && (
              <div className="absolute inset-0 opacity-15 pointer-events-none bg-gradient-to-tr from-transparent via-[#D4AF37]/40 to-transparent animate-shimmer" />
            )}
            {rarity === "legend" && (
              <div className="absolute inset-0 opacity-20 pointer-events-none bg-gradient-to-tr from-[#7C3AED]/30 via-[#3B82F6]/30 to-[#34D399]/30 animate-shimmer" />
            )}

            {/* Glare: Dynamic Real-time Light Reflection */}
            {!reducedMotion && interactive && !isFlipped && (
              <motion.div
                className="absolute inset-0 pointer-events-none z-30 opacity-40 mix-blend-overlay"
                style={{
                  background: glareBackground,
                }}
              />
            )}

            {/* TOP BAR: Rarity Tier (Left) & Verification Badge (Right) */}
            <div className="relative z-20 flex items-center justify-between p-2.5 pb-0">
              <div className="flex items-center gap-1.5">
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

                {/* Entity Type Tag */}
                <span className="text-[8px] font-heading uppercase px-1.5 py-0.5 rounded bg-[#1A1E28] border border-[#262B38] text-gray-400 font-bold tracking-wider">
                  {type === "player" ? "Player" : type === "coach" ? "Coach" : "Team"}
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

            {/* HERO VISUAL AREA */}
            <div className="relative w-full flex-1 overflow-hidden mt-1 mx-auto px-2">
              {type === "team" ? (
                /* TEAM HERO: Large Logo Pedestal */
                <div className="relative w-full h-full rounded-t-[10px] overflow-hidden bg-gradient-to-b from-[#181C26] to-[#0D1017] border border-[#262B38]/60 flex flex-col items-center justify-center p-4">
                  <div className="absolute inset-0 bg-minang-subtle opacity-30 pointer-events-none" />

                  {/* Logo Centerpiece */}
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#12151C] border border-[#262B38] shadow-[0_0_30px_rgba(0,0,0,0.8)] flex items-center justify-center p-3 group overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#C8102E]/20 via-[#D4AF37]/10 to-transparent opacity-80" />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={data.logoUrl || data.avatarUrl}
                      alt={data.teamName || data.displayName}
                      className="w-full h-full object-contain relative z-10 drop-shadow-md transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=200&auto=format&fit=crop";
                      }}
                    />
                  </div>

                  {/* Active Roster Counter Pill */}
                  <div className="mt-3 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0B0D12]/90 border border-[#262B38] z-10 shadow-sm">
                    <Users className="w-3 h-3 text-[#22C55E]" />
                    <span className="text-[10px] font-mono text-gray-200">
                      Roster:{" "}
                      <strong className="text-white">
                        {data.rosterCount?.current || 5}/{data.rosterCount?.max || 7}
                      </strong>{" "}
                      Aktif
                    </span>
                  </div>
                </div>
              ) : (
                /* PLAYER / COACH HERO: Portrait */
                <div className="relative w-full h-full rounded-t-[10px] overflow-hidden bg-[#161922] border border-[#262B38]/60 flex items-center justify-center">
                  <div className="absolute inset-0 bg-minang-subtle opacity-40 pointer-events-none" />

                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={data.avatarUrl}
                    alt={data.ign || data.displayName}
                    className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=400&auto=format&fit=crop";
                    }}
                  />

                  {/* Bottom Image Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D1017] via-[#0D1017]/40 to-transparent" />

                  {/* Overlay Pill */}
                  {type === "coach" ? (
                    <div className="absolute bottom-2 left-2 z-10 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#0B0D12]/85 border border-[#262B38] backdrop-blur-md">
                      <GraduationCap className="w-3 h-3 text-[#D4AF37]" />
                      <span className="text-[10px] font-heading font-medium tracking-wide text-gray-200">
                        {data.certification?.isCertified
                          ? data.certification.name
                          : "Pelatih Esport"}
                      </span>
                    </div>
                  ) : (
                    <div className="absolute bottom-2 left-2 z-10 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#0B0D12]/85 border border-[#262B38] backdrop-blur-md">
                      <Gamepad2 className="w-3 h-3 text-[#3B82F6]" />
                      <span className="text-[10px] font-heading font-medium tracking-wide text-gray-200">
                        {data.game} •{" "}
                        <span className="text-[#3B82F6]">{data.role}</span>
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* IDENTITY METADATA AREA */}
            <div className="relative z-20 px-3 pt-2 pb-2.5 flex flex-col gap-1.5 bg-[#0D1017]">
              {/* Heading: IGN/Name */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between">
                  <h3
                    className={`font-heading font-extrabold uppercase tracking-tight leading-none text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] truncate ${
                      size === "sm"
                        ? "text-base"
                        : size === "mobile" || size === "fluid" || size === "md"
                        ? "text-lg sm:text-xl"
                        : "text-2xl"
                    }`}
                  >
                    {type === "team"
                      ? data.teamName || data.displayName
                      : data.ign || data.displayName}
                  </h3>
                </div>

                <span className="text-[11px] text-[#9AA3B2] font-sans truncate font-medium">
                  {type === "team"
                    ? `Divisi: ${data.game}`
                    : data.displayName}
                </span>
              </div>

              {/* Sub-info Bar */}
              <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-[#262B38]/60">
                {type === "team" ? (
                  <>
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      <Crown className="w-3 h-3 text-[#D4AF37] shrink-0" />
                      <span className="text-[10px] text-gray-300 truncate font-medium">
                        {data.captainOrManager?.role || "Kapten"}:{" "}
                        {data.captainOrManager?.name || "-"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 overflow-hidden justify-end">
                      <MapPin className="w-3 h-3 text-[#D4AF37] shrink-0" />
                      <span className="text-[10px] text-gray-300 truncate font-medium">
                        {data.homebase || data.region.name}
                      </span>
                    </div>
                  </>
                ) : type === "coach" ? (
                  <>
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      <Briefcase className="w-3 h-3 text-[#3B82F6] shrink-0" />
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
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>

              {/* CARD FOOTER: MARK + ESPORT ID + MINI QR */}
              <div className="mt-1 pt-1.5 border-t border-[#FF1752]/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative w-5 h-3 shrink-0">
                    <Image
                      src="/brand/logo-mark-pink.png"
                      alt="ESPORT SUMBAR"
                      fill
                      sizes="20px"
                      className="object-contain"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[7px] uppercase font-mono tracking-widest text-white/50">
                      ESPORT ID
                    </span>
                    <span className="text-[9px] font-mono font-bold tracking-tight text-white/90">
                      {data.esportId}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleFlip}
                    className="p-1 rounded bg-[#1A1E28] hover:bg-[#262B38] text-gray-400 hover:text-[#FF4D77] transition-colors"
                    title="Balik kartu (Rekam Jejak / Roster)"
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
          className={`absolute inset-0 w-full h-full rounded-[16px] overflow-hidden backface-hidden bg-gradient-to-b ${config.bgGradient} ${
            rarity === "legend"
              ? "p-[2px] bg-gradient-to-br from-[#C084FC] via-[#60A5FA] to-[#34D399]"
              : `border ${config.frameBorder}`
          }`}
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg) translateZ(1px)",
            WebkitTransform: "rotateY(180deg) translateZ(1px)",
            zIndex: isFlipped ? 10 : 0,
            pointerEvents: isFlipped ? "auto" : "none",
          }}
        >
          <div className="relative w-full h-full rounded-[14px] overflow-hidden bg-[#0D1017] p-3 flex flex-col justify-between">
            {/* Brand Pattern and Large Centered Watermark */}
            <BrandPattern variant="diagonal" opacity={0.04} />
            <BrandWatermark variant="pink" opacity={0.08} size={260} position="center" />

            {/* Header Rekam Jejak */}
            <div className="relative z-10">
              <div className="flex items-center justify-between border-b border-[#262B38] pb-1.5">
                <div className="flex items-center gap-1.5">
                  {type === "team" ? (
                    <Users className="w-3.5 h-3.5 text-[#3B82F6]" />
                  ) : type === "coach" ? (
                    <GraduationCap className="w-3.5 h-3.5 text-[#D4AF37]" />
                  ) : (
                    <Trophy className="w-3.5 h-3.5 text-[#D4AF37]" />
                  )}
                  <span className="font-heading uppercase tracking-wider text-xs font-bold text-white">
                    {type === "team"
                      ? "Struktur Tim & Roster"
                      : type === "coach"
                      ? "Rekam Jejak Kepelatihan"
                      : "Rekam Jejak Atlet"}
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

              {/* BODY SECTION BASED ON ENTITY TYPE */}
              {type === "team" ? (
                /* TEAM BACK: Roster Members & Coach */
                <div className="mt-2.5 flex flex-col gap-2">
                  <div>
                    <span className="text-[9px] uppercase font-mono tracking-widest text-[#9AA3B2] block mb-1">
                      Roster Aktif Terdaftar
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {data.rosterMembers && data.rosterMembers.length > 0 ? (
                        data.rosterMembers.slice(0, 6).map((m, idx) => (
                          <div
                            key={idx}
                            className="p-1 rounded bg-[#161922] border border-[#262B38]/70 flex items-center gap-1.5 overflow-hidden"
                          >
                            <div className="w-5 h-5 rounded-full bg-[#1A1E28] flex items-center justify-center text-[9px] font-bold text-white shrink-0 overflow-hidden">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={
                                  m.avatarUrl ||
                                  `https://api.dicebear.com/7.x/bottts/svg?seed=${m.ign}`
                                }
                                alt={m.ign}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-[10px] font-bold text-gray-200 truncate leading-none">
                                {m.ign}
                              </p>
                              <p className="text-[8px] text-[#9AA3B2] truncate leading-tight">
                                {m.role}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-[10px] text-gray-400 italic col-span-2">
                          Belum ada anggota roster terhubung.
                        </p>
                      )}
                    </div>
                  </div>

                  {data.coachName && (
                    <div className="flex items-center justify-between text-[10px] px-2 py-1 rounded bg-[#161922] border border-[#262B38]/60">
                      <span className="text-[#9AA3B2]">Pelatih:</span>
                      <span className="font-bold text-white">{data.coachName}</span>
                    </div>
                  )}

                  {/* Team Achievements */}
                  {data.achievements && data.achievements.length > 0 && (
                    <div>
                      <span className="text-[9px] uppercase font-mono tracking-widest text-[#9AA3B2] block mb-0.5">
                        Prestasi Terkini
                      </span>
                      <p className="text-[10px] text-[#D4AF37] font-semibold truncate">
                        ★ {data.achievements[0].placement} - {data.achievements[0].title} (
                        {data.achievements[0].year})
                      </p>
                    </div>
                  )}
                </div>
              ) : type === "coach" ? (
                /* COACH BACK: Certifications & Coaching History */
                <div className="mt-2.5 flex flex-col gap-2">
                  <div>
                    <span className="text-[9px] uppercase font-mono tracking-widest text-[#9AA3B2] block mb-1">
                      Sertifikasi & Lisensi
                    </span>
                    {data.certification?.isCertified ? (
                      <div className="p-1.5 rounded-md bg-[#161922] border border-[#D4AF37]/40 flex items-start justify-between">
                        <div>
                          <p className="text-[11px] font-bold text-[#D4AF37]">
                            {data.certification.name}
                          </p>
                          <p className="text-[9px] text-gray-300">
                            {data.certification.issuer} ({data.certification.year || "2024"})
                          </p>
                        </div>
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E] shrink-0" />
                      </div>
                    ) : (
                      <p className="text-[10px] text-[#9AA3B2] italic">
                        Belum ada sertifikasi tercatat.
                      </p>
                    )}
                  </div>

                  <div>
                    <span className="text-[9px] uppercase font-mono tracking-widest text-[#9AA3B2] block mb-1">
                      Riwayat Tim Dilatih
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
              ) : (
                /* PLAYER BACK: Achievements & History */
                <div className="mt-2.5 flex flex-col gap-2">
                  <div>
                    <span className="text-[9px] uppercase font-mono tracking-widest text-[#9AA3B2] block mb-1">
                      Prestasi Pilihan
                    </span>
                    {data.achievements && data.achievements.length > 0 ? (
                      <div className="flex flex-col gap-1">
                        {data.achievements.slice(0, 3).map((item, idx) => (
                          <div
                            key={idx}
                            className="p-1.5 rounded-md bg-[#161922] border border-[#262B38]/80 flex items-start justify-between gap-1"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] font-semibold text-gray-200 truncate">
                                {item.title}
                              </p>
                              <p className="text-[8px] text-[#9AA3B2]">
                                {item.placement} • Tk. {item.level} ({item.year})
                              </p>
                            </div>
                            {item.isValidated && (
                              <CheckCircle2 className="w-3 h-3 text-[#22C55E] shrink-0" />
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[10px] text-[#9AA3B2] italic">
                        Belum ada prestasi tercatat.
                      </p>
                    )}
                  </div>

                  <div>
                    <span className="text-[9px] uppercase font-mono tracking-widest text-[#9AA3B2] block mb-1">
                      Riwayat Tim
                    </span>
                    {data.history && data.history.length > 0 ? (
                      <div className="flex flex-col gap-1">
                        {data.history.slice(0, 2).map((hist, idx) => (
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
              )}
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
              <div className="mt-1">
                <IssuedBy variant="badge" />
              </div>
              {(data.joinedAt || data.foundedAt) && (
                <div className="flex items-center gap-1 text-[8px] text-[#9AA3B2] mt-1">
                  <Calendar className="w-2.5 h-2.5" />
                  <span>
                    {type === "team" ? "Didirikan" : "Terdaftar"} sejak{" "}
                    {data.foundedAt || data.joinedAt}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
