# Catatan Keputusan Arsitektur & Database (DECISIONS.md)

**Proyek:** ESPORT SUMBAR V2  
**Tanggal:** 4 November 2026  
**Status:** Fase 1 MVP Backend (Skema SQL, RLS, RPC, dan Supabase Helpers Selesai)

---

## 1. Skema Database Fisik (Supabase / PostgreSQL)

File migrasi:
- `supabase/migrations/20261104000001_initial_schema.sql`
- `supabase/migrations/20261104000002_rls_policies.sql`
- `supabase/migrations/20261104000003_rpc_transition_verification.sql`
- `supabase/seed.sql`

### 12 Tabel Inti & Fungsinya:
1. `regions`: 19 Kota/Kabupaten di Sumatera Barat dengan mode operasional (`active` vs `fallback`) dan status wilayah pilot (Padang & Padang Pariaman).
2. `accounts`: Akun autentikasi yang terhubung dengan `auth.users(id)` Supabase. Memiliki kolom peran (`user`, `region_admin`, `prov_admin`, `platform_operator`), `assigned_region_id` untuk admin daerah, dan `birth_date` privat.
3. `guardian_consents`: Kepatuhan terhadap UU Perlindungan Data Pribadi (UU PDP) untuk atlet/pengguna di bawah 18 tahun.
4. `games`: Master game resmi PBESI (MLBB, Free Fire, PUBG Mobile, Valorant, eFootball).
5. `profiles`: Entitas kartu dan rekam jejak atlet/organisasi. Satu akun dapat memiliki banyak profil (`player`, `coach`, `team`, dll.). Memiliki status verifikasi, nomor lencana resmi, tier kelangkaan (`rookie`, `contender`, `elite`, `legend`), dan pengaturan visibilitas field (`visibility_jsonb`).
6. `memberships`: Relasi dua arah dengan persetujuan ganda antara Player/Pelatih dengan Tim/Organisasi.
7. `achievements`: Riwayat prestasi dan kejuaraan resmi yang dapat divalidasi oleh admin untuk kenaikan tier kelangkaan (Tier 3 Elite & Tier 4 Legend).
8. `verification_requests`: Permohonan verifikasi berjenjang dari pengguna ke ESI Daerah hingga Pengprov ESI Sumbar.
9. `audit_logs`: **Append-Only Immutable Log**. Hak `UPDATE` dan `DELETE` dicabut total di tingkat database untuk seluruh peran.
10. `articles`: Manajemen konten editorial resmi untuk rilis pers, regulasi, dan liputan kejuaraan daerah.
11. `notifications_queue`: Antrean pesan transaksional untuk email status pengajuan, undangan tim, dan pengingat masa aktif 12 bulan.
12. `reports`: Sistem pengaduan pemalsuan identitas atau pelanggaran kode etik atlet.

---

## 2. Row Level Security (RLS) & Isolasi Multi-Tenant

1. **Isolasi Admin Daerah (`region_admin`):**
   - Hanya dapat melihat dan menelaah antrean verifikasi di `region_id` yang sesuai dengan `accounts.assigned_region_id`.
   - Dilarang membaca berkas privat pendaftar di kabupaten/kota lain.
2. **Kewenangan Eksklusif Pengprov ESI Sumbar (`prov_admin`):**
   - Satu-satunya pihak yang memiliki hak memberikan status `verified` (menerbitkan lencana emas) dan sanksi `suspended`.
   - Mengambil alih penelaahan untuk daerah dalam mode `fallback` (Mentawai, Pasaman Barat, Solok Selatan, dll.).
3. **Batasan Ketat Operator Platform (`platform_operator`):**
   - Mengelola CMS Berita, master referensi game, akun admin ESI, dan penanganan teknis laporan.
   - **Dilarang keras mengubah status verifikasi keolahragaan ESI**.
4. **Perlindungan Berkas Privat:**
   - Bukti pendukung verifikasi tersimpan di penyimpanan privat dan hanya dapat diakses melalui *signed URL* berumur pendek (15 menit).

---

## 3. Stored Procedure & RPC: `transition_verification()`

Fungsi database `transition_verification` memastikan:
- Transisi status hanya dapat dilakukan oleh peran yang berwenang.
- Mengisi nomor registrasi lencana resmi PBESI dengan format `ESI-SB-VER-YYYY-XXXX` secara otomatis.
- Menetapkan masa berlaku verifikasi selama 12 bulan (`NOW() + INTERVAL '12 months'`).
- Mewajibkan pengisian alasan penolakan atau revisi berkas.
- Menulis riwayat audit ke tabel `audit_logs` dan antrean notifikasi ke `notifications_queue` secara atomik dalam satu transaksi.

---

## 4. Konfigurasi Client Supabase Next.js App Router

Telah dibuat modul helper di `src/lib/supabase/`:
- `database.types.ts`: TypeScript definition lengkap untuk 12 tabel dan RPC database.
- `client.ts`: Supabase Browser Client menggunakan `@supabase/ssr`.
- `server.ts`: Supabase Server Client untuk Server Components & Server Actions.
- `middleware.ts`: Refresh session cookie otomatis di level edge Next.js middleware.
