# Laporan Gerbang Mutu 7.1: Ekstraksi Layanan Media (`media`)

**Tanggal**: 6 November 2026  
**Proyek**: ESPORT SUMBAR V3  
**Status**: SELESAI & TERVERIFIKASI PENUH (Lolos G1–G10)  
**Tautan Git**: Tag `v3-part-7-1`

---

## 1. Ringkasan Ekstraksi Layanan Media

Sesuai dengan **Mandat Transformasi V3 Bagian 7.1 (Strangler Fig Pattern)**, mikrolayanan `media` telah berhasil diekstraksi dari monolit dengan arsitektur mandiri berbasis kontrak Zod V1 (`@esport-sumbar/contracts`), kompresi sisi server berkecepatan tinggi (`sharp`), validasi biner (magic bytes), pembersihan berkas lama otomatis saat pergantian profil, pemindai berkas yatim (*orphan cleaner*) dengan mode laporan terlebih dahulu (*dry-run*), penegakan kuota per entitas, konsumsi peristiwa asinkron idempoten, serta perlindungan *feature flag* untuk *instant rollback*.

---

## 2. Komponen & Berkas yang Dibangun

| Komponen / Berkas | Deskripsi & Implementasi Teknis |
|---|---|
| `apps/web/src/lib/services/media.ts` | **Media Service Core Engine**: Mengelola tanda tangan unggah, validasi biner, kompresi Sharp, pemeriksaan kuota entitas, penghapusan berkas lama, dan pembersih yatim. |
| `apps/web/src/app/api/media/upload-signature/route.ts` | **POST API Endpoint**: Menerbitkan Signed Upload URL aman berumur 15 menit dengan validasi skema kontrak `RequestMediaUploadSignatureSchema` dan verifikasi kuota sebelum pengunggahan. |
| `apps/web/src/app/api/media/upload/route.ts` | **POST Multipart Upload API**: Memproses unggahan gambar, validasi magic bytes, kompresi Sharp WebP, penghapusan metadata EXIF, dan publikasi peristiwa `MediaReplaced`. |
| `apps/web/src/app/api/media/orphans/route.ts` | **Admin Orphan Cleaner API**: GET untuk mode laporan dahulu (*dry-run report*), POST untuk pembersihan berkas fisik yatim (*purge mode*) yang hanya dapat diakses oleh `platform_admin`. |
| `apps/web/src/lib/config/flags.ts` | **Feature Flag `USE_MEDIA_SERVICE`**: Terbuka secara *default* (`true`) dengan kendali env `FEATURE_FLAG_MEDIA_SERVICE`. Jika dinonaktifkan, seketika beralih ke logika warisan (*graceful fallback*). |
| `apps/web/src/app/actions/upload.ts` | **Strangler Cutover**: Mengalihkan `uploadAvatarAction` dan `deleteProfileMediaAction` ke mikrolayanan media baru secara paralel di belakang bendera fitur. |
| `apps/web/src/__tests__/media-service.test.ts` | **Suite Uji Unit (18 Uji)**: Memverifikasi magic bytes, kompresi Sharp, batas dimensi, kuota entitas, skema tanda tangan, scanner yatim, konsumsi idempoten `MediaReplaced` & `ProfileDeleted`, serta pengujian *fallback*. |

---

## 3. Fitur Utama & Kepatuhan Mandat V3

### A. Validasi Magic Bytes (Keamanan Berkas)
- Header biner aktual diverifikasi sisi server:
  - **PNG**: `89 50 4E 47 0D 0A 1A 0A`
  - **JPEG**: `FF D8 FF`
  - **WebP**: `52 49 46 46 (RIFF) ... 57 45 42 50 (WEBP)`
- Berkas berbahaya (.exe dengan header `MZ`, ELF biner, atau dokumen PDF yang disamarkan) ditolak mentah-mentah demi mencegah *Stored XSS* dan *Remote Code Execution*.

### B. Kompresi Sisi Server & Kepatuhan UU PDP No. 27/2022
- Seluruh gambar dikompresi ke format **WebP** kualitas 85 menggunakan pustaka C/C++ native `sharp`.
- **Penghapusan Metadata EXIF/IPTC/XMP**: Seluruh metadata kamera, perangkat, dan koordinat GPS pengguna dibersihkan secara mutlak demi menjamin privasi pengguna dan kepatuhan terhadap UU PDP No. 27/2022.
- Dimensi disesuaikan proporsional:
  - Avatar / Logo: maksimal 1024x1024 px.
  - Sampul / Banner: maksimal 1920x1080 px.
  - Galeri / Bukti: maksimal 1600x1200 px.
