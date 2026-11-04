"use client";

import React from "react";
import { MobileCardWizard } from "@/components/mobile/MobileCardWizard";

export default function NewProfileWizardPage() {
  return (
    <main className="min-h-[100dvh] w-full bg-[#07080C] flex items-center justify-center p-0 md:p-6 overflow-hidden">
      {/* Mobile Shell Frame (iPhone 14 / Mobile standard viewport) */}
      <div className="relative w-full max-w-[420px] h-[100dvh] md:h-[844px] bg-[#07080C] md:rounded-[36px] md:border md:border-white/10 md:shadow-[0_24px_80px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col">
        <MobileCardWizard />
      </div>
    </main>
  );
}
