"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BrandLogo, BrandWatermark } from "@/components/brand";
import { Mail, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage("Silakan masukkan alamat email akun Anda.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const supabase = createClient();
      const origin = typeof window !== "undefined" ? window.location.origin : "https://esport-sumbar.com";
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${origin}/reset-password`,
      });

      if (error) {
        // Demi privasi, jangan bocorkan apakah email terdaftar atau tidak
        console.warn("Reset password warning:", error.message);
      }

      setIsSuccess(true);
    } catch {
      setIsSuccess(true); // Always show generic instruction screen for privacy
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#07080C] text-white flex flex-col justify-between p-6 select-none selection:bg-[#FF1752]/30 selection:text-white">
      {/* Background Watermark Mark */}
      <BrandWatermark opacity={0.04} size={640} position="center" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FF1752]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 w-full max-w-5xl mx-auto flex items-center justify-between pt-2">
        <BrandLogo variant="lockup" size="sm" withLink={true} />
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Masuk</span>
        </Link>
      </header>

      {/* Main Form Box */}
      <main className="relative z-10 w-full max-w-md mx-auto my-auto">
        <div className="p-8 rounded-3xl bg-[#0F1118]/90 border border-white/[0.08] backdrop-blur-xl shadow-2xl">
          {isSuccess ? (
            <div className="flex flex-col items-center text-center gap-4 py-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h1 className="text-xl font-heading font-black text-white uppercase">
                Periksa Inbox Email Anda
              </h1>
              <p className="text-xs text-white/70 leading-relaxed max-w-sm">
                Jika alamat <span className="text-[#D4AF37] font-mono font-semibold">{email}</span> terdaftar di ESPORT SUMBAR, kami telah mengirimkan tautan pemulihan kata sandi. Tautan berlaku selama 60 menit.
              </p>
              <div className="pt-2">
                <Link
                  href="/login"
                  className="px-6 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/10 text-xs font-mono text-white transition-all flex items-center gap-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Kembali ke Halaman Masuk</span>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleResetRequest} className="flex flex-col gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF1752] block mb-1">
                  Keamanan Akun
                </span>
                <h1 className="text-2xl font-heading font-black text-white uppercase tracking-tight">
                  Pemulihan Kata Sandi
                </h1>
                <p className="text-xs text-white/60 mt-1 leading-relaxed">
                  Masukkan email yang terdaftar untuk menerima tautan pembuatan kata sandi baru.
                </p>
              </div>

              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <label className="text-xs font-mono text-white/70 block mb-1.5">Alamat Email *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    autoFocus
                    className="w-full h-11 bg-[#161A24] border border-white/[0.08] focus:border-[#FF1752] rounded-xl pl-10 pr-3.5 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-[#FF1752] hover:bg-[#E01447] text-white font-heading font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#FF1752]/20 disabled:opacity-50 transition-all mt-2"
              >
                <span>{isSubmitting ? "Mengirimkan Tautan..." : "Kirim Tautan Pemulihan"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-[11px] text-white/40 font-mono text-center pb-2">
        ESPORT SUMBAR™ • Sistem Pemulihan Akun Terpadu
      </footer>
    </div>
  );
}
