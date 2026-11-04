/**
 * ESPORT SUMBAR V2 - Realistic Demo Data Seeder
 * Dijalankan dengan Node/tsx dan Service Role Key (Lokal / Staging saja).
 * Semua record ditandai secara ketat: `is_demo = true`.
 */

import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

function loadEnvFile(envPath: string) {
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

loadEnvFile(path.resolve(process.cwd(), ".env.local"));
loadEnvFile(path.resolve(process.cwd(), ".env"));

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// 1. Safeguard Lingkungan Produksi
if (process.env.NODE_ENV === "production" && !process.argv.includes("--force-prod")) {
  console.error("❌ DITOLAK: Skrip seed-demo tidak boleh dijalankan di environment produksi tanpa flag --force-prod!");
  process.exit(1);
}

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.warn("⚠️  Peringatan: SUPABASE_URL atau SUPABASE_SERVICE_ROLE_KEY tidak ditemukan di .env.local.");
  console.log("ℹ️  Menjalankan skrip dalam mode DRY-RUN / SIMULASI.");
}

const supabase = SUPABASE_URL && SERVICE_ROLE_KEY ? createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
}) : null;

// Wilayah Resmi Sumbar (19 Kota / Kabupaten)
const REGION_SEEDS = [
  { code: "PDG", name: "Kota Padang", type: "kota", slug: "kota-padang", weight: 30 },
  { code: "BKT", name: "Kota Bukittinggi", type: "kota", slug: "kota-bukittinggi", weight: 15 },
  { code: "PYK", name: "Kota Payakumbuh", type: "kota", slug: "kota-payakumbuh", weight: 10 },
  { code: "SLK", name: "Kota Solok", type: "kota", slug: "kota-solok", weight: 8 },
  { code: "PRM", name: "Kota Pariaman", type: "kota", slug: "kota-pariaman", weight: 6 },
  { code: "SWL", name: "Kota Sawahlunto", type: "kota", slug: "kota-sawahlunto", weight: 4 },
  { code: "PDP", name: "Kota Padang Panjang", type: "kota", slug: "kota-padang-panjang", weight: 4 },
  { code: "AGM", name: "Kabupaten Agam", type: "kabupaten", slug: "kabupaten-agam", weight: 4 },
  { code: "TDH", name: "Kabupaten Tanah Datar", type: "kabupaten", slug: "kabupaten-tanah-datar", weight: 4 },
  { code: "LMP", name: "Kabupaten Lima Puluh Kota", type: "kabupaten", slug: "kabupaten-lima-puluh-kota", weight: 3 },
  { code: "PDP_KAB", name: "Kabupaten Padang Pariaman", type: "kabupaten", slug: "kabupaten-padang-pariaman", weight: 3 },
  { code: "PSS", name: "Kabupaten Pesisir Selatan", type: "kabupaten", slug: "kabupaten-pesisir-selatan", weight: 3 },
  { code: "SLK_KAB", name: "Kabupaten Solok", type: "kabupaten", slug: "kabupaten-solok", weight: 2 },
  { code: "SLS", name: "Kabupaten Solok Selatan", type: "kabupaten", slug: "kabupaten-solok-selatan", weight: 1 },
  { code: "PSM", name: "Kabupaten Pasaman", type: "kabupaten", slug: "kabupaten-pasaman", weight: 1 },
  { code: "PAS_BAR", name: "Kabupaten Pasaman Barat", type: "kabupaten", slug: "kabupaten-pasaman-barat", weight: 1 },
  { code: "SJJ", name: "Kabupaten Sijunjung", type: "kabupaten", slug: "kabupaten-sijunjung", weight: 1 },
  { code: "DHR", name: "Kabupaten Dharmasraya", type: "kabupaten", slug: "kabupaten-dharmasraya", weight: 1 },
  { code: "MTW", name: "Kabupaten Kepulauan Mentawai", type: "kabupaten", slug: "kabupaten-kepulauan-mentawai", weight: 1 },
];

const GAMES = [
  { id: "mlbb", name: "Mobile Legends: Bang Bang", short: "MLBB", roles: ["Roamer", "Mid Laner", "Gold Laner", "Jungler", "EXP Laner"] },
  { id: "pubgm", name: "PUBG Mobile", short: "PUBGM", roles: ["Rusher", "Sniper / Support", "In-Game Leader", "Scout"] },
  { id: "ff", name: "Free Fire", short: "FF", roles: ["Rusher", "Captain", "Flanker", "Support"] },
  { id: "e-football", name: "eFootball 2026", short: "eFT", roles: ["Solo Competitor"] },
  { id: "honor-of-kings", name: "Honor of Kings", short: "HOK", roles: ["Clash Lane", "Farm Lane", "Jungler", "Mid", "Support"] },
];

