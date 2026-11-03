-- ==============================================================================
-- ESPORT SUMBAR V2 - Seed Data (19 Wilayah Sumbar & Master Game Resmi)
-- Basis: docs/esport-sumbar-prd.md & src/data/regions.ts & src/data/games.ts
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. SEED 19 KOTA & KABUPATEN SUMATERA BARAT
-- ------------------------------------------------------------------------------
INSERT INTO public.regions (id, name, code, type, slug, is_pilot, admin_mode, esi_contact_name, esi_secretariat, description)
VALUES
-- 7 KOTA
('reg-pdg', 'Kota Padang', 'PDG', 'kota', 'kota-padang', true, 'active', 
 'Rahmat Hidayat, S.Kom (Ketua Pengcab ESI Kota Padang)', 'Kompleks GOR H. Agus Salim, Padang Barat', 
 'Ibukota provinsi dan pusat kompetisi esport Sumatera Barat dengan jumlah atlet dan klub aktif terbesar.'),

('reg-bkt', 'Kota Bukittinggi', 'BKT', 'kota', 'kota-bukittinggi', false, 'active', 
 'Aldi Kurniawan (Sekretaris Umum ESI Bukittinggi)', 'Gedung Pemuda & Olahraga, Gulai Bancah, Bukittinggi', 
 'Kota wisata dengan basis komunitas Mobile Legends dan Free Fire yang sangat kompetitif di tingkat regional.'),

('reg-pyk', 'Kota Payakumbuh', 'PYK', 'kota', 'kota-payakumbuh', false, 'active', 
 'Fajar Nugraha (Ketua Harian ESI Payakumbuh)', 'Kawasan Gelanggang Kubu Gadang, Payakumbuh Barat', 
 'Pusat ekosistem esport Luak Limopuluah dengan turnamen komunitas bulanan yang konsisten.'),

('reg-ppj', 'Kota Padang Panjang', 'PPJ', 'kota', 'kota-padang-panjang', false, 'fallback', 
 'Layanan Ditangani Langsung oleh Pengprov ESI Sumbar (Mode Fallback)', 'Layanan Daring Sekretariat ESI Sumbar', 
 'Kota Serambi Mekah dengan pertumbuhan komunitas esport pelajar tingkat SMA/SMK dan perguruan tinggi seni.'),

('reg-prm', 'Kota Pariaman', 'PRM', 'kota', 'kota-pariaman', false, 'fallback', 
 'Layanan Ditangani Langsung oleh Pengprov ESI Sumbar (Mode Fallback)', 'Layanan Daring Sekretariat ESI Sumbar', 
 'Kota pesisir dengan potensi talenta divisi battle royale dan atlet eksibisi tingkat daerah.'),

('reg-swl', 'Kota Sawahlunto', 'SWL', 'kota', 'kota-sawahlunto', false, 'fallback', 
 'Layanan Ditangani Langsung oleh Pengprov ESI Sumbar (Mode Fallback)', 'Layanan Daring Sekretariat ESI Sumbar', 
 'Kota Warisan Budaya dengan inisiatif pembinaan talenta esport muda melalui klub komunitas lokal.'),

('reg-slk', 'Kota Solok', 'SLK', 'kota', 'kota-solok', false, 'active', 
 'Budi Santoso, S.Pd (Ketua Pengcab ESI Kota Solok)', 'Gelanggang Olahraga Marah Adin, Solok', 
 'Pusat esport wilayah Solok Raya dengan atlet Free Fire dan eFootball yang aktif berprestasi.'),

-- 12 KABUPATEN
('reg-pdp', 'Kab. Padang Pariaman', 'PDP', 'kabupaten', 'kab-padang-pariaman', true, 'active', 
 'M. Ikhsan, M.Si (Ketua Harian ESI Padang Pariaman)', 'Kantor KONI Padang Pariaman, Parit Malintang', 
 'Wilayah mitra pilot kedua dengan pembinaan atlet divisi PUBG Mobile peraih medali emas PON.'),

('reg-agm', 'Kab. Agam', 'AGM', 'kabupaten', 'kab-agam', false, 'active', 
 'H. Zulkifli (Koordinator Pengcab ESI Agam)', 'Kawasan Sport Center Rang Agam, Lubuk Basung', 
 'Kabupaten luas dengan dua zona pembinaan aktif (Agam Barat Lubuk Basung dan Agam Timur sekeliling Bukittinggi).'),

('reg-lpk', 'Kab. Lima Puluh Kota', 'LPK', 'kabupaten', 'kab-lima-puluh-kota', false, 'fallback', 
 'Layanan Ditangani Langsung oleh Pengprov ESI Sumbar (Mode Fallback)', 'Layanan Daring Sekretariat ESI Sumbar', 
 'Daerah penyangga Luak Limopuluah dengan talenta muda potensial dari kawasan Harau dan sekitarnya.'),

('reg-tnd', 'Kab. Tanah Datar', 'TND', 'kabupaten', 'kab-tanah-datar', false, 'fallback', 
 'Layanan Ditangani Langsung oleh Pengprov ESI Sumbar (Mode Fallback)', 'Layanan Daring Sekretariat ESI Sumbar', 
 'Pusat kebudayaan Minangkabau Luak Nan Tuo dengan komunitas esport kampus dan antarsekolah yang dinamis.'),

