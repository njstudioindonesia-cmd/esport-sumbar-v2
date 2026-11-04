"use client";

import React, { Suspense } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileExplore } from "@/components/mobile/MobileExplore";
import { DesktopExplore } from "@/components/explore/DesktopExplore";

export default function ExplorePage() {
  return (
    <>
      {/* MOBILE EXPERIENCE (< 1024px Viewport) */}
      <div className="block lg:hidden min-h-[100dvh] w-full bg-[#07080C] overflow-x-hidden">
        <Suspense fallback={<div className="p-8 text-center text-white/40">Memuat...</div>}>
          <MobileExplore />
        </Suspense>
      </div>

      {/* DESKTOP EXPERIENCE (≥ 1024px Cinematic Viewport) */}
      <div className="hidden lg:flex min-h-screen bg-[#07080C] text-[#F3F4F6] flex-col selection:bg-[#D4AF37]/20 selection:text-[#D4AF37]">
        <Navbar />
        <main className="flex-1 flex flex-col items-center overflow-x-hidden">
          <Suspense fallback={<div className="p-16 text-center text-white/40 font-mono">Memuat direktori...</div>}>
            <DesktopExplore />
          </Suspense>
        </main>
        <Footer />
      </div>
    </>
  );
}
