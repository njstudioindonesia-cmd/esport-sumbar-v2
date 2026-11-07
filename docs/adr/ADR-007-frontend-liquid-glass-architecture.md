# ADR-007: Arsitektur Desain Liquid Glass 2026, Sistem Motion, dan Tata Kelola Teks Frontend V3

- **Status:** Diterima (Accepted)
- **Tanggal:** 7 November 2026
- **Penulis:** Principal Frontend Engineer, Design Systems Lead, Motion Designer & QA Lead
- **Domain:** Frontend (`apps/web`), UI/UX, Design System, Aksesibilitas, Performa

---

## 1. Konteks dan Latar Belakang

Platform **ESPORT SUMBAR V3** membutuhkan transformasi visual total yang mencerminkan modernitas pangkalan data esport profesional tahun 2026. Desain harus menggabungkan estetika **Liquid Glass** (kaca cair translusen dengan bias cahaya hidup) dan **motion** profesional tanpa mengorbankan keterbacaan data, kepatuhan aksesibilitas WCAG 2.1 AA, serta performa tinggi (60 fps) di perangkat ponsel pintar Android kelas menengah.

Selain itu, audit Bagian 0 mengungkap 977 kemunculan istilah/klaim terlarang di kode dan 90 di HTML hasil render karena teks tersebar tanpa modul terpusat. Keputusan arsitektur ini menetapkan fondasi teknik untuk:
1. Material liquid glass dan refraksi terkendali.
2. Token visual (warna brand, material, radius konsentris, bayangan, gerak).
3. Strategi koreografi motion dan transisi halaman.
4. Jaminan kontras teks di atas latar dinamis (scrim).
5. Pembagian tegas antara Zona Kaca (navigasi & kontrol) dan Zona Tenang (`QuietSurface`).
6. Sentralisasi seluruh teks platform ke dalam modul `copy` bertipe.
7. Strategi verifikasi multi-lapisan (crawler render, axe, Lighthouse CI).

---

## 2. Keputusan Arsitektur

### 2.1 Pendekatan Liquid Glass: CSS Backdrop-Filter vs Refraksi SVG

```
┌────────────────────────────────────────────────────────────────────────┐
│                   ARSITEKTUR MATERIAL KACA V3                          │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Lapisan Utama (Semua Browser Modern):                               │
│    - CSS `backdrop-filter: blur(...) saturate(...)`                    │
│    - Rim cahaya multi-stop gradient via `mask-image` atau border       │
│    - Specular highlight interaktif mengikuti pointer/kemiringan gyro   │
│                                                                        │
│ 2. Peningkatan Progresif (Chromium Desktop Khusus Momen Hero):         │
│    - Filter SVG `<feDisplacementMap>` untuk distorsi refraksi cairan   │
│    - HANYA pada elemen dekoratif panggung besar, TIDAK pada teks!      │
│                                                                        │
│ 3. Fallback Anggun (Safari, Firefox, Perangkat Menengah, & Hemat):     │
│    - Safari / Firefox: Menggunakan blur CSS standar (tanpa SVG filter) │
│    - Browser tanpa backdrop-filter: Surface solid translusen 92%      │
│    - prefers-reduced-transparency: Background solid 96% tanpa blur     │
└────────────────────────────────────────────────────────────────────────┘
```

#### Anggaran Lapisan Kaca (Blur Layer Budget):
- **Maksimal 2 Lapisan Bertingkat per Viewport:** Dilarang keras menumpuk kaca di atas kaca (misal: dialog kaca di atas card kaca di atas navbar kaca). Jika dialog/modal dibuka, backdrop di belakangnya diredupkan dengan overlay solid (`rgba(3, 3, 26, 0.75)`), bukan menambah blur baru.
- **Tiga Mode Kualitas Efek Adaptif (D2):**
  1. **Mode Penuh (High-End Desktop & Flagship Mobile):** Blur + Saturasi + Specular pointer aktif + Scene mesh animasi + Refraksi SVG.
  2. **Mode Standar (Perangkat Menengah & Safari/Firefox):** Blur regular (24px) + Rim cahaya + Scene statis ringan + Specular statis.
  3. **Mode Hemat (Low-End Mobile, Baterai Rendah, `Save-Data`, Reduced Motion/Transparency):** Tanpa blur (`backdrop-filter: none`), surface solid translusen (`rgba(10, 10, 46, 0.95)`), scene statis flat, animasi minimum.

---

### 2.2 Token Brand & Formula Radius Konsentris

