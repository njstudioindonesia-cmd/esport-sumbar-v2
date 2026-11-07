import type { Metadata, Viewport } from "next";
import { Saira_Condensed, Inter } from "next/font/google";
import "./globals.css";

const sairaCondensed = Saira_Condensed({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#03031A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://esport-sumbar-v2.vercel.app"),
  title: {
    default: "ESPORT SUMBAR | Pusat Data Esport Sumatera Barat",
    template: "%s | ESPORT SUMBAR",
  },
  description:
    "Platform data, identitas digital, dan ekosistem esport Sumatera Barat oleh ESPORT SUMBAR™. Daftar, dapatkan kartu ESPORT ID, dan jelajahi ekosistem.",
  keywords: [
    "Esport Sumbar",
    "ESPORT SUMBAR",
    "Identitas Atlet Esport",
    "Kartu TCG Atlet",
    "Esports Sumatera Barat",
    "Pusat Data Esport",
    "Ekosistem Esport Sumbar",
    "Mobile Legends Sumbar",
    "PUBG Mobile Padang",
    "Free Fire Sumbar",
    "Honor of Kings Sumbar",
  ],
  authors: [{ name: "ESPORT SUMBAR™", url: "https://esport-sumbar-v2.vercel.app" }],
  creator: "ESPORT SUMBAR™",
  publisher: "ESPORT SUMBAR™",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/brand/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/brand/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://esport-sumbar-v2.vercel.app",
    siteName: "ESPORT SUMBAR",
    title: "ESPORT SUMBAR | Pusat Data Esport Sumatera Barat",
    description:
      "Platform data, identitas digital, dan ekosistem esport Sumatera Barat oleh ESPORT SUMBAR™. Daftar, dapatkan kartu ESPORT ID, dan jelajahi ekosistem.",
    images: [
      {
        url: "/brand/og-image.png",
        width: 1200,
        height: 630,
        alt: "ESPORT SUMBAR - Pusat Data Esport Sumatera Barat",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ESPORT SUMBAR | Pusat Data Esport Sumatera Barat",
    description:
      "Platform data, identitas digital, dan ekosistem esport Sumatera Barat oleh ESPORT SUMBAR™. Daftar dan dapatkan kartu ESPORT ID.",
    images: ["/brand/og-image.png"],
    creator: "@esportsumbar",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ESPORT SUMBAR",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ESPORT SUMBAR™",
  url: "https://esport-sumbar-v2.vercel.app",
  logo: "https://esport-sumbar-v2.vercel.app/brand/logo-lockup-navy.png",
  description:
    "Platform data, identitas digital paspor atlet (ESPORT ID), dan ekosistem esport Sumatera Barat oleh ESPORT SUMBAR™.",
  sameAs: [
    "https://instagram.com/esportsumbar",
    "https://youtube.com/@esportsumbar",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${sairaCondensed.variable} ${inter.variable} dark`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-[var(--bg-base)] text-[#FFFFFF] font-sans antialiased selection:bg-[#FF1752]/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