('reg-pss', 'Kab. Pesisir Selatan', 'PSS', 'kabupaten', 'kab-pesisir-selatan', false, 'fallback', 
 'Layanan Ditangani Langsung oleh Pengprov ESI Sumbar (Mode Fallback)', 'Layanan Daring Sekretariat ESI Sumbar', 
 'Wilayah pesisir selatan dengan persebaran atlet dari Painan hingga Tapan.'),

('reg-pas', 'Kab. Pasaman', 'PAS', 'kabupaten', 'kab-pasaman', false, 'fallback', 
 'Layanan Ditangani Langsung oleh Pengprov ESI Sumbar (Mode Fallback)', 'Layanan Daring Sekretariat ESI Sumbar', 
 'Wilayah utara Sumatera Barat yang tengah memulai pendataan atlet digital terpadu.'),

('reg-psb', 'Kab. Pasaman Barat', 'PSB', 'kabupaten', 'kab-pasaman-barat', false, 'fallback', 
 'Layanan Ditangani Langsung oleh Pengprov ESI Sumbar (Mode Fallback)', 'Layanan Daring Sekretariat ESI Sumbar', 
 'Daerah pesisir barat utara dengan animo turnamen mobile game yang tinggi.'),

('reg-sjj', 'Kab. Sijunjung', 'SJJ', 'kabupaten', 'kab-sijunjung', false, 'fallback', 
 'Layanan Ditangani Langsung oleh Pengprov ESI Sumbar (Mode Fallback)', 'Layanan Daring Sekretariat ESI Sumbar', 
 'Wilayah Ranah Lansek Manih dengan komunitas esport yang berkembang di kawasan Muaro Sijunjung.'),

('reg-dhm', 'Kab. Dharmasraya', 'DHM', 'kabupaten', 'kab-dharmasraya', false, 'fallback', 
 'Layanan Ditangani Langsung oleh Pengprov ESI Sumbar (Mode Fallback)', 'Layanan Daring Sekretariat ESI Sumbar', 
 'Pintu gerbang selatan Sumbar dengan keterlibatan komunitas kompetitif lintas batas provinsi.'),

('reg-ksl', 'Kab. Solok', 'KSL', 'kabupaten', 'kab-solok', false, 'fallback', 
 'Layanan Ditangani Langsung oleh Pengprov ESI Sumbar (Mode Fallback)', 'Layanan Daring Sekretariat ESI Sumbar', 
 'Kawasan perbukitan dan danau dengan komunitas esport yang tersebar di Arosuka dan Alahan Panjang.'),

('reg-sls', 'Kab. Solok Selatan', 'SLS', 'kabupaten', 'kab-solok-selatan', false, 'fallback', 
 'Layanan Ditangani Langsung oleh Pengprov ESI Sumbar (Mode Fallback)', 'Layanan Daring Sekretariat ESI Sumbar', 
 'Kawasan Nagari Seribu Rumah Gadang dengan potensi bibit atlet muda yang mulai terdata.'),

('reg-mtw', 'Kab. Kepulauan Mentawai', 'MTW', 'kabupaten', 'kab-kepulauan-mentawai', false, 'fallback', 
 'Layanan Ditangani Langsung oleh Pengprov ESI Sumbar (Mode Fallback)', 'Layanan Daring Sekretariat ESI Sumbar', 
 'Wilayah kepulauan terluar yang terhubung dengan pangkalan data esport terpusat Sumatera Barat.')

ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    code = EXCLUDED.code,
    type = EXCLUDED.type,
    slug = EXCLUDED.slug,
    is_pilot = EXCLUDED.is_pilot,
    admin_mode = EXCLUDED.admin_mode,
    esi_contact_name = EXCLUDED.esi_contact_name,
    esi_secretariat = EXCLUDED.esi_secretariat,
    description = EXCLUDED.description;

-- ------------------------------------------------------------------------------
-- 2. SEED MASTER GAME RESMI PBESI
-- ------------------------------------------------------------------------------
INSERT INTO public.games (id, name, short_name, slug, publisher, category, roles_jsonb, is_active)
VALUES
('game-mlbb', 'Mobile Legends: Bang Bang', 'MLBB', 'mlbb', 'Moonton', 'MOBA Mobile', 
 '["Roamer", "Mid Laner", "Gold Laner", "EXP Laner", "Jungler"]'::jsonb, true),

('game-ff', 'Free Fire', 'Free Fire', 'free-fire', 'Garena', 'Battle Royale Mobile', 
 '["Rusher", "Sniper", "Support", "Shotcaller / IGL"]'::jsonb, true),

('game-pubgm', 'PUBG Mobile', 'PUBGM', 'pubgm', 'Tencent / Level Infinite', 'Battle Royale Mobile', 
 '["IGL", "Rusher", "Sniper", "Support", "Scout"]'::jsonb, true),

('game-val', 'Valorant', 'Valorant', 'valorant', 'Riot Games', 'Tactical Shooter PC', 
 '["Duelist", "Initiator", "Controller", "Sentinel", "Flex"]'::jsonb, true),

('game-efootball', 'eFootball / FC Mobile', 'eFootball', 'efootball', 'Konami / EA Sports', 'Sports Simulation', 
 '["Solo Player", "Duo / Co-op"]'::jsonb, true)

ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    short_name = EXCLUDED.short_name,
    slug = EXCLUDED.slug,
    publisher = EXCLUDED.publisher,
    category = EXCLUDED.category,
    roles_jsonb = EXCLUDED.roles_jsonb,
    is_active = EXCLUDED.is_active;
