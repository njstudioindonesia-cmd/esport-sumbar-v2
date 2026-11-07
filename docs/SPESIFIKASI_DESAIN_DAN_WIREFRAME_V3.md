# SPESIFIKASI DESAIN LIQUID GLASS PER HALAMAN DAN WIREFRAME TEKS V3

> Dokumen Bagian 1.4: Tata Letak, Material Kaca, Momen Motion, State Handling, Wireframe Teks, dan Komponen Digunakan.

---

## 1. Kelompok 1: Beranda & Halaman Publik Utama

### 1.1 Beranda (`/`)
- **Penataan Tata Letak:**
  - Hero sinematik: Kartu 3D melayang di atas panggung kaca oval (`CardStage3D`), headline bersudut tegas miring (*brand slash*), tombol CTA utama (Pink glass) & sekunder (Clear glass).
  - Stat counter bento: 4 kartu bento kaca (Atlet Terdaftar, Tim Aktif, 19 Wilayah Terhubung, Cabang Game).
  - Cara Kerja 5 Langkah: Horizontal liquid flow cards.
  - Ekosistem Hubungan: Pratinjau interaktif 7 entitas.
  - Warta Terbaru & Profil Unggulan.
- **Material Kaca yang Dipakai:**
  - Panggung Hero: `GlassSurface` Thick (40px blur + Specular mengikuti kursor).
  - Bento Stat & Cards: `GlassSurface` Regular (24px blur + Rim cahaya).
  - Latar Belakang: `SceneBackground` (Gradien mesh navy `#03031A` + pink `#FF1752` cair lambat).
- **Momen Motion:**
  - Kartu hero bereaksi terhadap tilt pointer mouse atau giroskop mobile (maksimal 15 derajat).
  - Angka statistik menganimasi naik saat masuk viewport (*count-up spring*).
  - Transisi tab ekosistem meluncur dengan pegas cair (*fluid spring*).
- **State Handling:**
  - *Memuat:* Shimmer kaca skeleton pada kartu bento dan warta.
  - *Sukses:* Animasi stagger masuk (fade up + scale 0.95 -> 1.0).
- **Teks Platform (dari Bank Teks):**
  - Headline: "Pusat Data Esport Sumatera Barat"
  - Sub-headline: "Satu identitas digital, satu pangkalan data terhubung, dan ekosistem mandiri untuk 19 kota dan kabupaten."
  - CTA: [Buat Kartu Identitas] [Jelajahi Ekosistem]
  - Footer: "© 2026 ESPORT SUMBAR. Hak cipta dilindungi undang-undang. ESPORT SUMBAR memiliki dan mengelola platform ini, termasuk pemeriksaan dan verifikasi profil."

