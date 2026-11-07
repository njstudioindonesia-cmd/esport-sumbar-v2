import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ShieldCheck, Award, FileText, CheckCircle2, ChevronRight, HelpCircle, Lock } from "lucide-react";
import { ENTITY_REGISTRY } from "@/lib/entities/registry";

export const metadata: Metadata = {
  title: "Standar Verifikasi Digital — ESPORT SUMBAR",
  description: "Standar verifikasi satu tahap mandiri ESPORT SUMBAR untuk penerbitan lencana verifikasi dan nomor registrasi keabsahan digital atlet.",
};

export default function VerificationStandardPage() {
  const steps = [
    {
      num: "01",
      title: "Pendaftaran Profil Mandiri",
      desc: "Pengguna membuat profil digital untuk salah satu dari 7 entitas ekosistem (1 akun = 1 entitas). Data tersimpan aman dengan perlindungan privasi penuh.",
    },
    {
      num: "02",
      title: "Pengunggahan Dokumen Bukti",
      desc: "Pengguna mengunggah bukti keaktifan sesuai jenis entitas: tangkapan layar akun in-game & UID, SK kepengurusan tim, surat tugas pembina, atau piagam kompetisi.",
    },
    {
      num: "03",
      title: "Penelaahan Kurator Wilayah",
      desc: "Tim verifikator platform memeriksa keabsahan dokumen dan domisili Sumatera Barat dalam antrean telaah terpadu (estimasi 1–3 hari kerja).",
    },
    {
      num: "04",
      title: "Penerbitan Lencana & Nomor Registrasi",
      desc: "Setelah disetujui, nomor registrasi tunggal dengan format ESP-SB-VER-YYYY-XXXX diterbitkan bersama lencana verifikasi aktif 12 bulan.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#07080C] text-white flex flex-col selection:bg-[#FF1752]/30 selection:text-white">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-white/50 mb-6">
          <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
          <span>/</span>
          <span className="text-[#D4AF37]">Standar Verifikasi</span>
        </div>

        {/* Hero Section */}
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-xs font-mono text-[#D4AF37] mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verifikasi Satu Tahap Mandiri</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-heading font-black uppercase tracking-tight text-white mb-4">
            Standar Verifikasi Identitas Digital
          </h1>
          <p className="text-sm sm:text-base text-white/70 max-w-2xl leading-relaxed">
            Pedoman lengkap tata kelola validasi profil atlet, pelatih, tim, komunitas, sekolah, kampus, dan venue dalam ekosistem ESPORT SUMBAR™.
          </p>
        </header>

        {/* Alur Verifikasi 4 Langkah */}
        <section className="mb-14">
          <h2 className="text-xl font-heading font-black text-white uppercase tracking-wider mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 text-[#D4AF37]" />
            <span>Alur Verifikasi Terpadu</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {steps.map((step) => (
              <div
                key={step.num}
                className="p-6 rounded-2xl bg-[#0F1118]/80 border border-white/[0.08] flex flex-col justify-between"
              >
                <div>
                  <div className="text-2xl font-mono font-black text-[#D4AF37] mb-2">{step.num}</div>
                  <h3 className="text-base font-heading font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-xs text-white/60 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Format Nomor Registrasi */}
        <section className="mb-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#D4AF37]/10 via-[#0F1118] to-transparent border border-[#D4AF37]/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] mb-1">
                Struktur Registrasi Tunggal
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-black text-white tracking-wider">
                ESP-SB-VER-<span className="text-[#D4AF37]">YYYY</span>-<span className="text-emerald-400">XXXX</span>
              </div>
              <p className="text-xs text-white/60 mt-2 max-w-lg leading-relaxed">
                Setiap lencana verifikasi memuat kode platform (ESP-SB), kode verifikasi (VER), tahun penerbitan (YYYY), dan 4 digit unik heksadesimal (XXXX).
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/me/verification"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F5D77F] text-[#07080C] text-xs font-heading font-black uppercase tracking-wider hover:brightness-110 transition-all flex items-center gap-2"
              >
                <span>Ajukan Verifikasi</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Persyaratan Dokumen per Entitas */}
        <section className="mb-14">
          <h2 className="text-xl font-heading font-black text-white uppercase tracking-wider mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#D4AF37]" />
            <span>Persyaratan Dokumen per Bidang Entitas</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.values(ENTITY_REGISTRY).map((ent) => (
              <div
                key={ent.type}
                className="p-5 rounded-2xl bg-[#0F1118]/80 border border-white/[0.08] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-heading font-bold text-white">{ent.label}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-white/60">
                      {ent.code}
                    </span>
                  </div>
                  <p className="text-[11px] text-white/50 leading-relaxed mb-4">
                    {ent.type === "player"
                      ? "Tangkapan layar profil game (IGN & UID), bukti domisili Sumbar, dan portofolio kejuaraan."
                      : ent.type === "coach"
                      ? "Sertifikat kepelatihan/analis, surat tugas tim, atau portofolio pembinaan atlet."
                      : ent.type === "team"
                      ? "SK kepengurusan klub, daftar roster aktif terdata, dan bukti domisili tim."
                      : ent.type === "community"
                      ? "Profil komunitas, dokumentasi kegiatan gathering/turnamen, dan kontak pengurus."
                      : ent.type === "school"
                      ? "SK penetapan ekstrakurikuler esport dan surat penunjukan guru pembina."
                      : ent.type === "campus"
                      ? "SK pembentukan UKM/komunitas esport kampus dan surat keterangan kemahasiswaan."
                      : "Foto venue operasional, spesifikasi perangkat PC/mobile arena, dan alamat lengkap."}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Format PDF/JPG/PNG (maks 5MB)</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Privasi & Keamanan Dokumen */}
        <section className="p-6 rounded-2xl bg-[#121520] border border-white/[0.08] flex items-start gap-4 text-xs text-white/70">
          <Lock className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-white block font-heading uppercase mb-1">
              Perlindungan Data Pribadi Dokumen Verifikasi
            </strong>
            Dokumen identitas yang Anda unggah disimpan dalam penyimpanan privat terenkripsi. Berkas hanya dapat diakses oleh kurator platform melalui URL sementara bertanda tangan kriptografis pendek (kedaluwarsa dalam 60 detik). Dokumen tidak pernah dipublikasikan secara terbuka.
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
