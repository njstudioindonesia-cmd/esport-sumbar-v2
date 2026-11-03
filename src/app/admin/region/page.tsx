"use client";

import React from "react";
import Link from "next/link";
import {
  Inbox,
  Clock,
  AlertTriangle,
  CheckCircle2,
  FileCheck,
  ChevronRight,
  TrendingDown,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Shield,
  Layers,
  Search,
} from "lucide-react";
import { AdminRegionNavbar } from "@/components/admin/AdminRegionNavbar";
import { Footer } from "@/components/layout/Footer";
import { MOCK_REGIONAL_QUEUE } from "@/data/mockAdminData";

export default function AdminRegionDashboardPage() {
  const pendingCount = MOCK_REGIONAL_QUEUE.filter((q) => q.status === "submitted").length;
  const inReviewCount = MOCK_REGIONAL_QUEUE.filter((q) => q.status === "in_review").length;
  const revisionCount = MOCK_REGIONAL_QUEUE.filter((q) => q.status === "revision_needed").length;
  const approvedThisMonth = 28;

  // SLA approaching or critical items
  const slaAlerts = MOCK_REGIONAL_QUEUE.filter((q) => q.slaStatus !== "normal");

  return (
    <div className="min-h-screen bg-[#0B0D12] text-[#F3F4F6] flex flex-col font-sans">
      <AdminRegionNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        {/* TITLE & NOTICE */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-[#262B38] pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[10px] font-mono text-[#D4AF37] font-bold">
                WILAYAH: KOTA PADANG (PDG)
              </span>
              <span className="text-xs text-gray-400 font-mono">
                Sistem Verifikasi Tahap 1
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black uppercase text-white tracking-tight">
              Ringkasan Kinerja Verifikasi Pengcab
            </h1>
            <p className="text-xs sm:text-sm text-[#9AA3B2] mt-1 max-w-2xl leading-relaxed">
              Pantau antrean pengajuan atlet, pelatih, dan klub esport di wilayah Kota Padang. Jaga komitmen SLA pelayanan di bawah 5 hari kerja.
            </p>
          </div>

          <Link
            href="/admin/region/queue"
            className="self-start md:self-auto flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E5C358] text-black text-xs font-heading font-extrabold uppercase tracking-wider hover:brightness-110 shadow-lg shadow-amber-950/20 transition-all"
          >
            <Inbox className="w-4 h-4" />
            <span>Buka Antrean Pengajuan ({pendingCount + inReviewCount})</span>
          </Link>
        </div>

        {/* METRICS CARDS GRID (4 CARDS) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* 1. MENUNGGU */}
          <div className="p-5 rounded-2xl bg-[#12151C] border border-[#262B38] shadow-md flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-heading font-bold text-gray-400 uppercase tracking-wider">
                Menunggu Peninjauan
              </span>
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                <Inbox className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-heading font-black text-white">{pendingCount}</div>
              <p className="text-[11px] text-[#9AA3B2] mt-1">
                Pengajuan baru masuk ke antrean wilayah.
              </p>
            </div>
            <Link
              href="/admin/region/queue?status=submitted"
              className="text-xs font-mono text-blue-400 hover:underline flex items-center gap-1 font-bold pt-2 border-t border-[#262B38]"
            >
              <span>Lihat Antrean Masuk →</span>
            </Link>
          </div>

          {/* 2. DALAM PENINJAUAN */}
          <div className="p-5 rounded-2xl bg-[#12151C] border border-[#262B38] shadow-md flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-heading font-bold text-gray-400 uppercase tracking-wider">
                Sedang Ditinjau
              </span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-heading font-black text-amber-400">{inReviewCount}</div>
              <p className="text-[11px] text-[#9AA3B2] mt-1">
                Telah ditugaskan ke staf validator ESI.
              </p>
            </div>
            <Link
              href="/admin/region/queue?status=in_review"
              className="text-xs font-mono text-amber-400 hover:underline flex items-center gap-1 font-bold pt-2 border-t border-[#262B38]"
            >
              <span>Lanjutkan Peninjauan →</span>
            </Link>
          </div>

          {/* 3. PERLU REVISI */}
          <div className="p-5 rounded-2xl bg-[#12151C] border border-[#262B38] shadow-md flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-heading font-bold text-gray-400 uppercase tracking-wider">
                Perlu Revisi Pemohon
              </span>
              <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-heading font-black text-orange-400">
                {revisionCount}
              </div>
              <p className="text-[11px] text-[#9AA3B2] mt-1">
                Menunggu unggah ulang bukti dari atlet.
              </p>
            </div>
            <Link
              href="/admin/region/queue?status=revision_needed"
              className="text-xs font-mono text-orange-400 hover:underline flex items-center gap-1 font-bold pt-2 border-t border-[#262B38]"
            >
              <span>Audit Item Revisi →</span>
            </Link>
          </div>

          {/* 4. LOLOS BULAN INI */}
          <div className="p-5 rounded-2xl bg-[#12151C] border border-[#262B38] shadow-md flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-heading font-bold text-gray-400 uppercase tracking-wider">
                Lolos Daerah Bulan Ini
              </span>
              <div className="p-2 rounded-xl bg-[#22C55E]/10 text-[#22C55E]">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-heading font-black text-[#22C55E]">
                {approvedThisMonth}
              </div>
              <p className="text-[11px] text-[#9AA3B2] mt-1">
                Diberi status <em>Regional Checked</em> & diteruskan ke Provinsi.
              </p>
            </div>
            <Link
              href="/admin/region/logs"
              className="text-xs font-mono text-[#22C55E] hover:underline flex items-center gap-1 font-bold pt-2 border-t border-[#262B38]"
            >
              <span>Lihat Log Kelulusan →</span>
            </Link>
          </div>
        </div>

        {/* 2-COLUMN SECTION: SLA CRITICAL ALERTS & AVERAGE TIME CHART */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: SLA CRITICAL / WARNING ALERT LIST (7 COLS) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="p-6 rounded-2xl bg-[#12151C] border border-[#262B38] shadow-md flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#262B38]">
                <div className="flex items-center gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <div>
                    <h3 className="font-heading font-bold text-sm uppercase text-white tracking-wide">
                      Mendekati / Melebihi Batas SLA Layanan
                    </h3>
                    <p className="text-[11px] text-[#9AA3B2]">
                      Pengajuan yang memerlukan tindakan segera agar tidak melewati standar pelayanan publik.
                    </p>
                  </div>
                </div>

                <span className="px-2.5 py-0.5 rounded-full bg-red-950/60 border border-red-800 text-[10px] font-mono text-red-400 font-bold">
                  {slaAlerts.length} Perlu Perhatian
                </span>
              </div>

              {slaAlerts.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {slaAlerts.map((item) => (
                    <div
                      key={item.id}
                      className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors ${
                        item.slaStatus === "critical"
                          ? "bg-red-950/20 border-red-800/60"
                          : "bg-amber-950/20 border-amber-800/50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-heading font-black text-xs shrink-0 ${
                            item.slaStatus === "critical"
                              ? "bg-red-950 border border-red-700 text-red-400"
                              : "bg-amber-950 border border-amber-700 text-amber-400"
                          }`}
                        >
                          {item.daysWaiting}h
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-heading font-bold text-xs uppercase text-white">
                              {item.ign} ({item.name})
                            </span>
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono uppercase bg-[#1A1E28] text-[#D4AF37]">
                              {item.type}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#9AA3B2] mt-0.5">
                            Game: {item.game} • {item.esportId}
                          </p>
                          <span
                            className={`inline-block mt-1 text-[10px] font-mono font-bold ${
                              item.slaStatus === "critical"
                                ? "text-red-400"
                                : "text-amber-400"
                            }`}
                          >
                            {item.slaStatus === "critical"
                              ? "KRITIS: Menunggu >14 hari (Segera selesaikan)"
                              : "PERINGATAN: Menunggu 5–14 hari"}
                          </span>
                        </div>
                      </div>

                      <Link
                        href={`/admin/region/review/${item.id}`}
                        className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-heading font-bold uppercase tracking-wider text-center transition-colors shrink-0 ${
                          item.slaStatus === "critical"
                            ? "bg-red-600 hover:bg-red-700 text-white"
                            : "bg-[#D4AF37] hover:brightness-110 text-black"
                        }`}
                      >
                        Tinjau Segera →
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-gray-400 flex flex-col items-center gap-2">
                  <CheckCircle2 className="w-8 h-8 text-[#22C55E]" />
                  <p>Semua pengajuan berada dalam batas waktu hijau (&lt;5 hari). Kerja luar biasa!</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: SLA PERFORMANCE CHART & QUICK METRICS (5 COLS) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* SLA GAUGE BOX */}
            <div className="p-6 rounded-2xl bg-[#12151C] border border-[#262B38] shadow-md flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#262B38]">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#22C55E]" />
                  <h3 className="font-heading font-bold text-xs uppercase text-white">
                    Waktu Peninjauan Rata-Rata
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded border border-[#22C55E]/30 font-bold">
                  SLA Terpenuhi
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-heading font-black text-white">2.4</span>
                <span className="text-sm font-heading text-gray-400 uppercase">Hari Kerja</span>
                <span className="ml-auto text-xs font-mono text-[#22C55E] flex items-center gap-1">
                  <TrendingDown className="w-3.5 h-3.5" />
                  -0.8 hari dibanding bln lalu
                </span>
              </div>

              {/* SLA BREAKDOWN BAR */}
              <div className="flex flex-col gap-2 pt-2">
                <div className="flex justify-between text-[11px] text-gray-400 font-mono">
                  <span>Komposisi Antrean Berdasarkan SLA:</span>
                </div>
                <div className="h-3 w-full bg-[#161922] rounded-full overflow-hidden flex">
                  <div className="w-[65%] bg-[#22C55E]" title="Normal (<5 hari): 65%" />
                  <div className="w-[20%] bg-amber-500" title="Peringatan (5-14 hari): 20%" />
                  <div className="w-[15%] bg-red-500" title="Kritis (>14 hari): 15%" />
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono pt-1">
                  <span className="text-[#22C55E] flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#22C55E]" /> &lt;5 Hari (65%)
                  </span>
                  <span className="text-amber-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-400" /> 5-14 Hari (20%)
                  </span>
                  <span className="text-red-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-400" /> &gt;14 Hari (15%)
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#161922] border border-[#262B38] text-[11px] text-gray-300 leading-relaxed">
                <strong>Ketentuan Verifikasi PBESI:</strong> Pengurus Cabang ESI Kota/Kabupaten bertindak sebagai verifikator tahap pertama untuk memastikan keaslian domisili, profil atlet, dan surat pengantar klub.
              </div>
            </div>

            {/* QUICK KEYBOARD SHORTCUTS GUIDE */}
            <div className="p-5 rounded-2xl bg-[#12151C] border border-[#262B38] shadow-md flex flex-col gap-2.5">
              <span className="text-[10px] font-mono font-bold uppercase text-[#D4AF37] tracking-wider">
                Pintasan Navigasi Admin
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#161922] border border-[#262B38]/60">
                  <span className="text-gray-400">Antrean Verifikasi:</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-black border border-[#262B38] text-[10px] font-mono text-gray-300">
                    Alt + Q
                  </kbd>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#161922] border border-[#262B38]/60">
                  <span className="text-gray-400">Log Aktivitas:</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-black border border-[#262B38] text-[10px] font-mono text-gray-300">
                    Alt + L
                  </kbd>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
