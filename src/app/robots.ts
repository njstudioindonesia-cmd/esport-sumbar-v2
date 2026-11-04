import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/me/", "/api/"],
      },
    ],
    sitemap: "https://esport-sumbar-v2.vercel.app/sitemap.xml",
  };
}
