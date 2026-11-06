"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, UserCheck, Edit3 } from "lucide-react";
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
import { MobilePublicProfile } from "@/components/mobile/MobilePublicProfile";
import { mapVerificationToCard } from "@/types/card";

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

  const mappedCard = {
    id: profile.id,
    type: profile.entityType as any,
    rarity: (profile.rarityTier as any) || "rookie",
    verification: mapVerificationToCard(profile.verificationStatus),
    tagline: profile.bio || `Profil resmi ${profile.displayName} ESPORT SUMBAR`,
    slug: profile.slug,
    data: {
      displayName: profile.displayName,
      ign: profile.ign || undefined,
      role: profile.roleName || (profile.entityType === "team" ? "Organisasi Tim" : "Athlete"),
      game: profile.mainGameName || "Esport",
      region: { name: profile.regionName, code: profile.regionCode },
      esportId: profile.esportId,
      avatarUrl: profile.avatarUrl || undefined,
      team: profile.relations?.find((r) => r.targetProfile?.entityType === "team")?.targetProfile?.displayName
        ? { name: profile.relations?.find((r) => r.targetProfile?.entityType === "team")?.targetProfile?.displayName! }
        : undefined,
    },
  };

  return (
    <>
      {/* MOBILE FLOW (< 1024px): Dedicated 3D TCG Mobile Profile */}
      <div className="block lg:hidden min-h-[100dvh] w-full bg-[#07080C]">
        <MobilePublicProfile card={mappedCard as any} isOwner={isOwner} />
      </div>

      {/* DESKTOP FLOW (>= 1024px): Cinematic Bento Grid & Template */}
      <div className="hidden lg:flex min-h-screen bg-[#07080C] text-[#F3F4F6] flex-col font-sans selection:bg-[#D4AF37]/20 selection:text-[#D4AF37]">
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

          {/* Demo Data Banner jika data berstatus demo */}
          {profile.isDemo && <DemoBanner className="mb-6" />}

          {/* Banner Penanda Pemilik Kartu (SPEC 2.4) */}
          {isOwner && (
            <div className="mb-6 p-4 rounded-2xl bg-[#0A0D15] border border-[#FF1752]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 backdrop-blur-md shadow-lg shadow-[#FF1752]/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FF1752]/15 border border-[#FF1752] flex items-center justify-center text-[#FF1752] shrink-0">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-heading font-black text-white uppercase tracking-wider">Ini Profil Resmi Anda</p>
                    <span className="px-1.5 py-0.5 rounded bg-[#FF1752]/20 text-[9px] font-mono text-[#FF4D77] font-bold">PEMILIK KARTU</span>
                  </div>
                  <p className="text-[11px] text-white/60 mt-0.5">Anda sedang melihat tampilan publik kartu paspor digital Anda.</p>
                </div>
              </div>
              <Link
                href={`/me/profile/${profile.id}/edit`}
                className="btn-brand-primary text-xs py-2 px-4 flex items-center justify-center gap-1.5 shrink-0"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profil</span>
              </Link>
            </div>
          )}

          {/* Dynamic Entity Template Content */}
          {renderTemplate()}
        </main>

        <Footer />
      </div>
    </>
  );
}
