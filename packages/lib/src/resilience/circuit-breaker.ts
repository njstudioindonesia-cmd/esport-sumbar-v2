export type CircuitState = "CLOSED" | "OPEN" | "HALF_OPEN";

export class CircuitBreakerOpenError extends Error {
  public readonly circuitName: string;
  public readonly resetTimeoutMs: number;

  constructor(circuitName: string, resetTimeoutMs: number) {
    super(`Circuit breaker '${circuitName}' is OPEN. Requests are temporarily blocked to prevent cascading failure.`);
    this.name = "CircuitBreakerOpenError";
    this.circuitName = circuitName;
    this.resetTimeoutMs = resetTimeoutMs;
  }
}

export interface CircuitBreakerOptions {
  /** Nama pengenal unik sirkuit (misal: 'notification-service') */
  name: string;
  /** Batas kegagalan berturut-turut sebelum sirkuit terputus (OPEN). Default: 5 */
  failureThreshold?: number;
  /** Waktu tunggu (cooldown) sebelum sirkuit mencoba pulih (HALF_OPEN). Default: 15000ms */
  recoveryTimeoutMs?: number;
  /** Jumlah eksekusi sukses berturut-turut di HALF_OPEN untuk kembali ke CLOSED. Default: 2 */
  halfOpenSuccessThreshold?: number;
  /** Predikat kustom untuk menentukan kegagalan */
  isFailure?: (error: any) => boolean;
  /** Callback saat transisi status terjadi */
  onStateChange?: (from: CircuitState, to: CircuitState, name: string) => void;
}

export interface CircuitBreakerStats {
  name: string;
  state: CircuitState;
  failures: number;
  consecutiveFailures: number;
  consecutiveSuccesses: number;
  lastFailureTime: number | null;
  lastStateChange: number;
  totalCalls: number;
  totalSuccesses: number;
  totalFailures: number;
  totalShortCircuits: number;
}

export class CircuitBreaker {
  public readonly name: string;
  private state: CircuitState = "CLOSED";
  private failureThreshold: number;
  private recoveryTimeoutMs: number;
  private halfOpenSuccessThreshold: number;
  private isFailure: (error: any) => boolean;
  private onStateChange?: (from: CircuitState, to: CircuitState, name: string) => void;

  private consecutiveFailures = 0;
  private consecutiveSuccesses = 0;
  private lastFailureTime: number | null = null;
  private lastStateChange: number = Date.now();
  private totalCalls = 0;
  private totalSuccesses = 0;
  private totalFailures = 0;
  private totalShortCircuits = 0;

  constructor(options: CircuitBreakerOptions) {
    this.name = options.name;
    this.failureThreshold = options.failureThreshold ?? 5;
    this.recoveryTimeoutMs = options.recoveryTimeoutMs ?? 15000;
    this.halfOpenSuccessThreshold = options.halfOpenSuccessThreshold ?? 2;
    this.isFailure = options.isFailure ?? (() => true);
    this.onStateChange = options.onStateChange;

    // Daftarkan ke registri global
    circuitBreakerRegistry.set(this.name, this);
  }

  public getState(): CircuitState {
    this.checkCooldownTransition();
    return this.state;
  }

  public getStats(): CircuitBreakerStats {
    this.checkCooldownTransition();
    return {
      name: this.name,
      state: this.state,
      failures: this.totalFailures,
      consecutiveFailures: this.consecutiveFailures,
      consecutiveSuccesses: this.consecutiveSuccesses,
      lastFailureTime: this.lastFailureTime,
      lastStateChange: this.lastStateChange,
      totalCalls: this.totalCalls,
      totalSuccesses: this.totalSuccesses,
      totalFailures: this.totalFailures,
      totalShortCircuits: this.totalShortCircuits,
    };
  }

  private transitionTo(newState: CircuitState) {
    if (this.state === newState) return;
    const oldState = this.state;
    this.state = newState;
    this.lastStateChange = Date.now();

    if (newState === "CLOSED") {
      this.consecutiveFailures = 0;
      this.consecutiveSuccesses = 0;
    } else if (newState === "OPEN") {
      this.consecutiveSuccesses = 0;
    } else if (newState === "HALF_OPEN") {
      this.consecutiveSuccesses = 0;
    }

    if (this.onStateChange) {
      this.onStateChange(oldState, newState, this.name);
    }
  }

  private checkCooldownTransition() {
    if (this.state === "OPEN") {
      const now = Date.now();
      if (this.lastFailureTime && now - this.lastFailureTime >= this.recoveryTimeoutMs) {
        this.transitionTo("HALF_OPEN");
      }
    }
  }

  /**
   * Eksekusi fungsi terlindungi oleh Circuit Breaker.
   * Jika sirkuit OPEN dan fallback disediakan, fallback akan dijalankan.
   */
  public async execute<T>(
    fn: () => Promise<T>,
    fallback?: (error?: any) => Promise<T> | T
  ): Promise<T> {
    this.totalCalls++;
    this.checkCooldownTransition();

    if (this.state === "OPEN") {
      this.totalShortCircuits++;
      const openError = new CircuitBreakerOpenError(this.name, this.recoveryTimeoutMs);
      if (fallback) {
        return fallback(openError);
      }
      throw openError;
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (err: any) {
      if (this.isFailure(err)) {
        this.onFailure(err);
      }
      if (fallback) {
        return fallback(err);
      }
      throw err;
    }
  }

  private onSuccess() {
    this.totalSuccesses++;
    if (this.state === "HALF_OPEN") {
      this.consecutiveSuccesses++;
      if (this.consecutiveSuccesses >= this.halfOpenSuccessThreshold) {
        this.transitionTo("CLOSED");
      }
    } else if (this.state === "CLOSED") {
      this.consecutiveFailures = 0;
    }
  }

  private onFailure(err: any) {
    this.totalFailures++;
    this.lastFailureTime = Date.now();

    if (this.state === "HALF_OPEN") {
      // Di fase HALF_OPEN, satu kegagalan langsung memutus kembali sirkuit
      this.transitionTo("OPEN");
    } else if (this.state === "CLOSED") {
      this.consecutiveFailures++;
      if (this.consecutiveFailures >= this.failureThreshold) {
        this.transitionTo("OPEN");
      }
    }
  }

  /**
   * Reset manual ke state CLOSED
   */
  public reset() {
    this.transitionTo("CLOSED");
  }

  /**
   * Paksa sirkuit menjadi OPEN (kill switch)
   */
  public trip() {
    this.lastFailureTime = Date.now();
    this.transitionTo("OPEN");
  }
}

// Global registry untuk monitoring dan inspectability
const circuitBreakerRegistry = new Map<string, CircuitBreaker>();

export function getCircuitBreaker(name: string): CircuitBreaker | undefined {
  return circuitBreakerRegistry.get(name);
}

export function getAllCircuitBreakers(): CircuitBreaker[] {
  return Array.from(circuitBreakerRegistry.values());
}

export function getAllCircuitBreakerStats(): CircuitBreakerStats[] {
  return getAllCircuitBreakers().map((cb) => cb.getStats());
}

export function resetAllCircuitBreakers() {
  for (const cb of circuitBreakerRegistry.values()) {
    cb.reset();
  }
}
