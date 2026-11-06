import React from "react";
import type { Metadata } from "next";
import { getPlatformStats } from "@/lib/services/stats";
import { getLatestArticles } from "@/lib/services/news";
import { getPublicProfilesList } from "@/lib/services/public-profiles";
import { HomePageClient } from "@/components/home/HomePageClient";

export const instant = false;

export const metadata: Metadata = {
  title: "ESPORT SUMBAR™ | Pusat Data & Paspor Digital Atlet Ranah Minang",
  description:
    "Platform data, identitas digital paspor atlet (ESPORT ID), dan ekosistem turnamen esport Sumatera Barat oleh ESPORT SUMBAR™. Diverifikasi tim kurasi ESPORT SUMBAR.",
};

export default async function HomePage() {
  const [stats, articles, profilesResult] = await Promise.all([
    getPlatformStats(),
    getLatestArticles({ limit: 4 }),
    getPublicProfilesList({ limit: 8, verificationStatus: "verified" }),
  ]);

  return (
    <HomePageClient
      stats={stats}
      articles={articles}
      profiles={profilesResult.profiles}
    />
  );
}