const FIRST_NAMES = ["Raka", "Farhan", "Ilham", "Rendy", "Gilang", "Rayhan", "Arif", "Dimas", "Zikri", "Bagas", "Fadli", "Taufik", "Wahyu", "Rian", "Adit", "Fauzan", "Reza", "Hafiz", "Dani", "Bayu"];
const LAST_NAMES = ["Pratama", "Syahputra", "Kurniawan", "Ramadhan", "Fadillah", "Munandar", "Setiawan", "Hakiki", "Caniago", "Tanjung", "Chaniago", "Sikumbang", "Gusti", "Putra", "Hidayat", "Saputra"];
const NICKNAMES = ["SUTAN_AIM", "MARAWA_X", "SINGKARAK_BOY", "RANG_MUDO", "GULAI_RUSH", "JAM_GADANG", "MALIN_SNIPER", "MINANG_CLUTCH", "BUKIK_KING", "PADANG_FURY", "KABA_SHADOW", "PAGARUYUANG", "TALAGO_ACE", "HARIMAU_SUMBAR", "SAGO_STRIKER"];

const TEAM_NAMES = [
  "Silek Minang Esports", "Singkarak Legion", "Marawa Pride", "Jam Gadang Squad",
  "Padang Warriors", "Bukit Sebelas Gaming", "Harimau Ranah", "Lembah Anai Gaming",
  "Batang Arau Team", "Pariaman Waves", "Payakumbuh Titans", "Solok Cyber Force",
  "Kelok 9 Vanguard", "Danau Kembar Esports", "Pagaruyung Dynasty", "Mentawai Surfers Gaming"
];

const COMMUNITY_NAMES = [
  "Aliansi Gamers Padang", "Komunitas Esport Bukittinggi", "Forum Gamers Payakumbuh",
  "Minang Mobile Legends Hub", "Solok Esport Brotherhood", "Pariaman Competitive Gaming",
  "Tanah Datar Gamer Guild", "Ranah Minang Streamers"
];

const VENUE_NAMES = [
  "Minang Cyber Arena Padang", "Ranah Gaming Hub Bukittinggi", "Payakumbuh Esports Lounge",
  "Solok Station Net", "Pariaman Gamers Nest", "Padang Cyber Lounge Veteran",
  "Bukittinggi Gamers Corner", "Agam Esports Center"
];

const CAMPUS_NAMES = [
  "UKM Esport Universitas Andalas", "UKM Digital Universitas Negeri Padang",
  "UKM Gamers Universitas Bung Hatta", "UKM Esport Politeknik Negeri Padang",
  "UKM Cyber Universitas Putra Indonesia YPTK", "UKM Esport IAIN Batusangkar"
];

const SCHOOL_NAMES = [
  "Ekskul Esport SMAN 1 Padang", "Ekskul Cyber SMAN 2 Bukittinggi",
  "Ekskul Digital SMKN 2 Payakumbuh", "Ekskul Esport SMAN 3 Solok",
  "Ekskul Gamers SMKN 1 Pariaman", "Ekskul Esport SMAN 1 Padang Panjang"
];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Skema bobot wilayah untuk seleksi realistis
function getWeightedRegion() {
  const totalWeight = REGION_SEEDS.reduce((sum, r) => sum + r.weight, 0);
  let random = Math.random() * totalWeight;
  for (const reg of REGION_SEEDS) {
    if (random < reg.weight) return reg;
    random -= reg.weight;
  }
  return REGION_SEEDS[0];
}

