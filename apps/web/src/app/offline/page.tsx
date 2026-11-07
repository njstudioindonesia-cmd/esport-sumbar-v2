"use client";

import React from "react";
import Link from "next/link";
import { BrandLogo, BrandWatermark } from "@/components/brand";
import { WifiOff, RefreshCw, CreditCard } from "lucide-react";

export default function OfflinePage() {
  const handleReload = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#07080C] text-white flex flex-col justify-between p-6 select-none selection:bg-[#FF1752]/30 selection:text-white">
      {/* Background Watermark Mark */}
      <BrandWatermark opacity={0.04} size={640} position="center" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FF1752]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 w-full max-w-5xl mx-auto flex items-center justify-between pt-2">
        <BrandLogo variant="lockup" size="sm" withLink={true} />
        <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
          Mode Luring (Offline)
        </span>
      </header>

      {/* Main Offline Box */}
      <main className="relative z-10 w-full max-w-md mx-auto my-auto text-center flex flex-col items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-white/[0.05] text-white/60 border border-white/10 flex items-center justify-center shadow-lg">
          <WifiOff className="w-8 h-8" />
        </div>

        <div>
          <h1 className="text-2xl font-heading font-black text-white uppercase tracking-tight">
            Koneksi Internet Terputus
          </h1>
          <p className="text-xs text-white/60 mt-2 leading-relaxed max-w-sm">
            Perangkat Anda sedang tidak terhubung ke jaringan internet. Anda tetap dapat melihat kartu identitas digital yang telah tersimpan di memori cache perangkat.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs">
          <button
            type="button"
            onClick={handleReload}
            className="w-full py-3 rounded-xl bg-[#FF1752] hover:bg-[#E01447] text-white font-heading font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#FF1752]/20 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Coba Hubungkan Ulang</span>
          </button>

          <Link
            href="/me/cards"
            className="w-full py-3 rounded-xl bg-white/[0.06] hover:bg-white/10 text-white font-mono text-xs flex items-center justify-center gap-2 transition-all border border-white/10"
          >
            <CreditCard className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Buka Kartu Tersimpan</span>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-[11px] text-white/40 font-mono text-center pb-2">
        ESPORT SUMBAR™ • Kemampuan Luring Progressive Web App (PWA)
      </footer>
    </div>
  );
}
