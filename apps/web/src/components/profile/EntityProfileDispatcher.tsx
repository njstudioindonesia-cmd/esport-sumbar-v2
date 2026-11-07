"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, UserCheck, Edit3 } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { GlassSurface } from "@/components/glass/GlassSurface";
import { GlassButton } from "@/components/glass/GlassButton";
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

interface EntityProfileDispatcherProps {
  profile: UnifiedProfileDetail;
}

export function EntityProfileDispatcher({ profile }: EntityProfileDispatcherProps) {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

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

        {/* Banner Penanda Pemilik Kartu */}
        {isOwner && (
          <GlassSurface
            variant="elevated"
            elevation="glass"
            radius="2xl"
            specular={true}
            className="mb-6 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-[#FF1752]/40 shadow-lg shadow-[#FF1752]/10"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FF1752]/20 border border-[#FF1752] flex items-center justify-center text-[#FF1752] shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-xs font-heading font-black text-white uppercase tracking-wider">
                    Ini Profil Anda
                  </p>
                  <span className="px-1.5 py-0.5 rounded bg-[#FF1752]/20 text-[9px] font-mono text-pink-300 font-bold">
                    PEMILIK KARTU
                  </span>
                </div>
                <p className="text-[11px] text-white/60 mt-0.5">
                  Anda sedang melihat tampilan publik kartu paspor digital Anda.
                </p>
              </div>
            </div>
            <Link
              href={`/me/profile/${profile.id}/edit`}
              className="w-full sm:w-auto"
            >
              <GlassButton variant="primary" size="sm" className="w-full sm:w-auto text-xs font-heading font-black uppercase">
                <Edit3 className="w-3.5 h-3.5 mr-1.5" />
                <span>Edit Profil</span>
              </GlassButton>
            </Link>
          </GlassSurface>
        )}

        {/* Dynamic Entity Template Content */}
        {renderTemplate()}
      </main>

      <Footer />
    </div>
  );
}
