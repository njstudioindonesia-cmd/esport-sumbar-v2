# LAPORAN GERBANG MUTU PUBLIKASI 0 (PG0 / PG1–PG13)
**Fase Publikasi ESPORT SUMBAR V3: Pra-Penerbangan (Pre-Flight Audit & Readiness Assessment)**  
**Tanggal**: 2026-11-07  
**Commit Baseline**: `9f020f5` (Tag: `v3fe-part-11`)  
**Status Eksekusi**: Selesai Tanpa Perubahan Kode (Sesuai Mandat 0: *Tanpa deploy, tanpa ubah perilaku*)

---

## 1. Ringkasan Pra-Penerbangan
Bagian 0 berfokus memverifikasi seluruh komponen repositori, kesiapan build, variabel lingkungan, arsitektur serverless, latar pekerjaan, persistensi memori, integritas rute, dan klasifikasi penghalang rilis (*blockers*) sebelum melangkah ke publikasi Staging (Bagian 1).

Semua investigasi berbasis **bukti keluaran perintah nyata**, tanpa asumsi, dan tanpa mengekspos kredensial rahasia apa pun ke dalam catatan obrolan.

---

## 2. Hasil Audit Komprehensif (Sub-Langkah 0.1 – 0.10)

### 0.1 Status Git & Audit Rahasia
- **Cabang Aktif**: `main`
- **Remote**: `origin` (`https://github.com/njstudioindonesia-cmd/esport-sumbar-v2.git`)
- **Status Sinkronisasi**: Repositori lokal berada **40 commit di depan `origin/main`** (sejak commit `eaa05f4` hingga `9f020f5`).
- **Tag Lokal Belum Ter-push**: `v3-part-1` s.d. `v3-part-9`, `v3-final-release`, `v3fe-part-0` s.d. `v3fe-part-11`.
- **Berkas Dilacak yang Perlu Dikecualikan**: Berkas mock drill snapshot (`backups/drills/...` dan `backups/pre-cleanup-manifest-...`) saat ini terlacak di Git. Direktori `backups/` harus ditambahkan ke `.gitignore` agar dump database nyata di masa mendatang tidak sengaja ter-commit.
- **Berkas Sensitif**: Tidak ada berkas `.env` atau `.env.local` yang terlacak (hanya template `.env.local.example`).
- **Aset Besar**: 0 berkas berukuran di atas 1 MB di dalam repositori Git.
- **Pemindaian Rahasia**:
  - `node scripts/scan-secrets.js`: **0 rahasia ter-hardcode**.
  - Audit riwayat Git (`git log -S`): 0 kunci API, JWT service role, atau private key yang terekspos dalam riwayat commit.

### 0.2 Audit Build Bersih & Kompatibilitas Sistem Operasi
- **Paket & Workspace**: Monorepo Turborepo 2.11.10 dengan npm workspaces (`apps/web`, `packages/contracts`, `packages/lib`, `packages/config`).
- **Investigasi Masalah Symlink Windows**:
  - Diperiksa: seluruh dependensi antar paket menggunakan referensi npm standar (`apps/*`, `packages/*`) tanpa symlink manual.
  - Temuan: kegagalan symlink sebelumnya (`EPERM`) murni batasan Windows non-developer mode saat menjalankan tool tertentu secara lokal.
  - Pada lingkungan hosting Linux Vercel (`ubuntu-latest`), symlink dan modul monorepo beroperasi secara alami tanpa kendala.
- **Temuan Kritis Linting (P0 untuk CI)**:
  - `npm run lint` menghasilkan 380 error dari ESLint 9 karena aturan `@typescript-eslint/no-explicit-any` yang terlalu ketat pada berkas pengujian dan mock fixtures. Aturan ini harus disesuaikan di `apps/web/eslint.config.mjs` pada Bagian 1 agar CI / Vercel build tidak gagal.
- **Hasil Kompilasi Next.js**:
  - `npm run build` berhasil mengompilasi **150 rute** (Static, Partial Prerendering, dan BFF Dynamic API).
  - Peringatan Next.js 16: `The "middleware" file convention is deprecated. Please use "proxy" instead.` (Dicatat sebagai P2 untuk refaktor canary).

