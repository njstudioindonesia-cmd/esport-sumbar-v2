"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Home, Compass, CreditCard, User } from "lucide-react";
import { MOTION_SPRINGS } from "./MotionPresets";
import { useIsReducedMotion } from "./useQualityMode";

export interface TabItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

export interface GlassTabBarProps {
  className?: string;
}

export function GlassTabBar({ className }: GlassTabBarProps) {
  const pathname = usePathname();
  const isReducedMotion = useIsReducedMotion();

  const tabs: TabItem[] = [
    { href: "/", label: "Beranda", icon: Home },
    { href: "/explore", label: "Jelajah", icon: Compass },
    { href: "/me/card", label: "Kartu", icon: CreditCard },
    { href: "/me", label: "Profil", icon: User },
  ];

  return (
    <nav
      aria-label="Navigasi Bawah Ponsel"
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 md:hidden pb-safe pt-2 px-4 pointer-events-none",
        className
      )}
    >
      <div className="max-w-md mx-auto pointer-events-auto bg-slate-950/85 backdrop-blur-xl border border-white/15 rounded-3xl p-1.5 shadow-2xl shadow-black/60 flex items-center justify-around relative">
        {tabs.map((tab) => {
          const isActive =
            tab.href === "/"
              ? pathname === "/"
              : pathname?.startsWith(tab.href);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "relative flex flex-col items-center justify-center flex-1 py-1.5 min-h-[48px] rounded-2xl transition-colors duration-150 select-none",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500",
                isActive ? "text-white" : "text-slate-400 hover:text-slate-200"
              )}
            >
              {/* Sliding Liquid Capsule Indicator */}
              {isActive && (
                <motion.div
                  layoutId="glass-tabbar-active-indicator"
                  transition={
                    isReducedMotion
                      ? { duration: 0 }
                      : MOTION_SPRINGS.snappy
                  }
                  className="absolute inset-0 bg-white/15 border border-white/20 rounded-2xl shadow-sm -z-10"
                />
              )}
              <Icon
                className={cn(
                  "w-5 h-5 transition-transform duration-150",
                  isActive ? "scale-110 text-pink-400" : ""
                )}
                aria-hidden="true"
              />
              <span className="text-[10px] font-semibold mt-0.5 tracking-tight">
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
