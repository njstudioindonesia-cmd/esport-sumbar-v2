import type { Metadata } from "next";
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
  return <GlassComponentShowcaseClient />;
}
