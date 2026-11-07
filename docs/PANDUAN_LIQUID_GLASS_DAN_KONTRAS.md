# PANDUAN DESAIN LIQUID GLASS 2026 & STANDAR KONTRAS WCAG AA
**Arsitektur Desain Visual, Aturan Lapisan, Formula Radius, dan Optimasi Performa V3**

> Dokumen Rujukan: Bagian 4 Spesifikasi Frontend Liquid Glass V3  
> Tanggal Berlaku: 7 November 2026  
> Penanggung Jawab: Senior Lead UI/UX Designer & Frontend Architect  

---

## 1. Filosofi & Batasan Liquid Glass 2026

Desain **Liquid Glass 2026** di platform ESPORT SUMBAR menerapkan pendekatan material kaca cair modern yang estetik, dinamis, namun sangat disiplin performa dan aksesibilitas:

1. **Kaca adalah Lapisan Fungsional, Bukan Seluruh Halaman**:
   - Elemen yang **BOLEH** memakai kaca: Navigasi (`GlassNav`, `GlassTabBar`), Kontrol (`GlassButton`, `GlassInput`, `GlassSwitch`), Overlay (`GlassSheet`, `GlassDialog`, `GlassMenu`), Kartu Sorotan (`GlassCard`), dan Panggung di sekitar kartu paspor digital.
   - Elemen yang **DILARANG** memakai kaca blur: Wajah kartu TCG paspor digital (mempertahankan frame rarity asli), tabel data admin, formulir pendaftaran panjang, dan artikel berita panjang.

2. **Dilarang Menumpuk Kaca di Atas Kaca (> 2 Lapisan)**:
   - Batas keras: **Maksimal 2 lapisan `backdrop-filter: blur()` aktif dalam satu viewport**.
   - Lapisan 1: Kontainer Induk (misal: Shell latar atau GlassNav).
   - Lapisan 2: Kartu sorotan atau dropdown menu.
   - Jika terdapat elemen ketiga di dalamnya, **WAJIB menggunakan `QuietSurface`** (translusen solid tanpa blur GPU).

3. **Kejelasan di Atas Gaya (WCAG 2.1 AA Non-Negotiable)**:
   - Semua teks di atas permukaan kaca harus mempertahankan rasio kontras minimal **4.5:1** (atau **7.0:1** untuk teks kecil) pada kondisi latar paling terang dan paling ramai sekalipun.
   - Jaminan kontras ditegakkan oleh lapisan scrim bawaan: `rgba(3, 3, 26, 0.45)`.

---

## 2. Empat Tingkat Material Kaca

| Material | Ketebalan Blur | Opasitas Latar | Karakteristik Rim | Kasus Penggunaan Utama |
|---|:---:|:---:|---|---|
| **Thin** | `14px` | `5%` | Halus, 1px tipis (`white/0.08`) | Kontrol mengambang, filter chips, pill status, tooltip. |
| **Regular** | `24px` | `8%` | Sedang, 1px rim (`white/0.12`) | Kartu sorotan, modal sheet, panggung kartu atlet. |
| **Thick** | `40px` | `12%` | Tegas, 1px rim kontras (`white/0.18`) | Navbar atas (`GlassNav`), bottom bar mobile (`GlassTabBar`), dialog konfirmasi. |
| **Tinted** | `24px` | `16%` pink | Gradien pink (`pink/0.35`) | Tombol aksi primer, kartu sorotan prestasi, notifikasi sukses. |

---

## 3. Formula Radius Konsentris Harmonik

Untuk memastikan sudut membulat elemen anak tampak sejajar dan proporsional terhadap kontainer induk, formula konsentris wajib digunakan:

$$\mathbf{R_{anak}} = \max(0, \mathbf{R_{induk}} - \mathbf{P})$$

*Di mana:*
- $\mathbf{R_{induk}}$ = Border radius kontainer luar (dalam piksel).
- $\mathbf{P}$ = Padding antara kontainer luar dan elemen anak (dalam piksel).
- $\mathbf{R_{anak}}$ = Border radius elemen anak yang dihasilkan.

