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
    const host = !isLocalEnv && forwardedHost ? `https://${forwardedHost}` : origin;

    // Simpan semua cookie perubahan dari Supabase Auth
    const cookiesToSetList: { name: string; value: string; options: any }[] = [];

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-esport-sumbar.supabase.co";
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

    const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach((item) => cookiesToSetList.push(item));
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
      let targetPath = next;
      try {
        const { count } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .eq("account_id", data.user.id);

        if ((!count || count === 0) && next === "/dashboard") {
          targetPath = "/me/profile/new";
        }
      } catch (e) {
        console.warn("Profile count check in callback:", e);
      }

      const finalUrl = `${host}${targetPath}`;
      const response = NextResponse.redirect(finalUrl);

      // Terapkan semua cookies dengan path: '/' dan parameter lengkap agar terbaca di seluruh rute
      cookiesToSetList.forEach(({ name, value, options }) => {
        response.cookies.set(name, value, {
          ...options,
          path: options?.path ?? "/",
          sameSite: options?.sameSite ?? "lax",
          secure: process.env.NODE_ENV === "production",
        });
      });

      return response;
    }
    console.error("Auth callback exchangeCodeForSession error:", error);
  }

  // Jika gagal, kembalikan ke login dengan pesan error
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
