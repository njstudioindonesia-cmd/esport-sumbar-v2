#!/usr/bin/env node

/**
 * ESPORT SUMBAR V3: Pemeriksa Integritas Rute, Tautan & Manifest (FG5 Quality Gate)
 */

const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.resolve(__dirname, "..");
const WEB_SRC_DIR = path.join(ROOT_DIR, "apps", "web", "src");
const MANIFEST_PATH = path.join(ROOT_DIR, "docs", "MANIFEST_RUTE_V3.json");

// Baca manifest rute jika ada
let manifest = null;
if (fs.existsSync(MANIFEST_PATH)) {
  manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
}

// 1. Ekstraksi semua rute dari Next.js App Router (filesystem-based routing)
function getAppRoutes(dir, baseRoute = "") {
  let routes = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (entry.name.startsWith("(") && entry.name.endsWith(")")) {
        // Route group
        routes = routes.concat(getAppRoutes(path.join(dir, entry.name), baseRoute));
      } else if (entry.name.startsWith("_")) {
        // Private / internal folder
        continue;
      } else {
        const nextBase = `${baseRoute}/${entry.name}`;
        routes = routes.concat(getAppRoutes(path.join(dir, entry.name), nextBase));
      }
    } else if (entry.isFile()) {
      if (entry.name === "page.tsx" || entry.name === "page.ts" || entry.name === "route.ts" || entry.name === "route.tsx") {
        routes.push(baseRoute === "" ? "/" : baseRoute);
      }
    }
  }

  return routes;
}

const appDir = path.join(WEB_SRC_DIR, "app");
const fsRoutes = Array.from(new Set(getAppRoutes(appDir))).sort();

// 2. Ekstraksi semua internal link di src (href="...", router.push("..."))
function scanLinks(dir, links = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "node_modules" && entry.name !== ".next") {
        scanLinks(full, links);
      }
    } else if (entry.isFile() && /\.(tsx|ts|js|jsx)$/.test(entry.name)) {
      const content = fs.readFileSync(full, "utf-8");
      const relFile = path.relative(ROOT_DIR, full);

      // Regex matches for href="..." or href={'...'} or router.push("...") or redirect("...")
      const linkRegex = /(?:href|router\.push|redirect)\s*(?:=|\()\s*["'`]((\/[a-zA-Z0-9_\-\/\[\]]*)|\/)(?:["'`])/g;
      let match;
      while ((match = linkRegex.exec(content)) !== null) {
        const target = match[1];
        // Ignore static assets or api calls for UI navigation
        if (!target.startsWith("/_next") && !target.startsWith("/favicon")) {
          links.push({
            file: relFile,
            target: target.split("?")[0].split("#")[0],
          });
        }
      }
    }
  }

  return links;
}

const links = scanLinks(WEB_SRC_DIR);

// Normalisasi perbandingan rute
function routeMatches(target, availableRoutes) {
  if (target === "/") return true;
  if (target.startsWith("/api/")) return true; // API routes are handled by route.ts
  if (availableRoutes.includes(target)) return true;

  // Match dynamic routes like /regions/kota-padang -> /regions/[slug]
  for (const route of availableRoutes) {
    if (route.includes("[")) {
      const regexStr = "^" + route.replace(/\[\.\.\.[^\]]+\]/g, ".*").replace(/\[[^\]]+\]/g, "[^/]+") + "$";
      if (new RegExp(regexStr).test(target)) {
        return true;
      }
    }
  }
  return false;
}

console.log(`\n======================================================`);
console.log(`🧭 PEMERIKSAAN INTEGRITAS RUTE & TAUTAN INTERNAL V3`);
console.log(`======================================================`);
console.log(`Total Rute Terdaftar di Filesystem (App Router): ${fsRoutes.length}`);
console.log(`Total Tautan Navigasi Ditemukan di Kode: ${links.length}`);

const brokenLinks = [];
links.forEach((l) => {
  if (!routeMatches(l.target, fsRoutes)) {
    brokenLinks.push(l);
  }
});

console.log(`Total Tautan Berpotensi Rusak/Mati (404): ${brokenLinks.length}`);
if (brokenLinks.length > 0) {
  console.log("\n⚠️ Daftar Tautan Menuju Rute yang Tidak Ada:");
  const uniqBroken = {};
  brokenLinks.forEach((b) => {
    uniqBroken[b.target] = (uniqBroken[b.target] || []).concat(b.file);
  });
  for (const [target, files] of Object.entries(uniqBroken)) {
    console.log(`- ${target} (dipanggil dari ${files.length} berkas: ${files[0]}${files.length > 1 ? `, +${files.length - 1} lainnya` : ""})`);
  }
}

// Simpan hasil audit rute
fs.writeFileSync(
  path.join(ROOT_DIR, "scripts", "routes-and-links-report.json"),
  JSON.stringify({ fsRoutes, brokenLinks, totalLinks: links.length }, null, 2)
);
console.log(`\nLaporan disimpan di scripts/routes-and-links-report.json`);
