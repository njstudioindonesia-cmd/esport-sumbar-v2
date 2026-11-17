"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Sliders,
  Image as ImageIcon,
  Layout,
  Compass,
  FileText,
  HelpCircle,
  RefreshCw,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Eye,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  Smartphone,
  Monitor,
  ShieldCheck,
  Check,
  X,
} from "lucide-react";
import { AdminNavbar } from "@/components/AdminNavbar";
import { Footer, QuietSurface, Button } from "@esport-sumbar/ui";
import {
  getAdminBannersAction,
  saveAdminBannerAction,
  deleteAdminBannerAction,
  getAdminContentBlocksAction,
  saveAdminContentBlockAction,
  rollbackAdminContentBlockAction,
  getAdminNavItemsAction,
  saveAdminNavItemAction,
  deleteAdminNavItemAction,
  getAdminLegalPagesAction,
  saveAdminLegalPageAction,
  getAdminFaqItemsAction,
  saveAdminFaqItemAction,
  deleteAdminFaqItemAction,
  triggerManualRevalidationAction,
} from "@/app/actions/cms";
import type { Banner, ContentBlock, NavItem, LegalPage, FaqItem } from "@esport-sumbar/contracts";
import { checkProhibitedTerms } from "@esport-sumbar/contracts";

export default function AdminCmsPage() {
  const [activeTab, setActiveTab] = useState<"banners" | "home" | "navigation" | "pages" | "faq">("banners");
  const [isRevalidating, setIsRevalidating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleRevalidateCache = async (tags: string[]) => {
    setIsRevalidating(true);
    try {
      const res = await triggerManualRevalidationAction(tags);
      if (res.success) {
        showToast("✅ Berhasil merevalidasi cache situs utama");
      } else {
        showToast(`⚠️ Revalidasi: ${res.message}`);
      }
    } catch (err: any) {
      showToast(`❌ Gagal: ${err.message}`);
    } finally {
      setIsRevalidating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05051A] text-white flex">
      <AdminNavbar />

      <main className="flex-1 p-6 md:p-10 flex flex-col gap-6 overflow-y-auto">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-6 right-6 z-50 bg-[#16162E] border border-white/20 px-4 py-2.5 rounded-xl shadow-2xl text-xs font-semibold text-white flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Header Section */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
              <Sliders className="w-6 h-6 text-[#FF1752]" />
              Manajemen CMS &amp; Banner Promosi
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Kelola banner karusel otomatis, tata letak beranda, menu navigasi, halaman legalitas, dan FAQ.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={isRevalidating}
              onClick={() => handleRevalidateCache(["cms:banners", "cms:content_blocks", "cms:nav_items"])}
              className="px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-semibold text-white/90 hover:text-white flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#FF1752] ${isRevalidating ? "animate-spin" : ""}`} />
              <span>{isRevalidating ? "Memproses..." : "Revalidasi Cache Web"}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-white/[0.08] mb-6 overflow-x-auto pb-1">
          <TabButton
            active={activeTab === "banners"}
            onClick={() => setActiveTab("banners")}
            icon={ImageIcon}
            label="Banner Slider &amp; Sponsor"
          />
          <TabButton
            active={activeTab === "home"}
            onClick={() => setActiveTab("home")}
            icon={Layout}
            label="Editor Beranda &amp; Hero"
          />
          <TabButton
            active={activeTab === "navigation"}
            onClick={() => setActiveTab("navigation")}
            icon={Compass}
            label="Navigasi Header &amp; Footer"
          />
          <TabButton
            active={activeTab === "pages"}
            onClick={() => setActiveTab("pages")}
            icon={FileText}
            label="Halaman Legal &amp; Kebijakan"
          />
          <TabButton
            active={activeTab === "faq"}
            onClick={() => setActiveTab("faq")}
            icon={HelpCircle}
            label="Pertanyaan Umum (FAQ)"
          />
        </div>

        {/* Tab Content Panels */}
        {activeTab === "banners" && <BannersManager onToast={showToast} />}
        {activeTab === "home" && <HomeContentEditor onToast={showToast} />}
        {activeTab === "navigation" && <NavigationManager onToast={showToast} />}
        {activeTab === "pages" && <LegalPagesManager onToast={showToast} />}
        {activeTab === "faq" && <FaqManager onToast={showToast} />}
      </main>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: any;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
        active
          ? "bg-[#FF1752] text-white shadow-lg shadow-[#FF1752]/20"
          : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
      }`}
    >
      <Icon className="w-4 h-4" />
      <span dangerouslySetInnerHTML={{ __html: label }} />
    </button>
  );
}

// ============================================================================
// 1. PENGELOLA BANNER SLIDER & SPONSOR
// ============================================================================
function BannersManager({ onToast }: { onToast: (msg: string) => void }) {
  const [banners, setBanners] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any | null>(null);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");

  const loadBanners = async () => {
    setIsLoading(true);
    const res = await getAdminBannersAction();
    if (res.success) {
      setBanners(res.banners);
    } else {
      onToast(`⚠️ ${res.error || "Gagal memuat banner"}`);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus banner ini?")) return;
    const res = await deleteAdminBannerAction(id);
    if (res.success) {
      onToast("✅ Banner berhasil dihapus");
      loadBanners();
    } else {
      onToast(`❌ Gagal menghapus: ${res.error}`);
    }
  };

  const filtered = banners.filter((b) => {
    if (filterStatus === "all") return true;
    return b.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-800/80 border border-white/10 text-xs text-white focus:outline-none focus:border-[#FF1752]"
          >
            <option value="all">Semua Status</option>
            <option value="published">Tayang (Published)</option>
            <option value="scheduled">Terjadwal (Scheduled)</option>
            <option value="draft">Draf (Draft)</option>
            <option value="archived">Diarsipkan (Archived)</option>
          </select>
          <span className="text-xs text-slate-400 font-mono">
            {filtered.length} Banner
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingBanner(null);
            setDrawerOpen(true);
          }}
          className="px-4 py-2 rounded-xl bg-[#FF1752] hover:bg-[#FF1752]/90 text-xs font-bold text-white flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#FF1752]/20"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Banner Baru</span>
        </button>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-xs text-slate-500 font-mono">
          Memuat data banner...
        </div>
      ) : filtered.length === 0 ? (
        <QuietSurface radius="2xl" elevation="flat" className="p-12 text-center">
          <ImageIcon className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-white mb-1">Belum Ada Banner</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            Tambahkan banner promosi atau pengumuman resmi pertama untuk ditampilkan di beranda.
          </p>
          <button
            type="button"
            onClick={() => {
              setEditingBanner(null);
              setDrawerOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-semibold text-white transition-all cursor-pointer"
          >
            Buat Banner
          </button>
        </QuietSurface>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((banner) => (
            <QuietSurface
              key={banner.id}
              radius="2xl"
              elevation="raised"
              className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="relative w-32 h-16 rounded-xl overflow-hidden bg-black/60 shrink-0 border border-white/10">
                  <Image
                    src={banner.desktop_image_url}
                    alt={banner.alt_text}
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                  {banner.is_ad && (
                    <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-[#FF1752] text-[9px] font-bold text-white">
                      IKLAN
                    </span>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-bold text-white">{banner.title}</h3>
                    <StatusBadge status={banner.status} />
                    <span className="px-2 py-0.5 rounded-md bg-white/[0.04] text-[10px] font-mono text-slate-400">
                      {banner.placement}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1 max-w-xl">
                    Alt: {banner.alt_text}
                  </p>
                  {banner.target_url && (
                    <a
                      href={banner.target_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-[#FF4D77] hover:underline flex items-center gap-1 mt-1"
                    >
                      <span>{banner.target_url}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Stats & Actions */}
              <div className="flex items-center gap-4 self-end md:self-center shrink-0">
                <div className="text-right font-mono text-xs hidden sm:block">
                  <div className="text-white font-bold">
                    {banner.stats?.impressions?.toLocaleString() || 0} tayang
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    {banner.stats?.clicks?.toLocaleString() || 0} klik ({banner.stats?.ctr || 0}%)
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingBanner(banner);
                      setDrawerOpen(true);
                    }}
                    className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white/80 hover:text-white transition-all cursor-pointer"
                    title="Edit Banner"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(banner.id)}
                    className="p-2 rounded-xl bg-white/[0.06] hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all cursor-pointer"
                    title="Hapus Banner"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </QuietSurface>
          ))}
        </div>
      )}

      {/* Drawer Form Tambah/Edit Banner */}
      {drawerOpen && (
        <BannerFormDrawer
          banner={editingBanner}
          onClose={() => setDrawerOpen(false)}
          onSaved={() => {
            setDrawerOpen(false);
            loadBanners();
            onToast("✅ Banner berhasil disimpan dan cache direvalidasi");
          }}
        />
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "published") {
    return (
      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold text-emerald-400 flex items-center gap-1">
        <CheckCircle2 className="w-3 h-3" />
        Tayang
      </span>
    );
  }
  if (status === "scheduled") {
    return (
      <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] font-bold text-amber-400 flex items-center gap-1">
        <Clock className="w-3 h-3" />
        Terjadwal
      </span>
    );
  }
  if (status === "archived") {
    return (
      <span className="px-2 py-0.5 rounded-full bg-slate-500/10 border border-slate-500/30 text-[10px] font-bold text-slate-400">
        Arsip
      </span>
    );
  }
  return (
    <span className="px-2 py-0.5 rounded-full bg-slate-500/10 border border-slate-500/30 text-[10px] font-bold text-slate-400">
      Draf
    </span>
  );
}

function BannerFormDrawer({
  banner,
  onClose,
  onSaved,
}: {
  banner: any | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [formData, setFormData] = useState({
    title: banner?.title || "",
    placement: banner?.placement || "home_top",
    desktop_image_url: banner?.desktop_image_url || "",
    mobile_image_url: banner?.mobile_image_url || "",
    alt_text: banner?.alt_text || "",
    target_url: banner?.target_url || "",
    open_in_new_tab: banner?.open_in_new_tab ?? true,
    is_ad: banner?.is_ad ?? false,
    sponsor_name: banner?.sponsor_name || "",
    priority: banner?.priority ?? 0,
    target_device: banner?.target_device || "all",
    status: banner?.status || "published",
    start_at: banner?.start_at ? banner.start_at.slice(0, 16) : "",
    end_at: banner?.end_at ? banner.end_at.slice(0, 16) : "",
  });

  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Live validator istilah terlarang
  const titleViolation = checkProhibitedTerms(formData.title);
  const sponsorViolation = checkProhibitedTerms(formData.sponsor_name);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (titleViolation.hasViolation) {
      setErrorMsg(`Judul mengandung istilah dilarang: ${titleViolation.violations.join(", ")}`);
      return;
    }

    if (!formData.alt_text || formData.alt_text.trim().length < 5) {
      setErrorMsg("Teks alternatif (alt) wajib minimal 5 karakter untuk aksesibilitas");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: any = {
        ...formData,
        id: banner?.id,
        target_url: formData.target_url || null,
        sponsor_name: formData.sponsor_name || null,
        start_at: formData.start_at ? new Date(formData.start_at).toISOString() : null,
        end_at: formData.end_at ? new Date(formData.end_at).toISOString() : null,
      };

      const res = await saveAdminBannerAction(payload);
      if (res.success) {
        onSaved();
      } else {
        setErrorMsg(res.error || "Gagal menyimpan banner");
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl bg-[#0C0D1A] border-l border-white/10 h-full overflow-y-auto p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[#FF1752]" />
              <span>{banner ? "Edit Banner" : "Tambah Banner Baru"}</span>
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 mb-6 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form id="banner-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Judul Internal Banner *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Contoh: Pengumuman Pendaftaran Musim 2026"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-white/10 text-xs text-white focus:outline-none focus:border-[#FF1752]"
              />
              {titleViolation.hasViolation && (
                <p className="text-[11px] text-red-400 mt-1">
                  ⚠️ Peringatan: Teks mengandung istilah terlarang ({titleViolation.violations.join(", ")})
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Penempatan (Placement) *
                </label>
                <select
                  value={formData.placement}
                  onChange={(e) => setFormData({ ...formData, placement: e.target.value as any })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-white/10 text-xs text-white focus:outline-none focus:border-[#FF1752]"
                >
                  <option value="home_top">Beranda Atas (Di bawah Hero)</option>
                  <option value="home_middle">Beranda Tengah (Sebelum Berita)</option>
                  <option value="explore">Halaman Jelajah</option>
                  <option value="news">Halaman Berita</option>
                  <option value="profile_sidebar">Bilah Samping Profil</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Status Penayangan *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-white/10 text-xs text-white focus:outline-none focus:border-[#FF1752]"
                >
                  <option value="published">Tayang Langsung (Published)</option>
                  <option value="scheduled">Terjadwal Sesuai Tanggal (Scheduled)</option>
                  <option value="draft">Draf (Draft)</option>
                  <option value="archived">Arsipkan (Archived)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                URL Gambar Desktop (Rasio 21:8 disarankan) *
              </label>
              <input
                type="url"
                required
                value={formData.desktop_image_url}
                onChange={(e) => setFormData({ ...formData, desktop_image_url: e.target.value })}
                placeholder="https://example.com/banner-desktop.webp"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-white/10 text-xs text-white focus:outline-none focus:border-[#FF1752]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                URL Gambar Mobile (Rasio 16:9 disarankan)
              </label>
              <input
                type="url"
                value={formData.mobile_image_url}
                onChange={(e) => setFormData({ ...formData, mobile_image_url: e.target.value })}
                placeholder="https://example.com/banner-mobile.webp"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-white/10 text-xs text-white focus:outline-none focus:border-[#FF1752]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Teks Alternatif (Alt Text) Wajib Aksesibilitas *
              </label>
              <input
                type="text"
                required
                value={formData.alt_text}
                onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
                placeholder="Deskripsikan isi visual banner untuk pembaca layar (screen reader)"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-white/10 text-xs text-white focus:outline-none focus:border-[#FF1752]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Target URL (Opsional)
                </label>
                <input
                  type="text"
                  value={formData.target_url}
                  onChange={(e) => setFormData({ ...formData, target_url: e.target.value })}
                  placeholder="https://... atau /explore"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-white/10 text-xs text-white focus:outline-none focus:border-[#FF1752]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Prioritas Tampil (0 - 100)
                </label>
                <input
                  type="number"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-white/10 text-xs text-white focus:outline-none focus:border-[#FF1752]"
                />
              </div>
            </div>

            {/* Iklan & Sponsor */}
            <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_ad"
                  checked={formData.is_ad}
                  onChange={(e) => setFormData({ ...formData, is_ad: e.target.checked })}
                  className="rounded border-white/20 bg-slate-800 text-[#FF1752] focus:ring-[#FF1752]"
                />
                <label htmlFor="is_ad" className="text-xs font-semibold text-white cursor-pointer">
                  Tandai sebagai Banner Iklan / Berbayar (Wajib label Sponsor)
                </label>
              </div>

              {formData.is_ad && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nama Sponsor Resmi
                  </label>
                  <input
                    type="text"
                    value={formData.sponsor_name}
                    onChange={(e) => setFormData({ ...formData, sponsor_name: e.target.value })}
                    placeholder="Contoh: Bank Nagari / ESI Pusat"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-white/10 text-xs text-white focus:outline-none focus:border-[#FF1752]"
                  />
                </div>
              )}
            </div>

            {/* Jadwal Penayangan */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Mulai Tayang (Opsional)
                </label>
                <input
                  type="datetime-local"
                  value={formData.start_at}
                  onChange={(e) => setFormData({ ...formData, start_at: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-white/10 text-xs text-white focus:outline-none focus:border-[#FF1752]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Selesai Tayang (Opsional)
                </label>
                <input
                  type="datetime-local"
                  value={formData.end_at}
                  onChange={(e) => setFormData({ ...formData, end_at: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-white/10 text-xs text-white focus:outline-none focus:border-[#FF1752]"
                />
              </div>
            </div>

            {/* Pratinjau Interaktif Desktop vs Mobile */}
            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300">Pratinjau Live Banner</span>
                <div className="flex items-center gap-1 bg-black/60 p-1 rounded-lg border border-white/10">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice("desktop")}
                    className={`p-1.5 rounded text-xs ${previewDevice === "desktop" ? "bg-[#FF1752] text-white" : "text-slate-400"}`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice("mobile")}
                    className={`p-1.5 rounded text-xs ${previewDevice === "mobile" ? "bg-[#FF1752] text-white" : "text-slate-400"}`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div
                className={`relative mx-auto rounded-xl overflow-hidden border border-white/20 bg-black/80 ${
                  previewDevice === "desktop" ? "w-full aspect-[21/8]" : "w-64 aspect-[16/9]"
                }`}
              >
                {formData.desktop_image_url ? (
                  <Image
                    src={previewDevice === "desktop" ? formData.desktop_image_url : formData.mobile_image_url || formData.desktop_image_url}
                    alt={formData.alt_text || "Preview"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-xs text-slate-500 font-mono">
                    Masukkan URL gambar untuk melihat pratinjau
                  </div>
                )}
                {formData.is_ad && (
                  <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-[#FF1752] text-[9px] font-bold text-white">
                    IKLAN
                  </span>
                )}
                <div className="absolute bottom-2 left-3 right-3 text-white text-xs font-bold truncate drop-shadow-md">
                  {formData.title || "Judul Banner"}
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-semibold text-white transition-all cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            form="banner-form"
            disabled={isSubmitting || titleViolation.hasViolation}
            className="px-5 py-2 rounded-xl bg-[#FF1752] hover:bg-[#FF1752]/90 text-xs font-bold text-white transition-all cursor-pointer disabled:opacity-50 shadow-lg shadow-[#FF1752]/20"
          >
            {isSubmitting ? "Menyimpan..." : "Simpan & Publikasikan"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 2. EDITOR BLOK BERANDA (HERO & BAGIAN LAINNYA)
// ============================================================================
function HomeContentEditor({ onToast }: { onToast: (msg: string) => void }) {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [revisions, setRevisions] = useState<Record<string, any[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form states untuk Hero Block
  const [heroForm, setHeroForm] = useState({
    headline: "Satu Ekosistem Resmi. Identitas Digital Terpercaya.",
    subheadline: "Portal resmi Pengprov ESI Sumatera Barat untuk verifikasi identitas atlet, tim, pelatih, komunitas, dan arena kompetisi di 19 kabupaten dan kota.",
    cta_primary_label: "Daftar Identitas Resmi",
    cta_primary_href: "/register",
    cta_secondary_label: "Jelajahi Direktori",
    cta_secondary_href: "/explore",
    hero_badge_text: "Pengprov ESI Sumatera Barat • Musim 2026",
  });

  const loadBlocks = async () => {
    setIsLoading(true);
    const res = await getAdminContentBlocksAction("home");
    if (res.success) {
      setBlocks(res.blocks);
      setRevisions(res.revisions || {});
      const hero = res.blocks.find((b) => b.slot === "hero");
      if (hero && hero.content) {
        setHeroForm({
          headline: hero.content.headline || heroForm.headline,
          subheadline: hero.content.subheadline || heroForm.subheadline,
          cta_primary_label: hero.content.cta_primary_label || heroForm.cta_primary_label,
          cta_primary_href: hero.content.cta_primary_href || heroForm.cta_primary_href,
          cta_secondary_label: hero.content.cta_secondary_label || heroForm.cta_secondary_label,
          cta_secondary_href: hero.content.cta_secondary_href || heroForm.cta_secondary_href,
          hero_badge_text: hero.content.hero_badge_text || heroForm.hero_badge_text,
        });
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadBlocks();
  }, []);

  const handleSaveHero = async () => {
    setIsSaving(true);
    const res = await saveAdminContentBlockAction({
      page: "home",
      slot: "hero",
      title: "Hero Banner Beranda",
      content: heroForm,
      change_summary: "Pembaruan teks hero dari panel CMS admin",
    });

    if (res.success) {
      onToast("✅ Blok Hero berhasil diperbarui");
      loadBlocks();
    } else {
      onToast(`❌ Gagal menyimpan: ${res.error}`);
    }
    setIsSaving(false);
  };

  const handleRollback = async (blockId: string, version: number) => {
    if (!confirm(`Kembalikan blok konten ke Versi ${version}?`)) return;
    const res = await rollbackAdminContentBlockAction(blockId, version);
    if (res.success) {
      onToast(`✅ Rollback ke Versi ${version} berhasil`);
      loadBlocks();
    } else {
      onToast(`❌ Gagal rollback: ${res.error}`);
    }
  };

  const currentHeroBlock = blocks.find((b) => b.slot === "hero");
  const heroRevs = currentHeroBlock ? revisions[currentHeroBlock.id || ""] || [] : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Editor Form */}
      <div className="lg:col-span-2 space-y-6">
        <QuietSurface radius="2xl" elevation="raised" className="p-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Layout className="w-5 h-5 text-[#FF1752]" />
                Editor Teks Hero Beranda
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Ubah judul besar, subjudul narasi, dan tombol aksi utama tanpa mengubah kode.
              </p>
            </div>
            {currentHeroBlock && (
              <span className="px-2.5 py-1 rounded-full bg-white/[0.06] text-xs font-mono text-slate-300">
                Versi Saat Ini: v{currentHeroBlock.current_version}
              </span>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Teks Badge Pemilik / Musim
              </label>
              <input
                type="text"
                value={heroForm.hero_badge_text}
                onChange={(e) => setHeroForm({ ...heroForm, hero_badge_text: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-white/10 text-xs text-white focus:outline-none focus:border-[#FF1752]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Headline Utama Hero *
              </label>
              <input
                type="text"
                value={heroForm.headline}
                onChange={(e) => setHeroForm({ ...heroForm, headline: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-white/10 text-xs text-white focus:outline-none focus:border-[#FF1752]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Subjudul Narasi (Maksimal 40 kata) *
              </label>
              <textarea
                rows={3}
                value={heroForm.subheadline}
                onChange={(e) => setHeroForm({ ...heroForm, subheadline: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-white/10 text-xs text-white focus:outline-none focus:border-[#FF1752]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Label Tombol Utama (CTA 1)
                </label>
                <input
                  type="text"
                  value={heroForm.cta_primary_label}
                  onChange={(e) => setHeroForm({ ...heroForm, cta_primary_label: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-white/10 text-xs text-white focus:outline-none focus:border-[#FF1752]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tujuan Tombol Utama (Href)
                </label>
                <input
                  type="text"
                  value={heroForm.cta_primary_href}
                  onChange={(e) => setHeroForm({ ...heroForm, cta_primary_href: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-white/10 text-xs text-white focus:outline-none focus:border-[#FF1752]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Label Tombol Sekunder (CTA 2)
                </label>
                <input
                  type="text"
                  value={heroForm.cta_secondary_label}
                  onChange={(e) => setHeroForm({ ...heroForm, cta_secondary_label: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-white/10 text-xs text-white focus:outline-none focus:border-[#FF1752]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tujuan Tombol Sekunder (Href)
                </label>
                <input
                  type="text"
                  value={heroForm.cta_secondary_href}
                  onChange={(e) => setHeroForm({ ...heroForm, cta_secondary_href: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-white/10 text-xs text-white focus:outline-none focus:border-[#FF1752]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end">
              <button
                type="button"
                disabled={isSaving}
                onClick={handleSaveHero}
                className="px-5 py-2 rounded-xl bg-[#FF1752] hover:bg-[#FF1752]/90 text-xs font-bold text-white transition-all cursor-pointer shadow-lg shadow-[#FF1752]/20 disabled:opacity-50"
              >
                {isSaving ? "Menyimpan..." : "Simpan Perubahan & Revalidasi"}
              </button>
            </div>
          </div>
        </QuietSurface>
      </div>

      {/* Revision History Sidebar */}
      <div>
        <QuietSurface radius="2xl" elevation="flat" className="p-6">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-amber-400" />
            Riwayat Revisi &amp; Rollback
          </h3>
          {heroRevs.length === 0 ? (
            <p className="text-xs text-slate-500 font-mono">Belum ada riwayat revisi.</p>
          ) : (
            <div className="space-y-3">
              {heroRevs.map((rev) => (
                <div
                  key={rev.id}
                  className="p-3 rounded-xl bg-white/[0.04] border border-white/10 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">Versi v{rev.version}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(rev.created_at).toLocaleDateString("id-ID")}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {rev.change_summary || "Pembaruan konten"}
                  </p>
                  {currentHeroBlock && rev.version !== currentHeroBlock.current_version && (
                    <button
                      type="button"
                      onClick={() => handleRollback(currentHeroBlock.id!, rev.version)}
                      className="self-start text-[11px] font-semibold text-[#FF4D77] hover:underline flex items-center gap-1 cursor-pointer mt-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Rollback ke Versi Ini</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </QuietSurface>
      </div>
    </div>
  );
}

// ============================================================================
// 3. PENGELOLA NAVIGASI (HEADER & FOOTER)
// ============================================================================
function NavigationManager({ onToast }: { onToast: (msg: string) => void }) {
  const [items, setItems] = useState<NavItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadNav = async () => {
    setIsLoading(true);
    const res = await getAdminNavItemsAction();
    if (res.success) {
      setItems(res.items);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadNav();
  }, []);

  const headerItems = items.filter((i) => i.location === "header");
  const footerItems = items.filter((i) => i.location.startsWith("footer"));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <QuietSurface radius="2xl" elevation="raised" className="p-6">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
          <Compass className="w-4 h-4 text-[#FF1752]" />
          Tautan Menu Header ({headerItems.length})
        </h3>
        <div className="space-y-2">
          {headerItems.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-bold text-white">{item.label}</span>
                <span className="text-[11px] text-slate-400 font-mono ml-2">({item.href})</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">
                Aktif
              </span>
            </div>
          ))}
        </div>
      </QuietSurface>

      <QuietSurface radius="2xl" elevation="raised" className="p-6">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
          <Layout className="w-4 h-4 text-[#2BB673]" />
          Tautan Footer &amp; Legal ({footerItems.length})
        </h3>
        <div className="space-y-2">
          {footerItems.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-bold text-white">{item.label}</span>
                <span className="text-[11px] text-slate-400 font-mono ml-2">({item.href})</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-white/[0.06] text-slate-400 font-mono">
                {item.location}
              </span>
            </div>
          ))}
        </div>
      </QuietSurface>
    </div>
  );
}

// ============================================================================
// 4. PENGELOLA HALAMAN LEGAL & KEBIJAKAN
// ============================================================================
function LegalPagesManager({ onToast }: { onToast: (msg: string) => void }) {
  const [pages, setPages] = useState<LegalPage[]>([]);
  const [selectedPage, setSelectedPage] = useState<LegalPage | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [markdownContent, setMarkdownContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const loadPages = async () => {
    const res = await getAdminLegalPagesAction();
    if (res.success) {
      setPages(res.pages);
      if (!selectedPage && res.pages.length > 0) {
        setSelectedPage(res.pages[0]);
        setMarkdownContent(res.pages[0].content_markdown);
      }
    }
  };

  useEffect(() => {
    loadPages();
  }, []);

  const handleSelect = (page: LegalPage) => {
    setSelectedPage(page);
    setMarkdownContent(page.content_markdown);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!selectedPage) return;
    setIsSaving(true);
    const res = await saveAdminLegalPageAction({
      slug: selectedPage.slug,
      title: selectedPage.title,
      content_markdown: markdownContent,
      version: (parseFloat(selectedPage.version || "1.0") + 0.1).toFixed(1),
      effective_date: new Date().toISOString().split("T")[0],
    });

    if (res.success) {
      onToast("✅ Halaman legal berhasil diperbarui");
      loadPages();
      setIsEditing(false);
    } else {
      onToast(`❌ Gagal: ${res.error}`);
    }
    setIsSaving(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar List */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          Dokumen Resmi
        </h3>
        {pages.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => handleSelect(p)}
            className={`w-full text-left p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              selectedPage?.slug === p.slug
                ? "bg-[#FF1752]/10 border-[#FF1752]/40 text-white"
                : "bg-white/[0.03] border-white/5 text-slate-400 hover:text-white"
            }`}
          >
            <div className="font-bold truncate">{p.title}</div>
            <div className="text-[10px] font-mono text-slate-500 mt-0.5">
              /{p.slug} • v{p.version}
            </div>
          </button>
        ))}
      </div>

      {/* Editor & Preview Area */}
      <div className="lg:col-span-3">
        {selectedPage && (
          <QuietSurface radius="2xl" elevation="raised" className="p-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div>
                <h2 className="text-base font-bold text-white">{selectedPage.title}</h2>
                <p className="text-xs text-slate-400 mt-0.5 font-mono">
                  Slug: /{selectedPage.slug} • Versi: v{selectedPage.version} • Berlaku: {selectedPage.effective_date}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1.5 rounded-xl bg-white/[0.06] text-xs font-semibold text-white"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={handleSave}
                      className="px-4 py-1.5 rounded-xl bg-[#FF1752] text-xs font-bold text-white shadow"
                    >
                      {isSaving ? "Menyimpan..." : "Simpan & Naikkan Versi"}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-semibold text-white flex items-center gap-1.5"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Konten Markdown</span>
                  </button>
                )}
              </div>
            </div>

            {isEditing ? (
              <textarea
                rows={16}
                value={markdownContent}
                onChange={(e) => setMarkdownContent(e.target.value)}
                className="w-full p-4 rounded-xl bg-slate-900 border border-white/10 font-mono text-xs text-white focus:outline-none focus:border-[#FF1752] leading-relaxed"
              />
            ) : (
              <div className="prose prose-invert max-w-none text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">
                {selectedPage.content_markdown}
              </div>
            )}
          </QuietSurface>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// 5. PENGELOLA PERTANYAAN UMUM (FAQ)
// ============================================================================
function FaqManager({ onToast }: { onToast: (msg: string) => void }) {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadFaq = async () => {
    setIsLoading(true);
    const res = await getAdminFaqItemsAction();
    if (res.success) {
      setFaqs(res.items);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadFaq();
  }, []);

  return (
    <QuietSurface radius="2xl" elevation="raised" className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#FF1752]" />
            Daftar Pertanyaan Umum (FAQ)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            FAQ yang ditampilkan di halaman bantuan dan panduan platform.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {faqs.map((f, idx) => (
          <div key={f.id || idx} className="p-4 rounded-xl bg-white/[0.04] border border-white/10">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-[#FF1752]/20 text-[#FF4D77] text-[10px] font-bold uppercase">
                {f.category}
              </span>
              <h3 className="text-xs font-bold text-white">{f.question}</h3>
            </div>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">{f.answer}</p>
          </div>
        ))}
      </div>
    </QuietSurface>
  );
}
