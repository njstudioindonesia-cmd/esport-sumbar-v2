/**
 * ESPORT SUMBAR V2 - Server-Side Rate Limiter
 * Mencegah serangan brute-force pada endpoint autentikasi (login, register, reset password)
 * Menggunakan memori in-memory sliding window dengan pembersihan otomatis
 */

interface RateLimitRecord {
  attempts: number;
  firstAttemptAt: number;
  blockedUntil?: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Pembersihan berkala setiap 10 menit untuk mencegah memory leak
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      if (record.blockedUntil && now > record.blockedUntil) {
        rateLimitStore.delete(key);
      } else if (now - record.firstAttemptAt > 30 * 60 * 1000) {
        rateLimitStore.delete(key);
      }
    }
  }, 10 * 60 * 1000);
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

/**
 * Memeriksa apakah suatu identitas (IP / Email) diizinkan melakukan percobaan
 * @param key Identitas unik (mis. `login:user@example.com` atau `ip:127.0.0.1`)
 * @param maxAttempts Batas maksimum percobaan gagal (default: 5 kali)
 * @param windowMs Rentang waktu jendela pemantauan (default: 15 menit)
 * @param blockDurationMs Durasi pemblokiran jika batas terlampaui (default: 15 menit)
 */
export function checkRateLimit(
  key: string,
  maxAttempts: number = 5,
  windowMs: number = 15 * 60 * 1000,
  blockDurationMs: number = 15 * 60 * 1000
): RateLimitResult {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record) {
    return {
      allowed: true,
      remaining: maxAttempts,
      retryAfterSeconds: 0,
    };
  }

  // Jika sedang dalam masa blokir
  if (record.blockedUntil && now < record.blockedUntil) {
    const retryAfterSeconds = Math.ceil((record.blockedUntil - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds,
    };
  }

  // Jika jendela waktu sudah lewat, reset counter
  if (now - record.firstAttemptAt > windowMs) {
    rateLimitStore.delete(key);
    return {
      allowed: true,
      remaining: maxAttempts,
      retryAfterSeconds: 0,
    };
  }

  const remaining = Math.max(0, maxAttempts - record.attempts);
  return {
    allowed: record.attempts < maxAttempts,
    remaining,
    retryAfterSeconds: 0,
  };
}

/**
 * Mencatat kegagalan percobaan login
 */
export function recordFailedAttempt(
  key: string,
  maxAttempts: number = 5,
  blockDurationMs: number = 15 * 60 * 1000
): void {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record) {
    rateLimitStore.set(key, {
      attempts: 1,
      firstAttemptAt: now,
    });
    return;
  }

  record.attempts += 1;
  if (record.attempts >= maxAttempts) {
    record.blockedUntil = now + blockDurationMs;
  }
}

/**
 * Menghapus catatan pembatasan setelah login berhasil
 */
export function clearRateLimit(key: string): void {
  rateLimitStore.delete(key);
}
