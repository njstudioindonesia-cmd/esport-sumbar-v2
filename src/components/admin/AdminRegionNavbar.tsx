"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldCheck,
  LayoutDashboard,
  Inbox,
  History,
  ExternalLink,
  ChevronDown,
  Building2,
  AlertTriangle,
  MapPin,
  Clock,
  Sparkles,
} from "lucide-react";
import { REGIONS_DETAIL } from "@/data/regions";
import { BrandBar, BrandLogo } from "@/components/brand";

export function AdminRegionNavbar() {
  const pathname = usePathname();
  const [activeRegionCode, setActiveRegionCode] = useState("PDG");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const activeRegion =
    REGIONS_DETAIL.find((r) => r.code === activeRegionCode) || REGIONS_DETAIL[0];

  const navLinks = [
    {
      href: "/admin/region",
      label: "Ringkasan",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: "/admin/region/queue",
      label: "Antrean Pengajuan",
      icon: Inbox,
      badge: "5",
      badgeColor: "bg-[#D4AF37] text-black",
    },
    {
      href: "/admin/region/logs",
      label: "Log Aktivitas Append-Only",
      icon: History,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#03031A]/95 backdrop-blur-md border-b border-white/10 select-none">
      <BrandBar glow={true} />

      {/* TOP BAR: REGION IDENTITY & DATA ISOLATION */}
      <div className="bg-[#0A0A2E] border-b border-white/10 px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
            <span
              className="px-2 py-0.5 rounded-full bg-[#22C55E]/15 border border-[#22C55E]/30 text-[#22C55E] text-[10px] font-mono font-bold uppercase cursor-help"
              title="Mitra berwenang memverifikasi; platform dikelola ESPORT SUMBAR"
            >
              Mitra ESI Kota/Kab
            </span>
            <span className="font-heading font-black tracking-wider text-white uppercase text-[11px]">
              PANEL ESPORT SUMBAR • VERIFIKASI DAERAH
            </span>
          </div>

          <span className="text-white/20 hidden sm:inline">•</span>

          {/* Region Switcher Mockup with RLS Indicator */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#1A1E28] hover:bg-[#262B38] border border-[#262B38] text-white text-[11px] font-mono transition-colors"
            >
              <MapPin className="w-3 h-3 text-[#D4AF37]" />
              <span className="font-bold">{activeRegion.name}</span>
              <span className="px-1.5 py-0.2 rounded bg-black/50 text-[10px] text-[#D4AF37]">
                {activeRegion.code}
              </span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 mt-1 w-64 max-h-60 overflow-y-auto rounded-xl bg-[#161922] border border-[#262B38] shadow-2xl z-50 p-1 flex flex-col gap-0.5">
                <div className="p-2 border-b border-[#262B38] text-[10px] text-gray-400">
                  <strong className="text-gray-200">Multi-Wilayah RLS (Simulasi Akun):</strong>
                  <br />Admin hanya dapat mengakses data wilayah yang ditugaskan.
                </div>
                {REGIONS_DETAIL.slice(0, 7).map((r) => (
                  <button
                    key={r.code}
                    type="button"
                    onClick={() => {
                      setActiveRegionCode(r.code);
                      setDropdownOpen(false);
                    }}
                    className={`flex items-center justify-between p-2 rounded-lg text-left text-xs transition-colors ${
                      r.code === activeRegionCode
                        ? "bg-[#1A1E28] text-[#D4AF37] font-bold"
                        : "text-gray-300 hover:bg-[#1A1E28] hover:text-white"
                    }`}
                  >
                    <span>{r.name}</span>
                    <span className="text-[10px] font-mono text-gray-400">{r.code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Back to Public Portal Shortcut */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin/province"
            className="text-[11px] text-gray-400 hover:text-[#D4AF37] transition-colors hidden md:flex items-center gap-1 font-mono"
          >
            <span>Simulasi Mode ESI Provinsi →</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1 text-[11px] font-heading font-semibold text-gray-300 hover:text-white"
          >
            <span>Ke Portal Publik</span>
            <ExternalLink className="w-3 h-3 text-gray-400" />
          </Link>
        </div>
      </div>

      {/* LOWER NAVIGATION MENU */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <BrandLogo variant="lockup" size="sm" withLink={true} />
            <span className="text-white/20 hidden md:inline">|</span>
            <div className="hidden md:flex flex-col">
              <span className="font-heading font-black tracking-wider text-xs text-white uppercase leading-none">
                PENGCAB {activeRegion.name.toUpperCase()}
              </span>
              <span className="text-[8px] font-mono tracking-widest text-[#22C55E] uppercase leading-none mt-0.5">
                Verifikasi Wilayah Tahap 1
              </span>
            </div>
          </div>

          <nav className="hidden sm:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = link.exact
                ? pathname === link.href
                : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-heading font-semibold uppercase tracking-wider transition-colors ${
                    isActive
                      ? "bg-[#1A1E28] text-[#D4AF37] border border-[#D4AF37]/40 shadow-sm"
                      : "text-gray-300 hover:text-white hover:bg-[#161922]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-gray-400" />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span
                      className={`ml-1 px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold ${
                        link.badgeColor || "bg-[#1A1E28] text-white"
                      }`}
                    >
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* SLA STATUS PILL */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-[#161922] border border-[#262B38] text-[11px] font-mono">
          <Clock className="w-3.5 h-3.5 text-[#22C55E]" />
          <span className="text-gray-400">Target SLA Peninjauan:</span>
          <strong className="text-white">&le; 5 Hari Kerja</strong>
        </div>
      </div>
    </header>
  );
}
