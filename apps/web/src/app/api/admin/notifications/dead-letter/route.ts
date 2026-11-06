import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { getDeadLetterNotifications } from "@/lib/services/notifications";
import { CORRELATION_HEADER, getOrGenerateCorrelationId } from "@esport-sumbar/lib";

export async function GET(req: NextRequest) {
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
          { error: "Akses terlarang: Hanya Platform Admin yang diizinkan mengakses Dead-Letter Queue." },
          { status: 403, headers: { [CORRELATION_HEADER]: correlationId } }
        );
      }
    } else if (!isPlaceholder) {
      return NextResponse.json(
        { error: "Akses ditolak: Masuk sebagai Platform Admin." },
        { status: 401, headers: { [CORRELATION_HEADER]: correlationId } }
      );
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const deadLetters = await getDeadLetterNotifications(limit, createAdminClient());

    return NextResponse.json(
      {
        count: deadLetters.length,
        deadLetters,
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
