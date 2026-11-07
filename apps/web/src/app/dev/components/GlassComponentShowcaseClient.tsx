"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowLeft,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Send,
  Trash2,
  Settings,
  Bell,
  Search,
  ExternalLink,
  Info,
  ShieldCheck,
  Eye,
} from "lucide-react";
import {
  GlassButton,
  GlassCard,
  GlassCardHeader,
  GlassCardTitle,
  GlassCardDescription,
  GlassCardContent,
  GlassCardFooter,
  GlassBadge,
  GlassStatusBadge,
  GlassRarityBadge,
  GlassInput,
  GlassSelect,
  GlassTextarea,
  GlassSwitch,
  GlassSegmented,
  GlassTooltip,
  GlassSkeleton,
  GlassSkeletonCard,
  GlassDialog,
  GlassSheet,
  GlassToast,
  type ToastMessage,
  useQualityMode,
  type QualityMode,
} from "@/components/glass";

export function GlassComponentShowcaseClient() {
  const { quality, setQualityMode, fps } = useQualityMode();

  // State demos
  const [segmentedVal, setSegmentedVal] = useState<string>("pemain");
  const [switchChecked, setSwitchChecked] = useState<boolean>(true);
  const [inputValue, setInputValue] = useState<string>("Fajar Ramadhan");
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [sheetOpen, setSheetOpen] = useState<boolean>(false);

  // Toast demos
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: "success" | "error" | "warning" | "info") => {
    const id = "toast-" + Date.now();
    const newToast: ToastMessage = {
      id,
      type,
      title:
        type === "success"
          ? "Data Berhasil Disimpan"
          : type === "error"
          ? "Gagal Memproses Permintaan"
          : type === "warning"
          ? "Perhatian: Masa Berlaku Hampir Habis"
          : "Informasi Pembaruan Sistem",
      message: "Aksi berhasil dieksekusi melalui antarmuka Liquid Glass V3.",
    };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#03031A] text-slate-100 flex flex-col font-sans relative selection:bg-pink-500/30 selection:text-white pb-24">
      {/* Header bar */}
      <header className="sticky top-0 z-40 px-6 py-4 bg-slate-950/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-500" />
              Katalog Komponen Liquid Glass V3
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              /dev/components · Pratinjau Komponen, Varian, dan State Aksesibilitas
            </p>
          </div>
        </div>

        {/* Mode selector */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-emerald-400 font-semibold hidden sm:inline">
            {fps} FPS
          </span>
          <GlassSegmented<QualityMode>
            size="sm"
            value={quality}
            onChange={(val) => setQualityMode(val, true)}
            options={[
              { value: "full", label: "Penuh" },
              { value: "standard", label: "Standar" },
              { value: "eco", label: "Hemat" },
            ]}
          />
        </div>
      </header>

      {/* Main container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 space-y-12">
        {/* ========================================================= */}
        {/* 1. GLASS BUTTONS                                          */}
        {/* ========================================================= */}
        <section className="space-y-4">
          <div className="border-b border-white/10 pb-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-pink-500" /> 1. GlassButton
            </h2>
            <p className="text-xs text-slate-400">
              Varian utama, sekunder, ghost, danger, tinted; variasi ukuran; state normal, memuat, dan nonaktif.
            </p>
          </div>

          <GlassCard material="thin" className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-xs font-mono uppercase text-slate-400 font-semibold tracking-wider">
                Varian Warna & Gaya
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <GlassButton variant="primary">Primary Pink</GlassButton>
                <GlassButton variant="secondary">Secondary Glass</GlassButton>
                <GlassButton variant="ghost">Ghost Button</GlassButton>
                <GlassButton variant="danger">Danger Crimson</GlassButton>
                <GlassButton variant="tinted">Tinted Pink</GlassButton>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-mono uppercase text-slate-400 font-semibold tracking-wider">
                Ukuran & Ikon
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <GlassButton size="sm" leftIcon={<Sparkles className="w-3.5 h-3.5" />}>
                  Kecil (36px)
                </GlassButton>
                <GlassButton size="md" leftIcon={<Send className="w-4 h-4" />}>
                  Standar (44px)
                </GlassButton>
                <GlassButton size="lg" rightIcon={<ExternalLink className="w-4 h-4" />}>
                  Besar (52px)
                </GlassButton>
                <GlassButton size="icon" aria-label="Notifikasi">
                  <Bell className="w-4 h-4" />
                </GlassButton>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-mono uppercase text-slate-400 font-semibold tracking-wider">
                State Khusus (Memuat & Nonaktif)
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <GlassButton variant="primary" isLoading>
                  Menyimpan
                </GlassButton>
                <GlassButton variant="secondary" disabled>
                  Nonaktif
                </GlassButton>
              </div>
            </div>
          </GlassCard>
        </section>

        {/* ========================================================= */}
        {/* 2. GLASS BADGES & D17 COMPLIANCE                           */}
        {/* ========================================================= */}
        <section className="space-y-4">
          <div className="border-b border-white/10 pb-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" /> 2. GlassBadge & Kepatuhan D17
            </h2>
            <p className="text-xs text-slate-400">
              Pemisahan tegas antara Lencana Verifikasi V3 (Perisai + Centang emas) dan Frame Rarity Elite (Sparkles emas) sesuai Mandat D17.
            </p>
          </div>

          <GlassCard material="thin" className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-xs font-mono uppercase text-slate-400 font-semibold tracking-wider">
                Status Verifikasi Tunggal V3
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <GlassStatusBadge status="verified" />
                <GlassStatusBadge status="pending" />
                <GlassStatusBadge status="rejected" />
                <GlassStatusBadge status="unregistered" />
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-mono uppercase text-slate-400 font-semibold tracking-wider">
                Tingkat Rarity Kartu
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <GlassRarityBadge rarity="rookie" />
                <GlassRarityBadge rarity="rising" />
                <GlassRarityBadge rarity="contender" />
                <GlassRarityBadge rarity="elite" />
                <GlassRarityBadge rarity="master" />
                <GlassRarityBadge rarity="legendary" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-start gap-3">
              <Info className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-200 leading-relaxed">
                <span className="font-bold">Penegakan Keputusan D17:</span> Meskipun lencana Terverifikasi dan kartu Elite sama-sama bernuansa emas, lencana Terverifikasi selalu menampilkan ikon perisai bercentang (<ShieldCheck className="w-3.5 h-3.5 inline mx-0.5" />) di pojok identitas kartu, sedangkan tingkat Elite adalah properti frame kartu dengan ikon bintang (<Sparkles className="w-3.5 h-3.5 inline mx-0.5" />).
              </div>
            </div>
          </GlassCard>
        </section>

        {/* ========================================================= */}
        {/* 3. GLASS FORM CONTROLS                                    */}
        {/* ========================================================= */}
        <section className="space-y-4">
          <div className="border-b border-white/10 pb-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-pink-500" /> 3. GlassInput, GlassSelect & GlassTextarea
            </h2>
            <p className="text-xs text-slate-400">
              Formulir dengan touch target minimal 44px, state fokus terlihat, penanganan pesan error ARIA.
            </p>
          </div>

          <GlassCard material="thin" className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <GlassInput
                label="Nama Lengkap"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
                helperText="Nama profil yang tampil di kartu ekosistem."
              />

              <GlassInput
                label="Contoh Input Error"
                defaultValue="invalid_email"
                error="Format email tidak valid. Gunakan format nama@domain.com."
              />

              <GlassSelect
                label="Pilihan Bidang Ekosistem"
                options={[
                  { value: "player", label: "Atlet / Pemain" },
                  { value: "coach", label: "Pelatih" },
                  { value: "team", label: "Tim Esports" },
                  { value: "community", label: "Komunitas" },
                  { value: "venue", label: "Arena / Venue" },
                  { value: "campus", label: "Kampus" },
                  { value: "school", label: "Sekolah" },
                ]}
              />
            </div>

            <div className="space-y-4">
              <GlassTextarea
                label="Bio Singkat Profil"
                placeholder="Tuliskan pengalaman atau peran dalam skena esports..."
                helperText="Maksimal 250 karakter."
              />

              <div className="pt-2">
                <GlassSwitch
                  label="Aktifkan Refleksi Spekular Kaca"
                  checked={switchChecked}
                  onCheckedChange={setSwitchChecked}
                />
              </div>

              <div className="pt-2 space-y-2">
                <label className="block text-xs font-semibold text-slate-300">
                  GlassSegmented (Navigasi Segmen)
                </label>
                <GlassSegmented
                  value={segmentedVal}
                  onChange={setSegmentedVal}
                  options={[
                    { value: "pemain", label: "Pemain" },
                    { value: "tim", label: "Tim" },
                    { value: "turnamen", label: "Turnamen" },
                  ]}
                />
              </div>
            </div>
          </GlassCard>
        </section>

        {/* ========================================================= */}
        {/* 4. GLASS OVERLAYS & FEEDBACK                              */}
        {/* ========================================================= */}
        <section className="space-y-4">
          <div className="border-b border-white/10 pb-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-pink-500" /> 4. GlassDialog, GlassSheet, Tooltip & Toast
            </h2>
            <p className="text-xs text-slate-400">
              Lapisan overlay dengan animasi pegas fisik, jebakan fokus keyboard, dan penutupan dengan tombol Escape.
            </p>
          </div>

          <GlassCard material="thin" className="space-y-6">
            <div className="flex flex-wrap items-center gap-4">
              <GlassButton variant="primary" onClick={() => setDialogOpen(true)}>
                Buka GlassDialog
              </GlassButton>

              <GlassButton variant="secondary" onClick={() => setSheetOpen(true)}>
                Buka GlassSheet (Drawer)
              </GlassButton>

              <GlassTooltip content="Ini adalah tooltip mikro kaca">
                <GlassButton variant="ghost">Arahkan Kursor ke Sini</GlassButton>
              </GlassTooltip>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-mono uppercase text-slate-400 font-semibold tracking-wider">
                Uji Notifikasi Toast Mengambang
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <GlassButton size="sm" variant="secondary" onClick={() => addToast("success")}>
                  Toast Sukses
                </GlassButton>
                <GlassButton size="sm" variant="secondary" onClick={() => addToast("error")}>
                  Toast Error
                </GlassButton>
                <GlassButton size="sm" variant="secondary" onClick={() => addToast("warning")}>
                  Toast Peringatan
                </GlassButton>
                <GlassButton size="sm" variant="secondary" onClick={() => addToast("info")}>
                  Toast Info
                </GlassButton>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-mono uppercase text-slate-400 font-semibold tracking-wider">
                Pratinjau GlassSkeleton (Pemuatan)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <GlassSkeletonCard />
                <div className="p-6 rounded-3xl bg-white/[0.04] border border-white/10 space-y-3 flex flex-col justify-center">
                  <GlassSkeleton variant="text" className="w-3/4" />
                  <GlassSkeleton variant="text" className="w-1/2" />
                  <GlassSkeleton variant="button" className="mt-4" />
                </div>
              </div>
            </div>
          </GlassCard>
        </section>
      </main>

      {/* Interactive Overlays */}
      <GlassDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Konfirmasi Perubahan Data"
        description="Perubahan akan disimpan langsung ke sistem ESPORT SUMBAR V3."
      >
        <p className="text-sm text-slate-300 mb-6">
          Seluruh profil dalam ekosistem V3 diverifikasi dalam satu tahap tunggal tanpa campur tangan organisasi eksternal.
        </p>
        <div className="flex justify-end gap-3">
          <GlassButton variant="ghost" onClick={() => setDialogOpen(false)}>
            Batal
          </GlassButton>
          <GlassButton
            variant="primary"
            onClick={() => {
              setDialogOpen(false);
              addToast("success");
            }}
          >
            Simpan Perubahan
          </GlassButton>
        </div>
      </GlassDialog>

      <GlassSheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Panel Pengaturan Tampilan"
        side="right"
      >
        <div className="space-y-6">
          <p className="text-xs text-slate-400">
            Sesuaikan tingkat efek visual Liquid Glass dan performa perangkat Anda.
          </p>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">
              Tingkat Efek Visual
            </label>
            <GlassSegmented<QualityMode>
              value={quality}
              onChange={(val) => setQualityMode(val, true)}
              options={[
                { value: "full", label: "Penuh" },
                { value: "standard", label: "Standar" },
                { value: "eco", label: "Hemat" },
              ]}
            />
          </div>
          <div className="pt-4 border-t border-white/10 flex justify-end">
            <GlassButton variant="secondary" onClick={() => setSheetOpen(false)}>
              Tutup Panel
            </GlassButton>
          </div>
        </div>
      </GlassSheet>

      {/* Toast Manager */}
      <GlassToast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
