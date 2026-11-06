import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { findOrphanMedia } from "@/lib/services/media";
import { CORRELATION_HEADER, getOrGenerateCorrelationId } from "@esport-sumbar/lib";

/**
 * Endpoint Pemeriksaan & Pembersihan Berkas Yatim (Orphan Media)
 * GET: Mode Laporan Dahulu (Dry Run = true)
 * POST: Mode Pembersihan (Dry Run = false) - hanya platform_admin
 */
export async function GET(req: NextRequest) {
  const correlationId = getOrGenerateCorrelationId(req.headers);

  try {
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();

    const isPlaceholder = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").includes("placeholder");

    // Periksa apakah pengguna adalah platform_admin
    if (authData?.user?.id) {
      const { data: account } = await supabase
        .from("accounts")
        .select("role")
        .eq("id", authData.user.id)
        .single();

      if (account?.role !== "platform_admin" && !isPlaceholder) {
        return NextResponse.json(
          { error: "Akses terlarang: Hanya Platform Admin yang diizinkan mengakses laporan berkas yatim." },
          { status: 403, headers: { [CORRELATION_HEADER]: correlationId } }
        );
      }
    } else if (!isPlaceholder) {
      return NextResponse.json(
        { error: "Akses ditolak: Masuk sebagai Platform Admin." },
        { status: 401, headers: { [CORRELATION_HEADER]: correlationId } }
      );
    }

    const report = await findOrphanMedia(true, createAdminClient());

    return NextResponse.json(
      {
        mode: "dry-run",
        report,
      },
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

export async function POST(req: NextRequest) {
  const correlationId = getOrGenerateCorrelationId(req.headers);

  try {
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();

    const isPlaceholder = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").includes("placeholder");

    if (authData?.user?.id) {
      const { data: account } = await supabase
        .from("accounts")
        .select("role")
        .eq("id", authData.user.id)
        .single();

      if (account?.role !== "platform_admin" && !isPlaceholder) {
        return NextResponse.json(
          { error: "Akses terlarang: Hanya Platform Admin yang diizinkan membersihkan berkas yatim." },
          { status: 403, headers: { [CORRELATION_HEADER]: correlationId } }
        );
      }
    } else if (!isPlaceholder) {
      return NextResponse.json(
        { error: "Akses ditolak: Masuk sebagai Platform Admin." },
        { status: 401, headers: { [CORRELATION_HEADER]: correlationId } }
      );
    }

    const body = await req.json().catch(() => ({}));
    const dryRun = body?.dryRun === true;

    const report = await findOrphanMedia(dryRun, createAdminClient());

    return NextResponse.json(
      {
        mode: dryRun ? "dry-run" : "purge",
        report,
      },
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
