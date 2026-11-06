"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Inbox,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  ChevronRight,
  Eye,
  FileText,
  Lock,
  ExternalLink,
  RotateCcw,
  UserCheck,
  Ban,
  Award,
  Hash,
  Sparkles,
  ArrowLeft,
  X,
  Check,
  SlidersHorizontal,
  Layers,
  ChevronDown,
} from "lucide-react";
import {
  VerificationQueueItem,
  ActivityLogItem,
} from "@/data/mockAdminData";

export type AdminRole = "region" | "province" | "platform";

interface MobileAdminPortalProps {
  initialRole?: AdminRole;
  regionName?: string;
  regionCode?: string;
}

export function MobileAdminPortal({
  initialRole = "region",
  regionName = "Kota Padang",
  regionCode = "PDG",
}: MobileAdminPortalProps) {
  // Active Admin Role
  const [role, setRole] = useState<AdminRole>(initialRole);

  // Active Bottom Nav Tab inside Admin Portal
  const [activeTab, setActiveTab] = useState<"home" | "queue" | "logs">("home");

  // Queue Data (Local mutable state for live interaction)
  const [queueItems, setQueueItems] = useState<VerificationQueueItem[]>([]);
  const [logs, setLogs] = useState<ActivityLogItem[]>([]);

  React.useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`/api/admin/queue?scope=${role === "province" ? "province" : "region"}`);
        if (res.ok) {
          const json = await res.json();
          if (json.items && Array.isArray(json.items)) {
            setQueueItems(json.items);
          }
        }
      } catch (err) {
        console.warn("Mobile queue fetch error:", err);
      }
    }
    loadData();
  }, [role]);

  // Selected item for review detail bottom sheet / modal
  const [selectedReviewItem, setSelectedReviewItem] =
    useState<VerificationQueueItem | null>(null);

  // Review detail sub-tab: data | bukti | riwayat
  const [reviewSubTab, setReviewSubTab] = useState<"data" | "bukti" | "riwayat">("data");

  // Filter state for queue
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [slaFilterOnly, setSlaFilterOnly] = useState(false);

  // Revision / Reject Sheet State
  const [actionSheetType, setActionSheetType] = useState<"revision" | "reject" | "suspend" | null>(null);
  const [selectedReasonChip, setSelectedReasonChip] = useState<string>("");
  const [actionNotes, setActionNotes] = useState<string>("");

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Switch Role handler
  const handleRoleChange = (newRole: AdminRole) => {
    setRole(newRole);
    setSelectedReviewItem(null);
    setActionSheetType(null);
  };

  // Metrics calculation
  const pendingCount = queueItems.filter(
    (q) => q.status === "submitted" || q.status === "regional_checked"
  ).length;
  const inReviewCount = queueItems.filter((q) => q.status === "in_review").length;
  const revisionCount = queueItems.filter((q) => q.status === "revision_needed").length;
  const slaAlertsCount = queueItems.filter((q) => q.slaStatus !== "normal").length;

  // Filtered Queue
  const filteredQueue = useMemo(() => {
    return queueItems.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.ign.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.game.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.esportId.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "pending" && (item.status === "submitted" || item.status === "regional_checked")) ||
        (statusFilter === "review" && item.status === "in_review") ||
        (statusFilter === "revision" && item.status === "revision_needed") ||
        (statusFilter === "fallback" && item.isFallback);

      const matchSla = slaFilterOnly ? item.slaStatus !== "normal" : true;

      return matchSearch && matchStatus && matchSla;
    });
  }, [queueItems, searchQuery, statusFilter, slaFilterOnly]);

  // Handle Approve action
  const handleApprove = () => {
    if (!selectedReviewItem) return;
    if (role === "platform") {
      showToast("Operator platform tidak memiliki hak verifikasi");
      return;
    }

    const updated = queueItems.map((item) => {
      if (item.id === selectedReviewItem.id) {
        return {
          ...item,
          status: (role === "province" ? "verified" : "regional_checked") as VerificationQueueItem["status"],
        };
      }
      return item;
    });

    setQueueItems(updated);
    const successTitle =
      role === "province"
        ? `Lencana Emas ESI-SB-VER-2026-${selectedReviewItem.id.slice(-4).toUpperCase()} terbit!`
        : "Lolos Verifikasi Daerah Padang!";
    showToast(successTitle);
    setSelectedReviewItem(null);
  };

  // Handle Submit Revision or Reject
  const handleConfirmAction = () => {
    if (!selectedReviewItem || !actionSheetType) return;
    if (!selectedReasonChip && !actionNotes.trim()) {
      showToast("Pilih alasan wajib");
      return;
    }

    const finalReason = selectedReasonChip
      ? `${selectedReasonChip}: ${actionNotes}`
      : actionNotes;

    const newStatus =
      actionSheetType === "revision"
        ? "revision_needed"
        : actionSheetType === "reject"
        ? "rejected"
        : "revision_needed";

    const updated = queueItems.map((item) => {
      if (item.id === selectedReviewItem.id) {
        return {
          ...item,
          status: newStatus as VerificationQueueItem["status"],
          reviewerNotes: finalReason,
        };
      }
      return item;
    });

    setQueueItems(updated);
    showToast(
      actionSheetType === "revision"
        ? "Revisi dikirim ke atlet"
        : actionSheetType === "reject"
        ? "Pengajuan ditolak"
        : "Profil ditangguhkan"
    );
    setActionSheetType(null);
    setSelectedReviewItem(null);
    setSelectedReasonChip("");
    setActionNotes("");
  };

  // Reason Chips templates
  const reasonChips = [
    "KTM / Kartu Identitas buram",
    "Screenshot game tidak cocok IGN",
    "Bukan domisili Sumatera Barat",
    "Surat rekomendasi kadaluarsa",
    "Format dokumen tidak valid",
  ];

  return (
    <div className="min-h-screen bg-[#07080C] text-[#F3F4F6] pb-24 font-sans select-none relative overflow-x-hidden">
      {/* TOAST FEEDBACK */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-4 left-4 right-4 z-50 flex items-center gap-3 p-3.5 rounded-2xl bg-[#121622]/95 backdrop-blur-xl border border-[#D4AF37]/40 shadow-2xl shadow-black/80 text-white text-xs"
          >
            <div className="w-6 h-6 rounded-lg bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="font-heading font-medium tracking-wide flex-1">
              {toastMessage}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP BAR / ROLE PILL */}
      <header className="sticky top-0 z-30 bg-[#07080C]/90 backdrop-blur-xl border-b border-white/[0.08] px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#D4AF37]/20 to-[#4C7DFF]/20 border border-white/10 flex items-center justify-center text-[#D4AF37]">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-heading font-black uppercase tracking-wider text-white">
                  Portal Admin
                </h1>
                <span className="px-1.5 py-0.2 rounded bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[9px] font-mono text-[#D4AF37] font-bold">
                  {role === "region" ? "Pengcab" : role === "province" ? "Pengprov" : "Operator"}
                </span>
              </div>
              <p className="text-[11px] text-[#8E95A5] font-mono">
                {role === "region"
                  ? `${regionName} (${regionCode})`
                  : role === "province"
                  ? "Sumatera Barat (19 Wilayah)"
                  : "Platform Core V2"}
              </p>
            </div>
          </div>

          {/* Quick Role Switcher Chip for Reviewer Demo */}
          <div className="flex items-center bg-[#0F121A] border border-white/10 rounded-full p-0.5">
            <button
              onClick={() => handleRoleChange("region")}
              className={`px-2 py-1 rounded-full text-[10px] font-mono transition-all ${
                role === "region"
                  ? "bg-[#D4AF37] text-black font-bold shadow"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Daerah
            </button>
            <button
              onClick={() => handleRoleChange("province")}
              className={`px-2 py-1 rounded-full text-[10px] font-mono transition-all ${
                role === "province"
                  ? "bg-[#D4AF37] text-black font-bold shadow"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Provinsi
            </button>
            <button
              onClick={() => handleRoleChange("platform")}
              className={`px-2 py-1 rounded-full text-[10px] font-mono transition-all ${
                role === "platform"
                  ? "bg-[#4C7DFF] text-white font-bold shadow"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Operator
            </button>
          </div>
        </div>
      </header>

      {/* PLATFORM OPERATOR GOVERNANCE NOTICE */}
      {role === "platform" && (
        <div className="mx-4 mt-3 p-3 rounded-2xl bg-blue-950/20 border border-blue-500/20 flex items-start gap-2.5 text-[11px] text-blue-200">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-white">Tata Kelola PBESI: </strong>
            Operator Platform berfokus pada infrastruktur. Tombol verifikasi resmi dinonaktifkan permanen demi independensi kelembagaan ESI.
          </div>
        </div>
      )}

      {/* MAIN VIEWPORT SWITCHER */}
      <main className="px-4 pt-3">
        {/* ===================== VIEW 1: HOME ===================== */}
        {activeTab === "home" && (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* 3 BIG NUMBERS KPI */}
            <div className="grid grid-cols-3 gap-2.5">
              {/* 1. Menunggu */}
              <button
                onClick={() => {
                  setStatusFilter("pending");
                  setActiveTab("queue");
                }}
                className="p-3.5 rounded-2xl bg-[#0F121A] border border-white/[0.08] flex flex-col items-start text-left active:scale-[0.98] transition-transform"
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-[10px] font-heading uppercase text-gray-400">
                    Menunggu
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                </div>
                <span className="text-2xl font-heading font-black text-white">
                  {pendingCount}
                </span>
                <span className="text-[9px] text-[#8E95A5] mt-0.5">Antrean baru</span>
              </button>

              {/* 2. Direview */}
              <button
                onClick={() => {
                  setStatusFilter("review");
                  setActiveTab("queue");
                }}
                className="p-3.5 rounded-2xl bg-[#0F121A] border border-white/[0.08] flex flex-col items-start text-left active:scale-[0.98] transition-transform"
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-[10px] font-heading uppercase text-gray-400">
                    Direview
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                </div>
                <span className="text-2xl font-heading font-black text-amber-300">
                  {inReviewCount}
                </span>
                <span className="text-[9px] text-[#8E95A5] mt-0.5">Proses cek</span>
              </button>

              {/* 3. Perlu Revisi */}
              <button
                onClick={() => {
                  setStatusFilter("revision");
                  setActiveTab("queue");
                }}
                className="p-3.5 rounded-2xl bg-[#0F121A] border border-white/[0.08] flex flex-col items-start text-left active:scale-[0.98] transition-transform"
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-[10px] font-heading uppercase text-gray-400">
                    Revisi
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                </div>
                <span className="text-2xl font-heading font-black text-red-400">
                  {revisionCount}
                </span>
                <span className="text-[9px] text-[#8E95A5] mt-0.5">Tunggu atlet</span>
              </button>
            </div>

            {/* SLA WARNING ROW WITH RED DOT */}
            {slaAlertsCount > 0 && (
              <div
                onClick={() => {
                  setSlaFilterOnly(true);
                  setActiveTab("queue");
                }}
                className="p-3.5 rounded-2xl bg-red-950/20 border border-red-500/30 flex items-center justify-between cursor-pointer active:scale-[0.99] transition-transform shadow-lg shadow-red-950/20"
              >
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                  </span>
                  <div>
                    <div className="text-xs font-heading font-bold text-white flex items-center gap-1.5">
                      <span>Peringatan SLA Pelayanan</span>
                      <span className="px-1.5 py-0.2 rounded bg-red-500/20 text-[9px] text-red-300 font-mono font-bold">
                        {slaAlertsCount} Berkas
                      </span>
                    </div>
                    <p className="text-[10px] text-red-200/80 mt-0.5">
                      Pengajuan melebihi ambang batas komitmen 5 hari kerja
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-red-400 shrink-0" />
              </div>
            )}

            {/* PROVINCE EXCLUSIVE: 19 REGIONS STATUS OVERVIEW WITH FALLBACK BADGE */}
            {role === "province" && (
              <div className="p-4 rounded-2xl bg-[#0F121A] border border-white/[0.08] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-heading font-bold text-white uppercase tracking-wider">
                    Distribusi 19 Wilayah
                  </span>
                  <span className="text-[10px] font-mono text-[#D4AF37]">
                    1 Fallback Aktif
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">Kota Padang</div>
                      <div className="text-[9px] text-gray-400 font-mono">PDG · Aktif</div>
                    </div>
                    <span className="text-xs font-bold text-[#D4AF37]">14 Antrean</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">Kota Bukittinggi</div>
                      <div className="text-[9px] text-gray-400 font-mono">BKT · Aktif</div>
                    </div>
                    <span className="text-xs font-bold text-[#D4AF37]">8 Antrean</span>
                  </div>

                  {/* Pasaman Barat (Fallback) */}
                  <div
                    onClick={() => {
                      setStatusFilter("fallback");
                      setActiveTab("queue");
                    }}
                    className="col-span-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[9px] font-mono font-bold uppercase">
                        Fallback
                      </span>
                      <div>
                        <div className="font-bold text-white">Pasaman Barat</div>
                        <div className="text-[9px] text-amber-200/70">
                          Tanpa Pengcab Aktif · Diampu Langsung Pengprov
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-amber-300">4 Antrean →</span>
                  </div>
                </div>
              </div>
            )}

            {/* CTA BUTTON: BUKA ANTREAN */}
            <button
              onClick={() => {
                setStatusFilter("all");
                setSlaFilterOnly(false);
                setActiveTab("queue");
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-black font-heading font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-amber-950/20 active:scale-[0.98] transition-transform"
            >
              <Inbox className="w-4 h-4" />
              <span>Buka Antrean ({filteredQueue.length})</span>
            </button>

            {/* IMMUTABLE LOG PREVIEW LINK */}
            <div
              onClick={() => setActiveTab("logs")}
              className="p-3.5 rounded-2xl bg-[#0F121A] border border-white/[0.08] flex items-center justify-between cursor-pointer active:scale-[0.99] transition-transform"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center text-gray-400">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-heading font-bold text-white">
                    Audit Log Tamper-Proof
                  </div>
                  <p className="text-[10px] text-gray-400">
                    Riwayat verifikasi tersimpan permanen
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </div>
          </motion.div>
        )}

        {/* ===================== VIEW 2: QUEUE ===================== */}
        {activeTab === "queue" && (
          <motion.div
            key="queue"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {/* SEARCH & FILTER CONTROLS */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari IGN, nama, atau game..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-[#0F121A] border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]/50"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* FILTER CHIPS (1-WORD) */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                <button
                  onClick={() => {
                    setStatusFilter("all");
                    setSlaFilterOnly(false);
                  }}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-heading font-bold whitespace-nowrap transition-all ${
                    statusFilter === "all" && !slaFilterOnly
                      ? "bg-[#D4AF37] text-black"
                      : "bg-[#0F121A] text-gray-400 border border-white/10"
                  }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => {
                    setStatusFilter("pending");
                    setSlaFilterOnly(false);
                  }}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-heading font-bold whitespace-nowrap transition-all ${
                    statusFilter === "pending"
                      ? "bg-blue-500 text-white"
                      : "bg-[#0F121A] text-gray-400 border border-white/10"
                  }`}
                >
                  Menunggu
                </button>
                <button
                  onClick={() => {
                    setStatusFilter("review");
                    setSlaFilterOnly(false);
                  }}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-heading font-bold whitespace-nowrap transition-all ${
                    statusFilter === "review"
                      ? "bg-amber-500 text-black"
                      : "bg-[#0F121A] text-gray-400 border border-white/10"
                  }`}
                >
                  Direview
                </button>
                <button
                  onClick={() => {
                    setStatusFilter("revision");
                    setSlaFilterOnly(false);
                  }}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-heading font-bold whitespace-nowrap transition-all ${
                    statusFilter === "revision"
                      ? "bg-red-500 text-white"
                      : "bg-[#0F121A] text-gray-400 border border-white/10"
                  }`}
                >
                  Revisi
                </button>
                <button
                  onClick={() => {
                    setSlaFilterOnly(!slaFilterOnly);
                  }}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-heading font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
                    slaFilterOnly
                      ? "bg-red-600 text-white"
                      : "bg-[#0F121A] text-red-400 border border-red-500/30"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                  Kritis
                </button>
                {role === "province" && (
                  <button
                    onClick={() => {
                      setStatusFilter("fallback");
                      setSlaFilterOnly(false);
                    }}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-heading font-bold whitespace-nowrap transition-all ${
                      statusFilter === "fallback"
                        ? "bg-amber-400 text-black"
                        : "bg-[#0F121A] text-amber-300 border border-amber-500/30"
                    }`}
                  >
                    Fallback
                  </button>
                )}
              </div>
            </div>

            {/* QUEUE CARDS LIST */}
            <div className="space-y-2.5">
              {filteredQueue.length === 0 ? (
                <div className="py-12 text-center text-gray-500">
                  <Inbox className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-xs">Tidak ada pengajuan ditemukan</p>
                </div>
              ) : (
                filteredQueue.map((item) => {
                  const isSlaCritical = item.slaStatus === "critical";
                  const isSlaWarning = item.slaStatus === "warning";

                  return (
                    <motion.div
                      key={item.id}
                      layout
                      onClick={() => {
                        setSelectedReviewItem(item);
                        setReviewSubTab("data");
                      }}
                      className="p-3.5 rounded-2xl bg-[#0F121A] border border-white/[0.08] flex items-center justify-between gap-3 active:scale-[0.99] transition-transform cursor-pointer relative overflow-hidden group shadow-md"
                    >
                      {/* Left color bar indicator */}
                      <div
                        className={`absolute left-0 top-0 bottom-0 w-1 ${
                          isSlaCritical
                            ? "bg-red-500"
                            : isSlaWarning
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                        }`}
                      />

                      <div className="flex items-center gap-3 pl-1.5">
                        {/* Avatar */}
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#1E2330] to-[#12151D] border border-white/10 flex items-center justify-center font-heading font-black text-sm text-[#D4AF37] shrink-0">
                          {item.ign.slice(0, 2).toUpperCase()}
                        </div>

                        {/* Info */}
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-heading font-black text-white">
                              {item.ign}
                            </span>
                            {item.isFallback && (
                              <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[8px] font-mono font-bold">
                                Fallback
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#8E95A5] truncate max-w-[170px]">
                            {item.name} · {item.game}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[9px] font-mono text-gray-400">
                              {item.regionName}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right SLA Duration & Action */}
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-bold flex items-center gap-1 ${
                            isSlaCritical
                              ? "bg-red-500/20 text-red-400 border border-red-500/40"
                              : isSlaWarning
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                              : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                          }`}
                        >
                          <Clock className="w-2.5 h-2.5" />
                          <span>{item.daysWaiting} hari</span>
                        </span>

                        <span className="text-[10px] font-heading font-bold text-[#D4AF37] flex items-center gap-0.5">
                          <span>Tinjau</span>
                          <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}

        {/* ===================== VIEW 3: LOGS ===================== */}
        {activeTab === "logs" && (
          <motion.div
            key="logs"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {/* IMMUTABLE NOTICE BANNER */}
            <div className="p-3.5 rounded-2xl bg-blue-950/20 border border-blue-500/20 flex items-start gap-2.5 text-[11px] text-blue-200">
              <Lock className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-bold text-white">Log Audit Tersertifikasi: </span>
                Semua tindakan verifikasi tersimpan append-only dengan hash kriptografis untuk mencegah manipulasi data keatletan.
              </div>
            </div>

            {/* LOGS LIST */}
            <div className="space-y-2">
              {logs.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-[#0F121A] border border-white/[0.08] text-xs text-white/40">
                  Belum ada catatan log aktivitas tersimpan.
                </div>
              ) : (
                logs.map((log: ActivityLogItem) => (
                  <div
                    key={log.id}
                    className="p-3.5 rounded-2xl bg-[#0F121A] border border-white/[0.08] space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-heading font-bold text-white">
                        {log.targetName}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                          log.action.includes("Lolos") || log.action.includes("Emas")
                            ? "bg-emerald-500/20 text-emerald-400"
                            : log.action.includes("Revisi")
                            ? "bg-amber-500/20 text-amber-300"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {log.action}
                      </span>
                    </div>

                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      {log.reason}
                    </p>

                    <div className="pt-2 border-t border-white/[0.05] flex items-center justify-between text-[9px] font-mono text-gray-500">
                      <span>{log.actorName}</span>
                      <span>{log.timestamp}</span>
                    </div>

                    {/* HASH PILL */}
                    <div className="text-[8px] font-mono text-[#D4AF37]/60 truncate">
                      SHA256: {log.logHash}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </main>

      {/* ===================== REVIEW DETAIL MODAL / SHEET ===================== */}
      <AnimatePresence>
        {selectedReviewItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col justify-end"
          >
            {/* Sheet Container */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="bg-[#0A0D14] border-t border-white/10 rounded-t-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl"
            >
              {/* Header */}
              <div className="px-5 pt-4 pb-3 border-b border-white/[0.08] flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono text-[#D4AF37]">
                      {selectedReviewItem.esportId}
                    </span>
                    {selectedReviewItem.isFallback && (
                      <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[8px] font-mono">
                        Fallback
                      </span>
                    )}
                  </div>
                  <h2 className="text-base font-heading font-black text-white">
                    {selectedReviewItem.ign}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedReviewItem(null)}
                  className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* SEGMENTED SUB-TABS: Data | Bukti | Riwayat */}
              <div className="px-5 pt-3 flex gap-2 border-b border-white/[0.05]">
                <button
                  onClick={() => setReviewSubTab("data")}
                  className={`pb-2 text-xs font-heading font-bold transition-all ${
                    reviewSubTab === "data"
                      ? "text-[#D4AF37] border-b-2 border-[#D4AF37]"
                      : "text-gray-400"
                  }`}
                >
                  Data
                </button>
                <button
                  onClick={() => setReviewSubTab("bukti")}
                  className={`pb-2 text-xs font-heading font-bold transition-all ${
                    reviewSubTab === "bukti"
                      ? "text-[#D4AF37] border-b-2 border-[#D4AF37]"
                      : "text-gray-400"
                  }`}
                >
                  Bukti Dokumen
                </button>
                <button
                  onClick={() => setReviewSubTab("riwayat")}
                  className={`pb-2 text-xs font-heading font-bold transition-all ${
                    reviewSubTab === "riwayat"
                      ? "text-[#D4AF37] border-b-2 border-[#D4AF37]"
                      : "text-gray-400"
                  }`}
                >
                  Riwayat
                </button>
              </div>

              {/* SHEET CONTENT SCROLLER */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                {/* SUB-TAB 1: DATA */}
                {reviewSubTab === "data" && (
                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Nama Asli</span>
                        <span className="font-bold text-white">
                          {selectedReviewItem.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Game Utama</span>
                        <span className="font-bold text-white">
                          {selectedReviewItem.game}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Peran Tim</span>
                        <span className="font-bold text-white">
                          {selectedReviewItem.role}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Wilayah PBESI</span>
                        <span className="font-bold text-white">
                          {selectedReviewItem.regionName} ({selectedReviewItem.regionCode})
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Diajukan Pada</span>
                        <span className="font-mono text-gray-300">
                          {new Date(selectedReviewItem.submittedAt).toLocaleDateString(
                            "id-ID"
                          )}
                        </span>
                      </div>
                    </div>

                    {/* VERIFICATION CHECKLIST */}
                    <div className="p-3.5 rounded-xl bg-[#0F121A] border border-white/[0.08] space-y-2">
                      <span className="font-heading font-bold text-white text-[11px] uppercase tracking-wider block">
                        Daftar Periksa Berkas
                      </span>
                      <label className="flex items-center gap-2.5 text-xs text-gray-300">
                        <input
                          type="checkbox"
                          defaultChecked={selectedReviewItem.checklist?.identityVerified ?? false}
                          className="w-4 h-4 rounded accent-[#D4AF37]"
                        />
                        <span>Identitas asli sesuai data pendaftaran</span>
                      </label>
                      <label className="flex items-center gap-2.5 text-xs text-gray-300">
                        <input
                          type="checkbox"
                          defaultChecked={selectedReviewItem.checklist?.domicileVerified ?? false}
                          className="w-4 h-4 rounded accent-[#D4AF37]"
                        />
                        <span>Domisili sah di wilayah Sumatera Barat</span>
                      </label>
                      <label className="flex items-center gap-2.5 text-xs text-gray-300">
                        <input
                          type="checkbox"
                          defaultChecked={selectedReviewItem.checklist?.gameProofVerified ?? false}
                          className="w-4 h-4 rounded accent-[#D4AF37]"
                        />
                        <span>Screenshot profil akun game terverifikasi</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* SUB-TAB 2: BUKTI DOKUMEN */}
                {reviewSubTab === "bukti" && (
                  <div className="space-y-3">
                    <div className="p-2.5 rounded-xl bg-blue-950/20 border border-blue-500/20 flex items-center gap-2 text-[10px] text-blue-200">
                      <Lock className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                      <span>
                        URL terenkripsi & kedaluwarsa 15 menit. Tidak ada KTP/NIK disimpan.
                      </span>
                    </div>

                    {(selectedReviewItem.documents || []).map((doc, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-[#0F121A] border border-white/[0.08] space-y-2"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-white">{doc.title}</span>
                          <span className="text-[10px] font-mono text-gray-400">
                            {doc.fileSize}
                          </span>
                        </div>
                        {/* Image Preview */}
                        <div className="h-36 rounded-lg overflow-hidden bg-black/40 border border-white/10 relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={doc.url}
                            alt={doc.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* SUB-TAB 3: RIWAYAT */}
                {reviewSubTab === "riwayat" && (
                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Status Saat Ini:</span>
                        <span className="font-bold uppercase text-[#D4AF37]">
                          {selectedReviewItem.status}
                        </span>
                      </div>
                      {selectedReviewItem.regionalReviewer && (
                        <div className="pt-2 border-t border-white/[0.05] space-y-1">
                          <span className="text-gray-400 block">Pemeriksa Daerah:</span>
                          <div className="font-bold text-white">
                            {selectedReviewItem.regionalReviewer.name} (
                            {selectedReviewItem.regionalReviewer.role})
                          </div>
                          <div className="text-[10px] text-gray-300">
                            &quot;{selectedReviewItem.regionalReviewer.notes}&quot;
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* STICKY BOTTOM ACTION BAR */}
              <div className="p-4 border-t border-white/[0.08] bg-[#0A0D14]">
                {role === "platform" ? (
                  /* OPERATOR GUARD: NO VERIFICATION BUTTONS */
                  <div className="text-center py-2 text-xs text-gray-400">
                    Mode Pengawasan Platform — Tindakan verifikasi resmi didelegasikan ke Pengprov ESI.
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {/* PRIMARY APPROVE BUTTON */}
                    <button
                      onClick={handleApprove}
                      className={`flex-1 py-3 rounded-xl font-heading font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg active:scale-[0.98] transition-transform ${
                        role === "province"
                          ? "bg-gradient-to-r from-[#D4AF37] to-[#E5C358] text-black shadow-amber-950/20"
                          : "bg-gradient-to-r from-emerald-500 to-teal-500 text-black shadow-emerald-950/20"
                      }`}
                    >
                      <Check className="w-4 h-4" />
                      <span>
                        {role === "province" ? "Verifikasi Emas" : "Setujui Daerah"}
                      </span>
                    </button>

                    {/* REVISION BUTTON */}
                    <button
                      onClick={() => setActionSheetType("revision")}
                      className="px-4 py-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-heading font-bold text-xs uppercase active:scale-[0.98] transition-transform"
                    >
                      Revisi
                    </button>

                    {/* REJECT BUTTON */}
                    <button
                      onClick={() => setActionSheetType("reject")}
                      className="px-4 py-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 font-heading font-bold text-xs uppercase active:scale-[0.98] transition-transform"
                    >
                      Tolak
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================== REVISI / TOLAK BOTTOM SHEET ===================== */}
      <AnimatePresence>
        {actionSheetType && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex flex-col justify-end"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="bg-[#0D1017] border-t border-white/10 rounded-t-3xl p-5 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-heading font-black uppercase text-white">
                  {actionSheetType === "revision" ? "Minta Revisi" : "Tolak Pengajuan"}
                </h3>
                <button
                  onClick={() => setActionSheetType(null)}
                  className="w-7 h-7 rounded-full bg-white/[0.05] flex items-center justify-center text-gray-400"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Mandatory chip reasons */}
              <div className="space-y-1.5">
                <span className="text-[11px] text-gray-400 font-bold block">
                  Pilih Alasan Wajib:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {reasonChips.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => setSelectedReasonChip(chip)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all ${
                        selectedReasonChip === chip
                          ? "bg-[#D4AF37] text-black font-bold"
                          : "bg-white/[0.04] text-gray-300 border border-white/10"
                      }`}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Free notes */}
              <div className="space-y-1">
                <span className="text-[11px] text-gray-400 font-bold block">
                  Catatan Tambahan:
                </span>
                <textarea
                  rows={3}
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  placeholder="Instruksi jelas untuk atlet..."
                  className="w-full p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]/50"
                />
              </div>

              {/* Submit Action */}
              <button
                onClick={handleConfirmAction}
                className={`w-full py-3 rounded-xl font-heading font-black text-xs uppercase tracking-wider text-black shadow-lg ${
                  actionSheetType === "revision"
                    ? "bg-amber-400 shadow-amber-950/20"
                    : "bg-red-500 text-white shadow-red-950/20"
                }`}
              >
                {actionSheetType === "revision" ? "Kirimkan Revisi" : "Konfirmasi Tolak"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================== BOTTOM ADMIN NAV BAR ===================== */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#07080C]/95 backdrop-blur-xl border-t border-white/[0.08] px-4 py-2">
        <div className="max-w-md mx-auto grid grid-cols-3 gap-2">
          <button
            onClick={() => setActiveTab("home")}
            className={`py-2 rounded-xl flex flex-col items-center gap-1 transition-all ${
              activeTab === "home" ? "text-[#D4AF37]" : "text-gray-500"
            }`}
          >
            <Shield className="w-4 h-4" />
            <span className="text-[10px] font-heading font-bold uppercase tracking-wider">
              Beranda
            </span>
          </button>

          <button
            onClick={() => setActiveTab("queue")}
            className={`py-2 rounded-xl flex flex-col items-center gap-1 transition-all relative ${
              activeTab === "queue" ? "text-[#D4AF37]" : "text-gray-500"
            }`}
          >
            <Inbox className="w-4 h-4" />
            {slaAlertsCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-red-500 absolute top-1.5 right-6" />
            )}
            <span className="text-[10px] font-heading font-bold uppercase tracking-wider">
              Antrean
            </span>
          </button>

          <button
            onClick={() => setActiveTab("logs")}
            className={`py-2 rounded-xl flex flex-col items-center gap-1 transition-all ${
              activeTab === "logs" ? "text-[#D4AF37]" : "text-gray-500"
            }`}
          >
            <Lock className="w-4 h-4" />
            <span className="text-[10px] font-heading font-bold uppercase tracking-wider">
              Audit
            </span>
          </button>
        </div>
      </nav>
    </div>
  );
}
