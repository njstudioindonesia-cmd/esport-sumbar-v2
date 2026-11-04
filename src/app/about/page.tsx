import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  BrandLogo,
  BrandSlash,
  BrandWatermark,
  OwnershipNote,
  PartnerStrip,
  IssuedBy,
} from "@/components/brand";
import {
  Database,
  Radio,
  CreditCard,
  ShieldCheck,
  Award,
  CheckCircle2,
  Mail,
  MapPin,
  ExternalLink,
  Users,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "Mengenal platform ESPORT SUMBAR™, visi ekosistem teknologi data esports Sumatera Barat, dan struktur kemitraan verifikasi kelembagaan bersama ESI.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[#FFFFFF] flex flex-col font-sans selection:bg-[#FF1752]/30 selection:text-white">
      <Navbar />

      <main className="flex-1 flex flex-col items-center overflow-x-hidden">
        {/* ==================== 1. HERO ==================== */}
        <section className="relative w-full max-w-5xl mx-auto px-6 py-16 md:py-24 flex flex-col items-center text-center">
          <BrandWatermark opacity={0.05} size={560} position="center" />

          <div className="relative z-10 flex flex-col items-center gap-4">
            <BrandLogo variant="lockup" size="lg" withLink={false} />

            <h1 className="text-4xl sm:text-6xl font-heading font-black uppercase text-white tracking-tight mt-2 leading-none">
              PUSAT DATA & IDENTITAS ESPORT{" "}
              <span className="text-[#FF1752] display-skew">SUMATERA BARAT</span>
            </h1>

            <p className="text-sm sm:text-base text-white/70 max-w-2xl leading-relaxed mt-2">
              Membangun fondasi digital yang transparan, modern, dan inklusif bagi seluruh atlet, tim, pelatih, dan komunitas esports di 19 Kota dan Kabupaten Ranah Minang.
            </p>

            <div className="pt-4">
              <IssuedBy variant="badge" />
            </div>
          </div>
        </section>

        <BrandSlash variant="pink" height={36} angle="right" />

        {/* ==================== 2. SIAPA KAMI & TIGA PILAR ==================== */}
        <section className="w-full max-w-5xl mx-auto px-6 py-16 flex flex-col gap-12">
          {/* Siapa Kami */}
          <div className="p-8 rounded-3xl bg-[#0A0A2E] border border-white/10 flex flex-col gap-4">
            <span className="text-xs font-mono font-bold tracking-widest text-[#FF4D77] uppercase">
              Profil Platform
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-black uppercase text-white">
              Siapa Kami
            </h2>
            <p className="text-sm text-white/70 leading-relaxed">
              <strong className="text-white">ESPORT SUMBAR™</strong> adalah platform teknologi dan basis data esport independen yang berdiri pada tahun 2026. Kami menghadirkan sistem paspor atlet digital (ESPORT ID), direktori rekam jejak turnamen, serta agregator warta kejuaraan terintegrasi bagi ekosistem esport Sumatera Barat.
            </p>
          </div>

          {/* Tiga Pilar Utama */}
          <div className="flex flex-col gap-6">
            <div className="text-center">
              <span className="text-xs font-mono font-bold tracking-widest text-[#FF4D77] uppercase">
                Fokus Pengembangan
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading font-black uppercase text-white mt-1">
                Tiga Pilar Utama
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Pilar 1: Identitas */}
              <div className="p-6 rounded-2xl bg-[#0A0A2E] border border-white/10 hover:border-[#FF1752]/40 transition-colors flex flex-col gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#FF1752]/15 border border-[#FF1752]/30 flex items-center justify-center text-[#FF1752]">
                  <CreditCard className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-black text-lg text-white uppercase">
                  Identitas Atlet
                </h3>
                <p className="text-xs text-white/60 leading-relaxed">
                  Penerbitan kartu digital ESPORT ID dengan tingkat kelangkaan (rarity) dan nomor seri terdaftar untuk verifikasi kompetisi.
                </p>
              </div>

              {/* Pilar 2: Data */}
              <div className="p-6 rounded-2xl bg-[#0A0A2E] border border-white/10 hover:border-[#FF1752]/40 transition-colors flex flex-col gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#FF1752]/15 border border-[#FF1752]/30 flex items-center justify-center text-[#FF1752]">
                  <Database className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-black text-lg text-white uppercase">
                  Pusat Data
                </h3>
                <p className="text-xs text-white/60 leading-relaxed">
                  Sentralisasi data 19 Kota/Kabupaten: profil atlet, daftar tim terverifikasi, pelatih berlisensi, dan rekam medali prestasi.
                </p>
              </div>

              {/* Pilar 3: Media */}
              <div className="p-6 rounded-2xl bg-[#0A0A2E] border border-white/10 hover:border-[#FF1752]/40 transition-colors flex flex-col gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#FF1752]/15 border border-[#FF1752]/30 flex items-center justify-center text-[#FF1752]">
                  <Radio className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-black text-lg text-white uppercase">
                  Publikasi Media
                </h3>
                <p className="text-xs text-white/60 leading-relaxed">
                  Pemberitaan warta kejuaraan daerah, liputan turnamen, sorotan atlet binaan, dan agenda komunitas esports se-Sumatera Barat.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== 3. PERAN KAMI VS MITRA (TABEL 2 KOLOM) ==================== */}
        <section className="w-full max-w-5xl mx-auto px-6 py-16 border-t border-white/[0.08]">
          <div className="text-center mb-10">
            <span className="text-xs font-mono font-bold tracking-widest text-[#FF4D77] uppercase">
              Batasan & Pembagian Kerja
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-black uppercase text-white mt-1">
              Peran ESPORT SUMBAR™ vs Mitra Kelembagaan
            </h2>
            <p className="text-xs text-white/60 mt-2 max-w-xl mx-auto">
              Penegasan garis batas antara pengelola platform teknologi mandiri dan pengurus olahraga prestasi kelembagaan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Kolom 1: ESPORT SUMBAR */}
            <div className="p-6 rounded-2xl bg-[#0A0A2E] border border-white/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 pb-4 border-b border-white/10 mb-4 text-[#FF1752]">
                  <Database className="w-5 h-5" />
                  <h3 className="font-heading font-black text-lg text-white uppercase">
                    ESPORT SUMBAR™
                  </h3>
                </div>

                <ul className="space-y-3.5 text-xs text-white/70">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#FF1752] shrink-0 mt-0.5" />
                    <span><strong>Kepemilikan Penuh:</strong> Memiliki dan mengoperasikan platform teknologi esport-sumbar-v2.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#FF1752] shrink-0 mt-0.5" />
                    <span><strong>Penerbit Paspor:</strong> Menerbitkan format kartu digital ESPORT ID dan algoritma kelangkaan.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#FF1752] shrink-0 mt-0.5" />
                    <span><strong>Pengendali Data:</strong> Bertanggung jawab atas penyimpanan, keamanan server, dan hak privasi pengguna (UU PDP).</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#FF1752] shrink-0 mt-0.5" />
                    <span><strong>Media & Komersial:</strong> Mengelola liputan berita, kemitraan sponsor, dan fitur platform umum.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 text-[10px] font-mono text-white/40">
                Penyedia Layanan Teknologi & Merek
              </div>
            </div>

            {/* Kolom 2: Mitra ESI */}
            <div className="p-6 rounded-2xl bg-[#0A0A2E] border border-white/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 pb-4 border-b border-white/10 mb-4 text-[#22C55E]">
                  <ShieldCheck className="w-5 h-5" />
                  <h3 className="font-heading font-black text-lg text-white uppercase">
                    Mitra Kelembagaan (ESI)
                  </h3>
                </div>

                <ul className="space-y-3.5 text-xs text-white/70">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                    <span><strong>Pemeriksaan Daerah:</strong> ESI Kota dan Kabupaten meninjau berkas identitas dan domisili atlet.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                    <span><strong>Lencana Wilayah:</strong> Menerbitkan status keabsahan <em>Regional Checked</em> di yurisdiksinya.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <span><strong>Validasi Provinsi:</strong> Pengprov ESI Sumbar memvalidasi atlet untuk kejuaraan resmi dan lencana <em>Verified</em>.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                    <span><strong>Bukan Pemilik Platform:</strong> Mitra kelembagaan tidak memiliki hak kepemilikan maupun kendali teknis server platform.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 text-[10px] font-mono text-white/40">
                Otoritas Pengesahan Olahraga Prestasi
              </div>
            </div>
          </div>

          <div className="mt-8">
            <OwnershipNote variant="full" withAboutLink={false} />
          </div>
        </section>

        {/* ==================== 4. KONTAK & ALAMAT ==================== */}
        <section className="w-full max-w-5xl mx-auto px-6 py-16 border-t border-white/[0.08]">
          <div className="p-8 rounded-3xl bg-[#0A0A2E] border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-mono font-bold tracking-widest text-[#FF4D77] uppercase">
                Hubungi Kami
              </span>
              <h3 className="text-2xl font-heading font-black uppercase text-white">
                Informasi & Kerjasama
              </h3>
              <p className="text-xs text-white/60 max-w-md leading-relaxed">
                Untuk pertanyaan kemitraan komunitas, verifikasi institusi, atau integrasi data turnamen, hubungi tim kami.
              </p>
            </div>

            <div className="flex flex-col gap-3 text-xs text-white/80 shrink-0">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#FF1752]" />
                <a href="mailto:halo@esportsumbar.com" className="hover:text-white underline">
                  halo@esportsumbar.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-[#FF1752]" />
                <span>Sumatera Barat, Indonesia</span>
              </div>
              <div className="pt-2">
                <Link
                  href="/partners"
                  className="btn-brand-primary text-xs py-2 px-5"
                >
                  <span>Daftar Mitra Kelembagaan</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
