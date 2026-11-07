"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  History,
  Lock,
  Download,
  Search,
  Filter,
  CheckCircle2,
  ChevronRight,
  Shield,
  X,
  MapPin,
  Calendar,
} from "lucide-react";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { Footer } from "@/components/layout/Footer";
import { QuietSurface } from "@/components/glass/QuietSurface";
import { REGIONS_DETAIL } from "@/data/regions";
import { ActivityLogItem } from "@/data/mockAdminData";

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<ActivityLogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRegion, setFilterRegion] = useState("all");
  const [isExporting, setIsExporting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadLogs() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/admin/audit-logs?limit=200");
        if (res.ok) {
          const json = await res.json();
          if (json.logs && Array.isArray(json.logs)) {
            setLogs(json.logs);
          }
        }
      } catch (err) {
        console.warn("Failed to load audit logs:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadLogs();
  }, []);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        log.actorName.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.targetName.toLowerCase().includes(q) ||
        (log.reason && log.reason.toLowerCase().includes(q)) ||
        (log.logHash && log.logHash.toLowerCase().includes(q));

      const matchesRegion = filterRegion === "all" || log.regionCode === filterRegion;

      return matchesSearch && matchesRegion;
    });
  }, [logs, searchQuery, filterRegion]);

  const handleExportCSV = () => {
    setIsExporting(true);
    try {
      const headers = ["Timestamp", "Aktor", "Peran", "Aksi", "Target", "Wilayah", "Alasan", "Hash"];
      const rows = filteredLogs.map((l) => [
        `"${l.timestamp}"`,
        `"${l.actorName}"`,
        `"${l.actorRole}"`,
        `"${l.action}"`,
        `"${l.targetName}"`,
        `"${l.regionCode}"`,
        `"${l.reason || "-"}"`,
        `"${l.logHash}"`,
      ]);

      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `audit-log-esportsumbar-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setToastMessage("Audit log berhasil diekspor ke CSV.");
      setTimeout(() => setToastMessage(null), 3000);
    } catch {
      setToastMessage("Gagal mengekspor log.");
    } finally {
      setIsExporting(false);
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

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-heading font-black uppercase text-white tracking-tight flex items-center gap-2.5">
                <History className="w-7 h-7 text-purple-400" />
                <span>Audit Log Append-Only</span>
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-xs font-mono font-bold text-purple-300">
                {filteredLogs.length} Catatan
              </span>
            </div>
            <p className="text-xs sm:text-sm text-white/60 mt-1 max-w-2xl leading-relaxed">
              Arsip kekal transaksi administratif, telaah verifikasi, dan pembaruan data sistem yang tidak dapat diubah maupun dihapus (Append-Only).
            </p>
          </div>

          <button
            type="button"
            onClick={handleExportCSV}
            disabled={isExporting || filteredLogs.length === 0}
            className="px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/15 border border-white/10 text-xs font-mono text-white flex items-center gap-2 shrink-0 transition-colors"
          >
            <Download className="w-4 h-4 text-purple-400" />
            <span>Ekspor CSV</span>
          </button>
        </div>

        {/* SEARCH & FILTERS */}
        <QuietSurface radius="2xl" elevation="raised" className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari aktor, aksi, target, atau hash..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#FF1752]/60"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value)}
              aria-label="Filter Wilayah Log"
              className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white/80 focus:outline-none"
            >
              <option value="all">Semua Wilayah</option>
              {REGIONS_DETAIL.map((r) => (
                <option key={r.code} value={r.code}>
                  {r.name} ({r.code})
                </option>
              ))}
            </select>
          </div>
        </QuietSurface>

        {/* LOGS TABLE */}
        <QuietSurface radius="2xl" elevation="raised" className="overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-white/40 text-xs font-mono animate-pulse">
              Memuat arsip log dari basis data...
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="p-12 text-center text-white/40 text-xs">
              Tidak ada catatan log audit yang sesuai kriteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02] text-white/40 font-mono uppercase text-[10px] tracking-wider">
                    <th className="py-3.5 px-4">Waktu</th>
                    <th className="py-3.5 px-4">Aktor</th>
                    <th className="py-3.5 px-4">Aksi</th>
                    <th className="py-3.5 px-4">Target Entitas</th>
                    <th className="py-3.5 px-4">Alasan &amp; Keterangan</th>
                    <th className="py-3.5 px-4">Hash Verifikasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06] font-mono text-[11px]">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4 whitespace-nowrap text-white/50">
                        {log.timestamp}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-bold text-white">{log.actorName}</span>
                        <span className="text-[10px] text-white/40 block">
                          {log.actorRole}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-[#FF4D77] font-bold">
                        {log.action}
                      </td>
                      <td className="py-3.5 px-4 text-white">
                        {log.targetName}
                      </td>
                      <td className="py-3.5 px-4 text-white/70 max-w-xs truncate">
                        {log.reason || "-"}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-white/40 text-[10px]">
                        {log.logHash}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </QuietSurface>
      </main>

      <Footer />
    </div>
  );
}
