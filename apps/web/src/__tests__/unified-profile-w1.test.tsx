import React from "react";
import { describe, it, expect, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { OwnerControlBar } from "@/components/profile/OwnerControlBar";
import { NotificationPanel } from "@/components/layout/NotificationPanel";
import type { UnifiedProfileDetail } from "@/lib/services/public-profiles";

// Mock Next.js navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    replace: vi.fn(),
  }),
  usePathname: () => "/player/rizky-falcon",
  useSearchParams: () => new URLSearchParams(),
}));

const MOCK_PROFILE: UnifiedProfileDetail = {
  id: "prof-001",
  accountId: "acc-001",
  entityType: "player",
  slug: "rizky-falcon",
  displayName: "Rizky Pratama",
  ign: "Falcon",
  bio: "Midlaner kompetitif Sumatera Barat",
  esportId: "ESP-SB-2026-0001",
  regionId: "reg-001",
  regionCode: "PDG",
  regionName: "Kota Padang",
  mainGameName: "Mobile Legends: Bang Bang",
  roleName: "Midlaner",
  verificationStatus: "verified",
  verifiedBadgeNo: "ESP-SB-VER-2026-0001",
  rarityTier: "elite",
  avatarUrl: "https://example.com/falcon.webp",
  visibility: {},
  completenessScore: 85,
  isDemo: false,
  createdAt: "2026-01-01T00:00:00Z",
  attributes: {
    is_looking_for_team: true,
  },
  relations: [],
};

describe("Bagian 7: Profil Terpadu (W1 Architecture - Tanpa Dashboard Terpisah)", () => {
  it("OwnerControlBar merender kontrol pemilik resmi dengan aksi lengkap di tempat", () => {
    const html = renderToString(
      <OwnerControlBar
        profile={MOCK_PROFILE}
        previewAsPublic={false}
        onTogglePreviewPublic={vi.fn()}
      />
    );

    // Verifikasi identitas pemilik
    expect(html).toContain("Ini Profil &amp; Kartu Anda");
    expect(html).toContain("PEMILIK RESMI");

    // Verifikasi seluruh tombol aksi in-place
    expect(html).toContain("Edit Data &amp; Foto");
    expect(html).toContain("Verifikasi &amp; Lencana");
    expect(html).toContain("Kemitraan Ekosistem");
    expect(html).toContain("Privasi Data");
    expect(html).toContain("Bagikan Kartu");
    expect(html).toContain("Pratinjau Publik");
  });

  it("OwnerControlBar merender floating pill ketika mode Pratinjau Publik aktif", () => {
    const html = renderToString(
      <OwnerControlBar
        profile={MOCK_PROFILE}
        previewAsPublic={true}
        onTogglePreviewPublic={vi.fn()}
      />
    );

    expect(html).toContain("Sedang melihat pratinjau publik (seperti tamu)");
    expect(html).toContain("Kembali ke Mode Pemilik");
    expect(html).not.toContain("Edit Data &amp; Foto");
  });

  it("NotificationPanel merender tombol lonceng aksesibel dengan notifikasi terintegrasi", () => {
    const html = renderToString(<NotificationPanel />);
    expect(html).toContain("Pemberitahuan Akun");
  });
});
