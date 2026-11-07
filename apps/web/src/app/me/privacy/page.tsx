"use client";

import React from "react";
import { UserShell } from "@/components/dashboard/DesktopUserShell";
import { DesktopPrivacyView } from "@/components/dashboard/DesktopPrivacyView";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen w-full bg-[#07080C]">
      <UserShell breadcrumb="Privasi Data">
        <DesktopPrivacyView />
      </UserShell>
    </main>
  );
}
