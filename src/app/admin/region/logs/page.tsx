"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  History,
  Shield,
  Download,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  ChevronRight,
  Lock,
  Hash,
  X,
} from "lucide-react";
import { AdminRegionNavbar } from "@/components/admin/AdminRegionNavbar";
import { Footer } from "@/components/layout/Footer";
import { MOCK_REGIONAL_LOGS, ActivityLogItem } from "@/data/mockAdminData";

export default function AdminRegionLogsPage() {
  const [logs] = useState<ActivityLogItem[]>(MOCK_REGIONAL_LOGS);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAction, setFilterAction] = useState<string>("all");
  const [isExporting, setIsExporting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        log.targetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.targetId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.reason.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesAction = filterAction === "all" || log.action === filterAction;

      return matchesSearch && matchesAction;
    });
  }, [logs, searchQuery, filterAction]);

  const handleExportCSV = () => {
    setIsExporting(true);
    setTimeout(() => {
      const headers = ["Waktu", "Pelaku", "Wilayah", "Aksi", "Target ID", "Nama Target", "Alasan", "Hash"];
      const rows = filteredLogs.map((l) => [
        `"${l.timestamp}"`,
        `"${l.actorName}"`,
        `"${l.regionCode}"`,
        `"${l.action}"`,
        `"${l.targetId}"`,
        `"${l.targetName}"`,
        `"${l.reason.replace(/"/g, '""')}"`,
        `"${l.logHash}"`,
      ]);

      const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `LOG_AUDIT_ESI_PADANG_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setIsExporting(false);
      setToastMessage("Berkas audit CSV berhasil diunduh.");
      setTimeout(() => setToastMessage(null), 3000);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#0B0D12] text-[#F3F4F6] flex flex-col font-sans">
      <AdminRegionNavbar />

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
            <Link href="/admin/region" className="hover:text-white transition-colors">
              Admin Daerah
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#D4AF37] font-bold">Log Aktivitas Append-Only</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#262B38] pb-5">
            <div>
              <h1 className="text-2xl sm:text-3xl font-heading font-black uppercase text-white tracking-tight flex items-center gap-2.5">
                <History className="w-7 h-7 text-[#D4AF37]" />
                <span>Log Aktivitas Verifikasi (Kota Padang)</span>
              </h1>
              <p className="text-xs sm:text-sm text-[#9AA3B2] mt-1 max-w-2xl leading-relaxed">
                Rekam jejak setiap keputusan verifikasi yang dilakukan oleh Pengurus Cabang ESI Kota Padang. Seluruh data tercatat dengan enkripsi waktu dan hash integritas.
              </p>
            </div>

            <button
              type="button"
              onClick={handleExportCSV}
              disabled={isExporting}
              className="self-start md:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1A1E28] hover:bg-[#262B38] border border-[#262B38] text-xs font-heading font-bold text-gray-200 hover:text-white uppercase tracking-wider transition-colors shadow-sm disabled:opacity-50"
            >
              <Download className="w-4 h-4 text-[#D4AF37]" />
              <span>{isExporting ? "Membuat CSV..." : "Ekspor Log CSV"}</span>
            </button>
          </div>
        </div>

        {/* APPEND-ONLY MANDATORY BANNER */}
        <div className="mb-6 p-4 rounded-xl bg-[#12151C] border border-[#3B82F6]/40 flex items-start gap-3 shadow-md">
          <Lock className="w-5 h-5 text-[#3B82F6] shrink-0 mt-0.5" />
          <div className="flex flex-col gap-0.5 text-xs text-[#93C5FD] leading-relaxed">
            <span className="font-heading font-bold uppercase text-white">
              Sistem Audit Append-Only (Hanya-Tambah)
            </span>
            <span>
              Sesuai dengan Master Concept Integritas Keolahragaan dan Regulasi Pelindungan Data Pribadi: Catatan log aktivitas ini bersifat permanen, hanya-tambah (append-only), dan tidak memiliki fungsi ubah maupun hapus bagi akun admin level mana pun.
            </span>
          </div>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="p-4 rounded-2xl bg-[#12151C] border border-[#262B38] mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-md">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama atlet, nomor ESPORT ID, admin petugas, atau alasan..."
              className="w-full bg-[#161922] border border-[#262B38] focus:border-[#D4AF37] rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none font-mono"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="bg-[#161922] border border-[#262B38] text-xs font-medium text-white px-3 py-2 rounded-xl focus:outline-none focus:border-[#D4AF37]"
          >
            <option value="all">Semua Tindakan</option>
            <option value="Lolos Daerah">Lolos Daerah</option>
            <option value="Minta Revisi">Minta Revisi</option>
            <option value="Tolak Pengajuan">Tolak Pengajuan</option>
          </select>
        </div>

        {/* LOGS TABLE (DESKTOP) & CARDS (MOBILE) */}
        {filteredLogs.length > 0 ? (
          <div className="bg-[#12151C] border border-[#262B38] rounded-2xl overflow-hidden shadow-xl">
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#161922] border-b border-[#262B38] text-gray-400 font-heading font-bold uppercase tracking-wider">
                    <th className="p-3.5">Waktu (WIB)</th>
                    <th className="p-3.5">Petugas Admin</th>
                    <th className="p-3.5">Tindakan Keputusan</th>
                    <th className="p-3.5">Target Pemohon</th>
                    <th className="p-3.5">Alasan / Catatan Resmi</th>
                    <th className="p-3.5">Hash Integritas</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#262B38]/70">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#161922]/70 transition-colors">
                      {/* TIMESTAMP */}
                      <td className="p-3.5 font-mono text-gray-300 whitespace-nowrap">
                        {log.timestamp}
                      </td>

                      {/* ACTOR */}
                      <td className="p-3.5">
                        <div className="flex flex-col">
                          <span className="font-heading font-bold text-white text-xs">
                            {log.actorName}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">
                            {log.actorRole}
                          </span>
                        </div>
                      </td>

                      {/* ACTION BADGE */}
                      <td className="p-3.5 whitespace-nowrap">
                        {log.action === "Lolos Daerah" && (
                          <span className="px-2.5 py-1 rounded-full bg-[#22C55E]/15 border border-[#22C55E]/30 text-[#22C55E] text-[10px] font-mono font-bold flex items-center gap-1.5 w-max">
                            <CheckCircle2 className="w-3 h-3" />
                            Lolos Daerah
                          </span>
                        )}
                        {log.action === "Minta Revisi" && (
                          <span className="px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-bold flex items-center gap-1.5 w-max">
                            <AlertTriangle className="w-3 h-3" />
                            Minta Revisi
                          </span>
                        )}
                        {log.action === "Tolak Pengajuan" && (
                          <span className="px-2.5 py-1 rounded-full bg-red-950/80 border border-red-700 text-red-400 text-[10px] font-mono font-bold flex items-center gap-1.5 w-max">
                            <XCircle className="w-3 h-3" />
                            Tolak Pengajuan
                          </span>
                        )}
                      </td>

                      {/* TARGET */}
                      <td className="p-3.5">
                        <div className="flex flex-col">
                          <span className="font-heading font-bold text-white text-xs uppercase">
                            {log.targetName}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">
                            {log.targetId} • {log.targetType}
                          </span>
                        </div>
                      </td>

                      {/* REASON */}
                      <td className="p-3.5 text-gray-300 text-xs max-w-xs leading-relaxed">
                        {log.reason}
                      </td>

                      {/* HASH */}
                      <td className="p-3.5 font-mono text-[10px] text-gray-500">
                        <span className="bg-black/40 px-2 py-0.5 rounded border border-[#262B38]" title={log.logHash}>
                          {log.logHash.slice(0, 16)}...
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE LOG CARDS */}
            <div className="md:hidden divide-y divide-[#262B38]">
              {filteredLogs.map((log) => (
                <div key={log.id} className="p-4 flex flex-col gap-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-gray-400">{log.timestamp}</span>
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-[#1A1E28] text-white">
                      {log.action}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="font-heading font-bold text-sm text-white uppercase">
                      {log.targetName}
                    </span>
                    <span className="text-[10px] text-[#9AA3B2] font-mono">{log.targetId}</span>
                  </div>

                  <p className="text-gray-300 text-[11px] leading-relaxed bg-[#161922] p-2.5 rounded-lg border border-[#262B38]">
                    {log.reason}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono pt-1">
                    <span>Petugas: {log.actorName}</span>
                    <span>{log.logHash.slice(0, 12)}...</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-12 text-center rounded-2xl bg-[#12151C] border border-[#262B38] text-xs text-gray-400">
            Tidak ada riwayat log yang sesuai dengan filter pencarian Anda.
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
