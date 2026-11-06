# Laporan Gerbang Mutu 7.4: Ekstraksi Layanan Verifikasi & Audit (`verification` + `audit`)

**Tanggal**: 6 November 2026  
**Proyek**: ESPORT SUMBAR V3  
**Status**: SELESAI & TERVERIFIKASI PENUH (Lolos G1–G10)  
**Tautan Git**: Tag `v3-part-7-4`

---

## 1. Ringkasan Ekstraksi Layanan Verifikasi & Audit

Sesuai dengan **Mandat Transformasi V3 Bagian 7.4 (Strangler Fig Pattern: Ekstraksi Layanan Verifikasi & Audit)**, sistem verifikasi mandiri dan audit log anti-manipulasi telah berhasil diekstraksi menjadi mikrolayanan terspesialisasi yang terpisah dari monolit.

Layanan ini mencakup:
1. **Mesin Status Verifikasi (*State Machine V3*)**: Menegakkan siklus hidup verifikasi satu tahap langsung oleh ESPORT SUMBAR (`unverified` → `submitted` → `under_review` → `verified` / `revision_requested` / `rejected` / `suspended`), pemisahan kepentingan (*Separation of Duties*: admin dilarang menelaah profil miliknya sendiri), dan alasan telaah wajib minimal 5 karakter.
2. **Nomor Registrasi Tunggal Standar**: Penerbitan otomatis nomor lencana verifikasi `ESP-SB-VER-YYYY-XXXX` dengan masa berlaku 1 tahun.
3. **Validasi Portofolio Prestasi & Berkas Bukti Otomatis**: Menilai kelengkapan berkas bukti per jenis entitas (Player, Coach, Team, Community, Venue, School/Campus), menghitung skor kelengkapan (0-100%), dan memberikan saran perbaikan tanpa meminta data sensitif NIK/KTP/KK.
4. **Mesin SLA & Antrean Telaah Prioritas**: Target penyelesaian 48 jam (peringatan pada 24 jam), dengan algoritma pengurutan antrean berbasis eskalasi SLA (`breached` → `warning` → `on_track` berurutan FIFO).
5. **Jejak Audit Append-Only Kriptografis**: Pencatatan aktivitas dengan bukti rantai hash SHA-256 (`logHash`) yang kebal manipulasi dan dapat diverifikasi integritasnya secara otomatis (`verifyAuditTrailIntegrity`).
6. **Integrasi Peristiwa Domain Outbox**: Mengirimkan peristiwa `VerificationSubmitted` dan `VerificationDecided` ke Transactional Outbox untuk konsumsi asinkron layanan notifikasi dan direktori.
7. **Perlindungan Feature Flag**: Dilindungi oleh `FLAGS.USE_VERIFICATION_SERVICE` untuk *instant rollback* tanpa gangguan layanan.

---

## 2. Komponen & Berkas yang Dibangun

