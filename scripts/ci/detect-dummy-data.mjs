#!/usr/bin/env node
/**
 * ==============================================================================
 * ESPORT SUMBAR V3 - GERBANG RG5: PEMINDAI DATA DUMMY & ISTILAH TERLARANG
 * ==============================================================================
 * Skrip CI otomatis untuk memastikan tidak ada data tiruan (dummy), persona fiktif,
 * impor mockCards/mockNews/mockAdminData, atau istilah terlarang "paspor" yang
 * bocor ke dalam kode produksi.
 * ==============================================================================
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "../..");

const SCAN_DIRS = [
  path.join(ROOT_DIR, "apps/web/src"),
  path.join(ROOT_DIR, "packages/contracts/src"),
  path.join(ROOT_DIR, "packages/lib/src"),
];

// Pola terlarang yang tidak boleh ada di kode aplikasi produksi
const BANNED_PATTERNS = [
  {
    name: "Persona Atlet Fiktif Terlarang (SUTAN_AIM)",
    regex: /\bSUTAN_AIM\b/,
    description: "Nama atlet mock Sutan Aim terdeteksi.",
  },
  {
    name: "Persona Atlet Fiktif Terlarang (MARAWA_KING)",
    regex: /\bMARAWA_KING\b/,
    description: "Nama atlet mock Marawa King terdeteksi.",
  },
  {
    name: "Persona Atlet Fiktif Terlarang (SINGA_SINGKARAK)",
    regex: /\bSINGA_SINGKARAK\b/,
    description: "Nama atlet mock Singa Singkarak terdeteksi.",
  },
  {
    name: "Persona Atlet Fiktif Terlarang (TACTICIAN_HEN)",
    regex: /\bTACTICIAN_HEN\b/,
    description: "Nama atlet mock Tactician Hen terdeteksi.",
  },
  {
    name: "ESPORT ID Mock V1/V2 Terlarang (ESB-PDG-PL-000124)",
    regex: /\bESB-PDG-PL-000124\b/,
    description: "Format ID lama/mock terdeteksi di antarmuka.",
  },
  {
    name: "Impor Mock Cards Liar (@/data/mockCards)",
    regex: /from\s+["']@\/data\/mockCards["']/,
    description: "Impor langsung berkas mockCards terlarang di UI produksi.",
  },
  {
    name: "Impor Mock News Liar (@/data/mockNews)",
    regex: /from\s+["']@\/data\/mockNews["']/,
    description: "Impor langsung berkas mockNews terlarang di UI produksi.",
  },
  {
    name: "Impor Mock Admin Liar (@/data/mockAdminData)",
    regex: /from\s+["']@\/data\/mockAdminData["']/,
    description: "Impor langsung berkas mockAdminData terlarang di UI produksi.",
  },
  {
    name: "Istilah Terlarang: Paspor Digital",
    regex: /\bpaspor(\s+digital)?\b/i,
    description: "Penggunaan istilah terlarang 'paspor' dalam konteks identitas atlet.",
  },
];

// Berkas yang dikecualikan dari pemindaian tertentu
const EXCLUDE_FILES = [
  "mockCards.ts",
  "mockNews.ts",
  "mockAdminData.ts",
];

function scanDirectory(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (
        entry.name === "node_modules" ||
        entry.name === ".next" ||
        entry.name === "dist" ||
        entry.name === "__tests__"
      ) {
        continue;
      }
      scanDirectory(fullPath, fileList);
    } else if (entry.isFile() && /\.(tsx?|jsx?|mjs|cjs)$/.test(entry.name)) {
      if (!EXCLUDE_FILES.includes(entry.name)) {
        fileList.push(fullPath);
      }
    }
  }
  return fileList;
}

function runScanner() {
  console.log("🔍 [RG5 CI] Menjalankan pemindai data dummy & istilah terlarang...");
  let violationsCount = 0;
  const filesToScan = SCAN_DIRS.flatMap((d) => scanDirectory(d));

  console.log(`📁 Memindai ${filesToScan.length} berkas sumber produksi...`);

  for (const filePath of filesToScan) {
    const relativePath = path.relative(ROOT_DIR, filePath).replace(/\\/g, "/");
    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.split("\n");

    lines.forEach((line, lineIdx) => {
      for (const pattern of BANNED_PATTERNS) {
        if (pattern.regex.test(line)) {
          // Abaikan komentar dokumentasi yang secara eksplisit membahas larangan
          if (line.includes("banned") || line.includes("terlarang") || line.includes("dilarang")) {
            continue;
          }
          console.error(
            `❌ [PELANGGARAN RG5] ${pattern.name} di ${relativePath}:${lineIdx + 1}`
          );
          console.error(`   Baris: ${line.trim()}`);
          console.error(`   Deskripsi: ${pattern.description}\n`);
          violationsCount++;
        }
      }
    });
  }

  if (violationsCount > 0) {
    console.error(`🚫 Ditemukan ${violationsCount} pelanggaran aturan RG5.`);
    console.error("   Harap perbaiki seluruh data dummy atau istilah terlarang sebelum rilis.");
    process.exit(1);
  }

  console.log("✅ [RG5 PASS] 0 pelanggaran data dummy atau istilah terlarang terdeteksi!");
  console.log("   Seluruh kode produksi bersih dan memenuhi Gerbang Mutu Rilis RG5.");
}

runScanner();
