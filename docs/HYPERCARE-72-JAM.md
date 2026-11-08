# PROTOKOL OPERASIONAL HYPERCARE 72 JAM
**Platform**: ESPORT SUMBAR™ (V3 Modular Monorepo)  
**Versi Rilis**: `v3.0.0` (Commit: `2a36a1d`)  
**Target Domain**: `https://esport-sumbar-v2.vercel.app`  
**Periode Hypercare**: 8 November 2026 s/d 11 November 2026 (72 Jam Pertama)  

---

## 1. Ambang Batas Metrik Kritis (Health Thresholds)

Selama 72 jam pertama peluncuran publik, metrik operasional berikut dipantau secara ketat:

| Parameter Metrik | Ambang Normal | Ambang Waspada (Warning) | Ambang Batalkan Rilis (Rollback) | Tindakan Segera |
|---|:---:|:---:|:---:|---|
| **Error Rate (HTTP 5xx)** | < 0.1% | 0.5% - 1.0% | > 2.0% dalam 5 menit | Rollback instan ke deployment sebelumnya |
| **Kegagalan Auth (Login/Daftar)** | < 1.0% | 1.0% - 3.0% | > 5.0% | Periksa Supabase Auth & kuota SMTP |
| **Latensi Respon (p95)** | < 300ms | 300ms - 800ms | > 1,500ms berkelanjutan | Investigasi beban kueri database |
| **Outbox Queue Backlog** | 0 event | 1 - 20 event | > 50 event tertahan > 15m | Picu `/api/cron/dispatch` manual |
| **Dead-Letter Notifications** | 0 notif | 1 - 5 notif | > 10 notif gagal kirim | Cek log `/api/admin/notifications/dead-letter` |
| **Database Disk / CPU Usage** | < 30% | 50% - 70% | > 85% | Naikkan pooler connection di Supabase |
| **Storage Quota (3 Buckets)** | < 20% | 40% - 60% | > 80% | Bersihkan berkas yatim via cron |

---

## 2. Jadwal Pemantauan Berkala Harian (Checklist Harian)

### Hari 1: Jam ke-0 s/d Jam ke-24 (Fase Inisiasi Publik)
- **Tinjauan Tiap 4 Jam**:
  1. Periksa dashboard Vercel Analytics & runtime logs untuk mendeteksi *uncaught exceptions*.
  2. Periksa kueri status outbox pada database:
     ```sql
     SELECT status, COUNT(*) FROM outbox_events GROUP BY status;
     ```
  3. Lakukan verifikasi pengiriman email pendaftaran akun baru secara acak (memastikan tidak masuk ke folder spam).
  4. Periksa penyerapan memori dan durasi eksekusi Vercel Functions pada region `sin1`.

### Hari 2: Jam ke-25 s/d Jam ke-48 (Fase Pertumbuhan Lalu Lintas)
- **Tinjauan Tiap 6 Jam**:
  1. Cek kesehatan read model direktori denormalisasi:
     ```sql
     SELECT COUNT(*) FROM directory_projections;
     ```
  2. Jalankan rekonsiliasi model baca berkala untuk memastikan paritas data entitas.
  3. Pantau log audit verifikasi admin di `/admin/audit` untuk memantau waktu respon telaah portofolio (SLA target: < 24 jam).

### Hari 3: Jam ke-49 s/d Jam ke-72 (Fase Stabilisasi)
- **Tinjauan Tiap 8 Jam**:
  1. Periksa pertumbuhan aset media di storage bucket (`avatars`, `gallery`, `evidence`).
  2. Audit berkas yatim menggunakan laporan otomatis `/api/cron/dispatch`.
  3. Susun rangkuman harian metrik operasional untuk Laporan Pasca-Hypercare.

---

## 3. Protokol Eskalasi & Rencana Rollback Darurat

Jika salah satu kriteria ambang pembatalan rilis (P14) terpenuhi:
1. **Langkah 1 (Isolasi Lalu Lintas)**:
   - Aktifkan `MAINTENANCE_MODE=true` di Environment Variables Vercel. Seluruh lalu lintas non-admin seketika dialihkan ke `/maintenance` dalam 5 detik.
2. **Langkah 2 (Rollback Aplikasi)**:
   - Di dashboard Vercel, lakukan *Instant Rollback* / promosi deployment stabil sebelumnya (`dpl_HthSLjvJev52WkucLZjyFWAbYTG4`).
3. **Langkah 3 (Pembatasan Pendaftaran)**:
   - Atur `NEXT_PUBLIC_ENABLE_REGISTRATION=false` untuk menghentikan pendaftaran baru saat investigasi berlangsung.
4. **Langkah 4 (Pembersihan Data Bermasalah)**:
   - Gunakan skrip rollback data per tabel yang tercatat pada `docs/RENCANA-MIGRASI-PRODUKSI.md`.

---

## 4. Jadwal Pasca-Hypercare (H+7)

- **Syarat Menjalankan Migrasi CONTRACT / Destruktif**:
  - Telah melewati minimal 7 hari (168 jam) pasca-peluncuran publik tanpa insiden rollback.
  - Mendapat persetujuan tertulis eksplisit dari pemilik sistem (*Owner*).
  - Skrip migrasi destruktif yang ditunda:
    - `supabase/migrations/20261115000001_v3_contract_cleanup_DESTRUCTIVE.sql`
    - `supabase/migrations/20261105000003_DESTRUCTIVE_cleanup_obsolete_columns.sql`
