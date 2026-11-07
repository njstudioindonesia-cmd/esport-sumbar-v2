"use client";

import React from "react";
import { UnifiedAuthView } from "@/components/auth/UnifiedAuthView";

export default function LoginPage() {
  return (
    <main className="min-h-screen w-full bg-[#07080C]">
      <UnifiedAuthView initialMode="login" />
    </main>
  );
}
