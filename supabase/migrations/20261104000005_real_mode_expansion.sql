-- ==============================================================================
-- ESPORT SUMBAR V2 - Database Migration 0005: Real Mode Expansion
-- Memperluas skema untuk 7 Bidang, Storage, Sequence Otomatis, View Bersih & RLS
-- Basis: docs/esport-sumbar-prd.md & Prompt 2 (Upgrade ke Sistem Nyata)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. PENYESUAIAN TABEL PROFILES (7 BIDANG & IS_DEMO)
-- ------------------------------------------------------------------------------

-- Pastikan kolom is_demo tersedia di tabel utama
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_demo BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE public.accounts 
ADD COLUMN IF NOT EXISTS is_demo BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE public.accounts 
ADD COLUMN IF NOT EXISTS guardian_consent_id UUID REFERENCES public.guardian_consents(id) ON DELETE SET NULL;

ALTER TABLE public.articles 
ADD COLUMN IF NOT EXISTS is_demo BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE public.achievements 
ADD COLUMN IF NOT EXISTS is_demo BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE public.verification_requests 
ADD COLUMN IF NOT EXISTS is_demo BOOLEAN NOT NULL DEFAULT FALSE;

-- Kolom khusus penyimpanan berkas di Storage
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS avatar_path TEXT,
ADD COLUMN IF NOT EXISTS cover_path TEXT,
ADD COLUMN IF NOT EXISTS attributes JSONB NOT NULL DEFAULT '{}'::jsonb;

-- Salin data lama dari metadata_jsonb ke attributes jika masih kosong
UPDATE public.profiles 
SET attributes = metadata_jsonb 
WHERE (attributes IS NULL OR attributes = '{}'::jsonb) AND metadata_jsonb IS NOT NULL AND metadata_jsonb <> '{}'::jsonb;

-- Pastikan constraint entity_type mencakup ke-7 bidang resmi PBESI + organizer
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_entity_type_check;

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_entity_type_check 
CHECK (entity_type IN ('player', 'coach', 'team', 'community', 'venue', 'campus', 'school', 'organizer'));

-- ------------------------------------------------------------------------------
-- 2. TABEL MEDIA_ASSETS (Galeri Foto Komunitas & Venue)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.media_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    kind VARCHAR(20) NOT NULL CHECK (kind IN ('avatar', 'cover', 'gallery')),
    path TEXT NOT NULL,
    width INT,
    height INT,
    sort_order INT NOT NULL DEFAULT 0,
    caption VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index untuk memuat galeri berurutan secara cepat
CREATE INDEX IF NOT EXISTS idx_media_assets_profile_order 
ON public.media_assets(profile_id, sort_order ASC);

-- ------------------------------------------------------------------------------
-- 3. NOMOR SERI RESMI OTOMATIS (SEQUENCES & GENERATE FUNCTION)
-- ------------------------------------------------------------------------------

-- Sequence per bidang untuk menjamin keunikan dan atomisitas di PostgreSQL
CREATE SEQUENCE IF NOT EXISTS public.seq_esport_id_pl START WITH 100001 INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS public.seq_esport_id_co START WITH 100001 INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS public.seq_esport_id_tm START WITH 100001 INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS public.seq_esport_id_cm START WITH 100001 INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS public.seq_esport_id_vn START WITH 100001 INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS public.seq_esport_id_cp START WITH 100001 INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS public.seq_esport_id_sc START WITH 100001 INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS public.seq_esport_id_eo START WITH 100001 INCREMENT BY 1;

-- Fungsi penghasil ESPORT ID resmi: ESB-{WILAYAH}-{BIDANG}-{6DIGIT}
CREATE OR REPLACE FUNCTION public.generate_esport_id(
    p_region_id VARCHAR,
    p_entity_type VARCHAR
)
RETURNS VARCHAR
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_region_code VARCHAR(10);
    v_type_code VARCHAR(10);
    v_seq_num BIGINT;
    v_formatted_num VARCHAR(10);
