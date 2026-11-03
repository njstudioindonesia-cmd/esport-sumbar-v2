"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Settings,
  KeyRound,
  Mail,
  ShieldCheck,
  Smartphone,
  Laptop,
  Globe,
  Bell,
  CheckCircle2,
  AlertCircle,
  X,
  ChevronRight,
  LogOut,
  Lock,
  Eye,
  EyeOff,
  Check,
  Shield,
  Save,
  ArrowRight,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

interface DeviceSession {
  id: string;
  deviceType: "desktop" | "mobile";
  browser: string;
  os: string;
  location: string;
  ip: string;
  lastActive: string;
  isCurrent: boolean;
}

export default function AccountSettingsPage() {
  const [activeTab, setActiveTab] = useState<"security" | "sessions" | "notifications">("security");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Email form state
  const [currentEmail] = useState("raka.pratama@example.com");
  const [newEmail, setNewEmail] = useState("");
  const [emailPasswordConfirm, setEmailPasswordConfirm] = useState("");
  const [emailUpdating, setEmailUpdating] = useState(false);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [passwordUpdating, setPasswordUpdating] = useState(false);

  // Active sessions mock state
  const [sessions, setSessions] = useState<DeviceSession[]>([
    {
      id: "sess-1",
      deviceType: "desktop",
      browser: "Google Chrome 122",
      os: "Windows 11 (Desktop)",
      location: "Kota Padang, Sumatera Barat",
      ip: "103.111.45.12",
      lastActive: "Sedang Aktif Sekarang",
      isCurrent: true,
    },
    {
      id: "sess-2",
      deviceType: "mobile",
      browser: "Mobile Safari 17",
      os: "iOS 17.4 (iPhone 14)",
      location: "Kota Padang, Sumatera Barat",
      ip: "182.1.202.84",
      lastActive: "3 jam yang lalu",
      isCurrent: false,
    },
    {
      id: "sess-3",
      deviceType: "desktop",
      browser: "Firefox 123",
      os: "macOS Sonoma (Laptop)",
      location: "Kota Bukittinggi, Sumatera Barat",
      ip: "114.125.77.19",
      lastActive: "4 hari yang lalu",
      isCurrent: false,
    },
  ]);

  // Notifications preferences state
  const [notifications, setNotifications] = useState({
    teamInvitesEmail: true,
    teamInvitesApp: true,
    verificationStatusEmail: true,
    verificationStatusApp: true,
    badgeExpiryAlerts: true,
    esiSumbarNews: true,
    scoutingInterest: true,
    weeklyDigest: false,
  });

  const [savingNotifications, setSavingNotifications] = useState(false);

  // Password strength calculation
  const calculatePasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    return score;
  };

  const pwStrength = calculatePasswordStrength(newPassword);

  const handleEmailUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !emailPasswordConfirm) return;
    setEmailUpdating(true);
    setTimeout(() => {
      setEmailUpdating(false);
      setNewEmail("");
      setEmailPasswordConfirm("");
      setToastMessage("Tautan verifikasi telah dikirimkan ke alamat email baru Anda.");
      setTimeout(() => setToastMessage(null), 4000);
    }, 1200);
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword || pwStrength < 2) return;
    setPasswordUpdating(true);
    setTimeout(() => {
      setPasswordUpdating(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setToastMessage("Kata sandi akun Anda berhasil diperbarui.");
      setTimeout(() => setToastMessage(null), 4000);
    }, 1200);
  };

  const handleRevokeSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    setToastMessage("Sesi perangkat telah berhasil diputuskan.");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRevokeAllOtherSessions = () => {
    setSessions((prev) => prev.filter((s) => s.isCurrent));
    setToastMessage("Semua sesi perangkat lain berhasil dikeluarkan.");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveNotifications = () => {
    setSavingNotifications(true);
    setTimeout(() => {
      setSavingNotifications(false);
      setToastMessage("Preferensi notifikasi Anda berhasil disimpan.");
      setTimeout(() => setToastMessage(null), 3000);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#0B0D12] text-[#F3F4F6] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* BREADCRUMB & HEADER */}
        <div className="flex flex-col gap-2 mb-8">
          <nav className="flex items-center gap-2 text-xs text-[#9AA3B2] font-mono mb-2">
            <Link href="/" className="hover:text-white transition-colors">
              Beranda
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/dashboard" className="hover:text-white transition-colors">
              Dashboard
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#D4AF37] font-bold">Pengaturan Akun</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#262B38] pb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-heading font-black uppercase text-white tracking-tight flex items-center gap-2.5">
                <Settings className="w-7 h-7 text-[#D4AF37]" />
                <span>Pengaturan Akun & Keamanan</span>
              </h1>
              <p className="text-xs sm:text-sm text-[#9AA3B2] mt-1 max-w-2xl leading-relaxed">
                Kelola kredensial login, audit perangkat aktif yang terhubung, dan atur bagaimana platform mengirimi Anda pemberitahuan resmi.
              </p>
            </div>

            <Link
              href="/me/privacy"
              className="self-start md:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#161922] hover:bg-[#1A1E28] border border-[#262B38] text-xs font-heading font-bold uppercase tracking-wider text-[#3B82F6] hover:text-white transition-colors shadow-sm"
            >
              <Shield className="w-4 h-4 text-[#3B82F6]" />
              <span>Pengaturan Privasi UU PDP →</span>
            </Link>
          </div>
        </div>

        {/* TOAST FEEDBACK */}
        {toastMessage && (
          <div className="mb-6 p-4 rounded-xl bg-[#22C55E]/15 border border-[#22C55E]/40 text-[#22C55E] text-xs font-medium flex items-center justify-between gap-3 animate-in fade-in duration-200">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{toastMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="p-1 hover:bg-[#22C55E]/20 rounded text-[#22C55E]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* TAB BUTTONS */}
        <div className="flex items-center gap-2 border-b border-[#262B38] mb-8 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setActiveTab("security")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-colors ${
              activeTab === "security"
                ? "bg-[#1A1E28] text-[#D4AF37] border border-[#D4AF37]/40 shadow-sm"
                : "text-gray-400 hover:text-white hover:bg-[#161922]"
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Kredensial & Sandi</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("sessions")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-colors relative ${
              activeTab === "sessions"
                ? "bg-[#1A1E28] text-[#D4AF37] border border-[#D4AF37]/40 shadow-sm"
                : "text-gray-400 hover:text-white hover:bg-[#161922]"
            }`}
          >
            <Laptop className="w-4 h-4" />
            <span>Sesi Aktif ({sessions.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("notifications")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-colors ${
              activeTab === "notifications"
                ? "bg-[#1A1E28] text-[#D4AF37] border border-[#D4AF37]/40 shadow-sm"
                : "text-gray-400 hover:text-white hover:bg-[#161922]"
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Preferensi Notifikasi</span>
          </button>
        </div>

        {/* TAB 1: SECURITY & CREDENTIALS */}
        {activeTab === "security" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* 1. UBAH ALAMAT EMAIL */}
            <div className="p-6 rounded-2xl bg-[#12151C] border border-[#262B38] shadow-md flex flex-col gap-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-[#262B38]">
                <Mail className="w-5 h-5 text-[#3B82F6]" />
                <div>
                  <h3 className="font-heading font-bold text-sm uppercase text-white">
                    Ubah Alamat Email
                  </h3>
                  <p className="text-[11px] text-[#9AA3B2]">
                    Email digunakan untuk login, verifikasi 2FA, dan notifikasi resmi ESI.
                  </p>
                </div>
              </div>

              <form onSubmit={handleEmailUpdate} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-heading text-gray-300">
                    Alamat Email Saat Ini:
                  </label>
                  <input
                    type="text"
                    disabled
                    value={currentEmail}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#161922] border border-[#262B38] text-xs text-gray-400 font-mono cursor-not-allowed"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-heading text-gray-300">
                    Alamat Email Baru:
                  </label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="nama.anda@email.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0D12] border border-[#262B38] text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-heading text-gray-300">
                    Konfirmasi dengan Kata Sandi Saat Ini:
                  </label>
                  <input
                    type="password"
                    required
                    value={emailPasswordConfirm}
                    onChange={(e) => setEmailPasswordConfirm(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0D12] border border-[#262B38] text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={emailUpdating || !newEmail || !emailPasswordConfirm}
                  className="mt-2 w-full py-2.5 rounded-xl bg-[#1A1E28] hover:bg-[#262B38] border border-[#262B38] text-gray-200 hover:text-white text-xs font-heading font-bold uppercase tracking-wider transition-colors disabled:opacity-40"
                >
                  {emailUpdating ? "Mengirim Verifikasi..." : "Kirim Tautan Verifikasi Email Baru"}
                </button>
              </form>
            </div>

            {/* 2. GANTI KATA SANDI */}
            <div className="p-6 rounded-2xl bg-[#12151C] border border-[#262B38] shadow-md flex flex-col gap-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-[#262B38]">
                <KeyRound className="w-5 h-5 text-[#D4AF37]" />
                <div>
                  <h3 className="font-heading font-bold text-sm uppercase text-white">
                    Ganti Kata Sandi
                  </h3>
                  <p className="text-[11px] text-[#9AA3B2]">
                    Gunakan kombinasi minimal 8 karakter dengan angka dan simbol unik.
                  </p>
                </div>
              </div>

              <form onSubmit={handlePasswordUpdate} className="flex flex-col gap-3.5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-heading text-gray-300">
                    Kata Sandi Saat Ini:
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPw ? "text" : "password"}
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0D12] border border-[#262B38] text-xs text-white focus:outline-none focus:border-[#D4AF37] pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPw(!showCurrentPw)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-white"
                    >
                      {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-heading text-gray-300">
                    Kata Sandi Baru:
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPw ? "text" : "password"}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimal 8 karakter"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0D12] border border-[#262B38] text-xs text-white focus:outline-none focus:border-[#D4AF37] pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPw(!showNewPw)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-white"
                    >
                      {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password strength meter */}
                  {newPassword.length > 0 && (
                    <div className="flex flex-col gap-1 mt-1">
                      <div className="flex gap-1 h-1 w-full bg-[#161922] rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            pwStrength === 1
                              ? "w-1/4 bg-red-500"
                              : pwStrength === 2
                              ? "w-2/4 bg-amber-500"
                              : pwStrength === 3
                              ? "w-3/4 bg-blue-500"
                              : "w-full bg-[#22C55E]"
                          }`}
                        />
                      </div>
                      <span className="text-[10px] text-right font-mono text-gray-400">
                        {pwStrength <= 1
                          ? "Sangat Lemah"
                          : pwStrength === 2
                          ? "Cukup"
                          : pwStrength === 3
                          ? "Kuat"
                          : "Sangat Kuat & Aman"}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-heading text-gray-300">
                    Konfirmasi Kata Sandi Baru:
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi kata sandi baru"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0D12] border border-[#262B38] text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                  {confirmPassword && newPassword !== confirmPassword && (
                    <span className="text-[10px] text-red-400">
                      Kata sandi konfirmasi tidak cocok.
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={
                    passwordUpdating ||
                    !currentPassword ||
                    !newPassword ||
                    newPassword !== confirmPassword ||
                    pwStrength < 2
                  }
                  className="mt-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E5C358] text-black text-xs font-heading font-extrabold uppercase tracking-wider hover:brightness-110 transition-all shadow-md disabled:opacity-40"
                >
                  {passwordUpdating ? "Menyimpan Perubahan..." : "Perbarui Kata Sandi"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 2: ACTIVE SESSIONS */}
        {activeTab === "sessions" && (
          <div className="p-6 rounded-2xl bg-[#12151C] border border-[#262B38] shadow-md flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#262B38]">
              <div>
                <h3 className="font-heading font-bold text-sm uppercase text-white flex items-center gap-2">
                  <Laptop className="w-5 h-5 text-[#D4AF37]" />
                  <span>Daftar Sesi Perangkat Aktif</span>
                </h3>
                <p className="text-[11px] text-[#9AA3B2] mt-0.5">
                  Audit perangkat yang saat ini masuk dengan akun Anda. Putuskan sesi perangkat mencurigakan.
                </p>
              </div>

              {sessions.length > 1 && (
                <button
                  type="button"
                  onClick={handleRevokeAllOtherSessions}
                  className="self-start sm:self-auto px-4 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-800/50 text-red-400 text-xs font-heading font-bold uppercase tracking-wider transition-colors"
                >
                  Keluarkan Semua Sesi Lain
                </button>
              )}
            </div>

            <div className="flex flex-col divide-y divide-[#262B38]">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="p-3 rounded-xl bg-[#161922] border border-[#262B38] text-[#D4AF37] shrink-0">
                      {session.deviceType === "desktop" ? (
                        <Laptop className="w-5 h-5" />
                      ) : (
                        <Smartphone className="w-5 h-5" />
                      )}
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-bold text-xs uppercase text-white">
                          {session.os} — {session.browser}
                        </span>
                        {session.isCurrent ? (
                          <span className="px-2 py-0.5 rounded-full bg-[#22C55E]/15 border border-[#22C55E]/30 text-[10px] font-mono text-[#22C55E] font-bold">
                            Perangkat Ini
                          </span>
                        ) : null}
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-[#9AA3B2] mt-1 font-mono">
                        <span className="flex items-center gap-1">
                          <Globe className="w-3 h-3 text-gray-500" />
                          {session.location}
                        </span>
                        <span>•</span>
                        <span>IP: {session.ip}</span>
                      </div>

                      <span className="text-[10px] text-gray-400 mt-0.5">
                        Status: <strong className="text-gray-200">{session.lastActive}</strong>
                      </span>
                    </div>
                  </div>

                  <div>
                    {!session.isCurrent && (
                      <button
                        type="button"
                        onClick={() => handleRevokeSession(session.id)}
                        className="px-3.5 py-1.5 rounded-lg bg-[#161922] hover:bg-red-950/40 text-gray-400 hover:text-red-400 border border-[#262B38] text-xs font-heading font-semibold uppercase transition-colors"
                      >
                        Putuskan Sesi
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: NOTIFICATION PREFERENCES */}
        {activeTab === "notifications" && (
          <div className="p-6 rounded-2xl bg-[#12151C] border border-[#262B38] shadow-md flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#262B38]">
              <div>
                <h3 className="font-heading font-bold text-sm uppercase text-white flex items-center gap-2">
                  <Bell className="w-5 h-5 text-[#D4AF37]" />
                  <span>Preferensi Notifikasi & Peringatan</span>
                </h3>
                <p className="text-[11px] text-[#9AA3B2] mt-0.5">
                  Tentukan bagaimana sistem menyampaikan undangan, hasil verifikasi, dan informasi turnamen.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSaveNotifications}
                disabled={savingNotifications}
                className="self-start sm:self-auto flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E5C358] text-black text-xs font-heading font-extrabold uppercase tracking-wider hover:brightness-110 transition-all shadow-md disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{savingNotifications ? "Menyimpan..." : "Simpan Preferensi"}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* GROUP 1: RELASI TIM & SCOUTING */}
              <div className="p-4 rounded-xl bg-[#161922] border border-[#262B38] flex flex-col gap-3">
                <span className="font-heading font-bold text-xs uppercase text-[#D4AF37]">
                  Undangan Tim & Pencarian Bakat
                </span>

                <div className="flex items-center justify-between py-2 border-b border-[#262B38]/60">
                  <div className="flex flex-col">
                    <span className="text-xs text-white font-medium">
                      Undangan Bergabung Tim Baru
                    </span>
                    <span className="text-[10px] text-[#9AA3B2]">
                      Dapatkan email seketika saat manajer tim mengajak bergabung.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.teamInvitesEmail}
                    onChange={(e) =>
                      setNotifications({ ...notifications, teamInvitesEmail: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-[#D4AF37] focus:ring-[#D4AF37] accent-[#D4AF37]"
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex flex-col">
                    <span className="text-xs text-white font-medium">
                      Pemberitahuan Minat Scout / Pelatih
                    </span>
                    <span className="text-[10px] text-[#9AA3B2]">
                      Notifikasi saat profil Anda disimpan oleh tim profesional.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.scoutingInterest}
                    onChange={(e) =>
                      setNotifications({ ...notifications, scoutingInterest: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-[#D4AF37] focus:ring-[#D4AF37] accent-[#D4AF37]"
                  />
                </div>
              </div>

              {/* GROUP 2: STATUS VERIFIKASI RESMI */}
              <div className="p-4 rounded-xl bg-[#161922] border border-[#262B38] flex flex-col gap-3">
                <span className="font-heading font-bold text-xs uppercase text-[#22C55E]">
                  Verifikasi ESI & Keabsahan Lencana
                </span>

                <div className="flex items-center justify-between py-2 border-b border-[#262B38]/60">
                  <div className="flex flex-col">
                    <span className="text-xs text-white font-medium">
                      Pembaruan Status Verifikasi (Daerah & Provinsi)
                    </span>
                    <span className="text-[10px] text-[#9AA3B2]">
                      Pemberitahuan krusial saat lolos daerah atau butuh revisi.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.verificationStatusEmail}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        verificationStatusEmail: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded text-[#22C55E] focus:ring-[#22C55E] accent-[#22C55E]"
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex flex-col">
                    <span className="text-xs text-white font-medium">
                      Pengingat Masa Berlaku Lencana (30 Hari Sebelumnya)
                    </span>
                    <span className="text-[10px] text-[#9AA3B2]">
                      Peringatan otomatis sebelum lencana tahunan kedaluwarsa.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.badgeExpiryAlerts}
                    onChange={(e) =>
                      setNotifications({ ...notifications, badgeExpiryAlerts: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-[#22C55E] focus:ring-[#22C55E] accent-[#22C55E]"
                  />
                </div>
              </div>

              {/* GROUP 3: BERITA & PENGUMUMAN */}
              <div className="p-4 rounded-xl bg-[#161922] border border-[#262B38] flex flex-col gap-3 md:col-span-2">
                <span className="font-heading font-bold text-xs uppercase text-[#3B82F6]">
                  Portal Berita & Jadwal Turnamen ESI
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between py-2">
                    <div className="flex flex-col">
                      <span className="text-xs text-white font-medium">
                        Pengumuman Turnamen Resmi Daerah & Kejurda
                      </span>
                      <span className="text-[10px] text-[#9AA3B2]">
                        Info pendaftaran turnamen resmi ESI 19 Kota/Kabupaten.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.esiSumbarNews}
                      onChange={(e) =>
                        setNotifications({ ...notifications, esiSumbarNews: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-[#3B82F6] focus:ring-[#3B82F6] accent-[#3B82F6]"
                    />
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div className="flex flex-col">
                      <span className="text-xs text-white font-medium">
                        Buletin Mingguan Rekap Komunitas Esport
                      </span>
                      <span className="text-[10px] text-[#9AA3B2]">
                        Ringkasan berita, klasemen, dan pergerakan bursa roster.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.weeklyDigest}
                      onChange={(e) =>
                        setNotifications({ ...notifications, weeklyDigest: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-[#3B82F6] focus:ring-[#3B82F6] accent-[#3B82F6]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}