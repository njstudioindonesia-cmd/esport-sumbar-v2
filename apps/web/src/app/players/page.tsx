import React from "react";
import type { Metadata } from "next";
import { getPublicProfilesByEntity } from "@/lib/services/public-profiles";
import { EntityDirectoryView } from "@/components/directory/EntityDirectoryView";

export const instant = false;

export const metadata: Metadata = {
  title: "Direktori Atlet Esport Sumatera Barat | ESPORT SUMBAR™",
  description: "Pangkalan data atlet esport kompetitif dari 19 Kota dan Kabupaten di Sumatera Barat.",
};

export default async function PlayersDirectoryPage() {
  const profiles = await getPublicProfilesByEntity("player");

  return (
    <EntityDirectoryView
      entityType="player"
      title="Direktori Atlet Esport Sumbar"
      subtitle="Pangkalan data atlet kompetitif terdaftar resmi Komunitas Esport di 19 Kota dan Kabupaten Sumatera Barat."
      initialProfiles={profiles}
    />
  );
}
