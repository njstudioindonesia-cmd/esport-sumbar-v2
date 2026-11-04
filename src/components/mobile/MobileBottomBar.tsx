"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home, Compass, Layers, User } from "lucide-react";

export function MobileBottomBar() {
  const pathname = usePathname();

  const triggerHaptic = () => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(10);
      } catch {
        // Ignored
      }
    }
  };

  const navItems = [
    { label: "Beranda", href: "/", icon: Home, match: (p: string) => p === "/" || p === "/dashboard" },
    { label: "Jelajah", href: "/explore", icon: Compass, match: (p: string) => p.startsWith("/explore") || p.startsWith("/map") || p.startsWith("/tournaments") },
    { label: "Kartu", href: "/me/cards", icon: Layers, isCenter: true, match: (p: string) => p.startsWith("/me/cards") || p.startsWith("/me/profile/new") },
    { label: "Profil", href: "/me/profile", icon: User, match: (p: string) => p.startsWith("/me/profile") || p.startsWith("/me/settings") || p.startsWith("/me/privacy") || p.startsWith("/me/verification") },
  ];

  return (
    <nav
      className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-[390px] h-16 rounded-full bg-[#0A0A2E]/90 border border-white/10 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.7)] z-40 px-3 flex items-center justify-between select-none"
      aria-label="Navigasi Utama Mobile"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = item.match(pathname);

        // Tab Tengah Menonjol: Kartu Digital dengan Pink Glow & Mark Icon
        if (item.isCenter) {
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={triggerHaptic}
              className="relative -top-2 flex flex-col items-center group"
            >
              <div
                className={`w-13 h-13 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
                  isActive
                    ? "bg-[#FF1752] text-white shadow-[0_4px_22px_rgba(255,23,82,0.55)] scale-105"
                    : "bg-[#12123F] border border-[#FF1752]/40 text-[#FF4D77] hover:border-[#FF1752] hover:scale-105"
                }`}
              >
                {isActive ? (
                  <div className="relative w-6 h-3.5">
                    <Image
                      src="/brand/logo-mark-white.png"
                      alt="Kartu"
                      fill
                      sizes="24px"
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <Icon className="w-5 h-5 stroke-[2]" />
                )}
              </div>
              <span
                className={`text-[9px] font-heading font-black uppercase tracking-wider mt-0.5 ${
                  isActive ? "text-[#FF4D77]" : "text-white/60"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        }

        return (
          <Link
            key={item.label}
            href={item.href}
            onClick={triggerHaptic}
            className="flex-1 flex flex-col items-center justify-center py-1 transition-all group"
          >
            <div className="relative flex flex-col items-center">
              <Icon
                className={`w-5 h-5 transition-colors stroke-[1.75] ${
                  isActive ? "text-[#FF1752]" : "text-white/45 group-hover:text-white/80"
                }`}
              />
              {/* Indikator Garis Miring Pink Kecil Saat Aktif */}
              {isActive && (
                <span className="w-2.5 h-0.5 bg-[#FF1752] rounded-full mt-1 -rotate-12 shadow-[0_0_8px_#FF1752]" />
              )}
            </div>
            <span
              className={`text-[9px] font-heading font-semibold tracking-wider uppercase mt-0.5 ${
                isActive ? "text-white font-bold" : "text-white/40 group-hover:text-white/70"
              }`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
