-- ==============================================================================
-- ESPORT SUMBAR V3 - Database Migration 0012: MIGRATE Data (Status, Peran, Multi-Profil)
-- Basis: docs/DATA_MIGRATION_PLAN_V3.md & Keputusan D1, D2, D3
-- ==============================================================================

-- 1. MIGRASI STATUS VERIFIKASI PADA TABEL PROFILES (Keputusan D3)
UPDATE public.profiles
SET verification_status = CASE
    WHEN verification_status = 'draft' THEN 'unverified'
    WHEN verification_status IN ('regional_review', 'regional_approved', 'provincial_review', 'in_review_regional', 'in_review_provincial', 'regional_checked') THEN 'under_review'
    WHEN verification_status = 'revision' THEN 'revision_requested'
    WHEN verification_status = 'prov_verified' THEN 'verified'
    ELSE verification_status
END
WHERE verification_status IN ('draft', 'regional_review', 'regional_approved', 'provincial_review', 'in_review_regional', 'in_review_provincial', 'regional_checked', 'revision', 'prov_verified');

-- 2. MIGRASI STATUS VERIFIKASI PADA TABEL VERIFICATION_REQUESTS
UPDATE public.verification_requests
SET status = CASE
    WHEN status IN ('regional_review', 'regional_approved', 'provincial_review') THEN 'under_review'
    WHEN status = 'revision' THEN 'revision_requested'
    WHEN status = 'prov_verified' THEN 'verified'
    ELSE status
END
WHERE status IN ('regional_review', 'regional_approved', 'provincial_review', 'revision', 'prov_verified');

-- 3. MIGRASI PERAN PENGGUNA (Keputusan D1)
-- - Turunkan peran kedaerahan (region_admin, prov_admin) menjadi user biasa
-- - Konversi peran platform_operator menjadi platform_admin
UPDATE public.accounts
SET role = CASE
    WHEN role IN ('region_admin', 'prov_admin') THEN 'user'
    WHEN role = 'platform_operator' THEN 'platform_admin'
    ELSE role
END
WHERE role IN ('region_admin', 'prov_admin', 'platform_operator');

-- 4. MIGRASI AKUN MULTI-PROFIL: ARSIPKAN PROFIL SEKUNDER (Keputusan D2)
-- Menyeleksi 1 profil utama per akun (prioritas: verified > terawal dibuat),
-- dan memindahkan profil sekunder lainnya ke profiles_archived.
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
        -- Pilih 1 profil terbaik untuk dipertahankan
        SELECT id INTO v_primary_profile_id
        FROM public.profiles
        WHERE account_id = v_acc.account_id
        ORDER BY 
            (verification_status = 'verified') DESC,
            completeness_score DESC,
            created_at ASC
        LIMIT 1;

        -- Arsipkan profil sekunder
        FOR v_secondary IN 
            SELECT * FROM public.profiles
            WHERE account_id = v_acc.account_id AND id != v_primary_profile_id
        LOOP
            -- Masukkan ke profiles_archived
            INSERT INTO public.profiles_archived (
                id, 
                account_id, 
                entity_type, 
                esport_id, 
                display_name, 
                original_data, 
                archived_reason
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

            -- Akhiri seluruh relasi yang mengarah ke/dari profil sekunder ini
            UPDATE public.entity_relations
            SET status = 'ended', ended_at = NOW()
            WHERE (source_profile_id = v_secondary.id OR target_profile_id = v_secondary.id)
              AND status IN ('pending', 'active');

            -- Hapus profil sekunder dari tabel aktif profiles
            DELETE FROM public.profiles
            WHERE id = v_secondary.id;
        END LOOP;
    END LOOP;
END $$;
