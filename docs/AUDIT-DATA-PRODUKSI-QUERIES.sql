-- ==============================================================================
-- ESPORT SUMBAR V3: KUERI AUDIT DATA PRODUKSI (READ-ONLY)
-- Memenuhi Spesifikasi Sub-langkah 3.2 & Keputusan P1-P14
-- Sifat: 100% AMAN & READ-ONLY (Tidak melakukan perubahan atau penghapusan)
-- Jalankan kueri ini di Supabase SQL Editor Produksi untuk mengaudit integritas data
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. AUDIT ISTILAH & KLAIM TERLARANG PADA TABEL KONTEN & PENGATURAN
-- Memeriksa kemunculan kata: PBESI, ESI, Pengprov, Pengcab, KONI, Dispora, resmi, sah, kepatuhan UU PDP
-- ------------------------------------------------------------------------------

-- 1.1 Pada Tabel Artikel (Warta / Berita)
SELECT 
    id,
    title,
    slug,
    category,
    status,
    created_at,
    CASE 
        WHEN title ILIKE '%pbesi%' OR content ILIKE '%pbesi%' THEN 'Memuat PBESI'
        WHEN title ILIKE '%pengprov%' OR content ILIKE '%pengprov%' THEN 'Memuat Pengprov'
        WHEN title ILIKE '%pengcab%' OR content ILIKE '%pengcab%' THEN 'Memuat Pengcab'
        WHEN title ILIKE '%koni%' OR content ILIKE '%koni%' THEN 'Memuat KONI'
        WHEN title ILIKE '%dispora%' OR content ILIKE '%dispora%' THEN 'Memuat Dispora'
        WHEN title ~* '\y(resmi|sah)\y' OR content ~* '\y(resmi|sah)\y' THEN 'Memuat Klaim Resmi/Sah'
        ELSE 'Bersih'
    END AS temuan_istilah
FROM public.articles
WHERE 
    title ~* '(pbesi|pengprov|pengcab|koni|dispora|\yresmi\y|\ysah\y)'
    OR content ~* '(pbesi|pengprov|pengcab|koni|dispora|\yresmi\y|\ysah\y)';

-- 1.2 Pada Nama Tampilan Profil Publik
SELECT 
    id,
    account_id,
    esport_id,
    display_name,
    ign,
    entity_type
FROM public.profiles
WHERE 
    display_name ~* '(pbesi|pengprov|pengcab|koni|dispora|\yresmi\y|\ysah\y)'
    OR bio ~* '(pbesi|pengprov|pengcab|koni|dispora|\yresmi\y|\ysah\y)';

-- ------------------------------------------------------------------------------
-- 2. AUDIT STATUS VERIFIKASI WARISAN (LEGACY VERIFICATION STATUS)
-- Menghitung sebaran status verifikasi profil
-- Sesuai V3: Hanya boleh unverified, submitted, under_review, revision_requested, verified, rejected, suspended, expired
-- ------------------------------------------------------------------------------
SELECT 
    verification_status,
    count(*) AS total_profil,
    CASE 
        WHEN verification_status IN ('unverified', 'submitted', 'under_review', 'revision_requested', 'verified', 'rejected', 'suspended', 'expired') 
            THEN 'Valid V3'
        ELSE 'STATUS WARISAN HARUS DIKONVERSI (Misal: draft, regional_checked, prov_verified)'
    END AS status_kategori
FROM public.profiles
GROUP BY verification_status
ORDER BY total_profil DESC;

-- ------------------------------------------------------------------------------
-- 3. AUDIT BARIS DEMO / DATA UJI (is_demo = TRUE)
-- Memeriksa akun dan profil yang bertanda data demo
-- ------------------------------------------------------------------------------
SELECT 
    'accounts' AS nama_tabel,
    count(*) AS total_baris,
    count(*) FILTER (WHERE is_demo = TRUE) AS total_baris_demo,
    count(*) FILTER (WHERE is_demo = FALSE OR is_demo IS NULL) AS total_baris_riil
