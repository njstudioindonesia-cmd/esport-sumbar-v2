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
-- ==============================================================================
-- ESPORT SUMBAR V2 - Database Migration 0002: Row Level Security (RLS) & Policies
-- Basis: docs/esport-sumbar-prd.md Bagian 3.2 & 8.2 (Keamanan Multi-Tenant & Audit)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- HELPER FUNCTIONS FOR ROLE AND REGION EXTRACTION
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_auth_role()
RETURNS VARCHAR AS $$
    SELECT role FROM public.accounts WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_auth_region_id()
RETURNS VARCHAR AS $$
    SELECT assigned_region_id FROM public.accounts WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ------------------------------------------------------------------------------
-- ENABLE RLS ON ALL TABLES
-- ------------------------------------------------------------------------------
ALTER TABLE public.regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guardian_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 1. REGIONS POLICIES (Publik Boleh Baca, Operator Boleh Kelola)
-- ------------------------------------------------------------------------------
CREATE POLICY "Regions are viewable by everyone" 
ON public.regions FOR SELECT 
USING (true);

CREATE POLICY "Regions can only be modified by platform operator" 
ON public.regions FOR ALL 
USING (public.get_auth_role() = 'platform_operator')
WITH CHECK (public.get_auth_role() = 'platform_operator');

-- ------------------------------------------------------------------------------
-- 2. GAMES POLICIES (Publik Boleh Baca, Operator Boleh Kelola)
-- ------------------------------------------------------------------------------
CREATE POLICY "Games are viewable by everyone" 
ON public.games FOR SELECT 
USING (true);

CREATE POLICY "Games can only be modified by platform operator" 
ON public.games FOR ALL 
USING (public.get_auth_role() = 'platform_operator')
WITH CHECK (public.get_auth_role() = 'platform_operator');

-- ------------------------------------------------------------------------------
-- 3. ACCOUNTS POLICIES (Data Pribadi & Manajemen Hak Akses)
-- ------------------------------------------------------------------------------
CREATE POLICY "Users can view their own account" 
ON public.accounts FOR SELECT 
USING (
    id = auth.uid() 
    OR public.get_auth_role() IN ('prov_admin', 'platform_operator')
);

CREATE POLICY "Users can update their own account details" 
ON public.accounts FOR UPDATE 
USING (id = auth.uid())
WITH CHECK (
    id = auth.uid() 
    -- Cegah eskalasi hak akses role sendiri
    AND role = (SELECT role FROM public.accounts WHERE id = auth.uid())
);

CREATE POLICY "Platform operator can manage all accounts" 
ON public.accounts FOR ALL 
USING (public.get_auth_role() = 'platform_operator')
WITH CHECK (public.get_auth_role() = 'platform_operator');

-- ------------------------------------------------------------------------------
-- 4. GUARDIAN CONSENTS POLICIES (Perlindungan Data Anak UU PDP)
-- ------------------------------------------------------------------------------
CREATE POLICY "User can view and insert own guardian consent" 
ON public.guardian_consents FOR ALL 
USING (account_id = auth.uid())
WITH CHECK (account_id = auth.uid());

CREATE POLICY "Admins can view guardian consents for review" 
ON public.guardian_consents FOR SELECT 
USING (
    public.get_auth_role() IN ('prov_admin', 'platform_operator')
    OR (
        public.get_auth_role() = 'region_admin' 
        AND account_id IN (
            SELECT p.account_id FROM public.profiles p 
            WHERE p.region_id = public.get_auth_region_id()
        )
    )
);

-- ------------------------------------------------------------------------------
-- 5. PROFILES POLICIES
-- ------------------------------------------------------------------------------
-- Publik dapat melihat profil yang dipublikasikan
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING (
    is_published = true 
    OR account_id = auth.uid()
    OR public.get_auth_role() IN ('prov_admin', 'platform_operator')
    OR (public.get_auth_role() = 'region_admin' AND region_id = public.get_auth_region_id())
);

