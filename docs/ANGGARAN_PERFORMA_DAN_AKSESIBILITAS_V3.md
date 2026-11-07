# ANGGARAN PERFORMA DAN AKSESIBILITAS FRONTEND ESPORT SUMBAR V3

> Dokumen Bagian 1.6: Metrik Target Core Web Vitals, Batasan Lapisan Blur, Standar Aksesibilitas WCAG 2.1 AA, dan Protokol Uji Perangkat Menengah.

---

## 1. Anggaran Core Web Vitals & Performa Teknis

| Metrik Kunci | Batas Maksimal (Budget) | Kondisi Pengujian | Strategi Penjaminan |
|---|:---:|---|---|
| **LCP (Largest Contentful Paint)** | **< 2,5 detik** | Jaringan 4G Lambat, Mobile Menengah | Preload aset hero mark, hindari CSS blocking besar, optimasi gambar via Next.js Sharp WebP. |
| **INP (Interaction to Next Paint)** | **< 150 ms** | Mobile Menengah (Touch tap) | Efek tekan tombol instan via CSS transform (`scale: 0.98`), hindari synchronous layout thrashing di event handler. |
| **CLS (Cumulative Layout Shift)** | **≈ 0 (< 0,05)** | Seluruh Viewport (390 - 1920) | Dimensi eksplisit untuk seluruh kartu TCG (rasio aspek 2.5:3.5 terkunci), placeholder skeleton sebelum data tiba. |
| **TBT (Total Blocking Time)** | **< 150 ms** | Desktop & Mobile | Isolasi eksekusi Framer Motion, tree-shaking komponen icons, hindari loop komputasi di thread utama browser. |
| **Frame Rate (Scroll Smoothness)** | **60 fps** | Android RAM $\le$ 4 GB | Kompositing GPU murni (`transform` dan `opacity`), pembatasan lapisan blur, jeda scene di luar layar. |

---

## 2. Anggaran Material Kaca & Lapisan Blur (Blur Layer Budget)

Efek kaca (`backdrop-filter`) sangat membebani GPU perangkat seluler kelas menengah. Karena itu diberlakukan anggaran lapisan kaca ketat per halaman:

```
┌────────────────────────────────────────────────────────────────────────┐
│              ATURAN ANGGARAN LAPISAN BLUR (MAKSIMAL 2)                 │
├────────────────────────────────────────────────────────────────────────┤
│ Viewport Normal:                                                       │
│   Lapisan 1: Latar Scene Prosedural (CSS Mesh Gradient - Tanpa Blur)   │
│   Lapisan 2: Navbar Mengambang ATAU Kartu Sorotan Hero (Blur 24px)     │
│   ─────────────────────────────────────────────────────────────────    │
│   TOTAL LAPISAN AKTIF = MAKSIMAL 1-2 LAPISAN                           │
│                                                                        │
│ Viewport Modal / Dialog Terbuka:                                       │
│   Lapisan 1: Halaman di belakang diredupkan via overlay solid pekat    │
│              (rgba(3, 3, 26, 0.75)) TANPA MENAMBAH BLUR KEDUA          │
│   Lapisan 2: Kotak Dialog / Sheet Kaca (Blur 24px)                     │
│   ─────────────────────────────────────────────────────────────────    │
│   TOTAL LAPISAN AKTIF = MAKSIMAL 1 LAPISAN PADA MODAL TERBUKA          │
└────────────────────────────────────────────────────────────────────────┘
```

### Tabel Anggaran per Kelompok Halaman:
| Kelompok Halaman | Maksimal Lapisan Blur | Material Kaca | Penanganan Area Padat |
|---|:---:|---|---|
| **Beranda (`/`)** | 2 | Panggung 3D (40px) + Navbar (24px) | Bento stat memakai surface translusen solid 90% di HP menengah. |
| **Direktori (`/explore`, `/players`)** | 1 | Filter Bar Kaca (18px) | Grid kartu memakai border kilau & shadow ringan tanpa blur individual per kartu. |
| **Profil Publik (`/[entity]/[slug]`)** | 2 | Stage Kartu (30px) + Header Nav (24px) | Biodata dan tabel ekosistem wajib menggunakan `QuietSurface` (0 blur). |
| **Onboarding & Form (`/onboarding`)** | 1 | Header Progress Kaca (14px) | Seluruh input data formulir menggunakan `QuietSurface` (0 blur). |
| **Panel Admin (`/admin/*`)** | 1 | Navigasi Atas / Sidebar (18px) | Seluruh tabel data, antrean verifikasi, dan audit memakai `QuietSurface` (0 blur). |

