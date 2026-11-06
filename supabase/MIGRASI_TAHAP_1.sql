-- ==============================================================================
-- ESPORT SUMBAR V3 - MIGRASI TAHAP 1: STRUKTUR TABEL, SEED, & DATA
-- Jalankan skrip ini pertama di Supabase SQL Editor.
-- ==============================================================================

BEGIN;

-- 1.1 Perbarui batasan CHECK pada accounts.role
ALTER TABLE public.accounts 
    DROP CONSTRAINT IF EXISTS accounts_role_check;

ALTER TABLE public.accounts 
    ADD CONSTRAINT accounts_role_check 
    CHECK (role IN ('user', 'region_admin', 'prov_admin', 'platform_operator', 'platform_admin'));

-- 1.2 Perbarui batasan CHECK pada profiles.verification_status
ALTER TABLE public.profiles 
    DROP CONSTRAINT IF EXISTS profiles_verification_status_check;

ALTER TABLE public.profiles 
    ADD CONSTRAINT profiles_verification_status_check 
    CHECK (verification_status IN (
        'unverified', 'draft', 'submitted', 
        'under_review', 'in_review_regional', 'regional_checked', 'in_review_provincial',
        'revision_requested', 'revision', 
        'verified', 'prov_verified', 
        'rejected', 'suspended', 'expired'
    ));

-- 1.3 Perbarui batasan CHECK pada verification_requests.status
ALTER TABLE public.verification_requests 
    DROP CONSTRAINT IF EXISTS verification_requests_status_check;

ALTER TABLE public.verification_requests 
    ADD CONSTRAINT verification_requests_status_check 
    CHECK (status IN (
        'submitted', 'under_review', 'regional_review', 'regional_approved', 'provincial_review',
        'revision_requested', 'revision', 
        'verified', 'prov_verified', 
        'rejected', 'suspended', 'expired'
    ));

ALTER TABLE public.verification_requests 
    ADD COLUMN IF NOT EXISTS reviewer_id UUID REFERENCES public.accounts(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
    ADD COLUMN IF NOT EXISTS admin_notes TEXT,
    ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ;

-- 1.4 Tambah kolom baru pada tabel games
ALTER TABLE public.games 
    ADD COLUMN IF NOT EXISTS genre VARCHAR(50) DEFAULT 'other' CHECK (genre IN ('moba', 'battle_royale', 'fps', 'sports', 'fighting', 'racing', 'strategy', 'other')),
    ADD COLUMN IF NOT EXISTS platform VARCHAR(50) DEFAULT 'mobile' CHECK (platform IN ('mobile', 'pc', 'console', 'cross_platform')),
    ADD COLUMN IF NOT EXISTS icon_url TEXT;

-- 1.5 Tabel Dinamis game_roles
CREATE TABLE IF NOT EXISTS public.game_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id VARCHAR(50) NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
    role_name VARCHAR(100) NOT NULL,
    description TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_game_role UNIQUE(game_id, role_name)
);

CREATE INDEX IF NOT EXISTS idx_game_roles_game_id ON public.game_roles(game_id);

-- 1.6 Tabel Dinamis game_ranks
CREATE TABLE IF NOT EXISTS public.game_ranks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id VARCHAR(50) NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
    tier_name VARCHAR(100) NOT NULL,
    tier_level INT NOT NULL DEFAULT 0,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_game_rank UNIQUE(game_id, tier_name)
);

CREATE INDEX IF NOT EXISTS idx_game_ranks_game_id ON public.game_ranks(game_id);

-- 1.7 Tabel relation_rules (Aturan Ekosistem Deklaratif)
CREATE TABLE IF NOT EXISTS public.relation_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_entity_type VARCHAR(30) NOT NULL CHECK (source_entity_type IN ('player', 'coach', 'team', 'community', 'venue', 'school', 'campus', 'organizer')),
    target_entity_type VARCHAR(30) NOT NULL CHECK (target_entity_type IN ('player', 'coach', 'team', 'community', 'venue', 'school', 'campus', 'organizer')),
    relation_type VARCHAR(50) NOT NULL,
    requires_approval BOOLEAN NOT NULL DEFAULT TRUE,
    max_active_limit INT NOT NULL DEFAULT 1,
    game_match_required BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_relation_rule_pair UNIQUE(source_entity_type, target_entity_type, relation_type)
);

