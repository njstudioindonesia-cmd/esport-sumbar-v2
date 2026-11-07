"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShieldCheck,
  Users,
  Gamepad2,
  Flag,
  History,
  Settings,
  ExternalLink,
  Sparkles,
  Activity,
  Network,
  FileText,
} from "lucide-react";
import { BrandBar, BrandLogo } from "@/components/brand";

export function AdminNavbar() {
  const pathname = usePathname();
  const [pendingVerifications, setPendingVerifications] = useState<number>(0);
  const [reportsCount, setReportsCount] = useState<number>(0);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const res = await fetch("/api/admin/metrics");
        if (res.ok) {
          const json = await res.json();
          const pending =
            json.platform?.pendingVerification ||
            json.verification?.pending ||
            0;
          if (typeof pending === "number") {
            setPendingVerifications(pending);
          }
          if (typeof json.platform?.totalReports === "number") {
            setReportsCount(json.platform.totalReports);
          }
        }
      } catch {
        // Ignored
      }
    }
    loadMetrics();
  }, []);

  const navLinks = [
    {
      href: "/admin",
      label: "Ringkasan",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: "/admin/verification",
      label: "Verifikasi",
      icon: ShieldCheck,
      badge: pendingVerifications > 0 ? String(pendingVerifications) : undefined,
      badgeColor: "bg-amber-400 text-slate-950 font-bold",
    },
    {
      href: "/admin/users",
      label: "Pengguna",
      icon: Users,
    },
    {
      href: "/admin/relation-rules",
      label: "Aturan Relasi",
      icon: Network,
    },
    {
      href: "/admin/content",
      label: "Konten",
      icon: FileText,
    },
    {
      href: "/admin/games",
      label: "Game",
      icon: Gamepad2,
    },
    {
      href: "/admin/reports",
      label: "Laporan",
      icon: Flag,
      badge: reportsCount > 0 ? String(reportsCount) : undefined,
      badgeColor: "bg-rose-500 text-white font-bold",
    },
    {
      href: "/admin/system",
      label: "Sistem",
      icon: Activity,
    },
    {
      href: "/admin/audit",
      label: "Audit",
      icon: History,
    },
    {
      href: "/admin/settings",
      label: "Pengaturan",
      icon: Settings,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/85 backdrop-blur-2xl border-b border-white/10 select-none font-sans">
      <BrandBar glow={true} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* SISI KIRI: BRAND LOCKUP & PERAN */}
          <div className="flex items-center gap-4 shrink-0">
            <BrandLogo variant="lockup" size="sm" withLink={false} />
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30">
              <span className="w-2 h-2 rounded-full bg-pink-500 shadow-sm shadow-pink-500/50" />
              <span className="text-[10px] font-mono tracking-widest text-pink-300 uppercase font-bold">
                PANEL ADMIN
              </span>
            </div>
          </div>

          {/* SISI KANAN: STATUS KONEKSI & KE SITUS */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-mono text-[11px]">V3 Liquid Glass</span>
            </div>

            <Link
              href="/"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-xs text-slate-200 hover:text-white transition-colors"
            >
              <span>Ke Situs Publik</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </div>
        </div>

        {/* BARIS KEDUA: TAB NAVIGASI HORIZONTAL */}
        <nav
          aria-label="Navigasi Panel Admin"
          className="flex items-center gap-1 overflow-x-auto py-2 border-t border-white/[0.06] scrollbar-none"
        >
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = link.exact
              ? pathname === link.href
              : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-white/15 text-white shadow-sm border border-white/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]"
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 ${
                    isActive ? "text-pink-400" : "text-slate-500"
                  }`}
                />
                <span>{link.label}</span>
                {link.badge && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono leading-none ${
                      link.badgeColor || "bg-pink-500 text-white"
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
    </header>
  );
}
