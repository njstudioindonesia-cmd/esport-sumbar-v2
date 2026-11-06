-- ==============================================================================
-- ESPORT SUMBAR V3 - Database Migration: CONTRACT & CLEANUP (DESTRUKTIF)
-- PERINGATAN: BERKAS INI BERSIFAT DESTRUKTIF (DROP COLUMNS, CLEANUP OBSOLETE ROLES)
-- DILARANG DIJALANKAN PADA BAGIAN 3.
-- HANYA AKAN DIJALANKAN PADA BAGIAN 8 (CONTRACT) SETELAH PERSETUJUAN EKSPLISIT USER.
-- ==============================================================================

-- 1. HAPUS KOLOM LAMA PADA TABEL REGIONS YANG TERKAIT ESI
ALTER TABLE public.regions
    DROP COLUMN IF EXISTS esi_contact_name,
    DROP COLUMN IF EXISTS esi_secretariat,
    DROP COLUMN IF EXISTS admin_mode,
    DROP COLUMN IF EXISTS has_active_admin;

-- 2. PERKETAT BATASAN CHECK PADA ACCOUNTS.ROLE (HAPUS PERAN WILAYAH LAMA)
ALTER TABLE public.accounts 
    DROP CONSTRAINT IF EXISTS accounts_role_check;

ALTER TABLE public.accounts 
    ADD CONSTRAINT accounts_role_check 
    CHECK (role IN ('user', 'platform_admin'));

-- 3. PERKETAT BATASAN CHECK PADA PROFILES.VERIFICATION_STATUS (HAPUS STATUS REGIONAL LAMA)
ALTER TABLE public.profiles 
    DROP CONSTRAINT IF EXISTS profiles_verification_status_check;

ALTER TABLE public.profiles 
    ADD CONSTRAINT profiles_verification_status_check 
    CHECK (verification_status IN (
        'unverified', 'submitted', 'under_review', 
        'revision_requested', 'verified', 
        'rejected', 'suspended', 'expired'
    ));

-- 4. PERKETAT BATASAN CHECK PADA VERIFICATION_REQUESTS.STATUS
ALTER TABLE public.verification_requests 
    DROP CONSTRAINT IF EXISTS verification_requests_status_check;

ALTER TABLE public.verification_requests 
    ADD CONSTRAINT verification_requests_status_check 
    CHECK (status IN (
        'submitted', 'under_review', 
        'revision_requested', 'verified', 
        'rejected', 'suspended', 'expired'
    ));

-- 5. HAPUS FUNGSI & RPC LAMA YANG SUDAH TIDAK DIGUNAKAN
DROP FUNCTION IF EXISTS public.get_auth_region_id();
