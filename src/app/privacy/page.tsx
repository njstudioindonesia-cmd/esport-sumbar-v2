import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Lock, ChevronRight, FileText, Mail, Phone, Building } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Kebijakan Privasi (UU PDP No. 27/2022) | PBESI Sumatera Barat",
  description:
    "Kebijakan perlindungan data pribadi dan tata kelola informasi atlet digital PBESI Sumatera Barat sesuai Undang-Undang Perlindungan Data Pribadi.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#07080C] text-[#F3F4F6] flex flex-col font-sans selection:bg-[#D4AF37]/20 selection:text-[#D4AF37]">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 lg:py-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-mono text-white/40 mb-8">
          <Link href="/" className="hover:text-white transition-colors">
            Beranda
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#D4AF37] font-bold">Kebijakan Privasi</span>
        </nav>

        {/* Header */}
        <div className="mb-10 pb-8 border-b border-white/[0.08]">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[11px] font-mono text-[#D4AF37] mb-4">
            <Lock className="w-3.5 h-3.5" />
            <span>Kepatuhan UU No. 27 Tahun 2022 (UU PDP)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-black text-white uppercase tracking-tight">
            Kebijakan Privasi &amp; Perlindungan Data
          </h1>
          <p className="text-sm text-white/60 mt-2 font-mono">
            Terakhir Diperbarui: 4 November 2026 • Pengurus Provinsi Esports Indonesia (PBESI) Sumatera Barat
          </p>
        </div>

        {/* Content Body */}
        <div className="space-y-8 text-sm leading-relaxed text-white/80">
          {/* Pasal 1 */}
          <section className="p-6 rounded-2xl bg-[#0F1118] border border-white/[0.08]">
            <h2 className="text-lg font-heading font-black text-[#D4AF37] uppercase mb-3 flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] font-mono">01</span>
              Prinsip &amp; Landasan Hukum
            </h2>
            <p>
              Pengurus Provinsi Esports Indonesia Sumatera Barat (&ldquo;PBESI Sumbar&rdquo;) berkomitmen menjamin hak privasi setiap pengguna, atlet, pelatih, wasit, dan pegiat ekosistem esport digital. Pemrosesan data pribadi pada platform <strong>ESPORT SUMBAR</strong> dilaksanakan berdasarkan asas keabsahan, transparansi, pembatasan tujuan, serta integritas data sesuai ketentuan <strong>Undang-Undang Republik Indonesia Nomor 27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP)</strong>.
            </p>
          </section>

          {/* Pasal 2 */}
          <section className="p-6 rounded-2xl bg-[#0F1118] border border-white/[0.08]">
            <h2 className="text-lg font-heading font-black text-[#D4AF37] uppercase mb-3 flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] font-mono">02</span>
              Data yang Kami Kumpulkan
            </h2>
            <p className="mb-3">
              Kami hanya mengumpulkan data yang relevan dan dibutuhkan untuk penerbitan paspor digital resmi:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-white/70">
              <li>
                <strong>Data Publik Profil:</strong> Nama tampilan, In-Game Name (IGN), ID Game, Wilayah Pengcab, Divisi Game Utama, Role/Posisi, dan foto profil yang telah disetujui untuk ditampilkan publik.
              </li>
              <li>
                <strong>Data Privat / Administratif:</strong> Alamat email akun, nomor telepon/WhatsApp, dokumen bukti kependudukan atau kartu pelajar, serta riwayat peninjauan verifikasi. Data ini <em>tidak pernah dibagikan kepada publik</em>.
              </li>
              <li>
                <strong>Pembersihan Metadata (EXIF/GPS):</strong> Setiap foto yang diunggah ke peladen kami secara otomatis dihapus seluruh riwayat koordinat GPS, jenis kamera, dan metadata waktu demi keamanan lokasi pengguna.
              </li>
            </ul>
          </section>

          {/* Pasal 3 - Khusus Anak */}
          <section className="p-6 rounded-2xl bg-[#D4AF37]/5 border border-[#D4AF37]/30">
            <h2 className="text-lg font-heading font-black text-[#D4AF37] uppercase mb-3 flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded bg-[#D4AF37] text-black font-mono font-bold">03</span>
              Perlindungan Khusus Atlet di Bawah Umur (&lt;18 Tahun)
            </h2>
            <p className="mb-3">
              Berdasarkan Pasal 25 UU PDP, data anak merupakan data pribadi yang memerlukan perlindungan khusus:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-white/70">
              <li>
                Setiap atlet berusia di bawah 18 tahun <strong>wajib memperoleh persetujuan tertulis dari orang tua atau wali sah</strong> sebelum kartu paspor digital diterbitkan.
              </li>
              <li>
                Foto profil atlet pelajar secara default disamarkan menggunakan inisial gradien Marawa kecuali orang tua/wali memberikan izin khusus publikasi foto.
              </li>
              <li>
                Direktori sekolah <strong>tidak pernah mempublikasikan daftar nama siswa individu</strong> untuk mencegah penyalahgunaan data anak.
              </li>
            </ul>
          </section>

          {/* Pasal 4 */}
          <section className="p-6 rounded-2xl bg-[#0F1118] border border-white/[0.08]">
            <h2 className="text-lg font-heading font-black text-[#D4AF37] uppercase mb-3 flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] font-mono">04</span>
              Tujuan Pemrosesan Data
            </h2>
            <p>Data pribadi yang dikumpulkan digunakan semata-mata untuk:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-white/70">
              <li>Penerbitan kode unik ESPORT ID resmi Sumatera Barat.</li>
              <li>Verifikasi berkas atlet dan klub untuk keikutsertaan turnamen resmi (Porprov, Kejurda, PON).</li>
              <li>Pencatatan riwayat prestasi dan gamifikasi kartu TCG Ranah Minang.</li>
              <li>Pencegahan kecurangan kompetisi, pemalsuan identitas atlet, dan joki turnamen.</li>
            </ul>
          </section>

          {/* Pasal 5 */}
          <section className="p-6 rounded-2xl bg-[#0F1118] border border-white/[0.08]">
            <h2 className="text-lg font-heading font-black text-[#D4AF37] uppercase mb-3 flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] font-mono">05</span>
              Hak-Hak Subjek Data (Pengguna)
            </h2>
            <p>Sesuai UU PDP, Anda memiliki hak penuh untuk:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-white/70">
              <li>Mengakses dan memperbarui informasi identitas digital Anda sewaktu-waktu.</li>
              <li>Mengatur visibilitas data pribadi melalui menu Pengaturan Privasi (`/me/privacy`).</li>
              <li>Mengajukan permohonan penghapusan akun dan data pribadi (*Right to Erasure*).</li>
              <li>Menarik kembali persetujuan pemrosesan data dengan konsekuensi pencabutan lisensi kompetisi aktif.</li>
            </ul>
          </section>

          {/* Kontak Penanggung Jawab */}
          <section className="p-6 rounded-2xl bg-[#0F1118] border border-white/[0.08]">
            <h2 className="text-lg font-heading font-black text-[#D4AF37] uppercase mb-4">
              Pejabat Perlindungan Data (Data Protection Officer)
            </h2>
            <p className="text-white/70 mb-4">
              Jika Anda memiliki pertanyaan, keluhan, atau ingin menggunakan hak-hak perlindungan data pribadi Anda, silakan hubungi kami:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#D4AF37]" />
                <div>
                  <span className="text-white/40 block">Email Resmi DPO</span>
                  <span className="text-white font-bold">dpo@esportsumbar.id</span>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-3">
                <Building className="w-4 h-4 text-[#D4AF37]" />
                <div>
                  <span className="text-white/40 block">Sekretariat Pengprov</span>
                  <span className="text-white font-bold">GOR H. Agus Salim, Kota Padang</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