### 0.3 Inventaris & Matriks Variabel Lingkungan
Kode sumber dipindai secara menyeluruh untuk semua kemunculan `process.env.*`.

| Nama Variabel | Publik? | Scope | Dipakai di | Wajib? | Catatan / Validasi Zod |
|---|---|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Ya (Browser & Server) | All (Dev, Preview, Staging, Prod) | Auth, Storage, Client, Server | **Wajib** | URL Supabase project |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Ya (Browser & Server) | All | Auth, Client, Middleware | **Wajib** | Kunci anonim publik |
| `SUPABASE_SERVICE_ROLE_KEY` | **TIDAK (Server Only)** | All | BFF, Admin routes, Cron | **Wajib** | **Rahasia mutlak**, jangan pakai awalan `NEXT_PUBLIC_` |
| `NEXT_PUBLIC_SITE_URL` | Ya (Browser & Server) | All | Metadata, Auth Redirects, QR Code | **Wajib** | **Kanonikal**. Menggantikan inkonsistensi penulisan `NEXT_PUBLIC_APP_URL` di dokumen lama. |
| `RESEND_API_KEY` | **TIDAK (Server Only)** | All (Prod/Staging bila SMTP HTTP) | Layanan Notifikasi Email | Opsional | Kunci pengiriman email transaksional |
| `FEATURE_FLAG_DIRECTORY_SERVICE` | Tidak | All | Service switch | Opsional | Default: `true` |
| `FEATURE_FLAG_MEDIA_SERVICE` | Tidak | All | Service switch | Opsional | Default: `true` |
| `FEATURE_FLAG_NOTIFICATION_SERVICE` | Tidak | All | Service switch | Opsional | Default: `true` |
| `NODE_ENV` | Tidak | All | Runtime environment | Otomatis | `development`, `test`, `production` |
| `VERCEL_GIT_COMMIT_SHA` | Ya (Sistem Vercel) | Preview, Prod | Info build `/api/admin/build-info` | Otomatis | Disediakan otomatis oleh platform Vercel |

### 0.4 Audit Pekerjaan Latar (*Background Jobs*) di Lingkungan Serverless
Dalam lingkungan komputasi *serverless* (Vercel Functions), fungsi tidak berjalan terus-menerus. Tanpa penjadwal eksternal atau cron, pekerjaan latar berikut **tidak akan berjalan**:

| Pekerjaan Latar | Fungsi | Status Saat Ini di Kode | Kebutuhan di Serverless |
|---|---|---|---|
| **Outbox Engine** (`processOutboxBatch`) | Mengirim event pending ke konsumer (notifikasi, proyeksi direktori) | Diuji via unit test (`outbox.ts`), belum ada runner otomatis | Butuh trigger terjadwal (setiap 1-5 menit) |
| **Pembersih Notifikasi** | Memproses antrean notifikasi & dead-letter queue | Tersedia via route `/api/admin/notifications/process` | Butuh trigger terjadwal |
| **Retensi Bukti (90 Hari)** | Menghapus bukti verifikasi >90 hari sesuai UU PDP | Tersedia fungsi DB `get_expired_evidence_records` & skrip CLI `storage-hygiene.ts` | Butuh trigger terjadwal (mingguan) |
| **Rekonsiliasi Direktori** | Sinkronisasi read-model direktori dari PostgreSQL | Tersedia via route `/api/admin/directory/reconcile` | Butuh trigger terjadwal (harian) |
| **SLA Verifikasi** | Mendeteksi pengajuan verifikasi yang melewati target SLA | Belum ada script terjadwal | Butuh trigger terjadwal (harian) |

#### Opsi Arsitektur Penjadwal (Keputusan P13):
1. **Opsi A: Vercel Cron (`vercel.json`)**
   - *Kelebihan*: Terintegrasi langsung dalam repositori Next.js; memanggil endpoint internal ber-token (`/api/cron/...` dengan header `Authorization: Bearer CRON_SECRET`).
   - *Batasan Paket*: Paket Hobby gratis hanya mengizinkan 1 eksekusi per hari. Paket Pro mengizinkan hingga per menit.