-- Pemilik akun dapat membuat profil baru
CREATE POLICY "Users can create profiles for their account" 
ON public.profiles FOR INSERT 
WITH CHECK (account_id = auth.uid());

-- Pemilik akun dapat memperbarui profilnya sendiri (status verifikasi dicegah via trigger)
CREATE POLICY "Users can update their own profiles" 
ON public.profiles FOR UPDATE 
USING (account_id = auth.uid())
WITH CHECK (account_id = auth.uid());

-- ------------------------------------------------------------------------------
-- 6. VERIFICATION REQUESTS POLICIES (Isolasi Antrean Multi-Tenant)
-- ------------------------------------------------------------------------------
CREATE POLICY "Users can view and create their own verification requests" 
ON public.verification_requests FOR SELECT 
USING (
    profile_id IN (SELECT id FROM public.profiles WHERE account_id = auth.uid())
);

CREATE POLICY "Users can submit verification request" 
ON public.verification_requests FOR INSERT 
WITH CHECK (
    profile_id IN (SELECT id FROM public.profiles WHERE account_id = auth.uid())
);

-- Admin Daerah HANYA BISA MELIHAT antrean di wilayahnya sendiri
CREATE POLICY "Region admins can view requests in their assigned region" 
ON public.verification_requests FOR SELECT 
USING (
    public.get_auth_role() = 'region_admin' 
    AND region_id = public.get_auth_region_id()
);

-- Admin Provinsi dapat melihat antrean seluruh daerah (termasuk mode fallback)
CREATE POLICY "Provincial admins can view all verification requests" 
ON public.verification_requests FOR SELECT 
USING (public.get_auth_role() = 'prov_admin');

-- Operator Platform dapat melihat ringkasan antrean teknis
CREATE POLICY "Platform operators can view all verification requests" 
ON public.verification_requests FOR SELECT 
USING (public.get_auth_role() = 'platform_operator');

-- ------------------------------------------------------------------------------
-- 7. AUDIT LOGS POLICIES (IMMUTABLE APPEND-ONLY - TANPA UPDATE/DELETE)
-- ------------------------------------------------------------------------------
-- Cabut secara mutlak hak UPDATE dan DELETE untuk semua role
REVOKE UPDATE, DELETE ON public.audit_logs FROM PUBLIC, anon, authenticated;

-- Hanya izinkan pembacaan audit log sesuai hierarki peran (PRD 3.2 & 8.2)
CREATE POLICY "Read audit logs based on role scope" 
ON public.audit_logs FOR SELECT 
USING (
    public.get_auth_role() IN ('prov_admin', 'platform_operator')
    OR (
        public.get_auth_role() = 'region_admin' 
        AND region_id = public.get_auth_region_id()
    )
);

-- Penulisan audit logs diizinkan untuk internal service / authenticated transitions
CREATE POLICY "Allow system and transition functions to insert audit logs" 
ON public.audit_logs FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- ------------------------------------------------------------------------------
-- 8. MEMBERSHIPS POLICIES (Relasi & Persetujuan Roster Tim)
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view accepted memberships" 
ON public.memberships FOR SELECT 
USING (
    status = 'accepted'
    OR member_profile_id IN (SELECT id FROM public.profiles WHERE account_id = auth.uid())
    OR org_profile_id IN (SELECT id FROM public.profiles WHERE account_id = auth.uid())
);

CREATE POLICY "Members or Team Owners can initiate memberships" 
ON public.memberships FOR INSERT 
WITH CHECK (
    member_profile_id IN (SELECT id FROM public.profiles WHERE account_id = auth.uid())
    OR org_profile_id IN (SELECT id FROM public.profiles WHERE account_id = auth.uid())
);

CREATE POLICY "Involved parties can update membership status" 
ON public.memberships FOR UPDATE 
USING (
    member_profile_id IN (SELECT id FROM public.profiles WHERE account_id = auth.uid())
    OR org_profile_id IN (SELECT id FROM public.profiles WHERE account_id = auth.uid())
);

