import React from "react";
import { describe, it, expect, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { AdminNavbar } from "@admin/components/AdminNavbar";
import AdminDashboardPage from "@admin/app/page";
import AdminSystemStatusPage from "@admin/app/system/page";
import AdminVerificationPage from "@admin/app/verification/page";
import { AdminUserDetailClient } from "@admin/app/users/[id]/AdminUserDetailClient";
import { transitionVerificationAction } from "@admin/app/actions/verification";

// Mock Next.js navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    replace: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

// Mock Supabase server clients
vi.mock("@/lib/supabase/server", () => {
  const mockFrom = vi.fn().mockImplementation((table: string) => {
    if (table === "verification_requests") {
      return {
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: {
                id: "req-self-1",
                profile_id: "prof-self-1",
                status: "pending",
                profiles: {
                  id: "prof-self-1",
                  account_id: "admin-user-123",
                },
              },
              error: null,
            }),
          }),
        }),
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: null }),
        }),
      };
    }
    return {
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: null, error: null }),
        }),
      }),
      insert: vi.fn().mockResolvedValue({ error: null }),
    };
  });

  return {
    createClient: vi.fn().mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: "admin-user-123" } },
        }),
      },
    }),
    createAdminClient: vi.fn().mockReturnValue({
      from: mockFrom,
      rpc: vi.fn().mockResolvedValue({ data: null, error: null }),
    }),
  };
});

describe("Apps/Admin: Portal Deployment Tests (ADR 002 & Bagian 11)", () => {
  it("AdminNavbar merender navigasi dengan identitas resmi dan status host-only", () => {
    const html = renderToString(<AdminNavbar />);
    expect(html).toContain("ESPORT SUMBAR");
    expect(html).toContain("PORTAL ADMIN");
    expect(html).toContain("Ringkasan");
    expect(html).toContain("Verifikasi");
    expect(html).toContain("Pengguna");
    expect(html).toContain("Sesi Host-Only");
  });

  it("AdminDashboardPage merender metrik operasional bersih tanpa data dummy", () => {
    const html = renderToString(<AdminDashboardPage />);
    expect(html).toContain("Ringkasan Operasional Platform");
    expect(html).toContain("Antrean Verifikasi");
    expect(html).toContain("Profil Terverifikasi");
    expect(html).toContain("Artikel Warta Terbit");
    expect(html).toContain("Sistem Staging Aktif");
  });

  it("AdminSystemStatusPage merender pemantauan infrastruktur", () => {
    const html = renderToString(<AdminSystemStatusPage />);
    expect(html).toContain("Kesehatan Sistem");
    expect(html).toContain("BFF API Gateway &amp; Routing");
    expect(html).toContain("Supabase Auth &amp; Session Guard");
    expect(html).toContain("Audit Trail Cryptographic Ledger");
  });

  it("AdminVerificationPage merender tabel antrean verifikasi", () => {
    const html = renderToString(<AdminVerificationPage />);
    expect(html).toContain("Antrean Verifikasi Profil");
    expect(html).toContain("VERIFIKASI SATU TAHAP");
    expect(html).toContain("ESPORT SUMBAR TUNGGAL");
  });

  it("AdminUserDetailClient merender state loading/not found tanpa data dummy sample", () => {
    const html = renderToString(<AdminUserDetailClient id="non-existent-user" />);
    expect(html).toContain("Kembali ke Direktori Pengguna");
    expect(html).not.toContain("MINANG_SNIPER");
    expect(html).not.toContain("Rahmat Hidayat");
  });

  it("transitionVerificationAction mencegah admin memverifikasi akunnya sendiri (Integritas 11.2)", async () => {
    const result = await transitionVerificationAction({
      requestId: "req-self-1",
      newStatus: "verified",
      reason: "Disetujui",
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain("Administrator dilarang memverifikasi atau mengubah status akun miliknya sendiri");
  });
});
