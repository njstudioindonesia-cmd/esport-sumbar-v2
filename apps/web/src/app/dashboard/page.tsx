"use client";

import React from "react";
import { UserShell } from "@/components/dashboard/DesktopUserShell";
import { DesktopDashboardView } from "@/components/dashboard/DesktopDashboardView";

export default function DashboardPage() {
  return (
    <main className="min-h-screen w-full bg-[#07080C]">
      <UserShell breadcrumb="Ringkasan">
        <DesktopDashboardView />
      </UserShell>
    </main>
  );
}
