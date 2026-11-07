"use client";

import React, { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MOTION_SPRINGS } from "./MotionPresets";

export interface GlassSwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  id?: string;
  className?: string;
}

export const GlassSwitch = forwardRef<HTMLButtonElement, GlassSwitchProps>(
  (
    { checked, onCheckedChange, disabled = false, label, id, className },
    ref
  ) => {
    const handleToggle = () => {
      if (!disabled) {
        onCheckedChange(!checked);
      }
    };

    return (
      <div className={cn("inline-flex items-center gap-3 select-none", className)}>
        {/* Min 44px hit area button wrapper */}
        <button
          id={id}
          ref={ref}
          type="button"
          role="switch"
          aria-checked={checked}
          aria-label={label || "Tombol saklar"}
          disabled={disabled}
          onClick={handleToggle}
          onKeyDown={(e) => {
            if (e.key === " " || e.key === "Enter") {
              e.preventDefault();
              handleToggle();
            }
          }}
          className={cn(
            "relative inline-flex items-center justify-center p-1 min-h-[44px] min-w-[56px] focus-visible:outline-none cursor-pointer",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          {/* Visual Track */}
          <span
            className={cn(
              "w-12 h-7 rounded-full border transition-colors duration-200 relative flex items-center p-0.5",
              checked
                ? "bg-gradient-to-r from-pink-600 to-rose-500 border-pink-400/50 shadow-md shadow-pink-500/30"
                : "bg-slate-900/80 border-white/20 backdrop-blur-md",
              "focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            )}
          >
            {/* Visual Thumb */}
            <motion.span
              layout
              transition={MOTION_SPRINGS.snappy}
              animate={{ x: checked ? 20 : 0 }}
              className={cn(
                "w-5 h-5 rounded-full bg-white shadow-md block border border-white/20",
                checked ? "bg-white" : "bg-slate-300"
              )}
            />
          </span>
        </button>
        {label && (
          <span
            onClick={handleToggle}
            className={cn(
              "text-sm font-medium text-slate-200 cursor-pointer",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            {label}
          </span>
        )}
      </div>
    );
  }
);
GlassSwitch.displayName = "GlassSwitch";
