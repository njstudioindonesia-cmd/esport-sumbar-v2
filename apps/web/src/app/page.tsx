import React from "react";
import type { Metadata } from "next";
import { getPlatformStats } from "@/lib/services/stats";
import { getLatestArticles } from "@/lib/services/news";
import { getPublicProfilesList } from "@/lib/services/public-profiles";
import { getActiveBanners, getContentBlocks } from "@/lib/services/cms";
import { HomePageClient } from "@/components/home/HomePageClient";

export const metadata: Metadata = {
  title: "ESPORT SUMBAR™ | Pusat Data & Kartu Digital Atlet Ranah Minang",
  description:
    "Platform data, identitas digital kartu atlet resmi (ESPORT ID), dan ekosistem turnamen esport Sumatera Barat oleh ESPORT SUMBAR™. Diverifikasi tim kurasi ESPORT SUMBAR.",
};

export default async function HomePage() {
  const [stats, articles, profilesResult, topBanners, middleBanners, homeBlocks] =
    await Promise.all([
      getPlatformStats(),
      getLatestArticles({ limit: 4 }),
      getPublicProfilesList({ limit: 8, verificationStatus: "verified" }),
      getActiveBanners("home_top"),
      getActiveBanners("home_middle"),
      getContentBlocks("home"),
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
    />
  );
}
