"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface GlassBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function GlassBreadcrumb({ items, className }: GlassBreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/10 text-xs text-slate-400 select-none",
        className
      )}
    >
      <Link
        href="/"
        className="flex items-center text-slate-400 hover:text-white transition-colors p-0.5 rounded-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-pink-500"
        aria-label="Beranda"
      >
        <Home className="w-3.5 h-3.5" />
      </Link>

      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;

        return (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" aria-hidden="true" />
            {isLast || !item.href ? (
              <span
                className="font-semibold text-slate-200 truncate max-w-[160px] sm:max-w-[240px]"
                aria-current={isLast ? "page" : undefined}
              >
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-slate-400 hover:text-white transition-colors truncate max-w-[120px] sm:max-w-[180px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-pink-500 rounded"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
