import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const barlowCondensed = Barlow_Condensed({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#05051A",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Admin Portal | ESPORT SUMBAR",
  description: "Portal Pengurus dan Manajemen Ekosistem Olahraga Elektronik Sumatera Barat.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${barlowCondensed.variable} ${plusJakartaSans.variable} dark`}>
      <body className="min-h-screen bg-[#05051A] text-white font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
