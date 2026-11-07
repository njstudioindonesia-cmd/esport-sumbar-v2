import { NextRequest, NextResponse } from "next/server";
import { getDirectoryProfileBySlug } from "@/lib/services/directory";
import { CORRELATION_HEADER, getOrGenerateCorrelationId } from "@esport-sumbar/lib";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const correlationId = getOrGenerateCorrelationId(req.headers);

  try {
    const { slug } = await context.params;
    if (!slug) {
      return NextResponse.json(
        { error: "Slug wajib disertakan." },
        { status: 400, headers: { [CORRELATION_HEADER]: correlationId } }
      );
    }

    const profile = await getDirectoryProfileBySlug(slug);
    if (!profile) {
      return NextResponse.json(
        { error: "Profil tidak ditemukan dalam direktori publik." },
        { status: 404, headers: { [CORRELATION_HEADER]: correlationId } }
      );
    }

    return NextResponse.json(
      { profile },
      { status: 200, headers: { [CORRELATION_HEADER]: correlationId } }
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan internal";
    return NextResponse.json(
      { error: errorMsg },
      { status: 500, headers: { [CORRELATION_HEADER]: correlationId } }
    );
  }
}
