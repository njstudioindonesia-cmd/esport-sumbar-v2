"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Users,
  Gamepad2,
  Newspaper,
  Flag,
  History,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  MapPin,
  Sparkles,
  Layers,
} from "lucide-react";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { Footer } from "@/components/layout/Footer";

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    totalProfiles: 0,
    pendingVerification: 0,
    verifiedProfiles: 0,
    totalArticles: 0,
    totalReports: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/admin/metrics");
        if (res.ok) {
          const json = await res.json();
          setMetrics({
            totalUsers: json.platform?.totalUsers || 0,
            totalProfiles: json.platform?.totalCards || 0,
            pendingVerification: (json.province?.pendingGold || 0) + (json.region?.pending || 0),
            verifiedProfiles: json.province?.goldActive || 0,
            totalArticles: json.platform?.totalArticles || 0,
            totalReports: json.platform?.totalReports || 0,
          });
        }
      } catch (err) {
        console.warn("Failed to load metrics:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-white flex flex-col font-sans selection:bg-[#FF1752]/30 selection:text-white">
      <AdminNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        {/* HERO / WELCOME BANNER */}
        <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0E1322] via-[#0A0D15] to-[#161226] border border-white/10 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF1752]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#FF1752]/20 border border-[#FF1752]/40 text-[#FF4D77] text-[10px] font-mono uppercase font-bold tracking-wider">
                  ESPORT SUMBAR V3
                </span>
                <span className="text-white/40 text-xs font-mono">• Satu Tata Kelola Mandiri</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-black uppercase text-white tracking-tight">
                Dasbor Kontrol Utama Platform
              </h1>
              <p className="text-sm text-white/60 max-w-2xl leading-relaxed">
                Pusat verifikasi satu pintu, tata kelola data ekosistem 7 entitas, katalog game dinamis, dan pemantauan integritas data Sumatera Barat.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/admin/verification"
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-amber-500 hover:from-amber-400 hover:to-amber-500 text-black font-heading font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-950/40 transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Buka Antrean Verifikasi</span>
              </Link>
            </div>
          </div>
        </div>

        {/* SLA ALERT BANNER (IF PENDING VERIFICATION EXISTS) */}
        {metrics.pendingVerification > 0 && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-heading font-bold text-white">
                  Terdapat {metrics.pendingVerification} Pengajuan Menunggu Telaah
                </h4>
                <p className="text-xs text-white/60">
                  Target SLA ESPORT SUMBAR: hijau (&lt; 24 jam), kuning (24-48 jam), merah (&gt; 48 jam). Mohon selesaikan antrean tertua terlebih dahulu.
                </p>
              </div>
            </div>
            <Link
              href="/admin/verification"
              className="px-4 py-2 rounded-xl bg-amber-500 text-black font-heading font-bold text-xs shrink-0 hover:bg-amber-400 transition-colors"
            >
              Tinjau Sekarang &rarr;
            </Link>
          </div>
        )}

        {/* METRICS CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="p-5 rounded-2xl bg-[#0B0E17] border border-white/10 flex flex-col gap-2">
            <div className="flex items-center justify-between text-white/40">
              <span className="text-[11px] font-mono uppercase">Total Akun</span>
              <Users className="w-4 h-4 text-white/60" />
            </div>
            <span className="text-2xl sm:text-3xl font-heading font-black text-white">
              {isLoading ? "..." : metrics.totalUsers}
            </span>
            <span className="text-[10px] text-white/40">Akun terdaftar</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#0B0E17] border border-white/10 flex flex-col gap-2">
            <div className="flex items-center justify-between text-white/40">
              <span className="text-[11px] font-mono uppercase">Total Profil</span>
              <Layers className="w-4 h-4 text-[#FF4D77]" />
            </div>
            <span className="text-2xl sm:text-3xl font-heading font-black text-white">
              {isLoading ? "..." : metrics.totalProfiles}
            </span>
            <span className="text-[10px] text-white/40">1 akun 1 profil</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#0B0E17] border border-amber-500/30 flex flex-col gap-2 bg-gradient-to-b from-amber-500/5 to-transparent">
            <div className="flex items-center justify-between text-amber-400">
              <span className="text-[11px] font-mono uppercase">Antrean Verifikasi</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-2xl sm:text-3xl font-heading font-black text-amber-300">
              {isLoading ? "..." : metrics.pendingVerification}
            </span>
            <span className="text-[10px] text-amber-400/80">Menunggu review</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#0B0E17] border border-emerald-500/30 flex flex-col gap-2 bg-gradient-to-b from-emerald-500/5 to-transparent">
            <div className="flex items-center justify-between text-emerald-400">
              <span className="text-[11px] font-mono uppercase">Terverifikasi</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-2xl sm:text-3xl font-heading font-black text-emerald-300">
              {isLoading ? "..." : metrics.verifiedProfiles}
            </span>
            <span className="text-[10px] text-emerald-400/80">Lencana aktif</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#0B0E17] border border-white/10 flex flex-col gap-2">
            <div className="flex items-center justify-between text-white/40">
              <span className="text-[11px] font-mono uppercase">Warta Berita</span>
              <Newspaper className="w-4 h-4 text-blue-400" />
            </div>
            <span className="text-2xl sm:text-3xl font-heading font-black text-white">
              {isLoading ? "..." : metrics.totalArticles}
            </span>
            <span className="text-[10px] text-white/40">Artikel CMS</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#0B0E17] border border-white/10 flex flex-col gap-2">
            <div className="flex items-center justify-between text-white/40">
              <span className="text-[11px] font-mono uppercase">Laporan</span>
              <Flag className="w-4 h-4 text-rose-400" />
            </div>
            <span className="text-2xl sm:text-3xl font-heading font-black text-white">
              {isLoading ? "..." : metrics.totalReports}
            </span>
            <span className="text-[10px] text-white/40">Aduan komunitas</span>
          </div>
        </div>

        {/* QUICK ACCESS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            href="/admin/verification"
            className="p-6 rounded-3xl bg-[#0A0D15] border border-white/10 hover:border-[#D4AF37]/50 hover:bg-[#0E121E] transition-all group flex flex-col justify-between"
          >
            <div className="flex flex-col gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-black text-lg text-white uppercase group-hover:text-[#D4AF37] transition-colors">
                Antrean Verifikasi
              </h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Pemeriksaan bukti kepemilikan akun in-game, sertifikat turnamen, dan penetapan status lolos verifikasi ESPORT SUMBAR.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-[#D4AF37]">
              <span>Buka Antrean</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/admin/users"
            className="p-6 rounded-3xl bg-[#0A0D15] border border-white/10 hover:border-[#FF1752]/50 hover:bg-[#0E121E] transition-all group flex flex-col justify-between"
          >
            <div className="flex flex-col gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FF1752]/15 border border-[#FF1752]/30 flex items-center justify-center text-[#FF1752] group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-black text-lg text-white uppercase group-hover:text-[#FF4D77] transition-colors">
                Manajemen Pengguna
              </h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Kelola akun pengguna, suspensi profil bermasalah, dan penegakan aturan integritas 1 akun 1 profil.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-[#FF4D77]">
              <span>Kelola Pengguna</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/admin/games"
            className="p-6 rounded-3xl bg-[#0A0D15] border border-white/10 hover:border-blue-500/50 hover:bg-[#0E121E] transition-all group flex flex-col justify-between"
          >
            <div className="flex flex-col gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                <Gamepad2 className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-black text-lg text-white uppercase group-hover:text-blue-400 transition-colors">
                Katalog Game Dinamis
              </h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Atur daftar cabang game (termasuk Honor of Kings & Valorant), role spesifik game, dan tingkatan rank dari database.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-blue-400">
              <span>Atur Katalog</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/admin/audit"
            className="p-6 rounded-3xl bg-[#0A0D15] border border-white/10 hover:border-purple-500/50 hover:bg-[#0E121E] transition-all group flex flex-col justify-between"
          >
            <div className="flex flex-col gap-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                <History className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-black text-lg text-white uppercase group-hover:text-purple-400 transition-colors">
                Audit Log Append-Only
              </h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Rekam jejak transparan seluruh aksi administratif, keputusan verifikasi, perubahan data entitas, dan timestamp.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-purple-400">
              <span>Buka Audit Log</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
