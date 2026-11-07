"use client";

import React from "react";
import Link from "next/link";
import { Wrench, Clock, ShieldCheck, RefreshCw } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-[#07080C] text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900/60 border border-white/10 text-center space-y-6 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
            <Wrench className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white">Pemeliharaan Sistem Terjadwal</h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              Platform ESPORT SUMBAR sedang menjalani peningkatan infrastruktur berkala. Seluruh data dan transaksi aman dalam sistem.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-white/5 text-xs text-slate-300 flex items-center justify-center gap-2">
            <Clock className="w-4 h-4 text-pink-400" />
            <span>Estimasi kembali beroperasi: Segera</span>
          </div>

          <div className="pt-2">
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 rounded-2xl bg-pink-600 hover:bg-pink-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-pink-600/20"
            >
              <RefreshCw className="w-4 h-4" /> Periksa Ulang Status
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
