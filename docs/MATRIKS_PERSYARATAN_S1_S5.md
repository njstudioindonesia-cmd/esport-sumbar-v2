# MATRIKS PERSYARATAN FRONTEND ESPORT SUMBAR V3 (S1 - S5)

> Status Pembaruan: **SELESAI BAGIAN 8 (Autentikasi, Onboarding, dan Area Pengguna Liquid Glass 2026: UnifiedAuthView, CardWizard 7 Bidang, UserShell Responsif, Dashboard Bento, Tampilan Kartu, Tracker Verifikasi, Ekosistem, Notifikasi, Privasi UU PDP, dan Pengaturan Efek Visual)**  
> Tanggal: 7 November 2026  
> Baseline Commit: Tag `v3fe-part-7`  
> Target Commit Gerbang 8: Tag `v3fe-part-8`

---

## 1. Matriks Sasaran Utama

| ID | Sasaran Strategis | Kriteria Keberhasilan | Status Saat Ini | Target Penyelesaian | Bukti / Dokumen Rujukan |
|---|---|---|---|---|---|
| **S1** | **Pembersihan Total Istilah & Klaim Terlarang** | Nol sebutan ESI, Pengprov, Pengcab, PBESI, KONI, Dispora, atau turunannya di seluruh tampilan, teks, data, gambar, email, dan metadata platform; Nol klaim terlarang ("resmi", "sah", "kepatuhan UU PDP", "berdaulat", dll.). | 🟢 **SELESAI (100% LULUS)** | Bagian 2, 3, 7, 8 | `scripts/sweep-terms.js --strict` (0 temuan), `scripts/crawler-rendered-output.js` (0 temuan HTML), `packages/lib/src/copy/index.ts`. |
| **S2** | **Penyelarasan Domain V3 Penuh** | ESPORT SUMBAR satu-satunya pemilik dan pemverifikasi; verifikasi satu tahap tunggal; admin tunggal (`platform_admin`); 1 akun = 1 bidang; ekosistem 7 entitas terhubung; katalog game dinamis; 17 aturan relasi deklaratif. | 🟢 **SELESAI (100% LULUS)** | Bagian 3, 5, 6, 7, 8 | 1 Akun 1 Bidang Onboarding, Verifikasi Satu Tahap Tracker (`/me/verification`), Admin Tunggal (`/admin`), Relasi Ekosistem (`/me/ecosystem`). |
| **S3** | **Konsep Visual Liquid Glass 2026 + Motion Profesional** | Penerapan material kaca cair (thin/regular/thick/tinted), radius konsentris, specular pointer, scene prosedural ringan, 3 mode kualitas adaptif (Penuh, Standar, Hemat), motion token terstandardisasi di SEMUA halaman. | 🟢 **SELESAI HALAMAN PUBLIK & PENGGUNA** (UnifiedAuthView, CardWizard, UserShell, Bento Dashboard, Selector Efek Visual di `/me/settings`) | Bagian 6-8 Selesai, Bagian 9-10 (Admin Panel & Fine-tuning Motion) | `apps/web/src/components/auth/`, `apps/web/src/components/wizard/`, `apps/web/src/components/dashboard/`, `apps/web/src/components/glass/`. |
| **S4** | **Kelengkapan Halaman & Alur (Manifest Rute)** | Seluruh rute pada Bagian 3.3 dan D5 tersedia, tidak ada tautan mati/loop/404, sinkron 100% antara Manifest Rute, `next build`, dan crawl (150 rute terkompilasi, 301 terpasang). | 🟢 **SELESAI (100% LULUS)** | Bagian 3, 6, 7, 8 | `docs/MANIFEST_RUTE_V3.json` (66 rute frontend), `next build` (150 rute lolos), `scripts/verify-manifest-and-links.js` (0 link rusak). |
| **S5** | **Kualitas, Aksesibilitas, dan Performa** | WCAG 2.1 AA (0 pelanggaran serius/kritis axe, kontras latar terburuk $\ge 4,5:1$), 60 fps di Android menengah, LCP < 2,5s, INP < 200ms, isolasi data aman (zero direct DB calls, zero client secrets). | 🟢 **TERVERIFIKASI PADA LEVEL AREA PENGGUNA** (BFF 100% terisolasi, 0 secrets, 236 unit tests lolos, build bersih 150 rute, 0 broken links) | Bagian 8 Selesai, Bagian 9-11 | `docs/ANGGARAN_PERFORMA_DAN_AKSESIBILITAS_V3.md`, `scripts/verify-client-db-isolation.js`, `npm run audit:secrets`. |

