"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { BrandLogo, BrandWatermark } from "@/components/brand";
import { RefreshCw, Home, AlertOctagon } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global application error caught by boundary:", error);
  }, [error]);

  return (
    <div className="relative min-h-screen w-full bg-[var(--bg-base)] text-[#FFFFFF] flex flex-col items-center justify-between p-6 overflow-hidden select-none selection:bg-[#FF1752]/30 selection:text-white">
      {/* Background Watermark Mark */}
      <BrandWatermark opacity={0.05} size={680} position="center" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FF1752]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header: Lockup */}
      <header className="relative z-10 w-full max-w-5xl mx-auto flex items-center justify-between pt-4">
        <BrandLogo variant="lockup" size="sm" withLink={true} />
        <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
          Galat Sistem
        </span>
      </header>

      {/* Center Error Message */}
      <main className="relative z-10 flex flex-col items-center text-center max-w-md mx-auto my-auto gap-4">
        <div className="w-16 h-16 rounded-full bg-[#FF1752]/10 border border-[#FF1752]/30 flex items-center justify-center text-[#FF1752] mb-2 shadow-lg shadow-[#FF1752]/20">
          <AlertOctagon className="w-8 h-8" />
        </div>

        <span className="text-3xl sm:text-4xl font-heading font-black text-white leading-none">
          Terjadi Gangguan Sistem
        </span>

        <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
          Sistem mengalami kendala tak terduga saat memuat data. Silakan coba muat ulang halaman atau kembali ke beranda.
        </p>

        {error.digest && (
          <div className="p-2 px-3 rounded-lg bg-white/[0.04] border border-white/10 text-[10px] font-mono text-white/40">
            Kode Pelacakan: {error.digest}
          </div>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="btn-brand-primary text-xs py-2.5 px-5 flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Muat Ulang</span>
          </button>

          <Link
            href="/"
            className="btn-brand-secondary text-xs py-2.5 px-5 flex items-center gap-2"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Beranda</span>
          </Link>
        </div>
      </main>

      {/* Footer Note */}
      <footer className="relative z-10 text-[11px] text-white/40 font-mono text-center pb-4">
        ESPORT SUMBAR™ • Pusat Data & Identitas Atlet
      </footer>
    </div>
  );
}
