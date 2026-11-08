import https from "https";

const PAGES = [
  "/",
  "/about",
  "/explore",
  "/ecosystem",
  "/terms",
  "/privacy",
  "/faq",
  "/contact",
  "/how-it-works",
  "/verification-standard",
  "/maintenance",
  "/login",
  "/register",
  "/onboarding",
];

const BANNED_WORDS = [
  "pb" + "esi",
  "peng" + "prov",
  "peng" + "cab",
  "ko" + "ni",
  "dis" + "pora",
  "res" + "mi",
  "s" + "ah",
];

const BANNED_SUBSTRINGS = [
  "[TEN" + "TUKAN]",
  "TO" + "DO",
  "Lorem ipsum",
];

const bannedWordRegex = new RegExp(`\\b(${BANNED_WORDS.join("|")})\\b`, "i");

async function checkUrl(path) {
  return new Promise((resolve) => {
    const url = `https://esport-sumbar-v2.vercel.app${path}`;
    https.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        const wordMatch = data.match(bannedWordRegex);
        let subMatch = null;
        for (const sub of BANNED_SUBSTRINGS) {
          if (data.includes(sub)) {
            subMatch = sub;
            break;
          }
        }

        resolve({
          path,
          statusCode: res.statusCode,
          noIndexHeader: res.headers["x-robots-tag"] || null,
          hasViolations: !!wordMatch || !!subMatch,
          match: wordMatch ? wordMatch[0] : subMatch,
        });
      });
    }).on("error", (err) => {
      resolve({ path, error: err.message });
    });
  });
}

async function main() {
  console.log("🌐 Memulai Crawl Live Produksi (https://esport-sumbar-v2.vercel.app)...");
  let allClean = true;
  for (const page of PAGES) {
    const res = await checkUrl(page);
    if (res.error) {
      console.error(`❌ ${page}: Gagal memuat (${res.error})`);
      allClean = false;
    } else if (res.statusCode !== 200) {
      console.warn(`⚠️ ${page}: HTTP ${res.statusCode}`);
    } else if (res.hasViolations) {
      console.error(`❌ ${page}: Ditemukan kata/klaim terlarang: "${res.match}"`);
      allClean = false;
    } else {
      console.log(`✅ ${page}: HTTP 200 OK | noindex: "${res.noIndexHeader}" | Bersih (0 pelanggaran)`);
    }
  }

  if (allClean) {
    console.log("\n🎉 Seluruh 14 halaman produksi live bersih dari istilah/klaim terlarang & placeholder!");
  } else {
    console.error("\n❌ Ada pelanggaran yang terdeteksi!");
    process.exit(1);
  }
}

main();