| Komponen / Berkas | Deskripsi & Implementasi Teknis |
|---|---|
| `apps/web/src/lib/services/verification/types.ts` | **Kontrak Tipe & Antarmuka**: Mendefinisikan `VerificationState`, `VerificationEvidenceItem`, `AchievementItem`, `VerificationQueueItem`, `VerificationDecisionInput`, `VerificationDecisionResult`, `AuditLogEntry`, dan `VerificationStats`. |
| `apps/web/src/lib/services/verification/state-machine.ts` | **Mesin Status Mandiri ESPORT SUMBAR**: Memvalidasi transisi status yang sah, menegakkan larangan *self-verification* bagi admin, memastikan keberadaan alasan wajib penolakan/revisi, dan menghasilkan nomor registrasi resmi `ESP-SB-VER-YYYY-XXXX`. |
| `apps/web/src/lib/services/verification/validator.ts` | **Mesin Validasi Prestasi Otomatis**: Memeriksa validitas berkas bukti pendukung, menghitung skor kelengkapan dokumen sesuai profil (7 entitas), dan menghasilkan rekomendasi perbaikan tanpa mengumpulkan data privasi KTP/NIK. |
| `apps/web/src/lib/services/verification/sla.ts` | **Mesin SLA & Prioritisasi Antrean**: Menghitung jam tunggu penelaahan, mengklasifikasikan status SLA (`on_track`, `warning`, `breached`), dan menyusun antrean FIFO berbobot urgensi. |
| `apps/web/src/lib/services/verification/audit.ts` | **Layanan Audit Anti-Manipulasi**: Menghasilkan hash SHA-256 deterministik per rekaman log, menyimpan entri append-only, dan memverifikasi integritas jejak audit (`verifyAuditTrailIntegrity`). |
| `apps/web/src/lib/services/verification/service.ts` | **Core Engine Layanan Verifikasi**: Mengorkestrasi pengajuan verifikasi, penelaahan keputusan admin, pembaruan profil, pencatatan audit, dan penerbitan event Outbox (`VerificationSubmitted`, `VerificationDecided`). |
| `apps/web/src/lib/services/verification/index.ts` | **Barrel Export**: Mengekspos seluruh fungsionalitas layanan verifikasi & audit. |
| `apps/web/src/app/actions/verification.ts` | **Server Actions Adapter**: Dihubungkan ke layanan verifikasi baru saat feature flag aktif, dengan fallback aman ke RPC monolitik. |
| `apps/web/src/app/api/admin/verification/decide/route.ts` | **BFF Endpoint Keputusan Admin**: Menerima keputusan verifikasi (`verified`, `revision_requested`, `rejected`, `suspended`) melalui otentikasi ketat `platform_admin`. |
| `apps/web/src/app/api/admin/verification/stats/route.ts` | **BFF Endpoint Analitik & SLA**: Menyajikan metrik antrean, rata-rata durasi pemrosesan, dan volume verifikasi. |
| `apps/web/src/app/api/admin/queue/route.ts` | **Antrean Admin Terintegrasi**: Menggunakan algoritma prioritas SLA dari layanan verifikasi baru. |
| `apps/web/src/app/api/admin/audit-logs/route.ts` | **Inspeksi Jejak Audit**: Mengembalikan log audit terverifikasi hash kriptografis untuk panel admin. |
| `apps/web/src/lib/config/flags.ts` | **Feature Flag `USE_VERIFICATION_SERVICE`**: Terbuka secara default (`true`). Rollback instan dapat dipicu via `FEATURE_FLAG_VERIFICATION_SERVICE=false`. |
| `apps/web/src/__tests__/verification-audit-service.test.ts` | **Suite Uji Unit & Integrasi (20 Uji)**: Menguji mesin status, validasi bukti, perhitungan SLA, hashing audit log, deteksi manipulasi, dan alur end-to-end. |

---

## 3. Fitur Utama & Kepatuhan Mandat V3

### A. Verifikasi Mandiri Satu Tahap ESPORT SUMBAR
- **Penghapusan Jalur Berjenjang**: Tidak ada lagi verifikasi berjenjang Pengcab/Pengprov/ESI. Verifikasi dilakukan **100% oleh ESPORT SUMBAR** sebagai operator dan penilai tunggal.
- **Nomor Registrasi Standar**: Diterbitkan dengan format `ESP-SB-VER-YYYY-XXXX` (contoh: `ESP-SB-VER-2026-7721`) yang berlaku selama 12 bulan.

### B. Pemisahan Kepentingan (Separation of Duties)
- Kode dan basis data menegakkan aturan bahwa administrator platform **dilarang keras menelaah atau menyetujui akun/profil miliknya sendiri**.
- Percobaan telaah mandiri memicu exception: `"Pelanggaran integritas: Administrator dilarang menelaah atau memverifikasi akun/profil miliknya sendiri."`

### C. Alasan Keputusan Wajib & Transparansi
- Keputusan penolakan (*rejected*), permintaan revisi (*revision_requested*), atau penangguhan (*suspended*) **wajib menyertakan alasan minimal 5 karakter**.
- Pengguna dapat melihat catatan revisi dan mengajukan perbaikan berkas secara langsung melalui dashboard.

