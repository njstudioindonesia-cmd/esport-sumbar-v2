"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertTriangle, Clock } from "lucide-react";
import { MOTION_SPRINGS, MOTION_DURATIONS } from "./MotionPresets";
import { useQualityMode, useIsReducedMotion } from "./useQualityMode";

export interface VerificationStep {
  id: number;
  label: string;
  status: "completed" | "active" | "revision" | "pending";
  description?: string;
  badge?: string;
}

export interface VerificationFlowTrackerProps {
  steps: VerificationStep[];
  currentStepId?: number;
  className?: string;
}

export function VerificationFlowTracker({
  steps,
  currentStepId,
  className,
}: VerificationFlowTrackerProps) {
  const { quality } = useQualityMode();
  const isReducedMotion = useIsReducedMotion();

  // Hitung persentase progres alur verifikasi (0 to 1)
  const totalSteps = steps.length;
  const completedCount = steps.filter((s) => s.status === "completed").length;
  const hasActive = steps.some((s) => s.status === "active" || s.status === "revision");
  
  // Progress scale faktor untuk GPU composited scaleX
  const progressRatio = totalSteps > 1
    ? Math.min(
        1,
        (completedCount + (hasActive ? 0.5 : 0)) / (totalSteps - 1)
      )
    : 1;

  return (
    <div
      role="region"
      aria-label="Pelacak Alur Verifikasi"
      className={cn(
        "p-6 sm:p-8 rounded-3xl bg-slate-950/70 border border-white/10 shadow-2xl backdrop-blur-xl relative overflow-hidden",
        className
      )}
    >
      <div className="relative flex items-center justify-between max-w-4xl mx-auto px-2 sm:px-6">
        {/* Connecting Track Line (Background Rail) */}
        <div
          aria-hidden="true"
          className="absolute left-8 right-8 top-6 h-1 bg-white/10 rounded-full overflow-hidden -z-0"
        >
          {/* Animated Liquid Progress Filler (GPU composited transform: scaleX) */}
          <motion.div
            style={{
              originX: 0,
            }}
            initial={{ scaleX: isReducedMotion ? progressRatio : 0 }}
            animate={{ scaleX: progressRatio }}
            transition={
              isReducedMotion || quality === "eco"
                ? { duration: 0 }
                : { duration: MOTION_DURATIONS.slow, ease: "easeOut" }
            }
            className="h-full w-full bg-gradient-to-r from-emerald-500 via-[#FF1752] to-[#D4AF37] relative"
          >
            {/* Liquid Flow Shimmer Bead (Pulsing Light along track) */}
            {quality === "full" && !isReducedMotion && (
              <span className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white blur-[2px] shadow-[0_0_12px_#fff] animate-pulse" />
            )}
          </motion.div>
        </div>

        {/* Stepper Nodes */}
        {steps.map((step, idx) => {
          const isCompleted = step.status === "completed";
          const isActive = step.status === "active";
          const isRevision = step.status === "revision";
          const isPending = step.status === "pending";

          return (
            <div
              key={step.id}
              className="relative z-10 flex flex-col items-center group cursor-default"
            >
              {/* Node Circle */}
              <div
                className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-200 select-none",
                  isCompleted &&
                    "bg-emerald-500/15 border-2 border-emerald-500 text-emerald-400 shadow-[0_0_16px_rgba(16,185,129,0.35)]",
                  isRevision &&
                    "bg-amber-500/20 border-2 border-amber-500 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.45)]",
                  isActive &&
                    "bg-[#FF1752]/20 border-2 border-[#FF1752] text-[#FF1752] shadow-[0_0_24px_rgba(255,23,82,0.5)] scale-105",
                  isPending &&
                    "bg-slate-900 border border-white/10 text-white/30"
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : isRevision ? (
                  <AlertTriangle className="w-6 h-6" />
                ) : isActive ? (
                  <span className="relative flex items-center justify-center">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#FF1752]" />
                    {quality === "full" && !isReducedMotion && (
                      <span className="absolute w-6 h-6 rounded-full bg-[#FF1752]/40 animate-ping" />
                    )}
                  </span>
                ) : (
                  <span className="font-mono text-xs font-bold">0{step.id}</span>
                )}
              </div>

              {/* Step Labels */}
              <div className="text-center mt-3 max-w-[110px]">
                <div
                  className={cn(
                    "text-xs sm:text-sm font-heading font-bold truncate",
                    isActive && "text-white font-extrabold",
                    isCompleted && "text-emerald-400",
                    isRevision && "text-amber-400",
                    isPending && "text-white/40"
                  )}
                >
                  {step.label}
                </div>
                {step.badge && (
                  <span
                    className={cn(
                      "inline-block text-[10px] font-mono font-medium px-2 py-0.5 rounded-full mt-1 border",
                      isActive
                        ? "bg-[#FF1752]/10 border-[#FF1752]/30 text-rose-300"
                        : isCompleted
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                        : isRevision
                        ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                        : "bg-white/5 border-white/10 text-white/40"
                    )}
                  >
                    {step.badge}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
