"use client";

import React from "react";
import { MobileProfileSettings } from "@/components/mobile/MobileProfileSettings";
import { DesktopUserShell } from "@/components/dashboard/DesktopUserShell";
import { DesktopPrivacyView } from "@/components/dashboard/DesktopPrivacyView";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen w-full bg-[#07080C]">
      {/* Mobile Flow (< 1024px): PWA Settings & Privacy */}
      <div className="block lg:hidden min-h-[100dvh] w-full">
        <MobileProfileSettings />
      </div>

      {/* Desktop Flow (>= 1024px): Dual-Column Privacy Table & Danger Zone */}
      <div className="hidden lg:block w-full min-h-screen">
        <DesktopUserShell breadcrumb="Privasi & PDP">
          <DesktopPrivacyView />
        </DesktopUserShell>
      </div>
    </main>
  );
}
