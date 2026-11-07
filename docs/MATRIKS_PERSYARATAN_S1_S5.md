# MATRIKS PERSYARATAN FRONTEND ESPORT SUMBAR V3 (S1 - S5)

> Status Awal: **BAGIAN 0 (Baseline & Investigasi Akar Masalah)**  
> Tanggal: 7 November 2026  
> Baseline Commit: `67c8cd7` (Tag: `v3-pre-frontend`)

---

## 1. Matriks Sasaran Utama

| ID | Sasaran Strategis | Kriteria Keberhasilan | Status Saat Ini | Target Penyelesaian | Bukti / Catatan |
|---|---|---|---|---|---|
| **S1** | **Pembersihan Total Istilah & Klaim Terlarang** | Nol sebutan ESI, Pengprov, Pengcab, PBESI, KONI, Dispora, atau turunannya di seluruh tampilan, teks, data, gambar, email, dan metadata platform; Nol klaim terlarang ("resmi", "sah", "kepatuhan UU PDP", "berdaulat", dll.). | ⏳ **BELUM** (Baseline: 977 temuan di kode, 90 temuan di HTML render) | Bagian 2 (Sapu Konten) & Bagian 11 (Audit Akhir) | Terbukti di Bagian 0 via `crawler-rendered-output.js` dan `audit-deep-terms.js`. |
| **S2** | **Penyelarasan Domain V3 Penuh** | ESPORT SUMBAR satu-satunya pemilik dan pemverifikasi; verifikasi satu tahap tunggal; admin tunggal (`platform_admin`); 1 akun = 1 bidang; ekosistem 7 entitas terhubung; katalog game dinamis. | ⏳ **BELUM** (Masih ada sisa teks kemitraan, multi-wizard mobile, label perisai lama) | Bagian 2 & Bagian 3 | Diselaraskan di level teks pada Bagian 2 dan level alur pada Bagian 3. |
| **S3** | **Konsep Visual Liquid Glass 2026 + Motion Profesional** | Penerapan material kaca cair (thin/regular/thick/tinted), radius konsentris, specular pointer, scene prosedural ringan, 3 mode kualitas adaptif (Penuh, Standar, Hemat), motion token terstandardisasi di SEMUA halaman. | ⏳ **BELUM** (Masih tampilan gelap datar V2) | Bagian 4, 5, 6, 7, 8, 9, 10 | Primitif dibangun di Bagian 4, komponen di Bagian 5, aplikasi di Bagian 6-10. |
| **S4** | **Kelengkapan Halaman & Alur (Manifest Rute)** | Seluruh rute pada Bagian 3.3 dan D5 tersedia, tidak ada tautan mati/loop/404, sinkron 100% antara Manifest Rute, `next build`, dan crawl. | ⏳ **BELUM** (Baseline: 8 halaman D5 belum ada, 1 tautan mati `/partners`) | Bagian 3 (Kelengkapan Halaman) | Manifest awal diterbitkan di `docs/MANIFEST_RUTE_V3.json`. |
| **S5** | **Kualitas, Aksesibilitas, dan Performa** | WCAG 2.1 AA (0 pelanggaran serius/kritis axe, kontras latar terburuk ≥ 4,5:1), 60 fps di Android menengah, LCP < 2,5s, INP < 200ms, isolasi data aman (zero direct DB calls, zero client secrets). | ⏳ **BELUM** (Baseline: Kontras belum diuji di atas kaca, lint 362 error, e2e browser belum ada) | Bagian 4, 5, 10, 11 | Alat ukur browser dibangun di Bagian 0. |

---

## 2. Pelacakan Status per Bagian

| Bagian | Deskripsi | Status | Gerbang Mutu | Tag Git |
|---|---|:---:|:---:|:---:|
| **Bagian 0** | Baseline, Paritas Deployment, dan Akar Masalah ESI | 🟡 **SEDANG BERJALAN** | FG1 - FG13 | `v3fe-part-0` |
| **Bagian 1** | Analisis dan Rencana Desain (Wireframe, ADR, Spek) | ⚪ BELUM | FG1 - FG13 | `v3fe-part-1` |
| **Bagian 2** | Sapu ESI dan Selaraskan Konten dengan V3 (Modul Copy) | ⚪ BELUM | FG1 - FG13 | `v3fe-part-2` |
| **Bagian 3** | Kelengkapan Halaman dan Alur (Rute D5, Konsolidasi Wizard) | ⚪ BELUM | FG1 - FG13 | `v3fe-part-3` |
| **Bagian 4** | Fondasi Desain Liquid Glass (Token, Primitif, Lab `/dev/glass`) | ⚪ BELUM | FG1 - FG13 | `v3fe-part-4` |
| **Bagian 5** | Perpustakaan Komponen Kaca (GlassNav, GlassCard, QuietSurface) | ⚪ BELUM | FG1 - FG13 | `v3fe-part-5` |
| **Bagian 6** | Kerangka Aplikasi dan Navigasi (GlassNav, GlassTabBar, Footer) | ⚪ BELUM | FG1 - FG13 | `v3fe-part-6` |
| **Bagian 7** | Redesain Halaman Publik (Beranda, Direktori, Profil 7 Bidang, Legal) | ⚪ BELUM | FG1 - FG13 | `v3fe-part-7` |
| **Bagian 8** | Autentikasi, Onboarding, dan Area Pengguna (`/me`, `/dashboard`, Kartu) | ⚪ BELUM | FG1 - FG13 | `v3fe-part-8` |
| **Bagian 9** | Panel Admin Terkendali (Kaca Chrome + QuietSurface Tabel) | ⚪ BELUM | FG1 - FG13 | `v3fe-part-9` |
| **Bagian 10** | Koreografi Motion dan Optimasi (FPS, Kompositing, Reduced Motion) | ⚪ BELUM | FG1 - FG13 | `v3fe-part-10` |
| **Bagian 11** | QA Menyeluruh dan Kesiapan Rilis (Crawl Akhir, Paritas, Laporan Akhir) | ⚪ BELUM | FG1 - FG13 | `v3fe-part-11` |
