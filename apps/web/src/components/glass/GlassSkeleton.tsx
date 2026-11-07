"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface GlassSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "avatar" | "card" | "button" | "custom";
}

export function GlassSkeleton({
  className,
  variant = "text",
  ...props
}: GlassSkeletonProps) {
  const variantClasses = {
    text: "h-4 w-full rounded-lg",
    avatar: "h-11 w-11 rounded-full shrink-0",
    card: "h-48 w-full rounded-2xl",
    button: "h-11 w-28 rounded-2xl",
    custom: "rounded-xl",
  };

  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative overflow-hidden bg-white/[0.06] border border-white/10",
        // Shimmer gradient animation with reduced motion fallback
        "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/[0.1] before:to-transparent",
        "motion-reduce:before:hidden motion-reduce:animate-pulse",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}

export function GlassSkeletonCard() {
  return (
    <div className="p-6 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-md space-y-4">
      <div className="flex items-center gap-3">
        <GlassSkeleton variant="avatar" />
        <div className="space-y-2 flex-1">
          <GlassSkeleton variant="text" className="w-1/3" />
          <GlassSkeleton variant="text" className="w-1/2" />
        </div>
      </div>
      <GlassSkeleton variant="text" className="w-full" />
      <GlassSkeleton variant="text" className="w-4/5" />
      <div className="pt-2 flex justify-between items-center">
        <GlassSkeleton variant="text" className="w-20" />
        <GlassSkeleton variant="button" className="w-24 h-9" />
      </div>
    </div>
  );
}
