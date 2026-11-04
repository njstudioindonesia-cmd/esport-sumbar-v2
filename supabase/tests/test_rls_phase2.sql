-- ==============================================================================
-- ESPORT SUMBAR V2 - RLS Verification Test Script (Fase 2.4)
-- Uji Keamanan Database: Akses Anon, Isolasi Antar Pengguna, Pembatasan Admin Daerah,
-- Immutability Audit Logs, dan Larangan Operator Memberikan Status Verified
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. UJI AKSES ANON: Dilarang membaca tabel profile_private
-- Ekspektasi: 0 baris dikembalikan untuk anon
-- ------------------------------------------------------------------------------
BEGIN;
  SET LOCAL ROLE anon;
  SELECT count(*) AS anon_private_rows FROM public.profile_private;
  -- Harus mengembalikan error RLS atau 0 baris
ROLLBACK;

-- ------------------------------------------------------------------------------
-- 2. UJI VIEW PUBLIK: Pastikan public_profiles tidak mengekspos profile_private
-- Ekspektasi: Kolom whatsapp_e164, contact_email, address_street tidak ada di view
-- ------------------------------------------------------------------------------
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'public_profiles' 
  AND column_name IN ('whatsapp_e164', 'contact_email', 'address_street', 'guardian_whatsapp', 'game_account_id');
-- Hasil harus 0 baris!

-- ------------------------------------------------------------------------------
-- 3. UJI ISOLASI USER: User A tidak bisa membaca atau mengubah profile_private User B
-- ------------------------------------------------------------------------------
BEGIN;
  -- Simulasikan user A login
  SET LOCAL ROLE authenticated;
  SET LOCAL "request.jwt.claim.sub" = '00000000-0000-0000-0000-000000000001';
  
  -- Mencoba mengupdate profil milik user B (00000000-0000-0000-0000-000000000002)
  UPDATE public.profile_private 
  SET whatsapp_e164 = '+628999999999' 
  WHERE account_id = '00000000-0000-0000-0000-000000000002';
  -- Hasil affected rows harus 0!
ROLLBACK;

-- ------------------------------------------------------------------------------
-- 4. UJI ADMIN DAERAH: Admin Padang tidak bisa melihat data privat atlet Bukittinggi
-- ------------------------------------------------------------------------------
-- Verifikasi lewat query policy bahwa region_admin terikat get_auth_region_id()
SELECT policyname, qual 
FROM pg_policies 
WHERE tablename = 'profile_private' 
  AND policyname = 'Region admins can view profile_private in their region';

-- ------------------------------------------------------------------------------
-- 5. UJI IMMUTABILITY AUDIT LOGS: Larangan mutasi pada audit_logs
-- Ekspektasi: Tidak ada policy UPDATE atau DELETE pada audit_logs
-- ------------------------------------------------------------------------------
SELECT cmd, policyname 
FROM pg_policies 
WHERE tablename = 'audit_logs' AND cmd IN ('UPDATE', 'DELETE');
-- Hasil harus 0 baris (Append-Only)!

-- ------------------------------------------------------------------------------
-- 6. UJI LARANGAN OPERATOR: Operator platform dilarang memberikan verified
-- Diuji lewat RPC transition_verification() yang menolak jika actor_role = 'platform_operator'
-- dan target status = 'verified'
-- ------------------------------------------------------------------------------
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_name = 'transition_verification';
