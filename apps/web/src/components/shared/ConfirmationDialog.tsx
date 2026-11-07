import React, { useState } from "react";
import { AlertTriangle, AlertOctagon, Info, X } from "lucide-react";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
  title: string;
  consequenceMessage: string;
  riskLevel?: "danger" | "warning" | "primary";
  confirmButtonText?: string;
  requireReason?: boolean;
  reasonPlaceholder?: string;
  isLoading?: boolean;
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  consequenceMessage,
  riskLevel = "danger",
  confirmButtonText = "Konfirmasi Tindakan",
  requireReason = false,
  reasonPlaceholder = "Tuliskan alasan tindakan ini...",
  isLoading = false,
}: ConfirmationDialogProps) {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const riskConfigs = {
    danger: {
      icon: AlertOctagon,
      iconBg: "bg-red-950 text-red-400 border border-red-700",
      btnBg: "bg-red-600 hover:bg-red-700 text-white shadow-red-950",
      borderColor: "border-red-900/60",
    },
    warning: {
      icon: AlertTriangle,
      iconBg: "bg-amber-950 text-amber-400 border border-amber-700",
      btnBg: "bg-amber-500 hover:bg-amber-600 text-black shadow-amber-950",
      borderColor: "border-amber-800/50",
    },
    primary: {
      icon: Info,
      iconBg: "bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40",
      btnBg: "bg-gradient-to-r from-[#D4AF37] to-[#E5C358] text-black hover:brightness-110",
      borderColor: "border-[#D4AF37]/50",
    },
  };

  const config = riskConfigs[riskLevel];
  const Icon = config.icon;

  const handleConfirmClick = () => {
    if (requireReason && !reason.trim()) return;
    onConfirm(reason);
    setReason("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div
        className={`bg-[#12151C] border ${config.borderColor} rounded-2xl max-w-md w-full p-6 flex flex-col gap-4 shadow-2xl relative`}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${config.iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-base uppercase text-white">
              {title}
            </h3>
            <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">
              Tingkat Risiko: {riskLevel.toUpperCase()}
            </span>
          </div>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed bg-[#161922] p-3 rounded-xl border border-[#262B38]">
          {consequenceMessage}
        </p>

        {requireReason && (
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-heading font-bold uppercase text-gray-300">
              Alasan Wajib (Dicatat di Audit Log):
            </label>
            <textarea
              rows={3}
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={reasonPlaceholder}
              className="w-full bg-[#0B0D12] border border-[#262B38] focus:border-[#D4AF37] rounded-xl p-3 text-xs text-white focus:outline-none"
            />
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#262B38]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-heading text-gray-400 hover:text-white"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={isLoading || (requireReason && !reason.trim())}
            onClick={handleConfirmClick}
            className={`px-5 py-2.5 rounded-xl text-xs font-heading font-extrabold uppercase tracking-wider disabled:opacity-40 transition-all shadow-md ${config.btnBg}`}
          >
            {isLoading ? "Memproses..." : confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}
