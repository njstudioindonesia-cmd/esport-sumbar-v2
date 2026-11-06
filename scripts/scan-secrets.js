#!/usr/bin/env node

/**
 * CI Script: Pemindai Rahasia Bocor (Secret Scanner)
 * Memeriksa seluruh file repositori dari kunci API, service_role key, private key yang ter-hardcode.
 */

const fs = require("fs");
const path = require("path");

const SECRET_PATTERNS = [
  /eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g, // Supabase JWT service role keys
  /-----BEGIN PRIVATE KEY-----/g,
  /-----BEGIN RSA PRIVATE KEY-----/g,
  /ghp_[a-zA-Z0-9]{36}/g, // GitHub Personal Access Token
  /sk_live_[0-9a-zA-Z]{24}/g, // Stripe Live Secret Key
  /SG\.[a-zA-Z0-9_-]{22}\.[a-zA-Z0-9_-]{43}/g, // SendGrid API Key
];

const IGNORED_DIRS = new Set([
  "node_modules",
  ".next",
  ".git",
  "dist",
  ".turbo",
]);

function scanFile(filePath, leaks = []) {
  if (
    filePath.endsWith("scan-secrets.js") ||
    filePath.endsWith(".png") ||
    filePath.endsWith(".ico") ||
    filePath.endsWith(".jpg") ||
    filePath.endsWith(".svg") ||
    filePath.endsWith(".lock") ||
    filePath.endsWith(".log")
  ) {
    return leaks;
  }

  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");

  lines.forEach((line, index) => {
    // Abaikan baris komentar mock/placeholder
    if (line.includes("placeholder-") || line.includes("dummy-key")) return;

    for (const pattern of SECRET_PATTERNS) {
      if (pattern.test(line)) {
        leaks.push({
          file: filePath,
          line: index + 1,
          snippet: line.trim().substring(0, 50) + "...",
        });
      }
    }
  });

  return leaks;
}

function scanDir(dir, leaks = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (IGNORED_DIRS.has(entry.name)) continue;

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDir(fullPath, leaks);
    } else if (entry.isFile()) {
      scanFile(fullPath, leaks);
    }
  }

  return leaks;
}

const rootDir = path.resolve(__dirname, "..");
console.log("🔐 Memindai potensi rahasia bocor di:", rootDir);

const leaks = scanDir(rootDir);

if (leaks.length > 0) {
  console.error("\n❌ BAHAYA: Ditemukan rahasia/token ter-hardcode di kode:");
  leaks.forEach((l) => console.error(`  - ${l.file}:${l.line} -> ${l.snippet}`));
  process.exit(1);
} else {
  console.log("✅ Pemindaian Rahasia LULUS: 0 rahasia ter-hardcode ditemukan!");
  process.exit(0);
}
