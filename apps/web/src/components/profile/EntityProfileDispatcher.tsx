"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/client";
import type { UnifiedProfileDetail } from "@/lib/services/public-profiles";
import { PlayerProfileTemplate } from "./templates/PlayerProfileTemplate";
import { CoachProfileTemplate } from "./templates/CoachProfileTemplate";
import { TeamProfileTemplate } from "./templates/TeamProfileTemplate";
import { CommunityProfileTemplate } from "./templates/CommunityProfileTemplate";
import { VenueProfileTemplate } from "./templates/VenueProfileTemplate";
import { CampusProfileTemplate } from "./templates/CampusProfileTemplate";
import { SchoolProfileTemplate } from "./templates/SchoolProfileTemplate";
import { DemoBanner } from "@/components/ui/DemoBanner";
import { OwnerControlBar } from "./OwnerControlBar";

interface EntityProfileDispatcherProps {
  profile: UnifiedProfileDetail;
}

export function EntityProfileDispatcher({ profile }: EntityProfileDispatcherProps) {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [previewAsPublic, setPreviewAsPublic] = useState(false);
  const searchParams = useSearchParams();
  const actionParam = searchParams.get("action") as "edit" | "verify" | "privacy" | "ecosystem" | null;

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setCurrentUserId(data.user.id);
      }
    });
  }, []);

  const isOwner = Boolean(currentUserId && currentUserId === profile.accountId);

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
        return { href: "/players", label: "Pemain" };
      case "coach":
        return { href: "/coaches", label: "Pelatih" };
      case "team":
        return { href: "/teams", label: "Klub" };
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
    <div className="min-h-screen bg-[var(--bg-base)] text-[#F3F4F6] flex flex-col font-sans selection:bg-[#FF1752]/30 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Responsive Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-white/50 mb-6 font-mono overflow-x-auto whitespace-nowrap scrollbar-none">
          <Link href="/" className="hover:text-white transition-colors">
            Beranda
          </Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <Link href={dir.href} className="hover:text-white transition-colors">
            {dir.label}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <span className="text-[#D4AF37] font-bold truncate max-w-[200px] sm:max-w-none">
            {profile.displayName}
          </span>
        </nav>

        {/* Demo Data Banner jika data berstatus demo */}
        {profile.isDemo && <DemoBanner className="mb-6" />}

        {/* Unified Profile Owner Control Bar (W1 Architecture) */}
        {isOwner && (
          <OwnerControlBar
            profile={profile}
            previewAsPublic={previewAsPublic}
            onTogglePreviewPublic={setPreviewAsPublic}
            initialAction={actionParam}
          />
        )}

        {/* Dynamic Entity Template Content */}
        {renderTemplate()}
      </main>

      <Footer />
    </div>
  );
}
