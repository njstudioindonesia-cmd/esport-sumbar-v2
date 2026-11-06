-- ==============================================================================
-- ESPORT SUMBAR V3 - MIGRASI TAHAP 2: KONSTRAIN, TRIGGERS, RPC, & RLS
-- Jalankan skrip ini SETELAH Tahap 1 berhasil di Supabase SQL Editor.
-- ==============================================================================

BEGIN;

-- 4.1 Konstrain 1 Akun 1 Profil
ALTER TABLE public.profiles
    DROP CONSTRAINT IF EXISTS profiles_account_id_unique;

ALTER TABLE public.profiles
    ADD CONSTRAINT profiles_account_id_unique UNIQUE(account_id);

-- 4.2 Trigger Cegah Ganti entity_type
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

-- 4.3 Trigger Kaskade Pengakhiran Relasi
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

-- 4.4 RPC transition_verification Baru (Satu Tahap Langsung, ESP-SB-VER)
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

    SELECT * INTO v_request
    FROM public.verification_requests
    WHERE id = p_request_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Permohonan verifikasi ID % tidak ditemukan.', p_request_id;
    END IF;

    SELECT * INTO v_profile
    FROM public.profiles
    WHERE id = v_request.profile_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Profil pemilik permohonan verifikasi tidak ditemukan.';
    END IF;

    -- DILARANG memverifikasi profil milik akun sendiri
    IF v_profile.account_id = v_actor_id THEN
        RAISE EXCEPTION 'Pelanggaran integritas: Administrator dilarang menelaah atau memverifikasi akun/profil miliknya sendiri.';
    END IF;

    IF p_new_status IN ('rejected', 'revision_requested', 'suspended') AND (p_reason IS NULL OR length(trim(p_reason)) < 5) THEN
        RAISE EXCEPTION 'Alasan wajib diisi minimal 5 karakter untuk penolakan, permintaan revisi, atau penangguhan.';
    END IF;

    v_old_status := v_request.status;

    IF p_new_status = 'verified' THEN
        v_verified_at := NOW();
        v_expires_at := NOW() + INTERVAL '12 months';
        
        SELECT COALESCE(v_profile.verified_badge_no,
            'ESP-SB-VER-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(FLOOR(RANDOM() * 9000 + 1000)::TEXT, 4, '0')
        ) INTO v_generated_badge_no;
    END IF;

    UPDATE public.verification_requests
    SET status = p_new_status,
        reviewer_id = v_actor_id,
        current_reviewer_id = v_actor_id,
        decided_at = CASE WHEN p_new_status IN ('verified', 'rejected', 'suspended') THEN NOW() ELSE decided_at END,
        reviewed_at = NOW(),
        rejection_reason = CASE WHEN p_new_status IN ('rejected', 'revision_requested', 'suspended') THEN p_reason ELSE rejection_reason END,
        admin_notes = COALESCE(p_notes, admin_notes),
        notes = COALESCE(p_reason, p_notes, notes),
        updated_at = NOW()
    WHERE id = p_request_id;

    UPDATE public.profiles
    SET verification_status = p_new_status,
        verified_at = COALESCE(v_verified_at, verified_at),
        verification_expires_at = COALESCE(v_expires_at, verification_expires_at),
        verified_badge_no = COALESCE(v_generated_badge_no, verified_badge_no),
        updated_at = NOW()
    WHERE id = v_profile.id;

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
    )
    VALUES (
        v_actor_id,
        v_actor_role,
        v_profile.region_id,
        'VERIFICATION_TRANSITION_' || UPPER(p_new_status),
        'profile',
        v_profile.id::TEXT,
        v_old_status,
        p_new_status,
        COALESCE(p_reason, 'Pembaruan status verifikasi'),
        jsonb_build_object(
            'request_id', p_request_id,
            'badge_no', v_generated_badge_no,
            'expires_at', v_expires_at,
            'admin_notes', p_notes
        )
    );

    INSERT INTO public.outbox_events (event_name, aggregate_type, aggregate_id, payload)
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

