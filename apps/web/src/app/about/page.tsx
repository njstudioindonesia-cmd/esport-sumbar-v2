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
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "Mengenal platform ESPORT SUMBAR™, visi ekosistem teknologi data esports Sumatera Barat, dan tata kelola verifikasi mandiri satu pintu.",
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
              PUSAT DATA &amp; IDENTITAS ESPORT{" "}
              <span className="text-[#FF1752] display-skew">SUMATERA BARAT</span>
            </h1>

            <p className="text-sm sm:text-base text-white/70 max-w-2xl leading-relaxed mt-2">
              Membangun fondasi digital yang mandiri, transparan, dan terhubung bagi seluruh atlet, tim, pelatih, komunitas, venue, dan institusi pendidikan di 19 Kota dan Kabupaten Ranah Minang.
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
              <strong className="text-white">ESPORT SUMBAR™</strong> adalah platform teknologi dan basis data esport independen yang berdiri pada tahun 2026. Kami menghadirkan sistem paspor atlet digital (ESPORT ID), direktori ekosistem 7 entitas, serta agregator warta kejuaraan terintegrasi bagi ekosistem esport Sumatera Barat.
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
                  Identitas Digital
                </h3>
                <p className="text-xs text-white/60 leading-relaxed">
                  Penerbitan kartu digital paspor atlet (ESPORT ID) dengan tingkat kelangkaan (rarity) dan nomor seri terdaftar untuk validasi turnamen.
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
                  Sentralisasi data 19 Kota/Kabupaten: profil atlet terverifikasi, klub esport, komunitas akar rumput, dan riwayat prestasi kompetisi.
                </p>
              </div>

              {/* Pilar 3: Media */}
              <div className="p-6 rounded-2xl bg-[#0A0A2E] border border-white/10 hover:border-[#FF1752]/40 transition-colors flex flex-col gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#FF1752]/15 border border-[#FF1752]/30 flex items-center justify-center text-[#FF1752]">
                  <Radio className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-black text-lg text-white uppercase">
                  Publikasi &amp; Ekosistem
                </h3>
                <p className="text-xs text-white/60 leading-relaxed">
                  Pemberitaan warta kejuaraan daerah, liputan turnamen, sorotan talenta berbakat, dan agenda komunitas esports se-Sumatera Barat.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== 3. TATA KELOLA MANDIRI ==================== */}
        <section className="w-full max-w-5xl mx-auto px-6 py-16 border-t border-white/[0.08]">
          <div className="text-center mb-10">
            <span className="text-xs font-mono font-bold tracking-widest text-[#FF4D77] uppercase">
              Prinsip &amp; Tata Kelola
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-black uppercase text-white mt-1">
              Tata Kelola Mandiri ESPORT SUMBAR™
            </h2>
            <p className="text-xs text-white/60 mt-2 max-w-xl mx-auto">
              Komitmen kami dalam mengoperasikan sistem pangkalan data independen berintegritas tinggi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-[#0A0A2E] border border-white/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 pb-4 border-b border-white/10 mb-4 text-[#FF1752]">
                  <ShieldCheck className="w-5 h-5" />
                  <h3 className="font-heading font-black text-lg text-white uppercase">
                    Verifikasi Satu Pintu
                  </h3>
                </div>

                <ul className="space-y-3.5 text-xs text-white/70">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#FF1752] shrink-0 mt-0.5" />
                    <span><strong>Sertifikasi Mandiri:</strong> Verifikasi satu tahap tunggal langsung oleh kurator profesional ESPORT SUMBAR.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#FF1752] shrink-0 mt-0.5" />
                    <span><strong>Kode Sertifikasi Unik:</strong> Setiap profil yang lolos verifikasi memperoleh nomor registrasi resmi format <code>ESP-SB-VER-YYYY-XXXX</code>.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#FF1752] shrink-0 mt-0.5" />
                    <span><strong>Target SLA 24-48 Jam:</strong> Penelaahan berkas bukti in-game dan piagam kompetisi diproses secara cepat dan transparan.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 text-[10px] font-mono text-white/40">
                Standar Verifikasi Profesional
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#0A0A2E] border border-white/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 pb-4 border-b border-white/10 mb-4 text-emerald-400">
                  <Database className="w-5 h-5" />
                  <h3 className="font-heading font-black text-lg text-white uppercase">
                    Kepatuhan UU PDP &amp; Privasi
                  </h3>
                </div>

                <ul className="space-y-3.5 text-xs text-white/70">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Minimisasi Data:</strong> Sistem tidak mengumpulkan data sensitif seperti NIK, foto KTP, maupun nomor KK.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Perlindungan Atlet Pelajar:</strong> Pendaftaran pemain di bawah usia 18 tahun tunduk pada persetujuan orang tua/wali sah.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Pemisahan Data Privat:</strong> Informasi kontak pribadi disimpan dalam enkripsi ketat dan terpisah dari kartu profil publik.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 text-[10px] font-mono text-white/40">
                Kepatuhan UU No. 27 Tahun 2022
              </div>
            </div>
          </div>
        </section>

        {/* ==================== 4. HUBUNGI KAMI ==================== */}
        <section className="w-full max-w-5xl mx-auto px-6 py-16 border-t border-white/[0.08]">
          <div className="p-8 rounded-3xl bg-[#0A0A2E] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xs font-mono font-bold tracking-widest text-[#FF4D77] uppercase">
                Kontak &amp; Kerjasama
              </span>
              <h2 className="text-2xl font-heading font-black uppercase text-white mt-1">
                Terhubung Bersama Kami
              </h2>
              <p className="text-xs text-white/60 mt-1 max-w-md">
                Punya pertanyaan seputar verifikasi profil, penyelenggaraan turnamen, atau integrasi data esport Sumatera Barat?
              </p>
            </div>

            <a
              href="mailto:halo@esportsumbar.com"
              className="btn-brand-primary px-5 py-3 rounded-xl font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-2 shrink-0"
            >
              <Mail className="w-4 h-4" />
              <span>halo@esportsumbar.com</span>
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
