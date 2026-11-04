"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import type { UnifiedProfileDetail } from "@/lib/services/public-profiles";
import { PlayerProfileTemplate } from "./templates/PlayerProfileTemplate";
import { CoachProfileTemplate } from "./templates/CoachProfileTemplate";
import { TeamProfileTemplate } from "./templates/TeamProfileTemplate";
import { CommunityProfileTemplate } from "./templates/CommunityProfileTemplate";
import { VenueProfileTemplate } from "./templates/VenueProfileTemplate";
import { CampusProfileTemplate } from "./templates/CampusProfileTemplate";
import { SchoolProfileTemplate } from "./templates/SchoolProfileTemplate";

interface EntityProfileDispatcherProps {
  profile: UnifiedProfileDetail;
}

export function EntityProfileDispatcher({ profile }: EntityProfileDispatcherProps) {
  const renderTemplate = () => {
    switch (profile.entityType) {
      case "player":
        return <PlayerProfileTemplate profile={profile} />;
      case "coach":
        return <CoachProfileTemplate profile={profile} />;
      case "team":
        return <TeamProfileTemplate profile={profile} />;
      case "community":
        return <CommunityProfileTemplate profile={profile} />;
      case "venue":
        return <VenueProfileTemplate profile={profile} />;
      case "campus":
        return <CampusProfileTemplate profile={profile} />;
      case "school":
        return <SchoolProfileTemplate profile={profile} />;
      default:
        return <PlayerProfileTemplate profile={profile} />;
    }
  };

  const getEntityDirectoryLink = () => {
    switch (profile.entityType) {
      case "player":
        return { href: "/players", label: "Atlet" };
      case "coach":
        return { href: "/coaches", label: "Pelatih" };
      case "team":
        return { href: "/teams", label: "Tim" };
      case "community":
        return { href: "/communities", label: "Komunitas" };
      case "venue":
        return { href: "/venues", label: "Venue" };
      case "campus":
        return { href: "/campuses", label: "Kampus" };
      case "school":
        return { href: "/schools", label: "Sekolah" };
      default:
        return { href: "/explore", label: "Direktori" };
    }
  };

  const dir = getEntityDirectoryLink();

  return (
    <div className="min-h-screen bg-[#07080C] text-[#F3F4F6] flex flex-col font-sans selection:bg-[#D4AF37]/20 selection:text-[#D4AF37]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-[#8E95A5] mb-6 font-mono overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-white transition-colors">
            Beranda
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href={dir.href} className="hover:text-white transition-colors">
            {dir.label}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#D4AF37] font-bold">{profile.displayName}</span>
        </nav>

        {/* Dynamic Entity Template Content */}
        {renderTemplate()}
      </main>

      <Footer />
    </div>
  );
}
