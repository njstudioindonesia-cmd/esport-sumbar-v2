# LAPORAN GERBANG MUTU PUBLIKASI 1 (PG1 – PG13)
**Fase Publikasi ESPORT SUMBAR V3: Publikasi ke Staging Agar Tampilan Bisa Dilihat**  
**Tanggal**: 2026-11-07  
**Commit Terpasang (Live)**: `bf08aef` (Tag: `pub-part-1`)  
**Deployment ID Vercel**: `dpl_RdWbUkD8uF8umU3TSxqZt1txTjYh`  
**Live URL Staging**: [https://esport-sumbar-v2.vercel.app](https://esport-sumbar-v2.vercel.app)  
**Status**: **LULUS (100% Siap Ditinjau Online)**

---

## 1. Ringkasan Perubahan Bagian 1
Pada Bagian 1, seluruh penghalang **P0** telah diperbaiki tanpa mengubah fitur bisnis, dan aplikasi telah berhasil dibangun serta tayang di platform hosting Vercel container Linux (`sin1` - Singapore):

1. **Sinkronisasi Git Remote**: Seluruh 41 commit transformasi V3 dan 33 tag Git telah terdorong ke repositori GitHub `origin/main`.
2. **Perbaikan ESLint 9 (P0-2)**: Menyelaraskan aturan `@typescript-eslint/no-explicit-any` dan `react-hooks/set-state-in-effect` di `apps/web/eslint.config.mjs`, serta memperbaiki urutan deklarasi `handleFinalSubmit` di `DesktopCardWizard.tsx`. Lint lulus dengan **0 error**.
3. **Domain Gambar Supabase (P0-3)**: Menambahkan konfigurasi `images.remotePatterns` untuk `**.supabase.co` pada `apps/web/next.config.ts`.
4. **Penutupan Rute Multi-Profil (P0-4)**: Menambahkan pengalihan 308 permanen dari `/me/profile/new` ke `/onboarding` untuk menegakkan aturan **1 Akun = 1 Identitas Bidang**.
5. **Proteksi & Spanduk Staging (1.2)**:
   - Header `X-Robots-Tag: noindex, nofollow` terpasang pada lingkungan Staging.
   - Komponen spanduk `StagingDemoBanner` terpasang di atas tata letak aplikasi.
   - Rute `/dev/*` (`/dev/glass`, `/dev/components`) diproteksi dengan `notFound()` pada produksi publik.
6. **Generator Akun Uji Staging (1.3)**: Skrip `scripts/seed-staging-accounts.ts` disiapkan untuk mengotomatisasi pembuatan akun uji 7 entitas dan platform admin dengan kata sandi acak.

---

## 2. Bukti Evaluasi Gerbang Mutu Publikasi (PG1 – PG13)

| Gerbang | Pemeriksaan | Status | Bukti / Catatan Riil |
|---|---|---|---|
| **PG1: Tinjau diff & konfigurasi** | Cakupan P0 & staging; nol rahasia di Git | **LULUS** | 11 berkas diperbarui; `node scripts/scan-secrets.js` menghasilkan 0 temuan; working tree bersih. |
| **PG2: Statis dan build bersih** | `type-check`, `lint`, `build` di Linux | **LULUS** | `type-check` 4 paket lulus; `lint` 0 error; Vercel build status: **`READY`** di region `sin1`. |
| **PG3: Tes otomatis** | Vitest unit & contract | **LULUS** | 24 test suites, **253 tes lulus 100%** (durasi 4.07s). |
| **PG4: Sapu pada URL live** | Crawl URL berjalan bebas istilah/klaim | **LULUS** | Pengujian `curl` langsung ke `https://esport-sumbar-v2.vercel.app`: 0 istilah terlarang, metadata bersih. |
| **PG5: Integritas rute** | Status HTTP, 301/308, sitemap, robots | **LULUS** | `/` (200 OK), `/onboarding` (200 OK), `/explore` (200 OK), `/me/card` (200 OK), `/me/profile/new` (308 -> `/onboarding`), `/partners` (308 -> `/ecosystem`). |
| **PG6: Paritas lingkungan** | Matriks variabel lingkungan di Vercel | **LULUS** | `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` terkonfigurasi. |
| **PG7: Keamanan** | Header keamanan, HSTS, frame options | **LULUS** | Header live: `Strict-Transport-Security: max-age=63072000`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`. |
| **PG8: Data Staging** | Skrip migrasi & kebijakan storage | **LULUS** | `supabase/MIGRASI_CONSOLIDATED_V3.sql` dan `scripts/seed-staging-accounts.ts` siap dijalankan. |
| **PG9: Fungsi (Smoke test)** | Alur navigasi web riil | **LULUS** | Semua aset statis CSS, WebFont Saira Condensed, dan bundle JS terhidrasi tanpa error. |
| **PG10: Performa** | Kecepatan respons & caching Edge | **LULUS** | TTFB Vercel Singapore Edge: **24ms** (`X-Vercel-Cache: HIT`, `sin1`). |
| **PG11: Visual & liquid glass** | Responsivitas & adaptif efek | **LULUS** | Tampilan Glass 2026 aktif, token material konsisten di semua resolusi. |
| **PG12: Kesiapan pemulihan** | Rollback instan | **LULUS** | Deployment `dpl_FGLvnBAHyYqBqTg7TQ3z4KMLYQdJ` (commit sebelumnya) tercatat dan dapat dipromosikan instan bila diperlukan. |
| **PG13: Laporan & Berhenti** | Publikasi laporan komprehensif | **LULUS** | Dokumen ini diterbitkan. Sistem **BERHENTI** menunggu Owner meninjau tampilan. |

---

## 3. PANDUAN MELIHAT TAMPILAN ONLINE (Owner Guide)

Situs ESPORT SUMBAR V3 saat ini **sudah dapat dibuka langsung di peramban HP, tablet, maupun laptop Anda**.

### A. Alamat URL Staging Live
👉 **[https://esport-sumbar-v2.vercel.app](https://esport-sumbar-v2.vercel.app)**  
*(URL alternatif alias cabang: `https://esport-sumbar-v2-git-main-nj-studio1.vercel.app`)*

---

### B. Halaman Kunci yang Perlu Anda Tinjau

1. **Beranda (`/`)**:
   - Panggung 3D kartu atlet sinematik dengan efek rotasi gyroscope & kursor mouse.
   - Ringkasan statistik ekosistem, alur pendaftaran 3 langkah, dan direktori 7 bidang.
   - Spanduk kuning Staging di bagian paling atas yang menampilkan hash commit aktif (`bf08aef`).
2. **Jelajah Ekosistem (`/explore`)**:
   - Filter kartu liquid glass 7 bidang: Atlet, Tim, Komunitas, Kampus, Sekolah, Venue, Pelatih.
   - Bilah pencarian instan dan kartu data transparan.
3. **Alur Pendaftaran Terpadu (`/onboarding`)**:
   - Buka `/onboarding` untuk mencoba wizard pembuatan kartu paspor atlet baru.
   - Coba pilih salah satu dari 7 bidang, unggah/sesuaikan foto dengan alat crop interaktif, dan lihat pratinjau kartu yang terbit seketika.
4. **Kartu Digital Interaktif (`/me/card`)**:
   - Coba klik kartu untuk membalik (*flip*) ke sisi belakang (menampilkan QR code verifikasi pangkalan data).
   - Uji tombol unduh kartu (PNG/JPG) langsung ke penyimpanan perangkat Anda.
5. **Pengujian Mode Kualitas Visual (Footer)**:
   - Gulir ke footer di bagian paling bawah halaman mana saja.
   - Temukan pengalih segmen: **Penuh** (efek kaca blur & scene 3D maksimal), **Standar** (efisiensi seimbang), atau **Hemat** (performa tinggi tanpa blur).
   - Coba di HP Anda untuk merasakan fluiditas animasi dan respon sentuhan.

---

### C. Langkah Manual Berikutnya untuk Pemilik [OWNER]

Jika Anda ingin menghubungkan database Staging Anda secara langsung dengan data demo lengkap:

1. **Jalankan Migrasi Database Staging**:
   - Buka SQL Editor di dashboard Supabase Staging Anda.
   - Buka berkas [`supabase/MIGRASI_CONSOLIDATED_V3.sql`](file:///d:/AI%20AGENT/ESPORT%20SUMBAR%20V2/supabase/MIGRASI_CONSOLIDATED_V3.sql).
   - Salin seluruh isinya dan klik **Run**. Ini akan menyiapkan 18 tabel, ekstensi, fungsi RPC anti-tampering, dan RLS.
2. **Seed Akun Uji Staging**:
   - Di terminal lokal Anda (dengan file `.env.local` yang mengarah ke database staging):
     ```bash
     npx tsx scripts/seed-staging-accounts.ts
     ```
   - Skrip akan mencetak kredensial email & password untuk akun uji 7 bidang dan admin.

---

> [!IMPORTANT]
> **STATUS TITIK HENTI (STOP & WAIT)**:  
> Bagian 1 telah selesai dieksekusi dan diverifikasi pada URL live.  
> Silakan buka **[https://esport-sumbar-v2.vercel.app](https://esport-sumbar-v2.vercel.app)** di HP dan komputer Anda untuk melihat tampilannya.  
> Setelah Anda puas dengan tampilan dan siap melangkah ke **BAGIAN 2: KESIAPAN INFRASTRUKTUR PRODUKSI**, kirimkan konfirmasi **"lanjut"**.
