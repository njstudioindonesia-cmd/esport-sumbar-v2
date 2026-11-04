"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Share2,
  QrCode,
  Flag,
  Edit3,
  Eye,
  Check,
  AlertTriangle,
  X,
  ShieldCheck,
  Shield,
  Trophy,
  ExternalLink,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import type { UnifiedProfileDetail } from "@/lib/services/public-profiles";

interface SharedProfileActionsProps {
  profile: UnifiedProfileDetail;
  isOwner?: boolean;
}

export function SharedProfileActions({ profile, isOwner = false }: SharedProfileActionsProps) {
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportCategory, setReportCategory] = useState("data_palsu");
  const [reportDetails, setReportDetails] = useState("");
  const [reportSuccess, setReportSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const profileUrl = typeof window !== "undefined" ? window.location.href : `https://esport-sumbar-v2.vercel.app/profile/${profile.slug}`;

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({
        title: `${profile.displayName} - PBESI Sumatera Barat`,
        text: `Lihat kartu identitas esport resmi: ${profile.displayName} (${profile.esportId})`,
        url: profileUrl,
      }).catch(() => {});
    } else {
      setShareModalOpen(true);
    }
  };

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(profileUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReportSuccess(true);
    setTimeout(() => {
      setReportModalOpen(false);
      setReportSuccess(false);
      setReportDetails("");
    }, 2000);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Tombol Bagikan */}
      <button
        type="button"
        onClick={handleShare}
        className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-white/20 text-xs font-mono text-white/80 hover:text-white flex items-center gap-1.5 transition-all"
        title="Bagikan Kartu"
      >
        <Share2 className="w-3.5 h-3.5 text-[#D4AF37]" />
        <span>Bagikan</span>
      </button>

      {/* Tombol QR Code */}
      <button
        type="button"
        onClick={() => setQrModalOpen(true)}
        className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-white/20 text-xs font-mono text-white/80 hover:text-white flex items-center gap-1.5 transition-all"
        title="Tampilkan Kode QR"
      >
        <QrCode className="w-3.5 h-3.5 text-[#D4AF37]" />
        <span>QR</span>
      </button>

      {/* Tombol Laporkan (Bukan untuk Pemilik) */}
      {!isOwner && (
        <button
          type="button"
          onClick={() => setReportModalOpen(true)}
          className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-red-500/30 text-xs font-mono text-white/50 hover:text-red-400 flex items-center gap-1.5 transition-all"
          title="Laporkan Profil / Foto"
        >
          <Flag className="w-3.5 h-3.5" />
          <span>Lapor</span>
        </button>
      )}

      {/* Tombol Edit Profil (Hanya untuk Pemilik Profil) */}
      {isOwner && (
        <Link
          href={`/me/cards`}
          className="px-3.5 py-1.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#07080C] text-xs font-heading font-black uppercase flex items-center gap-1.5 shadow-md transition-all"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Kelola</span>
        </Link>
      )}

      {/* MODAL QR CODE */}
      {qrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-sm bg-[#0E121B] border border-white/15 rounded-3xl p-6 flex flex-col items-center text-center shadow-2xl">
            <button
              type="button"
              onClick={() => setQrModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-full text-white/50 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider mb-1">
              PASPOR DIGITAL PBESI
            </span>
            <h3 className="text-base font-heading font-black text-white mb-1">
              {profile.displayName}
            </h3>
            <span className="text-xs font-mono text-white/40 mb-4">{profile.esportId}</span>

            {/* QR Code Container */}
            <div className="p-4 rounded-2xl bg-white shadow-xl mb-4">
              <QRCodeSVG
                value={profileUrl}
                size={180}
                level="H"
                includeMargin={false}
              />
            </div>

            <p className="text-[11px] text-white/60 mb-4">
              Pindai kode QR untuk membuka verifikasi kartu resmi di portal esport Sumatera Barat.
            </p>

            <button
              type="button"
              onClick={handleCopyLink}
              className="w-full py-2.5 rounded-xl bg-white/[0.06] border border-white/10 hover:border-white/20 text-xs font-mono text-white flex items-center justify-center gap-2 transition-colors"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <ExternalLink className="w-4 h-4" />}
              <span>{copiedLink ? "Tautan Disalin!" : "Salin Tautan Profil"}</span>
            </button>
          </div>
        </div>
      )}

      {/* MODAL LAPORAN PROFIL / FOTO */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#0E121B] border border-white/15 rounded-3xl p-6 flex flex-col text-left shadow-2xl">
            <button
              type="button"
              onClick={() => setReportModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-full text-white/50 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1 text-red-400">
              <AlertTriangle className="w-4 h-4" />
              <h3 className="text-base font-heading font-black text-white">
                Laporkan Profil / Foto
              </h3>
            </div>
            <p className="text-xs text-white/50 mb-4">
              Laporan Anda akan ditinjau langsung oleh Admin Pengcab ESI dan Operator Platform.
            </p>

            {reportSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center flex flex-col items-center gap-2">
                <Check className="w-8 h-8 text-emerald-400" />
                <span className="text-sm font-heading font-bold text-white">
                  Laporan Berhasil Terkirim
                </span>
                <span className="text-xs text-white/60">
                  Terima kasih telah membantu menjaga integritas ekosistem esport Sumatera Barat.
                </span>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="flex flex-col gap-3">
                <div>
                  <label className="text-[11px] font-mono text-white/60 block mb-1">
                    Alasan Laporan
                  </label>
                  <select
                    value={reportCategory}
                    onChange={(e) => setReportCategory(e.target.value)}
                    className="w-full h-10 bg-[#161A24] border border-white/10 rounded-xl px-3 text-xs text-white outline-none"
                  >
                    <option value="data_palsu">Informasi / Prestasi Palsu</option>
                    <option value="foto_tidak_pantas">Foto Profil Tidak Pantas / Melanggar Norma</option>
                    <option value="pelanggaran_anak">Pelanggaran Privasi Atlet Anak (&lt;18 Tahun)</option>
                    <option value="klaim_palsu_tim">Klaim Tim / Lembaga Tanpa Izin</option>
                    <option value="lainnya">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-white/60 block mb-1">
                    Keterangan Tambahan
                  </label>
                  <textarea
                    rows={3}
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    placeholder="Jelaskan bukti atau alasan pelaporan secara ringkas..."
                    required
                    className="w-full bg-[#161A24] border border-white/10 rounded-xl p-3 text-xs text-white outline-none resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReportModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-mono text-white/60 hover:text-white"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-heading font-bold"
                  >
                    Kirim Laporan
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Status Lencana Verifikasi Resmi PBESI (Terpisah dari Tier Rarity)
 */
export function VerificationStatusBadge({ status, badgeNo }: { status: string; badgeNo?: string | null }) {
  if (status === "verified") {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#D4AF37]/20 to-amber-500/20 border border-[#D4AF37] text-[10px] font-mono font-bold text-[#F3E5AB] shadow-[0_0_15px_rgba(212,175,55,0.3)]">
        <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
        <span>TERVERIFIKASI PBESI</span>
        {badgeNo && <span className="opacity-70">#{badgeNo}</span>}
      </div>
    );
  }

  if (status === "regional_checked" || status === "regional_approved" || status === "district_approved") {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/50 text-[10px] font-mono font-bold text-emerald-300">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>TERVERIFIKASI PENGCAB</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/10 text-[10px] font-mono text-white/50">
      <Shield className="w-3 h-3 text-white/40" />
      <span>BELUM TERVERIFIKASI</span>
    </div>
  );
}
