"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  Sparkles,
  ShieldCheck,
  Shield,
  Award,
  Lock,
  ChevronDown,
  UserCheck,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Clock,
  ArrowRight,
  Trophy,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { GlassSurface } from "@/components/glass/GlassSurface";
import { GlassCard } from "@/components/glass/GlassCard";
import { QuietSurface } from "@/components/glass/QuietSurface";
import { GlassButton } from "@/components/glass/GlassButton";

export default function HowItWorksPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "Apakah data pribadi atlet terlindungi di platform ini?",
      a: "Sistem menerapkan prinsip pelindungan data pribadi terenkripsi. Seluruh data identitas kependudukan tersimpan privat dan tidak pernah diekspos ke publik.",
    },
    {
      q: "Bagaimana perlindungan bagi atlet di bawah 18 tahun?",
      a: "Atlet di bawah umur wajib menyertakan persetujuan orang tua atau wali terdaftar. Profil publik secara otomatis menyembunyikan kontak dan informasi sekolah.",
    },
    {
      q: "Apa perbedaan Frame Rarity dengan Lencana Verifikasi?",
      a: "Frame Rarity menunjukkan tingkatan pencapaian kompetitif atlet di platform ESPORT SUMBAR™. Sedangkan Lencana merupakan tanda status verifikasi berkas dari tim ESPORT SUMBAR.",
    },
    {
      q: "Bagaimana proses verifikasi lencana?",
      a: "Verifikasi kartu dilakukan secara terpusat dalam satu tahap langsung oleh tim kurator ESPORT SUMBAR. Pemilik profil cukup mengunggah bukti identitas dan tangkapan layar akun game untuk ditinjau.",
    },
    {
      q: "Berapa lama masa berlaku lencana verifikasi?",
      a: "Lencana verifikasi berlaku selama 12 bulan sejak tanggal penerbitan. Atlet dapat memperbarui bukti prestasi sebelum masa berlaku berakhir.",
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-white flex flex-col select-none selection:bg-[#FF1752]/30 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-xs font-mono text-[#D4AF37] mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PANDUAN SISTEM TATA KELOLA</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-heading font-black uppercase text-white tracking-tight">
            Cara Kerja Paspor Digital
          </h1>
          <p className="text-xs sm:text-sm text-white/60 mt-2">
            Pedoman lengkap tata kelola identitas digital, lencana tunggal, dan relasi ekosistem.
          </p>
        </div>

        {/* 1. DIAGRAM ALUR 3 LANGKAH */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block mb-1">
              PROSES SISTEMATIS
            </span>
            <h2 className="text-xl font-heading font-black text-white uppercase tracking-wider">
              3 Langkah Kepemilikan Paspor
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {[
              {
                step: "01",
                title: "Registrasi Akun",
                desc: "Daftar akun dan lengkapi profil untuk mendapatkan kartu digital Tier Rookie.",
                icon: Trophy,
              },
              {
                step: "02",
                title: "Unggah Berkas",
                desc: "Unggah bukti identitas dan tangkapan layar akun game untuk verifikasi satu tahap.",
                icon: Award,
              },
              {
                step: "03",
                title: "Verifikasi ESPORT SUMBAR",
                desc: "ESPORT SUMBAR memeriksa berkas dan menerbitkan lencana berformat ESP-SB-VER-YYYY-XXXX.",
                icon: ShieldCheck,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <GlassCard
                  key={item.step}
                  variant="standard"
                  elevation="glass"
                  radius="2xl"
                  specular={true}
                  className="p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-mono font-black text-[#FF1752]">
                        {item.step}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#D4AF37]">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                    <h3 className="text-base font-heading font-black uppercase text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-white/60 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </section>

        {/* 2. FAQ AREA (QUIET SURFACE UNTUK KETERBACAAN TEKS) */}
        <section className="mb-14">
          <div className="text-center mb-8">
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block mb-1">
              INFORMASI PENTING
            </span>
            <h2 className="text-xl font-heading font-black text-white uppercase tracking-wider">
              Pertanyaan yang Sering Diajukan
            </h2>
          </div>

          <QuietSurface elevation="raised" radius="3xl" className="p-6 sm:p-8 space-y-3 border-white/10">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-heading font-bold text-sm text-white hover:text-pink-300 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-white/40 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-pink-300" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-5 pt-1 text-xs text-white/70 leading-relaxed border-t border-white/[0.04]">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </QuietSurface>
        </section>

        {/* 3. CTA */}
        <section className="text-center">
          <Link href="/register">
            <GlassButton variant="primary" size="lg" className="font-heading font-black uppercase tracking-wider">
              <Sparkles className="w-4 h-4 mr-2" />
              <span>Daftarkan Paspor Anda</span>
            </GlassButton>
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
