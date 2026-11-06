"use client";

import React from "react";
import { MobileVerificationTracker } from "@/components/mobile/MobileVerificationTracker";
import { DesktopUserShell } from "@/components/dashboard/DesktopUserShell";
import { DesktopVerificationView } from "@/components/dashboard/DesktopVerificationView";

export default function VerificationPage() {
  return (
    <main className="min-h-screen w-full bg-[#07080C]">
      {/* Mobile Flow (< 1024px): PWA Stepper */}
      <div className="block lg:hidden min-h-[100dvh] w-full">
        <MobileVerificationTracker />
      </div>

      {/* Desktop Flow (>= 1024px): Horizontal Package Tracker & Evidence Upload */}
      <div className="hidden lg:block w-full min-h-screen">
        <DesktopUserShell breadcrumb="Status Verifikasi">
          <DesktopVerificationView />
        </DesktopUserShell>
      </div>
    </main>
  );
}
