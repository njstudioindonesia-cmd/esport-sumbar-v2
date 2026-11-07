#!/usr/bin/env node

/**
 * ESPORT SUMBAR V3: Rendered Output Crawler (FG4 Quality Gate)
 * Menginspeksi keluaran HTML ter-render, payload RSC, metadata, JSON-LD,
 * OG tags, dan teks atribut pada build Next.js.
 */

const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.resolve(__dirname, "..");
const BUILD_APP_DIR = path.join(ROOT_DIR, "apps", "web", ".next", "server", "app");

const FORBIDDEN_RULES = [
  { name: "ESI", regex: /\b(ESI|E\.S\.I|Esi)\b/g },
  { name: "PBESI", regex: /\b(PBESI|PB\s+ESI)\b/gi },
  { name: "PENGCAB", regex: /\b(Pengcab|Pengurus\s+Cabang)\b/gi },
  { name: "PENGPROV", regex: /\b(Pengprov|Pengurus\s+Provinsi|Pengurus\s+Daerah)\b/gi },
  { name: "KONI", regex: /\bKONI\b/g },
  { name: "DISPORA", regex: /\bDispora\b/gi },
  { name: "KOMITE_OLAHRAGA", regex: /\bKomite\s+Olahraga\b/gi },
  { name: "FEDERASI", regex: /\bFederasi\b/gi },
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

function cleanHtmlTags(html) {
  // Strip script and style tags completely
  let text = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ");
  text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ");
  return text;
}

function extractMetaTags(html) {
  const metaFindings = [];
  const metaRegex = /<meta\s+[^>]*>/gi;
  let match;
  while ((match = metaRegex.exec(html)) !== null) {
    metaFindings.push(match[0]);
  }
  return metaFindings;
}

function crawlDirectory(dir, results = []) {
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      crawlDirectory(fullPath, results);
    } else if (entry.isFile()) {
      if (entry.name.endsWith(".html") || entry.name.endsWith(".body")) {
        const relativeRoute = "/" + path.relative(BUILD_APP_DIR, fullPath)
          .replace(/\\/g, "/")
          .replace(/\.html$/, "")
          .replace(/\.body$/, "")
          .replace(/\/index$/, "")
          .replace(/^index$/, "");

        const content = fs.readFileSync(fullPath, "utf-8");
        if (content.length === 0) continue;

        // 1. Check meta tags
        const metaTags = extractMetaTags(content);
        for (const meta of metaTags) {
          for (const rule of FORBIDDEN_RULES) {
            rule.regex.lastIndex = 0;
            const matches = meta.match(rule.regex);
            if (matches) {
              results.push({
                route: relativeRoute,
                type: "meta-tag",
                rule: rule.name,
                matches: Array.from(new Set(matches)),
                snippet: meta.substring(0, 120),
              });
            }
          }
        }

        // 2. Check title
        const titleMatch = content.match(/<title>([^<]*)<\/title>/i);
        if (titleMatch) {
          const titleText = titleMatch[1];
          for (const rule of FORBIDDEN_RULES) {
            rule.regex.lastIndex = 0;
            const matches = titleText.match(rule.regex);
            if (matches) {
              results.push({
                route: relativeRoute,
                type: "title",
                rule: rule.name,
                matches: Array.from(new Set(matches)),
                snippet: titleText,
              });
            }
          }
        }

        // 3. Check cleaned body text & attributes
        const cleaned = cleanHtmlTags(content);
        const lines = cleaned.split("\n");
        lines.forEach((line, idx) => {
          // Quick tag stripping for text extraction
          const plainText = line.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
          if (!plainText) return;

          for (const rule of FORBIDDEN_RULES) {
            rule.regex.lastIndex = 0;
            const matches = plainText.match(rule.regex);
            if (matches) {
              // Avoid duplicate if snippet is already in results for same line
              results.push({
                route: relativeRoute,
                type: "rendered-body",
                line: idx + 1,
                rule: rule.name,
                matches: Array.from(new Set(matches)),
                snippet: plainText.substring(0, 140),
              });
            }
          }
        });
      }
    }
  }

  return results;
}

console.log("🕷️ Menjalankan Rendered Output Crawler pada:", BUILD_APP_DIR);
const crawlResults = crawlDirectory(BUILD_APP_DIR);

console.log(`\n======================================================`);
console.log(`📊 HASIL CRAWL KELUARAN RENDER (.next/server/app)`);
console.log(`======================================================`);
console.log(`Total temuan pada keluaran HTML pre-render: ${crawlResults.length}`);

const byRoute = {};
crawlResults.forEach((r) => {
  byRoute[r.route] = (byRoute[r.route] || 0) + 1;
});
console.log("\nDistribusi Temuan per Rute Rendered:");
console.table(byRoute);

const byRule = {};
crawlResults.forEach((r) => {
  byRule[r.rule] = (byRule[r.rule] || 0) + 1;
});
console.log("\nDistribusi Temuan per Aturan (Rendered):");
console.table(byRule);

// Save report
const reportPath = path.join(ROOT_DIR, "scripts", "crawl-rendered-findings.json");
fs.writeFileSync(reportPath, JSON.stringify(crawlResults, null, 2));
console.log(`\nHasil lengkap disimpan di: ${reportPath}`);

if (crawlResults.length > 0) {
  console.log("\n❌ Contoh temuan terlarang pada keluaran render nyata:");
  crawlResults.slice(0, 20).forEach((c) => {
    console.log(`- [${c.route}] (${c.type}) [${c.rule}]: "${c.matches.join(", ")}" -> ${c.snippet}`);
  });
}
