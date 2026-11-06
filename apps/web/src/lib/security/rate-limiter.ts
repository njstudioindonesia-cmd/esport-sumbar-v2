import { NextRequest, NextResponse } from "next/server";

export type RateLimitTier = "public" | "authenticated" | "admin" | "sensitive";

interface RateLimitConfig {
  limit: number;
  windowMs: number;
}

const TIER_CONFIGS: Record<RateLimitTier, RateLimitConfig> = {
  public: { limit: 120, windowMs: 60 * 1000 },       // 120 req / menit
  authenticated: { limit: 60, windowMs: 60 * 1000 }, // 60 req / menit
  admin: { limit: 120, windowMs: 60 * 1000 },        // 120 req / menit
  sensitive: { limit: 15, windowMs: 60 * 1000 },     // 15 req / menit (login, submit verifikasi)
};

interface WindowEntry {
  timestamps: number[];
}

// In-memory sliding window store
const rateLimitStore = new Map<string, WindowEntry>();

// Pembersihan rutin setiap 5 menit agar memori tetap optimal
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupExpiredEntries(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;

  for (const [key, entry] of rateLimitStore.entries()) {
    const valid = entry.timestamps.filter((ts) => now - ts < windowMs);
    if (valid.length === 0) {
      rateLimitStore.delete(key);
    } else {
      entry.timestamps = valid;
    }
  }
}

/**
 * Mendapatkan identitas klien (IP Address atau User ID)
 */
export function getClientIdentifier(request: NextRequest, userId?: string): string {
  if (userId) return `user:${userId}`;

  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return `ip:${forwarded.split(",")[0].trim()}`;
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return `ip:${realIp.trim()}`;

  return "ip:unknown-client";
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetTime: number; // Unix timestamp in seconds
}

/**
 * Mengecek dan mencatat batasan laju untuk pengidentifikasi tertentu.
 */
export function checkRateLimit(
  identifier: string,
  tier: RateLimitTier = "public",
  now: number = Date.now()
): RateLimitResult {
  const config = TIER_CONFIGS[tier];
  cleanupExpiredEntries(config.windowMs);

  const key = `${tier}:${identifier}`;
  let entry = rateLimitStore.get(key);

  if (!entry) {
    entry = { timestamps: [] };
    rateLimitStore.set(key, entry);
  }

  // Saring hanya timestamp dalam jendela aktif
  entry.timestamps = entry.timestamps.filter((ts) => now - ts < config.windowMs);

  const resetTime = Math.ceil((now + config.windowMs) / 1000);

  if (entry.timestamps.length >= config.limit) {
    const oldest = entry.timestamps[0];
    const actualReset = Math.ceil((oldest + config.windowMs) / 1000);
    return {
      allowed: false,
      limit: config.limit,
      remaining: 0,
      resetTime: actualReset,
    };
  }

  entry.timestamps.push(now);
  const remaining = Math.max(0, config.limit - entry.timestamps.length);

  return {
    allowed: true,
    limit: config.limit,
    remaining,
    resetTime,
  };
}

/**
 * Mereset store rate limiting (berguna untuk pengujian unit).
 */
export function resetRateLimitStore() {
  rateLimitStore.clear();
}

/**
 * Helper middleware rate limiting untuk route handlers.
 * Mengembalikan NextResponse 429 jika melampaui batas, atau null jika lolos.
 */
export function enforceRateLimit(
  request: NextRequest,
  tier: RateLimitTier = "public",
  userId?: string
): NextResponse | null {
  const identifier = getClientIdentifier(request, userId);
  const result = checkRateLimit(identifier, tier);

  if (!result.allowed) {
    const retryAfter = Math.max(1, result.resetTime - Math.floor(Date.now() / 1000));
    return NextResponse.json(
      {
        success: false,
        error: "Terlalu banyak permintaan (Too Many Requests). Silakan coba beberapa saat lagi.",
        retryAfter,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfter),
          "X-RateLimit-Limit": String(result.limit),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(result.resetTime),
        },
      }
    );
  }

  return null;
}
