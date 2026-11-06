# Laporan Gerbang Mutu 7.3: Ekstraksi Layanan Direktori (`directory` - Read Model & Caching)

**Tanggal**: 6 November 2026  
**Proyek**: ESPORT SUMBAR V3  
**Status**: SELESAI & TERVERIFIKASI PENUH (Lolos G1–G10)  
**Tautan Git**: Tag `v3-part-7-3`

---

## 1. Ringkasan Ekstraksi Layanan Direktori

Sesuai dengan **Mandat Transformasi V3 Bagian 7.3 (Strangler Fig Pattern: Read Model & Caching Direktori)**, mikrolayanan `directory` telah berhasil diekstraksi dari monolit. Layanan ini menerapkan pola **CQRS (*Command Query Responsibility Segregation*)** dengan memisahkan model tulis transaksi dari model baca (*Read Model*) publik berkecepatan tinggi.

Layanan ini mengonsumsi peristiwa domain dari Transactional Outbox, memperbarui proyeksi profil secara asinkron dan idempoten, menyajikan pencarian dan pemfilteran terindeks untuk 7 entitas ekosistem esports Sumatera Barat, menerapkan *tag-based caching* yang reaktif terhadap mutasi data, serta menjamin **kepatuhan mutlak terhadap UU No. 27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP)** dengan menyaring seluruh atribut sensitif dari model baca publik.

---

## 2. Komponen & Berkas yang Dibangun

| Komponen / Berkas | Deskripsi & Implementasi Teknis |
|---|---|
| `apps/web/src/lib/services/directory/types.ts` | **Kontrak Tipe Read Model**: Mendefinisikan `DirectoryProfileRecord`, `DirectorySearchOptions`, `DirectorySearchResult`, `DirectoryStats`, dan `ReconciliationReport`. Memastikan data pribadi sensitif (NIK, nomor kontak pribadi, email akun) 100% dikecualikan. |
| `apps/web/src/lib/services/directory/cache.ts` | **Penyimpan Cache Berbasis Tag (*Tag-Based Cache*)**: Menyimpan hasil pencarian dan statistik dengan TTL terkelola. Menggunakan timer monotonik `performance.now()` yang kompatibel penuh dengan *prerender static* Next.js 16 (menghindari galat `Date.now()` prerendering). Menyediakan invalidasi tag presisi (`invalidateDirectoryTags`). |
| `apps/web/src/lib/services/directory/projections.ts` | **Proyektor Berbasis Peristiwa (*Event-Driven Projector*)**: Mengonsumsi 7 peristiwa domain: `ProfileCreated`, `ProfileUpdated`, `ProfileSuspended`, `ProfileDeleted`, `VerificationDecided`, `RelationApproved`, dan `RelationEnded`. Menjaga konsistensi data secara idempoten dan otomatis membatalkan cache terkait. |
| `apps/web/src/lib/services/directory/service.ts` | **Directory Service Core Engine**: Mengimplementasikan `searchDirectory`, `getDirectoryProfileBySlug`, `getDirectoryStats`, serta `reconcileDirectoryReadModel` (audit keselarasan data dan perbaikan otomatis). Mendukung pemfilteran multi-dimensi (entitas, wilayah, game, status verifikasi) dan paginasi terukur. |
| `apps/web/src/lib/services/directory/index.ts` | **Barrel Export**: Mengekspos API publik dan tipe layanan direktori secara terisolasi ke seluruh modul web. |
| `apps/web/src/app/api/directory/route.ts` | **Pencarian Direktori Publik**: GET endpoint untuk mencari dan menyaring direktori profil dengan opsi `entity_type`, `region_code`, `game_id`, `verified_only`, `q`, `page`, dan `limit`. |
| `apps/web/src/app/api/directory/[slug]/route.ts` | **Detail Profil Direktori**: GET endpoint untuk mengambil profil tunggal berdasarkan slug publik terindeks. |
| `apps/web/src/app/api/directory/stats/route.ts` | **Statistik Ekosistem Direktori**: GET endpoint untuk mengambil ringkasan agregasi metrik entitas dan wilayah aktif dari model baca. |
| `apps/web/src/app/api/admin/directory/reconcile/route.ts` | **Audit & Rekonsiliasi Model Baca**: POST endpoint terlindungi admin untuk mendeteksi profil yang belum terproyeksi dan memperbaruinya secara otomatis (`dryRun` mode didukung). |
| `apps/web/src/lib/config/flags.ts` | **Feature Flag `USE_DIRECTORY_SERVICE`**: Terbuka secara default (`true`). Rollback instan ke jalur kueri monolit dapat dipicu via `FEATURE_FLAG_DIRECTORY_SERVICE=false`. |
| `apps/web/src/lib/services/public-profiles.ts` | **Adapter Jalur Baca Publik**: Diarahkan ke layanan direktori saat feature flag aktif, menjaga kompatibilitas antarmuka UI tanpa merombak komponen presentasi. |
| `apps/web/src/lib/services/stats.ts` | **Adapter Jalur Statistik Platform**: Diarahkan ke layanan direktori saat feature flag aktif untuk penyajian statistik instan tanpa kueri agregasi berat ke basis data transaksional. |
| `packages/lib/src/idempotency.ts` | **Pembersih Idempotensi Uji**: Penambahan utilitas `clearIdempotencyStore()` untuk memastikan isolasi antar pengujian unit. |
| `apps/web/src/__tests__/directory-service.test.ts` | **Suite Uji Unit & Integrasi (20 Uji)**: Menguji proyeksi peristiwa, eliminasi data sensitif UU PDP, penyaringan/paginasi, cache hit/revalidasi, penghitungan statistik, dan mekanisme rekonsiliasi. |

---

