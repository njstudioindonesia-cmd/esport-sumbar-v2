"use client";

import React, { useState } from "react";
import { MobileSplash } from "@/components/mobile/MobileSplash";
import { MobileOnboarding } from "@/components/mobile/MobileOnboarding";

export default function OnboardingPage() {
  const [splashFinished, setSplashFinished] = useState(false);

  return (
    <main className="min-h-[100dvh] w-full bg-[#07080C] flex items-center justify-center p-0 md:p-6 overflow-hidden">
      {/* Outer Shell for Desktop Preview (390x844 iPhone aspect ratio preview) */}
      <div className="relative w-full max-w-[420px] h-[100dvh] md:h-[844px] bg-[#07080C] md:rounded-[36px] md:border md:border-white/10 md:shadow-[0_24px_80px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col">
        {!splashFinished ? (
          <MobileSplash onFinish={() => setSplashFinished(true)} durationMs={1400} />
        ) : (
          <MobileOnboarding />
        )}
      </div>
    </main>
  );
}
