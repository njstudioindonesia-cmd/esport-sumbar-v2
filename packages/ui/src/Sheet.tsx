import React, { useEffect } from "react";
import { X } from "lucide-react";

export interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  side?: "right" | "bottom";
  className?: string;
}

export function Sheet({
  isOpen,
  onClose,
  title,
  children,
  side = "right",
  className = "",
}: SheetProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end">
      {/* Matte Backdrop Scrim */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#05051A]/80 backdrop-blur-sm transition-opacity"
      />

      {/* Sheet Content Panel */}
      <div
        className={`relative z-10 w-full bg-[#0C0C26] border-t sm:border-l border-white/[0.08] shadow-2xl transition-all duration-300 flex flex-col ${
          side === "bottom"
            ? "max-h-[85vh] rounded-t-3xl border-t"
            : "sm:max-w-md h-full rounded-none sm:rounded-l-2xl border-l"
        } ${className}`}
      >
        <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
          <div className="text-base font-bold text-white">{title}</div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Tutup Panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}
