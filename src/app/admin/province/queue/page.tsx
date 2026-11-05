"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Award,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronRight,
  MapPin,
  X,
  FileCheck,
  Shield,
  Layers,
  ArrowRight,
  Inbox,
} from "lucide-react";
import { AdminProvinceNavbar } from "@/components/admin/AdminProvinceNavbar";
import { Footer } from "@/components/layout/Footer";
import { REGIONS_DETAIL } from "@/data/regions";
import { VerificationQueueItem } from "@/data/mockAdminData";

export default function AdminProvinceQueuePage() {
  const [queueItems, setQueueItems] = useState<VerificationQueueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatusTab, setSelectedStatusTab] = useState<"all" | "gold_ready" | "fallback">("all");

  React.useEffect(() => {
    async function loadQueue() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/admin/queue?scope=province");
        if (res.ok) {
          const json = await res.json();
          if (json.items && Array.isArray(json.items)) {
            setQueueItems(json.items);
          } else {
            setQueueItems([]);
          }
        }
      } catch (err) {
        console.warn("Province queue error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadQueue();
  }, []);

  const filteredItems = useMemo(() => {
    return queueItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.ign.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.esportId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.regionName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRegion = selectedRegion === "all" || item.regionCode === selectedRegion;
      const matchesType = selectedType === "all" || item.type === selectedType;

      const matchesTab =
        selectedStatusTab === "all"
          ? true
          : selectedStatusTab === "gold_ready"
          ? item.status === "regional_checked"
          : item.isFallback === true;

      return matchesSearch && matchesRegion && matchesType && matchesTab;
    });
  }, [queueItems, searchQuery, selectedRegion, selectedType, selectedStatusTab]);

  return (
    <div className="min-h-screen bg-[#0B0D12] text-[#F3F4F6] flex flex-col font-sans">
      <AdminProvinceNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        {/* BREADCRUMB */}
        <div className="flex flex-col gap-2 mb-6">
          <nav className="flex items-center gap-2 text-xs text-[#9AA3B2] font-mono mb-1">
            <Link href="/admin/province" className="hover:text-white transition-colors">
              Admin Provinsi
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#D4AF37] font-bold">Antrean Pengesahan Emas</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#262B38] pb-5">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-heading font-black uppercase text-white tracking-tight flex items-center gap-2.5">
                  <Award className="w-7 h-7 text-[#D4AF37]" />
                  <span>Antrean Pengesahan Lencana Emas ESI Sumbar</span>
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-xs font-mono font-bold text-[#D4AF37]">
                  {filteredItems.length} Pengajuan
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#9AA3B2] mt-1 max-w-2xl leading-relaxed">
                Berkas dari 19 Kota/Kabupaten yang telah lolos verifikasi daerah atau masuk melalui jalur wilayah fallback tanpa pengcab.
              </p>
            </div>
          </div>
        </div>

        {/* TABS & FILTERS */}
        <div className="flex flex-col gap-4 mb-6">
          {/* TOP QUICK TABS */}
          <div className="flex items-center gap-2 border-b border-[#262B38] pb-1 overflow-x-auto">
            <button
              type="button"
              onClick={() => setSelectedStatusTab("all")}
              className={`px-4 py-2 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-colors ${
                selectedStatusTab === "all"
                  ? "bg-[#1A1E28] text-[#D4AF37] border border-[#D4AF37]/40 shadow-sm"
                  : "text-gray-400 hover:text-white hover:bg-[#161922]"
              }`}
            >
              Semua Berkas ({queueItems.length})
            </button>

            <button
              type="button"
              onClick={() => setSelectedStatusTab("gold_ready")}
              className={`px-4 py-2 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                selectedStatusTab === "gold_ready"
                  ? "bg-[#1A1E28] text-[#D4AF37] border border-[#D4AF37]/40 shadow-sm"
                  : "text-gray-400 hover:text-white hover:bg-[#161922]"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
              <span>Siap Pengesahan Emas (Lolos Daerah)</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedStatusTab("fallback")}
              className={`px-4 py-2 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                selectedStatusTab === "fallback"
                  ? "bg-[#1A1E28] text-purple-400 border border-purple-500/40 shadow-sm"
                  : "text-gray-400 hover:text-white hover:bg-[#161922]"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <span>Jalur Wilayah Fallback (Tanpa Pengcab)</span>
            </button>
          </div>

          {/* SEARCH & SELECT FILTERS */}
          <div className="p-4 rounded-2xl bg-[#12151C] border border-[#262B38] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-md">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari IGN, nama atlet/klub, wilayah, atau nomor ESPORT ID..."
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

            <div className="flex items-center gap-2 flex-wrap">
              {/* Region Dropdown */}
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="bg-[#161922] border border-[#262B38] text-xs font-medium text-white px-3 py-2 rounded-xl focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="all">Semua 19 Wilayah</option>
                {REGIONS_DETAIL.map((r) => (
                  <option key={r.code} value={r.code}>
                    {r.name} ({r.code})
                  </option>
                ))}
              </select>

              {/* Entity Type Dropdown */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-[#161922] border border-[#262B38] text-xs font-medium text-white px-3 py-2 rounded-xl focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="all">Semua Tipe</option>
                <option value="player">Player (Atlet)</option>
                <option value="coach">Pelatih (Coach)</option>
                <option value="team">Klub / Tim</option>
              </select>
            </div>
          </div>
        </div>

        {/* PROVINCE QUEUE TABLE (DESKTOP) & CARDS (MOBILE) */}
        {filteredItems.length > 0 ? (
          <div className="bg-[#12151C] border border-[#262B38] rounded-2xl overflow-hidden shadow-xl">
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#161922] border-b border-[#262B38] text-gray-400 font-heading font-bold uppercase tracking-wider">
                    <th className="p-3.5">Nama & IGN</th>
                    <th className="p-3.5">Asal Wilayah (Daerah)</th>
                    <th className="p-3.5">Tipe & Game</th>
                    <th className="p-3.5">Status Pemeriksaan</th>
                    <th className="p-3.5">Catatan Verifikator Pengcab</th>
                    <th className="p-3.5 text-right">Aksi Pengesahan</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#262B38]/70">
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-16 text-center text-xs text-gray-400">
                        <Inbox className="w-10 h-10 mx-auto text-white/20 mb-3" />
                        <p className="font-heading font-bold text-sm text-white mb-1">
                          Antrean Pengesahan Emas Kosong
                        </p>
                        <p className="text-[11px] text-gray-500 max-w-sm mx-auto">
                          Saat ini belum ada pengajuan verifikasi yang menunggu pengesahan tingkat provinsi.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-[#161922]/70 transition-colors">
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

                      {/* ASAL WILAYAH & FALLBACK BADGE */}
                      <td className="p-3.5">
                        <div className="flex flex-col gap-1 items-start">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                            <strong className="text-white text-xs">{item.regionName}</strong>
                          </div>

                          {item.isFallback ? (
                            <span className="px-2 py-0.5 rounded-full bg-purple-950/80 border border-purple-700 text-purple-300 text-[9px] font-mono font-bold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                              Wilayah tanpa admin (fallback)
                            </span>
                          ) : (
                            <span className="text-[10px] text-gray-400 font-mono">
                              Pengcab: {item.regionCode}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* TIPE & GAME */}
                      <td className="p-3.5">
                        <div className="flex flex-col">
                          <span className="px-2 py-0.2 rounded text-[10px] font-mono uppercase bg-[#1A1E28] text-[#D4AF37] font-bold w-max">
                            {item.type}
                          </span>
                          <span className="text-gray-300 font-medium mt-1">{item.game}</span>
                          <span className="text-[10px] text-gray-400">{item.role}</span>
                        </div>
                      </td>

                      {/* STATUS PEMERIKSAAN */}
                      <td className="p-3.5">
                        {item.status === "regional_checked" ? (
                          <span className="px-2.5 py-1 rounded-full bg-[#22C55E]/15 border border-[#22C55E]/30 text-[#22C55E] text-[10px] font-mono font-bold flex items-center gap-1.5 w-max">
                            <CheckCircle2 className="w-3 h-3" />
                            Lolos Daerah ESI
                          </span>
                        ) : item.isFallback ? (
                          <span className="px-2.5 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-400 text-[10px] font-mono font-bold flex items-center gap-1.5 w-max">
                            <Clock className="w-3 h-3" />
                            Butuh Review Fallback
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-[10px] font-mono font-bold">
                            Menunggu
                          </span>
                        )}
                      </td>

                      {/* CATATAN DAERAH */}
                      <td className="p-3.5 text-gray-300 text-xs max-w-xs leading-relaxed">
                        {item.regionalReviewer ? (
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] text-[#22C55E] font-mono">
                              Oleh: {item.regionalReviewer.name}
                            </span>
                            <span className="text-gray-300 text-[11px]">
                              &ldquo;{item.regionalReviewer.notes}&rdquo;
                            </span>
                          </div>
                        ) : item.isFallback ? (
                          <span className="text-purple-300 text-[11px] italic">
                            Jalur langsung ESI Provinsi (Belum ada pengurus cabang aktif di wilayah ini).
                          </span>
                        ) : (
                          <span className="text-gray-500 italic">Belum ada catatan daerah</span>
                        )}
                      </td>

                      {/* AKSI */}
                      <td className="p-3.5 text-right whitespace-nowrap">
                        {item.isFallback ? (
                          <Link
                            href={`/admin/province/review/${item.id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-900/60 hover:bg-purple-800 text-purple-200 border border-purple-600 font-heading font-bold text-xs uppercase transition-colors"
                          >
                            <span>Periksa Tahap Daerah</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        ) : (
                          <Link
                            href={`/admin/province/review/${item.id}`}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#E5C358] hover:brightness-110 text-black font-heading font-extrabold text-xs uppercase shadow-sm transition-all"
                          >
                            <Award className="w-3.5 h-3.5" />
                            <span>Verifikasi Resmi</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        )}
                      </td>
                    </tr>
                  )))}
                </tbody>
              </table>
            </div>

            {/* MOBILE CARDS */}
            <div className="md:hidden divide-y divide-[#262B38]">
              {filteredItems.map((item) => (
                <div key={item.id} className="p-4 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-mono text-[#D4AF37] font-bold">
                          {item.type.toUpperCase()} • {item.game}
                        </span>
                        {item.isFallback && (
                          <span className="px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-700 text-[9px] font-mono font-bold">
                            FALLBACK
                          </span>
                        )}
                      </div>
                      <h4 className="font-heading font-bold text-base text-white uppercase mt-0.5">
                        {item.ign}
                      </h4>
                      <p className="text-xs text-[#9AA3B2]">{item.name}</p>
                    </div>

                    <span className="text-[10px] font-mono text-gray-400 bg-[#161922] px-2 py-0.5 rounded border border-[#262B38]">
                      {item.regionCode}
                    </span>
                  </div>

                  <p className="text-[11px] text-gray-300 leading-relaxed bg-[#161922] p-2.5 rounded-lg border border-[#262B38]">
                    {item.regionalReviewer?.notes || "Jalur langsung ESI Provinsi (Wilayah Fallback)"}
                  </p>

                  <Link
                    href={`/admin/province/review/${item.id}`}
                    className="w-full py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E5C358] text-black text-center text-xs font-heading font-extrabold uppercase shadow-md flex items-center justify-center gap-1.5"
                  >
                    <Award className="w-4 h-4" />
                    <span>{item.isFallback ? "Periksa & Verifikasi Fallback" : "Buka Sidang Verifikasi Resmi"}</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-12 text-center rounded-2xl bg-[#12151C] border border-[#262B38] text-xs text-gray-400">
            Tidak ada pengajuan verifikasi yang cocok dengan filter pencarian Anda.
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
