"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { toPng } from "html-to-image";
import {
  Download,
  Share2,
  Copy,
  Check,
  X,
  Smartphone,
  Square,
  Sparkles,
  Shield,
  Layers,
  AlertCircle,
} from "lucide-react";
import { EsportCard } from "./EsportCard";
import { BrandWatermark } from "@/components/brand";
import {
  UnifiedCardData,
  CardRarity,
  CardVerification,
  CardEntityType,
} from "@/types/card";

export type ExportFormat = "story" | "feed" | "card";

interface ShareCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  cardData: {
    type: CardEntityType;
    rarity: CardRarity;
    verification: CardVerification;
    data: UnifiedCardData;
  };
}

export function ShareCardModal({
  isOpen,
  onClose,
  cardData,
}: ShareCardModalProps) {
  const [format, setFormat] = useState<ExportFormat>("story");
  const [isExporting, setIsExporting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const exportContainerRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const { type, rarity, verification, data } = cardData;
  const slug = (data.ign || data.teamName || data.displayName)
    .toLowerCase()
    .replace(/\s+/g, "-");
  const publicUrl = `https://esportsumbar.id/${type}/${slug}`;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopiedLink(true);
      showToast("Tautan profil publik berhasil disalin ke clipboard!");
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      showToast("Gagal menyalin tautan. Silakan salin manual.");
    }
  };

  const handleDownload = async () => {
    if (!exportContainerRef.current) return;
    setIsExporting(true);

    try {
      // Pre-wait a small tick for any font/canvas rendering
      await new Promise((r) => setTimeout(r, 100));

      const dataUrl = await toPng(exportContainerRef.current, {
        cacheBust: true,
        pixelRatio: 2, // 2x high resolution for sharp text and QR
        quality: 0.95,
        backgroundColor: "#0B0D12",
      });

      const filename = `esport-sumbar-${data.esportId.toLowerCase()}-${format}.png`;
      const link = document.createElement("a");
      link.download = filename;
      link.href = dataUrl;
      link.click();

      showToast(`Kartu berhasil diunduh (${filename})!`);
    } catch (err) {
      console.error("Gagal mengekspor kartu:", err);
      showToast("Gagal merender gambar. Coba format lain atau muat ulang halaman.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1A1E28] border border-[#D4AF37] text-white text-xs font-heading font-medium shadow-2xl animate-in slide-in-from-top-4">
          <Check className="w-4 h-4 text-[#22C55E]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modal Dialog Box */}
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl bg-[#12151C] border border-[#262B38] shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#262B38] bg-[#0E1117]">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-[#D4AF37]" />
            <h2 className="text-sm sm:text-base font-heading font-bold uppercase tracking-wider text-white">
              Bagikan & Ekspor Kartu ESPORT ID
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-[#1A1E28] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Controls & Canvas Preview */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col items-center gap-5">
          {/* Format Selection Tabs */}
          <div className="flex items-center gap-2 bg-[#0B0D12] p-1 rounded-xl border border-[#262B38]">
            <button
              type="button"
              onClick={() => setFormat("story")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-all ${
                format === "story"
                  ? "bg-[#FF1752] text-white shadow-md pink-glow-sm"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Story (9:16)</span>
            </button>

            <button
              type="button"
              onClick={() => setFormat("feed")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-all ${
                format === "feed"
                  ? "bg-[#FF1752] text-white shadow-md pink-glow-sm"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Square className="w-3.5 h-3.5" />
              <span>Feed (1:1)</span>
            </button>

            <button
              type="button"
              onClick={() => setFormat("card")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-all ${
                format === "card"
                  ? "bg-[#FF1752] text-white shadow-md pink-glow-sm"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Kartu Saja</span>
            </button>
          </div>

          {/* Privacy Protection Notice */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1A1E28]/70 border border-[#262B38] text-[11px] text-[#9AA3B2] max-w-md text-center">
            <Shield className="w-3.5 h-3.5 text-[#22C55E] shrink-0" />
            <span>
              Privasi Aman: Dokumen dan data kontak sensitif tidak disertakan dalam gambar ekspor publik.
            </span>
          </div>

          {/* Canvas Preview Container (What will be captured by html-to-image) */}
          <div className="w-full flex items-center justify-center p-2 overflow-x-auto">
            <div
              ref={exportContainerRef}
              className={`relative overflow-hidden flex flex-col items-center justify-between transition-all duration-300 ${
                format === "story"
                  ? "w-[340px] sm:w-[360px] h-[600px] sm:h-[640px] p-5 rounded-2xl bg-gradient-to-b from-[#0A0A2E] via-[#03031A] to-[#0A0A2E] border border-white/10"
                  : format === "feed"
                  ? "w-[340px] sm:w-[440px] h-[340px] sm:h-[440px] p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#0A0A2E] via-[#03031A] to-[#0A0A2E] border border-white/10"
                  : "p-2 rounded-2xl bg-[#03031A]"
              }`}
            >
              {/* Brand Watermark & Ambient Pink Glow on Canvas */}
              {format !== "card" && (
                <>
                  <BrandWatermark opacity={0.06} size={420} position="center" />
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#FF1752]/15 blur-3xl pointer-events-none" />

                  {/* Header on Export Canvas */}
                  <div className="relative z-10 w-full flex items-center justify-between pb-2 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <div className="relative w-5 h-3 shrink-0">
                        <Image
                          src="/brand/logo-mark-pink.png"
                          alt=""
                          fill
                          sizes="20px"
                          className="object-contain"
                        />
                      </div>
                      <span className="text-[11px] font-heading font-black uppercase tracking-widest text-white">
                        ESPORT SUMBAR™
                      </span>
                    </div>
                    <span className="text-[8px] font-mono font-bold text-[#FF4D77] uppercase tracking-wider">
                      PASPOR ATLET RESMI
                    </span>
                  </div>
                </>
              )}

              {/* The Actual Card (Rendered with interactive=false so it's flat & razor sharp for PNG capture) */}
              <div className="relative z-10 my-auto">
                <EsportCard
                  type={type}
                  rarity={rarity}
                  verification={verification}
                  data={data}
                  size={format === "feed" ? "sm" : "md"}
                  interactive={false}
                />
              </div>

              {/* Footer on Export Canvas */}
              {format !== "card" && (
                <div className="relative z-10 w-full pt-2 border-t border-white/10 flex items-center justify-between text-[8px] text-white/50 font-mono">
                  <div className="flex items-center gap-1.5">
                    <span>ESPORT ID:</span>
                    <span className="text-white font-bold">{data.esportId}</span>
                  </div>
                  <span className="text-[#FF4D77]">esportsumbar.com</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer: Action Buttons */}
        <div className="px-5 py-3.5 border-t border-[#262B38] bg-[#0E1117] flex flex-wrap items-center justify-between gap-3">
          {/* Copy Profile Link */}
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1A1E28] hover:bg-[#262B38] border border-[#262B38] text-xs font-heading font-semibold text-gray-200 transition-colors"
          >
            {copiedLink ? (
              <Check className="w-3.5 h-3.5 text-[#22C55E]" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-[#3B82F6]" />
            )}
            <span>{copiedLink ? "Tautan Disalin!" : "Salin Tautan Profil"}</span>
          </button>

          {/* Download Button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-heading font-medium text-gray-400 hover:text-white transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleDownload}
              disabled={isExporting}
              className="btn-brand-primary text-xs py-2 px-5"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? "Memproses..." : "Unduh PNG (2x HD)"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
