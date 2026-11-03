"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Award,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Upload,
  FileText,
  Lock,
  ArrowRight,
  RotateCcw,
  Info,
  Calendar,
  ChevronRight,
  Send,
  Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

type DemoVerificationState = "provincial_review" | "revision_requested" | "verified" | "new_submission";

export default function VerificationStatusPage() {
  const [demoState, setDemoState] = useState<DemoVerificationState>("provincial_review");
  const [selectedFile1, setSelectedFile1] = useState<string | null>("kartu-pelajar-raka.jpg");
  const [selectedFile2, setSelectedFile2] = useState<string | null>("screenshot-profile-ff.png");
  const [notes, setNotes] = useState("");
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleSubmitReverification = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedSuccess(true);
    setTimeout(() => {
      setDemoState("provincial_review");
      setSubmittedSuccess(false);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#0B0D12] text-[#F3F4F6] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* BREADCRUMBS */}
        <nav className="flex items-center gap-2 text-xs text-[#9AA3B2] mb-6 font-mono">
          <Link href="/dashboard" className="hover:text-white transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#D4AF37] font-bold">Verifikasi Kelembagaan ESI</span>
        </nav>

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#D4AF37] uppercase">
              <span>Tata Kelola Berjenjang</span>
              <span>•</span>
              <span>ESI Kota Padang → ESI Sumbar</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-black uppercase text-white tracking-tight mt-1">
              Status Verifikasi & Pengajuan
            </h1>
            <p className="text-xs sm:text-sm text-[#9AA3B2] max-w-xl">
              Lacak posisi berkas pendaftaran Anda secara transparan. Setiap tahap dicatat secara otomatis dalam audit log kelembagaan.
            </p>
          </div>

          {/* DEMO STATE SWITCHER PILL */}
          <div className="flex flex-col items-end gap-1.5 bg-[#12151C] p-2 rounded-xl border border-[#262B38]">
            <span className="text-[9px] uppercase font-mono text-[#9AA3B2]">
              Uji Coba Status Alur:
            </span>
            <div className="flex items-center gap-1">
              {[
                { id: "provincial_review", label: "Diperiksa Provinsi" },
                { id: "revision_requested", label: "Perlu Revisi" },
                { id: "verified", label: "Terverifikasi" },
                { id: "new_submission", label: "Form Baru" },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setDemoState(s.id as any)}
                  className={`px-2 py-1 rounded text-[10px] font-heading font-bold uppercase transition-all ${
                    demoState === s.id
                      ? "bg-[#D4AF37] text-black shadow-sm"
                      : "bg-[#1A1E28] text-gray-400 hover:text-white"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 1. PERLU REVISI BANNER (IF STATE IS REVISION_REQUESTED) */}
        {demoState === "revision_requested" && (
          <div className="mb-8 p-5 sm:p-6 rounded-2xl bg-[#1A1810] border-2 border-[#F59E0B] shadow-[0_0_30px_rgba(245,158,11,0.2)] flex flex-col gap-3 animate-in slide-in-from-top-3">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-[#F59E0B] shrink-0" />
              <h3 className="font-heading font-bold text-base uppercase text-[#F59E0B]">
                Permintaan Revisi Berkas dari Admin ESI
              </h3>
            </div>
            <div className="p-3.5 rounded-xl bg-[#12151C] border border-[#262B38] text-xs text-gray-200">
              <span className="text-[10px] font-mono uppercase text-[#9AA3B2] block mb-1">
                Catatan Pemeriksa (Admin Pengcab ESI Kota Padang • 2 Nov 2026):
              </span>
              <p className="leading-relaxed">
                &ldquo;Tangkapan layar akun game yang Anda unggah terpotong sehingga nomor ID Server game tidak terbaca jelas. Mohon unggah ulang tangkapan layar profil game Free Fire yang memperlihatkan Nickname dan User ID secara utuh.&rdquo;
              </p>
            </div>
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-[#9AA3B2]">
                Field yang perlu diperbaiki: <strong className="text-white">Screenshot Akun Game</strong>
              </span>
              <a
                href="#upload-form"
                className="px-4 py-2 rounded-xl bg-[#F59E0B] text-black text-xs font-heading font-bold uppercase tracking-wider hover:brightness-110"
              >
                Perbaiki Berkas Sekarang
              </a>
            </div>
          </div>
        )}

        {/* 2. VERIFIED STATUS BANNER (IF STATE IS VERIFIED) */}
        {demoState === "verified" && (
          <div className="mb-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#1A1810] via-[#12151C] to-[#1A1810] border-2 border-[#D4AF37] shadow-[0_0_35px_rgba(212,175,55,0.3)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in slide-in-from-top-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#1A1E28] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shrink-0 shadow-lg">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-bold text-lg uppercase text-white">
                    Terverifikasi Resmi ESI Sumatera Barat
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-[#22C55E]/20 text-[#22C55E] text-[10px] font-mono font-bold">
                    AKTIF
                  </span>
                </div>
                <p className="text-xs text-[#9AA3B2] mt-0.5">
                  Nomor Register Lencana: <strong className="text-[#D4AF37] font-mono">ESI-SB-2026-0124</strong> • Berlaku hingga <strong>Maret 2027 (12 Bulan)</strong>.
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] text-[#9AA3B2] font-mono block">
                Pengingat Pembaruan
              </span>
              <span className="text-xs text-gray-300">
                Otomatis H-30 (Februari 2027)
              </span>
            </div>
          </div>
        )}

        {/* 3. VERTICAL TIMELINE OF STATUS TRANSITIONS */}
        <section className="p-6 sm:p-8 rounded-2xl bg-[#12151C] border border-[#262B38] mb-10 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#262B38] pb-4 mb-6">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#D4AF37]" />
              <h2 className="font-heading font-bold text-sm uppercase text-white tracking-wider">
                Linimasa Transisi Verifikasi (Audit Trail)
              </h2>
            </div>
            <span className="text-[10px] text-[#9AA3B2] font-mono">
              Append-Only • Tercatat Permanen
            </span>
          </div>

          <div className="flex flex-col gap-6 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-[2px] before:bg-[#262B38]">
            {/* Stage 1: Draft */}
            <div className="flex items-start gap-4 relative z-10">
              <div className="w-8 h-8 rounded-full bg-[#22C55E] text-black flex items-center justify-center shrink-0 shadow-md">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h4 className="font-heading font-bold text-xs uppercase text-white">
                    01. Profil Terdaftar (Draft Selesai)
                  </h4>
                  <span className="text-[9px] font-mono text-[#22C55E]">Lengkap</span>
                </div>
                <p className="text-[11px] text-[#9AA3B2] mt-0.5">
                  Profil dasar dan akun game telah didaftarkan. ESPORT ID terbit dengan tier Rookie.
                </p>
                <span className="text-[9px] font-mono text-gray-500 mt-1">
                  12 Jan 2026, 10:15 WIB • Pelaku: Pemilik Akun
                </span>
              </div>
            </div>

            {/* Stage 2: Submitted */}
            <div className="flex items-start gap-4 relative z-10">
              <div className="w-8 h-8 rounded-full bg-[#22C55E] text-black flex items-center justify-center shrink-0 shadow-md">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h4 className="font-heading font-bold text-xs uppercase text-white">
                    02. Berkas Pengajuan Masuk (Submitted)
                  </h4>
                  <span className="text-[9px] font-mono text-[#22C55E]">Terkirim</span>
                </div>
                <p className="text-[11px] text-[#9AA3B2] mt-0.5">
                  Dokumen pendukung (kartu pelajar dan tangkapan layar profil akun game) terunggah ke penyimpanan privat.
                </p>
                <span className="text-[9px] font-mono text-gray-500 mt-1">
                  14 Jan 2026, 14:30 WIB • Pelaku: Pemilik Akun
                </span>
              </div>
            </div>

            {/* Stage 3: District Approved / Regional Checked */}
            <div className="flex items-start gap-4 relative z-10">
              <div className="w-8 h-8 rounded-full bg-[#22C55E] text-black flex items-center justify-center shrink-0 shadow-md">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h4 className="font-heading font-bold text-xs uppercase text-white">
                    03. Lolos Validasi Daerah (Regional Checked)
                  </h4>
                  <span className="text-[9px] font-mono text-[#22C55E] font-bold">Disetujui</span>
                </div>
                <p className="text-[11px] text-[#9AA3B2] mt-0.5">
                  Pengcab ESI Kota Padang menyetujui validitas domisili dan keaktifan kompetisi. Lencana perisai hijau aktif pada kartu.
                </p>
                <span className="text-[9px] font-mono text-gray-500 mt-1">
                  18 Jan 2026, 16:00 WIB • Pelaku: Admin Pengcab ESI Kota Padang
                </span>
              </div>
            </div>

            {/* Stage 4: Provincial Review */}
            <div className="flex items-start gap-4 relative z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-md ${
                  demoState === "verified"
                    ? "bg-[#22C55E] text-black"
                    : demoState === "revision_requested"
                    ? "bg-[#F59E0B] text-black"
                    : "bg-[#D4AF37] text-black animate-pulse"
                }`}
              >
                {demoState === "verified" ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : demoState === "revision_requested" ? (
                  <AlertTriangle className="w-4 h-4" />
                ) : (
                  <Clock className="w-4 h-4" />
                )}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h4 className="font-heading font-bold text-xs uppercase text-white">
                    04. Peninjauan Pleno Pengprov ESI Sumbar
                  </h4>
                  <span
                    className={`text-[9px] font-mono font-bold ${
                      demoState === "verified"
                        ? "text-[#22C55E]"
                        : demoState === "revision_requested"
                        ? "text-[#F59E0B]"
                        : "text-[#D4AF37]"
                    }`}
                  >
                    {demoState === "verified"
                      ? "Selesai"
                      : demoState === "revision_requested"
                      ? "Perlu Revisi"
                      : "Sedang Berlangsung"}
                  </span>
                </div>
                <p className="text-[11px] text-[#9AA3B2] mt-0.5">
                  {demoState === "revision_requested"
                    ? "Terdapat permintaan klarifikasi dokumen dari admin provinsi. Silakan periksa instruksi perbaikan."
                    : demoState === "verified"
                    ? "Pleno pengesahan selesai. Status resmi telah diterbitkan."
                    : "Berkas sedang dalam antrean pemeriksaan sidang pleno Pengprov ESI Sumbar (Estimasi SLA: 3 hari kerja)."}
                </p>
                <span className="text-[9px] font-mono text-gray-500 mt-1">
                  Status Terkini • Pelaku: Tim Validasi Pengprov ESI Sumbar
                </span>
              </div>
            </div>

            {/* Stage 5: Final Verified Badge */}
            <div className="flex items-start gap-4 relative z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  demoState === "verified"
                    ? "bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.6)]"
                    : "bg-[#1A1E28] text-gray-500 border border-[#262B38]"
                }`}
              >
                <Award className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <h4
                  className={`font-heading font-bold text-xs uppercase ${
                    demoState === "verified" ? "text-[#D4AF37]" : "text-gray-400"
                  }`}
                >
                  05. Terverifikasi Penuh ESI Sumbar (Lencana Emas)
                </h4>
                <p className="text-[11px] text-[#9AA3B2] mt-0.5">
                  Nomor register lencana diterbitkan. Atlet terdata dalam pangkalan data kontingen resmi Sumatera Barat.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. FORM UNGGAH BUKTI PENDUKUNG (DOCUMENT SUBMISSION / RE-SUBMISSION) */}
        <section id="upload-form" className="p-6 sm:p-8 rounded-2xl bg-[#12151C] border border-[#262B38] mb-10 shadow-xl">
          <div className="flex items-center gap-2 mb-2">
            <Upload className="w-5 h-5 text-[#D4AF37]" />
            <h2 className="font-heading font-bold text-base uppercase text-white tracking-wider">
              {demoState === "revision_requested" ? "Formulir Perbaikan Berkas" : "Dokumen Bukti Pendukung"}
            </h2>
          </div>
          <p className="text-xs text-[#9AA3B2] mb-6">
            Unggah dokumen yang sah untuk mempercepat proses validasi oleh admin Pengcab ESI.
          </p>

          {/* Privacy Guarantee Alert Box */}
          <div className="p-4 rounded-xl bg-[#0E1117] border border-[#262B38] flex items-start gap-3 text-xs text-[#9AA3B2] mb-6">
            <Lock className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <strong className="text-gray-200">Kepatuhan UU PDP & Penyimpanan Privat:</strong>
              <p className="text-[11px] leading-relaxed">
                Platform ESPORT SUMBAR <strong>tidak meminta KTP fisik atau nomor NIK</strong>. File yang Anda unggah hanya dapat diakses oleh pemeriksa berwenang melalui signed URL berumur pendek dan akan dihapus sesuai kebijakan retensi.
              </p>
            </div>
          </div>

          {/* Submission Form */}
          <form onSubmit={handleSubmitReverification} className="flex flex-col gap-5">
            {/* Document 1: Identitas / Kartu Pelajar */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-heading font-semibold text-gray-300 uppercase flex items-center justify-between">
                <span>1. Kartu Pelajar / Mahasiswa / Surat Rekomendasi (Wajib)</span>
                <span className="text-[10px] text-[#22C55E] font-mono">Tersedia</span>
              </label>
              <div className="p-4 rounded-xl bg-[#161922] border border-[#262B38] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-[#D4AF37]" />
                  <div>
                    <p className="text-xs font-semibold text-white">
                      {selectedFile1}
                    </p>
                    <span className="text-[10px] text-[#9AA3B2] font-mono">
                      File terunggah (JPG • 1.2 MB)
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="text-xs text-[#D4AF37] font-heading font-bold uppercase hover:underline"
                >
                  Ganti File
                </button>
              </div>
            </div>

            {/* Document 2: Screenshot Akun Game */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-heading font-semibold text-gray-300 uppercase flex items-center justify-between">
                <span>2. Tangkapan Layar Profil Akun Game (ID & Nickname)</span>
                {demoState === "revision_requested" ? (
                  <span className="text-[10px] text-[#F59E0B] font-mono font-bold">Wajib Diperbaiki</span>
                ) : (
                  <span className="text-[10px] text-[#22C55E] font-mono">Tersedia</span>
                )}
              </label>
              <div
                className={`p-4 rounded-xl border flex items-center justify-between ${
                  demoState === "revision_requested"
                    ? "bg-[#1A1810] border-[#F59E0B]"
                    : "bg-[#161922] border-[#262B38]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-[#3B82F6]" />
                  <div>
                    <p className="text-xs font-semibold text-white">
                      {selectedFile2}
                    </p>
                    <span className="text-[10px] text-[#9AA3B2] font-mono">
                      PNG • 2.4 MB (Resolusi Tinggi)
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="text-xs text-[#D4AF37] font-heading font-bold uppercase hover:underline"
                >
                  Unggah File Baru
                </button>
              </div>
            </div>

            {/* Notes / Catatan Perbaikan */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-heading font-semibold text-gray-300 uppercase">
                Catatan Tambahan untuk Admin Pemeriksa (Opsional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Contoh: Berkas screenshot profil baru dengan ID Server terlihat jelas telah diperbarui..."
                className="w-full bg-[#161922] border border-[#262B38] focus:border-[#D4AF37] rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex items-center justify-end">
              <button
                type="submit"
                disabled={submittedSuccess}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E5C358] text-black text-xs font-heading font-extrabold uppercase tracking-wider shadow-lg hover:brightness-110 transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>
                  {submittedSuccess
                    ? "Berkas Terkirim!"
                    : demoState === "revision_requested"
                    ? "Kirim Perbaikan & Ajukan Ulang"
                    : "Simpan & Kirim Pengajuan"}
                </span>
              </button>
            </div>
          </form>
        </section>

        {/* 5. PERINGATAN VERIFIKASI ULANG (RE-VERIFICATION POLICY WARNING) */}
        <div className="p-4 rounded-xl bg-[#1A1E28]/70 border border-[#262B38] flex items-start gap-3 text-xs text-[#9AA3B2]">
          <AlertTriangle className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Aturan Integritas Data (PRD 5.2.4):</strong> Perubahan pada data kunci (seperti In-Game Name, cabang game utama, nama klub/tim, atau kota/kabupaten domisili) pada profil yang telah berstatus <em>Verified</em> akan otomatis memicu <strong>peninjauan ulang (re-verifikasi)</strong> oleh admin ESI demi mencegah manipulasi identitas.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
