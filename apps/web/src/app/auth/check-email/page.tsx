import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { BrandLogo, BrandWatermark } from "@/components/brand";
import { Mail, ArrowLeft, ShieldCheck, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Periksa Kotak Masuk Email — ESPORT SUMBAR",
  description: "Silakan buka tautan aktivasi akun yang dikirimkan ke alamat email Anda untuk melanjutkan ke pembuatan kartu atlet digital.",
};

export default function CheckEmailPage() {
  return (
    <div className="relative min-h-screen w-full bg-[#07080C] text-white flex flex-col justify-between p-6 select-none selection:bg-[#FF1752]/30 selection:text-white">
      {/* Background Watermark Mark */}
      <BrandWatermark opacity={0.04} size={640} position="center" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FF1752]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 w-full max-w-5xl mx-auto flex items-center justify-between pt-2">
        <BrandLogo variant="lockup" size="sm" withLink={true} />
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Masuk</span>
        </Link>
      </header>

      {/* Main Card Box */}
      <main className="relative z-10 w-full max-w-md mx-auto my-auto">
        <div className="p-8 sm:p-10 rounded-3xl bg-[#0F1118]/90 border border-white/[0.08] backdrop-blur-xl shadow-2xl flex flex-col items-center text-center gap-5">
          <div className="w-16 h-16 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 flex items-center justify-center shadow-lg shadow-[#D4AF37]/15">
            <Mail className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] block mb-1">
              Verifikasi Tautan Email
            </span>
            <h1 className="text-2xl font-heading font-black text-white uppercase tracking-tight">
              Periksa Inbox Email Anda
            </h1>
            <p className="text-xs text-white/70 mt-2 leading-relaxed">
              Kami telah mengirimkan tautan aktivasi akun ke alamat email Anda. Klik tautan tersebut untuk menyelesaikan proses pendaftaran dan menerbitkan ESPORT ID Anda.
            </p>
          </div>

          {/* Tips Box */}
          <div className="w-full p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-left text-xs text-white/60 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-white/80 font-semibold text-[11px]">
              <HelpCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Belum menerima email?</span>
            </div>
            <ul className="list-disc pl-4 space-y-1 text-[11px] text-white/50">
              <li>Periksa folder <strong>Spam / Junk</strong> di aplikasi email Anda.</li>
              <li>Tautan aktivasi berlaku selama 24 jam.</li>
              <li>Pastikan penulisan alamat email Anda sudah tepat.</li>
            </ul>
          </div>

          <div className="pt-2 w-full flex flex-col gap-2">
            <Link
              href="/login"
              className="w-full py-3 rounded-xl bg-white/[0.06] hover:bg-white/10 text-white font-mono text-xs flex items-center justify-center gap-2 transition-all border border-white/10"
            >
              <span>Sudah Konfirmasi? Masuk ke Akun</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-[11px] text-white/40 font-mono text-center pb-2">
        ESPORT SUMBAR™ • Sistem Autentikasi Mandiri
      </footer>
    </div>
  );
}
