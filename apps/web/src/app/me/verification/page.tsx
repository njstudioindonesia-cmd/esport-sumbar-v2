"use client";

import React from "react";
import { UserShell } from "@/components/dashboard/DesktopUserShell";
import { DesktopVerificationView } from "@/components/dashboard/DesktopVerificationView";

export default function VerificationPage() {
  return (
    <main className="min-h-screen w-full bg-[#07080C]">
      <UserShell breadcrumb="Status Verifikasi">
        <DesktopVerificationView />
      </UserShell>
    </main>
  );
}
