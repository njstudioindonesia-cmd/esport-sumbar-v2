const findings = require("./audit-findings.json");
const webFindings = findings.filter(
  (f) => f.file.startsWith("apps\\web\\src") || f.file.startsWith("apps/web/src")
);
console.log("Total in apps/web/src:", webFindings.length);

const filesMap = {};
webFindings.forEach((f) => {
  filesMap[f.file] = (filesMap[f.file] || 0) + 1;
});
const sortedFiles = Object.entries(filesMap).sort((a, b) => b[1] - a[1]);
console.log("\nTop 35 files in apps/web/src with forbidden terms:");
sortedFiles.slice(0, 35).forEach(([f, cnt]) => console.log(`${cnt}x: ${f}`));

console.log("\nSample ESI/PBESI/Pengcab/Pengprov/KONI/Dispora in apps/web/src:");
const orgFindings = webFindings.filter((f) =>
  ["ESI_TERM", "PBESI_TERM", "PENGCAB_TERM", "PENGPROV_TERM", "KONI_TERM", "DISPORA_TERM"].includes(
    f.rule
  )
);
console.log(`Found ${orgFindings.length} org findings:`);
orgFindings.forEach((f) => {
  console.log(`- [${f.rule}] ${f.file}:${f.line} -> "${f.matches.join(", ")}" | ${f.snippet}`);
});
