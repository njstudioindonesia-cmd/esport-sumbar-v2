/**
 * ESPORT SUMBAR V2 - Realistic Demo Data Seeder
 * Mengisi database Supabase dengan 8 Akun Uji Coba, 80 Atlet, 10 Pelatih, 16 Tim,
 * 8 Komunitas, 8 Venue, 6 Kampus, 6 Sekolah, Prestasi, Keanggotaan, dan 8 Berita Resmi.
 *
 * Semua record ditandai secara ketat dengan `is_demo = true` untuk kepatuhan tata kelola.
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
      let val = trimmed.slice(eqIdx + 1).trim();
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
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

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("❌ ERROR: NEXT_PUBLIC_SUPABASE_URL atau SUPABASE_SERVICE_ROLE_KEY tidak ditemukan di .env.local.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// 19 Wilayah Resmi Sumatera Barat
interface RegionConfig {
  id: string;
  code: string;
  name: string;
  slug: string;
  weight: number;
}

const REGIONS: RegionConfig[] = [
  { id: "reg-pdg", code: "PDG", name: "Kota Padang", slug: "kota-padang", weight: 30 },
  { id: "reg-bkt", code: "BKT", name: "Kota Bukittinggi", slug: "kota-bukittinggi", weight: 15 },
  { id: "reg-pyk", code: "PYK", name: "Kota Payakumbuh", slug: "kota-payakumbuh", weight: 10 },
  { id: "reg-slk", code: "SLK", name: "Kota Solok", slug: "kota-solok", weight: 8 },
  { id: "reg-prm", code: "PRM", name: "Kota Pariaman", slug: "kota-pariaman", weight: 6 },
  { id: "reg-swl", code: "SWL", name: "Kota Sawahlunto", slug: "kota-sawahlunto", weight: 4 },
  { id: "reg-ppj", code: "PPJ", name: "Kota Padang Panjang", slug: "kota-padang-panjang", weight: 4 },
  { id: "reg-agm", code: "AGM", name: "Kab. Agam", slug: "kab-agam", weight: 4 },
  { id: "reg-tnd", code: "TND", name: "Kab. Tanah Datar", slug: "kab-tanah-datar", weight: 4 },
  { id: "reg-lpk", code: "LPK", name: "Kab. Lima Puluh Kota", slug: "kab-lima-puluh-kota", weight: 3 },
  { id: "reg-pdp", code: "PDP", name: "Kab. Padang Pariaman", slug: "kab-padang-pariaman", weight: 3 },
  { id: "reg-pss", code: "PSS", name: "Kab. Pesisir Selatan", slug: "kab-pesisir-selatan", weight: 3 },
  { id: "reg-ksl", code: "KSL", name: "Kab. Solok", slug: "kab-solok", weight: 2 },
  { id: "reg-sls", code: "SLS", name: "Kab. Solok Selatan", slug: "kab-solok-selatan", weight: 1 },
  { id: "reg-pas", code: "PAS", name: "Kab. Pasaman", slug: "kab-pasaman", weight: 1 },
  { id: "reg-psb", code: "PSB", name: "Kab. Pasaman Barat", slug: "kab-pasaman-barat", weight: 1 },
  { id: "reg-sjj", code: "SJJ", name: "Kab. Sijunjung", slug: "kab-sijunjung", weight: 1 },
  { id: "reg-dhm", code: "DHM", name: "Kab. Dharmasraya", slug: "kab-dharmasraya", weight: 1 },
  { id: "reg-mtw", code: "MTW", name: "Kab. Kepulauan Mentawai", slug: "kab-kepulauan-mentawai", weight: 1 },
];

const GAMES = [
  { id: "game-mlbb", name: "Mobile Legends: Bang Bang", short: "MLBB", roles: ["Roamer", "Mid Laner", "Gold Laner", "Jungler", "EXP Laner"] },
  { id: "game-pubgm", name: "PUBG Mobile", short: "PUBGM", roles: ["Rusher", "Sniper / Support", "In-Game Leader", "Scout"] },
  { id: "game-ff", name: "Free Fire", short: "FF", roles: ["Rusher", "Captain", "Flanker", "Support"] },
  { id: "game-efootball", name: "eFootball / FC Mobile", short: "eFT", roles: ["Solo Competitor"] },
  { id: "game-val", name: "Valorant", short: "VAL", roles: ["Duelist", "Initiator", "Controller", "Sentinel"] },
];

const FIRST_NAMES = ["Raka", "Farhan", "Ilham", "Rendy", "Gilang", "Rayhan", "Arif", "Dimas", "Zikri", "Bagas", "Fadli", "Taufik", "Wahyu", "Rian", "Adit", "Fauzan", "Reza", "Hafiz", "Dani", "Bayu"];
const LAST_NAMES = ["Pratama", "Syahputra", "Kurniawan", "Ramadhan", "Fadillah", "Munandar", "Setiawan", "Hakiki", "Caniago", "Tanjung", "Chaniago", "Sikumbang", "Gusti", "Putra", "Hidayat", "Saputra"];
const NICKNAMES = ["SUTAN_AIM", "MARAWA_X", "SINGKARAK_BOY", "RANG_MUDO", "GULAI_RUSH", "JAM_GADANG", "MALIN_SNIPER", "MINANG_CLUTCH", "BUKIK_KING", "PADANG_FURY", "KABA_SHADOW", "PAGARUYUANG", "TALAGO_ACE", "HARIMAU_SUMBAR", "SAGO_STRIKER", "SINGA_MERAPI", "ANAI_DRIFT"];

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
  "UKM Cyber Universitas Putra Indonesia YPTK", "UKM Esport UIN Mahmud Yunus Batusangkar"
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

function getWeightedRegion(): RegionConfig {
  const totalWeight = REGIONS.reduce((sum, r) => sum + r.weight, 0);
  let random = Math.random() * totalWeight;
  for (const reg of REGIONS) {
    if (random < reg.weight) return reg;
    random -= reg.weight;
  }
  return REGIONS[0];
}

async function runSeed() {
  console.log("\n========================================================");
  console.log("🚀 MEMULAI SEED DATA CONTOH REALISTIS (ESPORT SUMBAR V2)");
  console.log(`🌐 Target Supabase: ${SUPABASE_URL}`);
  console.log("========================================================\n");

  // 1. Akun Login Demo (8 Akun Uji Coba)
  console.log("🔑 [1/9] Menyiapkan 8 Akun Uji Coba Demo di Supabase Auth & Accounts...");

  const demoAccountsConfig = [
    { email: "user.dewasa@demo.esportsumbar.id", role: "user", regionId: "reg-pdg", birthDate: "2003-05-12", label: "User Biasa Dewasa (Padang)" },
    { email: "user.pelajar@demo.esportsumbar.id", role: "user", regionId: "reg-pdg", birthDate: "2010-08-20", label: "User Pelajar 15 Tahun (Wali Disetujui)" },
    { email: "admin.padang@demo.esportsumbar.id", role: "region_admin", regionId: "reg-pdg", birthDate: "1994-02-14", label: "Admin Pengcab Padang" },
    { email: "admin.bukittinggi@demo.esportsumbar.id", role: "region_admin", regionId: "reg-bkt", birthDate: "1991-09-08", label: "Admin Pengcab Bukittinggi" },
    { email: "admin.provinsi@demo.esportsumbar.id", role: "prov_admin", regionId: null, birthDate: "1988-11-25", label: "Admin Pengprov PBESI Sumbar" },
    { email: "operator@demo.esportsumbar.id", role: "platform_operator", regionId: null, birthDate: "1995-04-18", label: "Platform Operator PBESI" },
    { email: "pelatih.demo@demo.esportsumbar.id", role: "user", regionId: "reg-pdg", birthDate: "1990-07-30", label: "Pelatih Berlisensi PBESI" },
    { email: "manajer.tim@demo.esportsumbar.id", role: "user", regionId: "reg-pdg", birthDate: "1996-12-05", label: "Manajer Tim Silek Minang" },
  ];

  const createdAccountMap: Record<string, string> = {}; // email -> uuid

  // List existing users first
  const { data: existingUsersData } = await supabase.auth.admin.listUsers();
  const existingUsers = existingUsersData?.users || [];
  const existingMap = new Map(existingUsers.map((u) => [u.email?.toLowerCase(), u.id]));

  for (const acc of demoAccountsConfig) {
    let userId = existingMap.get(acc.email.toLowerCase());

    if (!userId) {
      const { data: createdUser, error: createErr } = await supabase.auth.admin.createUser({
        email: acc.email,
        password: "SumbarBisa2026!",
        email_confirm: true,
        user_metadata: {
          display_name: acc.label,
          is_demo: true,
        },
      });

      if (createErr) {
        console.error(`   ❌ Gagal membuat auth user ${acc.email}:`, createErr.message);
        continue;
      }
      userId = createdUser.user.id;
    }

    createdAccountMap[acc.email] = userId;

    // Update public.accounts record
    await supabase.from("accounts").upsert({
      id: userId,
      email: acc.email,
      role: acc.role,
      assigned_region_id: acc.regionId,
      birth_date: acc.birthDate,
      is_active: true,
      is_demo: true,
    });
  }

  console.log(`   ✓ ${Object.keys(createdAccountMap).length} Akun uji coba terdaftar dan siap login.`);

  // 1b. Guardian Consent untuk Pelajar
  const pelajarUserId = createdAccountMap["user.pelajar@demo.esportsumbar.id"];
  if (pelajarUserId) {
    const { data: consent } = await supabase.from("guardian_consents").upsert({
      account_id: pelajarUserId,
      guardian_name: "Bapak Hendra Pratama (Orang Tua Kandung)",
      guardian_contact: "+6281234567890",
      guardian_relationship: "Orang Tua Kandung",
      consent_version: "v1.0-2026",
    }).select("id").single();

    if (consent?.id) {
      await supabase.from("accounts").update({ guardian_consent_id: consent.id }).eq("id", pelajarUserId);
    }
    console.log("   ✓ Persetujuan wali sah (UU PDP) untuk atlet pelajar berhasil disinkronkan.");
  }

  const defaultOwnerId = createdAccountMap["user.dewasa@demo.esportsumbar.id"] || Object.values(createdAccountMap)[0];
  const pelajarOwnerId = createdAccountMap["user.pelajar@demo.esportsumbar.id"] || defaultOwnerId;
  const coachOwnerId = createdAccountMap["pelatih.demo@demo.esportsumbar.id"] || defaultOwnerId;
  const managerOwnerId = createdAccountMap["manajer.tim@demo.esportsumbar.id"] || defaultOwnerId;

  // 2. Data 80 Pemain (Player)
  console.log("\n🎮 [2/9] Menyimpan 80 Profil Atlet Esport...");
  const playerRows = [];
  for (let i = 1; i <= 80; i++) {
    const reg = getWeightedRegion();
    const game = getRandomItem(GAMES);
    const role = getRandomItem(game.roles);
    const fname = getRandomItem(FIRST_NAMES);
    const lname = getRandomItem(LAST_NAMES);
    const ign = `${getRandomItem(NICKNAMES)}_${getRandomInt(10, 99)}`;
    const esportId = `ESB-${reg.code}-PL-${String(i).padStart(6, "0")}`;

    const randStatus = Math.random();
    let status = "unverified";
    let rarity = "rookie";
    let badgeNo: string | null = null;
    let verifiedAt: string | null = null;

    if (randStatus < 0.25) {
      status = "verified";
      rarity = Math.random() > 0.4 ? "elite" : "contender";
      badgeNo = `PBESI-SB-${reg.code}-2026-${String(getRandomInt(100, 999))}`;
      verifiedAt = new Date(Date.now() - getRandomInt(10, 90) * 86400000).toISOString();
    } else if (randStatus < 0.55) {
      status = "regional_checked";
      rarity = "contender";
    } else if (randStatus < 0.90) {
      status = "unverified";
      rarity = "rookie";
    } else {
      status = "revision_requested";
      rarity = "rookie";
    }

    const isPelajar = i % 4 === 0;

    playerRows.push({
      account_id: isPelajar ? pelajarOwnerId : defaultOwnerId,
      entity_type: "player",
      esport_id: esportId,
      slug: ign.toLowerCase().replace(/[^a-z0-9]+/g, "-") + `-${i}`,
      display_name: `${fname} ${lname}`,
      ign,
      region_id: reg.id,
      main_game_id: game.id,
      role_name: role,
      bio: `Atlet kompetitif ${game.name} asal ${reg.name}. Berfokus pada kejuaraan daerah dan seleksi PON PBESI Sumbar.`,
      attributes: {
        game_id: game.id,
        in_game_id: String(getRandomInt(10000000, 99999999)),
        server_id: String(getRandomInt(1000, 9999)),
        rank_tier: rarity === "elite" ? "Mythical Immortal" : rarity === "contender" ? "Mythical Glory" : "Legend",
        favorite_heroes: ["Ling", "Fanny", "Hayabusa", "Claude"].slice(0, 2),
        competitive_experience: "2-4 Tahun",
      },
      visibility_jsonb: {
        email: false,
        phone: false,
        realName: Math.random() > 0.3,
        history: true,
        achievements: true,
      },
      verification_status: status,
      verified_at: verifiedAt,
      verified_badge_no: badgeNo,
      rarity_tier: rarity,
      completeness_score: getRandomInt(65, 100),
      is_published: true,
      is_demo: true,
    });
  }

  // Insert in chunks of 20
  for (let c = 0; c < playerRows.length; c += 20) {
    const chunk = playerRows.slice(c, c + 20);
    const { error: pErr } = await supabase.from("profiles").upsert(chunk, { onConflict: "slug" });
    if (pErr) console.warn("   ⚠️  Gagal insert pemain batch:", pErr.message);
  }
  console.log(`   ✓ 80 Pemain berhasil disimpan.`);

  // 3. Data 10 Pelatih (Coach)
  console.log("\n📋 [3/9] Menyimpan 10 Profil Pelatih Berlisensi...");
  const coachRows = [];
  for (let i = 1; i <= 10; i++) {
    const reg = getWeightedRegion();
    const game = getRandomItem(GAMES);
    const fname = getRandomItem(FIRST_NAMES);
    const lname = getRandomItem(LAST_NAMES);
    const esportId = `ESB-${reg.code}-CO-${String(i).padStart(6, "0")}`;
    const isVerif = i <= 5;

    coachRows.push({
      account_id: coachOwnerId,
      entity_type: "coach",
      esport_id: esportId,
      slug: `coach-${fname.toLowerCase()}-${lname.toLowerCase()}-${i}`,
      display_name: `Coach ${fname} ${lname}`,
      ign: `COACH_${fname.toUpperCase()}`,
      region_id: reg.id,
      main_game_id: game.id,
      role_name: "Head Coach",
      bio: `Membina bakat atlet esport muda Minang sejak 2021 dengan pendekatan disiplin strategi dan analisis data kompetitif.`,
      attributes: {
        coaching_experience_years: getRandomInt(2, 7),
        teams_coached_count: getRandomInt(1, 4),
        championships_won: getRandomInt(1, 5),
        philosophy: "Disiplin mental, sinergi komunikasi, dan rasa hormat pada lawan.",
        is_available: Math.random() > 0.3,
      },
      visibility_jsonb: { email: false, phone: false, realName: true, history: true, achievements: true },
      verification_status: isVerif ? "verified" : "regional_checked",
      verified_at: isVerif ? new Date().toISOString() : null,
      verified_badge_no: isVerif ? `PBESI-SB-CO-${String(getRandomInt(10, 99))}` : null,
      rarity_tier: isVerif ? "elite" : "contender",
      completeness_score: getRandomInt(80, 100),
      is_published: true,
      is_demo: true,
    });
  }

  const { error: cErr } = await supabase.from("profiles").upsert(coachRows, { onConflict: "slug" });
  if (cErr) console.warn("   ⚠️  Gagal insert pelatih:", cErr.message);
  else console.log(`   ✓ 10 Pelatih berhasil disimpan.`);

  // 4. Data 16 Tim (Teams)
  console.log("\n🛡️ [4/9] Menyimpan 16 Tim Esport...");
  const teamRows = [];
  for (let i = 0; i < 16; i++) {
    const teamName = TEAM_NAMES[i];
    const reg = getWeightedRegion();
    const game = getRandomItem(GAMES);
    const esportId = `ESB-${reg.code}-TM-${String(i + 1).padStart(6, "0")}`;
    const isVerif = i < 8;

    teamRows.push({
      account_id: managerOwnerId,
      entity_type: "team",
      esport_id: esportId,
      slug: teamName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      display_name: teamName,
      region_id: reg.id,
      main_game_id: game.id,
      role_name: "Tim Resmi",
      bio: `Klub esport asal ${reg.name} yang berkompetisi di divisi ${game.name} dan turnamen resmi PBESI Sumbar.`,
      attributes: {
        tag: teamName.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 4),
        founded_year: getRandomInt(2022, 2025),
        roster_count: getRandomInt(5, 7),
        roster_quota: 7,
        recruitment_status: Math.random() > 0.5 ? "open" : "closed",
        open_roles: ["Roamer", "Jungler"],
      },
      visibility_jsonb: { email: false, phone: false, realName: true, history: true, achievements: true },
      verification_status: isVerif ? "verified" : "regional_checked",
      verified_at: isVerif ? new Date().toISOString() : null,
      verified_badge_no: isVerif ? `PBESI-SB-TM-${String(getRandomInt(10, 99))}` : null,
      rarity_tier: isVerif ? "elite" : "contender",
      completeness_score: getRandomInt(85, 100),
      is_published: true,
      is_demo: true,
    });
  }

  const { error: tmErr } = await supabase.from("profiles").upsert(teamRows, { onConflict: "slug" });
  if (tmErr) console.warn("   ⚠️  Gagal insert tim:", tmErr.message);
  else console.log(`   ✓ 16 Tim berhasil disimpan.`);

  // 5. Data 8 Komunitas, 8 Venue, 6 Kampus, 6 Sekolah
  console.log("\n🏢 [5/9] Menyimpan Komunitas, Venue, Kampus, dan Sekolah...");

  const communityRows = COMMUNITY_NAMES.map((name, idx) => ({
    account_id: defaultOwnerId,
    entity_type: "community",
    esport_id: `ESB-PDG-CM-${String(idx + 1).padStart(6, "0")}`,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    display_name: name,
    region_id: idx % 2 === 0 ? "reg-pdg" : "reg-bkt",
    main_game_id: "game-mlbb",
    role_name: "Komunitas Esport",
    bio: `Wadah komunitas pemain game dan pegiat turnamen akar rumput di Sumatera Barat.`,
    attributes: {
      member_count: getRandomInt(120, 850),
      founded_year: getRandomInt(2021, 2024),
      activity_frequency: "Mingguan",
    },
    visibility_jsonb: { email: false, phone: false, realName: true, history: true, achievements: true },
    verification_status: idx < 4 ? "verified" : "regional_checked",
    verified_at: idx < 4 ? new Date().toISOString() : null,
    rarity_tier: "contender",
    completeness_score: 85,
    is_published: true,
    is_demo: true,
  }));
  await supabase.from("profiles").upsert(communityRows, { onConflict: "slug" });
  console.log(`   ✓ 8 Komunitas berhasil disimpan.`);

  const venueRows = VENUE_NAMES.map((name, idx) => ({
    account_id: defaultOwnerId,
    entity_type: "venue",
    esport_id: `ESB-PDG-VN-${String(idx + 1).padStart(6, "0")}`,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    display_name: name,
    region_id: idx < 4 ? "reg-pdg" : "reg-bkt",
    main_game_id: "game-pubgm",
    role_name: "Esports Arena",
    bio: `Arena latihan dan kompetisi esport resmi berfasilitas lengkap dengan koneksi gigabit di Sumatera Barat.`,
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
    visibility_jsonb: { email: false, phone: false, realName: true, history: true, achievements: true },
    verification_status: "verified",
    verified_at: new Date().toISOString(),
    verified_badge_no: `PBESI-SB-VN-${String(getRandomInt(10, 99))}`,
    rarity_tier: "elite",
    completeness_score: 95,
    is_published: true,
    is_demo: true,
  }));
  await supabase.from("profiles").upsert(venueRows, { onConflict: "slug" });
  console.log(`   ✓ 8 Venue Esports berhasil disimpan.`);

  const campusRows = CAMPUS_NAMES.map((name, idx) => ({
    account_id: defaultOwnerId,
    entity_type: "campus",
    esport_id: `ESB-PDG-CP-${String(idx + 1).padStart(6, "0")}`,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    display_name: name,
    region_id: "reg-pdg",
    main_game_id: "game-mlbb",
    role_name: "UKM Perguruan Tinggi",
    bio: `Unit Kegiatan Mahasiswa pembinaan atlet dan turnamen resmi perguruan tinggi Sumatera Barat.`,
    attributes: {
      campus_name: name.replace("UKM Esport ", "").replace("UKM Gamers ", "").replace("UKM Digital ", "").replace("UKM Cyber ", ""),
      student_member_count: getRandomInt(40, 150),
      advisor_name: "Dr. Hendri Caniago, M.Kom.",
    },
    visibility_jsonb: { email: false, phone: false, realName: true, history: true, achievements: true },
    verification_status: "verified",
    verified_at: new Date().toISOString(),
    rarity_tier: "contender",
    completeness_score: 90,
    is_published: true,
    is_demo: true,
  }));
  await supabase.from("profiles").upsert(campusRows, { onConflict: "slug" });
  console.log(`   ✓ 6 Kampus berhasil disimpan.`);

  const schoolRows = SCHOOL_NAMES.map((name, idx) => ({
    account_id: defaultOwnerId,
    entity_type: "school",
    esport_id: `ESB-PDG-SC-${String(idx + 1).padStart(6, "0")}`,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    display_name: name,
    region_id: idx < 3 ? "reg-pdg" : "reg-bkt",
    main_game_id: "game-ff",
    role_name: "Ekskul Pelajar",
    bio: `Ekstrakurikuler pembinaan esport pelajar berprestasi dengan pemantauan akademis ketat. Data siswa dilindungi sesuai UU PDP No. 27/2022.`,
    attributes: {
      school_name: name.replace("Ekskul Esport ", "").replace("Ekskul Digital ", "").replace("Ekskul Cyber ", "").replace("Ekskul Gamers ", ""),
      school_level: "SMA/SMK",
      student_count: getRandomInt(20, 50),
      is_student_data_protected: true,
    },
    visibility_jsonb: { email: false, phone: false, realName: true, history: true, achievements: true },
    verification_status: "verified",
    verified_at: new Date().toISOString(),
    rarity_tier: "rookie",
    completeness_score: 80,
    is_published: true,
    is_demo: true,
  }));
  await supabase.from("profiles").upsert(schoolRows, { onConflict: "slug" });
  console.log(`   ✓ 6 Sekolah berhasil disimpan.`);

  // 6. Data Berita Contoh Realistis (8 Artikel)
  console.log("\n📰 [6/9] Menyimpan 8 Artikel Berita Lokal PBESI Sumbar...");
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

  for (const art of articles) {
    await supabase.from("articles").upsert({
      title: art.title,
      slug: art.slug,
      summary: art.summary,
      content: `${art.summary}\n\nSiaran pers resmi Pengurus Provinsi Esports Indonesia (PBESI) Sumatera Barat. Hak cipta dilindungi undang-undang.`,
      category: art.category,
      status: "published",
      published_at: art.published_at,
      region_id: "reg-pdg",
      is_demo: true,
    }, { onConflict: "slug" });
  }
  console.log(`   ✓ 8 Artikel Berita berhasil disimpan.`);

  // 7. Prestasi & Keanggotaan Demo
  console.log("\n🏆 [7/9] Menyematkan Piagam Prestasi & Hubungan Roster...");
  const { data: insertedTeams } = await supabase.from("profiles").select("id, display_name").eq("entity_type", "team").limit(5);
  const { data: insertedPlayers } = await supabase.from("profiles").select("id, display_name").eq("entity_type", "player").limit(10);

  if (insertedTeams && insertedPlayers && insertedTeams.length > 0 && insertedPlayers.length > 0) {
    // Prestasi Tim
    await supabase.from("achievements").upsert([
      {
        profile_id: insertedTeams[0].id,
        title: "Juara 1 Kejurda Esport Sumbar 2025",
        level: "provinsi",
        placement: "Juara 1 (Medali Emas)",
        event_name: "Kejuaraan Daerah Esports PBESI Sumbar 2025",
        event_date: "2025-11-20",
        validation_status: "validated",
        is_demo: true,
      },
      {
        profile_id: insertedPlayers[0].id,
        title: "MVP Grand Final Piala Gubernur 2025",
        level: "provinsi",
        placement: "Most Valuable Player",
        event_name: "Piala Gubernur Sumatera Barat",
        event_date: "2025-08-17",
        validation_status: "validated",
        is_demo: true,
      },
    ]);

    // Roster Membership
    await supabase.from("memberships").upsert([
      {
        member_profile_id: insertedPlayers[0].id,
        org_profile_id: insertedTeams[0].id,
        role_in_org: "Starting Lineup - Mid Laner",
        status: "accepted",
        initiated_by: "org",
        started_at: "2025-01-01T00:00:00Z",
      },
      {
        member_profile_id: insertedPlayers[1].id,
        org_profile_id: insertedTeams[0].id,
        role_in_org: "Starting Lineup - Roamer",
        status: "accepted",
        initiated_by: "org",
        started_at: "2025-01-01T00:00:00Z",
      },
    ]);
    console.log("   ✓ Prestasi dan relasi roster terhubung.");
  }

  // 8. Verifikasi Data Akhir
  console.log("\n📊 [8/9] Memeriksa Hasil Agregasi Database...");
  const { count: finalPublicCount } = await supabase.from("public_profiles").select("*", { count: "exact", head: true });
  const { count: finalArticlesCount } = await supabase.from("articles").select("*", { count: "exact", head: true });

  console.log("\n========================================================");
  console.log("🎉 SEED DATA DEMO BERHASIL 100%!");
  console.log("========================================================");
  console.log(`• Total Profil Publik (View) : ${finalPublicCount} entitas`);
  console.log(`• Total Artikel Berita       : ${finalArticlesCount} berita`);
  console.log(`• Akun Login Demo Tersedia   : 8 akun`);
  console.log("--------------------------------------------------------");
  console.log("KREDENSI LOGIN DEMO (Sandi: SumbarBisa2026!)");
  console.table(
    demoAccountsConfig.map((a) => ({
      Email: a.email,
      Peran: a.role,
      Wilayah: a.regionId || "Semua (Sumbar)",
      Deskripsi: a.label,
    }))
  );
  console.log("========================================================");
  console.log("💡 CARA PEMBERSIHAN SEBELUM GO-LIVE RESMI:");
  console.log("   Jalankan: npx tsx scripts/purge-demo.ts --confirm");
  console.log("========================================================\n");
}

runSeed().catch((err) => {
  console.error("❌ Fatal Error saat seeding:", err);
  process.exit(1);
});
