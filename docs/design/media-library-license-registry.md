# REGISTRI PUSTAKA MEDIA & LISENSI RESMI
## ESPORT SUMBAR V3

**Dokumen**: `docs/design/media-library-license-registry.md`  
**Status**: Bagian 5 — Aset Brand & Pustaka Media (Gerbang 5)  
**Kebijakan Mutu**: 
- Nol foto stok orang dengan identitas palsu
- Nol watermark / aset bermerek pihak ketiga (ASUS ROG, dll.)
- Setiap berkas media wajib memiliki pemilik hak cipta, sumber resmi, dan ketentuan lisensi yang terverifikasi.

---

## 1. Inventaris Aset Brand Resmi

| Berkas | Lokasi | Dimensi / Format | Pemilik Hak Cipta | Status Lisensi | Penggunaan Resmi |
|---|---|---|---|---|---|
| **Logo Mark Pink (Transparan)** | `/brand/logo-mark-pink.png` | 240×132 px (PNG Transparan) | ESPORT SUMBAR | Hak Cipta Dilindungi (Milik Resmi) | Header situs, ikon favicon, lencana resmi platform. |
| **Logo Mark Putih (Transparan)** | `/brand/logo-mark-white.png` | 240×132 px (PNG Transparan) | ESPORT SUMBAR | Hak Cipta Dilindungi (Milik Resmi) | Header saat scroll, watermark kartu, lencana kontras tinggi. |
| **Logo Lockup Putih (Transparan)** | `/brand/logo-lockup-white.png` | 600×200 px (PNG Transparan) | ESPORT SUMBAR | Hak Cipta Dilindungi (Milik Resmi) | Footer platform, metadata dokumen, laporan resmi. |
| **Favicon 16 & 32** | `/brand/favicon-16x16.png`, `/brand/favicon-32x32.png` | 16×16 px, 32×32 px (PNG) | ESPORT SUMBAR | Hak Cipta Dilindungi (Milik Resmi) | Favicon tab peramban desktop. |
| **Apple Touch Icon** | `/brand/apple-touch-icon.png` | 180×180 px (PNG) | ESPORT SUMBAR | Hak Cipta Dilindungi (Milik Resmi) | Ikon layar beranda iOS / Safari PWA. |
| **Android Chrome Icons** | `/brand/android-chrome-192x192.png`, `/brand/android-chrome-512x512.png` | 192×192 px, 512×512 px (PNG) | ESPORT SUMBAR | Hak Cipta Dilindungi (Milik Resmi) | Web App Manifest & Android splash screen. |
| **OpenGraph Hero Image** | `/brand/og-image.png` | 1200×630 px (PNG) | ESPORT SUMBAR | Hak Cipta Dilindungi (Milik Resmi) | Social media sharing preview (Twitter, WhatsApp, Facebook). |

---

## 2. Tipografi Resmi & Status Lisensi

| Keluarga Huruf | Varian Bobot | Pembuat / Desainer | Lisensi | Verifikasi Legalitas |
|---|---|---|---|---|
| **Plus Jakarta Sans** | 400, 500, 600, 700, 800 | Tokotype, Gumpita Rahayu | **SIL Open Font License 1.1 (OFL)** | Bebas digunakan secara komersial dan non-komersial tanpa royalti. |
| **Barlow Condensed** | 400, 500, 600, 700, 800, 900 | Jeremy Tribby | **SIL Open Font License 1.1 (OFL)** | Bebas digunakan secara komersial dan non-komersial tanpa royalti. |

---

## 3. Ikonografi Resmi

| Pustaka Ikon | Versi | Lisensi | Verifikasi Legalitas |
|---|---|---|---|
| **Lucide Icons** | ^1.67.0 | **ISC License** | Bebas digunakan, dimodifikasi, dan didistribusikan secara komersial. |

---

## 4. Kebijakan Media Berita & Materi Promosi (CMS)

1. Setiap gambar berita yang diunggah melalui Admin CMS wajib menyertakan:
   - Sumber resmi (*source attribution*)
   - Teks alternatif (*alt text*) deskriptif
   - Status hak cipta / lisensi (Dokumentasi PBESI Sumbar / Siaran Pers Resmi / Berlisensi Bebas).
2. Dilarang keras mengunggah foto wajah atlet fiktif atau gambar dari platform stok komersial tanpa lisensi editorial.
