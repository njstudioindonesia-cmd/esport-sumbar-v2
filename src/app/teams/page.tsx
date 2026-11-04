import React from "react";
import type { Metadata } from "next";
import { getPublicProfilesByEntity } from "@/lib/services/public-profiles";
import { EntityDirectoryView } from "@/components/directory/EntityDirectoryView";

export const instant = false;

export const metadata: Metadata = {
  title: "Direktori Tim Esport Sumatera Barat | PBESI",
  description: "Daftar tim dan klub esport kompetitif resmi binaan Pengcab ESI di Sumatera Barat.",
};

export default async function TeamsDirectoryPage() {
  const profiles = await getPublicProfilesByEntity("team");

  return (
    <EntityDirectoryView
      entityType="team"
      title="Direktori Tim Esport Sumbar"
      subtitle="Klub dan organisasi esport kompetitif dengan roster terverifikasi di Sumatera Barat."
      initialProfiles={profiles}
    />
  );
}
