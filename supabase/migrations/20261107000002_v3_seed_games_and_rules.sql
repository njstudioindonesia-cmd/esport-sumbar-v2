-- ==============================================================================
-- ESPORT SUMBAR V3 - Database Migration 0011: SEED Games & Relation Rules
-- Basis: docs/adr/ADR-004 & ADR-005 & Bagian 3.4 & 3.5 Dokumen Transformasi
-- ==============================================================================

-- 1. SEED / UPDATE MASTER GAMES RESMI V3
INSERT INTO public.games (id, name, short_name, slug, publisher, category, genre, platform, is_active)
VALUES
    ('game-hok', 'Honor of Kings', 'HOK', 'honor-of-kings', 'Level Infinite / TiMi Studio', 'MOBA Mobile', 'moba', 'mobile', TRUE),
    ('game-mlbb', 'Mobile Legends: Bang Bang', 'MLBB', 'mobile-legends', 'Moonton', 'MOBA Mobile', 'moba', 'mobile', TRUE),
    ('game-ff', 'Free Fire', 'FF', 'free-fire', 'Garena', 'Battle Royale', 'battle_royale', 'mobile', TRUE),
    ('game-pubgm', 'PUBG Mobile', 'PUBGM', 'pubg-mobile', 'Krafton / Level Infinite', 'Battle Royale', 'battle_royale', 'mobile', TRUE),
    ('game-codm', 'Call of Duty: Mobile', 'CODM', 'call-of-duty-mobile', 'Activision / Garena', 'FPS Mobile', 'fps', 'mobile', TRUE),
    ('game-wildrift', 'League of Legends: Wild Rift', 'Wild Rift', 'wild-rift', 'Riot Games', 'MOBA Mobile', 'moba', 'mobile', TRUE),
    ('game-pokemon', 'Pokémon UNITE', 'Pokemon Unite', 'pokemon-unite', 'The Pokémon Company', 'MOBA', 'moba', 'cross_platform', TRUE),
    ('game-valorant', 'Valorant', 'Valorant', 'valorant', 'Riot Games', 'Tactical FPS', 'fps', 'pc', TRUE),
    ('game-cs2', 'Counter-Strike 2', 'CS2', 'counter-strike-2', 'Valve', 'Tactical FPS', 'fps', 'pc', TRUE),
    ('game-dota2', 'Dota 2', 'Dota 2', 'dota-2', 'Valve', 'MOBA PC', 'moba', 'pc', TRUE),
    ('game-efootball', 'eFootball', 'eFootball', 'efootball', 'Konami', 'Sports', 'sports', 'cross_platform', TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    short_name = EXCLUDED.short_name,
    slug = EXCLUDED.slug,
    publisher = EXCLUDED.publisher,
    category = EXCLUDED.category,
    genre = EXCLUDED.genre,
    platform = EXCLUDED.platform,
    is_active = EXCLUDED.is_active;

-- 2. SEED DINAMIS GAME ROLES
-- Honor of Kings (HOK)
INSERT INTO public.game_roles (game_id, role_name, description, sort_order)
VALUES
    ('game-hok', 'Clash Lane', 'Fighter / Tank penjaga koridor solo', 1),
    ('game-hok', 'Jungle', 'Inisiator netral dan objektif monster', 2),
    ('game-hok', 'Mid Lane', 'Mage pengontrol area tengah dan rotasi', 3),
    ('game-hok', 'Farm Lane', 'Marksman penumpu daya serang jarak jauh', 4),
    ('game-hok', 'Roam', 'Support penjelajah pelindung tim', 5)
ON CONFLICT (game_id, role_name) DO NOTHING;

-- Mobile Legends: Bang Bang (MLBB)
INSERT INTO public.game_roles (game_id, role_name, description, sort_order)
VALUES
    ('game-mlbb', 'Gold Lane', 'Marksman / Carry late game', 1),
    ('game-mlbb', 'EXP Lane', 'Offlaner durabilitas tinggi', 2),
    ('game-mlbb', 'Mid Lane', 'Mage burst damage dan wave clear', 3),
    ('game-mlbb', 'Jungler', 'Assasin / Core pengambil objektif Turtle/Lord', 4),
    ('game-mlbb', 'Roamer', 'Tank / Support pembuka visi peta', 5)
ON CONFLICT (game_id, role_name) DO NOTHING;

-- Free Fire (FF)
INSERT INTO public.game_roles (game_id, role_name, description, sort_order)
VALUES
    ('game-ff', 'Rusher', 'Penerobos garis pertahanan musuh', 1),
    ('game-ff', 'Supporter', 'Penyedia bantuan medkit dan utility', 2),
    ('game-ff', 'Sniper', 'Penembak runduk jarak jauh', 3),
    ('game-ff', 'Flanker', 'Penyergap dari arah tak terduga', 4),
    ('game-ff', 'IGL', 'In-Game Leader pengambil keputusan zona', 5)
ON CONFLICT (game_id, role_name) DO NOTHING;

-- PUBG Mobile (PUBGM)
INSERT INTO public.game_roles (game_id, role_name, description, sort_order)
VALUES
    ('game-pubgm', 'IGL', 'Kapten strategi dan rotasi kendaraan', 1),
    ('game-pubgm', 'Assaulter', 'Ujung tombak pertempuran jarak dekat', 2),
    ('game-pubgm', 'Support', 'Pengaman perimeter dan penyedia utility', 3),
    ('game-pubgm', 'Scout / Sniper', 'Pencari rute aman dan pengintai jarak jauh', 4)
ON CONFLICT (game_id, role_name) DO NOTHING;

-- Valorant
INSERT INTO public.game_roles (game_id, role_name, description, sort_order)
VALUES
    ('game-valorant', 'Duelist', 'Pencari entry frag utama', 1),
    ('game-valorant', 'Initiator', 'Pembuka ruang dan pengumpul informasi', 2),
    ('game-valorant', 'Controller', 'Penyedia asap penutup pandangan', 3),
    ('game-valorant', 'Sentinel', 'Pengunci area tapak bom dan pengintai', 4),
    ('game-valorant', 'IGL', 'In-Game Leader taktik ronde', 5)
ON CONFLICT (game_id, role_name) DO NOTHING;

-- Dota 2
INSERT INTO public.game_roles (game_id, role_name, description, sort_order)
VALUES
    ('game-dota2', 'Carry (Pos 1)', 'Pengumpul kekayaan utama tim', 1),
    ('game-dota2', 'Midlaner (Pos 2)', 'Pembuat tempo permainan tengah', 2),
    ('game-dota2', 'Offlaner (Pos 3)', 'Pencipta kekacauan garis depan', 3),
    ('game-dota2', 'Soft Support (Pos 4)', 'Roamer pemberi tekanan awal', 4),
    ('game-dota2', 'Hard Support (Pos 5)', 'Pengaman carry dan peletak ward', 5)
ON CONFLICT (game_id, role_name) DO NOTHING;

-- CS2
INSERT INTO public.game_roles (game_id, role_name, description, sort_order)
VALUES
    ('game-cs2', 'Entry Fragger', 'Penerobos pertama ke bombsite', 1),
    ('game-cs2', 'AWPer', 'Penembak jitu sniper tim', 2),
    ('game-cs2', 'Support', 'Pelepar flashbang/smoke utility', 3),
    ('game-cs2', 'Lurker', 'Penyelinap memotong rotasi musuh', 4),
    ('game-cs2', 'IGL', 'Pemanggil strategi tembakan', 5)
ON CONFLICT (game_id, role_name) DO NOTHING;

-- Wild Rift
INSERT INTO public.game_roles (game_id, role_name, description, sort_order)
VALUES
    ('game-wildrift', 'Baron Lane', 'Duelist koridor atas', 1),
    ('game-wildrift', 'Jungle', 'Pengendali monster rimba', 2),
    ('game-wildrift', 'Mid Lane', 'Pemberi damage sihir sentral', 3),
    ('game-wildrift', 'Dragon Lane', 'Marksman koridor naga', 4),
    ('game-wildrift', 'Support', 'Pelindung dan pengontrol massa', 5)
ON CONFLICT (game_id, role_name) DO NOTHING;

-- Pokemon Unite & CODM
INSERT INTO public.game_roles (game_id, role_name, description, sort_order)
VALUES
    ('game-pokemon', 'Attacker', 'Pemberi damage ofensif', 1),
    ('game-pokemon', 'Defender', 'Pertahanan pelindung ring gol', 2),
    ('game-pokemon', 'Speedster', 'Mobilitas kilat penyetak skor', 3),
    ('game-pokemon', 'All-Rounder', 'Keseimbangan serangan dan pertahanan', 4),
    ('game-pokemon', 'Supporter', 'Penyembuh dan penyedia efek bantuan', 5),
    ('game-codm', 'Slayer', 'Pengumpul eliminasi musuh', 1),
    ('game-codm', 'Anchor', 'Penahan titik respawn strategis', 2),
    ('game-codm', 'Support', 'Penyedia skorstreak dan taktis', 3),
    ('game-codm', 'OBJ', 'Fokus pada penguasaan objektif peta', 4),
    ('game-codm', 'Flex', 'Fleksibel menyesuaikan ritme pertandingan', 5),
    ('game-efootball', 'Player', 'Atlet cabang eFootball', 1)
ON CONFLICT (game_id, role_name) DO NOTHING;

-- 3. SEED ATURAN EKOSISTEM (relation_rules)
INSERT INTO public.relation_rules (source_entity_type, target_entity_type, relation_type, requires_approval, max_active_limit, game_match_required, is_active)
VALUES
    -- Player
    ('player', 'team', 'anggota', TRUE, 3, TRUE, TRUE),
    ('player', 'community', 'anggota', TRUE, 5, FALSE, TRUE),
    ('player', 'school', 'siswa', TRUE, 1, FALSE, TRUE),
    ('player', 'campus', 'mahasiswa', TRUE, 1, FALSE, TRUE),
    
    -- Coach
    ('coach', 'team', 'pelatih', TRUE, 5, TRUE, TRUE),
    ('coach', 'school', 'pembina', TRUE, 3, FALSE, TRUE),
    ('coach', 'campus', 'pembina', TRUE, 3, FALSE, TRUE),
    ('coach', 'community', 'penasihat', TRUE, 3, FALSE, TRUE),
    
    -- Team
    ('team', 'community', 'naungan', TRUE, 3, FALSE, TRUE),
    ('team', 'school', 'mewakili', TRUE, 1, FALSE, TRUE),
    ('team', 'campus', 'mewakili', TRUE, 1, FALSE, TRUE),
    ('team', 'venue', 'basecamp', TRUE, 1, FALSE, TRUE),
    
    -- Community
    ('community', 'venue', 'markas', TRUE, 3, FALSE, TRUE),
    ('community', 'school', 'kerja_sama', TRUE, 5, FALSE, TRUE),
    ('community', 'campus', 'kerja_sama', TRUE, 5, FALSE, TRUE),
    
    -- Institutions
    ('school', 'venue', 'tempat_latihan', TRUE, 3, FALSE, TRUE),
    ('campus', 'venue', 'tempat_latihan', TRUE, 3, FALSE, TRUE)
ON CONFLICT (source_entity_type, target_entity_type, relation_type) DO UPDATE SET
    requires_approval = EXCLUDED.requires_approval,
    max_active_limit = EXCLUDED.max_active_limit,
    game_match_required = EXCLUDED.game_match_required,
    is_active = EXCLUDED.is_active;
