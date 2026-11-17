"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileTeamRoster } from "@/components/mobile/MobileTeamRoster";

export default function TeamRosterClient({ teamId }: { teamId?: string }) {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-white flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        <MobileTeamRoster />
      </main>
      <Footer />
    </div>
  );
}
