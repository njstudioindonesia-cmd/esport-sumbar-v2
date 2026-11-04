"use client";

import React from "react";
import Link from "next/link";
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
    { label: "Profil", href: "/me/settings", icon: User, match: (p: string) => p.startsWith("/me/settings") || p.startsWith("/me/privacy") || p.startsWith("/me/verification") },
  ];

  return (
    <nav className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[calc(100%-36px)] max-w-[390px] h-16 rounded-full bg-[#0F1118]/85 border border-white/[0.08] backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.6)] z-40 px-3 flex items-center justify-between">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = item.match(pathname);

        // Tab Tengah Menonjol (Kartu Digital)
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
                    ? "bg-[#D4AF37] text-[#07080C] shadow-[0_4px_20px_rgba(212,175,55,0.4)] scale-105"
                    : "bg-[#161A24] border border-[#D4AF37]/40 text-[#D4AF37] hover:border-[#D4AF37] hover:scale-105"
                }`}
              >
                <Icon className="w-6 h-6 stroke-[1.75]" />
              </div>
              <span
                className={`text-[9px] font-heading font-bold uppercase tracking-wider mt-0.5 ${
                  isActive ? "text-[#D4AF37]" : "text-white/60"
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
                className={`w-5 h-5 transition-colors stroke-[1.5] ${
                  isActive ? "text-[#D4AF37] fill-[#D4AF37]/20" : "text-white/50 group-hover:text-white/80"
                }`}
              />
              {/* Indikator Titik Emas Kecil Saat Aktif */}
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-[#D4AF37] mt-1 shadow-[0_0_6px_#D4AF37]" />
              )}
            </div>
            <span
              className={`text-[9px] font-heading font-medium tracking-wider uppercase mt-0.5 ${
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
