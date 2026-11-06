"use client";

import React from "react";
import { MobileCardWizard } from "@/components/mobile/MobileCardWizard";
import { DesktopCardWizard } from "@/components/wizard/DesktopCardWizard";

export default function NewProfileWizardPage() {
  return (
    <main className="min-h-screen w-full bg-[#07080C]">
      {/* Mobile Flow (< 1024px): PWA Card Wizard (Live preview on top + Bottom Sheet) */}
      <div className="block lg:hidden min-h-[100dvh] w-full">
        <MobileCardWizard />
      </div>

      {/* Desktop Flow (>= 1024px): 2-Column Split Layout with Sticky 3D Tilt Card */}
      <div className="hidden lg:block w-full min-h-screen">
        <DesktopCardWizard />
      </div>
    </main>
  );
}
