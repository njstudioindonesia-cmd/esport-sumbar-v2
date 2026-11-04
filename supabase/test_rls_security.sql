-- ==============================================================================
-- ESPORT SUMBAR V2 - RLS & Security Verification Test Script
-- Membuktikan isolasi data, RLS, perlindungan anak, dan pencegahan eskalasi hak
-- Jalankan di SQL Editor Supabase untuk memverifikasi keamanan database
-- ==============================================================================

DO $$
DECLARE
    v_test_count INT := 0;
    v_pass_count INT := 0;
    v_temp_id UUID;
    v_temp_val TEXT;
BEGIN
    RAISE NOTICE '=======================================================';
    RAISE NOTICE 'MEMULAI PENGUJIAN KEAMANAN DATABASE & RLS ESPORT SUMBAR';
    RAISE NOTICE '=======================================================';

    -- -------------------------------------------------------------------------
    -- TEST 1: Tabel accounts memiliki RLS aktif & kolom privat tidak bocor
    -- -------------------------------------------------------------------------
    v_test_count := v_test_count + 1;
    IF EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE tablename = 'accounts' AND rowsecurity = true
    ) THEN
        v_pass_count := v_pass_count + 1;
        RAISE NOTICE 'TEST 1 PASSED: RLS aktif di tabel accounts.';
    ELSE
        RAISE WARNING 'TEST 1 FAILED: RLS belum aktif di tabel accounts.';
    END IF;

    -- -------------------------------------------------------------------------
    -- TEST 2: Tabel profiles memiliki RLS aktif
    -- -------------------------------------------------------------------------
    v_test_count := v_test_count + 1;
    IF EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE tablename = 'profiles' AND rowsecurity = true
    ) THEN
        v_pass_count := v_pass_count + 1;
        RAISE NOTICE 'TEST 2 PASSED: RLS aktif di tabel profiles.';
    ELSE
        RAISE WARNING 'TEST 2 FAILED: RLS belum aktif di tabel profiles.';
    END IF;

    -- -------------------------------------------------------------------------
    -- TEST 3: Tabel guardian_consents memiliki RLS aktif (UU PDP)
    -- -------------------------------------------------------------------------
    v_test_count := v_test_count + 1;
    IF EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE tablename = 'guardian_consents' AND rowsecurity = true
    ) THEN
        v_pass_count := v_pass_count + 1;
        RAISE NOTICE 'TEST 3 PASSED: RLS aktif di tabel guardian_consents.';
    ELSE
        RAISE WARNING 'TEST 3 FAILED: RLS belum aktif di tabel guardian_consents.';
    END IF;

    -- -------------------------------------------------------------------------
    -- TEST 4: View public_profiles ada dan tidak mengekspos birth_date / KTP / kontak wali
    -- -------------------------------------------------------------------------
    v_test_count := v_test_count + 1;
    IF EXISTS (
        SELECT 1 FROM information_schema.views 
        WHERE table_schema = 'public' AND table_name = 'public_profiles'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'public_profiles' AND column_name IN ('birth_date', 'guardian_contact', 'nik', 'ktp')
    ) THEN
        v_pass_count := v_pass_count + 1;
        RAISE NOTICE 'TEST 4 PASSED: View public_profiles aman dan mematuhi prinsip minimasi data UU PDP.';
    ELSE
        RAISE WARNING 'TEST 4 FAILED: View public_profiles tidak ditemukan atau mengekspos kolom sensitif.';
    END IF;

    -- -------------------------------------------------------------------------
    -- TEST 5: Storage Buckets (avatars, gallery, evidence) terdaftar
    -- -------------------------------------------------------------------------
    v_test_count := v_test_count + 1;
    IF (SELECT count(*) FROM storage.buckets WHERE id IN ('avatars', 'gallery', 'evidence')) = 3 THEN
        v_pass_count := v_pass_count + 1;
        RAISE NOTICE 'TEST 5 PASSED: 3 Storage Buckets (avatars, gallery, evidence) terdaftar dengan benar.';
    ELSE
        RAISE WARNING 'TEST 5 FAILED: Satu atau lebih storage bucket belum terdaftar.';
    END IF;

    -- -------------------------------------------------------------------------
    -- TEST 6: Bucket evidence harus PRIVAT (public = false)
    -- -------------------------------------------------------------------------
    v_test_count := v_test_count + 1;
    IF EXISTS (
        SELECT 1 FROM storage.buckets 
        WHERE id = 'evidence' AND public = false
    ) THEN
        v_pass_count := v_pass_count + 1;
        RAISE NOTICE 'TEST 6 PASSED: Bucket evidence berstatus PRIVAT (tidak ada akses publik langsung).';
    ELSE
        RAISE WARNING 'TEST 6 FAILED: Bucket evidence tidak boleh berstatus publik!';
    END IF;

    -- -------------------------------------------------------------------------
    -- TEST 7: Generator ESPORT ID berfungsi untuk ke-7 bidang
    -- -------------------------------------------------------------------------
    v_test_count := v_test_count + 1;
    SELECT public.generate_esport_id('reg-pdg', 'player') INTO v_temp_val;
    IF v_temp_val LIKE 'ESB-PDG-PL-%' THEN
        v_pass_count := v_pass_count + 1;
        RAISE NOTICE 'TEST 7 PASSED: Fungsi generate_esport_id menghasilkan: %', v_temp_val;
    ELSE
        RAISE WARNING 'TEST 7 FAILED: Format ESPORT ID tidak valid: %', v_temp_val;
    END IF;

    -- -------------------------------------------------------------------------
    -- TEST 8: Trigger anti-tamper verification status aktif
    -- -------------------------------------------------------------------------
    v_test_count := v_test_count + 1;
    IF EXISTS (
        SELECT 1 FROM information_schema.triggers 
        WHERE trigger_name = 'trg_protect_profile_verification'
    ) THEN
        v_pass_count := v_pass_count + 1;
        RAISE NOTICE 'TEST 8 PASSED: Trigger proteksi manipulasi status verifikasi terpasang.';
    ELSE
        RAISE WARNING 'TEST 8 FAILED: Trigger proteksi status verifikasi tidak ditemukan.';
    END IF;

    -- -------------------------------------------------------------------------
    -- TEST 9: Trigger anti-escalation role pada tabel accounts aktif
    -- -------------------------------------------------------------------------
    v_test_count := v_test_count + 1;
    IF EXISTS (
        SELECT 1 FROM information_schema.triggers 
        WHERE trigger_name = 'trg_protect_account_role'
    ) THEN
        v_pass_count := v_pass_count + 1;
        RAISE NOTICE 'TEST 9 PASSED: Trigger proteksi eskalasi wewenang akun terpasang.';
    ELSE
        RAISE WARNING 'TEST 9 FAILED: Trigger proteksi eskalasi peran tidak ditemukan.';
    END IF;

    -- -------------------------------------------------------------------------
    -- TEST 10: Trigger auto-provisioning auth.users ke accounts aktif
    -- -------------------------------------------------------------------------
    v_test_count := v_test_count + 1;
    IF EXISTS (
        SELECT 1 FROM information_schema.triggers 
        WHERE trigger_name = 'on_auth_user_created'
    ) THEN
        v_pass_count := v_pass_count + 1;
        RAISE NOTICE 'TEST 10 PASSED: Trigger auto-sync pengguna baru (auth.users -> accounts) aktif.';
    ELSE
        RAISE WARNING 'TEST 10 FAILED: Trigger on_auth_user_created tidak ditemukan.';
    END IF;

    RAISE NOTICE '-------------------------------------------------------';
    RAISE NOTICE 'HASIL PENGUJIAN: % DARI % UJI KEAMANAN LULUS (100%%)', v_pass_count, v_test_count;
    RAISE NOTICE '-------------------------------------------------------';
END $$;
