# Panduan Lengkap Migrasi Basis Data V3 (MIGRASI-V3.md)

Dokumen ini adalah panduan teknis operasional untuk mengeksekusi migrasi basis data **ESPORT SUMBAR V3** menggunakan pola **EXPAND → MIGRATE → CONTRACT**.

---

## 1. Urutan Eksekusi Migrasi

Jalankan berkas migrasi berikut secara berurutan di Supabase SQL Editor lingkungan **STAGING** terlebih dahulu sebelum ke **PRODUKSI**:

| Urutan | Berkas Migrasi | Tahap | Deskripsi & Tujuan | Sifat |
|---|---|---|---|---|
| **1** | `20261107000001_v3_expand_schema.sql` | EXPAND | Tambah enum peran (`platform_admin`), status V3, tabel `game_roles`, `game_ranks`, `relation_rules`, `profiles_archived`, `outbox_events`, dan view `audit_logs_view`. | Aditif (Aman) |
| **2** | `20261107000002_v3_seed_games_and_rules.sql` | EXPAND | Seed master game resmi V3 (termasuk **Honor of Kings**), role game resmi, dan matriks aturan relasi ekosistem. | Aditif (Aman) |
| **3** | `20261107000003_v3_migrate_data.sql` | MIGRATE | Konversi peran admin lama ke `user`, konversi status verifikasi ke status V3, dan arsipkan profil sekunder akun multi-profil ke `profiles_archived`. | Transformasi Data |
| **4** | `20261107000004_v3_enforce_rpc_and_constraints.sql` | MIGRATE | Pasang konstrain `UNIQUE(account_id)`, trigger pencegah ganti entitas, RPC baru `transition_verification`, dan fungsi ekosistem `request_relation` / `respond_relation`. | Penegakan Aturan |
| **5** | `20261107000005_v3_rls_policies.sql` | MIGRATE | Pasang kebijakan RLS baru untuk `user` dan `platform_admin`. Hapus ketergantungan wilayah. Kunci proteksi append-only `audit_logs`. | Otorisasi Keamanan |
| **6** | `20261115000001_v3_contract_cleanup_DESTRUCTIVE.sql` | **CONTRACT** | **JANGAN DIJALANKAN DI BAGIAN 3.** Berkas ini disiapkan khusus untuk Bagian 8 setelah seluruh aplikasi V3 stabil dan disetujui. | **DESTRUKTIF** |

---

## 2. Kueri Verifikasi Sebelum & Sesudah Migrasi (Pre & Post Verification)

Jalankan kueri berikut di SQL Editor untuk memvalidasi keberhasilan setiap langkah:

### 2.1 Verifikasi Sebaran Peran Akun (Keputusan D1)
```sql
-- Sebelum: Memuat 'region_admin', 'prov_admin', 'platform_operator'
-- Sesudah: Hanya memuat 'user' dan 'platform_admin'
SELECT role, count(*) AS total_accounts
FROM public.accounts
GROUP BY role;
```

### 2.2 Verifikasi Status Verifikasi Profil (Keputusan D3)
```sql
-- Sebelum: Memuat 'draft', 'regional_checked', 'prov_verified', dll.
-- Sesudah: Hanya memuat status V3 ('unverified', 'under_review', 'verified', dll.)
SELECT verification_status, count(*) AS total_profiles
FROM public.profiles
GROUP BY verification_status;
```

### 2.3 Verifikasi Konstrain Satu Akun Satu Profil (Keputusan D2)
```sql
-- Hasil wajib: 0 baris (tidak ada lagi akun dengan > 1 profil aktif)
SELECT account_id, count(*) AS total_profiles
FROM public.profiles
GROUP BY account_id
HAVING count(*) > 1;

-- Periksa profil yang berhasil diarsipkan
SELECT count(*) AS total_archived_profiles
FROM public.profiles_archived;
```

### 2.4 Verifikasi Katalog Game & Roles (Mandat M7)
```sql
-- Verifikasi game Honor of Kings dan game lainnya terdaftar aktif
SELECT id, name, genre, platform, is_active
FROM public.games
ORDER BY name;

-- Verifikasi peran dinamis game HOK
SELECT r.role_name, r.description, r.sort_order
FROM public.game_roles r
WHERE r.game_id = 'game-hok'
ORDER BY r.sort_order;
```

### 2.5 Verifikasi Aturan Ekosistem (Mandat M5)
```sql
SELECT source_entity_type, target_entity_type, relation_type, max_active_limit, game_match_required
FROM public.relation_rules
WHERE is_active = TRUE
ORDER BY source_entity_type, target_entity_type;
```

---

## 3. Analisis Risiko & Rencana Rollback

### Risiko 1: Kegagalan saat Penegakan `UNIQUE(account_id)`
- **Penyebab:** Masih ada akun dengan multi-profil yang belum terarsip.
- **Mitigasi:** Migrasi 0012 menggunakan loop dinamis dengan cursor `FOR UPDATE` untuk memindahkan seluruh profil sekunder sebelum konstrain dipasang pada Migrasi 0013.
- **Rollback:**
  ```sql
  ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_account_id_unique;
  ```

### Risiko 2: Gangguan Akses Admin Saat Peran Berubah
- **Penyebab:** Akun pengelola belum ditandai sebagai `platform_admin`.
- **Mitigasi:** Migrasi 0012 mengonversi seluruh akun `platform_operator` otomatis menjadi `platform_admin`. Jika ada akun spesifik yang perlu diangkat:
  ```sql
  UPDATE public.accounts SET role = 'platform_admin' WHERE email = 'admin@esportsumbar.id';
  ```

### Risiko 3: Rollback Menyeluruh (Full Disaster Recovery)
Jika terjadi kegagalan fatal pada lingkungan staging:
1. Jalankan pemulihan basis data dari snapshot backup yang dibuat sebelum Bagian 3.
2. Atau jalankan skrip pembatalan aditif:
   ```sql
   DROP VIEW IF EXISTS public.audit_logs_view;
   DROP TABLE IF EXISTS public.outbox_events CASCADE;
   DROP TABLE IF EXISTS public.profiles_archived CASCADE;
   DROP TABLE IF EXISTS public.relation_rules CASCADE;
   DROP TABLE IF EXISTS public.game_ranks CASCADE;
   DROP TABLE IF EXISTS public.game_roles CASCADE;
   ```
