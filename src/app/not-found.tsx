import React from "react";
import Link from "next/link";
import { BrandLogo, BrandWatermark } from "@/components/brand";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative min-h-screen w-full bg-[var(--bg-base)] text-[#FFFFFF] flex flex-col items-center justify-between p-6 overflow-hidden select-none selection:bg-[#FF1752]/30 selection:text-white">
      {/* Background Watermark Mark */}
      <BrandWatermark opacity={0.05} size={680} position="center" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FF1752]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header: Lockup */}
      <header className="relative z-10 w-full max-w-5xl mx-auto flex items-center justify-between pt-4">
        <BrandLogo variant="lockup" size="sm" withLink={true} />
        <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
          Galat 404
        </span>
      </header>

      {/* Center 404 Message */}
      <main className="relative z-10 flex flex-col items-center text-center max-w-md mx-auto my-auto gap-4">
        <span className="text-6xl sm:text-8xl font-heading font-black text-[#FF1752] leading-none display-skew">
          404
        </span>

        <h1 className="text-2xl sm:text-3xl font-heading font-black uppercase text-white tracking-wide">
          Halaman Tidak Ditemukan
        </h1>

        <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
          Tautan yang Anda tuju mungkin telah dipindahkan, dinonaktifkan, atau alamat URL salah ketik.
        </p>

        <div className="pt-2">
          <Link
            href="/"
            className="btn-brand-primary text-xs py-3 px-6"
          >
            <Home className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
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
