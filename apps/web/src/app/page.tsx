import React from "react";
import type { Metadata } from "next";
import { getPlatformStats } from "@/lib/services/stats";
import { getLatestArticles } from "@/lib/services/news";
import { getPublicProfilesList, getPublicProfileByAccountId } from "@/lib/services/public-profiles";
import { getActiveBanners, getContentBlocks } from "@/lib/services/cms";
import { HomePageClient } from "@/components/home/HomePageClient";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "ESPORT SUMBAR™ | Pusat Data & Kartu Digital Atlet Ranah Minang",
  description:
    "Platform data, identitas digital kartu atlet resmi (ESPORT ID), dan ekosistem turnamen esport Sumatera Barat oleh ESPORT SUMBAR™. Diverifikasi tim kurasi ESPORT SUMBAR.",
};

export default async function HomePage() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();

  const [stats, articles, profilesResult, topBanners, middleBanners, homeBlocks, myProfile] =
    await Promise.all([
      getPlatformStats(),
      getLatestArticles({ limit: 4 }),
      getPublicProfilesList({ limit: 8, verificationStatus: "verified" }),
      getActiveBanners("home_top"),
      getActiveBanners("home_middle"),
      getContentBlocks("home"),
      authData?.user ? getPublicProfileByAccountId(authData.user.id) : Promise.resolve(null),
    ]);

  const heroBlock = homeBlocks.find((b) => b.slot === "hero") || null;

  return (
    <HomePageClient
      stats={stats}
      articles={articles}
      profiles={profilesResult.profiles}
      topBanners={topBanners}
      middleBanners={middleBanners}
      heroBlock={heroBlock}
      initialMyProfile={myProfile}
    />
  );
}