BEGIN
    -- 1. Ambil kode wilayah (3 huruf kapital, default 'SB')
    SELECT COALESCE(code, 'SB') INTO v_region_code
    FROM public.regions
    WHERE id = p_region_id;

    IF v_region_code IS NULL THEN
        v_region_code := 'SB';
    END IF;

    -- 2. Tentukan kode singkatan entitas resmi
    CASE lower(p_entity_type)
        WHEN 'player' THEN
            v_type_code := 'PL';
            v_seq_num := nextval('public.seq_esport_id_pl');
        WHEN 'coach' THEN
            v_type_code := 'CO';
            v_seq_num := nextval('public.seq_esport_id_co');
        WHEN 'team' THEN
            v_type_code := 'TM';
            v_seq_num := nextval('public.seq_esport_id_tm');
        WHEN 'community' THEN
            v_type_code := 'CM';
            v_seq_num := nextval('public.seq_esport_id_cm');
        WHEN 'venue' THEN
            v_type_code := 'VN';
            v_seq_num := nextval('public.seq_esport_id_vn');
        WHEN 'campus' THEN
            v_type_code := 'CP';
            v_seq_num := nextval('public.seq_esport_id_cp');
        WHEN 'school' THEN
            v_type_code := 'SC';
            v_seq_num := nextval('public.seq_esport_id_sc');
        WHEN 'organizer' THEN
            v_type_code := 'EO';
            v_seq_num := nextval('public.seq_esport_id_eo');
        ELSE
            v_type_code := 'ID';
            v_seq_num := nextval('public.seq_esport_id_pl');
    END CASE;

    -- 3. Format 6 digit numerik unik
    v_formatted_num := lpad(v_seq_num::text, 6, '0');

    RETURN 'ESB-' || upper(v_region_code) || '-' || v_type_code || '-' || v_formatted_num;
END;
$$;

-- Trigger BEFORE INSERT pada profiles untuk memastikan nomor seri otomatis terisi
CREATE OR REPLACE FUNCTION public.trg_fn_auto_esport_id()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    IF NEW.esport_id IS NULL OR trim(NEW.esport_id) = '' THEN
        NEW.esport_id := public.generate_esport_id(NEW.region_id, NEW.entity_type);
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_profiles_auto_esport_id ON public.profiles;

CREATE TRIGGER trg_profiles_auto_esport_id
BEFORE INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.trg_fn_auto_esport_id();

-- ------------------------------------------------------------------------------
-- 4. TRIGGER SINKRONISASI OTOMATIS AUTH.USERS -> PUBLIC.ACCOUNTS
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    INSERT INTO public.accounts (id, email, role, is_active)
    VALUES (
        NEW.id,
        NEW.email,
        'user',
        TRUE
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        updated_at = NOW();

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------------------------------------------
-- 5. KONFIGURASI SUPABASE STORAGE BUCKETS (AVATARS, GALLERY, EVIDENCE)
-- ------------------------------------------------------------------------------

-- Daftarkan 3 bucket di storage.buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
(
    'avatars', 
    'avatars', 
    true, 
    2097152, -- 2 MB
    ARRAY['image/webp', 'image/jpeg', 'image/png']::text[]
),
(
    'gallery', 
    'gallery', 
    true, 
    3145728, -- 3 MB
    ARRAY['image/webp', 'image/jpeg', 'image/png']::text[]
),
(
    'evidence', 
    'evidence', 
    false, -- BUCKET PRIVAT
    10485760, -- 10 MB
    ARRAY['image/webp', 'image/jpeg', 'image/png', 'application/pdf']::text[]
)
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- RLS POLICIES PADA STORAGE.OBJECTS:

-- BUCKET AVATARS:
DROP POLICY IF EXISTS "Avatars are publicly readable" ON storage.objects;
CREATE POLICY "Avatars are publicly readable"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- BUCKET GALLERY:
DROP POLICY IF EXISTS "Gallery is publicly readable" ON storage.objects;
CREATE POLICY "Gallery is publicly readable"
ON storage.objects FOR SELECT
USING (bucket_id = 'gallery');

DROP POLICY IF EXISTS "Users can upload gallery to own folder" ON storage.objects;
CREATE POLICY "Users can upload gallery to own folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'gallery'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Users can update own gallery" ON storage.objects;
CREATE POLICY "Users can update own gallery"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'gallery'
    AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
    bucket_id = 'gallery'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Users can delete own gallery" ON storage.objects;
CREATE POLICY "Users can delete own gallery"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'gallery'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- BUCKET EVIDENCE (PRIVAT - HANYA PEMILIK & ADMIN RESMI):
DROP POLICY IF EXISTS "Evidence access policy" ON storage.objects;
CREATE POLICY "Evidence access policy"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'evidence'
    AND (
        -- Pemilik berkas
        (storage.foldername(name))[1] = auth.uid()::text
        -- Admin Provinsi & Operator Platform
        OR public.get_auth_role() IN ('prov_admin', 'platform_operator')
        -- Admin Daerah hanya untuk profil di wilayahnya
        OR (
            public.get_auth_role() = 'region_admin'
            AND EXISTS (
                SELECT 1 FROM public.profiles p
                WHERE p.account_id::text = (storage.foldername(storage.objects.name))[1]
                AND p.region_id = public.get_auth_region_id()
            )
        )
    )
);

