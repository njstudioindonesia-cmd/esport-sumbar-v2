"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Mail, MessageSquare, Shield, MapPin, Send, CheckCircle2, AlertCircle } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("bantuan_teknis");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg("Mohon lengkapi nama, email, dan pesan Anda.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    // Simulasi pengiriman form via client BFF
    try {
      await new Promise((r) => setTimeout(r, 800));
      setIsSubmitted(true);
    } catch {
      setErrorMsg("Gagal mengirim pesan. Silakan coba kembali sesaat lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080C] text-white flex flex-col selection:bg-[#FF1752]/30 selection:text-white">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-white/50 mb-6">
          <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
          <span>/</span>
          <span className="text-[#FF1752]">Hubungi Kami</span>
        </div>

        {/* Hero */}
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF1752]/10 border border-[#FF1752]/30 text-xs font-mono text-[#FF4D77] mb-4">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Pusat Komunikasi &amp; Bantuan</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-heading font-black uppercase tracking-tight text-white mb-4">
            Hubungi Tim Platform
          </h1>
          <p className="text-sm sm:text-base text-white/70 max-w-2xl leading-relaxed">
            Ada pertanyaan tentang ESPORT ID, kendala pengajuan verifikasi, atau permohonan hak privasi data pribadi? Kami siap membantu Anda.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Kolom Kiri: Informasi Kontak Langsung */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="p-6 rounded-2xl bg-[#0F1118] border border-white/[0.08] flex items-start gap-3.5">
              <Mail className="w-5 h-5 text-[#FF1752] shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-mono uppercase text-white/40 block">Email Bantuan Umum</span>
                <a href="mailto:halo@esportsumbar.id" className="text-sm font-semibold text-white hover:text-[#FF1752] transition-colors">
                  halo@esportsumbar.id
                </a>
                <p className="text-[11px] text-white/50 mt-1">Respons dalam 1x24 jam kerja.</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#0F1118] border border-white/[0.08] flex items-start gap-3.5">
              <Shield className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-mono uppercase text-white/40 block">Petugas Privasi Data (DPO)</span>
                <a href="mailto:privasi@esportsumbar.id" className="text-sm font-semibold text-white hover:text-[#D4AF37] transition-colors">
                  privasi@esportsumbar.id
                </a>
                <p className="text-[11px] text-white/50 mt-1">Permohonan penghapusan atau koreksi data pribadi.</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#0F1118] border border-white/[0.08] flex items-start gap-3.5">
              <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-mono uppercase text-white/40 block">Pusat Layanan Wilayah</span>
                <span className="text-sm font-semibold text-white block">Sumatera Barat, Indonesia</span>
                <p className="text-[11px] text-white/50 mt-1">Menjangkau 19 kota &amp; kabupaten se-Sumatera Barat.</p>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Formulir Pesan */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0F1118] border border-white/[0.08]">
              {isSubmitted ? (
                <div className="py-12 flex flex-col items-center text-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="font-heading font-black text-white text-xl">Pesan Berhasil Terkirim!</h3>
                  <p className="text-xs text-white/60 max-w-sm leading-relaxed">
                    Terima kasih telah menghubungi kami. Tim ESPORT SUMBAR akan merespons pesan Anda ke <span className="text-white font-mono">{email}</span> secepatnya.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setSubject("");
                      setMessage("");
                    }}
                    className="mt-4 px-5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/10 text-xs font-mono text-white transition-all"
                  >
                    Kirim Pesan Lain
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <h3 className="text-lg font-heading font-black text-white uppercase tracking-wider mb-1">
                    Kirim Pesan Langsung
                  </h3>

                  {errorMsg && (
                    <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-mono text-white/70 block mb-1.5">Nama Lengkap *</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nama Anda"
                        className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#FF1752] rounded-xl px-3.5 text-xs text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono text-white/70 block mb-1.5">Alamat Email *</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nama@email.com"
                        className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#FF1752] rounded-xl px-3.5 text-xs text-white outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-mono text-white/70 block mb-1.5">Kategori Pertanyaan *</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#FF1752] rounded-xl px-3.5 text-xs text-white outline-none cursor-pointer"
                    >
                      <option value="bantuan_teknis" className="bg-[#161A24]">Bantuan Teknis / Akun</option>
                      <option value="verifikasi" className="bg-[#161A24]">Pertanyaan Verifikasi Lencana</option>
                      <option value="privasi" className="bg-[#161A24]">Permohonan Data Pribadi (DPO)</option>
                      <option value="laporan_konten" className="bg-[#161A24]">Pelaporan Konten / UGC</option>
                      <option value="kerja_sama" className="bg-[#161A24]">Kerja Sama Ekosistem</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-mono text-white/70 block mb-1.5">Subjek Pesan</label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Ringkasan topik Anda"
                      className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#FF1752] rounded-xl px-3.5 text-xs text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-white/70 block mb-1.5">Isi Pesan *</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Jelaskan secara rinci kendala atau pertanyaan Anda..."
                      rows={5}
                      className="w-full p-3.5 bg-[#161A24] border border-white/[0.08] focus:border-[#FF1752] rounded-xl text-xs text-white outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-[#FF1752] hover:bg-[#E01447] text-white font-heading font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#FF1752]/20 disabled:opacity-50 transition-all mt-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? "Mengirimkan Pesan..." : "Kirimkan Pesan"}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
