import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { reconcileDirectoryReadModel } from "@/lib/services/directory";
import { CORRELATION_HEADER, getOrGenerateCorrelationId } from "@esport-sumbar/lib";

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
          { error: "Akses terlarang: Hanya Platform Admin yang diizinkan menjalankan rekonsiliasi direktori." },
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
    const dryRun = body?.dryRun !== false;

    const report = await reconcileDirectoryReadModel(dryRun, createAdminClient());

    return NextResponse.json(
      {
        mode: dryRun ? "dry-run" : "reconcile",
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