DROP POLICY IF EXISTS "Users can upload evidence to own folder" ON storage.objects;
CREATE POLICY "Users can upload evidence to own folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'evidence'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Users can delete own evidence" ON storage.objects;
CREATE POLICY "Users can delete own evidence"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'evidence'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- ------------------------------------------------------------------------------
-- 6. RLS UNTUK TABEL MEDIA_ASSETS
-- ------------------------------------------------------------------------------
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Media assets viewable by everyone" ON public.media_assets;
CREATE POLICY "Media assets viewable by everyone"
ON public.media_assets FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = media_assets.profile_id
        AND p.is_published = true
    )
);

DROP POLICY IF EXISTS "Users can insert own media assets" ON public.media_assets;
CREATE POLICY "Users can insert own media assets"
ON public.media_assets FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = media_assets.profile_id
        AND p.account_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "Users can update own media assets" ON public.media_assets;
CREATE POLICY "Users can update own media assets"
ON public.media_assets FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = media_assets.profile_id
        AND p.account_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = media_assets.profile_id
        AND p.account_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "Users can delete own media assets" ON public.media_assets;
CREATE POLICY "Users can delete own media assets"
ON public.media_assets FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = media_assets.profile_id
        AND p.account_id = auth.uid()
    )
);

-- ------------------------------------------------------------------------------
-- 7. VIEW BERSIH PUBLIK: PUBLIC_PROFILES (KEPATUHAN UU PDP)
-- ------------------------------------------------------------------------------
DROP VIEW IF EXISTS public.public_profiles;

CREATE OR REPLACE VIEW public.public_profiles AS
SELECT
    p.id,
    p.account_id,
    p.entity_type,
    p.esport_id,
    p.slug,
    -- Sanitasi Nama Tampil: Sembunyikan nama asli jika pengaturan privasi disetel rahasia
    CASE 
        WHEN (p.visibility_jsonb->>'realName')::boolean = false AND p.ign IS NOT NULL AND p.ign <> '' THEN p.ign
        ELSE p.display_name
    END AS display_name,
    p.ign,
    p.region_id,
    r.name AS region_name,
    r.code AS region_code,
    r.type AS region_type,
    p.main_game_id,
    g.name AS main_game_name,
    g.short_name AS main_game_short,
    p.role_name,
    -- Perlindungan Anak: Foto atlet <18 disembunyikan sampai wali memberi persetujuan eksplisit
    CASE 
        WHEN (a.birth_date IS NOT NULL AND age(CURRENT_DATE, a.birth_date) < interval '18 years') 
             AND a.guardian_consent_id IS NULL AND gc.id IS NULL 
        THEN NULL
        ELSE COALESCE(p.avatar_path, p.avatar_url)
    END AS avatar_url,
    p.avatar_path,
    p.cover_path,
    p.bio,
    -- Hanya tampilkan atribut yang bersifat publik
    p.attributes,
    p.visibility_jsonb,
    p.verification_status,
    p.verified_at,
    p.verification_expires_at,
    p.verified_badge_no,
    p.rarity_tier,
    p.completeness_score,
    p.is_demo,
    p.created_at,
    p.updated_at
FROM public.profiles p
LEFT JOIN public.regions r ON p.region_id = r.id
LEFT JOIN public.games g ON p.main_game_id = g.id
LEFT JOIN public.accounts a ON p.account_id = a.id
LEFT JOIN public.guardian_consents gc ON gc.account_id = a.id
WHERE p.is_published = true 
  AND p.verification_status NOT IN ('draft', 'suspended');

-- Beri hak akses SELECT pada view publik
GRANT SELECT ON public.public_profiles TO anon, authenticated, service_role;

-- ------------------------------------------------------------------------------
-- 8. INDEKS KINERJA TINGGI UNTUK PENCARIAN & DIREKTORI
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_profiles_region_entity_verif 
ON public.profiles(region_id, entity_type, verification_status);

CREATE INDEX IF NOT EXISTS idx_profiles_is_demo 
ON public.profiles(is_demo);

CREATE INDEX IF NOT EXISTS idx_profiles_slug_unique 
ON public.profiles(slug);

CREATE INDEX IF NOT EXISTS idx_profiles_esport_id_unique 
ON public.profiles(esport_id);

CREATE INDEX IF NOT EXISTS idx_profiles_fulltext_search 
ON public.profiles USING gin (to_tsvector('simple', display_name || ' ' || COALESCE(ign, '')));

CREATE INDEX IF NOT EXISTS idx_audit_logs_occurred_region 
ON public.audit_logs(occurred_at DESC, region_id);