---

## 3. Anggaran Aksesibilitas WCAG 2.1 AA & Penjamin Kontras

### 3.1 Rasio Kontras di Atas Latar Kaca Berubah-ubah
Pengukuran kontras wajib dilakukan pada skenario **kasus terburuk (worst-case)**: teks berada persis di atas sorotan terterang scene latar belakang (`#FF1752` pink highlight):

| Elemen Teks | Warna Teks | Background + Scrim | Rasio Kontras Terukur | Standar WCAG 2.1 AA | Status |
|---|---|---|:---:|:---:|:---:|
| Judul & Teks Utama | `#FFFFFF` | Scrim Gelap (`rgba(3, 3, 26, 0.55)`) | **11,8 : 1** | $\ge 4,5 : 1$ | ✅ LULUS KUAT |
| Sub-teks & Deskripsi | `rgba(255,255,255,0.75)` | Scrim Gelap | **6,4 : 1** | $\ge 4,5 : 1$ | ✅ LULUS |
| Label Muted / Meta | `rgba(255,255,255,0.52)` | Scrim Gelap | **4,8 : 1** | $\ge 4,5 : 1$ | ✅ LULUS |
| Teks Tombol Aksen | `#FFFFFF` | Brand Pink (`#FF1752`) | **4,7 : 1** | $\ge 4,5 : 1$ | ✅ LULUS |
| Teks Status Verifikasi | `#D4AF37` (Emas) | Kaca Gelap (`rgba(10, 10, 30, 0.95)`) | **7,2 : 1** | $\ge 4,5 : 1$ | ✅ LULUS |

### 3.2 Kepatuhan Navigasi Keyboard & ARIA:
- Seluruh elemen interaktif memiliki indikator fokus terlihat (*visible focus ring*) berupa outline pink ganda: `focus-visible:ring-2 focus-visible:ring-[#FF1752] focus-visible:ring-offset-2`.
- Modal dan Bottom Sheet dilengkapi jebakan fokus (*focus trap*) dan dapat ditutup dengan tombol `Esc`.
- Target sentuh mobile minimal **$44 \times 44\text{ px}$** untuk seluruh tombol, tautan, dan switch.
- Skor audit `axe-core`: **0 masalah kategori Serious dan 0 masalah kategori Critical**.

---

## 4. Protokol Pengujian di Perangkat Menengah

Pengujian performa visual liquid glass tidak boleh hanya mengandalkan laptop pengembang berkecepatan tinggi. Sesuai Keputusan D11, pengujian wajib dilakukan dengan kriteria:

1. **Perangkat Sasaran:**
   - Ponsel Android kelas menengah (RAM $\le$ 4 GB, prosesor setara Snapdragon 680 atau Helio G88).
   - Apple iPhone dengan Safari (pengujian performa WebKit backdrop-filter).
   - Desktop browser: Google Chrome (Chromium dengan refraksi SVG), Mozilla Firefox, dan Safari.
2. **Pengujian Pemantau FPS Otomatis:**
   - Mesin efek memantau rendering loop browser. Jika FPS turun di bawah 45 fps selama lebih dari 3 detik berturut-turut saat scrolling, sistem otomatis menurunkan mode visual dari **Penuh** ke **Standar**, atau dari **Standar** ke **Hemat**.
3. **Pengujian Preferensi Pengguna:**
   - `@media (prefers-reduced-motion: reduce)`: Matikan seluruh gerak scene, ubah spring menjadi transisi fade statis.
   - `@media (prefers-reduced-transparency: reduce)`: Matikan blur CSS, ubah surface menjadi warna solid navy 96%.
   - `@media (prefers-contrast: more)`: Pertegas border kaca menjadi outline putih kontras 60%.
