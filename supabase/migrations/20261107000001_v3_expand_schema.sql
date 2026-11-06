-- ==============================================================================
-- ESPORT SUMBAR V3 - Database Migration 0010: EXPAND Schema (Aditif & Aman)
-- Basis: docs/adr/ADR-001 s/d ADR-006 & esport-sumbar-v3-transformation-prompt.md
-- Sifat: 100% Aditif (Backward Compatible, Tidak Merusak Aplikasi Berjalan)
-- ==============================================================================

-- 1. Perbarui batasan CHECK pada accounts.role agar mengizinkan platform_admin
--    (Tetap mengizinkan peran lama selama masa transisi data)
ALTER TABLE public.accounts 
    DROP CONSTRAINT IF EXISTS accounts_role_check;

ALTER TABLE public.accounts 
    ADD CONSTRAINT accounts_role_check 
    CHECK (role IN ('user', 'region_admin', 'prov_admin', 'platform_operator', 'platform_admin'));

-- 2. Perbarui batasan CHECK pada profiles.verification_status agar mengizinkan status V3
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

-- 3. Perbarui batasan CHECK pada verification_requests.status
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

-- 4. Tambah kolom baru pada tabel games (genre, platform, icon_url)
ALTER TABLE public.games 
    ADD COLUMN IF NOT EXISTS genre VARCHAR(50) DEFAULT 'other' CHECK (genre IN ('moba', 'battle_royale', 'fps', 'sports', 'fighting', 'racing', 'strategy', 'other')),
    ADD COLUMN IF NOT EXISTS platform VARCHAR(50) DEFAULT 'mobile' CHECK (platform IN ('mobile', 'pc', 'console', 'cross_platform')),
    ADD COLUMN IF NOT EXISTS icon_url TEXT;

-- 5. Tabel Dinamis game_roles (Peran Game Berbasis Basis Data)
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

-- 6. Tabel Dinamis game_ranks (Tier Peringkat Game Berbasis Basis Data)
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

-- 7. Tabel relation_rules (Aturan Deklaratif Keterhubungan Ekosistem)
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

-- 8. Tambah kolom pada tabel entity_relations untuk mendukung siklus hidup V3
ALTER TABLE public.entity_relations 
    ADD COLUMN IF NOT EXISTS game_id VARCHAR(50) REFERENCES public.games(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS started_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS ended_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES public.accounts(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Perbarui status check pada entity_relations
ALTER TABLE public.entity_relations 
    DROP CONSTRAINT IF EXISTS entity_relations_status_check;

ALTER TABLE public.entity_relations 
    ADD CONSTRAINT entity_relations_status_check 
    CHECK (status IN ('pending', 'active', 'rejected', 'cancelled', 'expired', 'ended'));

-- 9. Tabel profiles_archived (Arsip Profil Sekunder Akun Multi-Profil - Keputusan D2)
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

-- 10. Tabel outbox_events (Pola Transactional Outbox Asinkron untuk Microservices)
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

-- 11. View audit_logs_view (Memetakan Histori Audit V2 ke Istilah Bersih V3 Tanpa Mengubah Baris)
CREATE OR REPLACE VIEW public.audit_logs_view AS
SELECT 
    id,
    actor_id,
    CASE 
        WHEN actor_role = 'region_admin' THEN 'verifikator_daerah'
        WHEN actor_role = 'prov_admin' THEN 'verifikator_provinsi'
        WHEN actor_role = 'platform_operator' THEN 'operator_platform'
        ELSE actor_role 
    END AS display_role,
    actor_role AS raw_role,
    action,
    entity_type,
    entity_id,
    old_data,
    new_data,
    ip_address,
    created_at
FROM public.audit_logs;
