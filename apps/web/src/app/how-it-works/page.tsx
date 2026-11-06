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

export default function HowItWorksPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // FAQ Accordion - Answers STRICTLY <= 2 sentences (Prompt 7)
  const faqs = [
    {
      q: "Apakah data pribadi atlet aman di platform ini?",
      a: "Sistem menerapkan prinsip Privacy by Default sesuai UU PDP No. 27/2022. Seluruh data identitas kependudukan terenkripsi dan tidak pernah diekspos ke publik.",
    },
    {
      q: "Bagaimana perlindungan bagi atlet di bawah 18 tahun?",
      a: "Atlet di bawah umur wajib menyertakan persetujuan orang tua atau wali terdaftar. Profil publik secara otomatis menyembunyikan kontak dan informasi sekolah.",
    },
    {
      q: "Apa perbedaan Frame Rarity dengan Lencana Verifikasi?",
      a: "Frame Rarity menunjukkan tingkatan prestasi kompetitif atlet di platform ESPORT SUMBAR™. Sedangkan Lencana merupakan status pengesahan dari tim kurasi ESPORT SUMBAR.",
    },
    {
      q: "Siapa yang berhak memberikan verifikasi lencana resmi?",
      a: "Verifikasi lencana kartu disetujui berjenjang oleh tata kelola mandiri: Komunitas Esport Kota/Kabupaten sebagai pemeriksa wilayah, dan ESPORT SUMBAR sebagai verifikator provinsi. Platform dikelola independen oleh ESPORT SUMBAR™.",
    },
    {
      q: "Berapa lama masa berlaku lencana verifikasi?",
      a: "Lencana verifikasi berlaku selama 12 bulan sejak tanggal penerbitan. Atlet dapat memperbarui bukti prestasi sebelum masa berlaku berakhir.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#07080C] text-white flex flex-col select-none">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 lg:px-12 py-12">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-[#D4AF37] mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PANDUAN SISTEM TATA KELOLA</span>
          </div>
          <h1 className="text-3xl lg:text-5xl font-heading font-black uppercase text-white tracking-tight">
            Cara Kerja Paspor
          </h1>
        </div>

        {/* ========================================================= */}
        {/* 1. DIAGRAM ALUR 3 LANGKAH                                 */}
        {/* ========================================================= */}
        <section className="mb-20">
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
                title: "Registrasi Paspor",
                desc: "Buat akun atlet resmi dan dapatkan kartu digital Tier 1 Rookie.",
                icon: Trophy,
              },
              {
                step: "02",
                title: "Validasi Daerah",
                desc: "Wilayah Kota/Kabupaten memeriksa identitas domisili dan dokumen.",
                icon: Award,
              },
              {
                step: "03",
                title: "Pengesahan ESPORT SUMBAR",
                desc: "ESPORT SUMBAR menerbitkan lencana resmi bernomor seri nasional.",
                icon: ShieldCheck,
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="p-8 rounded-3xl bg-[#0F1118]/80 border border-white/[0.08] relative overflow-hidden flex flex-col justify-between min-h-[220px] shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-mono font-black text-[#D4AF37]/40">
                      {item.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#D4AF37]">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-heading font-black text-base text-white mb-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-white/50 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================= */}
        {/* 2. TABEL 4 TIER RARITY (KARTU MINI + 1 BARIS KRITERIA)    */}
        {/* ========================================================= */}
        <section className="mb-20">
          <div className="text-center mb-8">
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block mb-1">
              GAMIFIKASI &amp; PRESTASI
            </span>
            <h2 className="text-xl font-heading font-black text-white uppercase tracking-wider">
              Tingkatan Rarity Kartu
            </h2>
          </div>

          <div className="p-6 rounded-3xl bg-[#0F1118]/80 border border-white/[0.08] shadow-2xl overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/[0.08] text-[10px] font-mono uppercase tracking-widest text-white/40">
                  <th className="pb-4 pl-2">Tier Rarity</th>
                  <th className="pb-4">Frame Kartu</th>
                  <th className="pb-4">1 Baris Kriteria</th>
                  <th className="pb-4 text-right pr-2">Otoritas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-xs font-mono">
                {/* TIER 1 */}
                <tr className="hover:bg-white/[0.02]">
                  <td className="py-4 pl-2">
                    <span className="px-2.5 py-1 rounded bg-[#8C5A3C]/20 text-[#E6B89C] font-bold border border-[#8C5A3C]/40">
                      Tier 1 • Rookie
                    </span>
                  </td>
                  <td className="py-4 text-white/70">Bronze Matte Border</td>
                  <td className="py-4 text-white/90">Pendaftaran akun paspor atlet terbit otomatis.</td>
                  <td className="py-4 text-right pr-2 text-white/40">Sistem</td>
                </tr>

                {/* TIER 2 */}
                <tr className="hover:bg-white/[0.02]">
                  <td className="py-4 pl-2">
                    <span className="px-2.5 py-1 rounded bg-slate-500/20 text-[#94A3B8] font-bold border border-slate-500/40">
                      Tier 2 • Contender
                    </span>
                  </td>
                  <td className="py-4 text-white/70">Silver Gloss Border</td>
                  <td className="py-4 text-white/90">Validasi berkas identitas domisili oleh Wilayah Kota/Kab.</td>
                  <td className="py-4 text-right pr-2 text-white/40">Wilayah</td>
                </tr>

                {/* TIER 3 */}
                <tr className="hover:bg-white/[0.02]">
                  <td className="py-4 pl-2">
                    <span className="px-2.5 py-1 rounded bg-[#D4AF37]/20 text-[#D4AF37] font-bold border border-[#D4AF37]/40">
                      Tier 3 • Elite
                    </span>
                  </td>
                  <td className="py-4 text-[#D4AF37]">Gold Mirror &amp; Hologram</td>
                  <td className="py-4 text-white/90">Juara 1-3 Kejurda atau turnamen terverifikasi ESPORT SUMBAR.</td>
                  <td className="py-4 text-right pr-2 text-[#D4AF37] font-bold">ESPORT SUMBAR</td>
                </tr>

                {/* TIER 4 */}
                <tr className="hover:bg-white/[0.02]">
                  <td className="py-4 pl-2">
                    <span className="px-2.5 py-1 rounded bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40">
                      Tier 4 • Legend
                    </span>
                  </td>
                  <td className="py-4 text-purple-400">Crystal Chroma Animated</td>
                  <td className="py-4 text-white/90">Medali PON / Kejurnas atau lisensi kepelatihan nasional.</td>
                  <td className="py-4 text-right pr-2 text-purple-400 font-bold">ESPORT SUMBAR Pusat</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 3. 4 STATUS LENCANA (IKON + 1 KATA)                       */}
        {/* ========================================================= */}
        <section className="mb-20">
          <div className="text-center mb-8">
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block mb-1">
              STATUS KELEMBAGAAN
            </span>
            <h2 className="text-xl font-heading font-black text-white uppercase tracking-wider">
              4 Status Lencana
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Unverified", desc: "Belum diverifikasi", icon: Shield, color: "text-white/40 border-white/10" },
              { label: "Regional", desc: "Pemeriksaan daerah", icon: CheckCircle2, color: "text-[#4C7DFF] border-[#4C7DFF]/30 bg-[#4C7DFF]/5" },
              { label: "Verified", desc: "Disahkan provinsi", icon: ShieldCheck, color: "text-[#D4AF37] border-[#D4AF37]/40 bg-[#D4AF37]/10" },
              { label: "Suspended", desc: "Dibekukan sanksi", icon: AlertTriangle, color: "text-red-400 border-red-500/30 bg-red-500/10" },
            ].map((badge) => {
              const Icon = badge.icon;
              return (
                <div
                  key={badge.label}
                  className={`p-6 rounded-2xl border flex flex-col items-center text-center justify-between min-h-[140px] ${badge.color}`}
                >
                  <Icon className="w-7 h-7" />
                  <div>
                    <span className="font-heading font-black text-sm uppercase block">
                      {badge.label}
                    </span>
                    <span className="text-[10px] font-mono text-white/50 block mt-0.5">
                      {badge.desc}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================= */}
        {/* 4. FAQ AKORDEON (JAWABAN MAKS 2 KALIMAT) & TAUTAN PRIVASI */}
        {/* ========================================================= */}
        <section className="mb-14">
          <div className="text-center mb-8">
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block mb-1">
              PERTANYAAN UMUM
            </span>
            <h2 className="text-xl font-heading font-black text-white uppercase tracking-wider">
              Tanya Jawab Regulasi
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-[#0F1118]/80 border border-white/[0.08] overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between text-xs font-heading font-bold text-white hover:text-[#D4AF37]"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-white/40 transition-transform ${
                      openFaq === idx ? "rotate-180 text-[#D4AF37]" : ""
                    }`}
                  />
                </button>

                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs text-white/70 leading-relaxed border-t border-white/[0.04] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Tautan ke Kebijakan Privasi Lengkap */}
          <div className="mt-8 p-4 rounded-2xl bg-[#161A24] border border-white/[0.08] flex items-center justify-between text-xs">
            <span className="text-white/60">
              Pelajari rincian kepatuhan Undang-Undang Perlindungan Data Pribadi (UU PDP No. 27/2022).
            </span>
            <Link
              href="/privacy"
              className="text-[#D4AF37] font-mono font-bold hover:underline flex items-center gap-1 shrink-0"
            >
              <span>Kebijakan Privasi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
