import { NextRequest, NextResponse } from "next/server";
import { createPublicServerClient } from "@/lib/supabase/server";
import { CmsService } from "@esport-sumbar/domain";
import crypto from "crypto";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: bannerId } = await params;
    const body = await request.json().catch(() => ({}));
    const eventType = body.eventType === "click" ? "click" : "impression";

    // Buat hash anonim sesi berbasis IP + User-Agent + Salt harian tanpa menyimpan IP/identitas pribadi
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const userAgent = request.headers.get("user-agent") || "";
    const today = new Date().toISOString().split("T")[0];
    const sessionHash = crypto
      .createHash("sha256")
      .update(`${ip}:${userAgent}:${today}`)
      .digest("hex")
      .substring(0, 16);

    const supabase = await createPublicServerClient();
    const result = await CmsService.recordBannerEvent(supabase, {
      bannerId,
      eventType,
      sessionHash,
    });

    return NextResponse.json({ success: result.success });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Gagal mencatat statistik banner" },
      { status: 500 }
    );
  }
}
