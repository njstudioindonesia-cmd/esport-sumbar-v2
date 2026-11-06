"use client";

import React, { useState, useEffect, useCallback } from "react";
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
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { Footer } from "@/components/layout/Footer";
import { ProfileReportItem } from "@/data/mockAdminData";
import { createClient } from "@/lib/supabase/client";

export default function AdminModerationPage() {
  const [reports, setReports] = useState<ProfileReportItem[]>([]);
  const [selectedReport, setSelectedReport] = useState<ProfileReportItem | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadReports = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/reports");
      if (res.ok) {
        const json = await res.json();
        if (json.reports && Array.isArray(json.reports)) {
          setReports(json.reports);
        }
      }
    } catch (err) {
      console.warn("Failed to load reports:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReports();

    const supabase = createClient();
    const channel = supabase
      .channel("realtime-reports-v3")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "reports" },
        () => {
          loadReports();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadReports]);

  const handleResolveReport = async (status: "resolved" | "dismissed") => {
    if (!selectedReport) return;
    try {
      const res = await fetch("/api/admin/reports", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportId: selectedReport.id,
          status,
          resolutionNotes: resolutionNotes.trim() || undefined,
        }),
      });

      if (res.ok) {
        setToastMessage(status === "resolved" ? "Laporan berhasil ditindaklanjuti." : "Laporan ditolak / ditutup.");
        setSelectedReport(null);
        setResolutionNotes("");
        await loadReports();
        setTimeout(() => setToastMessage(null), 3000);
      }
    } catch (err: any) {
      setToastMessage(`Gagal: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-white flex flex-col font-sans">
      <AdminNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 flex flex-col gap-6">
        {toastMessage && (
          <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1A1E28] border border-[#22C55E] text-white text-xs font-heading font-medium shadow-2xl animate-in slide-in-from-top-4">
            <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
            <span>{toastMessage}</span>
          </div>
        )}

        <div className="border-b border-white/10 pb-5">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-heading font-black uppercase text-white tracking-tight flex items-center gap-2.5">
              <Flag className="w-7 h-7 text-rose-400" />
              <span>Moderasi Aduan &amp; Laporan Komunitas</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-xs font-mono font-bold text-rose-300">
              {reports.length} Laporan
            </span>
          </div>
          <p className="text-xs sm:text-sm text-white/60 mt-1 max-w-2xl leading-relaxed">
            Pusat triase aduan masyarakat mengenai dugaan kecurangan in-game, pemalsuan data profil, atau pelanggaran kode etik komunitas.
          </p>
        </div>

        {/* REPORTS LIST */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isLoading ? (
            <div className="col-span-full p-12 text-center text-white/40 text-xs font-mono animate-pulse">
              Memuat aduan komunitas...
            </div>
          ) : reports.length === 0 ? (
            <div className="col-span-full p-12 text-center text-white/40 text-xs">
              Tidak ada aduan yang belum diselesaikan.
            </div>
          ) : (
            reports.map((report) => (
              <div
                key={report.id}
                className="p-5 rounded-2xl bg-[#0B0E17] border border-white/10 flex flex-col justify-between gap-4"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 uppercase font-bold">
                      {report.reasonCategory}
                    </span>
                    <span className="text-white/40">{report.reportedAt}</span>
                  </div>

                  <h3 className="font-heading font-bold text-sm text-white">
                    Target: {report.reportedProfileName} ({report.reportedEsportId})
                  </h3>

                  <p className="text-xs text-white/70 leading-relaxed bg-black/30 p-3 rounded-xl border border-white/5">
                    &ldquo;{report.description}&rdquo;
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-white/40">
                    Pelapor: {report.reporterName}
                  </span>

                  <button
                    type="button"
                    onClick={() => setSelectedReport(report)}
                    className="px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/15 text-xs font-mono text-white transition-colors"
                  >
                    Tindak Lanjut
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* RESOLUTION MODAL */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#0A0D15] border border-white/15 rounded-3xl p-6 flex flex-col gap-4 shadow-2xl">
            <h3 className="font-heading font-bold text-base text-white">
              Tindak Lanjut Laporan: {selectedReport.reportedProfileName}
            </h3>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white/70">
              <span className="font-mono text-[10px] text-white/40 block mb-1 uppercase">Deskripsi Aduan:</span>
              {selectedReport.description}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono uppercase text-white/60">Catatan Penyelesaian</label>
              <textarea
                rows={3}
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="Tuliskan tindakan yang diambil..."
                className="p-3 rounded-xl bg-black/40 border border-white/15 text-xs text-white focus:outline-none resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 rounded-xl bg-white/[0.06] text-xs font-mono text-white/70"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => handleResolveReport("dismissed")}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono text-white"
              >
                Tolak Aduan (Bersih)
              </button>
              <button
                type="button"
                onClick={() => handleResolveReport("resolved")}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-mono font-bold text-white"
              >
                Tindak Tegas (Sanksi)
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
