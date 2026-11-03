"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  ShieldCheck,
  Award,
  UserPlus,
  Crown,
  Trash2,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Search,
  X,
  ChevronRight,
  AlertTriangle,
  Send,
  ExternalLink,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function TeamRosterClient({ teamId }: { teamId?: string }) {
  const [activeMembers, setActiveMembers] = useState([
    {
      id: "mbr-1",
      ign: "MARAWA_KING",
      name: "Fikri Alamsyah",
      role: "Kapten / Roamer",
      esportId: "ESB-BKT-PL-000042",
      rarity: "Elite",
      joinedAt: "Maret 2024",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    },
    {
      id: "mbr-2",
      ign: "BukitSlayer",
      name: "Derry Andika",
      role: "Jungler Utama",
      esportId: "ESB-BKT-PL-000109",
      rarity: "Contender",
      joinedAt: "Juni 2024",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    },
    {
      id: "mbr-3",
      ign: "SingaMalam",
      name: "Iqbal Ramadhan",
      role: "Gold Laner",
      esportId: "ESB-PDG-PL-000215",
      rarity: "Contender",
      joinedAt: "Agustus 2024",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    },
    {
      id: "mbr-4",
      ign: "PariamanBoy",
      name: "Aldi Pratama",
      role: "EXP Laner",
      esportId: "ESB-PDP-PL-000188",
      rarity: "Contender",
      joinedAt: "September 2024",
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
    },
    {
      id: "mbr-5",
      ign: "AgamWizard",
      name: "Wahyu Hidayat",
      role: "Mid Laner",
      esportId: "ESB-AGM-PL-000244",
      rarity: "Contender",
      joinedAt: "Oktober 2024",
      avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop",
    },
  ]);

  const [pendingRequests, setPendingRequests] = useState([
    {
      id: "req-101",
      ign: "SUTAN_AIM",
      name: "Raka Pratama",
      game: "Mobile Legends",
      region: "Kota Padang",
      esportId: "ESB-PDG-PL-000124",
      rarity: "Contender",
      date: "Kemarin",
    },
  ]);

  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [removeModalMember, setRemoveModalMember] = useState<any | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [searchPlayerQuery, setSearchPlayerQuery] = useState("");
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const handleApproveRequest = (id: string) => {
    const candidate = pendingRequests.find((r) => r.id === id);
    if (!candidate) return;

    setActiveMembers((prev) => [
      ...prev,
      {
        id: `mbr-${Date.now()}`,
        ign: candidate.ign,
        name: candidate.name,
        role: "Anggota Cadangan",
        esportId: candidate.esportId,
        rarity: candidate.rarity,
        joinedAt: "Hari ini",
        avatarUrl: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=200&auto=format&fit=crop",
      },
    ]);
    setPendingRequests((prev) => prev.filter((r) => r.id !== id));
    showToast(`${candidate.ign} berhasil disetujui masuk ke roster aktif tim!`);
  };

  const handleRejectRequest = (id: string) => {
    setPendingRequests((prev) => prev.filter((r) => r.id !== id));
    showToast("Permintaan bergabung telah ditolak.");
  };

  const handleRemoveMember = () => {
    if (!removeModalMember) return;
    setActiveMembers((prev) => prev.filter((m) => m.id !== removeModalMember.id));
    showToast(`${removeModalMember.ign} telah dilepaskan dari roster tim.`);
    setRemoveModalMember(null);
  };

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText("https://esportsumbar.id/join-team/minang-pride-invite-883");
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#0B0D12] text-[#F3F4F6] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* TOAST FEEDBACK */}
        {feedbackToast && (
          <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1A1E28] border border-[#22C55E] text-white text-xs font-heading font-medium shadow-2xl animate-in slide-in-from-top-4">
            <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
            <span>{feedbackToast}</span>
          </div>
        )}

        {/* BREADCRUMB */}
        <nav className="flex items-center gap-2 text-xs text-[#9AA3B2] mb-6 font-mono">
          <Link href="/dashboard" className="hover:text-white transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/me/memberships" className="hover:text-white transition-colors">
            Relasi Tim
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#D4AF37] font-bold">Kelola Roster Tim</span>
        </nav>

        {/* HEADER AREA */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#161922] via-[#12151C] to-[#161922] border border-[#262B38] mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#1A1E28] border-2 border-[#D4AF37] flex items-center justify-center font-heading font-black text-2xl text-[#D4AF37] shadow-lg shrink-0">
              MPE
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-heading font-black uppercase text-white tracking-tight">
                  Minang Pride Esports
                </h1>
                <span className="px-2 py-0.5 rounded bg-[#22C55E]/15 border border-[#22C55E]/30 text-[#22C55E] text-[10px] font-mono font-bold">
                  VERIFIED ESI
                </span>
              </div>
              <p className="text-xs text-[#9AA3B2] mt-0.5">
                Divisi Mobile Legends • Homebase: Kota Padang • ID Tim: {teamId || "tm-contender"}
              </p>
              <div className="flex items-center gap-2 mt-2 text-[11px] text-gray-300">
                <span className="bg-[#1A1E28] px-2 py-0.5 rounded border border-[#262B38]">
                  Total Roster: <strong>{activeMembers.length} Atlet</strong>
                </span>
                <span className="bg-[#1A1E28] px-2 py-0.5 rounded border border-[#262B38]">
                  Status Perekrutan: <strong className="text-[#22C55E]">Terbuka</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              type="button"
              onClick={() => setInviteModalOpen(true)}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E5C358] text-black text-xs font-heading font-extrabold uppercase tracking-wider shadow-lg hover:brightness-110 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Undang Pemain Baru</span>
            </button>

            <Link
              href="/team/minang-pride"
              className="p-2.5 rounded-xl bg-[#1A1E28] hover:bg-[#262B38] border border-[#262B38] text-gray-300 hover:text-white"
              title="Lihat Profil Publik Tim"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* TWO-WAY CONSENT NOTICE BANNER */}
        <div className="mb-8 p-4 rounded-xl bg-[#3B82F6]/10 border border-[#3B82F6]/30 text-[#93C5FD] text-xs flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#3B82F6] shrink-0 mt-0.5" />
          <div className="flex flex-col gap-0.5 leading-relaxed">
            <span className="font-heading font-bold uppercase text-white">
              Prinsip Two-Way Roster Consent (Persetujuan Timbal Balik)
            </span>
            <span>
              Nama atlet HANYA akan tampil di susunan roster resmi publik setelah kedua pihak menyetujui (manajer mengundang/menyetujui dan atlet mengonfirmasi penerimaan). Hal ini melindungi integritas data atlet dan mencegah klaim roster sepihak.
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: ROSTER AKTIF (8 COLS) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#D4AF37]" />
                <h2 className="font-heading font-bold text-sm uppercase text-white tracking-wide">
                  Susunan Roster Aktif ({activeMembers.length} Atlet)
                </h2>
              </div>
              <span className="text-[10px] text-[#9AA3B2] font-mono">
                Batas Turnamen: 5 Inti + 2 Cadangan
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeMembers.map((member, index) => (
                <div
                  key={member.id}
                  className="p-4 rounded-2xl bg-[#12151C] border border-[#262B38] hover:border-[#3B4254] transition-all flex flex-col justify-between gap-4 group relative overflow-hidden"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={member.avatarUrl}
                      alt={member.ign}
                      className="w-12 h-12 rounded-xl object-cover border border-[#262B38] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-mono text-[#D4AF37] font-bold">
                          {member.rarity.toUpperCase()}
                        </span>
                        {index === 0 && (
                          <span className="flex items-center gap-1 text-[9px] font-mono uppercase bg-[#D4AF37]/20 text-[#D4AF37] px-1.5 py-0.5 rounded font-bold">
                            <Crown className="w-2.5 h-2.5" />
                            Kapten
                          </span>
                        )}
                      </div>
                      <h4 className="font-heading font-bold text-sm text-white uppercase truncate mt-0.5">
                        {member.ign}
                      </h4>
                      <p className="text-xs text-[#9AA3B2] truncate">
                        {member.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 pt-2 border-t border-[#262B38]/60 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-[11px]">Peran Roster:</span>
                      <select
                        value={member.role}
                        onChange={(e) => {
                          const newRole = e.target.value;
                          setActiveMembers((prev) =>
                            prev.map((m) => (m.id === member.id ? { ...m, role: newRole } : m))
                          );
                          showToast(`Peran ${member.ign} diubah menjadi ${newRole}.`);
                        }}
                        className="bg-[#161922] border border-[#262B38] text-[11px] font-medium text-white px-2 py-1 rounded-lg focus:outline-none focus:border-[#D4AF37]"
                      >
                        <option value="Kapten / Roamer">Kapten / Roamer</option>
                        <option value="Jungler Utama">Jungler Utama</option>
                        <option value="Gold Laner">Gold Laner</option>
                        <option value="EXP Laner">EXP Laner</option>
                        <option value="Mid Laner">Mid Laner</option>
                        <option value="Anggota Cadangan">Anggota Cadangan</option>
                        <option value="Pelatih / Coach">Pelatih / Coach</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono mt-1">
                      <span>{member.esportId}</span>
                      <span>Sejak {member.joinedAt}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#262B38]/40">
                    <Link
                      href={`/player/${member.ign.toLowerCase()}`}
                      className="text-[11px] font-heading font-semibold text-[#3B82F6] hover:underline"
                    >
                      Lihat Kartu Atlet →
                    </Link>

                    <button
                      type="button"
                      onClick={() => setRemoveModalMember(member)}
                      className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors"
                      title="Keluarkan dari Roster"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: PERMINTAAN BERGABUNG (4 COLS) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="p-5 rounded-2xl bg-[#12151C] border border-[#262B38] flex flex-col gap-4 shadow-md">
              <div className="flex items-center justify-between pb-3 border-b border-[#262B38]">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-[#22C55E]" />
                  <h3 className="font-heading font-bold text-xs uppercase text-white">
                    Permintaan Bergabung ({pendingRequests.length})
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-[#D4AF37] font-bold">
                  Menunggu Persetujuan
                </span>
              </div>

              {pendingRequests.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {pendingRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-3.5 rounded-xl bg-[#161922] border border-[#262B38] flex flex-col gap-3"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-[#D4AF37] font-bold">
                            {req.rarity.toUpperCase()}
                          </span>
                          <span className="text-[10px] text-gray-500 font-mono">{req.date}</span>
                        </div>
                        <h4 className="font-heading font-bold text-sm text-white uppercase mt-0.5">
                          {req.ign}
                        </h4>
                        <p className="text-xs text-[#9AA3B2]">{req.name}</p>
                        <p className="text-[11px] text-gray-400 mt-1">
                          Domisili: {req.region} • Game: {req.game}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-[#262B38]">
                        <button
                          type="button"
                          onClick={() => handleRejectRequest(req.id)}
                          className="flex-1 py-1.5 rounded-lg bg-[#1A1E28] hover:bg-red-950/40 text-gray-400 hover:text-red-400 text-xs font-heading font-bold uppercase transition-colors"
                        >
                          Tolak
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApproveRequest(req.id)}
                          className="flex-1 py-1.5 rounded-lg bg-[#22C55E] text-black text-xs font-heading font-extrabold uppercase hover:brightness-110 transition-all shadow-md"
                        >
                          Setujui
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-[#9AA3B2]">
                  Belum ada permintaan bergabung baru dari pemain.
                </div>
              )}
            </div>

            {/* QUICK LINK CARD */}
            <div className="p-5 rounded-2xl bg-[#12151C] border border-[#262B38] flex flex-col gap-3">
              <span className="font-heading font-bold text-xs uppercase text-white">
                Tautan Undangan Roster Terbuka
              </span>
              <p className="text-xs text-[#9AA3B2] leading-relaxed">
                Bagikan tautan ini kepada calon pemain untuk langsung mengajukan formulir trial bergabung ke klub Anda:
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value="https://esportsumbar.id/join-team/minang-pride-invite-883"
                  className="flex-1 bg-[#161922] border border-[#262B38] rounded-xl px-3 py-2 text-xs text-gray-300 font-mono select-all focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleCopyInviteLink}
                  className="p-2 rounded-xl bg-[#1A1E28] hover:bg-[#262B38] border border-[#262B38] text-[#D4AF37] hover:text-white transition-colors"
                  title="Salin Tautan Undangan"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-[#22C55E]" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL: INVITE PLAYER */}
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-[#12151C] border border-[#262B38] p-6 flex flex-col gap-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#262B38] pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="font-heading font-bold text-sm uppercase text-white">
                  Undang Pemain ke Minang Pride
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInviteModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-[11px] font-heading font-bold uppercase text-gray-300">
                Opsi 1: Bagikan Tautan Undangan Langsung
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value="https://esportsumbar.id/join-team/minang-pride-invite-883"
                  className="flex-1 bg-[#161922] border border-[#262B38] rounded-xl px-3 py-2 text-xs text-gray-300 font-mono select-all focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleCopyInviteLink}
                  className="px-3 py-2 rounded-xl bg-[#D4AF37] text-black text-xs font-heading font-bold uppercase flex items-center gap-1.5 shrink-0"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? "Tersalin!" : "Salin"}</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2 border-t border-[#262B38]">
              <span className="text-[11px] font-heading font-bold uppercase text-gray-300">
                Opsi 2: Cari Berdasarkan In-Game Name (IGN) / ESPORT ID
              </span>
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchPlayerQuery}
                  onChange={(e) => setSearchPlayerQuery(e.target.value)}
                  placeholder="Ketik IGN atau nomor ESPORT ID..."
                  className="w-full bg-[#161922] border border-[#262B38] focus:border-[#D4AF37] rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              {searchPlayerQuery && (
                <div className="p-3 rounded-xl bg-[#161922] border border-[#262B38] flex items-center justify-between mt-1">
                  <div>
                    <h5 className="font-heading font-bold text-xs text-white">
                      Raka Pratama ({searchPlayerQuery})
                    </h5>
                    <span className="text-[10px] text-[#9AA3B2]">
                      ESB-PDG-PL-000124 • Kota Padang
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      showToast(`Undangan resmi berhasil dikirim ke ${searchPlayerQuery}!`);
                      setInviteModalOpen(false);
                      setSearchPlayerQuery("");
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#22C55E] text-black text-xs font-heading font-bold uppercase"
                  >
                    Kirim Undangan
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION DIALOG: REMOVE ROSTER MEMBER */}
      {removeModalMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-[#12151C] border border-[#262B38] p-6 flex flex-col gap-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#262B38] pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
                <h3 className="font-heading font-bold text-sm uppercase text-white">
                  Keluarkan Anggota dari Roster
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setRemoveModalMember(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#9AA3B2] leading-relaxed">
              Apakah Anda yakin ingin mengeluarkan <strong>{removeModalMember.ign}</strong> ({removeModalMember.name}) dari susunan roster aktif klub? Riwayat keanggotaan atlet akan otomatis dipindahkan ke arsip karier.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#262B38]">
              <button
                type="button"
                onClick={() => setRemoveModalMember(null)}
                className="px-4 py-2 rounded-xl text-xs font-heading font-medium text-gray-400 hover:text-white"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleRemoveMember}
                className="px-5 py-2 rounded-xl bg-[#EF4444] text-white text-xs font-heading font-bold uppercase hover:brightness-110"
              >
                Ya, Lepaskan dari Roster
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}