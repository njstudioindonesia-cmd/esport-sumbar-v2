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
        navigator.vibrate(12);
      } catch {
        // Ignored
      }
    }
  };

  const navItems = [
    {
      label: "Beranda",
      href: "/",
      icon: Home,
      match: (p: string) => p === "/" || p === "/dashboard",
    },
    {
      label: "Jelajah",
      href: "/explore",
      icon: Compass,
      match: (p: string) =>
        p.startsWith("/explore") ||
        p.startsWith("/map") ||
        p.startsWith("/tournaments"),
    },
    {
      label: "Kartu",
      href: "/me/cards",
      icon: Layers,
      isCenter: true,
      match: (p: string) =>
        p.startsWith("/me/cards") || p.startsWith("/me/profile/new"),
    },
    {
      label: "Profil",
      href: "/me/profile",
      icon: User,
      match: (p: string) =>
        p.startsWith("/me/profile") ||
        p.startsWith("/me/settings") ||
        p.startsWith("/me/privacy") ||
        p.startsWith("/me/verification"),
    },
  ];

  return (
    <nav
      className="lg:hidden fixed bottom-3 left-1/2 -translate-x-1/2 w-[calc(100%-28px)] max-w-[390px] h-16 rounded-2xl bg-[#0A0D15]/90 border border-white/10 backdrop-blur-2xl shadow-[0_16px_40px_rgba(0,0,0,0.85)] z-40 px-3 flex items-center justify-between select-none"
      aria-label="Navigasi Utama Mobile"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = item.match(pathname);

        // Tab Tengah Menonjol: Kartu Paspor Digital dengan Emas Minang & Glow
        if (item.isCenter) {
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={triggerHaptic}
              className="relative -top-2 flex flex-col items-center group"
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-xl ${
                  isActive
                    ? "bg-gradient-to-tr from-[#D4AF37] via-[#F59E0B] to-[#FFE082] text-black shadow-[0_4px_24px_rgba(212,175,55,0.55)] scale-105"
                    : "bg-[#141824] border border-[#D4AF37]/50 text-[#D4AF37] hover:border-[#D4AF37] hover:scale-105"
                }`}
              >
                {isActive ? (
                  <div className="relative w-6 h-4">
                    <Image
                      src="/brand/logo-mark-white.png"
                      alt="Kartu"
                      fill
                      sizes="24px"
                      className="object-contain brightness-0"
                    />
                  </div>
                ) : (
                  <Icon className="w-5 h-5 stroke-[2.2] text-[#D4AF37]" />
                )}
              </div>
              <span
                className={`text-[9px] font-heading font-black uppercase tracking-wider mt-1 ${
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
                className={`w-5 h-5 transition-colors stroke-[1.8] ${
                  isActive
                    ? "text-[#D4AF37]"
                    : "text-white/40 group-hover:text-white/80"
                }`}
              />
              {/* Indikator Bar Emas Saat Aktif */}
              {isActive && (
                <span className="w-2.5 h-0.5 bg-[#D4AF37] rounded-full mt-1 shadow-[0_0_8px_#D4AF37]" />
              )}
            </div>
            <span
              className={`text-[9px] font-heading font-semibold tracking-wider uppercase mt-0.5 ${
                isActive
                  ? "text-white font-bold"
                  : "text-white/40 group-hover:text-white/70"
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
