"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Compass,
  Newspaper,
  MapPin,
  HelpCircle,
  LogIn,
  UserPlus,
  Search,
} from "lucide-react";
import { CommandPalette } from "@/components/shared/CommandPalette";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // 4 Core Navigation Links (Prompt 0 & 2 specification)
  const navLinks = [
    { href: "/explore", label: "Jelajah", icon: Compass },
    { href: "/news", label: "Berita", icon: Newspaper },
    { href: "/regions", label: "Daerah", icon: MapPin },
    { href: "/how-it-works", label: "Cara Kerja", icon: HelpCircle },
  ];

  // Scroll detection for navbar shrink
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-[#07080C]/95 backdrop-blur-xl border-b border-white/[0.08] shadow-lg shadow-black/40 py-2"
            : "bg-[#07080C]/75 backdrop-blur-md border-b border-white/[0.05] py-3"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-all duration-300">
          {/* BRAND LOGO */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
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
                Pusat Data & Identitas
              </span>
            </div>
          </Link>

          {/* DESKTOP 4 CORE NAVIGATION LINKS */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5 bg-[#0F1118]/80 border border-white/[0.08] px-2 py-1 rounded-full shadow-inner">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-heading font-bold uppercase tracking-wider transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-black shadow-md shadow-amber-950/20"
                      : "text-gray-300 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      isActive ? "text-black" : "text-gray-400"
                    }`}
                  />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* DESKTOP RIGHT ACTIONS: Cmd+K, Masuk, Daftar */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Command Palette Trigger Pill */}
            <button
              onClick={() => setIsCommandOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0F1118] hover:bg-[#161A24] border border-white/[0.08] hover:border-white/20 text-xs text-gray-400 hover:text-white transition-all shadow-sm group"
            >
              <Search className="w-3.5 h-3.5 text-[#D4AF37] group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-sans">Cari...</span>
              <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-white/[0.06] border border-white/10 text-[9px] font-mono text-gray-400">
                ⌘K
              </kbd>
            </button>

            {/* Masuk */}
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-heading font-bold text-gray-300 hover:text-white hover:bg-white/[0.04] transition-colors"
            >
              <LogIn className="w-3.5 h-3.5 text-gray-400" />
              <span>Masuk</span>
            </Link>

            {/* Daftar (Emas) */}
            <Link
              href="/register"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B38F24] hover:brightness-110 text-black text-xs font-heading font-extrabold uppercase tracking-wider shadow-lg shadow-amber-950/30 transition-all active:scale-[0.98]"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Daftar</span>
            </Link>
          </div>

          {/* MOBILE RIGHT CONTROLS: SEARCH + HAMBURGER */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsCommandOpen(true)}
              className="p-2 rounded-xl bg-[#0F1118] border border-white/[0.08] text-gray-300"
              aria-label="Buka pencarian"
            >
              <Search className="w-4 h-4 text-[#D4AF37]" />
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-[#0F1118] border border-white/[0.08] text-gray-300 hover:text-white focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* MOBILE DRAWER / DROPDOWN */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-white/[0.08] bg-[#07080C]/98 backdrop-blur-2xl px-4 pt-3 pb-6 flex flex-col gap-3 animate-in slide-in-from-top-3 duration-200">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-colors ${
                      isActive
                        ? "bg-[#D4AF37] text-black"
                        : "text-gray-300 hover:text-white hover:bg-white/[0.04]"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-3 border-t border-white/[0.08] flex items-center gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#0F1118] border border-white/10 text-xs font-heading font-bold text-white text-center"
              >
                <LogIn className="w-3.5 h-3.5 text-gray-400" />
                <span>Masuk</span>
              </Link>

              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-black text-xs font-heading font-black uppercase tracking-wider shadow-lg text-center"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Daftar</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Global Command Palette Modal */}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
      />
    </>
  );
}