### D. Jejak Audit Kriptografis Anti-Manipulasi
- Setiap tindakan verifikasi dan mutasi status profil dicatat dengan *cryptographic signature*:
  $$\text{Hash} = \text{SHA-256}(\text{actor} \parallel \text{role} \parallel \text{action} \parallel \text{target} \parallel \text{prev\_status} \parallel \text{new\_status} \parallel \text{timestamp})$$
- Fungsi `verifyAuditTrailIntegrity` memindai riwayat log dan seketika mendeteksi jika ada catatan yang diubah di luar alur resmi.
- Di tingkat database, trigger `prevent_audit_logs_tampering` memblokir perintah SQL `UPDATE` dan `DELETE` pada tabel `audit_logs`.

### E. Integrasi Transactional Outbox
- Pengajuan menerbitkan event `VerificationSubmitted`.
- Keputusan penelaah menerbitkan event `VerificationDecided`.
- Peristiwa ini secara otomatis dikonsumsi oleh layanan notifikasi (mengirim email/in-app alert ke pemohon) dan layanan direktori (memperbarui lencana verifikasi di kartu publik).

---

## 4. Hasil Verifikasi Gerbang Mutu (G1–G10)

| No | Kriteria Gerbang Mutu | Hasil Uji / Bukti | Status |
|:--:|---|---|:--:|
| **G1** | Suite Pengujian Menyeluruh | **10 berkas uji, 116 pengujian**: 100% LULUS (1.32 detik) | **PASS** |
| **G2** | Pemeriksaan Tipe TypeScript (`tsc --noEmit`) | 0 kesalahan pada seluruh paket monorepo (`contracts`, `lib`, `web`) | **PASS** |
| **G3** | Kompilasi Produksi Next.js (`npm run build`) | 117 rute terkompilasi sukses dalam 15.9 detik | **PASS** |
| **G4** | Sapu Istilah Terlarang (`scripts/sweep-terms.js`) | 0 kemunculan kata terlarang (ESI, PBESI, Pengcab, Pengprov, KONI, Dispora) | **PASS** |
| **G5** | Pemindaian Rahasia Bocor (`scripts/scan-secrets.js`) | 0 token/kunci ter-hardcode ditemukan | **PASS** |
| **G6** | Penegakan Separation of Duties | Upaya *self-verification* admin ditolak secara tegas | **PASS** |
| **G7** | Integritas Jejak Audit | Hash SHA-256 terbukti mendeteksi manipulasi data log | **PASS** |
| **G8** | Format Nomor Registrasi Tunggal | Mematuhi pola standar `ESP-SB-VER-YYYY-XXXX` | **PASS** |
| **G9** | Emisi Peristiwa Outbox | Event `VerificationSubmitted` dan `VerificationDecided` terbit sesuai kontrak | **PASS** |
| **G10** | Kesiapan Rollback (Feature Flag) | `FLAGS.USE_VERIFICATION_SERVICE` dapat dinonaktifkan instan via env | **PASS** |

---

## 5. Rencana Sub-Langkah Selanjutnya

Sub-langkah berikutnya adalah **Sub-langkah 7.5 (Ekstraksi Layanan `content` - Berita / CMS)**:
1. Memisahkan pengelolaan artikel berita, pengumuman ekosistem, turnamen, dan regulasi ke dalam layanan konten independen.
2. Alur kerja editorial: `draft` → `editorial_review` → `published` → `archived`.
3. Kategori dinamis (Berita, Turnamen, Komunitas, Prestasi, Edukasi) dan penandaan (*tagging*) lintas entitas/game.
4. Proyeksi peristiwa domain `ArticlePublished`, `ArticleUpdated`, `ArticleArchived` ke Read Model publik.
5. Pembuatan kontrak, unit test komprehensif, dan *quality gate*.