### Implementasi Kode:
```typescript
import { calcConcentricRadius, getConcentricStyle } from "@/components/glass";

// Contoh: Kontainer radius 32px dengan padding 16px -> Anak memiliki radius 16px
const childRadius = calcConcentricRadius(32, 16); // 16px
```

---

## 4. Tiga Tingkat Efek Adaptif (Quality Modes)

Sistem secara cerdas menyesuaikan tingkat efek grafis berdasarkan kapabilitas hardware perangkat dan preferensi pengguna:

```
[Hardware Concurrency / Save-Data / Accessibility Media Query]
                           │
             ┌─────────────┼─────────────┐
             ▼             ▼             ▼
        Mode Penuh    Mode Standar   Mode Hemat
        (High-End)     (Mid-Range)   (Low-End/Save-Data)
```

| Fitur | Mode Penuh (Full) | Mode Standar (Standard) | Mode Hemat (Eco) |
|---|:---:|:---:|:---:|
| **Backdrop Filter Blur** | Ya (14–40px) | Ya (14–24px) | **Tidak (Solid translusen)** |
| **Saturasi Kaca** | 170% | 130% | 100% |
| **Rim Light & Specular** | Dinamis mengikuti pointer/tilt | Statis di sudut kiri atas | Dimatikan |
| **Animasi Scene Latar** | Gerakan fluida aktif | Statis tanpa animasi | Statis minimal |
| **Transisi Shared Element**| Penuh | Fade instan | Instan |
| **Ambang Batas FPS Otomatis**| Turun jika < 35 FPS | Turun jika < 35 FPS | Selalu stabil 60 FPS |

---

## 5. Kapan Memakai Kaca vs QuietSurface

```
Apakah komponen memuat teks panjang / data tabel padat?
  ├── YA  ──> Gunakan QuietSurface (Translusen solid, tanpa blur)
  └── TIDAK ──> Apakah sudah ada 2 lapisan kaca bertingkat?
                  ├── YA  ──> Gunakan QuietSurface
                  └── TIDAK ──> Gunakan GlassSurface
```

### Karakteristik `QuietSurface`:
- **Latar**: `rgba(10, 10, 36, 0.92)`
- **Border**: `1px solid rgba(255, 255, 255, 0.08)`
- **Blur**: `none` (0 beban GPU)
- **Kontras**: $\ge 7.0:1$ (Memenuhi standar WCAG AAA)
- **Target Komponen**:
  - `/admin/verification` (Tabel antrean verifikasi)
  - `/admin/users` (Tabel akun & inspektur)
  - `/admin/relation-rules` (Matriks 17 aturan ekosistem)
  - `/onboarding` & `/me/edit` (Formulir pengisian data)

---

## 6. Token Brand & Palet Warna V3

- **Dasar Ekosistem**: Deep Midnight Navy (`#03031A`, `#07080C`, `#0A0A2E`).
- **Aksen Tunggal Brand**: Brand Pink (`#FF1752`, hover `#FF4D77`, active `#D90F43`).
- **Kilau & Refraksi**: Pure White (`#FFFFFF`, opasitas bervariasi).
- **Warna Emas (`#D4AF37`)**: **DILARANG DIGUNAKAN SEBAGAI DEKORASI UMUM**. Emas dikhususkan secara eksklusif untuk menandai status verifikasi tunggal (*Verified Badge*) dan kartu tier *Elite*.
- **Warna Terlarang**: Biru elektrik dan merah marawa warisan telah dibersihkan total.

---

## 7. Verifikasi Performa di `/dev/glass`

Halaman laboratorium `/dev/glass` disediakan khusus untuk tim engineer dan desainer guna menguji:
1. Performa rendering pada perangkat Android menengah dan tablet.
2. Jaminan rasio kontras teks di atas 4 latar ekstrim (Scene, Pink Terang, Putih Murni, Pola Ramai).
3. Respon interaktif specular spotlight terhadap pointer dan gyroscope tilt.
4. Simulasi penurunan mode kualitas otomatis saat frame rate anjlok di bawah ambang batas SLA.
