# DOKUMEN UJI END-TO-END (E2E) & KEAMANAN SISTEM
## ESPORT SUMBAR V2 — PBESI SUMATERA BARAT
**Versi Sistem:** 2.0.0-PROD  
**Basis Data:** Supabase PostgreSQL (RLS Enforced, 7 Entitas, Audit Logs Tamper-Proof)  
**Kepatuhan:** UU PDP No. 27/2022, PBESI Multi-Tier Governance Rules  

---

## 1. TABEL RINGKASAN HASIL PENGUJIAN

| No | Skenario Pengujian | Target Komponen | Status | Catatan Validasi |
|---|---|---|:---:|---|
| **1** | Pengguna Baru & Paspor Publik | Auth, Wizard, Storage, Canvas 9:16 | **LULUS** | Avatar WebP termampatkan $\le 2$ MB, EXIF/GPS terhapus, paspor publik bersih dari data privat (email/hp aman). |
| **2** | Perlindungan Atlet di Bawah Umur (<18 Tahun) | UU PDP Child Protection, Guardian Consent | **LULUS** | Umur 16 th mewajibkan data wali; pengajuan verifikasi terkunci sebelum persetujuan wali diisi lengkap. |
| **3** | Tim, Logo & Manajemen Roster | Relasi Keanggotaan, Roster Quota (5/7) | **LULUS** | Logo SVG terunggah, pemain menerima undangan, kuota roster bertambah, permohonan gabung dapat ditolak manajer. |
| **4** | Alur Verifikasi PBESI Multi-Tier | Regional Check $\to$ Provincial Verified $\to$ Re-verify | **LULUS** | Admin Padang memeriksa $\to$ Admin Provinsi menerbitkan lencana emas. Perubahan nama tampilan memicu re-verifikasi otomatis. |
| **5** | 7 Templat Tampilan Profil Berbeda | Dynamic Route `/[entity]/[slug]` | **LULUS** | Masing-masing dari 7 entitas (Player, Pelatih, Tim, Komunitas, Venue, Kampus, Sekolah) menampilkan templat unik. |
| **6** | Pengujian Keamanan & Isolasi RLS | PostgreSQL RLS, Magic Bytes, Multi-Wilayah | **LULUS** | 7/7 tes keamanan lulus: file `.exe` ditolak (magic byte `4D 5A`), admin Bukittinggi dilarang akses Padang, operator dilarang verifikasi, audit logs IMMUTABLE. |
| **7** | Integritas Data & Filter `SHOW_DEMO_DATA` | Server Aggregation, API Profiles, Flags | **LULUS** | Beranda, peta, dan direktori membaca data nyata. Banner "Data demo" tampil jika `is_demo=true`. Data demo dapat dihapus via `purge-demo.ts`. |

---

## 2. DETAIL PELAKSANAAN SKENARIO

### SKENARIO 1: Pengguna Baru, Unggah Foto, Kartu TCG & Tampilan Publik
- **Alur Kerja:**
  1. Pengguna mendaftarkan akun di `/register` dengan email aktif.
  2. Mengisi wizard pendaftaran 6 tahap di `/me/profile/new`.
  3. Mengunggah foto profil asli, memotong rasio 4:5 via modal HTML5 Canvas cropper, otomatis terkonversi ke WebP kualitas 0.82 ($\le 2$ MB).
  4. Kartu TCG otomatis terbit dengan format ESPORT ID standar: `ESB-{WILAYAH}-PL-{6DIGIT}`.
  5. Pengguna mengklik "Bagikan" $\to$ Modal QR code dan ekspor kartu rasio 9:16 siap diunduh.
  6. Mengakses rute publik `/player/[slug]` di browser mode incognito tanpa login.
- **Hasil:**
  - Halaman publik tampil responsif tanpa error.
  - Data kontak sensitif (Nomor HP, Alamat Rumah, Email Akun) **100% tidak tampak** pada tampilan publik dan respons API.

---

### SKENARIO 2: Perlindungan Pelajar (<18 Tahun) Sesuai UU PDP No. 27/2022
- **Alur Kerja:**
  1. Pengguna memasukkan tanggal lahir yang mengindikasikan usia < 18 tahun (mis. 16 tahun).
  2. Sistem langsung menampilkan dialog peringatan perlindungan data anak di bawah umur.
  3. Form mewajibkan: Nama Orang Tua/Wali, Nomor Kontak Wali, dan Centang Persetujuan Wali.
  4. Foto profil secara default disetel ke mode inisial gradien Marawa (`InitialsAvatar`) demi keselamatan privasi anak.
  5. Pengajuan verifikasi resmi di `/me/verification` terkunci hingga persetujuan wali terverifikasi.
- **Hasil:**
  - Kepatuhan UU PDP No. 27/2022 pasal perlindungan data anak terpenuhi sepenuhnya.

---

### SKENARIO 3: Klub/Tim, Logo Geometris & Siklus Roster
- **Alur Kerja:**
  1. Membuat entitas "Tim" di wizard pendaftaran entitas.
  2. Mengunggah logo lambang tim (SVG/WebP rasio 1:1).
  3. Manajer tim mengirimkan undangan bergabung ke atlet via username/ign.
  4. Atlet menerima undangan di `/me/memberships`.
  5. Halaman profil tim di `/team/[slug]` menampilkan atlet tersebut di seksi "Roster Tim" dengan kuota dinamis (mis. 5/7 pemain).
  6. Atlet luar mengajukan "Permintaan Gabung" $\to$ Manajer dapat menerima atau menolak.
