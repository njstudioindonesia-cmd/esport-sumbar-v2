import React from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getProfileByAccountId } from "@/lib/services/core/profile";
import { DesktopUserShell } from "@/components/dashboard/DesktopUserShell";
import { VerificationBadge } from "@/components/card/VerificationBadge";
import {
  CreditCard,
  Edit3,
  Share2,
  ShieldCheck,
  Bell,
  Settings,
  ExternalLink,
  User,
  Sparkles,
} from "lucide-react";
import type { Metadata } from "next";

export const instant = false;

export const metadata: Metadata = {
  title: "Profil Saya | ESPORT SUMBAR™",
  description: "Pusat profil paspor digital dan keterhubungan ekosistem Anda.",
};

export default async function MyOverviewPage() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData?.user) {
    redirect("/login?redirect=/me");
  }

  const profile = await getProfileByAccountId(authData.user.id);

  if (!profile) {
    redirect("/onboarding");
  }

  return (
    <main className="min-h-screen w-full bg-[#07080C] text-white">
      <DesktopUserShell breadcrumb="Profil Saya">
        <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">
          {/* Header Card */}
          <div className="p-6 md:p-8 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-600 to-rose-400 flex items-center justify-center text-white shadow-xl shadow-pink-600/25">
                  <User className="w-8 h-8" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-white">{profile.displayName}</h1>
                    <VerificationBadge status={profile.verificationStatus as any} size="sm" />
                  </div>
                  <p className="text-sm font-mono text-pink-400 mt-0.5">
                    {profile.ign ? `@${profile.ign}` : profile.slug}
                  </p>
                  <p className="text-xs font-mono text-slate-400 mt-1">
                    {profile.esportId || "ESP-SB-VER-2026-XXXX"} ·{" "}
                    <span className="capitalize">{profile.entityType}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/${profile.entityType}s/${profile.slug}`}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-200 flex items-center gap-1.5 transition-colors"
                >
                  Lihat Profil Publik <ExternalLink className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/me/edit"
                  className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors shadow-lg shadow-pink-600/20"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit Profil
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Hub Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Link
              href="/me/card"
              className="p-5 rounded-2xl bg-slate-900/40 border border-white/10 hover:border-pink-500/30 transition-all hover:-translate-y-0.5 group"
            >
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Kartu Paspor</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tampilkan kartu digital, bagikan QR code, atau unduh paspor digital Anda.
              </p>
            </Link>

            <Link
              href="/me/ecosystem"
              className="p-5 rounded-2xl bg-slate-900/40 border border-white/10 hover:border-pink-500/30 transition-all hover:-translate-y-0.5 group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Share2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Ekosistem Saya</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Kelola keterhubungan dan permohonan kemitraan antar 7 entitas.
              </p>
            </Link>

            <Link
              href="/me/verification"
              className="p-5 rounded-2xl bg-slate-900/40 border border-white/10 hover:border-pink-500/30 transition-all hover:-translate-y-0.5 group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Status Verifikasi</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Lacak proses verifikasi dokumen digital satu tahap platform.
              </p>
            </Link>

            <Link
              href="/me/notifications"
              className="p-5 rounded-2xl bg-slate-900/40 border border-white/10 hover:border-pink-500/30 transition-all hover:-translate-y-0.5 group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Bell className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Notifikasi</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pemberitahuan persetujuan relasi, verifikasi, dan sistem.
              </p>
            </Link>

            <Link
              href="/me/settings"
              className="p-5 rounded-2xl bg-slate-900/40 border border-white/10 hover:border-pink-500/30 transition-all hover:-translate-y-0.5 group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Settings className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Pengaturan</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Preferensi efek visual (Penuh, Standar, Hemat) dan privasi akun.
              </p>
            </Link>
          </div>
        </div>
      </DesktopUserShell>
    </main>
  );
}
