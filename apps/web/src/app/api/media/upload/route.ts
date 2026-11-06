import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { processAndUploadMedia } from "@/lib/services/media";
import { MediaPurposeSchema } from "@esport-sumbar/contracts";
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
          { error: "Akses ditolak: Anda harus masuk ke akun untuk mengunggah media." },
          { status: 401, headers: { [CORRELATION_HEADER]: correlationId } }
        );
      }
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const purposeRaw = (formData.get("purpose") as string) || "avatar";
    const profileId = formData.get("profileId") as string;
    const oldPublicUrl = (formData.get("oldPublicUrl") as string) || null;
    const caption = (formData.get("caption") as string) || "";
    const sortOrder = parseInt((formData.get("sortOrder") as string) || "0", 10);

    if (!file) {
      return NextResponse.json(
        { error: "Berkas tidak ditemukan dalam formulir unggah." },
        { status: 400, headers: { [CORRELATION_HEADER]: correlationId } }
      );
    }

    if (!profileId) {
      return NextResponse.json(
        { error: "ID profil target wajib disertakan." },
        { status: 400, headers: { [CORRELATION_HEADER]: correlationId } }
      );
    }

    const purposeParse = MediaPurposeSchema.safeParse(purposeRaw);
    if (!purposeParse.success) {
      return NextResponse.json(
        { error: `Tujuan media '${purposeRaw}' tidak didukung. Pilihan: avatar, cover, evidence, gallery.` },
        { status: 400, headers: { [CORRELATION_HEADER]: correlationId } }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await processAndUploadMedia(
      {
        fileBuffer: buffer,
        fileName: file.name,
        purpose: purposeParse.data,
        profileId,
        accountId,
        oldPublicUrl,
        caption,
        sortOrder,
      },
      supabase
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400, headers: { [CORRELATION_HEADER]: correlationId } }
      );
    }

    return NextResponse.json(result, {
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
