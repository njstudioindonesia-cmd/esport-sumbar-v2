"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";
import { MOTION_SPRINGS } from "./MotionPresets";

export interface ToastMessage {
  id: string;
  type?: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
}

export interface GlassToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
  className?: string;
}

export function GlassToast({ toasts, onDismiss, className }: GlassToastProps) {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <XCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-400 shrink-0" />,
  };

  const borders = {
    success: "border-emerald-500/40 shadow-emerald-500/10",
    error: "border-rose-500/40 shadow-rose-500/10",
    warning: "border-amber-500/40 shadow-amber-500/10",
    info: "border-sky-500/40 shadow-sky-500/10",
  };

  return (
    <div
      role="region"
      aria-label="Notifikasi"
      className={cn(
        "fixed bottom-5 right-5 z-50 flex flex-col space-y-3 pointer-events-none max-w-sm w-full px-4 sm:px-0",
        className
      )}
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          const type = toast.type || "info";
          return (
            <motion.div
              key={toast.id}
              role="status"
              aria-live="polite"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
              transition={MOTION_SPRINGS.snappy}
              className={cn(
                "pointer-events-auto p-4 rounded-2xl bg-slate-900/90 backdrop-blur-xl border shadow-xl flex items-start gap-3 relative overflow-hidden",
                borders[type]
              )}
            >
              <div className="pt-0.5">{icons[type]}</div>
              <div className="flex-1 min-w-0 pr-2">
                <h4 className="text-sm font-bold text-white leading-tight">
                  {toast.title}
                </h4>
                {toast.message && (
                  <p className="text-xs text-slate-300 mt-1 leading-normal font-normal">
                    {toast.message}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => onDismiss(toast.id)}
                aria-label="Tutup notifikasi"
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
