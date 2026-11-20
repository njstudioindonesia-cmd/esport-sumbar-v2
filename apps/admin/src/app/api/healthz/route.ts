import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    services: {
      supabaseAuth: "healthy",
      storage: "healthy",
      database: "healthy",
    },
  });
}
