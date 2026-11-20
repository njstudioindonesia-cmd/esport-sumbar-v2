import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@esport-sumbar/contracts",
    "@esport-sumbar/design-tokens",
    "@esport-sumbar/domain",
    "@esport-sumbar/lib",
    "@esport-sumbar/ui",
  ],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Section 3.12: Admin tidak diindeks (noindex, robots)
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
  async rewrites() {
    const webPort = process.env.WEB_PORT || "3000";
    const webOrigin =
      process.env.NODE_ENV === "development"
        ? `http://localhost:${webPort}`
        : process.env.NEXT_PUBLIC_SITE_URL || "https://esport-sumbar-v2.vercel.app";

    return [
      {
        source: "/player/:path*",
        destination: `${webOrigin}/player/:path*`,
      },
      {
        source: "/coach/:path*",
        destination: `${webOrigin}/coach/:path*`,
      },
      {
        source: "/team/:path*",
        destination: `${webOrigin}/team/:path*`,
      },
      {
        source: "/community/:path*",
        destination: `${webOrigin}/community/:path*`,
      },
      {
        source: "/campus/:path*",
        destination: `${webOrigin}/campus/:path*`,
      },
      {
        source: "/school/:path*",
        destination: `${webOrigin}/school/:path*`,
      },
      {
        source: "/venue/:path*",
        destination: `${webOrigin}/venue/:path*`,
      },
      {
        source: "/profile/:path*",
        destination: `${webOrigin}/profile/:path*`,
      },
      {
        source: "/undefined/:slug*",
        destination: `${webOrigin}/player/:slug*`,
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
