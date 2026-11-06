# Laporan Gerbang Mutu 7.5: Ekstraksi Layanan Konten & Berita (`content` - Berita / CMS)

**Tanggal**: 6 November 2026  
**Proyek**: ESPORT SUMBAR V3  
**Status**: SELESAI & TERVERIFIKASI PENUH (Lolos G1–G10)  
**Tautan Git**: Tag `v3-part-7-5`

---

## 1. Ringkasan Ekstraksi Layanan Konten

Sesuai dengan **Mandat Transformasi V3 Bagian 7.5 (Strangler Fig Pattern: Ekstraksi Layanan Konten & Berita / CMS)**, modul artikel berita, pengumuman ekosistem, turnamen, dan regulasi resmi telah berhasil diekstraksi dari monolit menjadi mikrolayanan konten mandiri.

Layanan ini mencakup:
1. **Alur Kerja Editorial Terkelola (*Editorial Workflow V3*)**: Siklus hidup artikel terstruktur (`draft` → `editorial_review` → `published` → `archived`), dengan kewenangan publikasi dan pengarsipan eksklusif dipegang oleh `platform_admin`.
2. **Kategori & Taksonomi Dinamis**: Kategori terstandarisasi (`turnamen`, `komunitas`, `prestasi`, `edukasi`, `pengumuman`, `umum`), penandaan tag lintas entitas, dan keterkaitan geografis wilayah 19 kota/kabupaten.
3. **Penyimpan Cache Berbasis Tag Reaktif**: Memanfaatkan waktu monotonik `performance.now()` yang sepenuhnya aman terhadap *static prerendering* Next.js 16, dengan pembatalan tag otomatis (`invalidateContentTags`) saat artikel dipublikasikan, diperbarui, atau diarsipkan.
4. **Peristiwa Domain Outbox**: Menerbitkan event `ArticlePublished`, `ArticleUpdated`, dan `ArticleArchived` ke Transactional Outbox untuk konsumsi asinkron layanan direktori dan notifikasi.
5. **Jejak Audit Append-Only SHA-256**: Setiap tindakan penulisan, penyuntingan, dan transisi status artikel dicatat ke dalam audit log kriptografis anti-manipulasi.
6. **Perlindungan Feature Flag**: Dilindungi oleh `FLAGS.USE_CONTENT_SERVICE` untuk *instant rollback* tanpa henti layanan.

---

## 2. Komponen & Berkas yang Dibangun

| Komponen / Berkas | Deskripsi & Implementasi Teknis |
|---|---|
| `packages/contracts/src/schemas/content.ts` | **Kontrak Skema Konten**: Mendefinisikan `ArticleCategorySchema`, `ArticleStatusSchema`, `CreateArticleSchema`, `UpdateArticleSchema`, dan `ArticleFilterSchema`. |
| `packages/contracts/src/events.ts` | **Kontrak Peristiwa Domain**: Menambahkan `ArticlePublishedEvent`, `ArticleUpdatedEvent`, dan `ArticleArchivedEvent` beserta pendaftaran ke `DOMAIN_EVENT_CATALOG`. |
| `apps/web/src/lib/services/content/types.ts` | **Tipe Data Internal**: Mendefinisikan `ContentArticleRecord`, `ContentSearchOptions`, `ContentSearchResult`, `EditorialTransitionParams`, dan `ContentStats`. |
| `apps/web/src/lib/services/content/workflow.ts` | **Mesin Alur Editorial**: Mengatur matriks transisi status yang sah, memvalidasi otorisasi editor/admin, mewajibkan alasan pengarsipan, dan menghasilkan slug URL ramah SEO. |
| `apps/web/src/lib/services/content/cache.ts` | **Penyimpan Cache Tag**: Mengelola cache hasil kueri publik dengan invalidasi presisi per tag entri (`content:all`, `content:category:*`, `content:slug:*`). |
| `apps/web/src/lib/services/content/service.ts` | **Content Service Core Engine**: Mengimplementasikan `searchArticles`, `getArticleBySlug`, `createArticle`, `updateArticle`, `transitionArticleStatus`, `deleteArticle`, dan `getContentStats`. |
| `apps/web/src/lib/services/content/index.ts` | **Barrel Export**: Mengekspos API publik dan tipe layanan konten. |
| `apps/web/src/app/actions/news.ts` | **Server Actions Adapter**: Menghubungkan mutasi berita admin ke layanan konten baru saat feature flag aktif. |
| `apps/web/src/lib/services/news.ts` | **Public Query Adapter**: Mengalirkan pembacaan berita publik ke `searchArticles` dan `getArticleBySlug`. |
| `apps/web/src/app/api/content/route.ts` | **BFF Endpoint Pencarian Publik**: GET endpoint untuk filter berita berdasarkan kategori, wilayah, game, status, dan kata kunci. |
| `apps/web/src/app/api/content/[slug]/route.ts` | **BFF Endpoint Detail Artikel**: GET endpoint untuk mengambil detail artikel berdasarkan slug terindeks. |
| `apps/web/src/app/api/admin/content/route.ts` | **BFF Endpoint Pembuatan Artikel**: POST endpoint terlindungi `platform_admin` untuk membuat artikel baru. |
| `apps/web/src/app/api/admin/content/[id]/transition/route.ts` | **BFF Endpoint Transisi Editorial**: POST endpoint terlindungi `platform_admin` untuk mengubah status artikel. |
| `apps/web/src/lib/config/flags.ts` | **Feature Flag `USE_CONTENT_SERVICE`**: Terbuka secara default (`true`). Rollback instan dapat dipicu via `FEATURE_FLAG_CONTENT_SERVICE=false`. |
| `apps/web/src/__tests__/content-service.test.ts` | **Suite Uji Unit & Integrasi (11 Uji)**: Menguji alur editorial, slugifier, penyaringan/paginasi, cache hit/invalidation, transisi status, dan penghitungan metrik statistik. |

