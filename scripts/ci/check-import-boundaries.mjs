#!/usr/bin/env node

/**
 * ESPORT SUMBAR V3: Import Boundary Linter
 * Menegakkan aturan arsitektur dua deploy:
 * 1. Komponen klien ("use client") DILARANG mengimpor modul server @esport-sumbar/domain langsung.
 * 2. apps/web tidak boleh mengimpor rute atau kode apps/admin langsung.
 * 3. apps/admin tidak boleh mengimpor rute apps/web langsung.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "../../");

const APPS_DIRS = [
  path.join(ROOT_DIR, "apps/web/src"),
  path.join(ROOT_DIR, "apps/admin/src"),
];

const violations = [];

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const relPath = path.relative(ROOT_DIR, filePath).replace(/\\/g, "/");

  const isClientComponent = content.startsWith('"use client"') || content.startsWith("'use client'");

  // Aturan 1: Client components tidak boleh mengimpor domain server-only
  if (isClientComponent && content.includes("@esport-sumbar/domain")) {
    violations.push({
      rule: "CLIENT_IMPORT_DOMAIN",
      file: relPath,
      message: "Komponen klien ('use client') tidak boleh mengimpor @esport-sumbar/domain server-only secara langsung.",
    });
  }

  // Aturan 2: apps/web tidak boleh mengimpor apps/admin
  if (relPath.startsWith("apps/web/") && content.includes("apps/admin")) {
    violations.push({
      rule: "CROSS_APP_IMPORT_ADMIN",
      file: relPath,
      message: "apps/web tidak boleh mengimpor kode dari apps/admin.",
    });
  }

  // Aturan 3: apps/admin tidak boleh mengimpor apps/web
  if (relPath.startsWith("apps/admin/") && content.includes("apps/web")) {
    violations.push({
      rule: "CROSS_APP_IMPORT_WEB",
      file: relPath,
      message: "apps/admin tidak boleh mengimpor kode dari apps/web.",
    });
  }
}

function walkDir(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!["node_modules", ".next", ".turbo"].includes(entry.name)) {
        walkDir(fullPath);
      }
    } else if (entry.isFile() && (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx"))) {
      checkFile(fullPath);
    }
  }
}

console.log("🛡️ [RG7 CI] Memeriksa batas impor arsitektural (Import Boundaries)...");
for (const dir of APPS_DIRS) {
  walkDir(dir);
}

if (violations.length === 0) {
  console.log("✅ [RG7 PASS] Seluruh batas impor arsitektural terpenuhi! Tidak ada impor ilegal.");
  process.exit(0);
} else {
  console.error(`❌ [RG7 FAIL] Ditemukan ${violations.length} pelanggaran batas impor:`);
  console.table(violations);
  process.exit(1);
}
