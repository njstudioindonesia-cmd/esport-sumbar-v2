import React from "react";
import { GlassSkeleton, GlassSkeletonCard } from "@/components/glass/GlassSkeleton";
import { GlassSurface } from "@/components/glass/GlassSurface";

export default function RootLoading() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-white flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-4xl space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="space-y-2">
            <GlassSkeleton variant="button" className="h-6 w-32" />
            <GlassSkeleton variant="text" className="h-8 w-64" />
          </div>
          <GlassSkeleton variant="avatar" />
        </div>

        {/* Content Bento Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <GlassSkeletonCard />
          <GlassSkeletonCard />
          <GlassSkeletonCard />
        </div>

        <div className="flex justify-center pt-6">
          <span className="text-xs font-mono text-white/40 uppercase tracking-widest animate-pulse">
            Memuat data ESPORT SUMBAR...
          </span>
        </div>
      </div>
    </div>
  );
}
