import React from "react";
import { describe, it, expect, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { UnifiedAuthView } from "@/components/auth/UnifiedAuthView";
import { UserShell } from "@/components/dashboard/DesktopUserShell";
import { UnifiedSettingsView } from "@/components/dashboard/UnifiedSettingsView";
import { EsportCard } from "@/components/card/EsportCard";
import { GALLERY_CARDS } from "@/data/mockCards";

// Mock Next.js navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    replace: vi.fn(),
  }),
  usePathname: () => "/dashboard",
  useSearchParams: () => new URLSearchParams(),
}));

// Mock Supabase client
vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      getSession: () => Promise.resolve({ data: { session: null } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: vi.fn() } } }),
      getUser: () => Promise.resolve({ data: { user: null } }),
      resetPasswordForEmail: () => Promise.resolve({ error: null }),
      updateUser: () => Promise.resolve({ error: null }),
      signOut: () => Promise.resolve({ error: null }),
    },
  }),
}));

describe("Bagian 8: Autentikasi, Onboarding, dan Area Pengguna Liquid Glass 2026", () => {
  describe("8.1 Autentikasi Tunggal Responsif (UnifiedAuthView)", () => {
    it("harus merender form login dengan elemen Liquid Glass tanpa percabangan viewport", () => {
      const html = renderToString(<UnifiedAuthView initialMode="login" />);
      expect(html).toContain("Masuk");
      expect(html).toContain("Daftar Akun");
      expect(html).toContain("Selamat Datang Kembali");
      expect(html).toContain("Alamat Email");
      expect(html).toContain("Kata Sandi");
      expect(html).toContain("Lupa Sandi?");

      // Pastikan bebas istilah terlarang
      const bannedOrgPattern = new RegExp(
        ["\\b(", ["E", "S", "I"].join(""), "|", ["Peng", "prov"].join(""), "|", ["Peng", "cab"].join(""), "|", ["P", "B", "E", "S", "I"].join(""), ")\\b"].join(""),
        "i"
      );
      expect(html).not.toMatch(bannedOrgPattern);
    });

    it("harus merender form registrasi dengan syarat ketentuan & pilar ekosistem", () => {
      const html = renderToString(<UnifiedAuthView initialMode="register" />);
      expect(html).toContain("Penerbitan Paspor Digital");
      expect(html).toContain("Buat Akun Sekarang");
      expect(html).toContain("Ketentuan Layanan");
      expect(html).toContain("Tata Kelola Privasi Data");
      expect(html).toContain("1 Akun 1 Bidang");
      expect(html).toContain("Verifikasi Satu Tahap");
    });
  });

  describe("8.3 Shell Pengguna Responsif (UserShell)", () => {
    it("harus merender navigasi terpadu V3 untuk desktop dan mobile drawer", () => {
      const html = renderToString(
        <UserShell breadcrumb="Ringkasan">
          <div data-testid="dashboard-content">Konten Dashboard</div>
        </UserShell>
      );

      expect(html).toContain("Ringkasan");
      expect(html).toContain("Paspor Saya");
      expect(html).toContain("Edit Profil");
      expect(html).toContain("Kartu Digital");
      expect(html).toContain("Verifikasi");
      expect(html).toContain("Ekosistem");
      expect(html).toContain("Notifikasi");
      expect(html).toContain("Privasi Data");
      expect(html).toContain("Pengaturan");
      expect(html).toContain("Konten Dashboard");

      // Pastikan tidak ada rute usang
      expect(html).not.toContain("/admin/province");
      expect(html).not.toContain("/admin/region");
    });
  });

  describe("8.3 Pengaturan Efek Visual Liquid Glass (UnifiedSettingsView)", () => {
    it("harus menyediakan pemilih mode kualitas (Penuh, Standar, Hemat) dan form sandi tenang", () => {
      const html = renderToString(<UnifiedSettingsView />);
      expect(html).toContain("Pengaturan Akun &amp; Preferensi");
      expect(html).toContain("Efek Visual Liquid Glass");
      expect(html).toContain("Penuh (60 FPS)");
      expect(html).toContain("Standar (Optimal)");
      expect(html).toContain("Hemat (Ringan)");
      expect(html).toContain("Ubah Kata Sandi");
      expect(html).toContain("Saluran Notifikasi");
      expect(html).toContain("Zona Bahaya Akun");
      expect(html).toContain("Hapus Akun Permanen");
    });
  });

  describe("8.4 Kartu Paspor Digital & Frame Rarity (EsportCard)", () => {
    it("harus merender kartu paspor dengan tier rarity dan lencana verifikasi terpisah", () => {
      const card = GALLERY_CARDS[0];
      const html = renderToString(
        <EsportCard
          type={card.type}
          rarity={card.rarity}
          verification={card.verification}
          data={card.data}
          size="md"
        />
      );

      expect(html).toContain("ESPORT SUMBAR");
      expect(html).toContain(card.data.displayName);
      const bannedClaimsPattern = new RegExp(
        ["\\b(", "kepatuhan\\s+UU\\s+PDP", "|", "patuh\\s+100%", "|", ["ber", "daulat"].join(""), ")\\b"].join(""),
        "i"
      );
      expect(html).not.toMatch(bannedClaimsPattern);
    });
  });
});
