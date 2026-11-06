"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  LayoutDashboard,
  LogOut,
  User,
  Shield,
} from "lucide-react";
import { BrandLogo, BrandBar, OwnershipNote } from "@/components/brand";
import { CommandPalette } from "@/components/shared/CommandPalette";
import { UserProfileDropdown } from "@/components/layout/UserProfileDropdown";
import { createClient } from "@/lib/supabase/client";
import { signOutAction } from "@/app/actions/auth";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: string; email: string } | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  // 4 Core Navigation Links (Prompt B5 specification: Jelajah, Berita, Daerah, Tentang)
  const navLinks = [
    { href: "/explore", label: "Jelajah", icon: Compass },
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

  // Real Supabase User Session Listener
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

  const handleSignOut = async () => {
    await signOutAction();
    setCurrentUser(null);
    router.push("/");
    router.refresh();
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full select-none">
        {/* Brand Bar Glowing Top Line */}
        <BrandBar glow={true} />

        <div
          className={`w-full transition-all duration-300 ${
            isScrolled
              ? "bg-[#03031A]/95 backdrop-blur-xl border-b border-white/[0.08] shadow-lg shadow-black/40 py-2.5"
              : "bg-[#03031A]/80 backdrop-blur-md border-b border-white/[0.05] py-3.5"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-all duration-300">
            {/* BRAND LOGO (Lockup desktop, Mark mobile) */}
            <div className="flex items-center gap-3">
              <BrandLogo
                variant="responsive"
                size={isScrolled ? "sm" : "md"}
                priority={true}
              />
            </div>

            {/* DESKTOP 4 CORE NAVIGATION LINKS */}
            <nav className="hidden lg:flex items-center gap-1 bg-[#0A0A2E]/80 border border-white/[0.08] px-2.5 py-1 rounded-full shadow-inner">
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
                        ? "bg-[#FF1752] text-white pink-glow-sm"
                        : "text-white/70 hover:text-white hover:bg-white/[0.06]"
                    }`}
                  >
                    <Icon
                      className={`w-3.5 h-3.5 ${
                        isActive ? "text-white" : "text-white/50"
                      }`}
                    />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* DESKTOP RIGHT ACTIONS: Cmd+K, Masuk/Daftar OR User Menu */}
            <div className="hidden lg:flex items-center gap-2.5">
              {/* Command Palette Trigger Pill */}
              <button
                onClick={() => setIsCommandOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0A0A2E] hover:bg-[#12123F] border border-white/[0.08] hover:border-white/20 text-xs text-white/60 hover:text-white transition-all shadow-sm group"
                aria-label="Cari atlet, tim, atau turnamen"
              >
                <Search className="w-3.5 h-3.5 text-[#FF4D77] group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-sans">Cari...</span>
                <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/10 text-[9px] font-mono text-white/50">
                  ⌘K
                </kbd>
              </button>

              {currentUser ? (
                <UserProfileDropdown />
              ) : (
                <div className="flex items-center gap-2">
                  {/* Masuk */}
                  <Link
                    href="/login"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-heading font-bold uppercase tracking-wider text-white/70 hover:text-white hover:bg-white/[0.06] transition-colors"
                  >
                    <LogIn className="w-3.5 h-3.5 text-white/50" />
                    <span>Masuk</span>
                  </Link>

                  {/* Daftar (Pink Slanted Button) */}
                  <Link
                    href="/register"
                    className="btn-brand-primary text-xs py-1.5 px-4"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Daftar</span>
                  </Link>
                </div>
              )}
            </div>

            {/* MOBILE RIGHT CONTROLS: SEARCH + HAMBURGER */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={() => setIsCommandOpen(true)}
                className="p-2 rounded-full bg-[#0A0A2E] border border-white/[0.08] text-white/70 hover:text-white transition-colors"
                aria-label="Pencarian"
              >
                <Search className="w-4 h-4 text-[#FF4D77]" />
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-full bg-[#0A0A2E] border border-white/[0.08] text-white/80 hover:text-white focus:outline-none transition-colors"
                aria-label="Buka menu navigasi"
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-[#FF1752]" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE MENU DROPDOWN */}
        {mobileMenuOpen && (
          <div className="lg:hidden w-full bg-[#03031A]/95 border-b border-white/[0.08] backdrop-blur-2xl px-5 py-6 flex flex-col gap-5 shadow-2xl animate-in slide-in-from-top-4 duration-200">
            {/* Nav Links */}
            <nav className="flex flex-col gap-1.5">
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
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-heading font-bold uppercase tracking-wider transition-all ${
                      isActive
                        ? "bg-[#FF1752] text-white pink-glow-sm"
                        : "text-white/70 hover:bg-white/[0.04] hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4 text-inherit" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Auth Buttons / Profile on Mobile */}
            <div className="pt-4 border-t border-white/[0.08] flex flex-col gap-2.5">
              {currentUser ? (
                <UserProfileDropdown isMobileDrawer={true} onClose={() => setMobileMenuOpen(false)} />
              ) : (
                <div className="grid grid-cols-2 gap-2.5">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-brand-secondary text-xs py-2.5 text-center flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-3.5 h-3.5 text-white/60" />
                    <span>Masuk</span>
                  </Link>

                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-brand-primary text-xs py-2.5 text-center flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Daftar</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Ownership Note Footer in Mobile Drawer */}
            <div className="pt-2">
              <OwnershipNote variant="short" />
            </div>
          </div>
        )}
      </header>

      {/* Global Cmd+K Search Command Palette */}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
      />
    </>
  );
}
