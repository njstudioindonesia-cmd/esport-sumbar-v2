-- ==============================================================================
-- ESPORT SUMBAR V3 - AUDIT KONTEN BASIS DATA LIVE (READ-ONLY)
-- Skrip Verifikasi Mandat S1 & Bagian 2: 100% Bebas ESI & Klaim Terlarang
-- Tanggal: 7 November 2026
-- Mode: READ-ONLY (Tanpa mutasi data / Zero write)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. DAFTAR POLA ISTILAH DAN KLAIM TERLARANG
-- ------------------------------------------------------------------------------
-- Regex pattern:
-- - ESI / Pengprov / Pengcab / PBESI / KONI / Dispora
-- - resmi / official
-- - sah hukum / pengesahan
-- - terakreditasi / akreditasi
-- - kepatuhan uu pdp / patuh 100% / berdaulat
-- - rating A+ / Excellent
-- ------------------------------------------------------------------------------

WITH banned_terms AS (
  SELECT '(?i)\b(esi|pengprov|pengcab|pbesi|koni|dispora|resmi|official|sah hukum|pengesahan|akreditasi|terakreditasi|kepatuhan uu pdp|patuh 100%|berdaulat)\b' AS pattern
),

-- ------------------------------------------------------------------------------
-- 2. AUDIT TABEL PROFILES
-- ------------------------------------------------------------------------------
profile_audit AS (
  SELECT
    'profiles' AS table_name,
    id::text AS record_id,
    display_name AS record_identifier,
    'display_name / bio / ign' AS matched_column,
    concat_ws(' | ', display_name, bio, ign) AS matched_snippet
  FROM profiles, banned_terms
  WHERE
    display_name ~* banned_terms.pattern
    OR coalesce(bio, '') ~* banned_terms.pattern
    OR coalesce(ign, '') ~* banned_terms.pattern
),

-- ------------------------------------------------------------------------------
-- 3. AUDIT TABEL TEAMS
-- ------------------------------------------------------------------------------
team_audit AS (
  SELECT
    'teams' AS table_name,
    id::text AS record_id,
    name AS record_identifier,
    'name / short_name / description' AS matched_column,
    concat_ws(' | ', name, short_name, description) AS matched_snippet
  FROM teams, banned_terms
  WHERE
    name ~* banned_terms.pattern
    OR coalesce(short_name, '') ~* banned_terms.pattern
    OR coalesce(description, '') ~* banned_terms.pattern
),

-- ------------------------------------------------------------------------------
-- 4. AUDIT TABEL TOURNAMENTS
-- ------------------------------------------------------------------------------
tournament_audit AS (
  SELECT
    'tournaments' AS table_name,
    id::text AS record_id,
    title AS record_identifier,
    'title / description / rules_summary' AS matched_column,
    concat_ws(' | ', title, description, rules_summary) AS matched_snippet
  FROM tournaments, banned_terms
  WHERE
    title ~* banned_terms.pattern
    OR coalesce(description, '') ~* banned_terms.pattern
    OR coalesce(rules_summary, '') ~* banned_terms.pattern
),

-- ------------------------------------------------------------------------------
-- 5. AUDIT TABEL NEWS (KONTEN ARTIKEL & WARTA)
-- ------------------------------------------------------------------------------
news_audit AS (
  SELECT
    'news' AS table_name,
    id::text AS record_id,
    title AS record_identifier,
    'title / summary / content' AS matched_column,
    concat_ws(' | ', title, summary, substr(content, 1, 120)) AS matched_snippet
  FROM news, banned_terms
  WHERE
    title ~* banned_terms.pattern
    OR coalesce(summary, '') ~* banned_terms.pattern
    OR coalesce(content, '') ~* banned_terms.pattern
),

-- ------------------------------------------------------------------------------
-- 6. AUDIT TABEL VERIFICATION_REQUESTS
-- ------------------------------------------------------------------------------
verification_audit AS (
  SELECT
    'verification_requests' AS table_name,
    id::text AS record_id,
    profile_id::text AS record_identifier,
    'notes / reviewer_notes' AS matched_column,
    concat_ws(' | ', notes, reviewer_notes) AS matched_snippet
  FROM verification_requests, banned_terms
  WHERE
    coalesce(notes, '') ~* banned_terms.pattern
    OR coalesce(reviewer_notes, '') ~* banned_terms.pattern
),

-- ------------------------------------------------------------------------------
-- 7. AUDIT TABEL AUDIT_LOGS (KECUALI LOG HISTORIS DARI REKAYASA/PEMBERSIHAN)
-- ------------------------------------------------------------------------------
audit_logs_audit AS (
  SELECT
    'audit_logs' AS table_name,
    id::text AS record_id,
    action AS record_identifier,
    'details_json' AS matched_column,
    substr(details::text, 1, 120) AS matched_snippet
  FROM audit_logs, banned_terms
  WHERE
    action NOT IN ('PURGE_ESI_TERMS', 'MIGRATION_V3_CLEANUP')
    AND details::text ~* banned_terms.pattern
),

-- ------------------------------------------------------------------------------
-- 8. GABUNGAN TEMUAN AUDIT
-- ------------------------------------------------------------------------------
all_findings AS (
  SELECT * FROM profile_audit
  UNION ALL
  SELECT * FROM team_audit
  UNION ALL
  SELECT * FROM tournament_audit
  UNION ALL
  SELECT * FROM news_audit
  UNION ALL
  SELECT * FROM verification_audit
  UNION ALL
  SELECT * FROM audit_logs_audit
)

-- ------------------------------------------------------------------------------
-- 9. LAPORAN TEMUAN
-- ------------------------------------------------------------------------------
SELECT
  table_name,
  record_id,
  record_identifier,
  matched_column,
  matched_snippet
FROM all_findings
ORDER BY table_name, record_id;

-- ------------------------------------------------------------------------------
-- 10. RINGKASAN SKOR KELULUSAN (PASS / FAIL)
-- ------------------------------------------------------------------------------
-- Jalankan kueri berikut untuk melihat rekapitulasi cepat:
/*
SELECT
  count(*) AS total_temuan,
  CASE
    WHEN count(*) = 0 THEN 'LULUS (100% BEBAS ESI & KLAIM TERLARANG)'
    ELSE 'GAGAL - TEMUAN PERLU DIBERSIHKAN'
  END AS status_kelulusan
FROM (
  -- [Query di atas]
) q;
*/
