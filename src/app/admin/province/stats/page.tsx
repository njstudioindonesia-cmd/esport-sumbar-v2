"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  Award,
  TrendingUp,
  MapPin,
  Clock,
  CheckCircle2,
  Users,
  ChevronRight,
  Shield,
  Layers,
  PieChart,
} from "lucide-react";
import { AdminProvinceNavbar } from "@/components/admin/AdminProvinceNavbar";
import { Footer } from "@/components/layout/Footer";
import { REGIONS_DETAIL } from "@/data/regions";

export default function AdminProvinceStatsPage() {
  const [selectedGameFilter, setSelectedGameFilter] = useState("all");

  // Regional breakdown statistics
  const regionStats = [
    { code: "PDG", name: "Kota Padang", verified: 48, regional: 22, unverified: 35, avgDays: 2.4 },
    { code: "BKT", name: "Kota Bukittinggi", verified: 26, regional: 14, unverified: 18, avgDays: 1.9 },
    { code: "PYK", name: "Kota Payakumbuh", verified: 19, regional: 11, unverified: 14, avgDays: 2.1 },
    { code: "AGM", name: "Kab. Agam", verified: 16, regional: 9, unverified: 12, avgDays: 3.1 },
    { code: "PDP", name: "Kota Pariaman", verified: 14, regional: 8, unverified: 10, avgDays: 2.5 },
    { code: "SLK", name: "Kota Solok", verified: 11, regional: 6, unverified: 9, avgDays: 2.0 },
    { code: "TDN", name: "Kab. Tanah Datar", verified: 9, regional: 5, unverified: 8, avgDays: 2.7 },
    { code: "LMP", name: "Kab. Lima Puluh Kota", verified: 8, regional: 4, unverified: 7, avgDays: 2.9 },
    { code: "PPN", name: "Kota Padang Panjang", verified: 8, regional: 3, unverified: 6, avgDays: 1.8 },
    { code: "SWL", name: "Kota Sawahlunto", verified: 6, regional: 3, unverified: 5, avgDays: 2.2 },
    { code: "PAS", name: "Kab. Pasaman", verified: 5, regional: 3, unverified: 4, avgDays: 3.4 },
    { code: "PSS", name: "Kab. Pesisir Selatan", verified: 5, regional: 4, unverified: 6, avgDays: 3.0 },
    { code: "DHN", name: "Kab. Dharmasraya", verified: 4, regional: 2, unverified: 5, avgDays: 3.5 },
    { code: "KBS", name: "Kab. Solok", verified: 4, regional: 3, unverified: 4, avgDays: 3.2 },
    { code: "PLW", name: "Kab. Padang Pariaman", verified: 4, regional: 3, unverified: 4, avgDays: 2.8 },
    { code: "KBL", name: "Kab. Sijunjung", verified: 3, regional: 2, unverified: 3, avgDays: 3.3 },
    { code: "PSB", name: "Kab. Pasaman Barat (FB)", verified: 2, regional: 2, unverified: 4, avgDays: 4.1 },
    { code: "SSL", name: "Kab. Solok Selatan (FB)", verified: 0, regional: 1, unverified: 3, avgDays: 4.5 },
    { code: "MTW", name: "Kep. Mentawai (FB)", verified: 0, regional: 1, unverified: 4, avgDays: 4.8 },
  ];

  const totalVerified = regionStats.reduce((acc, curr) => acc + curr.verified, 0);
  const totalRegional = regionStats.reduce((acc, curr) => acc + curr.regional, 0);
  const regionsWithVerified = regionStats.filter((r) => r.verified > 0).length;
  const coveragePercentage = ((regionsWithVerified / 19) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-[#0B0D12] text-[#F3F4F6] flex flex-col font-sans">
      <AdminProvinceNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        {/* BREADCRUMB */}
        <div className="flex flex-col gap-2 mb-6">
          <nav className="flex items-center gap-2 text-xs text-[#9AA3B2] font-mono mb-1">
            <Link href="/admin/province" className="hover:text-white transition-colors">
              Admin Provinsi
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#D4AF37] font-bold">Statistik & Cakupan Wilayah</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#262B38] pb-5">
            <div>
              <h1 className="text-2xl sm:text-3xl font-heading font-black uppercase text-white tracking-tight flex items-center gap-2.5">
                <BarChart3 className="w-7 h-7 text-[#D4AF37]" />
                <span>Statistik Cakupan & Pertumbuhan Ekosistem</span>
              </h1>
              <p className="text-xs sm:text-sm text-[#9AA3B2] mt-1 max-w-2xl leading-relaxed">
                Analisis data komprehensif perkembangan verifikasi atlet, pelatih, dan klub pada 19 Kota dan Kabupaten di Sumatera Barat.
              </p>
            </div>
          </div>
        </div>

        {/* TOP HIGHLIGHT CARDS: COVERAGE & GROWTH */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {/* 1. CAKUPAN WILAYAH */}
          <div className="p-5 rounded-2xl bg-[#12151C] border border-[#262B38] shadow-md flex flex-col justify-between gap-3">
            <span className="text-xs font-heading font-bold uppercase text-gray-400">
              Cakupan Wilayah Terverifikasi
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-heading font-black text-[#D4AF37]">
                {coveragePercentage}%
              </span>
              <span className="text-xs font-mono text-gray-400">
                ({regionsWithVerified} dari 19 Daerah)
              </span>
            </div>
            <div className="h-2 w-full bg-[#161922] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#D4AF37] to-[#E5C358]"
                style={{ width: `${coveragePercentage}%` }}
              />
            </div>
            <span className="text-[10px] text-gray-400">
              Target PBESI Sumbar 2026: 100% dari 19 wilayah memiliki atlet terverifikasi.
            </span>
          </div>

          {/* 2. TOTAL EMAS RESMI */}
          <div className="p-5 rounded-2xl bg-[#12151C] border border-[#262B38] shadow-md flex flex-col justify-between gap-3">
            <span className="text-xs font-heading font-bold uppercase text-gray-400">
              Total Lencana Emas PBESI Aktif
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-heading font-black text-[#22C55E]">
                {totalVerified}
              </span>
              <span className="text-xs font-mono text-[#22C55E] font-bold">
                +38% Kuartal Ini
              </span>
            </div>
            <p className="text-[11px] text-[#9AA3B2]">
              Didukung {totalRegional} profil berstatus Regional Checked siap diajukan.
            </p>
          </div>

          {/* 3. WAKTU PENYELESAIAN TERCAPAT */}
          <div className="p-5 rounded-2xl bg-[#12151C] border border-[#262B38] shadow-md flex flex-col justify-between gap-3">
            <span className="text-xs font-heading font-bold uppercase text-gray-400">
              Pengcab Paling Responsif (SLA)
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-heading font-black text-white">
                Padang Panjang
              </span>
              <span className="text-xs font-mono text-[#22C55E] font-bold">1.8 Hari</span>
            </div>
            <p className="text-[11px] text-[#9AA3B2]">
              Diikuti oleh Kota Bukittinggi (1.9 Hari) & Kota Solok (2.0 Hari).
            </p>
          </div>
        </div>

        {/* 19 REGIONS TABLE WITH BAR VISUALIZATION */}
        <div className="p-6 rounded-2xl bg-[#12151C] border border-[#262B38] shadow-xl flex flex-col gap-4 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#262B38]">
            <div>
              <h2 className="font-heading font-bold text-base uppercase text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#D4AF37]" />
                <span>Distribusi Profil Terverifikasi per Kota / Kabupaten</span>
              </h2>
              <p className="text-xs text-[#9AA3B2] mt-0.5">
                Perbandingan data real-time antara Lencana Emas (Provinsi), Regional Checked (Daerah), dan Draft.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#161922] border-b border-[#262B38] text-gray-400 font-heading font-bold uppercase tracking-wider">
                  <th className="p-3 w-12 text-center">No</th>
                  <th className="p-3">Kota / Kabupaten</th>
                  <th className="p-3">Terverifikasi Emas</th>
                  <th className="p-3">Lolos Daerah</th>
                  <th className="p-3">Dalam Proses</th>
                  <th className="p-3">Visual Distribusi</th>
                  <th className="p-3 text-right">Rata-Rata Waktu SLA</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#262B38]/60">
                {regionStats.map((reg, index) => {
                  const total = reg.verified + reg.regional + reg.unverified;
                  const goldWidth = (reg.verified / 50) * 100;

                  return (
                    <tr key={reg.code} className="hover:bg-[#161922]/60 transition-colors">
                      <td className="p-3 text-center text-gray-500 font-mono">{index + 1}</td>

                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <strong className="text-white font-medium">{reg.name}</strong>
                          <span className="text-[10px] font-mono text-gray-400">({reg.code})</span>
                        </div>
                      </td>

                      <td className="p-3 font-mono">
                        <span className="text-[#D4AF37] font-bold text-sm">{reg.verified}</span>
                        <span className="text-gray-500 text-[10px] ml-1">Profil</span>
                      </td>

                      <td className="p-3 font-mono">
                        <span className="text-[#22C55E] font-medium">{reg.regional}</span>
                      </td>

                      <td className="p-3 font-mono text-gray-400">{reg.unverified}</td>

                      {/* DISTRIBUTION BAR */}
                      <td className="p-3 w-48">
                        <div className="h-2 w-full bg-[#161922] rounded-full overflow-hidden flex">
                          <div
                            className="bg-[#D4AF37]"
                            style={{ width: `${(reg.verified / total) * 100}%` }}
                            title={`Emas: ${reg.verified}`}
                          />
                          <div
                            className="bg-[#22C55E]"
                            style={{ width: `${(reg.regional / total) * 100}%` }}
                            title={`Daerah: ${reg.regional}`}
                          />
                          <div
                            className="bg-gray-700"
                            style={{ width: `${(reg.unverified / total) * 100}%` }}
                            title={`Proses: ${reg.unverified}`}
                          />
                        </div>
                      </td>

                      <td className="p-3 text-right font-mono text-gray-300">
                        <span
                          className={
                            reg.avgDays > 4
                              ? "text-red-400"
                              : reg.avgDays > 3
                              ? "text-amber-400"
                              : "text-[#22C55E]"
                          }
                        >
                          {reg.avgDays} Hari
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
