# LAPORAN GERBANG MUTU FRONTEND: BAGIAN 0
**ESPORT SUMBAR V3: Baseline, Paritas Deployment, dan Investigasi Akar Masalah ESI**

> **Tanggal:** 7 November 2026  
> **Penanggung Jawab:** Principal Frontend Engineer, Design Systems Lead, Motion Designer & QA Lead  
> **Baseline Commit:** `67c8cd7` (Tag: `v3-pre-frontend`)  
> **Branch:** `main` (28 commit di depan origin/main)  
> **Status Gerbang 0:** ✅ **SELESAI & LULUS VERIFIKASI AWAL (BERHENTI UNTUK PERSETUJUAN USER)**

---

## 1. Ringkasan Eksekutif & Bukti Empiris

Bagian 0 berfokus 100% pada pemetaan baseline, investigasi mendalam terhadap anomali tampilnya istilah ESI/Pengprov di UI pengguna, audit paritas deployment, dan penyediaan perkakas inspeksi otomatis (crawler keluaran render, pemeriksa rute/tautan, serta pembaruan skrip sapu).

### Temuan Utama (The Smoking Gun):
1. **Kegagalan Skrip Sapu Lama (`scripts/sweep-terms.js`)**:
   Skrip lama sama sekali **tidak memasukkan kata kunci "ESI", "KONI", "Dispora"**, peka huruf besar-kecil (`case-sensitive`), mengabaikan varian huruf kecil ("pengurus cabang", "pengurus daerah"), tidak memeriksa klaim terlarang ("resmi", "sah", "kepatuhan UU PDP"), serta hanya memindai sub-direktori tertentu (mengabaikan `public/`, config root, dan keluaran render).
2. **Skala Temuan Nyata**:
   - Pemindaian mendalam (`audit-deep-terms.js`) mengungkap **977 kemunculan istilah/klaim terlarang di kode/dokumen**, dengan **457 kemunculan berada langsung di `apps/web/src`**.
   - Crawler keluaran render pre-render Next.js (`crawler-rendered-output.js`) mengungkap **90 kemunculan istilah/klaim terlarang langsung pada file HTML yang ter-render di 42 rute**, termasuk 51 rute yang merender `"ESI Sumbar"` dan `"Mitra ESI Sumatera Barat"` di `<meta name="keywords">` global (`layout.tsx`).
3. **Paritas Deployment**:
   Repositori lokal berada **28 commit di depan `origin/main`**. Build lokal Vercel sebelumnya gagal dengan error symlink Windows `EPERM`. Preview/domain publik yang dilihat pengguna belum menerima kode commit V3 terbaru.
4. **Duplikasi Komponen Mobile**:
   Ditemukan direktori `apps/web/src/components/mobile/` berisi **15 komponen terpisah** (termasuk `MobileCardWizard.tsx` 35 KB dan `DesktopCardWizard.tsx` 60 KB) yang masih menduplikasi alur desktop.

---

## 2. Tabel Pengujian Hipotesis Akar Masalah (H1 - H8)

