"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";

export function AdminPlatformNavbar() {
  const pathname = usePathname();

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
      badge: "2",
      badgeColor: "bg-red-500 text-white",
    },
    {
      href: "/admin/platform/audit",
      label: "Audit Log Global",
      icon: History,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B0D12]/95 backdrop-blur-md border-b border-[#262B38]">
      {/* TOP BRAND BAR WITH OPERATOR RESTRICTION WARNING */}
      <div className="bg-[#121622] border-b border-[#3B82F6]/30 px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6] animate-pulse" />
            <span className="font-heading font-black tracking-wider text-[#93C5FD] uppercase text-[11px]">
              PANEL OPERATOR SISTEM PLATFORM (ESPORT SUMBAR)
            </span>
          </div>

          <span className="text-gray-600 hidden sm:inline">•</span>

          <span className="px-2 py-0.5 rounded bg-blue-950/80 border border-blue-700 text-blue-300 text-[10px] font-mono font-bold flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-amber-400" />
            BATAS OTORITAS: Operator Dilarang Memverifikasi (Kewenangan Murni ESI)
          </span>
        </div>

        {/* Shortcuts */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin/province"
            className="text-[11px] text-gray-400 hover:text-[#D4AF37] transition-colors hidden md:flex items-center gap-1 font-mono"
          >
            <span>Mode Admin Provinsi (Pengprov) →</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1 text-[11px] font-heading font-semibold text-gray-300 hover:text-white"
          >
            <span>Portal Publik</span>
            <ExternalLink className="w-3 h-3 text-gray-400" />
          </Link>
        </div>
      </div>

      {/* LOWER NAVIGATION MENU */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/admin/platform" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] flex items-center justify-center text-white font-heading font-black text-xs shadow-md">
              OPS
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-black tracking-wider text-sm text-white uppercase leading-none">
                ESPORT<span className="text-[#D4AF37]">SUMBAR</span> OPS
              </span>
              <span className="text-[9px] font-mono tracking-widest text-[#9AA3B2] uppercase leading-none mt-0.5">
                Pengelolaan Infrastruktur & Referensi
              </span>
            </div>
          </Link>

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
