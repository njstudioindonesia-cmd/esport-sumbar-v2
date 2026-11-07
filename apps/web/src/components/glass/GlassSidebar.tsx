"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MOTION_SPRINGS } from "./MotionPresets";

export interface SidebarItem {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
}

export interface SidebarGroup {
  title?: string;
  items: SidebarItem[];
}

export interface GlassSidebarProps {
  groups: SidebarGroup[];
  roleTitle?: string;
  className?: string;
}

export function GlassSidebar({
  groups,
  roleTitle = "Pengguna",
  className,
}: GlassSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      aria-label="Menu Samping"
      className={cn(
        "w-64 shrink-0 hidden md:flex flex-col p-4 rounded-3xl bg-slate-950/70 backdrop-blur-xl border border-white/10 shadow-xl",
        className
      )}
    >
      {/* Role Header */}
      {roleTitle && (
        <div className="px-3 py-2 mb-3 border-b border-white/10 flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
            {`Area ${roleTitle}`}
          </span>
          <span className="w-2 h-2 rounded-full bg-pink-500 shadow-sm shadow-pink-500/50" />
        </div>
      )}

      {/* Nav Groups */}
      <div className="flex-1 space-y-6 overflow-y-auto">
        {groups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            {group.title && (
              <h4 className="px-3 text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold mb-2">
                {group.title}
              </h4>
            )}
            {group.items.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors duration-150 select-none min-h-[44px]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500",
                    isActive
                      ? "text-white"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="glass-sidebar-active-indicator"
                      transition={MOTION_SPRINGS.snappy}
                      className="absolute inset-0 bg-white/10 border border-white/15 rounded-xl shadow-sm -z-10"
                    />
                  )}
                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        "w-4 h-4",
                        isActive ? "text-pink-400" : "text-slate-400"
                      )}
                      aria-hidden="true"
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-pink-500/20 text-pink-300 border border-pink-500/30">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>
    </aside>
  );
}
