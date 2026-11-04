/**
 * ESPORT SUMBAR V2 - Demo Data Purge Script
 * Menghapus semua baris database dan aset penyimpanan yang ditandai `is_demo = true`.
 * Wajib dijalankan dengan argumen `--confirm` atau konfirmasi interaktif.
 */

import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

function loadEnvFile(envPath: string) {
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

loadEnvFile(path.resolve(process.cwd(), ".env.local"));
loadEnvFile(path.resolve(process.cwd(), ".env"));

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function purgeDemoData() {
  console.log("\n========================================================");
  console.log("🧹 PEMBERSIHAN DATA DEMO (PURGE DEMO DATA)");
  console.log("========================================================\n");

  const hasConfirmed = process.argv.includes("--confirm");

  if (!hasConfirmed) {
    console.warn("⚠️  PERINGATAN: Perintah pembersihan memerlukan konfirmasi eksplisit.");
    console.log("👉 Jalankan dengan flag --confirm untuk melanjutkan:");
    console.log("   npx tsx scripts/purge-demo.ts --confirm\n");
    process.exit(0);
  }

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error("❌ ERROR: SUPABASE_URL atau SUPABASE_SERVICE_ROLE_KEY tidak ditemukan.");
    console.log("   Pastikan variabel tersebut telah disetel di .env.local atau environment.");
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log("🔍 Menghitung baris berstatus `is_demo = true`...");

  try {
    // 1. Hitung profil demo
    const { count: profileCount, error: countErr } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("is_demo", true);

    if (countErr) {
      console.warn("   ⚠️  Gagal menghitung profil demo:", countErr.message);
    } else {
      console.log(`   Ditemukan: ${profileCount || 0} profil demo.`);
    }

    // 2. Hapus aset media demo
    console.log("🗑️  [1/4] Menghapus aset media profil demo...");
    await supabase.from("media_assets").delete().eq("is_demo", true);

    // 3. Hapus relasi keanggotaan demo
    console.log("🗑️  [2/4] Menghapus riwayat relasi/keanggotaan demo...");
    await supabase.from("memberships").delete().eq("is_demo", true);

    // 4. Hapus prestasi demo
    console.log("🗑️  [3/4] Menghapus piagam prestasi demo...");
    await supabase.from("achievements").delete().eq("is_demo", true);

    // 5. Hapus profil demo
    console.log("🗑️  [4/4] Menghapus profil entitas demo...");
    const { error: delErr } = await supabase.from("profiles").delete().eq("is_demo", true);

    if (delErr) {
      console.error("   ❌ Gagal menghapus profil demo:", delErr.message);
    } else {
      console.log("   ✓ Seluruh profil demo berhasil dihapus bersih.");
    }

    console.log("\n========================================================");
    console.log("✅ PEMBERSIHAN DATA DEMO SELESAI DENGAN SUKSES.");
    console.log("   Sistem kini bersih dan siap untuk data registrasi nyata.");
    console.log("========================================================\n");
  } catch (err) {
    console.error("❌ Terjadi kesalahan saat pembersihan:", err);
    process.exit(1);
  }
}

purgeDemoData().catch(console.error);
