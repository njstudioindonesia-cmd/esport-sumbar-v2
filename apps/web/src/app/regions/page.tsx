"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DesktopRegionsView } from "@/components/regions/DesktopRegionsView";

export default function RegionsIndexPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-white flex flex-col selection:bg-[#FF1752]/30 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <DesktopRegionsView />
      </main>

      <Footer />
    </div>
  );
}
