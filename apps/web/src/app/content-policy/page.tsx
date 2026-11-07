import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ShieldAlert, FileText, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Kebijakan Konten & Pedoman UGC — ESPORT SUMBAR",
  description: "Kebijakan konten buatan pengguna (UGC), larangan klaim sepihak, dan pedoman integritas komunitas ESPORT SUMBAR.",
};

export default function ContentPolicyPage() {
  return (
    <div className="min-h-screen bg-[#07080C] text-white flex flex-col selection:bg-[#FF1752]/30 selection:text-white">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-white/50 mb-6">
          <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
          <span>/</span>
          <span className="text-[#FF1752]">Kebijakan Konten</span>
        </div>

        {/* Hero */}
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF1752]/10 border border-[#FF1752]/30 text-xs font-mono text-[#FF4D77] mb-4">
            <FileText className="w-3.5 h-3.5" />
            <span>Pedoman Pengguna v3.0</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-heading font-black uppercase tracking-tight text-white mb-4">
            Kebijakan Konten &amp; Integritas Platform
          </h1>
          <p className="text-sm sm:text-base text-white/70 leading-relaxed">
            Standar perilaku, ketentuan konten buatan pengguna (User Generated Content / UGC), serta mekanisme moderasi dalam ekosistem ESPORT SUMBAR™.
          </p>
        </header>

        {/* Policy Sections */}
        <div className="flex flex-col gap-8 text-sm text-white/80 leading-relaxed">
          {/* Section 1 */}
          <section className="p-6 rounded-2xl bg-[#0F1118] border border-white/[0.08] flex flex-col gap-3">
            <h2 className="text-lg font-heading font-black text-white uppercase tracking-wide flex items-center gap-2">
              <span className="text-[#FF1752]">1.</span> Prinsip Konten Mandiri (UGC)
            </h2>
            <p>
              Seluruh teks bio, nama tim, logo organisasi, foto profil, dan rekam jejak kejuaraan yang dimasukkan oleh pengguna ke dalam platform merupakan konten buatan pengguna (User Generated Content). Pengguna bertanggung jawab penuh atas kebenaran, kepemilikan hak cipta, dan dampak hukum dari materi yang diunggah.
            </p>
          </section>

          {/* Section 2 */}
          <section className="p-6 rounded-2xl bg-[#0F1118] border border-white/[0.08] flex flex-col gap-3">
            <h2 className="text-lg font-heading font-black text-white uppercase tracking-wide flex items-center gap-2">
              <span className="text-[#FF1752]">2.</span> Larangan Klaim Representasi Sepihak
            </h2>
            <p>
              Pengguna dilarang keras mengaku mewakili, mengatasnamakan, atau menyematkan sebutan organisasi luar, asosiasi lain, atau entitas hukum pihak ketiga dalam bio, nama profil, atau nama turnamen tanpa adanya mandat tertulis yang valid dan dapat diverifikasi.
            </p>
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-start gap-3 mt-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                Penyalahgunaan nama institusi atau klaim sepihak yang menyesatkan publik dapat mengakibatkan pencabutan status verifikasi dan penonaktifan akun secara permanen.
              </span>
            </div>
          </section>

          {/* Section 3 */}
          <section className="p-6 rounded-2xl bg-[#0F1118] border border-white/[0.08] flex flex-col gap-3">
            <h2 className="text-lg font-heading font-black text-white uppercase tracking-wide flex items-center gap-2">
              <span className="text-[#FF1752]">3.</span> Perlindungan Atlet di Bawah Umur
            </h2>
            <p>
              Untuk atlet berusia di bawah 18 tahun, pendaftaran profil wajib menyertakan persetujuan tertulis dari orang tua atau wali. Platform secara default menyembunyikan foto profil publik dan kontak anak guna mematuhi standar perlindungan data pribadi dan keselamatan anak di ruang digital.
            </p>
          </section>

          {/* Section 4 */}
          <section className="p-6 rounded-2xl bg-[#0F1118] border border-white/[0.08] flex flex-col gap-3">
            <h2 className="text-lg font-heading font-black text-white uppercase tracking-wide flex items-center gap-2">
              <span className="text-[#FF1752]">4.</span> Hak Moderasi &amp; Penangguhan
            </h2>
            <p>
              Administrator ESPORT SUMBAR memiliki wewenang diskresioner penuh untuk:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-white/70">
              <li>Meninjau dan menolak pengajuan verifikasi yang tidak memenuhi kriteria integritas data.</li>
              <li>Menyembunyikan profil publik atau turnamen yang memuat konten perjudian, ujaran kebencian, atau pornografi.</li>
              <li>Menangguhkan (<em>suspend</em>) akun yang terbukti melakukan manipulasi data identitas atau kecurangan kompetisi.</li>
            </ul>
          </section>

          {/* Section 5: Pelaporan */}
          <section className="p-6 rounded-2xl bg-gradient-to-r from-[#FF1752]/10 via-[#0F1118] to-transparent border border-[#FF1752]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-heading font-bold text-white text-base">
                Menemukan Konten yang Melanggar Pedoman?
              </h3>
              <p className="text-xs text-white/60 mt-1">
                Kirimkan laporan pelanggaran kepada tim moderasi kami dengan melampirkan tautan profil atau bukti tangkapan layar.
              </p>
            </div>
            <Link
              href="/contact"
              className="px-5 py-2.5 rounded-xl bg-[#FF1752] hover:bg-[#E01447] text-white font-heading font-black text-xs uppercase tracking-wider flex items-center gap-2 shrink-0 transition-all shadow-md shadow-[#FF1752]/20"
            >
              <span>Laporkan Pelanggaran</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
