import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import type { Database } from "@/lib/supabase/database.types";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  let next = searchParams.get("next") ?? "/dashboard";

  // Hindari open-redirect ke domain eksternal berbahaya
  if (!next.startsWith("/")) {
    next = "/dashboard";
  }

  if (code) {
    const forwardedHost = request.headers.get("x-forwarded-host");
    const isLocalEnv = process.env.NODE_ENV === "development";
    let redirectUrl = `${origin}${next}`;
    if (!isLocalEnv && forwardedHost) {
      redirectUrl = `https://${forwardedHost}${next}`;
    }

    const response = NextResponse.redirect(redirectUrl);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-esport-sumbar.supabase.co";
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

    const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    });

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data?.user) {
      // 1. Pastikan akun tersinkronisasi di tabel accounts
      try {
        await supabase
          .from("accounts")
          .upsert(
            {
              id: data.user.id,
              email: data.user.email || "",
              role: "user",
              is_active: true,
            },
            { onConflict: "id" }
          );
      } catch (e) {
        console.error("Account sync error in callback:", e);
      }

      // 2. Cek apakah user baru pertama kali masuk (belum punya profil)
      try {
        const { count } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .eq("account_id", data.user.id);

        if ((!count || count === 0) && next === "/dashboard") {
          const wizardUrl = !isLocalEnv && forwardedHost
            ? `https://${forwardedHost}/me/profile/new`
            : `${origin}/me/profile/new`;
          const wizardResponse = NextResponse.redirect(wizardUrl);
          response.cookies.getAll().forEach((c) => {
            wizardResponse.cookies.set(c.name, c.value, c);
          });
          return wizardResponse;
        }
      } catch (e) {
        console.warn("Profile count check in callback:", e);
      }

      return response;
    }
    console.error("Auth callback exchangeCodeForSession error:", error);
  }

  // Jika gagal, kembalikan ke login dengan pesan error
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
