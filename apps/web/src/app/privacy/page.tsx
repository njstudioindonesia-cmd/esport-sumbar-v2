import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Lock, ChevronRight, FileText, Mail, Building, CheckCircle2 } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BrandWatermark } from "@/components/brand";

export const metadata: Metadata = {
  title: "Kebijakan Privasi (UU PDP)",
  description:
    "Kebijakan perlindungan data pribadi dan tata kelola informasi pengguna platform ESPORT SUMBAR™ sesuai Undang-Undang Perlindungan Data Pribadi No. 27/2022.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[#FFFFFF] flex flex-col font-sans selection:bg-[#FF1752]/30 selection:text-white">
      <Navbar />

      <main className="relative flex-1 max-w-4xl w-full mx-auto px-6 py-12 lg:py-16 overflow-hidden">
        <BrandWatermark opacity={0.04} size={500} position="top-right" />

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-mono text-white/40 mb-8">
          <Link href="/" className="hover:text-white transition-colors">
            Beranda
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#FF4D77] font-bold">Kebijakan Privasi</span>
        </nav>

        {/* Header */}
        <div className="mb-10 pb-8 border-b border-white/[0.08]">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF1752]/10 border border-[#FF1752]/30 text-[11px] font-mono text-[#FF4D77] mb-4">
            <Lock className="w-3.5 h-3.5" />
            <span>Tata Kelola Pelindungan Data Pribadi</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-black text-white uppercase tracking-tight">
            Kebijakan Privasi &amp; Perlindungan Data
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-white/50 mt-2 font-mono">
            <span>Pengendali Data: <strong>ESPORT SUMBAR™</strong></span>
            <span>•</span>
            <span>Ditinjau hukum: [TENTUKAN]</span>
            <span>•</span>
            <span>Berlaku sejak: 2026</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="space-y-8 text-sm leading-relaxed text-white/80">
          {/* Pasal 1: Pengendali Data & Prinsip */}
          <section className="p-6 rounded-2xl bg-[#0A0A2E] border border-white/10">
            <h2 className="text-lg font-heading font-black text-white uppercase mb-3 flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded bg-[#FF1752] text-white font-mono font-bold">01</span>
              Pengendali Data &amp; Landasan Hukum
            </h2>
            <p className="text-white/70">
              Platform teknologi dan pangkalan data <strong>ESPORT SUMBAR™</strong> dimiliki dan dikendalikan sepenuhnya secara mandiri oleh entitas <strong>ESPORT SUMBAR™</strong> (&ldquo;Kami&rdquo;), bertindak sebagai <strong>Pengendali Data Pribadi Tunggal</strong> sesuai dengan ketentuan <strong>Undang-Undang Republik Indonesia Nomor 27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP)</strong>.
            </p>
          </section>

          {/* Pasal 2: Tata Kelola Mandiri & Pemrosesan Terbatas */}
          <section className="p-6 rounded-2xl bg-[#0A0A2E] border border-white/10">
            <h2 className="text-lg font-heading font-black text-white uppercase mb-3 flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500 text-black font-mono font-bold">02</span>
              Tata Kelola Mandiri &amp; Kerahasiaan Data
            </h2>
            <p className="mb-3 text-white/70">
              ESPORT SUMBAR adalah operator dan pemverifikasi tunggal atas pangkalan data platform.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-white/60">
              <li>
                Sistem tidak menyalin, memperjualbelikan, atau mendistribusikan data pribadi pengguna kepada pihak ketiga tanpa persetujuan eksplisit.
              </li>
              <li>
                Verifikasi keabsahan profil dilakukan langsung satu pintu oleh tim verifikasi internal ESPORT SUMBAR.
              </li>
              <li>
                Dokumen pendukung pengajuan (bukti akun in-game, piagam kejuaraan) diakses melalui tautan aman dengan masa kedaluwarsa singkat (signed URL).
              </li>
            </ul>
          </section>

          {/* Pasal 3: Data yang Dikumpulkan */}
          <section className="p-6 rounded-2xl bg-[#0A0A2E] border border-white/10">
            <h2 className="text-lg font-heading font-black text-white uppercase mb-3 flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded bg-[#FF1752] text-white font-mono font-bold">03</span>
              Minimisasi Data yang Kami Kumpulkan
            </h2>
            <p className="mb-3 text-white/70">
              Sesuai prinsip minimisasi data, sistem tidak mengumpulkan Nomor Induk Kependudukan (NIK), foto KTP/KIA, maupun Kartu Keluarga. Kami hanya memproses data yang esensial untuk penerbitan paspor digital:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-white/60">
              <li>
                <strong>Data Publik Kartu:</strong> Nama tampilan, In-Game Name (IGN), ID Akun Game, Divisi Game, Wilayah domisili, Role/Posisi, dan foto profil.
              </li>
              <li>
                <strong>Data Kontak Terlindungi:</strong> Alamat email dan nomor WhatsApp/kontak yang tersimpan terenkripsi dan tidak dipublikasikan ke publik.
              </li>
              <li>
                <strong>Pembersihan Metadata (EXIF Stripping):</strong> Seluruh foto yang diunggah ke storage sistem secara otomatis dihapus riwayat koordinat GPS dan tipe perangkat demi keamanan privasi.
              </li>
            </ul>
          </section>

          {/* Pasal 4: Perlindungan Anak (<18 Tahun) */}
          <section className="p-6 rounded-2xl bg-[#0A0A2E] border border-[#FF1752]/30">
            <h2 className="text-lg font-heading font-black text-white uppercase mb-3 flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded bg-[#FF1752] text-white font-mono font-bold">04</span>
              Perlindungan Khusus Atlet di Bawah Umur (&lt;18 Tahun)
            </h2>
            <p className="mb-3 text-white/70">
              Sesuai ketentuan perlindungan data anak, pemrosesan data memerlukan persetujuan orang tua atau wali:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-white/60">
              <li>
                Pendaftar berusia di bawah 18 tahun wajib menyertakan nama dan kontak orang tua atau wali sebelum profil aktif.
              </li>
              <li>
                Orang tua atau wali berhak meminta penutupan atau penarikan data publik anak kapan saja melalui kanal kontak platform kami.
              </li>
            </ul>
          </section>

          {/* Pasal 5: Hak Pengguna (Akses, Koreksi, Hapus) */}
          <section className="p-6 rounded-2xl bg-[#0A0A2E] border border-white/10">
            <h2 className="text-lg font-heading font-black text-white uppercase mb-3 flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded bg-white text-black font-mono font-bold">05</span>
              Hak Subjek Data (Hak Pengguna)
            </h2>
            <p className="mb-3 text-white/70">
              Berdasarkan UU PDP, Anda memiliki hak penuh untuk:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-white/60">
              <li><strong>Hak Akses:</strong> Melihat seluruh data pribadi Anda yang tersimpan di sistem melalui menu Pengaturan Akun.</li>
              <li><strong>Hak Koreksi:</strong> Memperbarui data yang tidak akurat atau mengalami perubahan.</li>
              <li><strong>Hak Penghapusan (Right to be Forgotten):</strong> Mengajukan permohonan penutupan akun dan penghapusan data identitas.</li>
            </ul>
          </section>

          {/* Pasal 6: Kontak Penanggung Jawab Data */}
          <section className="p-6 rounded-2xl bg-[#0A0A2E] border border-white/10 flex flex-col gap-3">
            <h2 className="text-lg font-heading font-black text-white uppercase mb-1">
              Petugas Perlindungan Data (DPO)
            </h2>
            <p className="text-xs text-white/60 leading-relaxed">
              Jika Anda memiliki pertanyaan mengenai tata kelola privasi data atau ingin menggunakan hak subjek data Anda, hubungi:
            </p>
            <div className="flex flex-col gap-1.5 text-xs font-mono text-white/80 pt-2 border-t border-white/5">
              <span>Entitas Pengendali: <strong>ESPORT SUMBAR™</strong></span>
              <span>Email: <a href="mailto:privacy@esportsumbar.com" className="text-[#FF4D77] underline">privacy@esportsumbar.com</a></span>
              <span>Wilayah Operasional: Sumatera Barat, Indonesia</span>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
