import React from "react";
import type { Metadata } from "next";
import { getPublicProfilesByEntity } from "@/lib/services/public-profiles";
import { EntityDirectoryView } from "@/components/directory/EntityDirectoryView";

export const instant = false;

export const metadata: Metadata = {
  title: "Direktori Pelatih Esport Sumatera Barat | ESPORT SUMBAR™",
  description: "Pangkalan data pelatih terdaftar dan juru taktik kompetitif di Sumatera Barat.",
};

export default async function CoachesDirectoryPage() {
  const profiles = await getPublicProfilesByEntity("coach");

  return (
    <EntityDirectoryView
      entityType="coach"
      title="Direktori Pelatih Esport Sumbar"
      subtitle="Katalog pelatih terverifikasi, juru taktik terdaftar, dan pembina tim esport di Sumatera Barat."
      initialProfiles={profiles}
    />
  );
}