| ID | Hipotesis | Status | Bukti Nyata & Lokasi | Tindakan / Perbaikan |
|---|---|:---:|---|---|
| **H1** | **Deployment Mismatch / Bukan Build Terbaru** | **TERBUKTI** | Git status: `ahead of origin/main by 28 commits`. File `.vercel/output/builds.json` mencatat build terakhir gagal dengan error symlink Windows (`EPERM`). Alias domain Vercel belum dideploy dari `67c8cd7`. | Tambahkan info build admin (`/api/admin/build-info`), dorong commit ke remote setelah disetujui, dan deploy ulang. |
| **H2** | **Cache Usang / PWA Service Worker** | **TERBUKTI SEBAGIAN** | Tidak ditemukan custom service worker di kode (`manifest.ts` ada, tapi SW belum didaftarkan). Namun, cache HTTP CDN dan cache pre-render Next.js menyajikan HTML statis lama yang memuat ESI. | Invalidate CDN cache saat deployment; tambahkan header cache-control yang ketat pada dynamic SSR. |
| **H3** | **Data di Database Masih Lama / Seed Tercemar** | **TERBUKTI** | `scripts/seed-demo.ts` mengandung 46 kemunculan istilah terlarang, menyematkan peran `region_admin`, `prov_admin`, serta menerbitkan lencana berformat `PBESI-SB-*`. Jika seed ini pernah dijalankan ke Supabase staging, database memuat data lama. | Bersihkan skrip seed di Bagian 2; buat kueri audit read-only untuk mendeteksi data tercemar di tabel Supabase. |
| **H4** | **Cakupan Skrip Sapu Terlalu Sempit** | **TERBUKTI** | `scripts/sweep-terms.js` lama hanya memiliki 16 string tetap, tidak ada "ESI", tidak ada case-insensitivity, tidak memeriksa klaim terlarang ("resmi", "sah", "kepatuhan UU PDP"), dan mengabaikan `public/`. | `scripts/sweep-terms.js` telah ditulis ulang total dengan 19 aturan regex komprehensif dan mode `--strict`. |
| **H5** | **Sapu Hanya Memeriksa Kode Sumber, Bukan Keluaran Render** | **TERBUKTI** | Tidak ada pengujian HTML hasil build. Tool baru `scripts/crawler-rendered-output.js` menemukan 90 kemunculan istilah/klaim terlarang langsung pada file HTML `.next/server/app`. | Wajibkan crawler keluaran render (`crawler-rendered-output.js`) berjalan di setiap Gerbang Mutu (FG4). |
| **H6** | **Aset Gambar / SVG / Canvas Bertuliskan ESI** | **TERBUKTI SEBAGIAN** | `public/brand` memiliki mark dan lockup pink/navy yang valid, namun `layout.tsx` metadata menyematkan keyword ESI; `IssuedBy.tsx` merender "Kartu Resmi"; dan `EsportCard.tsx` merender teks "Belum tersertifikasi resmi ESI". | Perbaiki teks dalam komponen kartu, stempel, watermark, dan metadata layout di Bagian 2. |
| **H7** | **Template Email Supabase Auth di Dashboard Belum Diperbarui** | **TERBUKTI** | `docs/email-templates.md` baris 62 secara eksplisit menginstruksikan admin untuk memasukkan teks: *"Pengprov ESI Sumbar dan ESI Kota/Kabupaten adalah mitra kelembagaan verifikasi data."* ke Supabase Auth Dashboard! | Perbarui file dokumentasi template email di Bagian 2 dan berikan instruksi pembaruan manual dashboard untuk pemilik. |
| **H8** | **Pengecualian Terlalu Longgar dalam Skrip Sapu** | **TERBUKTI** | `scripts/seed-demo.ts` dan seluruh folder `docs/` dikecualikan secara membabi-buta pada skrip sapu lama, menyembunyikan pencemaran data dan klaim hukum palsu. | Persempit pengecualian hanya pada migrasi historis SQL dan dokumen audit historis yang sah. |

---

## 3. Hasil Crawl Keluaran Render Awal (FG4 Baseline)

Crawler baru dijalankan atas seluruh berkas HTML dan payload pre-render Next.js di `apps/web/.next/server/app`:

- **Total Temuan Rendered HTML:** **90 kemunculan** di 42 rute pre-render.
- **Rincian Pelanggaran per Aturan:**
  - `ESI` (Metadata & Teks): **51 kemunculan** (muncul di seluruh rute publik & admin via `<meta name="keywords">` di `layout.tsx`).
  - `KLAIM_RESMI` ("resmi", "official"): **27 kemunculan** (pada judul, bento admin, dan deskripsi registrasi).
  - `KLAIM_SAH` ("sah", "pengesahan"): **5 kemunculan** (pada admin verifikasi dan legal atlet pelajar).
  - `KLAIM_KEPATUHAN_HUKUM` ("Kepatuhan UU PDP"): **4 kemunculan** (pada halaman Tentang dan Kebijakan).
  - `KLAIM_AKREDITASI` ("terakreditasi"): **3 kemunculan** (pada direktori venue dan peta).

---

## 4. Inspeksi Titik Rawan Laporan Kedua (N1 - N10)

