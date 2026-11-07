import { NextResponse } from "next/server";

const startTime = Date.now();

/**
 * Liveness Probe (/api/healthz)
 * Memeriksa apakah runtime proses aplikasi aktif (alive).
 * Mematuhi Prinsip Keamanan Bagian 3.5 & Finding A11:
 * Detail memori disembunyikan di lingkungan produksi untuk mencegah information leakage.
 */
export async function GET() {
  const isProduction = process.env.NODE_ENV === "production";
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);

  const payload: Record<string, unknown> = {
    status: "healthy",
    service: "esport-sumbar-web",
    version: "3.0.0",
    timestamp: new Date().toISOString(),
  };

  // Tampilkan informasi diagnostik mendalam hanya di non-produksi
  if (!isProduction) {
    const mem = process.memoryUsage ? process.memoryUsage() : { heapUsed: 0, rss: 0 };
    payload.uptimeSeconds = uptimeSeconds;
    payload.memory = {
      heapUsedMB: Math.round((mem.heapUsed / 1024 / 1024) * 10) / 10,
      rssMB: Math.round((mem.rss / 1024 / 1024) * 10) / 10,
    };
    payload.environment = process.env.NODE_ENV || "development";
  }

  return NextResponse.json(payload, {
    status: 200,
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "X-Service-Name": "esport-sumbar-web",
    },
  });
}
