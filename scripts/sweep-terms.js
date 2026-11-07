#!/usr/bin/env node

/**
 * CI Script: Sapu Istilah & Klaim Terlarang V3 (Super Sweep)
 * Memeriksa seluruh kode sumber, aset, template, dan konfigurasi terhadap:
 * 1. Istilah terlarang: ESI, Pengcab, Pengprov, PBESI, KONI, Dispora, dll.
 * 2. Klaim terlarang: resmi, official, sah hukum, pengesahan, akreditasi, dll.
 */

const fs = require("fs");
const path = require("path");

const FORBIDDEN_RULES = [
  { name: "ESI_TERM", regex: /\b(ESI|E\.S\.I|Esi)\b/g },
  { name: "PBESI_TERM", regex: /\b(PBESI|PB\s+ESI)\b/gi },
  { name: "PENGCAB_TERM", regex: /\b(Pengcab|Pengurus\s+Cabang)\b/gi },
  { name: "PENGPROV_TERM", regex: /\b(Pengprov|Pengurus\s+Provinsi|Pengurus\s+Daerah)\b/gi },
  { name: "KONI_TERM", regex: /\bKONI\b/g },
  { name: "DISPORA_TERM", regex: /\bDispora\b/gi },
  { name: "KOMITE_OLAHRAGA", regex: /\bKomite\s+Olahraga\b/gi },
  { name: "FEDERASI_TERM", regex: /\bFederasi\b/gi },
  { name: "ADMIN_DAERAH_PROV", regex: /\b(Admin\s+Daerah|Admin\s+Provinsi|region_admin|prov_admin|Verifikator\s+Daerah|Regional\s+Checked|Provincial)\b/gi },
  { name: "VERIFIKASI_BERTAHAP", regex: /\b(Tahap\s+1|Tahap\s+2)\b/gi },
  { name: "MITRA_KELEMBAGAAN", regex: /\bmitra\s+kelembagaan\b/gi },
  { name: "KLAIM_RESMI", regex: /\b(resmi|official)\b/gi },
  { name: "KLAIM_SAH", regex: /\b(sah|sah\s+hukum|pengesahan)\b/gi },
  { name: "KLAIM_AKREDITASI", regex: /\b(akreditasi|terakreditasi|tersertifikasi)\b/gi },
  { name: "KLAIM_LISENSI_PAD", regex: /\b(lisensi\s+atlet|PAD)\b/gi },
  { name: "KLAIM_KEPATUHAN_HUKUM", regex: /\b(kepatuhan\s+UU\s+PDP|patuh\s+(100%|UU\s+PDP))\b/gi },
  { name: "KLAIM_BERDAULAT", regex: /\b(berdaulat|kedaulatan)\b/gi },
  { name: "KLAIM_RATING_DIRI", regex: /\b(A\+|predikat\s+A\+|Excellent)\b/g },
];

// Pengecualian sah yang terdokumentasi:
const ALLOWED_EXCEPTIONS = [
  path.normalize("supabase/migrations"),
  path.normalize("docs/adr"),
  path.normalize("docs/LAPORAN_GERBANG_"),
  path.normalize("docs/PROJECT_DIRECTOR_REPORT.md"),
  path.normalize("docs/DATA_MIGRATION_PLAN_V3.md"),
  path.normalize("docs/ROUTE_PLAN_V3.md"),
  path.normalize("docs/PROJECT_DIRECTOR_EXECUTIVE_REPORT.md"),
  path.normalize("docs/COMPREHENSIVE_MULTIDISCIPLINARY_REPORT.md"),
  path.normalize("scripts/sweep-terms.js"),
  path.normalize("scripts/audit-deep-terms.js"),
  path.normalize("scripts/analyze-web-findings.js"),
  path.normalize("scripts/crawler-rendered-output.js"),
  path.normalize("scripts/audit-findings.json"),
  path.normalize("scripts/crawl-rendered-findings.json"),
  path.normalize("scripts/routes-and-links-report.json"),
  path.normalize("scripts/sweep-findings.json"),
  path.normalize("scripts/filter-findings.js"),
  path.normalize("docs/MATRIKS_PERSYARATAN_S1_S5.md"),
];

function isPathExcluded(filePath) {
  const normalized = path.normalize(filePath);
  return ALLOWED_EXCEPTIONS.some((exc) => normalized.includes(exc));
}

function scanDirectory(dir, findings = []) {
  if (!fs.existsSync(dir)) return findings;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (
      entry.name === "node_modules" ||
      entry.name === ".next" ||
      entry.name === ".git" ||
      entry.name === "dist" ||
      entry.name === ".turbo" ||
      entry.name === "backups"
    ) {
      continue;
    }

    if (entry.isDirectory()) {
      scanDirectory(fullPath, findings);
    } else if (
      entry.isFile() &&
      /\.(ts|tsx|js|mjs|cjs|json|svg|html|css|md|txt)$/.test(entry.name) &&
      !isPathExcluded(fullPath)
    ) {
      const content = fs.readFileSync(fullPath, "utf-8");
      const lines = content.split("\n");

      lines.forEach((line, index) => {
        for (const rule of FORBIDDEN_RULES) {
          rule.regex.lastIndex = 0;
          const matches = line.match(rule.regex);
          if (matches) {
            findings.push({
              file: path.relative(path.resolve(__dirname, ".."), fullPath),
              line: index + 1,
              rule: rule.name,
              matches: Array.from(new Set(matches)),
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
console.log("🔍 Menjalankan Sapu Istilah Terlarang & Klaim V3 pada:", rootDir);

const findings = [];
scanDirectory(path.join(rootDir, "apps", "web"), findings);
scanDirectory(path.join(rootDir, "packages"), findings);
scanDirectory(path.join(rootDir, "scripts"), findings);

const isStrictMode = process.argv.includes("--strict");

console.log(`\n======================================================`);
console.log(`📊 LAPORAN SAPU ISTILAH & KLAIM TERLARANG`);
console.log(`======================================================`);
console.log(`Total temuan: ${findings.length}`);

if (findings.length > 0) {
  console.log(`\nDistribusi Temuan per Rule:`);
  const byRule = {};
  findings.forEach((f) => {
    byRule[f.rule] = (byRule[f.rule] || 0) + 1;
  });
  console.table(byRule);

  console.log("\nSample 15 Temuan:");
  findings.slice(0, 15).forEach((f) => {
    console.log(`  - ${f.file}:${f.line} [${f.rule}] -> "${f.matches.join(", ")}" | ${f.snippet}`);
  });

  fs.writeFileSync(path.join(rootDir, "scripts", "sweep-findings.json"), JSON.stringify(findings, null, 2));

  if (isStrictMode) {
    console.error(`\n❌ Mode ketat gagal: Ditemukan ${findings.length} istilah/klaim terlarang!`);
    process.exit(1);
  } else {
    console.log(`\nℹ️ Berjalan dalam mode diagnostik (Bagian 0). Untuk menggagalkan build CI, gunakan flag --strict.`);
    process.exit(0);
  }
} else {
  fs.writeFileSync(path.join(rootDir, "scripts", "sweep-findings.json"), JSON.stringify([], null, 2));
  console.log("✅ Sapu Istilah LULUS: 0 kemunculan istilah atau klaim terlarang!");
  process.exit(0);
}
