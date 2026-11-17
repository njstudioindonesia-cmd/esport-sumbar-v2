"use client";

import React from "react";
import { AdminNavbar } from "@/components/AdminNavbar";
import {
  ShieldCheck,
  Users,
  FileText,
  Activity,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Card, CardHeader, CardContent, StatusBadge, Button } from "@esport-sumbar/ui";

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-[#05051A] text-white flex">
      <AdminNavbar />

      <main className="flex-1 p-6 md:p-10 flex flex-col gap-8 overflow-y-auto">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Ringkasan Operasional Platform
            </h1>
            <p className="text-xs text-white/50">
              Sistem Pengurus & Verifikasi Resmi Olahraga Elektronik Sumatera Barat.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 rounded-lg bg-[#2BB673]/15 border border-[#2BB673]/30 text-[#2BB673] text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#2BB673] animate-pulse" />
              Sistem Staging Aktif
            </span>
          </div>
        </div>

        {/* Operational Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-white/50">
                <span className="text-xs font-semibold">Antrean Verifikasi</span>
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <div className="text-2xl font-black font-display text-white">0</div>
              <span className="text-xs text-white/40">Menunggu pemeriksaan tim</span>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-white/50">
                <span className="text-xs font-semibold">Profil Terverifikasi</span>
                <Users className="w-4 h-4 text-[#2BB673]" />
              </div>
              <div className="text-2xl font-black font-display text-white">0</div>
              <span className="text-xs text-white/40">Atlet & instansi aktif</span>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-white/50">
                <span className="text-xs font-semibold">Artikel Warta Terbit</span>
                <FileText className="w-4 h-4 text-[#FF1752]" />
              </div>
              <div className="text-2xl font-black font-display text-white">0</div>
              <span className="text-xs text-white/40">Berita resmi ESPORT SUMBAR</span>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-white/50">
                <span className="text-xs font-semibold">Laporan UGC</span>
                <AlertTriangle className="w-4 h-4 text-[#F2A33A]" />
              </div>
              <div className="text-2xl font-black font-display text-white">0</div>
              <span className="text-xs text-white/40">Laporan konten aktif</span>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Recent Verification Queue */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 flex flex-col gap-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between w-full">
                  <h3 className="text-sm font-bold text-white">Antrean Verifikasi Terbaru</h3>
                  <Button variant="ghost" size="sm">Lihat Semua</Button>
                </div>
              </CardHeader>
              <CardContent className="text-center py-12 text-white/40 text-xs">
                Tidak ada pengajuan verifikasi yang tertunda saat ini.
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-4">
            <Card>
              <CardHeader>
                <h3 className="text-sm font-bold text-white">Aksi Cepat Pengurus</h3>
              </CardHeader>
              <CardContent className="flex flex-col gap-2.5">
                <Button variant="secondary" size="sm" className="w-full justify-start">
                  + Buat Artikel Berita Baru
                </Button>
                <Button variant="secondary" size="sm" className="w-full justify-start">
                  + Tambah Banner Pengumuman
                </Button>
                <Button variant="secondary" size="sm" className="w-full justify-start">
                  Periksa Log Audit Sistem
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