-- ------------------------------------------------------------------------------
-- 9. ACHIEVEMENTS POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view validated achievements" 
ON public.achievements FOR SELECT 
USING (
    validation_status = 'validated'
    OR profile_id IN (SELECT id FROM public.profiles WHERE account_id = auth.uid())
    OR public.get_auth_role() IN ('prov_admin', 'platform_operator')
    OR (
        public.get_auth_role() = 'region_admin' 
        AND profile_id IN (
            SELECT id FROM public.profiles WHERE region_id = public.get_auth_region_id()
        )
    )
);

CREATE POLICY "Users can manage achievements for their own profiles" 
ON public.achievements FOR ALL 
USING (profile_id IN (SELECT id FROM public.profiles WHERE account_id = auth.uid()))
WITH CHECK (profile_id IN (SELECT id FROM public.profiles WHERE account_id = auth.uid()));

-- ------------------------------------------------------------------------------
-- 10. ARTICLES POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Published articles are viewable by everyone" 
ON public.articles FOR SELECT 
USING (
    status = 'published'
    OR public.get_auth_role() IN ('platform_operator', 'prov_admin')
);

CREATE POLICY "Platform operators can manage articles" 
ON public.articles FOR ALL 
USING (public.get_auth_role() IN ('platform_operator', 'prov_admin'))
WITH CHECK (public.get_auth_role() IN ('platform_operator', 'prov_admin'));

-- ------------------------------------------------------------------------------
-- 11. REPORTS POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Authenticated users can submit abuse reports" 
ON public.reports FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view their own submitted reports" 
ON public.reports FOR SELECT 
USING (reporter_account_id = auth.uid());

CREATE POLICY "Moderators can view and update reports" 
ON public.reports FOR ALL 
USING (public.get_auth_role() IN ('platform_operator', 'prov_admin'))
WITH CHECK (public.get_auth_role() IN ('platform_operator', 'prov_admin'));

