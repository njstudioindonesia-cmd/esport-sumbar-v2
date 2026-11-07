"use client";

import React from "react";
import { UserShell } from "@/components/dashboard/DesktopUserShell";
import { MobileTeamRoster } from "@/components/mobile/MobileTeamRoster";

export default function TeamRosterClient({ teamId }: { teamId?: string }) {
  return (
    <main className="min-h-screen w-full bg-[#07080C]">
      <UserShell breadcrumb="Kelola Roster">
        <div className="max-w-4xl mx-auto py-2">
          <MobileTeamRoster />
        </div>
      </UserShell>
    </main>
  );
}
