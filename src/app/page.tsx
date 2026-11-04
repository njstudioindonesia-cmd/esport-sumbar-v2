import React from "react";
import type { Metadata } from "next";
import { getPlatformStats } from "@/lib/services/stats";
import { getLatestArticles } from "@/lib/services/news";
import { getPublicProfilesList } from "@/lib/services/public-profiles";
import { HomePageClient } from "@/components/home/HomePageClient";

export const instant = false;

export const metadata: Metadata = {
  title: "ESPORT SUMBAR | Pusat Data & Paspor Digital Atlet Ranah Minang",
  description:
    "Portal resmi PBESI Sumatera Barat: Paspor atlet digital, kartu TCG atlet, verifikasi 19 wilayah, dan direktori ekosistem esport se-Sumatera Barat.",
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
