import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET as getVersion } from "../app/api/v1/system/version/route";
import { GET as getHealth } from "../app/api/v1/system/health/route";
import { POST as registerDeviceToken } from "../app/api/v1/auth/device-token/route";
import { POST as submitReport } from "../app/api/v1/reports/route";
import { NextRequest } from "next/server";
import { SystemVersionSchema, ServiceHealthSchema } from "@esport-sumbar/contracts";

describe("Mobile V1 BFF API Endpoints & Contracts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("1. GET /api/v1/system/version", () => {
    it("harus mengembalikan versi aplikasi minimum dan status maintenance yang valid", async () => {
      const req = new NextRequest("http://localhost:3000/api/v1/system/version");
      const res = await getVersion(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data).toBeDefined();

      const parseResult = SystemVersionSchema.safeParse(json.data);
      expect(parseResult.success).toBe(true);
      expect(json.data.minVersion).toBe("1.0.0");
      expect(json.data.forceUpdate).toBe(false);
      expect(json.data.maintenance).toBe(false);
    });
  });

  describe("2. GET /api/v1/system/health", () => {
    it("harus mengembalikan kesiapan layanan dan status basis data yang valid", async () => {
      const req = new NextRequest("http://localhost:3000/api/v1/system/health");
      const res = await getHealth(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);

      const parseResult = ServiceHealthSchema.safeParse(json.data);
      expect(parseResult.success).toBe(true);
      expect(["UP", "DEGRADED"]).toContain(json.data.status);
      expect(json.data.services.database).toBeDefined();
    });
  });

  describe("3. POST /api/v1/auth/device-token", () => {
    it("harus menolak request tanpa body atau token yang tidak valid", async () => {
      const req = new NextRequest("http://localhost:3000/api/v1/auth/device-token", {
        method: "POST",
        body: JSON.stringify({ token: "pendek", platform: "android" }),
        headers: { "Content-Type": "application/json" },
      });
      const res = await registerDeviceToken(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.success).toBe(false);
      expect(json.error.code).toBe("VALIDATION_ERROR");
    });

    it("harus menerima token perangkat dengan skema yang valid", async () => {
      const req = new NextRequest("http://localhost:3000/api/v1/auth/device-token", {
        method: "POST",
        body: JSON.stringify({
          token: "fcm-valid-device-token-1234567890-test",
          platform: "android",
          deviceId: "device-test-uuid",
        }),
        headers: { "Content-Type": "application/json" },
      });
      const res = await registerDeviceToken(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data.registered).toBe(true);
    });
  });

  describe("4. POST /api/v1/reports (UGC Safety)", () => {
    it("harus menolak laporan tanpa data kategori atau alasan", async () => {
      const req = new NextRequest("http://localhost:3000/api/v1/reports", {
        method: "POST",
        body: JSON.stringify({ targetType: "profile" }),
        headers: { "Content-Type": "application/json" },
      });
      const res = await submitReport(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.success).toBe(false);
    });

    it("harus berhasil menerima laporan konten yang memenuhi validasi", async () => {
      const req = new NextRequest("http://localhost:3000/api/v1/reports", {
        method: "POST",
        body: JSON.stringify({
          targetType: "profile",
          targetId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
          category: "spam",
          reason: "Akun ini mengirimkan pesan promosi berulang tanpa izin.",
        }),
        headers: { "Content-Type": "application/json" },
      });
      const res = await submitReport(req);
      const json = await res.json();

      expect(res.status).toBe(201);
      expect(json.success).toBe(true);
      expect(json.data.reported).toBe(true);
    });
  });
});
