import { NextResponse } from "next/server";

const startTime = Date.now();

/**
 * Liveness Probe (/api/healthz)
 * Memeriksa apakah runtime proses aplikasi aktif (alive).
 * Digunakan oleh orchestrator / load balancer untuk healthcheck dasar.
 */
export async function GET() {
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
  const mem = process.memoryUsage ? process.memoryUsage() : { heapUsed: 0, rss: 0 };

  return NextResponse.json(
    {
      status: "healthy",
      service: "esport-sumbar-web",
      version: "3.0.0",
      uptimeSeconds,
      memory: {
        heapUsedMB: Math.round((mem.heapUsed / 1024 / 1024) * 10) / 10,
        rssMB: Math.round((mem.rss / 1024 / 1024) * 10) / 10,
      },
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "X-Service-Name": "esport-sumbar-web",
      },
    }
  );
}
