"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CreditCard,
  ShieldCheck,
  Users,
  Lock,
  Settings,
  Bell,
  Search,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { CommandPalette } from "@/components/shared/CommandPalette";

interface DesktopUserShellProps {
  children: React.ReactNode;
  breadcrumb?: string;
}

const NAV_ITEMS = [
  { href: "/dashboard", label: "Beranda", icon: LayoutDashboard },
  { href: "/me/cards", label: "Kartu", icon: CreditCard },
  { href: "/me/verification", label: "Verifikasi", icon: ShieldCheck },
  { href: "/me/memberships", label: "Tim", icon: Users },
  { href: "/me/privacy", label: "Privasi", icon: Lock },
  { href: "/me/settings", label: "Pengaturan", icon: Settings },
];

export function DesktopUserShell({ children, breadcrumb }: DesktopUserShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [hasUnreadNotification, setHasUnreadNotification] = useState(true);
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  // Keyboard shortcut listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#07080C] text-white flex select-none">
      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />

      {/* ========================================================= */}
      {/* SIDEBAR KIRI RAMPING DAPAT DILIPAT                        */}
      {/* ========================================================= */}
      <aside
        className={`sticky top-0 h-screen border-r border-white/[0.08] bg-[#0B0D14] flex flex-col justify-between transition-all duration-300 z-40 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Top Header / Brand */}
        <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 overflow-hidden group">
            {/* Marawa Tricolor Bar */}
            <div className="flex h-5 w-1.5 shrink-0 rounded-full overflow-hidden">
              <span className="h-1/3 w-full bg-[#C8102E]" />
              <span className="h-1/3 w-full bg-[#D4AF37]" />
              <span className="h-1/3 w-full bg-black" />
            </div>

            {!collapsed && (
              <div className="flex flex-col truncate">
                <span className="font-heading font-black text-xs tracking-wider text-white group-hover:text-[#D4AF37] transition-colors">
                  ESPORT SUMBAR
                </span>
                <span className="text-[9px] font-mono text-white/40 tracking-widest uppercase">
                  PASPOR ATLET
                </span>
              </div>
            )}
          </Link>

          {/* Collapse Toggle */}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] flex items-center justify-center text-white/50 hover:text-white transition-colors"
            title={collapsed ? "Perluas Sidebar" : "Lipat Sidebar"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items (Ikon + 1 Kata) */}
        <nav className="flex-1 px-3 py-6 flex flex-col gap-1.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-3.5 px-3 py-3 rounded-xl text-xs font-heading font-bold transition-all group ${
                  isActive
                    ? "bg-[#D4AF37]/10 text-[#D4AF37] border-l-2 border-[#D4AF37] shadow-sm"
                    : "text-white/60 hover:text-white hover:bg-white/[0.04]"
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 transition-colors ${
                    isActive ? "text-[#D4AF37]" : "text-white/50 group-hover:text-white"
                  }`}
                />
                {!collapsed && <span className="truncate">{item.label}</span>}

                {/* Verification Active Indicator */}
                {item.href === "/me/verification" && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom User Profile Card */}
        <div className="p-3 border-t border-white/[0.06]">
          <div
            className={`p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-3 ${
              collapsed ? "justify-center" : "justify-between"
            }`}
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-[#D4AF37]/40 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=400&auto=format&fit=crop"
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              {!collapsed && (
                <div className="flex flex-col truncate">
                  <span className="text-xs font-heading font-bold text-white truncate">
                    Sutan Harimau
                  </span>
                  <span className="text-[10px] font-mono text-[#D4AF37]">
                    TIER 3 • ELITE
                  </span>
                </div>
              )}
            </div>

            {!collapsed && (
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="w-7 h-7 rounded-lg text-white/40 hover:text-red-400 hover:bg-white/[0.06] flex items-center justify-center transition-colors"
                title="Keluar"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* MAIN CONTENT AREA & TOPBAR                                */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar: Breadcrumb, Pencarian Cmd+K, Notifikasi, Avatar */}
        <header className="sticky top-0 h-16 border-b border-white/[0.08] bg-[#07080C]/90 backdrop-blur-xl px-8 flex items-center justify-between z-30">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-white/40">Dashboard</span>
            <span className="text-white/20">/</span>
            <span className="text-white font-semibold">
              {breadcrumb ||
                (pathname === "/dashboard"
                  ? "Beranda"
                  : pathname === "/me/cards"
                  ? "Kartu"
                  : pathname === "/me/verification"
                  ? "Verifikasi"
                  : pathname === "/me/memberships"
                  ? "Tim"
                  : pathname === "/me/privacy"
                  ? "Privasi"
                  : "Pengaturan")}
            </span>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-4">
            {/* Pencarian Cmd+K Pill */}
            <button
              type="button"
              onClick={() => setIsCommandOpen(true)}
              className="hidden md:flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-white/20 text-xs font-mono text-white/50 hover:text-white transition-all group"
            >
              <Search className="w-3.5 h-3.5 text-white/40 group-hover:text-white transition-colors" />
              <span>Cari...</span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-[#D4AF37]">
                ⌘K
              </kbd>
            </button>

            {/* Notification Bell with Gold Dot */}
            <button
              type="button"
              onClick={() => setHasUnreadNotification(false)}
              className="relative w-9 h-9 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] flex items-center justify-center text-white/60 hover:text-white transition-colors"
              title="Notifikasi"
            >
              <Bell className="w-4 h-4" />
              {hasUnreadNotification && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#D4AF37] ring-2 ring-[#07080C]" />
              )}
            </button>

            {/* Public Profile View Shortcut */}
            <Link
              href="/player/sutan_aim"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-xs font-mono text-[#D4AF37] transition-all"
            >
              <span>Lihat Publik</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-8 lg:p-10 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
