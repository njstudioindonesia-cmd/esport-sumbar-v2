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
import { GlassSurface } from "@/components/glass/GlassSurface";
import { GlassCard } from "@/components/glass/GlassCard";
import { QuietSurface } from "@/components/glass/QuietSurface";
import { GlassButton } from "@/components/glass/GlassButton";

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
        <section className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20 flex flex-col items-center text-center">
          <BrandWatermark opacity={0.04} size={560} position="center" />

          <div className="relative z-10 flex flex-col items-center gap-4">
            <BrandLogo variant="lockup" size="lg" withLink={false} />

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-black uppercase text-white tracking-tight mt-2 leading-none">
              PUSAT DATA &amp; IDENTITAS ESPORT{" "}
              <span className="text-[#FF1752] display-skew inline-block">SUMATERA BARAT</span>
            </h1>

            <p className="text-sm sm:text-base text-white/70 max-w-2xl leading-relaxed mt-2">
              Membangun fondasi digital yang mandiri, transparan, dan terhubung bagi seluruh atlet, tim, pelatih, komunitas, venue, dan institusi pendidikan di 19 Kota dan Kabupaten Ranah Minang.
            </p>

            <div className="pt-2">
              <IssuedBy variant="badge" />
            </div>
          </div>
        </section>

        <BrandSlash variant="pink" height={36} angle="right" />

        {/* ==================== 2. SIAPA KAMI & TIGA PILAR (QUIET SURFACE BACA NYAMAN) ==================== */}
        <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-14 flex flex-col gap-10">
          {/* Siapa Kami */}
          <QuietSurface elevation="raised" radius="3xl" className="p-6 sm:p-10 flex flex-col gap-3 border-white/10">
            <span className="text-xs font-mono font-bold tracking-widest text-[#FF4D77] uppercase">
              Profil Platform
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-black uppercase text-white">
              Siapa Kami
            </h2>
            <p className="text-sm text-white/80 leading-relaxed">
              <strong className="text-white">ESPORT SUMBAR™</strong> adalah platform teknologi dan basis data esport independen yang berdiri pada tahun 2026. Kami menghadirkan sistem paspor atlet digital (ESPORT ID), direktori ekosistem 7 entitas, serta agregator warta kejuaraan terintegrasi bagi ekosistem esport Sumatera Barat.
            </p>
          </QuietSurface>

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
              <GlassCard variant="standard" elevation="glass" radius="2xl" className="p-6 flex flex-col gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#FF1752]/15 border border-[#FF1752]/30 flex items-center justify-center text-[#FF1752]">
                  <CreditCard className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-black text-lg text-white uppercase">
                  Identitas Digital
                </h3>
                <p className="text-xs text-white/60 leading-relaxed">
                  Penerbitan kartu digital paspor atlet (ESPORT ID) dengan tingkat kelangkaan (rarity) dan nomor registrasi terdaftar untuk validasi turnamen.
                </p>
              </GlassCard>

              {/* Pilar 2: Ekosistem */}
              <GlassCard variant="standard" elevation="glass" radius="2xl" className="p-6 flex flex-col gap-3">
                <div className="w-12 h-12 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
                  <Database className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-black text-lg text-white uppercase">
                  Pusat Basis Data
                </h3>
                <p className="text-xs text-white/60 leading-relaxed">
                  Menyimpan rekam jejak, histori tim, dan data keterhubungan antar-entitas esport secara terstruktur di 19 Kota dan Kabupaten se-Sumatera Barat.
                </p>
              </GlassCard>

              {/* Pilar 3: Verifikasi */}
              <GlassCard variant="standard" elevation="glass" radius="2xl" className="p-6 flex flex-col gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-black text-lg text-white uppercase">
                  Verifikasi Tunggal
                </h3>
                <p className="text-xs text-white/60 leading-relaxed">
                  Layanan kurasi bukti mandiri satu pintu berstandar ketat guna memvalidasi data atlet, tim, dan staf manajemen bebas dari manipulasi data.
                </p>
              </GlassCard>
            </div>
          </div>
        </section>

        {/* ==================== 3. CALL TO ACTION ==================== */}
        <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-12 mb-8">
          <GlassSurface
            variant="elevated"
            elevation="glass"
            radius="3xl"
            specular={true}
            className="p-8 sm:p-12 text-center border-white/15"
          >
            <h2 className="text-2xl sm:text-4xl font-heading font-black uppercase text-white tracking-tight mb-3">
              Mari Berkolaborasi Membangun Ekosistem
            </h2>
            <p className="text-xs sm:text-sm text-white/70 max-w-xl mx-auto mb-6">
              Daftarkan diri, tim, komunitas, atau institusi Anda sekarang untuk menjadi bagian dari peta data esport Sumatera Barat.
            </p>
            <Link href="/register">
              <GlassButton variant="primary" size="lg" className="font-heading font-black uppercase tracking-wider">
                <Sparkles className="w-4 h-4 mr-2" />
                <span>Mulai Pendaftaran</span>
              </GlassButton>
            </Link>
          </GlassSurface>
        </section>
      </main>

      <Footer />
    </div>
  );
}
