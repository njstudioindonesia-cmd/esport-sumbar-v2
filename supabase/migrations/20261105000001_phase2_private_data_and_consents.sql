-- ==============================================================================
-- ESPORT SUMBAR V2 - Database Migration 0006 (Fase 2.1)
-- Penambahan Tabel Data Pribadi (profile_private), Persetujuan Hukum (consents),
-- Laporan Pelanggaran (reports), dan Penguatan Keamanan RLS Kepatuhan UU PDP
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. TABEL PROFILE_PRIVATE (1:1 DENGAN PROFILES)
-- Seluruh kontak dan data verifikasi privat dipisah ke tabel ini.
-- Dilarang keras mengekspos tabel ini ke publik/anonim.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profile_private (
    profile_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
    full_name VARCHAR(150), -- Nama lengkap sesuai KTP/KIA untuk verifikasi ESI
    whatsapp_e164 VARCHAR(30), -- Kontak WhatsApp format internasional (+62...)
    contact_email VARCHAR(255),
    birth_date DATE,
    gender VARCHAR(20) CHECK (gender IN ('male', 'female', 'prefer_not_to_say')),
    address_street TEXT, -- Alamat jalan spesifik (privat)
    kecamatan VARCHAR(100),
    nagari_kelurahan VARCHAR(100),
    game_account_id VARCHAR(100), -- ID Akun Game untuk pengecekan admin
    game_server VARCHAR(100), -- Server Akun Game
    guardian_name VARCHAR(150), -- Nama wali jika atlet < 18 tahun
    guardian_whatsapp VARCHAR(30), -- WhatsApp wali jika atlet < 18 tahun
    guardian_relationship VARCHAR(50),
    rate_note TEXT, -- Catatan tarif indikatif pelatih (privat)
    manager_name VARCHAR(150), -- Nama penanggung jawab tim / komunitas / venue
    manager_role VARCHAR(100), -- Jabatan penanggung jawab
    manager_whatsapp VARCHAR(30), -- WhatsApp penanggung jawab
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger updated_at otomatis
DROP TRIGGER IF EXISTS trg_profile_private_updated_at ON public.profile_private;
CREATE TRIGGER trg_profile_private_updated_at
BEFORE UPDATE ON public.profile_private
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indeks pendukung relasi akun
CREATE INDEX IF NOT EXISTS idx_profile_private_account 
ON public.profile_private(account_id);

-- RLS: AKTIFKAN SECARA KETAT
ALTER TABLE public.profile_private ENABLE ROW LEVEL SECURITY;

-- 1. Pemilik profil dapat membaca & memodifikasi data privat miliknya sendiri
DROP POLICY IF EXISTS "Users can manage their own profile_private" ON public.profile_private;
CREATE POLICY "Users can manage their own profile_private"
ON public.profile_private
FOR ALL
TO authenticated
USING (account_id = auth.uid())
WITH CHECK (account_id = auth.uid());

-- 2. Admin Provinsi dan Operator Platform dapat meninjau semua data privat untuk verifikasi
DROP POLICY IF EXISTS "Provincial admins and operators can view profile_private" ON public.profile_private;
CREATE POLICY "Provincial admins and operators can view profile_private"
ON public.profile_private
FOR SELECT
TO authenticated
USING (
    public.get_auth_role() IN ('prov_admin', 'platform_operator')
);

-- 3. Admin Daerah hanya dapat membaca data privat profil di wilayah yang ditugaskan kepadanya
DROP POLICY IF EXISTS "Region admins can view profile_private in their region" ON public.profile_private;
CREATE POLICY "Region admins can view profile_private in their region"
ON public.profile_private
FOR SELECT
TO authenticated
USING (
    public.get_auth_role() = 'region_admin'
    AND EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = profile_private.profile_id
        AND p.region_id = public.get_auth_region_id()
    )
);

-- ------------------------------------------------------------------------------
-- 2. TABEL CONSENTS (LOG PERSETUJUAN SYARAT & KEBIJAKAN PRIVASI UU PDP)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('terms_of_service', 'privacy_policy', 'guardian_consent', 'competition_rules')),
    version VARCHAR(30) NOT NULL DEFAULT 'v1.0-2026',
    accepted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ip_address VARCHAR(45),
    user_agent TEXT
);

CREATE INDEX IF NOT EXISTS idx_consents_account_type 
ON public.consents(account_id, type);

ALTER TABLE public.consents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view and insert own consents" ON public.consents;
CREATE POLICY "Users can view and insert own consents"
ON public.consents
FOR ALL
TO authenticated
USING (account_id = auth.uid())
WITH CHECK (account_id = auth.uid());

DROP POLICY IF EXISTS "Admins can view consents for audit" ON public.consents;
CREATE POLICY "Admins can view consents for audit"
ON public.consents
FOR SELECT
TO authenticated
USING (public.get_auth_role() IN ('region_admin', 'prov_admin', 'platform_operator'));

-- ------------------------------------------------------------------------------
-- 3. TABEL REPORTS (LAPORAN PELANGGARAN & MODERASI DATA PROFIL)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_account_id UUID REFERENCES public.accounts(id) ON DELETE SET NULL,
    target_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reason VARCHAR(50) NOT NULL,
    notes TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'investigating', 'resolved', 'dismissed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reports_target_profile 
ON public.reports(target_profile_id);

CREATE INDEX IF NOT EXISTS idx_reports_status 
ON public.reports(status);

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can create reports" ON public.reports;
CREATE POLICY "Users can create reports"
ON public.reports
FOR INSERT
TO authenticated
WITH CHECK (reporter_account_id = auth.uid());

DROP POLICY IF EXISTS "Users can view their own reports" ON public.reports;
CREATE POLICY "Users can view their own reports"
ON public.reports
FOR SELECT
TO authenticated
USING (reporter_account_id = auth.uid());

DROP POLICY IF EXISTS "Admins and operators can manage all reports" ON public.reports;
CREATE POLICY "Admins and operators can manage all reports"
ON public.reports
FOR ALL
TO authenticated
USING (public.get_auth_role() IN ('region_admin', 'prov_admin', 'platform_operator'));

-- ------------------------------------------------------------------------------
-- 4. INDEKS KINERJA FOREIGN KEYS TAMBAHAN (TEMUAN DB-05)
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_verif_requests_reviewer 
ON public.verification_requests(current_reviewer_id);

CREATE INDEX IF NOT EXISTS idx_achievements_validated_by 
ON public.achievements(validated_by);

CREATE INDEX IF NOT EXISTS idx_guardian_consents_account 
ON public.guardian_consents(account_id);
