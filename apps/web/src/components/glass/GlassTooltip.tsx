"use client";

import React, { useState, useId } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MOTION_SPRINGS } from "./MotionPresets";

export interface GlassTooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  position?: "top" | "bottom" | "left" | "right";
  delayMs?: number;
  className?: string;
}

export function GlassTooltip({
  content,
  children,
  position = "top",
  delayMs = 200,
  className,
}: GlassTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const tooltipId = useId();

  const handleMouseEnter = () => {
    const t = setTimeout(() => setIsOpen(true), delayMs);
    setTimer(t);
  };

  const handleMouseLeave = () => {
    if (timer) clearTimeout(timer);
    setIsOpen(false);
  };

  const handleFocus = () => setIsOpen(true);
  const handleBlur = () => setIsOpen(false);

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          setIsOpen(false);
        }
      }}
    >
      {React.cloneElement(
        children as React.ReactElement<React.HTMLAttributes<HTMLElement>>,
        {
          "aria-describedby": isOpen ? tooltipId : undefined,
        }
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={tooltipId}
            role="tooltip"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={MOTION_SPRINGS.snappy}
            className={cn(
              "absolute z-50 px-3 py-1.5 text-xs text-white rounded-xl select-none pointer-events-none whitespace-nowrap",
              "bg-slate-950/90 backdrop-blur-md border border-white/20 shadow-xl shadow-black/40",
              positionClasses[position],
              className
            )}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
