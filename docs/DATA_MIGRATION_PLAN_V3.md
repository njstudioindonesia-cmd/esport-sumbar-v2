# Rencana Migrasi Data V3: Pola Expand -> Migrate -> Contract

Dokumen ini memetakan seluruh strategi transformasi basis data dari skema V2 menuju target arsitektur V3 secara aman tanpa downtime dan tanpa kehilangan data.

---

## 1. Siklus Transformasi Tiga Tahap

```
[TAHAP 1: EXPAND] (Aman, Aditif)
   ├── Tambah kolom, enum baru, dan tabel baru (v3_*)
   ├── Kode lama tetap berfungsi tanpa gangguan
   └── Kode baru mulai menulis ke dua tempat (Dual Write jika perlu)

[TAHAP 2: MIGRATE] (Pengisian & Penyelarasan Data)
   ├── Jalankan skrip migrasi data (backfill data historis)
   ├── Konversi peran lama ke peran baru
   ├── Arsipkan profil ganda sesuai Keputusan D2
   └── Alihkan kode baca/tulis ke kolom & tabel baru

[TAHAP 3: CONTRACT] (Pembersihan, Destruktif atas Persetujuan)
   ├── Hapus kolom lama, enum lama, tabel usang ESI
   ├── Purge berkas bukti sensitif (KTP/KK) sesuai Keputusan D4
   └── Hapus prosedur & rute usang
```

---

## 2. Pemetaan Data Spesifik

### 2.1 Pemetaan Status Verifikasi Profil
| Status Lama (V2) | Status Target (V3) | Rasional & Catatan |
|---|---|---|
| `draft` | `unverified` | Pengguna baru mengisi profil dasar; belum mengajukan verifikasi. |
| `submitted` | `submitted` | Berkas pengajuan masuk ke antrean verifikasi ESPORT SUMBAR. |
| `regional_review` | `under_review` | Penggabungan antrean: langsung ditinjau oleh platform admin. |
| `regional_approved` | `under_review` | Dipertahankan dalam tahap tinjauan platform admin. |
| `provincial_review` | `under_review` | Dipertahankan dalam tahap tinjauan platform admin. |
| `revision` | `revision_requested` | Membutuhkan perbaikan dokumen oleh pengguna. |
| `prov_verified` | `verified` | Otomatis dipertahankan sebagai profil terverifikasi ESPORT SUMBAR (Keputusan D3). Masa berlaku 12 bulan tetap berjalan. |
| `rejected` | `rejected` | Ditolak dengan alasan resmi. |
| `suspended` | `suspended` | Dibekukan karena pelanggaran pedoman komunitas. |
| `expired` | `expired` | Masa berlaku 12 bulan habis; butuh pengajuan ulang. |

### 2.2 Pemetaan Peran Pengguna (`accounts.role`)
| Peran Lama (V2) | Peran Target (V3) | Tindakan Migrasi (Keputusan D1) |
|---|---|---|
| `user` | `user` | Tetap `user`. |
| `region_admin` | `user` | Diturunkan (*downgraded*) menjadi `user`. Diberikan pemberitahuan resmi. |
| `prov_admin` | `user` | Diturunkan (*downgraded*) menjadi `user`. |
| `platform_operator` | `platform_admin` | Ditunjuk menjadi `platform_admin` (khusus akun resmi yang disetujui). |

### 2.3 Penanganan Akun Multi-Profil (Keputusan D2)
- **Kondisi:** Akun yang memiliki lebih dari satu profil entitas pada tabel `profiles`.
- **Aturan Seleksi:**
  1. Profil dengan status `verified` diprioritaskan untuk dipertahankan.
  2. Jika sama-sama unverified atau verified, pilih profil tertua (`created_at` paling awal) yang memiliki kelengkapan data tertinggi.
- **Tindakan:**
  - Profil terpilih tetap aktif di tabel `profiles`.
  - Profil non-terpilih dipindahkan ke tabel arsip `profiles_archived` dengan seluruh relasi aktifnya diubah status menjadi `ended`.
  - Akun yang bersangkutan menerima notifikasi alasan pengarsipan.

### 2.4 Penanganan Bukti & Data Sensitif (Keputusan D4)
- Skema tabel `profiles` dan `profile_private` telah terbukti bersih dari kolom `nik` atau `ktp`.
- Berkas di bucket private `evidence` yang sebelumnya berupa scan KTP/KK:
  1. Diberikan masa retensi tenggang (*grace period*) 30 hari.
  2. Sistem menyediakan opsi bagi atlet untuk mengganti bukti dengan tangkapan layar in-game IGN atau kartu pelajar/mahasiswa.
  3. Setelah 30 hari, berkas usang di-purge melalui migrasi tahap CONTRACT setelah persetujuan eksplisit.

---

## 3. Daftar Urutan Migrasi SQL

| No Migrasi | Nama Berkas | Tujuan | Tipe | Rencana Rollback |
|---|---|---|---|---|
| **010** | `20261107000001_v3_expand_enums_and_tables.sql` | Tambah enum peran baru (`platform_admin`), enum status baru, tabel `games`, `game_roles`, `game_ranks`, `relation_rules`, `profiles_archived`, `outbox_events`. | EXPAND (Aman) | `DROP TABLE` tabel baru; enum baru dibiarkan. |
| **011** | `20261107000002_v3_seed_games_and_rules.sql` | Seed game awal (termasuk HOK), peran game resmi, dan aturan relasi matriks ekosistem. | EXPAND (Aman) | `DELETE FROM` data seed. |
| **012** | `20261107000003_v3_migrate_existing_data.sql` | Migrasi status verifikasi lama ke baru, konversi peran admin lama ke `user`, arsip profil ganda ke `profiles_archived`. | MIGRATE (Data) | Kembalikan data dari backup snapshot tabel. |
| **013** | `20261107000004_v3_enforce_constraints_and_rpc.sql` | Pasang konstrain `UNIQUE(account_id)`, trigger `prevent_entity_type_change`, pasang RPC baru `transition_verification` dan `respond_relation`. | MIGRATE (Enforce) | `ALTER TABLE DROP CONSTRAINT`, restore RPC lama. |
| **014** | `20261107000005_v3_update_rls_policies.sql` | Pasang kebijakan RLS baru untuk `user` dan `platform_admin`. Hapus ketergantungan wilayah. | MIGRATE (Security) | Terapkan ulang RLS snapshot V2. |
| **015** | `20261115000001_v3_contract_cleanup_DESTRUCTIVE.sql` | *Dijalankan di Bagian 8 setelah persetujuan:* Hapus kolom `regions.admin_mode`, `esi_contact_name`, hapus enum usang, purge bucket storage lama. | CONTRACT (Destruktif) | Restore dari full pg_dump snapshot. |
