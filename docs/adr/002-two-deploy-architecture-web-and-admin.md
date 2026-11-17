# ADR 002: Arsitektur Dua Deploy Terpisah (Web Utama & Admin Portal) ke Satu Database Bersama

**Status**: Diterima (Accepted)  
**Tanggal**: 17 November 2026  
**Penulis**: Staff Software Engineer & Security Architect  
**Cakupan**: Monorepo (`apps/web`, `apps/admin`, `packages/domain`)

---

## 1. Konteks dan Masalah

Pada versi sebelumnya, portal admin (`/admin/*`) berada di dalam satu aplikasi Next.js yang sama dengan situs web publik (`apps/web`). Hal ini menimbulkan risiko keamanan dan performa yang signifikan:
1. **Permukaan Serangan Bersama (*Shared Attack Surface*)**: Kode rute admin, logika verifikasi, dan komponen manajemen sensitif masuk ke dalam bundel JavaScript yang dilayani ke pengguna umum.
2. **Ketiadaan Isolasi Sesi (*Session Leakage Risk*)**: Pengguna publik dan administrator berpotensi berbagi sesi atau cookie jika tidak diisolasi secara ketat di tingkat domain.
3. **Penyatuan Risiko Deployment (*Single Point of Blast Radius*)**: Bug atau kegagalan deploy pada modul admin dapat melumpuhkan situs web publik yang sedang diakses atlet dan masyarakat, begitu pula sebaliknya.
4. **Pembengkakan Ukuran Bundel (*Bundle Bloat*)**: Ketergantungan pustaka admin (tabel data besar, editor teks kaya, grafik analitik) memperbesar ukuran bundel web publik.

---

## 2. Keputusan Arsitektur

Kami memutuskan untuk memisahkan portal admin dan situs web utama menjadi **dua aplikasi mandiri yang dideploy secara terpisah**, namun terhubung ke **satu basis data Supabase produksi yang sama**:

```
                                  +-----------------------------+
                                  |    Satu Supabase Produksi   |
                                  | (Postgres, Auth, Storage)   |
                                  +--------------+--------------+
                                                 |
                       +-------------------------+-------------------------+
                       |                                                   |
                       v                                                   v
         +---------------------------+                       +---------------------------+
         |     Deploy 1: Web Utama   |                       |    Deploy 2: Admin Portal |
         |       (apps/web)          |                       |       (apps/admin)        |
         |  www.esportsumbar.com     |                       |   admin.esportsumbar.com  |
         +-------------+-------------+                       +-------------+-------------+
                       |                                                   |
                       +-------------------------+-------------------------+
                                                 |
                                  +--------------v--------------+
                                  |  packages/domain (Shared)   |
                                  |  Server-Only Business Logic |
                                  |  (Outbox, Verifikasi, CMS)  |
                                  +-----------------------------+
```

### Spesifikasi Teknis:
1. **Pemisahan Aplikasi Monorepo**:
   - `apps/web`: Khusus publik, direktori, pendaftaran, onboarding, dan profil atlet (mode pemilik). Rute `/admin/*` dialihkan (301) ke domain admin.
   - `apps/admin`: Khusus portal pengurus/admin (manajemen atlet, antrean verifikasi, CMS berita/banner, audit log, pengaturan sistem).
2. **Paket Modul Server Bersama (`packages/domain`)**:
   - Logika bisnis server-only (Transactional Outbox, Layanan Verifikasi, Layanan Notifikasi, Manajemen Media, Layanan Konten/CMS, Layanan Direktori) diekstrak ke `packages/domain`.
   - Dilarang keras mengimpor `packages/domain` ke dalam komponen klien (`"use client"`). Aturan ini ditegakkan melalui pemindai batas impor di CI (`scripts/ci/check-import-boundaries.mjs`).
3. **Isolasi Cookie & Autentikasi Admin**:
   - Admin menggunakan domain terpisah (misalnya `admin.esportsumbar.com` atau `admin-esport-sumbar.vercel.app`).
   - Cookie sesi admin bersifat **Host-Only** (`__Host-` prefix pada HTTPS), sehingga tidak dapat dibaca atau dibagikan ke subdomain web utama.
   - Admin wajib mengaktifkan autentikasi multifaktor (MFA TOTP) dan memiliki durasi sesi pendek (maksimal 4 jam tidak aktif).
4. **Header Keamanan & Noindex**:
   - `apps/admin` dilengkapi header `X-Robots-Tag: noindex, nofollow, noarchive` di seluruh rute untuk mencegah perayapan mesin pencari.
   - Content Security Policy (CSP) ketat tanpa `unsafe-inline` pada skrip pihak ketiga.
5. **Komunikasi & Revalidasi Cache Terdistribusi**:
   - Admin beroperasi langsung terhadap basis data bersama via `packages/domain`.
   - Untuk memicu invalidasi cache (ISR / tag revalidation) pada situs web publik saat artikel atau banner diubah, admin mengirimkan webhook internal bertanda tangan **HMAC-SHA256 dengan timestamp anti-replay**.

---

## 3. Konsekuensi dan Mitigasi

| Konsekuensi | Dampak | Mitigasi |
|---|---|---|
| **Dua Proyek Vercel Terpisah** | Memerlukan pengaturan variabel lingkungan di dua proyek. | Dibuat Runbook resmi (`docs/runbooks/RUNBOOK-TWO-DEPLOY-ADMIN-CUTOVER.md`) dengan daftar variabel eksak. |
| **Pengalihan Tautan Lama** | Tautan admin lama di bookmark atau histori peramban. | `apps/web` mengonfigurasi middleware 301 permanen dari `/admin/:path*` ke domain admin. |
| **Batas Impor Kode** | Risiko kebocoran kode server-only ke bundle klien. | Pemindai CI otomatis `check-import-boundaries.mjs` dijalankan pada setiap pull request dan build. |
