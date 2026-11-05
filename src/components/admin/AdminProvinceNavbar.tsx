"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Award,
  LayoutDashboard,
  Inbox,
  BarChart3,
  History,
  ExternalLink,
  MapPin,
  Clock,
  Sparkles,
  Building,
  Shield,
} from "lucide-react";
import { BrandBar, BrandLogo } from "@/components/brand";
import { createClient } from "@/lib/supabase/client";

export function AdminProvinceNavbar() {
  const pathname = usePathname();
  const [pendingGoldCount, setPendingGoldCount] = useState<number>(0);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const res = await fetch("/api/admin/metrics");
        if (res.ok) {
          const json = await res.json();
          if (typeof json.province?.pendingGold === "number") {
            setPendingGoldCount(json.province.pendingGold);
          }
        }
      } catch {
        // Ignored
      }
    }
    loadMetrics();

    const supabase = createClient();
    const channel = supabase
      .channel("navbar-province-metrics")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "verification_requests" },
        () => loadMetrics()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const navLinks = [
    {
      href: "/admin/province",
      label: "Ringkasan 19 Daerah",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: "/admin/province/queue",
      label: "Antrean Pengesahan Emas",
      icon: Inbox,
      badge: pendingGoldCount > 0 ? String(pendingGoldCount) : undefined,
      badgeColor: "bg-[#D4AF37] text-black",
    },
    {
      href: "/admin/province/stats",
      label: "Statistik & Cakupan Wilayah",
      icon: BarChart3,
    },
    {
      href: "/admin/province/logs",
      label: "Log Audit Provinsi",
      icon: History,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#03031A]/95 backdrop-blur-md border-b border-white/10 select-none">
      <BrandBar glow={true} />

      {/* TOP BRAND BAR */}
      <div className="bg-[#0A0A2E] border-b border-white/10 px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-pulse" />
            <span
              className="px-2 py-0.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-mono font-bold uppercase cursor-help"
              title="Mitra berwenang memverifikasi; platform dikelola ESPORT SUMBAR"
            >
              Mitra ESI Provinsi
            </span>
            <span className="font-heading font-black tracking-wider text-white uppercase text-[11px]">
              PANEL ESPORT SUMBAR • VERIFIKASI PROVINSI
            </span>
          </div>

          <span className="text-white/20 hidden sm:inline">•</span>

          <span className="px-2 py-0.5 rounded bg-[#D4AF37]/15 text-[#D4AF37] text-[10px] font-mono font-bold flex items-center gap-1">
            <Award className="w-3 h-3" />
            VALIDASI TINGKAT PROVINSI (LENCANA EMAS)
          </span>
        </div>

        {/* Shortcuts */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin/region"
            className="text-[11px] text-white/50 hover:text-white transition-colors hidden md:flex items-center gap-1 font-mono"
          >
            <span>← Mode Admin Daerah (Pengcab)</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1 text-[11px] font-heading font-semibold text-white/70 hover:text-white"
          >
            <span>Ke Portal Publik</span>
            <ExternalLink className="w-3 h-3 text-white/40" />
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
                PENGPROV ESI SUMBAR
              </span>
              <span className="text-[8px] font-mono tracking-widest text-[#D4AF37] uppercase leading-none mt-0.5">
                Verifikasi 19 Kota & Kabupaten
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
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-[#161922] border border-[#D4AF37]/30 text-[11px] font-mono">
          <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span className="text-gray-400">Target SLA Pengesahan Emas:</span>
          <strong className="text-[#D4AF37]">&le; 3 Hari Kerja</strong>
        </div>
      </div>
    </header>
  );
}
