# Runbook: Prosedur Rollback & Pembatalan Rilis (ROLLBACK_PROCEDURES.md)

**Proyek**: ESPORT SUMBAR V3  
**Prinsip Utama**: Zero-Downtime, Fast Toggling via Feature Flags, Decoupled Database Migrations.

---

## 1. Tingkatan Rollback

Ada 3 tingkatan pemulihan kembali (*rollback*), diurutkan dari yang paling cepat dan minim risiko:

```
[Level 1: Feature Flag Toggle] (Detik, Tanpa Deploy)
       ↓
[Level 2: Vercel Instant Rollback] (Menit, Membatalkan Commit Frontend)
       ↓
[Level 3: Database Reversion] (Perlu Kehati-hatian, Revert Skema)
```

---

## 2. Level 1: Rollback Instan Melalui Feature Flag

Setiap modul dan layanan mikro terekstraksi dilindungi oleh Feature Flag di [`apps/web/src/lib/config/flags.ts`](file:///d:/AI%20AGENT/ESPORT%20SUMBAR%20V2/apps/web/src/lib/config/flags.ts).

Jika suatu layanan mengalami anomali di produksi, ubah variabel lingkungan pada dashboard Vercel tanpa perlu melakukan kompilasi ulang:

| Layanan Bermasalah | Variabel Lingkungan | Efek Pembatalan |
|---|---|---|
| Modular Core | `FEATURE_FLAG_MODULAR_CORE=false` | Beralih kembali ke pemanggilan monolit lama |
| Layanan Verifikasi | `FEATURE_FLAG_VERIFICATION_SERVICE=false` | Menggunakan alur verifikasi monolitik dasar |
| Layanan Konten | `FEATURE_FLAG_CONTENT_SERVICE=false` | Menggunakan fallback kueri konten statis/monolit |
| Layanan Notifikasi | `FEATURE_FLAG_NOTIFICATION_SERVICE=false` | Melewatkan pengiriman eksternal tanpa menggagalkan transaksi |
| Layanan Media | `FEATURE_FLAG_MEDIA_SERVICE=false` | Menggunakan penyimpanan dasar tanpa kompresi Sharp WebP |
| Read Model Direktori | `FEATURE_FLAG_DIRECTORY_SERVICE=false` | Beralih ke pembacaan tabel profiles langsung |

---

## 3. Level 2: Rollback Deployment Aplikasi (Vercel Instant Rollback)

Jika build rilis baru memuat *bug* antarmuka atau logika kritis:
1. Buka dasbor **Vercel -> Deployments**.
2. Cari deployment stabil terakhir sebelum rilis bermasalah.
3. Klik tombol menu tiga titik (`...`) -> **Rollback to this Deployment**.
4. Vercel akan mengalihkan 100% lalu lintas domain secara instan (sekitar 5–10 detik).

---

## 4. Level 3: Rollback Migrasi Basis Data

Sesuai pola **Expand and Contract**:
- Migrasi V3 tidak pernah menghapus kolom aktif sebelum seluruh pembaca dialihkan (*expand phase*).
- Jika ada migrasi SQL yang salah terpasang, jalankan perintah rollback terbalik melalui Supabase CLI:
  ```bash
  # Tinjau status migrasi
  supabase migration list
  
  # Jalankan skrip perbaikan SQL rollback yang telah disiapkan di supabase/migrations/
  supabase db push
  ```
