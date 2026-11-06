"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Database,
  Gamepad2,
  Newspaper,
  MapPin,
  Plus,
  CheckCircle2,
  XCircle,
  ToggleLeft,
  ToggleRight,
  ChevronRight,
  Sparkles,
  Building,
  Edit,
  X,
} from "lucide-react";
import { AdminPlatformNavbar } from "@/components/admin/AdminPlatformNavbar";
import { Footer } from "@/components/layout/Footer";
import { REGIONS_DETAIL } from "@/data/regions";
import { MASTER_GAMES, GameMaster } from "@/data/games";

export default function AdminPlatformReferencePage() {
  const [activeTab, setActiveTab] = useState<"games" | "categories" | "regions">("games");
  const [games, setGames] = useState<GameMaster[]>(MASTER_GAMES);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Region activation states
  const [regionStatuses, setRegionStatuses] = useState<Record<string, "active" | "fallback">>({
    PDG: "active",
    BKT: "active",
    PYK: "active",
    PDP: "active",
    SLK: "active",
    SWL: "active",
    PPN: "active",
    AGM: "active",
    LMP: "active",
    TDN: "active",
    PAS: "active",
    PSB: "fallback", // Fallback
    KBS: "active",
    KBL: "active",
    PLW: "active",
    PSS: "active",
    DHN: "active",
    SSL: "fallback", // Fallback
    MTW: "fallback", // Fallback
  });

  // News categories
  const [categories, setCategories] = useState([
    { id: "cat-1", name: "Agenda Resmi ESI", description: "Pengumuman SK, pelatda, dan rilis pers Pengprov/Pengcab", count: 8 },
    { id: "cat-2", name: "Turnamen Daerah", description: "Jadwal dan liputan kejuaraan piala walikota/bupati", count: 12 },
    { id: "cat-3", name: "Tata Kelola", description: "Sosialisasi regulasi, verifikasi TCG, dan kepatuhan UU PDP", count: 6 },
    { id: "cat-4", name: "Prestasi Klub", description: "Pencapaian tim dan atlet esport Sumbar di kancah nasional", count: 9 },
    { id: "cat-5", name: "Komunitas Pelajar", description: "Ekosistem esport sekolah, kampus, dan pembinaan usia muda", count: 5 },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleGame = (gameId: string) => {
    setGames((prev) =>
      prev.map((g) => (g.id === gameId ? { ...g, isActive: !g.isActive } : g))
    );
    showToast("Status aktif game berhasil diperbarui.");
  };

  const handleToggleRegion = (code: string) => {
    setRegionStatuses((prev) => {
      const nextStatus = prev[code] === "active" ? "fallback" : "active";
      showToast(`Status wilayah ${code} diubah menjadi: ${nextStatus.toUpperCase()}`);
      return { ...prev, [code]: nextStatus };
    });
  };

  return (
    <div className="min-h-screen bg-[#0B0D12] text-[#F3F4F6] flex flex-col font-sans">
      <AdminPlatformNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        {/* TOAST FEEDBACK */}
        {toastMessage && (
          <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1A1E28] border border-[#22C55E] text-white text-xs font-heading font-medium shadow-2xl animate-in slide-in-from-top-4">
            <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* BREADCRUMB */}
        <div className="flex flex-col gap-2 mb-6">
          <nav className="flex items-center gap-2 text-xs text-[#9AA3B2] font-mono mb-1">
            <Link href="/admin/platform" className="hover:text-white transition-colors">
              Operator Platform
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#3B82F6] font-bold">Data Referensi Master</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#262B38] pb-5">
            <div>
              <h1 className="text-2xl sm:text-3xl font-heading font-black uppercase text-white tracking-tight flex items-center gap-2.5">
                <Database className="w-7 h-7 text-[#D4AF37]" />
                <span>Pengelolaan Data Master Referensi</span>
              </h1>
              <p className="text-xs sm:text-sm text-[#9AA3B2] mt-1 max-w-2xl leading-relaxed">
                Kelola daftar nomor cabang game resmi, role divisi, kategori artikel, dan aktivasi status pengcab daerah aktif vs jalur fallback.
              </p>
            </div>
          </div>
        </div>

        {/* TAB BUTTONS */}
        <div className="flex items-center gap-2 border-b border-[#262B38] pb-1 mb-8 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("games")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-colors ${
              activeTab === "games"
                ? "bg-[#1A1E28] text-[#D4AF37] border border-[#D4AF37]/40 shadow-sm"
                : "text-gray-400 hover:text-white hover:bg-[#161922]"
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Master Game & Roles ({games.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("categories")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-colors ${
              activeTab === "categories"
                ? "bg-[#1A1E28] text-[#D4AF37] border border-[#D4AF37]/40 shadow-sm"
                : "text-gray-400 hover:text-white hover:bg-[#161922]"
            }`}
          >
            <Newspaper className="w-4 h-4" />
            <span>Kategori Berita ({categories.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("regions")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-colors ${
              activeTab === "regions"
                ? "bg-[#1A1E28] text-[#D4AF37] border border-[#D4AF37]/40 shadow-sm"
                : "text-gray-400 hover:text-white hover:bg-[#161922]"
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Aktivasi 19 Wilayah (Aktif vs Fallback)</span>
          </button>
        </div>

        {/* TAB 1: MASTER GAMES */}
        {activeTab === "games" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {games.map((game) => (
              <div
                key={game.id}
                className="p-6 rounded-2xl bg-[#12151C] border border-[#262B38] shadow-md flex flex-col justify-between gap-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#161922] border border-[#262B38] flex items-center justify-center text-[#D4AF37] font-heading font-bold text-lg shrink-0">
                      {game.name.slice(0, 2)}
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-base text-white uppercase">
                        {game.name}
                      </h3>
                      <span className="text-xs text-[#9AA3B2] font-mono">
                        Publisher: {game.publisher} • Genre: {game.category}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleGame(game.id)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase transition-colors ${
                      game.isActive
                        ? "bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30"
                        : "bg-red-950 text-red-400 border border-red-800"
                    }`}
                  >
                    {game.isActive ? "Aktif" : "Nonaktif"}
                  </button>
                </div>

                <div className="flex flex-col gap-2 pt-3 border-t border-[#262B38]/60">
                  <span className="text-[11px] font-heading font-bold uppercase text-gray-400">
                    Roles Terdaftar ({game.roles.length}):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {game.roles.map((role, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-[#161922] border border-[#262B38] text-[11px] text-gray-200 font-mono"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#262B38]/40 text-xs">
                  <span className="text-gray-400 font-mono text-[10px]">
                    Min. Roster: 5 Pemain Inti
                  </span>
                  <button
                    type="button"
                    onClick={() => showToast(`Fitur tambah role untuk ${game.name} dibuka.`)}
                    className="text-[11px] font-heading font-bold text-[#D4AF37] hover:underline"
                  >
                    + Tambah Role
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: NEWS CATEGORIES */}
        {activeTab === "categories" && (
          <div className="p-6 rounded-2xl bg-[#12151C] border border-[#262B38] shadow-md flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#262B38]">
              <div>
                <h3 className="font-heading font-bold text-sm uppercase text-white">
                  Daftar Kategori Berita & Rilis Pers
                </h3>
                <p className="text-[11px] text-[#9AA3B2]">
                  Digunakan untuk klasifikasi artikel pada portal berita dan halaman eksplorasi.
                </p>
              </div>

              <button
                type="button"
                onClick={() => showToast("Modal tambah kategori baru dibuka.")}
                className="px-4 py-2 rounded-xl bg-[#D4AF37] text-black text-xs font-heading font-bold uppercase"
              >
                + Tambah Kategori
              </button>
            </div>

            <div className="flex flex-col divide-y divide-[#262B38]">
              {categories.map((cat) => (
                <div key={cat.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-heading font-bold text-sm text-white">{cat.name}</h4>
                    <p className="text-xs text-[#9AA3B2] mt-0.5">{cat.description}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#161922] text-gray-300 font-mono text-xs border border-[#262B38] shrink-0">
                    {cat.count} Artikel Terbit
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: 19 REGIONS ACTIVATION */}
        {activeTab === "regions" && (
          <div className="p-6 rounded-2xl bg-[#12151C] border border-[#262B38] shadow-md flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#262B38]">
              <div>
                <h3 className="font-heading font-bold text-sm uppercase text-white flex items-center gap-2">
                  <Building className="w-5 h-5 text-[#D4AF37]" />
                  <span>Status Aktivasi Pengcab 19 Daerah</span>
                </h3>
                <p className="text-[11px] text-[#9AA3B2]">
                  Jika daerah berstatus &ldquo;Fallback&rdquo;, berkas verifikasi langsung dialihkan ke Pengprov ESI Sumbar.
                </p>
              </div>

              <span className="text-xs font-mono text-gray-400">
                16 Pengcab Aktif • 3 Jalur Fallback
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#161922] border-b border-[#262B38] text-gray-400 font-heading font-bold uppercase tracking-wider">
                    <th className="p-3 w-12 text-center">No</th>
                    <th className="p-3">Nama Wilayah</th>
                    <th className="p-3">Kode Unik</th>
                    <th className="p-3">Tipe Wilayah</th>
                    <th className="p-3">Status Saat Ini</th>
                    <th className="p-3 text-right">Aksi Toggle Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#262B38]/60">
                  {REGIONS_DETAIL.map((region, idx) => {
                    const status = regionStatuses[region.code] || "active";
                    const isFallback = status === "fallback";

                    return (
                      <tr key={region.code} className="hover:bg-[#161922]/60 transition-colors">
                        <td className="p-3 text-center text-gray-500 font-mono">{idx + 1}</td>
                        <td className="p-3">
                          <strong className="text-white font-medium">{region.name}</strong>
                        </td>
                        <td className="p-3 font-mono text-[#D4AF37] font-bold">{region.code}</td>
                        <td className="p-3 text-gray-400 capitalize">{region.type}</td>
                        <td className="p-3">
                          {isFallback ? (
                            <span className="px-2.5 py-1 rounded-full bg-purple-950 border border-purple-700 text-purple-300 text-[10px] font-mono font-bold">
                              Wilayah Fallback
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full bg-[#22C55E]/15 border border-[#22C55E]/30 text-[#22C55E] text-[10px] font-mono font-bold">
                              Pengcab Aktif
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleToggleRegion(region.code)}
                            className="px-3 py-1.5 rounded-lg bg-[#1A1E28] hover:bg-[#262B38] text-gray-300 hover:text-white text-xs font-heading font-bold uppercase transition-colors"
                          >
                            Ubah ke {isFallback ? "Aktif" : "Fallback"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
