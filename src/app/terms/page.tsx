import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, ChevronRight, FileCheck, AlertTriangle } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan Lisensi Atlet | PBESI Sumatera Barat",
  description:
    "Syarat dan ketentuan resmi penerbitan paspor digital atlet, lisensi kompetisi, dan tata tertib bertanding PBESI Sumatera Barat.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#07080C] text-[#F3F4F6] flex flex-col font-sans selection:bg-[#D4AF37]/20 selection:text-[#D4AF37]">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 lg:py-16">
        <nav className="flex items-center gap-2 text-xs font-mono text-white/40 mb-8">
          <Link href="/" className="hover:text-white transition-colors">
            Beranda
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#D4AF37] font-bold">Syarat &amp; Ketentuan</span>
        </nav>

        <div className="mb-10 pb-8 border-b border-white/[0.08]">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-[11px] font-mono text-blue-400 mb-4">
            <FileCheck className="w-3.5 h-3.5" />
            <span>Tata Tertib Atlet &amp; Lisensi Digital PBESI</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-black text-white uppercase tracking-tight">
            Syarat &amp; Ketentuan Penggunaan
          </h1>
          <p className="text-sm text-white/60 mt-2 font-mono">
            Ketentuan Resmi Pengurus Provinsi Esports Indonesia Sumatera Barat
          </p>
        </div>

        <div className="space-y-8 text-sm leading-relaxed text-white/80">
          <section className="p-6 rounded-2xl bg-[#0F1118] border border-white/[0.08]">
            <h2 className="text-lg font-heading font-black text-[#D4AF37] uppercase mb-3">
              1. Keabsahan Paspor &amp; Kepemilikan Akun
            </h2>
            <p>
              Setiap individu hanya diperkenankan memiliki <strong>satu (1) identitas paspor atlet resmi</strong>. Penggunaan identitas palsu, pemalsuan umur, atau pendaftaran ganda menggunakan data orang lain merupakan pelanggaran berat terhadap Kode Etik PBESI dan dapat berakibat pembekuan akun (*Blacklist*) permanen di seluruh turnamen resmi Sumatera Barat.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-[#0F1118] border border-white/[0.08]">
            <h2 className="text-lg font-heading font-black text-[#D4AF37] uppercase mb-3">
              2. Masa Berlaku &amp; Verifikasi Ulang
            </h2>
            <p>
              Status lencana <strong>Terverifikasi (Lencana Emas)</strong> berlaku selama <strong>12 bulan (1 tahun)</strong> terhitung sejak tanggal persetujuan oleh Pengurus Provinsi ESI Sumatera Barat. Verifikasi ulang otomatis dipicu apabila atlet melakukan pergantian nama tampilan resmi, perpindahan domisili wilayah Pengcab, atau mutasi klub resmi.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-[#0F1118] border border-white/[0.08]">
            <h2 className="text-lg font-heading font-black text-[#D4AF37] uppercase mb-3">
              3. Sportivitas &amp; Kode Etik Bertanding
            </h2>
            <p>
              Pemegang paspor digital atlet PBESI Sumbar wajib menjunjung tinggi nilai integritas, sportivitas, dan rasa hormat (*fair play*). Segala bentuk tindakan curang (*cheating*, *map hack*, *joki akun*, penggunaan program pihak ketiga tak resmi), ujaran kebencian, pelecehan, atau perilaku tidak terpuji akan berakibat pada status **Suspended** pada kartu TCG dan pencabutan hak tanding.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-[#0F1118] border border-white/[0.08]">
            <h2 className="text-lg font-heading font-black text-[#D4AF37] uppercase mb-3">
              4. Perlindungan Data &amp; Hak Cipta
            </h2>
            <p>
              Logo PBESI Sumatera Barat, elemen visual Marawa, dan desain kartu TCG dilindungi oleh hak kekayaan intelektual. Paspor digital dapat dibagikan secara bebas oleh pemiliknya untuk keperluan profil atlet dan pencarian tim, namun dilarang keras untuk dikomersialisasikan tanpa izin resmi Pengprov ESI Sumbar.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
