"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink,
  Edit,
  Trash2,
  Layers,
  Sparkles,
} from "lucide-react";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { Footer } from "@/components/layout/Footer";
import { QuietSurface } from "@/components/glass/QuietSurface";

interface ContentItem {
  id: string;
  title: string;
  slug: string;
  type: "news" | "announcement" | "guide";
  status: "published" | "draft" | "archived";
  createdAt: string;
  author: string;
}

export default function AdminContentPage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  useEffect(() => {
    async function loadContent() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/admin/content");
        if (res.ok) {
          const json = await res.json();
          if (json.items && Array.isArray(json.items)) {
            setItems(json.items);
          } else {
            // Default sample content
            setItems([
              {
                id: "cnt-1",
                title: "Ekosistem Esport Sumatera Barat V3 Mengudara",
                slug: "esport-sumbar-v3-mengudara",
                type: "announcement",
                status: "published",
                createdAt: new Date().toISOString(),
                author: "Platform Admin",
              },
              {
                id: "cnt-2",
                title: "Standar Verifikasi Paspor Digital Atlet 2026",
                slug: "standar-verifikasi-paspor-digital-2026",
                type: "guide",
                status: "published",
                createdAt: new Date().toISOString(),
                author: "Platform Admin",
              },
            ]);
          }
        }
      } catch (err) {
        console.warn("Gagal memuat konten:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadContent();
  }, []);

  const filtered = items.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || item.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-[#07080C] text-slate-100 flex flex-col font-sans">
      <AdminNavbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
              <FileText className="w-6 h-6 text-pink-500" />
              Manajemen Konten & Artikel
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Pusat publikasi berita, pengumuman ekosistem, dan panduan standar verifikasi.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/news"
              className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-xs font-semibold text-white flex items-center gap-2 transition-colors shadow-lg shadow-pink-600/20"
            >
              <Plus className="w-4 h-4" /> Tulis Berita Baru
            </Link>
          </div>
        </div>

        {/* Search & Filter */}
        <QuietSurface radius="2xl" elevation="raised" className="mb-6 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul artikel atau pengumuman..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-800/80 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
            />
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs text-slate-400">Tipe:</span>
            {["all", "news", "announcement", "guide"].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1 rounded-lg text-xs capitalize transition-colors ${
                  filterType === t
                    ? "bg-pink-600 text-white font-medium"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {t === "all" ? "Semua" : t === "news" ? "Berita" : t === "announcement" ? "Pengumuman" : "Panduan"}
              </button>
            ))}
          </div>
        </QuietSurface>

        {/* List Content */}
        {isLoading ? (
          <div className="p-12 text-center text-slate-400">
            <Clock className="w-8 h-8 animate-spin mx-auto mb-3 text-pink-500" />
            <p>Memuat daftar konten...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/50 rounded-2xl border border-white/10 text-slate-400">
            <FileText className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-white">Tidak ada konten yang cocok.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => (
              <QuietSurface
                key={item.id}
                radius="2xl"
                elevation="raised"
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        item.status === "published"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {item.status}
                    </span>
                    <span className="text-xs font-medium text-pink-400 uppercase tracking-wider">
                      {item.type}
                    </span>
                    <span className="text-slate-500 text-xs">·</span>
                    <span className="text-xs text-slate-400">Oleh: {item.author}</span>
                  </div>
                  <h3 className="text-base font-semibold text-white">{item.title}</h3>
                  <p className="text-xs font-mono text-slate-500">/{item.slug}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/news/${item.slug}`}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
                    title="Pratinjau Publik"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/admin/news`}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
                    title="Edit Konten"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                </div>
              </QuietSurface>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
