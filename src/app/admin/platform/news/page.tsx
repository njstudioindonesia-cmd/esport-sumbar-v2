"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Newspaper,
  Plus,
  Search,
  Filter,
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
import { AdminPlatformNavbar } from "@/components/admin/AdminPlatformNavbar";
import { Footer } from "@/components/layout/Footer";
import { Article } from "@/data/mockNews";
import { REGIONS_DETAIL } from "@/data/regions";
import { saveArticleAction, deleteArticleAction } from "@/app/actions/news";

interface NewsItemWithStats extends Article {
  status: "published" | "draft" | "archived";
  views: number;
}

export default function AdminPlatformNewsPage() {
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
  const [editCategory, setEditCategory] = useState<Article["category"]>("Agenda Resmi ESI");
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
              author: a.authorName || "Humas ESI Sumbar",
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
  }, [loadArticles]);

  const handleOpenCreateModal = () => {
    setEditingArticleId(null);
    setEditTitle("");
    setEditCategory("Agenda Resmi ESI");
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
            <span className="text-[#3B82F6] font-bold">CMS Berita &amp; Editorial</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#262B38] pb-5">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-heading font-black uppercase text-white tracking-tight flex items-center gap-2.5">
                  <Newspaper className="w-7 h-7 text-purple-400" />
                  <span>Manajemen Berita &amp; Publikasi</span>
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-xs font-mono font-bold text-purple-300">
                  {articles.length} Artikel Terdaftar
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#9AA3B2] mt-1 max-w-2xl leading-relaxed">
                Kelola konten portal berita resmi ekosistem esport Sumatera Barat. Publikasikan rilis pers pengprov, liputan turnamen 19 daerah, dan profil atlet bintang.
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="self-start md:self-auto flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E5C358] text-black text-xs font-heading font-extrabold uppercase tracking-wider hover:brightness-110 shadow-lg shadow-amber-950/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Tulis Artikel Baru</span>
            </button>
          </div>
        </div>

        {/* FILTER & SEARCH BAR */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-6 bg-[#12151D] border border-[#262B38] p-3 rounded-2xl">
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berdasarkan judul, wilayah, atau ringkasan..."
              className="w-full bg-[#1A1E28] border border-[#262B38] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          <div className="sm:col-span-4 flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400 shrink-0 hidden sm:block" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full bg-[#1A1E28] border border-[#262B38] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            >
              <option value="all">Semua Kategori</option>
              <option value="Agenda Resmi ESI">Agenda Resmi ESI</option>
              <option value="Turnamen Daerah">Turnamen Daerah</option>
              <option value="Tata Kelola">Tata Kelola</option>
              <option value="Prestasi Klub">Prestasi Klub</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full bg-[#1A1E28] border border-[#262B38] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            >
              <option value="all">Semua Status</option>
              <option value="published">Terbit (Live)</option>
              <option value="draft">Draft</option>
              <option value="archived">Diarsipkan</option>
            </select>
          </div>
        </div>

        {/* TABEL DAFTAR ARTIKEL */}
        <div className="bg-[#12151D] border border-[#262B38] rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1A1E28] border-b border-[#262B38] text-[#9AA3B2] uppercase font-mono text-[10px] tracking-wider">
                <tr>
                  <th className="p-3.5">Artikel / Judul</th>
                  <th className="p-3.5">Kategori &amp; Wilayah</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Tanggal</th>
                  <th className="p-3.5">Dilihat</th>
                  <th className="p-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262B38]">
                {isLoading && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-xs text-[#9AA3B2] font-mono">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#D4AF37] mb-2" />
                      Memuat data artikel dari database...
                    </td>
                  </tr>
                )}

                {!isLoading && filteredArticles.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-xs text-[#9AA3B2]">
                      <Newspaper className="w-10 h-10 mx-auto text-white/20 mb-3" />
                      <p className="font-heading font-bold text-sm text-white mb-1">
                        Belum ada artikel di tabel database
                      </p>
                      <p className="text-[11px] text-gray-500 max-w-sm mx-auto mb-4">
                        Tabel public.articles di Supabase saat ini kosong. Anda dapat menulis artikel baru dengan menekan tombol di bawah.
                      </p>
                      <button
                        type="button"
                        onClick={handleOpenCreateModal}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D4AF37] text-black font-heading font-bold text-xs uppercase"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tulis Artikel Baru</span>
                      </button>
                    </td>
                  </tr>
                )}

                {!isLoading &&
                  filteredArticles.map((article) => (
                    <tr
                      key={article.id}
                      className="hover:bg-[#1A1E28]/60 transition-colors group"
                    >
                      {/* JUDUL */}
                      <td className="p-3.5 max-w-md">
                        <div className="flex items-start gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={article.imageUrl}
                            alt=""
                            className="w-14 h-10 rounded-lg object-cover border border-[#262B38] shrink-0"
                          />
                          <div className="flex flex-col">
                            <span className="font-heading font-bold text-white text-xs line-clamp-1">
                              {article.title}
                            </span>
                            <span className="text-[11px] text-[#9AA3B2] line-clamp-1 mt-0.5">
                              {article.excerpt}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* KATEGORI & WILAYAH */}
                      <td className="p-3.5">
                        <div className="flex flex-col gap-1 items-start">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#1A1E28] text-purple-300 font-bold border border-purple-500/20">
                            {article.category}
                          </span>
                          <span className="text-[10px] text-gray-400 flex items-center gap-1 font-mono">
                            <MapPin className="w-2.5 h-2.5 text-[#D4AF37]" />
                            {article.region}
                          </span>
                        </div>
                      </td>

                      {/* STATUS */}
                      <td className="p-3.5 whitespace-nowrap">
                        {article.status === "published" && (
                          <span className="px-2.5 py-1 rounded-full bg-[#22C55E]/15 border border-[#22C55E]/30 text-[#22C55E] text-[10px] font-mono font-bold flex items-center gap-1.5 w-max">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                            Terbit (Live)
                          </span>
                        )}
                        {article.status === "draft" && (
                          <span className="px-2.5 py-1 rounded-full bg-gray-700/30 border border-gray-600 text-gray-400 text-[10px] font-mono font-bold flex items-center gap-1.5 w-max">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                            Draft
                          </span>
                        )}
                        {article.status === "archived" && (
                          <span className="px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-bold flex items-center gap-1.5 w-max">
                            <Clock className="w-3 h-3" />
                            Diarsipkan
                          </span>
                        )}
                      </td>

                      {/* TANGGAL */}
                      <td className="p-3.5 font-mono text-gray-300 whitespace-nowrap">
                        {article.date}
                      </td>

                      {/* VIEWS */}
                      <td className="p-3.5 font-mono text-gray-300">
                        {article.views.toLocaleString()} x
                      </td>

                      {/* AKSI */}
                      <td className="p-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/news/${article.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg bg-[#1A1E28] hover:bg-[#262B38] text-gray-300 hover:text-white transition-colors"
                            title="Buka di Portal Publik"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(article)}
                            className="p-1.5 rounded-lg bg-[#1A1E28] hover:bg-[#262B38] text-[#D4AF37] hover:text-white transition-colors"
                            title="Edit Artikel"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteArticle(article.id)}
                            className="p-1.5 rounded-lg bg-[#1A1E28] hover:bg-red-950/40 text-gray-400 hover:text-red-400 transition-colors"
                            title="Hapus Artikel"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* MODAL WRITER & EDITOR BERITA */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#12151D] border border-[#262B38] w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl my-8">
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between p-6 border-b border-[#262B38]">
              <div>
                <h3 className="font-heading font-black text-lg text-white uppercase flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                  <span>
                    {editingArticleId ? "Perbarui Artikel Berita" : "Tulis Artikel / Rilis Baru"}
                  </span>
                </h3>
                <span className="text-xs text-gray-400">
                  Data tersimpan langsung ke pangkalan data Supabase tabel public.articles
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewMode(!previewMode)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono border transition-all ${
                    previewMode
                      ? "bg-purple-600 border-purple-500 text-white"
                      : "bg-[#1A1E28] border-[#262B38] text-gray-300 hover:text-white"
                  }`}
                >
                  {previewMode ? "Mode Edit" : "Pratinjau"}
                </button>
              </div>
            </div>

            {/* MODAL BODY */}
            <form onSubmit={handleSaveArticle} className="p-6 flex flex-col gap-5">
              {previewMode ? (
                <div className="bg-[#0B0D12] p-6 rounded-2xl border border-[#262B38] flex flex-col gap-4">
                  <span className="text-[10px] font-mono uppercase bg-[#1A1E28] text-purple-300 px-2 py-0.5 rounded w-max">
                    {editCategory} • {editRegion}
                  </span>
                  <h2 className="text-2xl font-heading font-black text-white">{editTitle || "Judul Berita..."}</h2>
                  <p className="text-xs font-mono text-gray-400">{editExcerpt || "Ringkasan berita..."}</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={editImageUrl} alt="" className="w-full h-48 object-cover rounded-xl" />
                  <div className="text-xs text-gray-300 leading-relaxed whitespace-pre-line">
                    {editContent || "Konten artikel lengkap..."}
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-heading text-gray-300">Judul Berita Resmi:</label>
                    <input
                      type="text"
                      required
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="cth: Pengprov ESI Sumbar Resmikan Pelatda Atlet PON 2026..."
                      className="w-full bg-[#0B0D12] border border-[#262B38] focus:border-purple-500 rounded-xl p-3 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-heading text-gray-300">Kategori Publikasi:</label>
                      <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value as any)}
                        className="bg-[#0B0D12] border border-[#262B38] rounded-xl p-2.5 text-xs text-white focus:outline-none"
                      >
                        <option value="Agenda Resmi ESI">Agenda Resmi ESI</option>
                        <option value="Turnamen Daerah">Turnamen Daerah</option>
                        <option value="Tata Kelola">Tata Kelola</option>
                        <option value="Prestasi Klub">Prestasi Klub</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-heading text-gray-300">Target Wilayah:</label>
                      <select
                        value={editRegion}
                        onChange={(e) => setEditRegion(e.target.value)}
                        className="bg-[#0B0D12] border border-[#262B38] rounded-xl p-2.5 text-xs text-white focus:outline-none"
                      >
                        <option value="Sumatera Barat">Seluruh Sumatera Barat</option>
                        {REGIONS_DETAIL.map((r) => (
                          <option key={r.code} value={r.name}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-heading text-gray-300">Status Terbit:</label>
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value as any)}
                        className="bg-[#0B0D12] border border-[#262B38] rounded-xl p-2.5 text-xs text-white focus:outline-none"
                      >
                        <option value="published">Terbitkan Langsung (Live)</option>
                        <option value="draft">Simpan sebagai Draft</option>
                        <option value="archived">Arsipkan Berita</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-heading text-gray-300">
                      Ringkasan Singkat (Excerpt):
                    </label>
                    <textarea
                      rows={2}
                      value={editExcerpt}
                      onChange={(e) => setEditExcerpt(e.target.value)}
                      placeholder="Ringkasan 1-2 kalimat untuk kartu berita di beranda..."
                      className="w-full bg-[#0B0D12] border border-[#262B38] focus:border-purple-500 rounded-xl p-3 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-heading text-gray-300">
                      URL Gambar Sampul (Cover Image):
                    </label>
                    <input
                      type="url"
                      value={editImageUrl}
                      onChange={(e) => setEditImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-[#0B0D12] border border-[#262B38] focus:border-purple-500 rounded-xl p-2.5 text-xs text-white focus:outline-none font-mono"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-heading text-gray-300">
                      Konten Lengkap Berita (Pisahkan Paragraf dengan Enter Dua Kali):
                    </label>
                    <textarea
                      rows={8}
                      required
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      placeholder="Tuliskan berita lengkap di sini..."
                      className="w-full bg-[#0B0D12] border border-[#262B38] focus:border-purple-500 rounded-xl p-3 text-xs text-white focus:outline-none font-sans leading-relaxed"
                    />
                  </div>
                </>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#262B38]">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-heading text-gray-400 hover:text-white"
                  disabled={isSubmitting}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E5C358] text-black text-xs font-heading font-extrabold uppercase tracking-wider hover:brightness-110 shadow-md transition-all disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isSubmitting ? "Menyimpan..." : "Simpan & Publikasikan"}</span>
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
