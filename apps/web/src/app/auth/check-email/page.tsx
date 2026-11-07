import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { BrandWatermark } from "@/components/brand";
import { Mail, ArrowLeft, ShieldCheck, HelpCircle, CheckCircle2 } from "lucide-react";
import { GlassSurface } from "@/components/glass/GlassSurface";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassButton } from "@/components/glass/GlassButton";
import { GlassBadge } from "@/components/glass/GlassBadge";

export const metadata: Metadata = {
  title: "Periksa Kotak Masuk Email — ESPORT SUMBAR",
  description: "Silakan buka tautan aktivasi akun yang dikirimkan ke alamat email Anda untuk melanjutkan ke pembuatan kartu atlet digital.",
};

export default function CheckEmailPage() {
  return (
    <div className="relative min-h-screen w-full bg-[#07080C] text-white flex flex-col justify-between p-6 select-none selection:bg-[#D4AF37]/30 selection:text-white">
      {/* Background Watermark Mark */}
      <BrandWatermark opacity={0.03} size={640} position="center" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 w-full max-w-5xl mx-auto flex items-center justify-between pt-2">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-5 w-1.5 shrink-0 rounded-full overflow-hidden">
            <span className="h-1/3 w-full bg-[#C8102E]" />
            <span className="h-1/3 w-full bg-[#D4AF37]" />
            <span className="h-1/3 w-full bg-black" />
          </div>
          <span className="font-heading font-black text-sm tracking-wider text-white group-hover:text-[#D4AF37] transition-colors">
            ESPORT SUMBAR
          </span>
        </Link>
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
        <GlassSurface
          variant="elevated"
          elevation="glass"
          radius="3xl"
          className="p-8 sm:p-10 shadow-2xl flex flex-col items-center text-center gap-6"
        >
          <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 flex items-center justify-center shadow-lg shadow-[#D4AF37]/15">
            <Mail className="w-8 h-8" />
          </div>

          <div>
            <GlassBadge variant="subtle" size="sm" className="mb-2 text-[#D4AF37]">
              Verifikasi Tautan Email
            </GlassBadge>
            <h1 className="text-2xl font-heading font-black text-white uppercase tracking-tight">
              Periksa Inbox Email Anda
            </h1>
            <p className="text-xs text-white/70 mt-2 leading-relaxed">
              Kami telah mengirimkan tautan aktivasi akun ke alamat email Anda. Klik tautan tersebut untuk menyelesaikan proses pendaftaran dan menerbitkan ESPORT ID Anda.
            </p>
          </div>

          {/* Tips Box */}
          <GlassCard variant="thin" elevation="flat" radius="2xl" className="w-full p-4 text-left text-xs text-white/60 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-white/80 font-semibold text-[11px]">
              <HelpCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Belum menerima email aktivasi?</span>
            </div>
            <ul className="list-disc pl-4 space-y-1 text-[11px] text-white/50">
              <li>Periksa folder <strong>Spam / Promosi</strong> di aplikasi email Anda.</li>
              <li>Tautan aktivasi berlaku selama 24 jam ke depan.</li>
              <li>Pastikan penulisan alamat email yang Anda masukkan sudah benar.</li>
            </ul>
          </GlassCard>

          <Link href="/login" className="w-full">
            <GlassButton variant="secondary" size="md" className="w-full font-bold">
              Kembali ke Halaman Masuk
            </GlassButton>
          </Link>
        </GlassSurface>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-[11px] text-white/40 font-mono text-center pb-2">
        ESPORT SUMBAR™ • Sistem Identitas Digital Ranah Minang
      </footer>
    </div>
  );
}
