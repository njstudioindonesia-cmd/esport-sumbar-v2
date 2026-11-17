import React from "react";
import { CheckCircle2, AlertTriangle, AlertCircle, X } from "lucide-react";

export type ToastType = "success" | "warning" | "error" | "info";

export interface ToastProps {
  type?: ToastType;
  title: string;
  message?: string;
  onClose?: () => void;
  className?: string;
}

export function Toast({
  type = "info",
  title,
  message,
  onClose,
  className = "",
}: ToastProps) {
  const config = {
    success: {
      icon: CheckCircle2,
      border: "border-[#2BB673]/30",
      iconColor: "text-[#2BB673]",
    },
    warning: {
      icon: AlertTriangle,
      border: "border-[#F2A33A]/30",
      iconColor: "text-[#F2A33A]",
    },
    error: {
      icon: AlertCircle,
      border: "border-[#F04438]/30",
      iconColor: "text-[#F04438]",
    },
    info: {
      icon: CheckCircle2,
      border: "border-white/10",
      iconColor: "text-white/70",
    },
  }[type];

  const Icon = config.icon;

  return (
    <div
      role="status"
      className={`max-w-md w-full bg-[#14143A] border ${config.border} rounded-xl shadow-2xl p-4 flex items-start gap-3 select-none ${className}`}
    >
      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${config.iconColor}`} />
      <div className="flex flex-col min-w-0 flex-1">
        <span className="text-xs font-bold text-white leading-tight">{title}</span>
        {message && (
          <span className="text-xs text-white/60 leading-relaxed mt-1">{message}</span>
        )}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-white/40 hover:text-white p-1 rounded-md transition-colors"
          aria-label="Tutup Notifikasi"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
