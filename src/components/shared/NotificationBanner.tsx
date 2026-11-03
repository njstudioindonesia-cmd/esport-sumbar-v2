import React from "react";
import {
  CheckCircle2,
  Info,
  AlertTriangle,
  XCircle,
  X,
} from "lucide-react";

interface NotificationBannerProps {
  type?: "success" | "info" | "warning" | "error";
  title?: string;
  message: string;
  onDismiss?: () => void;
  className?: string;
}

export function NotificationBanner({
  type = "info",
  title,
  message,
  onDismiss,
  className = "",
}: NotificationBannerProps) {
  const configs = {
    success: {
      icon: CheckCircle2,
      border: "border-[#22C55E]/40",
      bg: "bg-[#22C55E]/15",
      text: "text-[#22C55E]",
      iconColor: "text-[#22C55E]",
    },
    info: {
      icon: Info,
      border: "border-[#3B82F6]/40",
      bg: "bg-[#3B82F6]/15",
      text: "text-[#93C5FD]",
      iconColor: "text-[#3B82F6]",
    },
    warning: {
      icon: AlertTriangle,
      border: "border-amber-700/50",
      bg: "bg-amber-950/30",
      text: "text-amber-300",
      iconColor: "text-amber-400",
    },
    error: {
      icon: XCircle,
      border: "border-red-800/50",
      bg: "bg-red-950/30",
      text: "text-red-300",
      iconColor: "text-red-400",
    },
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <div
      className={`p-4 rounded-xl border ${config.bg} ${config.border} flex items-start justify-between gap-3 shadow-md animate-in fade-in duration-200 ${className}`}
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${config.iconColor}`} />
        <div className="flex flex-col gap-0.5">
          {title && (
            <span className="font-heading font-bold text-xs uppercase text-white">
              {title}
            </span>
          )}
          <span className={`text-xs leading-relaxed ${config.text}`}>
            {message}
          </span>
        </div>
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="p-1 hover:bg-black/30 rounded-lg text-gray-400 hover:text-white shrink-0"
          title="Tutup pemberitahuan"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
