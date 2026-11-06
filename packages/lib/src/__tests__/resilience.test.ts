import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  withTimeout,
  TimeoutError,
  withRetry,
  calculateRetryDelay,
  CircuitBreaker,
  CircuitBreakerOpenError,
  createResiliencePolicy,
  resetAllCircuitBreakers,
} from "../index";

describe("Resilience Engine (@esport-sumbar/lib/resilience)", () => {
  beforeEach(() => {
    resetAllCircuitBreakers();
    vi.restoreAllMocks();
  });

  // =========================================================================
  // 1. TIMEOUT
  // =========================================================================
  describe("withTimeout", () => {
    it("mengembalikan hasil jika operasi selesai sebelum batas waktu", async () => {
      const fastOp = () => Promise.resolve("sukses-cepat");
      const result = await withTimeout(fastOp, 500, "fastOp");
      expect(result).toBe("sukses-cepat");
    });

    it("melempar TimeoutError jika operasi memakan waktu lebih lama dari batas waktu", async () => {
      const slowOp = () => new Promise((resolve) => setTimeout(resolve, 300));
      await expect(withTimeout(slowOp, 50, "slowOp")).rejects.toThrow(TimeoutError);
    });
  });

  // =========================================================================
  // 2. RETRY DENGAN JITTER
  // =========================================================================
  describe("withRetry & calculateRetryDelay", () => {
    it("menghitung delay eksponensial dalam batas maxDelayMs", () => {
      const delay1 = calculateRetryDelay(1, 100, 1000, 2, "none");
      expect(delay1).toBe(100);

      const delay2 = calculateRetryDelay(2, 100, 1000, 2, "none");
      expect(delay2).toBe(200);

      const delay3 = calculateRetryDelay(3, 100, 1000, 2, "none");
      expect(delay3).toBe(400);

      const delayCapped = calculateRetryDelay(10, 100, 1000, 2, "none");
      expect(delayCapped).toBe(1000);
    });

    it("menghasilkan full jitter antara 0 dan capped delay", () => {
      for (let i = 0; i < 20; i++) {
        const delay = calculateRetryDelay(3, 100, 1000, 2, "full");
        expect(delay).toBeGreaterThanOrEqual(0);
        expect(delay).toBeLessThanOrEqual(400);
      }
    });

    it("berhasil setelah retry jika kegagalan bersifat sementara (transient)", async () => {
      let attempts = 0;
      const unstableOp = async () => {
        attempts++;
        if (attempts < 3) {
          throw new Error("Jaringan terputus sementara");
        }
        return "terhubung";
      };

      const result = await withRetry(unstableOp, {
        maxAttempts: 3,
        baseDelayMs: 10,
        jitter: "none",
      });

      expect(result).toBe("terhubung");
      expect(attempts).toBe(3);
    });

    it("tidak me-retry jika status galat adalah 400 Bad Request", async () => {
      let attempts = 0;
      const clientErrorOp = async () => {
        attempts++;
        const err: any = new Error("Data tidak valid");
        err.status = 400;
        throw err;
      };

      await expect(
        withRetry(clientErrorOp, { maxAttempts: 4, baseDelayMs: 10 })
      ).rejects.toThrow("Data tidak valid");

      expect(attempts).toBe(1); // Langsung berhenti, tidak membuang resource untuk retry
    });
  });

  // =========================================================================
  // 3. CIRCUIT BREAKER
  // =========================================================================
  describe("CircuitBreaker State Machine", () => {
    it("memulai dalam kondisi CLOSED dan mengeksekusi secara normal", async () => {
      const cb = new CircuitBreaker({ name: "test-cb-1" });
      expect(cb.getState()).toBe("CLOSED");

      const result = await cb.execute(() => Promise.resolve("ok"));
      expect(result).toBe("ok");
      expect(cb.getState()).toBe("CLOSED");
    });

    it("berpindah ke OPEN setelah kegagalan mencapai ambang batas (failureThreshold)", async () => {
      const cb = new CircuitBreaker({
        name: "test-cb-2",
        failureThreshold: 3,
        recoveryTimeoutMs: 1000,
      });

      const failingOp = () => Promise.reject(new Error("Downstream service crash"));

      // 3x gagal
      for (let i = 0; i < 3; i++) {
        await expect(cb.execute(failingOp)).rejects.toThrow("Downstream service crash");
      }

      // Sekarang status harus OPEN
      expect(cb.getState()).toBe("OPEN");

      // Panggilan ke-4 langsung ditolak oleh pemutus sirkuit tanpa memanggil failingOp
      await expect(cb.execute(failingOp)).rejects.toThrow(CircuitBreakerOpenError);
    });

    it("menjalankan fallback saat sirkuit dalam keadaan OPEN", async () => {
      const cb = new CircuitBreaker({
        name: "test-cb-3",
        failureThreshold: 2,
        recoveryTimeoutMs: 1000,
      });

      // Picu circuit terbuka
      await expect(cb.execute(() => Promise.reject(new Error("fail-1")))).rejects.toThrow();
      await expect(cb.execute(() => Promise.reject(new Error("fail-2")))).rejects.toThrow();
      expect(cb.getState()).toBe("OPEN");

      // Jalankan dengan fallback
      const fallbackResult = await cb.execute(
        () => Promise.reject(new Error("should not be called")),
        (err) => {
          expect(err).toBeInstanceOf(CircuitBreakerOpenError);
          return "fallback-data-aman";
        }
      );

      expect(fallbackResult).toBe("fallback-data-aman");
    });

    it("dapat di-reset secara manual", () => {
      const cb = new CircuitBreaker({ name: "test-cb-4" });
      cb.trip();
      expect(cb.getState()).toBe("OPEN");

      cb.reset();
      expect(cb.getState()).toBe("CLOSED");
    });
  });

  // =========================================================================
  // 4. UNIFIED RESILIENCE POLICY
  // =========================================================================
  describe("ResiliencePolicy (Timeout + Retry + Circuit Breaker + Fallback)", () => {
    it("menyediakan degradasi anggun (fallback) saat downstream service mati", async () => {
      const policy = createResiliencePolicy({
        name: "notification-policy",
        timeoutMs: 100,
        retry: { maxAttempts: 2, baseDelayMs: 10 },
        circuitBreaker: { failureThreshold: 2 },
      });

      const failingExternalApi = async () => {
        throw new Error("Gateway Timeout 504");
      };

      // Panggilan pertama gagal retry, lalu fallback dijalankan
      const result = await policy.execute(failingExternalApi, (err) => {
        return { success: false, queuedForLater: true, reason: err.message };
      });

      expect(result).toEqual({
        success: false,
        queuedForLater: true,
        reason: "Gateway Timeout 504",
      });
    });
  });
});
