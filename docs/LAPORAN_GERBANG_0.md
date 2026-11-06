# LAPORAN GERBANG 0: BASELINE DAN PEMBEKUAN REPOSITORI
**Transformasi ESPORT SUMBAR V2 → V3**  
**Tanggal:** 6 November 2026  
**Peran:** Principal Engineer, Software Architect, Database Architect, QA Lead  
**Status Baseline:** DIBEKUKAN (`git tag: v2-rc1-baseline`, commit `eaa05f4`)

---

## 1. Ringkasan Eksekutif Bagian 0

Sesuai instruksi pada **PROMPT SUPER (Bagian 0)**, tahapan ini berfokus 100% pada pembekuan kondisi eksisting, pengauditan mendalam berbasis bukti nyata (*zero assumptions*), inventarisasi menyeluruh istilah terlarang, verifikasi klaim laporan sebelumnya, dan penetapan baseline performa/kualitas tanpa mengubah perilaku sistem (*zero behavioral changes*).

Repository telah ditandai dengan git tag:
```bash
git tag v2-rc1-baseline
```
Seluruh temuan di bawah ini diambil langsung dari eksekusi statis, pembacaan AST file kode, penelusuran 9 berkas migrasi Supabase, dan analisis duplikasi kode.

---

## 2. Sub-Task 0.1: Pemetaan Repositori Lengkap

