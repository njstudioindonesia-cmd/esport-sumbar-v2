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
