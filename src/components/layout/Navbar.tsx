"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Sparkles,
  Compass,
  Newspaper,
  MapPin,
  HelpCircle,
  LogIn,
  UserPlus,
  Shield,
  Layers,
  Trophy,
  Map,
  Users,
  Building2,
} from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/explore", label: "Jelajah", icon: Compass },
    { href: "/tournaments", label: "Turnamen", icon: Trophy },
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
    { href: "/map", label: "Peta GIS", icon: Map },
    { href: "/communities", label: "Komunitas", icon: Users },
    { href: "/venues", label: "Venue", icon: Building2 },
    { href: "/regions", label: "19 Daerah", icon: MapPin },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B0D12]/90 backdrop-blur-md border-b border-[#262B38]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* BRAND LOGO */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-3 w-7 rounded-sm overflow-hidden shadow-sm group-hover:scale-105 transition-transform">
            <span className="w-1/3 bg-[#C8102E]" title="Merah Marawa" />
            <span className="w-1/3 bg-[#D4AF37]" title="Kuning Emas" />
            <span className="w-1/3 bg-black" title="Hitam" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-black tracking-wider text-base sm:text-lg text-white group-hover:text-[#D4AF37] transition-colors leading-none">
              ESPORT<span className="text-[#D4AF37]">SUMBAR</span>
            </span>
            <span className="text-[8px] font-mono tracking-widest text-[#9AA3B2] uppercase leading-none mt-0.5">
              Pusat Data & Identitas Digital
            </span>
          </div>
        </Link>

        {/* DESKTOP NAVIGATION MENU */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
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
                <Icon className="w-3.5 h-3.5 text-gray-400 group-hover:text-white" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* DESKTOP CTA BUTTONS */}
        <div className="hidden md:flex items-center gap-2.5">
          <Link
            href="/login"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#161922] hover:bg-[#1A1E28] border border-[#262B38] text-xs font-heading font-bold text-gray-200 hover:text-white transition-colors"
          >
            <LogIn className="w-3.5 h-3.5 text-gray-400" />
            <span>Masuk</span>
          </Link>

          <Link
            href="/register"
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#E5C358] hover:brightness-110 text-[#0B0D12] text-xs font-heading font-extrabold uppercase tracking-wider shadow-[0_0_15px_rgba(212,175,55,0.35)] transition-all"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Daftar Sekarang</span>
          </Link>
        </div>

        {/* MOBILE HAMBURGER BUTTON */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg bg-[#161922] border border-[#262B38] text-gray-300 hover:text-white focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* MOBILE DRAWER / DROPDOWN */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#262B38] bg-[#0E1117]/98 px-4 pt-3 pb-6 flex flex-col gap-3 animate-in slide-in-from-top-3 duration-200">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-heading font-semibold uppercase tracking-wider transition-colors ${
                    isActive
                      ? "bg-[#1A1E28] text-[#D4AF37] border border-[#D4AF37]/30"
                      : "text-gray-300 hover:text-white hover:bg-[#161922]"
                  }`}
                >
                  <Icon className="w-4 h-4 text-[#D4AF37]" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-[#262B38] flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#161922] border border-[#262B38] text-xs font-heading font-bold text-white text-center"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk ke Akun</span>
            </Link>

            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#D4AF37] text-black text-xs font-heading font-extrabold uppercase tracking-wider shadow-lg text-center"
            >
              <UserPlus className="w-4 h-4" />
              <span>Daftar & Buat ESPORT ID</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
