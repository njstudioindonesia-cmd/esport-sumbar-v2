# Laporan Gerbang Mutu 7.2: Ekstraksi Layanan Notifikasi (`notification`)

**Tanggal**: 6 November 2026  
**Proyek**: ESPORT SUMBAR V3  
**Status**: SELESAI & TERVERIFIKASI PENUH (Lolos G1–G10)  
**Tautan Git**: Tag `v3-part-7-2`

---

## 1. Ringkasan Ekstraksi Layanan Notifikasi

Sesuai dengan **Mandat Transformasi V3 Bagian 7.2 (Strangler Fig Pattern)**, mikrolayanan `notification` telah berhasil diekstraksi dari monolit. Layanan ini mengonsumsi peristiwa domain dari Transactional Outbox, menyediakan dua saluran pengiriman (*Email* dan *In-App*), menjamin **kegagalan email tidak menggagalkan transaksi bisnis**, menerapkan templat bebas istilah terlarang, mekanisme coba ulang (*exponential retry*) dengan *Dead-Letter Queue* (DLQ), pengelolaan preferensi notifikasi pengguna (*opt-in/opt-out*), serta perlindungan *feature flag* untuk *instant rollback*.

---

## 2. Komponen & Berkas yang Dibangun

| Komponen / Berkas | Deskripsi & Implementasi Teknis |
|---|---|
| `apps/web/src/lib/services/notifications/templates.ts` | **Penyusun Templat Bersih V3**: Menghasilkan salinan email HTML/teks dan notifikasi in-app untuk verifikasi (disetujui, revisi, ditolak), kemitraan ekosistem (diajukan, disetujui, diakhiri), serta peringatan keamanan. **100% bebas dari istilah terlarang**. |
| `apps/web/src/lib/services/notifications/transporter.ts` | **Abstraksi Transport Email Tahan Kegagalan (*Fault-Isolated*)**: `sendEmailSafe` membungkus penyedia email (Resend / Mock / SMTP) sehingga galat koneksi email ditangkap secara internal tanpa pernah melempar *exception* yang merusak alur transaksi pendaftaran/verifikasi. |
| `apps/web/src/lib/services/notifications/preferences.ts` | **Pengelola Preferensi Notifikasi**: Mengelola hak pengguna untuk memilih notifikasi email (`emailNotifications`), peringatan relasi (`relationAlerts`), dan surel buletin (`marketingEmails`). |
| `apps/web/src/lib/services/notifications/service.ts` | **Notification Service Core Engine**: Mengelola antrean, pemroses worker, retry 3x dengan *Dead-Letter Queue* (DLQ), penanda notifikasi terbaca (*mark-as-read*), serta konsumen peristiwa domain asinkron idempoten. |
| `apps/web/src/lib/services/notifications/index.ts` | **Barrel Export**: Mengekspos API publik layanan notifikasi ke lapisan aplikasi dan route handlers. |
| `apps/web/src/app/api/me/notifications/route.ts` | **GET & PATCH API**: Endpoint bagi pengguna untuk membaca notifikasi dalam-aplikasi dan menandai notifikasi sebagai terbaca. |
| `apps/web/src/app/api/me/notifications/preferences/route.ts` | **GET & PUT API**: Endpoint bagi pengguna untuk melihat dan memperbarui preferensi pengiriman notifikasi mereka. |
| `apps/web/src/app/api/admin/notifications/process/route.ts` | **POST Worker Trigger API**: Endpoint terlindungi admin/cron untuk memproses tumpukan antrean email yang tertunda. |
| `apps/web/src/app/api/admin/notifications/dead-letter/route.ts` | **GET DLQ Inspection API**: Endpoint inspeksi admin untuk memantau pesan yang gagal terkirim setelah melampaui kuota retry. |
| `apps/web/src/lib/config/flags.ts` | **Feature Flag `USE_NOTIFICATION_SERVICE`**: Terbuka secara default (`true`). Rollback instan dapat dipicu via `FEATURE_FLAG_NOTIFICATION_SERVICE=false`. |
| `apps/web/src/__tests__/notification-service.test.ts` | **Suite Uji Unit (17 Uji)**: Menguji kepatuhan templat (0 kata terlarang), pengiriman email aman, transisi ke DLQ setelah 3x gagal, opt-out preferensi, dan idempotensi konsumen. |

---

## 3. Fitur Utama & Kepatuhan Mandat V3

### A. Dua Saluran Komunikasi (Email & In-App)
1. **Dalam-Aplikasi (In-App)**:
   - Disimpan pada tabel `notifications_queue` dengan metadata `channel: "in_app"`.
   - Pengguna menerima judul ringkas, pesan, tautan tindakan langsung (*actionUrl*), dan status keterbacaan (*is_read*).
