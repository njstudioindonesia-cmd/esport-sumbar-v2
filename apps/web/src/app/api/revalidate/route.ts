import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { verifyRevalidationSignature, RevalidationPayload } from "@esport-sumbar/domain";

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get("X-Revalidation-Signature");
    if (!signature) {
      return NextResponse.json(
        { success: false, message: "Header X-Revalidation-Signature wajib disertakan" },
        { status: 401 }
      );
    }

    const payload: RevalidationPayload = await request.json();
    if (!payload.tags || !Array.isArray(payload.tags) || typeof payload.timestamp !== "number") {
      return NextResponse.json(
        { success: false, message: "Payload revalidasi tidak valid (tags array dan timestamp wajib)" },
        { status: 400 }
      );
    }

    const secret = process.env.REVALIDATION_SECRET || "esport-sumbar-revalidation-secret-v3";
    const verification = verifyRevalidationSignature(payload, signature, secret, 300);

    if (!verification.valid) {
      return NextResponse.json(
        { success: false, message: verification.reason || "Tanda tangan HMAC tidak sah" },
        { status: 403 }
      );
    }

    // Eksekusi revalidasi tag di Next.js cache
    const revalidated: string[] = [];
    for (const tag of payload.tags) {
      if (typeof tag === "string" && tag.trim().length > 0) {
        (revalidateTag as any)(tag);
        revalidated.push(tag);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Berhasil merevalidasi ${revalidated.length} tag cache`,
      revalidatedTags: revalidated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Terjadi kesalahan internal saat revalidasi" },
      { status: 500 }
    );
  }
}