#### A. Palet Warna Resmi (Mengikuti Berkas Logo Asli - Keputusan D13):
- **Base Background:** `#03031A` (Dark Navy ultra-dalam)
- **Surface Layer 1:** `#0A0A2E` (Navy pekat)
- **Surface Layer 2:** `#12123F` (Elevated Navy)
- **Brand Primary Accent:** `#FF1752` (Brand Pink V-S mark)
- **Brand Secondary Accent:** `#FF4D77` (Pink-400 untuk teks aksen)
- **Status Gold (Strictly Status Only):** `#D4AF37` (Khusus Lencana Terverifikasi dan Frame Rarity Elite)
- **Koreksi Deprekasi:** Palet "Marawa" (Merah Minang `#DC2626` / Kuning `#F59E0B`) dihapus dari token utama agar tidak bertabrakan dengan logo asli.

#### B. Formula Radius Konsentris (Concentric Geometry):
Untuk menjaga keharmonisan visual bentuk cair, radius sudut elemen anak di dalam kontainer kaca wajib mengikuti formula konsentris:
$$R_{\text{child}} = \max\left(0,\, R_{\text{parent}} - P\right)$$
di mana $P$ adalah padding antara induk dan anak.
- Kontainer Panel Utama: $R = 24\text{px}$, Padding = $12\text{px}$ $\rightarrow$ Radius Kartu Anak = $12\text{px}$.
- Kontainer Kartu TCG: $R = 20\text{px}$, Padding = $8\text{px}$ $\rightarrow$ Radius Tag Anak = $12\text{px}$.
- Kontrol & Tombol Kapsul: $R = 9999\text{px}$ (Pill shape).

---

### 2.3 Sistem Motion & Transisi Antar-Halaman

1. **Pustaka Motion:** Menggunakan **Framer Motion (`framer-motion`)** yang sudah terpasang di monorepo, dipadukan dengan **View Transitions API** standar peramban untuk transisi halaman yang didukung Next.js 16.
2. **Prinsip Gerak Fisika Pegas (Spring Physics):**
   - *Snappy* (Tombol, Switch, Tab indicator): `{ stiffness: 450, damping: 30 }`
   - *Fluid* (Morph Dialog, Sheet, Popover): `{ stiffness: 280, damping: 26 }`
   - *Gentle* (Scene ambient, Floating card stage): `{ stiffness: 120, damping: 20 }`
3. **Responsivitas Sentuhan (Touch Responsiveness):** Waktu respons interaksi pointer $\le 100\text{ms}$. Tekan tombol menghasilkan kompresi skala halus (`scale: 0.98`) dengan kilatan specular instan.
4. **Scroll-Driven Animation:** Memanfaatkan CSS `animation-timeline: scroll()` pada browser yang mendukung, dengan fallback IntersectionObserver di browser lawas.
5. **Aksesibilitas Gerak (`prefers-reduced-motion`):** Seluruh transform animasi diabaikan, dialihkan ke fade opacity pendek ($\le 150\text{ms}$).

---

### 2.4 Strategi Kontras di Atas Latar Variabel (The Scrim Layer)

Latar dinamis (mesh gradient yang bergerak dan berputar) berisiko menurunkan rasio kontras teks di bawah standar WCAG AA (4,5:1 untuk teks normal, 3:1 untuk teks besar).

**Solusi Arsitektur: Lapisan Penjamin Kontras (Scrim Layer):**
1. Setiap permukaan kaca yang memuat teks wajib menyertakan lapisan *scrim* internal bergradien:
   `background: linear-gradient(180deg, rgba(3, 3, 26, 0.45) 0%, rgba(3, 3, 26, 0.65) 100%)`.
2. Hierarki tipografi warna teks:
   - Teks Utama (`--text-primary`): `#FFFFFF` (Kontras minimal **11,8:1** di atas scrim navy).
   - Teks Sekunder (`--text-secondary`): `rgba(255, 255, 255, 0.72)` (Kontras minimal **6,2:1**).
   - Teks Muted (`--text-muted`): `rgba(255, 255, 255, 0.48)` (Kontras minimal **4,6:1** pada teks $\ge 12\text{px}$).
3. **Uji Kasus Terburuk (Worst-Case Test):** Kontras diuji pada titik paling terang dan paling ramai dari scene prosedural (`#FF1752` pink highlight di bawah kaca). Dengan scrim terpasang, rasio kontras terendah terukur adalah **5,1:1**, melampaui batas WCAG 2.1 AA.

---

### 2.5 Pembagian Wilayah: Zona Kaca vs Zona Tenang (`QuietSurface`)

Prinsip nomor satu: **Kaca untuk lapisan fungsional navigasi dan kontrol, bukan untuk teks panjang dan tabel data.**

