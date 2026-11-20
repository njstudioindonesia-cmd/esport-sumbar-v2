"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AdminNavbar } from "@/components/AdminNavbar";
import {
  ShieldCheck,
  Users,
  FileText,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Loader2,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { Card, CardHeader, CardContent, StatusBadge, Button } from "@esport-sumbar/ui";
import {
  getDashboardMetricsAction,
  type DashboardMetrics,
} from "@/app/actions/dashboard";

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    pendingVerifications: 0,
    verifiedProfiles: 0,
    totalArticles: 0,
    totalReports: 0,
    totalAccounts: 0,
    totalProfiles: 0,
    recentQueue: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadMetrics() {
      try {
        const res = await getDashboardMetricsAction();
        if (isMounted && res.success) {
          setMetrics(res.data);
        }
      } catch (err) {
        console.error("Gagal memuat metrik admin:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadMetrics();
    return () => {
      isMounted = false;
    };
  }, []);

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
              Sistem Pengurus & Verifikasi Resmi Olahraga Elektronik Sumatera Barat. Terhubung langsung ke Supabase.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 rounded-lg bg-[#2BB673]/15 border border-[#2BB673]/30 text-[#2BB673] text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#2BB673] animate-pulse" />
              Supabase Terhubung
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
              <div className="text-2xl font-black font-display text-white">
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin text-white/40" /> : metrics.pendingVerifications}
              </div>
              <span className="text-xs text-white/40">Menunggu pemeriksaan tim</span>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-white/50">
                <span className="text-xs font-semibold">Profil Terdaftar</span>
                <Users className="w-4 h-4 text-[#2BB673]" />
              </div>
              <div className="text-2xl font-black font-display text-white">
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin text-white/40" /> : `${metrics.totalProfiles} (${metrics.verifiedProfiles} diverifikasi)`}
              </div>
              <span className="text-xs text-white/40">{metrics.totalAccounts} akun pengguna terdaftar</span>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-white/50">
                <span className="text-xs font-semibold">Artikel Warta Terbit</span>
                <FileText className="w-4 h-4 text-[#FF1752]" />
              </div>
              <div className="text-2xl font-black font-display text-white">
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin text-white/40" /> : metrics.totalArticles}
              </div>
              <span className="text-xs text-white/40">Berita resmi ESPORT SUMBAR</span>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-white/50">
                <span className="text-xs font-semibold">Laporan UGC</span>
                <AlertTriangle className="w-4 h-4 text-[#F2A33A]" />
              </div>
              <div className="text-2xl font-black font-display text-white">
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin text-white/40" /> : metrics.totalReports}
              </div>
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
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    Antrean Verifikasi & Profil Terbaru
                  </h3>
                  <Link href="/verification">
                    <Button variant="ghost" size="sm" className="text-xs text-pink-400 hover:text-pink-300">
                      Lihat Semua ({metrics.recentQueue.length})
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12 text-white/40 text-xs gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Memuat data antrean dari Supabase...
                  </div>
                ) : metrics.recentQueue.length === 0 ? (
                  <div className="text-center py-12 text-white/40 text-xs">
                    Tidak ada pengajuan verifikasi yang tertunda saat ini.
                  </div>
                ) : (
                  <div className="divide-y divide-white/[0.06]">
                    {metrics.recentQueue.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {item.avatarUrl ? (
                            <img
                              src={item.avatarUrl}
                              alt={item.name}
                              className="w-10 h-10 rounded-xl object-cover border border-white/10"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-sm font-bold text-white/70">
                              {item.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-white">{item.name}</span>
                              {item.ign !== "-" && (
                                <span className="text-[11px] font-mono text-[#D4AF37]">
                                  &quot;{item.ign}&quot;
                                </span>
                              )}
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/70 uppercase font-mono">
                                {item.type}
                              </span>
                            </div>
                            <span className="text-[11px] text-white/40 font-mono">
                              {item.esportId} &bull; {item.game} &bull; {item.region}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <StatusBadge status={item.status as any} size="sm" />
                          <Link href="/verification">
                            <Button variant="secondary" size="sm" className="text-xs">
                              Periksa
                              <ArrowRight className="w-3.5 h-3.5 ml-1" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-4">
            <Card>
              <CardHeader>
                <h3 className="text-sm font-bold text-white">Aksi Cepat Pengurus</h3>
              </CardHeader>
              <CardContent className="flex flex-col gap-2.5">
                <Link href="/news">
                  <Button variant="secondary" size="sm" className="w-full justify-start">
                    + Buat Artikel Berita Baru
                  </Button>
                </Link>
                <Link href="/content">
                  <Button variant="secondary" size="sm" className="w-full justify-start">
                    + Tambah Banner Pengumuman
                  </Button>
                </Link>
                <Link href="/users">
                  <Button variant="secondary" size="sm" className="w-full justify-start">
                    Kelola Direktori Pengguna ({metrics.totalAccounts})
                  </Button>
                </Link>
                <Link href="/audit">
                  <Button variant="ghost" size="sm" className="w-full justify-start text-white/60 hover:text-white">
                    Periksa Log Audit Sistem
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