-- 5. RLS POLICIES: KONSOLIDASI USER & PLATFORM_ADMIN
CREATE OR REPLACE FUNCTION public.is_platform_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.accounts
        WHERE id = auth.uid() AND role = 'platform_admin' AND is_active = TRUE
    );
$$;

ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read their own account" ON public.accounts;
CREATE POLICY "Users can read their own account"
ON public.accounts FOR SELECT
TO authenticated
USING (id = auth.uid() OR public.is_platform_admin());

DROP POLICY IF EXISTS "Users can update their own account" ON public.accounts;
CREATE POLICY "Users can update their own account"
ON public.accounts FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid() AND role = (SELECT role FROM public.accounts WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Platform admin can manage accounts" ON public.accounts;
CREATE POLICY "Platform admin can manage accounts"
ON public.accounts FOR ALL
TO authenticated
USING (public.is_platform_admin());

-- Profiles RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view published profiles" ON public.profiles;
CREATE POLICY "Public can view published profiles"
ON public.profiles FOR SELECT
TO public
USING (is_published = TRUE AND verification_status != 'suspended');

DROP POLICY IF EXISTS "Users can manage own profile" ON public.profiles;
CREATE POLICY "Users can manage own profile"
ON public.profiles FOR ALL
TO authenticated
USING (account_id = auth.uid() OR public.is_platform_admin())
WITH CHECK (account_id = auth.uid() OR public.is_platform_admin());

-- Tables Dinamis Games, Roles, Ranks, Relation Rules RLS
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_ranks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.relation_rules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view games" ON public.games;
CREATE POLICY "Public can view games" ON public.games FOR SELECT TO public USING (TRUE);

DROP POLICY IF EXISTS "Public can view game roles" ON public.game_roles;
CREATE POLICY "Public can view game roles" ON public.game_roles FOR SELECT TO public USING (TRUE);

DROP POLICY IF EXISTS "Public can view game ranks" ON public.game_ranks;
CREATE POLICY "Public can view game ranks" ON public.game_ranks FOR SELECT TO public USING (TRUE);

DROP POLICY IF EXISTS "Public can view relation rules" ON public.relation_rules;
CREATE POLICY "Public can view relation rules" ON public.relation_rules FOR SELECT TO public USING (is_active = TRUE);

DROP POLICY IF EXISTS "Platform admin can manage games" ON public.games;
CREATE POLICY "Platform admin can manage games" ON public.games FOR ALL TO authenticated USING (public.is_platform_admin());

DROP POLICY IF EXISTS "Platform admin can manage game roles" ON public.game_roles;
CREATE POLICY "Platform admin can manage game roles" ON public.game_roles FOR ALL TO authenticated USING (public.is_platform_admin());

DROP POLICY IF EXISTS "Platform admin can manage game ranks" ON public.game_ranks;
CREATE POLICY "Platform admin can manage game ranks" ON public.game_ranks FOR ALL TO authenticated USING (public.is_platform_admin());

DROP POLICY IF EXISTS "Platform admin can manage relation rules" ON public.relation_rules;
CREATE POLICY "Platform admin can manage relation rules" ON public.relation_rules FOR ALL TO authenticated USING (public.is_platform_admin());

-- Audit Logs Append-Only
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Platform admin can view audit logs" ON public.audit_logs;
CREATE POLICY "Platform admin can view audit logs"
ON public.audit_logs FOR SELECT
TO authenticated
USING (public.is_platform_admin());

CREATE OR REPLACE FUNCTION public.prevent_audit_logs_tampering()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Audit Log bersifat append-only dan tidak dapat diubah atau dihapus oleh siapapun.';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prevent_audit_tampering ON public.audit_logs;
CREATE TRIGGER trg_prevent_audit_tampering
BEFORE UPDATE OR DELETE ON public.audit_logs
FOR EACH STATEMENT EXECUTE FUNCTION public.prevent_audit_logs_tampering();

COMMIT;
