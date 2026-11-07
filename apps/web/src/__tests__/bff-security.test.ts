import { describe, it, expect, beforeEach, vi } from "vitest";
import { issueServiceToken, verifyServiceToken } from "../lib/auth/service-token";
import {
  checkRateLimit,
  enforceRateLimit,
  resetRateLimitStore,
  getClientIdentifier,
} from "../lib/security/rate-limiter";
import {
  isOriginAllowed,
  applyCorsHeaders,
  handleCorsPreflight,
  getAllowedOrigins,
} from "../lib/security/cors";
import { verifyAuthContext, verifyAdminAuth } from "../lib/auth/api-guard";
import { NextRequest, NextResponse } from "next/server";

describe("Sub-langkah 7.7: BFF & Eliminasi Akses Langsung Database dari Web", () => {
  beforeEach(() => {
    resetRateLimitStore();
    vi.restoreAllMocks();
  });

  // =========================================================================
  // 1. UJI TOKEN LAYANAN ANTAR-LAYANAN BERUMUR PENDEK (5 MENIT)
  // =========================================================================
  describe("Inter-Service Tokens (HMAC-SHA256 Short-Lived)", () => {
    it("menghasilkan dan memverifikasi token layanan internal yang valid", () => {
      const token = issueServiceToken("verification-service", ["verification:write"]);
      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token.split(".").length).toBe(3);

      const result = verifyServiceToken(token);
      expect(result.valid).toBe(true);
      expect(result.payload?.sub).toBe("verification-service");
      expect(result.payload?.iss).toBe("esportsumbar-bff");
      expect(result.payload?.aud).toBe("esportsumbar-internal");
      expect(result.payload?.scopes).toContain("verification:write");
      expect(result.payload?.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
    });

    it("menolak token yang tanda tangannya telah dimanipulasi (tampered)", () => {
      const token = issueServiceToken("media-service");
      const [header, payload, sig] = token.split(".");
      // Modifikasi payload base64url
      const tamperedToken = `${header}.${payload}tampered.${sig}`;

      const result = verifyServiceToken(tamperedToken);
      expect(result.valid).toBe(false);
      expect(result.error).toMatch(/tidak valid|signature mismatch|rusak/i);
    });

    it("menolak token yang kedaluwarsa (expired token rejection)", () => {
      // Buat token dengan TTL -10 detik
      const expiredToken = issueServiceToken("catalog-service", ["catalog:read"], -10);
      const result = verifyServiceToken(expiredToken);
      expect(result.valid).toBe(false);
      expect(result.error).toMatch(/kedaluwarsa/i);
    });

    it("menolak token dengan rahasia penandatangan yang salah", () => {
      const token = issueServiceToken("directory-service", ["directory:read"], 300, "secret-a");
      const result = verifyServiceToken(token, "secret-b");
      expect(result.valid).toBe(false);
      expect(result.error).toMatch(/tidak valid|signature mismatch/i);
    });
  });

  // =========================================================================
  // 2. UJI BATAS LAJU (RATE LIMITING)
  // =========================================================================
  describe("API Rate Limiting (Sliding Window)", () => {
    it("mengizinkan permintaan dalam batas kuota yang ditentukan", () => {
      const ip = "192.168.1.10";
      const res1 = checkRateLimit(ip, "public");
      expect(res1.allowed).toBe(true);
      expect(res1.limit).toBe(120);
      expect(res1.remaining).toBe(119);

      const res2 = checkRateLimit(ip, "public");
      expect(res2.allowed).toBe(true);
      expect(res2.remaining).toBe(118);
    });

    it("menolak permintaan dan mengembalikan status 429 jika kuota terlampaui", () => {
      const sensitiveIp = "10.0.0.5";
      // Kuota sensitive = 15 req/menit
      for (let i = 0; i < 15; i++) {
        const res = checkRateLimit(sensitiveIp, "sensitive");
        expect(res.allowed).toBe(true);
      }

      // Permintaan ke-16 harus ditolak
      const breachRes = checkRateLimit(sensitiveIp, "sensitive");
      expect(breachRes.allowed).toBe(false);
      expect(breachRes.remaining).toBe(0);
      expect(breachRes.resetTime).toBeGreaterThan(0);
    });

    it("mengembalikan respons HTTP 429 dengan header Retry-After dan X-RateLimit", () => {
      const req = new NextRequest("http://localhost:3000/api/auth/reset-password", {
        headers: { "x-forwarded-for": "203.0.113.195" },
      });

      // Habiskan kuota sensitive (15x)
      for (let i = 0; i < 15; i++) {
        enforceRateLimit(req, "sensitive");
      }

      // Panggilan ke-16 harus memicu respons 429
      const blockedRes = enforceRateLimit(req, "sensitive");
      expect(blockedRes).not.toBeNull();
      expect(blockedRes?.status).toBe(429);
      expect(blockedRes?.headers.get("Retry-After")).toBeDefined();
      expect(blockedRes?.headers.get("X-RateLimit-Limit")).toBe("15");
      expect(blockedRes?.headers.get("X-RateLimit-Remaining")).toBe("0");
    });
  });

  // =========================================================================
  // 3. UJI CORS KETAT (STRICT CORS & PREFLIGHT)
  // =========================================================================
  describe("Strict CORS Policy", () => {
    it("mengenali origin yang valid dan menolak origin sembarangan", () => {
      expect(isOriginAllowed("http://localhost:3000")).toBe(true);
      expect(isOriginAllowed("http://127.0.0.1:3000")).toBe(true);
      expect(isOriginAllowed("https://hacker-site.evil.com")).toBe(false);
      expect(isOriginAllowed(null)).toBe(false);
    });

    it("menerapkan header CORS khusus origin terdaftar tanpa menggunakan wildcard '*'", () => {
      const req = new NextRequest("http://localhost:3000/api/games", {
        headers: { origin: "http://localhost:3000" },
      });
      const originalRes = NextResponse.json({ success: true });
      const modifiedRes = applyCorsHeaders(originalRes, req);

      expect(modifiedRes.headers.get("Access-Control-Allow-Origin")).toBe("http://localhost:3000");
      expect(modifiedRes.headers.get("Access-Control-Allow-Credentials")).toBe("true");
      expect(modifiedRes.headers.get("Access-Control-Allow-Origin")).not.toBe("*");
    });

    it("tidak menambahkan header CORS untuk origin yang tidak terdaftar", () => {
      const req = new NextRequest("http://localhost:3000/api/games", {
        headers: { origin: "https://unknown-domain.org" },
      });
      const originalRes = NextResponse.json({ success: true });
      const modifiedRes = applyCorsHeaders(originalRes, req);

      expect(modifiedRes.headers.get("Access-Control-Allow-Origin")).toBeNull();
    });

    it("menangani preflight OPTIONS dengan status 204 No Content untuk origin terdaftar", () => {
      const preflightReq = new NextRequest("http://localhost:3000/api/admin/games", {
        method: "OPTIONS",
        headers: { origin: "http://localhost:3000" },
      });

      const res = handleCorsPreflight(preflightReq);
      expect(res.status).toBe(204);
      expect(res.headers.get("Access-Control-Allow-Origin")).toBe("http://localhost:3000");
      expect(res.headers.get("Access-Control-Allow-Methods")).toContain("GET, POST");
    });

    it("menolak preflight OPTIONS dengan status 403 untuk origin berbahaya", () => {
      const maliciousPreflight = new NextRequest("http://localhost:3000/api/admin/games", {
        method: "OPTIONS",
        headers: { origin: "https://attack-origin.ru" },
      });

      const res = handleCorsPreflight(maliciousPreflight);
      expect(res.status).toBe(403);
    });
  });

  // =========================================================================
  // 4. UJI OTENTIKASI API GUARD DENGAN SERVICE TOKEN
  // =========================================================================
  describe("BFF API Guard (Auth Context & Inter-Service)", () => {
    it("menerima request ber-header X-Service-Token dan menetapkan peran platform_admin", async () => {
      const serviceToken = issueServiceToken("admin-worker", ["all"]);
      const req = new NextRequest("http://localhost:3000/api/admin/games", {
        headers: { "x-service-token": serviceToken },
      });

      const { auth, errorResponse } = await verifyAuthContext(req);
      expect(errorResponse).toBeNull();
      expect(auth).not.toBeNull();
      expect(auth?.isServiceToken).toBe(true);
      expect(auth?.userId).toBe("admin-worker");
      expect(auth?.isPlatformAdmin).toBe(true);
      expect(auth?.role).toBe("platform_admin");
    });

    it("menolak request jika token layanan rusak atau salah", async () => {
      const req = new NextRequest("http://localhost:3000/api/admin/games", {
        headers: { "x-service-token": "invalid.bogus.token" },
      });

      const { auth, errorResponse } = await verifyAuthContext(req);
      expect(auth).toBeNull();
      expect(errorResponse).not.toBeNull();
      expect(errorResponse?.status).toBe(401);
    });

    it("menolak verifikasi admin jika token tidak ada dan sesi tidak aktif", async () => {
      const req = new NextRequest("http://localhost:3000/api/admin/games");
      const { auth, errorResponse } = await verifyAdminAuth(["platform_admin"], req);

      expect(auth).toBeNull();
      expect(errorResponse).not.toBeNull();
      expect(errorResponse?.status).toBe(401);
    });
  });

  // =========================================================================
  // 5. UJI ISOLASI KLIEN (ZERO DIRECT DB & ZERO SERVICE ROLE KEY)
  // =========================================================================
  describe("Client Database Isolation Verification", () => {
    it("memastikan skrip verifikasi isolasi basis data klien berjalan sukses", () => {
      const cp = require("child_process");
      const result = cp.spawnSync("node", ["scripts/verify-client-db-isolation.js"], {
        encoding: "utf8",
      });

      expect(result.status).toBe(0);
      expect(result.stdout).toContain("Nol kueri langsung basis data (.from)");
      expect(result.stdout).toContain("Nol referensi SUPABASE_SERVICE_ROLE_KEY");
    });
  });
});
