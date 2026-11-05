"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Flag,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  Send,
  MessageSquare,
  ShieldAlert,
  ChevronRight,
  ExternalLink,
  X,
  User,
  MapPin,
  Lock,
} from "lucide-react";
import { AdminPlatformNavbar } from "@/components/admin/AdminPlatformNavbar";
import { Footer } from "@/components/layout/Footer";
import { ProfileReportItem } from "@/data/mockAdminData";
import { createClient } from "@/lib/supabase/client";

export default function AdminPlatformModerationPage() {
  const [reports, setReports] = useState<ProfileReportItem[]>([]);
  const [selectedReport, setSelectedReport] = useState<ProfileReportItem | null>(null);
  const [forwardReason, setForwardReason] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  React.useEffect(() => {
    // Supabase Realtime WebSocket Subscription
    const supabase = createClient();
    const channel = supabase
      .channel("realtime-platform-reports")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "reports",
        },
        () => {
          // If reports table changes, reload
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleMarkResolved = (id: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "reviewed_clean" } : r))
    );
    showToast("Laporan ditandai telah ditinjau dan dinyatakan aman (tidak ada pelanggaran).");
  };

  const handleForwardToProvince = () => {
    if (!selectedReport || !forwardReason.trim()) return;

    setReports((prev) =>
      prev.map((r) =>
        r.id === selectedReport.id ? { ...r, status: "forwarded_to_province" } : r
      )
    );

    showToast(
      `Rekomendasi penangguhan untuk ${selectedReport.reportedProfileName} berhasil diteruskan ke Komisi Disiplin ESI Provinsi.`
    );
    setSelectedReport(null);
    setForwardReason("");
  };

  return (
    <div className="min-h-screen bg-[#0B0D12] text-[#F3F4F6] flex flex-col font-sans">
      <AdminPlatformNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        {/* TOAST FEEDBACK */}
        {toastMessage && (
          <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1A1E28] border border-[#22C55E] text-white text-xs font-heading font-medium shadow-2xl animate-in slide-in-from-top-4">
            <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* BREADCRUMB */}
        <div className="flex flex-col gap-2 mb-6">
          <nav className="flex items-center gap-2 text-xs text-[#9AA3B2] font-mono mb-1">
            <Link href="/admin/platform" className="hover:text-white transition-colors">
              Operator Platform
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#3B82F6] font-bold">Moderasi Laporan Profil</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#262B38] pb-5">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-heading font-black uppercase text-white tracking-tight flex items-center gap-2.5">
                  <Flag className="w-7 h-7 text-red-500" />
                  <span>Antrean Moderasi Laporan Masyarakat</span>
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-red-950 border border-red-800 text-xs font-mono font-bold text-red-400">
                  {reports.filter((r) => r.status === "pending").length} Menunggu Triase
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#9AA3B2] mt-1 max-w-2xl leading-relaxed">
                Triase aduan publik mengenai dugaan joki turnamen, akun palsu, atau pemalsuan data identitas. Teruskan temuan pelanggaran resmi ke Pengprov ESI Sumbar untuk penjatuhan sanksi.
              </p>
            </div>
          </div>
        </div>

        {/* GOVERNANCE RULE ALERT */}
        <div className="mb-8 p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 text-xs text-amber-300 flex items-start gap-3 shadow-md">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-0.5 leading-relaxed">
            <span className="font-heading font-bold uppercase text-white">
              Batas Wewenang Eksekusi Sanksi
            </span>
            <span>
              Operator Platform TIDAK memiliki hak mencabut lencana atau menangguhkan status atlet secara langsung. Operator bertindak sebagai analis awal: memeriksa bukti, berkoordinasi dengan pengcab daerah, dan <strong>meneruskan rekomendasi penangguhan kepada Sidang Komisi Disiplin ESI Provinsi</strong>.
            </span>
          </div>
        </div>

        {/* REPORTS LIST */}
        {reports.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#12151C] border border-[#262B38] text-xs text-gray-400">
            <ShieldAlert className="w-8 h-8 text-gray-600 mx-auto mb-3" />
            <p className="font-heading font-bold text-white uppercase text-sm mb-1">
              Tidak Ada Laporan Masuk
            </p>
            <p className="text-gray-400 max-w-md mx-auto">
              Saat ini belum ada aduan publik atau indikasi pemalsuan akun yang menunggu triase operator.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {reports.map((report) => (
            <div
              key={report.id}
              className={`p-6 rounded-2xl border transition-all flex flex-col gap-4 ${
                report.status === "forwarded_to_province"
                  ? "bg-purple-950/15 border-purple-800/40"
                  : report.status === "reviewed_clean"
                  ? "bg-[#12151C] border-[#262B38] opacity-75"
                  : "bg-[#151114] border-red-900/40 shadow-xl"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#262B38]/60">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#1A1E28] text-red-400 border border-red-900/50">
                    Kategori: {report.reasonCategory.replace("_", " ").toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">• {report.reportedAt}</span>
                </div>

                {report.status === "pending" && (
                  <span className="px-2.5 py-1 rounded-full bg-red-950 text-red-400 text-[10px] font-mono font-bold border border-red-800">
                    Menunggu Triase Operator
                  </span>
                )}
                {report.status === "forwarded_to_province" && (
                  <span className="px-2.5 py-1 rounded-full bg-purple-950 text-purple-300 text-[10px] font-mono font-bold border border-purple-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-purple-400" />
                    Diteruskan ke ESI Provinsi
                  </span>
                )}
                {report.status === "reviewed_clean" && (
                  <span className="px-2.5 py-1 rounded-full bg-[#22C55E]/15 text-[#22C55E] text-[10px] font-mono font-bold border border-[#22C55E]/30">
                    Ditinjau Aman
                  </span>
                )}
              </div>

              {/* REPORT DETAILS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-gray-400 text-[11px] block">Profil yang Dilaporkan:</span>
                  <strong className="text-white font-heading text-sm uppercase">
                    {report.reportedProfileName}
                  </strong>
                  <div className="flex items-center gap-2 text-gray-400 text-[11px] mt-0.5 font-mono">
                    <span>{report.reportedEsportId}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#D4AF37]" />
                      {report.regionName}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-gray-400 text-[11px] block">Pelapor / Sumber Laporan:</span>
                  <strong className="text-gray-200">{report.reporterName}</strong>
                  <span className="text-gray-500 text-[11px] block mt-0.5">
                    Laporan masuk via formulir laporkan profil publik
                  </span>
                </div>
              </div>

              {/* DESCRIPTION & EVIDENCE */}
              <div className="p-4 rounded-xl bg-black/40 border border-[#262B38] text-xs space-y-2">
                <span className="text-gray-400 font-heading font-bold uppercase text-[10px]">
                  Keterangan Dugaan Pelanggaran:
                </span>
                <p className="text-gray-200 leading-relaxed italic">
                  &ldquo;{report.description}&rdquo;
                </p>
                {report.evidenceUrl && (
                  <div className="pt-2 flex items-center gap-2">
                    <span className="text-gray-400 text-[11px]">Tautan Bukti Gambar:</span>
                    <a
                      href={report.evidenceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#3B82F6] hover:underline flex items-center gap-1 font-mono text-[11px]"
                    >
                      <span>Buka Tangkapan Layar Pelapor</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              {/* ACTION BUTTONS (FOR PENDING STATUS) */}
              {report.status === "pending" && (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-3 border-t border-[#262B38]">
                  <button
                    type="button"
                    onClick={() => handleMarkResolved(report.id)}
                    className="px-4 py-2 rounded-xl bg-[#1A1E28] hover:bg-[#262B38] text-gray-300 hover:text-white text-xs font-heading font-bold uppercase transition-colors"
                  >
                    Tandai Laporan Tidak Terbukti (Aman)
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      showToast(`Kordinasi pengcab wilayah ${report.regionName} dibuka.`);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#1A1E28] hover:bg-blue-950/40 border border-[#262B38] text-[#3B82F6] text-xs font-heading font-bold uppercase transition-colors flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Hubungi Pengcab {report.regionCode}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedReport(report);
                      setForwardReason("");
                    }}
                    className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-heading font-extrabold uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Teruskan Rekomendasi Penangguhan ke ESI Provinsi</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        )}
      </main>

      {/* MODAL FORWARD RECOMMENDATION TO PROVINCE */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#12151C] border border-red-700/60 rounded-2xl max-w-lg w-full p-6 flex flex-col gap-4 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setSelectedReport(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-red-950 border border-red-700 text-red-400">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base uppercase text-white">
                  Rekomendasi Penangguhan ke ESI Provinsi
                </h3>
                <p className="text-xs text-gray-400">
                  Target: {selectedReport.reportedProfileName} ({selectedReport.reportedEsportId})
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              Berkas laporan ini akan diteruskan ke antrean Sidang Komisi Disiplin Pengprov ESI Sumatera Barat untuk dilakukan pencabutan atau penangguhan lencana resmi.
            </p>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-heading text-gray-300 font-bold uppercase">
                Catatan Analisis Operator untuk Sidang ESI:
              </label>
              <textarea
                rows={3}
                required
                value={forwardReason}
                onChange={(e) => setForwardReason(e.target.value)}
                placeholder="Jelaskan ringkasan temuan bukti yang ditemukan oleh tim operator..."
                className="w-full bg-[#0B0D12] border border-[#262B38] focus:border-red-500 rounded-xl p-3 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#262B38]">
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 rounded-xl text-xs font-heading text-gray-400 hover:text-white"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={!forwardReason.trim()}
                onClick={handleForwardToProvince}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white text-xs font-heading font-extrabold uppercase tracking-wider shadow-lg"
              >
                Kirim ke ESI Provinsi
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
