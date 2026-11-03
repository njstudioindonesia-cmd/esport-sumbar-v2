"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Share2,
  Flag,
  ShieldCheck,
  Award,
  Sparkles,
  MapPin,
  Users,
  Gamepad2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  History,
  Trophy,
  AlertTriangle,
  Lock,
  UserCheck,
  GraduationCap,
  Briefcase,
  X,
  Send,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EsportCard } from "@/components/card/EsportCard";
import { VerificationBadge } from "@/components/card/VerificationBadge";
import { ShareCardModal } from "@/components/card/ShareCardModal";
import { MockCardVariant, GALLERY_CARDS } from "@/data/mockCards";

interface PublicProfileViewProps {
  card: MockCardVariant;
}

export function PublicProfileView({ card }: PublicProfileViewProps) {
  const [activeTab, setActiveTab] = useState<"summary" | "achievements" | "history" | "roster">("summary");
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("fake_data");
  const [reportNotes, setReportNotes] = useState("");
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const { type, rarity, verification, data } = card;

  // Related profiles (from same region or same game)
  const relatedProfiles = GALLERY_CARDS.filter(
    (c) => c.id !== card.id && (c.data.region.code === data.region.code || c.data.game === data.game)
  ).slice(0, 3);

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReportSubmitted(true);
    setTimeout(() => {
      setReportModalOpen(false);
      setReportSubmitted(false);
      setReportNotes("");
    }, 2500);
  };

  const displayNameOrTeam = type === "team" ? data.teamName : data.ign || data.displayName;

  return (
    <div className="min-h-screen bg-[#0B0D12] text-[#F3F4F6] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* BREADCRUMBS */}
        <nav className="flex items-center gap-2 text-xs text-[#9AA3B2] mb-8 font-mono overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-white transition-colors">
            Beranda
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/explore" className="hover:text-white transition-colors">
            Jelajah
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link
            href={`/explore?tab=${type}`}
            className="capitalize hover:text-white transition-colors"
          >
            {type}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#D4AF37] font-bold">{displayNameOrTeam}</span>
        </nav>

        {/* HERO HEADER: 3D CARD + PRIMARY METADATA */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-12">
          {/* Left Column: Interactive 3D Card (Large) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative group">
              <EsportCard
                type={type}
                rarity={rarity}
                verification={verification}
                data={data}
                size="lg"
                interactive={true}
              />
            </div>
            <span className="text-[11px] text-[#9AA3B2] mt-3 font-mono">
              Sentuh kartu atau klik tombol balik untuk melihat rekam jejak
            </span>
          </div>

          {/* Right Column: Key Identity & Status Blocks */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Title & Badges */}
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-[#1A1E28] border border-[#262B38] text-[10px] font-heading font-extrabold uppercase text-[#D4AF37] tracking-wider">
                  ESPORT ID: {data.esportId}
                </span>

                <VerificationBadge
                  status={verification}
                  regionCode={data.region.code}
                  badgeNumber={data.badgeNumber}
                  size="md"
                />

                <span className="px-2.5 py-1 rounded-full bg-[#161922] border border-[#262B38] text-[10px] font-mono text-gray-300">
                  {type.toUpperCase()}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-heading font-black uppercase text-white tracking-tight mt-1">
                {displayNameOrTeam}
              </h1>

              {data.displayName && data.displayName !== displayNameOrTeam && (
                <p className="text-base text-[#9AA3B2] font-medium">
                  {data.displayName}
                </p>
              )}
            </div>

            {/* Quick Meta Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-[#12151C] border border-[#262B38]">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#9AA3B2]">
                  Cabang Game
                </span>
                <span className="text-xs sm:text-sm font-heading font-bold text-white flex items-center gap-1.5 mt-0.5">
                  <Gamepad2 className="w-3.5 h-3.5 text-[#3B82F6]" />
                  {data.game}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#9AA3B2]">
                  Peran / Spesialisasi
                </span>
                <span className="text-xs sm:text-sm font-heading font-bold text-white mt-0.5">
                  {data.role || (type === "team" ? "Kompetitif Club" : "Atlet")}
                </span>
              </div>

              <div className="flex flex-col col-span-2 sm:col-span-1">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#9AA3B2]">
                  Domisili / Wilayah
                </span>
                <span className="text-xs sm:text-sm font-heading font-bold text-white flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                  {data.region.name}
                </span>
              </div>
            </div>

            {/* INSTITUTIONAL STATUS BANNER (PRD 4.3 & 5.2.7) */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-[#161922] via-[#12151C] to-[#161922] border border-[#262B38] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1A1E28] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-heading font-bold text-xs uppercase text-white">
                      Status Verifikasi Kelembagaan ESI
                    </h4>
                    {verification === "verified" ? (
                      <span className="text-[10px] text-[#22C55E] font-mono font-bold">
                        AKTIF (12 Bulan)
                      </span>
                    ) : verification === "regional" ? (
                      <span className="text-[10px] text-[#22C55E] font-mono font-bold">
                        REGIONAL CHECKED
                      </span>
                    ) : (
                      <span className="text-[10px] text-gray-400 font-mono">
                        MANDIRI
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#9AA3B2] mt-0.5">
                    {verification === "verified"
                      ? `Terverifikasi resmi Pengprov ESI Sumbar (No: ${data.badgeNumber || "ESI-SB-2026"}) berlaku hingga Maret 2027.`
                      : verification === "regional"
                      ? `Lolos pemeriksaan awal Pengcab ESI ${data.region.name}. Menunggu jadwal pleno provinsi.`
                      : "Profil pendaftaran mandiri. Belum mengajukan permohonan verifikasi resmi ESI."}
                  </p>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS: SHARE & REPORT */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShareModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E6CA65] hover:brightness-110 text-[#0B0D12] text-xs font-heading font-extrabold uppercase tracking-wider shadow-[0_0_20px_rgba(212,175,55,0.35)] transition-all"
              >
                <Share2 className="w-4 h-4" />
                <span>Bagikan & Unduh Kartu</span>
              </button>

              <button
                type="button"
                onClick={() => setReportModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#161922] hover:bg-[#1A1E28] border border-[#262B38] text-xs font-heading font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-colors"
              >
                <Flag className="w-3.5 h-3.5 text-gray-400" />
                <span>Laporkan Profil</span>
              </button>
            </div>
          </div>
        </section>

        {/* ==================== TABS CONTENT & SIDEBAR ==================== */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Tabs Area */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Tab Navigation */}
            <div className="flex items-center gap-2 border-b border-[#262B38] pb-1 overflow-x-auto scrollbar-none">
              {[
                { id: "summary", label: "Ringkasan" },
                { id: "achievements", label: `Prestasi (${data.achievements?.length || 0})` },
                { id: "history", label: "Riwayat Tim" },
                ...(type === "team" ? [{ id: "roster", label: `Roster Aktif (${data.rosterMembers?.length || 0})` }] : []),
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-t-lg text-xs font-heading font-bold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-[#D4AF37] text-[#D4AF37] bg-[#12151C]"
                      : "border-transparent text-gray-400 hover:text-white hover:bg-[#161922]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB 1: RINGKASAN (SUMMARY) */}
            {activeTab === "summary" && (
              <div className="flex flex-col gap-5 p-6 rounded-2xl bg-[#12151C] border border-[#262B38]">
                <div>
                  <h3 className="font-heading font-bold text-sm uppercase text-white mb-2">
                    Tentang Entitas
                  </h3>
                  <p className="text-xs sm:text-sm text-[#9AA3B2] leading-relaxed">
                    {type === "team"
                      ? `${data.teamName} merupakan klub esport kompetitif berdomisili di ${data.region.name}, berfokus pada divisi ${data.game}. Klub ini telah terdata secara resmi di ekosistem ESPORT SUMBAR.`
                      : type === "coach"
                      ? `${data.displayName} (${data.ign}) aktif membina atlet dan merumuskan taktik kompetitif untuk divisi ${data.game} di Sumatera Barat.`
                      : `${data.displayName} (${data.ign}) adalah atlet kompetitif asal ${data.region.name} yang aktif bertanding pada cabang game ${data.game} dengan spesialisasi peran ${data.role}.`}
                  </p>
                </div>

                {/* Team Info if Athlete */}
                {type === "player" && data.team && (
                  <div className="pt-4 border-t border-[#262B38] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#161922] flex items-center justify-center border border-[#262B38] text-[#D4AF37]">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-mono tracking-wider text-[#9AA3B2]">
                          Klub / Tim Saat Ini
                        </span>
                        <h4 className="font-heading font-bold text-sm text-white">
                          {data.team.name}
                        </h4>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#22C55E]/20 text-[#22C55E] font-mono font-bold">
                      Relasi Disetujui
                    </span>
                  </div>
                )}

                {/* Privacy Guarantee Notice (PRD 8) */}
                <div className="pt-4 border-t border-[#262B38] flex items-start gap-2.5 text-xs text-[#9AA3B2] bg-[#0E1117] p-3 rounded-xl border border-[#262B38]/50">
                  <Lock className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed">
                    <strong>Kepatuhan UU PDP & Privasi:</strong> Seluruh informasi yang ditampilkan di halaman ini telah disetujui publik oleh pemilik akun. Informasi sensitif (nomor kontak, tanggal lahir, dan dokumen pendukung) disimpan di penyimpanan privat terenkripsi.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: PRESTASI (ACHIEVEMENTS) */}
            {activeTab === "achievements" && (
              <div className="flex flex-col gap-3">
                {data.achievements && data.achievements.length > 0 ? (
                  data.achievements.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-[#12151C] border border-[#262B38] flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#1A1E28] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
                          <Trophy className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-heading font-bold text-sm text-white">
                            {item.title}
                          </h4>
                          <span className="text-xs text-[#9AA3B2]">
                            {item.placement} • Tingkat {item.level.toUpperCase()} ({item.year})
                          </span>
                        </div>
                      </div>

                      {item.isValidated ? (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#22C55E]/15 border border-[#22C55E]/40 text-[#22C55E] text-[10px] font-heading font-bold uppercase shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Tervalidasi ESI</span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-gray-500 font-mono shrink-0">
                          Menunggu Validasi
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center rounded-xl bg-[#12151C] border border-[#262B38] text-xs text-[#9AA3B2]">
                    Belum ada prestasi resmi yang tercatat di sistem.
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: RIWAYAT TIM & KARIER (HISTORY) */}
            {activeTab === "history" && (
              <div className="flex flex-col gap-3">
                {data.history && data.history.length > 0 ? (
                  data.history.map((hist, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-[#12151C] border border-[#262B38] flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#1A1E28] flex items-center justify-center text-[#3B82F6] shrink-0">
                          <History className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-heading font-bold text-sm text-white">
                            {hist.teamName}
                          </h4>
                          <span className="text-xs text-[#9AA3B2]">
                            Peran: {hist.role}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-gray-300">
                        {hist.period}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center rounded-xl bg-[#12151C] border border-[#262B38] text-xs text-[#9AA3B2]">
                    Belum ada riwayat tim sebelumnya.
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: ROSTER AKTIF (KHUSUS TIM) */}
            {activeTab === "roster" && type === "team" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.rosterMembers && data.rosterMembers.length > 0 ? (
                  data.rosterMembers.map((member, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#12151C] border border-[#262B38] hover:border-[#D4AF37]/50 flex items-center justify-between gap-3 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#161922] border border-[#262B38] shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={
                              member.avatarUrl ||
                              `https://api.dicebear.com/7.x/bottts/svg?seed=${member.ign}`
                            }
                            alt={member.ign}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-heading font-bold text-sm text-white leading-tight">
                            {member.ign}
                          </h4>
                          <span className="text-[11px] text-[#9AA3B2]">
                            {member.role}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#22C55E]/20 text-[#22C55E] font-mono">
                        Aktif
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 p-8 text-center rounded-xl bg-[#12151C] border border-[#262B38] text-xs text-[#9AA3B2]">
                    Belum ada anggota roster yang terhubung dengan persetujuan dua arah.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar: Profil Terkait (Related Profiles) */}
          <aside className="lg:col-span-4 flex flex-col gap-4">
            <div className="p-5 rounded-2xl bg-[#12151C] border border-[#262B38]">
              <h3 className="font-heading font-bold text-sm uppercase text-white mb-3">
                Profil Terkait ({data.region.name})
              </h3>
              <div className="flex flex-col gap-3">
                {relatedProfiles.map((rel) => {
                  const targetSlug = (rel.data.ign || rel.data.teamName || rel.data.displayName)
                    .toLowerCase()
                    .replace(/\s+/g, "-");
                  return (
                    <Link
                      key={rel.id}
                      href={`/${rel.type}/${targetSlug}`}
                      className="p-2.5 rounded-xl bg-[#161922] border border-[#262B38] hover:border-[#D4AF37]/50 flex items-center justify-between gap-2.5 transition-all group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-9 h-9 rounded-lg overflow-hidden bg-[#1A1E28] shrink-0 border border-[#262B38]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={rel.data.avatarUrl || rel.data.logoUrl}
                            alt={rel.data.displayName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-heading font-bold text-white group-hover:text-[#D4AF37] truncate">
                            {rel.type === "team" ? rel.data.teamName : rel.data.ign || rel.data.displayName}
                          </p>
                          <p className="text-[10px] text-[#9AA3B2] truncate">
                            {rel.data.game} • {rel.data.region.name}
                          </p>
                        </div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-gray-500 group-hover:text-[#D4AF37] shrink-0" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </aside>
        </section>
      </main>

      {/* SHARE CARD MODAL */}
      <ShareCardModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        cardData={card}
      />

      {/* REPORT PROFILE MODAL DIALOG */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-[#12151C] border border-[#262B38] p-6 flex flex-col gap-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#262B38] pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
                <h3 className="font-heading font-bold text-sm uppercase text-white">
                  Laporkan Profil Ini
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setReportModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {reportSubmitted ? (
              <div className="p-6 text-center flex flex-col items-center gap-2">
                <CheckCircle2 className="w-10 h-10 text-[#22C55E]" />
                <h4 className="font-heading font-bold text-sm text-white">
                  Laporan Berhasil Terkirim
                </h4>
                <p className="text-xs text-[#9AA3B2]">
                  Laporan Anda telah diteruskan ke tim pengawas platform dan ESI terkait untuk ditindaklanjuti.
                </p>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="flex flex-col gap-3">
                <p className="text-xs text-[#9AA3B2]">
                  Bantu kami menjaga ekosistem esport Sumatera Barat tetap bersih, adil, dan terpercaya.
                </p>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-heading font-semibold text-gray-300 uppercase">
                    Alasan Laporan (Wajib)
                  </label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full bg-[#1A1E28] border border-[#262B38] rounded-lg p-2 text-xs text-white"
                  >
                    <option value="fake_data">Data Palsu / Akun Tiruan</option>
                    <option value="unauthorized_roster">Pencatutan Nama Tim / Roster Tanpa Izin</option>
                    <option value="inappropriate_content">Konten Avatar / Teks Tidak Pantas</option>
                    <option value="underage_violation">Pelanggaran Ketentuan Usia / Privasi Anak</option>
                    <option value="other">Alasan Lainnya</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-heading font-semibold text-gray-300 uppercase">
                    Keterangan Tambahan
                  </label>
                  <textarea
                    value={reportNotes}
                    onChange={(e) => setReportNotes(e.target.value)}
                    rows={3}
                    placeholder="Sertakan rincian bukti atau penjelasan singkat..."
                    className="w-full bg-[#1A1E28] border border-[#262B38] rounded-lg p-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#262B38]">
                  <button
                    type="button"
                    onClick={() => setReportModalOpen(false)}
                    className="px-3 py-2 text-xs text-gray-400 hover:text-white"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#EF4444] text-white text-xs font-heading font-bold uppercase tracking-wider hover:brightness-110"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim Laporan</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
