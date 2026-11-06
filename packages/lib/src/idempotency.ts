import { createHash } from "crypto";

export interface IdempotencyRecord {
  key: string;
  response: unknown;
  status: "processing" | "completed" | "failed";
  createdAt: string;
  expiresAt: string;
}

/**
 * In-memory fallback idempotency store for serverless runs or test suites
 */
const inMemoryStore = new Map<string, IdempotencyRecord>();

/**
 * Menghasilkan kunci idempotensi berbasis hash deterministik dari parameter operasi
 */
export function generateDeterministicIdempotencyKey(scope: string, ...parts: unknown[]): string {
  const hash = createHash("sha256");
  hash.update(scope);
  for (const part of parts) {
    hash.update(JSON.stringify(part || ""));
  }
  return `${scope}-${hash.digest("hex").slice(0, 24)}`;
}

/**
 * Menjalankan operasi dengan jaminan Idempotensi:
 * Jika kunci sudah pernah dieksekusi dan berstatus 'completed', kembalikan hasil sebelumnya
 * tanpa menjalankan ulang mutasi bisnis.
 */
export async function withIdempotency<T>(
  key: string,
  operation: () => Promise<T>,
  ttlSeconds = 86400
): Promise<{ result: T; wasCached: boolean }> {
  const now = new Date();
  const existing = inMemoryStore.get(key);

  if (existing && new Date(existing.expiresAt) > now) {
    if (existing.status === "completed") {
      return { result: existing.response as T, wasCached: true };
    }
  }

  // Tandai processing
  const expiresAt = new Date(now.getTime() + ttlSeconds * 1000).toISOString();
  inMemoryStore.set(key, {
    key,
    response: null,
    status: "processing",
    createdAt: now.toISOString(),
    expiresAt,
  });

  try {
    const result = await operation();
    inMemoryStore.set(key, {
      key,
      response: result,
      status: "completed",
      createdAt: now.toISOString(),
      expiresAt,
    });
    return { result, wasCached: false };
  } catch (error) {
    inMemoryStore.delete(key);
    throw error;
  }
}
