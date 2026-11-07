"use client";

import React from "react";
import { MobileCardWallet } from "@/components/mobile/MobileCardWallet";
import { DesktopUserShell } from "@/components/dashboard/DesktopUserShell";
import { DesktopCardsView } from "@/components/dashboard/DesktopCardsView";

export default function MyCardPage() {
  return (
    <main className="min-h-screen w-full bg-[#07080C]">
      {/* Mobile Flow (< 1024px): PWA Card Wallet */}
      <div className="block lg:hidden min-h-[100dvh] w-full">
        <MobileCardWallet />
      </div>

      {/* Desktop Flow (>= 1024px): Large Card View, QR & Sharing */}
      <div className="hidden lg:block w-full min-h-screen">
        <DesktopUserShell breadcrumb="Kartu Paspor">
          <DesktopCardsView />
        </DesktopUserShell>
      </div>
    </main>
  );
}
