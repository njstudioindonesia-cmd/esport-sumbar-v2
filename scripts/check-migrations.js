#!/usr/bin/env node

/**
 * CI Script: Validator Integritas Migrasi Basis Data
 * Memastikan setiap berkas migrasi mengikuti konvensi penamaan YYYYMMDDHHMMSS_*.sql
 */

const fs = require("fs");
const path = require("path");

const migrationsDir = path.resolve(__dirname, "..", "supabase", "migrations");
console.log("🗄️  Memeriksa integritas berkas migrasi Supabase di:", migrationsDir);

if (!fs.existsSync(migrationsDir)) {
  console.log("⚠️ Direktori migrasi tidak ditemukan.");
  process.exit(0);
}

const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith(".sql"));
const MIGRATION_REGEX = /^\d{14}_[a-zA-Z0-9_-]+\.sql$/;

let invalidFiles = [];
files.forEach((file) => {
  if (!MIGRATION_REGEX.test(file)) {
    invalidFiles.push(file);
  }
});

if (invalidFiles.length > 0) {
  console.error("\n❌ Berkas migrasi tidak sesuai format YYYYMMDDHHMMSS_*.sql:");
  invalidFiles.forEach((f) => console.error(`  - ${f}`));
  process.exit(1);
} else {
  console.log(`✅ Pemeriksaan Migrasi LULUS: ${files.length} berkas migrasi valid!`);
  process.exit(0);
}
