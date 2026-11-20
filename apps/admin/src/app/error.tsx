"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin runtime error caught by boundary:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#05051A] text-white flex flex-col items-center justify-center p-6 select-none">
      <div className="w-full max-w-md bg-[#0C0C26] border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col items-center text-center shadow-2xl">
        <div className="w-12 h-12 rounded-2xl bg-[#FF1752]/10 border border-[#FF1752]/30 flex items-center justify-center text-[#FF1752] mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h1 className="text-lg font-bold text-white mb-2">
          Terjadi Kendala Memuat Halaman
        </h1>
        <p className="text-xs text-white/50 mb-6 leading-relaxed">
          {error?.message || "Sistem admin mendeteksi ketidaksesuaian data sementara saat memuat antarmuka."}
        </p>

        <div className="flex items-center gap-3 w-full">
          <button
            onClick={() => reset()}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#FF1752] hover:bg-[#D90F41] text-white text-xs font-bold transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Coba Muat Ulang
          </button>
          <Link
            href="/"
            className="py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white text-xs font-medium transition-colors"
          >
            Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
