"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Newspaper,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  CheckCircle2,
  Calendar,
  Globe,
  MapPin,
  X,
  Save,
  ChevronRight,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { AdminPlatformNavbar } from "@/components/admin/AdminPlatformNavbar";
import { Footer } from "@/components/layout/Footer";
import { MOCK_NEWS, Article } from "@/data/mockNews";
import { REGIONS_DETAIL } from "@/data/regions";

interface NewsItemWithStats extends Article {
  status: "published" | "draft" | "scheduled";
  views: number;
}

export default function AdminPlatformNewsPage() {
  const [articles, setArticles] = useState<NewsItemWithStats[]>(
    MOCK_NEWS.map((a, i) => ({
      ...a,
      status: i === 3 ? "draft" : "published",
      views: 320 * (5 - i) + 84,
    }))
  );

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
  const [editStatus, setEditStatus] = useState<"published" | "draft" | "scheduled">("published");
  const [editImageUrl, setEditImageUrl] = useState(
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop"
  );
  const [previewMode, setPreviewMode] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

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
    setEditContent(article.content.join("\n\n"));
    setEditStatus(article.status);
    setEditImageUrl(article.imageUrl);
    setPreviewMode(false);
    setIsEditorOpen(true);
  };

  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim()) return;

    if (editingArticleId) {
      setArticles((prev) =>
        prev.map((a) =>
          a.id === editingArticleId
            ? {
                ...a,
                title: editTitle,
                category: editCategory,
                region: editRegion,
                excerpt: editExcerpt,
                content: editContent.split("\n\n").filter(Boolean),
                status: editStatus,
                imageUrl: editImageUrl,
              }
            : a
        )
      );
      showToast("Perubahan artikel berhasil disimpan.");
    } else {
      const newArticle: NewsItemWithStats = {
        id: `news-${Date.now()}`,
        slug: editTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        title: editTitle,
        category: editCategory,
        region: editRegion,
        excerpt: editExcerpt,
        content: editContent.split("\n\n").filter(Boolean),
        author: "Biro Humas & Media ESI Sumbar",
        date: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
        readTime: "3 menit baca",
        imageUrl: editImageUrl,
        status: editStatus,
        views: 1,
      };
      setArticles((prev) => [newArticle, ...prev]);
      showToast("Artikel baru berhasil diterbitkan!");
    }

    setIsEditorOpen(false);
  };

  const handleDeleteArticle = (id: string) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
    showToast("Artikel telah dihapus dari daftar publikasi.");
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
            <span className="text-[#3B82F6] font-bold">CMS Berita & Editorial</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#262B38] pb-5">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-heading font-black uppercase text-white tracking-tight flex items-center gap-2.5">
                  <Newspaper className="w-7 h-7 text-purple-400" />
                  <span>Manajemen Berita & Publikasi</span>
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

        {/* SEARCH & FILTERS */}
        <div className="p-4 rounded-2xl bg-[#12151C] border border-[#262B38] mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-md">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul berita, wilayah, atau ringkasan..."
              className="w-full bg-[#161922] border border-[#262B38] focus:border-purple-500 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none"
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
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-[#161922] border border-[#262B38] text-xs font-medium text-white px-3 py-2 rounded-xl focus:outline-none focus:border-purple-500"
            >
              <option value="all">Semua Kategori</option>
              <option value="Agenda Resmi ESI">Agenda Resmi ESI</option>
              <option value="Turnamen Daerah">Turnamen Daerah</option>
              <option value="Tata Kelola">Tata Kelola</option>
              <option value="Prestasi Klub">Prestasi Klub</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-[#161922] border border-[#262B38] text-xs font-medium text-white px-3 py-2 rounded-xl focus:outline-none focus:border-purple-500"
            >
              <option value="all">Semua Status</option>
              <option value="published">Terbit (Live)</option>
              <option value="draft">Draft (Konsep)</option>
              <option value="scheduled">Terjadwal</option>
            </select>
          </div>
        </div>

        {/* ARTICLES TABLE (DESKTOP) & CARDS (MOBILE) */}
        {filteredArticles.length > 0 ? (
          <div className="bg-[#12151C] border border-[#262B38] rounded-2xl overflow-hidden shadow-xl">
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#161922] border-b border-[#262B38] text-gray-400 font-heading font-bold uppercase tracking-wider">
                    <th className="p-3.5">Judul Artikel</th>
                    <th className="p-3.5">Kategori & Wilayah</th>
                    <th className="p-3.5">Status Publikasi</th>
                    <th className="p-3.5">Tanggal Terbit</th>
                    <th className="p-3.5">Pembaca</th>
                    <th className="p-3.5 text-right">Aksi</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#262B38]/70">
                  {filteredArticles.map((article) => (
                    <tr key={article.id} className="hover:bg-[#161922]/70 transition-colors">
                      {/* JUDUL */}
                      <td className="p-3.5 max-w-md">
                        <div className="flex items-start gap-3">
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
                          <span className="px-2 py-0.2 rounded text-[10px] font-mono uppercase bg-[#1A1E28] text-purple-300 font-bold">
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
                        {article.status === "scheduled" && (
                          <span className="px-2.5 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-[10px] font-mono font-bold flex items-center gap-1.5 w-max">
                            <Calendar className="w-3 h-3" />
                            Terjadwal
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
                            className="p-1.5 rounded-lg bg-[#1A1E28] hover:bg-[#262B38] text-gray-300 hover:text-white"
                            title="Buka di Portal Publik"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(article)}
                            className="p-1.5 rounded-lg bg-[#1A1E28] hover:bg-[#262B38] text-[#D4AF37] hover:text-white"
                            title="Edit Artikel"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteArticle(article.id)}
                            className="p-1.5 rounded-lg bg-[#1A1E28] hover:bg-red-950/40 text-gray-400 hover:text-red-400"
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

            {/* MOBILE CARDS */}
            <div className="md:hidden divide-y divide-[#262B38]">
              {filteredArticles.map((article) => (
                <div key={article.id} className="p-4 flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={article.imageUrl}
                      alt=""
                      className="w-16 h-12 rounded-lg object-cover border border-[#262B38] shrink-0"
                    />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-mono text-purple-300 font-bold uppercase">
                        {article.category} • {article.region}
                      </span>
                      <h4 className="font-heading font-bold text-xs text-white line-clamp-2 mt-0.5">
                        {article.title}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#262B38] text-xs">
                    <span className="text-gray-400 font-mono text-[10px]">{article.date}</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(article)}
                        className="px-3 py-1 rounded-lg bg-[#1A1E28] text-xs font-heading font-bold text-[#D4AF37]"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteArticle(article.id)}
                        className="p-1 text-gray-400 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-12 text-center rounded-2xl bg-[#12151C] border border-[#262B38] text-xs text-gray-400">
            Tidak ada artikel yang cocok dengan filter pencarian.
          </div>
        )}
      </main>

      {/* MODAL EDITOR BERITA */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#12151C] border border-[#262B38] rounded-2xl max-w-3xl w-full p-6 flex flex-col gap-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#262B38]">
              <div className="flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-purple-400" />
                <h3 className="font-heading font-bold text-base uppercase text-white">
                  {editingArticleId ? "Edit Artikel Berita" : "Tulis Artikel Berita Baru"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-2 border-b border-[#262B38]/60 pb-2">
                <span className="text-xs font-mono text-gray-400">Mode Tampilan:</span>
                <div className="flex items-center gap-1 bg-[#161922] p-1 rounded-lg border border-[#262B38]">
                  <button
                    type="button"
                    onClick={() => setPreviewMode(false)}
                    className={`px-3 py-1 rounded text-xs font-heading font-bold ${
                      !previewMode ? "bg-[#1A1E28] text-white" : "text-gray-400"
                    }`}
                  >
                    Form Editor
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode(true)}
                    className={`px-3 py-1 rounded text-xs font-heading font-bold flex items-center gap-1 ${
                      previewMode ? "bg-[#1A1E28] text-[#D4AF37]" : "text-gray-400"
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Pratinjau Langsung</span>
                  </button>
                </div>
              </div>

              {previewMode ? (
                /* LIVE PREVIEW BOX */
                <div className="p-6 rounded-xl bg-[#0B0D12] border border-[#262B38] flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-[10px] font-bold uppercase">
                      {editCategory}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">• {editRegion}</span>
                  </div>

                  <h1 className="text-xl sm:text-2xl font-heading font-black text-white uppercase leading-snug">
                    {editTitle || "Judul Artikel Akan Ditampilkan di Sini"}
                  </h1>

                  <p className="text-xs text-gray-300 font-medium italic border-l-2 border-[#D4AF37] pl-3 py-1">
                    {editExcerpt || "Ringkasan pengantar berita..."}
                  </p>

                  <img
                    src={editImageUrl}
                    alt=""
                    className="w-full h-48 sm:h-64 object-cover rounded-xl border border-[#262B38]"
                  />

                  <div className="text-xs text-gray-300 space-y-3 leading-relaxed whitespace-pre-wrap">
                    {editContent || "Konten lengkap artikel berita..."}
                  </div>
                </div>
              ) : (
                /* FORM FIELDS */
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-heading font-bold uppercase text-gray-300">
                      Judul Artikel:
                    </label>
                    <input
                      type="text"
                      required
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Masukkan judul berita yang informatif dan tegas..."
                      className="w-full bg-[#0B0D12] border border-[#262B38] focus:border-purple-500 rounded-xl p-3 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-heading text-gray-300">Kategori Berita:</label>
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
                        <option value="scheduled">Jadwalkan Publikasi</option>
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
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E5C358] text-black text-xs font-heading font-extrabold uppercase tracking-wider hover:brightness-110 shadow-md"
                >
                  Simpan & Publikasikan
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
