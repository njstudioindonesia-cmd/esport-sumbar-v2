# Runbook: Rotasi Kunci & Kredensial Rahasia (KEY_ROTATION.md)

**Proyek**: ESPORT SUMBAR V3  
**Siklus Rutin**: Setiap 90 Hari atau Pasca-Insiden Keamanan  

---

## 1. Daftar Kunci Rahasia Sistem

| Nama Kunci / Rahasia | Lokasi Penggunaan | Dampak Rotasi |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser & Server (Client Sesi Auth) | Sesi pengguna tetap aktif jika JWT Secret tidak berubah |
| `SUPABASE_SERVICE_ROLE_KEY` | Server Runtime Only (Admin Actions / BFF) | Kueri admin sempat gagal jika tidak diperbarui serentak |
| `SERVICE_TOKEN_SECRET` | Server Runtime Only (BFF Inter-service HMAC) | Panggilan internal antar-layanan gagal jika token kadaluwarsa |
| `SUPABASE_JWT_SECRET` | Supabase Auth Engine | Seluruh sesi login pengguna akan di-invalidate (logout serentak) |
| `DATABASE_PASSWORD` | Koneksi Langsung PostgreSQL (Direct Connection) | Migrasi CLI & koneksi langsung sempat terputus |

---

## 2. Prosedur Rotasi `SERVICE_TOKEN_SECRET` (Zero-Downtime)

1. **Siapkan Rahasia Baru**:
   - Buat string acak berkekuatan tinggi (minimal 64 karakter heksadesimal):
     ```bash
     node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
     ```
2. **Pembaruan Bertahap (Dual-Key Transition)**:
   - Pasang rahasia baru sebagai `SERVICE_TOKEN_SECRET_NEW` pada dashboard hosting.
   - Perbarui kode verifikasi untuk mencoba `SERVICE_TOKEN_SECRET` terlebih dahulu, lalu `SERVICE_TOKEN_SECRET_NEW` sebagai fallback.
   - Beralih penuh setelah 5 menit (karena TTL token inter-service hanya 300 detik).
   - Hapus rahasia lama.

---

## 3. Prosedur Rotasi `SUPABASE_SERVICE_ROLE_KEY`

1. Masuk ke **Supabase Dashboard** -> Pilih Proyek ESPORT SUMBAR.
2. Buka **Project Settings** -> **API**.
3. Gulir ke bagian **Project API Keys**.
4. Klik **Rotate Key** pada `service_role`.
5. Salin kunci baru segera.
6. Perbarui variabel lingkungan di platform Vercel / Docker:
   - `SUPABASE_SERVICE_ROLE_KEY=<KUNCI_BARU>`
7. Lakukan redeploy untuk memuat variabel baru ke memori worker serverless.
8. Verifikasi dengan menjalankan skrip audit:
   ```bash
   npx tsx scripts/verify-client-db-isolation.js
   ```

---

## 4. Prosedur Darurat: Kebocoran Rahasia (Leaked Secret Remediation)

Jika suatu kunci terindikasi bocor ke publik atau repositori publik:
1. **SEGERA** cabut dan generate ulang kunci tersebut di dasbor penyedia dalam < 15 menit.
2. Perbarui seluruh environment di Vercel dan redeploy.
3. Tinjau log akses Supabase API untuk mendeteksi kueri mencurigakan dalam 24 jam terakhir.
4. Terbitkan laporan insiden SEV-1.
