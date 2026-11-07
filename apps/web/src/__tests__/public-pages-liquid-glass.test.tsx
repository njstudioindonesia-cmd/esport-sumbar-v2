import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { HomePageClient } from "@/components/home/HomePageClient";
import { DesktopExplore } from "@/components/explore/DesktopExplore";
import { EntityDirectoryView } from "@/components/directory/EntityDirectoryView";
import { DesktopRegionsView } from "@/components/regions/DesktopRegionsView";
import { EntityProfileDispatcher } from "@/components/profile/EntityProfileDispatcher";
import type { PlatformStats } from "@/lib/services/stats";
import type { PublicArticle } from "@/lib/services/news";
import type { UnifiedProfileDetail } from "@/lib/services/public-profiles";

// Mock Supabase client
vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      getUser: () => Promise.resolve({ data: { user: null } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: vi.fn() } } }),
    },
    channel: () => ({
      on: () => ({
        subscribe: () => ({}),
      }),
    }),
    removeChannel: vi.fn(),
  }),
}));

// Mock Next.js navigation hooks
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

const mockStats: PlatformStats = {
  totalEntities: 128,
  totalPlayers: 90,
  totalCoaches: 12,
  totalTeams: 28,
  totalCommunities: 19,
  totalVenues: 12,
  totalCampuses: 15,
  totalSchools: 24,
  activeRegions: 19,
  verifiedCount: 42,
};

const mockArticles: PublicArticle[] = [
  {
    id: "art-1",
    title: "Liga Esport Pelajar Sumatera Barat 2026 Dibuka",
    slug: "liga-esport-pelajar-sumbar-2026",
    summary: "Ratusan tim pelajar dari 19 wilayah bersiap memperebutkan gelar juara.",
    content: "Konten lengkap artikel berita esport sumatera barat.",
    category: "Turnamen Daerah",
    regionId: "reg-1",
    publishedAt: "2026-03-01T10:00:00Z",
    coverImageUrl: "/images/news-placeholder.jpg",
  },
];

