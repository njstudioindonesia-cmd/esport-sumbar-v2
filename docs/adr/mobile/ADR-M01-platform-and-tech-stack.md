# ADR-M01: Platform dan Tumpukan Teknologi Aplikasi Mobile ESPORT SUMBAR V3

**Status**: APPROVED  
**Tanggal**: November 2026  
**Penentu Keputusan**: Principal Mobile Engineer, Lead Architect  
**Konteks Monorepo**: Turborepo, Next.js 16 (BFF), Supabase Auth/PostgreSQL  

---

## 1. Konteks dan Latar Belakang
Platform ESPORT SUMBAR V3 membutuhkan aplikasi mobile resmi untuk atlet, pelatih, tim, komunitas, venue, sekolah, dan kampus di Sumatera Barat. Aplikasi harus:
1. Terintegrasi penuh dengan monorepo dan berbagi skema validasi Zod (`packages/contracts`) serta kamus teks terpusat (`packages/lib/copy`).
2. Menghadirkan performa tinggi untuk kartu 3D holografik, efek liquid glass, gestur sentuh, dan haptik.
3. Mendukung rilis multi-platform (Android prioritas utama, iOS menyusul).

## 2. Opsi yang Dipertimbangkan

| Parameter | Opsi A: Expo (React Native + TypeScript) [DIPILIH] | Opsi B: Flutter (Dart) [EVALUASI ALTERNATIF] | Opsi C: Progressive Web App (PWA) |
| :--- | :--- | :--- | :--- |
| **Penyelarasan Monorepo** | **Tinggi (100% TS)**: Mengimpor Zod schema dan copy langsung tanpa duplikasi kode. | **Rendah**: Membutuhkan penulisan ulang model, skema validasi, dan teks ke bahasa Dart. | **Tinggi**, namun dibatasi kapabilitas browser mobile. |
| **Kinerja UI & Animasi** | **Sangat Baik**: Reanimated (UI thread), Gesture Handler, Skia engine untuk kartu 3D. | **Sangat Baik**: Skia/Impeller native rendering 120 FPS. | **Sedang**: Terkendala DOM rendering dan batasan WebView. |
| **Akses Hardware & Sensor** | Penuh (Giroskop, Kamera, Haptik, SecureStore, Push FCM/APNs). | Penuh (Sensors, Camera, Haptic, Keychain). | Terbatas (tidak ada akses penuh sensor & push andal di iOS). |
| **Kepatuhan Toko Aplikasi** | **Toko Resmi**: Google Play & Apple App Store. | **Toko Resmi**: Google Play & Apple App Store. | Bukan aplikasi toko resmi (hanya add to homescreen). |
| **Distribusi & CI/CD** | Terintegrasi EAS Build + Linux GitHub Actions. | Gradle/Xcode lokal & CI Actions. | Web Vercel biasa. |

## 3. Keputusan Arsitektur
Memilih **Opsi A: Expo (React Native + TypeScript)** dengan New Architecture:
1. Menempatkan aplikasi di `apps/mobile`.
2. Berbagi `@esport-sumbar/contracts` untuk kontrak API dan validasi data.
3. Berbagi `@esport-sumbar/lib/copy` untuk jaminan 100% bebas istilah dan klaim terlarang.
4. *Catatan Prototipe*: Eksperimen awal menggunakan Flutter di Bagian 0 telah membuktikan kesiapan database Supabase, dan arsitektur produksi V3 dikunci menggunakan Expo untuk efisiensi pemeliharaan tim monorepo.

## 4. Konsekuensi dan Mitigasi
- **Konsekuensi**: Metro bundler pada Windows membutuhkan konfigurasi `watchFolders` agar symlink monorepo terbaca.
- **Mitigasi**: Konfigurasi `metro.config.js` dengan resolusi `projectRoot` dan `workspaceRoot` otomatis, diverifikasi via build Linux di CI.
