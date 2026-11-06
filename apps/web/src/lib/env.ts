import { z } from "zod";

/**
 * Runtime Environment Variable Validator for ESPORT SUMBAR V3
 * Memvalidasi variabel lingkungan saat server startup untuk mencegah runtime error.
 */

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url("NEXT_PUBLIC_SUPABASE_URL harus berupa URL valid"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(10, "NEXT_PUBLIC_SUPABASE_ANON_KEY tidak boleh kosong"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(10, "SUPABASE_SERVICE_ROLE_KEY tidak boleh kosong").optional(),
  NEXT_PUBLIC_SITE_URL: z.string().optional().default("https://esport-sumbar.vercel.app"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

export type Env = z.infer<typeof envSchema>;

let validatedEnv: Env | null = null;

export function getEnv(): Env {
  if (validatedEnv) return validatedEnv;

  const parsed = envSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-esport-sumbar.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key",
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NODE_ENV: process.env.NODE_ENV,
  });

  if (!parsed.success) {
    console.error("❌ Kesalahan Konfigurasi Variabel Lingkungan:", parsed.error.format());
    throw new Error("Variabel lingkungan tidak valid. Periksa berkas .env Anda.");
  }

  validatedEnv = parsed.data;
  return validatedEnv;
}
