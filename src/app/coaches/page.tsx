import React from "react";
import type { Metadata } from "next";
import { getPublicProfilesByEntity } from "@/lib/services/public-profiles";
import { EntityDirectoryView } from "@/components/directory/EntityDirectoryView";

export const instant = false;

export const metadata: Metadata = {
  title: "Direktori Pelatih Esport Sumatera Barat | PBESI",
  description: "Pangkalan data pelatih berlisensi dan juru taktik resmi binaan ESI Sumatera Barat.",
};

export default async function CoachesDirectoryPage() {
  const profiles = await getPublicProfilesByEntity("coach");

  return (
    <EntityDirectoryView
      entityType="coach"
      title="Direktori Pelatih Esport Sumbar"
      subtitle="Katalog pelatih resmi, juru taktik berlisensi, dan pembina tim esport di Sumatera Barat."
      initialProfiles={profiles}
    />
  );
}
