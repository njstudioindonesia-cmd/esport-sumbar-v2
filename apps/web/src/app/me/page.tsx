import React from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getProfileByAccountId } from "@/lib/services/core/profile";
import { UserShell } from "@/components/dashboard/DesktopUserShell";
import { GlassSurface } from "@/components/glass/GlassSurface";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassButton } from "@/components/glass/GlassButton";
import { GlassBadge } from "@/components/glass/GlassBadge";
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
  Lock,
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
      <UserShell breadcrumb="Profil Saya">
        <div className="max-w-5xl mx-auto py-4 space-y-6">
          {/* Header Card dengan Panggung Kaca */}
          <GlassSurface
            variant="elevated"
            elevation="glass"
            radius="3xl"
            className="p-6 md:p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#AA7C11] to-[#D4AF37] flex items-center justify-center text-black shadow-xl shadow-[#D4AF37]/20 font-black text-xl">
                  {profile.displayName?.charAt(0).toUpperCase() || "A"}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-heading font-black text-white">{profile.displayName}</h1>
                    <VerificationBadge status={profile.verificationStatus as any} size="sm" />
                  </div>
                  <p className="text-sm font-mono text-[#D4AF37] mt-0.5">
                    {profile.ign ? `@${profile.ign}` : profile.slug}
                  </p>
                  <p className="text-xs font-mono text-white/50 mt-1">
                    {profile.esportId || "ESP-SB-VER-2026-XXXX"} ·{" "}
                    <span className="capitalize">{profile.entityType}</span>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <Link
                  href={`/${profile.entityType}/${profile.slug}`}
                  target="_blank"
                >
                  <GlassButton variant="secondary" size="sm" className="flex items-center gap-1.5 font-bold">
                    <span>Lihat Publik</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </GlassButton>
                </Link>
                <Link href="/me/edit">
                  <GlassButton variant="primary" size="sm" className="flex items-center gap-1.5 font-bold">
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Profil</span>
                  </GlassButton>
                </Link>
              </div>
            </div>
          </GlassSurface>

          {/* Quick Hub Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Link href="/me/card">
              <GlassCard
                variant="thick"
                elevation="raised"
                radius="2xl"
                className="p-5 h-full flex flex-col justify-between hover:border-[#D4AF37]/40 transition-all hover:-translate-y-0.5 group"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-heading font-black text-white uppercase mb-1">
                    Kartu Paspor Digital
                  </h3>
                  <p className="text-xs text-white/50 leading-relaxed">
                    Tampilkan kartu identitas 3D, bagikan kode QR, atau unduh paspor digital dalam format Story &amp; Feed.
                  </p>
                </div>
              </GlassCard>
            </Link>

            <Link href="/me/ecosystem">
              <GlassCard
                variant="thick"
                elevation="raised"
                radius="2xl"
                className="p-5 h-full flex flex-col justify-between hover:border-cyan-500/40 transition-all hover:-translate-y-0.5 group"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-heading font-black text-white uppercase mb-1">
                    Ekosistem Saya
                  </h3>
                  <p className="text-xs text-white/50 leading-relaxed">
                    Kelola keterhubungan kemitraan antar 7 entitas (atlet, tim, pelatih, komunitas, sekolah, kampus, venue).
                  </p>
                </div>
              </GlassCard>
            </Link>

            <Link href="/me/verification">
              <GlassCard
                variant="thick"
                elevation="raised"
                radius="2xl"
                className="p-5 h-full flex flex-col justify-between hover:border-emerald-500/40 transition-all hover:-translate-y-0.5 group"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-heading font-black text-white uppercase mb-1">
                    Status Verifikasi
                  </h3>
                  <p className="text-xs text-white/50 leading-relaxed">
                    Lacak proses kurasi bukti mandiri satu pintu untuk penerbitan lencana terverifikasi platform.
                  </p>
                </div>
              </GlassCard>
            </Link>

            <Link href="/me/notifications">
              <GlassCard
                variant="thick"
                elevation="raised"
                radius="2xl"
                className="p-5 h-full flex flex-col justify-between hover:border-purple-500/40 transition-all hover:-translate-y-0.5 group"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Bell className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-heading font-black text-white uppercase mb-1">
                    Pusat Notifikasi
                  </h3>
                  <p className="text-xs text-white/50 leading-relaxed">
                    Pemberitahuan persetujuan relasi, warta verifikasi, dan pembaruan sistem.
                  </p>
                </div>
              </GlassCard>
            </Link>

            <Link href="/me/privacy">
              <GlassCard
                variant="thick"
                elevation="raised"
                radius="2xl"
                className="p-5 h-full flex flex-col justify-between hover:border-blue-500/40 transition-all hover:-translate-y-0.5 group"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-heading font-black text-white uppercase mb-1">
                    Privasi Data &amp; PDP
                  </h3>
                  <p className="text-xs text-white/50 leading-relaxed">
                    Kontrol sakelar visibilitas data pribadi, hak unduh data profil, dan hapus akun.
                  </p>
                </div>
              </GlassCard>
            </Link>

            <Link href="/me/settings">
              <GlassCard
                variant="thick"
                elevation="raised"
                radius="2xl"
                className="p-5 h-full flex flex-col justify-between hover:border-[#D4AF37]/40 transition-all hover:-translate-y-0.5 group"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Settings className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-heading font-black text-white uppercase mb-1">
                    Pengaturan
                  </h3>
                  <p className="text-xs text-white/50 leading-relaxed">
                    Pilih tingkat kualitas grafis (Penuh / Standar / Hemat) dan kelola kata sandi akun.
                  </p>
                </div>
              </GlassCard>
            </Link>
          </div>
        </div>
      </UserShell>
    </main>
  );
}
