const fs = require('fs');
const path = require('path');

const arg = process.argv[2] || '';
const findings = JSON.parse(fs.readFileSync(path.join(__dirname, 'sweep-findings.json'), 'utf-8'));

if (!arg || arg === '--summary') {
  const counts = {};
  findings.forEach(f => {
    const file = f.file.replace(/\\/g, '/');
    counts[file] = (counts[file] || 0) + 1;
  });
  console.log(`Total files: ${Object.keys(counts).length}, Total findings: ${findings.length}`);
  Object.entries(counts).sort((a, b) => b[1] - a[1]).forEach(([f, count]) => {
    console.log(`${count.toString().padStart(3, ' ')} | ${f}`);
  });
} else {
  const filtered = findings.filter(f => f.file.replace(/\\/g, '/').toLowerCase().includes(arg.toLowerCase()));
  console.log(`Findings matching '${arg}': ${filtered.length}`);
  filtered.forEach(f => {
    console.log(`${f.file}:${f.line} [${f.rule}] (${f.matches.join(',')}) -> ${f.snippet.trim()}`);
  });
}
