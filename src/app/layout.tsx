import type { Metadata, Viewport } from "next";
import { Chakra_Petch, Inter } from "next/font/google";
import "./globals.css";

const chakraPetch = Chakra_Petch({
  weight: ["400", "500", "600", "700"],
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
  themeColor: "#07080C",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "ESPORT SUMBAR | Pusat Data & Identitas Digital Esport Sumatera Barat",
  description:
    "Pangkalan data resmi dan ekosistem esport Sumatera Barat terintegrasi dengan ESPORT ID, kartu TCG atlet, dan verifikasi berjenjang ESI.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ESPORT SUMBAR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${chakraPetch.variable} ${inter.variable} dark`}
    >
      <body className="min-h-screen bg-[#0B0D12] text-[#F3F4F6] font-sans antialiased selection:bg-[#D4AF37]/20 selection:text-[#D4AF37]">
        {children}
      </body>
    </html>
  );
}
