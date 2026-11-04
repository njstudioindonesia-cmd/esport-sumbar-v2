import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BrandWatermark, BrandSlash, OwnershipNote } from "@/components/brand";
import { REGIONS_DETAIL } from "@/data/regions";
import {
  ShieldCheck,
  Award,
  MapPin,
  CheckCircle2,
  Building2,
  Mail,
  ArrowRight,
  Handshake,
  School,
  Trophy,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Mitra Kelembagaan & Kemitraan",
  description:
    "Daftar mitra kelembagaan verifikasi ESI se-Sumatera Barat serta program kemitraan komunitas, venue, dan institusi pendidikan bersama ESPORT SUMBAR™.",
};

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[#FFFFFF] flex flex-col font-sans selection:bg-[#FF1752]/30 selection:text-white">
      <Navbar />

      <main className="flex-1 flex flex-col items-center overflow-x-hidden">
        {/* ==================== 1. HERO ==================== */}
        <section className="relative w-full max-w-5xl mx-auto px-6 py-16 md:py-24 flex flex-col items-center text-center">
          <BrandWatermark opacity={0.05} size={560} position="center" />

          <div className="relative z-10 flex flex-col items-center gap-4">
            <span className="px-3 py-1 rounded-full bg-[#0A0A2E] border border-white/10 text-xs font-mono uppercase tracking-wider text-[#FF4D77] font-bold">
              Kemitraan & Verifikasi
            </span>

            <h1 className="text-4xl sm:text-6xl font-heading font-black uppercase text-white tracking-tight leading-none">
              MITRA KELEMBAGAAN &{" "}
              <span className="text-[#FF1752] display-skew">EKOSISTEM</span>
            </h1>

            <p className="text-sm sm:text-base text-white/70 max-w-2xl leading-relaxed mt-2">
              Kolaborasi strategis antara ESPORT SUMBAR™ dan pengurus ESI di seluruh Sumatera Barat untuk menjamin keabsahan data olahraga prestasi.
            </p>
          </div>
        </section>

        <BrandSlash variant="pink" height={36} angle="right" />

        {/* ==================== 2. PROVINSI LEVEL PARTNER ==================== */}
        <section className="w-full max-w-5xl mx-auto px-6 py-12 flex flex-col gap-6">
          <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3">
            <Award className="w-5 h-5 text-[#D4AF37]" />
            <h2 className="font-heading font-bold text-xl uppercase text-white tracking-wide">
              Mitra Tingkat Provinsi
            </h2>
          </div>

          <div className="p-8 rounded-3xl bg-[#0A0A2E] border border-[#D4AF37]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-lg relative overflow-hidden">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[10px] font-mono font-bold text-[#D4AF37] uppercase">
                  Otoritas Provinsi
                </span>
                <span className="text-xs font-mono text-white/40">Yurisdiksi: Seluruh Sumbar</span>
              </div>
              <h3 className="text-2xl font-heading font-black uppercase text-white">
                Pengurus Provinsi ESI Sumatera Barat (Pengprov ESI Sumbar)
              </h3>
              <p className="text-xs text-white/70 max-w-2xl leading-relaxed">
                Mitra kelembagaan resmi dalam verifikasi rekam jejak turnamen tingkat provinsi, pengesahan atlet Porprov/PON, serta validasi lencana emas <em>Verified</em>.
              </p>
            </div>

            <div className="shrink-0 flex flex-col items-start md:items-end gap-1">
              <span className="px-3 py-1.5 rounded-xl bg-[#22C55E]/15 border border-[#22C55E]/30 text-xs font-mono font-bold text-[#22C55E] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Mitra Verifikasi Aktif</span>
              </span>
              <span className="text-[10px] font-mono text-white/40">Status: Kelembagaan Resmi</span>
            </div>
          </div>
        </section>

        {/* ==================== 3. 19 KOTA & KABUPATEN MITRA ==================== */}
        <section className="w-full max-w-5xl mx-auto px-6 py-12 flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#22C55E]" />
              <h2 className="font-heading font-bold text-xl uppercase text-white tracking-wide">
                19 Pengcab ESI Kota & Kabupaten
              </h2>
            </div>
            <span className="text-xs font-mono text-white/40">Tingkat Wilayah</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {REGIONS_DETAIL.map((region) => (
              <div
                key={region.id}
                className="p-5 rounded-2xl bg-[#0A0A2E] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[9px] font-mono uppercase text-white/60">
                      {region.code}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-[#22C55E]">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Aktif</span>
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-base text-white">
                    ESI {region.name}
                  </h3>
                  <p className="text-[11px] text-white/50 mt-1 line-clamp-2">
                    {region.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-white/40">
                  <span>{region.verifiedCount} Terverifikasi</span>
                  <Link
                    href={`/regions/${region.slug}`}
                    className="text-[#FF4D77] hover:underline"
                  >
                    Profil Wilayah &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ==================== 4. PROGRAM KEMITRAAN BARU (CTA) ==================== */}
        <section className="w-full max-w-5xl mx-auto px-6 py-16 border-t border-white/[0.08]">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-mono font-bold tracking-widest text-[#FF4D77] uppercase">
              Perluas Kolaborasi
            </span>
            <h2 className="text-3xl font-heading font-black uppercase text-white mt-1">
              Bergabung Sebagai Mitra Ekosistem
            </h2>
            <p className="text-xs text-white/60 mt-2">
              Kami membuka peluang kemitraan bagi venue turnamen, institusi pendidikan, komunitas esports, dan sponsor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Mitra Sekolah & Kampus */}
            <div className="p-6 rounded-2xl bg-[#0A0A2E] border border-white/10 flex flex-col justify-between">
              <div>
                <School className="w-6 h-6 text-[#FF4D77] mb-3" />
                <h3 className="font-heading font-bold text-base text-white uppercase">
                  Sekolah & Kampus
                </h3>
                <p className="text-xs text-white/60 mt-1 leading-relaxed">
                  Integrasi ekstrakurikuler esport, pendataan tim perwakilan sekolah, dan beasiswa prestasi atlet muda.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5">
                <a
                  href="mailto:halo@esportsumbar.com?subject=Kemitraan%20Sekolah/Kampus"
                  className="text-xs text-[#FF4D77] hover:underline font-medium flex items-center gap-1"
                >
                  <span>Daftarkan Institusi</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Mitra Gaming Venue */}
            <div className="p-6 rounded-2xl bg-[#0A0A2E] border border-white/10 flex flex-col justify-between">
              <div>
                <MapPin className="w-6 h-6 text-[#22C55E] mb-3" />
                <h3 className="font-heading font-bold text-base text-white uppercase">
                  Gaming Venue & Cafe
                </h3>
                <p className="text-xs text-white/60 mt-1 leading-relaxed">
                  Jadikan lokasi Anda sebagai venue kualifikasi resmi turnamen esport dengan verifikasi fasilitas standar.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5">
                <a
                  href="mailto:halo@esportsumbar.com?subject=Kemitraan%20Venue%20Esport"
                  className="text-xs text-[#22C55E] hover:underline font-medium flex items-center gap-1"
                >
                  <span>Daftarkan Venue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Mitra Sponsor & Industri */}
            <div className="p-6 rounded-2xl bg-[#0A0A2E] border border-white/10 flex flex-col justify-between">
              <div>
                <Handshake className="w-6 h-6 text-[#D4AF37] mb-3" />
                <h3 className="font-heading font-bold text-base text-white uppercase">
                  Sponsor & Brand
                </h3>
                <p className="text-xs text-white/60 mt-1 leading-relaxed">
                  Dukung perkembangan atlet berprestasi Sumatera Barat dan jangkau audiens generasi muda di 19 daerah.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5">
                <a
                  href="mailto:halo@esportsumbar.com?subject=Kerjasama%20Sponsorship"
                  className="text-xs text-[#D4AF37] hover:underline font-medium flex items-center gap-1"
                >
                  <span>Hubungi Hub Komersial</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <OwnershipNote variant="short" />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
