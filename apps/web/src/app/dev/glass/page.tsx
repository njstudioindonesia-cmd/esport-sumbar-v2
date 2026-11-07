import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GlassLaboratoryClient } from "./GlassLaboratoryClient";

export const metadata: Metadata = {
  title: "Laboratorium Desain Liquid Glass 2026 — Dev Studio",
  description: "Alat validasi token, empat material kaca, mode kualitas adaptif, radius konsentris, dan anggaran blur.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function GlassLaboratoryPage() {
  const isProduction =
    process.env.VERCEL_ENV === "production" &&
    process.env.NEXT_PUBLIC_IS_STAGING !== "true";

  if (isProduction) {
    notFound();
  }

  return <GlassLaboratoryClient />;
}
