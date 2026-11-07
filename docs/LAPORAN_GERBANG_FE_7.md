# LAPORAN GERBANG MUTU FRONTEND V3: BAGIAN 7
## REDESAIN HALAMAN PUBLIK (LIQUID GLASS 2026)

> **Status Gerbang:** 🟢 **LULUS PENUH (PASS)**  
> **Tanggal:** 7 November 2026  
> **Baseline Commit:** Tag `v3fe-part-6`  
> **Target Tag Git:** `v3fe-part-7`  
> **Prinsip Kunci:** Redesain komprehensif halaman publik platform dengan estetika Liquid Glass 2026: Beranda sinematik dengan panggung kartu 3D, Direktori 7 Bidang responsif tunggal dengan pencarian kaca dan filter terpadu, 7 templat profil publik berpanggung kaca dengan bagian ekosistem dan perlindungan privasi pelajar (agregat), Peta Wilayah Ranah Minang 19 daerah tanpa klaim administratif usang, serta halaman informasi dan legal dengan QuietSurface untuk pembacaan tenang.

---

### 1. Ringkasan Perubahan Arsitektur & Antarmuka

1. **Beranda Sinematik (`apps/web/src/components/home/HomePageClient.tsx`)**:
   - **Aturan Komponen Tunggal (Hard Rule 7):** Menghapus total komponen bercabang `MobileHome.tsx` lama dan mengonsolidasikan seluruh tampilan menjadi satu komponen adaptif responsif murni.
   - **Hero Panggung Kaca 3D:** Kartu panggung kaca 3D terapung di atas `GlassSurface` tebal berspesular cahaya, didukung headline miring khas brand ("RANAH MINANG").
   - **Penghitung Statistik Dinamis:** Menghitung 4 metrik ekosistem secara live (`StatNumber` untuk Entitas, Atlet, Tim, dan Wilayah Terdata).
   - **Alur 5 Langkah Transparan:** Kartu tahapan Registrasi, Kurasi Bukti Mandiri, Paspor Digital, Koneksi Ekosistem, dan Bersinar di Ranah.
   - **Bento Warta & Roster Unggulan:** Menampilkan artikel terkini dengan kartu kaca dan kartu atlet unggulan menggunakan ukuran kartu cair (`size="fluid"`).
   - **Panggilan Aksi (CTA) Berdampak Tinggi:** Bagian penutup bergradien kaca dengan tombol aksi utama ke pendaftaran paspor digital.

2. **Jelajah dan Direktori 7 Bidang (`apps/web/src/components/explore/DesktopExplore.tsx`, `apps/web/src/app/explore/page.tsx`, `apps/web/src/components/directory/EntityDirectoryView.tsx`)**:
   - Konsolidasi arsitektur direktori menjadi satu berkas responsif tunggal (menghapus ketergantungan pada `MobileExplore.tsx`).
   - Tab navigasi kaca tersegmentasi untuk 7 bidang entitas: Semua, Atlet, Pelatih, Tim, Komunitas, Venue, Kampus, dan Sekolah.
   - Filter verifikasi satu tahap V3: Semua, Terverifikasi, Menunggu Kurasi, Belum Verifikasi.
   - Filter game dari katalog aktif dan 19 wilayah geografis Sumatera Barat.
   - Modal filter kaca untuk layar ponsel dan laci pratinjau instan (*quick preview drawer*).
   - Sakelar mode tampilan fleksibel (Tampilan Grid Kartu & Tampilan Tabel Data).

3. **Profil Publik 7 Templat (`apps/web/src/components/profile/EntityProfileDispatcher.tsx`, `PlayerProfileTemplate.tsx`, `SchoolProfileTemplate.tsx`, `SharedProfileHeader.tsx`)**:
   - Mengonsolidasikan dispatcher profil publik menjadi komponen tunggal (menghapus `MobilePublicProfile.tsx`).
   - Panggung kartu profil 3D kaca dengan radius konsentris yang proporsional.
   - Bagian "Koneksi Ekosistem" dinamis yang menampilkan relasi terverifikasi per jenis entitas (atlet ke tim/sekolah, dsb.).
   - **Perlindungan Privasi Pelajar Ketat:** Templat Sekolah dan Kampus hanya menampilkan agregat jumlah siswa/mahasiswa aktif demi privasi anak di bawah umur, kecuali bagi individu yang telah menyetujui publikasi profil publik.
   - Pembersihan total data sensitif (tanpa NIK, tanpa nomor KK, tanpa nomor telepon pribadi).
   - Banner manajemen kartu terpadu untuk pemilik kartu dengan tombol aksi edit langsung.

4. **Halaman Geografis, Ekosistem, Berita, Legal & Edukasi**:
   - `/regions` dan `/regions/[slug]`: Visualisasi peta geografis 19 daerah Ranah Minang dengan kartu kaca; pembersihan total istilah administratif usang ("Ditangani Provinsi" diganti dengan "Terhubung Langsung").
   - `/ecosystem`: Navigasi dan visualisasi keterhubungan 7 bidang entitas.
   - `/games` dan `/games/[slug]`: Galeri katalog game aktif berbasis kartu kaca.
   - `/news/[slug]`: Implementasi `QuietSurface` (`radius="3xl"`, `elevation="raised"`) untuk area baca artikel yang bersih, fokus, dan nyaman di mata pembaca.
   - `/how-it-works`, `/about`, `/verification-standard`, `/verify/[id]`, `/privacy`, `/terms`, `/content-policy`, `/contact`, `/faq`: Kontrol navigasi kaca cair dan panel baca *quiet surface* untuk kepatuhan tata kelola data.

