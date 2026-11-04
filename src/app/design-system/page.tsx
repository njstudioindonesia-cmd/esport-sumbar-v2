"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Layers,
  ChevronRight,
  ShieldCheck,
  Award,
  AlertTriangle,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { RarityTag } from "@/components/shared/RarityTag";
import { PrivacyTag } from "@/components/shared/PrivacyTag";
import {
  SkeletonCard,
  SkeletonTableRow,
  SkeletonProfileHeader,
} from "@/components/shared/SkeletonLoader";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { NotificationBanner } from "@/components/shared/NotificationBanner";
import { ConfirmationDialog } from "@/components/shared/ConfirmationDialog";
import { StatNumber } from "@/components/shared/StatNumber";

export default function ComponentCatalogPage() {
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    riskLevel: "danger" | "warning" | "primary";
    title: string;
    message: string;
    requireReason: boolean;
  }>({
    isOpen: false,
    riskLevel: "danger",
    title: "",
    message: "",
    requireReason: false,
  });

  const [demoBannerDismissed, setDemoBannerDismissed] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B0D12] text-[#F3F4F6] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* HEADER */}
        <div className="flex flex-col gap-2 mb-10 border-b border-[#262B38] pb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-xs font-mono font-bold text-[#D4AF37] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Design System & Komponen Bersama
            </span>
            <span className="text-xs text-gray-400 font-mono">Prompt 5.1</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-black uppercase text-white tracking-tight">
            Katalog Komponen UI & Sistem Umpan Balik
          </h1>
          <p className="text-xs sm:text-sm text-[#9AA3B2] max-w-3xl leading-relaxed">
            Koleksi lengkap komponen state, badges, sistem umpan balik, empty state, error state, dan skeleton loader yang digunakan secara konsisten di seluruh penjuru aplikasi ESPORT SUMBAR V2.
          </p>
        </div>

        <div className="flex flex-col gap-12">
          {/* SECTION 1: BADGES & TAGS */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-[#262B38] pb-2">
              <h2 className="font-heading font-bold text-lg uppercase text-white tracking-wide">
                1. StatusBadge, RarityTag & PrivacyTag
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* StatusBadge */}
              <div className="p-5 rounded-2xl bg-[#12151C] border border-[#262B38] flex flex-col gap-3">
                <span className="text-xs font-heading font-bold uppercase text-[#D4AF37]">
                  StatusBadge (Verifikasi ESI)
                </span>
                <p className="text-[11px] text-[#9AA3B2]">
                  Lencana kelembagaan ESI dengan format Warna + Ikon + Teks.
                </p>
                <div className="flex flex-col gap-2 pt-2">
                  <div>
                    <span className="text-[10px] text-gray-500 font-mono block mb-1">Unverified:</span>
                    <StatusBadge status="unverified" />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 font-mono block mb-1">Regional Checked:</span>
                    <StatusBadge status="regional" />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 font-mono block mb-1">Verified (Resmi):</span>
                    <StatusBadge status="verified" />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 font-mono block mb-1">Suspended:</span>
                    <StatusBadge status="suspended" />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 font-mono block mb-1">Re-verify:</span>
                    <StatusBadge status="reverify" />
                  </div>
                </div>
              </div>

              {/* RarityTag */}
              <div className="p-5 rounded-2xl bg-[#12151C] border border-[#262B38] flex flex-col gap-3">
                <span className="text-xs font-heading font-bold uppercase text-[#D4AF37]">
                  RarityTag (Tier Prestasi)
                </span>
                <p className="text-[11px] text-[#9AA3B2]">
                  Murni visual pencapaian kompetisi (terpisah mutlak dari status verifikasi).
                </p>
                <div className="flex flex-col gap-2 pt-2">
                  <div>
                    <span className="text-[10px] text-gray-500 font-mono block mb-1">Tier 1:</span>
                    <RarityTag rarity="rookie" />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 font-mono block mb-1">Tier 2:</span>
                    <RarityTag rarity="contender" />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 font-mono block mb-1">Tier 3:</span>
                    <RarityTag rarity="elite" />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 font-mono block mb-1">Tier 4:</span>
                    <RarityTag rarity="legend" />
                  </div>
                </div>
              </div>

              {/* PrivacyTag */}
              <div className="p-5 rounded-2xl bg-[#12151C] border border-[#262B38] flex flex-col gap-3">
                <span className="text-xs font-heading font-bold uppercase text-[#D4AF37]">
                  PrivacyTag (Kepatuhan UU PDP)
                </span>
                <p className="text-[11px] text-[#9AA3B2]">
                  Menunjukkan tingkat visibilitas field profil subjek data.
                </p>
                <div className="flex flex-col gap-3 pt-2">
                  <div>
                    <span className="text-[10px] text-gray-500 font-mono block mb-1">Akses Publik:</span>
                    <PrivacyTag isPublic={true} size="md" />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 font-mono block mb-1">Akses Terbatas:</span>
                    <PrivacyTag isPublic={false} size="md" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: NOTIFICATION BANNERS */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-[#262B38] pb-2">
              <h2 className="font-heading font-bold text-lg uppercase text-white tracking-wide">
                2. Notification Banners & Toasts
              </h2>
            </div>

            <div className="flex flex-col gap-3">
              <NotificationBanner
                type="success"
                title="Verifikasi Resmi Berhasil"
                message="Pengprov ESI Sumbar telah mengesahkan lencana emas profil atlet Anda dengan masa aktif 12 bulan."
                onDismiss={() => {}}
              />

              <NotificationBanner
                type="info"
                title="Pemberitahuan Sistem"
                message="Pusat data terintegrasi dengan 19 Pengurus Cabang ESI Kota dan Kabupaten se-Sumatera Barat."
                onDismiss={() => {}}
              />

              <NotificationBanner
                type="warning"
                title="Perhatian Masa Berlaku"
                message="Lencana verifikasi resmi Anda akan kedaluwarsa dalam 30 hari. Mohon perbarui bukti status kompetisi."
                onDismiss={() => {}}
              />

              <NotificationBanner
                type="error"
                title="Tindakan Diperlukan"
                message="Berkas pengajuan membutuhkan revisi: tangkapan layar akun game terpotong pada nomor ID akun."
                onDismiss={() => {}}
              />
            </div>
          </section>

          {/* SECTION 3: CONFIRMATION DIALOGS TRIGGER */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-[#262B38] pb-2">
              <h2 className="font-heading font-bold text-lg uppercase text-white tracking-wide">
                3. Standard Confirmation Dialogs
              </h2>
            </div>

            <div className="p-6 rounded-2xl bg-[#12151C] border border-[#262B38] flex flex-col gap-4">
              <p className="text-xs text-[#9AA3B2]">
                Uji coba membuka dialog konfirmasi standar dengan berbagai tingkat risiko (Danger, Warning, Primary) dan input alasan audit wajib:
              </p>

              <div className="flex items-center gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={() =>
                    setDialogState({
                      isOpen: true,
                      riskLevel: "danger",
                      title: "Tangguhkan Status Atlet",
                      message: "Tindakan ini akan mencabut lencana verifikasi dan menangguhkan izin kompetisi resmi PBESI.",
                      requireReason: true,
                    })
                  }
                  className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-heading font-bold uppercase transition-colors"
                >
                  Uji Risiko Danger (Merah + Alasan)
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setDialogState({
                      isOpen: true,
                      riskLevel: "warning",
                      title: "Keluarkan Anggota dari Tim",
                      message: "Pemain akan dilepaskan dari roster aktif dan riwayat keanggotaan akan diarsipkan.",
                      requireReason: false,
                    })
                  }
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black text-xs font-heading font-bold uppercase transition-colors"
                >
                  Uji Risiko Warning (Amber)
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setDialogState({
                      isOpen: true,
                      riskLevel: "primary",
                      title: "Sahkan Verifikasi Emas",
                      message: "Menerbitkan nomor lencana resmi PBESI Sumbar dan mengesahkan profil atlet di ruang publik.",
                      requireReason: false,
                    })
                  }
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E5C358] text-black text-xs font-heading font-extrabold uppercase transition-colors"
                >
                  Uji Risiko Primary (Emas)
                </button>
              </div>
            </div>
          </section>

          {/* SECTION 4: SKELETON LOADERS */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-[#262B38] pb-2">
              <h2 className="font-heading font-bold text-lg uppercase text-white tracking-wide">
                4. Skeleton Loaders (State Memuat)
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Card Skeleton */}
              <div className="lg:col-span-4 flex flex-col items-center gap-2">
                <span className="text-xs font-mono text-[#D4AF37] uppercase font-bold">
                  Skeleton Kartu TCG (5:7)
                </span>
                <SkeletonCard />
              </div>

              {/* Table Rows Skeleton */}
              <div className="lg:col-span-8 flex flex-col gap-2">
                <span className="text-xs font-mono text-[#D4AF37] uppercase font-bold">
                  Skeleton Baris Tabel Admin
                </span>
                <div className="bg-[#12151C] border border-[#262B38] rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-[#161922] border-b border-[#262B38] text-gray-400 font-heading font-bold uppercase">
                        <th className="p-4">Identitas</th>
                        <th className="p-4">Game</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Tanggal</th>
                        <th className="p-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      <SkeletonTableRow count={3} />
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Profile Header Skeleton */}
            <div className="flex flex-col gap-2 mt-4">
              <span className="text-xs font-mono text-[#D4AF37] uppercase font-bold">
                Skeleton Halaman Profil
              </span>
              <SkeletonProfileHeader />
            </div>
          </section>

          {/* SECTION 5: EMPTY STATES */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-[#262B38] pb-2">
              <h2 className="font-heading font-bold text-lg uppercase text-white tracking-wide">
                5. Empty States (Keadaan Kosong)
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <EmptyState
                variant="directory"
                actionText="Reset Pencarian"
                onActionClick={() => alert("Reset clicked!")}
              />

              <EmptyState
                variant="queue"
                actionText="Segarkan Antrean"
                onActionClick={() => alert("Refresh queue clicked!")}
              />

              <EmptyState
                variant="roster"
                actionText="Buka Perekrutan"
                actionHref="/me/memberships"
              />

              <EmptyState
                variant="notifications"
                actionText="Jelajah Agenda"
                actionHref="/news"
              />
            </div>
          </section>

          {/* SECTION 6: ERROR STATES */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-[#262B38] pb-2">
              <h2 className="font-heading font-bold text-lg uppercase text-white tracking-wide">
                6. Error States (Keadaan Galat)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ErrorState
                variant="network"
                onRetry={() => alert("Retrying network call...")}
              />

              <ErrorState
                variant="forbidden"
                title="Yurisdiksi Dibatasi"
                description="Anda tidak memiliki izin Multi-Wilayah RLS untuk mengakses data Pengcab wilayah lain."
              />

              <ErrorState
                variant="notFound"
                title="Profil Tidak Ada"
                description="Atlet atau tim yang Anda cari belum memiliki kartu TCG atau tidak aktif."
              />
            </div>
          </section>

          {/* SECTION 7: STAT NUMBER (COUNT-UP) */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-white/[0.08] pb-2">
              <h2 className="font-heading font-bold text-lg uppercase text-white tracking-wide">
                7. StatNumber (Angka Tabular Menghitung Naik)
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-2xl bg-[#0F1118] border border-white/[0.08]">
              <StatNumber value={1420} label="Pemain" />
              <StatNumber value={185} label="Tim" />
              <StatNumber value={48} label="Pelatih" />
              <StatNumber value={19} label="Wilayah" />
            </div>
          </section>
        </div>
      </main>

      {/* REUSABLE CONFIRMATION DIALOG DEMO */}
      <ConfirmationDialog
        isOpen={dialogState.isOpen}
        onClose={() => setDialogState({ ...dialogState, isOpen: false })}
        onConfirm={(reason) => {
          alert(`Tindakan dikonfirmasi! Alasan: ${reason || "Tidak ada alasan tambahan."}`);
          setDialogState({ ...dialogState, isOpen: false });
        }}
        title={dialogState.title}
        consequenceMessage={dialogState.message}
        riskLevel={dialogState.riskLevel}
        requireReason={dialogState.requireReason}
      />

      <Footer />
    </div>
  );
}
