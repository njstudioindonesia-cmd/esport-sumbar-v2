"use client";

import React, { useState } from "react";
import {
  X,
  ShieldCheck,
  Clock,
  AlertTriangle,
  Upload,
  CheckCircle2,
  Loader2,
  FileText,
  Shield,
  HelpCircle,
} from "lucide-react";
import { Button, Input, Textarea, StatusBadge } from "@esport-sumbar/ui";
import type { UnifiedProfileDetail } from "@/lib/services/public-profiles";
import { submitVerificationAction } from "@/app/actions/verification";

export interface VerificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UnifiedProfileDetail;
  onSuccess?: () => void;
}

export function VerificationDrawer({
  isOpen,
  onClose,
  profile,
  onSuccess,
}: VerificationDrawerProps) {
  const [notes, setNotes] = useState("");
  const [evidenceName, setEvidenceName] = useState("");
  const [evidenceUrl, setEvidenceUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  if (!isOpen) return null;

  const isVerified = profile.verificationStatus === "verified";
  const isPending =
    profile.verificationStatus === "under_review" ||
    profile.verificationStatus === "submitted";
  const isRevision = profile.verificationStatus === "revision_requested";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evidenceUrl.trim()) {
      setMessage({ type: "error", text: "Tautan berkas bukti verifikasi wajib diisi." });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const result = await submitVerificationAction(
        profile.id,
        profile.regionCode || "PDG",
        notes,
        [
          {
            name: evidenceName || "Bukti Akun In-Game & Identitas",
            url: evidenceUrl,
            size: "1.2 MB",
          },
        ]
      );

      if (result.success) {
        setMessage({
          type: "success",
          text: "Permohonan verifikasi berhasil diajukan untuk telaah pengurus!",
        });
        if (onSuccess) onSuccess();
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setMessage({
          type: "error",
          text: result.error || "Gagal mengajukan permohonan verifikasi.",
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan sistem.";
      setMessage({ type: "error", text: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Surface */}
      <div className="relative w-full max-w-lg bg-[#0C0C26] border-l border-white/10 h-full overflow-y-auto flex flex-col z-10 shadow-2xl p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-5 mb-6">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-[#D4AF37] font-bold uppercase tracking-wider">
              Status Verifikasi Resmi
            </span>
            <h2 className="text-xl font-extrabold text-white">Lencana &amp; Verifikasi Profil</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Verification Status Card */}
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] mb-6 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white/70">Status Saat Ini:</span>
            <StatusBadge
              status={
                isVerified
                  ? "verified"
                  : isPending
                  ? "under_review"
                  : isRevision
                  ? "revision"
                  : "unverified"
              }
              size="md"
            />
          </div>

          {isVerified ? (
            <div className="pt-2 border-t border-white/[0.06] flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-xs text-[#D4AF37] font-mono font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Nomor Lencana: {profile.verifiedBadgeNo || "ESP-SB-VER-2026-0001"}</span>
              </div>
              <p className="text-[11px] text-white/50 leading-relaxed">
                Kartu dan identitas resmi Anda telah melalui verifikasi berkas dan terafiliasi resmi
                sebagai atlet/entitas Sumatera Barat.
              </p>
            </div>
          ) : isPending ? (
            <div className="pt-2 border-t border-white/[0.06] flex flex-col gap-1 text-[11px] text-white/60 leading-relaxed">
              <span className="text-[#F2A33A] font-bold">Sedang Ditelaah Pengurus</span>
              <p>
                Permohonan dan dokumen bukti verifikasi Anda sedang dalam antrean pemeriksaan tim
                verifikator. Keputusan akan diberitahukan lewat notifikasi.
              </p>
            </div>
          ) : (
            <div className="pt-2 border-t border-white/[0.06] flex flex-col gap-1 text-[11px] text-white/60 leading-relaxed">
              <span className="text-white/80 font-bold">Belum Terverifikasi</span>
              <p>
                Dapatkan lencana emas resmi dan legitimasi kejuaraan dengan mengunggah bukti kepemilikan
                akun game resmi dan identitas diri.
              </p>
            </div>
          )}
        </div>

        {/* Action Form when not verified */}
        {!isVerified && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-1">
            <h3 className="text-xs font-mono uppercase tracking-wider text-white/60">
              {isRevision ? "Unggah Perbaikan Berkas" : "Ajukan Verifikasi Resmi"}
            </h3>

            {message && (
              <div
                className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
                  message.type === "success"
                    ? "bg-[#2BB673]/15 border border-[#2BB673]/30 text-[#2BB673]"
                    : "bg-[#F04438]/15 border border-[#F04438]/30 text-[#F04438]"
                }`}
              >
                {message.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                )}
                <span>{message.text}</span>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-white/80">Judul Berkas Bukti</label>
              <Input
                value={evidenceName}
                onChange={(e) => setEvidenceName(e.target.value)}
                placeholder="Contoh: Tangkapan Layar Profil MLBB & KTP/Kartu Pelajar"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-white/80">Tautan Gambar / URL Dokumen Bukti</label>
              <Input
                value={evidenceUrl}
                onChange={(e) => setEvidenceUrl(e.target.value)}
                placeholder="https://storage... atau Google Drive URL"
                required
              />
              <span className="text-[10px] text-white/40">
                Pastikan tangkapan layar menampilkan IGN dan ID angka yang cocok dengan data profil Anda.
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-white/80">Catatan Tambahan untuk Verifikator</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Tuliskan informasi pendukung atau riwayat turnamen resmi..."
              />
            </div>

            <div className="pt-6 border-t border-white/[0.08] mt-auto flex items-center gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1"
              >
                Tutup
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                className="flex-1 bg-[#D4AF37] hover:bg-[#B89628] text-black font-extrabold"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                    <span>Mengajukan...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-1.5" />
                    <span>Kirim Bukti</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
