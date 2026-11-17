"use client";

import React, { useState } from "react";
import NextLink from "next/link";
import {
  Sparkles,
  Layers,
  Palette,
  Type,
  Component,
  ShieldCheck,
  Award,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Lock,
  Search,
  User,
  Gamepad2,
  Sliders,
  ZoomIn,
  AlertTriangle,
  RotateCcw,
  Check,
} from "lucide-react";

import {
  Button,
  Link,
  Input,
  Select,
  Textarea,
  Segmented,
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  ListRow,
  Avatar,
  StatusBadge,
  RarityMaterialTag,
  Sheet,
  Dialog,
  Menu,
  Toast,
  Skeleton,
  EmptyState,
  ErrorState,
  Carousel,
  DataTable,
  Header as MinimalHeader,
  Footer as MinimalFooter,
} from "@esport-sumbar/ui";

import { colors, rarityMaterials } from "@esport-sumbar/design-tokens";

export default function ComponentGalleryPage() {
  const [scale, setScale] = useState<"100" | "125" | "150" | "200">("100");
  const [activeTab, setActiveTab] = useState("buttons");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isToastVisible, setIsToastVisible] = useState(true);
  const [segmentedVal, setSegmentedVal] = useState("player");
  const [inputValue, setInputValue] = useState("");
  const [selectValue, setSelectValue] = useState("padang");

  const scaleMultiplier = {
    "100": "scale-100",
    "125": "scale-125 origin-top",
    "150": "scale-150 origin-top",
    "200": "scale-[2.0] origin-top",
  }[scale];

  // Data Dummy Nol: Data Simulasi Khusus Galeri Komponen
  const SAMPLE_BANNERS = [
    {
      id: "b1",
      title: "Piala Ranah Minang Olahraga Elektronik 2026",
      subtitle: "Kejuaraan antar-kabupaten/kota se-Sumatera Barat.",
      linkUrl: "#",
      sponsorName: "ESPORT SUMBAR Arena",
      isSponsored: false,
      ctaText: "Lihat Bagan",
    },
    {
      id: "b2",
      title: "Pendaftaran Verifikasi Liga Sekolah & Kampus",
      subtitle: "Daftarkan unit kegiatan kampus atau ekskul sekolah Anda.",
      linkUrl: "#",
      sponsorName: "Mitra Industri Digital",
      isSponsored: true,
      ctaText: "Daftar Sekarang",
    },
  ];

  const TABLE_COLUMNS = [
    { key: "id", header: "ID Registrasi" },
    { key: "name", header: "Nama Lengkap" },
    { key: "branch", header: "Bidang" },
    {
      key: "status",
      header: "Status",
      render: (item: any) => <StatusBadge status={item.status} size="sm" />,
    },
  ];

  const TABLE_DATA = [
    { id: "ESB-PDG-PL-0001", name: "Sutan Gamer", branch: "Pemain", status: "verified" as const },
    { id: "ESB-BKT-CO-0004", name: "Rahmat Hidayat", branch: "Pelatih", status: "under_review" as const },
    { id: "ESB-PYK-TM-0012", name: "Minang Pride", branch: "Tim", status: "revision" as const },
  ];

  return (
    <div className="min-h-screen bg-[#05051A] text-white flex flex-col font-sans selection:bg-[#FF1752]/30 selection:text-white pb-24">
      {/* TOP CONTROL BAR: Galeri Navigasi & Uji Skala Zoom 200% */}
      <div className="sticky top-0 z-50 bg-[#0C0C26]/90 backdrop-blur-md border-b border-white/[0.08] px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded bg-[#FF1752] text-white flex items-center justify-center font-black text-xs">
              V
            </span>
            <span className="text-sm font-bold text-white tracking-tight">
              Galeri Komponen Sistem Desain V3 (Arah B — Matte Glass)
            </span>
          </div>

          {/* ZOOM 200% SCALING CONTROLLER (Section 5.5) */}
          <div className="flex items-center gap-2 bg-[#14143A] px-3 py-1.5 rounded-lg border border-white/10 text-xs">
            <ZoomIn className="w-3.5 h-3.5 text-white/50" />
            <span className="text-white/60 font-medium">Uji Zoom Aksesibilitas:</span>
            <div className="flex items-center gap-1">
              {(["100", "125", "150", "200"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setScale(s)}
                  className={`px-2 py-0.5 rounded text-xs font-mono font-bold transition-colors ${
                    scale === s
                      ? "bg-[#FF1752] text-white"
                      : "text-white/60 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {s}%
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-8 py-10 flex flex-col gap-12">
        {/* HEADER OVERVIEW */}
        <div className="flex flex-col gap-3 border-b border-white/[0.08] pb-8">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-[#FF1752]/15 border border-[#FF1752]/30 text-xs font-bold text-[#FF4D77] flex items-center gap-1.5">
              <Component className="w-3.5 h-3.5" />
              Paket Komponen Bersama: @esport-sumbar/ui
            </span>
            <span className="text-xs text-white/40 font-mono">Gerbang 5</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Sistem Komponen & Token Desain V3
          </h1>
          <p className="text-sm text-white/60 max-w-3xl leading-relaxed">
            Pustaka antarmuka minimalis terpadu berdasarkan **Arah B (Matte Glass)**. Nol efek glow neon, satu aksen pink brand, emas disakralkan hanya untuk verifikasi & tier Elite, dan tipografi Plus Jakarta Sans + Barlow Condensed.
          </p>
        </div>

        {/* CONTAINER BERBASIS SCALE CONTROLLER */}
        <div className={`flex flex-col gap-16 transition-transform duration-200 ${scaleMultiplier}`}>
          {/* 1. PALET WARNA & TOKEN RESMI */}
          <section className="flex flex-col gap-6">
            <div className="flex items-center gap-2 border-b border-white/[0.08] pb-2">
              <Palette className="w-5 h-5 text-[#FF1752]" />
              <h2 className="text-xl font-bold text-white">1. Token Warna & Palet Tonal</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3.5">
              <div className="p-3.5 rounded-xl bg-[#0C0C26] border border-white/10 flex flex-col gap-2">
                <div className="w-full h-12 rounded-lg bg-[#FF1752]" />
                <span className="text-xs font-bold text-white">Brand Pink</span>
                <span className="text-xs font-mono text-white/50">#FF1752 (Aksen Utama)</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0C0C26] border border-white/10 flex flex-col gap-2">
                <div className="w-full h-12 rounded-lg bg-[#D4AF37]" />
                <span className="text-xs font-bold text-[#D4AF37]">Verified Gold</span>
                <span className="text-xs font-mono text-white/50">#D4AF37 (Khusus Status)</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0C0C26] border border-white/10 flex flex-col gap-2">
                <div className="w-full h-12 rounded-lg bg-[#05051A] border border-white/20" />
                <span className="text-xs font-bold text-white">Ink Base</span>
                <span className="text-xs font-mono text-white/50">#05051A (Latar Dasar)</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0C0C26] border border-white/10 flex flex-col gap-2">
                <div className="w-full h-12 rounded-lg bg-[#0C0C26] border border-white/20" />
                <span className="text-xs font-bold text-white">Surface 1</span>
                <span className="text-xs font-mono text-white/50">#0C0C26 (Kartu/Panel)</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0C0C26] border border-white/10 flex flex-col gap-2">
                <div className="w-full h-12 rounded-lg bg-[#14143A] border border-white/20" />
                <span className="text-xs font-bold text-white">Surface 2</span>
                <span className="text-xs font-mono text-white/50">#14143A (Input/Dialog)</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0C0C26] border border-white/10 flex flex-col gap-2">
                <div className="w-full h-12 rounded-lg bg-[#2BB673]" />
                <span className="text-xs font-bold text-[#2BB673]">Success Green</span>
                <span className="text-xs font-mono text-white/50">#2BB673 (Semantik)</span>
              </div>
            </div>
          </section>

          {/* 2. TOMBOL & LINK (Button & Link) */}
          <section className="flex flex-col gap-6">
            <div className="flex items-center gap-2 border-b border-white/[0.08] pb-2">
              <Component className="w-5 h-5 text-[#FF1752]" />
              <h2 className="text-xl font-bold text-white">2. Tombol & Tautan (Button & Link)</h2>
            </div>

            <div className="p-6 rounded-2xl bg-[#0C0C26] border border-white/[0.08] flex flex-col gap-6">
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="primary">Tombol Primer</Button>
                <Button variant="secondary">Tombol Sekunder</Button>
                <Button variant="danger">Tombol Bahaya</Button>
                <Button variant="ghost">Tombol Ghost</Button>
                <Button variant="primary" isLoading>Memuat</Button>
                <Button variant="primary" disabled>Dinonaktifkan</Button>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-white/[0.06] text-sm">
                <Link href="#" variant="default">Tautan Standar</Link>
                <Link href="#" variant="pink">Tautan Aksen Pink</Link>
                <Link href="#" variant="muted">Tautan Muted</Link>
              </div>
            </div>
          </section>

          {/* 3. KONTROL FORMULIR (Input, Select, Textarea) */}
          <section className="flex flex-col gap-6">
            <div className="flex items-center gap-2 border-b border-white/[0.08] pb-2">
              <Component className="w-5 h-5 text-[#FF1752]" />
              <h2 className="text-xl font-bold text-white">3. Kontrol Formulir (Input, Select, Textarea)</h2>
            </div>

            <div className="p-6 rounded-2xl bg-[#0C0C26] border border-white/[0.08] grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="Nama Atlet / IGN"
                placeholder="Masukkan IGN resmi..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                helperText="Maksimal 24 karakter."
              />

              <Select
                label="Wilayah Kabupaten / Kota"
                value={selectValue}
                onChange={(e) => setSelectValue(e.target.value)}
                options={[
                  { value: "padang", label: "Kota Padang" },
                  { value: "bukittinggi", label: "Kota Bukittinggi" },
                  { value: "payakumbuh", label: "Kota Payakumbuh" },
                  { value: "solok", label: "Kota Solok" },
                ]}
              />

              <Input
                label="Input dengan Error"
                placeholder="Data salah..."
                error="Format data tidak valid."
              />

              <div className="md:col-span-3">
                <Textarea
                  label="Catatan Prestasi Singkat"
                  placeholder="Tuliskan catatan prestasi..."
                  helperText="Teks ringkas tanpa klaim berlebihan."
                />
              </div>
            </div>
          </section>

          {/* 4. SEGMENTED & STATUS BADGES */}
          <section className="flex flex-col gap-6">
            <div className="flex items-center gap-2 border-b border-white/[0.08] pb-2">
              <Component className="w-5 h-5 text-[#FF1752]" />
              <h2 className="text-xl font-bold text-white">4. Segmented Control & Status Badges</h2>
            </div>

            <div className="p-6 rounded-2xl bg-[#0C0C26] border border-white/[0.08] flex flex-col gap-6">
              <div>
                <span className="text-xs font-semibold text-white/70 block mb-2">Segmented Control (Tonal Track):</span>
                <Segmented
                  value={segmentedVal}
                  onChange={setSegmentedVal}
                  items={[
                    { id: "player", label: "Pemain" },
                    { id: "coach", label: "Pelatih" },
                    { id: "team", label: "Tim" },
                    { id: "community", label: "Komunitas" },
                    { id: "venue", label: "Venue" },
                  ]}
                />
              </div>

              <div className="pt-4 border-t border-white/[0.06] flex flex-col gap-2">
                <span className="text-xs font-semibold text-white/70 block mb-2">Lencana Status Verifikasi Resmi:</span>
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge status="verified" />
                  <StatusBadge status="under_review" />
                  <StatusBadge status="revision" />
                  <StatusBadge status="rejected" />
                  <StatusBadge status="unverified" />
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.06] flex flex-col gap-2">
                <span className="text-xs font-semibold text-white/70 block mb-2">4 Tier Material Kartu Fisik (Bukan Glow):</span>
                <div className="flex flex-wrap items-center gap-3">
                  <RarityMaterialTag tier="rookie" />
                  <RarityMaterialTag tier="contender" />
                  <RarityMaterialTag tier="elite" />
                  <RarityMaterialTag tier="legend" />
                </div>
              </div>
            </div>
          </section>

          {/* 5. AVATAR & LIST ROW */}
          <section className="flex flex-col gap-6">
            <div className="flex items-center gap-2 border-b border-white/[0.08] pb-2">
              <Component className="w-5 h-5 text-[#FF1752]" />
              <h2 className="text-xl font-bold text-white">5. Avatar & Baris Data (ListRow)</h2>
            </div>

            <div className="p-6 rounded-2xl bg-[#0C0C26] border border-white/[0.08] flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <Avatar size="sm" />
                <Avatar size="md" />
                <Avatar size="lg" />
                <Avatar size="xl" />
                <div className="ml-4 text-xs text-white/50 max-w-sm">
                  Placeholder dirancang khusus dengan siluet Mark V-S (Nol inisial huruf dalam lingkaran neon).
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.06] rounded-xl overflow-hidden bg-[#14143A]/40 border border-white/[0.06]">
                <ListRow
                  leftContent={<Avatar size="sm" />}
                  title="Sutan Gamer"
                  subtitle="Atlet Mobile Legends • Kota Padang"
                  rightContent={<StatusBadge status="verified" size="sm" />}
                  onClick={() => {}}
                />
                <ListRow
                  leftContent={<Avatar size="sm" />}
                  title="Minang Pride Roster"
                  subtitle="Tim Kompetitif • 5 Anggota Aktif"
                  rightContent={<StatusBadge status="under_review" size="sm" />}
                  onClick={() => {}}
                />
              </div>
            </div>
          </section>

          {/* 6. BANNER SLIDER AKSESIBEL (WCAG 2.2.2) */}
          <section className="flex flex-col gap-6">
            <div className="flex items-center gap-2 border-b border-white/[0.08] pb-2">
              <Component className="w-5 h-5 text-[#FF1752]" />
              <h2 className="text-xl font-bold text-white">6. Karusel Banner Aksesibel (Carousel)</h2>
            </div>

            <Carousel banners={SAMPLE_BANNERS} intervalMs={5000} />
          </section>

          {/* 7. DIALOG, SHEET, & MENU */}
          <section className="flex flex-col gap-6">
            <div className="flex items-center gap-2 border-b border-white/[0.08] pb-2">
              <Component className="w-5 h-5 text-[#FF1752]" />
              <h2 className="text-xl font-bold text-white">7. Dialog, Sheet (Drawer), & Menu Mengambang</h2>
            </div>

            <div className="p-6 rounded-2xl bg-[#0C0C26] border border-white/[0.08] flex flex-wrap items-center gap-4">
              <Button variant="secondary" onClick={() => setIsDialogOpen(true)}>
                Buka Dialog Modal
              </Button>

              <Button variant="secondary" onClick={() => setIsSheetOpen(true)}>
                Buka Sheet Drawer
              </Button>

              <Menu
                trigger={
                  <Button variant="secondary">
                    Buka Menu Dropdown ▼
                  </Button>
                }
                items={[
                  { id: "1", label: "Profil Saya", icon: <User className="w-4 h-4" /> },
                  { id: "2", label: "Keluar Akun", danger: true },
                ]}
              />
            </div>

            {/* Modal Dialog Component */}
            <Dialog
              isOpen={isDialogOpen}
              onClose={() => setIsDialogOpen(false)}
              title="Konfirmasi Tindakan Resmi"
              description="Dialog modal dengan latar kaca matte scrim pekat sesuai standar Arah B."
              actions={
                <>
                  <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
                    Batal
                  </Button>
                  <Button variant="primary" onClick={() => setIsDialogOpen(false)}>
                    Lanjutkan
                  </Button>
                </>
              }
            >
              <p className="text-xs text-white/70">
                Setiap dialog dirancang dengan kontras WCAG AA, tombol tutup terlihat, dan penanganan tombol Escape otomatis.
              </p>
            </Dialog>

            {/* Sheet Component */}
            <Sheet
              isOpen={isSheetOpen}
              onClose={() => setIsSheetOpen(false)}
              title="Panel Samping (Drawer)"
            >
              <div className="flex flex-col gap-4">
                <p className="text-xs text-white/70">
                  Panel samping digunakan untuk formulir edit cepat pada profil tanpa berpindah shell halaman.
                </p>
                <Input label="Nama Lengkap" placeholder="Nama asli..." />
                <Button variant="primary" className="w-full">Simpan Perubahan</Button>
              </div>
            </Sheet>
          </section>

          {/* 8. TABEL DATA ADMIN (DataTable) */}
          <section className="flex flex-col gap-6">
            <div className="flex items-center gap-2 border-b border-white/[0.08] pb-2">
              <Component className="w-5 h-5 text-[#FF1752]" />
              <h2 className="text-xl font-bold text-white">8. Tabel Data Admin (DataTable)</h2>
            </div>

            <DataTable
              columns={TABLE_COLUMNS}
              data={TABLE_DATA}
              keyExtractor={(item) => item.id}
              page={1}
              totalPages={3}
            />
          </section>

          {/* 9. KEADAAN KHUSUS (EmptyState, ErrorState, Toast, Skeleton) */}
          <section className="flex flex-col gap-6">
            <div className="flex items-center gap-2 border-b border-white/[0.08] pb-2">
              <Component className="w-5 h-5 text-[#FF1752]" />
              <h2 className="text-xl font-bold text-white">9. Keadaan Khusus (Empty, Error, Toast, Skeleton)</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <EmptyState
                title="Belum Ada Pendaftar Terverifikasi"
                description="Bagian ini tidak menampilkan angka '0'. Menampilkan ajakan bergabung secara anggun dan bermartabat."
                action={<Button variant="primary" size="sm">Daftar Pertama</Button>}
              />

              <ErrorState
                title="Gagal Menghubungkan Layanan"
                message="Koneksi pangkalan data sedang mengalami waktu tunggu habis. Coba sesaat lagi."
                onRetry={() => {}}
              />
            </div>

            {isToastVisible && (
              <div className="pt-4">
                <Toast
                  type="success"
                  title="Perubahan Berhasil Disimpan"
                  message="Data identitas digital profil Anda telah disinkronkan ke pangkalan data."
                  onClose={() => setIsToastVisible(false)}
                />
              </div>
            )}

            <div className="p-6 rounded-2xl bg-[#0C0C26] border border-white/[0.08] flex flex-col gap-3">
              <span className="text-xs font-semibold text-white/70">Skeleton Loader:</span>
              <div className="flex items-center gap-3">
                <Skeleton variant="circular" className="w-10 h-10" />
                <div className="flex flex-col gap-2 flex-1">
                  <Skeleton variant="text" className="w-1/3 h-4" />
                  <Skeleton variant="text" className="w-1/2 h-3" />
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
