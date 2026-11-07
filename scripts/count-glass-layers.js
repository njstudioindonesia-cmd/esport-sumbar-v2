const fs = require("fs");
const path = require("path");

let count = 0;
const files = [];

function checkDir(d) {
  const entries = fs.readdirSync(d, { withFileTypes: true });
  for (const e of entries) {
    if (["node_modules", ".next", ".git"].includes(e.name)) continue;
    const p = path.join(d, e.name);
    if (e.isDirectory()) checkDir(p);
    else if (/\.(tsx|ts|css|html)$/.test(e.name)) {
      const content = fs.readFileSync(p, "utf8");
      const matches = content.match(/backdrop-blur|backdrop-filter/g);
      if (matches) {
        count += matches.length;
        files.push({ file: path.relative(path.resolve(__dirname, ".."), p), count: matches.length });
      }
    }
  }
}

checkDir(path.resolve(__dirname, "../apps/web/src"));
console.log("Total backdrop-blur/backdrop-filter instances in apps/web/src:", count);
console.log("Total files using it:", files.length);
files
  .sort((a, b) => b.count - a.count)
  .slice(0, 15)
  .forEach((f) => console.log(`  ${f.count}x: ${f.file}`));