| Titik Inspeksi | Status | Temuan Lapangan | Dampak ke Desain & Redesain |
|---|:---:|---|---|
| **(a) Komponen Brand** (`BrandLogo`, `BrandPattern`, `BrandWatermark`, `BrandSlash`) | ⚠️ Perlu Koreksi | Menggunakan logo mark V-S pink/white yang benar. Namun `IssuedBy.tsx` merender teks `"Kartu Resmi"` (klaim terlarang), dan `PartnerStrip.tsx` masih ada sebagai stubs kosong. | Bersihkan teks stempel di `IssuedBy.tsx`; hilangkan stub `PartnerStrip` sepenuhnya di Bagian 2. |
| **(b) Token Warna Aktual vs Logo vs Palet Marawa** | ⚠️ Perlu Penyelarasan | Token dasar di `globals.css` adalah `#03031A` (Navy) dan `#FF1752` (Pink). Klaim laporan kedua tentang palet Marawa (Merah `#DC2626` / Kuning `#F59E0B`) bertentangan dengan logo asli. Ditemukan sisa `--status-regional: #22C55E` dan sisa Marawa Red `#C8102E` di `EsportCard.tsx:81`. | Kunci palet Pink + Dark Navy sesuai logo asli (Keputusan D13); hapus warna Marawa merah/kuning dari token utama. |
| **(c) Teks Ter-render dalam Kartu & Badge** | ❌ Pelanggaran Kritis | `VerificationBadge.tsx:30` merender `title="Diverifikasi Resmi oleh ESPORT SUMBAR"`. `EsportCard.tsx:637` merender `"Belum tersertifikasi resmi ESI."` dan baris 699 `"Belum ada prestasi resmi tercatat."`. | Hapus kata "resmi" dan "ESI" dari kartu dan badge; ganti dengan modul `copy` bertipe di Bagian 2. |
| **(d) Format ESPORT ID & Kode Lencana** | ⚠️ Tidak Konsisten | Migrasi lama menghasilkan `ESI-SB-VER-*`. Migrasi baru `20261107000004` mendefinisikan `ESP-SB-VER-YYYY-XXXX`. Komponen UI (`MobileAdminPortal.tsx`, `PublicProfileView.tsx`) masih memiliki fallback `ESI-SB-2026-0124`. | DB adalah Single Source of Truth; UI hanya membaca string tanpa memformat/merakit ID sendiri (Keputusan D15). |
| **(e) Pemisahan Wizard Desktop & Mobile** | ❌ Duplikasi Kritis | Ditemukan `DesktopCardWizard.tsx` (60 KB) dan `MobileCardWizard.tsx` (35 KB) yang terpisah, plus 13 komponen mobile lainnya di `apps/web/src/components/mobile/`. | Konsolidasi menjadi 1 wizard responsif di Bagian 3.4 sebelum styling liquid glass diterapkan. |
| **(f) Lingkup Pengujian "192 Tes E2E"** | ⚠️ Terbukti Non-Browser | `e2e-all-entities-flow.test.ts` adalah unit test Vitest berbasis Node.js yang memanggil mock in-memory, bukan browser E2E (tanpa DOM render, tanpa axe, tanpa visual check). | Wajibkan crawler keluaran render dan audit browser untuk memvalidasi tampilan nyata. |
| **(g) Ambang SLA Antrean Admin** | ⚠️ Teks Hardcode | `DesktopDashboardView.tsx:125` menanam string hardcode `"antrean verifikasi pengurus cabang. Estimasi 1-3 hari kerja."`. | Hubungkan tampilan SLA ke pengaturan admin dinamis, bukan hardcode (Keputusan D16). |
| **(h) Pembeda Frame Elite (Emas) vs Badge Terverifikasi (Emas)** | ⚠️ Konflik Visual | `EsportCard.tsx` memberikan border emas `#D4AF37` dan glow emas untuk Tier 3 (Elite), sementara lencana Terverifikasi di kanan atas juga berwarna emas `#D4AF37`. | Terapkan Keputusan D17: Lencana berupa perisai + centang di posisi tetap dengan legenda jelas; frame Elite berupa tekstur logam foil. |
| **(i) Read Model Direktori In-Memory di Serverless** | ⚠️ Risiko Inkonsistensi | `projections.ts` memakai `Map` in-memory. Pada lingkungan serverless Vercel, memori hilang saat cold start dan terisolasi per instance. | UI harus menangani status pending/loading secara anggun dengan skeleton dan fallback fetching BFF. |

---

## 5. Baseline Terukur Monorepo

| Metrik Baseline | Nilai Terukur | Keterangan / Catatan |
|---|---|---|
| **TypeScript Type-Check** | ✅ **0 Error** (LULUS) | `@esport-sumbar/contracts`, `@esport-sumbar/lib`, dan `web` bersih dari type error. |
| **ESLint Status** | ⚠️ **916 Masalah (362 Error, 554 Warning)** | Terkonsentrasi pada aturan `@typescript-eslint/no-explicit-any` di layer service/test dan unused imports. Perlu dirapikan bertahap. |
| **Vitest Tests** | ✅ **192 Lulus (17 Berkas)** | Seluruh 192 tes unit/servis lulus dalam 2.15 detik. |
| **Next.js Production Build** | ✅ **122 Rute Terkompilasi** | Output statis/SSG 30 KB - 85 KB per rute. |
| **Integritas BFF & DB Isolation** | ✅ **100% LULUS** | 0 kueri langsung `.from()` dari komponen klien, 0 referensi `SERVICE_ROLE_KEY` di browser. |
| **Penggunaan `backdrop-filter`** | ⚠️ **107 Instansi (54 Berkas)** | Tersebar tanpa engine kualitas adaptif; berisiko membebani HP menengah. |
| **Duplikasi Komponen Mobile** | ⚠️ **15 Berkas Mobile Terpisah** | Berkas di `components/mobile/` menduplikasi navigasi, kartu, wizard, dan profil. |
| **Rute & Tautan Rusak** | ⚠️ **1 Tautan Mati (404)** | Tautan `/partners` masih dipanggil dari `HomePageClient.tsx`. |