-- 1.8 Tabel entity_relations (Hubungan Resmi Antar Entitas Ekosistem V3)
CREATE TABLE IF NOT EXISTS public.entity_relations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    target_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    relation_type VARCHAR(50) NOT NULL,
    game_id VARCHAR(50) REFERENCES public.games(id) ON DELETE SET NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'rejected', 'cancelled', 'expired', 'ended')),
    metadata_jsonb JSONB NOT NULL DEFAULT '{}'::jsonb,
    expires_at TIMESTAMPTZ,
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    approved_by UUID REFERENCES public.accounts(id) ON DELETE SET NULL,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_active_relation UNIQUE(source_profile_id, target_profile_id, relation_type)
);

CREATE INDEX IF NOT EXISTS idx_entity_relations_source ON public.entity_relations(source_profile_id);
CREATE INDEX IF NOT EXISTS idx_entity_relations_target ON public.entity_relations(target_profile_id);
CREATE INDEX IF NOT EXISTS idx_entity_relations_status ON public.entity_relations(status);

ALTER TABLE public.entity_relations 
    ADD COLUMN IF NOT EXISTS game_id VARCHAR(50) REFERENCES public.games(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS started_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS ended_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES public.accounts(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

ALTER TABLE public.entity_relations 
    DROP CONSTRAINT IF EXISTS entity_relations_status_check;

ALTER TABLE public.entity_relations 
    ADD CONSTRAINT entity_relations_status_check 
    CHECK (status IN ('pending', 'active', 'rejected', 'cancelled', 'expired', 'ended'));

-- 1.9 Tabel profiles_archived (Penyimpanan Profil Sekunder yang Diarsipkan)
CREATE TABLE IF NOT EXISTS public.profiles_archived (
    id UUID PRIMARY KEY,
    account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
    entity_type VARCHAR(30) NOT NULL,
    esport_id VARCHAR(50) NOT NULL,
    display_name VARCHAR(150) NOT NULL,
    original_data JSONB NOT NULL,
    archived_reason TEXT NOT NULL DEFAULT 'Penegakan aturan 1 akun 1 profil (Keputusan D2 V3)',
    archived_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_archived_account_id ON public.profiles_archived(account_id);

-- 1.10 Tabel outbox_events (Pola Transactional Outbox)
CREATE TABLE IF NOT EXISTS public.outbox_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_name VARCHAR(100) NOT NULL,
    aggregate_type VARCHAR(50) NOT NULL,
    aggregate_id UUID NOT NULL,
    payload JSONB NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'failed')),
    retry_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    processed_at TIMESTAMPTZ,
    error_message TEXT
);

CREATE INDEX IF NOT EXISTS idx_outbox_events_status ON public.outbox_events(status, created_at);

-- 1.11 View audit_logs_view
CREATE OR REPLACE VIEW public.audit_logs_view AS
SELECT 
    id,
    actor_account_id AS actor_id,
    CASE 
        WHEN actor_role = 'region_admin' THEN 'verifikator_daerah'
        WHEN actor_role = 'prov_admin' THEN 'verifikator_provinsi'
        WHEN actor_role = 'platform_operator' THEN 'operator_platform'
        ELSE actor_role 
    END AS display_role,
    actor_role AS raw_role,
    action,
    target_type AS entity_type,
    target_id AS entity_id,
    previous_status AS old_status,
    new_status,
    reason,
    metadata_jsonb,
    actor_ip AS ip_address,
    occurred_at AS created_at
FROM public.audit_logs;

-- 2.1 Master Games
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

-- 2.2 Roles Honor of Kings (HOK)
INSERT INTO public.game_roles (game_id, role_name, description, sort_order)
VALUES
    ('game-hok', 'Clash Lane', 'Fighter / Tank penjaga koridor solo', 1),
    ('game-hok', 'Jungle', 'Inisiator netral dan objektif monster', 2),
    ('game-hok', 'Mid Lane', 'Mage pengontrol area tengah dan rotasi', 3),
    ('game-hok', 'Farm Lane', 'Marksman penumpu daya serang jarak jauh', 4),
    ('game-hok', 'Roam', 'Support penjelajah pelindung tim', 5)
