# RUNBOOK OPERASIONAL: PROSEDUR RILIS & ROLLBACK DARURAT
**Platform ESPORT SUMBAR V3**  
**Versi**: 3.0.0  
**Tanggal**: 2026-11-07  
**Otoritas**: Release Manager & Tim Teknis ESPORT SUMBAR  

---

## 1. Ambang Batas Pembatalan Rilis (Rollback Triggers - Keputusan P14)
Operasi rilis atau deployment produksi **WAJIB SEGERA DIBATALKAN (ROLLBACK)** jika salah satu dari kondisi berikut terdeteksi dalam 72 jam pertama:

| Metrik Pemantauan | Ambang Batas Kritis | Jendela Waktu | Tindakan Otomatis |
|---|---|---|---|
| **Tingkat Error Global (HTTP 5xx)** | > 2.0% dari total permintaan | 5 Menit Berturut-turut | Promosikan deployment sebelumnya di Vercel |
| **Kegagalan Otentikasi / Registrasi** | > 10% kegagalan login/signup | 3 Menit | Aktifkan `MAINTENANCE_MODE` / investigasi auth callback |
| **Latensi API (p95 Response Time)** | > 1,500 ms (1.5 detik) | 3 Menit Bertahan | Beralih ke degradasi graceful / mode hemat |
| **Pelanggaran Keamanan / Data Leak** | Terdeteksi anomali RLS / akses silang | Seketika (0 Menit) | **HARD STOP**: Putus akses API, rollback total |

---

## 2. Prosedur Rilis Bertahap (Phased Rollout)

### Fase A: Staging Terlindungi (Status Saat Ini)
- URL: `https://esport-sumbar-v2.vercel.app`
- Database: Proyek Supabase Staging (`gxtzbyeqdmhtddgesbxb.supabase.co`)
- Proteksi: Header `X-Robots-Tag: noindex, nofollow`, spanduk `StagingDemoBanner`.
- Verifikasi: Pengujian 7 entitas menggunakan akun uji staging.

### Fase B: Produksi Soft Launch (Tertutup)
1. Buat database Produksi bersih tanpa data demo.
2. Terapkan migrasi skema 00001–00005.
3. Hubungkan Vercel Production Environment Variables ke database produksi.
4. Set flag pendaftaran terbatas untuk kelompok kecil terverifikasi.
5. Pertahankan `noindex` selama soft launch.

### Fase C: Peluncuran Publik Penuh
1. Hapus `noindex`, terbitkan `sitemap.xml`.
2. Arahkan domain apex (`esportsumbar.com` / `esportsumbar.id`) dengan SSL aktif.
3. Mulai jendela **Hypercare 72 Jam**.

---

## 3. Prosedur Rollback Instan Aplikasi (< 60 Detik)

Jika terjadi anomali aplikasi pada versi terbaru:

### Langkah di Dashboard Vercel [OWNER]:
1. Masuk ke [Vercel Dashboard](https://vercel.com) -> Buka Proyek `esport-sumbar-v2`.
2. Buka tab **Deployments**.
3. Cari deployment sebelumnya yang berstatus **Ready** (misal: deployment `dpl_FGLvnBAHyYqBqTg7TQ3z4KMLYQdJ` commit `2e1f8be`).
4. Klik tombol menu tiga titik (**...**) di kanan baris deployment tersebut.
5. Pilih **Promote to Production**.
6. Konfirmasi promosi. Vercel Edge Network akan mengalihkan 100% lalu lintas ke versi stabil tersebut dalam waktu kurang dari 30 detik tanpa downtime.

### Langkah Cepat via Vercel CLI (Alternatif Terminal):
```bash
npx vercel rollback
```

---

## 4. Prosedur Pengaktifan Mode Pemeliharaan (Maintenance Mode)

Jika terjadi kendala pada pihak ketiga (Supabase down atau jaringan payment/email bermasalah):

1. Masuk ke Vercel Dashboard -> **Settings -> Environment Variables**.
2. Ubah variabel `MAINTENANCE_MODE` menjadi `true`.
3. Klik **Save** dan jalankan **Redeploy** (atau tunggu request berikutnya jika menggunakan runtime config).
4. Pengguna publik yang mengakses platform akan disambut oleh halaman ramah di `/maintenance`:
   *"Platform ESPORT SUMBAR sedang dalam peningkatan sistem terjadwal. Data Anda aman dan layanan akan segera kembali normal."*

---

## 5. Prosedur Rollback Pangkalan Data (Database Rollback)

1. **Aturan Utama (Rule 5 & ADR-002)**:
   - Pola migrasi V3 adalah **Expand and Contract**.
   - Kolom dan fungsi baru bersifat non-destruktif (*additive*).
   - Skrip destruktif `v3_contract_cleanup_DESTRUCTIVE.sql` **DILARANG DIJALANKAN** dalam 7 hari pertama peluncuran.
2. **Pemulihan dari Snapshot Cadangan**:
   - Jika terjadi korupsi data logis:
     1. Buka Supabase Dashboard -> **Database -> Backups**.
     2. Pilih titik pemulihan (*Point-in-Time Recovery* / Daily Backup) sebelum insiden terjadi.
     3. Klik **Restore Backup**.
     4. Jalankan `npx tsx scripts/verify-supabase-readiness.ts` untuk memverifikasi integritas 10 tabel inti dan 3 bucket.

---

## 6. Prosedur Penanganan Background Jobs Macet

Jika outbox atau notifikasi menumpuk:
1. Pemicu manual via endpoint token internal:
   ```bash
   curl -X POST https://esport-sumbar-v2.vercel.app/api/cron/dispatch \
     -H "Authorization: Bearer <CRON_SECRET>"
   ```
2. Periksa respons JSON:
   - Memastikan `outbox.processedCount` meningkat.
   - Memastikan `notifications.sentCount` meningkat.
   - Memastikan `status` bernilai `success`.