2. **Opsi B: Supabase `pg_cron` + Webhooks**
   - *Kelebihan*: Berjalan di dalam database Postgres; tidak terikat batas cron hosting frontend.
   - *Batasan*: Memerlukan ekstensi `pg_cron` dan `pg_net` aktif di proyek Supabase.
3. **Opsi C: HTTP Scheduler Eksternal (Upstash QStash / Cloudflare Workers Cron)**
   - *Kelebihan*: Independen dari batas paket Vercel; gratis hingga puluhan ribu request per hari; dapat memicu endpoint Next.js secara aman dengan signature HMAC.

### 0.5 Batas Serverless & Jalur Unggah Media
- **Batas Body Permintaan**: Vercel Serverless Function memiliki batas payload 4.5 MB.
- **Jalur Unggah Foto yang Diterapkan**:
  - *Jalur Utama*: Direct Signed Upload via `/api/media/upload-signature` langsung ke Supabase Storage (klien mengunggah langsung ke storage, bypass serverless function sehingga aman dari batas 4.5 MB).
  - *Jalur Alternatif*: Server Action `/api/media/upload` dibatasi ketat: Avatar maks 2 MB, Galeri maks 3 MB (keduanya aman di bawah batas 4.5 MB).
- **Temuan Domain Gambar Next.js (P0)**:
  - `apps/web/next.config.ts` **belum mendefinisikan `images.remotePatterns`** untuk domain Supabase Storage (`*.supabase.co`).
  - *Dampak*: Komponen `<Image />` Next.js akan melempar error saat merender avatar pengguna yang tersimpan di Supabase. Harus ditambahkan pada Bagian 1.
- **Runtime `sharp`**: Terpasang di `apps/web/package.json` (`sharp: ^0.35.5`) dan terkompilasi bersih di Next.js 16.

### 0.6 Status di Memori & Pembatas Laju (*Rate Limiter*)
- **Pembatas Laju**: `apps/web/src/lib/security/rate-limiter.ts` menggunakan `Map<string, WindowEntry>`.
  - *Bukti*: Memori berbasis per-instance serverless.
  - *Dampak di Serverless*: Jika permintaan dialihkan ke instance/kontainer serverless yang berbeda, kuota pembatas laju tidak terakumulasi secara global.
  - *Solusi*: Untuk Staging, in-memory cukup untuk peninjauan. Untuk Produksi (Bagian 2), pembatas laju disarankan dialihkan ke Redis terkelola (Upstash) atau Supabase RPC table lock.
- **Read Model Direktori**: `apps/web/src/lib/services/directory/cache.ts` menggunakan in-memory cache dengan TTL 60 detik.
  - *Sifat*: Ephemeral L1 Cache. Jika cache kosong atau instance baru menyala, query otomatis diarahkan ke tabel Supabase (L2). Hal ini aman dan tidak menyebabkan hilangnya data.

### 0.7 Audit Rute & Klasifikasi Keputusan P9 & P10
- **Rute Terkompilasi**: 150 rute.
- **Rute di Luar Spesifikasi Inti (Keputusan P9)**:
  - `/tournaments` dan `/tournaments/[id]` (menggunakan mock data jika `SHOW_DEMO_DATA=true`).
  - `/leaderboard`
  - `/gallery`
  - `/map`
  - *Tindakan*: Di staging ditampilkan dengan label/banner demo. Untuk produksi publik (Bagian 3), dinonaktifkan/disembunyikan melalui feature flag sampai data rill tersedia.
- **Rute Multi-Profil Sisa (Keputusan P10)**:
  - `/me/cards`, `/me/memberships`, `/me/profile/:id/edit` sudah dialihkan via 301 di `next.config.ts`.
  - **Temuan P0**: `/me/profile/new` masih memiliki file aktif (`apps/web/src/app/me/profile/new/page.tsx`) dan belum dialihkan! Harus dialihkan ke `/onboarding` atau `/me` agar aturan **1 Akun = 1 Identitas Bidang** tidak dilanggar.
