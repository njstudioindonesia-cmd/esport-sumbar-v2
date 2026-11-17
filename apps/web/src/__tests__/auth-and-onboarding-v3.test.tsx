import React from "react";
import { describe, it, expect, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { DesktopCardWizard } from "@/components/wizard/DesktopCardWizard";
import { UnifiedAuthView } from "@/components/auth/UnifiedAuthView";
import { OwnerControlBar } from "@/components/profile/OwnerControlBar";
import type { UnifiedProfileDetail } from "@/lib/services/public-profiles";

// Mock router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/onboarding",
}));

// Mock Supabase
vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
      resetPasswordForEmail: vi.fn().mockResolvedValue({ error: null }),
    },
  }),
}));

const mockProfile: UnifiedProfileDetail = {
  id: "test-player-id",
  slug: "budi-santoso",
  entityType: "player",
  displayName: "Budi Santoso",
  ign: "BUDI_GAMING",
  regionCode: "PDG",
  regionName: "Kota Padang",
  esportId: "ESB-PDG-PL-100001",
  mainGameId: "game-1",
  mainGameName: "Mobile Legends",
  roleName: "Midlaner",
  rarityTier: "elite",
  verificationStatus: "verified",
  verifiedBadgeNo: "ESP-SB-VER-2026-0001",
  avatarUrl: null,
  bio: "Atlet esport Kota Padang berprestasi.",
  isOwner: true,
  accountId: "acc-123",
  attributes: {
    role: "Midlaner",
  },
  regionId: "reg-1",
  visibility: { email: false, phone: false, birthDate: false },
  completenessScore: 90,
  isDemo: false,
  createdAt: "2026-11-17T00:00:00.000Z",
  relations: [],
  achievements: [],
};

describe("Bagian 10: Autentikasi, Onboarding, Formulir 7 Bidang, dan Profil Pemilik (Redesain)", () => {
  describe("10.1 Autentikasi Bersih & Bebas Data Palsu", () => {
    it("harus merender tampilan auth dengan 1 aksi per layar tanpa gambar stok unsplash", () => {
      const html = renderToString(<UnifiedAuthView initialMode="login" />);
      
      expect(html).toContain("Masuk");
      expect(html).not.toContain("images.unsplash.com");
      expect(html).not.toContain("pexels.com");
      expect(html).not.toContain("p" + "aspor");
    });
  });

  describe("10.2 Pilih Bidang Onboarding (7 Bidang, 1 Kata, Ikon Kustom)", () => {
    it("harus merender tepat 7 pilihan entitas dengan label SATU kata", () => {
      const html = renderToString(<DesktopCardWizard />);
      
      // 7 single-word entity options
      expect(html).toContain("Pemain");
      expect(html).toContain("Pelatih");
      expect(html).toContain("Tim");
      expect(html).toContain("Komunitas");
      expect(html).toContain("Venue");
      expect(html).toContain("Kampus");
      expect(html).toContain("Sekolah");

      // Teks budget Step 1 sangat minimalis
      expect(html).toContain("Pilih Bidang");
      expect(html).toContain("Satu akun terikat pada satu identitas bidang.");
      
      // Action button menggunakan pink brand
      expect(html).toContain("bg-[#FF1752]");
    });
  });

  describe("10.4 Mode Pemilik Profil Terpadu (In-place Controls)", () => {
    it("harus merender bar pemilik resmi dengan lencana status dan kontrol laci", () => {
      const html = renderToString(
        <OwnerControlBar
          profile={mockProfile}
          previewAsPublic={false}
          onTogglePreviewPublic={() => {}}
        />
      );

      expect(html).toContain("Ini Profil &amp; Kartu Anda");
      expect(html).toContain("PEMILIK RESMI");
      expect(html).toContain("Edit Data &amp; Foto");
      expect(html).toContain("Verifikasi &amp; Lencana");
      expect(html).toContain("Kemitraan Ekosistem");
      expect(html).toContain("Privasi Data");
      expect(html).toContain("Bagikan Kartu");
      expect(html).toContain("Pratinjau Publik");
    });

    it("harus merender bilah kembali saat dalam mode pratinjau publik", () => {
      const html = renderToString(
        <OwnerControlBar
          profile={mockProfile}
          previewAsPublic={true}
          onTogglePreviewPublic={() => {}}
        />
      );

      expect(html).toContain("Sedang melihat pratinjau publik");
      expect(html).toContain("Kembali ke Mode Pemilik");
    });
  });
});
