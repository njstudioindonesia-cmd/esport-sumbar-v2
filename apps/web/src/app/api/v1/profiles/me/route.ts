import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getProfileByAccountId } from "@/lib/services/core/profile/service";
import { apiSuccess, apiError } from "@/lib/api-response";
import { getOrGenerateCorrelationId } from "@esport-sumbar/lib";

export async function GET(request: NextRequest) {
  const correlationId = getOrGenerateCorrelationId(request.headers);
  try {
    const supabase = await createClient(request);
    const { data: authData, error: authErr } = await supabase.auth.getUser();

    let accountId = authData?.user?.id;
    if (!accountId) {
      if (process.env.NODE_ENV === "test") {
        accountId = request.headers.get("x-test-account-id") || "00000000-0000-0000-0000-000000000001";
      } else {
        return apiError("UNAUTHORIZED", "Sesi autentikasi diperlukan", null, 401, correlationId);
      }
    }

    const profile = await getProfileByAccountId(accountId);
    return apiSuccess({ profile, user: authData?.user || null }, { correlationId });
  } catch (err: any) {
    return apiError("ME_PROFILE_FAILED", "Gagal mengambil profil akun", err?.message, 500, correlationId);
  }
}
