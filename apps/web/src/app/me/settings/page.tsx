"use client";

import React from "react";
import { UserShell } from "@/components/dashboard/DesktopUserShell";
import { UnifiedSettingsView } from "@/components/dashboard/UnifiedSettingsView";

export default function AccountSettingsPage() {
  return (
    <main className="min-h-screen w-full bg-[#07080C]">
      <UserShell breadcrumb="Pengaturan">
        <UnifiedSettingsView />
      </UserShell>
    </main>
  );
}
