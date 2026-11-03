"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Shield,
  Eye,
  EyeOff,
  Lock,
  Download,
  FileText,
  AlertTriangle,
  Trash2,
  CheckCircle2,
  Sparkles,
  Info,
  ChevronRight,
  RefreshCw,
  Sliders,
  ExternalLink,
  X,
  FileCheck,
  UserX,
  ArrowRight,
  Settings,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EsportCard } from "@/components/card/EsportCard";
import { GALLERY_CARDS } from "@/data/mockCards";

interface PrivacyFieldConfig {
  id: string;
  label: string;
  category: "identitas" | "gaming" | "sosial" | "dokumen";
  currentValue: string;
  isPublic: boolean;
  canToggle: boolean;
  impactText: string;
  legalNote?: string;
}

export default function PrivacyPage() {
  const baseCard = GALLERY_CARDS.find((c) => c.id === "pl-contender") || GALLERY_CARDS[1];

  // Privacy toggles state
  const [privacySettings, setPrivacySettings] = useState<Record<string, boolean>>({
    realName: true,
    birthDate: false,
    region: true,
    gameId: false,
    socials: true,
    teamHistory: true,
    achievements: true,
    verificationDocs: false, // Permanently restricted
  });

  const [notification, setNotification] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isCorrectionModalOpen, setIsCorrectionModalOpen] = useState(false);
  const [isRevokeConsentModalOpen, setIsRevokeConsentModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteStep, setDeleteStep] = useState<1 | 2>(1);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const toggleField = (fieldId: string) => {
    if (fieldId === "verificationDocs") return; // cannot toggle docs
    setPrivacySettings((prev) => {
      const nextVal = !prev[fieldId];
      const updated = { ...prev, [fieldId]: nextVal };
      setNotification(`Visibilitas ${fieldId} diubah menjadi: ${nextVal ? "Publik" : "Terbatas"}`);
      setTimeout(() => setNotification(null), 3000);
      return updated;
    });
  };

  const fields: PrivacyFieldConfig[] = [
    {
      id: "realName",
      label: "Nama Lengkap / Nama Asli",
      category: "identitas",
      currentValue: "Raka Pratama",
      isPublic: privacySettings.realName,
      canToggle: true,
      impactText: privacySettings.realName
        ? "Ditampilkan di profil publik dan sisi belakang kartu."
        : "Hanya inisial (R. Pratama) yang terlihat publik. Admin ESI tetap dapat memverifikasi nama penuh.",
    },
    {
      id: "birthDate",
      label: "Tanggal Lahir & Usia",
      category: "identitas",
      currentValue: "14 Mei 2005 (20 Tahun)",
      isPublic: privacySettings.birthDate,
      canToggle: true,
      impactText: privacySettings.birthDate
        ? "Rentang usia tampil di ringkasan profil atlet."
        : "Disembunyikan dari publik. Hanya dicatat untuk kategori kelompok umur turnamen oleh panitia resmi.",
    },
    {
      id: "region",
      label: "Kota / Kabupaten Domisili",
      category: "identitas",
      currentValue: "Kota Padang (PDG)",
      isPublic: privacySettings.region,
      canToggle: true,
      impactText: privacySettings.region
        ? "Tampil di kartu & direktori untuk scouting regional dan kualifikasi Kejurda ESI."
        : "Hanya label 'Sumatera Barat' yang ditampilkan ke publik umum.",
    },
    {
      id: "gameId",
      label: "ID Akun Game & Server ID",
      category: "gaming",
      currentValue: "MLBB: 294810294 (2041)",
      isPublic: privacySettings.gameId,
      canToggle: true,
      impactText: privacySettings.gameId
        ? "Dapat dilihat publik untuk memudahkan pencarian kawan mabar dan penantang turnamen."
        : "Terbatas bagi Anda dan validator ESI. Mencegah spam atau penyalahgunaan akun di luar turnamen.",
    },
    {
      id: "socials",
      label: "Tautan Media Sosial (IG, Discord)",
      category: "sosial",
      currentValue: "@raka_aim (Instagram), rakasutan#1234",
      isPublic: privacySettings.socials,
      canToggle: true,
      impactText: privacySettings.socials
        ? "Tautan sosial media aktif di halaman profil publik Anda."
        : "Ikon sosial media disembunyikan dari profil publik.",
    },
    {
      id: "teamHistory",
      label: "Riwayat Tim & Organisasi Lama",
      category: "gaming",
      currentValue: "Padang Pride, Minang Esports",
      isPublic: privacySettings.teamHistory,
      canToggle: true,
      impactText: privacySettings.teamHistory
        ? "Daftar tim terdahulu tampil pada tab Riwayat profil."
        : "Hanya tim aktif yang ditampilkan; rekam jejak tim lampau disembunyikan dari publik.",
    },
    {
      id: "achievements",
      label: "Prestasi & Sertifikat Turnamen",
      category: "gaming",
      currentValue: "Juara 1 Piala Gubernur Sumbar 2025, Top 4 Kejurda ESI Padang",
      isPublic: privacySettings.achievements,
      canToggle: true,
      impactText: privacySettings.achievements
        ? "Direkomendasikan publik agar scout dan tim dapat melihat pencapaian resmi Anda."
        : "Prestasi disembunyikan dari publik umum (hanya terlihat oleh panitia resmi saat mendaftar event).",
    },
    {
      id: "verificationDocs",
      label: "Dokumen Pembuktian & Identitas",
      category: "dokumen",
      currentValue: "Kartu Pelajar / Mahasiswa, Bukti Ranking",
      isPublic: false,
      canToggle: false,
      impactText:
        "Terkunci otomatis: Dokumen privat HANYA dapat diakses sementara oleh Admin ESI berwenang dan dihapus sesuai kebijakan retensi. Tidak pernah dibuka ke publik.",
      legalNote: "Pasal 27 UU No. 27/2022 (Pelindungan Data Pribadi Spesifik)",
    },
  ];

  // Build live simulated card data based on active toggles
  const previewData = {
    ...baseCard.data,
    displayName: privacySettings.realName ? baseCard.data.displayName : "R. Pratama (Privat)",
    region: privacySettings.region
      ? baseCard.data.region
      : { name: "Sumatera Barat", code: "SB" },
  };

  // Handler for UU PDP Data Download (JSON export)
  const handleDownloadMyData = () => {
    setIsExporting(true);
    setTimeout(() => {
      const exportPayload = {
        metadata: {
          platform: "ESPORT SUMBAR V2",
          exportDate: new Date().toISOString(),
          regulationCompliance: "UU RI No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP)",
          purpose: "Pemenuhan Hak Portabilitas Data Subjek Pribadi",
        },
        account: {
          esportId: baseCard.data.esportId,
          email: "raka.pratama@example.com",
          registeredAt: "2025-08-10T14:22:00Z",
          status: "Active",
        },
        profile: {
          ign: baseCard.data.ign,
          realName: baseCard.data.displayName,
          birthDate: "2005-05-14",
          age: 20,
          region: baseCard.data.region,
          primaryGame: baseCard.data.game,
          role: baseCard.data.role,
          activeTeam: baseCard.data.team?.name || null,
          privacyPreferences: privacySettings,
        },
        verificationStatus: {
          currentBadge: "Regional Checked",
          regionalAuthority: "Pengurus Cabang ESI Kota Padang",
          verifiedAt: "2026-02-15T09:30:00Z",
          validUntil: "2027-02-15T09:30:00Z",
          auditLogReferenceId: "AUD-PDG-202602-0992",
        },
        achievements: baseCard.data.achievements,
        teamHistory: baseCard.data.history,
      };

      const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ESPORT_SUMBAR_DATA_${baseCard.data.esportId}_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setIsExporting(false);
      setNotification("Arsip data JSON berhasil diunduh ke perangkat Anda.");
      setTimeout(() => setNotification(null), 4000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0B0D12] text-[#F3F4F6] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* BREADCRUMB & HEADER */}
        <div className="flex flex-col gap-2 mb-8">
          <nav className="flex items-center gap-2 text-xs text-[#9AA3B2] font-mono mb-2">
            <Link href="/" className="hover:text-white transition-colors">
              Beranda
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/dashboard" className="hover:text-white transition-colors">
              Dashboard
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#D4AF37] font-bold">Privasi & Kontrol Data</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#262B38] pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/30 text-[10px] font-mono text-[#3B82F6] font-bold flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Kepatuhan UU PDP No. 27/2022
                </span>
                <span className="text-xs text-[#9AA3B2] font-mono">
                  ESPORT ID: {baseCard.data.esportId}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-black uppercase text-white tracking-tight">
                Pengaturan Privasi & Kontrol Data
              </h1>
              <p className="text-xs sm:text-sm text-[#9AA3B2] mt-1 max-w-2xl leading-relaxed">
                Anda memiliki kendali penuh atas data yang dapat dilihat publik. Informasi berlabel
                <span className="text-[#3B82F6] font-bold"> Terbatas</span> hanya dapat diakses
                oleh Anda dan diverifikasi secara privat oleh Pengurus ESI berwenang.
              </p>
            </div>

            <Link
              href="/me/settings"
              className="self-start md:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#161922] hover:bg-[#1A1E28] border border-[#262B38] text-xs font-heading font-bold uppercase tracking-wider text-gray-200 hover:text-white transition-colors shadow-sm"
            >
              <Settings className="w-4 h-4 text-[#D4AF37]" />
              <span>Pengaturan Akun & Sesi</span>
            </Link>
          </div>
        </div>

        {/* NOTIFICATION TOAST BANNER */}
        {notification && (
          <div className="mb-6 p-4 rounded-xl bg-[#22C55E]/15 border border-[#22C55E]/40 text-[#22C55E] text-xs font-medium flex items-center justify-between gap-3 animate-in fade-in duration-200">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{notification}</span>
            </div>
            <button
              type="button"
              onClick={() => setNotification(null)}
              className="p-1 hover:bg-[#22C55E]/20 rounded text-[#22C55E]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* 2-COLUMN GRID: LEFT (PRIVACY TABLE & ACTIONS) | RIGHT (LIVE VISITOR PREVIEW) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: TABLE OF PROFILE FIELDS (7 COLS) */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            {/* 1. VISIBILITY SETTINGS TABLE */}
            <div className="p-6 rounded-2xl bg-[#12151C] border border-[#262B38] shadow-md flex flex-col gap-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#262B38]">
                <div className="flex items-center gap-2.5">
                  <Sliders className="w-5 h-5 text-[#D4AF37]" />
                  <div>
                    <h2 className="font-heading font-bold text-sm uppercase text-white tracking-wide">
                      Visibilitas Field Profil
                    </h2>
                    <p className="text-[11px] text-[#9AA3B2]">
                      Tentukan data apa saja yang muncul di direktori publik & kartu digital Anda.
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/30">
                  Simulasi Real-Time
                </span>
              </div>

              {/* FIELD ROWS */}
              <div className="flex flex-col divide-y divide-[#262B38]">
                {fields.map((field) => (
                  <div key={field.id} className="py-4 first:pt-0 last:pb-0 flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-heading font-bold text-xs uppercase text-white">
                            {field.label}
                          </span>
                          {field.isPublic ? (
                            <span className="px-2 py-0.5 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/30 text-[10px] font-mono text-[#22C55E] flex items-center gap-1 font-bold">
                              <Eye className="w-2.5 h-2.5" />
                              Publik
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/30 text-[10px] font-mono text-[#3B82F6] flex items-center gap-1 font-bold">
                              <Lock className="w-2.5 h-2.5" />
                              Terbatas
                            </span>
                          )}
                        </div>

                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-xs text-[#F3F4F6] font-mono bg-[#161922] px-2 py-0.5 rounded border border-[#262B38]/60">
                            {field.currentValue}
                          </span>
                        </div>

                        <p className="text-[11px] text-[#9AA3B2] mt-1.5 leading-relaxed">
                          {field.impactText}
                        </p>

                        {field.legalNote && (
                          <span className="inline-block mt-1 text-[9px] font-mono text-gray-500 bg-black/40 px-1.5 py-0.5 rounded">
                            {field.legalNote}
                          </span>
                        )}
                      </div>

                      {/* TOGGLE SWITCH */}
                      <div className="pt-1 shrink-0">
                        {field.canToggle ? (
                          <button
                            type="button"
                            role="switch"
                            aria-checked={field.isPublic}
                            onClick={() => toggleField(field.id)}
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                              field.isPublic ? "bg-[#22C55E]" : "bg-[#262B38]"
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                field.isPublic ? "translate-x-5" : "translate-x-0"
                              }`}
                            />
                          </button>
                        ) : (
                          <div className="p-1 text-gray-500 cursor-not-allowed" title="Field privasi wajib dilindungi hukum">
                            <Lock className="w-4 h-4 text-gray-500" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. DATA SUBJECT RIGHTS (UU PDP) */}
            <div className="p-6 rounded-2xl bg-[#12151C] border border-[#262B38] shadow-md flex flex-col gap-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-[#262B38]">
                <FileCheck className="w-5 h-5 text-[#3B82F6]" />
                <div>
                  <h2 className="font-heading font-bold text-sm uppercase text-white tracking-wide">
                    Hak Subjek Data (UU PDP No. 27/2022)
                  </h2>
                  <p className="text-[11px] text-[#9AA3B2]">
                    Hak konstitusional Anda terhadap data pribadi yang disimpan pada sistem ESPORT SUMBAR.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1. PORTABILITAS DATA: UNDUH DATA */}
                <button
                  type="button"
                  onClick={handleDownloadMyData}
                  disabled={isExporting}
                  className="p-4 rounded-xl bg-[#161922] hover:bg-[#1A1E28] border border-[#262B38] text-left flex flex-col justify-between gap-3 group transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-lg bg-[#3B82F6]/10 text-[#3B82F6]">
                      <Download className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-mono text-gray-400 uppercase">Pasal 13</span>
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-xs uppercase text-white group-hover:text-[#3B82F6] transition-colors">
                      Unduh Data Saya
                    </h4>
                    <p className="text-[10px] text-[#9AA3B2] mt-0.5">
                      Ekspor lengkap profil, riwayat, dan tier ke format JSON.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-[#3B82F6] font-bold flex items-center gap-1">
                    {isExporting ? "Memproses..." : "Unduh JSON →"}
                  </span>
                </button>

                {/* 2. KOREKSI DATA */}
                <button
                  type="button"
                  onClick={() => setIsCorrectionModalOpen(true)}
                  className="p-4 rounded-xl bg-[#161922] hover:bg-[#1A1E28] border border-[#262B38] text-left flex flex-col justify-between gap-3 group transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37]">
                      <RefreshCw className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-mono text-gray-400 uppercase">Pasal 6</span>
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-xs uppercase text-white group-hover:text-[#D4AF37] transition-colors">
                      Koreksi Data
                    </h4>
                    <p className="text-[10px] text-[#9AA3B2] mt-0.5">
                      Minta perbaikan data salah atau perpindahan domisili resmi.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-[#D4AF37] font-bold flex items-center gap-1">
                    Buka Panduan →
                  </span>
                </button>

                {/* 3. TARIK PERSETUJUAN (BEKUKAN VISIBILITAS) */}
                <button
                  type="button"
                  onClick={() => setIsRevokeConsentModalOpen(true)}
                  className="p-4 rounded-xl bg-[#161922] hover:bg-[#1A1E28] border border-[#262B38] text-left flex flex-col justify-between gap-3 group transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-lg bg-[#C084FC]/10 text-[#C084FC]">
                      <UserX className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-mono text-gray-400 uppercase">Pasal 9</span>
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-xs uppercase text-white group-hover:text-[#C084FC] transition-colors">
                      Tarik Persetujuan
                    </h4>
                    <p className="text-[10px] text-[#9AA3B2] mt-0.5">
                      Sembunyikan total profil dari publik tanpa menghapus akun.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-[#C084FC] font-bold flex items-center gap-1">
                    Atur Status →
                  </span>
                </button>
              </div>
            </div>

            {/* 3. DANGER ZONE (HAPUS PROFIL / AKUN) */}
            <div className="p-6 rounded-2xl bg-[#1A1215] border border-red-900/40 shadow-md flex flex-col gap-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-red-900/30">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <div>
                  <h2 className="font-heading font-bold text-sm uppercase text-red-400 tracking-wide">
                    Zona Berbahaya: Hapus Profil & Akun
                  </h2>
                  <p className="text-[11px] text-gray-400">
                    Tindakan ini tidak dapat dibatalkan. Mohon baca konsekuensi secara seksama.
                  </p>
                </div>
              </div>

              <div className="text-xs text-gray-300 space-y-2 leading-relaxed">
                <p>
                  Jika Anda memilih untuk menghapus akun:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-400 text-[11px]">
                  <li>Profil publik dan kartu TCG digital Anda akan dinonaktifkan seketika.</li>
                  <li>Keanggotaan aktif dalam roster tim akan dilepaskan secara otomatis.</li>
                  <li>
                    <strong className="text-gray-200">Prinsip Integritas Keolahragaan & Audit:</strong> Catatan teknis nomor verifikasi ESI masa lalu tetap disimpan dalam bentuk anonim (tanpa identitas/kontak pribadi) untuk mencegah pemalsuan riwayat atlet pada turnamen masa depan.
                  </li>
                </ul>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setDeleteStep(1);
                    setDeleteConfirmationText("");
                    setDeletePassword("");
                    setIsDeleteModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-red-950/60 hover:bg-red-900/80 border border-red-700/50 text-red-400 hover:text-red-200 text-xs font-heading font-bold uppercase tracking-wider transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Hapus Profil & Akun Ini</span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: LIVE VISITOR PREVIEW (5 COLS STICKY) */}
          <div className="lg:col-span-5 flex flex-col gap-5 sticky top-24">
            <div className="p-5 rounded-2xl bg-[#12151C] border border-[#262B38] shadow-xl flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#262B38]">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-[#D4AF37]" />
                  <h3 className="font-heading font-bold text-xs uppercase text-white">
                    Pratinjau Pengunjung Publik
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-[#22C55E] flex items-center gap-1 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                  Live Sync
                </span>
              </div>

              <p className="text-[11px] text-[#9AA3B2] leading-relaxed">
                Inilah tepatnya yang akan dilihat oleh publik, manajer tim, dan scout esport ketika mengunjungi tautan profil atau memindai kode QR kartu Anda:
              </p>

              {/* CARD PREVIEW */}
              <div className="flex justify-center py-2">
                <EsportCard
                  type={baseCard.type}
                  rarity={baseCard.rarity}
                  verification={baseCard.verification}
                  data={previewData}
                  size="sm"
                  interactive={true}
                />
              </div>

              {/* SIMULATION SUMMARY BOX */}
              <div className="p-3.5 rounded-xl bg-[#161922] border border-[#262B38] flex flex-col gap-2 text-xs">
                <span className="font-heading font-bold text-[10px] text-[#D4AF37] uppercase">
                  Data yang Terlihat oleh Pengunjung:
                </span>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-[10px]">Nama Lengkap:</span>
                    <span className="font-medium text-white">
                      {privacySettings.realName ? "Raka Pratama" : "R. Pratama (Privat)"}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-gray-400 text-[10px]">Usia / DOB:</span>
                    <span className="font-medium text-white">
                      {privacySettings.birthDate ? "20 Tahun" : "Disembunyikan"}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-gray-400 text-[10px]">Wilayah Asal:</span>
                    <span className="font-medium text-white">
                      {privacySettings.region ? "Kota Padang" : "Sumatera Barat"}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-gray-400 text-[10px]">Game ID:</span>
                    <span className="font-medium text-white">
                      {privacySettings.gameId ? "294810294" : "Hanya Admin ESI"}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-gray-400 text-[10px]">Sosial Media:</span>
                    <span className="font-medium text-white">
                      {privacySettings.socials ? "Tampil di Profil" : "Disembunyikan"}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-gray-400 text-[10px]">Prestasi:</span>
                    <span className="font-medium text-white">
                      {privacySettings.achievements ? "2 Terverifikasi" : "Dirahasiakan"}
                    </span>
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-[#262B38] flex items-center justify-between text-[10px]">
                  <span className="text-gray-400">Status Dokumen:</span>
                  <span className="text-[#3B82F6] font-mono flex items-center gap-1 font-bold">
                    <Lock className="w-2.5 h-2.5" />
                    100% Privat Terkunci
                  </span>
                </div>
              </div>

              <Link
                href="/player/sutan-aim"
                target="_blank"
                className="w-full py-2.5 rounded-xl bg-[#1A1E28] hover:bg-[#262B38] text-center text-xs font-heading font-bold text-gray-200 hover:text-white uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Buka Halaman Publik Sebenarnya</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL 1: KOREKSI DATA GUIDE */}
      {isCorrectionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#12151C] border border-[#262B38] rounded-2xl max-w-lg w-full p-6 flex flex-col gap-4 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setIsCorrectionModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-white hover:bg-[#1A1E28]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-[#D4AF37]/15 text-[#D4AF37]">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base uppercase text-white">
                  Permohonan Koreksi Data
                </h3>
                <p className="text-xs text-[#9AA3B2]">
                  Hak Pemutakhiran Data Pribadi (Pasal 6 UU PDP)
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#161922] border border-[#262B38] text-xs text-gray-300 space-y-2">
              <p>
                Jika terdapat kesalahan pengetikan nama lengkap, perubahan domisili antar kota/kabupaten se-Sumbar, atau pergantian akun game resmi:
              </p>
              <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-800/40 text-amber-300 text-[11px] flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  <strong>Peringatan Verifikasi Ulang:</strong> Mengubah nama, game utama, atau kota/kabupaten pada profil yang sudah terverifikasi ESI akan menangguhkan lencana Anda sementara hingga diverifikasi ulang oleh ESI setempat.
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-heading font-semibold text-gray-300">
                Pilih Jenis Koreksi yang Diperlukan:
              </label>
              <select className="w-full px-3 py-2 rounded-xl bg-[#161922] border border-[#262B38] text-xs text-white focus:outline-none focus:border-[#D4AF37]">
                <option value="name">Koreksi Ejaan Nama Lengkap</option>
                <option value="region">Pindah Domisili Kota/Kabupaten (Mutasi ESI)</option>
                <option value="game">Pembaruan Game ID / Nickname Resmi</option>
                <option value="other">Koreksi Data Lainnya</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#262B38]">
              <button
                type="button"
                onClick={() => setIsCorrectionModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#1A1E28] text-xs font-heading font-bold text-gray-300 hover:text-white"
              >
                Tutup
              </button>
              <Link
                href="/me/verification"
                className="px-4 py-2 rounded-xl bg-[#D4AF37] text-black text-xs font-heading font-bold uppercase tracking-wider hover:brightness-110"
              >
                Ke Ruang Pengajuan Verifikasi
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: TARIK PERSETUJUAN (FREEZE / PRIVATE MODE) */}
      {isRevokeConsentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#12151C] border border-[#262B38] rounded-2xl max-w-lg w-full p-6 flex flex-col gap-4 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setIsRevokeConsentModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-white hover:bg-[#1A1E28]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-[#C084FC]/15 text-[#C084FC]">
                <UserX className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base uppercase text-white">
                  Tarik Persetujuan Publikasi
                </h3>
                <p className="text-xs text-[#9AA3B2]">
                  Mode Hibernasi / Profil Privat Sementara
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              Dengan menarik persetujuan pemrosesan publikasi:
            </p>
            <ul className="text-xs text-gray-400 space-y-1.5 list-disc list-inside bg-[#161922] p-3 rounded-xl border border-[#262B38]">
              <li>Profil Anda tidak akan dapat ditemukan di mesin pencarian & halaman Jelajah.</li>
              <li>Tautan kartu publik Anda akan menampilkan status *"Profil Privat"*.</li>
              <li>Data Anda, kartu, dan status verifikasi ESI Anda tetap aman tersimpan di akun Anda dan dapat diaktifkan kembali kapan saja.</li>
            </ul>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#262B38]">
              <button
                type="button"
                onClick={() => setIsRevokeConsentModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#1A1E28] text-xs font-heading font-bold text-gray-300 hover:text-white"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsRevokeConsentModalOpen(false);
                  setNotification("Persetujuan publikasi ditarik. Profil Anda kini dalam mode privat.");
                  setTimeout(() => setNotification(null), 4000);
                }}
                className="px-4 py-2 rounded-xl bg-[#C084FC] text-black text-xs font-heading font-bold uppercase tracking-wider hover:brightness-110"
              >
                Konfirmasi Tarik Persetujuan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: TWO-STEP DELETE CONFIRMATION DIALOG */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#151114] border border-red-800/60 rounded-2xl max-w-lg w-full p-6 flex flex-col gap-4 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-white hover:bg-[#1A1E28]"
            >
              <X className="w-5 h-5" />
            </button>

            {deleteSuccess ? (
              <div className="flex flex-col items-center text-center gap-3 py-4">
                <CheckCircle2 className="w-12 h-12 text-red-500" />
                <h3 className="font-heading font-bold text-lg uppercase text-white">
                  Permintaan Penghapusan Diproses
                </h3>
                <p className="text-xs text-gray-400 max-w-sm">
                  Profil dan data pribadi Anda telah dinonaktifkan dari publik. Sesuai regulasi, Anda akan dialihkan ke halaman utama dalam beberapa detik.
                </p>
              </div>
            ) : deleteStep === 1 ? (
              <>
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-red-950/80 border border-red-700 text-red-400">
                    <Trash2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-base uppercase text-white">
                      Konfirmasi Langkah 1 dari 2
                    </h3>
                    <p className="text-xs text-red-400">
                      Penghapusan Profil & Akun ESPORT SUMBAR
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/40 text-xs text-gray-300 space-y-2 leading-relaxed">
                  <p className="font-bold text-red-300">
                    Apakah Anda yakin ingin menghapus akun Anda secara permanen?
                  </p>
                  <p className="text-[11px] text-gray-400">
                    Semua kartu TCG digital, riwayat pencapaian, dan tautan publik Anda akan segera terhapus. Anda tidak akan dapat memulihkan akun ini setelah konfirmasi langkah kedua selesai.
                  </p>
                  <div className="p-2.5 rounded-lg bg-black/40 border border-red-950 text-[10px] text-gray-400">
                    <strong>Catatan UU PDP:</strong> Catatan transaksi log audit teknis ESI diarsipkan secara teranonimkan untuk integritas historis turnamen daerah.
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#262B38]">
                  <button
                    type="button"
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-[#1A1E28] text-xs font-heading font-bold text-gray-300 hover:text-white"
                  >
                    Batalkan
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteStep(2)}
                    className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-heading font-extrabold uppercase tracking-wider transition-colors"
                  >
                    Lanjutkan ke Langkah 2 →
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-red-950/80 border border-red-700 text-red-400">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-base uppercase text-red-400">
                      Konfirmasi Terakhir (Langkah 2 dari 2)
                    </h3>
                    <p className="text-xs text-gray-400">
                      Verifikasi identitas sebelum penghapusan final
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <p className="text-xs text-gray-300">
                    Untuk melanjutkan, ketik persis kalimat konfirmasi di bawah ini:
                  </p>
                  <div className="p-2.5 rounded-lg bg-black/60 font-mono text-xs text-[#D4AF37] select-all border border-[#262B38] text-center font-bold">
                    HAPUS AKUN SAYA SECARA PERMANEN
                  </div>

                  <input
                    type="text"
                    value={deleteConfirmationText}
                    onChange={(e) => setDeleteConfirmationText(e.target.value)}
                    placeholder="Ketik kalimat konfirmasi di sini"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0D12] border border-red-900/50 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                  />

                  <div className="flex flex-col gap-1.5 mt-1">
                    <label className="text-xs font-heading text-gray-300 font-medium">
                      Masukkan Kata Sandi Akun Anda:
                    </label>
                    <input
                      type="password"
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0D12] border border-red-900/50 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#262B38]">
                  <button
                    type="button"
                    onClick={() => setDeleteStep(1)}
                    className="px-4 py-2.5 rounded-xl bg-[#1A1E28] text-xs font-heading font-bold text-gray-300 hover:text-white"
                  >
                    ← Kembali
                  </button>
                  <button
                    type="button"
                    disabled={
                      deleteConfirmationText !== "HAPUS AKUN SAYA SECARA PERMANEN" ||
                      deletePassword.length < 4
                    }
                    onClick={() => {
                      setDeleteSuccess(true);
                      setTimeout(() => {
                        window.location.href = "/";
                      }, 2500);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-heading font-extrabold uppercase tracking-wider transition-colors shadow-lg shadow-red-950"
                  >
                    Eksekusi Hapus Akun Permanen
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}