/**
 * ESPORT SUMBAR V2 - Demo Data Purge Script
 * Menghapus semua baris database dan akun uji coba yang ditandai `is_demo = true`.
 * Wajib dijalankan dengan argumen `--confirm`.
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
      let val = trimmed.slice(eqIdx + 1).trim();
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
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
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  try {
    // 1. Prestasi demo
    console.log("🗑️  [1/7] Menghapus piagam prestasi demo...");
    await supabase.from("achievements").delete().eq("is_demo", true);

    // 2. Relasi keanggotaan demo
    console.log("🗑️  [2/7] Menghapus riwayat relasi/keanggotaan...");
    // Hapus memberships yang terikat profil demo
    const { data: demoProfiles } = await supabase.from("profiles").select("id").eq("is_demo", true);
    const demoProfileIds = demoProfiles?.map((p) => p.id) || [];
    if (demoProfileIds.length > 0) {
      await supabase.from("memberships").delete().in("member_profile_id", demoProfileIds);
      await supabase.from("memberships").delete().in("org_profile_id", demoProfileIds);
    }

    // 3. Permintaan verifikasi demo
    console.log("🗑️  [3/7] Menghapus pengajuan verifikasi demo...");
    await supabase.from("verification_requests").delete().eq("is_demo", true);

    // 4. Profil demo
    console.log("🗑️  [4/7] Menghapus seluruh profil entitas demo...");
    const { error: delErr } = await supabase.from("profiles").delete().eq("is_demo", true);
    if (delErr) {
      console.error("   ❌ Gagal menghapus profil demo:", delErr.message);
    } else {
      console.log(`   ✓ ${demoProfileIds.length} Profil demo berhasil dihapus.`);
    }

    // 5. Artikel berita demo
    console.log("🗑️  [5/7] Menghapus artikel berita demo...");
    await supabase.from("articles").delete().eq("is_demo", true);

    // 6. Akun demo
    console.log("🗑️  [6/7] Menghapus akun demo di auth.users...");
    const { data: demoAccounts } = await supabase.from("accounts").select("id, email").eq("is_demo", true);
    if (demoAccounts && demoAccounts.length > 0) {
      for (const acc of demoAccounts) {
        await supabase.auth.admin.deleteUser(acc.id);
      }
      console.log(`   ✓ ${demoAccounts.length} Akun demo berhasil dihapus.`);
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
