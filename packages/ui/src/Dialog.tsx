import React, { useEffect } from "react";
import { X } from "lucide-react";

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function Dialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  actions,
  className = "",
}: DialogProps) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Matte Backdrop Scrim */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#05051A]/85 backdrop-blur-md transition-opacity"
      />

      {/* Modal Card */}
      <div
        role="dialog"
        aria-modal="true"
        className={`relative z-10 w-full max-w-lg bg-[#0C0C26] border border-white/[0.12] rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col gap-6 ${className}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
            {description && (
              <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                {description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors shrink-0"
            aria-label="Tutup Dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {children && <div className="text-sm text-white/80">{children}</div>}

        {actions && (
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.06]">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
