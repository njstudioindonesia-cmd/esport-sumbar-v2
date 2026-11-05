"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Server,
  LayoutDashboard,
  Newspaper,
  Users2,
  Database,
  Flag,
  History,
  ExternalLink,
  ShieldAlert,
  Sparkles,
  Settings,
} from "lucide-react";
import { BrandBar, BrandLogo } from "@/components/brand";

export function AdminPlatformNavbar() {
  const pathname = usePathname();
  const [reportsCount, setReportsCount] = useState<number>(0);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const res = await fetch("/api/admin/metrics");
        if (res.ok) {
          const json = await res.json();
          if (json.platform?.totalReports) {
            setReportsCount(json.platform.totalReports);
          }
        }
      } catch {
        // Ignored
      }
    }
    loadMetrics();

    const supabase = createClient();
    const channel = supabase
      .channel("navbar-platform-metrics")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "reports" },
        () => loadMetrics()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const navLinks = [
    {
      href: "/admin/platform",
      label: "Ringkasan Sistem",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: "/admin/platform/news",
      label: "CMS Berita",
      icon: Newspaper,
    },
    {
      href: "/admin/platform/admins",
      label: "Kelola Admin ESI",
      icon: Users2,
    },
    {
      href: "/admin/platform/reference",
      label: "Data Referensi Master",
      icon: Database,
    },
    {
      href: "/admin/platform/moderation",
      label: "Moderasi Laporan",
      icon: Flag,
      badge: reportsCount > 0 ? String(reportsCount) : undefined,
      badgeColor: "bg-red-500 text-white",
    },
    {
      href: "/admin/platform/audit",
      label: "Audit Log Global",
      icon: History,
    },
    {
      href: "/admin/platform/brand-settings",
      label: "Pengaturan Brand",
      icon: Settings,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#03031A]/95 backdrop-blur-md border-b border-white/10 select-none">
      <BrandBar glow={true} />

      {/* TOP BRAND BAR WITH OPERATOR RESTRICTION WARNING */}
      <div className="bg-[#0A0A2E] border-b border-white/10 px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF1752] animate-pulse" />
            <span
              className="px-2 py-0.5 rounded-full bg-[#FF1752]/15 border border-[#FF1752]/40 text-[#FF4D77] text-[10px] font-mono font-bold uppercase cursor-help"
              title="Platform dikelola ESPORT SUMBAR; mitra berwenang memverifikasi"
            >
              ESPORT SUMBAR
            </span>
            <span className="font-heading font-black tracking-wider text-white uppercase text-[11px]">
              PANEL ESPORT SUMBAR • OPERATOR SISTEM
            </span>
          </div>

          <span className="text-white/20 hidden sm:inline">•</span>

          <span className="px-2 py-0.5 rounded bg-blue-950/80 border border-blue-700 text-blue-300 text-[10px] font-mono font-bold flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-amber-400" />
            BATAS OTORITAS: Operator Dilarang Memverifikasi (Kewenangan Murni ESI)
          </span>
        </div>

        {/* Shortcuts */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin/province"
            className="text-[11px] text-white/50 hover:text-white transition-colors hidden md:flex items-center gap-1 font-mono"
          >
            <span>Mode Admin Provinsi (Pengprov) →</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1 text-[11px] font-heading font-semibold text-white/70 hover:text-white"
          >
            <span>Portal Publik</span>
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
                PANEL OPERATOR SISTEM
              </span>
              <span className="text-[8px] font-mono tracking-widest text-[#FF4D77] uppercase leading-none mt-0.5">
                Infrastruktur & Pengaturan Brand
              </span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-1">
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
                      ? "bg-[#1A1E28] text-[#3B82F6] border border-[#3B82F6]/40 shadow-sm"
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

        {/* SERVER HEALTH PILL */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#161922] border border-[#262B38] text-[11px] font-mono">
          <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
          <span className="text-gray-400">Server Health:</span>
          <strong className="text-white">Optimal 99.98%</strong>
        </div>
      </div>
    </header>
  );
}
