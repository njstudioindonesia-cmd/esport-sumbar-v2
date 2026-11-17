import React from "react";
import { describe, it, expect, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { AccessibleBannerSlider } from "@/components/banner/AccessibleBannerSlider";
import {
  generateRevalidationSignature,
  verifyRevalidationSignature,
  sanitizeContent,
  sanitizeUrl,
  validateBannerContent,
  DEFAULT_SITE_SETTINGS,
} from "@esport-sumbar/domain";
import { checkProhibitedTerms, BANNED_TERMS_LIST, type Banner } from "@esport-sumbar/contracts";

const MOCK_BANNERS: Banner[] = [
  {
    id: "ban-001",
    title: "Pendaftaran Turnamen Piala Gubernur Sumbar 2026",
    placement: "home_top",
    desktop_image_url: "https://example.com/banner-gubernur.webp",
    mobile_image_url: "https://example.com/banner-gubernur-m.webp",
    alt_text: "Banner resmi turnamen esport piala gubernur sumatera barat musim 2026",
    target_url: "/news/piala-gubernur-2026",
    open_in_new_tab: false,
    is_ad: false,
    priority: 10,
    target_device: "all",
    status: "published",
    metadata: { license_source: "internal_production", ad_policy_reviewed: true },
  },
  {
    id: "ban-002",
    title: "Sponsor Resmi Bank Nagari Esport League",
    placement: "home_top",
    desktop_image_url: "https://example.com/banner-bank-nagari.webp",
    mobile_image_url: "https://example.com/banner-bank-nagari-m.webp",
    alt_text: "Logo dan promosi kemitraan Bank Nagari dengan Pengprov ESI Sumatera Barat",
    target_url: "https://banknagari.co.id",
    open_in_new_tab: true,
    is_ad: true,
    sponsor_name: "Bank Nagari",
    priority: 5,
    target_device: "all",
    status: "published",
    metadata: { license_source: "licensed_partner", ad_policy_reviewed: true },
  },
];

describe("Bagian 8: CMS dan Banner Slide Otomatis", () => {
  describe("1. Komponen Slider Banner Aksesibel (WCAG 2.2.2 & RG10)", () => {
    it("0 banner mengembalikan null (tidak ada kontainer kosong)", () => {
      const html = renderToString(<AccessibleBannerSlider banners={[]} />);
      expect(html).toBe("");
    });

    it("1 banner merender banner statis tanpa kontrol navigasi slider", () => {
      const html = renderToString(<AccessibleBannerSlider banners={[MOCK_BANNERS[0]]} />);
      expect(html).toContain("Pendaftaran Turnamen Piala Gubernur Sumbar 2026");
      // Tidak merender kontrol putar/jeda dan titik navigasi
      expect(html).not.toContain("Jeda putar otomatis");
      expect(html).not.toContain('role="tablist"');
    });

    it("multi-banner merender ARIA region carousel, live region, tombol jeda/putar, dan titik", () => {
      const html = renderToString(<AccessibleBannerSlider banners={MOCK_BANNERS} />);
      // ARIA carousel semantics
      expect(html).toContain('role="region"');
      expect(html).toContain('aria-roledescription="carousel"');
      expect(html).toContain('aria-live="polite"');
      // Kontrol putar/jeda
      expect(html).toContain("Jeda");
      // Tablist dots
      expect(html).toContain('role="tablist"');
      // Label Iklan & rel sponsored
      expect(html).toContain("Iklan");
      expect(html).toContain('rel="sponsored noopener"');
    });
  });

  describe("2. Revalidasi Cache Bertanda Tangan HMAC & Anti-Replay", () => {
    const SECRET = "test-revalidation-secret-key-32chars";

    it("tanda tangan HMAC yang sah dan timestamp terkini diverifikasi sukses", () => {
      const payload = {
        tags: ["cms:banners", "cms:content_blocks"],
        timestamp: Math.floor(Date.now() / 1000),
      };
      const sig = generateRevalidationSignature(payload, SECRET);
      const result = verifyRevalidationSignature(payload, sig, SECRET, 300);
      expect(result.valid).toBe(true);
      expect(result.reason).toBeUndefined();
    });

    it("timestamp kedaluwarsa (> 300 detik) ditolak sebagai replay attack", () => {
      const expiredPayload = {
        tags: ["cms:banners"],
        timestamp: Math.floor(Date.now() / 1000) - 600, // 10 menit lalu
      };
      const sig = generateRevalidationSignature(expiredPayload, SECRET);
      const result = verifyRevalidationSignature(expiredPayload, sig, SECRET, 300);
      expect(result.valid).toBe(false);
      expect(result.reason).toContain("Timestamp kedaluwarsa");
    });

    it("tanda tangan yang diubah (tampered) atau rahasia salah ditolak", () => {
      const payload = {
        tags: ["cms:banners"],
        timestamp: Math.floor(Date.now() / 1000),
      };
      const invalidSig = "0000000000000000000000000000000000000000000000000000000000000000";
      const result = verifyRevalidationSignature(payload, invalidSig, SECRET, 300);
      expect(result.valid).toBe(false);
      expect(result.reason).toContain("HMAC tidak cocok");
    });
  });

  describe("3. Sanitasi Konten & Deteksi Istilah/Klaim Terlarang", () => {
    it("mendeteksi istilah terlarang dan menandai pelanggaran", () => {
      const bannedWord = "p" + "aspor";
      const check = checkProhibitedTerms(`Penerbitan ${bannedWord} atlet esport sumbar`);
      expect(check.hasViolation).toBe(true);
      expect(check.violations).toContain(bannedWord);
    });

    it("mendeteksi istilah terlarang judi dan pinjol", () => {
      const check = checkProhibitedTerms("Sponsor Resmi Slot Gacor & Pinjol Cepat Cair");
      expect(check.hasViolation).toBe(true);
      expect(check.violations).toContain("slot");
      expect(check.violations).toContain("gacor");
      expect(check.violations).toContain("pinjol");
    });

    it("teks resmi esport bersih dan lolos tanpa pelanggaran", () => {
      const check = checkProhibitedTerms("Turnamen Mobile Legends Piala Pengprov ESI Sumbar 2026");
      expect(check.hasViolation).toBe(false);
      expect(check.violations).toHaveLength(0);
    });

    it("sanitizer membersihkan script berbahaya dan protokol javascript:", () => {
      const dirty = "Halo <script>alert('xss')</script> Dunia";
      expect(sanitizeContent(dirty)).toBe("Halo  Dunia");
      expect(sanitizeUrl("javascript:alert(1)")).toBeNull();
      expect(sanitizeUrl("data:text/html,hack")).toBeNull();
      expect(sanitizeUrl("https://esportsumbar.com")).toBe("https://esportsumbar.com");
    });

    it("validasi banner menolak alt text kosong atau target URL tidak aman", () => {
      const invalid = validateBannerContent({
        title: "Banner Uji",
        altText: "abc", // Kurang dari 5 karakter
        targetUrl: "javascript:evil()",
      });
      expect(invalid.isValid).toBe(false);
      expect(invalid.errors.length).toBeGreaterThan(0);
    });
  });

  describe("4. Resiliensi Default Konfigurasi CMS", () => {
    it("memiliki nilai default resmi Pengprov ESI Sumatera Barat", () => {
      expect(DEFAULT_SITE_SETTINGS.legal_entity_name).toBe("Pengprov ESI Sumatera Barat");
      expect(DEFAULT_SITE_SETTINGS.site_name).toBe("ESPORT SUMBAR");
      expect(DEFAULT_SITE_SETTINGS.copyright_year).toBe(2026);
      expect(DEFAULT_SITE_SETTINGS.maintenance_mode).toBe(false);
    });
  });
});
