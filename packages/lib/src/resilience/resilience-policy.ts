import { withTimeout, TimeoutError } from "./timeout";
import { withRetry, RetryOptions } from "./retry";
import { CircuitBreaker, CircuitBreakerOptions, CircuitBreakerOpenError } from "./circuit-breaker";

export interface ResiliencePolicyConfig {
  name: string;
  timeoutMs?: number;
  retry?: RetryOptions;
  circuitBreaker?: Omit<CircuitBreakerOptions, "name">;
  fallback?: <T>(error: any) => Promise<T> | T;
}

export class ResiliencePolicy {
  public readonly name: string;
  public readonly circuitBreaker: CircuitBreaker;
  private timeoutMs: number;
  private retryOptions: RetryOptions;

  constructor(config: ResiliencePolicyConfig) {
    this.name = config.name;
    this.timeoutMs = config.timeoutMs ?? 5000;
    this.retryOptions = config.retry ?? { maxAttempts: 3, baseDelayMs: 100 };
    this.circuitBreaker = new CircuitBreaker({
      name: config.name,
      ...config.circuitBreaker,
    });
  }

  /**
   * Menjalankan operasi terproteksi penuh:
   * 1. Evaluasi Circuit Breaker (jika OPEN, langsung memicu fallback atau melempar error).
   * 2. Menjalankan operasi dengan Timeout terukur.
   * 3. Melakukan Retry dengan Exponential Backoff + Jitter untuk transient errors.
   * 4. Jika tetap gagal atau sirkuit terbuka, mengembalikan Fallback anggun (graceful degradation).
   */
  public async execute<T>(
    operation: () => Promise<T>,
    customFallback?: (error: any) => Promise<T> | T
  ): Promise<T> {
    return this.circuitBreaker.execute(
      async () => {
        return withRetry(
          async () => {
            return withTimeout(operation, this.timeoutMs, this.name);
          },
          this.retryOptions
        );
      },
      customFallback
    );
  }
}

/**
 * Factory untuk membuat ResiliencePolicy terpadu
 */
export function createResiliencePolicy(config: ResiliencePolicyConfig): ResiliencePolicy {
  return new ResiliencePolicy(config);
}
