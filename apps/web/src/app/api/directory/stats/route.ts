import { NextRequest, NextResponse } from "next/server";
import { getDirectoryStats } from "@/lib/services/directory";
import { CORRELATION_HEADER, getOrGenerateCorrelationId } from "@esport-sumbar/lib";

export async function GET(req: NextRequest) {
  const correlationId = getOrGenerateCorrelationId(req.headers);

  try {
    const stats = await getDirectoryStats();

    return NextResponse.json(stats, {
      status: 200,
      headers: {
        [CORRELATION_HEADER]: correlationId,
        "x-cache-hit": stats.fromCache ? "HIT" : "MISS",
      },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan internal";
    return NextResponse.json(
      { error: errorMsg },
      { status: 500, headers: { [CORRELATION_HEADER]: correlationId } }
    );
  }
}
