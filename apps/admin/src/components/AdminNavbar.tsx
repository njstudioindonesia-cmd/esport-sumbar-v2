"use client";

import React, { useState } from "react";
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
  Activity,
  Network,
  FileText,
  MapPin,
  Trophy,
  Sliders,
  LogOut,
} from "lucide-react";
import { Button } from "@esport-sumbar/ui";

export function AdminNavbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Ringkasan", icon: LayoutDashboard, exact: true },
    { href: "/verification", label: "Verifikasi", icon: ShieldCheck },
    { href: "/users", label: "Pengguna", icon: Users },
    { href: "/news", label: "Berita", icon: FileText },
    { href: "/content", label: "CMS & Banner", icon: Sliders },
    { href: "/games", label: "Katalog Game", icon: Gamepad2 },
    { href: "/regions", label: "Daerah", icon: MapPin },
    { href: "/relation-rules", label: "Aturan Relasi", icon: Network },
    { href: "/achievements", label: "Prestasi", icon: Trophy },
    { href: "/reports", label: "Laporan UGC", icon: Flag },
    { href: "/audit", label: "Audit Log", icon: History },
    { href: "/system", label: "Status Sistem", icon: Activity },
    { href: "/settings", label: "Pengaturan", icon: Settings },
  ];

  return (
    <aside className="w-64 min-h-screen bg-[#0C0C26] border-r border-white/[0.08] flex flex-col p-4 shrink-0 select-none">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-3 py-4 border-b border-white/[0.08] mb-4">
        <span className="w-8 h-8 rounded-lg bg-[#FF1752] text-white flex items-center justify-center font-black text-sm">
          V
        </span>
        <div className="flex flex-col">
          <span className="font-extrabold text-sm tracking-tight text-white">
            ESPORT SUMBAR
          </span>
          <span className="text-xs font-mono text-[#D4AF37] font-semibold">
            PORTAL ADMIN
          </span>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 flex flex-col gap-1 overflow-y-auto">
        {navLinks.map((link) => {
          const isActive = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href);
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? "bg-[#14143A] text-white font-bold border border-white/10"
                  : "text-white/60 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-[#FF1752]" : "text-white/50"}`} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Info & Logout */}
      <div className="pt-4 border-t border-white/[0.08] flex flex-col gap-3">
        <div className="flex flex-col px-3">
          <span className="text-xs font-semibold text-white">Administrator</span>
          <span className="text-[11px] text-white/40 font-mono">Sesi Host-Only</span>
        </div>
        <Button variant="ghost" size="sm" className="w-full justify-start text-[#F04438] hover:bg-[#F04438]/10" leftIcon={<LogOut className="w-3.5 h-3.5" />}>
          Keluar
        </Button>
      </div>
    </aside>
  );
}
