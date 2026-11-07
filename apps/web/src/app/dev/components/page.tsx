import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GlassComponentShowcaseClient } from "./GlassComponentShowcaseClient";

export const metadata: Metadata = {
  title: "Katalog Komponen Liquid Glass V3 - ESPORT SUMBAR",
  description: "Showcase dan pengujian komponen Liquid Glass V3 dengan berbagai varian dan state.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DevComponentsPage() {
  const isProduction =
    process.env.VERCEL_ENV === "production" &&
    process.env.NEXT_PUBLIC_IS_STAGING !== "true";

  if (isProduction) {
    notFound();
  }

  return <GlassComponentShowcaseClient />;
}
