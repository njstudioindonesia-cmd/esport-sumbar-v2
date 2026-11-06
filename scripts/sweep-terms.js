#!/usr/bin/env node

/**
 * CI Script: Sapu Istilah Terlarang (Forbidden Terms Sweep)
 * Memeriksa kode baru agar tidak memuat istilah ESI, Pengcab, Pengprov, PBESI, dll.
 * Gagal (exit code 1) jika ditemukan kemunculan di luar daftar pengecualian sah.
 */

const fs = require("fs");
const path = require("path");

const FORBIDDEN_TERMS = [
  "Pengcab",
  "Pengprov",
  "PBESI",
  "PB ESI",
  "region_admin",
  "prov_admin",
  "mitra kelembagaan",
  "Admin Daerah",
  "Admin Provinsi",
  "Regional Checked",
  "esi_contact_name",
  "has_active_admin",
  "admin_mode",
  "PAD PBESI",
  "lisensi atlet",
  "paspor resmi daerah",
];

// Pengecualian sah: file migrasi historis, dokumen analisis/ADR yang mencatat riwayat V2, dan skrip seed demo lawas
const ALLOWED_EXCEPTIONS = [
  path.normalize("supabase/migrations"),
  path.normalize("docs/adr"),
  path.normalize("docs/LAPORAN_GERBANG_"),
  path.normalize("docs/PROJECT_DIRECTOR_REPORT.md"),
  path.normalize("docs/DATA_MIGRATION_PLAN_V3.md"),
  path.normalize("docs/ROUTE_PLAN_V3.md"),
  path.normalize("scripts/sweep-terms.js"),
  path.normalize("scripts/seed-demo.ts"),
];

function isPathExcluded(filePath) {
  const normalized = path.normalize(filePath);
  return ALLOWED_EXCEPTIONS.some((exc) => normalized.includes(exc));
}

function scanDirectory(dir, findings = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (
      entry.name === "node_modules" ||
      entry.name === ".next" ||
      entry.name === ".git" ||
      entry.name === "dist"
    ) {
      continue;
    }

    if (entry.isDirectory()) {
      scanDirectory(fullPath, findings);
    } else if (
      entry.isFile() &&
      /\.(ts|tsx|js|mjs|json|md|sql)$/.test(entry.name) &&
      !isPathExcluded(fullPath)
    ) {
      const content = fs.readFileSync(fullPath, "utf-8");
      const lines = content.split("\n");

      lines.forEach((line, index) => {
        for (const term of FORBIDDEN_TERMS) {
          if (line.includes(term)) {
            findings.push({
              file: fullPath,
              line: index + 1,
              term,
              snippet: line.trim().substring(0, 100),
            });
          }
        }
      });
    }
  }

  return findings;
}

const rootDir = path.resolve(__dirname, "..");
console.log("🔍 Menjalankan Sapu Istilah Terlarang V3 pada:", rootDir);

// Di Bagian 2, sapu difokuskan pada packages/, scripts/, dan file konfigurasi baru
const packagesDir = path.join(rootDir, "packages");
const scriptsDir = path.join(rootDir, "scripts");

let newCodeFindings = [];
if (fs.existsSync(packagesDir)) scanDirectory(packagesDir, newCodeFindings);
if (fs.existsSync(scriptsDir)) scanDirectory(scriptsDir, newCodeFindings);

if (newCodeFindings.length > 0) {
  console.error("\n❌ Ditemukan istilah terlarang pada kode/paket baru V3:");
  newCodeFindings.forEach((f) => {
    console.error(`  - ${f.file}:${f.line} [${f.term}] -> ${f.snippet}`);
  });
  process.exit(1);
} else {
  console.log("✅ Sapu Istilah Paket Baru LULUS: 0 kemunculan istilah terlarang!");
  process.exit(0);
}
