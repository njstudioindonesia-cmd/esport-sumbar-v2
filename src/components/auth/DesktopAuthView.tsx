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
  Award,
} from "lucide-react";
import { signInAction, signUpAction, resetPasswordAction } from "@/app/actions/auth";
import { createClient } from "@/lib/supabase/client";
import { GALLERY_CARDS } from "@/data/mockCards";

interface DesktopAuthViewProps {
  mode: "login" | "register";
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function DesktopAuthView({ mode }: DesktopAuthViewProps) {
  const router = useRouter();

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
        if (decoded.includes("Unable to exchange external code")) {
          setAuthError("Gagal otentikasi Google: Kredensial Client Secret di Supabase tidak cocok atau belum diisi. Pastikan Client Secret dari Google Cloud telah disalin ke Supabase Dashboard -> Authentication -> Providers -> Google.");
        } else {
          setAuthError(decoded);
        }
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
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

  // 3D Tilt Card Motion Values for Left Panel
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-200, 200], [12, -12]), {
    stiffness: 150,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [-200, 200], [-12, 12]), {
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

  // Google OAuth Handler Resmi
  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const supabase = createClient();
      const origin = window.location.origin;
      const targetNext = mode === "register" ? "/me/profile/new" : "/dashboard";
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(targetNext)}`,
        },
      });
      if (error) {
        setAuthError(error.message);
        setIsLoading(false);
      }
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : "Gagal menghubungkan Google Auth.");
      setIsLoading(false);
    }
  };

  // Reset Password Handler
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
      setResetSuccessMessage(res.message || "Tautan pemulihan kata sandi telah dikirim ke email Anda.");
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
              router.push("/me/profile/new");
            }, 600);
          }
        } else {
          setAuthError(res.error || "Gagal mendaftar akun");
        }
      } else {
        const res = await signInAction(formData);
        if (res.success) {
          setAuthSuccess(res.message || "Masuk berhasil! Mengalihkan...");
          setTimeout(() => {
            const redirectParam = new URLSearchParams(window.location.search).get("redirect");
            router.push(redirectParam || "/dashboard");
          }, 600);
        } else {
          setAuthError(res.error || "Email atau kata sandi keliru");
        }
      }
    } catch {
      setAuthError("Terjadi gangguan koneksi. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  // Featured showcase card for left panel (Elite Card from Bukittinggi)
  const showcaseCard = GALLERY_CARDS[2] || GALLERY_CARDS[0];

  return (
    <div className="w-full min-h-screen bg-[#07080C] text-white flex select-none overflow-hidden">
      {/* ========================================================= */}
      {/* LEFT PANEL (45%): PANEL VISUAL SINEMATIK KARTU TCG MELAYANG */}
      {/* ========================================================= */}
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-[45%] min-h-screen hidden lg:flex flex-col justify-between p-12 lg:p-14 border-r border-white/[0.08] bg-gradient-to-br from-[#0F1118] via-[#07080C] to-[#0A0D15] overflow-hidden"
      >
        {/* Ambient Glow Orbs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#4C7DFF]/10 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#D4AF37]/15 blur-[120px] pointer-events-none" />

        {/* Top Header Row */}
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            {/* Marawa Tricolor Badge */}
            <div className="flex h-5 w-2 rounded-full overflow-hidden shadow-sm">
              <span className="h-1/3 w-full bg-[#C8102E]" />
              <span className="h-1/3 w-full bg-[#D4AF37]" />
              <span className="h-1/3 w-full bg-black" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-black text-sm tracking-wider text-white group-hover:text-[#D4AF37] transition-colors">
                ESPORT SUMBAR
              </span>
              <span className="text-[9px] font-mono text-white/40 tracking-widest uppercase">
                PBESI SUMATERA BARAT
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono text-white/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            SISTEM RESMI V2
          </div>
        </div>

        {/* Center: 3D Floating TCG Card Display */}
        <div className="relative z-10 my-auto flex flex-col items-center justify-center [perspective:1200px]">
          {/* Card Ambient Glow Behind */}
          <div className="absolute w-72 h-96 rounded-3xl bg-gradient-to-t from-[#D4AF37]/25 via-[#4C7DFF]/15 to-transparent blur-3xl pointer-events-none" />

          {/* Floating Levitating Motion Wrapper */}
          <motion.div
            animate={{
              y: [-6, 6, -6],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
            }}
            className="relative cursor-pointer transition-transform duration-200"
          >
            {/* TCG Card Frame (320x460 px, Elite Golden Frame) */}
            <div className="relative w-[300px] h-[430px] rounded-[22px] bg-gradient-to-b from-[#1C1F2B] via-[#12151E] to-[#0A0C13] border-2 border-[#D4AF37] shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(212,175,55,0.25)] p-4 flex flex-col justify-between overflow-hidden">
              {/* Holographic Subtle Glare */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.05] to-transparent pointer-events-none" />

              {/* Top Row: Rarity Badge + PBESI Official Verification */}
              <div className="w-full flex items-center justify-between z-10">
                <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] text-[9px] font-mono font-black text-[#D4AF37] uppercase tracking-wider">
                  TIER 3 • ELITE
                </span>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#4C7DFF]/20 border border-[#4C7DFF]/60 text-[9px] font-mono font-bold text-[#4C7DFF]">
                  <ShieldCheck className="w-3 h-3 text-[#4C7DFF]" />
                  <span>VERIFIED PROV</span>
                </div>
              </div>

              {/* Avatar Photo with Glow */}
              <div className="relative w-full flex-1 my-2 flex flex-col items-center justify-center">
                <div className="relative w-28 h-28 rounded-2xl overflow-hidden border border-[#D4AF37]/40 shadow-xl bg-[#0F1118]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={showcaseCard.data.avatarUrl || "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=400&auto=format&fit=crop"}
                    alt={showcaseCard.data.displayName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-1 right-1.5 flex h-3 w-1 rounded-sm overflow-hidden opacity-90">
                    <span className="h-1/3 w-full bg-[#C8102E]" />
                    <span className="h-1/3 w-full bg-[#D4AF37]" />
                    <span className="h-1/3 w-full bg-black" />
                  </div>
                </div>

                {/* Identity Texts */}
                <div className="text-center mt-2.5">
                  <div className="text-base font-heading font-black tracking-wide text-white truncate max-w-[200px]">
                    {showcaseCard.data.displayName}
                  </div>
                  <div className="text-xs font-mono font-bold text-[#D4AF37]">
                    @{showcaseCard.data.ign}
                  </div>
                </div>
              </div>

              {/* Bottom Card Strip: Game & Region */}
              <div className="w-full pt-2.5 border-t border-white/[0.08] flex items-center justify-between text-[10px] font-mono text-white/70 z-10">
                <div className="flex items-center gap-1.5 text-white/90">
                  <Gamepad2 className="w-3.5 h-3.5 text-[#4C7DFF]" />
                  <span className="font-semibold truncate max-w-[140px]">{showcaseCard.data.game}</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-white/[0.06] text-[#D4AF37] font-bold">
                  {showcaseCard.data.region.name}
                </span>
              </div>
            </div>
          </motion.div>

          <span className="mt-4 text-[10px] font-mono text-white/30 tracking-widest uppercase">
            Arahkan kursor untuk efek 3D tilt
          </span>
        </div>

        {/* Bottom Panel Text: Slogan Maks 6 Kata */}
        <div className="relative z-10">
          <h2 className="text-2xl font-heading font-black text-white tracking-tight leading-snug">
            Identitas Resmi Atlet Ranah Minang
          </h2>
          <p className="mt-1 text-xs font-sans text-white/50 leading-relaxed max-w-sm">
            Paspor esport digital berbasis verifikasi PBESI Sumbar. Terlindungi UU PDP No. 27/2022.
          </p>

          <div className="mt-4 flex items-center gap-6 pt-3 border-t border-white/[0.06] text-white/40 text-[11px] font-mono">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" /> Terenkripsi
            </span>
            <span className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#4C7DFF]" /> 19 Pengcab
            </span>
            <span className="flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-white/60" /> Standar PBESI
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* RIGHT PANEL (55%): FORMULIR PRESISI DI TENGAH (LEBAR 400PX) */}
      {/* ========================================================= */}
      <div className="flex-1 min-h-screen flex items-center justify-center p-6 md:p-12 relative bg-[#07080C]">
        <div className="w-full max-w-[400px] flex flex-col py-8">
          {/* Back Link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-white/40 hover:text-white transition-colors mb-6 group w-fit"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Kembali ke Beranda</span>
          </Link>

          {/* Heading */}
          <div className="mb-6">
            <h1 className="text-3xl font-heading font-black text-white tracking-tight">
              {mode === "login" ? "Masuk Akun" : "Daftar Akun"}
            </h1>
            <p className="text-xs text-white/50 font-sans mt-1">
              {mode === "login"
                ? "Akses paspor esport digital kamu."
                : "Mulai perjalanan atlet esport resmi kamu."}
            </p>
          </div>

          {/* TOMBOL "LANJUT DENGAN GOOGLE" UTAMA */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className="w-full h-12 rounded-xl bg-[#161A24] hover:bg-[#1C2230] border border-white/10 hover:border-[#D4AF37]/50 transition-all flex items-center justify-center gap-3 text-xs font-heading font-bold text-white shadow-sm active:scale-[0.99] disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Lanjut dengan Google</span>
          </button>

          {/* PEMISAH */}
          <div className="relative my-5 flex items-center justify-center">
            <div className="w-full border-t border-white/[0.08]" />
            <span className="absolute bg-[#07080C] px-3 text-[10px] font-mono uppercase tracking-widest text-white/40">
              atau dengan email
            </span>
          </div>

          {/* ALERT NOTIFIKASI ERROR / SUKSES */}
          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}
          {authSuccess && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>{authSuccess}</span>
            </div>
          )}

          {/* KONTEN FORMULIR / KONFIRMASI EMAIL / RESET PASSWORD */}
          {needsEmailConfirmation ? (
            <div className="p-6 rounded-2xl bg-[#0F1118] border border-[#D4AF37]/30 flex flex-col items-center text-center gap-4 animate-in fade-in duration-300">
              <div className="w-14 h-14 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                <Mail className="w-7 h-7" />
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="text-lg font-heading font-black text-white">Periksa Email Anda</h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  Kami telah mengirimkan tautan aktivasi ke <span className="text-[#D4AF37] font-semibold">{email}</span>. Silakan klik tautan di email untuk mengaktifkan akun resmi dan mulai membuat kartu identitas atlet Anda.
                </p>
              </div>
              <Link
                href="/login"
                className="w-full h-11 mt-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-black font-heading font-bold text-xs uppercase flex items-center justify-center tracking-wider hover:brightness-110 transition-all"
              >
                Sudah Konfirmasi? Masuk
              </Link>
            </div>
          ) : isResetPasswordOpen ? (
            <div className="p-6 rounded-2xl bg-[#0F1118] border border-white/10 flex flex-col gap-4 animate-in fade-in duration-300">
              <div>
                <h3 className="text-base font-heading font-bold text-white">Lupa Kata Sandi</h3>
                <p className="text-xs text-white/50 mt-1">
                  Masukkan email akun Anda. Kami akan mengirimkan tautan untuk mengatur ulang kata sandi.
                </p>
              </div>

              {resetSuccessMessage ? (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{resetSuccessMessage}</span>
                </div>
              ) : (
                <form onSubmit={handleResetPassword} className="flex flex-col gap-3">
                  <div className="relative">
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="atlet@esportsumbar.id"
                      required
                      className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl pl-9 pr-3 text-xs text-white placeholder-white/30 outline-none"
                    />
                    <Mail className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 h-10 rounded-xl bg-[#D4AF37] text-black font-heading font-bold text-xs uppercase hover:brightness-110 transition-all flex items-center justify-center"
                    >
                      {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Kirim Tautan"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsResetPasswordOpen(false)}
                      className="px-4 h-10 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white/70 text-xs font-mono transition-colors"
                    >
                      Batal
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <>
              {/* FORMULIR BESAR */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* FIELD EMAIL */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-white/60">
                Alamat Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (authError) setAuthError(null);
                  }}
                  placeholder="atlet@esportsumbar.id"
                  required
                  className="w-full h-12 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] rounded-xl pl-10 pr-10 text-sm text-white placeholder-white/30 outline-none transition-all"
                />
                <Mail className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />

                {/* Inline Validation Icon */}
                {isEmailTouched && (
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                    {isEmailValid ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-400" />
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* FIELD KATA SANDI */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono uppercase tracking-wider text-white/60">
                  Kata Sandi
                </label>
                {mode === "login" && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsResetPasswordOpen(true);
                      setResetEmail(email);
                      setAuthError(null);
                    }}
                    className="text-[11px] font-mono text-[#D4AF37] hover:underline"
                  >
                    Lupa sandi?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (authError) setAuthError(null);
                  }}
                  placeholder="Minimal 8 karakter"
                  required
                  className="w-full h-12 bg-[#161A24] border border-white/[0.08] focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] rounded-xl pl-10 pr-10 text-sm text-white placeholder-white/30 outline-none transition-all"
                />
                <Lock className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />

                {/* Toggle Show Password */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Password length indicator */}
              {isPasswordTouched && (
                <div className="flex items-center gap-1.5 text-[10px] font-mono mt-0.5">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isPasswordValid ? "bg-emerald-400" : "bg-amber-400"
                    }`}
                  />
                  <span className={isPasswordValid ? "text-emerald-400" : "text-white/40"}>
                    {isPasswordValid ? "Kata sandi kuat" : "Minimal 8 karakter"}
                  </span>
                </div>
              )}
            </div>

            {/* CHECKBOX PERSETUJUAN SATU BARIS DENGAN TAUTAN (UNTUK REGISTER) */}
            {mode === "register" ? (
              <label className="flex items-start gap-2.5 cursor-pointer mt-1 select-none">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded bg-[#161A24] border-white/20 text-[#D4AF37] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <span className="text-xs text-white/70 leading-snug">
                  Saya menyetujui{" "}
                  <Link href="/how-it-works" className="text-[#D4AF37] hover:underline">
                    Ketentuan Layanan
                  </Link>{" "}
                  &{" "}
                  <Link href="/privacy" className="text-[#D4AF37] hover:underline">
                    Kebijakan Privasi
                  </Link>{" "}
                  PBESI Sumbar.
                </span>
              </label>
            ) : (
              <label className="flex items-center gap-2 cursor-pointer mt-1 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#161A24] border-white/20 text-[#D4AF37] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <span className="text-xs text-white/70">Ingat perangkat ini</span>
              </label>
            )}

            {/* TOMBOL UTAMA (MAKS 2 KATA) */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 mt-2 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#AA7C11] text-[#07080C] font-heading font-black text-xs tracking-wider uppercase shadow-[0_4px_24px_rgba(212,175,55,0.25)] hover:shadow-[0_6px_32px_rgba(212,175,55,0.4)] hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#07080C]" />
                  <span>Memproses...</span>
                </>
              ) : (
                <span>{mode === "login" ? "Masuk" : "Daftar"}</span>
              )}
            </button>
          </form>

              {/* TAUTAN KECIL SWITCH LOGIN / REGISTER */}
              <div className="mt-6 text-center text-xs text-white/50">
                {mode === "login" ? (
                  <span>
                    Belum punya akun atlet?{" "}
                    <Link
                      href="/register"
                      className="text-[#D4AF37] hover:text-[#E5C158] font-bold hover:underline transition-colors"
                    >
                      Daftar
                    </Link>
                  </span>
                ) : (
                  <span>
                    Sudah memiliki kartu akun?{" "}
                    <Link
                      href="/login"
                      className="text-[#D4AF37] hover:text-[#E5C158] font-bold hover:underline transition-colors"
                    >
                      Masuk
                    </Link>
                  </span>
                )}
              </div>
            </>
          )}

          {/* FOOTER KECIL KEPATUHAN PDP */}
          <div className="mt-8 pt-4 border-t border-white/[0.06] text-center text-[10px] font-mono text-white/30 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Kepatuhan UU PDP No. 27/2022 • PBESI Sumatera Barat</span>
          </div>
        </div>
      </div>
    </div>
  );
}
