-- ==============================================================================
-- ESPORT SUMBAR V3 - Database Migration 0016: Storage & Database Optimization
-- Tujuan: Mengoptimalkan penyimpanan Supabase Storage & Database PostgreSQL
--         untuk skala ribuan pendaftar atlet/entitas baru.
-- Sifat: 100% Idempoten & Aman
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. INDEKS EFISIEN ANTREAN NOTIFIKASI
-- ------------------------------------------------------------------------------
-- Mempercepat kueri antrean status 'pending' dan pembersihan baris kedaluwarsa
CREATE INDEX IF NOT EXISTS idx_notifications_queue_status 
ON public.notifications_queue(status, created_at);

-- ------------------------------------------------------------------------------
-- 2. FUNGSI PEMBERSIHAN EVENT OUTBOX SELESAI (> 7 HARI)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.purge_processed_outbox_events(p_days_old INT DEFAULT 7)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_deleted_count INT;
BEGIN
    DELETE FROM public.outbox_events
    WHERE status = 'processed'
      AND created_at < NOW() - (p_days_old || ' days')::INTERVAL;
      
    GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
    RETURN v_deleted_count;
END;
$$;

-- ------------------------------------------------------------------------------
-- 3. FUNGSI PEMBERSIHAN ANTREAN NOTIFIKASI LAMA (> 30 HARI)
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
-- 4. FUNGSI PEMBERSIHAN DOKUMEN BUKTI VERIFIKASI KEDALUWARSA (> 90 HARI - UU PDP)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.purge_expired_evidence_records(p_retention_days INT DEFAULT 90)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_updated_count INT;
BEGIN
    UPDATE public.verification_requests
    SET evidence_files = jsonb_build_array(jsonb_build_object(
        'purged', true,
        'purgedAt', NOW()
    ))
    WHERE status IN ('verified', 'rejected')
      AND decided_at IS NOT NULL
      AND decided_at < NOW() - (p_retention_days || ' days')::INTERVAL
      AND (evidence_files->0->>'purged') IS DISTINCT FROM 'true';
      
    GET DIAGNOSTICS v_updated_count = ROW_COUNT;
    RETURN v_updated_count;
END;
$$;

-- ------------------------------------------------------------------------------
-- 5. PROSEDUR TUNGGAL PEMELIHARAAN PENYIMPANAN SUPABASE (RUN_STORAGE_MAINTENANCE)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.run_storage_maintenance(
    p_outbox_days INT DEFAULT 7,
    p_notif_days INT DEFAULT 30,
    p_evidence_days INT DEFAULT 90
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_purged_outbox INT;
    v_purged_notif INT;
    v_purged_evidence INT;
BEGIN
    v_purged_outbox := public.purge_processed_outbox_events(p_outbox_days);
    v_purged_notif := public.purge_stale_notifications(p_notif_days);
    v_purged_evidence := public.purge_expired_evidence_records(p_evidence_days);

    RETURN jsonb_build_object(
        'status', 'success',
        'executedAt', NOW(),
        'purgedOutboxEvents', v_purged_outbox,
        'purgedNotifications', v_purged_notif,
        'purgedEvidenceRecords', v_purged_evidence
    );
END;
$$;
