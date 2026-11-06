import { getAllCircuitBreakerStats, CircuitBreakerStats } from "@esport-sumbar/lib";

export interface LatencySample {
  route: string;
  durationMs: number;
  timestamp: number;
}

export interface SystemMetricsSnapshot {
  timestamp: string;
  uptimeSeconds: number;
  memory: {
    heapUsedMB: number;
    heapTotalMB: number;
    rssMB: number;
  };
  http: {
    totalRequests: number;
    totalErrors: number;
    errorRatePercent: number;
    routes: Record<string, { requests: number; errors: number; avgLatencyMs: number }>;
  };
  circuitBreakers: CircuitBreakerStats[];
}

class MetricsRegistry {
  private startTime = Date.now();
  private totalRequests = 0;
  private totalErrors = 0;
  private routeStats = new Map<string, { requests: number; errors: number; totalDurationMs: number }>();
  private samples: LatencySample[] = [];
  private readonly MAX_SAMPLES = 500;

  /**
   * Catat durasi dan status eksekusi HTTP request
   */
  public recordRequest(route: string, durationMs: number, isError = false) {
    this.totalRequests++;
    if (isError) this.totalErrors++;

    let stat = this.routeStats.get(route);
    if (!stat) {
      stat = { requests: 0, errors: 0, totalDurationMs: 0 };
      this.routeStats.set(route, stat);
    }

    stat.requests++;
    if (isError) stat.errors++;
    stat.totalDurationMs += durationMs;

    this.samples.push({ route, durationMs, timestamp: Date.now() });
    if (this.samples.length > this.MAX_SAMPLES) {
      this.samples.shift();
    }
  }

  /**
   * Menghasilkan snapshot metrik sistem saat ini
   */
  public getSnapshot(): SystemMetricsSnapshot {
    const memory = process.memoryUsage ? process.memoryUsage() : { heapUsed: 0, heapTotal: 0, rss: 0 };
    const uptimeSeconds = Math.floor((Date.now() - this.startTime) / 1000);

    const routes: Record<string, { requests: number; errors: number; avgLatencyMs: number }> = {};
    for (const [route, stat] of this.routeStats.entries()) {
      routes[route] = {
        requests: stat.requests,
        errors: stat.errors,
        avgLatencyMs: stat.requests > 0 ? Math.round((stat.totalDurationMs / stat.requests) * 10) / 10 : 0,
      };
    }

    const errorRatePercent =
      this.totalRequests > 0
        ? Math.round((this.totalErrors / this.totalRequests) * 10000) / 100
        : 0;

    return {
      timestamp: new Date().toISOString(),
      uptimeSeconds,
      memory: {
        heapUsedMB: Math.round((memory.heapUsed / 1024 / 1024) * 10) / 10,
        heapTotalMB: Math.round((memory.heapTotal / 1024 / 1024) * 10) / 10,
        rssMB: Math.round((memory.rss / 1024 / 1024) * 10) / 10,
      },
      http: {
        totalRequests: this.totalRequests,
        totalErrors: this.totalErrors,
        errorRatePercent,
        routes,
      },
      circuitBreakers: getAllCircuitBreakerStats(),
    };
  }

  /**
   * Reset metrik (berguna untuk pengujian)
   */
  public reset() {
    this.totalRequests = 0;
    this.totalErrors = 0;
    this.routeStats.clear();
    this.samples = [];
  }
}

export const metricsRegistry = new MetricsRegistry();
