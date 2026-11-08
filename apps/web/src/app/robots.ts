import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const isSoftLaunchNoIndex =
    process.env.VERCEL_ENV !== "production" ||
    process.env.NEXT_PUBLIC_IS_STAGING === "true" ||
    process.env.SHOW_DEMO_DATA === "true" ||
    process.env.NEXT_PUBLIC_PUBLIC_LAUNCH !== "true";

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://esport-sumbar-v2.vercel.app";

  if (isSoftLaunchNoIndex) {
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
