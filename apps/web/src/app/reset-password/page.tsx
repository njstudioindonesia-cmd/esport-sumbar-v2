"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrandLogo, BrandWatermark } from "@/components/brand";
import { Lock, ArrowRight, CheckCircle2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { GlassSurface } from "@/components/glass/GlassSurface";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassButton } from "@/components/glass/GlassButton";
import { GlassBadge } from "@/components/glass/GlassBadge";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Jika user membuka tautan pemulihan langsung dengan parameter ?code=...
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) {
      const supabase = createClient();
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (error) {
          console.warn("Direct recovery code exchange warning:", error.message);
        }
      });
    }
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim() || password.length < 8) {
      setErrorMessage("Kata sandi baru minimal harus 8 karakter.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: password.trim(),
      });

      if (error) {
        throw new Error(error.message);
      }

      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || "Gagal memperbarui kata sandi. Tautan pemulihan mungkin telah kedaluwarsa.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#07080C] text-white flex flex-col justify-between p-6 select-none selection:bg-[#D4AF37]/30 selection:text-white">
      {/* Background Watermark Mark */}
      <BrandWatermark opacity={0.03} size={640} position="center" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 w-full max-w-5xl mx-auto flex items-center justify-between pt-2">
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
        <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
          Ubah Kata Sandi
        </span>
      </header>

      {/* Main Form Box */}
      <main className="relative z-10 w-full max-w-md mx-auto my-auto">
        <GlassSurface
          variant="elevated"
          elevation="glass"
          radius="3xl"
          className="p-8 sm:p-10 shadow-2xl"
        >
          {isSuccess ? (
            <div className="flex flex-col items-center text-center gap-4 py-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <GlassBadge variant="subtle" size="sm" className="mb-2">
                  Sandi Berhasil Diubah
                </GlassBadge>
                <h1 className="text-xl font-heading font-black text-white uppercase tracking-tight">
                  Kata Sandi Baru Aktif
                </h1>
              </div>
              <p className="text-xs text-white/70 leading-relaxed max-w-sm">
                Kata sandi akun Anda telah diperbarui. Silakan masuk kembali menggunakan kata sandi baru Anda untuk melanjutkan ke paspor digital.
              </p>
              <div className="pt-2">
                <Link href="/login">
                  <GlassButton variant="primary" size="md" className="flex items-center gap-2 font-bold">
                    <span>Masuk ke Akun</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </GlassButton>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleUpdatePassword} className="flex flex-col gap-5">
              <div>
                <GlassBadge variant="subtle" size="sm" className="mb-2 text-[#D4AF37]">
                  Keamanan Akun
                </GlassBadge>
                <h1 className="text-2xl font-heading font-black text-white uppercase tracking-tight">
                  Atur Kata Sandi Baru
                </h1>
                <p className="text-xs text-white/60 mt-1.5 leading-relaxed">
                  Buat kata sandi baru yang kuat untuk melindungi akun dan paspor digital Anda.
                </p>
              </div>

              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-red-200 flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-heading font-bold text-white/80 block">
                  Kata Sandi Baru *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 8 karakter"
                    required
                    className="w-full h-11 bg-white/[0.04] border border-white/10 focus:border-[#D4AF37]/60 focus:ring-1 focus:ring-[#D4AF37]/30 rounded-xl pl-10 pr-10 text-xs text-white outline-none transition-all"
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

              <div className="space-y-1.5">
                <label className="text-xs font-heading font-bold text-white/80 block">
                  Konfirmasi Kata Sandi Baru *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ketik ulang kata sandi baru"
                    required
                    className="w-full h-11 bg-white/[0.04] border border-white/10 focus:border-[#D4AF37]/60 focus:ring-1 focus:ring-[#D4AF37]/30 rounded-xl pl-10 pr-3.5 text-xs text-white outline-none transition-all"
                  />
                </div>
              </div>

              <GlassButton
                type="submit"
                variant="primary"
                size="md"
                disabled={isSubmitting}
                className="w-full mt-1 font-black uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <span>{isSubmitting ? "Menyimpan Sandi..." : "Simpan Kata Sandi"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </GlassButton>
            </form>
          )}
        </GlassSurface>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-[11px] text-white/40 font-mono text-center pb-2">
        ESPORT SUMBAR™ • Sistem Pemulihan Akun Terpadu
      </footer>
    </div>
  );
}
