"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Inbox,
  Search,
  Filter,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  UserCheck,
  ArrowUpDown,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Shield,
  Layers,
  X,
  CheckSquare,
  Square,
} from "lucide-react";
import { AdminRegionNavbar } from "@/components/admin/AdminRegionNavbar";
import { Footer } from "@/components/layout/Footer";
import { VerificationQueueItem } from "@/data/mockAdminData";

export default function AdminRegionQueuePage() {
  const [queueItems, setQueueItems] = useState<VerificationQueueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterGame, setFilterGame] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"longest" | "newest" | "name">("longest");

  React.useEffect(() => {
    async function loadQueue() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/admin/queue?scope=region");
        if (res.ok) {
          const json = await res.json();
          if (json.items && Array.isArray(json.items)) {
            setQueueItems(json.items);
          } else {
            setQueueItems([]);
          }
        }
      } catch (err) {
        console.warn("Region queue error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadQueue();
  }, []);

  // Selection for bulk actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter & Sort
  const filteredItems = useMemo(() => {
    return queueItems
      .filter((item) => {
        const matchesSearch =
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.ign.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.esportId.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = filterStatus === "all" || item.status === filterStatus;
        const matchesType = filterType === "all" || item.type === filterType;
        const matchesGame =
          filterGame === "all" || item.game.toLowerCase().includes(filterGame.toLowerCase());

        return matchesSearch && matchesStatus && matchesType && matchesGame;
      })
      .sort((a, b) => {
        if (sortBy === "longest") return b.daysWaiting - a.daysWaiting;
        if (sortBy === "newest") return a.daysWaiting - b.daysWaiting;
        return a.ign.localeCompare(b.ign);
      });
  }, [queueItems, searchQuery, filterStatus, filterType, filterGame, sortBy]);

  // Bulk assignment
  const handleAssignToMe = () => {
    if (selectedIds.length === 0) return;
    setQueueItems((prev) =>
      prev.map((item) =>
        selectedIds.includes(item.id)
          ? {
              ...item,
              status: "in_review",
              assignedTo: "Admin Pengcab Padang #01 (Saya)",
            }
          : item
      )
    );
    showToast(`${selectedIds.length} pengajuan berhasil ditetapkan ke Anda.`);
    setSelectedIds([]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredItems.map((i) => i.id));
    }
  };

  const toggleSelectItem = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-[#0B0D12] text-[#F3F4F6] flex flex-col font-sans">
      <AdminRegionNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        {/* TOAST NOTIFICATION */}
        {toastMessage && (
          <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1A1E28] border border-[#22C55E] text-white text-xs font-heading font-medium shadow-2xl animate-in slide-in-from-top-4">
            <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* BREADCRUMB & HEADER */}
        <div className="flex flex-col gap-2 mb-6">
          <nav className="flex items-center gap-2 text-xs text-[#9AA3B2] font-mono mb-1">
            <Link href="/admin/region" className="hover:text-white transition-colors">
              Admin Daerah
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#D4AF37] font-bold">Antrean Pengajuan</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#262B38] pb-5">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-heading font-black uppercase text-white tracking-tight flex items-center gap-2.5">
                  <Inbox className="w-7 h-7 text-[#D4AF37]" />
                  <span>Antrean Verifikasi Daerah (Kota Padang)</span>
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-xs font-mono font-bold text-[#D4AF37]">
                  {filteredItems.length} Pengajuan
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#9AA3B2] mt-1 max-w-2xl leading-relaxed">
                Pilih pengajuan untuk memeriksa kelengkapan bukti identitas, domisili, dan kepesertaan klub. Loloskan pengajuan yang memenuhi syarat untuk dikirim ke ESI Provinsi.
              </p>
            </div>

            {/* BULK ACTION BAR */}
            {selectedIds.length > 0 && (
              <div className="flex items-center gap-2 bg-[#1A1E28] px-3.5 py-2 rounded-xl border border-[#D4AF37]/40 shadow-lg animate-in fade-in">
                <span className="text-xs font-mono text-white font-bold">
                  {selectedIds.length} dipilih
                </span>
                <button
                  type="button"
                  onClick={handleAssignToMe}
                  className="px-3 py-1.5 rounded-lg bg-[#D4AF37] text-black text-xs font-heading font-extrabold uppercase hover:brightness-110 transition-all"
                >
                  Tetapkan ke Saya
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedIds([])}
                  className="p-1 text-gray-400 hover:text-white"
                  title="Batalkan pilihan"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* FILTERS & SEARCH CONTROLS */}
        <div className="p-4 rounded-2xl bg-[#12151C] border border-[#262B38] mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-md">
          {/* SEARCH INPUT */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berdasarkan IGN, Nama Lengkap, atau ESPORT ID..."
              className="w-full bg-[#161922] border border-[#262B38] focus:border-[#D4AF37] rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none font-mono"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* FILTER DROPDOWNS */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-[#161922] border border-[#262B38] text-xs font-medium text-white px-3 py-2 rounded-xl focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="all">Semua Status</option>
              <option value="submitted">Menunggu Ditinjau</option>
              <option value="in_review">Sedang Ditinjau</option>
              <option value="revision_needed">Perlu Revisi</option>
            </select>

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-[#161922] border border-[#262B38] text-xs font-medium text-white px-3 py-2 rounded-xl focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="all">Semua Tipe</option>
              <option value="player">Player (Atlet)</option>
              <option value="coach">Pelatih (Coach)</option>
              <option value="team">Klub / Tim</option>
            </select>

            {/* Sort Order */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#161922] border border-[#262B38] text-xs font-medium text-white px-3 py-2 rounded-xl focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="longest">SLA Kritis (Terlama)</option>
              <option value="newest">Pengajuan Terbaru</option>
              <option value="name">Nama / IGN (A-Z)</option>
            </select>
          </div>
        </div>

        {/* QUEUE TABLE (DESKTOP) & CARDS (MOBILE) */}
        {filteredItems.length > 0 ? (
          <div className="bg-[#12151C] border border-[#262B38] rounded-2xl overflow-hidden shadow-xl">
            {/* DESKTOP TABLE */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#161922] border-b border-[#262B38] text-gray-400 font-heading font-bold uppercase tracking-wider">
                    <th className="p-3.5 w-10 text-center">
                      <button
                        type="button"
                        onClick={toggleSelectAll}
                        className="text-gray-400 hover:text-white"
                        title="Tandai semua"
                      >
                        {selectedIds.length === filteredItems.length ? (
                          <CheckSquare className="w-4 h-4 text-[#D4AF37]" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </th>
                    <th className="p-3.5">Nama & IGN</th>
                    <th className="p-3.5">Jenis & Game</th>
                    <th className="p-3.5">Tanggal Masuk</th>
                    <th className="p-3.5">Lama Menunggu (SLA)</th>
                    <th className="p-3.5">Status Pengajuan</th>
                    <th className="p-3.5">Petugas Peninjau</th>
                    <th className="p-3.5 text-right">Aksi</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#262B38]/70">
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-16 text-center text-xs text-gray-400">
                        <Inbox className="w-10 h-10 mx-auto text-white/20 mb-3" />
                        <p className="font-heading font-bold text-sm text-white mb-1">
                          Antrean Verifikasi Daerah Kosong
                        </p>
                        <p className="text-[11px] text-gray-500 max-w-sm mx-auto">
                          Saat ini belum ada pengajuan verifikasi kartu atlet baru yang masuk ke antrean wilayah ini.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item) => {
                    const isSelected = selectedIds.includes(item.id);

                    return (
                      <tr
                        key={item.id}
                        className={`hover:bg-[#161922]/70 transition-colors ${
                          isSelected ? "bg-[#1A1E28]/60" : ""
                        }`}
                      >
                        {/* SELECT CHECKBOX */}
                        <td className="p-3.5 text-center">
                          <button
                            type="button"
                            onClick={() => toggleSelectItem(item.id)}
                            className="text-gray-400 hover:text-white"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-[#D4AF37]" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                        </td>

                        {/* NAMA & IGN */}
                        <td className="p-3.5">
                          <div className="flex flex-col">
                            <span className="font-heading font-bold text-white text-sm uppercase">
                              {item.ign}
                            </span>
                            <span className="text-[#9AA3B2] text-xs">{item.name}</span>
                            <span className="text-[10px] text-gray-500 font-mono mt-0.5">
                              {item.esportId}
                            </span>
                          </div>
                        </td>

                        {/* JENIS & GAME */}
                        <td className="p-3.5">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1.5">
                              <span className="px-2 py-0.2 rounded text-[10px] font-mono uppercase bg-[#1A1E28] text-[#D4AF37] font-bold">
                                {item.type}
                              </span>
                            </div>
                            <span className="text-gray-300 font-medium mt-1">{item.game}</span>
                            <span className="text-[10px] text-gray-400">{item.role}</span>
                          </div>
                        </td>

                        {/* TANGGAL MASUK */}
                        <td className="p-3.5 font-mono text-gray-300">
                          {new Date(item.submittedAt).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>

                        {/* SLA BADGE */}
                        <td className="p-3.5">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold flex items-center gap-1.5 ${
                                item.slaStatus === "critical"
                                  ? "bg-red-950/80 text-red-400 border border-red-700"
                                  : item.slaStatus === "warning"
                                  ? "bg-amber-950/80 text-amber-400 border border-amber-700"
                                  : "bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  item.slaStatus === "critical"
                                    ? "bg-red-400 animate-pulse"
                                    : item.slaStatus === "warning"
                                    ? "bg-amber-400"
                                    : "bg-[#22C55E]"
                                }`}
                              />
                              <span>{item.daysWaiting} Hari</span>
                            </span>
                          </div>
                        </td>

                        {/* STATUS PENGAJUAN */}
                        <td className="p-3.5">
                          {item.status === "submitted" && (
                            <span className="px-2.5 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-[10px] font-mono font-bold">
                              Menunggu
                            </span>
                          )}
                          {item.status === "in_review" && (
                            <span className="px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-bold">
                              Sedang Ditinjau
                            </span>
                          )}
                          {item.status === "revision_needed" && (
                            <span className="px-2.5 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-[10px] font-mono font-bold">
                              Perlu Revisi
                            </span>
                          )}
                        </td>

                        {/* PETUGAS PENINJAU */}
                        <td className="p-3.5 text-gray-400 text-[11px]">
                          {item.assignedTo ? (
                            <span className="text-gray-200 font-mono bg-[#161922] px-2 py-0.5 rounded border border-[#262B38]">
                              {item.assignedTo}
                            </span>
                          ) : (
                            <span className="text-gray-500 italic">Belum diambil</span>
                          )}
                        </td>

                        {/* AKSI */}
                        <td className="p-3.5 text-right">
                          <Link
                            href={`/admin/region/review/${item.id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1A1E28] hover:bg-[#D4AF37] text-gray-200 hover:text-black font-heading font-bold text-xs uppercase transition-colors"
                          >
                            <span>Tinjau</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </td>
                      </tr>
                    );
                  }))}
                </tbody>
              </table>
            </div>

            {/* MOBILE CARD LIST (RESPONSIVE FALLBACK) */}
            <div className="md:hidden divide-y divide-[#262B38]">
              {filteredItems.map((item) => (
                <div key={item.id} className="p-4 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-mono text-[#D4AF37] font-bold">
                        {item.type.toUpperCase()} • {item.game}
                      </span>
                      <h4 className="font-heading font-bold text-base text-white uppercase mt-0.5">
                        {item.ign}
                      </h4>
                      <p className="text-xs text-[#9AA3B2]">{item.name}</p>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold shrink-0 ${
                        item.slaStatus === "critical"
                          ? "bg-red-950 text-red-400 border border-red-700"
                          : item.slaStatus === "warning"
                          ? "bg-amber-950 text-amber-400 border border-amber-700"
                          : "bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30"
                      }`}
                    >
                      {item.daysWaiting} Hari
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono">
                    <span>ID: {item.esportId}</span>
                    <span>Status: <strong className="text-white">{item.status}</strong></span>
                  </div>

                  <Link
                    href={`/admin/region/review/${item.id}`}
                    className="w-full py-2 rounded-xl bg-[#D4AF37] text-black text-center text-xs font-heading font-bold uppercase"
                  >
                    Tinjau Dokumen & Setujui →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="p-12 text-center rounded-2xl bg-[#12151C] border border-[#262B38] flex flex-col items-center gap-3">
            <Inbox className="w-10 h-10 text-gray-500 mb-1" />
            <h3 className="font-heading font-bold text-base uppercase text-white">
              Tidak Ada Pengajuan Menunggu
            </h3>
            <p className="text-xs text-[#9AA3B2] max-w-md">
              Seluruh berkas verifikasi atlet, pelatih, dan klub di Kota Padang telah selesai diproses atau tidak cocok dengan filter pencarian Anda.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setFilterStatus("all");
                setFilterType("all");
                setFilterGame("all");
              }}
              className="mt-2 px-4 py-2 rounded-xl bg-[#1A1E28] hover:bg-[#262B38] text-xs font-heading font-bold text-[#D4AF37] uppercase transition-colors"
            >
              Reset Semua Filter
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
