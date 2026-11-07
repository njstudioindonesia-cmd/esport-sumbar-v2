# MATRIKS PERSYARATAN FRONTEND ESPORT SUMBAR V3 (S1 - S5)

> Status Pembaruan: **SELESAI BAGIAN 1 (Analisis & Rencana Desain Liquid Glass)**  
> Tanggal: 7 November 2026  
> Baseline Commit: `aafd3a3` (Tag: `v3fe-part-0`)  
> Target Commit Gerbang 1: Tag `v3fe-part-1`

---

## 1. Matriks Sasaran Utama

| ID | Sasaran Strategis | Kriteria Keberhasilan | Status Saat Ini | Target Penyelesaian | Bukti / Dokumen Rujukan |
|---|---|---|---|---|---|
| **S1** | **Pembersihan Total Istilah & Klaim Terlarang** | Nol sebutan ESI, Pengprov, Pengcab, PBESI, KONI, Dispora, atau turunannya di seluruh tampilan, teks, data, gambar, email, dan metadata platform; Nol klaim terlarang ("resmi", "sah", "kepatuhan UU PDP", "berdaulat", dll.). | 🟡 **TERENCANA DETAIL** (977 temuan di kode dipetakan ke modul `copy`) | Bagian 2 (Sapu Konten & Modul Copy) | `docs/INVENTARIS_HALAMAN_V3.md` memetakan lokasi pelanggaran per rute; modul copy dirancang di ADR-007. |
| **S2** | **Penyelarasan Domain V3 Penuh** | ESPORT SUMBAR satu-satunya pemilik dan pemverifikasi; verifikasi satu tahap tunggal; admin tunggal (`platform_admin`); 1 akun = 1 bidang; ekosistem 7 entitas terhubung; katalog game dinamis. | 🟡 **TERENCANA DETAIL** (15 komponen ganda mobile dipetakan untuk konsolidasi) | Bagian 2 (Teks) & Bagian 3 (Alur) | `docs/ANALISIS_ALUR_V3.md` memetakan alur 1-bidang, verifikasi tunggal, dan relasi deklaratif. |
| **S3** | **Konsep Visual Liquid Glass 2026 + Motion Profesional** | Penerapan material kaca cair (thin/regular/thick/tinted), radius konsentris, specular pointer, scene prosedural ringan, 3 mode kualitas adaptif (Penuh, Standar, Hemat), motion token terstandardisasi di SEMUA halaman. | 🟡 **SPESIFIKASI SELESAI** (Token, formula konsentris & wireframe tuntas) | Bagian 4 (Fondasi), Bagian 5 (Komponen), Bagian 6-10 | `docs/adr/ADR-007-frontend-liquid-glass-architecture.md` & `docs/SPESIFIKASI_DESAIN_DAN_WIREFRAME_V3.md`. |
| **S4** | **Kelengkapan Halaman & Alur (Manifest Rute)** | Seluruh rute pada Bagian 3.3 dan D5 tersedia, tidak ada tautan mati/loop/404, sinkron 100% antara Manifest Rute, `next build`, dan crawl. | 🟡 **SPESIFIKASI SELESAI** (15 halaman baru & matriks pengalihan 301 dirancang) | Bagian 3 (Kelengkapan Halaman & 301 Redirects) | `docs/RENCANA_HALAMAN_BARU_DAN_PENGALIHAN_301.md` & `docs/MANIFEST_RUTE_V3.json`. |
| **S5** | **Kualitas, Aksesibilitas, dan Performa** | WCAG 2.1 AA (0 pelanggaran serius/kritis axe, kontras latar terburuk $\ge 4,5:1$), 60 fps di Android menengah, LCP < 2,5s, INP < 200ms, isolasi data aman (zero direct DB calls, zero client secrets). | 🟡 **ANGGARAN DITETAPKAN** (Batas 2 lapisan blur, scrim penjamin kontras diuji) | Bagian 4, 5, 10, 11 | `docs/ANGGARAN_PERFORMA_DAN_AKSESIBILITAS_V3.md`. |

---

## 2. Pelacakan Status per Bagian

| Bagian | Deskripsi | Status | Gerbang Mutu | Tag Git |
|---|---|:---:|:---:|:---:|
| **Bagian 0** | Baseline, Paritas Deployment, dan Akar Masalah ESI | ✅ **LULUS** | FG1 - FG13 Lulus Baseline | `v3fe-part-0` |
| **Bagian 1** | Analisis dan Rencana Desain (Wireframe, ADR, Spek) | 🟡 **SELESAI (MENUNGGU PERSETUJUAN)** | FG1 - FG13 Lulus Dokumen | `v3fe-part-1` |
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
