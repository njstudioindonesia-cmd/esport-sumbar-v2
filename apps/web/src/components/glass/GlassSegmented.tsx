"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MOTION_SPRINGS } from "./MotionPresets";

export interface SegmentedOption<T extends string = string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface GlassSegmentedProps<T extends string = string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  size?: "sm" | "md";
  className?: string;
  ariaLabel?: string;
}

export function GlassSegmented<T extends string = string>({
  options,
  value,
  onChange,
  size = "md",
  className,
  ariaLabel = "Pilihan segmen",
}: GlassSegmentedProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    let nextIndex = currentIndex;
    if (e.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % options.length;
    } else if (e.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + options.length) % options.length;
    } else if (e.key === "Home") {
      nextIndex = 0;
    } else if (e.key === "End") {
      nextIndex = options.length - 1;
    } else {
      return;
    }

    e.preventDefault();
    const targetOption = options[nextIndex];
    if (targetOption && !targetOption.disabled) {
      onChange(targetOption.value);
    }
  };

  const sizeClasses = {
    sm: "p-1 rounded-xl text-xs",
    md: "p-1.5 rounded-2xl text-sm min-h-[44px]",
  };

  const itemSizeClasses = {
    sm: "py-1.5 px-3 rounded-lg min-h-[32px]",
    md: "py-2 px-4 rounded-xl min-h-[38px]",
  };

  return (
    <div
      ref={containerRef}
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex items-center bg-slate-900/70 backdrop-blur-md border border-white/15 relative select-none",
        sizeClasses[size],
        className
      )}
    >
      {options.map((opt, idx) => {
        const isSelected = opt.value === value;
        return (
          <button
            key={opt.value}
            role="tab"
            type="button"
            aria-selected={isSelected}
            tabIndex={isSelected ? 0 : -1}
            disabled={opt.disabled}
            onClick={() => !opt.disabled && onChange(opt.value)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={cn(
              "relative z-10 inline-flex items-center justify-center font-medium transition-colors duration-150 gap-2 cursor-pointer",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500",
              itemSizeClasses[size],
              isSelected
                ? "text-white font-semibold"
                : "text-slate-400 hover:text-slate-200",
              opt.disabled && "opacity-40 cursor-not-allowed"
            )}
          >
            {/* Sliding Liquid Capsule Indicator */}
            {isSelected && (
              <motion.div
                layoutId={`glass-segmented-indicator-${ariaLabel}`}
                transition={MOTION_SPRINGS.snappy}
                className="absolute inset-0 bg-white/15 border border-white/20 rounded-[inherit] shadow-md -z-10"
              />
            )}
            {opt.icon && <span aria-hidden="true">{opt.icon}</span>}
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
