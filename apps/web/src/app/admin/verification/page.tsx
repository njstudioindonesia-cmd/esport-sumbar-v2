"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  AlertOctagon,
  ChevronRight,
  ExternalLink,
  MapPin,
  Sparkles,
  User,
  Gamepad2,
  FileText,
  X,
  Send,
  Eye,
  Check,
} from "lucide-react";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { Footer } from "@/components/layout/Footer";
import { EsportCard } from "@/components/card/EsportCard";
import { VerificationBadge } from "@/components/card/VerificationBadge";
import { transitionVerificationAction } from "@/app/actions/verification";
import {
  type UnifiedCardData,
  type CardEntityType,
  type CardRarity,
  mapVerificationToCard,
} from "@/types/card";

interface VerificationQueueItem {
  id: string;
  profileId: string;
  name: string;
  ign: string;
  esportId: string;
  type: string;
  game: string;
  region: string;
  regionCode: string;
  status: string;
  submittedDate: string;
  submittedAtIso: string;
  waitingHours: number;
  slaColor: "green" | "yellow" | "red";
  notes: string;
  documents: {
    type: string;
    title: string;
    url: string;
    fileSize: string;
  }[];
  profileData?: any;
}

const REASON_TEMPLATES = {
  revision_requested: [
    "Screenshot UID game tidak jelas atau terpotong; unggah tangkapan layar penuh profil in-game.",
    "Bukti sertifikat turnamen tidak menyertakan nama atlet atau IGN yang cocok.",
    "Data domisili atau nama lengkap profil perlu diperbaiki sebelum verifikasi disetujui.",
    "Format surat rekomendasi klub belum ditandatangani oleh manajer tim.",
  ],
  rejected: [
    "Bukti akun game terindikasi milik orang lain atau menggunakan jasa joki.",
    "Berkas pengajuan tidak valid atau terdeteksi manipulasi visual / pemalsuan dokumen.",
    "Tidak memenuhi kriteria domisili atau yurisdiksi ekosistem Sumatera Barat.",
  ],
  suspended: [
    "Ditemukan laporan pelanggaran berat kode etik turnamen atau perilaku tidak sportif.",
    "Akun profil dalam penyelidikan atas sengketa kepemilikan aset / ID game.",
  ],
};

