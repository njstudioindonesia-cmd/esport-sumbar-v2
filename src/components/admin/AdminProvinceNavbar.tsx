"use client";

import React from "react";
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

export function AdminProvinceNavbar() {
  const pathname = usePathname();

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
      badge: "5",
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
    <header className="sticky top-0 z-40 w-full bg-[#0B0D12]/95 backdrop-blur-md border-b border-[#262B38]">
      {/* TOP BRAND BAR */}
      <div className="bg-[#151208] border-b border-[#D4AF37]/30 px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-pulse" />
            <span className="font-heading font-black tracking-wider text-[#D4AF37] uppercase text-[11px]">
              PENGURUS PROVINSI ESI SUMATERA BARAT (PENGPROV)
            </span>
          </div>

          <span className="text-gray-600 hidden sm:inline">•</span>

          <span className="px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-mono font-bold flex items-center gap-1">
            <Award className="w-3 h-3" />
            OTORITAS TERTINGGI: PENERBIT LENCANA RESMI
          </span>
        </div>

        {/* Shortcuts */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin/region"
            className="text-[11px] text-gray-400 hover:text-white transition-colors hidden md:flex items-center gap-1 font-mono"
          >
            <span>← Mode Admin Daerah (Pengcab)</span>
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
          <Link href="/admin/province" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#8C6D1F] flex items-center justify-center text-black font-heading font-black text-xs shadow-md">
              ESI
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-black tracking-wider text-sm text-white uppercase leading-none">
                ESI SUMATERA BARAT
              </span>
              <span className="text-[9px] font-mono tracking-widest text-[#D4AF37] uppercase leading-none mt-0.5">
                Pengesahan 19 Kota & Kabupaten
              </span>
            </div>
          </Link>

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
