-- ==============================================================================
-- ESPORT SUMBAR V2 - Database Migration 0001: Initial Schema
-- Basis: docs/esport-sumbar-prd.md & docs/esport-sumbar-master-concept.md
-- ==============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Function to automatically update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------------------------
-- 1. REGIONS (19 Kota / Kabupaten di Sumatera Barat)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.regions (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(10) NOT NULL UNIQUE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('kota', 'kabupaten')),
    slug VARCHAR(150) NOT NULL UNIQUE,
    logo_url TEXT,
    esi_contact_name TEXT,
    esi_secretariat TEXT,
    description TEXT,
    admin_mode VARCHAR(20) NOT NULL DEFAULT 'fallback' CHECK (admin_mode IN ('active', 'fallback')),
    is_pilot BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_regions_updated_at
BEFORE UPDATE ON public.regions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- 2. ACCOUNTS (1 akun login terikat auth.users)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.accounts (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(30) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'region_admin', 'prov_admin', 'platform_operator')),
    assigned_region_id VARCHAR(50) REFERENCES public.regions(id) ON DELETE SET NULL,
    birth_date DATE, -- Privat (kepatuhan UU PDP perlindungan anak)
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_accounts_updated_at
BEFORE UPDATE ON public.accounts
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- 3. GUARDIAN CONSENTS (Persetujuan Wali untuk Usia < 18 Tahun)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.guardian_consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
    guardian_name VARCHAR(150) NOT NULL,
    guardian_contact VARCHAR(100) NOT NULL, -- Privat (kontak WA/HP wali)
    guardian_relationship VARCHAR(50) NOT NULL DEFAULT 'Orang Tua / Wali Sah',
    consent_version VARCHAR(20) NOT NULL DEFAULT 'v1.0-2026',
    consented_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ip_address VARCHAR(45)
);

-- ------------------------------------------------------------------------------
-- 4. GAMES (Master Game Resmi Cabang Olahraga Esport)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.games (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    short_name VARCHAR(50) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    publisher VARCHAR(150),
    category VARCHAR(100),
    roles_jsonb JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_games_updated_at
BEFORE UPDATE ON public.games
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- 5. PROFILES (1 Akun dapat memiliki banyak profil: Player, Coach, Team, dll.)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
    entity_type VARCHAR(30) NOT NULL CHECK (entity_type IN ('player', 'coach', 'team', 'community', 'venue', 'campus', 'school', 'organizer')),
    esport_id VARCHAR(50) NOT NULL UNIQUE, -- Contoh: ESB-PDG-PL-000124
    slug VARCHAR(150) NOT NULL UNIQUE,
    display_name VARCHAR(150) NOT NULL,
    ign VARCHAR(100), -- In-Game Name khusus player/coach
    region_id VARCHAR(50) NOT NULL REFERENCES public.regions(id) ON DELETE RESTRICT,
    main_game_id VARCHAR(50) REFERENCES public.games(id) ON DELETE RESTRICT,
    role_name VARCHAR(100), -- Contoh: Roamer, Head Coach, Kapten
    avatar_url TEXT,
    bio TEXT,
    metadata_jsonb JSONB NOT NULL DEFAULT '{}'::jsonb,
    visibility_jsonb JSONB NOT NULL DEFAULT '{"email": false, "phone": false, "realName": false, "history": true, "achievements": true}'::jsonb,
    verification_status VARCHAR(30) NOT NULL DEFAULT 'unverified' 
        CHECK (verification_status IN ('unverified', 'draft', 'submitted', 'in_review_regional', 'regional_checked', 'in_review_provincial', 'verified', 'revision_requested', 'rejected', 'suspended')),
    verified_at TIMESTAMPTZ,
    verification_expires_at TIMESTAMPTZ,
    verified_badge_no VARCHAR(60), -- Contoh: ESI-SB-VER-2026-000124
    rarity_tier VARCHAR(20) NOT NULL DEFAULT 'rookie' CHECK (rarity_tier IN ('rookie', 'contender', 'elite', 'legend')),
    completeness_score INT NOT NULL DEFAULT 40 CHECK (completeness_score BETWEEN 0 AND 100),
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- 6. MEMBERSHIPS (Relasi Dua-Arah Player/Coach dengan Organisasi/Tim)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    org_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role_in_org VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'ended')),
    initiated_by VARCHAR(20) NOT NULL CHECK (initiated_by IN ('member', 'org')),
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_member_distinct CHECK (member_profile_id <> org_profile_id)
);