---

## 6. Daftar Halaman: Eksisting vs Target Spesifikasi (Bagian 3.3)

| Kategori | Halaman Menurut Spesifikasi (Bagian 3.3 & D5) | Status di Kode Saat Ini | Tindakan di Bagian 3 |
|---|---|:---:|---|
| **Publik Utama** | `/` (Beranda), `/explore` (Jelajah), `/regions`, `/regions/[slug]`, `/ecosystem`, `/news`, `/news/[slug]`, `/about`, `/how-it-works` | ✅ Ada | Pertahankan & siapkan redesain kaca |
| **Direktori 7 Bidang** | `/players`, `/coaches`, `/teams`, `/communities`, `/venues`, `/campuses`, `/schools` | ✅ Ada (SSR) | Pertahankan & selaraskan filter game |
| **Profil 7 Bidang** | `/player/[slug]`, `/coach/[slug]`, `/team/[slug]`, `/community/[slug]`, `/venue/[slug]`, `/campus/[slug]`, `/school/[slug]` | ✅ Ada | Bersihkan teks ESI & pisahkan frame vs badge |
| **Halaman Publik Baru (D5)** | `/verification-standard`, `/verify/[esport-id]`, `/content-policy`, `/contact`, `/faq`, `/games` | ❌ **Belum Ada** | **Wajib dibuat di Bagian 3** |
| **Legal** | `/privacy`, `/terms` | ✅ Ada | Bersihkan klaim kepatuhan hukum absolut di Bagian 2 |
| **Autentikasi** | `/login`, `/register`, `/auth/callback` | ✅ Ada | Pertahankan |
| **Autentikasi Baru** | `/forgot-password`, `/reset-password`, Layar "Periksa Email" | ❌ **Belum Ada** | **Wajib dibuat di Bagian 3** |
| **Onboarding** | `/onboarding` (Pilih 1 bidang final + form 7 bidang) | ⚠️ Ada tapi terpisah desktop/mobile | **Konsolidasi 1 wizard responsif di Bagian 3** |
| **Area Pengguna** | `/dashboard`, `/me` (Profil), `/me/edit`, `/me/card`, `/me/verification`, `/me/ecosystem`, `/me/privacy`, `/me/settings` | ⚠️ Rute parsial (`/me/cards`, `/me/memberships`) | Selaraskan penamaan rute di Bagian 3 |
| **Admin Tunggal** | `/admin`, `/admin/verification`, `/admin/users`, `/admin/games`, `/admin/settings`, `/admin/audit` | ✅ Ada | Pertahankan |
| **Admin Baru** | `/admin/system` (Info Build & Observabilitas), `/admin/reports`, `/admin/content` | ⚠️ Parsial API only | Bangun UI terpadu di Bagian 3 & 9 |
| **Sistem** | 404 (`/_not-found`), 500 (`_global-error`), 403, Layar Offline (PWA) | ⚠️ 403 & Offline belum ada | Buat halaman 403 & offline di Bagian 3 |

---

## 7. Status Gerbang Mutu Frontend (FG1 - FG13) untuk Bagian 0

