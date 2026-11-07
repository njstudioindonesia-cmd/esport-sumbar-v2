"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Check,
  X,
  Info,
  Shield,
  FileText,
  UserCheck,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { signInAction, signUpAction } from "@/app/actions/auth";
import { createClient } from "@/lib/supabase/client";

interface MobileAuthFlowProps {
  initialMode?: "login" | "register";
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function MobileAuthFlow({ initialMode = "login" }: MobileAuthFlowProps) {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [step, setStep] = useState<"email" | "password">("email");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showTermsSheet, setShowTermsSheet] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false);

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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user && (event === "SIGNED_IN" || event === "INITIAL_SESSION")) {
        window.location.href = "/dashboard";
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const triggerHaptic = () => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(10);
      } catch {
        // Ignored
      }
    }
  };

  const isEmailValid = EMAIL_REGEX.test(email.trim());
  const isPasswordValid = password.length >= 8;

  const handleNextToPassword = () => {
    if (!isEmailValid) return;
    triggerHaptic();
    setAuthError(null);
    setStep("password");
  };

  const handleSubmit = async () => {
    if (!isPasswordValid) return;
    if (mode === "register" && !agreeTerms) return;

    triggerHaptic();
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
          } else {
            router.push("/me/profile/new");
          }
        } else {
          setAuthError(res.error || "Gagal daftar");
        }
      } else {
        const res = await signInAction(formData);
        if (res.success) {
          const redirectParam = new URLSearchParams(window.location.search).get("redirect");
          if (redirectParam) {
            router.push(redirectParam);
          } else if (res.role === "platform_admin") {
            router.push("/admin");
          } else {
            router.push("/dashboard");
          }
        } else {
          setAuthError(res.error || "Email atau kata sandi keliru");
        }
      }
    } catch {
      setAuthError("Gagal terhubung ke sistem.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full h-[100dvh] max-w-[420px] mx-auto bg-[#07080C] text-white flex flex-col justify-between p-6 overflow-hidden select-none">
      {/* Background Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-gradient-to-b from-[#4C7DFF]/8 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* TOP HEADER */}
      <div className="w-full flex items-center justify-between z-20 pt-2 min-h-[44px]">
        <button
          onClick={() => {
            triggerHaptic();
            if (step === "password") {
              setStep("email");
            } else {
              router.push("/");
            }
          }}
          className="w-10 h-10 rounded-full bg-white/[0.06] border border-white/[0.08] backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex h-2 w-7 rounded-full overflow-hidden opacity-80">
          <span className="w-1/3 bg-[#C8102E]" />
          <span className="w-1/3 bg-[#D4AF37]" />
          <span className="w-1/3 bg-black" />
        </div>

        {/* Mode Toggle Chip (Kecil di kanan atas) */}
        <button
          onClick={() => {
            triggerHaptic();
            setMode(mode === "login" ? "register" : "login");
            setAuthError(null);
          }}
          className="px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-xs font-heading font-medium text-white/70 hover:text-white"
        >
          {mode === "login" ? "Daftar" : "Masuk"}
        </button>
      </div>

      {/* CENTER CONTENT */}
      <div className="relative flex-1 w-full flex flex-col justify-center my-auto z-10">
        <AnimatePresence mode="wait">
          {needsEmailConfirmation && (
            <motion.div
              key="step-confirm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full p-6 rounded-2xl bg-[#0F1118] border border-[#D4AF37]/30 flex flex-col items-center text-center gap-4"
            >
              <div className="w-14 h-14 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                <Mail className="w-7 h-7" />
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="text-lg font-heading font-black text-white">Periksa Email Anda</h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  Kami telah mengirimkan tautan aktivasi ke <span className="text-[#D4AF37] font-semibold">{email}</span>. Silakan buka email Anda dan klik tautan aktivasi untuk membuat kartu atlet digital.
                </p>
              </div>
              <button
                onClick={() => {
                  setNeedsEmailConfirmation(false);
                  setMode("login");
                  setStep("email");
                }}
                className="w-full h-11 mt-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-black font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center"
              >
                Sudah Konfirmasi? Masuk
              </button>
            </motion.div>
          )}

          {/* LANGKAH 1: EMAIL (Satu Field Besar, Validasi Ikon) */}
          {!needsEmailConfirmation && step === "email" && (
            <motion.div
              key="step-email"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              className="w-full flex flex-col"
            >
              <span className="text-xs font-mono text-white/40 uppercase tracking-widest mb-1">
                Langkah 1 dari 2
              </span>
              <h2 className="font-heading font-bold text-[34px] tracking-tight text-white mb-1">
                {mode === "login" ? "Masuk Akun" : "Daftar Akun"}
              </h2>
              <p className="text-xs text-white/50 mb-6">
                {mode === "login"
                  ? "Masukkan email akun Anda untuk melanjutkan."
                  : "Mulai perjalanan paspor esport digital kamu."}
              </p>
              <h2 className="font-heading font-bold text-[34px] tracking-tight text-white mb-6">
                Alamat Email
              </h2>

              {/* Field Besar */}
              <div className="relative w-full">
                <input
                  type="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && isEmailValid && handleNextToPassword()}
                  placeholder="atlet@esport.id"
                  className="w-full h-18 bg-[#0F1118] border border-white/[0.08] focus:border-[#4C7DFF] rounded-[20px] px-5 pr-14 text-lg font-medium text-white placeholder-white/20 outline-none transition-all"
                />
                {/* Validasi Inline: Ikon Centang / Silang (Tanpa Kalimat) */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  {email.length > 3 && (
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center ${
                        isEmailValid
                          ? "bg-[#22C55E]/15 text-[#22C55E]"
                          : "bg-white/[0.06] text-white/30"
                      }`}
                    >
                      {isEmailValid ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* LANGKAH 2: KATA SANDI (Validasi Ikon + Persetujuan Ringkas) */}
          {step === "password" && (
            <motion.div
              key="step-password"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              className="w-full flex flex-col"
            >
              <span className="text-xs font-mono text-white/40 uppercase tracking-widest mb-1">
                Langkah 2
              </span>
              <h2 className="font-heading font-bold text-[34px] tracking-tight text-white mb-6">
                Kata Sandi
              </h2>

              {/* Field Kata Sandi */}
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  autoFocus
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && isPasswordValid && handleSubmit()}
                  placeholder="Minimal 8 karakter"
                  className="w-full h-18 bg-[#0F1118] border border-white/[0.08] focus:border-[#4C7DFF] rounded-[20px] px-5 pr-20 text-lg font-medium text-white placeholder-white/20 outline-none transition-all"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 text-white/40 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  {/* Validasi Inline: Ikon Centang (Tanpa Kalimat) */}
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      isPasswordValid
                        ? "bg-[#22C55E]/15 text-[#22C55E]"
                        : "bg-white/[0.06] text-white/30"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Persetujuan Syarat & Privasi: Satu Baris dengan Toggle dan Ikon i */}
              {mode === "register" && (
                <div className="mt-5 flex items-center justify-between px-1">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => {
                        triggerHaptic();
                        setAgreeTerms(e.target.checked);
                      }}
                      className="w-4 h-4 rounded bg-[#161A24] border-white/20 text-[#4C7DFF] focus:ring-0 cursor-pointer"
                    />
                    <span className="text-xs text-white/70 font-medium">Syarat & Privasi</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic();
                      setShowTermsSheet(true);
                    }}
                    className="p-1 text-white/50 hover:text-white"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Indikator Kesalahan Ringkas (Jika Gagal) */}
              {authError && (
                <div className="mt-4 px-3 py-2 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/20 text-xs text-[#EF4444] text-center font-medium">
                  {authError}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* BOTTOM ACTION BUTTON (Lebar Penuh, h-14, Selalu Terlihat) */}
      <div className="w-full z-20 pb-4">
        {step === "email" && (
          <button
            onClick={handleNextToPassword}
            disabled={!isEmailValid}
            className={`w-full h-14 rounded-full font-heading font-bold text-sm tracking-wider uppercase transition-all duration-200 active:scale-[0.98] shadow-lg flex items-center justify-center ${
              isEmailValid
                ? "bg-[#4C7DFF] text-white hover:bg-[#3B6BE8] shadow-[0_8px_24px_rgba(76,125,255,0.3)]"
                : "bg-[#161A24] text-white/30 cursor-not-allowed"
            }`}
          >
            Lanjut
          </button>
        )}

        {step === "password" && (
          <button
            onClick={handleSubmit}
            disabled={!isPasswordValid || (mode === "register" && !agreeTerms) || isLoading}
            className={`w-full h-14 rounded-full font-heading font-bold text-sm tracking-wider uppercase transition-all duration-200 active:scale-[0.98] shadow-lg flex items-center justify-center ${
              isPasswordValid && (!agreeTerms || agreeTerms) && !isLoading
                ? "bg-[#D4AF37] text-[#07080C] hover:bg-[#E5C158] shadow-[0_8px_24px_rgba(212,175,55,0.3)]"
                : "bg-[#161A24] text-white/30 cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : mode === "login" ? (
              "Masuk"
            ) : (
              "Daftar"
            )}
          </button>
        )}
      </div>

      {/* BOTTOM SHEET: RINGKASAN SYARAT & PRIVASI (Radius 28, Glass Blur 24) */}
      <AnimatePresence>
        {showTermsSheet && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTermsSheet(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed bottom-0 left-0 right-0 max-w-[420px] mx-auto bg-[#0F1118]/95 border-t border-white/[0.08] backdrop-blur-xl rounded-t-[28px] p-6 z-50 flex flex-col gap-4 shadow-2xl"
            >
              {/* Handle Bar */}
              <div className="w-10 h-1 rounded-full bg-white/20 mx-auto" />

              <h3 className="font-heading font-bold text-lg text-white">Syarat Privasi</h3>

              {/* 3 Butir Visual Ringkas (Tanpa Paragraf) */}
              <div className="flex flex-col gap-3 py-1">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#D4AF37]/15 flex items-center justify-center text-[#D4AF37]">
                    <Shield className="w-4 h-4" />
                  </div>
                  <span className="text-xs text-white/80 font-medium">
                    Perlindungan Data UU PDP
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#4C7DFF]/15 flex items-center justify-center text-[#4C7DFF]">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <span className="text-xs text-white/80 font-medium">
                    ESPORT ID Digital Non-KTP
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#22C55E]/15 flex items-center justify-center text-[#22C55E]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <span className="text-xs text-white/80 font-medium">
                    Kontak &amp; Dokumen Privat
                  </span>
                </div>
              </div>

              {/* Tombol Tutup (Maks 1 Kata) */}
              <button
                onClick={() => {
                  triggerHaptic();
                  setShowTermsSheet(false);
                }}
                className="w-full h-12 rounded-full bg-[#161A24] border border-white/[0.08] text-white font-heading font-semibold text-xs tracking-wider uppercase mt-2"
              >
                Tutup
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