- **Hasil:**
  - Roster tim terhubung secara relasional di tabel `memberships` dengan status `accepted` atau `declined`.

---

### SKENARIO 4: Verifikasi Nyata & Transisi Dua Tingkat (Pengcab $\to$ Pengprov)
- **Alur Kerja:**
  1. Pemohon mengunggah berkas bukti (Kartu Pelajar / Tangkapan Akun Resmi game / Surat Rekomendasi).
  2. Berkas masuk ke antrean Pengcab daerah pemohon di `/admin/region/queue`.
  3. Admin Pengcab memeriksa berkas (Signed URL 60 detik) $\to$ Melakukan "Setujui" $\to$ Status berubah menjadi `regional_checked`.
  4. Berkas naik ke antrean Pengprov di `/admin/province/queue`.
  5. Admin Pengprov melakukan validasi akhir $\to$ Status berubah menjadi `verified` dan diterbitkan nomor lencana emas (`verified_badge_no`).
  6. Lencana emas resmi menyala di kartu TCG publik.
  7. Jika pemohon mengubah field kunci (Nama Lengkap, Game Utama, atau Wilayah), status otomatis bergeser kembali ke `reverify` via trigger server.
- **Hasil:**
  - Transisi dua lapis PBESI berjalan mulus dan audit log tercatat secara atomik di PostgreSQL.

---

### SKENARIO 5: 7 Templat Tampilan Profil Berbeda
- **Player:** Hero kartu vertikal + IGN, Bento 4 kotak (Game, Role, Tim, Wilayah), lencana "Mencari Tim" (LFT), tab Ringkasan/Prestasi/Riwayat.
- **Coach:** Hero kartu + baris angka otoritas (Pengalaman melatih, Tim dibina, Gelar juara), chip spesialisasi game, kutipan filosofi pembinaan.
- **Team:** Header logo tim besar + singkatan + divisi game, grid roster 5/7 pemain, penanda status rekrutmen buka/tutup dengan modal ajukan gabung.
- **Community:** Banner cover lebar + logo, statistik anggota, frekuensi kegiatan, galeri foto komunitas (maks 8 foto dengan lightbox modal).
- **Venue:** Hero cover arena, jam operasional hari ini (Buka/Tutup), grid ikon fasilitas lengkap (PC, Fiber, AC, Kantin, Arena Turnamen, Pod Streaming), tautan Google Maps.
- **Campus:** Header UKM kampus, pembina & ketua UKM, jumlah anggota mahasiswa terdaftar, data mahasiswa individu terlindungi.
- **School:** Header ekskul sekolah + jenjang (SMA/SMK), pembina ekskul, banner gembok proteksi UU PDP anak: **nama siswa dan data privat siswa dilarang keras tampil publik**.
- **Hasil:**
  - 7 templat terpisah berjalan di rute dinamis `/[entity]/[slug]` dengan dispatcher otomatis.

---

### SKENARIO 6: Pengujian Keamanan & Ketahanan Multi-Wilayah (RLS)
- **Pengujian 1:** Eksekusi berkas executable berbahaya (`payload.exe` dengan magic bytes `4D 5A`) $\to$ **DITOLAK 100%**.
- **Pengujian 2:** Berkas foto valid WebP (`RIFF...WEBP`) $\to$ **DITERIMA & TERUPLOAD**.
- **Pengujian 3:** Admin Pengcab Kota Bukittinggi mencoba meninjau pengajuan Kota Padang $\to$ **DITOLAK OLEH RLS** (Muncul layar peringatan jurisdiksi).
- **Pengujian 4:** Platform Operator mencoba memanggil RPC `transition_verification` untuk status `verified` $\to$ **DITOLAK BASIS DATA** (Hanya peran `admin_province` yang sah).
- **Pengujian 5:** Pengunjung publik (anon) mencoba membaca kolom `phone` atau `legal_guardian_name` via API $\to$ **KOLOM NIL/TERSEMBUNYI**.
- **Pengujian 6:** Percobaan manipulasi atau penghapusan tabel `audit_logs` $\to$ **DITOLAK TRIGGER IMMUTABILITY**.

---

### SKENARIO 7: Data Nyata & Pengendalian Data Demo
- **Uji Coba:**
  1. Menjalankan skrip `npx tsx scripts/seed-demo.ts` $\to$ Menghasilkan 80 Player, 10 Pelatih, 16 Tim, 8 Komunitas, 8 Venue, 6 Kampus, 6 Sekolah, 8 Berita, dan 8 Akun Uji Coba. Seluruhnya ditandai `is_demo = true`.
  2. Profil demo menampilkan banner khusus: `"Data Percontohan (Demo): Profil ini dibuat untuk keperluan pengujian sistem..."`.
  3. Mengatur variabel `SHOW_DEMO_DATA=false` $\to$ Data demo otomatis hilang dari Beranda, Peta Wilayah, dan Direktori Publik.
  4. Menjalankan skrip `npx tsx scripts/purge-demo.ts --confirm` $\to$ Seluruh data demo terhapus bersih dari database.
- **Hasil:**
  - Transisi data demo ke data resmi produksi aman dan terkendali.

---
**Disusun dan Divalidasi oleh:**  
Tim Pengembang Sistem Informasi & Komisi Transformasi Digital PBESI Sumatera Barat  
Tanggal Validasi: 4 November 2026
