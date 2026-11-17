#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "../");

const SEARCH_DIRS = [
  path.join(ROOT_DIR, "apps/web/src"),
];

const EXTENSIONS = [".ts", ".tsx"];
let replacedCount = 0;

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!["node_modules", ".next", ".turbo"].includes(entry.name)) {
        walk(fullPath);
      }
    } else if (entry.isFile() && EXTENSIONS.includes(path.extname(entry.name))) {
      cleanFile(fullPath);
    }
  }
}

function cleanFile(filePath) {
  let content = fs.readFileSync(filePath, "utf-8");
  const original = content;

  // Replace text-[8px], text-[9px], text-[10px] with text-xs (12px)
  content = content.replace(/\btext-\[(?:8|9|10)px\]\s+([^"']*?)tracking-widest\b/g, (match, middle) => {
    replacedCount++;
    return `text-xs ${middle.trim()} tracking-wider`.trim();
  });

  content = content.replace(/\btext-\[(?:8|9|10)px\]\b/g, () => {
    replacedCount++;
    return "text-xs";
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content, "utf-8");
  }
}

for (const dir of SEARCH_DIRS) {
  walk(dir);
}

console.log(`✅ Berhasil mengganti ${replacedCount} label mikro dengan batas minimum sistem 12px (text-xs).`);
