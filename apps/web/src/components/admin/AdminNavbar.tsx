"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShieldCheck,
  Newspaper,
  Users2,
  Gamepad2,
  MapPin,
  Flag,
  History,
  Settings,
  ExternalLink,
  Sparkles,
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
          if (typeof json.province?.pendingGold === "number" || typeof json.region?.pending === "number") {
            const total = (json.province?.pendingGold || 0) + (json.region?.pending || 0);
            setPendingVerifications(total);
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
      label: "Antrean Verifikasi",
      icon: ShieldCheck,
      badge: pendingVerifications > 0 ? String(pendingVerifications) : undefined,
      badgeColor: "bg-[#D4AF37] text-black font-bold",
    },
    {
      href: "/admin/users",
      label: "Pengguna & Akun",
      icon: Users2,
    },
    {
      href: "/admin/games",
      label: "Katalog Game",
      icon: Gamepad2,
    },
    {
      href: "/admin/regions",
      label: "Wilayah",
      icon: MapPin,
    },
    {
      href: "/admin/news",
      label: "CMS Berita",
      icon: Newspaper,
    },
    {
      href: "/admin/moderation",
      label: "Moderasi Laporan",
      icon: Flag,
      badge: reportsCount > 0 ? String(reportsCount) : undefined,
      badgeColor: "bg-red-500 text-white",
    },
    {
      href: "/admin/audit",
      label: "Audit Log",
      icon: History,
    },
    {
      href: "/admin/settings",
      label: "Pengaturan",
      icon: Settings,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#03031A]/95 backdrop-blur-md border-b border-white/10 select-none">
      <BrandBar glow={true} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* SISI KIRI: BRAND LOCKUP & PERAN */}
          <div className="flex items-center gap-4 shrink-0">
            <BrandLogo variant="lockup" size="sm" withLink={false} />
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#FF1752]/10 border border-[#FF1752]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF1752] animate-pulse" />
              <span className="text-[10px] font-mono tracking-widest text-[#FF4D77] uppercase font-bold">
                PANEL ADMIN PLATFORM
              </span>
            </div>
          </div>

          {/* SISI KANAN: STATUS KONEKSI & KE SITUS */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-white/60">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Satu Admin Tunggal (V3)</span>
            </div>

            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/10 border border-white/10 text-xs font-heading font-medium text-white transition-colors"
            >
              <span>Ke Situs</span>
              <ExternalLink className="w-3.5 h-3.5 text-white/50" />
            </Link>
          </div>
        </div>

        {/* BARIS KEDUA: TAB NAVIGASI TUNGGAL */}
        <nav className="flex items-center gap-1 overflow-x-auto py-2 border-t border-white/5 scrollbar-none">
          {navLinks.map((link) => {
            const isActive = link.exact
              ? pathname === link.href
              : pathname === link.href || pathname?.startsWith(`${link.href}/`);
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-heading font-semibold transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? "bg-[#FF1752] text-white shadow-md shadow-[#FF1752]/20"
                    : "text-white/60 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
                {link.badge && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold ${link.badgeColor}`}
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

// Backward-compatibility export alias
export const AdminPlatformNavbar = AdminNavbar;
