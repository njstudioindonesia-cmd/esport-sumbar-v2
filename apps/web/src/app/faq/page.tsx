"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HelpCircle, ChevronDown, Search, MessageSquare, ArrowRight } from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
  category: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    category: "Dasar & Akun",
    q: "Apa itu platform ESPORT SUMBAR?",
    a: "ESPORT SUMBAR adalah entitas mandiri pengelola platform esports Sumatera Barat yang menyediakan paspor digital atlet, kartu identitas ekosistem 7 entitas, verifikasi data kompetitif, dan rekam jejak turnamen daerah.",
  },
  {
    category: "Dasar & Akun",
    q: "Mengapa satu akun hanya dapat memiliki satu profil entitas?",
    a: "Prinsip 1 Akun = 1 Profil diterapkan untuk menjamin integritas data keatletan, mencegah akun ganda (smurfing/duplikasi identitas), dan menyederhanakan pelacakan reputasi digital dalam kompetisi esport terdaftar di Sumatera Barat.",
  },
  {
    category: "Kartu & Identitas",
    q: "Bagaimana cara menerbitkan kartu paspor digital saya?",
    a: "Setelah mendaftar dan mengonfirmasi email, Anda dapat menyelesaikan wizard penerbitan kartu (/me/profile/new). Anda akan memilih 1 bidang entitas, melengkapi atribut, mengunggah foto profil/logo, dan kartu langsung terbit dengan ESPORT ID unik.",
  },
  {
    category: "Kartu & Identitas",
    q: "Apa perbedaan antara Tier Rarity kartu dan Lencana Verifikasi?",
    a: "Tier Rarity (Rookie, Contender, Elite, Master, Legend) ditentukan secara dinamis berdasarkan skor kelengkapan data, rekam jejak turnamen, dan keterhubungan ekosistem. Sedangkan Lencana Verifikasi (Terverifikasi) adalah penelaahan dan persetujuan dokumen identitas oleh tim platform.",
  },
  {
    category: "Verifikasi",
    q: "Bagaimana alur pengajuan verifikasi profil?",
    a: "Masuk ke menu /me/verification, unggah dokumen bukti pendukung (tangkapan layar akun in-game & UID, SK tim, atau piagam juara), lalu kirim pengajuan. Tim kurator akan menelaah berkas Anda dalam 1–3 hari kerja.",
  },
  {
    category: "Verifikasi",
    q: "Berapa lama masa berlaku lencana verifikasi?",
    a: "Lencana verifikasi berlaku selama 12 bulan sejak tanggal penerbitan. Menjelang masa kedaluwarsa, Anda dapat memperbarui dokumen keaktifan untuk memperpanjang status lencana.",
  },
  {
    category: "Ekosistem",
    q: "Bagaimana cara menghubungkan profil saya dengan Tim atau Sekolah?",
    a: "Buka menu Ekosistem (/me/ecosystem atau /me/memberships), pilih tombol '+ Hubungkan Profil', pilih jenis hubungan yang diizinkan (misal: Roster Tim, Atlet Pelajar Binaan, atau Pelatih), dan kirim undangan ke entitas tujuan.",
  },
  {
    category: "Privasi & Keamanan",
    q: "Bagaimana data pribadi dan atlet di bawah umur dilindungi?",
    a: "Platform tidak mempublikasikan data sensitif (NIK, tanggal lahir lengkap, kontak pribadi). Untuk atlet berusia di bawah 18 tahun, pendaftaran wajib disertai izin wali dan foto profil disembunyikan secara default dari tampilan publik.",
  },
];

export default function FaqPage() {
  const [search, setSearch] = useState("");
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const filteredFaqs = FAQ_DATA.filter(
    (item) =>
      item.q.toLowerCase().includes(search.toLowerCase()) ||
      item.a.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#07080C] text-white flex flex-col selection:bg-[#FF1752]/30 selection:text-white">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-white/50 mb-6">
          <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
          <span>/</span>
          <span className="text-[#D4AF37]">Tanya Jawab (FAQ)</span>
        </div>

        {/* Hero */}
        <header className="mb-10 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-xs font-mono text-[#D4AF37] mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Pusat Informasi &amp; Jawaban</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-heading font-black uppercase tracking-tight text-white mb-4">
            Pertanyaan yang Sering Diajukan
          </h1>
          <p className="text-sm sm:text-base text-white/70 max-w-xl leading-relaxed">
            Temukan jawaban cepat seputar ESPORT ID, kartu paspor digital, aturan ekosistem, dan tata cara verifikasi.
          </p>

          {/* Search Box */}
          <div className="w-full max-w-md mt-6 relative">
            <Search className="w-4 h-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari pertanyaan atau kata kunci..."
              className="w-full h-12 bg-[#0F1118] border border-white/10 focus:border-[#D4AF37] rounded-2xl pl-11 pr-4 text-xs text-white outline-none shadow-lg"
            />
          </div>
        </header>

        {/* Accordion List */}
        <div className="flex flex-col gap-3">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-[#0F1118]/80 border border-white/[0.08] overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-white/40 shrink-0">
                        {faq.category}
                      </span>
                      <h3 className="text-sm font-heading font-bold text-white leading-snug">
                        {faq.q}
                      </h3>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-[#D4AF37] shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-white/70 leading-relaxed border-t border-white/[0.04]">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center rounded-2xl bg-[#0F1118] border border-white/[0.08]">
              <p className="text-xs text-white/50">Tidak ada pertanyaan yang sesuai dengan kata kunci pencarian.</p>
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 p-6 rounded-3xl bg-gradient-to-r from-[#D4AF37]/10 via-[#0F1118] to-transparent border border-[#D4AF37]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-heading font-bold text-white text-base">Masih Punya Pertanyaan Lain?</h3>
            <p className="text-xs text-white/60 mt-1">
              Tim ESPORT SUMBAR siap membantu kendala spesifik Anda kapan saja.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-5 py-2.5 rounded-xl bg-[#D4AF37] text-black font-heading font-black text-xs uppercase tracking-wider flex items-center gap-2 shrink-0 hover:brightness-110 transition-all shadow-md"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Kirim Pesan ke Tim</span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
