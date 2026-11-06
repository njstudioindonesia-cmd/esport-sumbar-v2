import { NextResponse } from "next/server";
import { getPlatformStats, getRegionMapStats } from "@/lib/services/stats";


export async function GET() {
  try {
    const [stats, mapStats] = await Promise.all([
      getPlatformStats(),
      getRegionMapStats(),
    ]);

    return NextResponse.json({
      stats,
      mapStats,
    });
  } catch (error: any) {
    console.error("API /api/stats error:", error);
    return NextResponse.json(
      { error: "Gagal memuat statistik platform" },
      { status: 500 }
    );
  }
}