-- ------------------------------------------------------------------------------
-- 12. NOTIFICATIONS POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Users can view their own notifications" 
ON public.notifications_queue FOR SELECT 
USING (account_id = auth.uid());
-- ==============================================================================
-- ESPORT SUMBAR V2 - Database Migration 0003: Stored Procedure & RPC
-- Function: transition_verification()
-- Basis: docs/esport-sumbar-prd.md Bagian 3.2, 6.2, 8.2 (State Machine & Audit Transaksional)
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.transition_verification(
    p_request_id UUID,
    p_new_status VARCHAR(30),
    p_reason TEXT,
    p_notes TEXT DEFAULT NULL,
    p_revision_fields JSONB DEFAULT '[]'::jsonb,
    p_badge_no VARCHAR(60) DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER -- Berjalan dengan hak istimewa database untuk memastikan integritas audit
SET search_path = public, pg_temp
AS $$
DECLARE
    v_actor_id UUID;
    v_actor_role VARCHAR(30);
    v_actor_region_id VARCHAR(50);
    v_request RECORD;
    v_profile RECORD;
    v_old_status VARCHAR(30);
    v_generated_badge_no VARCHAR(60);
    v_audit_action VARCHAR(100);
    v_expires_at TIMESTAMPTZ := NULL;
    v_verified_at TIMESTAMPTZ := NULL;
BEGIN
    -- 1. Ambil identitas penelaah yang sedang login
    v_actor_id := auth.uid();
    IF v_actor_id IS NULL THEN
        RAISE EXCEPTION 'Akses ditolak: Pengguna tidak terotentikasi.';
    END IF;

    SELECT role, assigned_region_id INTO v_actor_role, v_actor_region_id
    FROM public.accounts
    WHERE id = v_actor_id;

    IF v_actor_role IS NULL THEN
        RAISE EXCEPTION 'Akses ditolak: Akun penelaah tidak ditemukan.';
    END IF;

    -- 2. Ambil data permohonan verifikasi yang ditargetkan
    SELECT * INTO v_request
    FROM public.verification_requests
    WHERE id = p_request_id
    FOR UPDATE; -- Kunci baris untuk menghindari race condition

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Permohonan verifikasi ID % tidak ditemukan.', p_request_id;
    END IF;

    -- 3. Ambil data profil terkait
    SELECT * INTO v_profile
    FROM public.profiles
    WHERE id = v_request.profile_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Profil pemilik permohonan tidak ditemukan.';
    END IF;

    v_old_status := v_request.status;

    -- 4. VALIDASI ATURAN WEWENANG PERAN & REGIONAL
    -- Aturan 1: Operator Platform DILARANG KERAS memverifikasi
    IF v_actor_role = 'platform_operator' THEN
        RAISE EXCEPTION 'Pelanggaran wewenang: Operator platform dilarang mengubah status verifikasi keolahragaan ESI.';
    END IF;

    -- Aturan 2: User biasa tidak memiliki wewenang telaah
    IF v_actor_role = 'user' THEN
        RAISE EXCEPTION 'Akses ditolak: Pengguna biasa tidak memiliki hak penelaahan verifikasi.';
    END IF;

    -- Aturan 3: Alasan wajib diisi jika status revisi, penolakan, atau suspensi
    IF p_new_status IN ('revision_requested', 'rejected', 'suspended') AND (p_reason IS NULL OR trim(p_reason) = '') THEN
        RAISE EXCEPTION 'Alasan keputusan (reason) wajib diisi untuk tindakan penolakan, revisi, atau penangguhan.';
    END IF;

    -- Aturan 4: Transisi 'regional_checked' (Tahap ESI Kota/Kabupaten)
    IF p_new_status = 'regional_checked' THEN
        IF v_actor_role = 'region_admin' AND v_actor_region_id <> v_request.region_id THEN
            RAISE EXCEPTION 'Akses ditolak: Admin daerah hanya berwenang memeriksa berkas di wilayahnya sendiri (%).', v_actor_region_id;
        END IF;
        -- Admin provinsi diizinkan jika wilayah tersebut dalam mode fallback
        v_audit_action := 'VERIFY_REGIONAL_CHECKED';

    -- Aturan 5: Transisi 'verified' (Lencana Emas Resmi Pengprov ESI Sumbar)
    ELSIF p_new_status = 'verified' THEN
        IF v_actor_role <> 'prov_admin' THEN
            RAISE EXCEPTION 'Pelanggaran wewenang: Status lencana emas Verified hanya dapat diterbitkan secara eksklusif oleh Admin Pengprov ESI Sumbar.';
        END IF;

        -- Format nomor registrasi resmi PBESI: ESI-SB-VER-YYYY-XXXX
        IF p_badge_no IS NOT NULL AND trim(p_badge_no) <> '' THEN
            v_generated_badge_no := p_badge_no;
        ELSE
            v_generated_badge_no := 'ESI-SB-VER-' || TO_CHAR(NOW(), 'YYYY') || '-' || UPPER(SUBSTRING(REPLACE(v_profile.id::text, '-', ''), 1, 6));
        END IF;

        v_verified_at := NOW();
        v_expires_at := NOW() + INTERVAL '12 months'; -- Masa aktif 12 bulan (PRD 8.1)
        v_audit_action := 'VERIFY_OFFICIAL_APPROVED';

    -- Aturan 6: Transisi 'suspended' (Sanksi Pelanggaran / Kode Etik)
    ELSIF p_new_status = 'suspended' THEN
        IF v_actor_role <> 'prov_admin' THEN
            RAISE EXCEPTION 'Akses ditolak: Penangguhan status atlet/organisasi hanya dapat ditetapkan oleh Komdis Pengprov ESI Sumbar.';
        END IF;
        v_audit_action := 'VERIFY_SUSPENDED';

    -- Aturan 7: Transisi 'revision_requested'
    ELSIF p_new_status = 'revision_requested' THEN
        IF v_actor_role = 'region_admin' AND v_actor_region_id <> v_request.region_id THEN
            RAISE EXCEPTION 'Akses ditolak: Anda tidak memiliki wewenang atas permohonan di luar wilayah Anda.';
        END IF;
        v_audit_action := 'VERIFY_REVISION_REQUESTED';

    -- Aturan 8: Transisi 'rejected'
    ELSIF p_new_status = 'rejected' THEN
        IF v_actor_role = 'region_admin' AND v_actor_region_id <> v_request.region_id THEN
            RAISE EXCEPTION 'Akses ditolak: Anda tidak memiliki wewenang atas permohonan di luar wilayah Anda.';
        END IF;
        v_audit_action := 'VERIFY_REJECTED';

    ELSE
        v_audit_action := 'VERIFY_STATUS_UPDATED';
    END IF;

    -- 5. EKSEKUSI PEMBARUAN PADA PERMOHONAN VERIFIKASI
    UPDATE public.verification_requests
    SET 
        status = p_new_status,
        decided_at = CASE WHEN p_new_status IN ('verified', 'rejected', 'suspended') THEN NOW() ELSE decided_at END,
        current_reviewer_id = v_actor_id,
        notes = COALESCE(p_notes, p_reason),
        revision_fields_jsonb = p_revision_fields,
        updated_at = NOW()
    WHERE id = p_request_id;

    -- 6. SINKRONISASI KE PROFIL PENGGUNA
    UPDATE public.profiles
    SET 
        verification_status = p_new_status,
        verified_at = COALESCE(v_verified_at, verified_at),
        verification_expires_at = CASE 
            WHEN p_new_status = 'verified' THEN v_expires_at 
            WHEN p_new_status = 'suspended' THEN NULL 
            ELSE verification_expires_at 
        END,
        verified_badge_no = CASE 
            WHEN p_new_status = 'verified' THEN v_generated_badge_no 
            ELSE verified_badge_no 
        END,
        updated_at = NOW()
    WHERE id = v_request.profile_id;

    -- 7. PENCATATAN AUDIT LOG TERPUSAT (APPEND-ONLY & ATOMIK)
    INSERT INTO public.audit_logs (
        actor_account_id,
        actor_role,
        region_id,
        action,
        target_type,
        target_id,
        previous_status,
        new_status,
        reason,
        metadata_jsonb
    ) VALUES (
        v_actor_id,
        v_actor_role,
        v_request.region_id,
        v_audit_action,
        'profile',
        v_request.profile_id::text,
        v_old_status,
        p_new_status,
        p_reason,
        jsonb_build_object(
            'request_id', p_request_id,
            'badge_no', v_generated_badge_no,
            'reviewer_notes', p_notes,
            'revision_fields', p_revision_fields
        )
    );

    -- 8. ANTREAN NOTIFIKASI EMAIL KE PEMILIK AKUN
    INSERT INTO public.notifications_queue (
        account_id,
        type,
        payload_jsonb,
        status
    ) VALUES (
        v_profile.account_id,
        'verification_status_changed',
        jsonb_build_object(
            'profile_id', v_profile.id,
            'display_name', v_profile.display_name,
            'esport_id', v_profile.esport_id,
            'old_status', v_old_status,
            'new_status', p_new_status,
            'reason', p_reason,
            'badge_no', v_generated_badge_no
        ),
        'pending'
    );

    -- 9. KEMBALIKAN RESPON SUKSES
    RETURN jsonb_build_object(
        'success', true,
        'request_id', p_request_id,
        'profile_id', v_profile.id,
        'previous_status', v_old_status,
        'new_status', p_new_status,
        'badge_no', v_generated_badge_no,
        'verified_at', v_verified_at,
        'expires_at', v_expires_at
    );
END;
$$;
-- ==============================================================================
-- ESPORT SUMBAR V2 - Database Migration 0004: Security Hardening & Status Tamper Triggers
-- Memperbaiki celah Finding 4: Mencegah update langsung verification_status oleh pemilik akun
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. TRIGGER PENCEGAH PEMALSUAN STATUS VERIFIKASI (ANTI-TAMPERING)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.protect_profile_verification_columns()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_caller_role VARCHAR(30);
BEGIN
    -- Periksa apakah kolom-kolom wewenang resmi mengalami perubahan
    IF (OLD.verification_status IS DISTINCT FROM NEW.verification_status)
       OR (OLD.verified_badge_no IS DISTINCT FROM NEW.verified_badge_no)
       OR (OLD.verified_at IS DISTINCT FROM NEW.verified_at)
       OR (OLD.verification_expires_at IS DISTINCT FROM NEW.verification_expires_at)
    THEN
        -- Ambil peran akun pemanggil
        SELECT role INTO v_caller_role
        FROM public.accounts
        WHERE id = auth.uid();

        -- Izinkan hanya jika pemanggilan berasal dari service_role, migrasi, atau peran berwenang
        -- Catatan: Fungsi transition_verification() berjalan sebagai SECURITY DEFINER
        -- sehingga pemanggilan dari klien reguler yang memodifikasi langsung tabel ini akan ditolak
        IF current_user <> 'postgres' AND current_user <> 'service_role' AND (v_caller_role IS NULL OR v_caller_role = 'user') THEN
            RAISE EXCEPTION 'Pelanggaran keamanan: Kolom status verifikasi, lencana resmi, dan masa berlaku hanya dapat diperbarui melalui fungsi resmi transition_verification().';
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_profile_verification ON public.profiles;

CREATE TRIGGER trg_protect_profile_verification
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.protect_profile_verification_columns();

-- ------------------------------------------------------------------------------
-- 2. TRIGGER PENCEGAH ESKALASI PERAN MANDIRI DI TABEL ACCOUNTS
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.protect_account_role_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_caller_role VARCHAR(30);
BEGIN
    IF (OLD.role IS DISTINCT FROM NEW.role) THEN
        SELECT role INTO v_caller_role
        FROM public.accounts
        WHERE id = auth.uid();

        IF current_user <> 'postgres' AND current_user <> 'service_role' AND v_caller_role <> 'platform_operator' THEN
            RAISE EXCEPTION 'Pelanggaran keamanan: Pengguna tidak memiliki wewenang untuk mengubah peran akun (role).';
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_account_role ON public.accounts;

CREATE TRIGGER trg_protect_account_role
BEFORE UPDATE ON public.accounts
FOR EACH ROW
EXECUTE FUNCTION public.protect_account_role_escalation();

-- ------------------------------------------------------------------------------
-- 3. POLICY INSERT MANDIRI AKUN & TRIGGER AUTO-PROVISION DARI AUTH.USERS
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can insert their own account" ON public.accounts;

CREATE POLICY "Users can insert their own account"
ON public.accounts FOR INSERT
WITH CHECK (
    id = auth.uid()
    AND role = 'user'
);

-- Trigger auto-sync saat user mendaftar via Supabase Auth (Email / OAuth)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    INSERT INTO public.accounts (id, email, role, is_active)
    VALUES (NEW.id, NEW.email, 'user', true)
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------------------------------------------
-- 4. SETUP STORAGE BUCKET & POLICIES (VERIFICATION PROOFS)
-- ------------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'verification-proofs',
    'verification-proofs',
    false,
    5242880,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']::text[]
)
ON CONFLICT (id) DO UPDATE SET
    public = false,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']::text[];

DROP POLICY IF EXISTS "Authenticated users can upload verification proofs" ON storage.objects;
CREATE POLICY "Authenticated users can upload verification proofs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'verification-proofs');

DROP POLICY IF EXISTS "Authenticated users can view verification proofs" ON storage.objects;
CREATE POLICY "Authenticated users can view verification proofs"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'verification-proofs');
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
