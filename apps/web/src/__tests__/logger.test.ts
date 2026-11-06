import { describe, it, expect, vi } from "vitest";
import { logger } from "@esport-sumbar/lib";

describe("Structured JSON Logger", () => {
  it("harus menyamarkan (redact) password dan token sensitif dari log context", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    logger.info("Pengguna melakukan autentikasi", {
      userId: "usr-123",
      password: "SuperSecretPassword123!",
      token: "jwt-token-string",
      safeInfo: "informasi-aman",
    });

    expect(consoleSpy).toHaveBeenCalledOnce();
    const logCallArg = consoleSpy.mock.calls[0][0];
    const parsedLog = JSON.parse(logCallArg);

    expect(parsedLog.level).toBe("INFO");
    expect(parsedLog.userId).toBe("usr-123");
    expect(parsedLog.password).toBe("[REDACTED]");
    expect(parsedLog.token).toBe("[REDACTED]");
    expect(parsedLog.safeInfo).toBe("informasi-aman");

    consoleSpy.mockRestore();
  });
});
