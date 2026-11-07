"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Settings,
  Shield,
  Lock,
  Eye,
  EyeOff,
  Bell,
  Sparkles,
  Sliders,
  AlertTriangle,
  Trash2,
  CheckCircle2,
  Loader2,
  Monitor,
  Zap,
  BatteryCharging,
} from "lucide-react";
import { GlassSurface } from "@/components/glass/GlassSurface";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassButton } from "@/components/glass/GlassButton";
import { GlassBadge } from "@/components/glass/GlassBadge";
import { QuietSurface } from "@/components/glass/QuietSurface";
import { GlassSegmented, useQualityMode, type QualityMode } from "@/components/glass";
import { createClient } from "@/lib/supabase/client";

export function UnifiedSettingsView() {
  const router = useRouter();
  const { quality, setQualityMode, fps } = useQualityMode();

  // State User & Password
  const [userSession, setUserSession] = useState<{ email: string; id: string } | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // State Notifications
  const [notifications, setNotifications] = useState({
    verificationUpdates: true,
    ecosystemInvites: true,
    tournamentAlerts: false,
    newsletters: false,
  });

  // State Danger Zone (Delete Account)
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState("");
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserSession({ email: user.email || "", id: user.id });
      }
    });
  }, []);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setPasswordFeedback({ type: "error", text: "Kata sandi baru minimal 8 karakter." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordFeedback({ type: "error", text: "Konfirmasi kata sandi tidak cocok." });
      return;
    }

    setIsUpdatingPassword(true);
    setPasswordFeedback(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      setPasswordFeedback({ type: "success", text: "Kata sandi berhasil diperbarui!" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setPasswordFeedback({ type: "error", text: err.message || "Gagal memperbarui kata sandi." });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmationInput !== "HAPUS AKUN SAYA") {
      setDeleteError('Ketik "HAPUS AKUN SAYA" untuk mengonfirmasi tindakan.');
      return;
    }

    setIsDeletingAccount(true);
    setDeleteError(null);

    try {
      const res = await fetch("/api/me/delete-account", { method: "POST" });
      if (!res.ok) {
        throw new Error("Gagal mengajukan penghapusan akun.");
      }
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/");
    } catch (err: any) {
      setDeleteError(err.message || "Terjadi kesalahan saat menghapus akun.");
      setIsDeletingAccount(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-8 pb-12">
      {/* Header Bar */}
      <div>
        <h1 className="text-2xl font-heading font-black text-white tracking-tight uppercase">
          Pengaturan Akun &amp; Preferensi
        </h1>
        <p className="text-xs text-white/50 mt-1">
          Kelola kredensial keamanan, tingkat efek visual platform, dan saluran notifikasi.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ========================================================= */}
        {/* KOLOM KIRI (7/12): KREDENSIAL & VISUAL MODE               */}
        {/* ========================================================= */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* 1. Pengaturan Efek Visual Liquid Glass 2026 */}
          <GlassSurface variant="elevated" elevation="glass" radius="3xl" className="p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-heading font-bold text-white uppercase">
                    Efek Visual Liquid Glass
                  </h2>
                  <p className="text-[11px] text-white/50">
                    Adaptasi performa render sesuai kemampuan grafis perangkat Anda.
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[#D4AF37]">
                Live FPS: {fps}
              </span>
            </div>

            <div className="pt-2">
              <GlassSegmented<QualityMode>
                size="md"
                value={quality}
                onChange={(mode) => setQualityMode(mode, true)}
                options={[
                  { value: "full", label: "Penuh (60 FPS)" },
                  { value: "standard", label: "Standar (Optimal)" },
                  { value: "eco", label: "Hemat (Ringan)" },
                ]}
              />
            </div>

            {/* Quality Description Card */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-xs text-white/70 leading-relaxed">
              {quality === "full" && (
                <div className="flex items-start gap-2.5">
                  <Monitor className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-heading text-xs">Mode Penuh</strong>
                    <span>Refraksi SVG cair, specular pointer tracking real-time, dan blur berlapis sinematik. Direkomendasikan untuk GPU desktop &amp; perangkat unggulan.</span>
                  </div>
                </div>
              )}
              {quality === "standard" && (
                <div className="flex items-start gap-2.5">
                  <Zap className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-heading text-xs">Mode Standar</strong>
                    <span>Kaca berbasis CSS backdrop-filter murni dengan specular sederhana dan motion stabil 60 FPS. Keseimbangan sempurna antara estetika dan daya tahan baterai.</span>
                  </div>
                </div>
              )}
              {quality === "eco" && (
                <div className="flex items-start gap-2.5">
                  <BatteryCharging className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-heading text-xs">Mode Hemat Daya</strong>
                    <span>Permukaan translusen datar tanpa efek blur berat, menghemat daya GPU baterai ponsel pintar kelas menengah.</span>
                  </div>
                </div>
              )}
            </div>
          </GlassSurface>

          {/* 2. Formulir Ubah Kata Sandi (QuietSurface demi Keterbacaan) */}
          <QuietSurface elevation="raised" radius="3xl" className="p-6 sm:p-8 flex flex-col gap-5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-heading font-bold text-white uppercase">
                  Ubah Kata Sandi
                </h2>
                <p className="text-[11px] text-white/50">
                  Gunakan minimal 8 karakter dengan kombinasi huruf dan angka.
                </p>
              </div>
            </div>

            {passwordFeedback && (
              <div
                className={`p-3.5 rounded-2xl text-xs flex items-center gap-2.5 ${
                  passwordFeedback.type === "success"
                    ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-200"
                    : "bg-red-500/15 border border-red-500/30 text-red-200"
                }`}
              >
                {passwordFeedback.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                )}
                <span>{passwordFeedback.text}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
              <div className="space-y-1">
                <label className="text-xs font-heading font-bold text-white/80 block">
                  Kata Sandi Baru
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 8 karakter"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-heading font-bold text-white/80 block">
                  Konfirmasi Kata Sandi Baru
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ketik ulang kata sandi baru"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/60"
                />
              </div>

              <div className="pt-2">
                <GlassButton
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isUpdatingPassword}
                  className="font-bold uppercase tracking-wider"
                >
                  {isUpdatingPassword ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Menyimpan...</span>
                    </span>
                  ) : (
                    "Perbarui Kata Sandi"
                  )}
                </GlassButton>
              </div>
            </form>
          </QuietSurface>
        </div>

        {/* ========================================================= */}
        {/* KOLOM KANAN (5/12): NOTIFIKASI & ZONA BAHAYA              */}
        {/* ========================================================= */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Preferensi Notifikasi */}
          <GlassSurface variant="elevated" elevation="glass" radius="3xl" className="p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-heading font-bold text-white uppercase">
                  Saluran Notifikasi
                </h2>
                <p className="text-[11px] text-white/50">
                  Pemberitahuan platform via email terdaftar.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <label className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/10 cursor-pointer">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">Status Verifikasi</span>
                  <span className="text-[10px] text-white/50">Pembaruan telaah lencana &amp; kurasi</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.verificationUpdates}
                  onChange={(e) =>
                    setNotifications({ ...notifications, verificationUpdates: e.target.checked })
                  }
                  className="rounded bg-white/10 border-white/20 text-[#D4AF37] focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/10 cursor-pointer">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">Undangan Ekosistem</span>
                  <span className="text-[10px] text-white/50">Ajakan bergabung roster &amp; klub tim</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.ecosystemInvites}
                  onChange={(e) =>
                    setNotifications({ ...notifications, ecosystemInvites: e.target.checked })
                  }
                  className="rounded bg-white/10 border-white/20 text-[#D4AF37] focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/10 cursor-pointer">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">Warta Turnamen</span>
                  <span className="text-[10px] text-white/50">Pengumuman bracket kompetisi terbuka</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.tournamentAlerts}
                  onChange={(e) =>
                    setNotifications({ ...notifications, tournamentAlerts: e.target.checked })
                  }
                  className="rounded bg-white/10 border-white/20 text-[#D4AF37] focus:ring-0"
                />
              </label>
            </div>
          </GlassSurface>

          {/* Zona Bahaya (Hapus Akun Permanen) */}
          <GlassCard variant="thick" elevation="raised" radius="3xl" className="p-6 border-red-500/30 flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400">
                <Trash2 className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-heading font-bold text-red-200 uppercase">
                  Zona Bahaya Akun
                </h2>
                <p className="text-[11px] text-white/50">
                  Tindakan ini menghapus seluruh profil &amp; paspor Anda.
                </p>
              </div>
            </div>

            <p className="text-xs text-white/70 leading-relaxed">
              Penghapusan akun bersifat permanen. Seluruh ESPORT ID, catatan kurasi verifikasi, dan keterhubungan ekosistem tim Anda akan dihapus secara ireversibel.
            </p>

            <button
              type="button"
              onClick={() => {
                setShowDeleteModal(true);
                setDeleteError(null);
                setDeleteConfirmationInput("");
              }}
              className="w-full py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-200 font-heading font-bold text-xs uppercase transition-all"
            >
              Hapus Akun Permanen
            </button>
          </GlassCard>
        </div>
      </div>

      {/* MODAL KONFIRMASI HAPUS AKUN */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md">
            <GlassCard variant="elevated" elevation="floating" radius="3xl" className="p-6 border-red-500/40 flex flex-col gap-4">
              <div className="flex items-center gap-3 text-red-400">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="font-heading font-black text-sm uppercase text-white">
                  Konfirmasi Hapus Akun Permanen
                </h3>
              </div>

              <p className="text-xs text-white/70 leading-relaxed">
                Tindakan ini tidak dapat dibatalkan. Ketik frasa <strong className="text-red-400 font-mono">HAPUS AKUN SAYA</strong> di bawah untuk melanjutkan.
              </p>

              {deleteError && (
                <div className="p-3 rounded-xl bg-red-500/20 text-red-300 text-xs">
                  {deleteError}
                </div>
              )}

              <input
                type="text"
                value={deleteConfirmationInput}
                onChange={(e) => setDeleteConfirmationInput(e.target.value)}
                placeholder="HAPUS AKUN SAYA"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-red-500/40 text-xs font-mono text-white placeholder-white/30 focus:outline-none"
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <GlassButton
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Batal
                </GlassButton>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={isDeletingAccount || deleteConfirmationInput !== "HAPUS AKUN SAYA"}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-heading font-bold text-xs uppercase"
                >
                  {isDeletingAccount ? "Menghapus..." : "Hapus Akun"}
                </button>
              </div>
            </GlassCard>
          </div>
        </div>
      )}
    </div>
  );
}
