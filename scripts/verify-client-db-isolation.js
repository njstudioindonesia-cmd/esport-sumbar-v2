const fs = require("fs");
const path = require("path");
const cp = require("child_process");

console.log("🔒 Memeriksa Isolasi Basis Data Klien (Sub-langkah 7.7: Zero Direct DB Access from Web)...");

const projectRoot = path.resolve(__dirname, "..");
const webSrcDir = path.join(projectRoot, "apps", "web", "src");

// Ambil semua file di apps/web/src
function getAllFiles(dir, fileList = []) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      if (item.name !== "node_modules" && item.name !== ".next") {
        getAllFiles(fullPath, fileList);
      }
    } else if (item.isFile() && (item.name.endsWith(".ts") || item.name.endsWith(".tsx"))) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const allFiles = getAllFiles(webSrcDir);
const directQueryViolations = [];
const serviceRoleKeyViolations = [];

for (const filePath of allFiles) {
  const content = fs.readFileSync(filePath, "utf8");
  const relativePath = path.relative(projectRoot, filePath).replace(/\\/g, "/");

  const isClientComponent = content.includes('"use client"') || content.includes("'use client'");

  // 1. Klien komponen TIDAK BOLEH memanggil .from("tabel") langsung ke database
  if (isClientComponent) {
    const fromMatch = content.match(/\.from\s*\(\s*["']([a-zA-Z0-9_]+)["']\s*\)/g);
    if (fromMatch) {
      // Pastikan bukan Array.from
      const actualDbCalls = fromMatch.filter(m => !content.includes("Array" + m));
      if (actualDbCalls.length > 0) {
        directQueryViolations.push({
          file: relativePath,
          calls: actualDbCalls,
        });
      }
    }
  }

  // 2. Klien komponen TIDAK BOLEH mengimpor atau mengakses SUPABASE_SERVICE_ROLE_KEY
  if (isClientComponent) {
    if (content.includes("SUPABASE_SERVICE_ROLE_KEY") || content.includes("service_role")) {
      serviceRoleKeyViolations.push({
        file: relativePath,
      });
    }
  }
}

let hasError = false;

if (directQueryViolations.length > 0) {
  console.error("❌ DITEMUKAN PELANGGARAN DIRECT DB ACCESS DI KOMPONEN KLIEN:");
  for (const v of directQueryViolations) {
    console.error(`   - ${v.file}: ${v.calls.join(", ")}`);
  }
  hasError = true;
} else {
  console.log("✅ 100% LULUS: Nol kueri langsung basis data (.from) di seluruh komponen klien (UI)!");
}

if (serviceRoleKeyViolations.length > 0) {
  console.error("❌ DITEMUKAN KUNCI SERVICE ROLE DI KOMPONEN KLIEN:");
  for (const v of serviceRoleKeyViolations) {
    console.error(`   - ${v.file}`);
  }
  hasError = true;
} else {
  console.log("✅ 100% LULUS: Nol referensi SUPABASE_SERVICE_ROLE_KEY di seluruh komponen klien (UI)!");
}

if (hasError) {
  process.exit(1);
} else {
  console.log("🎉 Isolasi BFF & Proteksi Klien Browser ESPORT SUMBAR V3 Berhasil Diverifikasi Penuh!");
  process.exit(0);
}
