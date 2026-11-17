import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "./Button";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Terjadi Kendala Teknis",
  message = "Data tidak dapat dimuat saat ini. Silakan coba kembali beberapa saat lagi.",
  onRetry,
  className = "",
}: ErrorStateProps) {
  return (
    <div
      className={`p-8 sm:p-12 text-center flex flex-col items-center justify-center gap-3 bg-[#0C0C26] border border-[#F04438]/20 rounded-2xl select-none ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-[#F04438]/10 border border-[#F04438]/30 flex items-center justify-center text-[#F04438] mb-1">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-white tracking-tight">{title}</h3>
      <p className="text-xs sm:text-sm text-white/60 max-w-md leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <div className="mt-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={onRetry}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Coba Lagi
          </Button>
        </div>
      )}
    </div>
  );
}
