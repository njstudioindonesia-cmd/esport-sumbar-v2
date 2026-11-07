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
} from "lucide-react";
import { BrandLogo, BrandBar, OwnershipNote } from "@/components/brand";
import { CommandPalette } from "@/components/shared/CommandPalette";
import { UserProfileDropdown } from "@/components/layout/UserProfileDropdown";
import { GlassButton } from "@/components/glass/GlassButton";
import { MOTION_SPRINGS } from "@/components/glass/MotionPresets";
import { createClient } from "@/lib/supabase/client";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: string; email: string } | null>(null);
  const pathname = usePathname();

  // Navigation Links V3
  const navLinks = [
    { href: "/", label: "Beranda" },
    { href: "/explore", label: "Jelajah", icon: Compass },
    { href: "/ecosystem", label: "Ekosistem", icon: Network },
    { href: "/tournaments", label: "Turnamen", icon: Trophy },
    { href: "/news", label: "Berita", icon: Newspaper },
    { href: "/regions", label: "Daerah", icon: MapPin },
    { href: "/about", label: "Tentang", icon: Info },
  ];

  // Scroll detection for navbar shrink
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        {/* Brand Bar Glowing Top Line */}
        <BrandBar glow={true} />

        {/* Floating Glass Bar Container */}
        <div
          className={`w-full transition-all duration-300 ${
            isScrolled
              ? "py-2 bg-slate-950/85 backdrop-blur-2xl border-b border-white/15 shadow-xl shadow-black/50"
              : "py-3.5 bg-slate-950/60 backdrop-blur-md border-b border-white/10"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            {/* BRAND LOGO */}
            <div className="flex items-center gap-3">
              <BrandLogo
                variant="responsive"
                size={isScrolled ? "sm" : "md"}
                priority={true}
              />
            </div>

            {/* DESKTOP NAVIGATION LINKS */}
            <nav
              aria-label="Navigasi Utama"
              className="hidden lg:flex items-center gap-1 bg-white/[0.04] border border-white/10 p-1.5 rounded-2xl shadow-inner backdrop-blur-md"
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
                    className={`relative px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors duration-150 select-none ${
                      isActive
                        ? "text-white"
                        : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="navbar-active-pill"
                        transition={MOTION_SPRINGS.snappy}
                        className="absolute inset-0 bg-white/15 border border-white/20 rounded-xl shadow-sm -z-10"
                      />
                    )}
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* DESKTOP RIGHT ACTIONS */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Command Palette Trigger */}
              <button
                type="button"
                onClick={() => setIsCommandOpen(true)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs text-slate-300 hover:text-white transition-all min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 cursor-pointer"
                aria-label="Cari profil atlet, tim, atau warta (Ctrl+K)"
              >
                <Search className="w-3.5 h-3.5 text-pink-400" />
                <span className="font-medium">Cari...</span>
                <kbd className="inline-flex items-center px-1.5 py-0.5 rounded bg-white/10 border border-white/15 text-[10px] font-mono text-slate-400">
                  ⌘K
                </kbd>
              </button>

              {currentUser ? (
                <UserProfileDropdown />
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login">
                    <GlassButton variant="ghost" size="sm">
                      <LogIn className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      Masuk
                    </GlassButton>
                  </Link>

                  <Link href="/register">
                    <GlassButton variant="primary" size="sm">
                      <UserPlus className="w-3.5 h-3.5 mr-1" />
                      Daftar
                    </GlassButton>
                  </Link>
                </div>
              )}
            </div>

            {/* MOBILE RIGHT CONTROLS: SEARCH + HAMBURGER */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                type="button"
                onClick={() => setIsCommandOpen(true)}
                className="p-2.5 rounded-2xl bg-white/[0.06] border border-white/10 text-slate-300 hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
                aria-label="Pencarian"
              >
                <Search className="w-4 h-4 text-pink-400" />
              </button>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-2xl bg-white/[0.06] border border-white/10 text-slate-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Buka menu navigasi"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-pink-500" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE MENU DROPDOWN */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={MOTION_SPRINGS.snappy}
              className="lg:hidden w-full bg-slate-950/95 border-b border-white/15 backdrop-blur-2xl px-5 py-6 flex flex-col gap-5 shadow-2xl"
            >
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
                      className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold transition-all min-h-[44px] ${
                        isActive
                          ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md shadow-pink-500/20"
                          : "text-slate-300 hover:bg-white/[0.06] hover:text-white"
                      }`}
                    >
                      {Icon && <Icon className="w-4 h-4 text-inherit shrink-0" />}
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Auth Buttons / Profile on Mobile */}
              <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
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
                      <GlassButton variant="secondary" className="w-full">
                        <LogIn className="w-4 h-4 mr-1.5 text-slate-400" />
                        Masuk
                      </GlassButton>
                    </Link>

                    <Link
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full"
                    >
                      <GlassButton variant="primary" className="w-full">
                        <UserPlus className="w-4 h-4 mr-1.5" />
                        Daftar
                      </GlassButton>
                    </Link>
                  </div>
                )}
              </div>

              {/* Ownership Note Footer in Mobile Drawer */}
              <div className="pt-2">
                <OwnershipNote variant="short" />
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