#### Wireframe Teks Beranda:
```
┌────────────────────────────────────────────────────────────────────────┐
│ [GlassNav: Logo V-S | Jelajah | Ekosistem | Warta | Masuk | [Daftar]] │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│   PUSAT DATA ESPORT SUMATERA BARAT                                     │
│   Bangun Namamu di Arena Sumbar.                                       │
│                                                                        │
│   [ Buat Kartu Anda ]  [ Jelajahi Ekosistem ]                          │
│                                                                        │
│             ┌────────────────────────────────────┐                     │
│             │   [3D TCG CARD: FAJAR RAMADHAN]    │                     │
│             │   Tier: Contender • HOK Midlane     │                     │
│             │   Wilayah: Kota Padang             │                     │
│             └────────────────────────────────────┘                     │
│             (Panggung Kaca Oval dengan Specular Cahaya)                │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│ [BENTO STATISTIK: 1.250+ Atlet | 84 Tim | 19 Wilayah | 6 Game]         │
├────────────────────────────────────────────────────────────────────────┤
│ CARA KERJA (5 LANGKAH MANDIRI)                                         │
│ [1. Daftar] -> [2. Lengkapi Profil] -> [3. Ajukan Verifikasi] ->       │
│ [4. Diperiksa Tim ESPORT SUMBAR] -> [5. Terverifikasi Emas]            │
├────────────────────────────────────────────────────────────────────────┤
│ EKOSISTEM TERHUBUNG (7 ENTITAS)                                        │
│ [Atlet] ── [Pelatih] ── [Tim] ── [Komunitas] ── [Venue] ── [Sekolah]   │
├────────────────────────────────────────────────────────────────────────┤
│ [Warta Pilihan]                                  [Profil Terverifikasi]│
├────────────────────────────────────────────────────────────────────────┤
│ [Footer Baru: © 2026 ESPORT SUMBAR • Tata Kelola & Kebijakan Data]     │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Kelompok 2: Direktori 7 Bidang & Profil Publik

### 2.1 Halaman Jelajah & Direktori (`/explore`, `/players`, `/coaches`, dll.)
- **Penataan Tata Letak:**
  - Sticky Glass Filter Header: Input pencarian cekung kaca (`GlassInput`), pemilih entitas kapsul (`GlassSegmented`), dropdown cabang game dinamis (`GlassSelect`), dan filter verifikasi.
  - Responsive Grid Kartu: 1 kolom di mobile (390px), 2 kolom di tablet (768px), 3-4 kolom di desktop (1440px+).
  - Paginasi kaca dengan indikator posisi halaman.
- **Material Kaca yang Dipakai:**
  - Filter Bar: `GlassSurface` Regular dengan scrim penjamin kontras.
  - Kartu Grid: `GlassCard` membungkus `EsportCard` (wajah kartu tetap murni, panggung di sekelilingnya memakai material kaca).
- **Momen Motion:**
  - Transisi shared-element (`layoutId`) saat kartu diklik menuju profil publik.
  - Stagger reveal pada grid item (delay 30ms antar kartu).
- **State Handling:**
  - *Kosong:* "Tidak ada entitas yang sesuai dengan filter pencarian. Coba ubah kata kunci atau cabang game."
  - *Memuat:* Shimmer kaca berukuran persis dengan rasio kartu TCG (2.5 : 3.5).
  - *Layanan Turun / Cold Cache:* Notifikasi ramah dengan tombol "Muat Ulang Data".

### 2.2 Profil Publik 7 Entitas (`/[entity]/[slug]`)
- **Penataan Tata Letak:**
  - Hero Header: Banner sampul dengan gradien scrim bawah, avatar dalam frame konsentris, nama lengkap, IGN, ESPORT ID, wilayah geografi, dan lencana verifikasi.
  - Dua Kolom Desktop / Satu Kolom Mobile:
    - Kiri: Panggung kartu TCG 3D interaktif (bisa dibalik depan/belakang) + tombol bagikan kartu & unduh.
    - Kanan: Tab navigasi kaca (Ringkasan Prestasi, Ekosistem & Anggota/Tim, Cabang Game, Bio).
  - Bagian Ekosistem Terhubung: Kartu-kartu entitas yang telah aktif terhubung berdasarkan aturan relasi V3.
- **Material Kaca yang Dipakai:**
  - Stage Kartu: `GlassSurface` Thick.
  - Panel Konten: `QuietSurface` (solid translusen navy 94%) agar daftar riwayat turnamen dan biodata terbaca tajam tanpa gangguan distorsi kaca.
- **Proteksi Khusus:**
  - Profil Sekolah & Kampus: Hanya menampilkan agregasi jumlah siswa tanpa data kontak pribadi siswa (Kepatuhan UU PDP).
  - Seluruh Profil: Nomor WhatsApp dan alamat jalan **TIDAK PERNAH** ditampilkan di profil publik.

#### Wireframe Teks Profil Publik:
```
┌────────────────────────────────────────────────────────────────────────┐
│ [GlassNav: Logo | Jelajah | Ekosistem | Profil Saya]                   │
├────────────────────────────────────────────────────────────────────────┤
│ [SAMPUL BANNER: Minang Cyber Background Scrim]                         │
│                                                                        │
│   [AVATAR]  ALDO SAPUTRA                                               │
│             IGN: "ShadowBlade" • Atlet Honor of Kings                  │
│             ESPORT ID: ESB-PDG-PL-100234                               │
│             Wilayah: Kota Padang                                       │
│             [ 🛡️ TERVERIFIKASI ] (Lencana Emas ESP-SB-VER-2026-0042)    │
├────────────────────────────────────────────────────────────────────────┤
│ [KOLOM KIRI: STAGE KARTU TCG]         │ [KOLOM KANAN: KONTEN QUIET]   │
│                                       │                                │
│   ┌───────────────────────────────┐   │ [Tab: Ekosistem | Prestasi ]   │
│   │ [ KARTU TCG 3D INTERAKTIF ]   │   │                                │
│   │ Tier: Contender               │   │ EKOSISTEM TERHUBUNG:           │
│   │ Game: Honor of Kings          │   │ • Tim: Minang Pride (Aktif)    │
│   │ Role: Jungler                 │   │ • Komunitas: HOK Padang        │
│   │ [Klik untuk membalik kartu]   │   │ • Sekolah: SMAN 1 Padang       │
│   └───────────────────────────────┘   │                                │
│   [ Bagikan Kartu ] [ Unduh HD ]      │ PRESTASI TERDATA:              │
│                                       │ • Juara 1 Piala Pemuda (2026)  │
│                                       │ • Top 8 Kualifikasi Sumbar     │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Kelompok 3: Autentikasi & Wizard Onboarding

### 3.1 Autentikasi (`/login`, `/register`, `/forgot-password`, `/reset-password`)
- **Penataan Tata Letak:**
  - Form terpusat (*centered card*) di atas latar `SceneBackground` yang dinamis.
  - Kartu kaca tunggal (`GlassSurface` Regular) dengan rim highlight pink.
  - Input teks cekung dengan border menyala saat fokus (`focus:ring-[#FF1752]`).
