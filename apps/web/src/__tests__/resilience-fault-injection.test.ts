import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  CircuitBreaker,
  CircuitBreakerOpenError,
  createResiliencePolicy,
  getCircuitBreaker,
  resetAllCircuitBreakers,
  getAllCircuitBreakerStats,
} from "@esport-sumbar/lib";
import { GET as healthzGET } from "../app/api/healthz/route";
import { GET as readyzGET } from "../app/api/readyz/route";
import { GET as observabilityGET, POST as observabilityPOST } from "../app/api/admin/observability/route";
import { notificationResiliencePolicy } from "../lib/services/notifications/service";
import { mediaResiliencePolicy } from "../lib/services/media";
import { directoryResiliencePolicy } from "../lib/services/directory/service";
import { NextRequest } from "next/server";
import { issueServiceToken } from "../lib/auth/service-token";

describe("Sub-langkah 7.8: Ketahanan & Observabilitas (Fault Injection & Resilience)", () => {
  beforeEach(() => {
    resetAllCircuitBreakers();
    vi.restoreAllMocks();
  });

  // =========================================================================
  // 1. FAULT INJECTION: NOTIFICATION SERVICE DOWNSTREAM FAILURE
  // =========================================================================
  describe("Downstream Failure & Circuit Breaker Tripping", () => {
    it("menolak eksekusi downstream saat circuit breaker terbuka dan beralih ke degradasi anggun", async () => {
      let callCount = 0;
      const downstreamCrashOp = async () => {
        callCount++;
        throw new Error("Downstream Email Provider Connection Refused (ECONNREFUSED)");
      };

      // 4 kegagalan berturut-turut untuk memicu circuit breaker OPEN
      for (let i = 0; i < 4; i++) {
        const res = await notificationResiliencePolicy.execute(downstreamCrashOp, (err) => ({
          success: false,
          fallbackTriggered: true,
          error: err.message,
        }));
        expect(res.success).toBe(false);
      }

      // Pastikan status circuit breaker sekarang OPEN
      const cb = getCircuitBreaker("notification-service");
      expect(cb?.getState()).toBe("OPEN");

      const beforeCalls = callCount;

      // Panggilan berikutnya harus langsung ditolak oleh pemutus sirkuit tanpa memanggil downstreamCrashOp
      const shortCircuitRes = await notificationResiliencePolicy.execute(
        downstreamCrashOp,
        (err) => ({
          success: false,
          shortCircuited: true,
          circuitState: "OPEN",
          error: err.message,
        })
      );

      expect(shortCircuitRes.shortCircuited).toBe(true);
      expect(shortCircuitRes.circuitState).toBe("OPEN");
      // Panggilan downstream tidak bertambah karena circuit breaker memblokir eksekusi
      expect(callCount).toBe(beforeCalls);
    });
  });

  // =========================================================================
  // 2. HEALTH PROBES: LIVENESS (/api/healthz) & READINESS (/api/readyz)
  // =========================================================================
  describe("Liveness & Readiness Health Probes", () => {
    it("Liveness Probe (/api/healthz) mengembalikan status healthy dan informasi proses", async () => {
      const response = await healthzGET();
      expect(response.status).toBe(200);

      const json = await response.json();
      expect(json.status).toBe("healthy");
      expect(json.service).toBe("esport-sumbar-web");
      expect(json.version).toBe("3.0.0");
      expect(json.uptimeSeconds).toBeGreaterThanOrEqual(0);
      expect(json.memory).toBeDefined();
      expect(json.memory.heapUsedMB).toBeGreaterThan(0);
    });

    it("Readiness Probe (/api/readyz) mengembalikan status ready saat semua dependensi sehat", async () => {
      const response = await readyzGET();
      expect(response.status).toBe(200);

      const json = await response.json();
      expect(["ready", "degraded"]).toContain(json.status);
      expect(json.services).toBeDefined();
      expect(json.services.database).toBeDefined();
      expect(json.services.directory).toBeDefined();
      expect(json.services.notifications).toBeDefined();
      expect(json.services.media).toBeDefined();
    });

    it("Readiness Probe (/api/readyz) melaporkan status degraded saat circuit breaker notifikasi OPEN", async () => {
      // Picu circuit breaker notifikasi menjadi OPEN (simulasi kegagalan layanan notifikasi)
      const notifCb = getCircuitBreaker("notification-service");
      notifCb?.trip();
      expect(notifCb?.getState()).toBe("OPEN");

      const response = await readyzGET();
      // HTTP status tetap 200 karena sistem menerapkan degradasi anggun (tidak crash)
      expect(response.status).toBe(200);

      const json = await response.json();
      expect(json.status).toBe("degraded");
      expect(json.services.notifications.status).toBe("DEGRADED");
    });
  });

  // =========================================================================
  // 3. ADMIN OBSERVABILITY & CIRCUIT BREAKER CONTROL
  // =========================================================================
  describe("Admin Observability Endpoint (/api/admin/observability)", () => {
    it("mengembalikan metrik dan status circuit breaker untuk platform_admin", async () => {
      const serviceToken = issueServiceToken("admin-monitor", ["observability:read"]);
      const req = new NextRequest("http://localhost:3000/api/admin/observability", {
        headers: { "x-service-token": serviceToken },
      });

      const response = await observabilityGET(req);
      expect(response.status).toBe(200);

      const json = await response.json();
      expect(json.success).toBe(true);
      expect(json.data.http).toBeDefined();
      expect(json.data.memory).toBeDefined();
      expect(Array.isArray(json.data.circuitBreakers)).toBe(true);
    });

    it("mengizinkan admin me-reset circuit breaker melalui POST action", async () => {
      const cb = getCircuitBreaker("notification-service");
      cb?.trip();
      expect(cb?.getState()).toBe("OPEN");

      const serviceToken = issueServiceToken("admin-control", ["observability:write"]);
      const req = new NextRequest("http://localhost:3000/api/admin/observability", {
        method: "POST",
        headers: {
          "x-service-token": serviceToken,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          action: "reset_circuit_breaker",
          name: "notification-service",
        }),
      });

      const response = await observabilityPOST(req);
      expect(response.status).toBe(200);

      const json = await response.json();
      expect(json.success).toBe(true);
      expect(cb?.getState()).toBe("CLOSED");
    });

    it("mengizinkan admin memicu kill-switch (trip_circuit_breaker) untuk pemeliharaan", async () => {
      expect(mediaResiliencePolicy.circuitBreaker).toBeDefined();
      const cb = getCircuitBreaker("media-service");
      expect(cb?.getState()).toBe("CLOSED");

      const serviceToken = issueServiceToken("admin-control", ["observability:write"]);
      const req = new NextRequest("http://localhost:3000/api/admin/observability", {
        method: "POST",
        headers: {
          "x-service-token": serviceToken,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          action: "trip_circuit_breaker",
          name: "media-service",
        }),
      });

      const response = await observabilityPOST(req);
      expect(response.status).toBe(200);

      const json = await response.json();
      expect(json.success).toBe(true);
      expect(cb?.getState()).toBe("OPEN");
    });
  });
});
