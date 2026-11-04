import React from "react";
import type { Metadata } from "next";
import { getPublicProfilesByEntity } from "@/lib/services/public-profiles";
import { EntityDirectoryView } from "@/components/directory/EntityDirectoryView";

export const instant = false;

export const metadata: Metadata = {
  title: "Direktori Komunitas Esport Sumatera Barat | ESPORT SUMBAR™",
  description: "Wadah perkumpulan, mabar, dan kegiatan komunitas esport di Sumatera Barat.",
};

export default async function CommunitiesDirectoryPage() {
  const profiles = await getPublicProfilesByEntity("community");

  return (
    <EntityDirectoryView
      entityType="community"
      title="Direktori Komunitas Esport Sumbar"
      subtitle="Wadah silaturahmi, mabar, dan pembinaan akar rumput pegiat esport di 19 Kota dan Kabupaten."
      initialProfiles={profiles}
    />
  );
}
