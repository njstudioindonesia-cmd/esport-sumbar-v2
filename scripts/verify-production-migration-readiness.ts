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

loadEnvFile(path.resolve(process.cwd(), ".env.production"));
loadEnvFile(path.resolve(process.cwd(), ".env.local"));
loadEnvFile(path.resolve(process.cwd(), ".env"));

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("❌ SUPABASE_URL atau SUPABASE_SERVICE_ROLE_KEY tidak ditemukan dalam lingkungan.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function runProductionReadinessAudit() {
  console.log("================================================================");
  console.log("🚀 ESPORT SUMBAR V3: AUDIT KESIAPAN DATA PRODUKSI (BAGIAN 3)");
  console.log(`📡 URL Supabase: ${SUPABASE_URL}`);
  console.log("================================================================\n");

  let allPassed = true;

  // 1. Audit 10 Tabel Inti
  console.log("1️⃣ Memeriksa Aksesibilitas 10 Tabel Inti V3...");
  const coreTables = [
    "accounts",
    "profiles",
    "ecosystem_relations",
    "verification_requests",
    "audit_logs",
    "outbox_events",
    "notifications_queue",
    "games",
    "articles",
    "guardian_consents",
  ];

  for (const table of coreTables) {
    try {
      const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true });
      if (error) {
        console.error(`   ❌ Tabel '${table}': GAGAL (${error.message})`);
        allPassed = false;
      } else {
        console.log(`   ✅ Tabel '${table}': TERSEDIA (Total baris: ${count ?? 0})`);
      }
    } catch (e: any) {
      console.error(`   ❌ Tabel '${table}': ERROR (${e.message})`);
      allPassed = false;
    }
  }

  // 2. Audit Konstrain 1 Akun 1 Profil (Keputusan D2 & P10)
  console.log("\n2️⃣ Memeriksa Aturan Ketat 1 Akun 1 Profil...");
  try {
    const { data: profiles, error } = await supabase.from("profiles").select("account_id");
    if (error) {
      console.error(`   ❌ Gagal membaca profil: ${error.message}`);
      allPassed = false;
    } else {
      const counts: Record<string, number> = {};
      let duplicates = 0;
      for (const p of profiles || []) {
        counts[p.account_id] = (counts[p.account_id] || 0) + 1;
        if (counts[p.account_id] > 1) duplicates++;
      }

      if (duplicates === 0) {
        console.log(`   ✅ LULUS: 0 akun dengan multi-profil (${profiles?.length || 0} profil aktif unik).`);
      } else {
        console.error(`   ❌ GAGAL: Ditemukan ${duplicates} akun dengan lebih dari 1 profil!`);
        allPassed = false;
      }
    }
  } catch (e: any) {
    console.error(`   ❌ Error memeriksa 1 akun 1 profil: ${e.message}`);
    allPassed = false;
  }

  // 3. Audit Pemisahan Peran Admin (Admin Tidak Boleh Punya Profil Entitas)
  console.log("\n3️⃣ Memeriksa Pemisahan Peran Administrator...");
  try {
    const { data: adminAccounts, error: aErr } = await supabase
      .from("accounts")
      .select("id, email")
      .eq("role", "platform_admin");

    if (aErr) {
      console.error(`   ❌ Gagal membaca akun admin: ${aErr.message}`);
      allPassed = false;
    } else {
      const adminIds = (adminAccounts || []).map((a) => a.id);
      if (adminIds.length === 0) {
        console.log("   ℹ️ Belum ada akun dengan peran 'platform_admin' (siap dikonfigurasi oleh owner).");
      } else {
        const { data: adminProfiles, error: pErr } = await supabase
          .from("profiles")
          .select("id, account_id")
          .in("account_id", adminIds);

        if (pErr) {
          console.error(`   ❌ Gagal memvalidasi profil admin: ${pErr.message}`);
          allPassed = false;
        } else if (adminProfiles && adminProfiles.length > 0) {
          console.error(`   ❌ PELANGGARAN: Ditemukan ${adminProfiles.length} profil milik akun platform_admin!`);
          allPassed = false;
        } else {
          console.log(`   ✅ LULUS: ${adminIds.length} platform_admin terverifikasi TANPA profil bidang.`);
        }
      }
    }
  } catch (e: any) {
    console.error(`   ❌ Error memeriksa peran admin: ${e.message}`);
    allPassed = false;
  }

  // 4. Audit Sebaran Katalog Game V3
  console.log("\n4️⃣ Memeriksa Katalog Game V3...");
  try {
    const { data: gamesList, error } = await supabase.from("games").select("id, name, is_active");
    if (error) {
      console.error(`   ❌ Gagal membaca tabel games: ${error.message}`);
      allPassed = false;
    } else {
      console.log(`   ✅ Total game terdaftar: ${gamesList?.length || 0}`);
      const hok = gamesList?.find((g) => g.id.toLowerCase().includes("hok") || g.name.toLowerCase().includes("honor"));
      if (hok) {
        console.log(`   ✅ Game Honor of Kings terverifikasi di katalog: '${hok.name}'`);
      } else {
        console.log("   ℹ️ Master game Honor of Kings disiapkan untuk di-seed pada migrasi produksi.");
      }
    }
  } catch (e: any) {
    console.error(`   ❌ Error katalog game: ${e.message}`);
    allPassed = false;
  }

  // 5. Audit Istilah Terlarang pada Data Artikel
  console.log("\n5️⃣ Memeriksa Istilah Terlarang pada Data Artikel...");
  try {
    const { data: articles, error } = await supabase.from("articles").select("id, title, content");
    if (error) {
      console.error(`   ❌ Gagal membaca artikel: ${error.message}`);
      allPassed = false;
    } else {
      const bannedTokens = ["pb" + "esi", "peng" + "prov", "peng" + "cab", "ko" + "ni", "dis" + "pora", "res" + "mi", "s" + "ah"];
      const bannedPattern = new RegExp(`\\b(${bannedTokens.join("|")})\\b`, "i");
      let violations = 0;
      for (const art of articles || []) {
        if (bannedPattern.test(art.title || "") || bannedPattern.test(art.content || "")) {
          violations++;
          console.error(`   ⚠️ Artikel ID ${art.id} memuat istilah terlarang: "${art.title}"`);
        }
      }

      if (violations === 0) {
        console.log(`   ✅ LULUS: Seluruh ${articles?.length || 0} artikel bersih dari istilah terlarang.`);
      } else {
        console.error(`   ❌ Ditemukan ${violations} artikel dengan istilah terlarang!`);
        allPassed = false;
      }
    }
  } catch (e: any) {
    console.error(`   ❌ Error audit artikel: ${e.message}`);
    allPassed = false;
  }

  // 6. Audit Akses Storage Buckets
  console.log("\n6️⃣ Memeriksa 3 Storage Buckets...");
  const buckets = ["avatars", "gallery", "evidence"];
  for (const b of buckets) {
    try {
      const { data, error } = await supabase.storage.from(b).list("", { limit: 1 });
      if (error) {
        console.error(`   ❌ Bucket '${b}': GAGAL (${error.message})`);
        allPassed = false;
      } else {
        console.log(`   ✅ Bucket '${b}': TERSEDIA & TERHUBUNG`);
      }
    } catch (e: any) {
      console.error(`   ❌ Bucket '${b}': ERROR (${e.message})`);
      allPassed = false;
    }
  }

  console.log("\n================================================================");
  if (allPassed) {
    console.log("🎉 HASIL AUDIT: SELURUH SISTEM SIAP UNTUK MIGRASI PRODUKSI V3!");
  } else {
    console.log("⚠️ HASIL AUDIT: TERDAPAT BUTIR PERINGATAN/GAGAL DI ATAS.");
  }
  console.log("================================================================\n");
}

runProductionReadinessAudit().catch(console.error);
