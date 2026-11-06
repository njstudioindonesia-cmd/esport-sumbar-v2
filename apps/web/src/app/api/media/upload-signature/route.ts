import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createUploadSignature } from "@/lib/services/media";
import { RequestMediaUploadSignatureSchema } from "@esport-sumbar/contracts";
import { CORRELATION_HEADER, getOrGenerateCorrelationId } from "@esport-sumbar/lib";

export async function POST(req: NextRequest) {
  const correlationId = getOrGenerateCorrelationId(req.headers);

  try {
    const supabase = await createClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();

    const isPlaceholder = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").includes("placeholder");
    let accountId = authData?.user?.id;

    if (!accountId) {
      if (isPlaceholder) {
        accountId = "00000000-0000-0000-0000-000000000001";
      } else {
        return NextResponse.json(
          { error: "Akses ditolak: Anda harus masuk ke akun untuk meminta tanda tangan unggah." },
          { status: 401, headers: { [CORRELATION_HEADER]: correlationId } }
        );
      }
    }

    const body = await req.json();
    const parseResult = RequestMediaUploadSignatureSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Payload permintaan tanda tangan unggah tidak valid.",
          details: parseResult.error.format(),
        },
        { status: 400, headers: { [CORRELATION_HEADER]: correlationId } }
      );
    }

    const signature = await createUploadSignature(parseResult.data, accountId, supabase);

    return NextResponse.json(signature, {
      status: 200,
      headers: { [CORRELATION_HEADER]: correlationId },
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan internal";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500, headers: { [CORRELATION_HEADER]: correlationId } }
    );
  }
}