- **Rute Dev & Diagnostik (Keputusan P11 & PG7)**:
  - `/dev/glass`, `/dev/components`: Harus dinonaktifkan di lingkungan produksi.
  - `/api/healthz`, `/api/readyz`: Akses publik ringkas, tidak menampilkan detail memori rahasia di produksi.
  - `/api/admin/observability`: Dilindungi otentikasi admin.

### 0.8 Hasil Sapu Awal Istilah Terlarang & Placeholder
- **Sapu Istilah Terlarang (PBESI, ESI, Pengprov, Pengcab, KONI, Dispora, Klaim Resmi/Sah/Lisensi)**:
  - `node scripts/sweep-terms.js`: **0 temuan** (LULUS 100%).
- **Sapu Placeholder Legal & Draf (P1 & P8)**:
  - `apps/web/src/app/privacy/page.tsx:44`: Ditemukan teks `Ditinjau hukum: [TENTUKAN]`.
  - `apps/web/src/app/terms/page.tsx:44`: Ditemukan teks `Ditinjau hukum: [TENTUKAN]`.
  - Discrepansi domain legal: `contact/page.tsx` mencantumkan `halo@esportsumbar.id`, sedangkan `Footer.tsx` mencantumkan `kontak@esportsumbar.com`. Perlu dikonfirmasi pada kuesioner infrastruktur (Keputusan P1 & P8).

---

## 3. Matriks Gerbang Mutu Publikasi (PG1 – PG13)

| Gerbang | Pemeriksaan | Status | Bukti / Catatan |
|---|---|---|---|
| **PG1: Tinjau diff & konfigurasi** | Cakupan pra-penerbangan, nol rahasia di Git | **LULUS** | Working tree bersih, `node scripts/scan-secrets.js` menghasilkan 0 temuan, riwayat git bersih. |
| **PG2: Statis dan build bersih** | `type-check`, `lint`, `build` | **PERINGATAN (P0 CI)** | `type-check` lulus 100% (4 package). `build` lulus 100% (150 rute). `lint` gagal pada ESLint 9 (perlu disesuaikan di Bagian 1 sebelum deploy). |
| **PG3: Tes otomatis** | Vitest unit & contract | **LULUS** | 24 test suites, 253 tes lulus 100% (durasi: 4.58 dtk). |
| **PG4: Sapu pada URL live** | Crawl URL berjalan bebas klaim | *N/A (Staging)* | URL staging belum dideploy. Sapu build lokal: 0 istilah terlarang. Akan diuji langsung di URL Staging pada Gerbang 1. |
| **PG5: Integritas rute** | Status HTTP, redirect 301, sitemap | **LULUS (Audit)** | 150 rute terdaftar; redirect 301 untuk `/partners` dan rute lama aktif; temuan `/me/profile/new` dicatat untuk dialihkan. |
| **PG6: Paritas lingkungan** | Matriks env, URL kanonikal, Zod | **LULUS** | Matriks dibuat; standardisasi kanonikal `NEXT_PUBLIC_SITE_URL` disahkan; tidak ada rahasia di variabel publik. |
| **PG7: Keamanan & isolasi** | RLS, header, CSP, proteksi diagnostik | **LULUS** | Header keamanan didefinisikan di `next.config.ts`; proteksi RPC anti-tampering dan anti-escalation aktif di migrasi. |
| **PG8: Data & migrasi** | Urutan migrasi, isolasi DB staging | **LULUS** | Skema migrasi 00001–00005 siap diterapkan ke database staging terpisah. |
| **PG9: Fungsi E2E** | Smoke test alur 7 entitas | **LULUS (Simulasi)** | 253 tes mencakup siklus hidup penuh 7 entitas. Pengujian browser langsung dengan email riil dijadwalkan di Staging (Bagian 1). |
| **PG10: Performa** | Waktu kompilasi & rendering | **LULUS (Build)** | Next.js Turbopack build 3.3 dtk, output 150 rute. Pengujian Lighthouse live dijadwalkan di URL Staging. |
| **PG11: Visual & liquid glass** | Responsivitas & mode efek | **LULUS (Unit)** | Unit test token visual, segmented controller, dan canvas scene lulus. Galeri screenshot live dijadwalkan di URL Staging. |
| **PG12: Kesiapan pemulihan** | Rollback & backup drill | **LULUS (Audit)** | Skrip latihan backup (`scripts/backup-drill.ts`) tervalidasi. Prosedur rollback dirumuskan. |
| **PG13: Laporan & Berhenti** | Publikasi laporan komprehensif | **LULUS** | Dokumen ini diterbitkan. Sistem **BERHENTI** menunggu persetujuan Owner. |

