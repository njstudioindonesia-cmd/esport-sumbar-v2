"use client";

import React from "react";
import Link from "next/link";
import {
  Server,
  Users,
  Newspaper,
  Layers,
  MapPin,
  Flag,
  ShieldAlert,
  CheckCircle2,
  Database,
  ArrowRight,
  TrendingUp,
  Activity,
  Sparkles,
} from "lucide-react";
import { AdminPlatformNavbar } from "@/components/admin/AdminPlatformNavbar";
import { Footer } from "@/components/layout/Footer";
import { MobileAdminPortal } from "@/components/mobile/MobileAdminPortal";

export default function AdminPlatformDashboardPage() {
  return (
    <>
      {/* Mobile Admin Experience */}
      <div className="block lg:hidden">
        <MobileAdminPortal initialRole="platform" />
      </div>

      {/* Desktop Admin View */}
      <div className="hidden lg:flex min-h-screen bg-[#0B0D12] text-[#F3F4F6] flex-col font-sans">
        <AdminPlatformNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        {/* OPERATOR GOVERNANCE NOTICE */}
        <div className="mb-8 p-4 rounded-xl bg-blue-950/20 border border-blue-800/40 text-xs text-[#93C5FD] flex items-start gap-3 shadow-md">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-0.5 leading-relaxed">
            <span className="font-heading font-bold uppercase text-white">
              Prinsip Tata Kelola Platform & Independensi ESI (P1 Master Concept)
            </span>
            <span>
              Operator Platform bertanggung jawab atas ketersediaan server, basis data, pemeliharaan CMS, dan triase laporan masyarakat. Sesuai regulasi PBESI, <strong>Operator Platform dilarang keras memiliki tombol maupun kewenangan verifikasi resmi atlet</strong>. Kewenangan verifikasi adalah otoritas kelembagaan ESI Daerah dan ESI Provinsi.
            </span>
          </div>
        </div>

        {/* TITLE & HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-[#262B38] pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-[#3B82F6]/15 border border-[#3B82F6]/30 text-[10px] font-mono text-[#3B82F6] font-bold">
                PLATFORM CORE SYSTEM V2.4
              </span>
              <span className="text-xs text-gray-400 font-mono">
                Region: Sumatera Barat (Production)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black uppercase text-white tracking-tight">
              Pusat Kendali Operator Sistem
            </h1>
            <p className="text-xs sm:text-sm text-[#9AA3B2] mt-1 max-w-2xl leading-relaxed">
              Ringkasan metrik real-time sistem, manajemen artikel editorial, akun administrator ESI cabang/provinsi, dan status kesehatan infrastruktur portal.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/platform/news"
              className="px-4 py-2.5 rounded-xl bg-[#161922] hover:bg-[#1A1E28] border border-[#262B38] text-xs font-heading font-bold text-gray-200 hover:text-white uppercase tracking-wider transition-colors"
            >
              Kelola Berita →
            </Link>
            <Link
              href="/admin/platform/admins"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white text-xs font-heading font-extrabold uppercase tracking-wider hover:brightness-110 shadow-md transition-all"
            >
              Kelola Admin ESI →
            </Link>
          </div>
        </div>

        {/* METRICS CARDS (4 CARDS) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* 1. TOTAL PENGGUNA TERDAFTAR */}
          <div className="p-5 rounded-2xl bg-[#12151C] border border-[#262B38] shadow-md flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-heading font-bold text-gray-400 uppercase tracking-wider">
                Pengguna Terdaftar
              </span>
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-heading font-black text-white">1,480</div>
              <p className="text-[11px] text-[#9AA3B2] mt-1">
                +14% pendaftar baru dalam 30 hari terakhir.
              </p>
            </div>
            <span className="text-xs font-mono text-[#22C55E] flex items-center gap-1 font-bold pt-2 border-t border-[#262B38]">
              <TrendingUp className="w-3.5 h-3.5" />
              Tingkat Retensi 88.4%
            </span>
          </div>

          {/* 2. TOTAL PROFIL & KARTU TCG */}
          <div className="p-5 rounded-2xl bg-[#12151C] border border-[#262B38] shadow-md flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-heading font-bold text-gray-400 uppercase tracking-wider">
                Kartu TCG Terbit
              </span>
              <div className="p-2 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-heading font-black text-[#D4AF37]">1,850</div>
              <p className="text-[11px] text-[#9AA3B2] mt-1">
                1,420 Player • 180 Coach • 250 Team
              </p>
            </div>
            <span className="text-xs font-mono text-gray-400 flex items-center gap-1 font-bold pt-2 border-t border-[#262B38]">
              Rasio Pemilik Multi-Profil: 1.25x
            </span>
          </div>

          {/* 3. ARTIKEL BERITA TERBIT */}
          <div className="p-5 rounded-2xl bg-[#12151C] border border-[#262B38] shadow-md flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-heading font-bold text-gray-400 uppercase tracking-wider">
                Artikel Berita Terbit
              </span>
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                <Newspaper className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-heading font-black text-white">14</div>
              <p className="text-[11px] text-[#9AA3B2] mt-1">
                2 Draft editorial menunggu jadwal terbit.
              </p>
            </div>
            <Link
              href="/admin/platform/news"
              className="text-xs font-mono text-purple-400 hover:underline flex items-center gap-1 font-bold pt-2 border-t border-[#262B38]"
            >
              <span>Buka Editor Berita →</span>
            </Link>
          </div>

          {/* 4. MODERASI LAPORAN */}
          <div className="p-5 rounded-2xl bg-[#12151C] border border-[#262B38] shadow-md flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-heading font-bold text-gray-400 uppercase tracking-wider">
                Laporan Masyarakat
              </span>
              <div className="p-2 rounded-xl bg-red-500/10 text-red-400">
                <Flag className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-heading font-black text-red-400">2</div>
              <p className="text-[11px] text-[#9AA3B2] mt-1">
                Laporan dugaan pemalsuan/joki akun masuk.
              </p>
            </div>
            <Link
              href="/admin/platform/moderation"
              className="text-xs font-mono text-red-400 hover:underline flex items-center gap-1 font-bold pt-2 border-t border-[#262B38]"
            >
              <span>Triase & Teruskan ke ESI →</span>
            </Link>
          </div>
        </div>

        {/* 2-COLUMN SECTION: SYSTEM INFRASTRUCTURE HEALTH & QUICK ADMIN ACCESS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: SERVER & INFRASTRUCTURE STATUS (7 COLS) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="p-6 rounded-2xl bg-[#12151C] border border-[#262B38] shadow-md flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#262B38]">
                <div className="flex items-center gap-2">
                  <Server className="w-5 h-5 text-[#3B82F6]" />
                  <h3 className="font-heading font-bold text-sm uppercase text-white tracking-wide">
                    Status Kesehatan Layanan & Infrastruktur
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#22C55E]/15 border border-[#22C55E]/30 text-[10px] font-mono text-[#22C55E] font-bold">
                  All Systems Operational
                </span>
              </div>

              <div className="flex flex-col divide-y divide-[#262B38]/60">
                <div className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                    <div>
                      <strong className="text-white block">Next.js App Engine (Edge Cluster)</strong>
                      <span className="text-[10px] text-gray-400 font-mono">Uptime: 99.98% • Latency: 18ms</span>
                    </div>
                  </div>
                  <span className="text-[#22C55E] font-mono font-bold">NORMAL</span>
                </div>

                <div className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                    <div>
                      <strong className="text-white block">PostgreSQL Primary Cluster (Multi-Region RLS)</strong>
                      <span className="text-[10px] text-gray-400 font-mono">Connections: 42/200 • Storage: 28%</span>
                    </div>
                  </div>
                  <span className="text-[#22C55E] font-mono font-bold">NORMAL</span>
                </div>

                <div className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                    <div>
                      <strong className="text-white block">Object Storage Bukti Privat (R2 Encrypted)</strong>
                      <span className="text-[10px] text-gray-400 font-mono">Retention Policy Engine: Active</span>
                    </div>
                  </div>
                  <span className="text-[#22C55E] font-mono font-bold">NORMAL</span>
                </div>

                <div className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                    <div>
                      <strong className="text-white block">Append-Only Audit Log Ledger (SHA-256)</strong>
                      <span className="text-[10px] text-gray-400 font-mono">Tamper-Proof Verification: OK</span>
                    </div>
                  </div>
                  <span className="text-[#22C55E] font-mono font-bold">SECURE</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: QUICK MANAGEMENT MODULE SHORTCUTS (5 COLS) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="p-6 rounded-2xl bg-[#12151C] border border-[#262B38] shadow-md flex flex-col gap-3">
              <span className="text-xs font-heading font-bold text-gray-400 uppercase tracking-wider">
                Modul Operator Utama
              </span>

              <div className="flex flex-col gap-2.5">
                <Link
                  href="/admin/platform/news"
                  className="p-3.5 rounded-xl bg-[#161922] hover:bg-[#1A1E28] border border-[#262B38] flex items-center justify-between group transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Newspaper className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
                    <div>
                      <h4 className="font-heading font-bold text-xs uppercase text-white">
                        CMS Berita & Editorial
                      </h4>
                      <p className="text-[10px] text-gray-400">
                        Publikasi berita daerah & pengumuman turnamen.
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white" />
                </Link>

                <Link
                  href="/admin/platform/admins"
                  className="p-3.5 rounded-xl bg-[#161922] hover:bg-[#1A1E28] border border-[#262B38] flex items-center justify-between group transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-[#3B82F6] group-hover:scale-110 transition-transform" />
                    <div>
                      <h4 className="font-heading font-bold text-xs uppercase text-white">
                        Kelola Akun Admin ESI
                      </h4>
                      <p className="text-[10px] text-gray-400">
                        Tambah akun pengcab dan tetapkan hak yurisdiksi daerah.
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white" />
                </Link>

                <Link
                  href="/admin/platform/reference"
                  className="p-3.5 rounded-xl bg-[#161922] hover:bg-[#1A1E28] border border-[#262B38] flex items-center justify-between group transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Database className="w-5 h-5 text-[#D4AF37] group-hover:scale-110 transition-transform" />
                    <div>
                      <h4 className="font-heading font-bold text-xs uppercase text-white">
                        Data Referensi Game & Wilayah
                      </h4>
                      <p className="text-[10px] text-gray-400">
                        Master roles game, kategori berita, dan status pengcab.
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white" />
                </Link>

                <Link
                  href="/admin/platform/audit"
                  className="p-3.5 rounded-xl bg-[#161922] hover:bg-[#1A1E28] border border-[#262B38] flex items-center justify-between group transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-[#22C55E] group-hover:scale-110 transition-transform" />
                    <div>
                      <h4 className="font-heading font-bold text-xs uppercase text-white">
                        Audit Log Global (Append-Only)
                      </h4>
                      <p className="text-[10px] text-gray-400">
                        Viewer log lintas peran dan ekspor CSV resmi.
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      </div>
    </>
  );
}
