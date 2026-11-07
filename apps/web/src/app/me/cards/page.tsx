"use client";

import React from "react";
import { UserShell } from "@/components/dashboard/DesktopUserShell";
import { DesktopCardsView } from "@/components/dashboard/DesktopCardsView";

export default function MyCardsPage() {
  return (
    <main className="min-h-screen w-full bg-[#07080C]">
      <UserShell breadcrumb="Kartu Digital">
        <DesktopCardsView />
      </UserShell>
    </main>
  );
}
