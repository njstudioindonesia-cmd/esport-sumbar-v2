"use client";

import React from "react";
import Link from "next/link";
import { BrandLogo, BrandWatermark, OwnershipNote } from "@/components/brand";
import { GlassSegmented, useQualityMode, type QualityMode } from "@/components/glass";
import { Mail, ShieldCheck, Sparkles, Sliders } from "lucide-react";

const CURRENT_YEAR = 2026;

export function Footer() {
  const { quality, setQualityMode, fps } = useQualityMode();

  return (
    <footer className="relative w-full bg-slate-950/80 backdrop-blur-2xl border-t border-white/10 pt-16 pb-12 text-slate-400 overflow-hidden select-none font-sans">
      {/* Background Watermark */}
      <BrandWatermark opacity={0.03} size={560} position="bottom-right" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
        {/* TOP ROW: BRAND LOCKUP & COLUMNS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand Col (2 cols on large screen) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <BrandLogo variant="lockup" size="md" withLink={true} />

            <p className="text-xs text-slate-300 max-w-sm leading-relaxed">
              Platform data, identitas digital paspor atlet (ESPORT ID), dan ekosistem esports Sumatera Barat oleh <strong className="text-white">ESPORT SUMBAR™</strong>.
            </p>

            {/* Visual Quality Mode Switcher */}
            <div className="pt-2 flex flex-col gap-2 max-w-xs">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-semibold text-slate-300">
                  <Sliders className="w-3.5 h-3.5 text-pink-400" />
                  Efek Visual Liquid Glass:
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                  {fps} FPS
                </span>
              </div>
              <GlassSegmented<QualityMode>
                size="sm"
                value={quality}
                onChange={(mode) => setQualityMode(mode, true)}
                options={[
                  { value: "full", label: "Penuh" },
                  { value: "standard", label: "Standar" },
                  { value: "eco", label: "Hemat" },
                ]}
              />
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com/esportsumbar"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 flex items-center justify-center text-slate-400 hover:text-pink-400 hover:border-pink-500/40 transition-colors"
                aria-label="Instagram ESPORT SUMBAR"
              >
                <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://youtube.com/@esportsumbar"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 flex items-center justify-center text-slate-400 hover:text-pink-400 hover:border-pink-500/40 transition-colors"
                aria-label="YouTube ESPORT SUMBAR"
              >
                <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a
                href="mailto:kontak@esportsumbar.com"
                className="w-9 h-9 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 flex items-center justify-center text-slate-400 hover:text-pink-400 hover:border-pink-500/40 transition-colors"
                aria-label="Email Kontak ESPORT SUMBAR"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 1: Direktori 7 Bidang */}
          <div className="flex flex-col gap-2.5 text-xs">
            <span className="font-bold text-white uppercase tracking-wider text-xs mb-1">
              Direktori 7 Bidang
            </span>
            <Link href="/players" className="hover:text-white transition-colors">
              Pemain / Atlet
            </Link>
            <Link href="/teams" className="hover:text-white transition-colors">
              Tim Esports
            </Link>
            <Link href="/coaches" className="hover:text-white transition-colors">
              Pelatih
            </Link>
            <Link href="/communities" className="hover:text-white transition-colors">
              Komunitas
            </Link>
            <Link href="/venues" className="hover:text-white transition-colors">
              Venue / Arena
            </Link>
            <Link href="/campuses" className="hover:text-white transition-colors">
              Kampus
            </Link>
            <Link href="/schools" className="hover:text-white transition-colors">
              Sekolah
            </Link>
            <Link href="/regions" className="hover:text-white transition-colors">
              19 Wilayah Sumbar
            </Link>
          </div>

          {/* Col 2: Ekosistem & Regulasi */}
          <div className="flex flex-col gap-2.5 text-xs">
            <span className="font-bold text-white uppercase tracking-wider text-xs mb-1">
              Ekosistem & Warta
            </span>
            <Link href="/ecosystem" className="hover:text-white transition-colors">
              Peta Ekosistem
            </Link>
            <Link href="/tournaments" className="hover:text-white transition-colors">
              Turnamen
            </Link>
            <Link href="/games" className="hover:text-white transition-colors">
              Katalog Game
            </Link>
            <Link href="/news" className="hover:text-white transition-colors">
              Warta & Berita
            </Link>
            <Link href="/verification-standard" className="text-amber-300 hover:text-amber-200 transition-colors flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Standar Verifikasi
            </Link>
            <Link href="/how-it-works" className="hover:text-white transition-colors">
              Cara Kerja
            </Link>
          </div>

          {/* Col 3: Legal & Bantuan */}
          <div className="flex flex-col gap-2.5 text-xs">
            <span className="font-bold text-white uppercase tracking-wider text-xs mb-1">
              Bantuan & Legal
            </span>
            <Link href="/about" className="hover:text-white transition-colors">
              Tentang ESPORT SUMBAR
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Kontak
            </Link>
            <Link href="/faq" className="hover:text-white transition-colors">
              Pertanyaan Umum (FAQ)
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Kebijakan Privasi
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Syarat &amp; Ketentuan
            </Link>
            <Link href="/content-policy" className="hover:text-white transition-colors">
              Kebijakan Konten
            </Link>
          </div>
        </div>

        {/* BOTTOM ROW: OWNERSHIP STATEMENT & COPYRIGHT */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            {`© ${CURRENT_YEAR} ESPORT SUMBAR™. Seluruh hak cipta dilindungi.`}
          </p>
          <div>
            <OwnershipNote variant="short" />
          </div>
        </div>
      </div>
    </footer>
  );
}
