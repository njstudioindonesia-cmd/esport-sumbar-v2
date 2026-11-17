#!/usr/bin/env node

/**
 * ESPORT SUMBAR V3: Automated Design Token & Anti-Template Linter
 * Memindai berkas sumber frontend untuk memastikan 0 pelanggaran:
 * - Tidak ada glow / neon kelas dekoratif
 * - Tidak ada font usang di luar token resmi (Saira, Rajdhani)
 * - Tidak ada istilah terlarang ("paspor")
 * - Tidak ada label teks mikro illegible (< 11px)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "../../");

const SEARCH_DIRS = [
  path.join(ROOT_DIR, "apps/web/src"),
  path.join(ROOT_DIR, "packages/ui/src"),
  path.join(ROOT_DIR, "packages/design-tokens/src"),
];

// Pola pelanggaran anti-templat & aturan desain keras
const LINT_RULES = [
  {
    id: "BANNED_GLOW",
    name: "Penggunaan efek glow / neon dekoratif",
    pattern: /\b(pink-glow|gold-glow|neon-glow|drop-shadow-\[0_0_)\b/i,
    severity: "CRITICAL",
  },
  {
    id: "BANNED_FONT",
    name: "Penggunaan font usang di luar token resmi",
    pattern: /\b(Rajdhani|Saira_Condensed)\b/,
    severity: "CRITICAL",
    exclude: ["scripts/ci", "docs/"],
  },
  {
    id: "BANNED_TERM_PASPOR",
    name: "Penggunaan istilah terlarang 'paspor'",
    pattern: /\bpaspor\b/i,
    severity: "CRITICAL",
    exclude: ["scripts/ci", "docs/"],
  },
  {
    id: "ILLEGIBLE_MICRO_TEXT",
    name: "Teks mikro di bawah 11px berjarak huruf lebar",
    pattern: /\btext-\[(?:8|9|10)px\]\s+[^"']*tracking-widest\b/i,
    severity: "WARNING",
  },
];

const EXTENSIONS = [".ts", ".tsx", ".css", ".jsx", ".js"];
const EXCLUDE_DIRS = ["node_modules", ".next", ".turbo", "dist", ".git"];

let totalFilesScanned = 0;
const violations = [];

function scanDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!EXCLUDE_DIRS.includes(entry.name)) {
        scanDirectory(fullPath);
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (EXTENSIONS.includes(ext)) {
        totalFilesScanned++;
        lintFile(fullPath);
      }
    }
  }
}

function lintFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const relPath = path.relative(ROOT_DIR, filePath);
  const lines = content.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    for (const rule of LINT_RULES) {
      if (rule.exclude && rule.exclude.some((ex) => relPath.replace(/\\/g, "/").includes(ex))) {
        continue;
      }

      if (rule.pattern.test(line)) {
        violations.push({
          ruleId: rule.id,
          ruleName: rule.name,
          severity: rule.severity,
          file: relPath.replace(/\\/g, "/"),
          line: i + 1,
          snippet: line.trim(),
        });
      }
    }
  }
}

console.log("🎨 [RG10 LINT] Memeriksa kepatuhan token desain dan aturan anti-templat...");
for (const dir of SEARCH_DIRS) {
  scanDirectory(dir);
}

console.log(`📁 Memindai ${totalFilesScanned} berkas sumber UI & desain...`);

if (violations.length === 0) {
  console.log("✅ [RG10 PASS] 0 pelanggaran token atau anti-templat terdeteksi!");
  console.log("   Seluruh komponen dan gaya mematuhi sistem token Arah B (Matte Glass).");
  process.exit(0);
} else {
  console.error(`❌ [RG10 FAIL] Ditemukan ${violations.length} pelanggaran token desain:`);
  console.table(
    violations.map((v) => ({
      Rule: v.ruleId,
      Severity: v.severity,
      Location: `${v.file}:${v.line}`,
      Snippet: v.snippet.slice(0, 50),
    }))
  );
  process.exit(1);
}
