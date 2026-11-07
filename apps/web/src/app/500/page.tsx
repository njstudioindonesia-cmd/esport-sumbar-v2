"use client";

import React from "react";
import Link from "next/link";
import { ServerCrash, Home, RefreshCw } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function InternalErrorPage() {
  return (
    <div className="min-h-screen bg-[#07080C] text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900/60 border border-white/10 text-center space-y-6 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/20">
            <ServerCrash className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="text-4xl font-extrabold text-white tracking-wider font-mono">500</div>
            <h1 className="text-xl font-bold text-white">Kendala Server Internal</h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              Terjadi kendala teknis saat memproses permintaan Anda. Tim kami telah menerima pemberitahuan otomatis.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => window.location.reload()}
              className="flex-1 py-3 rounded-2xl bg-pink-600 hover:bg-pink-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-pink-600/20"
            >
              <RefreshCw className="w-4 h-4" /> Muat Ulang
            </button>
            <Link
              href="/"
              className="flex-1 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-xs flex items-center justify-center gap-2 transition-colors border border-white/10"
            >
              <Home className="w-4 h-4" /> Beranda
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
