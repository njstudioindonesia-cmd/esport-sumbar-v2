import React from "react";
import { AlertCircle } from "lucide-react";

interface DemoBannerProps {
  className?: string;
}

export function DemoBanner({ className = "" }: DemoBannerProps) {
  return (
    <div
      className={`w-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] px-4 py-2.5 rounded-xl flex items-center justify-between gap-3 text-xs backdrop-blur-md ${className}`}
    >
      <div className="flex items-center gap-2">
        <AlertCircle className="w-4 h-4 shrink-0 text-[#D4AF37]" />
        <span>
          <strong className="font-semibold">Data Percontohan (Demo):</strong> Profil ini dibuat untuk keperluan pengujian sistem dan bukan merupakan profil riil atlet.
        </span>
      </div>
      <span className="shrink-0 px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[10px] uppercase font-mono font-bold tracking-wider">
        Demo Mode
      </span>
    </div>
  );
}
