"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global admin error caught:", error);
  }, [error]);

  return (
    <html lang="id">
      <body className="min-h-screen bg-[#05051A] text-white flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md bg-[#0C0C26] border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col items-center text-center shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-[#FF1752]/10 border border-[#FF1752]/30 flex items-center justify-center text-[#FF1752] mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <h1 className="text-lg font-bold text-white mb-2">
            Terjadi Kendala Sistem
          </h1>
          <p className="text-xs text-white/50 mb-6 leading-relaxed">
            {error?.message || "Terjadi kesalahan internal pada portal administrator."}
          </p>

          <button
            onClick={() => reset()}
            className="w-full py-2.5 px-4 rounded-xl bg-[#FF1752] hover:bg-[#D90F41] text-white text-xs font-bold transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Muat Ulang Sistem
          </button>
        </div>
      </body>
    </html>
  );
}
