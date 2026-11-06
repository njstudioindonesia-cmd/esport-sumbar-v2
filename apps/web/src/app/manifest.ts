import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ESPORT SUMBAR",
    short_name: "ES Sumbar",
    description: "Pusat Data & Identitas Digital Esport Sumatera Barat",
    start_url: "/",
    display: "standalone",
    background_color: "#03031A",
    theme_color: "#03031A",
    orientation: "portrait",
    icons: [
      {
        src: "/brand/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/brand/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/brand/android-chrome-maskable-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
