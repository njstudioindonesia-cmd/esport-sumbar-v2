"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Inbox,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Clock,
  Eye,
  Lock,
  ChevronRight,
  ExternalLink,
  ArrowLeft,
  X,
  Send,
  Sparkles,
  User,
  MapPin,
  Gamepad2,
  Phone,
  ZoomIn,
} from "lucide-react";
import { AdminRegionNavbar } from "@/components/admin/AdminRegionNavbar";
import { Footer } from "@/components/layout/Footer";
import { EsportCard } from "@/components/card/EsportCard";
import { MOCK_REGIONAL_QUEUE, VerificationQueueItem } from "@/data/mockAdminData";
import { GALLERY_CARDS } from "@/data/mockCards";
import { transitionVerificationAction } from "@/app/actions/verification";

interface Props {
  reviewId: string;
}

export default function AdminRegionReviewClient({ reviewId }: Props) {
  const router = useRouter();

  // Find target item from mock queue
  const item = MOCK_REGIONAL_QUEUE.find((q) => q.id === reviewId) || MOCK_REGIONAL_QUEUE[0];

  // Multi-region RLS check: this admin is ESI Kota Padang (PDG)
  const isAuthorized = item.regionCode === "PDG";

  // Checklist state
  const [checklist, setChecklist] = useState({
    identityVerified: false,
    domicileVerified: false,
    gameProofVerified: false,
  });

  // Modal states
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [revisionModalOpen, setRevisionModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [previewDocUrl, setPreviewDocUrl] = useState<string | null>(null);

  // Form states for revision / rejection
  const [revisionFields, setRevisionFields] = useState<string[]>([]);
  const [revisionNotes, setRevisionNotes] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const allChecklistCompleted =
    checklist.identityVerified && checklist.domicileVerified && checklist.gameProofVerified;

  // Base card representation for 3D card preview
  const cardData = GALLERY_CARDS[1]; // Sutan Aim

  // RLS Unauthorized Screen
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#0B0D12] text-white flex flex-col font-sans">
        <AdminRegionNavbar />
        <main className="flex-1 max-w-3xl mx-auto px-4 py-16 flex flex-col items-center text-center">
          <div className="p-4 rounded-2xl bg-red-950/40 border border-red-800 text-red-400 mb-4">
            <Lock className="w-12 h-12" />
          </div>
          <h1 className="text-2xl font-heading font-black uppercase text-red-400">
            Akses Dibatasi: Multi-Wilayah RLS
          </h1>
          <p className="text-sm text-gray-400 mt-2 max-w-md leading-relaxed">
            Anda terdaftar sebagai Pengurus Cabang ESI Kota Padang. Anda tidak memiliki otoritas yurisdiksi untuk meninjau data pengajuan dari wilayah <strong>{item.regionName}</strong> ({item.regionCode}).
          </p>
          <Link
            href="/admin/region/queue"
            className="mt-6 px-5 py-2.5 rounded-xl bg-[#1A1E28] hover:bg-[#262B38] text-xs font-heading font-bold text-white uppercase"
          >
            ← Kembali ke Antrean Kota Padang
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const handleApprove = async () => {
    await transitionVerificationAction({
      requestId: item.id,
      newStatus: "regional_checked",
      reason: "Berkas dan bukti verifikasi regional lengkap dan tervalidasi oleh Admin ESI Daerah.",
      notes: "Lolos telaah daerah (Regional Checked). Berkas dilanjutkan ke Pengprov ESI Sumbar.",
    });
    setActionSuccessMessage(
      `Pengajuan ${item.ign} berhasil disetujui (Lolos Tahap Daerah). Status diperbarui menjadi "Regional Checked" dan berkas diteruskan ke ESI Provinsi.`
    );
    setApproveModalOpen(false);
    setTimeout(() => {
      router.push("/admin/region/queue");
    }, 2500);
  };

  const handleSendRevision = async () => {
    if (!revisionNotes) return;
    await transitionVerificationAction({
      requestId: item.id,
      newStatus: "revision_requested",
      reason: revisionNotes,
      notes: revisionNotes,
      revisionFields: revisionFields,
    });
    setActionSuccessMessage(
      `Permintaan revisi telah dikirimkan ke pemohon ${item.ign}. Status diubah ke "Perlu Revisi".`
    );
    setRevisionModalOpen(false);
    setTimeout(() => {
      router.push("/admin/region/queue");
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
      `Pengajuan ${item.ign} telah ditolak secara resmi. Alasan dicatat pada audit log append-only.`
    );
    setRejectModalOpen(false);
    setTimeout(() => {
      router.push("/admin/region/queue");
    }, 2500);
  };

  const quickRevisionTemplates = [
    "Tangkapan layar akun game terpotong pada nomor ID akun. Mohon unggah ulang gambar penuh.",
    "Foto kartu identitas/pelajar buram atau tidak terbaca dengan jelas.",
    "Surat rekomendasi klub belum dibubuhi tanda tangan basah / stempel resmi.",
    "Perbedaan ejaan antara nama di formulir pendaftaran dan kartu tanda mahasiswa.",
  ];

  return (
    <div className="min-h-screen bg-[#0B0D12] text-[#F3F4F6] flex flex-col font-sans">
      <AdminRegionNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        {/* ACTION SUCCESS BANNER */}
        {actionSuccessMessage && (
          <div className="mb-6 p-4 rounded-xl bg-[#22C55E]/20 border border-[#22C55E]/40 text-[#22C55E] text-xs font-heading font-bold flex items-center gap-3 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{actionSuccessMessage}</span>
          </div>
        )}

        {/* BREADCRUMB */}
        <div className="flex flex-col gap-2 mb-6">
          <nav className="flex items-center gap-2 text-xs text-[#9AA3B2] font-mono mb-1">
            <Link href="/admin/region" className="hover:text-white transition-colors">
              Admin Daerah
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/admin/region/queue" className="hover:text-white transition-colors">
              Antrean
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#D4AF37] font-bold">Peninjauan: {item.ign}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#262B38] pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[10px] font-mono text-[#D4AF37] font-bold">
                  ID: {item.id}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    item.slaStatus === "critical"
                      ? "bg-red-950 text-red-400 border border-red-800"
                      : item.slaStatus === "warning"
                      ? "bg-amber-950 text-amber-400 border border-amber-800"
                      : "bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30"
                  }`}
                >
                  Menunggu {item.daysWaiting} Hari ({item.slaStatus.toUpperCase()})
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-black uppercase text-white tracking-tight">
                Peninjauan Berkas Verifikasi: {item.ign}
              </h1>
            </div>

            <Link
              href="/admin/region/queue"
              className="self-start md:self-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-[#161922] hover:bg-[#1A1E28] border border-[#262B38] text-xs font-heading font-bold text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Antrean</span>
            </Link>
          </div>
        </div>

        {/* REVIEW ASSIGNMENT WARNING (IF ASSIGNED TO ANOTHER ADMIN) */}
        {item.assignedTo && item.assignedTo !== "Admin Pengcab Padang #01 (Saya)" && (
          <div className="mb-6 p-4 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-300 text-xs flex items-center gap-3">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>
              <strong>Perhatian Rekan Kerja:</strong> Berkas pengajuan ini sedang ditugaskan kepada <em>{item.assignedTo}</em>. Perubahan status akan dicatat atas nama Anda.
            </span>
          </div>
        )}

        {/* 3-PANEL REVIEW GRID (Prompt 10 Specification) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* PANEL KIRI (4 COLS): DATA PROFIL & PRATINJAU KARTU */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* 1. DATA LENGKAP PROFIL */}
            <div className="p-5 rounded-2xl bg-[#12151C] border border-[#262B38] shadow-md flex flex-col gap-3">
              <div className="flex items-center justify-between pb-3 border-b border-[#262B38]">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#D4AF37]" />
                  <h3 className="font-heading font-bold text-xs uppercase text-white tracking-wide">
                    Identitas Pemohon
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-[#D4AF37] font-bold">
                  {item.esportId}
                </span>
              </div>

              <div className="flex flex-col gap-2.5 text-xs">
                <div>
                  <span className="text-gray-400 text-[10px] font-mono block">In-Game Name (IGN):</span>
                  <strong className="text-white font-heading text-sm text-[#D4AF37]">@{item.ign}</strong>
                </div>

                <div>
                  <span className="text-gray-400 text-[10px] font-mono block">Nama Lengkap:</span>
                  <strong className="text-white font-medium">{item.name}</strong>
                </div>

                <div>
                  <span className="text-gray-400 text-[10px] font-mono block">Game &amp; Posisi:</span>
                  <strong className="text-white">{item.game} • {item.role}</strong>
                </div>

                <div>
                  <span className="text-gray-400 text-[10px] font-mono block">Domisili Pengcab:</span>
                  <strong className="text-white flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#D4AF37]" />
                    {item.regionName} ({item.regionCode})
                  </strong>
                </div>

                <div className="pt-2 border-t border-[#262B38]">
                  <span className="text-gray-400 text-[10px] font-mono block">Nomor Kontak:</span>
                  <span className="font-mono text-xs text-gray-200">
                    +62 812-7629-**** (Terenkripsi)
                  </span>
                </div>
              </div>
            </div>

            {/* 2. CARD SIMULATION PREVIEW */}
            <div className="p-5 rounded-2xl bg-[#12151C] border border-[#262B38] shadow-md flex flex-col items-center gap-3">
              <div className="w-full flex items-center justify-between pb-2 border-b border-[#262B38]">
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/50">
                  Pratinjau Kartu
                </span>
                <span className="text-[9px] font-mono text-[#22C55E] font-bold px-1.5 py-0.2 rounded bg-[#22C55E]/10">
                  REGIONAL CHECKED
                </span>
              </div>

              <EsportCard
                type={cardData.type}
                rarity={cardData.rarity}
                verification="regional"
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
            </div>
          </div>

          {/* PANEL TENGAH (5 COLS): DOKUMEN BUKTI & CHECKLIST VERIFIKASI */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* 1. DOCUMENTS PANEL */}
            <div className="p-5 rounded-2xl bg-[#12151C] border border-[#262B38] shadow-md flex flex-col gap-3">
              <div className="flex items-center justify-between pb-3 border-b border-[#262B38]">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#4C7DFF]" />
                  <h3 className="font-heading font-bold text-xs uppercase text-white tracking-wide">
                    Galeri Bukti ({item.documents.length})
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-[#4C7DFF]" />
                  Link 15 Menit
                </span>
              </div>

              <div className="flex flex-col gap-2.5">
                {item.documents.map((doc, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#161922] border border-[#262B38] flex items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="p-2 rounded-lg bg-[#1A1E28] border border-[#262B38] text-[#D4AF37] shrink-0">
                        <FileText className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-xs text-white">
                          {doc.title}
                        </h4>
                        <span className="text-[9px] text-gray-400 font-mono">
                          {doc.fileSize} • {doc.submittedAt}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setPreviewDocUrl(doc.url)}
                      className="px-2.5 py-1 rounded-lg bg-[#1A1E28] hover:bg-[#262B38] text-[11px] font-mono font-bold text-[#D4AF37] hover:text-white uppercase flex items-center gap-1 transition-colors shrink-0"
                    >
                      <ZoomIn className="w-3 h-3" />
                      <span>Lihat</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. VERIFICATION CHECKLIST (MANDATORY GATEWAY) */}
            <div className="p-5 rounded-2xl bg-[#12151C] border border-[#262B38] shadow-md flex flex-col gap-3">
              <div className="flex items-center justify-between pb-3 border-b border-[#262B38]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
                  <h3 className="font-heading font-bold text-xs uppercase text-white tracking-wide">
                    Checklist Verifikasi Daerah
                  </h3>
                </div>
                <span
                  className={`text-[10px] font-mono font-bold ${
                    allChecklistCompleted ? "text-[#22C55E]" : "text-amber-400"
                  }`}
                >
                  {allChecklistCompleted ? "3/3 Terpenuhi" : "Lengkapi 3/3"}
                </span>
              </div>

              <div className="flex flex-col gap-2.5">
                <label className="p-3 rounded-xl bg-[#161922] border border-[#262B38] flex items-start gap-3 cursor-pointer hover:border-[#3B4254] transition-colors">
                  <input
                    type="checkbox"
                    checked={checklist.identityVerified}
                    onChange={(e) =>
                      setChecklist({ ...checklist, identityVerified: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-[#22C55E] focus:ring-[#22C55E] accent-[#22C55E] mt-0.5 shrink-0"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs text-white font-heading font-bold uppercase">
                      1. Identitas &amp; Foto Sesuai
                    </span>
                    <span className="text-[11px] text-[#9AA3B2]">
                      Nama asli, wajah, dan usia sesuai bukti identitas.
                    </span>
                  </div>
                </label>

                <label className="p-3 rounded-xl bg-[#161922] border border-[#262B38] flex items-start gap-3 cursor-pointer hover:border-[#3B4254] transition-colors">
                  <input
                    type="checkbox"
                    checked={checklist.domicileVerified}
                    onChange={(e) =>
                      setChecklist({ ...checklist, domicileVerified: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-[#22C55E] focus:ring-[#22C55E] accent-[#22C55E] mt-0.5 shrink-0"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs text-white font-heading font-bold uppercase">
                      2. Terbukti Domisili {item.regionName}
                    </span>
                    <span className="text-[11px] text-[#9AA3B2]">
                      Instansi sekolah/kampus/klub berkedudukan di wilayah ini.
                    </span>
                  </div>
                </label>

                <label className="p-3 rounded-xl bg-[#161922] border border-[#262B38] flex items-start gap-3 cursor-pointer hover:border-[#3B4254] transition-colors">
                  <input
                    type="checkbox"
                    checked={checklist.gameProofVerified}
                    onChange={(e) =>
                      setChecklist({ ...checklist, gameProofVerified: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-[#22C55E] focus:ring-[#22C55E] accent-[#22C55E] mt-0.5 shrink-0"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs text-white font-heading font-bold uppercase">
                      3. Bukti Akun Game Valid
                    </span>
                    <span className="text-[11px] text-[#9AA3B2]">
                      Tangkapan layar akun game jelas menampilkan ID akun dan IGN.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* PANEL KANAN LENGKET (3 COLS): PANEL AKSI SETUJUI, REVISI, TOLAK */}
          <div className="lg:col-span-3 sticky top-20 flex flex-col gap-4">
            <div className="p-5 rounded-2xl bg-[#12151C] border border-[#262B38] shadow-2xl flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#262B38]">
                <span className="text-xs font-heading font-bold text-gray-300 uppercase tracking-wider">
                  Panel Aksi Cepat
                </span>
                <span className="text-[10px] font-mono text-[#D4AF37]">TAHAP 1</span>
              </div>

              {/* Status Menunggu */}
              <div className="p-3 rounded-xl bg-[#161922] border border-[#262B38] text-xs font-mono flex items-center justify-between">
                <span className="text-gray-400">Menunggu:</span>
                <span className="text-white font-bold">{item.daysWaiting} Hari</span>
              </div>

              {/* APPROVE (SETUJUI - UTAMA) */}
              <button
                type="button"
                disabled={!allChecklistCompleted}
                onClick={() => setApproveModalOpen(true)}
                className="w-full py-3 px-4 rounded-xl bg-[#22C55E] hover:bg-[#1ea34d] disabled:opacity-40 disabled:cursor-not-allowed text-black text-xs font-heading font-black uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Setujui Berkas</span>
              </button>

              {/* REVISI */}
              <button
                type="button"
                onClick={() => {
                  setRevisionFields([]);
                  setRevisionNotes("");
                  setRevisionModalOpen(true);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-[#1A1E28] hover:bg-amber-950/40 border border-[#262B38] hover:border-amber-700 text-amber-400 text-xs font-heading font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Minta Revisi</span>
              </button>

              {/* TOLAK */}
              <button
                type="button"
                onClick={() => {
                  setRejectReason("");
                  setRejectModalOpen(true);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-[#1A1E28] hover:bg-red-950/40 border border-[#262B38] hover:border-red-700 text-red-400 text-xs font-heading font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                <span>Tolak</span>
              </button>

              {!allChecklistCompleted && (
                <span className="text-[10px] font-mono text-amber-400/90 text-center leading-tight">
                  * Centang ketiga checklist di tengah untuk membuka tombol Setujui.
                </span>
              )}
            </div>

            {/* Hint Pintasan Keyboard */}
            <div className="p-3 rounded-xl bg-[#0F1118] border border-white/[0.06] text-[10px] font-mono text-white/40 flex flex-col gap-1">
              <span className="text-white/60 font-bold">Pintasan Keyboard:</span>
              <div className="flex items-center justify-between">
                <span>Setujui Cepat:</span>
                <kbd className="px-1.5 py-0.2 bg-white/10 rounded text-[#22C55E]">A</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span>Buka Revisi:</span>
                <kbd className="px-1.5 py-0.2 bg-white/10 rounded text-amber-400">R</kbd>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL 1: ZOOM DOKUMEN BUKTI */}
      {previewDocUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#12151C] border border-[#262B38] rounded-2xl max-w-2xl w-full p-4 flex flex-col gap-3 relative shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#262B38]">
              <span className="text-xs font-heading font-bold uppercase text-white">
                Pratinjau Aman Dokumen Bukti
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
                alt="Bukti Dokumen"
                className="max-h-[65vh] object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: KONFIRMASI LOLOS DAERAH */}
      {approveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#12151C] border border-[#22C55E]/50 rounded-2xl max-w-md w-full p-6 flex flex-col gap-4 shadow-2xl relative">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-[#22C55E]/20 text-[#22C55E]">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base uppercase text-white">
                  Konfirmasi Lolos Tahap Daerah
                </h3>
                <p className="text-xs text-gray-400">Pengcab ESI Kota Padang</p>
              </div>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              Anda akan memberikan status <strong>Regional Checked</strong> kepada atlet <strong>{item.ign}</strong> ({item.name}). Berkas akan diteruskan ke Pengprov ESI Sumatera Barat untuk pengesahan verifikasi lencana resmi.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#262B38]">
              <button
                type="button"
                onClick={() => setApproveModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-heading text-gray-400 hover:text-white"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleApprove}
                className="px-5 py-2.5 rounded-xl bg-[#22C55E] text-black text-xs font-heading font-extrabold uppercase tracking-wider hover:brightness-110"
              >
                Ya, Konfirmasi Lolos Daerah
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: MINTA REVISI */}
      {revisionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#12151C] border border-amber-600/50 rounded-2xl max-w-lg w-full p-6 flex flex-col gap-4 shadow-2xl relative">
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
                  Minta Revisi Berkas Pemohon
                </h3>
                <p className="text-xs text-[#9AA3B2]">
                  Instruksikan perbaikan bukti kepada {item.ign}
                </p>
              </div>
            </div>

            {/* Quick Templates */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-heading font-bold uppercase text-gray-300">
                Pilih Templat Alasan Cepat:
              </label>
              <div className="flex flex-col gap-1.5">
                {quickRevisionTemplates.map((tmpl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setRevisionNotes(tmpl)}
                    className="p-2 text-left rounded-lg bg-[#161922] hover:bg-[#1A1E28] border border-[#262B38] text-[11px] text-gray-300 hover:text-white transition-colors"
                  >
                    • {tmpl}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Notes Textarea */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-heading font-bold uppercase text-gray-300">
                Catatan Revisi untuk Atlet (Wajib Diisi):
              </label>
              <textarea
                rows={3}
                required
                value={revisionNotes}
                onChange={(e) => setRevisionNotes(e.target.value)}
                placeholder="Jelaskan secara spesifik apa yang harus diperbaiki oleh pemohon..."
                className="w-full bg-[#0B0D12] border border-[#262B38] focus:border-amber-500 rounded-xl p-3 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#262B38]">
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
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-black text-xs font-heading font-extrabold uppercase tracking-wider"
              >
                Kirim Permintaan Revisi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: TOLAK PENGAJUAN */}
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
                  Tolak Pengajuan Verifikasi
                </h3>
                <p className="text-xs text-gray-400">Tindakan ini akan dicatat di audit log</p>
              </div>
            </div>

            <p className="text-xs text-gray-300">
              Apakah Anda yakin ingin menolak pengajuan <strong>{item.ign}</strong>? Masukkan alasan penolakan resmi:
            </p>

            <textarea
              rows={3}
              required
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Contoh: Berkas identitas terbukti palsu atau pemohon bukan berdomisili di Sumatera Barat..."
              className="w-full bg-[#0B0D12] border border-red-900/60 focus:border-red-500 rounded-xl p-3 text-xs text-white focus:outline-none"
            />

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#262B38]">
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
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white text-xs font-heading font-extrabold uppercase tracking-wider"
              >
                Konfirmasi Tolak Pengajuan
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
