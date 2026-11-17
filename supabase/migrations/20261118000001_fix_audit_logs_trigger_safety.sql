-- ==============================================================================
-- ESPORT SUMBAR V3 - HOTFIX BUG-01: PERBAIKAN TRIGGER AUDIT LOG TAMPERING
-- Mengubah trigger pencegah manipulasi audit_logs menjadi FOR EACH ROW
-- Mempertahankan sifat append-only sekaligus mengizinkan cascade ON DELETE SET NULL
-- saat penutupan / penghapusan akun pengguna tanpa error.
-- ==============================================================================

BEGIN;

CREATE OR REPLACE FUNCTION public.prevent_audit_logs_tampering()
RETURNS TRIGGER AS $$
BEGIN
    -- Tolak mutlak setiap upaya DELETE pada baris log audit
    IF TG_OP = 'DELETE' THEN
        RAISE EXCEPTION 'Audit Log bersifat append-only dan tidak dapat dihapus.';
    END IF;

    -- Tolak modifikasi isi log audit (kecuali mutasi referensial actor_account_id oleh cascade database)
    IF TG_OP = 'UPDATE' THEN
        IF (NEW.id IS DISTINCT FROM OLD.id OR
            NEW.occurred_at IS DISTINCT FROM OLD.occurred_at OR
            NEW.action IS DISTINCT FROM OLD.action OR
            NEW.target_type IS DISTINCT FROM OLD.target_type OR
            NEW.target_id IS DISTINCT FROM OLD.target_id OR
            NEW.metadata_jsonb IS DISTINCT FROM OLD.metadata_jsonb) THEN
            RAISE EXCEPTION 'Audit Log bersifat append-only dan isinya tidak dapat dimanipulasi.';
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prevent_audit_tampering ON public.audit_logs;

CREATE TRIGGER trg_prevent_audit_tampering
BEFORE UPDATE OR DELETE ON public.audit_logs
FOR EACH ROW EXECUTE FUNCTION public.prevent_audit_logs_tampering();

COMMIT;
