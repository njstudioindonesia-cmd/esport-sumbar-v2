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
  Clock,
  Filter,
} from "lucide-react";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { Footer } from "@/components/layout/Footer";

export interface ReportItem {
  id: string;
  reporterId: string;
  targetId: string;
  targetType: "profile" | "team" | "content";
  category: string;
  reason: string;
  status: "pending" | "resolved" | "dismissed";
  createdAt: string;
  targetName?: string;
}

export default function AdminReportsPage() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const loadReports = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/reports");
      if (res.ok) {
        const json = await res.json();
        if (json.reports && Array.isArray(json.reports)) {
          setReports(json.reports);
        } else {
          // Sample fallback
          setReports([
            {
              id: "rep-101",
              reporterId: "user-1",
              targetId: "prof-99",
              targetType: "profile",
              category: "fake_identity",
              reason: "Profil menggunakan nama dan identitas turnamen yang bukan miliknya.",
              status: "pending",
              createdAt: new Date().toISOString(),
              targetName: "Padang Pride Shadow",
            },
          ]);
        }
      }
    } catch (err) {
      console.warn("Gagal memuat daftar laporan:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const handleResolve = async (action: "resolve" | "dismiss") => {
    if (!selectedReport) return;
    try {
      const res = await fetch("/api/admin/reports", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportId: selectedReport.id,
          action,
          notes: resolutionNotes,
        }),
      });

      if (res.ok) {
        setToastMessage(`Laporan berhasil di-${action === "resolve" ? "selesaikan" : "abaikan"}.`);
        setSelectedReport(null);
        setResolutionNotes("");
        loadReports();
      }
    } catch (err) {
      console.error("Gagal memperbarui status laporan:", err);
    }
  };

  const filtered = reports.filter((r) => {
    if (filterStatus === "all") return true;
    return r.status === filterStatus;
  });

  return (
    <div className="min-h-screen bg-[#07080C] text-slate-100 flex flex-col font-sans">
      <AdminNavbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
              <ShieldAlert className="w-6 h-6 text-pink-500" />
              Antrean Laporan & Moderasi Konten
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Pusat tinjauan laporan integritas, pelanggaran kebijakan konten, dan sengketa profil.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                filterStatus === "all" ? "bg-pink-600 text-white" : "bg-slate-800 text-slate-400"
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setFilterStatus("pending")}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                filterStatus === "pending" ? "bg-amber-600 text-white" : "bg-slate-800 text-slate-400"
              }`}
            >
              Menunggu Tinjauan
            </button>
            <button
              onClick={() => setFilterStatus("resolved")}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                filterStatus === "resolved" ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-400"
              }`}
            >
              Selesai
            </button>
          </div>
        </div>

        {toastMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
            {toastMessage}
          </div>
        )}

        {isLoading ? (
          <div className="p-12 text-center text-slate-400">
            <Clock className="w-8 h-8 animate-spin mx-auto mb-3 text-pink-500" />
            <p>Memuat laporan...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/50 rounded-2xl border border-white/10 text-slate-400">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-white">Tidak ada laporan dalam status ini.</p>
            <p className="text-xs text-slate-500 mt-1">Semua konten dan profil berada dalam kondisi baik.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="p-5 bg-slate-900/60 rounded-2xl border border-white/10 hover:border-white/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        item.status === "pending"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : item.status === "resolved"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {item.status}
                    </span>
                    <span className="text-xs text-pink-400 font-mono font-medium capitalize">
                      {item.category.replace("_", " ")}
                    </span>
                    <span className="text-slate-500 text-xs">·</span>
                    <span className="text-xs text-slate-400">
                      Target: {item.targetName || item.targetId} ({item.targetType})
                    </span>
                  </div>
                  <p className="text-sm text-slate-200">{item.reason}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setSelectedReport(item)}
                    className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-200 transition-colors"
                  >
                    Tinjau Laporan
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Tinjau */}
        {selectedReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-lg w-full p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Flag className="w-4 h-4 text-pink-500" /> Tinjauan Laporan #{selectedReport.id}
                </h3>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-500 block">Kategori</span>
                  <span className="text-white font-medium capitalize">{selectedReport.category.replace("_", " ")}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Keterangan Pelapor</span>
                  <p className="text-slate-300 mt-0.5 p-3 rounded-lg bg-slate-800/60 border border-white/5">
                    {selectedReport.reason}
                  </p>
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Catatan Resolusi Admin</label>
                  <textarea
                    rows={3}
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    placeholder="Tuliskan tindakan yang diambil..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  onClick={() => handleResolve("dismiss")}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors"
                >
                  Abaikan Laporan
                </button>
                <button
                  onClick={() => handleResolve("resolve")}
                  className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-xs font-medium text-white transition-colors"
                >
                  Tandai Selesai
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
