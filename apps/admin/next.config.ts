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
};

export default nextConfig;