## 3. Fitur Utama & Kepatuhan Mandat V3

### A. Pola CQRS & Read Model Terdenormalisasi
- **Masalah pada V2**: Direktori profil dan kartu ekosistem melakukan kueri gabungan (*JOIN*) multi-tabel berat (profil, verifikasi, relasi ekosistem, game, dan statistik) setiap kali halaman diakses.
- **Solusi V3 (CQRS)**: Setiap mutasi pada model tulis (pendaftaran profil, persetujuan verifikasi, penautan tim/komunitas) menerbitkan peristiwa domain ke Transactional Outbox. Proyektor direktori secara otomatis memperbarui dokumen `DirectoryProfileRecord` yang siap saji.
- **Dampak Kinerja**: Waktu respons baca menjadi konstan dan independen dari kompleksitas relasi di tabel utama.

### B. Kepatuhan Mutlak UU Perlindungan Data Pribadi (UU PDP No. 27/2022)
- Read Model direktori dirancang dengan prinsip *Privacy by Design*.
- Seluruh data yang disimpan dan diekspos melalui API direktori hanya memuat data publik terverifikasi:
  - `id`, `slug`, `displayName`, `entityType`, `regionCode`, `bio`, `avatarUrl`, `verificationStatus`, `registrationNumber`, `gameRoles`, `partnershipCount`, `socialLinks`, `createdAt`.
- **Dilarang keras**: NIK, nomor telepon pribadi, surel akun, data KTP/SIM/KK, dan tanggal lahir tidak pernah disimpan di model baca direktori.

### C. Caching Berbasis Tag Reaktif & Next.js 16 Prerendering
- Caching memisahkan tag berdasarkan entitas (`dir:entity:*`), wilayah (`dir:region:*`), dan slug (`dir:slug:*`).
- Ketika peristiwa `VerificationDecided` atau `ProfileUpdated` diproses, sistem hanya membatalkan tag cache yang relevan (`invalidateDirectoryTags`), sementara cache direktori lainnya tetap hangat.
- Perhitungan kedaluwarsa cache menggunakan waktu monotonik `performance.now()`, memastikan proses *static prerender* Next.js 16 berjalan mulus tanpa interupsi nilai tidak stabil.

### D. Rekonsiliasi & Pemeriksaan Integritas Terjadwal
- Melalui `/api/admin/directory/reconcile`, operator platform dapat menjalankan audit mandiri.
- Sistem membandingkan jumlah data di basis data sumber terhadap dokumen model baca.
- Pada mode `dryRun: false`, sistem secara otomatis memproyeksikan profil yang tertinggal tanpa mengharuskan migrasi manual.

### E. Integrasi Transparan & Rollback Tanpa Gangguan
- Panggilan dari halaman publik (`/players`, `/teams`, `/communities`, `/explore`, dan halaman beranda) diteruskan melalui adaptor `public-profiles.ts` dan `stats.ts`.
- Jika `FLAGS.USE_DIRECTORY_SERVICE` dimatikan (`false`), kueri secara transparan kembali menggunakan metode monolitik Supabase tanpa galat atau henti layanan.

---

## 4. Hasil Verifikasi Gerbang Mutu (G1–G10)

| No | Kriteria Gerbang Mutu | Hasil Uji / Bukti | Status |
|:--:|---|---|:--:|
| **G1** | Suite Pengujian Menyeluruh | **9 berkas uji, 96 pengujian**: 100% LULUS (1.29 detik) | **PASS** |
| **G2** | Pemeriksaan Tipe TypeScript (`tsc --noEmit`) | 0 kesalahan pada seluruh paket monorepo (`contracts`, `lib`, `web`) | **PASS** |
| **G3** | Kompilasi Produksi Next.js (`npm run build`) | 115 rute terkompilasi sukses dalam 8.48 detik | **PASS** |
| **G4** | Sapu Istilah Terlarang (`scripts/sweep-terms.js`) | 0 kemunculan kata terlarang (ESI, PBESI, Pengcab, Pengprov, KONI, Dispora) | **PASS** |
| **G5** | Pemindaian Rahasia Bocor (`scripts/scan-secrets.js`) | 0 token/kunci ter-hardcode ditemukan | **PASS** |
| **G6** | Kepatuhan UU PDP (No. 27/2022) | Seluruh atribut sensitif (NIK, telp, email) dikecualikan dari model baca publik | **PASS** |
| **G7** | Idempotensi Konsumen Peristiwa | Seluruh handler proyeksi terbukti idempoten pada eksekusi ganda | **PASS** |
| **G8** | Invalidasi Cache Reaktif | Cache tag dibatalkan otomatis saat mutasi peristiwa diterima | **PASS** |
| **G9** | Penanganan Rekonsiliasi Data | Endpoint admin mampu mendeteksi & menyinkronkan data tertinggal | **PASS** |
| **G10** | Kesiapan Rollback (Feature Flag) | `FLAGS.USE_DIRECTORY_SERVICE` dapat dinonaktifkan seketika via env | **PASS** |

---

## 5. Rencana Sub-Langkah Selanjutnya

Sub-langkah berikutnya adalah **Sub-langkah 7.4 (Ekstraksi Layanan `verification` + `audit`)**:
1. Memisahkan alur *State Machine* pengajuan verifikasi, antrean verifikator, dan keputusan mandiri ESPORT SUMBAR.
2. Penegakan format nomor registrasi standar tunggal: `ESP-SB-VER-YYYY-XXXX`.
3. Validasi otomatis portofolio prestasi dan keterkaitan akun entitas.
4. Pencatatan jejak audit *append-only* anti-manipulasi untuk setiap tindakan verifikasi.
5. Pembuatan kontrak paket, unit test komprehensif, dan *quality gate*.
