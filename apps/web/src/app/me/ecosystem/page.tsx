"use client";

import React from "react";
import { UserShell } from "@/components/dashboard/DesktopUserShell";
import { DesktopMembershipsView } from "@/components/dashboard/DesktopMembershipsView";

export default function MyEcosystemPage() {
  return (
    <main className="min-h-screen w-full bg-[#07080C]">
      <UserShell breadcrumb="Ekosistem Saya">
        <DesktopMembershipsView />
      </UserShell>
    </main>
  );
}