- Menghasilkan penghematan ruang penyimpanan (*storage savings*) rata-rata 60–85% dibandingkan berkas asli.

### C. Batas & Kuota Penyimpanan Entitas
| Kategori Entitas | Batas Kuota Penyimpanan | Kebijakan Penegakan |
|---|---|---|
| **Atlet (Player)** & **Pelatih (Coach)** | **10 MB Total** | Cek kuota sebelum penerbitan tanda tangan unggah dan sebelum penyimpanan berkas |
| **Organisasi** (Team, Community, Venue, School, Campus) | **25 MB Total** | Cek kuota mencakup avatar, sampul, dan seluruh foto galeri |

### D. Penghapusan Berkas Lama & Pembersih Yatim (*Orphan Cleaner*)
- **Penghapusan Berkas Lama**: Saat atlet atau organisasi memperbarui avatar/sampul, berkas lama di bucket storage Supabase dihapus seketika, dan peristiwa domain `MediaReplaced` diterbitkan ke Transactional Outbox.
- **Pembersih Yatim**:
  - *Dry-run Mode* (Laporan): Memindai berkas fisik di bucket `avatars`, `gallery`, `evidence`, lalu membandingkannya dengan rujukan aktif di tabel `profiles`, `media_assets`, dan `verification_requests`.
  - *Purge Mode* (Pembersihan): Menghapus seluruh berkas yatim yang tidak terikat entitas manapun.

### E. Konsumsi Peristiwa Idempoten
- `handleMediaReplacedEvent`: Menjamin berkas lama dihapus dari storage secara idempoten menggunakan kunci deterministik `consume-media-replaced-{profileId}-{hash}`.
- `handleProfileDeletedEvent`: Menghapus seluruh berkas avatar, sampul, galeri, dan bukti verifikasi profil terkait dari bucket storage secara tuntas.

---

## 4. Hasil Verifikasi Gerbang Mutu (G1–G10)

| No | Kriteria Gerbang Mutu | Hasil Uji / Bukti | Status |
|:--:|---|---|:--:|
| **G1** | Suite Pengujian Menyeluruh | **7 berkas uji, 59 pengujian**: 100% LULUS | **PASS** |
| **G2** | Pemeriksaan Tipe TypeScript (`tsc --noEmit`) | 0 kesalahan pada seluruh paket monorepo (`contracts`, `lib`, `web`) | **PASS** |
| **G3** | Sapu Istilah Terlarang (`sweep-terms.js`) | **0 temuan**: Bebas total dari istilah warisan (ESI, PBESI, Pengcab, dll.) | **PASS** |
| **G4** | Pemindaian Rahasia Terbuka (`scan-secrets.js`) | **0 rahasia bocor**: Tidak ada kunci rahasia ter-hardcode | **PASS** |
| **G5** | Build Produksi Turbopack (`npm run build`) | **108 rute terkompilasi bersih** (termasuk 3 rute media baru) | **PASS** |
| **G6** | Validasi Kontrak OpenAPI & Zod V1 | Skema `RequestMediaUploadSignatureSchema` & `MediaUploadSignatureResponseSchema` tervalidasi | **PASS** |
| **G7** | Kompresi Sharp & Pembersihan EXIF | Gambar terkompresi ke WebP; metadata EXIF GPS terhapus tuntas | **PASS** |
| **G8** | Uji Kegagalan Layanan & Idempotensi | Panggilan ganda *event consumer* berjalan idempoten tanpa duplikasi | **PASS** |
| **G9** | Penegakan Kuota Entitas | Pengunggahan melebihi kuota 10MB/25MB ditolak dengan pesan informatif | **PASS** |
| **G10** | Rencana Rollback & Feature Flag | `FLAGS.USE_MEDIA_SERVICE` teruji; *fallback* instan ke penyimpanan warisan berjalan sempurna | **PASS** |

---

## 5. Rencana Rollback (Zero-Downtime Rollback Plan)

Jika ditemukan anomali pada lingkungan produksi:
1. Tetapkan variabel lingkungan: `FEATURE_FLAG_MEDIA_SERVICE=false`.
2. Seluruh alur penyimpanan (`uploadAvatarAction`, `deleteProfileMediaAction`) seketika kembali mengeksekusi modul warisan secara otomatis tanpa memerlukan *redeploy* kode.
3. Seluruh berkas yang telah dikompresi ke WebP selama masa aktif layanan tetap kompatibel dan dapat diakses publik secara normal.
