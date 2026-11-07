import React from "react";
import type { Metadata } from "next";
import { getPublicProfilesByEntity } from "@/lib/services/public-profiles";
import { EntityDirectoryView } from "@/components/directory/EntityDirectoryView";

export const instant = false;

export const metadata: Metadata = {
  title: "Direktori Gaming Venue & iCafe Sumatera Barat | ESPORT SUMBAR™",
  description: "Daftar warnet, iCafe, warkop gaming, dan arena esport di Sumatera Barat.",
};

export default async function VenuesDirectoryPage() {
  const profiles = await getPublicProfilesByEntity("venue");

  return (
    <EntityDirectoryView
      entityType="venue"
      title="Direktori Venue & iCafe Gaming Sumbar"
      subtitle="Lokasi gaming station, iCafe, dan arena turnamen di 19 Kota dan Kabupaten Sumatera Barat."
      initialProfiles={profiles}
    />
  );
}
