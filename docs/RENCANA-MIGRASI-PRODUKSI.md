# RENCANA MIGRASI BASIS DATA PRODUKSI V3 (RENCANA-MIGRASI-PRODUKSI.md)

> **Status Rencana**: Disiapkan untuk Eksekusi Produksi (Tahap Bagian 3)  
> **Prinsip Utama**: Pola **EXPAND → MIGRATE → CONTRACT**  
> **Aturan Khusus**: Migrasi **CONTRACT (Destruktif) DIPISAH** dan **DILARANG DIJALANKAN** dalam minimal 7 hari pertama pasca-peluncuran publik.  

---

## 1. Prasyarat & Pencadangan Basis Data (Pre-requisites & Backup)

Sebelum menjalankan berkas SQL apa pun pada basis data produksi:

1. **Pencadangan Penuh (Full Snapshot Backup)**:
   * Buat cadangan database penuh via Supabase Dashboard → **Project Settings** → **Database** → **Backups** → Klik **Backup Now**.
   * Catat ID/Timestamp snapshot pencadangan.
2. **Koneksi Terisolasi**:
   * Seluruh migrasi dieksekusi melalui **Supabase SQL Editor** dengan hak akses `postgres / service_role`.
3. **Uji Kering Staging (Staging Dry-Run)**:
   * Seluruh skrip 00001 s.d. 00005 telah berhasil diuji coba pada basis data Staging tanpa galat.

---

## 2. Urutan Eksekusi Migrasi Produksi V3

Migrasi dijalankan secara berurutan sesuai tabel di bawah ini:

| Urutan | Berkas Migrasi | Tahap | Deskripsi & Tujuan | Kategori | Eksekusi Saat Rilis |
|:---:|:---|:---:|:---|:---:|:---:|
| **1** | `20261107000001_v3_expand_schema.sql` | **EXPAND** | Tambah enum peran (`platform_admin`), enum status V3, tabel `game_roles`, `game_ranks`, `relation_rules`, `profiles_archived`, `outbox_events`, view `audit_logs_view`. | Aditif (Aman) | **YA** |
| **2** | `20261107000002_v3_seed_games_and_rules.sql` | **EXPAND** | Seed master game resmi V3 (termasuk **Honor of Kings**), daftar roles game resmi, dan matriks validasi relasi ekosistem. | Aditif (Aman) | **YA** |
| **3** | `20261107000003_v3_migrate_data.sql` | **MIGRATE** | Konversi peran admin lama ke `user`, konversi status verifikasi warisan ke status V3, dan arsipkan profil sekunder akun multi-profil ke `profiles_archived`. | Transformasi Data | **YA** |
| **4** | `20261107000004_v3_enforce_rpc_and_constraints.sql` | **MIGRATE** | Pasang konstrain `UNIQUE(account_id)`, trigger permanensi `entity_type`, trigger kaskade relasi, dan fungsi server `transition_verification()`. | Penegakan Integritas | **YA** |
| **5** | `20261107000005_v3_rls_policies.sql` | **MIGRATE** | Pasang kebijakan RLS baru untuk `user` dan `platform_admin`. Proteksi pencegah eskalasi peran mandiri dan audit log append-only. | Pengerasan Keamanan | **YA** |
| **ISOLASI** | `20261115000001_v3_contract_cleanup_DESTRUCTIVE.sql` | **CONTRACT** | Hapus kolom warisan ESI/daerah, drop constraint lama. | **DESTRUKTIF** | **DITUNDA MIN. 7 HARI** |
| **ISOLASI** | `20261105000003_DESTRUCTIVE_cleanup_obsolete_columns.sql` | **CONTRACT** | Hapus kolom tabel lama yang usang. | **DESTRUKTIF** | **DITUNDA MIN. 7 HARI** |

---

## 3. Kueri Verifikasi Sebelum & Sesudah Migrasi (Pre & Post Verification Queries)

Jalankan kueri berikut di SQL Editor untuk membuktikan keabsahan migrasi:

### 3.1 Verifikasi Sebaran Peran Akun (Keputusan D1)
```sql
-- Target: Hanya ada 'user' dan 'platform_admin'
SELECT role, count(*) AS total_accounts
FROM public.accounts
GROUP BY role;
```

### 3.2 Verifikasi Status Verifikasi Profil (Keputusan D3)
```sql
-- Target: Hanya ada status V3 ('unverified', 'under_review', 'verified', dll.)
SELECT verification_status, count(*) AS total_profiles
FROM public.profiles
GROUP BY verification_status;
```

### 3.3 Verifikasi Konstrain 1 Akun 1 Profil (Keputusan D2 & P10)
```sql
-- HASIL WAJIB: 0 baris (Tidak ada akun dengan > 1 profil)
SELECT account_id, count(*) AS total_profiles
FROM public.profiles
GROUP BY account_id
HAVING count(*) > 1;

-- Periksa profil yang diarsipkan
SELECT count(*) AS total_archived_profiles
FROM public.profiles_archived;
```

### 3.4 Verifikasi Hak Akses RLS & Proteksi Akun Admin
```sql
-- Target: 0 baris (Admin dilarang memiliki profil entitas)
SELECT a.id, a.email, p.id AS profile_id
FROM public.accounts a
JOIN public.profiles p ON p.account_id = a.id
WHERE a.role = 'platform_admin';
```

---

## 4. Prosedur Rollback Migrasi (Rollback Plan)

Jika terjadi anomali kritis saat eksekusi:
1. **Kegagalan pada Langkah EXPAND (1-2)**:
   * Bersifat aditif murni; tidak merusak tabel eksisting. Cukup `DROP` tabel baru jika diperlukan.
2. **Kegagalan pada Langkah MIGRATE (3-5)**:
   * Kembalikan snapshot cadangan database yang dibuat pada Langkah 1 melalui Supabase Dashboard (**Restore Backup**).
   * RTO pemulihan cadangan database: < 15 menit.
3. **Penyelamatan Profil Sekunder**:
   * Seluruh profil sekunder yang diarsipkan tetap tersimpan utuh di tabel `profiles_archived` dengan timestamp pengarsipan dan tidak pernah dihapus secara permanen.