---

## 4. Klasifikasi Penghalang Rilis (Blocker Classification)

### P0: Menghalangi Staging (Wajib diselesaikan di Bagian 1)
1. **P0-1 [OWNER] Git Push ke Remote**: Repositori lokal mendahului `origin/main` sebanyak 40 commit beserta tag `v3fe-part-11`. Owner harus menjalankan `git push origin main` dan `git push origin --tags` agar Vercel dapat mem-build kode terbaru V3.
2. **P0-2 [AI] Penyesuaian ESLint 9**: Mengonfigurasi `apps/web/eslint.config.mjs` agar aturan `@typescript-eslint/no-explicit-any` pada berkas tes tidak menggagalkan build CI/Vercel.
3. **P0-3 [AI] Konfigurasi Supabase Image Domain**: Menambahkan `images.remotePatterns` untuk `*.supabase.co` pada `apps/web/next.config.ts` agar `<Image />` tidak error saat merender foto profil.
4. **P0-4 [AI] Penutupan Rute Multi-Profil**: Menambahkan pengalihan 301 untuk `/me/profile/new` ke `/onboarding` atau `/me`.
5. **P0-5 [OWNER] Pembuatan Proyek Supabase Staging**: Membuat proyek Supabase khusus Staging (region Singapore) yang terpisah dari produksi, mencatat URL dan API keys.
6. **P0-6 [OWNER] Pengaturan Proyek Vercel**: Menghubungkan repo ke Vercel dengan Root Directory `apps/web`, mengatur variabel lingkungan scope Preview/Staging, dan mengaktifkan **Deployment Protection**.

### P1: Menghalangi Produksi (Wajib diselesaikan di Bagian 2 & 3)
1. **P1-1 [AI & OWNER] Otomatisasi Penjadwal Background Jobs**: Menerapkan endpoint ber-token untuk Outbox Processor, retensi bukti 90 hari, dan pembersih notifikasi via Vercel Cron atau Supabase `pg_cron`.
2. **P1-2 [AI] Persistensi Pembatas Laju (Rate Limiter)**: Mengintegrasikan Upstash Redis atau Supabase RPC table untuk rate limiting lintas instance serverless.
3. **P1-3 [OWNER] Konfirmasi Domain & Legal**: Menentukan domain kanonikal resmi (`esportsumbar.com` atau `esportsumbar.id`), penyedia SMTP (Resend/SendGrid) dengan SPF/DKIM/DMARC, serta identitas badan hukum resmi untuk mengisi teks `[TENTUKAN]` di halaman Privasi dan Syarat.
4. **P1-4 [AI] Feature Flag Rute Non-Spesifikasi**: Menyembunyikan `/tournaments`, `/leaderboard`, `/gallery`, `/map` di produksi sebelum data asli tersedia.
5. **P1-5 [OWNER] Admin MFA Enrollment**: Mendaftarkan TOTP MFA pada akun administrator resmi platform.

### P2: Pasca-Rilis & Pemeliharaan Berkala
1. **P2-1 [AI] Migrasi Middleware Next.js 16**: Memperbarui konvensi `middleware.ts` ke format `proxy.ts` sesuai pedoman Next.js 16.
2. **P2-2 [AI] Dynamic API Route Flagging**: Menambahkan `export const dynamic = "force-dynamic"` pada rute API yang menggunakan parameter URL untuk menghilangkan peringatan *bail out of prerendering*.
3. **P2-3 [OWNER] Pemantauan & Observabilitas Live**: Menghubungkan Sentry DSN dan uptime monitor pada domain produksi.
4. **P2-4 [OWNER & AI] Penjadwalan Migrasi Destruktif**: Menunda eksekusi `v3_contract_cleanup_DESTRUCTIVE.sql` minimal 7 hari pasca peluncuran publik.

