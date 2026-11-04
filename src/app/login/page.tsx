"use client";

import React from "react";
import { MobileAuthFlow } from "@/components/mobile/MobileAuthFlow";
import { DesktopAuthView } from "@/components/auth/DesktopAuthView";

export default function LoginPage() {
  return (
    <main className="min-h-screen w-full bg-[#07080C]">
      {/* Mobile Flow (< 1024px): PWA Step-by-Step Experience */}
      <div className="block lg:hidden min-h-[100dvh] w-full">
        <MobileAuthFlow initialMode="login" />
      </div>

      {/* Desktop Split-Screen (>= 1024px): Cinematic 45/55 Layout with 3D Tilt Card */}
      <div className="hidden lg:block w-full min-h-screen">
        <DesktopAuthView mode="login" />
      </div>
    </main>
  );
}