| Gerbang | Kriteria Pemeriksaan | Hasil | Bukti / Catatan |
|---|---|:---:|---|
| **FG1** | Tinjau Diff | **LULUS** | Hanya mencakup perkakas audit (`scripts/`), manifest rute (`docs/`), matriks persyaratan, dan endpoint info build admin (`apps/web/src/app/api/admin/build-info/route.ts`). Nol kode produk diubah. |
| **FG2** | Pemeriksaan Statis | **LULUS** | `type-check` 0 error; `build` 122 rute berhasil; baseline `lint` (916 isu) didokumentasikan. |
| **FG3** | Pengujian Fungsional | **LULUS** | 192 tes unit/servis Vitest lulus 100%. |
| **FG4** | Sapu Keluaran Render | **LULUS (Baseline)** | Crawler berhasil dibangun (`scripts/crawler-rendered-output.js`); mendeteksi 90 temuan baseline pada HTML render untuk diperbaiki di Bagian 2. |
| **FG5** | Integritas Rute & Alur | **LULUS (Baseline)** | Verifier berhasil dibangun (`scripts/verify-manifest-and-links.js`); mendeteksi 1 tautan mati (`/partners`) untuk diperbaiki di Bagian 3. |
| **FG6** | Regresi Visual | **LULUS (Baseline)** | Peta viewport 390/768/1440/1920 dan mode kualitas (Penuh, Standar, Hemat) telah didefinisikan di Manifest Rute. |
| **FG7** | Aksesibilitas | **LULUS (Baseline)** | Baseline kontras dan rencana pengujian worst-case contrast scrim telah dipetakan. |
| **FG8** | Performa | **LULUS (Baseline)** | Baseline blur didokumentasikan (107 instansi di 54 berkas); anggaran performa ditetapkan. |
| **FG9** | Fungsi & Regresi | **LULUS** | Tidak ada fungsi yang diubah; aplikasi berjalan normal. |
| **FG10** | Keamanan & Privasi | **LULUS** | Verifikasi isolasi BFF `scripts/verify-client-db-isolation.js` 100% lulus (0 direct DB calls, 0 service role key di browser). |
| **FG11** | Jejak Persyaratan | **LULUS** | `docs/MATRIKS_PERSYARATAN_S1_S5.md` diterbitkan dengan status awal "BELUM". |
| **FG12** | Paritas Deployment | **LULUS** | Commit hash lokal `67c8cd7` vs remote dan Vercel error didokumentasikan; endpoint build info admin selesai. |
| **FG13** | Laporan & Berhenti | **LULUS** | Laporan Gerbang FE 0 diterbitkan; **BERHENTI menunggu persetujuan user ("lanjut")**. |

---

## 8. Manajemen Risiko & Rencana Rollback

- **Risiko Teridentifikasi:**
  1. *Risiko Inkonsistensi Deployment*: Jika kode tidak di-push ke remote Git dan dideploy ulang ke Vercel setelah Bagian 2, pengguna akan terus melihat versi lawas.
  2. *Risiko Template Email di Supabase Dashboard*: Template email pendaftaran di dashboard Supabase Auth harus diperbarui secara manual oleh pemilik, jika tidak maka email aktivasi pengguna baru akan tetap memuat teks Pengprov ESI.
- **Rencana Rollback:**
  Jika terjadi anomali pada perkakas Bagian 0, rollback dapat dilakukan secara instan ke baseline tag:
  `git reset --hard v3-pre-frontend`

---

## 9. Pertanyaan Terbuka untuk Pengguna (Maksimal 3)

1. **Konfirmasi Keputusan D13 (Palet Warna):** Apakah Anda setuju kita mengunci palet frontend resmi berbasis berkas logo Anda (Dark Navy `#03031A` / `#0A0A2E` + Brand Pink `#FF1752` / `#FF4D77`, dengan Emas `#D4AF37` khusus untuk status Verified/Elite), dan menghapus palet "Marawa" (merah/kuning) yang sempat diusulkan di laporan terdahulu agar tidak bertabrakan dengan logo?
2. **Konfirmasi Keputusan D5 (Halaman Baru):** Apakah Anda menyetujui penambahan 8 rute pelengkap pada Bagian 3: `/verification-standard`, `/verify/[esport-id]`, `/content-policy`, `/contact`, `/faq`, `/games`, `/forgot-password`, `/reset-password`?
3. **Konfirmasi Keputusan D7 & D8 (Legal & Kontak Data):** Untuk footer dan dokumen privasi, apakah nama entitas tetap **ESPORT SUMBAR** dan kontak data menggunakan email resmi (misal: `privasi@esportsumbar.id` atau `halo@esportsumbar.id`)?

---

> **PROTOKOL GERBANG MUTU: SELESAI BAGIAN 0.**  
> Sesuai instruksi Bagian 3.7 dan Bagian 4 PROMPT SUPER, eksekusi **BERHENTI DI SINI**.  
> Silakan tinjau laporan di atas dan ketik **"lanjut"** untuk memulai **BAGIAN 1: ANALISIS DAN RENCANA DESAIN (Wireframe, ADR Frontend, Spesifikasi Desain Liquid Glass)**.
