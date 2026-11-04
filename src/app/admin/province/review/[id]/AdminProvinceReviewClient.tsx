"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Clock,
  Lock,
  ChevronRight,
  ArrowLeft,
  X,
  Send,
  Sparkles,
  User,
  MapPin,
  Building,
  AlertOctagon,
  ZoomIn,
} from "lucide-react";
import { AdminProvinceNavbar } from "@/components/admin/AdminProvinceNavbar";
import { Footer } from "@/components/layout/Footer";
import { EsportCard } from "@/components/card/EsportCard";
import { VerificationBadge } from "@/components/card/VerificationBadge";
import { MOCK_PROVINCE_QUEUE } from "@/data/mockAdminData";
import { GALLERY_CARDS } from "@/data/mockCards";
import { transitionVerificationAction } from "@/app/actions/verification";

interface Props {
  reviewId: string;
}

export default function AdminProvinceReviewClient({ reviewId }: Props) {
  const router = useRouter();

  const item =
    MOCK_PROVINCE_QUEUE.find((q) => q.id === reviewId) || MOCK_PROVINCE_QUEUE[0];

  const cardData = GALLERY_CARDS.find((c) => c.data.esportId === item.esportId) || GALLERY_CARDS[2];

  // Modals state
  const [goldVerifyModalOpen, setGoldVerifyModalOpen] = useState(false);
  const [revisionModalOpen, setRevisionModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [previewDocUrl, setPreviewDocUrl] = useState<string | null>(null);

  // Form states
  const [revisionNotes, setRevisionNotes] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [suspendReason, setSuspendReason] = useState("");
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // Generated license number
  const officialBadgeNumber = `ESI-SB-VER-2026-${item.esportId.slice(-4)}`;

  const handleGrantGoldVerification = async () => {
    await transitionVerificationAction({
      requestId: item.id,
      newStatus: "verified",
      reason: "Disahkan secara resmi oleh Sidang Komisi Keabsahan Pengprov ESI Sumatera Barat.",
      notes: "Memenuhi seluruh standar keabsahan atlet PBESI Sumbar. Diterbitkan lencana emas dengan masa aktif 12 bulan.",
      badgeNo: officialBadgeNumber,
    });
    setActionSuccessMessage(
      `PENGESAHAN RESMI BERHASIL! Lencana Emas ESI Sumbar dan Nomor Registrasi ${officialBadgeNumber} telah aktif dengan masa berlaku 12 bulan.`
    );
    setGoldVerifyModalOpen(false);
    setTimeout(() => {
      router.push("/admin/province/queue");
    }, 2800);
  };

  const handleSendRevision = async () => {
    if (!revisionNotes) return;
    await transitionVerificationAction({
      requestId: item.id,
      newStatus: "revision_requested",
      reason: revisionNotes,
      notes: revisionNotes,
      revisionFields: [],
    });
    setActionSuccessMessage(
      `Permintaan revisi berhasil dikirimkan kembali ke pemohon ${item.ign}.`
    );
    setRevisionModalOpen(false);
    setTimeout(() => {
      router.push("/admin/province/queue");
    }, 2500);
  };

  const handleReject = async () => {
    if (!rejectReason) return;
    await transitionVerificationAction({
      requestId: item.id,
      newStatus: "rejected",
      reason: rejectReason,
      notes: rejectReason,
    });
    setActionSuccessMessage(
      `Pengajuan ${item.ign} telah ditolak di tingkat Provinsi. Dicatat di log audit PBESI.`
    );
    setRejectModalOpen(false);
    setTimeout(() => {
      router.push("/admin/province/queue");
    }, 2500);
  };

  const handleSuspend = async () => {
    if (!suspendReason) return;
    await transitionVerificationAction({
      requestId: item.id,
      newStatus: "suspended",
      reason: suspendReason,
      notes: suspendReason,
    });
    setActionSuccessMessage(
      `Lencana resmi atlet ${item.ign} TELAH DITANGGUHKAN. Profil berstatus 'Suspended' pada publik dan turnamen.`
    );
    setSuspendModalOpen(false);
    setTimeout(() => {
      router.push("/admin/province/queue");
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#0B0D12] text-[#F3F4F6] flex flex-col font-sans">
      <AdminProvinceNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        {/* ACTION FEEDBACK BANNER */}
        {actionSuccessMessage && (
          <div className="mb-6 p-4 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] text-xs font-heading font-extrabold flex items-center gap-3 animate-in fade-in">
            <Sparkles className="w-5 h-5 shrink-0" />
            <span>{actionSuccessMessage}</span>
          </div>
        )}

        {/* BREADCRUMB */}
        <div className="flex flex-col gap-2 mb-6">
          <nav className="flex items-center gap-2 text-xs text-[#9AA3B2] font-mono mb-1">
            <Link href="/admin/province" className="hover:text-white transition-colors">
              Admin Provinsi
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/admin/province/queue" className="hover:text-white transition-colors">
              Antrean Pengesahan
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#D4AF37] font-bold">Sidang Pengesahan: {item.ign}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#262B38] pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[10px] font-mono text-[#D4AF37] font-bold">
                  KODE DAERAH: {item.regionCode} ({item.regionName})
                </span>
                {item.isFallback && (
                  <span className="px-2 py-0.5 rounded bg-purple-950 border border-purple-700 text-purple-300 text-[10px] font-mono font-bold">
                    WILAYAH FALLBACK
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-black uppercase text-white tracking-tight flex items-center gap-2">
                <span>Sidang Pengesahan Lencana Emas:</span>
                <span className="text-[#D4AF37]">{item.ign}</span>
              </h1>
            </div>

            <Link
              href="/admin/province/queue"
              className="self-start md:self-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-[#161922] hover:bg-[#1A1E28] border border-[#262B38] text-xs font-heading font-bold text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Antrean</span>
            </Link>
          </div>
        </div>

        {/* 3-PANEL REVIEW GRID (Prompt 10 Specification) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* PANEL KIRI (4 COLS): RIWAYAT DAERAH & PRATINJAU KARTU EMAS */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* 1. HASIL PEMERIKSAAN PENGCAB DAERAH (TAHAP 1) */}
            <div className="p-6 rounded-2xl bg-[#12151C] border border-[#262B38] shadow-md flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#262B38]">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-[#22C55E]" />
                  <h3 className="font-heading font-bold text-xs uppercase text-white tracking-wide">
                    Riwayat Pemeriksaan Pengcab Daerah
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded border border-[#22C55E]/30 font-bold">
                  {item.status === "regional_checked" ? "Lolos Tahap 1" : "Jalur Fallback"}
                </span>
              </div>

              {item.regionalReviewer ? (
                <div className="p-4 rounded-xl bg-[#161922] border border-[#262B38] flex flex-col gap-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Verifikator Daerah:</span>
                    <strong className="text-white font-mono">{item.regionalReviewer.name}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Waktu Kelulusan:</span>
                    <span className="text-gray-300 font-mono">{item.regionalReviewer.approvedAt}</span>
                  </div>
                  <div className="pt-2 border-t border-[#262B38]/60">
                    <span className="text-gray-400 text-[11px] block mb-1">Catatan Verifikator:</span>
                    <p className="text-gray-200 italic bg-black/30 p-2.5 rounded-lg border border-[#262B38]">
                      &ldquo;{item.regionalReviewer.notes}&rdquo;
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-800/40 text-xs text-purple-300 space-y-1">
                  <strong>Pemberitahuan Jalur Fallback:</strong>
                  <p className="text-[11px] text-gray-300 leading-relaxed">
                    Wilayah {item.regionName} belum memiliki struktur Pengurus Cabang aktif. Berdasarkan SOP PBESI Sumbar, Pengurus Provinsi berwenang melakukan verifikasi tahap 1 dan tahap 2 secara terpadu.
                  </p>
                </div>
              )}
            </div>

            {/* 2. SIMULASI KARTU DENGAN LENCANA EMAS RESMI */}
            <div className="p-6 rounded-2xl bg-[#12151C] border border-[#262B38] shadow-md flex flex-col items-center gap-4">
              <div className="w-full flex items-center justify-between pb-3 border-b border-[#262B38]">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <h3 className="font-heading font-bold text-xs uppercase text-white">
                    Simulasi Kartu Verifikasi Emas PBESI
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-[#D4AF37] font-bold">
                  Verified Official
                </span>
              </div>

              <EsportCard
                type={cardData.type}
                rarity="elite"
                verification="verified"
                data={{
                  ...cardData.data,
                  ign: item.ign,
                  displayName: item.name,
                  game: item.game,
                  role: item.role,
                  esportId: item.esportId,
                }}
                size="sm"
                interactive={true}
              />

              <div className="p-3 rounded-xl bg-[#161922] border border-[#D4AF37]/30 w-full flex items-center justify-between text-xs">
                <span className="text-gray-400">Nomor Registrasi Lencana:</span>
                <span className="font-mono text-[#D4AF37] font-bold">{officialBadgeNumber}</span>
              </div>
            </div>
          </div>

          {/* PANEL TENGAH (5 COLS): DOKUMEN BUKTI PRIVAT */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* 1. DOKUMEN BUKTI */}
            <div className="p-6 rounded-2xl bg-[#12151C] border border-[#262B38] shadow-md flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#262B38]">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#3B82F6]" />
                  <h3 className="font-heading font-bold text-xs uppercase text-white tracking-wide">
                    Dokumen Bukti Privat ({item.documents.length})
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-[#3B82F6]" />
                  Akses Tertinggi ESI Prov
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {item.documents.map((doc, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#161922] border border-[#262B38] flex items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-[#1A1E28] border border-[#262B38] text-[#D4AF37] shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-xs text-white">
                          {doc.title}
                        </h4>
                        <span className="text-[10px] text-gray-400 font-mono">
                          Ukuran: {doc.fileSize} • Diunggah: {doc.submittedAt}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setPreviewDocUrl(doc.url)}
                      className="px-3 py-1.5 rounded-lg bg-[#1A1E28] hover:bg-[#262B38] text-xs font-heading font-bold text-[#D4AF37] hover:text-white uppercase flex items-center gap-1.5 transition-colors shrink-0"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span>Lihat</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* PANEL KANAN LENGKET (3 COLS): AKSI KEPUTUSAN PENGPROV ESI */}
          <div className="lg:col-span-3 sticky top-20 flex flex-col gap-4">
            <div className="p-5 rounded-2xl bg-[#12151C] border border-[#D4AF37]/40 shadow-2xl flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#262B38]">
                <span className="text-xs font-heading font-black text-[#D4AF37] uppercase tracking-wider">
                  Keputusan Sidang
                </span>
                <span className="text-[10px] font-mono text-emerald-400">PENGPROV</span>
              </div>

              {/* Baris Kemitraan Verifikasi Resmi Pengprov ESI */}
              <div className="px-3 py-2 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[11px] text-[#D4AF37] flex items-center gap-2 font-mono">
                <Award className="w-3.5 h-3.5 shrink-0" />
                <span>Verifikasi atas nama Pengprov ESI Sumbar. Platform dikelola ESPORT SUMBAR™.</span>
              </div>

              {/* ACTION 1: VERIFIKASI RESMI EMAS (PRIMARY ACTION) */}
              <button
                type="button"
                onClick={() => setGoldVerifyModalOpen(true)}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F3DE8A] to-[#D4AF37] hover:brightness-110 text-black text-xs font-heading font-black uppercase tracking-wider shadow-lg shadow-amber-950/40 flex items-center justify-center gap-2 transition-all"
              >
                <Award className="w-4 h-4" />
                <span>Verifikasi Resmi (Terbitkan Lencana Emas)</span>
              </button>

              <div className="grid grid-cols-2 gap-3 pt-2">
                {/* ACTION 2: MINTA REVISI */}
                <button
                  type="button"
                  onClick={() => {
                    setRevisionNotes("");
                    setRevisionModalOpen(true);
                  }}
                  className="py-2.5 px-3 rounded-xl bg-[#161922] hover:bg-amber-950/40 border border-[#262B38] hover:border-amber-700 text-amber-400 text-xs font-heading font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Minta Revisi</span>
                </button>

                {/* ACTION 3: TOLAK PENGAJUAN */}
                <button
                  type="button"
                  onClick={() => {
                    setRejectReason("");
                    setRejectModalOpen(true);
                  }}
                  className="py-2.5 px-3 rounded-xl bg-[#161922] hover:bg-red-950/40 border border-[#262B38] hover:border-red-700 text-red-400 text-xs font-heading font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Tolak Berkas</span>
                </button>
              </div>

              {/* ACTION 4: TANGGUHKAN / SUSPENSI (FOR ALREADY VERIFIED PROFILES) */}
              <div className="pt-3 border-t border-[#262B38]">
                <button
                  type="button"
                  onClick={() => {
                    setSuspendReason("");
                    setSuspendModalOpen(true);
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-red-950/30 hover:bg-red-950/60 border border-red-800/50 text-red-400 hover:text-red-300 text-xs font-heading font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                >
                  <AlertOctagon className="w-4 h-4" />
                  <span>Tangguhkan / Cabut Verifikasi (Komdis ESI)</span>
                </button>
                <p className="text-[10px] text-gray-500 text-center mt-1.5">
                  Digunakan jika ditemukan pelanggaran kode etik, joki turnamen, atau manipulasi data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL 1: PREVIEW DOKUMEN */}
      {previewDocUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#12151C] border border-[#262B38] rounded-2xl max-w-2xl w-full p-4 flex flex-col gap-3 relative shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#262B38]">
              <span className="text-xs font-heading font-bold uppercase text-white">
                Pratinjau Dokumen Berkas
              </span>
              <button
                type="button"
                onClick={() => setPreviewDocUrl(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-auto flex items-center justify-center bg-black/50 rounded-xl p-2">
              <img
                src={previewDocUrl}
                alt="Dokumen Bukti"
                className="max-h-[65vh] object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: KONFIRMASI VERIFIKASI RESMI EMAS */}
      {goldVerifyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#161309] border border-[#D4AF37] rounded-2xl max-w-lg w-full p-6 flex flex-col gap-5 shadow-2xl relative">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37]">
                <Award className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-heading font-black text-lg uppercase text-[#D4AF37]">
                  Pengesahan Lencana Emas ESI Sumbar
                </h3>
                <p className="text-xs text-gray-400">
                  Surat Keputusan Pengprov ESI Sumatera Barat
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-black/50 border border-[#D4AF37]/30 text-xs text-gray-300 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Penerima Lencana:</span>
                <strong className="text-white font-heading text-sm">{item.ign} ({item.name})</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Nomor Registrasi ESI Sumbar:</span>
                <span className="font-mono text-[#D4AF37] font-bold">{officialBadgeNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Masa Berlaku Lencana:</span>
                <span className="text-[#22C55E] font-mono font-bold">12 Bulan (Maret 2026 s/d Maret 2027)</span>
              </div>
            </div>

            <p className="text-[11px] text-[#9AA3B2] leading-relaxed">
              Dengan mengonfirmasi, kartu digital pemohon akan seketika diupgrade ke status <strong>Verified</strong> (Lencana Emas), diterbitkan sertifikat digital keolahragaan, dan dicatat pada buku induk keanggotaan atlet ESI Sumbar.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#262B38]">
              <button
                type="button"
                onClick={() => setGoldVerifyModalOpen(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-heading text-gray-400 hover:text-white"
              >
                Batalkan
              </button>
              <button
                type="button"
                onClick={handleGrantGoldVerification}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E5C358] text-black text-xs font-heading font-black uppercase tracking-wider hover:brightness-110 shadow-lg"
              >
                Sahkan Verifikasi Emas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: MINTA REVISI PROVINSI */}
      {revisionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#12151C] border border-amber-600/50 rounded-2xl max-w-md w-full p-6 flex flex-col gap-4 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setRevisionModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base uppercase text-white">
                  Minta Revisi Berkas (Provinsi)
                </h3>
                <p className="text-xs text-[#9AA3B2]">
                  Instruksi pembaruan bukti untuk {item.ign}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-heading text-gray-300">
                Alasan Revisi Wajib Diisi:
              </label>
              <textarea
                rows={3}
                required
                value={revisionNotes}
                onChange={(e) => setRevisionNotes(e.target.value)}
                placeholder="Jelaskan alasan mengapa berkas perlu diperbaiki..."
                className="w-full bg-[#0B0D12] border border-[#262B38] focus:border-amber-500 rounded-xl p-3 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#262B38]">
              <button
                type="button"
                onClick={() => setRevisionModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-heading text-gray-400 hover:text-white"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={!revisionNotes.trim()}
                onClick={handleSendRevision}
                className="px-5 py-2.5 rounded-xl bg-amber-500 text-black text-xs font-heading font-bold uppercase hover:brightness-110 disabled:opacity-40"
              >
                Kirim Revisi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: TOLAK BERKAS PROVINSI */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#151114] border border-red-700/60 rounded-2xl max-w-md w-full p-6 flex flex-col gap-4 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setRejectModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-red-950 text-red-400 border border-red-700">
                <XCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base uppercase text-red-400">
                  Tolak Berkas Pengajuan
                </h3>
                <p className="text-xs text-gray-400">Keputusan Final Pengprov Sumbar</p>
              </div>
            </div>

            <p className="text-xs text-gray-300">
              Apakah Anda yakin ingin menolak pengajuan <strong>{item.ign}</strong>? Masukkan alasan resmi penolakan:
            </p>

            <textarea
              rows={3}
              required
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Masukkan alasan penolakan..."
              className="w-full bg-[#0B0D12] border border-red-900/60 focus:border-red-500 rounded-xl p-3 text-xs text-white focus:outline-none"
            />

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#262B38]">
              <button
                type="button"
                onClick={() => setRejectModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-heading text-gray-400 hover:text-white"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={!rejectReason.trim()}
                onClick={handleReject}
                className="px-5 py-2.5 rounded-xl bg-red-600 text-white text-xs font-heading font-bold uppercase hover:bg-red-700 disabled:opacity-40"
              >
                Konfirmasi Penolakan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: TANGGUHKAN / SUSPENSI VERIFIKASI */}
      {suspendModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#181113] border border-red-600 rounded-2xl max-w-md w-full p-6 flex flex-col gap-4 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setSuspendModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-red-950 border border-red-600 text-red-400">
                <AlertOctagon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base uppercase text-red-400">
                  Sanksi Disiplin: Penangguhan Lencana
                </h3>
                <p className="text-xs text-gray-400">Komisi Disiplin ESI Sumatera Barat</p>
              </div>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              Tindakan ini akan mencabut lencana emas <strong>{item.ign}</strong> dan menandai profil dengan status <strong>Suspended</strong>. Profil atlet tidak dapat didaftarkan pada turnamen resmi di seluruh Sumatera Barat.
            </p>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-heading text-red-300">
                Alasan Penangguhan Resmi (Wajib):
              </label>
              <textarea
                rows={3}
                required
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                placeholder="Contoh: Terbukti melakukan kecurangan (joki/cheat) pada turnamen resmi ESI Sumbar..."
                className="w-full bg-[#0B0D12] border border-red-900 focus:border-red-500 rounded-xl p-3 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#262B38]">
              <button
                type="button"
                onClick={() => setSuspendModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-heading text-gray-400 hover:text-white"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={!suspendReason.trim()}
                onClick={handleSuspend}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-heading font-extrabold uppercase tracking-wider disabled:opacity-40 shadow-lg shadow-red-950"
              >
                Eksekusi Penangguhan
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
