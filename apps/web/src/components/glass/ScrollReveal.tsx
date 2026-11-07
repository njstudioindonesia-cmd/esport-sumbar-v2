"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  MOTION_DURATIONS,
  MOTION_EASINGS,
  MOTION_SPRINGS,
  REDUCED_MOTION_VARIANTS,
} from "./MotionPresets";
import { useQualityMode, useIsReducedMotion } from "./useQualityMode";

export interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right" | "none";
  delay?: number;
  duration?: number;
  threshold?: number;
  className?: string;
  once?: boolean;
}

export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = MOTION_DURATIONS.base,
  threshold = 0.1,
  className,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once,
    amount: threshold,
  });
  const { quality } = useQualityMode();
  const isReducedMotion = useIsReducedMotion();

  // Jika mode hemat atau pengguna meminta reduced-motion: tampilkan tanpa pergeseran transform
  if (quality === "eco" || isReducedMotion) {
    return (
      <div ref={ref} className={cn("w-full", className)}>
        {children}
      </div>
    );
  }

  // Tentukan offset berdasarkan arah (hanya GPU composited transforms)
  const getInitialTransform = () => {
    switch (direction) {
      case "up":
        return { y: 24, x: 0 };
      case "down":
        return { y: -24, x: 0 };
      case "left":
        return { x: 24, y: 0 };
      case "right":
        return { x: -24, y: 0 };
      case "none":
      default:
        return { x: 0, y: 0 };
    }
  };

  const initialTransform = getInitialTransform();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...initialTransform }}
      animate={
        isInView
          ? { opacity: 1, x: 0, y: 0 }
          : { opacity: 0, ...initialTransform }
      }
      transition={{
        duration,
        delay,
        ease: MOTION_EASINGS.standardOut,
      }}
      className={cn("w-full", className)}
    >
      {children}
    </motion.div>
  );
}
