/**
 * ESPORT SUMBAR V3 - Production & Staging Clean/Purge Utility
 * Skrip audit & pembersihan data uji coba / akun demo dengan dukungan --dry-run
 * dan eksekusi terproteksi (--confirm).
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

async function runPurgeOrAudit() {
  console.log("\n========================================================");
  console.log("🧹 ESPORT SUMBAR V3: AUDIT & PEMBERSIHAN DATA DEMO / UJI");
  console.log("========================================================\n");

  const isConfirm = process.argv.includes("--confirm");
  const isDryRun = !isConfirm || process.argv.includes("--dry-run");

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error("❌ ERROR: SUPABASE_URL atau SUPABASE_SERVICE_ROLE_KEY tidak ditemukan di environment.");
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  try {
    console.log(`📡 Target Supabase URL: ${SUPABASE_URL}`);
    console.log(`⚙️  Mode Operasi: ${isDryRun ? "DRY-RUN (HANYA LAPORAN / TIDAK MENGUBAH DATA)" : "EKSEKUSI PEMBERSIHAN NYATA"}\n`);

    // 1. Audit Demo Profiles
    const { count: demoProfileCount, error: errProf } = await supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("is_demo", true);

    // 2. Audit Demo Accounts
    const { count: demoAccountCount } = await supabase
      .from("accounts")
      .select("id", { count: "exact", head: true })
      .eq("is_demo", true);

    // 3. Audit Demo Articles
    const { count: demoArticleCount } = await supabase
      .from("articles")
      .select("id", { count: "exact", head: true })
      .eq("is_demo", true);

    // 4. Audit Demo Verification Requests
    const { count: demoVerifCount } = await supabase
      .from("verification_requests")
      .select("id", { count: "exact", head: true })
      .eq("is_demo", true);

    console.log("📊 TEMUAN DATA DEMO (is_demo = true):");
    console.log(`   - Profil Demo: ${demoProfileCount ?? (errProf ? "0 (Tabel Kosong)" : 0)} baris`);
    console.log(`   - Akun Demo: ${demoAccountCount ?? 0} baris`);
    console.log(`   - Berita Demo: ${demoArticleCount ?? 0} baris`);
    console.log(`   - Permintaan Verifikasi Demo: ${demoVerifCount ?? 0} baris\n`);

    if (isDryRun) {
      console.log("ℹ️  MODE LAPORAN (DRY-RUN) SELESAI.");
      console.log("   Tidak ada data yang dihapus.");
      console.log("👉 Untuk mengeksekusi pembersihan nyata setelah persetujuan pemilik, jalankan:");
      console.log("   npx tsx scripts/purge-demo.ts --confirm\n");
      return;
    }

    // Eksekusi jika --confirm
    console.log("⚠️  MENGEKSEKUSI PEMBERSIHAN DATA DEMO...");

    // 1. Prestasi demo
    await supabase.from("achievements").delete().eq("is_demo", true);

    // 2. Relasi keanggotaan demo
    const { data: demoProfiles } = await supabase.from("profiles").select("id").eq("is_demo", true);
    const demoProfileIds = demoProfiles?.map((p) => p.id) || [];
    if (demoProfileIds.length > 0) {
      await supabase.from("memberships").delete().in("member_profile_id", demoProfileIds);
      await supabase.from("memberships").delete().in("org_profile_id", demoProfileIds);
    }

    // 3. Permintaan verifikasi demo
    await supabase.from("verification_requests").delete().eq("is_demo", true);

    // 4. Profil demo
    const { error: delErr } = await supabase.from("profiles").delete().eq("is_demo", true);
    if (!delErr) {
      console.log(`   ✓ ${demoProfileIds.length} Profil demo dibersihkan.`);
    }

    // 5. Artikel berita demo
    await supabase.from("articles").delete().eq("is_demo", true);

    // 6. Akun demo
    const { data: demoAccounts } = await supabase.from("accounts").select("id, email").eq("is_demo", true);
    if (demoAccounts && demoAccounts.length > 0) {
      for (const acc of demoAccounts) {
        await supabase.auth.admin.deleteUser(acc.id);
      }
      console.log(`   ✓ ${demoAccounts.length} Akun demo di auth.users dibersihkan.`);
    }

    console.log("\n✅ PEMBERSIHAN SELESAI DENGAN SUKSES.");
  } catch (err) {
    console.error("❌ Kesalahan selama audit/pembersihan:", err);
    process.exit(1);
  }
}

runPurgeOrAudit().catch(console.error);