---

## 3. Fitur Utama & Kepatuhan Mandat V3

### A. Alur Kerja Editorial & Tata Kelola Mandiri
- Publikasi artikel berita tidak lagi bercampur dengan logika monolitik.
- Artikel baru dapat disimpan sebagai `draft`, ditinjau melalui `editorial_review`, dan dipublikasikan resmi (`published`) hanya oleh `platform_admin`.
- Pengarsipan artikel usang mewajibkan alasan minimal 5 karakter demi akuntabilitas jejak redaksi.

### B. Caching Reaktif & Performa Baca Sub-10ms
- Kueri berita publik disajikan langsung dari model baca ber-cache dengan s-maxage.
- Setiap pembaruan atau publikasi artikel baru memicu invalidasi tag otomatis (`invalidateContentTags`), sehingga artikel baru langsung muncul di beranda dan halaman direktori tanpa menunggu masa kedaluwarsa TTL.

### C. Emisi Peristiwa Outbox Domain
- `ArticlePublished`: Dikirim saat artikel berstatus `published`. Memungkinkan layanan direktori dan notifikasi menyiarkan pengumuman turnamen ke atlet/tim terkait secara asinkron.
- `ArticleUpdated`: Dikirim saat konten diperbarui.
- `ArticleArchived`: Dikirim saat artikel ditarik dari peredaran publik.

### D. Jejak Audit Kriptografis Anti-Manipulasi
- Setiap mutasi artikel (`ARTICLE_CREATED`, `ARTICLE_UPDATED`, `ARTICLE_STATUS_TRANSITION`, `ARTICLE_DELETED`) mencatat jejak audit dengan hash SHA-256 yang kebal manipulasi.

---

## 4. Hasil Verifikasi Gerbang Mutu (G1–G10)

| No | Kriteria Gerbang Mutu | Hasil Uji / Bukti | Status |
|:--:|---|---|:--:|
| **G1** | Suite Pengujian Menyeluruh | **11 berkas uji, 127 pengujian**: 100% LULUS (1.39 detik) | **PASS** |
| **G2** | Pemeriksaan Tipe TypeScript (`tsc --noEmit`) | 0 kesalahan pada seluruh paket monorepo (`contracts`, `lib`, `web`) | **PASS** |
| **G3** | Kompilasi Produksi Next.js (`npm run build`) | 119 rute terkompilasi sukses dalam 16.4 detik | **PASS** |
| **G4** | Sapu Istilah Terlarang (`scripts/sweep-terms.js`) | 0 kemunculan kata terlarang (ESI, PBESI, Pengcab, Pengprov, KONI, Dispora) | **PASS** |
| **G5** | Pemindaian Rahasia Bocor (`scripts/scan-secrets.js`) | 0 token/kunci ter-hardcode ditemukan | **PASS** |
| **G6** | Otorisasi Alur Editorial | Hak publikasi/arsip dibatasi ketat untuk `platform_admin` | **PASS** |
| **G7** | Invalidasi Cache Reaktif | Tag cache terbukti batal saat mutasi artikel dilakukan | **PASS** |
| **G8** | Emisi Peristiwa Outbox | Event `ArticlePublished` terbit sesuai standar kontrak paket | **PASS** |
| **G9** | Penanganan Slug Unik | Slug ramah SEO dan penanganan tabrakan slug otomatis | **PASS** |
| **G10** | Kesiapan Rollback (Feature Flag) | `FLAGS.USE_CONTENT_SERVICE` dapat dinonaktifkan instan via env | **PASS** |

---

## 5. Rencana Sub-Langkah Selanjutnya

Sub-langkah berikutnya adalah **Sub-langkah 7.6 (Modularisasi `core` - Identity, Profile, Ecosystem, Catalog)**:
1. Menegakkan batas modul yang ketat (*import boundaries*) di tingkat kode dan paket.
2. Memisahkan skema data logis: tanpa JOIN lintas schema dan tanpa foreign key lintas layanan (menggunakan ID sebagai referensi).
3. Kontrak internal untuk interaksi antar-modul inti.
4. Menyiapkan jalur dokumentasi arsitektur untuk pemisahan fisik basis data di masa mendatang.
5. Pembuatan tes batas impor, uji modul independen, dan *quality gate*.
