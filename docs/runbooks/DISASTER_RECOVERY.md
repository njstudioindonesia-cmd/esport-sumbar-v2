# Runbook: Pemulihan Bencana & Cadangan (DISASTER_RECOVERY.md)

**Proyek**: ESPORT SUMBAR V3  
**Target RTO (Recovery Time Objective)**: < 60 Menit  
**Target RPO (Recovery Point Objective)**: < 15 Menit  

---

## 1. Strategi Pencadangan (Backup Strategy)

1. **Pencadangan Otomatis Supabase**:
   - Supabase menjalankan **Point-in-Time Recovery (PITR)** harian dengan replikasi Write-Ahead Logging (WAL) per 15 menit pada cluster cloud Singapore.
2. **Cadangan Logis Mingguan (Logical Dump)**:
   - Skrip cron mengekspor skema dan data tabel penting (`accounts`, `profiles`, `ecosystem_relations`, `verification_requests`, `audit_logs`, `games`) ke penyimpanan cadangan terenkripsi.
3. **Penyimpanan Storage (Media & Avatars)**:
   - Seluruh berkas avatar dan bukti verifikasi disimpan di Supabase Storage dengan replikasi multi-zona.

---

## 2. Prosedur Drill Pemulihan Bencana (Drill Simulation)

Drill simulasi pemulihan wajib dijalankan setiap kuartal (3 bulan) di lingkungan staging untuk menguji integritas cadangan:

### Langkah 1: Ekspor Dump Basis Data Saat Ini
```bash
# Menggunakan Supabase CLI
supabase db dump --project-ref <PROJECT_REF> -f backups/dump-drill-$(date +%Y%m%d).sql
```

### Langkah 2: Verifikasi Integritas SHA-256 Dump
```bash
# Menghitung checksum berkas dump
sha256sum backups/dump-drill-*.sql > backups/dump-checksum.txt
```

### Langkah 3: Restore ke Instance Uji (Clean Database)
```bash
# Mengembalikan data ke database uji lokal atau staging terisolasi
psql -h <STAGING_HOST> -U postgres -d postgres -f backups/dump-drill-*.sql
```

### Langkah 4: Uji Rekonsiliasi Integritas
Jalankan skrip rekonsiliasi V3 untuk memastikan:
- 100% baris `accounts` memiliki relasi sah.
- 0 baris `profiles` memiliki multi-profil per akun.
- Jejak audit (`audit_logs`) lolos verifikasi rantai hash SHA-256 (`verifyAuditTrailIntegrity`).

---

## 3. Langkah Pemulihan Darurat Nyata (Live Emergency Recovery)

1. **Deklarasikan Insiden Bencana (Disaster State)**:
   - Alihkan trafik DNS domain ke halaman status pemeliharaan statis (*Maintenance Mode*).
2. **Pilih Titik Pemulihan (Recovery Point)**:
   - Melalui dasbor Supabase Project Settings -> Database -> Backups, pilih waktu PITR tepat sebelum kejadian fatal (misal 5 menit sebelum insiden).
3. **Trigger Restore**:
   - Konfirmasi proses PITR. Supabase akan memulihkan data ke instance baru.
4. **Verifikasi Integritas**:
   - Jalankan `npm run test` dan pemeriksaan data kunci sebelum mengalihkan DNS kembali ke produksi.
5. **Kembalikan Trafik**:
   - Matikan mode pemeliharaan dan buka kembali akses publik.