2. **Surat Elektronik (Email)**:
   - Dibuat asinkron ke antrean `notifications_queue` dengan `channel: "email"`.
   - Menggunakan templat berstandar visual Minang modern (hitam elegan `#020617`, aksen emas `#D4AF37`, dan tipografi terstruktur).

### B. Isolasi Kegagalan & Resiliensi Transaksi (Fault-Isolation)
- **Prinsip Utama**: Masalah jaringan pada *mail provider* (timeout SMTP, penolakan kuota API, dll.) **tidak boleh menggagalkan mutasi data bisnis**.
- `sendEmailSafe` menangkap seluruh galat eksternal dan mencatatnya ke antrean log audit tanpa melempar kegagalan ke pemanggil. Alur verifikasi profil dan penyambungan ekosistem tetap berjalan sukses.

### C. Kebijakan Retry & Dead-Letter Queue (DLQ)
- Batas percobaan maksimum: `MAX_RETRY_COUNT = 3`.
- **Percobaan 1 & 2**: Berkas berstatus `pending`, `retry_count` bertambah, pesan galat dicatat di `last_error`.
- **Percobaan 3**: Jika masih gagal, item dialihkan ke status `failed` dengan penanda `dead_letter: true`.
- Admin platform dapat memeriksa seluruh pesan yang masuk DLQ melalui endpoint `/api/admin/notifications/dead-letter` untuk evaluasi dan pemulihan manual.

### D. Penegakan Privasi & Preferensi Notifikasi Pengguna
- Sebelum email dimasukkan ke antrean, sistem memeriksa `getNotificationPreferences(accountId)`.
- Jika pengguna menonaktifkan notifikasi email (`emailNotifications: false`), antrean email dilewati (*skipped: USER_OPT_OUT*), tetapi notifikasi penting dalam-aplikasi tetap diberikan agar pengguna tidak kehilangan informasi status akun.

### E. Kepatuhan Bebas Istilah Terlarang
- Seluruh teks subjek, isi email, dan pesan in-app telah diaudit oleh `scripts/sweep-terms.js`.
- **Hasil**: 0 kemunculan kata ESI, PBESI, Pengcab, Pengprov, KONI, Dispora.
- Identitas institusi pengirim secara tegas: **ESPORT SUMBAR (Pengendali & Operator Tunggal)**.

---

## 4. Hasil Verifikasi Gerbang Mutu (G1–G10)

| No | Kriteria Gerbang Mutu | Hasil Uji / Bukti | Status |
|:--:|---|---|:--:|
| **G1** | Suite Pengujian Menyeluruh | **8 berkas uji, 76 pengujian**: 100% LULUS | **PASS** |
| **G2** | Pemeriksaan Tipe TypeScript (`tsc --noEmit`) | 0 kesalahan pada seluruh paket monorepo (`contracts`, `lib`, `web`) | **PASS** |
| **G3** | Sapu Istilah Terlarang (`sweep-terms.js`) | **0 temuan**: Bebas total dari istilah warisan | **PASS** |
| **G4** | Pemindaian Rahasia Terbuka (`scan-secrets.js`) | **0 rahasia bocor**: Tidak ada kunci rahasia ter-hardcode | **PASS** |
| **G5** | Build Produksi Turbopack (`npm run build`) | **112 rute terkompilasi bersih** (termasuk 4 rute notifikasi baru) | **PASS** |
| **G6** | Validasi Kontrak Zod V1 | Skema `NotificationPayloadSchema` & `NotificationPreferenceSchema` tervalidasi | **PASS** |
| **G7** | Isolasi Kegagalan Email | Email server padam terbukti tidak membatalkan transaksi | **PASS** |
| **G8** | Uji Dead-Letter Queue & Retry | Pesan gagal dialihkan ke DLQ tepat pada kegagalan ke-3 | **PASS** |
| **G9** | Penegakan Preferensi Pengguna | Email dilewati saat pengguna opt-out; in-app tetap terkirim | **PASS** |
| **G10** | Rencana Rollback & Feature Flag | `FLAGS.USE_NOTIFICATION_SERVICE` teruji; *fallback* instan berjalan sempurna | **PASS** |

---

## 5. Rencana Rollback (Zero-Downtime Rollback Plan)

Jika terjadi kendala pada layanan notifikasi:
1. Tetapkan variabel lingkungan: `FEATURE_FLAG_NOTIFICATION_SERVICE=false`.
2. Sistem secara otomatis menonaktifkan pemrosesan antrean asinkron tanpa mengganggu sistem profil, autentikasi, verifikasi, maupun direktori.
3. Seluruh pesan yang sudah masuk ke `notifications_queue` tetap tersimpan aman di database dan dapat diproses kembali setelah layanan diaktifkan ulang.
