"use client";

import React from "react";
import { MobileHome } from "@/components/mobile/MobileHome";
import { DesktopUserShell } from "@/components/dashboard/DesktopUserShell";
import { DesktopDashboardView } from "@/components/dashboard/DesktopDashboardView";

export default function DashboardPage() {
  return (
    <main className="min-h-screen w-full bg-[#07080C]">
      {/* Mobile Flow (< 1024px): PWA Dashboard Experience */}
      <div className="block lg:hidden min-h-[100dvh] w-full">
        <MobileHome />
      </div>

      {/* Desktop Dashboard (>= 1024px): Bento Grid Layout & Slim Sidebar */}
      <div className="hidden lg:block w-full min-h-screen">
        <DesktopUserShell breadcrumb="Beranda">
          <DesktopDashboardView />
        </DesktopUserShell>
      </div>
    </main>
  );
}
