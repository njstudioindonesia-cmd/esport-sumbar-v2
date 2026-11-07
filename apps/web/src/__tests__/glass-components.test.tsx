import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import {
  GlassButton,
  GlassCard,
  GlassBadge,
  GlassStatusBadge,
  GlassRarityBadge,
  GlassInput,
  GlassSelect,
  GlassTextarea,
  GlassSwitch,
  GlassSegmented,
  GlassSkeleton,
  GlassToast,
  GlassNav,
  GlassTabBar,
  GlassSidebar,
} from "@/components/glass";

describe("Glass Component Library (Bagian 5)", () => {
  describe("1. GlassButton", () => {
    it("harus merender tombol dengan varian primary dan role bawaan", () => {
      const html = renderToString(
        <GlassButton variant="primary">Kirim Permohonan</GlassButton>
      );
      expect(html).toContain("Kirim Permohonan");
      expect(html).toContain("bg-gradient-to-r");
    });

    it("harus menambahkan class disabled dan atribut disabled saat disabled=true", () => {
      const html = renderToString(
        <GlassButton variant="secondary" disabled>
          Tombol Nonaktif
        </GlassButton>
      );
      expect(html).toContain("disabled");
      expect(html).toContain("Tombol Nonaktif");
    });

    it("harus menyertakan aria-busy='true' saat isLoading=true", () => {
      const html = renderToString(
        <GlassButton isLoading>Menyimpan</GlassButton>
      );
      expect(html).toContain('aria-busy="true"');
      expect(html).toContain("animate-spin");
    });
  });

  describe("2. GlassBadge & Kepatuhan D17", () => {
    it("harus merender GlassStatusBadge terverifikasi dengan perisai (ShieldCheck)", () => {
      const html = renderToString(<GlassStatusBadge status="verified" />);
      expect(html).toContain("Terverifikasi");
      expect(html).toContain("aria-label=\"Status verifikasi: Terverifikasi\"");
      expect(html).toContain("border-amber-400/50");
    });

    it("harus membedakan frame Elite dari lencana Terverifikasi sesuai Keputusan D17", () => {
      const eliteHtml = renderToString(<GlassRarityBadge rarity="elite" />);
      const verifiedHtml = renderToString(<GlassStatusBadge status="verified" />);

      // Elite memakai label Elite dan indikator tingkat kartu
      expect(eliteHtml).toContain("Elite");
      expect(eliteHtml).toContain("aria-label=\"Tingkat kartu: Elite\"");

      // Keduanya berbeda secara fungsional dan semantik
      expect(eliteHtml).not.toContain("Status verifikasi");
      expect(verifiedHtml).toContain("Status verifikasi");
    });

    it("harus merender status Ditolak dan Menunggu Telaah dengan semantik yang tepat", () => {
      const pendingHtml = renderToString(<GlassStatusBadge status="pending" />);
      const rejectedHtml = renderToString(<GlassStatusBadge status="rejected" />);

      expect(pendingHtml).toContain("Menunggu Telaah");
      expect(rejectedHtml).toContain("Ditolak");
    });
  });

  describe("3. GlassForm Controls (GlassInput, GlassSelect, GlassTextarea)", () => {
    it("harus merender GlassInput dengan label dan atribut aksesibilitas", () => {
      const html = renderToString(
        <GlassInput
          id="test-input"
          label="Nama Lengkap"
          helperText="Masukkan nama sesuai identitas"
        />
      );
      expect(html).toContain("Nama Lengkap");
      expect(html).toContain('id="test-input"');
      expect(html).toContain('aria-describedby="test-input-helper"');
      expect(html).toContain("Masukkan nama sesuai identitas");
    });

    it("harus merender pesan error dengan role='alert' dan aria-invalid='true'", () => {
      const html = renderToString(
        <GlassInput
          id="test-email"
          label="Email"
          error="Format email tidak valid"
        />
      );
      expect(html).toContain('aria-invalid="true"');
      expect(html).toContain('role="alert"');
      expect(html).toContain("Format email tidak valid");
    });

    it("harus merender GlassSelect dengan opsi yang diberikan", () => {
      const html = renderToString(
        <GlassSelect
          label="Pilih Bidang"
          options={[
            { value: "player", label: "Pemain" },
            { value: "team", label: "Tim" },
          ]}
        />
      );
      expect(html).toContain("Pilih Bidang");
      expect(html).toContain("Pemain");
      expect(html).toContain("Tim");
    });
  });

  describe("4. GlassSwitch & GlassSegmented", () => {
    it("harus merender GlassSwitch dengan role='switch' dan aria-checked", () => {
      const html = renderToString(
        <GlassSwitch
          checked={true}
          onCheckedChange={vi.fn()}
          label="Mode Gelap"
        />
      );
      expect(html).toContain('role="switch"');
      expect(html).toContain('aria-checked="true"');
      expect(html).toContain("Mode Gelap");
    });

    it("harus merender GlassSegmented dengan role='tablist' dan role='tab'", () => {
      const html = renderToString(
        <GlassSegmented
          value="tab-1"
          onChange={vi.fn()}
          options={[
            { value: "tab-1", label: "Tab Satu" },
            { value: "tab-2", label: "Tab Dua" },
          ]}
        />
      );
      expect(html).toContain('role="tablist"');
      expect(html).toContain('role="tab"');
      expect(html).toContain('aria-selected="true"');
      expect(html).toContain("Tab Satu");
    });
  });

  describe("5. GlassSkeleton", () => {
    it("harus merender GlassSkeleton dengan atribut aria-hidden='true'", () => {
      const html = renderToString(<GlassSkeleton variant="card" />);
      expect(html).toContain('aria-hidden="true"');
      expect(html).toContain("rounded-2xl");
    });
  });

  describe("6. GlassToast", () => {
    it("harus merender daftar notifikasi toast dengan role='status' dan aria-live", () => {
      const html = renderToString(
        <GlassToast
          toasts={[
            {
              id: "t-1",
              type: "success",
              title: "Operasi Berhasil",
              message: "Data profil telah diperbarui",
            },
          ]}
          onDismiss={vi.fn()}
        />
      );
      expect(html).toContain('role="status"');
      expect(html).toContain('aria-live="polite"');
      expect(html).toContain("Operasi Berhasil");
      expect(html).toContain("Data profil telah diperbarui");
    });
  });

  describe("7. Navigasi Glass (GlassNav, GlassTabBar, GlassSidebar)", () => {
    it("harus merender GlassNav dengan aria-label='Navigasi Utama'", () => {
      const html = renderToString(<GlassNav />);
      expect(html).toContain('aria-label="Navigasi Utama"');
      expect(html).toContain("Beranda");
      expect(html).toContain("Jelajah");
    });

    it("harus merender GlassTabBar dengan aria-label='Navigasi Bawah Ponsel'", () => {
      const html = renderToString(<GlassTabBar />);
      expect(html).toContain('aria-label="Navigasi Bawah Ponsel"');
      expect(html).toContain("Kartu");
      expect(html).toContain("Profil");
    });

    it("harus merender GlassSidebar dengan menu kategori", () => {
      const html = renderToString(
        <GlassSidebar
          roleTitle="Admin"
          groups={[
            {
              title: "Pengawasan",
              items: [
                {
                  href: "/admin/verification",
                  label: "Verifikasi",
                  icon: () => null,
                  badge: 5,
                },
              ],
            },
          ]}
        />
      );
      expect(html).toContain('aria-label="Menu Samping"');
      expect(html).toContain("Area Admin");
      expect(html).toContain("Verifikasi");
      expect(html).toContain("5");
    });
  });
});
