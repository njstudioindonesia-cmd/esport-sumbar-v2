export type JitterStrategy = "full" | "decorrelated" | "none";

export interface RetryOptions {
  /** Jumlah maksimal percobaan (termasuk percobaan pertama). Default: 3 */
  maxAttempts?: number;
  /** Jeda awal dalam milidetik. Default: 100ms */
  baseDelayMs?: number;
  /** Jeda maksimal dalam milidetik. Default: 3000ms */
  maxDelayMs?: number;
  /** Pengali backoff eksponensial. Default: 2 */
  backoffFactor?: number;
  /** Strategi acakan jeda (jitter). Default: 'full' */
  jitter?: JitterStrategy;
  /** Predikat untuk menentukan apakah galat layak di-retry. */
  shouldRetry?: (error: any, attempt: number) => boolean;
  /** Hook callback yang dipanggil saat retry dilakukan. */
  onRetry?: (error: any, attempt: number, delayMs: number) => void;
}

/**
 * Menghitung jeda eksponensial dengan acakan (jitter)
 * untuk menghindari fenomena thundering herd pada layanan downstream.
 */
export function calculateRetryDelay(
  attempt: number,
  baseDelayMs: number,
  maxDelayMs: number,
  backoffFactor: number,
  jitter: JitterStrategy
): number {
  // Eksponensial: base * (factor ^ (attempt - 1))
  const exponentialDelay = baseDelayMs * Math.pow(backoffFactor, Math.max(0, attempt - 1));
  const cappedDelay = Math.min(exponentialDelay, maxDelayMs);

  switch (jitter) {
    case "full":
      // Full Jitter: jeda antara 0 hingga cappedDelay
      return Math.floor(Math.random() * cappedDelay);
    case "decorrelated":
      // Decorrelated Jitter: jeda acak antara baseDelay hingga 3x delay sebelumnya
      return Math.min(maxDelayMs, Math.floor(baseDelayMs + Math.random() * (cappedDelay - baseDelayMs)));
    case "none":
    default:
      return cappedDelay;
  }
}

/**
 * Default predikat: retry hanya untuk network errors, timeout, dan 5xx server errors.
 * Galat 4xx (misal 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found) TIDAK di-retry.
 */
export function defaultShouldRetry(error: any): boolean {
  if (!error) return false;

  // Timeout atau network fetch errors
  if (error.name === "TimeoutError" || error.name === "AbortError") return true;
  if (error.code === "ECONNRESET" || error.code === "ETIMEDOUT" || error.code === "ECONNREFUSED") return true;

  // HTTP status
  const status = error.status || error.statusCode || error.response?.status;
  if (typeof status === "number") {
    // 5xx Server Error layak di-retry; 429 Too Many Requests juga layak di-retry
    return status >= 500 || status === 429;
  }

  // Jika galat generik atau pesan memuat kata timeout/network
  const msg = String(error.message || "").toLowerCase();
  if (msg.includes("timeout") || msg.includes("network") || msg.includes("fetch failed") || msg.includes("econnreset")) {
    return true;
  }

  return true;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Menjalankan fungsi dengan mekanisme coba ulang eksponensial (Exponential Backoff with Jitter).
 */
export async function withRetry<T>(
  fn: (attempt: number) => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const maxAttempts = options.maxAttempts ?? 3;
  const baseDelayMs = options.baseDelayMs ?? 100;
  const maxDelayMs = options.maxDelayMs ?? 3000;
  const backoffFactor = options.backoffFactor ?? 2;
  const jitter = options.jitter ?? "full";
  const shouldRetry = options.shouldRetry ?? defaultShouldRetry;

  let lastError: any;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn(attempt);
    } catch (err: any) {
      lastError = err;

      // Jika sudah mencapai batas maksimal percobaan atau galat tidak layak di-retry, lempar galat
      if (attempt >= maxAttempts || !shouldRetry(err, attempt)) {
        throw err;
      }

      const delay = calculateRetryDelay(attempt, baseDelayMs, maxDelayMs, backoffFactor, jitter);

      if (options.onRetry) {
        options.onRetry(err, attempt, delay);
      }

      await sleep(delay);
    }
  }

  throw lastError;
}