ON CONFLICT (game_id, role_name) DO NOTHING;

-- 2.3 Roles MLBB
INSERT INTO public.game_roles (game_id, role_name, description, sort_order)
VALUES
    ('game-mlbb', 'Gold Lane', 'Marksman / Carry late game', 1),
    ('game-mlbb', 'EXP Lane', 'Offlaner durabilitas tinggi', 2),
    ('game-mlbb', 'Mid Lane', 'Mage burst damage dan wave clear', 3),
    ('game-mlbb', 'Jungler', 'Assasin / Core pengambil objektif Turtle/Lord', 4),
    ('game-mlbb', 'Roamer', 'Tank / Support pembuka visi peta', 5)
ON CONFLICT (game_id, role_name) DO NOTHING;

-- 2.4 Roles Free Fire & PUBG Mobile
INSERT INTO public.game_roles (game_id, role_name, description, sort_order)
VALUES
    ('game-ff', 'Rusher', 'Penerobos garis pertahanan musuh', 1),
    ('game-ff', 'Supporter', 'Penyedia bantuan medkit dan utility', 2),
    ('game-ff', 'Sniper', 'Penembak runduk jarak jauh', 3),
    ('game-ff', 'Flanker', 'Penyergap dari arah tak terduga', 4),
    ('game-ff', 'IGL', 'In-Game Leader pengambil keputusan zona', 5),
    ('game-pubgm', 'IGL', 'Kapten strategi dan rotasi kendaraan', 1),
    ('game-pubgm', 'Assaulter', 'Ujung tombak pertempuran jarak dekat', 2),
    ('game-pubgm', 'Support', 'Pengaman perimeter dan penyedia utility', 3),
    ('game-pubgm', 'Scout / Sniper', 'Pencari rute aman dan pengintai jarak jauh', 4)
ON CONFLICT (game_id, role_name) DO NOTHING;

-- 2.5 Roles Valorant & Dota 2
INSERT INTO public.game_roles (game_id, role_name, description, sort_order)
VALUES
    ('game-valorant', 'Duelist', 'Pencari entry frag utama', 1),
    ('game-valorant', 'Initiator', 'Pembuka ruang dan pengumpul informasi', 2),
    ('game-valorant', 'Controller', 'Penyedia asap penutup pandangan', 3),
    ('game-valorant', 'Sentinel', 'Pengunci area tapak bom dan pengintai', 4),
    ('game-valorant', 'IGL', 'In-Game Leader taktik ronde', 5),
    ('game-dota2', 'Carry (Pos 1)', 'Pengumpul kekayaan utama tim', 1),
    ('game-dota2', 'Midlaner (Pos 2)', 'Pembuat tempo permainan tengah', 2),
    ('game-dota2', 'Offlaner (Pos 3)', 'Pencipta kekacauan garis depan', 3),
    ('game-dota2', 'Soft Support (Pos 4)', 'Roamer pemberi tekanan awal', 4),
    ('game-dota2', 'Hard Support (Pos 5)', 'Pengaman carry dan peletak ward', 5)
ON CONFLICT (game_id, role_name) DO NOTHING;

-- 2.6 Seed Aturan Ekosistem (relation_rules)
INSERT INTO public.relation_rules (source_entity_type, target_entity_type, relation_type, requires_approval, max_active_limit, game_match_required, is_active)
VALUES
    ('player', 'team', 'anggota', TRUE, 3, TRUE, TRUE),
    ('player', 'community', 'anggota', TRUE, 5, FALSE, TRUE),
    ('player', 'school', 'siswa', TRUE, 1, FALSE, TRUE),
    ('player', 'campus', 'mahasiswa', TRUE, 1, FALSE, TRUE),
    ('coach', 'team', 'pelatih', TRUE, 5, TRUE, TRUE),
    ('coach', 'school', 'pembina', TRUE, 3, FALSE, TRUE),
    ('coach', 'campus', 'pembina', TRUE, 3, FALSE, TRUE),
    ('coach', 'community', 'penasihat', TRUE, 3, FALSE, TRUE),
    ('team', 'community', 'naungan', TRUE, 3, FALSE, TRUE),
    ('team', 'school', 'mewakili', TRUE, 1, FALSE, TRUE),
    ('team', 'campus', 'mewakili', TRUE, 1, FALSE, TRUE),
    ('team', 'venue', 'basecamp', TRUE, 1, FALSE, TRUE),
    ('community', 'venue', 'markas', TRUE, 3, FALSE, TRUE),
    ('community', 'school', 'kerja_sama', TRUE, 5, FALSE, TRUE),
    ('community', 'campus', 'kerja_sama', TRUE, 5, FALSE, TRUE),
    ('school', 'venue', 'tempat_latihan', TRUE, 3, FALSE, TRUE),
    ('campus', 'venue', 'tempat_latihan', TRUE, 3, FALSE, TRUE)
