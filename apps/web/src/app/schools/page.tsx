import React from "react";
import type { Metadata } from "next";
import { getPublicProfilesByEntity } from "@/lib/services/public-profiles";
import { EntityDirectoryView } from "@/components/directory/EntityDirectoryView";

export const instant = false;

export const metadata: Metadata = {
  title: "Direktori Ekskul Esport Sekolah Sumatera Barat | ESPORT SUMBAR™",
  description: "Daftar ekskul pembinaan esport tingkat pelajar (SMP/SMA/SMK/MA) di Sumatera Barat.",
};

export default async function SchoolsDirectoryPage() {
  const profiles = await getPublicProfilesByEntity("school");

  return (
    <EntityDirectoryView
      entityType="school"
      title="Direktori Ekskul Esport Pelajar Sumbar"
      subtitle="Ekskul dan pembinaan minat bakat esport pelajar jenjang SMP, SMA, SMK, dan MA se-Sumatera Barat."
      initialProfiles={profiles}
    />
  );
}
