import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
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
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  async redirects() {
    return [
      // 301 Pengalihan rute lama ke padanan V3 (Bagian 3.2 & Keputusan D5)
      {
        source: "/partners",
        destination: "/ecosystem",
        permanent: true,
      },
      {
        source: "/admin/region/:path*",
        destination: "/admin",
        permanent: true,
      },
      {
        source: "/admin/region",
        destination: "/admin",
        permanent: true,
      },
      {
        source: "/admin/regions/:path*",
        destination: "/admin",
        permanent: true,
      },
      {
        source: "/admin/regions",
        destination: "/admin",
        permanent: true,
      },
      {
        source: "/admin/province/:path*",
        destination: "/admin",
        permanent: true,
      },
      {
        source: "/admin/province",
        destination: "/admin",
        permanent: true,
      },
      {
        source: "/admin/platform/:path*",
        destination: "/admin",
        permanent: true,
      },
      {
        source: "/admin/platform",
        destination: "/admin",
        permanent: true,
      },
      {
        source: "/admin/moderation/:path*",
        destination: "/admin/reports",
        permanent: true,
      },
      {
        source: "/admin/moderation",
        destination: "/admin/reports",
        permanent: true,
      },
      {
        source: "/admin/verifications/:path*",
        destination: "/admin/verification/:path*",
        permanent: true,
      },
      {
        source: "/admin/verifications",
        destination: "/admin/verification",
        permanent: true,
      },
      {
        source: "/me/memberships/:path*",
        destination: "/me/ecosystem",
        permanent: true,
      },
      {
        source: "/me/memberships",
        destination: "/me/ecosystem",
        permanent: true,
      },
      {
        source: "/me/cards/:path*",
        destination: "/me/card",
        permanent: true,
      },
      {
        source: "/me/cards",
        destination: "/me/card",
        permanent: true,
      },
      {
        source: "/me/profile/:id/edit",
        destination: "/me/edit",
        permanent: true,
      },
      {
        source: "/me/profile",
        destination: "/me",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
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
