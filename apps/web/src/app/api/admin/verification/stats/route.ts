import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/auth/api-guard";
import { getVerificationStats } from "@/lib/services/verification";

export async function GET(request: NextRequest) {
  const { errorResponse } = await verifyAdminAuth(["platform_admin"]);
  if (errorResponse) return errorResponse;

  try {
    const stats = await getVerificationStats();
    return NextResponse.json({ success: true, stats });
  } catch (err: any) {
    console.error("API /api/admin/verification/stats error:", err);
    return NextResponse.json(
      { error: err.message || "Gagal mengambil statistik verifikasi." },
      { status: 500 }
    );
  }
}
