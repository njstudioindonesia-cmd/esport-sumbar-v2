import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { GlassBreadcrumb } from "@/components/glass/GlassBreadcrumb";

// Mock Supabase client
vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      getUser: () => Promise.resolve({ data: { user: null } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: vi.fn() } } }),
    },
  }),
}));

// Mock Next.js navigation hooks
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

describe("Kerangka Aplikasi dan Navigasi V3 (Bagian 6)", () => {
  describe("1. Navbar (Liquid Glass)", () => {
    it("harus merender navigasi utama dengan tautan V3 lengkap", () => {
      const html = renderToString(<Navbar />);
      expect(html).toContain('aria-label="Navigasi Utama"');
      expect(html).toContain("Beranda");
      expect(html).toContain("Jelajah");
      expect(html).toContain("Ekosistem");
      expect(html).toContain("Turnamen");
      expect(html).toContain("Berita");
      expect(html).toContain("Daerah");
      expect(html).toContain("Tentang");
    });

    it("harus menyertakan pintasan pencarian CommandPalette (⌘K / Ctrl+K)", () => {
      const html = renderToString(<Navbar />);
      expect(html).toContain("Cari...");
      expect(html).toContain("⌘K");
      expect(html).toContain('aria-label="Cari profil atlet, tim, atau warta (Ctrl+K)"');
    });

    it("harus merender tombol Masuk dan Daftar saat pengguna berstatus tamu", () => {
      const html = renderToString(<Navbar />);
      expect(html).toContain("Masuk");
      expect(html).toContain("Daftar");
    });
  });

  describe("2. Footer (Liquid Glass)", () => {
    it("harus merender tautan direktori 7 bidang dan wilayah", () => {
      const html = renderToString(<Footer />);
      expect(html).toContain("Direktori 7 Bidang");
      expect(html).toContain("Pemain / Atlet");
      expect(html).toContain("Tim Esports");
      expect(html).toContain("19 Wilayah Sumbar");
    });

    it("harus menyertakan pemilih efek visual Liquid Glass (Penuh/Standar/Hemat)", () => {
      const html = renderToString(<Footer />);
      expect(html).toContain("Efek Visual Liquid Glass");
      expect(html).toContain("Penuh");
      expect(html).toContain("Standar");
      expect(html).toContain("Hemat");
    });

    it("harus menyertakan tautan regulasi V3 dan legal", () => {
      const html = renderToString(<Footer />);
      expect(html).toContain("Standar Verifikasi");
      expect(html).toContain("Kebijakan Konten");
      expect(html).toContain("Kebijakan Privasi");
      expect(html).toContain("Syarat &amp; Ketentuan");
      expect(html).toContain("2026 ESPORT SUMBAR");
    });
  });

  describe("3. GlassBreadcrumb", () => {
    it("harus merender jejak breadcrumb dengan aria-current pada item terakhir", () => {
      const html = renderToString(
        <GlassBreadcrumb
          items={[
            { label: "Direktori", href: "/explore" },
            { label: "Pemain", href: "/players" },
            { label: "Fajar Ramadhan" },
          ]}
        />
      );
      expect(html).toContain('aria-label="Breadcrumb"');
      expect(html).toContain("Direktori");
      expect(html).toContain("Pemain");
      expect(html).toContain("Fajar Ramadhan");
      expect(html).toContain('aria-current="page"');
    });
  });

  describe("4. AdminNavbar (Liquid Glass)", () => {
    it("harus merender menu navigasi admin lengkap dengan peran Admin Platform", () => {
      const html = renderToString(<AdminNavbar />);
      expect(html).toContain("PANEL ADMIN PLATFORM");
      expect(html).toContain("Ringkasan");
      expect(html).toContain("Verifikasi");
      expect(html).toContain("Aturan Relasi");
      expect(html).toContain("Konten");
      expect(html).toContain("Sistem");
      expect(html).toContain("Ke Situs Publik");
    });
  });
});
