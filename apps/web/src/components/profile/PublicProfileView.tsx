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
  Trophy,
  Lock,
  QrCode,
  X,
  Send,
  RotateCw,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EsportCard } from "@/components/card/EsportCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { RarityTag } from "@/components/shared/RarityTag";
import { ShareCardModal } from "@/components/card/ShareCardModal";
import { IssuedBy } from "@/components/brand";
import { MockCardVariant, GALLERY_CARDS } from "@/data/mockCards";

interface PublicProfileViewProps {
  card: MockCardVariant;
}

export function PublicProfileView({ card }: PublicProfileViewProps) {
  const [activeTab, setActiveTab] = useState<"summary" | "achievements" | "team">("summary");
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("fake_data");
  const [reportNotes, setReportNotes] = useState("");
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const { type, rarity, verification, data } = card;

  // Related profiles (from same region or same game)
  const relatedProfiles = GALLERY_CARDS.filter(
    (c) => c.id !== card.id && (c.data.region.code === data.region.code || c.data.game === data.game)
  ).slice(0, 4);

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReportSubmitted(true);
    setTimeout(() => {
      setReportModalOpen(false);
      setReportSubmitted(false);
      setReportNotes("");
    }, 2000);
  };

  const displayNameOrTeam = type === "team" ? data.displayName : data.ign || data.displayName;

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[#FFFFFF] flex flex-col font-sans selection:bg-[#FF1752]/30 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 lg:px-8 py-10">
        {/* BREADCRUMBS */}
        <nav className="flex items-center gap-2 text-xs text-[#8E95A5] mb-8 font-mono overflow-x-auto whitespace-nowrap">
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
            {type === "player" ? "Pemain" : type === "coach" ? "Pelatih" : "Tim"}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#FF4D77] font-bold">{displayNameOrTeam}</span>
        </nav>

        {/* 2-COLUMN LAYOUT: LEFT STICKY TCG CARD (5/12) + RIGHT DETAILS (7/12) */}
        <div className="grid grid-cols-12 gap-10 lg:gap-14 items-start mb-20">
          {/* LEFT COLUMN: 5/12 STICKY CARD CONTAINER */}
          <div className="col-span-12 lg:col-span-5 flex flex-col items-center sticky top-24">
            {/* Ambient Rarity Glow behind card */}
            <div
              className={`absolute -inset-4 blur-3xl opacity-20 pointer-events-none rounded-full ${
                rarity === "legend"
                  ? "bg-purple-500"
                  : rarity === "elite"
                  ? "bg-[#D4AF37]"
                  : rarity === "contender"
                  ? "bg-[#22C55E]"
                  : "bg-amber-800"
              }`}
            />

            {/* Large Interactive TCG Card */}
            <div className="relative shadow-[0_20px_70px_rgba(0,0,0,0.85)] rounded-2xl group">
              <EsportCard
                type={type}
                rarity={rarity}
                verification={verification}
                data={data}
                size="lg"
                interactive={true}
                enableGyroscope={true}
              />
            </div>

            {/* IssuedBy Chip directly under card */}
            <div className="mt-4">
              <IssuedBy variant="badge" />
            </div>

            {/* Action Buttons Row (Bagikan, QR, Laporkan) */}
            <div className="flex items-center justify-center gap-2.5 mt-5 w-full max-w-[340px]">
              <button
                type="button"
                onClick={() => setShareModalOpen(true)}
                className="btn-brand-primary flex-1 py-3 text-xs"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Bagikan</span>
              </button>

              <button
                type="button"
                onClick={() => setQrModalOpen(true)}
                className="p-3 rounded-full bg-[#0F1118] hover:bg-[#161A24] border border-white/[0.08] hover:border-white/20 text-white transition-colors"
                title="Tampilkan Kode QR"
              >
                <QrCode className="w-4 h-4 text-[#D4AF37]" />
              </button>

              <button
                type="button"
                onClick={() => setReportModalOpen(true)}
                className="p-3 rounded-full bg-[#0F1118] hover:bg-[#161A24] border border-white/[0.08] hover:border-red-500/30 text-gray-400 hover:text-red-400 transition-colors"
                title="Laporkan Profil"
              >
                <Flag className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: 7/12 HEADER & BENTO TABS */}
          <div className="col-span-12 lg:col-span-7 flex flex-col gap-8">
            {/* 1. Header & Separated Identity Chips */}
            <div className="space-y-3 pb-6 border-b border-white/[0.08]">
              {/* Separated Chips Bar */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-1 rounded-full bg-[#0F1118] border border-white/[0.08] text-[10px] font-mono font-bold text-gray-300">
                  {data.esportId}
                </span>

                {/* VERIFICATION BADGE CHIP (SEPARATED) */}
                <StatusBadge status={verification} size="sm" />

                {/* RARITY TAG CHIP (SEPARATED) */}
                <RarityTag rarity={rarity} />

                <span className="px-2.5 py-0.5 rounded-full bg-white/[0.04] text-[10px] font-mono text-gray-400 uppercase">
                  {type}
                </span>
              </div>

              {/* Main IGN */}
              <h1 className="text-4xl sm:text-5xl font-heading font-black uppercase text-white tracking-tight">
                {displayNameOrTeam}
              </h1>

              {/* Display Name & Region */}
              <div className="flex items-center gap-3 text-xs text-[#8E95A5]">
                {data.displayName && data.displayName !== displayNameOrTeam && (
                  <span className="font-medium text-gray-300">{data.displayName}</span>
                )}
                <span>•</span>
                <span className="flex items-center gap-1 font-mono text-[#D4AF37]">
                  <MapPin className="w-3.5 h-3.5" />
                  {data.region.name} ({data.region.code})
                </span>
              </div>
            </div>

            {/* 2. Institutional ESPORT SUMBAR Verification Guarantee Notice */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0F1118] to-[#12151D] border border-white/[0.08] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-xs uppercase text-white">
                    Verifikasi ESPORT SUMBAR
                  </h4>
                  <p className="text-[11px] text-[#8E95A5] mt-0.5">
                    {verification === "verified"
                      ? `Lencana Emas (No: ${data.badgeNumber || "ESP-SB-VER-2026-0001"}) aktif 12 bulan.`
                      : verification === "regional"
                      ? `Lolos verifikasi daerah Wilayah ${data.region.name}. Menunggu pleno provinsi.`
                      : "Profil pendaftaran mandiri. Belum diverifikasi."}
                  </p>
                </div>
              </div>

              {verification === "verified" && (
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold uppercase shrink-0">
                  Aktif
                </span>
              )}
            </div>

            {/* 3. Segmented Tabs: Ringkasan | Prestasi | Tim/Roster */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b border-white/[0.08] pb-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("summary")}
                  className={`px-4 py-2 text-xs font-heading font-bold uppercase tracking-wider transition-all border-b-2 ${
                    activeTab === "summary"
                      ? "border-[#D4AF37] text-[#D4AF37]"
                      : "border-transparent text-gray-400 hover:text-white"
                  }`}
                >
                  Ringkasan
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("achievements")}
                  className={`px-4 py-2 text-xs font-heading font-bold uppercase tracking-wider transition-all border-b-2 ${
                    activeTab === "achievements"
                      ? "border-[#D4AF37] text-[#D4AF37]"
                      : "border-transparent text-gray-400 hover:text-white"
                  }`}
                >
                  Prestasi ({data.achievements?.length || 0})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("team")}
                  className={`px-4 py-2 text-xs font-heading font-bold uppercase tracking-wider transition-all border-b-2 ${
                    activeTab === "team"
                      ? "border-[#D4AF37] text-[#D4AF37]"
                      : "border-transparent text-gray-400 hover:text-white"
                  }`}
                >
                  {type === "team" ? `Roster (${data.rosterMembers?.length || 0})` : "Klub / Tim"}
                </button>
              </div>

              {/* TAB 1: BENTO RINGKASAN */}
              {activeTab === "summary" && (
                <div className="space-y-4">
                  {/* Bento Grid 4 Boxes */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-4 rounded-2xl bg-[#0F1118] border border-white/[0.08] flex flex-col justify-between">
                      <span className="text-[10px] font-mono text-gray-500 uppercase">
                        Game
                      </span>
                      <span className="text-sm font-heading font-bold text-white mt-2 flex items-center gap-1.5">
                        <Gamepad2 className="w-4 h-4 text-[#4C7DFF]" />
                        <span className="truncate">{data.game}</span>
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#0F1118] border border-white/[0.08] flex flex-col justify-between">
                      <span className="text-[10px] font-mono text-gray-500 uppercase">
                        Peran
                      </span>
                      <span className="text-sm font-heading font-bold text-white mt-2 truncate">
                        {data.role || "Kompetitif"}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#0F1118] border border-white/[0.08] flex flex-col justify-between">
                      <span className="text-[10px] font-mono text-gray-500 uppercase">
                        Wilayah
                      </span>
                      <span className="text-sm font-heading font-bold text-[#D4AF37] mt-2 truncate">
                        {data.region.code}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#0F1118] border border-white/[0.08] flex flex-col justify-between">
                      <span className="text-[10px] font-mono text-gray-500 uppercase">
                        Terdaftar
                      </span>
                      <span className="text-sm font-heading font-bold text-white mt-2">
                        2026
                      </span>
                    </div>
                  </div>

                  {/* Team Affiliation Box if Athlete */}
                  {type === "player" && data.team && (
                    <div className="p-4 rounded-2xl bg-[#0F1118] border border-white/[0.08] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center text-[#D4AF37] border border-white/10">
                          <Users className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono uppercase text-gray-500">
                            Klub Naungan
                          </span>
                          <h4 className="text-sm font-heading font-bold text-white">
                            {data.team.name}
                          </h4>
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold">
                        Disetujui
                      </span>
                    </div>
                  )}

                  {/* UU PDP Compliance Guarantee Banner */}
                  <div className="p-3.5 rounded-2xl bg-[#0F1118] border border-white/[0.06] flex items-center gap-2.5 text-xs text-[#8E95A5]">
                    <Lock className="w-4 h-4 text-[#22C55E] shrink-0" />
                    <span>
                      Data pribadi dan nomor kontak tersimpan aman di basis data privat terenkripsi sesuai UU PDP.
                    </span>
                  </div>
                </div>
              )}

              {/* TAB 2: PRESTASI TERVALIDASI */}
              {activeTab === "achievements" && (
                <div className="space-y-2.5">
                  {data.achievements && data.achievements.length > 0 ? (
                    data.achievements.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-[#0F1118] border border-white/[0.08] flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
                            <Trophy className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-heading font-bold text-sm text-white">
                                {item.title}
                              </h4>
                              {item.isValidated && (
                                <span className="text-[9px] font-mono text-[#D4AF37] bg-[#D4AF37]/10 px-1.5 py-0.2 rounded border border-[#D4AF37]/30 flex items-center gap-0.5">
                                  <CheckCircle2 className="w-2.5 h-2.5" />
                                  <span>Terverifikasi</span>
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-gray-400 font-mono">
                              Tahun {item.year} · {item.placement}
                            </span>
                          </div>
                        </div>

                        <span className="px-2.5 py-1 rounded-full bg-white/[0.04] text-[10px] font-mono font-bold text-gray-300 uppercase">
                          {item.level}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 text-center text-gray-500 text-xs">
                      Belum ada prestasi kompetisi tercatat.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: TIM / ROSTER */}
              {activeTab === "team" && (
                <div className="space-y-3">
                  {type === "team" && data.rosterMembers ? (
                    <div className="grid grid-cols-2 gap-3">
                      {data.rosterMembers.map((member, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-2xl bg-[#0F1118] border border-white/[0.08] flex items-center gap-3"
                        >
                          <div className="w-10 h-10 rounded-xl bg-[#1A1E28] border border-white/10 flex items-center justify-center font-heading font-black text-sm text-[#D4AF37]">
                            {member.ign.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-heading font-bold text-sm text-white block">
                              {member.ign}
                            </span>
                            <span className="text-[10px] text-gray-400 font-mono">
                              {member.role}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : type === "player" && data.history ? (
                    <div className="space-y-2">
                      {data.history.map((hist, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-2xl bg-[#0F1118] border border-white/[0.08] flex items-center justify-between"
                        >
                          <div>
                            <span className="font-heading font-bold text-sm text-white block">
                              {hist.teamName}
                            </span>
                            <span className="text-[10px] text-gray-400 font-mono">
                              {hist.role}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-gray-500">
                            {hist.period}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center text-gray-500 text-xs">
                      Tidak ada riwayat tim tercatat.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 4. RELATED PROFILES SECTION */}
        <section className="pt-12 border-t border-white/[0.08]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading font-bold text-base uppercase text-white tracking-wide">
              Profil Terkait di {data.region.name}
            </h3>
            <Link
              href="/explore"
              className="text-xs font-heading font-bold text-[#D4AF37] hover:underline"
            >
              Lihat Semua →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {relatedProfiles.map((rel) => {
              const relSlug = (rel.data.ign || rel.data.displayName)
                .toLowerCase()
                .replace(/\s+/g, "-");
              return (
                <Link
                  key={rel.id}
                  href={`/player/${relSlug}`}
                  className="group flex flex-col items-center hover:-translate-y-1.5 transition-transform"
                >
                  <EsportCard
                    type={rel.type}
                    rarity={rel.rarity}
                    verification={rel.verification}
                    data={rel.data}
                    size="sm"
                    interactive={false}
                  />
                  <span className="mt-2.5 text-xs font-heading font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                    {rel.data.ign || rel.data.displayName}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />

      {/* SHARE MODAL */}
      <ShareCardModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        cardData={card}
      />

      {/* QR CODE MODAL */}
      {qrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-sm rounded-3xl bg-[#0F1118] border border-white/[0.08] p-6 text-center space-y-4">
            <button
              onClick={() => setQrModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-heading font-black uppercase text-base text-white">
              Kode QR Profil Digital
            </h3>
            <div className="p-4 rounded-2xl bg-white mx-auto w-48 h-48 flex items-center justify-center">
              <QrCode className="w-40 h-40 text-black" />
            </div>
            <p className="text-xs text-gray-400 font-mono">
              Pindai untuk memverifikasi kartu ESPORT ID
            </p>
          </div>
        </div>
      )}

      {/* REPORT MODAL */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl bg-[#0F1118] border border-white/[0.08] p-6 space-y-4">
            <button
              onClick={() => setReportModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {reportSubmitted ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-[#22C55E] mx-auto" />
                <h3 className="font-heading font-black uppercase text-base text-white">
                  Laporan Diterima
                </h3>
                <p className="text-xs text-gray-400">
                  Tim Pengawas ESPORT SUMBAR akan meninjau laporan ini dalam 2x24 jam.
                </p>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4">
                <h3 className="font-heading font-black uppercase text-base text-white flex items-center gap-2">
                  <Flag className="w-4 h-4 text-red-400" />
                  <span>Laporkan Profil Ini</span>
                </h3>

                <div className="space-y-1">
                  <label className="text-[11px] font-heading font-bold uppercase text-gray-400">
                    Alasan Pelaporan:
                  </label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none"
                  >
                    <option value="fake_data">Data atlet / identitas palsu</option>
                    <option value="impersonation">Pencatutan nama klub / tim</option>
                    <option value="cheating">Pelanggaran sportivitas / ban ESPORT SUMBAR</option>
                    <option value="other">Lainnya</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-heading font-bold uppercase text-gray-400">
                    Keterangan Tambahan:
                  </label>
                  <textarea
                    rows={3}
                    value={reportNotes}
                    onChange={(e) => setReportNotes(e.target.value)}
                    placeholder="Sertakan bukti tautan atau keterangan..."
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-heading font-black uppercase tracking-wider transition-all"
                >
                  Kirim Laporan
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
