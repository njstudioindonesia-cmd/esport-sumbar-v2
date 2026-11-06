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
            <span>Penyedia &amp; Pemverifikasi: <strong>ESPORT SUMBAR™</strong></span>
            <span>•</span>
            <span>Ditinjau hukum: [TENTUKAN]</span>
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
              Platform <strong>ESPORT SUMBAR™</strong> disediakan dan dikelola sepenuhnya secara mandiri oleh entitas <strong>ESPORT SUMBAR™</strong> sebagai pangkalan data dan paspor identitas digital esport Sumatera Barat. Seluruh operasional, verifikasi profil, kurasi direktori, dan regulasi platform dijalankan di bawah kendali teknis tunggal ESPORT SUMBAR™.
            </p>
          </section>

          {/* Pasal 2: Aturan 1 Akun 1 Profil & Integritas */}
          <section className="p-6 rounded-2xl bg-[#0A0A2E] border border-white/10">
            <h2 className="text-lg font-heading font-black text-white uppercase mb-3 flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded bg-[#FF1752] text-white font-mono font-bold">02</span>
              Aturan Ketat Satu Akun Satu Profil
            </h2>
            <p className="text-white/70">
              Setiap pengguna hanya diperkenankan mendaftarkan <strong>satu (1) profil entitas bidang</strong> untuk satu akun terdaftar. Pembuatan multi-profil dalam satu akun diblokir oleh sistem. Pemalsuan identitas, manipulasi IGN, joki akun game, atau penggunaan data orang lain merupakan pelanggaran yang dapat berakibat penangguhan (<em>Suspended</em>) akun secara permanen.
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
                Nama <strong>ESPORT SUMBAR™</strong>, logo mark, logo lockup, tata letak visual kartu TCG digital, dan kode sistem dilindungi oleh hukum hak kekayaan intelektual Republik Indonesia.
              </p>
              <p>
                Dengan mengunggah foto profil, logo tim, dan riwayat prestasi ke platform ini, pengguna memberikan lisensi terbatas, non-eksklusif, dan bebas royalti kepada ESPORT SUMBAR™ untuk menampilkan konten tersebut pada kartu identitas publik, direktori ekosistem, dan materi publikasi resmi.
              </p>
            </div>
          </section>

          {/* Pasal 4: Standar Verifikasi Satu Tahap */}
          <section className="p-6 rounded-2xl bg-[#0A0A2E] border border-white/10">
            <h2 className="text-lg font-heading font-black text-white uppercase mb-3 flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500 text-black font-mono font-bold">04</span>
              Standar Verifikasi Tunggal ESPORT SUMBAR
            </h2>
            <p className="text-white/70">
              Verifikasi keabsahan profil entitas dilakukan langsung dalam satu tahap oleh kurator ESPORT SUMBAR. Profil yang memenuhi syarat bukti kepemilikan in-game dan piagam kompetisi akan memperoleh lencana resmi dengan nomor registrasi <strong>ESP-SB-VER-YYYY-XXXX</strong>. Verifikasi ulang dapat dipicu secara berkala atau ketika terjadi perubahan data kunci profil.
            </p>
          </section>

          {/* Pasal 5: Perubahan Ketentuan */}
          <section className="p-6 rounded-2xl bg-[#0A0A2E] border border-white/10">
            <h2 className="text-lg font-heading font-black text-white uppercase mb-3 flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded bg-white text-black font-mono font-bold">05</span>
              Perubahan Ketentuan &amp; Hukum yang Berlaku
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
