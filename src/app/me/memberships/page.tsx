"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  LogOut,
  Mail,
  UserCheck,
  X,
  PlusCircle,
  ArrowRight,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function MembershipsPage() {
  const [activeTab, setActiveTab] = useState<"invitations" | "requests" | "my_teams" | "history">("invitations");

  // Sample dynamic states
  const [invitations, setInvitations] = useState([
    {
      id: "inv-1",
      teamName: "Minang Pride Esports",
      teamTag: "MPR",
      game: "Mobile Legends: Bang Bang",
      invitedBy: "Andi Saputra (Manajer Tim)",
      roleOffered: "Roamer / Rusher",
      date: "Kemarin, 14:30 WIB",
      status: "pending",
    },
  ]);

  const [myRequests, setMyRequests] = useState([
    {
      id: "req-1",
      teamName: "Ranah Garuda Esports",
      game: "PUBG Mobile",
      requestedRole: "Sniper Cadangan",
      date: "20 Jan 2026",
      status: "pending", // pending, accepted, declined
    },
    {
      id: "req-2",
      teamName: "Bukittinggi Esport Club",
      game: "Free Fire",
      requestedRole: "Fragger",
      date: "10 Jan 2026",
      status: "accepted",
    },
  ]);

  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const handleAcceptInvitation = (id: string) => {
    setInvitations((prev) => prev.filter((i) => i.id !== id));
    showToast("Selamat! Anda telah resmi bergabung ke dalam roster tim.");
  };

  const handleDeclineInvitation = (id: string) => {
    setInvitations((prev) => prev.filter((i) => i.id !== id));
    showToast("Undangan tim telah ditolak.");
  };

  const handleCancelRequest = (id: string) => {
    setMyRequests((prev) => prev.filter((r) => r.id !== id));
    showToast("Permintaan bergabung berhasil dibatalkan.");
  };

  return (
    <div className="min-h-screen bg-[#0B0D12] text-[#F3F4F6] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* TOAST FEEDBACK */}
        {feedbackToast && (
          <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1A1E28] border border-[#22C55E] text-white text-xs font-heading font-medium shadow-2xl animate-in slide-in-from-top-4">
            <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
            <span>{feedbackToast}</span>
          </div>
        )}

        {/* BREADCRUMBS */}
        <nav className="flex items-center gap-2 text-xs text-[#9AA3B2] mb-6 font-mono">
          <Link href="/dashboard" className="hover:text-white transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#D4AF37] font-bold">Relasi Tim & Keanggotaan</span>
        </nav>

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#D4AF37] uppercase">
              <span>Manajemen Roster & Keanggotaan</span>
              <span>•</span>
              <span>Persetujuan Dua Arah</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-black uppercase text-white tracking-tight mt-1">
              Relasi Tim & Roster
            </h1>
            <p className="text-xs sm:text-sm text-[#9AA3B2] max-w-xl">
              Kelola undangan masuk dari klub, lacak permintaan bergabung Anda, dan tinjau riwayat keanggotaan tim secara resmi.
            </p>
          </div>

          <Link
            href="/me/team/minang-pride/roster"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1A1E28] hover:bg-[#262B38] border border-[#D4AF37]/50 text-xs font-heading font-bold uppercase tracking-wider text-[#D4AF37] transition-colors shrink-0"
          >
            <Users className="w-4 h-4" />
            <span>Portal Roster Manajer Tim</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* TWO-WAY CONSENT BANNER (PRD P4) */}
        <div className="mb-8 p-4 rounded-xl bg-[#12151C] border border-[#262B38] flex items-start gap-3 text-xs text-[#9AA3B2]">
          <ShieldCheck className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Prinsip P4 PRD (Anti-Pencatutan Nama):</strong> Di platform ESPORT SUMBAR, nama seorang atlet tidak akan pernah muncul di roster publik tanpa persetujuannya. Setiap relasi membutuhkan kesepakatan dua arah (undangan diterima atau permohonan disetujui).
          </p>
        </div>

        {/* TABS NAVIGATION */}
        <div className="flex items-center gap-2 border-b border-[#262B38] pb-1 mb-8 overflow-x-auto scrollbar-none">
          {[
            { id: "invitations", label: `Undangan Masuk (${invitations.length})` },
            { id: "requests", label: `Permintaan Saya (${myRequests.length})` },
            { id: "my_teams", label: "Tim Aktif Saya" },
            { id: "history", label: "Riwayat Karier Tim" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-t-lg text-xs font-heading font-bold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-[#D4AF37] text-[#D4AF37] bg-[#12151C]"
                  : "border-transparent text-gray-400 hover:text-white hover:bg-[#161922]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: UNDANGAN MASUK (INCOMING INVITATIONS) */}
        {activeTab === "invitations" && (
          <div className="flex flex-col gap-4">
            {invitations.length > 0 ? (
              invitations.map((inv) => (
                <div
                  key={inv.id}
                  className="p-5 sm:p-6 rounded-2xl bg-[#12151C] border border-[#262B38] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-lg"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#1A1E28] border border-[#D4AF37]/40 flex items-center justify-center font-heading font-black text-lg text-[#D4AF37] shrink-0">
                      {inv.teamTag}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <h3 className="font-heading font-bold text-base text-white">
                          {inv.teamName}
                        </h3>
                        <span className="px-2 py-0.5 rounded bg-[#3B82F6]/15 text-[#3B82F6] text-[9px] font-mono font-bold uppercase">
                          {inv.game}
                        </span>
                      </div>
                      <p className="text-xs text-[#9AA3B2] mt-1">
                        Pengundang: <strong className="text-gray-300">{inv.invitedBy}</strong>
                      </p>
                      <p className="text-xs text-gray-300 mt-0.5">
                        Posisi/Peran yang Ditawarkan:{" "}
                        <strong className="text-[#D4AF37]">{inv.roleOffered}</strong>
                      </p>
                      <span className="text-[10px] text-gray-500 font-mono mt-1">
                        Diterima: {inv.date}
                      </span>
                    </div>
                  </div>

                  {/* Actions: Accept or Decline */}
                  <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#262B38]">
                    <button
                      type="button"
                      onClick={() => handleDeclineInvitation(inv.id)}
                      className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[#1A1E28] hover:bg-red-950/40 text-gray-400 hover:text-red-400 text-xs font-heading font-bold uppercase transition-colors"
                    >
                      Tolak
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAcceptInvitation(inv.id)}
                      className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-[#22C55E] text-black text-xs font-heading font-extrabold uppercase tracking-wider hover:brightness-110 transition-all shadow-md"
                    >
                      Terima & Bergabung
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center rounded-2xl bg-[#12151C] border border-[#262B38] text-xs text-[#9AA3B2] flex flex-col items-center gap-2">
                <Mail className="w-8 h-8 text-gray-500 mb-1" />
                <h4 className="font-heading font-bold text-sm text-white">
                  Tidak Ada Undangan Masuk
                </h4>
                <p>Saat ini belum ada klub esport yang mengirimkan undangan roster ke akun Anda.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PERMINTAAN SAYA (OUTGOING REQUESTS) */}
        {activeTab === "requests" && (
          <div className="flex flex-col gap-4">
            {myRequests.length > 0 ? (
              myRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-5 rounded-2xl bg-[#12151C] border border-[#262B38] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#161922] border border-[#262B38] flex items-center justify-center text-[#D4AF37] shrink-0">
                      <Send className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-sm text-white">
                        {req.teamName}
                      </h4>
                      <p className="text-xs text-[#9AA3B2]">
                        Divisi: {req.game} • Posisi Diajukan: <strong className="text-gray-200">{req.requestedRole}</strong>
                      </p>
                      <span className="text-[10px] text-gray-500 font-mono">
                        Dikirim pada: {req.date}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase ${
                        req.status === "accepted"
                          ? "bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30"
                          : req.status === "pending"
                          ? "bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30"
                          : "bg-red-950/30 text-red-400"
                      }`}
                    >
                      {req.status === "accepted"
                        ? "Disetujui"
                        : req.status === "pending"
                        ? "Menunggu Tanggapan"
                        : "Ditolak"}
                    </span>

                    {req.status === "pending" && (
                      <button
                        type="button"
                        onClick={() => handleCancelRequest(req.id)}
                        className="text-xs text-gray-400 hover:text-red-400 font-heading uppercase"
                      >
                        Batalkan
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center rounded-2xl bg-[#12151C] border border-[#262B38] text-xs text-[#9AA3B2]">
                Anda belum mengirimkan permintaan bergabung ke klub mana pun.
              </div>
            )}
          </div>
        )}

        {/* TAB 3: TIM AKTIF SAYA */}
        {activeTab === "my_teams" && (
          <div className="flex flex-col gap-6">
            <div className="p-6 rounded-2xl bg-[#12151C] border border-[#262B38] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#161922] border border-[#D4AF37]/50 flex items-center justify-center font-heading font-black text-xl text-[#D4AF37] shrink-0">
                  MRW
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-bold text-lg text-white">
                      Marawa Muda Esports
                    </h3>
                    <span className="px-2 py-0.5 rounded bg-[#22C55E]/20 text-[#22C55E] text-[10px] font-mono font-bold">
                      AKTIF DI ROSTER
                    </span>
                  </div>
                  <p className="text-xs text-[#9AA3B2] mt-0.5">
                    Divisi Free Fire • Homebase: Kota Padang
                  </p>
                  <p className="text-xs text-gray-300 mt-1">
                    Peran Resmi: <strong>Rusher / Sniper Utama</strong> • Bergabung sejak: <strong>Januari 2025</strong>
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto">
                <Link
                  href="/team/marawa-muda"
                  className="px-4 py-2 rounded-xl bg-[#1A1E28] hover:bg-[#262B38] border border-[#262B38] text-xs font-heading font-bold uppercase text-white text-center"
                >
                  Lihat Profil Tim
                </Link>

                <button
                  type="button"
                  onClick={() => setLeaveModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-[#1A1E28] hover:bg-red-950/40 text-red-400 text-xs font-heading font-bold uppercase transition-colors"
                >
                  Keluar dari Tim
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: RIWAYAT KARIER TIM */}
        {activeTab === "history" && (
          <div className="flex flex-col gap-3">
            {[
              {
                team: "Khatib Squad Padang",
                game: "Free Fire",
                role: "Fragger",
                period: "2024 - 2025 (12 Bulan)",
                reason: "Mutasi ke klub Marawa Muda secara resmi",
              },
              {
                team: "Padang All-Stars Junior",
                game: "Free Fire",
                role: "Cadangan",
                period: "2023 - 2024 (6 Bulan)",
                reason: "Selesai masa kontrak turnamen pelajar",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#12151C] border border-[#262B38] flex items-center justify-between gap-4"
              >
                <div>
                  <h4 className="font-heading font-bold text-sm text-white">
                    {item.team}
                  </h4>
                  <p className="text-xs text-[#9AA3B2]">
                    {item.game} • Peran: {item.role}
                  </p>
                  <span className="text-[10px] text-gray-500 font-mono">
                    Catatan: {item.reason}
                  </span>
                </div>
                <span className="text-xs font-mono text-gray-400 shrink-0">
                  {item.period}
                </span>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* CONFIRMATION DIALOG: LEAVE TEAM */}
      {leaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-[#12151C] border border-[#262B38] p-6 flex flex-col gap-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#262B38] pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[#EF4444]" />
                <h3 className="font-heading font-bold text-sm uppercase text-white">
                  Konfirmasi Keluar dari Tim
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setLeaveModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#9AA3B2] leading-relaxed">
              Apakah Anda yakin ingin meninggalkan klub <strong>Marawa Muda Esports</strong>? Nama Anda akan dihapus dari roster aktif tim dan status Anda akan kembali menjadi <em>Free Agent</em>.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#262B38]">
              <button
                type="button"
                onClick={() => setLeaveModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-heading font-medium text-gray-400 hover:text-white"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  setLeaveModalOpen(false);
                  showToast("Anda telah keluar dari tim dan berstatus Free Agent.");
                }}
                className="px-5 py-2 rounded-xl bg-[#EF4444] text-white text-xs font-heading font-bold uppercase hover:brightness-110"
              >
                Ya, Keluar dari Tim
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
