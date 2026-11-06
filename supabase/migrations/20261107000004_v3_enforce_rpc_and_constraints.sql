-- ==============================================================================
-- ESPORT SUMBAR V3 - Database Migration 0013: ENFORCE (RPC Baru, Konstrain, Triggers)
-- Basis: docs/adr/ADR-001 s/d ADR-004 & Bagian 3.3 Dokumen Transformasi
-- ==============================================================================

-- 1. PENEGAKAN KONSTRAIN UNIQUE(account_id) PADA TABEL PROFILES (ADR-003)
ALTER TABLE public.profiles
    DROP CONSTRAINT IF EXISTS profiles_account_id_unique;

ALTER TABLE public.profiles
    ADD CONSTRAINT profiles_account_id_unique UNIQUE(account_id);

-- 2. TRIGGER: MENCEGAH PERUBAHAN ENTITY_TYPE SETELAH REGISTRASI (ADR-003)
CREATE OR REPLACE FUNCTION public.prevent_entity_type_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.entity_type IS NOT NULL AND NEW.entity_type != OLD.entity_type THEN
        RAISE EXCEPTION 'Pelanggaran integritas: Jenis entitas profil (%) bersifat permanen dan tidak dapat diubah.', OLD.entity_type;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prevent_entity_type_change ON public.profiles;
CREATE TRIGGER trg_prevent_entity_type_change
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.prevent_entity_type_change();

-- 3. TRIGGER: KASKADE PENGAKHIRAN RELASI SAAT PROFIL DISUSPENSI / DIHAPUS (ADR-004)
CREATE OR REPLACE FUNCTION public.cascade_end_relations_on_profile_state()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'UPDATE' AND NEW.verification_status = 'suspended' AND OLD.verification_status != 'suspended') THEN
        UPDATE public.entity_relations
        SET status = 'ended', ended_at = NOW()
        WHERE (source_profile_id = NEW.id OR target_profile_id = NEW.id)
          AND status IN ('pending', 'active');
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE public.entity_relations
        SET status = 'ended', ended_at = NOW()
        WHERE (source_profile_id = OLD.id OR target_profile_id = OLD.id)
          AND status IN ('pending', 'active');
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_cascade_end_relations ON public.profiles;
CREATE TRIGGER trg_cascade_end_relations
AFTER UPDATE OR DELETE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.cascade_end_relations_on_profile_state();

