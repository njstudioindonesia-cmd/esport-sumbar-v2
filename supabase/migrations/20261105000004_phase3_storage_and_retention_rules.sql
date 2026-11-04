-- ==============================================================================
-- ESPORT SUMBAR V2 - Database Migration 0009 (Fase 3.4)
-- Fungsi Manajemen Retensi Penyimpanan & Pembersihan Antrean Otomatis
-- Menghemat kuota database & storage Supabase sesuai SPEC 2.6
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. FUNGSI PEMBERSIHAN ANTREAN NOTIFIKASI KEDALUWARSA (> 30 HARI)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.purge_stale_notifications(p_days_old INT DEFAULT 30)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_deleted_count INT;
BEGIN
    DELETE FROM public.notifications_queue
    WHERE status IN ('sent', 'failed')
      AND created_at < NOW() - (p_days_old || ' days')::INTERVAL;
      
    GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
    RETURN v_deleted_count;
END;
$$;

-- ------------------------------------------------------------------------------
-- 2. FUNGSI AUDIT RINGKAS PENYIMPANAN STORAGE SUPABASE (READ-ONLY)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_storage_summary()
RETURNS TABLE (
    bucket_id TEXT,
    total_files BIGINT,
    total_size_bytes BIGINT,
    total_size_pretty TEXT
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = storage, pg_temp
AS $$
    SELECT 
        s.bucket_id::TEXT,
        count(*)::BIGINT AS total_files,
        COALESCE(sum((s.metadata->>'size')::BIGINT), 0)::BIGINT AS total_size_bytes,
        pg_size_pretty(COALESCE(sum((s.metadata->>'size')::BIGINT), 0)) AS total_size_pretty
    FROM storage.objects s
    GROUP BY s.bucket_id
    ORDER BY total_size_bytes DESC;
$$;

-- ------------------------------------------------------------------------------
-- 3. FUNGSI DETEKSI BERKAS BUKTI VERIFIKASI MELEWATI BATAS RETENSI (90 HARI)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_expired_evidence_records(p_retention_days INT DEFAULT 90)
RETURNS TABLE (
    request_id UUID,
    profile_id UUID,
    status VARCHAR,
    decided_at TIMESTAMPTZ,
    evidence_files JSONB
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
    SELECT 
        id AS request_id,
        profile_id,
        status,
        decided_at,
        evidence_files
    FROM public.verification_requests
    WHERE status IN ('verified', 'rejected')
      AND decided_at IS NOT NULL
      AND decided_at < NOW() - (p_retention_days || ' days')::INTERVAL;
$$;
