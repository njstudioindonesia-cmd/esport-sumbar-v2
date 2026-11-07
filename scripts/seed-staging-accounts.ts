#!/usr/bin/env tsx
/**
 * ESPORT SUMBAR V3 - Staging Accounts & Profiles Seeder
 * Membuat akun uji per bidang untuk inspeksi visual di Staging:
 * - 7 Entitas: Player, Team, Community, Campus, School, Venue, Coach
 * - 1 Platform Admin
 * Seluruh akun ditandai secara ketat dengan `is_demo = true`.
 */

import { createClient } from "@supabase/supabase-js";
import * as crypto from "crypto";
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

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY || SUPABASE_URL.includes("placeholder")) {
  console.log("ℹ️ SUPABASE_URL atau SERVICE_ROLE_KEY belum terhubung ke database live.");
  console.log("   Skrip ini dirancang untuk dijalankan saat database Staging aktif.");
  process.exit(0);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

interface StagingAccountDef {
  email: string;
  role: "user" | "platform_admin";
  entityType: "player" | "team" | "community" | "campus" | "school" | "venue" | "coach" | "none";
  displayName: string;
  slug: string;
  ign?: string;
  description: string;
}

const STAGING_ACCOUNTS: StagingAccountDef[] = [
  {
    email: "player.staging@esportsumbar.id",
    role: "user",
    entityType: "player",
    displayName: "Faisal 'Ranger' Caniago",
    slug: "faisal-ranger-caniago",
    ign: "RANGER_SB",
    description: "Atlet Player Mobile Legends Kota Padang",
  },
  {
    email: "team.staging@esportsumbar.id",
    role: "user",
    entityType: "team",
    displayName: "Silek Minang Esports",
    slug: "silek-minang-esports",
    description: "Klub Esport Profesional Sumatera Barat",
  },
  {
    email: "community.staging@esportsumbar.id",
    role: "user",
    entityType: "community",
    displayName: "Komunitas Esport Bukittinggi",
    slug: "komunitas-esport-bukittinggi",
    description: "Komunitas Pegiat Esport Jam Gadang",
  },
  {
    email: "campus.staging@esportsumbar.id",
    role: "user",
    entityType: "campus",
    displayName: "UKM Esport Universitas Andalas",
    slug: "ukm-esport-unand",
    description: "Unit Kegiatan Mahasiswa Esport Kampus Limau Manis",
  },
  {
    email: "school.staging@esportsumbar.id",
    role: "user",
    entityType: "school",
    displayName: "Ekskul Esport SMAN 1 Padang",
    slug: "ekskul-esport-sman-1-padang",
    description: "Ekskul Pembinaan Siswa Berprestasi",
  },
  {
    email: "venue.staging@esportsumbar.id",
    role: "user",
    entityType: "venue",
    displayName: "Minang Cyber Arena Padang",
    slug: "minang-cyber-arena-padang",
    description: "Arena Gaming & Bootcamp Standar Turnamen",
  },
  {
    email: "coach.staging@esportsumbar.id",
    role: "user",
    entityType: "coach",
    displayName: "Coach Budi Setiawan",
    slug: "coach-budi-setiawan",
    description: "Pelatih Taktikal Mobile Legends & Valorant",
  },
  {
    email: "admin.staging@esportsumbar.id",
    role: "platform_admin",
    entityType: "none",
    displayName: "Administrator Staging V3",
    slug: "admin-staging",
    description: "Akun Super Administrator untuk Panel /admin",
  },
];

async function main() {
  console.log("\n========================================================");
  console.log("🛠️ PEMBUATAN AKUN UJI STAGING 7 BIDANG + ADMIN (ESPORT SUMBAR V3)");
  console.log(`🌐 Target Database: ${SUPABASE_URL}`);
  console.log("========================================================\n");

  const results: Array<{ email: string; pass: string; entity: string; role: string }> = [];

  for (const acc of STAGING_ACCOUNTS) {
    const password = `Staging2026!${crypto.randomBytes(3).toString("hex")}`;

    // 1. Buat / Dapatkan User di Auth
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email: acc.email,
      password,
      email_confirm: true,
      user_metadata: {
        display_name: acc.displayName,
        is_demo: true,
      },
    });

    let userId = userData?.user?.id;

    if (userError) {
      if (userError.message.includes("already registered")) {
        // Cari user yang sudah ada
        const { data: list } = await supabase.auth.admin.listUsers();
        const existing = list.users.find((u) => u.email?.toLowerCase() === acc.email.toLowerCase());
        if (existing) {
          userId = existing.id;
          await supabase.auth.admin.updateUserById(userId, { password });
        }
      } else {
        console.error(`❌ Gagal membuat user ${acc.email}:`, userError.message);
        continue;
      }
    }

    if (!userId) continue;

    // 2. Upsert ke tabel accounts
    await supabase.from("accounts").upsert({
      id: userId,
      email: acc.email,
      role: acc.role,
      is_active: true,
      is_demo: true,
    });

    // 3. Upsert Profil Jika Bukan Admin Murni (Keputusan P11)
    if (acc.entityType !== "none") {
      await supabase.from("profiles").upsert({
        id: userId,
        account_id: userId,
        entity_type: acc.entityType,
        display_name: acc.displayName,
        slug: acc.slug,
        bio: acc.description,
        is_demo: true,
        verification_status: "verified",
        verified_at: new Date().toISOString(),
      });
    }

    results.push({
      email: acc.email,
      pass: password,
      entity: acc.entityType,
      role: acc.role,
    });
  }

  console.log("📋 DAFTAR KREDENSIAL AKUN UJI STAGING (Dicetak 1x):");
  console.log("| Email | Password | Entitas | Peran |");
  console.log("|---|---|---|---|");
  for (const r of results) {
    console.log(`| \`${r.email}\` | \`${r.pass}\` | **${r.entity.toUpperCase()}** | ${r.role} |`);
  }
  console.log("\n✅ Seluruh akun uji staging berhasil disiapkan!");
}

main().catch((err) => {
  console.error("❌ Terjadi kegagalan:", err);
  process.exit(1);
});
