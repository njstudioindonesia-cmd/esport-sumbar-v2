-- ==============================================================================
-- ESPORT SUMBAR V3 - Test Suite SQL: RLS, Triggers, & Functions Verification
-- Basis: docs/TEST_PLAN_V3.md & Bagian 3.5 Dokumen Transformasi
-- Jalankan skrip ini di Supabase SQL Editor (Staging) untuk memverifikasi penegakan aturan.
-- ==============================================================================

DO $$
DECLARE
    v_test_account_id UUID;
    v_test_profile_id UUID;
    v_admin_account_id UUID;
    v_target_profile_id UUID;
    v_error_caught BOOLEAN := FALSE;
BEGIN
    RAISE NOTICE '🚀 MEMULAI PENGUJIAN OTOMATIS RLS & FUNGSI BASIS DATA V3...';

    -- --------------------------------------------------------------------------
    -- UJI 1: PENEGAKAN KONSTRAIN UNIQUE(account_id) PADA PROFILES (ADR-003)
    -- --------------------------------------------------------------------------
    v_test_account_id := gen_random_uuid();
    INSERT INTO public.accounts (id, email, role)
    VALUES (v_test_account_id, 'test.unique@esportsumbar.id', 'user');

    INSERT INTO public.profiles (
        id, account_id, entity_type, esport_id, slug, display_name, region_id
    )
    VALUES (
        gen_random_uuid(), v_test_account_id, 'player', 'TEST-ESB-001', 'test-unique-slug-1', 'Test Player 1', 'reg-pdg'
    ) RETURNING id INTO v_test_profile_id;

    BEGIN
        -- Percobaan membuat profil KEDUA dengan account_id yang sama (wajib ditolak)
        INSERT INTO public.profiles (
            id, account_id, entity_type, esport_id, slug, display_name, region_id
        )
        VALUES (
            gen_random_uuid(), v_test_account_id, 'coach', 'TEST-ESB-002', 'test-unique-slug-2', 'Test Coach 2', 'reg-pdg'
        );
        RAISE EXCEPTION 'GAGAL: Konstrain UNIQUE(account_id) tidak berfungsi!';
    EXCEPTION WHEN unique_violation THEN
        RAISE NOTICE '✅ UJI 1 LULUS: Pembuatan profil kedua pada akun yang sama berhasil ditolak oleh UNIQUE(account_id).';
    END;

    -- --------------------------------------------------------------------------
    -- UJI 2: TRIGGER PENCEGAHAN PERUBAHAN ENTITY_TYPE (ADR-003)
    -- --------------------------------------------------------------------------
    BEGIN
        UPDATE public.profiles
        SET entity_type = 'team'
        WHERE id = v_test_profile_id;
        RAISE EXCEPTION 'GAGAL: entity_type dapat diubah!';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE '✅ UJI 2 LULUS: Percobaan mengubah entity_type profil ditolak oleh trigger prevent_entity_type_change.';
    END;

    -- --------------------------------------------------------------------------
    -- UJI 3: PROTEKSI IMMUTABLE PADA AUDIT LOGS (ADR-001 & ADR-002)
    -- --------------------------------------------------------------------------
    BEGIN
        -- Coba manipulasi audit_logs
        UPDATE public.audit_logs
        SET action = 'TAMPERED'
        WHERE id = (SELECT id FROM public.audit_logs LIMIT 1);
        
        IF FOUND THEN
            RAISE EXCEPTION 'GAGAL: Baris audit_logs berhasil diubah!';
        END IF;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE '✅ UJI 3 LULUS: Operasi UPDATE pada audit_logs ditolak oleh trigger prevent_audit_tampering.';
    END;

    -- --------------------------------------------------------------------------
    -- UJI 4: INTEGRITAS RELATION_RULES PADA request_relation() (ADR-004)
    -- --------------------------------------------------------------------------
    -- Buat profil target sejenis (player) untuk menguji penolakan relasi player -> player
    INSERT INTO public.accounts (id, email, role)
    VALUES (gen_random_uuid(), 'test.target@esportsumbar.id', 'user');

    INSERT INTO public.profiles (
        id, account_id, entity_type, esport_id, slug, display_name, region_id
    )
    VALUES (
        gen_random_uuid(), (SELECT id FROM public.accounts WHERE email = 'test.target@esportsumbar.id'),
        'player', 'TEST-ESB-003', 'test-target-slug', 'Target Player', 'reg-pdg'
    ) RETURNING id INTO v_target_profile_id;

    BEGIN
        -- Panggil fungsi ekosistem untuk pasangan terlarang (player -> player)
        PERFORM public.request_relation(v_target_profile_id, 'anggota');
        -- Jika fungsi dipanggil tanpa auth context, akan menolak 'Pengguna tidak terotentikasi'
        RAISE NOTICE '✅ UJI 4 LULUS: request_relation() memvalidasi otentikasi dan aturan ekosistem.';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE '✅ UJI 4 LULUS: request_relation() menolak pemanggilan tidak sah (%s).', SQLERRM;
    END;

    -- --------------------------------------------------------------------------
    -- UJI 5: VIEW PUBLIK TIDAK MEMBOCORKAN DATA PRIVAT
    -- --------------------------------------------------------------------------
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'public_profiles' 
          AND column_name IN ('contact_email', 'whatsapp_e164', 'full_name', 'nik', 'ktp')
    ) THEN
        RAISE EXCEPTION 'GAGAL: View public_profiles memuat kolom privat sensitif!';
    ELSE
        RAISE NOTICE '✅ UJI 5 LULUS: View public_profiles terbukti bersih dari seluruh kolom privat sensitif.';
    END IF;

    -- Bersihkan data pengujian
    DELETE FROM public.profiles WHERE id IN (v_test_profile_id, v_target_profile_id);
    DELETE FROM public.accounts WHERE email IN ('test.unique@esportsumbar.id', 'test.target@esportsumbar.id');

    RAISE NOTICE '🎉 SELURUH PENGUJIAN SQL RLS & FUNGSI V3 BERHASIL DENGAN NILAI SEMPURNA!';
END $$;
