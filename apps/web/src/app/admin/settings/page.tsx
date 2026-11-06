"use client";

import React, { useState } from "react";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { Footer } from "@/components/layout/Footer";
import {
  Sparkles,
  Save,
  Building,
  Mail,
  Calendar,
  Share2,
  ShieldCheck,
  Check,
  Globe,
  Award,
} from "lucide-react";
import { BrandLogo, BrandBar, IssuedBy } from "@/components/brand";

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    brandName: "ESPORT SUMBAR™",
    legalEntityName: "ESPORT SUMBAR™",
    tagline: "Pusat Data & Identitas Esport Sumatera Barat",
    mission: "Membangun ekosistem paspor atlet digital yang mandiri, transparan, dan terverifikasi untuk 19 daerah.",
    contactEmail: "halo@esportsumbar.com",
    address: "Sumatera Barat, Indonesia",
    foundingYear: "2026",
    instagramUrl: "https://instagram.com/esportsumbar",
    youtubeUrl: "https://youtube.com/@esportsumbar",
    announcementBanner: "Selamat datang di ESPORT SUMBAR V3 — Ekosistem data dan paspor esport tunggal Ranah Minang.",
    announcementActive: true,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[#FFFFFF] flex flex-col font-sans selection:bg-[#FF1752]/30 selection:text-white">
      <AdminNavbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full bg-[#FF1752]/15 border border-[#FF1752]/30 text-[10px] font-mono text-[#FF4D77] font-bold">
                PANEL ADMIN PLATFORM
              </span>
              <span className="text-xs text-white/40 font-mono">
                Satu Sumber Kebenaran Konfigurasi V3
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black uppercase text-white tracking-tight">
              Pengaturan Platform &amp; Identitas Brand
            </h1>
            <p className="text-xs sm:text-sm text-white/60 mt-1 max-w-2xl leading-relaxed">
              Konfigurasi teks brand tunggal, informasi kontak resmi, dan pengumuman banner global.
            </p>
          </div>

          {saved && (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold animate-in fade-in">
              <Check className="w-4 h-4" />
              <span>Pengaturan Tersimpan</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-6">
          {/* 1. INFORMASI IDENTITAS MEREK */}
          <div className="p-6 rounded-3xl bg-[#0B0E17] border border-white/10 flex flex-col gap-4">
            <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FF4D77]" />
              <span>Identitas Resmi ESPORT SUMBAR</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="font-mono uppercase text-white/60">Nama Merek / Brand</label>
                <input
                  type="text"
                  value={form.brandName}
                  onChange={(e) => setForm({ ...form, brandName: e.target.value })}
                  className="p-3 rounded-xl bg-black/40 border border-white/15 text-white focus:outline-none focus:border-[#FF1752]/60"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono uppercase text-white/60">Badan Hukum Pengendali</label>
                <input
                  type="text"
                  value={form.legalEntityName}
                  onChange={(e) => setForm({ ...form, legalEntityName: e.target.value })}
                  className="p-3 rounded-xl bg-black/40 border border-white/15 text-white focus:outline-none focus:border-[#FF1752]/60"
                />
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="font-mono uppercase text-white/60">Tagline Resmi</label>
                <input
                  type="text"
                  value={form.tagline}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                  className="p-3 rounded-xl bg-black/40 border border-white/15 text-white focus:outline-none focus:border-[#FF1752]/60"
                />
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="font-mono uppercase text-white/60">Visi &amp; Pernyataan Misi</label>
                <textarea
                  rows={2}
                  value={form.mission}
                  onChange={(e) => setForm({ ...form, mission: e.target.value })}
                  className="p-3 rounded-xl bg-black/40 border border-white/15 text-white focus:outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* 2. PENGUMUMAN BANNER GLOBAL */}
          <div className="p-6 rounded-3xl bg-[#0B0E17] border border-white/10 flex flex-col gap-4">
            <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-amber-400" />
              <span>Pengumuman Banner Global</span>
            </h3>

            <div className="flex flex-col gap-3 text-xs">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="bannerActive"
                  checked={form.announcementActive}
                  onChange={(e) => setForm({ ...form, announcementActive: e.target.checked })}
                  className="w-4 h-4 accent-[#FF1752] rounded"
                />
                <label htmlFor="bannerActive" className="text-white font-medium cursor-pointer">
                  Tampilkan banner pengumuman di bagian atas situs
                </label>
              </div>

              <input
                type="text"
                value={form.announcementBanner}
                onChange={(e) => setForm({ ...form, announcementBanner: e.target.value })}
                placeholder="Isi teks pengumuman..."
                className="p-3 rounded-xl bg-black/40 border border-white/15 text-white focus:outline-none"
              />
            </div>
          </div>

          {/* 3. KONTAK & MEDIA SOSIAL */}
          <div className="p-6 rounded-3xl bg-[#0B0E17] border border-white/10 flex flex-col gap-4">
            <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-400" />
              <span>Kontak &amp; Tautan Sosial</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="font-mono uppercase text-white/60">Email Kontak</label>
                <input
                  type="email"
                  value={form.contactEmail}
                  onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                  className="p-3 rounded-xl bg-black/40 border border-white/15 text-white focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono uppercase text-white/60">Instagram URL</label>
                <input
                  type="text"
                  value={form.instagramUrl}
                  onChange={(e) => setForm({ ...form, instagramUrl: e.target.value })}
                  className="p-3 rounded-xl bg-black/40 border border-white/15 text-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              className="btn-brand-primary px-6 py-3 rounded-xl font-heading font-bold uppercase tracking-wider flex items-center gap-2 text-xs shadow-xl shadow-[#FF1752]/20"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Pengaturan</span>
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
