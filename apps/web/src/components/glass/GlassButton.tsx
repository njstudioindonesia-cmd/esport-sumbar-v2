"use client";

import React, { forwardRef } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { MOTION_SPRINGS } from "./MotionPresets";

export interface GlassButtonProps
  extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "tinted";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

export const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  (
    {
      className,
      variant = "secondary",
      size = "md",
      isLoading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    const isInteractive = !disabled && !isLoading;

    const baseClasses =
      "relative inline-flex items-center justify-center font-medium select-none transition-colors " +
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#03031A] " +
      "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none";

    const variantClasses = {
      primary:
        "bg-gradient-to-r from-[#FF1752] to-[#FF4D77] text-white font-semibold shadow-lg shadow-pink-500/25 " +
        "hover:from-[#E01246] hover:to-[#FF3866] border border-white/20",
      secondary:
        "bg-white/[0.08] hover:bg-white/[0.14] active:bg-white/[0.18] text-white border border-white/15 " +
        "backdrop-blur-md shadow-sm",
      ghost:
        "bg-transparent hover:bg-white/[0.08] active:bg-white/[0.12] text-slate-300 hover:text-white border border-transparent",
      danger:
        "bg-rose-500/15 hover:bg-rose-500/25 active:bg-rose-500/30 text-rose-300 hover:text-rose-200 border border-rose-500/35 " +
        "backdrop-blur-md shadow-sm",
      tinted:
        "bg-pink-500/15 hover:bg-pink-500/25 active:bg-pink-500/30 text-pink-300 hover:text-pink-200 border border-pink-500/35 " +
        "backdrop-blur-md shadow-sm",
    };

    const sizeClasses = {
      sm: "h-9 min-h-[36px] px-3 text-xs rounded-xl gap-1.5",
      md: "h-11 min-h-[44px] px-4 text-sm rounded-2xl gap-2", // Min 44px for WCAG 2.1 touch target
      lg: "h-13 min-h-[52px] px-6 text-base rounded-2xl gap-2.5",
      icon: "h-11 w-11 min-h-[44px] min-w-[44px] p-0 rounded-2xl",
    };

    return (
      <motion.button
        ref={ref}
        whileTap={isInteractive ? { scale: 0.97 } : undefined}
        transition={MOTION_SPRINGS.snappy}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {isLoading && (
          <Loader2
            className={cn(
              "w-4 h-4 animate-spin text-current",
              children ? "mr-1" : ""
            )}
            aria-hidden="true"
          />
        )}
        {!isLoading && leftIcon && (
          <span className="inline-flex shrink-0" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        {children}
        {!isLoading && rightIcon && (
          <span className="inline-flex shrink-0" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </motion.button>
    );
  }
);

GlassButton.displayName = "GlassButton";