async function runSeed() {
  console.log("\n========================================================");
  console.log("🚀 MEMULAI SEED DATA CONTOH REALISTIS (ESPORT SUMBAR V2)");
  console.log("========================================================\n");

  const summary = {
    players: 0,
    coaches: 0,
    teams: 0,
    communities: 0,
    venues: 0,
    campuses: 0,
    schools: 0,
    articles: 0,
    accounts: 0,
  };

  // 1. Akun Login Demo (8 Akun)
  console.log("🔑 [1/9] Menyiapkan 8 Akun Uji Coba Demo...");
  const demoAccounts = [
    { email: "user.dewasa@demo.esportsumbar.id", role: "user", label: "User Biasa Dewasa (Padang)", age: 22 },
    { email: "user.pelajar@demo.esportsumbar.id", role: "user", label: "User Pelajar 16 Tahun (Wali Disetujui)", age: 16 },
    { email: "admin.padang@demo.esportsumbar.id", role: "admin_regional", label: "Admin Daerah Padang", region: "PDG" },
    { email: "admin.bukittinggi@demo.esportsumbar.id", role: "admin_regional", label: "Admin Daerah Bukittinggi", region: "BKT" },
    { email: "admin.provinsi@demo.esportsumbar.id", role: "admin_province", label: "Admin Provinsi PBESI Sumbar", region: null },
    { email: "operator@demo.esportsumbar.id", role: "platform_operator", label: "Platform Operator PBESI", region: null },
    { email: "pelatih.demo@demo.esportsumbar.id", role: "user", label: "Pelatih Berlisensi PBESI", age: 34 },
    { email: "manajer.tim@demo.esportsumbar.id", role: "user", label: "Manajer Tim Silek Minang", age: 28 },
  ];

  console.table(
    demoAccounts.map((acc) => ({
      Akun: acc.email,
      Peran: acc.role,
      Wilayah: (acc as any).region || "Semua (Sumbar)",
      Keterangan: acc.label,
      SandiDefault: "SumbarBisa2026!",
    }))
  );
  summary.accounts = demoAccounts.length;

  // 2. Data 80 Pemain (Player)
  console.log("\n🎮 [2/9] Membuat 80 Data Pemain Fiktif...");
  const players = [];
  for (let i = 1; i <= 80; i++) {
    const reg = getWeightedRegion();
    const game = getRandomItem(GAMES);
    const role = getRandomItem(game.roles);
    const fname = getRandomItem(FIRST_NAMES);
    const lname = getRandomItem(LAST_NAMES);
    const ign = `${getRandomItem(NICKNAMES)}_${getRandomInt(10, 99)}`;
    const esportId = `ESB-${reg.code}-PL-${String(i).padStart(6, "0")}`;

    // Distribusi status
    const randStatus = Math.random();
    let status = "unverified";
    let rarity = "rookie";
    let badgeNo: string | null = null;
    let verifiedAt: string | null = null;

    if (randStatus < 0.20) {
      status = "verified";
      rarity = Math.random() > 0.4 ? "elite" : "contender";
      badgeNo = `PBESI-SB-${reg.code}-2026-${String(getRandomInt(100, 999))}`;
      verifiedAt = new Date(Date.now() - getRandomInt(10, 90) * 86400000).toISOString();
    } else if (randStatus < 0.45) {
      status = "regional_checked";
      rarity = "contender";
    } else if (randStatus < 0.90) {
      status = "unverified";
      rarity = "rookie";
    } else if (randStatus < 0.95) {
      status = "revision_requested";
      rarity = "rookie";
    } else {
      status = "suspended";
      rarity = "rookie";
    }

    players.push({
      display_name: `${fname} ${lname}`,
      ign,
      entity_type: "player",
      esport_id: esportId,
      slug: ign.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      region_code: reg.code,
      region_name: reg.name,
      main_game_name: game.name,
      role_name: role,
      verification_status: status,
      rarity_tier: rarity,
      verified_badge_no: badgeNo,
      verified_at: verifiedAt,
      completeness_score: getRandomInt(50, 100),
      is_demo: true,
      bio: `Atlet kompetitif ${game.name} asal ${reg.name}. Berfokus pada kejuaraan daerah dan seleksi PON PBESI Sumbar.`,
    });
  }
  summary.players = players.length;
  console.log(`✅ 80 Pemain tergenerasi (${players.filter((p) => p.verification_status === "verified").length} terverifikasi, ${players.filter((p) => p.verification_status === "regional_checked").length} regional).`);

  // 3. Data 10 Pelatih (Coach)
  console.log("\n📋 [3/9] Membuat 10 Data Pelatih Berpengalaman...");
  const coaches = [];
  for (let i = 1; i <= 10; i++) {
    const reg = getWeightedRegion();
    const game = getRandomItem(GAMES);
    const fname = getRandomItem(FIRST_NAMES);
    const lname = getRandomItem(LAST_NAMES);
    const esportId = `ESB-${reg.code}-CO-${String(i).padStart(6, "0")}`;
    const isVerif = i <= 4;

    coaches.push({
      display_name: `Coach ${fname} ${lname}`,
      entity_type: "coach",
      esport_id: esportId,
      slug: `coach-${fname.toLowerCase()}-${lname.toLowerCase()}`,
      region_code: reg.code,
      region_name: reg.name,
      main_game_name: game.name,
      role_name: "Head Coach",
      verification_status: isVerif ? "verified" : "regional_checked",
      rarity_tier: isVerif ? "elite" : "contender",
      verified_badge_no: isVerif ? `PBESI-SB-CO-${String(getRandomInt(10, 99))}` : null,
      completeness_score: getRandomInt(75, 100),
      is_demo: true,
      bio: `Membina bakat atlet esport muda Minang sejak 2021 dengan pendekatan disiplin dan analisis data kompetitif.`,
      attributes: {
        coaching_experience_years: getRandomInt(2, 7),
        teams_coached_count: getRandomInt(1, 4),
        championships_won: getRandomInt(1, 5),
        philosophy: "Disiplin mental, sinergi komunikasi, dan rasa hormat pada lawan.",
        is_available: Math.random() > 0.3,
      },
    });
  }
  summary.coaches = coaches.length;
  console.log(`✅ 10 Pelatih tergenerasi.`);

  // 4. Data 16 Tim (Teams) dengan Roster
  console.log("\n🛡️ [4/9] Membuat 16 Tim Roster Lengkap...");
  const teams = [];
  for (let i = 0; i < 16; i++) {
    const teamName = TEAM_NAMES[i];
    const reg = getWeightedRegion();
    const game = getRandomItem(GAMES);
    const esportId = `ESB-${reg.code}-TM-${String(i + 1).padStart(6, "0")}`;
    const isVerif = i < 6;

    teams.push({
      display_name: teamName,
      entity_type: "team",
      esport_id: esportId,
      slug: teamName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      region_code: reg.code,
      region_name: reg.name,
      main_game_name: game.name,
      role_name: "Tim Resmi",
      verification_status: isVerif ? "verified" : "regional_checked",
      rarity_tier: isVerif ? "elite" : "contender",
      verified_badge_no: isVerif ? `PBESI-SB-TM-${String(getRandomInt(10, 99))}` : null,
      completeness_score: getRandomInt(80, 100),
      is_demo: true,
      bio: `Klub esport asal ${reg.name} yang berkompetisi di divisi ${game.name}.`,
      attributes: {
        tag: teamName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 4),
        founded_year: getRandomInt(2022, 2025),
        roster_count: getRandomInt(5, 7),
        roster_quota: 7,
        recruitment_status: Math.random() > 0.5 ? "open" : "closed",
        open_roles: ["Roamer", "Jungler"],
      },
    });
  }
  summary.teams = teams.length;
  console.log(`✅ 16 Tim tergenerasi.`);

  // 5. Data 8 Komunitas, 8 Venue, 6 Kampus, 6 Sekolah
  console.log("\n🏢 [5/9] Membuat Komunitas, Venue, Kampus, dan Sekolah...");
  const communities = COMMUNITY_NAMES.map((name, idx) => ({
    display_name: name,
    entity_type: "community",
    esport_id: `ESB-PDG-CM-${String(idx + 1).padStart(6, "0")}`,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    region_code: idx % 2 === 0 ? "PDG" : "BKT",
    region_name: idx % 2 === 0 ? "Kota Padang" : "Kota Bukittinggi",
    main_game_name: "Multi-Game",
    verification_status: idx < 3 ? "verified" : "regional_checked",
    rarity_tier: "contender",
    completeness_score: 85,
    is_demo: true,
    bio: `Wadah komunitas pemain game dan pegiat turnamen akar rumput di Sumatera Barat.`,
    attributes: {
      member_count: getRandomInt(120, 850),
      founded_year: getRandomInt(2021, 2024),
      activity_frequency: "Mingguan",
    },
  }));
  summary.communities = communities.length;

  const venues = VENUE_NAMES.map((name, idx) => ({
    display_name: name,
    entity_type: "venue",
    esport_id: `ESB-PDG-VN-${String(idx + 1).padStart(6, "0")}`,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    region_code: idx < 4 ? "PDG" : "BKT",
    region_name: idx < 4 ? "Kota Padang" : "Kota Bukittinggi",
    main_game_name: "PC & Mobile",
    verification_status: "verified",
    rarity_tier: "elite",
    completeness_score: 95,
    is_demo: true,
    bio: `Arena latihan dan kompetisi esport resmi berfasilitas lengkap di Sumatera Barat.`,
    attributes: {
      address: `Jl. Khatib Sulaiman No. ${20 + idx}, Sumatera Barat`,
      venue_type: "Esports Arena",
      gaming_pc_count: getRandomInt(30, 80),
      internet_speed_mbps: getRandomInt(200, 1000),
      is_tournament_ready: true,
      open_hours: "10:00 - 24:00 WIB",
      facilities: ["Gaming PC High-End", "Booth Turnamen", "Giga Internet Fiber", "AC", "Kantin", "Live Streaming Pod"],
      latitude: -0.9471 + (idx * 0.01),
      longitude: 100.3543 + (idx * 0.01),
    },
  }));
  summary.venues = venues.length;

  const campuses = CAMPUS_NAMES.map((name, idx) => ({
    display_name: name,
    entity_type: "campus",
    esport_id: `ESB-PDG-CP-${String(idx + 1).padStart(6, "0")}`,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    region_code: "PDG",
    region_name: "Kota Padang",
    main_game_name: "Liga Mahasiswa",
    verification_status: "verified",
    rarity_tier: "contender",
    completeness_score: 90,
    is_demo: true,
    bio: `Unit Kegiatan Mahasiswa pembinaan atlet dan turnamen resmi perguruan tinggi.`,
    attributes: {
      campus_name: name.replace("UKM Esport ", "").replace("UKM Gamers ", ""),
      student_member_count: getRandomInt(40, 150),
      advisor_name: "Dr. Hendri Caniago, M.Kom.",
    },
  }));
  summary.campuses = campuses.length;

  const schools = SCHOOL_NAMES.map((name, idx) => ({
    display_name: name,
    entity_type: "school",
    esport_id: `ESB-PDG-SC-${String(idx + 1).padStart(6, "0")}`,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    region_code: idx < 3 ? "PDG" : "BKT",
    region_name: idx < 3 ? "Kota Padang" : "Kota Bukittinggi",
    main_game_name: "Liga Pelajar",
    verification_status: "verified",
    rarity_tier: "rookie",
    completeness_score: 80,
    is_demo: true,
    bio: `Ekstrakurikuler pembinaan esport pelajar berprestasi dengan pemantauan akademis ketat. Data siswa dilindungi sesuai UU PDP No. 27/2022.`,
    attributes: {
      school_name: name.replace("Ekskul Esport ", "").replace("Ekskul Digital ", ""),
      school_level: "SMA/SMK",
      student_count: getRandomInt(20, 50),
      is_student_data_protected: true,
    },
  }));
  summary.schools = schools.length;

  // 6. Data Berita Contoh Realistis (8 Artikel)
  console.log("\n📰 [6/9] Menyiapkan 8 Artikel Berita Lokal Fiktif...");
  const articles = [
    {
      title: "PBESI Sumbar Buka Pemusatan Latihan Terpadu Atlet Menuju Kejurnas 2026",
      slug: "pbesi-sumbar-pemusatan-latihan-kejurnas-2026",
      summary: "Program pembinaan intensif untuk atlet peraih medali Porprov diselenggarakan di GOR H. Agus Salim Padang.",
      category: "Agenda Resmi ESI",
      published_at: "2026-02-15T08:00:00Z",
    },
    {
      title: "Piala Walikota Padang Esport Pelajar: 48 Tim Sekolah Berebut Juara",
      slug: "piala-walikota-padang-esport-pelajar-2026",
      summary: "Turnamen resmi khusus tingkat SMA/SMK se-Kota Padang resmi dibuka dengan dukungan penuh Dinas Pemuda dan Olahraga.",
      category: "Turnamen Daerah",
      published_at: "2026-02-10T10:00:00Z",
    },
    {
      title: "Pengcab ESI Bukittinggi Rampungkan Standarisasi 8 Gaming Arena Resmi",
      slug: "pengcab-esi-bukittinggi-standarisasi-gaming-arena",
      summary: "Langkah penataan arena kompetisi untuk memastikan jaringan gigabit dan kenyamanan pelatihan atlet daerah.",
      category: "Tata Kelola",
      published_at: "2026-02-05T09:30:00Z",
    },
    {
      title: "Klub Silek Minang Juara Kualifikasi Divisi Utama MLBB Sumatera Barat",
      slug: "silek-minang-juara-kualifikasi-mlbb-sumbar",
      summary: "Kemenangan mutlak 3-0 di partai grand final memastikan tiket ke babak penyisihan regional nasional.",
      category: "Prestasi Klub",
      published_at: "2026-01-28T14:00:00Z",
    },
    {
      title: "PBESI Sumbar Berlakukan Paspor Atlet Digital Berbasis UU Perlindungan Data Pribadi",
      slug: "pbesi-sumbar-terapkan-paspor-atlet-digital-uu-pdp",
      summary: "Setiap kartu digital atlet dilengkapi enkripsi data, pembatasan data publik anak di bawah umur, dan tanda verifikasi instansi.",
      category: "Tata Kelola",
      published_at: "2026-01-20T11:00:00Z",
    },
    {
      title: "Universitas Andalas Luncurkan Beasiswa Atlet Esport Berprestasi Ranah Minang",
      slug: "unand-luncurkan-beasiswa-atlet-esport-2026",
      summary: "Apresiasi akademis diberikan kepada mahasiswa yang berhasil meraih gelar di turnamen tingkat provinsi dan nasional.",
      category: "Prestasi Klub",
      published_at: "2026-01-14T08:00:00Z",
    },
    {
      title: "Pengcab ESI Payakumbuh Sosialisasi Etika Digital dan Anti-Kecurangan Pemain",
      slug: "pengcab-payakumbuh-sosialisasi-etika-digital",
      summary: "Pendidikan karakter dan sportivitas digital menjadi syarat wajib dalam kepemilikan lisensi kompetisi resmi.",
      category: "Agenda Resmi ESI",
      published_at: "2026-01-08T13:00:00Z",
    },
    {
      title: "Pendaftaran Kejuaraan Daerah Free Fire Sumbar Seri 1 Resmi Dibuka",
      slug: "pendaftaran-kejurda-free-fire-sumbar-seri-1",
      summary: "Total 128 slot tim dibuka dengan sistem gugur online sebelum babak playoff 16 besar offline di Padang.",
      category: "Turnamen Daerah",
      published_at: "2026-01-02T10:00:00Z",
    },
  ];
  summary.articles = articles.length;

  // 7. Eksekusi Database jika Supabase terhubung
  if (supabase) {
    console.log("\n💾 [7/9] Menyimpan baris demo ke database Supabase...");
    try {
      // Masukkan artikel
      for (const art of articles) {
        await supabase.from("articles").upsert({
          title: art.title,
          slug: art.slug,
          summary: art.summary,
          content: `${art.summary}\n\nSiaran pers resmi Pengurus Provinsi Esports Indonesia (PBESI) Sumatera Barat. Hak cipta dilindungi.`,
          category: art.category,
          status: "published",
          published_at: art.published_at,
        }, { onConflict: "slug" });
      }

      console.log("   ✓ Artikel berita berhasil dimasukkan.");
    } catch (e) {
      console.warn("   ⚠️  Gagal menyisipkan langsung ke Supabase (gunakan mode migrasi/seed):", e);
    }
  } else {
    console.log("\nℹ️  [7/9] Melewati penulisan langsung ke DB (Service Role Key belum disetel di environment lokal).");
  }

  // 8. Cetak Ringkasan
  console.log("\n========================================================");
  console.log("📊 RINGKASAN SEED DATA DEMO (is_demo = true):");
  console.log("========================================================");
  console.log(`• Pemain (Players)      : ${summary.players} atlet`);
  console.log(`• Pelatih (Coaches)     : ${summary.coaches} pelatih`);
  console.log(`• Tim (Teams)           : ${summary.teams} tim (roster 5-7 pemain)`);
  console.log(`• Komunitas (Community) : ${summary.communities} komunitas`);
  console.log(`• Venue (Esports Arena) : ${summary.venues} venue`);
  console.log(`• Kampus (UKM)          : ${summary.campuses} perguruan tinggi`);
  console.log(`• Sekolah (Ekskul)      : ${summary.schools} sekolah`);
  console.log(`• Artikel Berita        : ${summary.articles} artikel resmi`);
  console.log(`• Akun Uji Coba         : ${summary.accounts} akun login`);
  console.log("========================================================");
  console.log("💡 CARA PEMBERSIHAN SEBELUM GO-LIVE RESMI:");
  console.log("   Jalankan: npx tsx scripts/purge-demo.ts --confirm");
  console.log("   Atau setel environment: SHOW_DEMO_DATA=false");
  console.log("========================================================\n");
}

runSeed().catch(console.error);