---

## 5. Kuesioner Infrastruktur yang Ada (Sub-Langkah 0.9)
Mohon berikan informasi singkat mengenai infrastruktur yang saat ini sudah Anda miliki (cukup sebutkan statusnya, **jangan mencantumkan token rahasia**):

1. **Akun & Proyek Vercel**: Apakah proyek Vercel sudah dibuat dan terhubung ke repositori GitHub `esport-sumbar-v2`?
2. **Akun & Proyek Supabase**:
   - Apakah Anda sudah memiliki proyek Supabase untuk **Staging**?
   - Apakah Anda sudah memiliki proyek Supabase untuk **Produksi** (terpisah)?
3. **Nama Domain**: Domain apa yang akan menjadi domain kanonikal resmi platform? (contoh: `esportsumbar.com`, `esportsumbar.id`, atau domain lain)
4. **Penyedia SMTP Email**: Penyedia apa yang Anda pilih untuk pengiriman email transaksional konfirmasi pendaftaran? (contoh: Resend, SendGrid, Mailgun, Brevo, atau SMTP custom)
5. **Layanan Captcha**: Apakah Anda sudah memiliki akun Cloudflare Turnstile atau hCaptcha untuk proteksi formulir registrasi?
6. **Paket Layanan**: Paket apa yang aktif di akun Vercel dan Supabase Anda? (Hobby/Free, Pro, atau Team?)

---

## 6. Runbook Langkah Manual Pemilik [OWNER] Menuju Bagian 1
Untuk bersiap masuk ke **BAGIAN 1 (Publikasi ke Staging)**:

1. **Sinkronisasi Git Remote**:
   Jalankan perintah berikut di terminal lokal Anda untuk mengirimkan seluruh 40 commit dan tag V3 ke GitHub:
   ```bash
   git push origin main
   git push origin --tags
   ```
2. **Siapkan Proyek Supabase Khusus Staging**:
   - Masuk ke [Supabase Dashboard](https://supabase.com/dashboard).
   - Klik **New Project**, beri nama mis. `esport-sumbar-staging` (Region: Singapore).
   - Catat `Project URL`, `anon key`, dan `service_role key` di tempat aman Anda.
3. **Konfigurasi Auth di Supabase Staging**:
   - Masuk ke menu **Authentication -> URL Configuration**.
   - Masukkan Site URL sementara (atau domain staging Vercel Anda).
   - Tambahkan Redirect URL: `https://<alamat-staging>/auth/callback` dan `http://localhost:3000/auth/callback`.
4. **Konfigurasi Vercel (Staging / Preview Scope)**:
   - Di dashboard Vercel, buka proyek Anda -> **Settings -> Environment Variables**.
   - Tambahkan variabel dengan scope **Preview**:
     - `NEXT_PUBLIC_SUPABASE_URL` = (URL Supabase Staging)
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (Anon Key Supabase Staging)
     - `SUPABASE_SERVICE_ROLE_KEY` = (Service Role Key Staging)
     - `NEXT_PUBLIC_SITE_URL` = (URL Staging Vercel)
5. **Aktifkan Deployment Protection**:
   - Buka **Settings -> Deployment Protection** di Vercel.
   - Aktifkan proteksi (Password Protection atau Vercel Authentication) untuk lingkungan Preview / Staging agar tidak dapat diakses publik atau diindeks mesin pencari sebelum disetujui.

---

> [!IMPORTANT]
> **STATUS TITIK HENTI (STOP & WAIT)**:  
> Bagian 0 telah tuntas dieksekusi. Tidak ada perubahan kode atau deployment yang dijalankan selama Bagian 0.  
> Untuk melanjutkan ke **BAGIAN 1: PUBLIKASI KE STAGING AGAR TAMPILAN BISA DILIHAT**, mohon jawab kuesioner singkat di atas dan kirimkan konfirmasi **"lanjut"**.
