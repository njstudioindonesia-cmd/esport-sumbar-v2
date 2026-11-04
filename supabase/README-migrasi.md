# Panduan Eksekusi Migrasi Database & Storage — ESPORT SUMBAR V2

Dokumen ini memandu langkah demi langkah penerapan skema database PostgreSQL, Row Level Security (RLS), aturan kepatuhan UU PDP (UU No. 27/2022), konfigurasi Supabase Storage, nomor seri otomatis, dan Stored Procedure resmi untuk **ESPORT SUMBAR V2**.

---

## 1. Daftar Berkas Migrasi

Seluruh migrasi tersimpan di folder `supabase/migrations/` dengan penomoran urut:

| Berkas Migrasi | Fungsi Utama |
|---|---|
| `20261104000001_initial_schema.sql` | Skema dasar 12 tabel: `regions`, `accounts`, `guardian_consents`, `games`, `profiles`, `memberships`, `achievements`, `verification_requests`, `audit_logs`, `articles`, `notifications_queue`, `reports`. |
| `20261104000002_rls_policies.sql` | Konfigurasi awal Row Level Security (RLS) di seluruh tabel + fungsi pembantu peran (`get_auth_role()`, `get_auth_region_id()`). |
| `20261104000003_rpc_transition_verification.sql` | Stored Procedure & RPC transaksional `transition_verification()` dengan audit log otomatis (*append-only*). |
| `20261104000004_security_hardening.sql` | Trigger anti-tamper untuk kolom verifikasi profil (`trg_protect_profile_verification`) dan anti-eskalasi hak akses akun (`trg_protect_account_role`). |
| `20261104000005_real_mode_expansion.sql` | **Upgrade Mode Nyata**: Perluasan 7 bidang, tabel `media_assets`, penanda `is_demo`, sequence & fungsi `generate_esport_id()`, trigger auto-create akun dari `auth.users`, konfigurasi 3 Storage Bucket (`avatars`, `gallery`, `evidence`), View `public_profiles` (UU PDP), dan indeks pencarian. |
| `seed.sql` | Master data 19 Kota/Kabupaten Sumatera Barat dan master game cabang esport resmi PBESI. |
| `deploy_all_in_one.sql` | **Berkas Gabungan (Semua dalam Satu)**: Menggabungkan seluruh migrasi 0001–0005 dan seed data ke dalam satu skrip SQL utuh yang siap dieksekusi sekali jalan di SQL Editor Supabase Dashboard. |
| `test_rls_security.sql` | Skrip pengujian otomatis 10 titik pemeriksaan keamanan RLS, isolasi tenant wilayah, dan proteksi anak. |

---

## 2. Cara Menjalankan Migrasi

Pilih salah satu metode berikut sesuai preferensi lingkungan Anda:

### Metode A: Melalui Supabase Web Dashboard (Paling Mudah)

1. Buka konsol proyek Supabase Anda di browser (`https://supabase.com/dashboard/project/<PROJECT_ID>`).
2. Masuk ke menu **SQL Editor** pada navigasi sisi kiri.
3. Klik **New Query**.
4. Buka berkas `supabase/deploy_all_in_one.sql` di proyek Anda, salin seluruh isinya, dan tempelkan ke SQL Editor Supabase.
5. Klik tombol **Run** (atau tekan `Ctrl+Enter` / `Cmd+Enter`).
6. Tunggu hingga muncul pesan `Success. No rows returned` (biasanya memakan waktu 3–5 detik).
7. Skema, tabel, trigger, bucket storage, dan view publik kini telah aktif sempurna.

### Metode B: Melalui Supabase CLI (Lingkungan Lokal / CI-CD)

Jika Anda menggunakan Supabase CLI:

```bash
# 1. Login ke akun Supabase Anda
supabase login

# 2. Tautkan repositori lokal ke proyek Supabase
supabase link --project-ref <PROJECT_ID>

# 3. Jalankan seluruh migrasi yang tertunda
supabase db push

# 4. Terapkan seed data wilayah & game resmi
supabase db reset # (opsional, jika memulai dari database kosong)
```