---

## 2. Pelacakan Status per Bagian

| Bagian | Deskripsi | Status | Gerbang Mutu | Tag Git |
|---|---|:---:|:---:|:---:|
| **Bagian 0** | Baseline, Paritas Deployment, dan Akar Masalah ESI | ✅ **LULUS** | FG1 - FG13 Lulus Baseline | `v3fe-part-0` |
| **Bagian 1** | Analisis dan Rencana Desain (Wireframe, ADR, Spek) | ✅ **LULUS** | FG1 - FG13 Lulus Dokumen | `v3fe-part-1` |
| **Bagian 2** | Sapu ESI dan Selaraskan Konten dengan V3 (Modul Copy) | ✅ **LULUS** | FG1 - FG13 Lulus Penuh | `v3fe-part-2` |
| **Bagian 3** | Kelengkapan Halaman dan Alur (Rute D5, Pengalihan 301, Konsolidasi) | ✅ **LULUS** | FG1 - FG13 Lulus Penuh (149 rute lolos, 0 temuan sapu, 0 temuan crawl, 0 link mati) | `v3fe-part-3` |
| **Bagian 4** | Fondasi Desain Liquid Glass (Token, Primitif, Lab `/dev/glass`) | ✅ **LULUS** | FG1 - FG13 Lulus Penuh (0 temuan sapu, 0 temuan crawl, 200 tes lulus, 0 halaman produk diubah) | `v3fe-part-4` |
| **Bagian 5** | Perpustakaan Komponen Kaca (GlassNav, GlassCard, Form, Badges D17) | ✅ **LULUS** | FG1 - FG13 Lulus Penuh (0 temuan sapu, 0 temuan crawl, 216 tes lulus, showcase aktif) | `v3fe-part-5` |
| **Bagian 6** | Kerangka Aplikasi dan Navigasi (GlassNav, GlassTabBar, Footer) | ✅ **LULUS** | FG1 - FG13 Lulus Penuh (0 temuan sapu, 0 temuan crawl, 224 tes lulus, 0 link rusak) | `v3fe-part-6` |
| **Bagian 7** | Redesain Halaman Publik (Beranda, Direktori, Profil 7 Bidang, Legal) | ✅ **LULUS** | FG1 - FG13 Lulus Penuh (0 temuan sapu, 0 temuan crawl, 231 tes lulus, 0 link rusak) | `v3fe-part-7` |
| **Bagian 8** | Autentikasi, Onboarding, dan Area Pengguna (`/me`, `/dashboard`, Kartu) | ✅ **LULUS** | FG1 - FG13 Lulus Penuh (0 temuan sapu, 0 temuan crawl, 236 tes lulus, 0 link rusak) | `v3fe-part-8` |
| **Bagian 9** | Panel Admin Terkendali (Kaca Chrome + QuietSurface Tabel) | ⚪ BERIKUTNYA | FG1 - FG13 | `v3fe-part-9` |
| **Bagian 10** | Koreografi Motion dan Optimasi (FPS, Kompositing, Reduced Motion) | ⚪ BELUM | FG1 - FG13 | `v3fe-part-10` |
| **Bagian 11** | QA Menyeluruh dan Kesiapan Rilis (Crawl Akhir, Paritas, Laporan Akhir) | ⚪ BELUM | FG1 - FG13 | `v3fe-part-11` |
