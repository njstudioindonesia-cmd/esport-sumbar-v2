-- ==============================================================================
-- ESPORT SUMBAR V2 - Database Migration 0007 (Fase 2.2)
-- Migrasi Data Privat ke profile_private & Sanitasi View public_profiles
-- Memastikan tidak ada kontak privat bocor ke view publik (Kepatuhan UU PDP)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. MIGRASI DATA: Salin Data Kontak & Privat yang Tersimpan di Attributes/Metadata
-- ------------------------------------------------------------------------------
INSERT INTO public.profile_private (
    profile_id,
    account_id,
    full_name,
    whatsapp_e164,
    contact_email,
    birth_date,
    gender,
    address_street,
    kecamatan,
    nagari_kelurahan,
    game_account_id,
    game_server,
    guardian_name,
    guardian_whatsapp,
    guardian_relationship,
    rate_note,
    manager_name,
    manager_role,
    manager_whatsapp
)
SELECT
    p.id AS profile_id,
    p.account_id,
    COALESCE(p.attributes->>'full_name', p.metadata_jsonb->>'full_name', NULL) AS full_name,
    COALESCE(p.attributes->>'whatsapp', p.attributes->>'phone', p.metadata_jsonb->>'phone', NULL) AS whatsapp_e164,
    COALESCE(p.attributes->>'email', p.metadata_jsonb->>'email', NULL) AS contact_email,
    a.birth_date AS birth_date,
    COALESCE(p.attributes->>'gender', NULL) AS gender,
    COALESCE(p.attributes->>'address_street', p.attributes->>'address', NULL) AS address_street,
    COALESCE(p.attributes->>'kecamatan', NULL) AS kecamatan,
    COALESCE(p.attributes->>'nagari_kelurahan', p.attributes->>'kelurahan', NULL) AS nagari_kelurahan,
    COALESCE(p.attributes->>'game_account_id', p.metadata_jsonb->>'game_account_id', NULL) AS game_account_id,
    COALESCE(p.attributes->>'game_server', NULL) AS game_server,
    gc.guardian_name,
    gc.guardian_contact AS guardian_whatsapp,
    gc.guardian_relationship,
    COALESCE(p.attributes->>'rate_note', p.attributes->>'rate_indicative', NULL) AS rate_note,
    COALESCE(p.attributes->>'manager_name', NULL) AS manager_name,
    COALESCE(p.attributes->>'manager_role', NULL) AS manager_role,
    COALESCE(p.attributes->>'manager_whatsapp', NULL) AS manager_whatsapp
FROM public.profiles p
JOIN public.accounts a ON p.account_id = a.id
LEFT JOIN public.guardian_consents gc ON gc.account_id = a.id
ON CONFLICT (profile_id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    whatsapp_e164 = EXCLUDED.whatsapp_e164,
    contact_email = EXCLUDED.contact_email,
    birth_date = EXCLUDED.birth_date,
    address_street = EXCLUDED.address_street,
    kecamatan = EXCLUDED.kecamatan,
    nagari_kelurahan = EXCLUDED.nagari_kelurahan,
    game_account_id = EXCLUDED.game_account_id,
    game_server = EXCLUDED.game_server,
    guardian_name = EXCLUDED.guardian_name,
    guardian_whatsapp = EXCLUDED.guardian_whatsapp,
    updated_at = NOW();

-- ------------------------------------------------------------------------------
-- 2. BERSIHKAN KUNCI PRIVAT DARI JSONB ATTRIBUTES PROFILES
-- Hapus data kontak langsung dari kolom attributes agar tidak tersimpan ganda
-- ------------------------------------------------------------------------------
UPDATE public.profiles
SET attributes = attributes 
    - 'whatsapp' 
    - 'phone' 
    - 'email' 
    - 'full_name' 
    - 'game_account_id' 
    - 'game_server' 
    - 'address_street' 
    - 'guardian_whatsapp'
    - 'manager_whatsapp'
WHERE attributes ?| ARRAY['whatsapp', 'phone', 'email', 'full_name', 'game_account_id', 'game_server', 'address_street', 'guardian_whatsapp', 'manager_whatsapp'];

-- ------------------------------------------------------------------------------
-- 3. PERBARUI VIEW PUBLIK: PUBLIC_PROFILES (BEBAS DATA PRIVAT)
-- ------------------------------------------------------------------------------
DROP VIEW IF EXISTS public.public_profiles;

CREATE OR REPLACE VIEW public.public_profiles AS
SELECT
    p.id,
    p.account_id,
    p.entity_type,
    p.esport_id,
    p.slug,
    -- Sanitasi Nama Tampil
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
    -- Perlindungan Anak: Foto atlet <18 disembunyikan sampai wali memberi persetujuan
    CASE 
        WHEN (a.birth_date IS NOT NULL AND age(CURRENT_DATE, a.birth_date) < interval '18 years') 
             AND gc.id IS NULL 
        THEN NULL
        ELSE COALESCE(p.avatar_path, p.avatar_url)
    END AS avatar_url,
    p.avatar_path,
    p.cover_path,
    p.bio,
    -- HANYA ATRIBUT PUBLIK YANG TERSEDIA DI VIEW
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

GRANT SELECT ON public.public_profiles TO anon, authenticated, service_role;
