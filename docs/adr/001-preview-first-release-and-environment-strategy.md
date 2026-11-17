# ADR 001: Strategi Rilis Pratinjau-Dulu, Isolasi Lingkungan, dan Keselamatan Produksi

**Status:** Diterima (Accepted)  
**Tanggal:** 16 November 2026  
**Penulis:** Tim Arsitektur & Keandalan ESPORT SUMBAR V3  
**Konteks:** Situs sudah live (`https://esport-sumbar-v2.vercel.app/`) dan memiliki akun pengguna aktif.  

---

## 1. Konteks dan Masalah

ESPORT SUMBAR V3 beroperasi di lingkungan produksi nyata. Segala bentuk regresi, downtime, atau paparan data dummy akan langsung merusak kepercayaan publik dan mitra PBESI Sumatera Barat. Dibutuhkan mekanisme pemisahan lingkungan yang ketat agar:
1. Tidak ada perubahan yang menyentuh pengguna live sebelum disetujui secara tertulis oleh Pemilik (*Owner Approval*).
2. Perubahan kode atau skema database dapat ditinjau dan diuji secara visual di lingkungan pratinjau (*Staging*) dengan data uji yang terisolasi total dari database produksi.
3. Arsitektur masa depan memisahkan deployment situs publik (`apps/web`) dan portal administrasi (`apps/admin`) pada satu database PostgreSQL terpusat.

---

## 2. Keputusan Arsitektur

### 2.1 Pemisahan Tiga Lingkungan (Three-Tier Topology)

| Lingkungan | Domain / Alamat | Database Supabase | Tujuan & Hak Akses |
|---|---|---|---|
| **Preview (PR)** | `*.vercel.app` (ephemeral) | Supabase Local / Staging (Mocked) | Verifikasi otomatis CI/CD untuk setiap Pull Request. |
| **Staging (Pratinjau Stabil)** | `staging.esportsumbar.id` (atau alias preview terlindungi Vercel) | **Proyek Supabase Staging Terpisah** | Pratinjau visual pemilik dan pengujian integrasi akhir. Terlindungi otentikasi sandi Vercel Deployment Protection. |
| **Produksi (Live)** | `esportsumbar.id` & `www.esportsumbar.id` (sementara `esport-sumbar-v2.vercel.app`) | **Proyek Supabase Produksi Resmi** | Hanya melayani pengguna publik nyata. **Tidak auto-deploy** dari branch feature; hanya promosi manual setelah disetujui. |

### 2.2 Isolasi Database Staging vs Produksi
* **Prinsip Utama:** Lingkungan Staging **DILARANG KERAS** menggunakan kredensial database produksi.
* Kunci `SUPABASE_SERVICE_ROLE_KEY` dan `NEXT_PUBLIC_SUPABASE_URL` pada proyek Vercel Staging mengarah ke instance database staging terpisah.
* Data di Staging terdiri dari data sintetis berlabel `is_demo = true` atau data anonim yang telah disanitasi tanpa memuat NIK, nomor telepon, atau identitas privat pengguna nyata.

### 2.3 Promosi Manual ke Produksi & Persetujuan Pemilik (Owner Approval)
1. Branch `main` hanya menerima commit yang telah lulus seluruh 16 Gerbang Mutu Rilis (RG1-RG16).
2. Deployment Vercel Produksi dikonfigurasi dengan **Manual Promotion** / GitHub Environment `production` yang mewajibkan peninjau tunggal: **Pemilik Platform**.
3. Sebelum promosi dilakukan, diterbitkan dokumen **Permintaan Persetujuan Pemilik (PP)** di `docs/releases/` yang memuat ringkasan perubahan, URL staging, bukti uji, analisis risiko, dan rencana rollback instan.

### 2.4 Mode Pemeliharaan dan Pembatasan Registrasi (Kill-Switches)
* **`MAINTENANCE_MODE=true`:** Mengalihkan seluruh lalu lintas publik non-admin secara otomatis ke `/maintenance`.
* **`NEXT_PUBLIC_ENABLE_REGISTRATION=false`:** Mengunci form pendaftaran publik sementara waktu tanpa mematikan fungsi login bagi pengguna yang sudah terdaftar.
* **`OWNER_ONLY_PREVIEW=true`:** Memungkinkan admin/pemilik dengan cookie bertanda tangan khusus melihat fitur baru langsung di lingkungan live tanpa memengaruhi tampilan pengguna umum.

---

## 3. Konsekuensi dan Mitigasi

* **Konsekuensi:** Diperlukan penyediaan proyek Supabase Staging dan konfigurasi variabel terpisah di dashboard Vercel oleh Pemilik.
* **Mitigasi:** Disediakan Runbook terperinci langkah-demi-langkah bagi Pemilik (`docs/runbooks/RUNBOOK-STAGING-SETUP.md`) yang hanya memerlukan waktu eksekusi ~10 menit.
