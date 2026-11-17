import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies, headers } from "next/headers";
import type { NextRequest } from "next/server";
import type { Database } from "./database.types";

/**
 * Admin client with Service Role privileges.
 * Bypasses RLS and email confirmation limits safely inside trusted Server Actions.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-esport-sumbar.supabase.co";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not defined in environment");
  }

  return createSupabaseClient<Database>(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Public server client for static or public reads that do not require user session cookies.
 * Safe to use in static generation, prerendering, and public view queries without triggering dynamic bailout.
 */
export function createPublicServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-esport-sumbar.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return [];
      },
      setAll() {},
    },
  });
}

export async function createClient(req?: Request | NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-esport-sumbar.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

  // 1. Dukungan Mobile / API Client via Authorization: Bearer <token>
  let authHeader: string | null = null;
  if (req && req.headers) {
    authHeader = req.headers.get("authorization");
  }

  if (!authHeader) {
    try {
      const headerStore = await headers();
      authHeader = headerStore.get("authorization");
    } catch {
      // Abaikan jika di luar konteks request
    }
  }

  if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
    const token = authHeader.substring(7).trim();
    if (token) {
      const client = createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey, {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });

      // Patch getUser agar otomatis memvalidasi token JWT mobile jika dipanggil tanpa parameter
      const originalGetUser = client.auth.getUser.bind(client.auth);
      client.auth.getUser = ((jwt?: string) => originalGetUser(jwt || token)) as typeof client.auth.getUser;

      return client;
    }
  }

  // 2. Cookie-based client untuk sesi web browser eksisting (100% backward compatible)
  let cookieStore: any;
  try {
    cookieStore = await cookies();
  } catch {
    return createPublicServerClient();
  }

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing user sessions.
        }
      },
    },
  });
}
