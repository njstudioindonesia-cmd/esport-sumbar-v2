"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  UserPlus,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  Shield,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: "Kosong", color: "bg-gray-700" };
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 1) return { score: 1, label: "Lemah", color: "bg-[#EF4444]" };
    if (score <= 3) return { score: 2, label: "Sedang", color: "bg-[#F59E0B]" };
    return { score: 3, label: "Sangat Kuat", color: "bg-[#22C55E]" };
  }, [password]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg("Mohon lengkapi alamat email dan kata sandi.");
      return;
    }
    if (password.length < 8) {
      setErrorMsg("Kata sandi minimal harus terdiri dari 8 karakter.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Konfirmasi kata sandi tidak cocok.");
      return;
    }
    if (!agreedTerms) {
      setErrorMsg("Anda wajib menyetujui Syarat Layanan & Kebijakan Privasi.");
      return;
    }

    setIsLoading(true);
    // Simulated registration -> redirects to Onboarding Wizard
    setTimeout(() => {
      setIsLoading(false);
      router.push("/me/profile/new");
    }, 700);
  };

  const handleGoogleRegister = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/me/profile/new");
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#0B0D12] text-[#F3F4F6] flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md p-6 sm:p-8 rounded-2xl bg-[#12151C] border border-[#262B38] shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4AF37]/5 blur-2xl pointer-events-none" />

          {/* Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="flex h-3 w-8 rounded-sm overflow-hidden mb-3">
              <span className="w-1/3 bg-[#C8102E]" />
              <span className="w-1/3 bg-[#D4AF37]" />
              <span className="w-1/3 bg-black" />
            </div>
            <h1 className="text-2xl font-heading font-black uppercase text-white tracking-tight">
              Daftar Akun Baru
            </h1>
            <p className="text-xs text-[#9AA3B2] mt-1">
              Mulai langkahmu menjadi bagian dari ekosistem resmi esport Sumatera Barat.
            </p>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/40 text-[#EF4444] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Google Button */}
          <button
            type="button"
            onClick={handleGoogleRegister}
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-[#1A1E28] hover:bg-[#262B38] border border-[#262B38] text-xs font-heading font-bold uppercase tracking-wider text-white flex items-center justify-center gap-2.5 transition-colors mb-4"
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
            <span>Daftar dengan Akun Google</span>
          </button>

          <div className="flex items-center gap-3 my-4">
            <span className="h-[1px] flex-1 bg-[#262B38]" />
            <span className="text-[10px] uppercase font-mono text-[#9AA3B2]">
              Atau Registrasi Email
            </span>
            <span className="h-[1px] flex-1 bg-[#262B38]" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-heading font-semibold text-gray-300 uppercase">
                Alamat Email Aktif
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full bg-[#1A1E28] border border-[#262B38] focus:border-[#D4AF37] rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-heading font-semibold text-gray-300 uppercase">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  className="w-full bg-[#1A1E28] border border-[#262B38] focus:border-[#D4AF37] rounded-xl pl-9 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength meter */}
              {password && (
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1.5 bg-[#161922] rounded-full overflow-hidden flex gap-1">
                    <span
                      className={`h-full flex-1 ${
                        passwordStrength.score >= 1 ? passwordStrength.color : "bg-gray-700"
                      }`}
                    />
                    <span
                      className={`h-full flex-1 ${
                        passwordStrength.score >= 2 ? passwordStrength.color : "bg-gray-700"
                      }`}
                    />
                    <span
                      className={`h-full flex-1 ${
                        passwordStrength.score >= 3 ? passwordStrength.color : "bg-gray-700"
                      }`}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-gray-400">
                    {passwordStrength.label}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-heading font-semibold text-gray-300 uppercase">
                Ulangi Kata Sandi
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi kata sandi"
                  className="w-full bg-[#1A1E28] border border-[#262B38] focus:border-[#D4AF37] rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Checkbox Terms & Privacy */}
            <label className="flex items-start gap-2.5 cursor-pointer mt-1 text-xs text-[#9AA3B2]">
              <input
                type="checkbox"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="mt-0.5 rounded border-[#262B38] text-[#D4AF37] focus:ring-0"
              />
              <span className="leading-tight">
                Saya menyetujui{" "}
                <Link href="/terms" className="text-[#D4AF37] hover:underline" target="_blank">
                  Syarat Layanan
                </Link>{" "}
                dan memahami{" "}
                <Link href="/privacy" className="text-[#D4AF37] hover:underline" target="_blank">
                  Kebijakan Privasi Data (UU PDP)
                </Link>
                .
              </span>
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E6CA65] hover:brightness-110 text-black text-xs font-heading font-extrabold uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <span>{isLoading ? "Mendaftarkan Akun..." : "Lanjut ke Pembuatan Profil"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-6 pt-4 border-t border-[#262B38] text-center text-xs text-[#9AA3B2]">
            Sudah memiliki akun terdaftar?{" "}
            <Link href="/login" className="text-[#D4AF37] font-bold hover:underline">
              Masuk di sini
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
