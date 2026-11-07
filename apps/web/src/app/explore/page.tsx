"use client";

import React, { Suspense } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DesktopExplore } from "@/components/explore/DesktopExplore";

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[#F3F4F6] flex flex-col selection:bg-[#FF1752]/30 selection:text-white">
      <Navbar />
      <main className="flex-1 flex flex-col items-center overflow-x-hidden">
        <Suspense fallback={<div className="p-16 text-center text-white/40 font-mono">Memuat direktori ekosistem...</div>}>
          <DesktopExplore />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