FROM public.accounts
UNION ALL
SELECT 
    'profiles' AS nama_tabel,
    count(*) AS total_baris,
    count(*) FILTER (WHERE is_demo = TRUE) AS total_baris_demo,
    count(*) FILTER (WHERE is_demo = FALSE OR is_demo IS NULL) AS total_baris_riil
FROM public.profiles;

-- Rincian akun demo aktif (jika ada):
SELECT id, email, role, is_demo, created_at
FROM public.accounts
WHERE is_demo = TRUE
ORDER BY created_at DESC;

-- ------------------------------------------------------------------------------
-- 4. AUDIT AKUN DENGAN PERAN WARISAN (LEGACY ROLES)
-- Sesuai V3: Hanya ada 2 peran sah: 'user' dan 'platform_admin'
-- ------------------------------------------------------------------------------
SELECT 
    role,
    count(*) AS total_akun,
    CASE 
        WHEN role IN ('user', 'platform_admin') THEN 'Valid V3'
        ELSE 'PERAN WARISAN HARUS DIKONVERSI KE user (Misal: region_admin, prov_admin, platform_operator)'
    END AS validasi_peran
FROM public.accounts
GROUP BY role;

-- Daftar akun yang saat ini memegang wewenang platform_admin:
SELECT id, email, role, is_active, created_at
FROM public.accounts
WHERE role = 'platform_admin';

-- ------------------------------------------------------------------------------
-- 5. AUDIT INTEGRITAS SATU AKUN SATU PROFIL (ATURAN KETAT V3)
-- Memastikan tidak ada 1 akun yang memiliki lebih dari 1 profil aktif
-- HASIL WAJIB: 0 baris
-- ------------------------------------------------------------------------------
SELECT 
    account_id,
    count(*) AS total_profil_aktif
FROM public.profiles
GROUP BY account_id
HAVING count(*) > 1;

-- ------------------------------------------------------------------------------
-- 6. AUDIT PEMISAHAN PERAN ADMIN (ADMIN TIDAK BOLEH MEMILIKI PROFIL BIDANG)
-- HASIL WAJIB: 0 baris
-- ------------------------------------------------------------------------------
SELECT 
    a.id AS admin_account_id,
    a.email,
    p.id AS profile_id,
    p.esport_id,
    p.entity_type
FROM public.accounts a
JOIN public.profiles p ON p.account_id = a.id
WHERE a.role = 'platform_admin';

-- ------------------------------------------------------------------------------
-- 7. AUDIT BERKAS STORAGE (AVATARS, GALLERY, EVIDENCE)
-- ------------------------------------------------------------------------------
-- Memeriksa jumlah berkas yang tercatat di tabel media_assets dan verification_requests
SELECT 
    'media_assets' AS sumber,
    count(*) AS total_berkas
FROM public.media_assets
UNION ALL
SELECT 
    'verification_requests' AS sumber,
    count(*) AS total_pengajuan
FROM public.verification_requests;

-- ------------------------------------------------------------------------------
-- 8. PANDUAN PEMBERSIHAN DATA (CLEANUP PLAN) UNTUK DISETUJUI PEMILIK
-- JIKA DITEMUKAN ANOMALI, BERIKUT TEMPLAT TINDAKAN YANG MEMERLUKAN PERSETUJUAN:
-- 
-- A. Konversi Peran Warisan:
--    UPDATE public.accounts SET role = 'user' WHERE role NOT IN ('user', 'platform_admin');
-- 
-- B. Pembersihan Akun Demo Pasca-Staging:
--    DELETE FROM public.accounts WHERE is_demo = TRUE;
-- 
-- C. Pembuatan Akun Administrator Produksi Aman (Tanpa Promosi Mandiri):
--    UPDATE public.accounts SET role = 'platform_admin' WHERE email = 'EMAIL_ADMIN_TERPILIH@DOMAIN.COM';
-- ==============================================================================
