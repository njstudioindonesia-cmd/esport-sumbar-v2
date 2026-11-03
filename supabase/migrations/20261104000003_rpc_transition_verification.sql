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