-- 4. RPC SERVER TUNGGAL: transition_verification() (ADR-001 & ADR-002)
-- Menggantikan alur 2-tier lama. Hanya platform_admin yang berwenang.
CREATE OR REPLACE FUNCTION public.transition_verification(
    p_request_id UUID,
    p_new_status VARCHAR(30),
    p_reason TEXT DEFAULT NULL,
    p_notes TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_actor_id UUID;
    v_actor_role VARCHAR(30);
    v_request RECORD;
    v_profile RECORD;
    v_old_status VARCHAR(30);
    v_generated_badge_no VARCHAR(60) := NULL;
    v_expires_at TIMESTAMPTZ := NULL;
    v_verified_at TIMESTAMPTZ := NULL;
    v_outbox_id UUID;
BEGIN
    -- A. Verifikasi identitas aktor penelaah
    v_actor_id := auth.uid();
    IF v_actor_id IS NULL THEN
        RAISE EXCEPTION 'Akses ditolak: Pengguna tidak terotentikasi.';
    END IF;

    SELECT role INTO v_actor_role
    FROM public.accounts
    WHERE id = v_actor_id;

    IF v_actor_role != 'platform_admin' THEN
        RAISE EXCEPTION 'Akses ditolak: Hanya platform_admin ESPORT SUMBAR yang berwenang menelaah verifikasi.';
    END IF;

    -- B. Ambil permohonan verifikasi (kunci baris transaksi)
    SELECT * INTO v_request
    FROM public.verification_requests
    WHERE id = p_request_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Permohonan verifikasi ID % tidak ditemukan.', p_request_id;
    END IF;

    -- C. Ambil profil pemilik
    SELECT * INTO v_profile
    FROM public.profiles
    WHERE id = v_request.profile_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Profil pemilik permohonan verifikasi tidak ditemukan.';
    END IF;

    -- D. ATURAN PEMISAHAN KEPENTINGAN (Separation of Duties)
    -- Admin DILARANG memverifikasi profil milik akunnya sendiri
    IF v_profile.account_id = v_actor_id THEN
        RAISE EXCEPTION 'Pelanggaran integritas: Administrator dilarang menelaah atau memverifikasi akun/profil miliknya sendiri.';
    END IF;

    -- E. Validasi alasan wajib
    IF p_new_status IN ('rejected', 'revision_requested', 'suspended') AND (p_reason IS NULL OR length(trim(p_reason)) < 5) THEN
        RAISE EXCEPTION 'Alasan wajib diisi minimal 5 karakter untuk penolakan, permintaan revisi, atau penangguhan.';
    END IF;

    v_old_status := v_request.status;

    -- F. Tentukan lencana & tanggal berlaku jika disetujui
    IF p_new_status = 'verified' THEN
        v_verified_at := NOW();
        v_expires_at := NOW() + INTERVAL '12 months';
        
        -- Format Lencana Resmi ESPORT SUMBAR: ESP-SB-VER-YYYY-XXXX (tanpa kata ESI)
        SELECT COALESCE(v_profile.verified_badge_no,
            'ESP-SB-VER-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(FLOOR(RANDOM() * 9000 + 1000)::TEXT, 4, '0')
        ) INTO v_generated_badge_no;
    END IF;

    -- G. Perbarui tabel verification_requests
    UPDATE public.verification_requests
    SET status = p_new_status,
        reviewer_id = v_actor_id,
        rejection_reason = CASE WHEN p_new_status IN ('rejected', 'revision_requested', 'suspended') THEN p_reason ELSE rejection_reason END,
        admin_notes = COALESCE(p_notes, admin_notes),
        reviewed_at = NOW(),
        updated_at = NOW()
    WHERE id = p_request_id;

    -- H. Sinkronisasi ke tabel profiles
    UPDATE public.profiles
    SET verification_status = p_new_status,
        verified_at = COALESCE(v_verified_at, verified_at),
        verification_expires_at = COALESCE(v_expires_at, verification_expires_at),
        verified_badge_no = COALESCE(v_generated_badge_no, verified_badge_no),
        updated_at = NOW()
    WHERE id = v_profile.id;

    -- I. Tulis Audit Log Append-Only
    INSERT INTO public.audit_logs (
        actor_id,
        actor_role,
        action,
        entity_type,
        entity_id,
        old_data,
        new_data
    )
    VALUES (
        v_actor_id,
        v_actor_role,
        'VERIFICATION_TRANSITION_' || UPPER(p_new_status),
        'verification_request',
        p_request_id,
        jsonb_build_object('status', v_old_status, 'profile_id', v_profile.id),
        jsonb_build_object(
            'status', p_new_status,
            'reason', p_reason,
            'badge_no', v_generated_badge_no,
            'expires_at', v_expires_at
        )
    );

    -- J. Rekam ke Transactional Outbox (Event: VerificationDecided)
    INSERT INTO public.outbox_events (
        event_name,
        aggregate_type,
        aggregate_id,
        payload
    )
    VALUES (
        'VerificationDecided',
        'verification',
        p_request_id,
        jsonb_build_object(
            'requestId', p_request_id,
            'profileId', v_profile.id,
            'decision', p_new_status,
            'reviewerId', v_actor_id,
            'reason', p_reason,
            'badgeNumber', v_generated_badge_no,
            'decidedAt', NOW()
        )
    ) RETURNING id INTO v_outbox_id;

    RETURN jsonb_build_object(
        'success', TRUE,
        'requestId', p_request_id,
        'oldStatus', v_old_status,
        'newStatus', p_new_status,
        'badgeNo', v_generated_badge_no,
        'expiresAt', v_expires_at,
        'outboxEventId', v_outbox_id
    );
END;
$$;

-- 5. FUNGSI EKOSISTEM: request_relation() (ADR-004)
CREATE OR REPLACE FUNCTION public.request_relation(
    p_target_profile_id UUID,
    p_relation_type VARCHAR(50),
    p_game_id VARCHAR(50) DEFAULT NULL,
    p_message TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_actor_id UUID;
    v_source_profile RECORD;
    v_target_profile RECORD;
    v_rule RECORD;
    v_active_count INT;
    v_daily_requests INT;
    v_relation_id UUID;
BEGIN
    v_actor_id := auth.uid();
    IF v_actor_id IS NULL THEN
        RAISE EXCEPTION 'Akses ditolak: Pengguna tidak terotentikasi.';
    END IF;

    -- Ambil profil milik user yang sedang aktif
    SELECT * INTO v_source_profile
    FROM public.profiles
    WHERE account_id = v_actor_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Profil pengirim tidak ditemukan.';
    END IF;

    -- Ambil profil target
    SELECT * INTO v_target_profile
    FROM public.profiles
    WHERE id = p_target_profile_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Profil target tidak ditemukan.';
    END IF;

    -- Larangan relasi ke diri sendiri
    IF v_source_profile.id = v_target_profile.id THEN
        RAISE EXCEPTION 'Tidak dapat membuat hubungan dengan profil sendiri.';
    END IF;

    -- Cari aturan yang cocok di relation_rules
    SELECT * INTO v_rule
    FROM public.relation_rules
    WHERE source_entity_type = v_source_profile.entity_type
      AND target_entity_type = v_target_profile.entity_type
      AND relation_type = p_relation_type
      AND is_active = TRUE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Pasangan hubungan % -> % (%) tidak diizinkan dalam pedoman ekosistem.',
            v_source_profile.entity_type, v_target_profile.entity_type, p_relation_type;
    END IF;

    -- Periksa kecocokan game jika disyaratkan
    IF v_rule.game_match_required THEN
        IF v_source_profile.main_game_id IS NULL OR v_target_profile.main_game_id IS NULL OR v_source_profile.main_game_id != v_target_profile.main_game_id THEN
            RAISE EXCEPTION 'Hubungan ini mensyaratkan cabang game utama yang sama antara kedua entitas.';
        END IF;
    END IF;

    -- Periksa kuota batas aktif
    SELECT count(*) INTO v_active_count
    FROM public.entity_relations
    WHERE source_profile_id = v_source_profile.id
      AND relation_type = p_relation_type
      AND status = 'active';

    IF v_active_count >= v_rule.max_active_limit THEN
        RAISE EXCEPTION 'Batas maksimal hubungan aktif untuk jenis ini (% maksimal) telah tercapai.', v_rule.max_active_limit;
    END IF;

    -- Rate limiting harian anti-spam (maks 5 request per hari)
    SELECT count(*) INTO v_daily_requests
    FROM public.entity_relations
    WHERE source_profile_id = v_source_profile.id
      AND created_at >= NOW() - INTERVAL '24 hours';

    IF v_daily_requests >= 5 THEN
        RAISE EXCEPTION 'Batas harian pengajuan hubungan (maksimal 5 per 24 jam) telah tercapai.';
    END IF;

    -- Buat baris hubungan baru dengan masa kedaluwarsa 14 hari
    INSERT INTO public.entity_relations (
        source_profile_id,
        target_profile_id,
        relation_type,
        game_id,
        status,
        expires_at
    )
    VALUES (
        v_source_profile.id,
        v_target_profile.id,
        p_relation_type,
        COALESCE(p_game_id, v_source_profile.main_game_id),
        CASE WHEN v_rule.requires_approval THEN 'pending' ELSE 'active' END,
        NOW() + INTERVAL '14 days'
    )
    RETURNING id INTO v_relation_id;

    -- Rekam event ke outbox
    INSERT INTO public.outbox_events (event_name, aggregate_type, aggregate_id, payload)
    VALUES (
        'RelationRequested',
        'ecosystem',
        v_relation_id,
        jsonb_build_object(
            'relationId', v_relation_id,
            'sourceProfileId', v_source_profile.id,
            'targetProfileId', v_target_profile.id,
            'relationType', p_relation_type,
            'expiresAt', NOW() + INTERVAL '14 days'
        )
    );

    RETURN jsonb_build_object(
        'success', TRUE,
        'relationId', v_relation_id,
        'status', CASE WHEN v_rule.requires_approval THEN 'pending' ELSE 'active' END
    );
END;
$$;

-- 6. FUNGSI EKOSISTEM: respond_relation() (ADR-004)
CREATE OR REPLACE FUNCTION public.respond_relation(
    p_relation_id UUID,
    p_action VARCHAR(20), -- 'accept' atau 'reject'
    p_reason TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_actor_id UUID;
    v_relation RECORD;
    v_target_profile RECORD;
BEGIN
    v_actor_id := auth.uid();
    IF v_actor_id IS NULL THEN
        RAISE EXCEPTION 'Akses ditolak: Pengguna tidak terotentikasi.';
    END IF;

    SELECT * INTO v_relation
    FROM public.entity_relations
    WHERE id = p_relation_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Data hubungan tidak ditemukan.';
    END IF;

    IF v_relation.status != 'pending' THEN
        RAISE EXCEPTION 'Permintaan hubungan ini sudah tidak dalam status pending (Status saat ini: %).', v_relation.status;
    END IF;

    -- Pastikan aktor yang merespon adalah pemilik target_profile_id
    SELECT * INTO v_target_profile
    FROM public.profiles
    WHERE id = v_relation.target_profile_id;

    IF v_target_profile.account_id != v_actor_id THEN
        RAISE EXCEPTION 'Akses ditolak: Hanya pemilik entitas target yang berwenang merespon permohonan ini.';
    END IF;

    IF p_action = 'accept' THEN
        UPDATE public.entity_relations
        SET status = 'active',
            started_at = NOW(),
            approved_by = v_actor_id,
            updated_at = NOW()
        WHERE id = p_relation_id;

        INSERT INTO public.outbox_events (event_name, aggregate_type, aggregate_id, payload)
        VALUES (
            'RelationApproved',
            'ecosystem',
            p_relation_id,
            jsonb_build_object(
                'relationId', p_relation_id,
                'sourceProfileId', v_relation.source_profile_id,
                'targetProfileId', v_relation.target_profile_id,
                'approvedAt', NOW()
            )
        );
    ELSIF p_action = 'reject' THEN
        UPDATE public.entity_relations
        SET status = 'rejected',
            rejection_reason = p_reason,
            ended_at = NOW(),
            updated_at = NOW()
        WHERE id = p_relation_id;
    ELSE
        RAISE EXCEPTION 'Aksi tidak valid. Gunakan accept atau reject.';
    END IF;

    RETURN jsonb_build_object(
        'success', TRUE,
        'relationId', p_relation_id,
        'newStatus', CASE WHEN p_action = 'accept' THEN 'active' ELSE 'rejected' END
    );
END;
$$;
