"use client";

import React, { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { MOTION_SPRINGS, MOTION_DURATIONS } from "./MotionPresets";
import { useQualityMode, useIsReducedMotion } from "./useQualityMode";

/* ========================================================================= */
/* 1. GLASS DIALOG                                                           */
/* ========================================================================= */
export interface GlassDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  origin?: string;
  className?: string;
}

export function GlassDialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  origin = "center center",
  className,
}: GlassDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const isReducedMotion = useIsReducedMotion();

  // Esc key and focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
      // Focus trap basic
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Dimmed & Scrimmed Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md -z-10"
          />

          {/* Morphing Dialog Surface from Origin Point */}
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            style={{ transformOrigin: origin }}
            initial={
              isReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.94, y: 12 }
            }
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={
              isReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.96, y: 8 }
            }
            transition={
              isReducedMotion
                ? { duration: MOTION_DURATIONS.instant }
                : MOTION_SPRINGS.fluid
            }
            className={cn(
              "w-full max-w-lg rounded-3xl p-6 sm:p-8 bg-[#090924]/90 backdrop-blur-2xl border border-white/20 shadow-2xl shadow-black/60 relative",
              className
            )}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup dialog"
              className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
            >
              <X className="w-5 h-5" />
            </button>

            {title && (
              <h2 className="text-xl font-bold text-white tracking-tight mb-1 pr-8">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-sm text-slate-400 mb-6 font-normal">
                {description}
              </p>
            )}

            <div className="mt-4">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ========================================================================= */
/* 2. GLASS SHEET (DRAWER)                                                   */
/* ========================================================================= */
export interface GlassSheetProps {
  isOpen: boolean;
  onClose: () => void;
  side?: "right" | "left" | "bottom";
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function GlassSheet({
  isOpen,
  onClose,
  side = "right",
  title,
  children,
  className,
}: GlassSheetProps) {
  const isReducedMotion = useIsReducedMotion();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const slideVariants = {
    right: {
      initial: isReducedMotion ? { opacity: 0 } : { x: "100%", opacity: 0.5 },
      animate: isReducedMotion ? { opacity: 1 } : { x: 0, opacity: 1 },
      exit: isReducedMotion ? { opacity: 0 } : { x: "100%", opacity: 0 },
      wrapperClass: "fixed inset-y-0 right-0 w-full max-w-md",
    },
    left: {
      initial: isReducedMotion ? { opacity: 0 } : { x: "-100%", opacity: 0.5 },
      animate: isReducedMotion ? { opacity: 1 } : { x: 0, opacity: 1 },
      exit: isReducedMotion ? { opacity: 0 } : { x: "-100%", opacity: 0 },
      wrapperClass: "fixed inset-y-0 left-0 w-full max-w-md",
    },
    bottom: {
      initial: isReducedMotion ? { opacity: 0 } : { y: "100%", opacity: 0.5 },
      animate: isReducedMotion ? { opacity: 1 } : { y: 0, opacity: 1 },
      exit: isReducedMotion ? { opacity: 0 } : { y: "100%", opacity: 0 },
      wrapperClass: "fixed inset-x-0 bottom-0 max-h-[90vh] rounded-t-3xl",
    },
  };

  const config = slideVariants[side];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          {/* Sheet Container */}
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={title || "Panel sheet"}
            initial={config.initial}
            animate={config.animate}
            exit={config.exit}
            transition={
              isReducedMotion
                ? { duration: MOTION_DURATIONS.instant }
                : MOTION_SPRINGS.fluid
            }
            className={cn(
              "z-10 bg-[#090924]/95 backdrop-blur-2xl border-white/20 p-6 flex flex-col shadow-2xl overflow-y-auto",
              side === "right" && "border-l",
              side === "left" && "border-r",
              side === "bottom" && "border-t",
              config.wrapperClass,
              className
            )}
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              {title ? (
                <h2 className="text-lg font-bold text-white">{title}</h2>
              ) : (
                <div />
              )}
              <button
                type="button"
                onClick={onClose}
                aria-label="Tutup panel"
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 py-4">{children}</div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ========================================================================= */
/* 3. GLASS POPOVER / MENU (MORPH DARI TITIK ASAL)                           */
/* ========================================================================= */
export interface GlassPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  origin?: "top left" | "top right" | "bottom left" | "bottom right" | "center";
  className?: string;
}

export function GlassPopover({
  isOpen,
  onClose,
  children,
  origin = "top right",
  className,
}: GlassPopoverProps) {
  const isReducedMotion = useIsReducedMotion();
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={popoverRef}
          role="menu"
          style={{ transformOrigin: origin }}
          initial={
            isReducedMotion
              ? { opacity: 0 }
              : { opacity: 0, scale: 0.92, y: origin.includes("top") ? -6 : 6 }
          }
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={
            isReducedMotion
              ? { opacity: 0 }
              : { opacity: 0, scale: 0.92, y: origin.includes("top") ? -4 : 4 }
          }
          transition={
            isReducedMotion
              ? { duration: MOTION_DURATIONS.instant }
              : MOTION_SPRINGS.snappy
          }
          className={cn(
            "absolute z-50 p-2 rounded-2xl bg-slate-950/90 backdrop-blur-xl border border-white/20 shadow-2xl min-w-[200px]",
            className
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
