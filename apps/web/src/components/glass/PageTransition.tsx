"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MOTION_DURATIONS, MOTION_EASINGS } from "./MotionPresets";
import { useQualityMode, useIsReducedMotion } from "./useQualityMode";

export interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export function PageTransition({ children, className }: PageTransitionProps) {
  const { quality } = useQualityMode();
  const isReducedMotion = useIsReducedMotion();

  if (isReducedMotion || quality === "eco") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: MOTION_DURATIONS.instant }}
        className={cn("w-full flex-1", className)}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{
        duration: MOTION_DURATIONS.base,
        ease: MOTION_EASINGS.standardOut,
      }}
      className={cn("w-full flex-1", className)}
    >
      {children}
    </motion.div>
  );
}
