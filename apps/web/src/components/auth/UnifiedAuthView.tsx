"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  ShieldCheck,
  ArrowLeft,
  Loader2,
  Sparkles,
  Trophy,
  Gamepad2,
  Users,
  Compass,
  CreditCard,
} from "lucide-react";
import { signInAction, signUpAction, resetPasswordAction } from "@/app/actions/auth";
import { createClient } from "@/lib/supabase/client";
import { GALLERY_CARDS } from "@/data/mockCards";
import { GlassSurface } from "@/components/glass/GlassSurface";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassButton } from "@/components/glass/GlassButton";
import { GlassBadge } from "@/components/glass/GlassBadge";
import { EsportCard } from "@/components/card/EsportCard";
import { BrandWatermark } from "@/components/brand";

interface UnifiedAuthViewProps {
  initialMode?: "login" | "register";
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function UnifiedAuthView({ initialMode = "login" }: UnifiedAuthViewProps) {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">(initialMode);

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [rememberMe, setRememberMe] = useState(true);

  // Status
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(null);

  // Auto redirect if already signed in & URL error detection
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.startsWith("#") ? window.location.hash.substring(1) : "";
      const hashParams = new URLSearchParams(hash);
      const errorDesc = hashParams.get("error_description");
      const searchParams = new URLSearchParams(window.location.search);
      const queryError = searchParams.get("error");

      if (errorDesc) {
        const decoded = decodeURIComponent(errorDesc.replace(/\+/g, " "));
        setAuthError(decoded);
      } else if (queryError === "auth_callback_failed") {
        setAuthError("Gagal menyelesaikan otentikasi. Silakan periksa kredensial atau coba lagi.");
      }
    }

    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        window.location.href = "/dashboard";
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user && (event === "SIGNED_IN" || event === "INITIAL_SESSION")) {
        window.location.href = "/dashboard";
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Field validation status
  const isEmailValid = EMAIL_REGEX.test(email.trim());
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasMinLength = password.length >= 8;
  const isPasswordValid = hasMinLength && (mode === "login" || (hasUpperCase && hasNumber));
  const isEmailTouched = email.length > 0;
  const isPasswordTouched = password.length > 0;

  // 3D Tilt Card Motion Values for Desktop Side Panel
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-200, 200], [10, -10]), {
    stiffness: 150,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [-200, 200], [-10, 10]), {
    stiffness: 150,
    damping: 20,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Reset Password Handler (No email leak)
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL_REGEX.test(resetEmail.trim())) {
      setAuthError("Masukkan alamat email yang valid.");
      return;
    }
    setIsLoading(true);
    setAuthError(null);
    const formData = new FormData();
    formData.append("email", resetEmail.trim());
    const res = await resetPasswordAction(formData);
    setIsLoading(false);
    if (res.success) {
      setResetSuccessMessage(
        res.message || "Jika email terdaftar, tautan pemulihan kata sandi telah dikirim ke email Anda."
      );
    } else {
      setAuthError(res.error || "Gagal memproses permintaan reset kata sandi.");
    }
  };

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isEmailValid) {
      setAuthError("Format email tidak valid.");
      return;
    }

    if (!isPasswordValid) {
      setAuthError(
        mode === "register"
          ? "Kata sandi minimal 8 karakter, mengandung huruf kapital dan angka."
          : "Kata sandi wajib diisi."
      );
      return;
    }

    if (mode === "register" && !agreeTerms) {
      setAuthError("Kamu wajib menyetujui Ketentuan Layanan.");
      return;
    }

    setIsLoading(true);
    setAuthError(null);

    const formData = new FormData();
    formData.append("email", email.trim());
    formData.append("password", password);

    try {
      if (mode === "register") {
        const res = await signUpAction(formData);
        if (res.success) {
          if (res.needsConfirmation) {
            setNeedsEmailConfirmation(true);
            setAuthSuccess(res.message || "Tautan konfirmasi telah dikirim ke email Anda.");
          } else {
            setAuthSuccess("Pendaftaran berhasil! Mengalihkan ke pembuatan kartu...");
            setTimeout(() => {
              window.location.href = "/onboarding";
            }, 1200);
          }
        } else {
          setAuthError(res.error || "Pendaftaran gagal. Silakan coba kembali.");
        }
      } else {
        const res = await signInAction(formData);
        if (res.success) {
          setAuthSuccess("Autentikasi berhasil! Mengalihkan...");
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 1000);
        } else {
          setAuthError(res.error || "Email atau kata sandi tidak cocok.");
        }
      }
    } catch {
      setAuthError("Terjadi kesalahan jaringan. Silakan periksa koneksi Anda.");
    } finally {
      setIsLoading(false);
    }
  };

  const showcaseCard = GALLERY_CARDS[0];

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 select-none">
      {/* Background Ambience */}
      <BrandWatermark opacity={0.03} size={640} position="center" />

      {/* Main Container: Single Responsive Shell (Mobile full width card, Desktop 2-column) */}
      <div className="relative z-10 w-full max-w-md lg:max-w-5xl mx-auto flex flex-col lg:flex-row items-stretch gap-6 lg:gap-8">
        {/* ========================================================= */}
        {/* DESKTOP SHOWCASE PANEL (Visible on lg+, hidden on mobile)  */}
        {/* ========================================================= */}
        <div className="hidden lg:flex flex-1 flex-col justify-between p-8 rounded-3xl bg-slate-900/40 border border-white/10 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand Identity */}
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-5 w-1.5 shrink-0 rounded-full overflow-hidden">
                <span className="h-1/3 w-full bg-[#C8102E]" />
                <span className="h-1/3 w-full bg-[#D4AF37]" />
                <span className="h-1/3 w-full bg-black" />
              </div>
              <span className="font-heading font-black text-sm tracking-wider text-white group-hover:text-[#D4AF37] transition-colors">
                ESPORT SUMBAR
              </span>
            </Link>
            <GlassBadge variant="subtle" size="sm">
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              <span>PASPOR 2026</span>
            </GlassBadge>
          </div>

          {/* Interactive 3D Card Stage */}
          <div
            className="my-auto py-8 flex flex-col items-center justify-center perspective-[1000px]"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <motion.div
              style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
              }}
              className="relative transition-transform duration-100 ease-out cursor-grab active:cursor-grabbing"
            >
              <div className="p-3 rounded-3xl bg-white/[0.03] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-sm">
                <EsportCard
                  type={showcaseCard.type}
                  rarity={showcaseCard.rarity}
                  verification={showcaseCard.verification}
                  data={showcaseCard.data}
                  size="md"
                  interactive={false}
                />
              </div>
            </motion.div>
            <p className="text-[11px] font-mono text-white/40 mt-4 tracking-wider uppercase">
              Paspor Atlet Digital Ranah Minang
            </p>
          </div>

          {/* Bottom 3 Ecosystem Pillars */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
            <div className="flex flex-col items-center text-center p-2 rounded-xl bg-white/[0.02]">
              <CreditCard className="w-4 h-4 text-[#D4AF37] mb-1" />
              <span className="text-[10px] font-heading font-bold text-white">1 Akun 1 Bidang</span>
              <span className="text-[9px] text-white/50">Identitas Tunggal</span>
            </div>
            <div className="flex flex-col items-center text-center p-2 rounded-xl bg-white/[0.02]">
              <ShieldCheck className="w-4 h-4 text-emerald-400 mb-1" />
              <span className="text-[10px] font-heading font-bold text-white">Verifikasi Satu Tahap</span>
              <span className="text-[9px] text-white/50">Kurasi Mandiri</span>
            </div>
            <div className="flex flex-col items-center text-center p-2 rounded-xl bg-white/[0.02]">
              <Users className="w-4 h-4 text-cyan-400 mb-1" />
              <span className="text-[10px] font-heading font-bold text-white">7 Bidang Entitas</span>
              <span className="text-[9px] text-white/50">Ekosistem Terhubung</span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* AUTH FORM CARD (Responsive on all viewports)              */}
        {/* ========================================================= */}
        <div className="flex-1 w-full flex flex-col justify-center">
          <GlassSurface
            variant="elevated"
            elevation="glass"
            radius="3xl"
            className="p-6 sm:p-8 flex flex-col gap-6"
          >
            {/* Mobile Brand Bar */}
            <div className="flex lg:hidden items-center justify-between pb-3 border-b border-white/10">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-5 w-1.5 shrink-0 rounded-full overflow-hidden">
                  <span className="h-1/3 w-full bg-[#C8102E]" />
                  <span className="h-1/3 w-full bg-[#D4AF37]" />
                  <span className="h-1/3 w-full bg-black" />
                </div>
                <span className="font-heading font-black text-sm tracking-wider text-white">
                  ESPORT SUMBAR
                </span>
              </Link>
              <GlassBadge variant="subtle" size="sm">
                Paspor Digital
              </GlassBadge>
            </div>

            {/* Mode Switcher Segmented Tabs */}
            <div className="grid grid-cols-2 p-1 rounded-2xl bg-white/[0.04] border border-white/10 text-xs font-heading font-bold">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setAuthError(null);
                  setAuthSuccess(null);
                }}
                className={`py-2.5 rounded-xl transition-all ${
                  mode === "login"
                    ? "bg-[#D4AF37] text-black shadow-lg font-black"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Masuk
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setAuthError(null);
                  setAuthSuccess(null);
                }}
                className={`py-2.5 rounded-xl transition-all ${
                  mode === "register"
                    ? "bg-[#D4AF37] text-black shadow-lg font-black"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Daftar Akun
              </button>
            </div>

            {/* Header Text */}
            <div>
              <h1 className="text-xl sm:text-2xl font-heading font-black text-white uppercase tracking-tight">
                {mode === "login" ? "Selamat Datang Kembali" : "Penerbitan Paspor Digital"}
              </h1>
              <p className="text-xs text-white/60 mt-1 leading-relaxed">
                {mode === "login"
                  ? "Masuk ke area paspor digital Anda untuk mengakses status verifikasi dan ekosistem."
                  : "Daftarkan akun Anda satu kali untuk menerbitkan kartu digital dan terhubung ke 7 bidang ekosistem."}
              </p>
            </div>

            {/* Email Confirmation Alert */}
            {needsEmailConfirmation && (
              <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs flex flex-col gap-2">
                <div className="flex items-center gap-2 font-bold">
                  <Mail className="w-4 h-4 text-amber-400" />
                  <span>Periksa Kotak Masuk Email Anda</span>
                </div>
                <p className="text-white/80 leading-relaxed text-[11px]">
                  Tautan aktivasi telah dikirimkan ke <strong>{email}</strong>. Silakan klik tautan
                  tersebut untuk memulai proses onboarding profil.
                </p>
              </div>
            )}

            {/* Error Callout */}
            {authError && (
              <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-200 text-xs flex items-center gap-2.5 animate-shake">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span className="leading-snug">{authError}</span>
              </div>
            )}

            {/* Success Callout */}
            {authSuccess && !needsEmailConfirmation && (
              <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-xs flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="leading-snug">{authSuccess}</span>
              </div>
            )}

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-heading font-bold text-white/80 block">
                  Alamat Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@domain.com"
                    required
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border text-xs text-white placeholder-white/30 focus:outline-none focus:ring-1 transition-all ${
                      isEmailTouched && !isEmailValid
                        ? "border-red-500/50 focus:ring-red-500/40"
                        : "border-white/10 focus:border-[#D4AF37]/60 focus:ring-[#D4AF37]/30"
                    }`}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-heading font-bold text-white/80">
                    Kata Sandi
                  </label>
                  {mode === "login" && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsResetPasswordOpen(true);
                        setResetSuccessMessage(null);
                        setAuthError(null);
                      }}
                      className="text-[11px] text-[#D4AF37] hover:underline"
                    >
                      Lupa Sandi?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/[0.04] border text-xs text-white placeholder-white/30 focus:outline-none focus:ring-1 transition-all ${
                      isPasswordTouched && !isPasswordValid && mode === "register"
                        ? "border-red-500/50 focus:ring-red-500/40"
                        : "border-white/10 focus:border-[#D4AF37]/60 focus:ring-[#D4AF37]/30"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {mode === "register" && (
                  <div className="grid grid-cols-3 gap-1.5 pt-1 text-[10px] text-white/50">
                    <span className={hasMinLength ? "text-emerald-400" : ""}>• Min. 8 karakter</span>
                    <span className={hasUpperCase ? "text-emerald-400" : ""}>• Huruf kapital</span>
                    <span className={hasNumber ? "text-emerald-400" : ""}>• Mengandung angka</span>
                  </div>
                )}
              </div>

              {/* Terms Checkbox for Registration */}
              {mode === "register" && (
                <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded bg-white/10 border-white/20 text-[#D4AF37] focus:ring-0"
                  />
                  <span className="text-[11px] text-white/70 leading-relaxed">
                    Saya menyetujui{" "}
                    <Link href="/terms" className="text-[#D4AF37] underline" target="_blank">
                      Ketentuan Layanan
                    </Link>{" "}
                    dan{" "}
                    <Link href="/privacy" className="text-[#D4AF37] underline" target="_blank">
                      Tata Kelola Privasi Data
                    </Link>{" "}
                    ESPORT SUMBAR.
                  </span>
                </label>
              )}

              {/* Submit Button */}
              <GlassButton
                type="submit"
                variant="primary"
                size="md"
                className="w-full mt-2 font-black tracking-wide uppercase"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Memproses...</span>
                  </span>
                ) : mode === "login" ? (
                  "Masuk ke Paspor"
                ) : (
                  "Buat Akun Sekarang"
                )}
              </GlassButton>
            </form>

            {/* Alternative Action / Toggle */}
            <div className="pt-2 text-center text-xs text-white/50 border-t border-white/10">
              {mode === "login" ? (
                <span>
                  Belum memiliki akun?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("register");
                      setAuthError(null);
                    }}
                    className="text-[#D4AF37] font-bold hover:underline"
                  >
                    Daftar Akun Baru
                  </button>
                </span>
              ) : (
                <span>
                  Sudah memiliki akun?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("login");
                      setAuthError(null);
                    }}
                    className="text-[#D4AF37] font-bold hover:underline"
                  >
                    Masuk ke Akun
                  </button>
                </span>
              )}
            </div>
          </GlassSurface>
        </div>
      </div>

      {/* ========================================================= */}
      {/* RESET PASSWORD MODAL OVERLAY                              */}
      {/* ========================================================= */}
      {isResetPasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md">
            <GlassCard variant="elevated" elevation="floating" radius="3xl" className="p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <h3 className="font-heading font-black text-sm text-white uppercase">
                    Pemulihan Kata Sandi
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsResetPasswordOpen(false)}
                  className="w-7 h-7 rounded-lg text-white/50 hover:text-white hover:bg-white/10 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-white/70 leading-relaxed">
                Masukkan email Anda. Kami akan mengirimkan tautan untuk mengatur ulang kata sandi Anda tanpa membocorkan status akun secara publik.
              </p>

              {resetSuccessMessage ? (
                <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-xs">
                  {resetSuccessMessage}
                </div>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-heading font-bold text-white/80">
                      Email Terdaftar
                    </label>
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="nama@domain.com"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/60"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <GlassButton
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsResetPasswordOpen(false)}
                    >
                      Batal
                    </GlassButton>
                    <GlassButton
                      type="submit"
                      variant="primary"
                      size="sm"
                      disabled={isLoading}
                    >
                      {isLoading ? "Mengirim..." : "Kirim Tautan"}
                    </GlassButton>
                  </div>
                </form>
              )}
            </GlassCard>
          </div>
        </div>
      )}
    </div>
  );
}