| Komponen / Area | Klasifikasi Zona | Material yang Digunakan | Justifikasi Desain |
|---|:---:|---|---|
| Navbar Utama (`GlassNav`) | Zona Kaca | Kaca Reguler (24px blur + specular + rim) | Mengambang di atas konten, menyusut saat digulir. |
| Tab Bar Mobile (`GlassTabBar`) | Zona Kaca | Kaca Reguler + Indikator Kapsul Meluncur Cair | Navigasi cepat ibu jari di layar ponsel. |
| Kontrol UI (Button, Input, Select, Switch) | Zona Kaca | Kaca Cekung/Cembung Tipis (14px blur) | Memberikan feedback taktil dan kilau optik saat disentuh. |
| Stage Kartu 3D (`CardStage3D`) | Zona Kaca | Panggung Kaca Tebal (40px blur + specular) | Menyoroti kartu TCG tanpa mengubah kartu itu sendiri. |
| Dialog, Sheet, Popover, Menu | Zona Kaca | Kaca Reguler ber-scrim gelap | Fokus konteks modal dengan morphing dari titik sentuh. |
| **Tabel Admin & Antrean Verifikasi** | **Zona Tenang** | `QuietSurface` (Navy solid 94%, tanpa blur) | Menjamin kecepatan render ribuan sel dan keterbacaan tinggi. |
| **Formulir Onboarding & Edit Data Panjang** | **Zona Tenang** | `QuietSurface` (Navy pekat translusen 90%) | Menghilangkan kelelahan mata saat pengisian formulir multi-langkah. |
| **Halaman Baca Warta, Regulasi, Kebijakan** | **Zona Tenang** | `QuietSurface` | Tipografi editorial yang tenang dan tajam. |

---

### 2.6 Strategi Teks Terpusat: Modul `copy` Bertipe (`packages/lib/copy`)

Untuk mencegah kembalinya istilah/klaim terlarang:
1. Seluruh string teks platform yang dirender ke pengguna dipindahkan ke paket bertipe: `packages/lib/src/copy/index.ts`.
2. Dilarang keras menaruh teks platform statis langsung di dalam berkas komponen `.tsx`.
3. Skrip sapu CI (`scripts/sweep-terms.js --strict`) memindai modul copy dan seluruh kode untuk memastikan 0 kemunculan kata terlarang.
4. Bank teks Bagian 3.2 menjadi sumber kebenaran tunggal teks sistem (tagline, footer, status verifikasi, cara kerja, legal, 404/403/500).

---

### 2.7 Strategi Pengujian Multi-Lapisan (QA & Quality Gates)

1. **Gate Statis:** TypeScript 0 error, ESLint bersih dari error kritis, Next.js build 122 rute berhasil.
2. **Gate Fungsional:** 192 tes Vitest unit & integrasi outbox/relation rules wajib lulus.
3. **Gate Keluaran Render (FG4):** `crawler-rendered-output.js` memindai seluruh HTML & RSC pre-render; gagal jika ditemukan istilah/klaim terlarang di luar pengecualian sah.
4. **Gate Tautan & Manifest (FG5):** `verify-manifest-and-links.js` membandingkan manifest rute, filesystem, dan tautan internal; 0 tautan 404/mati.
5. **Gate Aksesibilitas (FG7):** Audit axe-core pada komponen kaca; 0 masalah level *Serious* atau *Critical*; kontras AA teruji.
6. **Gate Performa (FG8):** Anggaran LCP < 2,5s, INP < 200ms, CLS ~ 0, maksimal 2 lapisan blur bertingkat per viewport.

---

## 3. Konsekuensi

### Konsekuensi Positif:
- **Tampilan Modern & Unik:** Estetika liquid glass 2026 memberikan identitas visual premium bagi esport Sumatera Barat tanpa kesan kuno atau kaku.
- **Performa Terjamin di HP Menengah:** Adanya mode kualitas adaptif (Standar & Hemat) dan pembatasan zona kaca melindungi pengguna ponsel berdaya rendah dari jank atau lag.
- **Keterbacaan & Aksesibilitas Unggul:** Penggunaan `QuietSurface` pada tabel dan formulir serta lapisan scrim pada kaca menjamin teks selalu terbaca tajam dan lulus WCAG AA.
- **Bebas ESI Permanen:** Sentralisasi modul `copy` memastikan tidak ada lagi kebocoran istilah usang di kemudian hari.

### Konsekuensi yang Perlu Dikelola:
- Refraksi SVG membutuhkan deteksi kemampuan peramban (Chromium desktop saja) dan fallback otomatis ke blur CSS biasa di Safari dan Firefox.
- Wizard onboarding dan komponen mobile harus dikonsolidasi dengan hati-hati di Bagian 3 untuk menghindari regresi alur registrasi.
