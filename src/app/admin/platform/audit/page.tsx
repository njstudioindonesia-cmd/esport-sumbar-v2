"use client";

import React, { useState, useMemo } from "react";
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
import { AdminPlatformNavbar } from "@/components/admin/AdminPlatformNavbar";
import { Footer } from "@/components/layout/Footer";
import { REGIONS_DETAIL } from "@/data/regions";
import { ActivityLogItem } from "@/data/mockAdminData";

export default function AdminPlatformAuditPage() {
  const [logs] = useState<ActivityLogItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterRegion, setFilterRegion] = useState("all");
  const [isExporting, setIsExporting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        log.targetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.targetId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.logHash.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole =
        filterRole === "all"
          ? true
          : log.actorRole.toLowerCase().includes(filterRole.toLowerCase());

      const matchesRegion =
        filterRegion === "all" || log.regionCode === filterRegion || log.regionCode === "ALL";

      return matchesSearch && matchesRole && matchesRegion;
    });
  }, [logs, searchQuery, filterRole, filterRegion]);

  const handleExportCSV = () => {
    setIsExporting(true);
    setTimeout(() => {
      const headers = [
        "Waktu",
        "Pelaku",
        "Peran",
        "Wilayah",
        "Aksi",
        "Target ID",
        "Nama Target",
        "Alasan Resmi",
        "Hash SHA256",
      ];
      const rows = filteredLogs.map((l) => [
        `"${l.timestamp}"`,
        `"${l.actorName}"`,
        `"${l.actorRole}"`,
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
      link.download = `GLOBAL_AUDIT_LOG_ESPORT_SUMBAR_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setIsExporting(false);
      setToastMessage("Audit log global berhasil diekspor ke CSV.");
      setTimeout(() => setToastMessage(null), 3000);
    }, 600);
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
            <span className="text-[#3B82F6] font-bold">Audit Log Global</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#262B38] pb-5">
            <div>
              <h1 className="text-2xl sm:text-3xl font-heading font-black uppercase text-white tracking-tight flex items-center gap-2.5">
                <History className="w-7 h-7 text-[#22C55E]" />
                <span>Audit Log Transaksi Global (Append-Only)</span>
              </h1>
              <p className="text-xs sm:text-sm text-[#9AA3B2] mt-1 max-w-2xl leading-relaxed">
                Pencatatan menyeluruh setiap perubahan status atlet, pendaftaran admin ESI, eksekusi suspensi, dan kejadian sistem di seluruh platform.
              </p>
            </div>

            <button
              type="button"
              onClick={handleExportCSV}
              disabled={isExporting}
              className="self-start md:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1A1E28] hover:bg-[#262B38] border border-[#262B38] text-xs font-heading font-bold text-gray-200 hover:text-white uppercase tracking-wider transition-colors shadow-sm disabled:opacity-50"
            >
              <Download className="w-4 h-4 text-[#22C55E]" />
              <span>{isExporting ? "Membuat CSV..." : "Ekspor Log Global (CSV)"}</span>
            </button>
          </div>
        </div>

        {/* MANDATORY NOTICE BANNER */}
        <div className="mb-6 p-3.5 rounded-xl bg-[#12151C] border border-[#22C55E]/40 flex items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2.5 text-xs text-gray-300">
            <Lock className="w-4 h-4 text-[#22C55E] shrink-0" />
            <span>
              <strong>Pemberitahuan Sistem:</strong> Log ini hanya-tambah dan tidak dapat diubah atau dihapus.
            </span>
          </div>
          <span className="text-[10px] font-mono text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded border border-[#22C55E]/30 font-bold hidden sm:inline">
            SHA-256 Ledger
          </span>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="p-4 rounded-2xl bg-[#12151C] border border-[#262B38] mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-md">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama target, nomor ESPORT ID, nama staf admin, atau hash audit..."
              className="w-full bg-[#161922] border border-[#262B38] focus:border-[#22C55E] rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none font-mono"
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

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="bg-[#161922] border border-[#262B38] text-xs font-medium text-white px-3 py-2 rounded-xl focus:outline-none focus:border-[#22C55E]"
            >
              <option value="all">Semua Peran Pelaku</option>
              <option value="Operator">Operator Platform</option>
              <option value="Pengprov">Admin Provinsi (Pengprov)</option>
              <option value="Pengcab">Admin Daerah (Pengcab)</option>
            </select>

            <select
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value)}
              className="bg-[#161922] border border-[#262B38] text-xs font-medium text-white px-3 py-2 rounded-xl focus:outline-none focus:border-[#22C55E]"
            >
              <option value="all">Semua Wilayah</option>
              {REGIONS_DETAIL.map((r) => (
                <option key={r.code} value={r.code}>
                  {r.name} ({r.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* LOGS TABLE (DESKTOP) & CARDS (MOBILE) */}
        {filteredLogs.length > 0 ? (
          <div className="bg-[#12151C] border border-[#262B38] rounded-2xl overflow-hidden shadow-xl">
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#161922] border-b border-[#262B38] text-gray-400 font-heading font-bold uppercase tracking-wider">
                    <th className="p-3.5">Waktu Transaksi</th>
                    <th className="p-3.5">Pelaku & Peran</th>
                    <th className="p-3.5">Wilayah</th>
                    <th className="p-3.5">Aksi Tindakan</th>
                    <th className="p-3.5">Target Entitas</th>
                    <th className="p-3.5">Alasan / SK Resmi</th>
                    <th className="p-3.5">Hash Integritas</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#262B38]/70">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#161922]/70 transition-colors">
                      <td className="p-3.5 font-mono text-gray-300 whitespace-nowrap">
                        {log.timestamp}
                      </td>

                      <td className="p-3.5">
                        <div className="flex flex-col">
                          <strong className="text-white text-xs">{log.actorName}</strong>
                          <span className="text-[10px] text-gray-400 font-mono">
                            {log.actorRole}
                          </span>
                        </div>
                      </td>

                      <td className="p-3.5 font-mono text-gray-300">
                        <span className="px-2 py-0.5 rounded bg-[#161922] border border-[#262B38]">
                          {log.regionCode}
                        </span>
                      </td>

                      <td className="p-3.5 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-full bg-[#1A1E28] border border-[#262B38] text-gray-200 text-[10px] font-mono font-bold">
                          {log.action}
                        </span>
                      </td>

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

                      <td className="p-3.5 text-gray-300 text-xs max-w-xs leading-relaxed">
                        {log.reason}
                      </td>

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

            {/* MOBILE CARDS */}
            <div className="md:hidden divide-y divide-[#262B38]">
              {filteredLogs.map((log) => (
                <div key={log.id} className="p-4 flex flex-col gap-2 text-xs">
                  <div className="flex items-center justify-between text-[10px] font-mono text-gray-400">
                    <span>{log.timestamp}</span>
                    <span className="px-2 py-0.5 rounded bg-[#1A1E28] text-white">
                      {log.regionCode}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="font-heading font-bold text-sm text-white uppercase">
                      {log.targetName}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">
                      {log.action} • Oleh: {log.actorName}
                    </span>
                  </div>

                  <p className="text-gray-300 text-[11px] leading-relaxed bg-[#161922] p-2.5 rounded-lg border border-[#262B38]">
                    {log.reason}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-12 text-center rounded-2xl bg-[#12151C] border border-[#262B38] text-xs text-gray-400">
            Tidak ada riwayat audit log global yang cocok dengan filter pencarian.
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
