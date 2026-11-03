-- ==============================================================================
-- ESPORT SUMBAR V2 - Database Migration 0004: Security Hardening & Status Tamper Triggers
-- Memperbaiki celah Finding 4: Mencegah update langsung verification_status oleh pemilik akun
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. TRIGGER PENCEGAH PEMALSUAN STATUS VERIFIKASI (ANTI-TAMPERING)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.protect_profile_verification_columns()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_caller_role VARCHAR(30);
BEGIN
    -- Periksa apakah kolom-kolom wewenang resmi mengalami perubahan
    IF (OLD.verification_status IS DISTINCT FROM NEW.verification_status)
       OR (OLD.verified_badge_no IS DISTINCT FROM NEW.verified_badge_no)
       OR (OLD.verified_at IS DISTINCT FROM NEW.verified_at)
       OR (OLD.verification_expires_at IS DISTINCT FROM NEW.verification_expires_at)
    THEN
        -- Ambil peran akun pemanggil
        SELECT role INTO v_caller_role
        FROM public.accounts
        WHERE id = auth.uid();

        -- Izinkan hanya jika pemanggilan berasal dari service_role, migrasi, atau peran berwenang
        -- Catatan: Fungsi transition_verification() berjalan sebagai SECURITY DEFINER
        -- sehingga pemanggilan dari klien reguler yang memodifikasi langsung tabel ini akan ditolak
        IF current_user <> 'postgres' AND current_user <> 'service_role' AND (v_caller_role IS NULL OR v_caller_role = 'user') THEN
            RAISE EXCEPTION 'Pelanggaran keamanan: Kolom status verifikasi, lencana resmi, dan masa berlaku hanya dapat diperbarui melalui fungsi resmi transition_verification().';
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_profile_verification ON public.profiles;

CREATE TRIGGER trg_protect_profile_verification
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.protect_profile_verification_columns();

-- ------------------------------------------------------------------------------
-- 2. TRIGGER PENCEGAH ESKALASI PERAN MANDIRI DI TABEL ACCOUNTS
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.protect_account_role_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_caller_role VARCHAR(30);
BEGIN
    IF (OLD.role IS DISTINCT FROM NEW.role) THEN
        SELECT role INTO v_caller_role
        FROM public.accounts
        WHERE id = auth.uid();

        IF current_user <> 'postgres' AND current_user <> 'service_role' AND v_caller_role <> 'platform_operator' THEN
            RAISE EXCEPTION 'Pelanggaran keamanan: Pengguna tidak memiliki wewenang untuk mengubah peran akun (role).';
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_account_role ON public.accounts;

CREATE TRIGGER trg_protect_account_role
BEFORE UPDATE ON public.accounts
FOR EACH ROW
EXECUTE FUNCTION public.protect_account_role_escalation();

-- ------------------------------------------------------------------------------
-- 3. POLICY INSERT MANDIRI AKUN & TRIGGER AUTO-PROVISION DARI AUTH.USERS
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can insert their own account" ON public.accounts;

CREATE POLICY "Users can insert their own account"
ON public.accounts FOR INSERT
WITH CHECK (
    id = auth.uid()
    AND role = 'user'
);

-- Trigger auto-sync saat user mendaftar via Supabase Auth (Email / OAuth)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    INSERT INTO public.accounts (id, email, role, is_active)
    VALUES (NEW.id, NEW.email, 'user', true)
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------------------------------------------
-- 4. SETUP STORAGE BUCKET & POLICIES (VERIFICATION PROOFS)
-- ------------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'verification-proofs',
    'verification-proofs',
    false,
    5242880,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']::text[]
)
ON CONFLICT (id) DO UPDATE SET
    public = false,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']::text[];

DROP POLICY IF EXISTS "Authenticated users can upload verification proofs" ON storage.objects;
CREATE POLICY "Authenticated users can upload verification proofs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'verification-proofs');

DROP POLICY IF EXISTS "Authenticated users can view verification proofs" ON storage.objects;
CREATE POLICY "Authenticated users can view verification proofs"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'verification-proofs');
