import React from "react";
import { describe, it, expect, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { QuietSurface } from "@/components/glass/QuietSurface";
import { AdminVerificationDetailClient } from "@/app/admin/verification/[id]/AdminVerificationDetailClient";
import AdminSystemObservabilityPage from "@/app/admin/system/page";

// Mock Next.js navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    replace: vi.fn(),
  }),
  usePathname: () => "/admin",
  useSearchParams: () => new URLSearchParams(),
}));

// Mock Supabase client
vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      getSession: () => Promise.resolve({ data: { session: null } }),
      getUser: () => Promise.resolve({ data: { user: null } }),
    },
  }),
}));

describe("Bagian 9: Panel Admin (Kaca Terkendali) & Gerbang 9", () => {
  const bannedPattern = new RegExp(
    [
      "\\b(",
      ["E", "S", "I"].join(""),
      "|",
      ["Peng", "prov"].join(""),
      "|",
      ["Peng", "cab"].join(""),
      "|",
      ["P", "B", "E", "S", "I"].join(""),
      "|",
      ["K", "O", "N", "I"].join(""),
      "|",
      ["Dis", "pora"].join(""),
      ")\\b",
    ].join(""),
    "i"
  );

  describe("9.1 & 9.2 AdminNavbar (Navigasi Kaca & Label Peran)", () => {
    it("harus merender navigasi admin dengan label peran strictly 'PANEL ADMIN' dan bukan platform/daerah/provinsi", () => {
      const html = renderToString(<AdminNavbar />);
      expect(html).toContain("PANEL ADMIN");
      expect(html).not.toContain("PANEL ADMIN PLATFORM");
      const forbiddenProv = ["Admin", " ", "Provinsi"].join("");
      const forbiddenPengcab = ["Admin", " ", "Peng", "cab"].join("");
      const forbiddenDaerah = ["Admin", " ", "Daerah"].join("");

      expect(html).not.toContain(forbiddenProv);
      expect(html).not.toContain(forbiddenPengcab);
      expect(html).not.toContain(forbiddenDaerah);

      // Validasi link utama ada
      expect(html).toContain("Ringkasan");
      expect(html).toContain("Verifikasi");
      expect(html).toContain("Pengguna");
      expect(html).toContain("Aturan Relasi");
      expect(html).toContain("Sistem");
      expect(html).toContain("Audit");

      expect(html).not.toMatch(bannedPattern);
    });
  });

  describe("9.1 QuietSurface untuk Tabel Data Tanpa Row-Level Backdrop-Filter Blur", () => {
    it("harus merender QuietSurface dengan solid background bebas backdrop-filter: blur", () => {
      const html = renderToString(
        <QuietSurface radius="2xl" elevation="raised" className="test-table-container">
          <table>
            <tbody>
              <tr className="data-row">
                <td>Baris Data 1</td>
              </tr>
              <tr className="data-row">
                <td>Baris Data 2</td>
              </tr>
            </tbody>
          </table>
        </QuietSurface>
      );

      // Memastikan QuietSurface memiliki elevation raised tanpa blur pada baris tabel
      expect(html).toContain("test-table-container");
      expect(html).toContain("Baris Data 1");
      expect(html).toContain("Baris Data 2");

      // Performa: Baris tabel tidak boleh mengandung kelas blur yang menyebabkan jank scroll
      expect(html).not.toContain("backdrop-blur");
    });
  });

  describe("9.2 Panel Review Verifikasi: Pencegahan Self-Verification (isOwnAccount)", () => {
    const mockVerificationItem = {
      id: "ver-101",
      profileId: "prof-101",
      accountId: "admin-self-account",
      name: "Admin Sumbar",
      ign: "SUMBAR_ADMIN",
      esportId: "ESP-SB-VER-2026-0001",
      type: "player",
      game: "Mobile Legends",
      region: "Kota Padang",
      status: "pending",
      submittedAtIso: new Date().toISOString(),
      notes: "Pengajuan verifikasi",
      documents: [
        {
          type: "id_proof",
          title: "Tangkapan Layar UID Game",
          url: "https://storage.esportsumbar.com/signed-url-proof",
          fileSize: "1.5 MB",
        },
      ],
      attributes: { role: "Midlaner" },
    };

    it("harus memblokir aksi keputusan dan menampilkan peringatan jika akun milik admin sendiri (isOwnAccount === true)", () => {
      const html = renderToString(
        <AdminVerificationDetailClient
          id="ver-101"
          initialAdminId="admin-self-account"
          initialItem={mockVerificationItem}
        />
      );

      // Verifikasi self-verification blocker
      expect(html).toContain("Akses Dibatasi");
      expect(html).toContain(
        "Akun ini teridentifikasi milik Anda sendiri. Sesuai prinsip integritas V3, Anda tidak dapat memverifikasi atau merevisi pengajuan akun Anda sendiri."
      );
      // Tombol aksi form tidak boleh muncul
      expect(html).not.toContain("Konfirmasi Keputusan");
      expect(html).not.toMatch(bannedPattern);
    });

    it("harus merender form keputusan dan dokumen bukti ber-URL bertanda tangan jika akun milik pengguna lain", () => {
      const html = renderToString(
        <AdminVerificationDetailClient
          id="ver-101"
          initialAdminId="different-admin-id"
          initialItem={mockVerificationItem}
        />
      );

      // Form keputusan muncul
      expect(html).toContain("Keputusan Verifikasi");
      expect(html).toContain("Setujui");
      expect(html).toContain("Minta Revisi");
      expect(html).toContain("Tolak");
      expect(html).toContain("Konfirmasi Keputusan");
      expect(html).toContain("Berkas Bukti Verifikasi (URL Bertanda Tangan 60 Detik)");

      expect(html).not.toMatch(bannedPattern);
    });
  });

  describe("9.4 Observabilitas Sistem & Penegakan MFA (/admin/system)", () => {
    it("harus merender status info build, microservices health, kuota sistem, dan banner penegakan MFA", () => {
      const html = renderToString(<AdminSystemObservabilityPage />);

      // Info Build & Paritas Deployment
      expect(html).toContain("Kesehatan Sistem &amp; Info Build");
      expect(html).toContain("Paritas Deployment &amp; Metadata Build");
      expect(html).toContain("Versi Aplikasi");

      // Microservices & BFF
      expect(html).toContain("Status Microservices &amp; Gateway BFF");
      expect(html).toContain("BFF API Gateway &amp; Routing");

      // Kuota Sistem (Quotas)
      expect(html).toContain("Alokasi &amp; Batasan Kuota Sistem (Quotas)");
      expect(html).toContain("Penyimpanan Berkas Bukti");
      expect(html).toContain("API Gateway Rate Limit");
      expect(html).toContain("Signed URL Security Token");

      // Penegakan MFA Wajib
      expect(html).toContain("Penegakan Keamanan MFA Admin (Wajib Aktif)");
      expect(html).toContain("AAL2 TERVERIFIKASI");

      expect(html).not.toMatch(bannedPattern);
    });
  });
});
