import React from "react";
import type { Metadata } from "next";
import { getPublicProfilesByEntity } from "@/lib/services/public-profiles";
import { EntityDirectoryView } from "@/components/directory/EntityDirectoryView";

export const instant = false;

export const metadata: Metadata = {
  title: "Direktori UKM Esport Kampus Sumatera Barat | PBESI",
  description: "Daftar UKM dan komunitas esport perguruan tinggi resmi di Sumatera Barat.",
};

export default async function CampusesDirectoryPage() {
  const profiles = await getPublicProfilesByEntity("campus");

  return (
    <EntityDirectoryView
      entityType="campus"
      title="Direktori Kampus & UKM Esport Sumbar"
      subtitle="Pusat pembinaan bakat esport mahasiswa di perguruan tinggi seluruh Sumatera Barat."
      initialProfiles={profiles}
    />
  );
}
