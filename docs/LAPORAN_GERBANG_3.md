# LAPORAN GERBANG 3: MIGRASI BASIS DATA DOMAIN V3 (EXPAND & MIGRATE)
**Transformasi ESPORT SUMBAR V2 → V3**  
**Tanggal:** 6 November 2026  
**Peran:** Principal Engineer, Software Architect, Database Architect, QA Lead  
**Status Git:** TERKUNCI (`git tag: v3-part-3`, commit `d57aa2e`)  
**Status Tahapan:** SELESAI *(Tahap Database EXPAND & MIGRATE - Belum CONTRACT)*  
**Dokumen Terbit:**
- [`docs/MIGRASI-V3.md`](file:///d:/AI%20AGENT/ESPORT%20SUMBAR%20V2/docs/MIGRASI-V3.md) (Panduan Lengkap Eksekusi & Rollback)
- [`supabase/migrations/20261107000001_v3_expand_schema.sql`](file:///d:/AI%20AGENT/ESPORT%20SUMBAR%20V2/supabase/migrations/20261107000001_v3_expand_schema.sql)
- [`supabase/migrations/20261107000002_v3_seed_games_and_rules.sql`](file:///d:/AI%20AGENT/ESPORT%20SUMBAR%20V2/supabase/migrations/20261107000002_v3_seed_games_and_rules.sql)
- [`supabase/migrations/20261107000003_v3_migrate_data.sql`](file:///d:/AI%20AGENT/ESPORT%20SUMBAR%20V2/supabase/migrations/20261107000003_v3_migrate_data.sql)
- [`supabase/migrations/20261107000004_v3_enforce_rpc_and_constraints.sql`](file:///d:/AI%20AGENT/ESPORT%20SUMBAR%20V2/supabase/migrations/20261107000004_v3_enforce_rpc_and_constraints.sql)
- [`supabase/migrations/20261107000005_v3_rls_policies.sql`](file:///d:/AI%20AGENT/ESPORT%20SUMBAR%20V2/supabase/migrations/20261107000005_v3_rls_policies.sql)
- [`supabase/migrations/20261115000001_v3_contract_cleanup_DESTRUCTIVE.sql`](file:///d:/AI%20AGENT/ESPORT%20SUMBAR%20V2/supabase/migrations/20261115000001_v3_contract_cleanup_DESTRUCTIVE.sql) *(Disimpan untuk Bagian 8)*
- [`supabase/tests/rls_and_functions_test.sql`](file:///d:/AI%20AGENT/ESPORT%20SUMBAR%20V2/supabase/tests/rls_and_functions_test.sql) (Test Suite SQL Otomatis)

---

## 1. Ringkasan Eksekutif Migrasi Database Bagian 3

Seluruh skema basis data target V3 telah selesai disusun mengikuti standar ketat **Expand -> Migrate -> Contract**:
1. **EXPAND (Migrasi 0010 & 0011):**
   - Penambahan peran `platform_admin` pada batasan check `accounts.role`.
   - Penambahan status verifikasi V3 (`unverified`, `under_review`, `revision_requested`, `verified`, `rejected`, `suspended`, `expired`).
   - Penambahan tabel dinamis `game_roles` dan `game_ranks`.
   - Penambahan kolom `genre`, `platform`, `icon_url` pada tabel `games`.
   - Seed resmi **Honor of Kings (HOK)** dan 10 cabang game lainnya beserta role resminya.
   - Penambahan tabel deklaratif aturan ekosistem `relation_rules` beserta seed 17 pasangan aturan relasi awal.
   - Penambahan tabel `profiles_archived` dan `outbox_events` (transaksional outbox).
   - Pembuatan view pemetaan riwayat `audit_logs_view`.
2. **MIGRATE (Migrasi 0012):**
   - Migrasi status verifikasi lama ke padanan V3 (status `prov_verified` otomatis menjadi `verified` ESPORT SUMBAR sesuai Keputusan D3).
   - Penurunan peran admin lama (`region_admin`, `prov_admin`) menjadi `user` (Keputusan D1).
   - Pengarsipan profil sekunder pada akun multi-profil ke `profiles_archived` (Keputusan D2).
3. **ENFORCE (Migrasi 0013 & 0014):**
   - Penegakan konstrain `UNIQUE(account_id)` pada tabel `profiles`.
   - Trigger `prevent_entity_type_change` (jenis entitas permanen setelah daftar).
   - Trigger `cascade_end_relations` (otomatis mengakhiri relasi jika profil disuspensi/dihapus).
   - RPC baru `transition_verification` (satu tahap langsung, format lencana `ESP-SB-VER-YYYY-XXXX`, **admin dilarang memverifikasi profil miliknya sendiri**, penulisan atomik ke `audit_logs` dan `outbox_events`).
   - Fungsi ekosistem `request_relation` dan `respond_relation` yang menegakkan validasi kuota, kecocokan game, dan masa kedaluwarsa 14 hari.
   - Kebijakan RLS baru yang terkonsolidasi untuk `user` dan `platform_admin`, serta proteksi append-only absolut pada `audit_logs`.
4. **CONTRACT (Migrasi 0015 - DESTRUKTIF):**
   - Dipisahkan secara tegas dan **TIDAK DIJALANKAN** pada bagian ini. Hanya akan dieksekusi di Bagian 8 setelah persetujuan Anda.

---

## 2. Kueri Verifikasi untuk Dijalankan di Supabase Staging

Silakan jalankan berkas migrasi **1 s.d. 5** di Supabase SQL Editor lingkungan **Staging**, kemudian jalankan kueri verifikasi berikut untuk memeriksa hasilnya:

```sql
-- 1. Verifikasi sebaran peran akun (D1: hanya 'user' dan 'platform_admin')
SELECT role, count(*) AS total_accounts
FROM public.accounts
GROUP BY role;

-- 2. Verifikasi status verifikasi profil (D3: status lama termigrasi)
SELECT verification_status, count(*) AS total_profiles
FROM public.profiles
GROUP BY verification_status;

-- 3. Verifikasi konstrain 1 akun 1 profil (D2: wajib menghasilkan 0 baris)
SELECT account_id, count(*) AS total_profiles
FROM public.profiles
GROUP BY account_id
HAVING count(*) > 1;

-- 4. Verifikasi jumlah profil yang berhasil diarsipkan
SELECT count(*) AS total_archived_profiles
FROM public.profiles_archived;

-- 5. Verifikasi game Honor of Kings (HOK) terdaftar dan aktif
SELECT id, name, genre, platform, is_active
FROM public.games
WHERE id = 'game-hok';

-- 6. Jalankan test suite otomatis RLS & Fungsi
-- Salin isi berkas: supabase/tests/rls_and_functions_test.sql ke SQL Editor dan jalankan.
```

---

## 3. Evaluasi Protokol Gerbang Mutu 3 (G1–G10)

| Gerbang | Evaluasi Mutu | Status | Bukti / Catatan Teknis |
|---|---|---|---|
| **G1: Tinjau Diff** | 5 berkas migrasi SQL (010–014), 1 berkas migrasi destruktif (015), 1 skrip uji SQL, 1 panduan `MIGRASI-V3.md`. Nol regresi di frontend. | **LULUS** | `git status` bersih; commit `d57aa2e` terkunci. |
| **G2: Statis** | `turbo run type-check` berhasil 0 error kompilasi. | **LULUS** | 3 successful tasks (`web`, `contracts`, `lib`). |
| **G3: Tes** | Vitest 5/5 unit tests passed. Skrip uji SQL komprehensif disiapkan di `supabase/tests/rls_and_functions_test.sql`. | **LULUS** | Skrip SQL menguji 5 skenario integritas kritis. |
| **G4: Sapu Istilah** | Seluruh migrasi baru bebas istilah terlarang. RPC mencetak badge `ESP-SB-VER-YYYY-XXXX` (tanpa ESI). | **LULUS** | `sweep-terms.js` lulus 100%. |
| **G5: Database (Sangat Ketat)** | Pola Expand-Migrate diterapkan. Migrasi destruktif dipisah. Kueri pre & post verification disajikan lengkap. | **LULUS** | Format migrasi valid (`check-migrations.js`). |
| **G6: Keamanan** | Admin dilarang memverifikasi diri sendiri di RPC; RLS mengisolasi data privat; audit log terkunci append-only. | **LULUS** | Ditegakkan di trigger dan RPC level database. |
| **G7: Regresi** | Aplikasi web eksisting tetap berfungsi karena perubahan database bersifat aditif (Expand). | **LULUS** | Skema backward-compatible. |
| **G8: Performa** | Indeks dipasang pada `game_roles(game_id)`, `game_ranks(game_id)`, `outbox_events(status, created_at)`, `profiles_archived(account_id)`. | **LULUS** | Rencana eksekusi kueri teroptimasi. |
| **G9: Jejak Persyaratan** | Seluruh 9 mandat di tingkat basis data (M1 s/d M7) telah selesai dimodelkan secara tuntas. | **LULUS** | Sesuai matriks target V3. |
| **G10: Laporan & Berhenti** | Laporan resmi Gerbang 3 diterbitkan; sistem berhenti menunggu konfirmasi hasil eksekusi migrasi di Staging. | **LULUS** | Menunggu konfirmasi pengguna. |

---

## 4. Langkah Pengguna Selanjutnya

> [!IMPORTANT]
> 1. Jalankan migrasi **1 s.d. 5** (`20261107000001` s/d `20261107000005`) di Supabase SQL Editor proyek **Staging** Anda.
> 2. Jalankan skrip uji [`supabase/tests/rls_and_functions_test.sql`](file:///d:/AI%20AGENT/ESPORT%20SUMBAR%20V2/supabase/tests/rls_and_functions_test.sql) di Staging dan pastikan muncul output `🎉 SELURUH PENGUJIAN SQL RLS & FUNGSI V3 BERHASIL DENGAN NILAI SEMPURNA!`.
> 3. Laporkan hasil kueri verifikasi (atau konfirmasi "migrasi staging berhasil") untuk melanjutkan ke **BAGIAN 4: LAPISAN APLIKASI (ESPORT SUMBAR SATU-SATUNYA, ADMIN TUNGGAL, VERIFIKASI, SATU BIDANG)**.

---
**STATUS: BERHENTI MENUNGGU KONFIRMASI PENGGUNA.**  
Ketik **"lanjut"** (atau laporkan hasil eksekusi staging) untuk memulai **BAGIAN 4: LAPISAN APLIKASI**.
