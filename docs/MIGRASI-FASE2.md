# PANDUAN EKSEKUSI MIGRASI DATABASE - FASE 2
**Sistem**: ESPORT SUMBAR V2  
**Target Lingkungan**: Supabase Staging ➔ Supabase Produksi  
**Prinsip Keamanan**: Cadangkan database sebelum eksekusi (`pg_dump` atau Supabase Dashboard ➔ Database ➔ Backups).

---

## 1. Urutan Menjalankan Migrasi

Jalankan file SQL berikut secara berurutan di **Supabase Dashboard ➔ SQL Editor**:

### Langkah 1: Migrasi Skema Data Privat, Persetujuan & Laporan
- **File**: `supabase/migrations/20261105000001_phase2_private_data_and_consents.sql`
- **Tujuan**:
  1. Membuat tabel `public.profile_private` (1:1 dengan `profiles`) dengan RLS isolasi penuh.
  2. Membuat tabel `public.consents` untuk mencatat audit persetujuan ToS & Privacy Policy per versi.
  3. Membuat tabel `public.reports` untuk antrean laporan pelanggaran data / moderasi.
  4. Menambahkan indeks B-Tree pada foreign keys antrean verifikasi dan review.
- **Risiko**: Rendah (hanya menambahkan tabel & indeks baru; tidak mengubah tabel eksisting).

### Langkah 2: Migrasi Data Kontak & Sanitasi View Publik
- **File**: `supabase/migrations/20261105000002_phase2_sanitize_public_view_and_migration.sql`
- **Tujuan**:
  1. Menyalin kontak/data pribadi dari `profiles.attributes` ke `profile_private`.
  2. Membersihkan kunci kontak sensitif dari `profiles.attributes`.
  3. Memperbarui view `public_profiles` agar **100% bebas dari data kontak privat** (Kepatuhan UU PDP).
- **Risiko**: Sedang (melakukan pemindahan data internal JSONB).

### Langkah 3: Pembersihan Kolom Usang (DESTRUKTIF - OPSIONAL SETELAH UJI COBA)
- **File**: `supabase/migrations/20261105000003_DESTRUCTIVE_cleanup_obsolete_columns.sql`
- **Tujuan**: Menghapus kolom ganda `metadata_jsonb` pada `public.profiles`.
- **PERINGATAN**: Jalankan langkah ini **HANYA** setelah Langkah 1 & 2 telah diuji dan terverifikasi di staging.

---

## 2. Kueri Verifikasi Sebelum & Sesudah

Jalankan kueri ini di SQL Editor untuk memastikan integritas data setelah migrasi:

```sql
-- 1. Verifikasi jumlah baris profile_private vs profiles
SELECT 
    (SELECT count(*) FROM public.profiles) AS total_profiles,
    (SELECT count(*) FROM public.profile_private) AS total_profile_private;

-- 2. Pastikan tabel consents dan reports aktif
SELECT count(*) AS total_consents FROM public.consents;
SELECT count(*) AS total_reports FROM public.reports;

-- 3. Pastikan view public_profiles tidak mengekspos kontak privat
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'public_profiles' 
  AND column_name IN ('whatsapp_e164', 'contact_email', 'address_street', 'guardian_whatsapp');
-- Ekspektasi: 0 baris

-- 4. Uji RLS profile_private (Anon dilarang membaca)
SET LOCAL ROLE anon;
SELECT count(*) FROM public.profile_private;
-- Ekspektasi: 0 baris
```

---

## 3. Rencana Rollback (Jika Terjadi Kendala)

Jika migrasi perlu dibatalkan kembali ke kondisi sebelumnya:

```sql
-- Rollback Langkah 2 (Kembalikan view lama jika diperlukan):
-- View lama dapat dibuat kembali dari migration 0005.

-- Rollback Langkah 1:
DROP TABLE IF EXISTS public.reports CASCADE;
DROP TABLE IF EXISTS public.consents CASCADE;
DROP TABLE IF EXISTS public.profile_private CASCADE;
```
