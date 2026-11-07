import type { NextConfig } from "next";

const isStaging =
  process.env.VERCEL_ENV !== "production" ||
  process.env.NEXT_PUBLIC_IS_STAGING === "true" ||
  process.env.SHOW_DEMO_DATA === "true";

const cspDirectives = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https://*.supabase.co https://images.unsplash.com",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://vitals.vercel-insights.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: cspDirectives,
  },
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
  ...(isStaging
    ? [
        {
          key: "X-Robots-Tag",
          value: "noindex, nofollow",
        },
      ]
    : []),
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    return [
      // 301 Pengalihan rute lama ke padanan V3 (Bagian 3.2 & Keputusan D5/P10)
      {
        source: "/partners",
        destination: "/ecosystem",
        permanent: true,
      },
      {
        source: "/me/cards",
        destination: "/me/card",
        permanent: true,
      },
      {
        source: "/me/memberships",
        destination: "/me/ecosystem",
        permanent: true,
      },
      {
        source: "/me/profile/new",
        destination: "/onboarding",
        permanent: true,
      },
      {
        source: "/me/profile/:id/edit",
        destination: "/me/edit",
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
        source: "/me/profile/new",
        destination: "/onboarding",
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
