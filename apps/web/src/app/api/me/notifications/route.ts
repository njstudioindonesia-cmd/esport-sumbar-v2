import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserNotifications, markNotificationAsRead } from "@/lib/services/notifications";
import { CORRELATION_HEADER, getOrGenerateCorrelationId } from "@esport-sumbar/lib";

export async function GET(req: NextRequest) {
  const correlationId = getOrGenerateCorrelationId(req.headers);

  try {
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();

    const isPlaceholder = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").includes("placeholder");
    let accountId = authData?.user?.id;

    if (!accountId) {
      if (isPlaceholder) {
        accountId = "00000000-0000-0000-0000-000000000001";
      } else {
        return NextResponse.json(
          { error: "Akses ditolak: Silakan masuk ke akun Anda." },
          { status: 401, headers: { [CORRELATION_HEADER]: correlationId } }
        );
      }
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const notifications = await getUserNotifications(accountId, limit, supabase);

    return NextResponse.json(
      { notifications },
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

export async function PATCH(req: NextRequest) {
  const correlationId = getOrGenerateCorrelationId(req.headers);

  try {
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();

    const isPlaceholder = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").includes("placeholder");
    let accountId = authData?.user?.id;

    if (!accountId) {
      if (isPlaceholder) {
        accountId = "00000000-0000-0000-0000-000000000001";
      } else {
        return NextResponse.json(
          { error: "Akses ditolak: Silakan masuk ke akun Anda." },
          { status: 401, headers: { [CORRELATION_HEADER]: correlationId } }
        );
      }
    }

    const body = await req.json().catch(() => ({}));
    const notificationId = body?.id;

    if (!notificationId) {
      return NextResponse.json(
        { error: "ID notifikasi wajib disertakan." },
        { status: 400, headers: { [CORRELATION_HEADER]: correlationId } }
      );
    }

    const marked = await markNotificationAsRead(notificationId, accountId, supabase);

    return NextResponse.json(
      { success: marked },
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