- **State Handling:**
  - *Rate Limit:* Pesan penundaan tanpa membocorkan eksistensi akun.
  - *Sukses Daftar:* Transisi ke layar kaca *"Periksa Email Anda"*.

### 3.2 Wizard Onboarding 1 Bidang Responsif (`/onboarding`)
- **Konsolidasi Arsitektur:** Menghapus dikotomi `DesktopCardWizard` vs `MobileCardWizard`, menggantikannya dengan `ResponsiveCardWizard`.
- **Penataan Tata Letak:**
  - Progress Bar Kaca di atas: Indikator 5 langkah (1. Pilih Bidang, 2. Data Identitas, 3. Unggah Media, 4. Privasi, 5. Selesai).
  - Kontainer Formulir: Menggunakan `QuietSurface` agar pembacaan input formulir tidak melelahkan mata.
  - Live Floating Preview: Di desktop tampil di panel kanan; di mobile dapat dibuka lewat bottom-sheet tarik (*swipe-up sheet*).
- **Momen Motion:**
  - Morphing transisi antar langkah form dengan slide + opacity horizontal.
  - Animasi konfeti partikel emas dan pink saat kartu digital pertama kali berhasil diterbitkan.

---

## 4. Kelompok 4: Area Pengguna Terotentikasi

### 4.1 Dashboard Pengguna (`/dashboard`)
- **Penataan Tata Letak:**
  - `GlassSidebar` (Desktop) / `GlassTabBar` (Mobile).
  - Banner Selamat Datang dengan status ringkas kartu & nomor ESPORT ID.
  - 3 Widget Cepat:
    1. Status Verifikasi Saat Ini (Tracker 1 tahap).
    2. Ekosistem Saya (Permintaan masuk yang menunggu persetujuan).
    3. Pintasan Kartu (Lihat, Bagikan, Cetak).
- **Teks:**
  - Jika belum verifikasi: *"Profil belum diajukan untuk diperiksa. Ajukan sekarang untuk memperoleh lencana terverifikasi."*

### 4.2 Kartu Saya (`/me/card`)
- **Penataan Tata Letak:**
  - Stage panggung kaca di tengah layar.
  - Kartu TCG berputar 3D halus mengikuti gerak mouse/sentuhan.
  - Opsi tombol ekspor: Unduh Format Story (9:16), Format Feed (1:1), dan Format Kartu Fisik.
  - Modal QR Code besar untuk pemindaian saat turnamen tatap muka.

### 4.3 Tracker Verifikasi (`/me/verification`)
- **Penataan Tata Letak:**
  - Tracker garis alir vertikal/horizontal (*flow stepper*).
  - Area unggah berkas pendukung (KTP/KIA/Surat Keterangan).
  - Penjelasan SLA telaah dinamis yang ditarik dari pengaturan platform.

---

## 5. Kelompok 5: Panel Admin Terkendali (`/admin`)

- **Prinsip Kaca Terkendali:**
  - Navigasi atas dan sidebar menggunakan `GlassSurface` tipis agar modern.
  - Seluruh area data (Tabel antrean verifikasi, tabel pengguna, tabel game, log audit) menggunakan **`QuietSurface` 100% tanpa efek blur** untuk menjamin performa rendering tabel beribu baris dan keterbacaan data administratif.
- **Panel Telaah Verifikasi (`/admin/verification`):**
  - Kolom data pemohon, dokumen identitas via Signed URL 60 detik, tombol aksi: [Setujui & Terbitkan Lencana], [Minta Revisi], [Tolak].
  - Modal aksi wajib menyertakan input alasan audit (*audit trail reason*).

---

## 6. Kelompok 6: Halaman Sistem & Penanganan Error

- **`/403` (Akses Ditolak):**
  - Kartu kaca melayang dengan ikon perisai terkunci.
  - Teks: *"Akses Ditolak. Anda tidak memiliki izin untuk membuka halaman ini."*
  - Tombol: [Kembali ke Beranda] [Masuk dengan Akun Lain].
- **`/_not-found` (404):**
  - Teks: *"Halaman Tidak Ditemukan. Tautan yang Anda tuju mungkin telah dipindahkan atau dinonaktifkan."*
  - Tombol: [Ke Halaman Utama] [Cari di Jelajah].
- **`/_global-error` (500):**
  - Teks: *"Terjadi Kendala. Tim teknis ESPORT SUMBAR sedang menangani kendala ini."*
  - Tombol: [Muat Ulang Halaman].
- **`/offline`:**
  - Deteksi status koneksi internet putus (PWA). Menampilkan cache kartu lokal pengguna jika sudah tersimpan di browser.
