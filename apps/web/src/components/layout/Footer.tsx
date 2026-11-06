"use client";

import React from "react";
import Link from "next/link";
import { BrandLogo, BrandWatermark, OwnershipNote } from "@/components/brand";
import { Mail } from "lucide-react";

const CURRENT_YEAR = 2026;

export function Footer() {
  return (
    <footer className="relative w-full bg-[#00004F]/90 border-t border-white/[0.08] pt-14 pb-10 text-white/60 overflow-hidden select-none">
      {/* Background Watermark Mark (Opacity ~4%) */}
      <BrandWatermark opacity={0.04} size={600} position="bottom-right" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
        {/* TOP ROW: BRAND LOCKUP & COLUMNS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand Col (2 cols on large screen) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <BrandLogo variant="lockup" size="md" withLink={true} />

            <p className="text-xs text-white/70 max-w-sm leading-relaxed">
              Platform data, identitas digital paspor atlet (ESPORT ID), dan ekosistem turnamen esport Sumatera Barat oleh <strong className="text-white">ESPORT SUMBAR™</strong>.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://instagram.com/esportsumbar"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#0A0A2E] border border-white/10 flex items-center justify-center text-white/60 hover:text-[#FF4D77] hover:border-[#FF1752]/40 transition-colors"
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
                className="w-8 h-8 rounded-full bg-[#0A0A2E] border border-white/10 flex items-center justify-center text-white/60 hover:text-[#FF4D77] hover:border-[#FF1752]/40 transition-colors"
                aria-label="YouTube ESPORT SUMBAR"
              >
                <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a
                href="mailto:halo@esportsumbar.com"
                className="w-8 h-8 rounded-full bg-[#0A0A2E] border border-white/10 flex items-center justify-center text-white/60 hover:text-[#FF4D77] hover:border-[#FF1752]/40 transition-colors"
                aria-label="Email Resmi ESPORT SUMBAR"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 1: Direktori */}
          <div className="flex flex-col gap-2.5 text-xs">
            <span className="font-heading font-black text-white uppercase tracking-wider text-xs mb-1">
              Direktori &amp; Data
            </span>
            <Link href="/explore" className="hover:text-white transition-colors">
              Jelajah Roster Atlet
            </Link>
            <Link href="/explore?tab=teams" className="hover:text-white transition-colors">
              Klub &amp; Tim Esport
            </Link>
            <Link href="/explore?tab=communities" className="hover:text-white transition-colors">
              Komunitas &amp; Komunitas Game
            </Link>
            <Link href="/regions" className="hover:text-white transition-colors">
              19 Kota / Kabupaten
            </Link>
            <Link href="/me/profile/new" className="text-[#FF4D77] hover:text-white transition-colors font-semibold">
              Buat Kartu Atlet &rarr;
            </Link>
          </div>

          {/* Col 2: Ekosistem & Informasi */}
          <div className="flex flex-col gap-2.5 text-xs">
            <span className="font-heading font-black text-white uppercase tracking-wider text-xs mb-1">
              Ekosistem
            </span>
            <Link href="/news" className="hover:text-white transition-colors">
              Warta &amp; Berita
            </Link>
            <Link href="/how-it-works" className="hover:text-white transition-colors">
              Cara Kerja Sistem
            </Link>
            <Link href="/about" className="hover:text-white transition-colors">
              Tentang ESPORT SUMBAR
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Kebijakan Privasi
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Syarat &amp; Ketentuan
            </Link>
          </div>

          {/* Col 3: Verifikasi Mandiri */}
          <div className="flex flex-col gap-2.5 text-xs">
            <span className="font-heading font-black text-white uppercase tracking-wider text-xs mb-1">
              Verifikasi Tunggal
            </span>
            <p className="text-[11px] text-white/50 leading-relaxed">
              Standar sertifikasi paspor atlet dan profil entitas tunggal langsung diverifikasi oleh tim kurasi ESPORT SUMBAR.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] font-mono text-[10px] font-bold">
                ESP-SB-VER-2026
              </span>
            </div>
          </div>
        </div>

        {/* BOTTOM ROW: COPYRIGHT & OWNERSHIP NOTE */}
        <div className="pt-6 border-t border-white/[0.08] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[11px] text-white/50">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <p className="font-medium text-white/70">
              © {CURRENT_YEAR} ESPORT SUMBAR. Hak cipta dilindungi undang-undang.
            </p>
            <span className="hidden sm:inline text-white/20">•</span>
            <OwnershipNote variant="short" withAboutLink={true} />
          </div>

          <div className="flex items-center gap-4 text-white/50">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privasi
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Syarat
            </Link>
            <Link href="/about" className="hover:text-white transition-colors">
              Tentang
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