CREATE TRIGGER trg_memberships_updated_at
BEFORE UPDATE ON public.memberships
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- 7. ACHIEVEMENTS (Rekam Jejak Prestasi & Kejuaraan)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    level VARCHAR(30) NOT NULL CHECK (level IN ('kota', 'provinsi', 'nasional', 'internasional', 'lainnya')),
    placement VARCHAR(100) NOT NULL, -- Contoh: Juara 1, Medali Emas, Runner Up
    event_name VARCHAR(255) NOT NULL,
    event_date DATE,
    evidence_url TEXT, -- Privat (URL storage bukti kejuaraan/sertifikat)
    validation_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (validation_status IN ('pending', 'validated', 'rejected')),
    validated_by UUID REFERENCES public.accounts(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_achievements_updated_at
BEFORE UPDATE ON public.achievements
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- 8. VERIFICATION_REQUESTS (Pengajuan Verifikasi Berkas Digital)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.verification_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status VARCHAR(30) NOT NULL CHECK (status IN ('submitted', 'in_review_regional', 'regional_checked', 'in_review_provincial', 'verified', 'revision_requested', 'rejected', 'suspended')),
    region_id VARCHAR(50) NOT NULL REFERENCES public.regions(id) ON DELETE RESTRICT,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    decided_at TIMESTAMPTZ,
    current_reviewer_id UUID REFERENCES public.accounts(id) ON DELETE SET NULL,
    notes TEXT,
    revision_fields_jsonb JSONB DEFAULT '[]'::jsonb,
    evidence_files JSONB NOT NULL DEFAULT '[]'::jsonb, -- Rujukan Storage Privat (tidak untuk publik)
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_verification_requests_updated_at
BEFORE UPDATE ON public.verification_requests
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- 9. AUDIT_LOGS (Append-Only Log Tanpa Izin UPDATE/DELETE)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actor_account_id UUID REFERENCES public.accounts(id) ON DELETE SET NULL,
    actor_role VARCHAR(50) NOT NULL,
    actor_ip VARCHAR(45),
    region_id VARCHAR(50) REFERENCES public.regions(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50) NOT NULL,
    target_id VARCHAR(100) NOT NULL,
    previous_status VARCHAR(50),
    new_status VARCHAR(50),
    reason TEXT NOT NULL,
    metadata_jsonb JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- ------------------------------------------------------------------------------
-- 10. ARTICLES (Portal Berita Editorial Resmi)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    summary TEXT,
    content TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    cover_image_url TEXT,
    region_id VARCHAR(50) REFERENCES public.regions(id) ON DELETE SET NULL,
    author_id UUID REFERENCES public.accounts(id) ON DELETE SET NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_articles_updated_at
BEFORE UPDATE ON public.articles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- 11. NOTIFICATIONS_QUEUE (Antrean Notifikasi Email & SLA 30 Hari)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    payload_jsonb JSONB NOT NULL DEFAULT '{}'::jsonb,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'sent', 'failed')),
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 12. REPORTS (Laporan Pelanggaran Komunitas / Pemalsuan Prestasi)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_account_id UUID REFERENCES public.accounts(id) ON DELETE SET NULL,
    target_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL,
    reason TEXT NOT NULL,
    evidence_urls JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'forwarded_to_esi', 'resolved', 'dismissed')),
    resolved_by UUID REFERENCES public.accounts(id) ON DELETE SET NULL,
    resolution_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_reports_updated_at
BEFORE UPDATE ON public.reports
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- INDEXES UNTUK PERFORMA QUERY CEPAT
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_profiles_query ON public.profiles(region_id, entity_type, verification_status);
CREATE INDEX IF NOT EXISTS idx_profiles_slug ON public.profiles(slug);
CREATE INDEX IF NOT EXISTS idx_profiles_esport_id ON public.profiles(esport_id);
CREATE INDEX IF NOT EXISTS idx_profiles_account_id ON public.profiles(account_id);
CREATE INDEX IF NOT EXISTS idx_verification_requests_lookup ON public.verification_requests(region_id, status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timeline ON public.audit_logs(occurred_at DESC, region_id);
CREATE INDEX IF NOT EXISTS idx_memberships_active ON public.memberships(member_profile_id, org_profile_id, status);
CREATE INDEX IF NOT EXISTS idx_articles_published ON public.articles(status, published_at DESC);
