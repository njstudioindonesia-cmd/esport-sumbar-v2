# Kebijakan Operasional, Kuota & Retensi Data (OPERATIONAL_RETENTION_POLICY.md)

**Proyek**: ESPORT SUMBAR V3  
**Standar Kepatuhan**: UU PDP No. 27/2022 & Standar Keamanan Enterprise  
**Status**: Diterapkan & Mengikat  

---

## 1. Kebijakan Retensi Data (Retention Policy)

Untuk mematuhi asas efisiensi penyimpanan (*storage hygiene*) dan prinsip minimalisasi data UU PDP No. 27/2022, ESPORT SUMBAR menetapkan masa retensi resmi untuk setiap kategori data:

| Kategori Data | Tabel / Lokasi | Periode Retensi Resmi | Mekanisme Pembersihan |
|---|---|---|---|
| **Berkas Bukti Verifikasi** | Bucket Storage `evidence` | **90 Hari** setelah keputusan verifikasi final | Pembersihan otomatis via skrip hygiene terjadwal |
| **Jejak Audit Administratif** | Tabel `audit_logs` | **2 Tahun (730 Hari)** | Pengarsipan append-only, dilarang dihapus sebelum 2 tahun |
| **Peristiwa Outbox Berhasil** | Tabel `outbox_events` (status: `published`) | **7 Hari** | Pembersihan otomatis mingguan |
| **Dead-Letter Queue (DLQ)** | Tabel `notifications_queue` (status: `failed`) | **90 Hari** | Ditinjau berkala oleh admin sebelum dihapus permanen |
| **Log Metrik & Telemetri** | In-memory registry / Log | **30 Hari** | Rotasi otomatis |
| **Data Akun & Profil Aktif** | Tabel `accounts`, `profiles` | Selama akun berstatus aktif | Hak Hapus (*Right to be Forgotten*) sesuai permintaan pengguna |

---

## 2. Kuota Penyimpanan Media per Entitas

Setiap jenis profil dibatasi oleh kuota penyimpanan kumulatif yang ditegakkan pada lapisan layanan media ([`apps/web/src/lib/services/media.ts`](file:///d:/AI%20AGENT/ESPORT%20SUMBAR%20V2/apps/web/src/lib/services/media.ts)):

| Kategori Profil | Batas Ukuran per Berkas | Kuota Total per Entitas | Format Diizinkan |
|---|---|---|---|
| **Atlet (*Player*)** | 5 MB | **10 MB** | JPEG, PNG, WebP (Dikonversi ke WebP) |
| **Pelatih (*Coach*)** | 5 MB | **10 MB** | JPEG, PNG, WebP (Dikonversi ke WebP) |
| **Klub / Tim (*Team*)** | 5 MB | **25 MB** | JPEG, PNG, WebP |
| **Komunitas (*Community*)** | 5 MB | **25 MB** | JPEG, PNG, WebP |
| **Arena (*Venue*)** | 5 MB | **25 MB** | JPEG, PNG, WebP |
| **Sekolah (*School*)** | 5 MB | **25 MB** | JPEG, PNG, WebP |
| **Perguruan Tinggi (*Campus*)** | 5 MB | **25 MB** | JPEG, PNG, WebP |

---

## 3. Prosedur Pembersihan Berkala (Scheduled Hygiene)

Pembersihan dijalankan secara terjadwal setiap minggu menggunakan skrip `scripts/storage-hygiene.ts`:
1. **Mode Pelaporan (Dry-Run)**: Menghasilkan manifest berkas yatim dan bukti verifikasi yang telah melewati 90 hari.
2. **Mode Eksekusi**: Menghapus berkas yang telah melewati masa retensi setelah dicatat ke dalam log audit.
