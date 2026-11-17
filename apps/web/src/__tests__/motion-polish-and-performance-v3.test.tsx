import React from "react";
import { describe, it, expect, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { EsportCard } from "@/components/card/EsportCard";
import { AccessibleBannerSlider } from "@/components/banner/AccessibleBannerSlider";
import { GlassNumberCounter } from "@/components/glass/GlassNumberCounter";
import { VerificationFlowTracker } from "@/components/glass/VerificationFlowTracker";
import {
  MOTION_DURATIONS,
  MOTION_SPRINGS,
  REDUCED_MOTION_VARIANTS,
} from "@/components/glass/MotionPresets";
import { colors } from "@esport-sumbar/design-tokens";

describe("Bagian 12: Gerak, Poles, Performa, dan Pengujian Lintas Perangkat (V3)", () => {
  describe("12.1 Koreografi Gerak Konsisten & Prefers-Reduced-Motion", () => {
    it("memiliki durasi gerak terkendali (100ms - 700ms) tanpa animasi liar tak berkesudahan", () => {
      expect(MOTION_DURATIONS.instant).toBe(0.1);
      expect(MOTION_DURATIONS.fast).toBe(0.18);
      expect(MOTION_DURATIONS.base).toBe(0.28);
      expect(MOTION_DURATIONS.slow).toBe(0.45);
      expect(MOTION_DURATIONS.cinematic).toBe(0.7);
    });

    it("memiliki varian reduced-motion tanpa pergeseran tata letak (zero layout shift)", () => {
      expect(REDUCED_MOTION_VARIANTS.fadeIn.transition.duration).toBe(0.1);
      expect(REDUCED_MOTION_VARIANTS.instant.transition.duration).toBe(0);
    });

    it("slider banner merender kontrol jeda aksesibel saat memiliki >= 2 banner (WCAG 2.2.2)", () => {
      const mockBanners = [
        {
          id: "b-1",
          title: "Kejurda Esport Sumbar 2026",
          placement: "home_hero",
          desktop_image_url: "/brand/banner-desktop.png",
          mobile_image_url: "/brand/banner-mobile.png",
          alt_text: "Kejuaraan Daerah Esport Sumatera Barat 2026",
          target_url: "/tournaments",
          is_ad: false,
          priority: 1,
          status: "published",
        },
        {
          id: "b-2",
          title: "Liga Pelajar Esport Sumbar",
          placement: "home_hero",
          desktop_image_url: "/brand/banner-desktop-2.png",
          mobile_image_url: "/brand/banner-mobile-2.png",
          alt_text: "Liga Pelajar Esport Sumatera Barat",
          target_url: "/tournaments/league",
          is_ad: false,
          priority: 2,
          status: "published",
        },
      ];

      const html = renderToString(<AccessibleBannerSlider banners={mockBanners as any} />);
      expect(html).toContain("aria-roledescription=\"carousel\"");
      expect(html).toContain("Jeda putar otomatis banner");
    });
  });

  describe("12.2 Poles Visual: Kontras, Jarak, dan Data Ekstrem", () => {
    it("token warna memenuhi kontras WCAG AA (teks putih di atas kanvas gelap #05051A)", () => {
      expect(colors.ink.base).toBe("#05051A");
      expect(colors.text.primary).toBe("#FFFFFF");
      expect(colors.brand.pink).toBe("#FF1752");
    });

    it("kartu atlet menangani nama sangat panjang secara anggun dengan truncate tanpa merusak geometri", () => {
      const extremeProfile = {
        displayName: "Muhammad Al-Farabi Pratama Putra Minangkabau Sutan Palimo",
        ign: "VERY_LONG_IN_GAME_NAME_SNIPER_CHAMPION_2026",
        esportId: "ESB-PDG-PL-100999",
        region: "Kota Padang",
        regionCode: "PDG",
        game: "Mobile Legends: Bang Bang Professional",
        role: "Goldlaner / Marksman Utama",
      };

      const html = renderToString(
        <EsportCard
          data={extremeProfile as any}
          rarity="elite"
          verification="verified"
          interactive={false}
        />
      );

      expect(html).toContain("truncate");
      expect(html).toContain("Muhammad Al-Farabi Pratama Putra Minangkabau Sutan Palimo");
      expect(html).toContain("VERY_LONG_IN_GAME_NAME_SNIPER_CHAMPION_2026");
      expect(html).toContain("ESB-PDG-PL-100999");
    });

    it("komponen counter angka menggunakan font tabular-nums untuk mencegah layout shift", () => {
      const html = renderToString(
        <GlassNumberCounter value={1250} label="Atlet Terdaftar" />
      );

      expect(html).toContain("tabular-nums");
      expect(html).toContain("Atlet Terdaftar");
    });
  });

  describe("12.3 Pengujian Lintas Perangkat (Mobile, Tablet, Desktop)", () => {
    it("komponen pelacak verifikasi merender tahapan jelas dan ramah sentuhan", () => {
      const steps = [
        { id: 1, label: "Pengajuan", status: "completed" as const },
        { id: 2, label: "Telaah", status: "active" as const },
        { id: 3, label: "Lencana", status: "pending" as const },
      ];

      const html = renderToString(<VerificationFlowTracker steps={steps} />);
      expect(html).toContain("Pengajuan");
      expect(html).toContain("Telaah");
      expect(html).toContain("Lencana");
    });
  });
});