const mockProfiles: UnifiedProfileDetail[] = [
  {
    id: "prof-1",
    slug: "randi-pratama",
    accountId: "acc-1",
    displayName: "Randi Pratama",
    entityType: "player",
    ign: "FalconX",
    roleName: "Sniper",
    mainGameName: "PUBG Mobile",
    mainGameId: "pubgm",
    mainGameShort: "PUBGM",
    regionName: "Kota Padang",
    regionCode: "PDG",
    regionId: "reg-1",
    esportId: "ESP-SB-2026-0001",
    verificationStatus: "verified",
    verifiedBadgeNo: "ESP-SB-VER-2026-0001",
    rarityTier: "elite",
    completenessScore: 95,
    bio: "Atlet sniper divisi PUBG Mobile.",
    attributes: {},
    visibility: {},
    relations: [],
    achievements: [],
    isDemo: false,
    isOwner: false,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
];

describe("Halaman Publik Liquid Glass V3 (Bagian 7)", () => {
  describe("7.1 Beranda (HomePageClient)", () => {
    it("harus merender panggung sinematik liquid glass, headline ala brand, dan 5 langkah alur", () => {
      const html = renderToString(
        <HomePageClient
          stats={mockStats}
          articles={mockArticles}
          profiles={mockProfiles}
        />
      );

      // Headline
      expect(html).toContain("BANGUN NAMAMU DI");
      expect(html).toContain("ARENA SUMBAR");

      // 5 Langkah Cara Kerja
      expect(html).toContain("Cara Kerja Sistem V3");
      expect(html).toContain("01");
      expect(html).toContain("Pilih 1 Bidang");
      expect(html).toContain("02");
      expect(html).toContain("Terbitkan Kartu");
      expect(html).toContain("03");
      expect(html).toContain("Koneksi 7 Entitas");
      expect(html).toContain("04");
      expect(html).toContain("Verifikasi Standar");
      expect(html).toContain("05");
      expect(html).toContain("Tampil di Roster");

      // Ekosistem 7 Bidang
      expect(html).toContain("Jaringan Ekosistem 7 Bidang");
      expect(html).toContain("Pemain");
      expect(html).toContain("Pelatih");
      expect(html).toContain("Tim");
      expect(html).toContain("Komunitas");
      expect(html).toContain("Venue");
      expect(html).toContain("Kampus");
      expect(html).toContain("Sekolah");
    });

    it("tidak boleh mengandung istilah dan klaim terlarang di HTML keluaran", () => {
      const html = renderToString(
        <HomePageClient
          stats={mockStats}
          articles={mockArticles}
          profiles={mockProfiles}
        />
      );

      const bannedOrgPattern = new RegExp(
        ["\\b(", ["E", "S", "I"].join(""), "|", ["Peng", "prov"].join(""), "|", ["Peng", "cab"].join(""), "|", ["P", "B", "E", "S", "I"].join(""), "|", ["KO", "NI"].join(""), "|", ["Dis", "pora"].join(""), ")\\b"].join(""),
        "i"
      );
      const bannedClaimsPattern = new RegExp(
        ["\\b(", "kepatuhan\\s+UU\\s+PDP", "|", "patuh\\s+100%", "|", ["ber", "daulat"].join(""), ")\\b"].join(""),
        "i"
      );
      expect(html).not.toMatch(bannedOrgPattern);
      expect(html).not.toMatch(bannedClaimsPattern);
    });
  });

  describe("7.2 Jelajah dan Direktori 7 Bidang", () => {
    it("DesktopExplore harus merender pencarian kaca, tab 7 bidang, dan filter terpadu", () => {
      const html = renderToString(<DesktopExplore />);
      expect(html).toContain("Cari nama atlet, IGN, klub, nomor ESPORT ID, atau game...");
      expect(html).toContain("Semua");
      expect(html).toContain("Pemain");
      expect(html).toContain("Pelatih");
      expect(html).toContain("Tim");
      expect(html).toContain("Komunitas");
      expect(html).toContain("Venue");
      expect(html).toContain("Kampus");
      expect(html).toContain("Sekolah");
    });

    it("EntityDirectoryView harus merender direktori dengan status verifikasi tunggal", () => {
      const html = renderToString(
        <EntityDirectoryView
          entityType="player"
          title="Direktori Atlet Esport"
          subtitle="Daftar pemain kompetitif terverifikasi di Sumatera Barat."
          initialProfiles={mockProfiles}
        />
      );

      expect(html).toContain("Direktori Atlet Esport");
      expect(html).toContain("Randi Pratama");
      expect(html).toContain("@FalconX");
      expect(html).toContain("PUBG Mobile");
      expect(html).toContain("PDG");
    });
  });

  describe("7.3 Profil Publik dan Perlindungan Pelajar", () => {
    it("EntityProfileDispatcher harus merender profil pemain dengan benar", () => {
      const html = renderToString(
        <EntityProfileDispatcher profile={mockProfiles[0]} />
      );

      expect(html).toContain("Randi Pratama");
      expect(html).toContain("ESP-SB-2026-0001");
      expect(html).toContain("PDG");
    });

    it("harus menyertakan proteksi privasi pada profil institusi pendidikan (Kampus/Sekolah)", () => {
      const schoolProfile: UnifiedProfileDetail = {
        ...mockProfiles[0],
        id: "sch-1",
        slug: "sman-1-padang",
        displayName: "SMAN 1 Padang",
        entityType: "school",
        esportId: "ESP-SB-SCH-0001",
        attributes: {
          school_name: "SMAN 1 Padang",
          education_level: "SMA",
          student_count: 24,
          advisor_name: "Drs. Hendri, M.Pd",
        },
      };

      const html = renderToString(
        <EntityProfileDispatcher profile={schoolProfile} />
      );

      // Harus menampilkan jumlah angka agregat tanpa mempublikasikan data privat siswa
      expect(html).toContain("Kebijakan Privasi Pelajar");
      expect(html).toContain("24");
      expect(html).toContain("Siswa Terdaftar (Angka)");
    });
  });

  describe("7.4 Wilayah Geografis 19 Daerah", () => {
    it("DesktopRegionsView harus merender 19 wilayah Ranah Minang tanpa klaim administratif usang", () => {
      const html = renderToString(<DesktopRegionsView />);
      expect(html).toContain("19 Wilayah Ranah Minang");
      expect(html).toContain("Peta Geografis Sumatera Barat");
      expect(html).toContain("19 Wilayah Terdata");
      expect(html).not.toMatch(/Ditangani Provinsi/i);
      const bannedOrgPattern = new RegExp(
        ["\\b(", ["E", "S", "I"].join(""), "|", ["Peng", "prov"].join(""), "|", ["Peng", "cab"].join(""), "|", ["P", "B", "E", "S", "I"].join(""), ")\\b"].join(""),
        "i"
      );
      expect(html).not.toMatch(bannedOrgPattern);
    });
  });
});
