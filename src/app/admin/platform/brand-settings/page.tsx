"use client";

import React, { useState } from "react";
import { AdminPlatformNavbar } from "@/components/admin/AdminPlatformNavbar";
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

export default function AdminBrandSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    brandName: "ESPORT SUMBAR™",
    legalEntityName: "ESPORT SUMBAR™",
    tagline: "Pusat Data & Identitas Esport Sumatera Barat",
    mission: "Membangun ekosistem paspor atlet digital yang transparan dan terverifikasi untuk 19 daerah.",
    contactEmail: "halo@esportsumbar.com",
    address: "Sumatera Barat, Indonesia",
    foundingYear: "2026",
    instagramUrl: "https://instagram.com/esportsumbar",
    youtubeUrl: "https://youtube.com/@esportsumbar",
    partnerEsiProvinceLogoPermitted: false,
    partnerEsiCitiesLogoPermitted: false,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[#FFFFFF] flex flex-col font-sans selection:bg-[#FF1752]/30 selection:text-white">
      <AdminPlatformNavbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full bg-[#FF1752]/15 border border-[#FF1752]/30 text-[10px] font-mono text-[#FF4D77] font-bold">
                PANEL OPERATOR SISTEM
              </span>
              <span className="text-xs text-white/40 font-mono">
                Satu Sumber Kebenaran Teks Brand
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black uppercase text-white tracking-tight">
              Pengaturan Identitas & Legalitas Brand
            </h1>
            <p className="text-xs text-white/60 mt-1 max-w-2xl leading-relaxed">
              Kelola teks resmi nama merek, badan hukum, kontak, dan izin penayangan logo mitra yang disinkronkan ke seluruh aplikasi.
            </p>
          </div>

          <button
            type="submit"
            form="brand-settings-form"
            className="btn-brand-primary text-xs py-2 px-5 self-start md:self-auto"
          >
            {saved ? <Check className="w-4 h-4 text-white" /> : <Save className="w-4 h-4" />}
            <span>{saved ? "Tersimpan!" : "Simpan Pengaturan"}</span>
          </button>
        </div>

        {/* FORM */}
        <form id="brand-settings-form" onSubmit={handleSave} className="flex flex-col gap-8">
          {/* Section 1: Entitas Legal & Merek */}
          <div className="p-6 rounded-2xl bg-[#0A0A2E] border border-white/10 flex flex-col gap-5">
            <div className="flex items-center gap-2 pb-3 border-b border-white/10 text-[#FF1752]">
              <Building className="w-4 h-4" />
              <h2 className="font-heading font-bold text-base uppercase text-white tracking-wide">
                1. Entitas Legal & Nama Merek
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono text-white/60 uppercase block mb-1.5">
                  Nama Merek Dagang
                </label>
                <input
                  type="text"
                  value={form.brandName}
                  onChange={(e) => setForm({ ...form, brandName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#03031A] border border-white/10 text-white text-xs font-mono focus:border-[#FF1752] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-white/60 uppercase block mb-1.5">
                  Badan Hukum Pengelola
                </label>
                <input
                  type="text"
                  value={form.legalEntityName}
                  onChange={(e) => setForm({ ...form, legalEntityName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#03031A] border border-white/10 text-white text-xs font-mono focus:border-[#FF1752] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-white/60 uppercase block mb-1.5">
                  Tahun Berdiri Platform
                </label>
                <input
                  type="text"
                  value={form.foundingYear}
                  onChange={(e) => setForm({ ...form, foundingYear: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#03031A] border border-white/10 text-white text-xs font-mono focus:border-[#FF1752] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-white/60 uppercase block mb-1.5">
                  Email Kontak Resmi
                </label>
                <input
                  type="email"
                  value={form.contactEmail}
                  onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#03031A] border border-white/10 text-white text-xs font-mono focus:border-[#FF1752] focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-mono text-white/60 uppercase block mb-1.5">
                  Tagline Utama
                </label>
                <input
                  type="text"
                  value={form.tagline}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#03031A] border border-white/10 text-white text-xs font-mono focus:border-[#FF1752] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Izin Penayangan Logo Mitra */}
          <div className="p-6 rounded-2xl bg-[#0A0A2E] border border-white/10 flex flex-col gap-5">
            <div className="flex items-center gap-2 pb-3 border-b border-white/10 text-[#22C55E]">
              <ShieldCheck className="w-4 h-4" />
              <h2 className="font-heading font-bold text-base uppercase text-white tracking-wide">
                2. Izin Penayangan Logo Mitra Kelembagaan
              </h2>
            </div>

            <p className="text-xs text-white/60 leading-relaxed">
              Sesuai aturan branding (Prompt B0/B1/B10): Logo resmi mitra (Pengprov ESI Sumbar atau ESI Kota/Kabupaten) <strong>hanya boleh ditampilkan jika telah ada izin tertulis atau berkas logo resmi</strong>. Jika belum ada izin tertulis, platform akan menampilkan nama teks monokrom.
            </p>

            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 rounded-xl bg-[#03031A] border border-white/5 cursor-pointer hover:border-white/20 transition-colors">
                <input
                  type="checkbox"
                  checked={form.partnerEsiProvinceLogoPermitted}
                  onChange={(e) => setForm({ ...form, partnerEsiProvinceLogoPermitted: e.target.checked })}
                  className="w-4 h-4 rounded text-[#FF1752] focus:ring-[#FF1752] bg-[#0A0A2E] border-white/20"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-white">
                    Izin Logo Pengprov ESI Sumbar (Tingkat Provinsi)
                  </span>
                  <span className="text-[10px] text-white/50">
                    Aktifkan hanya jika MoU / kesepakatan tertulis penggunaan logo telah disahkan.
                  </span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-[#03031A] border border-white/5 cursor-pointer hover:border-white/20 transition-colors">
                <input
                  type="checkbox"
                  checked={form.partnerEsiCitiesLogoPermitted}
                  onChange={(e) => setForm({ ...form, partnerEsiCitiesLogoPermitted: e.target.checked })}
                  className="w-4 h-4 rounded text-[#FF1752] focus:ring-[#FF1752] bg-[#0A0A2E] border-white/20"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-white">
                    Izin Logo 19 Pengcab ESI Kota & Kabupaten
                  </span>
                  <span className="text-[10px] text-white/50">
                    Jika tidak dicentang, nama wilayah tampil dalam bentuk teks skala abu standar.
                  </span>
                </div>
              </label>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
