import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const isStaging =
    process.env.VERCEL_ENV !== "production" ||
    process.env.NEXT_PUBLIC_IS_STAGING === "true" ||
    process.env.SHOW_DEMO_DATA === "true";

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://esport-sumbar-v2.vercel.app";

  if (isStaging) {
    return {
      rules: [
        {
          userAgent: "*",
          disallow: "/",
        },
      ],
      sitemap: `${siteUrl}/sitemap.xml`,
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/me/", "/api/", "/dev/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
