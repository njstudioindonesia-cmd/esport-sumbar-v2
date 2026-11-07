"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { GlassButton } from "./GlassButton";
import { Search, User, Shield, Sparkles } from "lucide-react";
import { MOTION_SPRINGS } from "./MotionPresets";

export interface NavItem {
  href: string;
  label: string;
}

export interface GlassNavProps {
  items?: NavItem[];
  user?: {
    displayName?: string;
    esportId?: string;
    role?: "user" | "admin";
  } | null;
  onOpenSearch?: () => void;
  className?: string;
}

export function GlassNav({
  items = [
    { href: "/", label: "Beranda" },
    { href: "/explore", label: "Jelajah" },
    { href: "/ecosystem", label: "Ekosistem" },
    { href: "/tournaments", label: "Turnamen" },
    { href: "/news", label: "Berita" },
  ],
  user = null,
  onOpenSearch,
  className,
}: GlassNavProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 flex justify-center px-4 sm:px-6 transition-all duration-300 pointer-events-none",
        isScrolled ? "pt-3" : "pt-5",
        className
      )}
    >
      <nav
        aria-label="Navigasi Utama"
        className={cn(
          "w-full max-w-7xl mx-auto flex items-center justify-between pointer-events-auto rounded-3xl transition-all duration-300 border",
          isScrolled
            ? "py-2 px-5 bg-slate-950/85 backdrop-blur-xl border-white/15 shadow-2xl shadow-black/50"
            : "py-3 px-6 bg-slate-950/60 backdrop-blur-md border-white/10 shadow-lg"
        )}
      >
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 rounded-xl"
        >
          <BrandLogo size="sm" />
        </Link>

        {/* Center Nav Links (Desktop) */}
        <div className="hidden md:flex items-center gap-1 bg-white/[0.04] p-1.5 rounded-2xl border border-white/10">
          {items.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative px-4 py-1.5 text-xs font-semibold rounded-xl transition-colors duration-150 select-none",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500",
                  isActive
                    ? "text-white"
                    : "text-slate-400 hover:text-slate-200"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="glass-nav-active-pill"
                    transition={MOTION_SPRINGS.snappy}
                    className="absolute inset-0 bg-white/15 rounded-xl border border-white/20 shadow-sm -z-10"
                  />
                )}
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* Quick Search Cmd+K */}
          <button
            type="button"
            onClick={onOpenSearch}
            aria-label="Cari entitas, game, atau berita (Ctrl+K)"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-400 hover:text-white transition-colors min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Cari...</span>
            <kbd className="hidden lg:inline text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-slate-300 border border-white/10">
              ⌘K
            </kbd>
          </button>

          {/* User profile or Guest CTA */}
          {user ? (
            <Link
              href={user.role === "admin" ? "/admin" : "/me"}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-pink-500/15 hover:bg-pink-500/25 border border-pink-500/35 text-xs text-white font-medium transition-colors min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
            >
              {user.role === "admin" ? (
                <Shield className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <User className="w-3.5 h-3.5 text-pink-400" />
              )}
              <span className="max-w-[100px] truncate font-semibold">
                {user.displayName || user.esportId || "Profil"}
              </span>
            </Link>
          ) : (
            <Link href="/login">
              <GlassButton variant="primary" size="sm">
                Masuk
              </GlassButton>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
