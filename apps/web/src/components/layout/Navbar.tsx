"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Compass,
  Newspaper,
  MapPin,
  Info,
  LogIn,
  UserPlus,
  Search,
  Network,
  Trophy,
  ChevronRight,
} from "lucide-react";
import { BrandLogo, BrandBar, OwnershipNote } from "@/components/brand";
import { CommandPalette } from "@/components/shared/CommandPalette";
import { UserProfileDropdown } from "@/components/layout/UserProfileDropdown";
import { GlassButton } from "@/components/glass/GlassButton";
import { MOTION_SPRINGS } from "@/components/glass/MotionPresets";
import { createClient } from "@/lib/supabase/client";
import { FLAGS } from "@/lib/config/flags";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: string; email: string } | null>(null);
  const pathname = usePathname();

  // Navigation Links V3 (Sesuai P9: Sembunyikan turnamen jika data riil belum siap)
  const navLinks = [
    { href: "/", label: "Beranda" },
    { href: "/explore", label: "Jelajah", icon: Compass },
    { href: "/ecosystem", label: "Ekosistem", icon: Network },
    ...(FLAGS.ENABLE_TOURNAMENTS ? [{ href: "/tournaments", label: "Turnamen", icon: Trophy }] : []),
    { href: "/news", label: "Berita", icon: Newspaper },
    { href: "/regions", label: "Daerah", icon: MapPin },
    { href: "/about", label: "Tentang", icon: Info },
  ];

  // Scroll detection for subtle background opacity transition (ZERO height shift)
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open to prevent background scrolling glitches
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Close mobile drawer when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Keyboard shortcut Cmd/Ctrl + K for search
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

  // Supabase Auth Session Listener
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setCurrentUser({
          id: data.user.id,
          email: data.user.email || "",
        });
      } else {
        setCurrentUser(null);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUser({
          id: session.user.id,
          email: session.user.email || "",
        });
      } else {
        setCurrentUser(null);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full select-none">
        {/* Sleek Hairline Brand Bar Accent */}
        <BrandBar glow={false} />

        {/* Stable Fixed-Height Glass Topbar */}
        <div
          className={`w-full h-16 transition-colors duration-200 border-b flex items-center ${
            isScrolled
              ? "bg-slate-950/90 backdrop-blur-xl border-white/[0.12] shadow-lg shadow-black/40"
              : "bg-slate-950/75 backdrop-blur-md border-white/[0.08]"
          }`}
        >
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            {/* BRAND LOGO - Constant size md, zero layout shift */}
            <div className="flex items-center shrink-0">
              <BrandLogo
                variant="responsive"
                size="md"
                priority={true}
              />
            </div>

            {/* DESKTOP NAVIGATION LINKS - Modern Floating Capsule */}
            <nav
              aria-label="Navigasi Utama"
              className="hidden lg:flex items-center gap-0.5 bg-white/[0.03] border border-white/[0.08] p-1 rounded-full shadow-inner backdrop-blur-md"
            >
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 select-none ${
                      isActive
                        ? "bg-white/15 text-white font-bold shadow-sm border border-white/20"
                        : "text-slate-400 hover:text-white hover:bg-white/[0.05]"
                    }`}
                  >
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* DESKTOP RIGHT ACTIONS: SEARCH CAPSULE + AUTH */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Command Palette Trigger */}
              <button
                type="button"
                onClick={() => setIsCommandOpen(true)}
                className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#FF1752]/40 text-xs text-slate-300 hover:text-white transition-all min-h-[38px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 cursor-pointer shadow-sm group"
                aria-label="Cari profil atlet, tim, atau warta (Ctrl+K)"
              >
                <Search className="w-3.5 h-3.5 text-[#FF1752] group-hover:scale-110 transition-transform" />
                <span className="font-medium text-slate-300 group-hover:text-white transition-colors">Cari...</span>
                <kbd className="inline-flex items-center px-1.5 py-0.5 rounded bg-white/10 border border-white/15 text-[10px] font-mono text-slate-400 group-hover:text-slate-200">
                  ⌘K
                </kbd>
              </button>

              {currentUser ? (
                <UserProfileDropdown />
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login">
                    <GlassButton variant="ghost" size="sm" className="rounded-full px-4">
                      <LogIn className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                      Masuk
                    </GlassButton>
                  </Link>

                  <Link href="/register">
                    <GlassButton variant="primary" size="sm" className="rounded-full px-4 font-bold">
                      <UserPlus className="w-3.5 h-3.5 mr-1.5" />
                      Daftar
                    </GlassButton>
                  </Link>
                </div>
              )}
            </div>

            {/* MOBILE RIGHT CONTROLS: CIRCULAR GLASS BUTTONS */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                type="button"
                onClick={() => setIsCommandOpen(true)}
                className="w-10 h-10 rounded-full bg-white/[0.05] hover:bg-white/[0.1] active:scale-95 border border-white/10 text-slate-300 hover:text-white transition-all flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
                aria-label="Pencarian"
              >
                <Search className="w-4 h-4 text-[#FF1752]" />
              </button>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-10 h-10 rounded-full bg-white/[0.05] hover:bg-white/[0.1] active:scale-95 border border-white/10 text-slate-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 transition-all flex items-center justify-center"
                aria-label="Buka menu navigasi"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-[#FF1752]" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* MODERN MOBILE DRAWER OVERLAY (Glitch-Free Full Screen Glass Sheet) */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="lg:hidden fixed inset-x-0 top-[65px] bottom-0 z-50 bg-slate-950/95 backdrop-blur-2xl px-5 py-6 flex flex-col justify-between overflow-y-auto border-t border-white/10 shadow-2xl"
            >
              <div className="flex flex-col gap-4">
                {/* Mobile Quick Search Bar */}
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsCommandOpen(true);
                  }}
                  className="w-full h-11 px-4 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-pink-500/40 text-slate-300 flex items-center justify-between text-xs font-medium transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <Search className="w-4 h-4 text-[#FF1752]" />
                    <span>Cari profil atlet, tim, atau berita...</span>
                  </div>
                  <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono text-slate-400">
                    ⌘K
                  </kbd>
                </button>

                {/* Mobile Navigation Links */}
                <nav aria-label="Menu Navigasi Mobile" className="flex flex-col gap-1.5">
                  {navLinks.map((link) => {
                    const isActive =
                      link.href === "/"
                        ? pathname === "/"
                        : pathname.startsWith(link.href);
                    const Icon = link.icon;

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition-all min-h-[46px] ${
                          isActive
                            ? "bg-gradient-to-r from-[#FF1752] to-[#FF4D77] text-white shadow-md shadow-pink-500/25 font-bold"
                            : "text-slate-300 hover:bg-white/[0.06] hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {Icon && <Icon className="w-4 h-4 text-inherit shrink-0" />}
                          <span>{link.label}</span>
                        </div>
                        <ChevronRight className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-white/30"}`} />
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Bottom Auth Dock & Ownership Note */}
              <div className="pt-6 border-t border-white/10 flex flex-col gap-4 mt-6">
                {currentUser ? (
                  <UserProfileDropdown
                    isMobileDrawer={true}
                    onClose={() => setMobileMenuOpen(false)}
                  />
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full"
                    >
                      <GlassButton variant="secondary" className="w-full rounded-xl h-11">
                        <LogIn className="w-4 h-4 mr-1.5 text-slate-400" />
                        Masuk
                      </GlassButton>
                    </Link>

                    <Link
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full"
                    >
                      <GlassButton variant="primary" className="w-full rounded-xl h-11 font-bold">
                        <UserPlus className="w-4 h-4 mr-1.5" />
                        Daftar
                      </GlassButton>
                    </Link>
                  </div>
                )}

                <div className="pt-1">
                  <OwnershipNote variant="short" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Global Cmd+K Search Command Palette */}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
      />
    </>
  );
}
