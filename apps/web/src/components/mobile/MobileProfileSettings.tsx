"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Shield,
  Bell,
  Lock,
  HelpCircle,
  LogOut,
  ChevronRight,
  Eye,
  Check,
  Trash2,
  AlertTriangle,
  ArrowLeft,
  Users,
  ShieldCheck,
  Sparkles,
  Award,
  Layers,
  X,
} from "lucide-react";
import { GALLERY_CARDS } from "@/data/mockCards";
import { MobileBottomBar } from "./MobileBottomBar";
import { signOutAction } from "@/app/actions/auth";

type SubScreenType = "main" | "notifications" | "privacy" | "security";

interface NotificationItem {
  id: string;
  type: "verification" | "invite" | "system";
  title: string;
  time: string;
  isUnread?: boolean;
  link: string;
  group: "Hari ini" | "Kemarin";
}

export function MobileProfileSettings() {
  const router = useRouter();

  // Active Sub-screen
  const [subScreen, setSubScreen] = useState<SubScreenType>("main");

  // Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "notif-1",
      type: "verification",
      title: "Verifikasi ESPORT SUMBAR disetujui",
      time: "2j lalu",
      isUnread: true,
      link: "/me/verification",
      group: "Hari ini",
    },
    {
      id: "notif-2",
      type: "invite",
      title: "Undangan roster Singkarak Esports",
      time: "4j lalu",
      isUnread: true,
      link: "/me/team/tm-contender/roster",
      group: "Hari ini",
    },
    {
      id: "notif-3",
      type: "system",
      title: "Pembaruan turnamen Piala Walikota",
      time: "1h lalu",
      isUnread: false,
      link: "/tournaments",
      group: "Kemarin",
    },
  ]);

  // Privacy toggles state
  const [privacyToggles, setPrivacyToggles] = useState({
    namaAsli: true,
    tglLahir: false,
    kontak: false, // Locked private
    riwayatTim: true,
    statistik: true,
  });

  // Delete account two-step sheet
  const [isDeleteSheetOpen, setIsDeleteSheetOpen] = useState(false);
  const [deleteStep, setDeleteStep] = useState<1 | 2>(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const heroCard = GALLERY_CARDS.find((c) => c.id === "pl-contender") || GALLERY_CARDS[1];

  const triggerHaptic = (ms = 10) => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(ms);
      } catch {
        // Ignored
      }
    }
  };

  const handleArchiveNotif = (id: string) => {
    triggerHaptic(15);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    setToastMessage("Notifikasi diarsipkan");
    setTimeout(() => setToastMessage(null), 1800);
  };

  const handleTogglePrivacy = (key: keyof typeof privacyToggles) => {
    if (key === "kontak") {
      setToastMessage("Kontak dilindungi UU PDP");
      setTimeout(() => setToastMessage(null), 1800);
      return;
    }
    triggerHaptic();
    setPrivacyToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const unreadCount = notifications.filter((n) => n.isUnread).length;

  return (
    <div className="relative w-full min-h-[100dvh] max-w-[420px] mx-auto bg-[#07080C] text-white flex flex-col justify-between pb-24 overflow-x-hidden select-none">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-gradient-to-b from-[#D4AF37]/8 via-[#4C7DFF]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* TOP HEADER */}
      <header className="sticky top-0 z-30 px-5 pt-3 pb-2 bg-[#07080C]/85 backdrop-blur-xl flex items-center justify-between">
        {subScreen !== "main" ? (
          <button
            onClick={() => {
              triggerHaptic();
              setSubScreen("main");
            }}
            className="w-10 h-10 rounded-full bg-[#161A24] border border-white/[0.08] flex items-center justify-center text-white/70 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        ) : (
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
            Pengaturan Akun
          </span>
        )}

        {/* Judul: Maks 2 Kata */}
        <h1 className="font-heading font-bold text-lg text-white">
          {subScreen === "notifications"
            ? "Notifikasi"
            : subScreen === "privacy"
            ? "Atur Privasi"
            : "Profil Saya"}
        </h1>

        {/* Notif Badge Button */}
        {subScreen === "main" ? (
          <button
            onClick={() => {
              triggerHaptic();
              setSubScreen("notifications");
            }}
            className="relative w-10 h-10 rounded-full bg-[#161A24] border border-white/[0.08] flex items-center justify-center text-white/70 hover:text-white"
            aria-label="Notifikasi"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#D4AF37] ring-2 ring-[#07080C] shadow-[0_0_8px_#D4AF37]" />
            )}
          </button>
        ) : (
          <div className="w-10" />
        )}
      </header>

      {/* CENTER VIEW CONTAINER */}
      <div className="px-5 flex flex-col gap-5 pt-2 flex-1">
        <AnimatePresence mode="wait">
          {/* ============================================================== */}
          {/* 1. LAYAR UTAMA: AVATAR BESAR + 3 ANGKA + MENU PENGATURAN        */}
          {/* ============================================================== */}
          {subScreen === "main" && (
            <motion.div
              key="sub-main"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full flex flex-col items-center gap-5"
            >
              {/* Avatar Besar & Nama */}
              <div className="flex flex-col items-center mt-2">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[#D4AF37] shadow-[0_0_28px_rgba(212,175,55,0.25)] p-0.5 bg-[#0F1118]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={heroCard.data.avatarUrl}
                    alt="Avatar"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <h2 className="font-heading font-black text-xl text-white mt-3">
                  Sutan Aim
                </h2>
                <span className="text-xs font-mono font-bold text-[#D4AF37]">
                  ESB-PDG-PL-000124
                </span>
              </div>

              {/* Ringkasan 3 Angka: Kartu, Relasi, Prestasi */}
              <div className="w-full grid grid-cols-3 gap-2.5">
                <Link
                  href="/me/cards"
                  onClick={() => triggerHaptic()}
                  className="h-20 rounded-2xl bg-[#0F1118] border border-white/[0.06] flex flex-col items-center justify-center hover:border-[#D4AF37]/40 transition-all"
                >
                  <span className="font-heading font-black text-2xl text-white">3</span>
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider mt-0.5">
                    Kartu
                  </span>
                </Link>

                <Link
                  href="/me/team/tm-contender/roster"
                  onClick={() => triggerHaptic()}
                  className="h-20 rounded-2xl bg-[#0F1118] border border-white/[0.06] flex flex-col items-center justify-center hover:border-[#4C7DFF]/40 transition-all"
                >
                  <span className="font-heading font-black text-2xl text-[#4C7DFF]">8</span>
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider mt-0.5">
                    Relasi
                  </span>
                </Link>

                <div className="h-20 rounded-2xl bg-[#0F1118] border border-white/[0.06] flex flex-col items-center justify-center">
                  <span className="font-heading font-black text-2xl text-[#22C55E]">5</span>
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider mt-0.5">
                    Prestasi
                  </span>
                </div>
              </div>

              {/* Daftar Pengaturan: Baris Ikon + 1-2 Kata */}
              <div className="w-full flex flex-col gap-2">
                {[
                  {
                    id: "privacy",
                    label: "Privasi",
                    icon: Shield,
                    color: "text-[#D4AF37]",
                    action: () => setSubScreen("privacy"),
                  },
                  {
                    id: "notifications",
                    label: "Notifikasi",
                    icon: Bell,
                    badge: unreadCount > 0 ? `${unreadCount} Baru` : undefined,
                    color: "text-[#4C7DFF]",
                    action: () => setSubScreen("notifications"),
                  },
                  {
                    id: "security",
                    label: "Keamanan",
                    icon: Lock,
                    color: "text-white/70",
                    action: () => {
                      triggerHaptic();
                      setToastMessage("Sesi akun terlindungi");
                      setTimeout(() => setToastMessage(null), 1800);
                    },
                  },
                  {
                    id: "help",
                    label: "Bantuan",
                    icon: HelpCircle,
                    color: "text-white/70",
                    action: () => {
                      triggerHaptic();
                      router.push("/how-it-works");
                    },
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        triggerHaptic();
                        item.action();
                      }}
                      className="h-14 rounded-2xl bg-[#161A24] border border-white/[0.08] px-4 flex items-center justify-between cursor-pointer hover:bg-[#1E2330] transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-white/[0.06] flex items-center justify-center">
                          <Icon className={`w-4 h-4 ${item.color}`} />
                        </div>
                        <span className="font-heading font-semibold text-sm text-white">
                          {item.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.badge && (
                          <span className="px-2 py-0.5 rounded-full bg-[#4C7DFF]/20 text-[#4C7DFF] text-[9px] font-mono font-bold">
                            {item.badge}
                          </span>
                        )}
                        <ChevronRight className="w-4 h-4 text-white/30" />
                      </div>
                    </div>
                  );
                })}

                {/* Tombol Keluar */}
                <button
                  onClick={async () => {
                    triggerHaptic();
                    await signOutAction();
                    router.push("/login");
                    router.refresh();
                  }}
                  className="h-14 rounded-2xl bg-[#161A24] border border-white/[0.08] px-4 flex items-center justify-between text-white/60 hover:text-white transition-all mt-1"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white/[0.06] flex items-center justify-center">
                      <LogOut className="w-4 h-4 text-white/50" />
                    </div>
                    <span className="font-heading font-semibold text-sm">Keluar</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/30" />
                </button>
              </div>

              {/* ZONA BERBAHAYA (HAPUS AKUN) DI PALING BAWAH */}
              <div className="w-full pt-4 pb-2">
                <button
                  onClick={() => {
                    triggerHaptic(20);
                    setDeleteStep(1);
                    setIsDeleteSheetOpen(true);
                  }}
                  className="w-full h-12 rounded-2xl bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#EF4444]/20 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Hapus Akun</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* ============================================================== */}
          {/* 2. SUB-VIEW NOTIFIKASI: HARI INI & KEMARIN + GESER ARSIPKAN     */}
          {/* ============================================================== */}
          {subScreen === "notifications" && (
            <motion.div
              key="sub-notifs"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full flex flex-col gap-4"
            >
              {/* Petunjuk Geser */}
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest text-center">
                Geser notifikasi untuk mengarsipkan
              </span>

              {["Hari ini", "Kemarin"].map((grp) => {
                const groupItems = notifications.filter((n) => n.group === grp);
                if (groupItems.length === 0) return null;

                return (
                  <div key={grp} className="flex flex-col gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-white/50">
                      {grp}
                    </span>

                    {groupItems.map((notif) => {
                      const isVerif = notif.type === "verification";
                      const isInvite = notif.type === "invite";

                      return (
                        <motion.div
                          key={notif.id}
                          drag="x"
                          dragConstraints={{ left: -100, right: 0 }}
                          onDragEnd={(_, info) => {
                            if (info.offset.x < -60) handleArchiveNotif(notif.id);
                          }}
                          onClick={() => {
                            triggerHaptic();
                            router.push(notif.link);
                          }}
                          className="relative h-18 rounded-2xl bg-[#161A24] border border-white/[0.08] px-3.5 flex items-center justify-between cursor-pointer hover:border-white/20 transition-all shadow-md overflow-hidden"
                        >
                          <div className="flex items-center gap-3">
                            {/* Ikon Bulat Berwarna Sesuai Jenis */}
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                                isVerif
                                  ? "bg-[#D4AF37]/15 text-[#D4AF37]"
                                  : isInvite
                                  ? "bg-[#4C7DFF]/15 text-[#4C7DFF]"
                                  : "bg-white/[0.08] text-white/70"
                              }`}
                            >
                              {isVerif ? (
                                <ShieldCheck className="w-5 h-5" />
                              ) : isInvite ? (
                                <Users className="w-5 h-5" />
                              ) : (
                                <Sparkles className="w-5 h-5" />
                              )}
                            </div>

                            {/* Judul 1 Baris + Waktu Relatif */}
                            <div>
                              <div className="font-heading font-bold text-xs text-white truncate max-w-[220px]">
                                {notif.title}
                              </div>
                              <span className="text-[9px] font-mono text-white/40">
                                {notif.time}
                              </span>
                            </div>
                          </div>

                          {/* Titik Emas untuk Belum Dibaca */}
                          {notif.isUnread && (
                            <span className="w-2 h-2 rounded-full bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]" />
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                );
              })}
            </motion.div>
          )}

          {/* ============================================================== */}
          {/* 3. SUB-VIEW PRIVASI: PRATINJAU KARTU + TOGGLE MATA/GEMBOK       */}
          {/* ============================================================== */}
          {subScreen === "privacy" && (
            <motion.div
              key="sub-privacy"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full flex flex-col gap-4"
            >
              {/* Pratinjau Tampilan Publik yang Berubah Langsung */}
              <div className="w-full p-4 rounded-2xl bg-[#0F1118] border border-white/[0.08] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">
                    Tampilan Publik
                  </span>
                  <div className="font-heading font-black text-sm text-white mt-0.5">
                    {privacyToggles.namaAsli ? "Sutan Aim (Rian P.)" : "Sutan Aim"}
                  </div>
                  <div className="text-[10px] font-mono text-[#D4AF37]">
                    {privacyToggles.riwayatTim ? "Singkarak Esports" : "Klub Privat"}
                  </div>
                </div>

                <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={heroCard.data.avatarUrl} alt="Hero" className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Daftar Field dengan Toggle Mata (Publik) / Gembok (Privat) */}
              <div className="flex flex-col gap-2">
                {[
                  { key: "namaAsli", label: "Nama Asli" },
                  { key: "tglLahir", label: "Tanggal Lahir" },
                  { key: "kontak", label: "Kontak & Email", isLocked: true },
                  { key: "riwayatTim", label: "Riwayat Tim" },
                  { key: "statistik", label: "Statistik Match" },
                ].map((item) => {
                  const isPub = privacyToggles[item.key as keyof typeof privacyToggles];
                  return (
                    <div
                      key={item.key}
                      onClick={() => handleTogglePrivacy(item.key as keyof typeof privacyToggles)}
                      className="h-13 rounded-2xl bg-[#161A24] border border-white/[0.08] px-4 flex items-center justify-between cursor-pointer hover:bg-[#1E2330] transition-all"
                    >
                      <span className="font-heading font-semibold text-xs text-white">
                        {item.label}
                      </span>

                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono text-white/40 uppercase">
                          {item.isLocked ? "Terkunci" : isPub ? "Publik" : "Privat"}
                        </span>
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center ${
                            isPub
                              ? "bg-[#4C7DFF]/15 text-[#4C7DFF]"
                              : "bg-[#22C55E]/15 text-[#22C55E]"
                          }`}
                        >
                          {isPub ? <Eye className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
      {/* BOTTOM SHEET: KONFIRMASI DUA LANGKAH HAPUS AKUN                      */}
      {/* ==================================================================== */}
      <AnimatePresence>
        {isDeleteSheetOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteSheetOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed bottom-0 left-0 right-0 max-w-[420px] mx-auto bg-[#0F1118]/95 border-t border-[#EF4444]/30 backdrop-blur-2xl rounded-t-[28px] p-6 z-50 flex flex-col gap-4 shadow-2xl"
            >
              <div className="w-10 h-1 rounded-full bg-white/20 mx-auto" />

              <div className="flex items-center gap-2 text-[#EF4444]">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-heading font-bold text-lg text-white">
                  {deleteStep === 1 ? "Hapus Akun?" : "Konfirmasi Akhir"}
                </h3>
              </div>

              {deleteStep === 1 ? (
                <>
                  <p className="text-xs text-white/80 leading-snug">
                    Seluruh kartu identitas digital, lencana verifikasi, dan rekam jejak turnamen akan dihapus permanen.
                  </p>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <button
                      onClick={() => setIsDeleteSheetOpen(false)}
                      className="h-12 rounded-full bg-[#161A24] border border-white/[0.08] text-white font-heading font-semibold text-xs uppercase"
                    >
                      Batal
                    </button>
                    <button
                      onClick={() => {
                        triggerHaptic(20);
                        setDeleteStep(2);
                      }}
                      className="h-12 rounded-full bg-[#EF4444] text-white font-heading font-bold text-xs uppercase shadow-md"
                    >
                      Lanjut
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-xs text-white/80 leading-snug">
                    Tindakan ini tidak dapat dibatalkan. Klik konfirmasi di bawah untuk memproses penutupan akun.
                  </p>
                  <button
                    onClick={() => {
                      triggerHaptic(30);
                      setIsDeleteSheetOpen(false);
                      router.push("/register");
                    }}
                    className="w-full h-14 rounded-full bg-[#EF4444] text-white font-heading font-bold text-xs uppercase tracking-wider shadow-lg"
                  >
                    Hapus Permanen
                  </button>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* FLOATING BOTTOM BAR (Tab Profil Aktif) */}
      <MobileBottomBar />
    </div>
  );
}
