import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { BrandLogo, BrandWatermark } from "@/components/brand";
import { ShieldAlert, Home, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "403 Akses Dibatasi — ESPORT SUMBAR",
  description: "Anda tidak memiliki wewenang atau hak akses peran yang memadai untuk membuka halaman ini.",
};

export default function ForbiddenPage() {
  return (
    <div className="relative min-h-screen w-full bg-[#07080C] text-white flex flex-col justify-between p-6 select-none selection:bg-[#FF1752]/30 selection:text-white">
      {/* Background Watermark Mark */}
      <BrandWatermark opacity={0.04} size={640} position="center" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FF1752]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 w-full max-w-5xl mx-auto flex items-center justify-between pt-2">
        <BrandLogo variant="lockup" size="sm" withLink={true} />
        <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400">
          Galat 403
        </span>
      </header>

      {/* Main 403 Box */}
      <main className="relative z-10 w-full max-w-md mx-auto my-auto text-center flex flex-col items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center shadow-lg shadow-amber-500/15">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div>
          <span className="text-5xl sm:text-6xl font-heading font-black text-amber-400 leading-none block mb-2 display-skew">
            403
          </span>
          <h1 className="text-2xl font-heading font-black text-white uppercase tracking-tight">
            Akses Dibatasi
          </h1>
          <p className="text-xs text-white/60 mt-2 leading-relaxed max-w-sm">
            Halaman atau tindakan ini dikhususkan untuk Administrator Platform ESPORT SUMBAR. Sesi akun Anda saat ini tidak memiliki hak akses yang mencukupi.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs">
          <Link
            href="/dashboard"
            className="w-full py-3 rounded-xl bg-white/[0.06] hover:bg-white/10 text-white font-mono text-xs flex items-center justify-center gap-2 transition-all border border-white/10"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Ke Dashboard Saya</span>
          </Link>

          <Link
            href="/"
            className="w-full py-3 rounded-xl bg-[#FF1752] hover:bg-[#E01447] text-white font-heading font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#FF1752]/20 transition-all"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Beranda</span>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-[11px] text-white/40 font-mono text-center pb-2">
        ESPORT SUMBAR™ • Sistem Keamanan Otorisasi Terpadu
      </footer>
    </div>
  );
}
