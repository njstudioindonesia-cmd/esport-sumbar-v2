import { describe, it, expect, vi, beforeEach } from "vitest";
import { getEnv } from "../lib/env";

describe("Environment Variable Validator", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("harus mengembalikan konfigurasi default yang valid ketika dijalankan di development", () => {
    const env = getEnv();
    expect(env.NEXT_PUBLIC_SUPABASE_URL).toBeDefined();
    expect(env.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBeDefined();
    expect(env.NEXT_PUBLIC_SUPABASE_URL).toMatch(/^https?:\/\//);
  });
});
