import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, ChevronRight, FileCheck, AlertTriangle } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BrandWatermark } from "@/components/brand";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan Layanan",
  description:
    "Syarat dan ketentuan resmi penggunaan platform, penerbitan paspor digital ESPORT ID, serta lisensi konten ESPORT SUMBAR™.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[#FFFFFF] flex flex-col font-sans selection:bg-[#FF1752]/30 selection:text-white">
      <Navbar />

      <main className="relative flex-1 max-w-4xl w-full mx-auto px-6 py-12 lg:py-16 overflow-hidden">
        <BrandWatermark opacity={0.04} size={500} position="top-right" />

        <nav className="flex items-center gap-2 text-xs font-mono text-white/40 mb-8">
          <Link href="/" className="hover:text-white transition-colors">
            Beranda
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#FF4D77] font-bold">Syarat &amp; Ketentuan</span>
        </nav>

        <div className="mb-10 pb-8 border-b border-white/[0.08]">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF1752]/10 border border-[#FF1752]/30 text-[11px] font-mono text-[#FF4D77] mb-4">
            <FileCheck className="w-3.5 h-3.5" />
            <span>Ketentuan Penggunaan Platform &amp; Lisensi Digital</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-black text-white uppercase tracking-tight">
            Syarat &amp; Ketentuan Layanan
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-white/50 mt-2 font-mono">
            <span>Penyedia Layanan: <strong>ESPORT SUMBAR™</strong></span>
            <span>•</span>
            <span>Mitra Verifikasi: <strong>ESI Sumbar &amp; Pengcab</strong></span>
            <span>•</span>
            <span>Berlaku sejak: 2026</span>
          </div>
        </div>

        <div className="space-y-8 text-sm leading-relaxed text-white/80">
          {/* Pasal 1: Penyedia Platform & Sifat Layanan */}
          <section className="p-6 rounded-2xl bg-[#0A0A2E] border border-white/10">
            <h2 className="text-lg font-heading font-black text-white uppercase mb-3 flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded bg-[#FF1752] text-white font-mono font-bold">01</span>
              Penyedia Platform &amp; Sifat Layanan
            </h2>
            <p className="text-white/70">
              Platform <strong>ESPORT SUMBAR™</strong> disediakan dan dikelola secara mandiri oleh entitas <strong>ESPORT SUMBAR™</strong> sebagai pangkalan data dan identitas digital esport Sumatera Barat. Lembaga Pengurus Provinsi ESI Sumbar dan Pengurus Cabang ESI Kota/Kabupaten bertindak semata-mata sebagai <strong>Mitra Kelembagaan</strong> untuk memverifikasi data prestasi dan keabsahan atlet.
            </p>
          </section>

          {/* Pasal 2: Paspor Atlet & Integritas Akun */}
          <section className="p-6 rounded-2xl bg-[#0A0A2E] border border-white/10">
            <h2 className="text-lg font-heading font-black text-white uppercase mb-3 flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded bg-[#FF1752] text-white font-mono font-bold">02</span>
              Keabsahan Paspor &amp; Kepemilikan Akun
            </h2>
            <p className="text-white/70">
              Setiap individu hanya diperkenankan memiliki <strong>satu (1) identitas paspor digital resmi (ESPORT ID)</strong>. Pemalsuan identitas, pemalsuan umur, atau penggunaan akun orang lain merupakan pelanggaran yang dapat berakibat penangguhan (*Suspended*) akun pada pangkalan data dan pembatalan status verifikasi.
            </p>
          </section>

          {/* Pasal 3: Hak Kekayaan Intelektual, Merek & Konten */}
          <section className="p-6 rounded-2xl bg-[#0A0A2E] border border-white/10">
            <h2 className="text-lg font-heading font-black text-white uppercase mb-3 flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded bg-[#FF1752] text-white font-mono font-bold">03</span>
              Merek, Hak Cipta &amp; Lisensi Konten
            </h2>
            <div className="space-y-3 text-white/70">
              <p>
                Nama <strong>ESPORT SUMBAR™</strong>, logo mark, logo lockup, tata letak visual, kartu TCG digital, dan kode sistem dilindungi oleh hukum hak kekayaan intelektual Republik Indonesia.
              </p>
              <p>
                Dengan mengunggah foto profil, logo tim, dan riwayat prestasi ke platform ini, pengguna memberikan lisensi terbatas, non-eksklusif, dan bebas royalti kepada ESPORT SUMBAR™ untuk menampilkan konten tersebut pada kartu identitas publik, direktori atlet, dan materi publikasi ekosistem.
              </p>
            </div>
          </section>

          {/* Pasal 4: Status Verifikasi & Masa Berlaku */}
          <section className="p-6 rounded-2xl bg-[#0A0A2E] border border-white/10">
            <h2 className="text-lg font-heading font-black text-white uppercase mb-3 flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded bg-[#22C55E] text-black font-mono font-bold">04</span>
              Status Verifikasi Kelembagaan
            </h2>
            <p className="text-white/70">
              Lencana <em>Regional Checked</em> diterbitkan oleh Pengcab ESI Kota/Kabupaten sesuai domisili atlet. Lencana <em>Verified</em> diterbitkan secara berjenjang oleh Pengprov ESI Sumbar untuk atlet tingkat provinsi. Verifikasi ulang dapat dipicu secara berkala atau ketika terjadi mutasi tim dan perubahan data kependudukan.
            </p>
          </section>

          {/* Pasal 5: Perubahan Ketentuan */}
          <section className="p-6 rounded-2xl bg-[#0A0A2E] border border-white/10">
            <h2 className="text-lg font-heading font-black text-white uppercase mb-3 flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded bg-white text-black font-mono font-bold">05</span>
              Perubahan Ketentuan &amp; Yurisdiksi
            </h2>
            <p className="text-white/70">
              ESPORT SUMBAR™ berhak memperbarui Syarat dan Ketentuan ini dari waktu ke waktu. Syarat dan ketentuan ini diatur dan ditafsirkan berdasarkan hukum Negara Kesatuan Republik Indonesia.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
