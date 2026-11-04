"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  UserPlus,
  Check,
  X,
  Clock,
  Crown,
  Shield,
  Search,
  Copy,
  QrCode,
  Users,
  ChevronRight,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface TeamMember {
  id: string;
  name: string;
  ign: string;
  role: "Kapten" | "Manajer" | "Anggota" | "Pelatih" | "Cadangan";
  avatarUrl: string;
  isPending?: boolean;
}

export function MobileTeamRoster() {
  const router = useRouter();

  // Active Team Roster: 5 active + 1 pending (Total 6/7)
  const [members, setMembers] = useState<TeamMember[]>([
    {
      id: "mbr-1",
      name: "Fikri Alamsyah",
      ign: "MARAWA_KING",
      role: "Kapten",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    },
    {
      id: "mbr-2",
      name: "Derry Andika",
      ign: "BukitSlayer",
      role: "Anggota",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    },
    {
      id: "mbr-3",
      name: "Iqbal Ramadhan",
      ign: "SingaMalam",
      role: "Anggota",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    },
    {
      id: "mbr-4",
      name: "Ilham Chaniago",
      ign: "Tactician_Hen",
      role: "Pelatih",
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
    },
    {
      id: "mbr-5",
      name: "Raka Pratama",
      ign: "PariamanBoy",
      role: "Cadangan",
      avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop",
    },
    {
      id: "mbr-6",
      name: "Zaki Harun",
      ign: "SolokStriker",
      role: "Anggota",
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop",
      isPending: true, // Pending approval
    },
  ]);

  // Inbox Requests (Permintaan Bergabung)
  const [requests, setRequests] = useState([
    {
      id: "req-1",
      name: "Rian Hidayat",
      ign: "KABA_SNIPER",
      game: "Free Fire",
      avatarUrl: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=200&auto=format&fit=crop",
    },
  ]);

  // Sheets state
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteSearch, setInviteSearch] = useState("");
  const [showInviteQr, setShowInviteQr] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeCount = members.filter((m) => !m.isPending).length;
  const maxQuota = 7;

  const triggerHaptic = (ms = 10) => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(ms);
      } catch {
        // Ignored
      }
    }
  };

  const handleAcceptRequest = (reqId: string) => {
    triggerHaptic(20);
    const req = requests.find((r) => r.id === reqId);
    if (req) {
      setMembers((prev) => [
        ...prev,
        {
          id: `mbr-${Date.now()}`,
          name: req.name,
          ign: req.ign,
          role: "Anggota",
          avatarUrl: req.avatarUrl,
        },
      ]);
      setRequests((prev) => prev.filter((r) => r.id !== reqId));
      setToastMessage("Permintaan diterima!");
      setTimeout(() => setToastMessage(null), 1800);
    }
  };

  const handleDeclineRequest = (reqId: string) => {
    triggerHaptic(15);
    setRequests((prev) => prev.filter((r) => r.id !== reqId));
    setToastMessage("Permintaan ditolak");
    setTimeout(() => setToastMessage(null), 1800);
  };

  const handleCopyInviteLink = () => {
    triggerHaptic();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText("https://esport-sumbar-v2.vercel.app/team/singkarak-esports/join");
      setToastMessage("Tautan disalin!");
      setTimeout(() => setToastMessage(null), 1800);
    }
  };

  return (
    <div className="relative w-full min-h-[100dvh] max-w-[420px] mx-auto bg-[#07080C] text-white flex flex-col justify-between pb-24 overflow-x-hidden select-none">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#4C7DFF]/8 rounded-full blur-3xl pointer-events-none" />

      {/* TOP HEADER: BACK + JUDUL MAKS 2 KATA + CINCIN KUOTA "5/7" + TOMBOL UNDANG */}
      <header className="sticky top-0 z-30 px-5 pt-3 pb-2 bg-[#07080C]/85 backdrop-blur-xl flex items-center justify-between">
        <button
          onClick={() => {
            triggerHaptic();
            router.back();
          }}
          className="w-10 h-10 rounded-full bg-[#161A24] border border-white/[0.08] flex items-center justify-center text-white/70 hover:text-white"
          aria-label="Kembali"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        {/* Judul: Maks 2 Kata */}
        <h1 className="font-heading font-bold text-lg text-white">Roster Tim</h1>

        <div className="flex items-center gap-2.5">
          {/* Penanda Kuota "5/7" dalam Cincin Kecil */}
          <div className="relative w-9 h-9 flex items-center justify-center" title="Kuota Roster">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-white/[0.08]"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[#4C7DFF]"
                strokeDasharray={`${(activeCount / maxQuota) * 100}, 100`}
                strokeWidth="3"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-[8px] font-mono font-bold text-white">
              {activeCount}/{maxQuota}
            </span>
          </div>

          {/* Tombol Undang */}
          <button
            onClick={() => {
              triggerHaptic();
              setIsInviteOpen(true);
            }}
            className="h-9 px-3 rounded-full bg-white/[0.06] border border-white/[0.08] text-xs font-heading font-bold text-white flex items-center gap-1.5 hover:bg-white/10"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Undang</span>
          </button>
        </div>
      </header>

      {/* CENTER CONTENT */}
      <div className="px-5 flex flex-col gap-5 pt-2">
        {/* ================================================================== */}
        {/* 1. DAFTAR "PERMINTAAN" (INBOX DENGAN DUA TOMBOL BULAT & GESTUR)     */}
        {/* ================================================================== */}
        {requests.length > 0 && (
          <div className="w-full flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/50">
                Permintaan Masuk
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#4C7DFF]/20 text-[#4C7DFF] text-[9px] font-mono font-bold">
                {requests.length} Baru
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {requests.map((req) => (
                <motion.div
                  key={req.id}
                  drag="x"
                  dragConstraints={{ left: -80, right: 80 }}
                  onDragEnd={(_, info) => {
                    if (info.offset.x > 50) handleAcceptRequest(req.id);
                    if (info.offset.x < -50) handleDeclineRequest(req.id);
                  }}
                  className="h-16 rounded-2xl bg-[#161A24] border border-white/[0.08] px-3.5 flex items-center justify-between shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={req.avatarUrl} alt={req.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="font-heading font-bold text-xs text-white">
                        {req.name}
                      </div>
                      <div className="text-[10px] font-mono text-[#D4AF37]">
                        @{req.ign} • {req.game}
                      </div>
                    </div>
                  </div>

                  {/* Dua Tombol Ikon Bulat: Terima ✓ dan Tolak ✕ */}
                  <div className="flex items-center gap-2">
                    {/* Tolak */}
                    <button
                      onClick={() => handleDeclineRequest(req.id)}
                      className="w-8 h-8 rounded-full bg-[#EF4444]/15 border border-[#EF4444]/40 text-[#EF4444] flex items-center justify-center hover:bg-[#EF4444]/30 active:scale-95 transition-all"
                      aria-label="Tolak"
                    >
                      <X className="w-4 h-4 stroke-[2.5]" />
                    </button>
                    {/* Terima */}
                    <button
                      onClick={() => handleAcceptRequest(req.id)}
                      className="w-8 h-8 rounded-full bg-[#22C55E]/15 border border-[#22C55E]/40 text-[#22C55E] flex items-center justify-center hover:bg-[#22C55E]/30 active:scale-95 transition-all"
                      aria-label="Terima"
                    >
                      <Check className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* 2. ROSTER TIM: DERETAN AVATAR BULAT BESAR BERKARTU MINI           */}
        {/* ================================================================== */}
        <div className="w-full flex flex-col gap-2.5">
          <span className="text-[10px] font-mono uppercase tracking-widest text-white/50">
            Anggota Aktif
          </span>

          <div className="flex flex-col gap-2.5">
            {members.map((mbr) => {
              const isKapten = mbr.role === "Kapten";
              const isPelatih = mbr.role === "Pelatih";

              return (
                <div
                  key={mbr.id}
                  className={`h-20 rounded-2xl bg-[#0F1118] border p-3 flex items-center justify-between transition-all ${
                    mbr.isPending
                      ? "border-dashed border-white/20 opacity-70"
                      : "border-white/[0.08]"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    {/* Avatar Bulat Besar */}
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white/10 shadow-md">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={mbr.avatarUrl} alt={mbr.name} className="w-full h-full object-cover" />
                      {/* Ikon Mahkota Jika Kapten */}
                      {isKapten && (
                        <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#D4AF37] text-black flex items-center justify-center shadow">
                          <Crown className="w-2.5 h-2.5 stroke-[2.5]" />
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="font-heading font-black text-sm text-white">
                        {mbr.name}
                      </div>
                      <div className="text-[11px] font-mono text-[#D4AF37]">
                        @{mbr.ign}
                      </div>
                    </div>
                  </div>

                  {/* Chip Peran / Status Menunggu */}
                  <div className="text-right">
                    {mbr.isPending ? (
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F5A524]/15 border border-[#F5A524]/30 text-[#F5A524] text-[9px] font-mono font-bold">
                        <Clock className="w-3 h-3" />
                        <span>Menunggu</span>
                      </div>
                    ) : (
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-heading font-bold uppercase tracking-wider border ${
                          isKapten
                            ? "bg-[#D4AF37]/15 border-[#D4AF37]/40 text-[#D4AF37]"
                            : isPelatih
                            ? "bg-[#4C7DFF]/15 border-[#4C7DFF]/40 text-[#4C7DFF]"
                            : "bg-white/[0.06] border-white/10 text-white/70"
                        }`}
                      >
                        {mbr.role}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* FIXED BOTTOM ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[420px] mx-auto p-5 bg-[#07080C]/90 backdrop-blur-xl border-t border-white/[0.08] z-30">
        <button
          onClick={() => {
            triggerHaptic();
            setIsInviteOpen(true);
          }}
          className="w-full h-14 rounded-full bg-[#4C7DFF] text-white hover:bg-[#3B6BE8] font-heading font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_8px_24px_rgba(76,125,255,0.3)] transition-all active:scale-[0.98]"
        >
          <UserPlus className="w-4 h-4" />
          <span>Undang Atlet</span>
        </button>
      </div>

      {/* FEEDBACK TOAST */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-[#D4AF37] text-[#07080C] font-heading font-bold text-xs uppercase shadow-xl z-50 flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================================================================== */}
      {/* BOTTOM SHEET: UNDANG ANGGOTA DENGAN PENCARIAN & QR UNDANGAN         */}
      {/* ==================================================================== */}
      <AnimatePresence>
        {isInviteOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsInviteOpen(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed bottom-0 left-0 right-0 max-w-[420px] mx-auto bg-[#0F1118]/95 border-t border-white/[0.08] backdrop-blur-2xl rounded-t-[28px] p-6 z-50 flex flex-col gap-4 shadow-2xl"
            >
              <div className="w-10 h-1 rounded-full bg-white/20 mx-auto" />

              <div className="flex items-center justify-between">
                <h3 className="font-heading font-bold text-lg text-white">Undang ke Tim</h3>
                {/* Toggle QR vs Tautan */}
                <button
                  onClick={() => {
                    triggerHaptic();
                    setShowInviteQr(!showInviteQr);
                  }}
                  className={`p-2 rounded-full border transition-all ${
                    showInviteQr
                      ? "bg-[#D4AF37] text-black border-[#D4AF37]"
                      : "bg-[#161A24] border-white/10 text-white/70"
                  }`}
                  aria-label="QR Code"
                >
                  <QrCode className="w-4 h-4" />
                </button>
              </div>

              {showInviteQr ? (
                /* Tampilan QR Undangan */
                <div className="flex flex-col items-center gap-3 py-2">
                  <div className="p-3 rounded-2xl bg-white shadow-xl">
                    <QRCodeSVG
                      value="https://esport-sumbar-v2.vercel.app/team/singkarak-esports/join"
                      size={160}
                      level="H"
                    />
                  </div>
                  <span className="text-[10px] font-mono text-white/40 uppercase">
                    Pindai untuk bergabung ke roster
                  </span>
                </div>
              ) : (
                /* Pencarian Profil Atlet */
                <div className="flex flex-col gap-3">
                  <div className="relative w-full">
                    <input
                      type="text"
                      value={inviteSearch}
                      onChange={(e) => setInviteSearch(e.target.value)}
                      placeholder="Cari IGN atau ESPORT ID..."
                      className="w-full h-12 bg-[#161A24] border border-white/[0.08] rounded-xl pl-9 pr-3 text-xs text-white placeholder-white/30 outline-none"
                    />
                    <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>

                  <div className="flex flex-col gap-2 max-h-36 overflow-y-auto no-scrollbar">
                    {[
                      { name: "Kaba Shooter", ign: "KABA_AIM", code: "PDG" },
                      { name: "Sutan Rian", ign: "SUTAN_RIAN", code: "BKT" },
                    ].map((usr, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-xl bg-[#161A24] border border-white/[0.06] flex items-center justify-between"
                      >
                        <div>
                          <div className="font-heading font-bold text-xs text-white">
                            {usr.name}
                          </div>
                          <div className="text-[9px] font-mono text-[#D4AF37]">
                            @{usr.ign} • {usr.code}
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            triggerHaptic(15);
                            setIsInviteOpen(false);
                            setToastMessage("Undangan terkirim!");
                            setTimeout(() => setToastMessage(null), 1800);
                          }}
                          className="h-8 px-3 rounded-full bg-[#4C7DFF] text-white font-heading font-bold text-[10px] uppercase"
                        >
                          Undang
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tombol Salin Tautan */}
              <button
                onClick={handleCopyInviteLink}
                className="w-full h-12 rounded-full bg-[#161A24] border border-white/[0.08] text-white font-heading font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:border-[#D4AF37]"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Salin Tautan</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
