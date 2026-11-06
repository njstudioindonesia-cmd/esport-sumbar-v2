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
  ArrowRight,
  Palette,
  Type,
  Component,
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
import {
  BrandLogo,
  BrandSlash,
  BrandWatermark,
  BrandBar,
  OwnershipNote,
  PartnerStrip,
  IssuedBy,
  BrandLoader,
  BrandPattern,
} from "@/components/brand";

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
    <div className="min-h-screen bg-[var(--bg-base)] text-[#FFFFFF] flex flex-col font-sans selection:bg-[#FF1752]/30 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* HEADER */}
        <div className="flex flex-col gap-2 mb-10 border-b border-white/[0.08] pb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#FF1752]/15 border border-[#FF1752]/30 text-xs font-mono font-bold text-[#FF4D77] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Design System & Token Brand
            </span>
            <span className="text-xs text-white/40 font-mono">ESPORT SUMBAR™ V2</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-heading font-black uppercase text-white tracking-tight">
            Katalog Komponen UI & Token Brand
          </h1>
          <p className="text-xs sm:text-sm text-white/60 max-w-3xl leading-relaxed">
            Satu sumber kebenaran untuk identitas visual ESPORT SUMBAR™: token warna, tipografi Saira Condensed + Inter, komponen brand reusable, tombol bersudut miring, dan sistem umpan balik.
          </p>
        </div>

        <div className="flex flex-col gap-12">
          {/* SECTION 0: BRAND TOKENS & PALETTE */}
          <section className="flex flex-col gap-6">
            <div className="flex items-center gap-2 border-b border-white/[0.08] pb-2">
              <Palette className="w-5 h-5 text-[#FF1752]" />
              <h2 className="font-heading font-bold text-xl uppercase text-white tracking-wide">
                0. Token Warna & Palet Brand
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3.5">
              {/* Pink Primary */}
              <div className="p-3.5 rounded-2xl bg-[#0A0A2E] border border-white/10 flex flex-col gap-2">
                <div className="w-full h-14 rounded-xl bg-[#FF1752] pink-glow-sm" />
                <span className="text-xs font-bold text-white">Brand Pink</span>
                <span className="text-[10px] font-mono text-white/50">#FF1752 (Aksen Utama)</span>
              </div>

              {/* Pink 400 */}
              <div className="p-3.5 rounded-2xl bg-[#0A0A2E] border border-white/10 flex flex-col gap-2">
                <div className="w-full h-14 rounded-xl bg-[#FF4D77]" />
                <span className="text-xs font-bold text-white">Pink 400</span>
                <span className="text-[10px] font-mono text-white/50">#FF4D77 (Hover/Subtle)</span>
              </div>

              {/* Pink 600 */}
              <div className="p-3.5 rounded-2xl bg-[#0A0A2E] border border-white/10 flex flex-col gap-2">
                <div className="w-full h-14 rounded-xl bg-[#D90F43]" />
                <span className="text-xs font-bold text-white">Pink 600</span>
                <span className="text-[10px] font-mono text-white/50">#D90F43 (Pressed)</span>
              </div>

              {/* Navy */}
              <div className="p-3.5 rounded-2xl bg-[#0A0A2E] border border-white/10 flex flex-col gap-2">
                <div className="w-full h-14 rounded-xl bg-[#00004F] border border-white/10" />
                <span className="text-xs font-bold text-white">Brand Navy</span>
                <span className="text-[10px] font-mono text-white/50">#00004F (Base Accent)</span>
              </div>

              {/* Base */}
              <div className="p-3.5 rounded-2xl bg-[#0A0A2E] border border-white/10 flex flex-col gap-2">
                <div className="w-full h-14 rounded-xl bg-[#03031A] border border-white/10" />
                <span className="text-xs font-bold text-white">Background Base</span>
                <span className="text-[10px] font-mono text-white/50">#03031A</span>
              </div>

              {/* Surface 1 */}
              <div className="p-3.5 rounded-2xl bg-[#0A0A2E] border border-white/10 flex flex-col gap-2">
                <div className="w-full h-14 rounded-xl bg-[#0A0A2E] border border-white/10" />
                <span className="text-xs font-bold text-white">Surface 1</span>
                <span className="text-[10px] font-mono text-white/50">#0A0A2E</span>
              </div>

              {/* Functional: Regional */}
              <div className="p-3.5 rounded-2xl bg-[#0A0A2E] border border-white/10 flex flex-col gap-2">
                <div className="w-full h-14 rounded-xl bg-[#22C55E]" />
                <span className="text-xs font-bold text-white">Regional Checked</span>
                <span className="text-[10px] font-mono text-white/50">#22C55E (Fungsional)</span>
              </div>

              {/* Functional: Verified Gold */}
              <div className="p-3.5 rounded-2xl bg-[#0A0A2E] border border-white/10 flex flex-col gap-2">
                <div className="w-full h-14 rounded-xl bg-[#D4AF37] gold-glow" />
                <span className="text-xs font-bold text-[#D4AF37]">Verified / Elite</span>
                <span className="text-[10px] font-mono text-white/50">#D4AF37 (HANYA Status)</span>
              </div>

              {/* Functional: Pending */}
              <div className="p-3.5 rounded-2xl bg-[#0A0A2E] border border-white/10 flex flex-col gap-2">
                <div className="w-full h-14 rounded-xl bg-[#F5A524]" />
                <span className="text-xs font-bold text-white">Pending / Review</span>
                <span className="text-[10px] font-mono text-white/50">#F5A524</span>
              </div>

              {/* Functional: Error */}
              <div className="p-3.5 rounded-2xl bg-[#0A0A2E] border border-white/10 flex flex-col gap-2">
                <div className="w-full h-14 rounded-xl bg-[#F04438]" />
                <span className="text-xs font-bold text-white">Error (Galat)</span>
                <span className="text-[10px] font-mono text-white/50">#F04438 (Bukan Pink!)</span>
              </div>
            </div>
          </section>

          {/* SECTION 1: TYPOGRAPHY & BUTTONS */}
          <section className="flex flex-col gap-6">
            <div className="flex items-center gap-2 border-b border-white/[0.08] pb-2">
              <Type className="w-5 h-5 text-[#FF1752]" />
              <h2 className="font-heading font-bold text-xl uppercase text-white tracking-wide">
                1. Tipografi & Tombol Aksi
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Typography */}
              <div className="p-6 rounded-2xl bg-[#0A0A2E] border border-white/10 flex flex-col gap-4">
                <span className="text-xs font-mono uppercase text-[#FF4D77] font-bold">
                  Heading: Saira Condensed (600 - 900)
                </span>
                <div>
                  <h1 className="text-4xl sm:text-5xl font-heading font-black uppercase text-white leading-tight">
                    ARENA ESPORT SUMATERA BARAT
                  </h1>
                  <h2 className="text-2xl sm:text-3xl font-heading font-bold uppercase text-[#FF4D77] display-skew mt-1">
                    Display Heading Skew (-8°)
                  </h2>
                </div>
                <div className="pt-2 border-t border-white/10">
                  <span className="text-xs font-mono uppercase text-white/50 font-bold block mb-1">
                    Body: Inter (300 - 700)
                  </span>
                  <p className="text-xs text-white/70 leading-relaxed">
                    Sistem teks dirancang dengan kontras tinggi WCAG AA. Seluruh body copy menggunakan Inter untuk kemudahan membaca data atlet, nomor lisensi, statistik turnamen, dan tabel leaderboard.
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="p-6 rounded-2xl bg-[#0A0A2E] border border-white/10 flex flex-col gap-4 justify-between">
                <div>
                  <span className="text-xs font-mono uppercase text-[#FF4D77] font-bold block mb-3">
                    Tombol Brand Reusable
                  </span>
                  <div className="flex flex-wrap items-center gap-3">
                    <button className="btn-brand-primary">
                      <span>Buat Paspor Atlet</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button className="btn-brand-secondary">
                      <span>Jelajahi Roster</span>
                    </button>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10">
                  <span className="text-[11px] text-white/50 leading-relaxed">
                    Tombol utama menggunakan dasar pink <strong>#FF1752</strong> dengan potongan sudut miring (clip-path). Emas tidak digunakan pada tombol umum.
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: BRAND REUSABLE COMPONENTS */}
          <section className="flex flex-col gap-6">
            <div className="flex items-center gap-2 border-b border-white/[0.08] pb-2">
              <Component className="w-5 h-5 text-[#FF1752]" />
              <h2 className="font-heading font-bold text-xl uppercase text-white tracking-wide">
                2. Komponen Brand Reusable (Prompt B4)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* BrandLogo */}
              <div className="p-5 rounded-2xl bg-[#0A0A2E] border border-white/10 flex flex-col gap-3">
                <span className="text-xs font-mono uppercase text-white/50 font-bold">
                  &lt;BrandLogo /&gt;
                </span>
                <div className="flex flex-wrap items-center gap-4 py-2">
                  <BrandLogo variant="lockup" size="sm" withLink={false} />
                  <BrandLogo variant="mark" size="sm" withLink={false} />
                  <BrandLogo variant="mark-white" size="sm" withLink={false} />
                </div>
                <span className="text-[10px] text-white/40">
                  Varian: lockup, mark, mark-white, responsive
                </span>
              </div>

              {/* IssuedBy */}
              <div className="p-5 rounded-2xl bg-[#0A0A2E] border border-white/10 flex flex-col gap-3">
                <span className="text-xs font-mono uppercase text-white/50 font-bold">
                  &lt;IssuedBy /&gt;
                </span>
                <div className="flex flex-col gap-2 py-1">
                  <IssuedBy variant="badge" />
                  <IssuedBy variant="inline" />
                  <IssuedBy variant="stamp" />
                </div>
                <span className="text-[10px] text-white/40">
                  Lencana penerbitan paspor/kartu ESPORT SUMBAR™
                </span>
              </div>

              {/* BrandBar */}
              <div className="p-5 rounded-2xl bg-[#0A0A2E] border border-white/10 flex flex-col gap-3">
                <span className="text-xs font-mono uppercase text-white/50 font-bold">
                  &lt;BrandBar /&gt;
                </span>
                <div className="py-4">
                  <BrandBar />
                </div>
                <span className="text-[10px] text-white/40">
                  Garis tipis pink 2px dengan animasi kilau halus untuk navbar & panel
                </span>
              </div>

              {/* OwnershipNote */}
              <div className="p-5 rounded-2xl bg-[#0A0A2E] border border-white/10 flex flex-col gap-3 col-span-1 md:col-span-2">
                <span className="text-xs font-mono uppercase text-white/50 font-bold">
                  &lt;OwnershipNote /&gt;
                </span>
                <div className="flex flex-col gap-3 py-1">
                  <OwnershipNote variant="badge" />
                  <OwnershipNote variant="short" />
                </div>
                <span className="text-[10px] text-white/40">
                  Penegasan peran kepemilikan platform & batas kemitraan verifikasi ESI
                </span>
              </div>

              {/* BrandLoader Preview */}
              <div className="p-5 rounded-2xl bg-[#0A0A2E] border border-white/10 flex flex-col gap-3">
                <span className="text-xs font-mono uppercase text-white/50 font-bold">
                  &lt;BrandLoader /&gt;
                </span>
                <div className="py-2 flex items-center justify-center">
                  <BrandLoader size="sm" text="Memuat modul..." />
                </div>
              </div>
            </div>

            {/* PartnerStrip */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-mono uppercase text-white/50 font-bold">
                &lt;PartnerStrip /&gt; (Horizontal & Cards)
              </span>
              <PartnerStrip variant="horizontal" />
              <div className="mt-2">
                <PartnerStrip variant="cards" />
              </div>
            </div>
          </section>

          {/* SECTION 3: STATUS BADGES & RARITY TAGS */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-white/[0.08] pb-2">
              <h2 className="font-heading font-bold text-lg uppercase text-white tracking-wide">
                3. StatusBadge, RarityTag & PrivacyTag
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* StatusBadge */}
              <div className="p-5 rounded-2xl bg-[#0A0A2E] border border-white/10 flex flex-col gap-3">
                <span className="text-xs font-heading font-bold uppercase text-[#D4AF37]">
                  StatusBadge (Verifikasi ESI)
                </span>
                <p className="text-[11px] text-white/50">
                  Lencana kelembagaan ESI dengan format Warna + Ikon + Teks.
                </p>
                <div className="flex flex-col gap-2 pt-2">
                  <div>
                    <span className="text-[10px] text-white/40 font-mono block mb-1">Unverified:</span>
                    <StatusBadge status="unverified" />
                  </div>
                  <div>
                    <span className="text-[10px] text-white/40 font-mono block mb-1">Regional Checked:</span>
                    <StatusBadge status="regional" />
                  </div>
                  <div>
                    <span className="text-[10px] text-white/40 font-mono block mb-1">Verified (Resmi):</span>
                    <StatusBadge status="verified" />
                  </div>
                </div>
              </div>

              {/* RarityTag */}
              <div className="p-5 rounded-2xl bg-[#0A0A2E] border border-white/10 flex flex-col gap-3">
                <span className="text-xs font-heading font-bold uppercase text-white">
                  RarityTag (Tingkat Kartu TCG)
                </span>
                <p className="text-[11px] text-white/50">
                  Tingkat rarity kartu berdasarkan rekam jejak atlet.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <RarityTag rarity="rookie" />
                  <RarityTag rarity="contender" />
                  <RarityTag rarity="elite" />
                  <RarityTag rarity="pro" />
                  <RarityTag rarity="special" />
                </div>
              </div>

              {/* PrivacyTag */}
              <div className="p-5 rounded-2xl bg-[#0A0A2E] border border-white/10 flex flex-col gap-3">
                <span className="text-xs font-heading font-bold uppercase text-white">
                  PrivacyTag (Indikator Akses)
                </span>
                <p className="text-[11px] text-white/50">
                  Label privasi data atlet sesuai regulasi privasi.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <PrivacyTag isPublic={true} />
                  <PrivacyTag isPublic={false} />
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 4: NOTIFICATIONS & FEEDBACK */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-white/[0.08] pb-2">
              <h2 className="font-heading font-bold text-lg uppercase text-white tracking-wide">
                4. NotificationBanner (Sistem Umpan Balik)
              </h2>
            </div>

            <div className="flex flex-col gap-3">
              <NotificationBanner
                type="info"
                title="Pembaruan Data Tersimpan"
                message="Perubahan profil Anda telah disinkronkan ke server pusat ESPORT SUMBAR™."
              />
              <NotificationBanner
                type="success"
                title="Verifikasi Wilayah Disetujui"
                message="Admin ESI Kota Padang telah mengesahkan data kedaerahan kartu Anda."
              />
              <NotificationBanner
                type="warning"
                title="Dokumen Menunggu Validasi"
                message="Terdapat berkas identitas yang masih dalam antrean peninjauan mitra."
              />
              <NotificationBanner
                type="error"
                title="Format Berkas Tidak Sesuai"
                message="Ukuran foto melebihi batas 2MB. Silakan unggah kembali."
              />
            </div>
          </section>

          {/* SECTION 5: STAT NUMBER (COUNT-UP) */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-white/[0.08] pb-2">
              <h2 className="font-heading font-bold text-lg uppercase text-white tracking-wide">
                5. StatNumber (Angka Tabular Menghitung Naik)
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-2xl bg-[#0A0A2E] border border-white/10">
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