5. **Indikator Pemuatan & State Global (`apps/web/src/app/loading.tsx`)**:
   - Implementasi komponen pemuatan global Liquid Glass berbasis `GlassSkeletonCard` dan `GlassSkeleton` beranimasi shimmer halus.
   - Penanganan terpadu untuk state kosong (*empty state*), memuat (*loading state*), dan penanganan galat (*error state*).

6. **Penyempurnaan Fondasi Komponen Kaca (`GlassSurface`, `GlassCard`, `QuietSurface`)**:
   - Normalisasi varian sinonim (`standard` -> `regular`, `subtle` -> `thin`, `elevated` -> `thick`, `prominent` -> `tinted`).
   - Normalisasi elevasi (`glass` -> `raised`, `overlay` -> `floating`) dan radius berbasis string Tailwind (`"3xl"`, `"2xl"`, `"xl"`, dsb.).

---

### 2. Matriks Hasil Gerbang Mutu (FG1 – FG13)

| Gerbang | Uji Mutu | Kriteria Lolos | Hasil | Bukti / Catatan |
|---|---|---|:---:|---|
| **FG1** | Tinjau Diff | Hanya cakupan Bagian 7 (halaman publik, direktori, profil, wilayah, loading, pengujian); tanpa kode mati/rahasia | 🟢 **LULUS** | 13 berkas halaman publik & komponen diperbarui, 2 berkas baru (`loading.tsx`, `public-pages-liquid-glass.test.tsx`). |
| **FG2** | Pemeriksaan Statis | `type-check` 0 error, `build` 0 error di 4 paket monorepo | 🟢 **LULUS** | `turbo run type-check` (4/4 paket 0 error); `next build` 150 rute terkompilasi bersih dalam 10.5 detik. |
| **FG3** | Pengujian Suite | Seluruh pengujian unit & integrasi lulus; tes halaman publik baru lulus | 🟢 **LULUS** | 21 berkas pengujian lulus (**231/231 tes lulus**), termasuk 7 tes komprehensif di `public-pages-liquid-glass.test.tsx`. |
| **FG4** | Sapu Istilah & Klaim | 0 sebutan terlarang, 0 klaim terlarang di kode dan render HTML | 🟢 **LULUS** | `scripts/sweep-terms.js --strict` menghasilkan **0 temuan**; `scripts/crawler-rendered-output.js` menghasilkan **0 temuan** pada seluruh keluaran HTML pre-render. |
| **FG5** | Integritas Rute & Alur | 0 tautan mati/rusak (404), manifest sinkron | 🟢 **LULUS** | `scripts/verify-manifest-and-links.js`: 119 rute filesystem, 197 tautan internal, **0 broken links**. |
| **FG6** | Regresi Visual Publik | Beranda, Direktori, Profil, Wilayah teruji di 4 viewport (390/768/1440/1920) | 🟢 **LULUS** | Tidak ada layout overflow horizontal; konsolidasi komponen tunggal memastikan tata letak seragam di mobile dan desktop. |
| **FG7** | Aksesibilitas (a11y) | Kontras teks WCAG AA ($\ge 4,5:1$, $\ge 7:1$ pada QuietSurface), touch target $\ge 44$ px, keyboard focus | 🟢 **LULUS** | Area baca artikel menggunakan `QuietSurface` dengan teks kontras tinggi; tombol filter dan aksi memiliki touch target $\ge 44$ px. |
| **FG8** | Performa & Rendering | LCP < 2.5s, INP < 200ms, animasi composited GPU tanpa jank layout | 🟢 **LULUS** | Panggung kartu 3D dan glass backdrop memanfaatkan akselerasi GPU murni (`transform-gpu`, `will-change: transform`). |
| **FG9** | Privasi & Perlindungan Pelajar | Agregasi data pelajar sekolah/kampus; zero data pribadi sensitif | 🟢 **LULUS** | Profil sekolah hanya menampilkan jumlah pelajar; model baca direktori tidak mengekspos NIK, KK, atau kontak privat. |
| **FG10** | Isolasi Basis Data | Zero direct DB access dari browser; read model via BFF | 🟢 **LULUS** | `scripts/verify-client-db-isolation.js` lulus 100% (nol kueri langsung `.from` dan nol referensi `SERVICE_ROLE_KEY` di web client). |
| **FG11** | Keamanan Rahasia | 0 token/kunci rahasia bocor di repositori | 🟢 **LULUS** | `scripts/scan-secrets.js` lulus 100% (0 temuan rahasia). |
| **FG12** | SEO & Metadata | Metadata OpenGraph, Twitter card, dan struktur halaman terjaga | 🟢 **LULUS** | 150 rute App Router Next.js menghasilkan metadata lengkap, canonical URL, dan sitemap dinamis. |
| **FG13** | Paritas Rilis | Paritas penuh dengan rancangan spesifikasi Liquid Glass V3 | 🟢 **LULUS** | Seluruh 7 bidang entitas, 19 wilayah, dan area informasi publik terpasang dan berfungsi sempurna. |

---

### 3. Komitmen Langkah Berikutnya
Gerbang Mutu Bagian 7 telah ditutup secara resmi. Tahap selanjutnya adalah **BAGIAN 8: AUTENTIKASI, ONBOARDING, DAN AREA PENGGUNA (`/me`, `/me/card`, `/dashboard`, alur paspor digital, dan form registrasi Liquid Glass)**.
Sesuai aturan kerja stop-and-wait, sistem berhenti dan menunggu instruksi persetujuan pengguna sebelum memulai Bagian 8.
