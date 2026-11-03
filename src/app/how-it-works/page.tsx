"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  Sparkles,
  ShieldCheck,
  Award,
  Lock,
  ChevronDown,
  UserCheck,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  MapPin,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function HowItWorksPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "Apakah data pribadi dan privasi saya aman di ESPORT SUMBAR?",
      a: "Sangat aman. Platform kami dirancang dengan prinsip Privacy by Default sesuai Undang-Undang Perlindungan Data Pribadi (UU PDP). Kami tidak pernah meminta NIK atau foto KTP fisik. Bukti identitas cukup kartu pelajar/mahasiswa atau screenshot profil akun game. Data kontak, tanggal lahir, dan dokumen pendukung disimpan di bucket privat terenkripsi dan tidak pernah ditampilkan kepada publik.",
    },
    {
      q: "Bagaimana perlindungan akun bagi atlet berusia di bawah 18 tahun?",
      a: "Sesuai UU PDP, pengguna berusia di bawah 18 tahun wajib menyertakan persetujuan orang tua/wali saat registrasi. Profil publik atlet di bawah umur secara default berstatus minimal: nama asli, kontak wali, dan detail sekolah disembunyikan dari penjelajahan publik guna menjamin keselamatan anak.",
    },
    {
      q: "Apa perbedaan mendasar antara Frame Rarity dan Lencana Verifikasi?",
      a: "Frame Rarity (Rookie, Contender, Elite, Legend) murni merupakan visual pencapaian gamifikasi berdasarkan kelengkapan data dan prestasi kompetisi. Sedangkan Lencana (Unverified, Regional Checked, Verified) adalah pengesahan status kelembagaan resmi dari Pengcab ESI Kabupaten/Kota dan Pengprov ESI Sumbar. Kartu dengan rarity Legend sekalipun tetap memerlukan verifikasi resmi ESI.",
    },
    {
      q: "Apa arti status 'Menunggu Verifikasi Ulang' pada lencana kartu?",
      a: "Jika profil yang sudah berstatus 'Verified' melakukan perubahan pada data kunci (seperti pergantian IGN, pindah klub/tim, atau pindah domisili daerah), sistem otomatis menandai lencana dengan titik kuning dan memasukkan berkas ke antrean peninjauan ulang oleh admin ESI guna mencegah pencatutan identitas.",
    },
    {
      q: "Bagaimana jika saya pindah domisili antardaerah di Sumatera Barat?",
      a: "Anda dapat memperbarui kota/kabupaten domisili di pengaturan profil. Pengajuan verifikasi Anda akan otomatis dipindahkan ke antrean Pengcab ESI wilayah baru Anda, dan admin wilayah baru akan memverifikasi berkas mutasi atlet Anda.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B0D12] text-[#F3F4F6] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1E28] border border-[#262B38] mb-4">
            <HelpCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-xs font-heading font-bold uppercase tracking-wider text-gray-300">
              Panduan Resmi Tata Kelola
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-heading font-black uppercase text-white tracking-tight mb-4">
            Cara Kerja Kartu & <span className="text-[#D4AF37]">Verifikasi ESI</span>
          </h1>
          <p className="text-sm sm:text-base text-[#9AA3B2] leading-relaxed">
            Pahami alur penerbitan ESPORT ID, perbedaan sistem Frame Rarity vs Lencana Kelembagaan, serta komitmen perlindungan privasi data atlet.
          </p>
        </div>

        {/* 1. ALUR VERIFIKASI BERJENJANG */}
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-2 h-6 rounded bg-[#D4AF37]" />
            <h2 className="text-xl sm:text-2xl font-heading font-bold uppercase tracking-wider text-white">
              1. Tiga Tahap Verifikasi Berjenjang
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-[#12151C] border border-[#262B38] flex flex-col justify-between gap-4">
              <div>
                <span className="text-3xl font-heading font-black text-[#9AA3B2] block mb-2">
                  01
                </span>
                <h3 className="font-heading font-bold text-base text-white uppercase tracking-wider mb-2">
                  Registrasi & Terbit Kartu
                </h3>
                <p className="text-xs text-[#9AA3B2] leading-relaxed">
                  Pengguna mendaftar, memilih kategori (Player, Coach, atau Team), melengkapi profil dasar, dan mengunggah bukti kepemilikan akun. Kartu digital otomatis terbit berstatus <strong>Draft/Submitted</strong>.
                </p>
              </div>
              <div className="pt-3 border-t border-[#262B38] text-[10px] font-mono text-gray-400">
                Pemberi: Sistem Mandiri
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-[#12151C] border border-[#22C55E]/40 flex flex-col justify-between gap-4">
              <div>
                <span className="text-3xl font-heading font-black text-[#22C55E] block mb-2">
                  02
                </span>
                <h3 className="font-heading font-bold text-base text-white uppercase tracking-wider mb-2">
                  Pemeriksaan Pengcab Daerah
                </h3>
                <p className="text-xs text-[#9AA3B2] leading-relaxed">
                  Admin Pengcab ESI Kabupaten/Kota domisili Anda memvalidasi bukti domisili dan keaktifan kompetisi. Profil yang disetujui memperoleh lencana perisai hijau <strong>Regional Checked</strong>.
                </p>
              </div>
              <div className="pt-3 border-t border-[#262B38] text-[10px] font-mono text-[#22C55E]">
                Pemberi: Pengcab ESI Kab/Kota
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-[#12151C] border border-[#D4AF37]/40 flex flex-col justify-between gap-4">
              <div>
                <span className="text-3xl font-heading font-black text-[#D4AF37] block mb-2">
                  03
                </span>
                <h3 className="font-heading font-bold text-base text-white uppercase tracking-wider mb-2">
                  Pengesahan Pengprov ESI Sumbar
                </h3>
                <p className="text-xs text-[#9AA3B2] leading-relaxed">
                  Pengurus Provinsi ESI Sumbar memberikan pengesahan akhir, menerbitkan nomor lencana resmi, dan status <strong>Verified</strong> aktif selama 12 bulan kalender.
                </p>
              </div>
              <div className="pt-3 border-t border-[#262B38] text-[10px] font-mono text-[#D4AF37]">
                Pemberi: Pengprov ESI Sumatera Barat
              </div>
            </div>
          </div>
        </section>

        {/* 2. TABEL FRAME RARITY (PENCAPAIAN KOMPETISI) */}
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-2 h-6 rounded bg-[#C084FC]" />
            <h2 className="text-xl sm:text-2xl font-heading font-bold uppercase tracking-wider text-white">
              2. Kriteria Frame Rarity (Pencapaian)
            </h2>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[#262B38] bg-[#12151C]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#262B38] bg-[#0E1117] text-[#9AA3B2] font-heading uppercase text-[11px]">
                  <th className="p-4">Tier</th>
                  <th className="p-4">Nama Rarity</th>
                  <th className="p-4">Visual Frame</th>
                  <th className="p-4">Kriteria Kelayakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262B38] text-gray-300">
                <tr>
                  <td className="p-4 font-mono font-bold text-white">Tier 1</td>
                  <td className="p-4 font-heading font-bold text-[#E6B89C]">Rookie</td>
                  <td className="p-4">Perunggu bertekstur hangat</td>
                  <td className="p-4">Akun terdaftar dengan data dasar minimal (nama, game, dan domisili).</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono font-bold text-white">Tier 2</td>
                  <td className="p-4 font-heading font-bold text-gray-200">Contender</td>
                  <td className="p-4">Perak metalik krom dingin</td>
                  <td className="p-4">Kelengkapan profil ≥ 80% dan minimal 1 relasi aktif terkonfirmasi (klub/tim).</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono font-bold text-white">Tier 3</td>
                  <td className="p-4 font-heading font-bold text-[#D4AF37]">Elite</td>
                  <td className="p-4">Emas berkilau dengan efek holographic shimmer</td>
                  <td className="p-4">Memiliki minimal 1 prestasi turnamen resmi dengan bukti tervalidasi oleh admin.</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono font-bold text-white">Tier 4</td>
                  <td className="p-4 font-heading font-bold text-[#C084FC]">Legend</td>
                  <td className="p-4">Kristal berlian prismatik dengan animasi glow berdenyut</td>
                  <td className="p-4">Peraih medali PON / Kejurprov / Kejurnas atau kontribusi prestasi luar biasa bagi Sumatera Barat.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 3. TABEL LENCANA VERIFIKASI (OTORITAS ESI) */}
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-2 h-6 rounded bg-[#22C55E]" />
            <h2 className="text-xl sm:text-2xl font-heading font-bold uppercase tracking-wider text-white">
              3. Lencana Verifikasi Kelembagaan ESI
            </h2>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[#262B38] bg-[#12151C]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#262B38] bg-[#0E1117] text-[#9AA3B2] font-heading uppercase text-[11px]">
                  <th className="p-4">Status</th>
                  <th className="p-4">Tampilan Lencana</th>
                  <th className="p-4">Otoritas Pemberi</th>
                  <th className="p-4">Makna Kelembagaan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262B38] text-gray-300">
                <tr>
                  <td className="p-4 font-heading font-bold text-gray-400">Unverified</td>
                  <td className="p-4 text-gray-500 italic">Tanpa lencana</td>
                  <td className="p-4 text-gray-500">-</td>
                  <td className="p-4">Pendaftaran mandiri; belum melalui proses pemeriksaan.</td>
                </tr>
                <tr>
                  <td className="p-4 font-heading font-bold text-[#22C55E]">Regional Checked</td>
                  <td className="p-4 font-mono text-[#22C55E]">Perisai Hijau + Kode Wilayah</td>
                  <td className="p-4">Pengcab ESI Kab/Kota</td>
                  <td className="p-4">Telah diperiksa dan diakui oleh pengurus esport tingkat kota/kabupaten.</td>
                </tr>
                <tr>
                  <td className="p-4 font-heading font-bold text-[#D4AF37]">Verified (Resmi)</td>
                  <td className="p-4 font-mono text-[#D4AF37]">Lencana Emas ESI Sumbar + No. Badge</td>
                  <td className="p-4">Pengprov ESI Sumbar</td>
                  <td className="p-4">Terverifikasi penuh tingkat provinsi, berhak mengikuti kompetisi resmi ESI.</td>
                </tr>
                <tr>
                  <td className="p-4 font-heading font-bold text-[#F59E0B]">Re-Verifikasi</td>
                  <td className="p-4 font-mono text-[#F59E0B]">Lencana Emas + Titik Kuning Berkedip</td>
                  <td className="p-4">Sistem / Admin ESI</td>
                  <td className="p-4">Data kunci (klub, domisili, atau IGN) mengalami perubahan dan sedang ditinjau ulang.</td>
                </tr>
                <tr>
                  <td className="p-4 font-heading font-bold text-gray-400">Suspended</td>
                  <td className="p-4 font-mono text-gray-400">Lencana Abu-abu Tanda Jeda</td>
                  <td className="p-4">Pengprov ESI Sumbar</td>
                  <td className="p-4">Status verifikasi dinonaktifkan sementara karena sanksi atau sengketa etik.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. PERTANYAAN UMUM (FAQ) */}
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-2 h-6 rounded bg-[#3B82F6]" />
            <h2 className="text-xl sm:text-2xl font-heading font-bold uppercase tracking-wider text-white">
              4. Pertanyaan yang Sering Diajukan (FAQ)
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl bg-[#12151C] border border-[#262B38] overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between text-left font-heading font-bold text-sm sm:text-base text-white hover:text-[#D4AF37] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 shrink-0 transition-transform ${
                        isOpen ? "rotate-180 text-[#D4AF37]" : "text-gray-400"
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#9AA3B2] leading-relaxed border-t border-[#262B38]/50 animate-in fade-in duration-200">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* BOTTOM CTA */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-[#1A1810] via-[#12151C] to-[#1A1810] border border-[#D4AF37]/40 text-center flex flex-col items-center gap-4">
          <h3 className="text-2xl font-heading font-bold text-white uppercase">
            Siap Menjadi Bagian dari Ekosistem Resmi?
          </h3>
          <p className="text-xs sm:text-sm text-[#9AA3B2] max-w-lg">
            Daftarkan diri Anda, buat ESPORT ID pertama Anda, dan mulai bangun rekam jejak esport terpercaya di Sumatera Barat.
          </p>
          <Link
            href="/register"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E5C358] text-black font-heading font-extrabold uppercase text-xs tracking-wider shadow-lg hover:brightness-110 transition-all"
          >
            <span>Daftar Sekarang (Gratis)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
