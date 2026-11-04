-- ==============================================================================
-- ESPORT SUMBAR V2 - Database Migration 0008 (DESTRUKTIF - PERSETUJUAN WAJIB)
-- Pembersihan Kolom Usang: metadata_jsonb pada tabel profiles
-- JALANKAN HANYA SETELAH MIGRASI 0006 & 0007 TELAH DIVERIFIKASI DI STAGING!
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- PRE-FLIGHT CHECK: Pastikan tidak ada data yang tertinggal sebelum drop
-- ------------------------------------------------------------------------------
DO $$
DECLARE
    v_unmigrated_count INT;
BEGIN
    SELECT count(*) INTO v_unmigrated_count
    FROM public.profiles
    WHERE (attributes IS NULL OR attributes = '{}'::jsonb)
      AND metadata_jsonb IS NOT NULL 
      AND metadata_jsonb <> '{}'::jsonb;

    IF v_unmigrated_count > 0 THEN
        RAISE EXCEPTION 'BATAL DROP: Ditemukan % profil dengan metadata_jsonb yang belum tersalin ke attributes!', v_unmigrated_count;
    END IF;
END $$;

-- ------------------------------------------------------------------------------
-- EKSEKUSI DESTRUKTIF: DROP KOLOM METADATA_JSONB
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles 
DROP COLUMN IF EXISTS metadata_jsonb;

-- ------------------------------------------------------------------------------
-- RENCANA ROLLBACK (JIKA DIBUTUHKAN PEMULIHAN DARURAT):
-- ALTER TABLE public.profiles ADD COLUMN metadata_jsonb JSONB NOT NULL DEFAULT '{}'::jsonb;
-- UPDATE public.profiles SET metadata_jsonb = attributes;
-- ------------------------------------------------------------------------------
