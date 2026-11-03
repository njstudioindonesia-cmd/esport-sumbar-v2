"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ShieldCheck,
  Award,
  Layers,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Bell,
  Users,
  Check,
  X,
  Share2,
  FileText,
  Lock,
  PlusCircle,
  Clock,
  ExternalLink,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EsportCard } from "@/components/card/EsportCard";
import { ShareCardModal } from "@/components/card/ShareCardModal";
import { GALLERY_CARDS } from "@/data/mockCards";

export default function DashboardPage() {
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [invitationStatus, setInvitationStatus] = useState<"pending" | "accepted" | "declined">("pending");

  // User's primary active profile (Sutan Aim / Contender)
  const primaryCard = GALLERY_CARDS.find((c) => c.id === "pl-contender") || GALLERY_CARDS[1];

  return (
    <div className="min-h-screen bg-[#0B0D12] text-[#F3F4F6] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* TOP WELCOME & STATUS SUMMARY */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#161922] via-[#12151C] to-[#161922] border border-[#262B38] mb-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-48 bg-[#D4AF37]/10 blur-3xl pointer-events-none" />

          <div className="flex flex-col gap-2 z-10">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#1A1E28] border border-[#262B38] text-[10px] font-mono text-[#D4AF37] font-bold">
                ESPORT ID: {primaryCard.data.esportId}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#22C55E]/15 border border-[#22C55E]/30 text-[10px] font-heading font-bold text-[#22C55E] uppercase">
                Regional Checked (ESI Padang)
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-heading font-black uppercase text-white tracking-tight mt-1">
              Halo, <span className="text-[#D4AF37]">{primaryCard.data.ign}</span>!
            </h1>
            <p className="text-xs sm:text-sm text-[#9AA3B2] max-w-xl leading-relaxed">
              Selamat datang di pusat kendali ESPORT ID Anda. Verifikasi awal daerah Anda telah aktif. Ajukan pengesahan resmi provinsi untuk mengaktifkan lencana emas ESI Sumbar.
            </p>
          </div>

          {/* Quick CTA button to verification */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 z-10 w-full sm:w-auto">
            <Link
              href="/me/verification"
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E5C358] text-black text-xs font-heading font-extrabold uppercase tracking-wider shadow-lg hover:brightness-110 transition-all text-center"
            >
              <Award className="w-4 h-4" />
              <span>Ajukan Verifikasi ESI</span>
            </Link>

            <button
              type="button"
              onClick={() => setShareModalOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#1A1E28] hover:bg-[#262B38] border border-[#262B38] text-gray-200 text-xs font-heading font-bold uppercase tracking-wider transition-colors"
            >
              <Share2 className="w-4 h-4 text-[#D4AF37]" />
              <span>Bagikan Kartu</span>
            </button>
          </div>
        </div>

        {/* DASHBOARD GRID: LEFT (METRICS & ACTIONS) | RIGHT (CARD PREVIEW) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* 1. PROGRESS KELENGKAPAN PROFIL */}
            <div className="p-6 rounded-2xl bg-[#12151C] border border-[#262B38] flex flex-col gap-4 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <h3 className="font-heading font-bold text-sm uppercase text-white">
                    Kelengkapan Profil: <span className="text-[#D4AF37]">85%</span>
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded border border-[#22C55E]/30 font-bold">
                  Tier 2 Contender Aktif
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2.5 bg-[#161922] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#D4AF37] to-[#22C55E] w-[85%] rounded-full" />
              </div>

              {/* Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs pt-1">
                <div className="flex items-center gap-2 text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0" />
                  <span>Foto Profil & IGN (20%)</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0" />
                  <span>Cabang Game & Peran (20%)</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0" />
                  <span>Wilayah Domisili (20%)</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0" />
                  <span>Tergabung dalam Tim Resmi (25%)</span>
                </div>
                <div className="flex items-center gap-2 text-[#9AA3B2] sm:col-span-2 pt-1 border-t border-[#262B38]/60">
                  <span className="w-4 h-4 rounded-full border border-gray-600 flex items-center justify-center text-[10px] text-gray-400 shrink-0">
                    +
                  </span>
                  <span>
                    Unggah bukti prestasi resmi untuk naik ke <strong>Tier 3 (Elite)</strong>.
                  </span>
                </div>
              </div>
            </div>

            {/* 2. UNDANGAN & PERMINTAAN TIM (ROSTER INVITATION) */}
            <div className="p-6 rounded-2xl bg-[#12151C] border border-[#262B38] flex flex-col gap-4 shadow-md">
              <div className="flex items-center justify-between border-b border-[#262B38] pb-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#3B82F6]" />
                  <h3 className="font-heading font-bold text-sm uppercase text-white">
                    Undangan Bergabung Tim Masuk
                  </h3>
                </div>
                <Link
                  href="/me/memberships"
                  className="text-xs font-heading font-bold text-[#D4AF37] hover:underline"
                >
                  Kelola Relasi
                </Link>
              </div>

              {invitationStatus === "pending" ? (
                <div className="p-4 rounded-xl bg-[#161922] border border-[#262B38] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-[#1A1E28] border border-[#262B38] flex items-center justify-center font-heading font-bold text-base text-[#D4AF37] shrink-0">
                      MPR
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-sm text-white">
                        Minang Pride Esports
                      </h4>
                      <p className="text-xs text-[#9AA3B2]">
                        Mengundang Anda sebagai: <strong className="text-gray-200">Roamer / Rusher</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setInvitationStatus("declined")}
                      className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg bg-[#1A1E28] hover:bg-red-950/40 text-gray-400 hover:text-red-400 text-xs font-heading font-bold uppercase transition-colors"
                    >
                      Tolak
                    </button>
                    <button
                      type="button"
                      onClick={() => setInvitationStatus("accepted")}
                      className="flex-1 sm:flex-none px-4 py-1.5 rounded-lg bg-[#22C55E] text-black text-xs font-heading font-extrabold uppercase transition-colors"
                    >
                      Terima Undangan
                    </button>
                  </div>
                </div>
              ) : invitationStatus === "accepted" ? (
                <div className="p-3 rounded-xl bg-[#22C55E]/15 border border-[#22C55E]/40 text-[#22C55E] text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Anda telah menyetujui bergabung dengan Minang Pride Esports! Nama Anda kini tampil di roster publik mereka.</span>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-[#161922] text-gray-400 text-xs">
                  Undangan telah ditolak.
                </div>
              )}
            </div>

            {/* 3. NOTIFIKASI & AKTIVITAS TERBARU */}
            <div className="p-6 rounded-2xl bg-[#12151C] border border-[#262B38] flex flex-col gap-3.5 shadow-md">
              <div className="flex items-center gap-2 border-b border-[#262B38] pb-3">
                <Bell className="w-4 h-4 text-[#D4AF37]" />
                <h3 className="font-heading font-bold text-sm uppercase text-white">
                  Notifikasi Terkini
                </h3>
              </div>

              <div className="flex flex-col gap-2.5">
                <div className="p-3 rounded-xl bg-[#161922] border border-[#262B38]/60 flex items-start gap-3">
                  <ShieldCheck className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <p className="text-xs text-gray-200">
                      <strong>Pengcab ESI Kota Padang</strong> telah memberikan lencana status <em>Regional Checked</em> pada profil atlet Anda.
                    </p>
                    <span className="text-[10px] text-[#9AA3B2] font-mono mt-0.5">
                      Kemarin, 14:20 WIB
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#161922] border border-[#262B38]/60 flex items-start gap-3">
                  <Users className="w-4 h-4 text-[#3B82F6] shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <p className="text-xs text-gray-200">
                      Undangan bergabung dari klub <strong>Minang Pride Esports</strong> telah masuk ke antrean Anda.
                    </p>
                    <span className="text-[10px] text-[#9AA3B2] font-mono mt-0.5">
                      2 hari lalu
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: PRIMARY CARD & QUICK SHORTCUTS */}
          <div className="lg:col-span-5 flex flex-col items-center gap-5">
            <div className="flex flex-col items-center">
              <span className="text-xs font-mono font-bold tracking-widest text-[#D4AF37] uppercase mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Kartu Profil Utama
              </span>

              <EsportCard
                type={primaryCard.type}
                rarity={primaryCard.rarity}
                verification={primaryCard.verification}
                data={primaryCard.data}
                size="md"
                interactive={true}
              />
            </div>

            {/* Quick Links Nav */}
            <div className="w-full max-w-[320px] grid grid-cols-2 gap-2">
              <Link
                href="/me/cards"
                className="p-3 rounded-xl bg-[#12151C] hover:bg-[#1A1E28] border border-[#262B38] text-center flex flex-col items-center gap-1.5 group transition-colors"
              >
                <Layers className="w-4 h-4 text-[#D4AF37] group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-heading font-bold text-white uppercase">
                  Kartu Saya
                </span>
              </Link>

              <Link
                href="/me/verification"
                className="p-3 rounded-xl bg-[#12151C] hover:bg-[#1A1E28] border border-[#262B38] text-center flex flex-col items-center gap-1.5 group transition-colors"
              >
                <Award className="w-4 h-4 text-[#22C55E] group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-heading font-bold text-white uppercase">
                  Verifikasi ESI
                </span>
              </Link>

              <Link
                href="/me/memberships"
                className="p-3 rounded-xl bg-[#12151C] hover:bg-[#1A1E28] border border-[#262B38] text-center flex flex-col items-center gap-1.5 group transition-colors"
              >
                <Users className="w-4 h-4 text-[#3B82F6] group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-heading font-bold text-white uppercase">
                  Relasi Tim
                </span>
              </Link>

              <Link
                href="/me/privacy"
                className="p-3 rounded-xl bg-[#12151C] hover:bg-[#1A1E28] border border-[#262B38] text-center flex flex-col items-center gap-1.5 group transition-colors"
              >
                <Lock className="w-4 h-4 text-[#C084FC] group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-heading font-bold text-white uppercase">
                  Privasi Akun
                </span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* SHARE MODAL */}
      <ShareCardModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        cardData={primaryCard}
      />

      <Footer />
    </div>
  );
}
