const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.resolve(__dirname, "..");

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
  { name: "FALLBACK_WILAYAH", regex: /\bfallback\b/gi },
  { name: "KLAIM_RESMI", regex: /\b(resmi|official)\b/gi },
  { name: "KLAIM_SAH", regex: /\b(sah|sah\s+hukum|pengesahan)\b/gi },
  { name: "KLAIM_AKREDITASI", regex: /\b(akreditasi|terakreditasi|tersertifikasi)\b/gi },
  { name: "KLAIM_LISENSI_PAD", regex: /\b(lisensi\s+atlet|PAD)\b/gi },
  { name: "KLAIM_KEPATUHAN_HUKUM", regex: /\b(kepatuhan\s+UU\s+PDP|patuh\s+(100%|UU\s+PDP))\b/gi },
  { name: "KLAIM_BERDAULAT", regex: /\b(berdaulat|kedaulatan)\b/gi },
  { name: "KLAIM_RATING_DIRI", regex: /\b(A\+|predikat\s+A\+|Excellent)\b/g },
];

// Legitimate exceptions:
// (a) historic migration files (supabase/migrations)
// (b) historic audit reports that documented past V2 state (docs/LAPORAN_GERBANG_*, docs/adr)
// (c) scripts/audit-deep-terms.js itself
const EXCLUDED_PATHS = [
  path.normalize("supabase/migrations"),
  path.normalize("docs/adr"),
  path.normalize("docs/LAPORAN_GERBANG_"),
  path.normalize("docs/PROJECT_DIRECTOR_REPORT.md"),
  path.normalize("docs/DATA_MIGRATION_PLAN_V3.md"),
  path.normalize("docs/ROUTE_PLAN_V3.md"),
  path.normalize("docs/PROJECT_DIRECTOR_EXECUTIVE_REPORT.md"),
  path.normalize("docs/COMPREHENSIVE_MULTIDISCIPLINARY_REPORT.md"),
  path.normalize("scripts/audit-deep-terms.js"),
];

function isExcluded(filePath) {
  const norm = path.normalize(filePath);
  return EXCLUDED_PATHS.some((exc) => norm.includes(exc));
}

function scanDir(dir, findings) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (["node_modules", ".next", ".git", "dist", ".turbo", "backups"].includes(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDir(fullPath, findings);
    } else if (entry.isFile()) {
      if (isExcluded(fullPath)) continue;
      // Check code, assets, svg, json, txt, etc.
      if (!/\.(ts|tsx|js|mjs|cjs|json|svg|html|css|md|txt)$/.test(entry.name)) continue;

      try {
        const content = fs.readFileSync(fullPath, "utf-8");
        const lines = content.split("\n");
        lines.forEach((line, idx) => {
          for (const rule of FORBIDDEN_RULES) {
            // Reset regex state
            rule.regex.lastIndex = 0;
            const matches = line.match(rule.regex);
            if (matches) {
              findings.push({
                file: path.relative(ROOT_DIR, fullPath),
                line: idx + 1,
                rule: rule.name,
                matches: Array.from(new Set(matches)),
                snippet: line.trim().substring(0, 120),
              });
            }
          }
        });
      } catch (err) {
        // ignore read error on binary
      }
    }
  }
}

const findings = [];
scanDir(ROOT_DIR, findings);

console.log(`\n======================================================`);
console.log(`🔍 AUDIT TERPERINCI KODE & ASET TERHADAP ISTILAH/KLAIM TERLARANG`);
console.log(`======================================================`);
console.log(`Total temuan: ${findings.length}`);

// Group by rule
const byRule = {};
findings.forEach((f) => {
  byRule[f.rule] = (byRule[f.rule] || 0) + 1;
});
console.log("\nDistribusi Temuan per Aturan:");
console.table(byRule);

// Group by top directory
const byDir = {};
findings.forEach((f) => {
  const topDir = f.file.split(path.sep).slice(0, 3).join(path.sep);
  byDir[topDir] = (byDir[topDir] || 0) + 1;
});
console.log("\nDistribusi Temuan per Direktori:");
console.table(byDir);

// Output sample findings
console.log("\nSample Temuan (maksimal 30):");
findings.slice(0, 30).forEach((f) => {
  console.log(`- [${f.rule}] ${f.file}:${f.line} -> "${f.matches.join(", ")}" | ${f.snippet}`);
});

fs.writeFileSync(
  path.join(ROOT_DIR, "scripts", "audit-findings.json"),
  JSON.stringify(findings, null, 2)
);
console.log(`\nHasil lengkap disimpan di scripts/audit-findings.json`);
