import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const TARGET_DIR = path.join(ROOT_DIR, "apps/web/src");

const REPLACEMENTS = [
  // Frasa lengkap kapitalisasi
  { from: /PASPOR ATLET DIGITAL/g, to: "KARTU ATLET DIGITAL" },
  { from: /Paspor Atlet Digital/g, to: "Kartu Atlet Digital" },
  { from: /paspor atlet digital/g, to: "kartu atlet digital" },
  { from: /PASPOR DIGITAL/g, to: "KARTU DIGITAL" },
  { from: /Paspor Digital/g, to: "Kartu Digital" },
  { from: /paspor digital/g, to: "kartu digital" },
  { from: /PASPOR ATLET/g, to: "KARTU ATLET" },
  { from: /Paspor Atlet/g, to: "Kartu Atlet" },
  { from: /paspor atlet/g, to: "kartu atlet" },
  { from: /KARTU PASPOR/g, to: "KARTU IDENTITAS" },
  { from: /Kartu Paspor/g, to: "Kartu Identitas" },
  { from: /kartu paspor/g, to: "kartu identitas" },
  { from: /Rasio Paspor/g, to: "Rasio Kartu" },
  { from: /rasio paspor/g, to: "rasio kartu" },
  { from: /4:5 Paspor/g, to: "4:5 Kartu" },
  { from: /paspor esport/g, to: "profil esport" },
  { from: /Paspor/g, to: "Kartu" },
  { from: /paspor/g, to: "kartu" },
];

function processDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".next" || entry.name === "dist") continue;
      processDir(fullPath);
    } else if (entry.isFile() && /\.(tsx?|jsx?|json|md)$/.test(entry.name)) {
      if (entry.name === "mockCards.ts" || entry.name === "mockNews.ts" || entry.name === "mockAdminData.ts") continue;
      let content = fs.readFileSync(fullPath, "utf-8");
      let changed = false;

      for (const r of REPLACEMENTS) {
        if (r.from.test(content)) {
          content = content.replace(r.from, r.to);
          changed = true;
        }
      }

      if (changed) {
        fs.writeFileSync(fullPath, content, "utf-8");
        console.log(`Updated: ${path.relative(ROOT_DIR, fullPath)}`);
      }
    }
  }
}

console.log("Cleaning banned terms in apps/web/src...");
processDir(TARGET_DIR);
console.log("Done.");
