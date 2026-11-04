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
  Plus,
  Crown,
  Gamepad2,
  ExternalLink,
} from "lucide-react";

export function DesktopMembershipsView() {
  const [invitations, setInvitations] = useState([
    {
      id: "inv-1",
      teamName: "Minang Pride Esports",
      teamTag: "MPR",
      game: "Mobile Legends: Bang Bang",
      invitedBy: "Andi Saputra (Manajer Tim)",
      roleOffered: "Roamer",
      date: "Kemarin, 14:30 WIB",
    },
    {
      id: "inv-2",
      teamName: "Singkarak Legion",
      teamTag: "SKR",
      game: "PUBG Mobile",
      invitedBy: "Dedi Kurniawan (Pelatih)",
      roleOffered: "Rusher",
      date: "2 hari lalu",
    },
  ]);

  const [requests, setRequests] = useState([
    {
      id: "req-1",
      teamName: "Ranah Garuda Esports",
      teamTag: "RGD",
      game: "Valorant",
      requestedRole: "Duelist",
      date: "20 Jan 2026",
      status: "Menunggu Jawaban",
    },
  ]);

  const [roster, setRoster] = useState([
    {
      name: "Sutan Harimau",
      ign: "HARIMAU_AIM",
      role: "Roamer",
      isCaptain: true,
      avatarUrl: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=400&auto=format&fit=crop",
    },
    {
      name: "Rizky Pratama",
      ign: "RZKY_SLAYER",
      role: "Jungler",
      isCaptain: false,
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop",
    },
    {
      name: "Fauzan Ahmad",
      ign: "ZAN_MID",
      role: "Mid Laner",
      isCaptain: false,
      avatarUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=200&auto=format&fit=crop",
    },
    {
      name: "Dimas Saputra",
      ign: "DMS_GOLD",
      role: "Gold Laner",
      isCaptain: false,
      avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop",
    },
    {
      name: "Ilham Ramadhan",
      ign: "ILHAM_EXP",
      role: "EXP Laner",
      isCaptain: false,
      avatarUrl: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=200&auto=format&fit=crop",
    },
  ]);

  const handleAcceptInvite = (id: string) => {
    setInvitations((prev) => prev.filter((i) => i.id !== id));
    alert("Undangan tim diterima! Roster tim telah diperbarui.");
  };

  const handleDeclineInvite = (id: string) => {
    setInvitations((prev) => prev.filter((i) => i.id !== id));
  };

  const handleCancelRequest = (id: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="w-full flex flex-col gap-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-heading font-black text-white tracking-tight">
          Keanggotaan Tim &amp; Roster
        </h1>
        <p className="text-xs text-white/50 mt-1">
          Kelola tim resmi, daftar roster atlet, dan undangan transfer pemain antar klub PBESI Sumbar.
        </p>
      </div>

      {/* ========================================================= */}
      {/* ROSTER TIM AKTIF (DERETAN AVATAR BESAR + CHIP + KUOTA)   */}
      {/* ========================================================= */}
      <div className="p-8 rounded-3xl bg-[#0F1118]/80 border border-white/[0.08] shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between pb-6 border-b border-white/[0.08]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-black text-lg text-white">
                  Minang Pride Esports
                </h3>
                <span className="px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[10px] font-mono text-[#D4AF37] font-bold">
                  MPR
                </span>
              </div>
              <p className="text-xs text-white/50">
                Divisi: Mobile Legends: Bang Bang • Homebase: Kota Padang
              </p>
            </div>
          </div>

          {/* Kuota dalam Cincin Kecil (5/7) */}
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="4"
                  fill="none"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="#D4AF37"
                  strokeWidth="4"
                  strokeDasharray={2 * Math.PI * 20}
                  strokeDashoffset={2 * Math.PI * 20 * (1 - 5 / 7)}
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              <span className="absolute font-mono font-bold text-xs text-white">
                5/7
              </span>
            </div>
            <div className="text-right">
              <div className="text-xs font-mono font-bold text-white">Kuota Roster</div>
              <div className="text-[10px] font-mono text-emerald-400">2 Slot Tersedia</div>
            </div>
          </div>
        </div>

        {/* Deretan Avatar Besar Roster */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 mt-8">
          {roster.map((member, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[#161A24] border border-white/[0.06] hover:border-[#D4AF37]/40 flex flex-col items-center text-center transition-all group"
            >
              {/* Large Avatar 64px */}
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/10 group-hover:border-[#D4AF37] transition-colors mb-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={member.avatarUrl}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
                {member.isCaptain && (
                  <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#D4AF37] text-[#07080C] flex items-center justify-center shadow-md">
                    <Crown className="w-3 h-3 fill-current" />
                  </div>
                )}
              </div>

              {/* Name & IGN */}
              <div className="text-xs font-heading font-black text-white truncate max-w-[120px]">
                {member.name}
              </div>
              <div className="text-[10px] font-mono text-[#D4AF37] font-semibold">
                @{member.ign}
              </div>

              {/* Role sebagai Chip */}
              <span className="mt-2 px-2.5 py-0.5 rounded-full bg-white/[0.06] text-[9px] font-mono text-white/70 uppercase">
                {member.role}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================= */}
      {/* DUA KOLOM: PERMINTAAN & UNDANGAN TIM                      */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* KOLOM 1: UNDANGAN MASUK TIM */}
        <div className="p-6 rounded-3xl bg-[#0F1118]/80 border border-white/[0.08] flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#D4AF37]" />
              <h3 className="font-heading font-black text-sm text-white uppercase tracking-wider">
                Undangan Masuk Tim
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-white/[0.06] text-[10px] font-mono text-white/60">
              {invitations.length} Menunggu
            </span>
          </div>

          {invitations.length > 0 ? (
            <div className="flex flex-col gap-3">
              {invitations.map((inv) => (
                <div
                  key={inv.id}
                  className="p-4 rounded-2xl bg-[#161A24] border border-white/[0.06] flex items-center justify-between"
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-heading font-bold text-white">
                        {inv.teamName}
                      </span>
                      <span className="text-[9px] font-mono text-[#D4AF37] bg-[#D4AF37]/10 px-1.5 py-0.2 rounded">
                        {inv.teamTag}
                      </span>
                    </div>
                    <span className="text-[11px] text-white/60 mt-0.5">
                      Role ditawarkan: <strong className="text-white">{inv.roleOffered}</strong>
                    </span>
                    <span className="text-[9px] font-mono text-white/40 mt-1">
                      {inv.invitedBy} • {inv.date}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleAcceptInvite(inv.id)}
                      className="w-8 h-8 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center transition-all"
                      title="Terima Undangan"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeclineInvite(inv.id)}
                      className="w-8 h-8 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 flex items-center justify-center transition-all"
                      title="Tolak Undangan"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs font-mono text-white/30">
              Tidak ada undangan tim aktif saat ini.
            </div>
          )}
        </div>

        {/* KOLOM 2: PERMINTAAN SAYA */}
        <div className="p-6 rounded-3xl bg-[#0F1118]/80 border border-white/[0.08] flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <Send className="w-4 h-4 text-[#4C7DFF]" />
              <h3 className="font-heading font-black text-sm text-white uppercase tracking-wider">
                Permintaan Bergabung
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-white/[0.06] text-[10px] font-mono text-white/60">
              {requests.length} Dikirim
            </span>
          </div>

          {requests.length > 0 ? (
            <div className="flex flex-col gap-3">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-2xl bg-[#161A24] border border-white/[0.06] flex items-center justify-between"
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-heading font-bold text-white">
                        {req.teamName}
                      </span>
                      <span className="text-[9px] font-mono text-[#4C7DFF] bg-[#4C7DFF]/10 px-1.5 py-0.2 rounded">
                        {req.teamTag}
                      </span>
                    </div>
                    <span className="text-[11px] text-white/60 mt-0.5">
                      Role diajukan: <strong className="text-white">{req.requestedRole}</strong>
                    </span>
                    <span className="text-[9px] font-mono text-white/40 mt-1">
                      {req.game} • {req.date}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20">
                      {req.status}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCancelRequest(req.id)}
                      className="w-7 h-7 rounded-lg text-white/40 hover:text-red-400 hover:bg-white/[0.06] flex items-center justify-center transition-colors"
                      title="Batalkan Permintaan"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs font-mono text-white/30">
              Belum ada permohonan gabung tim yang dikirim.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