ON CONFLICT (source_entity_type, target_entity_type, relation_type) DO UPDATE SET
    requires_approval = EXCLUDED.requires_approval,
    max_active_limit = EXCLUDED.max_active_limit,
    game_match_required = EXCLUDED.game_match_required,
    is_active = EXCLUDED.is_active;

-- 3.1 Migrasi Status Verifikasi profiles
UPDATE public.profiles
SET verification_status = CASE
    WHEN verification_status = 'draft' THEN 'unverified'
    WHEN verification_status IN ('regional_review', 'regional_approved', 'provincial_review', 'in_review_regional', 'in_review_provincial', 'regional_checked') THEN 'under_review'
    WHEN verification_status = 'revision' THEN 'revision_requested'
    WHEN verification_status = 'prov_verified' THEN 'verified'
    ELSE verification_status
END
WHERE verification_status IN ('draft', 'regional_review', 'regional_approved', 'provincial_review', 'in_review_regional', 'in_review_provincial', 'regional_checked', 'revision', 'prov_verified');

-- 3.2 Migrasi Status verification_requests
UPDATE public.verification_requests
SET status = CASE
    WHEN status IN ('regional_review', 'regional_approved', 'provincial_review') THEN 'under_review'
    WHEN status = 'revision' THEN 'revision_requested'
    WHEN status = 'prov_verified' THEN 'verified'
    ELSE status
END
WHERE status IN ('regional_review', 'regional_approved', 'provincial_review', 'revision', 'prov_verified');

-- 3.3 Migrasi Peran Akun (D1)
UPDATE public.accounts
SET role = CASE
    WHEN role IN ('region_admin', 'prov_admin') THEN 'user'
    WHEN role = 'platform_operator' THEN 'platform_admin'
    ELSE role
END
WHERE role IN ('region_admin', 'prov_admin', 'platform_operator');

-- 3.4 Arsipkan Profil Sekunder pada Akun Multi-Profil (D2)
DO $$
DECLARE
    v_acc RECORD;
    v_primary_profile_id UUID;
    v_secondary RECORD;
BEGIN
    FOR v_acc IN 
        SELECT account_id, count(*) AS total_profiles
        FROM public.profiles
        GROUP BY account_id
        HAVING count(*) > 1
    LOOP
        SELECT id INTO v_primary_profile_id
        FROM public.profiles
        WHERE account_id = v_acc.account_id
        ORDER BY 
            (verification_status = 'verified') DESC,
            completeness_score DESC,
            created_at ASC
        LIMIT 1;

        FOR v_secondary IN 
            SELECT * FROM public.profiles
            WHERE account_id = v_acc.account_id AND id != v_primary_profile_id
        LOOP
            INSERT INTO public.profiles_archived (
                id, account_id, entity_type, esport_id, display_name, original_data, archived_reason
            )
            VALUES (
                v_secondary.id,
                v_secondary.account_id,
                v_secondary.entity_type,
                v_secondary.esport_id,
                v_secondary.display_name,
                row_to_json(v_secondary)::jsonb,
                'Diarsipkan secara otomatis dalam penegakan aturan 1 akun 1 profil (Keputusan D2 V3)'
            )
            ON CONFLICT (id) DO NOTHING;

            UPDATE public.entity_relations
            SET status = 'ended', ended_at = NOW()
            WHERE (source_profile_id = v_secondary.id OR target_profile_id = v_secondary.id)
              AND status IN ('pending', 'active');

            DELETE FROM public.profiles
            WHERE id = v_secondary.id;
        END LOOP;
    END LOOP;
END $$;

COMMIT;