---

## 3. Verifikasi Keamanan: Menjalankan Skrip Uji RLS

Setelah migrasi selesai dijalankan, lakukan pengujian keamanan untuk membuktikan bahwa RLS, isolasi data, dan view publik berjalan sesuai standar:

1. Di Supabase Web Dashboard, buka kembali menu **SQL Editor**.
2. Salin isi berkas `supabase/test_rls_security.sql`.
3. Tempelkan ke SQL Editor dan klik **Run**.
4. Periksa tab **Messages / Results**. Skrip akan mengeksekusi 10 pengujian:
   - **TEST 1**: RLS aktif di tabel `accounts`.
   - **TEST 2**: RLS aktif di tabel `profiles`.
   - **TEST 3**: RLS aktif di tabel `guardian_consents` (UU PDP).
   - **TEST 4**: View `public_profiles` tidak mengekspos `birth_date`, `guardian_contact`, atau `nik`.
   - **TEST 5**: Tiga storage bucket (`avatars`, `gallery`, `evidence`) terdaftar.
   - **TEST 6**: Bucket `evidence` berstatus privat (bebas dari akses anonim/publik langsung).
   - **TEST 7**: Generator `generate_esport_id()` menerbitkan format `ESB-PDG-PL-xxxxxx`.
   - **TEST 8**: Trigger anti-tamper verifikasi terpasang.
   - **TEST 9**: Trigger anti-eskalasi role terpasang.
   - **TEST 10**: Trigger sinkronisasi otomatis `on_auth_user_created` aktif.
5. Pastikan output menghasilkan **`10 DARI 10 UJI KEAMANAN LULUS (100%)`**.

---

## 4. Konfigurasi Supabase Storage

Sistem menggunakan 3 storage bucket dengan kebijakan akses berbeda:

| Bucket | Visibilitas | Ukuran Maksimal | Format yang Diizinkan | Kebijakan Keamanan (Storage RLS) |
|---|---|---|---|---|
| `avatars` | **Publik-Baca** | 2 MB | `.webp`, `.jpg`, `.png` | Publik bebas membaca. Hanya pemilik akun terotentikasi yang boleh mengunggah/menimpa di foldernya: `{account_id}/{profile_id}/avatar.webp`. |
| `gallery` | **Publik-Baca** | 3 MB | `.webp`, `.jpg`, `.png` | Publik bebas membaca. Hanya pemilik akun yang boleh mengunggah aset ke foldernya (maks 8 berkas per profil). |
| `evidence` | **PRIVAT** | 10 MB | `.webp`, `.jpg`, `.png`, `.pdf` | **Tidak ada akses publik**. Hanya pemilik berkas dan admin resmi (Pengcab wilayah terkait & Pengprov Sumbar) yang dapat mengakses melalui *short-lived signed URL* (60 detik – 15 menit). |

---

## 5. Ringkasan Format Nomor Seri Resmi (ESPORT ID)

Nomor seri resmi diterbitkan otomatis oleh Stored Procedure PostgreSQL `generate_esport_id(p_region_id, p_entity_type)` menggunakan database sequence independen:

$$\text{ESB}-\text{[KODE WILAYAH]}-\text{[KODE BIDANG]}-\text{[6 DIGIT SERI]}$$

Contoh:
- Atlet Kota Padang: `ESB-PDG-PL-100001`
- Pelatih Bukittinggi: `ESB-BKT-CO-100001`
- Tim Padang Pariaman: `ESB-PDP-TM-100001`
- Komunitas Payakumbuh: `ESB-PYK-CM-100001`
- Venue Gaming Solok: `ESB-SLK-VN-100001`
- Kampus / UKM Padang: `ESB-PDG-CP-100001`
- Sekolah SMA / SMK Agam: `ESB-AGM-SC-100001`

Nomor seri ini di-generate pada level database PostgreSQL, terindeks unik, dan tidak dapat diubah setelah diterbitkan.