export default function AdminVerificationQueuePage() {
  const [queueItems, setQueueItems] = useState<VerificationQueueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedGame, setSelectedGame] = useState<string>("all");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("pending"); // "pending" | "verified" | "all"

  // Selected item for review modal
  const [selectedItem, setSelectedItem] = useState<VerificationQueueItem | null>(null);
  const [reviewDecision, setReviewDecision] = useState<"verified" | "revision_requested" | "rejected" | "suspended">("verified");
  const [reviewReason, setReviewReason] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchQueue = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/queue");
      if (res.ok) {
        const json = await res.json();
        const items = (json.items || []).map((q: any) => {
          const submittedTime = q.submittedDate ? new Date(q.submittedDate).getTime() : Date.now();
          const hoursAgo = Math.max(0, Math.floor((Date.now() - submittedTime) / (1000 * 60 * 60)));
          let slaColor: "green" | "yellow" | "red" = "green";
          if (hoursAgo >= 48) {
            slaColor = "red";
          } else if (hoursAgo >= 24) {
            slaColor = "yellow";
          }

          return {
            ...q,
            submittedAtIso: q.submittedDate,
            waitingHours: hoursAgo,
            slaColor,
          };
        });

        // Urutkan tertua dulu (oldest first)
        items.sort((a: any, b: any) => {
          const tA = new Date(a.submittedAtIso || 0).getTime();
          const tB = new Date(b.submittedAtIso || 0).getTime();
          return tA - tB;
        });

        setQueueItems(items);
      }
    } catch (err) {
      console.warn("Failed to load queue:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  // Filtered queue
  const filteredItems = useMemo(() => {
    return queueItems.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        item.name.toLowerCase().includes(q) ||
        item.ign.toLowerCase().includes(q) ||
        item.esportId.toLowerCase().includes(q) ||
        item.region.toLowerCase().includes(q);

      const matchesType = selectedType === "all" || item.type === selectedType;
      const matchesGame = selectedGame === "all" || item.game === selectedGame;
      const matchesRegion = selectedRegion === "all" || item.regionCode === selectedRegion || item.region === selectedRegion;

      let matchesStatus = true;
      if (statusFilter === "pending") {
        matchesStatus = ["submitted", "in_review_regional", "in_review_provincial", "regional_checked"].includes(item.status);
      } else if (statusFilter === "verified") {
        matchesStatus = item.status === "verified";
      } else if (statusFilter === "revision") {
        matchesStatus = item.status === "revision_requested";
      }

      return matchesSearch && matchesType && matchesGame && matchesRegion && matchesStatus;
    });
  }, [queueItems, searchQuery, selectedType, selectedGame, selectedRegion, statusFilter]);

  // Handle Review Submission
  const handleProcessDecision = async () => {
    if (!selectedItem) return;

    if (["revision_requested", "rejected", "suspended"].includes(reviewDecision) && !reviewReason.trim()) {
      setActionMessage({ type: "error", text: "Alasan keputusan verifikasi wajib diisi!" });
      return;
    }

    setIsSubmitting(true);
    setActionMessage(null);

    try {
      const res = await transitionVerificationAction({
        requestId: selectedItem.id,
        newStatus: reviewDecision,
        reason: reviewReason.trim() || "Verifikasi berkas dan keabsahan data disetujui oleh ESPORT SUMBAR.",
        notes: adminNotes.trim() || undefined,
      });

      if (!res.success) {
        setActionMessage({ type: "error", text: res.error || "Gagal memproses keputusan verifikasi." });
      } else {
        setActionMessage({
          type: "success",
          text: `Keputusan berhasil disimpan! Status profil kini: "${res.newStatus}"${res.badgeNo ? ` (Nomor: ${res.badgeNo})` : ""}`,
        });
        setTimeout(() => {
          setSelectedItem(null);
          setActionMessage(null);
          fetchQueue();
        }, 1500);
      }
    } catch (err: any) {
      setActionMessage({ type: "error", text: err.message || "Terjadi kesalahan internal" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Convert profile data to UnifiedCardData for preview
  const cardDataPreview: UnifiedCardData | null = useMemo(() => {
    if (!selectedItem) return null;
    const p = selectedItem.profileData || {};
    return {
      esportId: selectedItem.esportId,
      displayName: selectedItem.name,
      ign: selectedItem.ign !== "-" ? selectedItem.ign : undefined,
      region: {
        name: selectedItem.region,
        code: selectedItem.regionCode || "SB",
      },
      game: selectedItem.game,
      role: p.roleName || undefined,
      avatarUrl: p.avatarUrl || undefined,
      badgeNumber: p.badgeNumber || (selectedItem.status === "verified" ? "ESP-SB-VER-2026-0001" : undefined),
    };
  }, [selectedItem]);

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-white flex flex-col font-sans selection:bg-[#FF1752]/30 selection:text-white">
      <AdminNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] text-[10px] font-mono uppercase font-bold tracking-wider">
                VERIFIKASI SATU TAHAP
              </span>
              <span className="text-white/40 text-xs font-mono">• ESPORT SUMBAR TUNGGAL</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black uppercase text-white tracking-tight">
              Antrean Verifikasi Profil
            </h1>
            <p className="text-xs sm:text-sm text-white/60">
              Pemeriksaan profil entitas, verifikasi akun in-game, dan penerbitan lencana tunggal ESPORT SUMBAR.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchQueue()}
              className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-mono text-white/80 transition-all"
            >
              Segarkan Data
            </button>
          </div>
        </div>

        {/* SLA LEGEND BANNER */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#0B0E17] border border-white/10 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-emerald-400 shrink-0" />
            <span className="text-white/70">
              <strong className="text-emerald-400 font-bold">&lt; 24 Jam:</strong> SLA Optimal
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-amber-400 shrink-0" />
            <span className="text-white/70">
              <strong className="text-amber-400 font-bold">24 - 48 Jam:</strong> Perlu Segera Ditinjau
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 shrink-0" />
            <span className="text-white/70">
              <strong className="text-rose-400 font-bold">&gt; 48 Jam:</strong> SLA Kritis (Tertunda)
            </span>
          </div>
        </div>

        {/* FILTERS & SEARCH BAR */}
        <div className="p-4 rounded-2xl bg-[#0B0E17] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* SEARCH INPUT */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, IGN, atau ESPORT ID..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#FF1752]/60"
            />
          </div>

          {/* STATUS TABS */}
          <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto">
            <button
              onClick={() => setStatusFilter("pending")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                statusFilter === "pending"
                  ? "bg-[#D4AF37] text-black"
                  : "bg-white/[0.04] text-white/60 hover:text-white"
              }`}
            >
              Menunggu Review
            </button>
            <button
              onClick={() => setStatusFilter("revision")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                statusFilter === "revision"
                  ? "bg-amber-500 text-black"
                  : "bg-white/[0.04] text-white/60 hover:text-white"
              }`}
            >
              Perlu Revisi
            </button>
            <button
              onClick={() => setStatusFilter("verified")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                statusFilter === "verified"
                  ? "bg-emerald-500 text-black"
                  : "bg-white/[0.04] text-white/60 hover:text-white"
              }`}
            >
              Terverifikasi
            </button>
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                statusFilter === "all"
                  ? "bg-white/20 text-white"
                  : "bg-white/[0.04] text-white/60 hover:text-white"
              }`}
            >
              Semua
            </button>
          </div>

          {/* DROPDOWN FILTERS */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              aria-label="Filter Bidang Entitas"
              className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white/80 focus:outline-none"
            >
              <option value="all">Semua Bidang</option>
              <option value="player">Player</option>
              <option value="coach">Coach</option>
              <option value="team">Team</option>
              <option value="community">Community</option>
              <option value="venue">Venue</option>
              <option value="school">School</option>
              <option value="campus">Campus</option>
            </select>
          </div>
        </div>

        {/* QUEUE TABLE */}
        <div className="rounded-2xl bg-[#0B0E17] border border-white/10 overflow-hidden shadow-xl">
          {isLoading ? (
            <div className="p-12 text-center text-white/50 text-xs font-mono animate-pulse">
              Memuat data antrean verifikasi...
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center gap-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400/50" />
              <p className="text-sm font-heading font-bold text-white">Tidak Ada Antrean Verifikasi</p>
              <p className="text-xs text-white/40 max-w-sm">
                Seluruh pengajuan verifikasi saat ini telah ditinjau atau tidak cocok dengan filter pencarian.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02] text-white/40 font-mono uppercase text-[10px] tracking-wider">
                    <th className="py-3.5 px-4">SLA</th>
                    <th className="py-3.5 px-4">Entitas & Profil</th>
                    <th className="py-3.5 px-4">Game & Peran</th>
                    <th className="py-3.5 px-4">Wilayah</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Bukti</th>
                    <th className="py-3.5 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {filteredItems.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      {/* SLA INDICATOR */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                              item.slaColor === "green"
                                ? "bg-emerald-400 shadow-sm shadow-emerald-400/50"
                                : item.slaColor === "yellow"
                                ? "bg-amber-400 shadow-sm shadow-amber-400/50 animate-pulse"
                                : "bg-rose-500 shadow-sm shadow-rose-500/50 animate-ping"
                            }`}
                          />
                          <span className="font-mono text-[11px] text-white/70">
                            {item.waitingHours}j
                          </span>
                        </div>
                      </td>

                      {/* PROFILE IDENTITY */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-heading font-bold text-sm text-white group-hover:text-[#D4AF37] transition-colors">
                              {item.name}
                            </span>
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono uppercase tracking-wider bg-white/10 text-white/70">
                              {item.type}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-white/40 font-mono text-[11px]">
                            {item.ign !== "-" && <span className="text-[#FF4D77]">IGN: {item.ign}</span>}
                            <span>•</span>
                            <span>{item.esportId}</span>
                          </div>
                        </div>
                      </td>

                      {/* GAME */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-white/80">
                          <Gamepad2 className="w-3.5 h-3.5 text-blue-400" />
                          <span>{item.game}</span>
                        </div>
                      </td>

                      {/* REGION */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-white/70">
                          <MapPin className="w-3.5 h-3.5 text-white/40" />
                          <span>{item.region}</span>
                        </div>
                      </td>

                      {/* STATUS */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                            item.status === "verified"
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                              : item.status === "revision_requested"
                              ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                              : item.status === "rejected"
                              ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                              : "bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      {/* EVIDENCE COUNT */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-white/60">
                          <FileText className="w-3.5 h-3.5 text-white/40" />
                          <span>{item.documents.length} berkas</span>
                        </div>
                      </td>

                      {/* ACTION BUTTON */}
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setReviewDecision("verified");
                            setReviewReason("");
                            setAdminNotes("");
                            setActionMessage(null);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#D4AF37]/15 hover:bg-[#D4AF37]/30 border border-[#D4AF37]/40 text-[#D4AF37] font-heading font-bold text-xs flex items-center gap-1.5 ml-auto transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Tinjau</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* ============================================================== */}
      {/* REVIEW & DECISION MODAL                                         */}
      {/* ============================================================== */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0A0D15] border border-white/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
            {/* MODAL HEADER */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-white">
                    Pemeriksaan Verifikasi: {selectedItem.name}
                  </h3>
                  <p className="text-xs font-mono text-white/50">
                    ESPORT ID: {selectedItem.esportId} • Domisili: {selectedItem.region}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedItem(null)}
                aria-label="Tutup Dialog"
                className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/10 flex items-center justify-center text-white/70"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* MODAL BODY */}
            <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* KOLOM KIRI: 3D CARD PREVIEW (5 COLS) */}
              <div className="lg:col-span-5 flex flex-col items-center gap-4">
                <span className="text-[11px] font-mono text-white/40 uppercase tracking-wider">
                  Pratinjau Kartu Digital
                </span>
                {cardDataPreview && (
                  <div className="w-full max-w-[280px]">
                    <EsportCard
                      type={(selectedItem.type as CardEntityType) || "player"}
                      rarity={((selectedItem.profileData?.rarityTier || "rookie") as CardRarity)}
                      verification={mapVerificationToCard(selectedItem.status)}
                      data={cardDataPreview}
                      size="sm"
                    />
                  </div>
                )}
                {selectedItem.notes && (
                  <div className="w-full p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white/70 leading-relaxed">
                    <span className="font-mono text-[10px] text-white/40 block mb-1 uppercase">Catatan Pengaju:</span>
                    {selectedItem.notes}
                  </div>
                )}
              </div>

              {/* KOLOM KANAN: DOKUMEN BUKTI & FORM KEPUTUSAN (7 COLS) */}
              <div className="lg:col-span-7 flex flex-col gap-5">
                {/* 1. DAFTAR BERKAS BUKTI */}
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-white/60 mb-2.5">
                    Berkas Bukti Pengajuan ({selectedItem.documents.length})
                  </h4>
                  <div className="flex flex-col gap-2">
                    {selectedItem.documents.map((doc, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-[#0F1320] border border-white/10 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <FileText className="w-4 h-4 text-[#FF4D77] shrink-0" />
                          <div className="flex flex-col truncate">
                            <span className="font-bold text-white truncate">{doc.title}</span>
                            <span className="text-[10px] text-white/40 font-mono">{doc.fileSize}</span>
                          </div>
                        </div>

                        {doc.url && doc.url !== "/images/news-placeholder.jpg" ? (
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 rounded-lg bg-white/[0.08] hover:bg-white/15 text-white/80 text-[11px] font-mono flex items-center gap-1 shrink-0 transition-colors"
                          >
                            <span>Lihat</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-[10px] text-white/30 italic">Pratinjau internal</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. PILIHAN KEPUTUSAN */}
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-white/60 mb-2.5">
                    Tetapkan Keputusan Telaah
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => setReviewDecision("verified")}
                      className={`p-2.5 rounded-xl border text-xs font-heading font-bold flex flex-col items-center gap-1 transition-all ${
                        reviewDecision === "verified"
                          ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                          : "bg-white/[0.02] border-white/10 text-white/60 hover:text-white"
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Setujui</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setReviewDecision("revision_requested")}
                      className={`p-2.5 rounded-xl border text-xs font-heading font-bold flex flex-col items-center gap-1 transition-all ${
                        reviewDecision === "revision_requested"
                          ? "bg-amber-500/20 border-amber-500 text-amber-400"
                          : "bg-white/[0.02] border-white/10 text-white/60 hover:text-white"
                      }`}
                    >
                      <Clock className="w-4 h-4" />
                      <span>Minta Revisi</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setReviewDecision("rejected")}
                      className={`p-2.5 rounded-xl border text-xs font-heading font-bold flex flex-col items-center gap-1 transition-all ${
                        reviewDecision === "rejected"
                          ? "bg-rose-500/20 border-rose-500 text-rose-400"
                          : "bg-white/[0.02] border-white/10 text-white/60 hover:text-white"
                      }`}
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Tolak</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setReviewDecision("suspended")}
                      className={`p-2.5 rounded-xl border text-xs font-heading font-bold flex flex-col items-center gap-1 transition-all ${
                        reviewDecision === "suspended"
                          ? "bg-red-950/40 border-red-700 text-red-400"
                          : "bg-white/[0.02] border-white/10 text-white/60 hover:text-white"
                      }`}
                    >
                      <AlertOctagon className="w-4 h-4" />
                      <span>Tangguhkan</span>
                    </button>
                  </div>
                </div>

                {/* 3. ALASAN KEPUTUSAN & TEMPLATE REASON */}
                {reviewDecision !== "verified" && (
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-mono uppercase text-white/60">
                      Alasan Keputusan (Wajib)
                    </label>

                    {/* Template Reason Pills */}
                    {REASON_TEMPLATES[reviewDecision as keyof typeof REASON_TEMPLATES] && (
                      <div className="flex flex-wrap gap-1.5 mb-1">
                        {REASON_TEMPLATES[reviewDecision as keyof typeof REASON_TEMPLATES].map((tmpl, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setReviewReason(tmpl)}
                            className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[10px] text-white/60 hover:text-white transition-colors text-left"
                          >
                            + {tmpl.substring(0, 45)}...
                          </button>
                        ))}
                      </div>
                    )}

                    <textarea
                      rows={3}
                      value={reviewReason}
                      onChange={(e) => setReviewReason(e.target.value)}
                      placeholder="Tuliskan alasan jelas agar pengaju dapat memperbaiki berkas..."
                      className="w-full p-3 rounded-xl bg-black/40 border border-white/15 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#FF1752]/60 resize-none"
                    />
                  </div>
                )}

                {/* 4. CATATAN INTERNAL ADMIN */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-mono uppercase text-white/50">
                    Catatan Internal Admin (Opsional)
                  </label>
                  <input
                    type="text"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Catatan untuk arsip audit log internal..."
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none"
                  />
                </div>

                {/* ACTION MESSAGE */}
                {actionMessage && (
                  <div
                    className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                      actionMessage.type === "success"
                        ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                        : "bg-rose-500/10 border border-rose-500/30 text-rose-400"
                    }`}
                  >
                    {actionMessage.type === "success" ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                    )}
                    <span>{actionMessage.text}</span>
                  </div>
                )}
              </div>
            </div>

            {/* MODAL FOOTER */}
            <div className="p-4 border-t border-white/10 flex items-center justify-end gap-3 bg-white/[0.02]">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/10 text-xs font-mono text-white/70"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleProcessDecision}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-amber-500 text-black font-heading font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-950/40 hover:opacity-95 transition-opacity disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? "Menyimpan..." : "Simpan Keputusan"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