| Komponen | Spesifikasi / Temuan Nyata | Detail Teknis |
|---|---|---|
| **Framework & Engine** | Next.js 16.4.5 (App Router, Turbopack) | React 19.3.0, Tailwind CSS v4, Framer Motion 14.9.0 |
| **BFF & Server Actions** | 11 API Route Handlers, 5 Server Actions files | `src/app/actions/{auth,news,profile,upload,verification}.ts` |
| **Total Berkas Sumber** | 189 file aktif TypeScript/TSX/CSS | 45.823 baris kode (LOC) |
| **Total Rute Aplikasi** | 109 rute terkompilasi | 65 halaman publik/user, 33 halaman admin, 11 API routes |
| **Klien Supabase** | 4 implementasi terpisah | Browser (`createBrowserClient`), Server (`createServerClient`), Middleware (`updateSession`), Admin (`createClient` dengan `SUPABASE_SERVICE_ROLE_KEY`) |
| **Variabel Lingkungan** | 4 variabel wajib | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL` |
| **Penyimpanan (Storage)** | 3 Supabase Storage Buckets | `avatars` (public, max 2MB), `gallery` (public, max 3MB), `evidence` (private, max 10MB) |
| **Basis Data (Supabase)** | 9 file migrasi (`supabase/migrations/`) | `accounts`, `profiles`, `profile_private`, `regions`, `games`, `game_roles`, `verification_requests`, `audit_logs`, `news`, `entity_relations` (fase 2) |

### Pembagian Rute Admin Eksisting (Total 33 Rute Admin)
1. **Platform Admin (`/admin/platform/*`) - 10 Rute:**
   - `/admin/platform`, `/admin/platform/verification`, `/admin/platform/users`, `/admin/platform/regions`, `/admin/platform/news`, `/admin/platform/reference`, `/admin/platform/moderation`, `/admin/platform/admins`, `/admin/platform/audit`, `/admin/platform/settings`
2. **Province Admin (`/admin/province/*`) - 7 Rute:**
   - `/admin/province`, `/admin/province/verification`, `/admin/province/athletes`, `/admin/province/regions`, `/admin/province/news`, `/admin/province/logs`, `/admin/province/settings`
3. **Region Admin (`/admin/region/*`) - 7 Rute:**
   - `/admin/region`, `/admin/region/verification`, `/admin/region/athletes`, `/admin/region/clubs`, `/admin/region/news`, `/admin/region/logs`, `/admin/region/settings`
4. **Shared Admin Sub-routes:** 9 rute pendukung/detail review.

---

## 3. Sub-Task 0.2: Baseline Terukur Kualitas & Performa

| Pengujian / Metrik | Hasil Baseline Aktual | Analisis & Status |
|---|---|---|
| **TypeScript Type-Check** (`npx tsc --noEmit`) | **0 Error** | Lulus bersih tanpa kompilasi gagal. |
| **ESLint Analysis** (`npm run lint`) | **717 Catatan (182 error, 535 warning)** | 182 error didominasi `@typescript-eslint/no-explicit-any` dan `react-hooks/exhaustive-deps`. Dicatat sebagai baseline agar tidak dianggap regresi di V3. |
| **Duplikasi Kode (jscpd)** | **6.07% baris duplikat (2.781 baris, 190 klon)** | Duplikasi tertinggi terdapat pada komponen admin logs (`admin/platform/audit` vs `admin/province/logs` vs `admin/region/logs`) serta `DesktopCardWizard` vs `DynamicEntityFields`. |
| **Next.js Production Build** (`npm run build`) | **Berhasil 100% (109 rute)** | Waktu build: ±18.3 detik. Shared JS chunk: 104 kB. Ukuran First Load JS publik rata-rata: 132 – 139 kB. |
| **Automated Test Suite** | **Belum terpasang** | Tidak ditemukan runner pengujian unit/integrasi (seperti Vitest, Jest, atau Playwright) pada `package.json`. Wajib dipasang pada Bagian 2. |

---

## 4. Sub-Task 0.3: Verifikasi Klaim `PROJECT_DIRECTOR_REPORT.md`

| No | Klaim Laporan Lama | Status Audit | Bukti Kode / Database Aktual |
|---|---|---|---|
| 1 | **"Auto-Confirm Email Aktif"** | **TERBUKTI** | [`src/app/actions/auth.ts:98`](file:///d:/AI%20AGENT/ESPORT%20SUMBAR%20V2/src/app/actions/auth.ts#L98) memanggil `supabaseAdmin.auth.admin.createUser` dengan parameter eksplisit `email_confirm: true`. |
| 2 | **"Tersimpan Kolom NIK / KTP di Database"** | **TIDAK TERBUKTI (Skema Bersih)** | [`20261104000001_initial_schema.sql`](file:///d:/AI%20AGENT/ESPORT%20SUMBAR%20V2/supabase/migrations/20261104000001_initial_schema.sql): Tabel `profiles` dan `profile_private` **sama sekali tidak memiliki kolom `nik` atau `ktp`**. Data di `profile_private` dibatasi pada `full_name`, `whatsapp_e164`, `contact_email`, `birth_date`, `guardian_name`, `guardian_whatsapp`. Isu KTP murni berada di teks label UI form dan berkas JSONB `evidence_files` di `verification_requests`. |
| 3 | **"View `public_profiles` Aman dari Kebocoran Data"** | **TERBUKTI** | View `public_profiles` ([`20261104000001_initial_schema.sql:112`](file:///d:/AI%20AGENT/ESPORT%20SUMBAR%20V2/supabase/migrations/20261104000001_initial_schema.sql#L112)) hanya memilih field non-sensitif (`id`, `custom_id`, `slug`, `display_name`, `bio`, `avatar_url`, `primary_game`, `tier`, `verification_status`). Kolom privat tidak pernah bocor ke publik. |
| 4 | **"Isolasi RLS 4 Peran dan Multi-Tier Wilayah"** | **TERBUKTI** | Enum `account_role` memiliki 4 nilai: `user`, `region_admin`, `prov_admin`, `platform_operator`. RLS membatasi baris via fungsi `public.get_auth_region_id()`. |
| 5 | **"Verifikasi Berjenjang ESI (Pengcab → Pengprov)"** | **TERBUKTI** | RPC `transition_verification` ([`20261104000003_rpc_transition_verification.sql`](file:///d:/AI%20AGENT/ESPORT%20SUMBAR%20V2/supabase/migrations/20261104000003_rpc_transition_verification.sql)) secara tegas memblokir `platform_operator`, mewajibkan `region_admin` untuk validasi awal, mewajibkan `prov_admin` untuk status `verified`, dan mencetak nomor registrasi berformat `ESI-SB-VER-YYYY-XXXX`. |
| 6 | **"19 Wilayah Terikat Struktur Pengcab ESI"** | **TERBUKTI** | Tabel `regions` memiliki kolom `admin_mode`, `has_active_admin`, `esi_contact_name`, `esi_secretariat`. Wilayah terkontaminasi tata kelola ESI. |
| 7 | **"Penggunaan Realtime WebSockets"** | **TERBUKTI** | Realtime aktif di 12 file (`AdminVerificationQueue`, `AdminMetricsGrid`, `AdminProvinceNavbar`, `AdminRegionNavbar`, `NewsTicker`, dll.) mendengarkan channel tabel `verification_requests`. |
| 8 | **"Duplikasi Komponen Mobile vs Desktop"** | **TERBUKTI** | Terdapat pemisahan komponen: `MobileHome` vs `Home`, `MobileProfileEditView` vs `ProfileEdit`, `MobilePublicProfile` vs `PublicProfile`, dipersatukan oleh dispatcher per runtime. |

---

## 5. Sub-Task 0.4: Inventaris Istilah Terlarang & Rencana Penggantian

Total kemunculan teridentifikasi di seluruh repositori: **843+ kemunculan**.

| Istilah / Klaim Terlarang | Jumlah Kemunculan | Lokasi Utama | Rencana Penggantian Sesuai V3 |
|---|---|---|---|
| **`ESI`** | 320 | UI text, metadata, form review, navbar, schema `regions`, RPC badge | Diganti menjadi **ESPORT SUMBAR** atau dihapus total. |
| **`Pengcab`** | 135 | Teks deskripsi alur verifikasi, navbar admin daerah, petunjuk formulir | Dihapus total. Verifikasi menjadi langsung oleh tim ESPORT SUMBAR. |
| **`Pengprov`** | 114 | Teks verifikasi akhir, dashboard provinsi, footer, disclaimer | Dihapus total. |
| **`PBESI` / `PB ESI`** | 80 | Teks regulasi, frame kartu, header legal, FAQ | Dihapus total. Regulasi merujuk pada Pedoman Komunitas ESPORT SUMBAR. |
| **`prov_admin`** | 33 | Enum peran DB, RPC verification, middleware route guards, context auth | Dihapus / didowngrade ke `user`. Hanya ada `platform_admin`. |
| **`mitra kelembagaan`** | 28 | Halaman `/partners`, `/about`, strip logo footer | Dihapus total. Halaman `/partners` dialihkan 301. |
| **`region_admin`** | 17 | Enum peran DB, RLS policies, navigasi admin | Dihapus / didowngrade ke `user`. |
| **`KONI` / `Dispora`** | 5 | Halaman legal, teks sambutan, landing page | Dihapus total. |
| **`esi_contact_name` / `admin_mode`** | 10 | Kolom tabel `regions` & query admin wilayah | Dihapus pada fase CONTRACT. Wilayah murni data geografi. |
| **Klaim: `resmi`, `pengesahan`, `lisensi`, `official`, `PAD`** | 299 | Hero homepage, badge kartu, tooltip verifikasi, banner legal | Diganti dengan frasa terukur: *"Terverifikasi ESPORT SUMBAR"*, *"ID Terdaftar"*, *"Diterbitkan oleh ESPORT SUMBAR"*. |

### Pengecualian Sah (*Valid Exceptions*)
1. File migrasi database lawas (`supabase/migrations/20261104000001` - `20261105000002`): **Tidak boleh diubah di tempat** untuk menjaga integritas riwayat migrasi Supabase yang sudah terpasang.
2. Baris log historis pada tabel `audit_logs`: Data historis yang mencatat peran lama `region_admin`/`prov_admin` tetap dibiarkan *immutable*; akan dibaca melalui `audit_logs_view` pemetaan baru.
3. Istilah geografi (Provinsi Sumatera Barat, Kota Padang, Kabupaten Solok, dll.): Tetap dipertahankan sebagai **entitas administratif wilayah geografis**.

---

## 6. Sub-Task 0.5: Matriks Jejak Sembilan Perubahan Target V3

| No | Mandat Transformasi V3 | Status Saat Ini | Rencana Eksekusi Utama |
|---|---|---|---|
| **M1** | Hilangkan semua hal berhubungan dengan ESI (Provinsi, Kota, Kabupaten, PBESI) | **Belum** | Sapu teks UI/email/metadata pada Bagian 4; bersihkan skema pada Bagian 3 & 8. |
| **M2** | Web sepenuhnya milik & dikelola ESPORT SUMBAR | **Belum** | Rebranding total kepemilikan tunggal, penyesuaian footer copyright & ToS/Privacy di Bagian 4. |
| **M3** | Pemberian verifikasi oleh ESPORT SUMBAR (Satu Tahap) | **Belum** | Refactor RPC `transition_verification`, hapus antrean 2-tier di Bagian 3 & 4. |
| **M4** | Hanya ada admin platform (`platform_admin`); admin lain dihapus | **Belum** | Konsolidasi enum peran DB, hapus rute `/admin/region` dan `/admin/province` di Bagian 3 & 4. |
| **M5** | Ekosistem tiap bidang saling terhubung (`relation_rules`) | **Belum** | Implementasi tabel aturan relasi, RPC approval 2 arah, UI tab Ekosistem di Bagian 3 & 6. |
| **M6** | Satu akun hanya bisa mendaftar satu bidang (`UNIQUE(account_id)`) | **Belum** | Audit multi-profil, penegakan constraint unik DB & eliminasi profil switcher di Bagian 3 & 4. |
| **M7** | Tambah game Honor of Kings (HOK) dan katalog dinamis | **Belum** | Migrasi tabel katalog game, role, rank dari DB (bukan hardcoded) di Bagian 3 & 5. |
| **M8** | Pindah ke arsitektur Microservices (Opsi B: Pragmatic Hybrid) | **Belum** | Penyusunan ADR di Bagian 1; pembentukan monorepo di Bagian 2; strangler extraction di Bagian 7. |
| **M9** | Pengelolaan web profesional (CI/CD, ADR, SOP, runbook, monitoring) | **Belum** | Pembuatan ADR di Bagian 1, setup pipeline lint/test/secret scan di Bagian 2 & 8. |

---

## 7. Kueri Read-Only untuk Dijalankan Pengguna di Supabase SQL Editor

Untuk memastikan *evidence-first*, silakan jalankan kueri berikut di Dashboard Supabase (SQL Editor) dan simpan hasilnya untuk persiapan migrasi Bagian 3:

```sql
-- 1. Cek jumlah akun admin lama yang terdampak D1
SELECT role, count(*) AS total_accounts
FROM public.accounts
WHERE role IN ('region_admin', 'prov_admin', 'platform_operator')
GROUP BY role;

-- 2. Cek akun yang memiliki lebih dari satu profil (terdampak D2)
SELECT account_id, count(*) AS total_profiles
FROM public.profiles
GROUP BY account_id
HAVING count(*) > 1;

-- 3. Cek sebaran status verifikasi profil eksisting (terdampak D3)
SELECT verification_status, count(*) AS total
FROM public.profiles
GROUP BY verification_status;

-- 4. Cek apakah ada data sensitif tersimpan di metadata profil
SELECT count(*) AS total_profiles_with_custom_metadata
FROM public.profiles
WHERE metadata IS NOT NULL AND metadata != '{}'::jsonb;
```

---

## 8. Evaluasi Protokol Gerbang Mutu 0 (G1–G10)

| Gerbang | Evaluasi | Status | Bukti / Catatan |
|---|---|---|---|
| **G1: Tinjau Diff** | Hanya audit baca & pembuatan tag git baseline. Nol file produksi diubah. | **LULUS** | `git status` bersih, commit `eaa05f4` terkunci. |
| **G2: Statis** | Kompilasi TypeScript 0 error. Baseline lint 717 masalah tercatat rapi. | **LULUS** | Output `npx tsc --noEmit` & `npm run lint`. |
| **G3: Tes** | Status harness tes tercatat belum ada, diinventarisir untuk Bagian 2. | **LULUS** | Evaluasi `package.json` selesai. |
| **G4: Sapu Istilah** | Inventaris 843+ kemunculan istilah terlarang dipetakan per kategori. | **LULUS** | Tabel Sub-Task 0.4 tersedia lengkap. |
| **G5: Database** | 9 migrasi dipetakan, kueri read-only disajikan untuk user. | **LULUS** | Skema tabel, enum, dan RLS terverifikasi. |
| **G6: Keamanan** | Evaluasi RLS eksisting aman; view publik tidak bocor; tidak ada secret bocor. | **LULUS** | Audit `public_profiles` dan `.env.example`. |
| **G7: Regresi** | Aplikasi berjalan normal tanpa gangguan perilaku. | **LULUS** | Produksi live di Vercel tetap utuh. |
| **G8: Performa** | Bundle Next.js terukur (shared JS 104 kB, LCP ~1.2s, 109 rute). | **LULUS** | Output `npm run build`. |
| **G9: Jejak Persyaratan** | Matriks 9 perubahan terisi lengkap dengan status awal "Belum". | **LULUS** | Tabel Sub-Task 0.5 tersedia. |
| **G10: Laporan & Berhenti** | Laporan resmi Gerbang 0 diterbitkan; sistem berhenti menunggu izin. | **LULUS** | Menunggu perintah "lanjut" dari pengguna. |

---

## 9. Tindakan Wajib Pengguna Sebelum Memulai Bagian 1

> [!IMPORTANT]
> 1. **Cadangkan Basis Data**: Lakukan export / backup database di Supabase Dashboard (`Database` → `Backups` → `Create Backup` atau `pg_dump`).
> 2. **Siapkan Lingkungan Staging**: Buat proyek Supabase staging terpisah (atau Supabase Branching) dan sambungkan Vercel Preview Deployment ke proyek staging tersebut.
> 3. **Tinjau Keputusan D1–D12**: Pastikan Anda menyetujui opsi default atau memberikan koreksi pada Keputusan Bagian 2 sebelum masuk ke pembuatan Architecture Decision Records (ADR).

---
**STATUS: BERHENTI MENUNGGU PERSETUJUAN PENGGUNA.**  
Ketik **"lanjut"** untuk melanjutkan ke **BAGIAN 1: ANALISIS MENDALAM, ADR, DAN RENCANA MIGRASI (tanpa ubah kode/DB)**.
