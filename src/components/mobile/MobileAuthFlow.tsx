"use client";

import React, { useState } from "react";
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

interface MobileAuthFlowProps {
  initialMode?: "login" | "register";
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function MobileAuthFlow({ initialMode = "login" }: MobileAuthFlowProps) {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [step, setStep] = useState<"select" | "email" | "password">("select");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showTermsSheet, setShowTermsSheet] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

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

  const handleGoogleAuth = () => {
    triggerHaptic();
    setIsLoading(true);
    // Simulasi respons cepat Google OAuth
    setTimeout(() => {
      setIsLoading(false);
      router.push("/me/profile/new");
    }, 800);
  };

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
          router.push("/me/profile/new");
        } else {
          setAuthError(res.error || "Gagal daftar");
        }
      } else {
        const res = await signInAction(formData);
        if (res.success) {
          router.push("/me/profile/new");
        } else {
          setAuthError(res.error || "Gagal masuk");
        }
      }
    } catch {
      setAuthError("Gagal terhubung");
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
        {step !== "select" ? (
          <button
            onClick={() => {
              triggerHaptic();
              setStep(step === "password" ? "email" : "select");
            }}
            className="w-10 h-10 rounded-full bg-white/[0.06] border border-white/[0.08] backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex h-2 w-7 rounded-full overflow-hidden opacity-80">
            <span className="w-1/3 bg-[#C8102E]" />
            <span className="w-1/3 bg-[#D4AF37]" />
            <span className="w-1/3 bg-black" />
          </div>
        )}

        {/* Mode Toggle Chip (Kecil di kanan atas) */}
        {step === "select" && (
          <button
            onClick={() => {
              triggerHaptic();
              setMode(mode === "login" ? "register" : "login");
            }}
            className="px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-xs font-heading font-medium text-white/70 hover:text-white"
          >
            {mode === "login" ? "Daftar" : "Masuk"}
          </button>
        )}
      </div>

      {/* CENTER CONTENT */}
      <div className="relative flex-1 w-full flex flex-col justify-center my-auto z-10">
        <AnimatePresence mode="wait">
          {/* LAYAR 0: PILIH METODE (2 Tombol Besar, Tanpa Form Panjang) */}
          {step === "select" && (
            <motion.div
              key="step-select"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="w-full flex flex-col items-center"
            >
              {/* Logo Kecil */}
              <div className="w-16 h-16 rounded-2xl bg-[#0F1118] border border-white/[0.08] flex items-center justify-center shadow-lg mb-6">
                <div className="flex flex-col items-center">
                  <span className="font-heading font-black text-sm text-white">ESI</span>
                  <span className="text-[8px] font-mono font-bold text-[#D4AF37]">SUMBAR</span>
                </div>
              </div>

              {/* Judul Layar: Maks 2 Kata */}
              <h1 className="font-heading font-bold text-[34px] tracking-tight text-white mb-2 text-center">
                {mode === "login" ? "Masuk Akun" : "Daftar Akun"}
              </h1>

              {/* 2 Tombol Besar Bertumpuk */}
              <div className="w-full flex flex-col gap-3.5 mt-8">
                {/* 1. Lanjut dengan Google (Utama) */}
                <button
                  onClick={handleGoogleAuth}
                  disabled={isLoading}
                  className="w-full h-14 rounded-full bg-white text-[#07080C] hover:bg-gray-100 font-heading font-bold text-sm tracking-wide flex items-center justify-center gap-3 transition-all duration-200 active:scale-[0.98] shadow-[0_8px_24px_rgba(255,255,255,0.12)]"
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

                {/* 2. Pakai Email */}
                <button
                  onClick={() => {
                    triggerHaptic();
                    setStep("email");
                  }}
                  className="w-full h-14 rounded-full bg-[#161A24] border border-white/[0.08] hover:bg-[#1E2330] font-heading font-semibold text-sm tracking-wide text-white flex items-center justify-center gap-2.5 transition-all duration-200 active:scale-[0.98]"
                >
                  <Mail className="w-4 h-4 text-white/60" />
                  <span>Pakai Email</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* LANGKAH 1: EMAIL (Satu Field Besar, Validasi Ikon) */}
          {step === "email" && (
            <motion.div
              key="step-email"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              className="w-full flex flex-col"
            >
              <span className="text-xs font-mono text-white/40 uppercase tracking-widest mb-1">
                Langkah 1
              </span>
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
                    ESPORT ID Resmi Non-KTP
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
