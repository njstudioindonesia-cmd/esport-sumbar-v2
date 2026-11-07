"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Newspaper,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Eye,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Loader2,
  RotateCcw,
} from "lucide-react";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { Footer } from "@/components/layout/Footer";
import { QuietSurface } from "@/components/glass/QuietSurface";
import { Article } from "@/data/mockNews";
import { REGIONS_DETAIL } from "@/data/regions";
import { saveArticleAction, deleteArticleAction } from "@/app/actions/news";
import { createClient } from "@/lib/supabase/client";

interface NewsItemWithStats extends Article {
  status: "published" | "draft" | "archived";
  views: number;
}

export default function AdminNewsPage() {
  const [articles, setArticles] = useState<NewsItemWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Editor Modal State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState<Article["category"]>("Prestasi & Atlet");
  const [editRegion, setEditRegion] = useState("Sumatera Barat");
  const [editExcerpt, setEditExcerpt] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editStatus, setEditStatus] = useState<"published" | "draft" | "archived">("published");
  const [editImageUrl, setEditImageUrl] = useState(
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop"
  );
  const [previewMode, setPreviewMode] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadArticles = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/news?status=all&limit=100");
      if (res.ok) {
        const json = await res.json();
        if (json.articles && Array.isArray(json.articles)) {
          setArticles(
            json.articles.map((a: any, i: number) => ({
              id: a.id,
              slug: a.slug,
              title: a.title,
              category: a.category,
              region: a.regionName || "Sumatera Barat",
              excerpt: a.summary || (a.content ? a.content.slice(0, 150) + "..." : ""),
              content: a.content ? [a.content] : [],
              author: a.authorName || "Redaksi ESPORT SUMBAR",
              date: new Date(a.publishedAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }),
              readTime: "3 min baca",
              imageUrl: a.coverImageUrl || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop",
              status: (a.status as any) || "published",
              views: 120 + i * 35,
            }))
          );
        } else {
          setArticles([]);
        }
      } else {
        setArticles([]);
      }
    } catch {
      setArticles([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadArticles();

    const supabase = createClient();
    const channel = supabase
      .channel("admin-articles-realtime-v3")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "articles" },
        () => {
          loadArticles();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadArticles]);

  const handleOpenCreateModal = () => {
    setEditingArticleId(null);
    setEditTitle("");
    setEditCategory("Prestasi & Atlet");
    setEditRegion("Sumatera Barat");
    setEditExcerpt("");
    setEditContent("");
    setEditStatus("published");
    setPreviewMode(false);
    setIsEditorOpen(true);
  };

  const handleOpenEditModal = (article: NewsItemWithStats) => {
    setEditingArticleId(article.id);
    setEditTitle(article.title);
    setEditCategory(article.category);
    setEditRegion(article.region);
    setEditExcerpt(article.excerpt);
    setEditContent(Array.isArray(article.content) ? article.content.join("\n\n") : article.content);
    setEditStatus(article.status);
    setEditImageUrl(article.imageUrl);
    setPreviewMode(false);
    setIsEditorOpen(true);
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim()) return;

    setIsSubmitting(true);
    try {
      const regionMatch = REGIONS_DETAIL.find((r) => r.name === editRegion);
      const res = await saveArticleAction({
        id: editingArticleId || undefined,
        title: editTitle,
        category: editCategory,
        regionId: regionMatch ? regionMatch.id : null,
        summary: editExcerpt,
        content: editContent,
        status: editStatus,
        coverImageUrl: editImageUrl,
      });

      if (res.success) {
        showToast(editingArticleId ? "Perubahan artikel berhasil disimpan ke database." : "Artikel baru berhasil diterbitkan!");
        setIsEditorOpen(false);
        await loadArticles();
      } else {
        showToast(`Gagal: ${res.error}`);
      }
    } catch (err: any) {
      showToast(`Terjadi kesalahan: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus artikel ini dari database?")) return;
    try {
      const res = await deleteArticleAction(id);
      if (res.success) {
        showToast("Artikel telah dihapus dari database.");
        await loadArticles();
      } else {
        showToast(`Gagal menghapus: ${res.error}`);
      }
    } catch (err: any) {
      showToast(`Gagal: ${err.message}`);
    }
  };

  const filteredArticles = articles.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = filterCategory === "all" || a.category === filterCategory;
    const matchesStatus = filterStatus === "all" || a.status === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[#F3F4F6] flex flex-col font-sans">
      <AdminNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        {toastMessage && (
          <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1A1E28] border border-[#22C55E] text-white text-xs font-heading font-medium shadow-2xl animate-in slide-in-from-top-4">
            <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
            <span>{toastMessage}</span>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-heading font-black uppercase text-white tracking-tight flex items-center gap-2.5">
                <Newspaper className="w-7 h-7 text-purple-400" />
                <span>CMS Berita &amp; Warta</span>
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-xs font-mono font-bold text-purple-300">
                {articles.length} Artikel
              </span>
            </div>
            <p className="text-xs sm:text-sm text-white/60 mt-1 max-w-2xl leading-relaxed">
              Kelola publikasi warta ekosistem esport Sumatera Barat: agenda turnamen, liputan komunitas, dan sorotan profil atlet.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="btn-brand-primary px-4 py-2.5 rounded-xl text-xs font-heading font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#FF1752]/20 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tulis Artikel Baru</span>
          </button>
        </div>

        {/* SEARCH & FILTERS */}
        <QuietSurface radius="2xl" elevation="raised" className="p-4 flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul berita..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#FF1752]/60"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              aria-label="Filter Kategori Berita"
              className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white/80 focus:outline-none"
            >
              <option value="all">Semua Kategori</option>
              <option value="Agenda Platform">Agenda Turnamen</option>
              <option value="Turnamen & Prestasi">Prestasi &amp; Turnamen</option>
              <option value="Profil Atlet">Profil Atlet</option>
              <option value="Komunitas">Komunitas</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              aria-label="Filter Status Publikasi"
              className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white/80 focus:outline-none"
            >
              <option value="all">Semua Status</option>
              <option value="published">Tayang (Published)</option>
              <option value="draft">Draf</option>
            </select>
          </div>
        </QuietSurface>

        {/* ARTICLES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {isLoading ? (
            <div className="col-span-full p-12 text-center text-white/40 text-xs font-mono animate-pulse">
              Memuat data artikel...
            </div>
          ) : filteredArticles.length === 0 ? (
            <QuietSurface radius="2xl" elevation="raised" className="col-span-full p-12 text-center text-white/40 text-xs">
              Tidak ada artikel yang sesuai kriteria.
            </QuietSurface>
          ) : (
            filteredArticles.map((article) => (
              <QuietSurface
                key={article.id}
                radius="2xl"
                elevation="raised"
                className="p-5 hover:border-white/20 transition-all flex flex-col justify-between gap-4"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-[10px] font-mono text-white/40">
                    <span className="px-2 py-0.5 rounded bg-white/10 text-white/70 uppercase">
                      {article.category}
                    </span>
                    <span className={article.status === "published" ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                      {article.status.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="font-heading font-black text-base text-white line-clamp-2 mt-1">
                    {article.title}
                  </h3>

                  <p className="text-xs text-white/60 line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-[10px] font-mono text-white/40">
                    {article.date} • {article.region}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(article)}
                      className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-white/15 text-white/70 hover:text-white"
                      title="Edit Artikel"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteArticle(article.id)}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                      title="Hapus Artikel"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </QuietSurface>
            ))
          )}
        </div>
      </main>

      {/* CREATE / EDIT MODAL */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-[#0A0D15] border border-white/15 rounded-3xl overflow-hidden shadow-2xl p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-heading font-bold text-lg text-white">
              {editingArticleId ? "Edit Artikel" : "Tulis Artikel Baru"}
            </h3>

            <form onSubmit={handleSaveArticle} className="flex flex-col gap-4 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="font-mono uppercase text-white/60">Judul Artikel</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Judul berita..."
                  className="p-3 rounded-xl bg-black/40 border border-white/15 text-white focus:outline-none focus:border-[#FF1752]/60"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono uppercase text-white/60">Kategori</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as any)}
                    className="p-3 rounded-xl bg-black/40 border border-white/15 text-white focus:outline-none"
                  >
                    <option value="Agenda Platform">Agenda Turnamen</option>
                    <option value="Turnamen & Prestasi">Prestasi &amp; Turnamen</option>
                    <option value="Profil Atlet">Profil Atlet</option>
                    <option value="Komunitas">Komunitas</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-mono uppercase text-white/60">Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="p-3 rounded-xl bg-black/40 border border-white/15 text-white focus:outline-none"
                  >
                    <option value="published">Tayang (Published)</option>
                    <option value="draft">Draf</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono uppercase text-white/60">Ringkasan (Excerpt)</label>
                <textarea
                  rows={2}
                  value={editExcerpt}
                  onChange={(e) => setEditExcerpt(e.target.value)}
                  placeholder="Ringkasan singkat untuk kartu berita..."
                  className="p-3 rounded-xl bg-black/40 border border-white/15 text-white focus:outline-none resize-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono uppercase text-white/60">Isi Konten Lengkap</label>
                <textarea
                  rows={6}
                  required
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="Tuliskan isi berita lengkap di sini..."
                  className="p-3 rounded-xl bg-black/40 border border-white/15 text-white focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.06] text-white/70"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-brand-primary px-5 py-2 rounded-xl font-heading font-bold uppercase tracking-wider"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Artikel"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
