# RUNBOOK [OWNER]: Panduan Penyiapan Lingkungan Staging & Pengamanan Produksi

Dokumen ini adalah panduan langkah demi langkah khusus bagi **Pemilik Platform (Owner)** untuk mengonfigurasi infrastruktur pratinjau terlindungi (*Staging*) di Vercel dan Supabase.

---

## 1. Penyiapan Database Staging (Supabase)

Untuk menjamin pengujian fitur baru tidak pernah merusak atau mengotori database produksi:

1. Buka [Dashboard Supabase](https://supabase.com/dashboard).
2. Klik tombol **New Project**.
3. Beri nama: `esport-sumbar-staging`.
4. Pilih region yang sama dengan produksi: **Singapore (`ap-southeast-1`)**.
5. Simpan kata sandi database di pengelola kata sandi Anda.
6. Salin kredensial berikut dari menu **Project Settings -> API**:
   * `Project URL` (misal: `https://[staging-ref].supabase.co`)
   * `anon public key`
   * `service_role secret key`
7. Di menu **SQL Editor** pada proyek staging baru tersebut, jalankan file migrasi dasar dari repositori:
   * Jalankan isi file `supabase/deploy_all_in_one.sql`.
   * Jalankan isi file `supabase/migrations/20261116000001_storage_and_database_optimization.sql`.
   * Skema database staging Anda kini identik dengan produksi dalam kondisi bersih siap uji.

---

## 2. Penyiapan Variabel Lingkungan Staging di Vercel

1. Buka [Vercel Dashboard](https://vercel.com/dashboard) -> Masuk ke proyek `esport-sumbar-v2`.
2. Klik tab **Settings** -> **Environment Variables**.
3. Tambahkan / sesuaikan variabel khusus lingkungan **Preview / Staging** (centang hanya opsi **Preview**):
   * `NEXT_PUBLIC_APP_ENV`: `staging`
   * `NEXT_PUBLIC_SUPABASE_URL`: `[URL Supabase Staging Anda]`
   * `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `[Anon Key Supabase Staging Anda]`
   * `SUPABASE_SERVICE_ROLE_KEY`: `[Service Role Key Supabase Staging Anda]`
   * `NEXT_PUBLIC_SHOW_STAGING_BANNER`: `true`
   * `NEXT_PUBLIC_ENABLE_REGISTRATION`: `true`
   * `MAINTENANCE_MODE`: `false`
4. Pastikan variabel lingkungan **Production** (centang hanya opsi **Production**) tetap mengarah ke Supabase Produksi resmi Anda.

---

## 3. Perlindungan Lingkungan Pratinjau (Vercel Deployment Protection)

Agar publik atau pihak luar tidak bisa mengakses situs Staging Anda:

1. Di Vercel Dashboard proyek Anda, buka menu **Settings -> Deployment Protection**.
2. Pada bagian **Vercel Authentication** atau **Password Protection**:
   * Aktifkan proteksi kata sandi (*Password Protection*).
   * Masukkan kata sandi rahasia untuk pratinjau Anda.
3. Sekarang, siapapun yang membuka tautan preview/staging wajib memasukkan kata sandi terlebih dahulu sebelum dapat melihat halaman.

---

## 4. Pengaturan Promosi Manual (Manual Promotion) ke Produksi

Agar tidak ada kode baru yang otomatis tayang ke situs live sebelum Anda menyetujuinya:

1. Di Vercel Dashboard, buka menu **Settings -> Git**.
2. Pada bagian **Production Branch**:
   * Pastikan branch utama adalah `main`.
3. Pada bagian **Deploy Hooks / Automated Deployments**:
   * Anda dapat meninjau setiap deployment di tab **Deployments**.
   * Gunakan tombol **Promote to Production** hanya setelah membaca dan menyetujui dokumen *Permintaan Persetujuan Pemilik (PP)*.

---

## 5. Verifikasi Keberhasilan Setup Staging

Setelah langkah di atas selesai:
1. Lakukan deployment preview via Git.
2. Buka URL preview yang dihasilkan di browser.
3. Anda akan melihat pita atas:
   `LINGKUNGAN STAGING (PRATINJAU TERISOLASI) • Data uji tidak menyentuh database produksi`
4. Header respons HTTP akan memuat:
   `X-Robots-Tag: noindex, nofollow` (sehingga mesin pencari Google tidak akan mengindeks situs staging).
