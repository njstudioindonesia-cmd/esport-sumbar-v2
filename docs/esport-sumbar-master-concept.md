# ESPORT SUMBAR: Master Concept (Versi Gabungan)

**Versi:** 1.0 (gabungan tiga konsep: tata kelola GPT, visual kartu & sprint Gemini, cakupan MVP realistis Claude)
**Status:** Konsep final untuk dasar penyusunan PRD
**Platform:** Website responsif + PWA (aplikasi native menyusul setelah MVP tervalidasi)

---

## 1. Visi, Misi, Positioning

**Visi:** Menjadi pusat ekosistem digital esport Sumatera Barat yang terintegrasi, terpercaya, dan menjadi referensi utama data esport daerah.

**Misi:**
1. Mengumpulkan dan mengintegrasikan data pelaku serta organisasi esport Sumatera Barat.
2. Memberi identitas digital (ESPORT ID + kartu TCG) kepada individu dan organisasi.
3. Menghubungkan pemain, pelatih, tim, komunitas, venue, sekolah, kampus, dan penyelenggara.
4. Menyediakan sistem pendataan dan verifikasi berjenjang bersama ESI Kabupaten/Kota dan ESI Provinsi.
5. Menyediakan informasi, direktori, dan statistik yang dapat diakses publik.

**Positioning:** "Pangkalan data + identitas digital esport Sumbar". Berita jadi pintu masuk trafik, data dan kartu jadi alasan orang mendaftar dan kembali.

**Tiga pilar produk (satu sumber data):**

| Pilar | Fungsi |
|---|---|
| Esport Media | Berita, agenda, highlight |
| Esport Database | Direktori dan data resmi semua entitas |
| Esport Ecosystem | Identitas, relasi, dan rekam jejak pelaku |

**Model:** B2G2C. Platform dikelola ESPORT SUMBAR, kewenangan verifikasi dipegang ESI, dinikmati publik dan pelaku.

---

## 2. Prinsip Desain (keputusan kunci hasil penggabungan)

| # | Prinsip | Alasan |
|---|---|---|
| P1 | **Rarity dan verifikasi dua sistem terpisah.** Rarity = tampilan kartu berdasarkan pencapaian/kelengkapan. Verifikasi = status kelembagaan dari ESI. | Kartu "langka" tidak boleh dikira pengesahan resmi. |
| P2 | **Super Admin tidak bisa memberi atau meng-override verifikasi.** Hanya bisa operasi teknis dan mencabut/menangguhkan atas permintaan tercatat dari ESI. | Menjaga kredibilitas lencana resmi ESI. |
| P3 | **Satu akun, banyak profil/peran.** Orang bisa jadi pemain sekaligus pelatih. | Realita lapangan. |
| P4 | **Relasi antarentitas butuh persetujuan** (permintaan bergabung/undangan). Tidak ada pencantuman otomatis. | Mencegah pencatutan nama. |
| P5 | **Satu database terpusat, akses dibatasi per wilayah** (RLS). Bukan database terpisah per daerah. | Data konsisten, mudah diaudit. |
| P6 | **Verifikasi punya masa berlaku** dan bisa ditangguhkan. | Domisili, tim, dan organisasi berubah. |
| P7 | **Privasi by default.** Data sensitif dan dokumen tidak pernah publik; profil anak di bawah 18 tahun default minimal. | UU PDP, banyak pengguna pelajar. |
| P8 | **MVP kecil, pilot terbatas, perluas bertahap.** | Realistis untuk pengerjaan vibe coding. |
| P9 | **Semua tindakan admin tercatat di audit log yang tidak bisa diubah.** | Akuntabilitas ESI dan platform. |

---

## 3. Entitas Ekosistem

| Entitas | Deskripsi | Atribut utama kartu | Fase |
|---|---|---|---|
| Player | Atlet/pemain individu | Foto/avatar, IGN, nama tampil, game utama, role, tim, kota/kab, afiliasi sekolah/kampus | MVP |
| Pelatih | Pelatih taktis/mental/analis | Foto, nama, spesialisasi game, sertifikasi (opsional), riwayat tim, kota/kab | MVP |
| Tim | Squad/klub kompetitif | Logo, nama, divisi game, roster aktif (terhubung ke kartu Player), kapten/manajer, homebase | MVP |
| Komunitas | Wadah sosial/penyelenggara lokal | Logo, fokus game, jumlah anggota, frekuensi kegiatan, wilayah, kontak pengurus | Fase 2 |
| Venue | Warnet, iCafe, arena | Foto, nama, kapasitas, fasilitas (PC/console/jaringan), titik lokasi, status tournament-ready | Fase 2 |
| Kampus | UKM esport perguruan tinggi | Logo, nama kampus/UKM, pembina, jumlah mahasiswa-pemain, prestasi | Fase 2 |
| Sekolah | Ekskul esport SMP/SMA/SMK | Logo, nama sekolah, pembina, jumlah siswa, prestasi | Fase 2 |
| Organizer | Penyelenggara kompetisi | Logo, nama, wilayah, riwayat penyelenggaraan | Fase 3 |
| Turnamen | Catatan kompetisi dan hasil | Nama, game, penyelenggara, tanggal, peserta, hasil | Fase 3 |
| Informasi Daerah | Halaman publik tiap 19 kota/kab | Lambang, statistik real-time, pengurus ESI daerah, berita lokal | MVP (versi dasar) |

Tim dan Komunitas adalah kategori berbeda: tim berorientasi kompetisi dan roster, komunitas berorientasi keanggotaan dan kegiatan.

---

## 4. ESPORT ID dan Kartu TCG

### 4.1 Identitas
Setiap profil mendapat **ESPORT ID** unik, misalnya `ESB-PL-0001234` (PL=Player, CO=Coach, TM=Team, dst.). ESPORT ID menjadi nomor seri kartu dan dasar QR.

### 4.2 Rarity (visual, bukan pengesahan)

| Tier | Nama | Frame | Kriteria (transparan dan terukur) |
|---|---|---|---|
| 1 | Rookie | Perunggu | Profil terdaftar |
| 2 | Contender | Perak | Kelengkapan profil ≥ 80% dan ≥ 1 relasi terkonfirmasi |
| 3 | Elite | Emas | ≥ 1 prestasi dengan bukti tervalidasi |
| 4 | Legend | Kristal animasi | Medali tingkat provinsi/nasional atau kontribusi istimewa menurut kriteria tertulis |

Rarity tidak bisa dibeli. Kriteria dipublikasikan di halaman "Cara Kerja Kartu".

### 4.3 Verifikasi (kelembagaan, terpisah dari frame)

| Status | Lencana di kartu | Pemberi |
|---|---|---|
| Unverified | Tidak ada | n/a |
| Regional Checked | Lencana hijau + emblem kota/kab | Admin ESI Kota/Kab |
| Verified (ESI Sumbar) | Lencana emas + logo ESI Sumbar | Admin ESI Provinsi |
| Suspended | Lencana abu-abu dengan tanda jeda | ESI Provinsi |

Kartu menampilkan dua hal independen: **frame** (rarity) dan **lencana** (verifikasi).

### 4.4 Fitur kartu
- Efek 3D tilt (mengikuti kursor/sentuhan), flip untuk sisi belakang (statistik/prestasi).
- QR dinamis menuju profil publik (bukti keaslian, anti-screenshot palsu).
- Unduh PNG dan ekspor ukuran Story 9:16 dengan watermark ESPORT SUMBAR.
- Koleksi lencana prestasi; fase lanjut: kartu musiman dan kartu event.

---

## 5. Struktur Wilayah (19 Kota/Kabupaten)

**7 Kota:** Padang, Bukittinggi, Payakumbuh, Padang Panjang, Pariaman, Sawahlunto, Solok.

**12 Kabupaten:** Agam, Dharmasraya, Kepulauan Mentawai, Lima Puluh Kota, Padang Pariaman, Pasaman, Pasaman Barat, Pesisir Selatan, Sijunjung, Solok, Solok Selatan, Tanah Datar.

Seluruh 19 wilayah di-seed sejak awal. Yang berbeda hanya **status aktivasi**: wilayah pilot punya admin ESI aktif; wilayah lain ditangani langsung oleh ESI Provinsi (mode *fallback*) sampai admin daerahnya siap.

---

## 6. Tata Kelola

### 6.1 Tingkatan peran

| Level | Peran | Kewenangan inti |
|---|---|---|
| 1 | Pengunjung | Baca data publik |
| 2 | Pengguna terdaftar | Kelola profil sendiri, ajukan verifikasi, minta/terima relasi |
| 3 | Admin ESI Kota/Kab | Periksa data wilayahnya, minta revisi, beri status Regional Checked, teruskan ke provinsi |
| 4 | Admin ESI Provinsi | Lihat seluruh wilayah, verifikasi resmi, tangguhkan/cabut verifikasi |
| 5 | Operator Platform (ESPORT SUMBAR) | Infrastruktur, konten media, akun admin, audit log global. **Tanpa kewenangan verifikasi** |

### 6.2 Alur verifikasi

```
Draft → Submitted → Under Review (Daerah) ──→ Revision ──→ (kembali ke Submitted)
                          │                      
                          ├──→ Rejected (alasan wajib)
                          ↓
                   District Approved (Regional Checked)
                          ↓
                   Provincial Review ──→ Revision / Rejected
                          ↓
                       Verified ──→ Suspended ──→ (Verified kembali / dicabut)
                          ↓
                 Expired (setelah 12 bulan) → re-verifikasi
```

Setiap transisi mencatat waktu, pelaku, peran, wilayah, alasan, dan catatan.

### 6.3 Kepemilikan data dan MoU
ESPORT SUMBAR = pengelola platform dan database. ESI = otoritas verifikasi. MoU wajib mengatur: peran masing-masing, hak akses, tujuan penggunaan data, data yang boleh dipublikasikan, hak koreksi dan penghapusan, retensi, penanganan insiden, ekspor/serah terima data, serta penanggung jawab perlindungan data.

---

## 7. Modul Produk

| Modul | Isi |
|---|---|
| **Explore** (publik) | Beranda, berita, direktori semua entitas, pencarian dan filter, halaman daerah, statistik publik, Esports Map (fase 2) |
| **ESPORT ID** | Registrasi/login, profil, kartu, QR, prestasi, status verifikasi, pengaturan privasi |
| **Ecosystem** | Permintaan bergabung, undangan, manajemen roster dan keanggotaan |
| **ESI Management** | Dashboard daerah dan provinsi, antrean verifikasi, revisi, audit log, laporan |
| **Insight** | Statistik pemain, tim, venue, persebaran per daerah, pertumbuhan |

---

## 8. Kebijakan Privasi dan Data

| Level data | Contoh | Siapa melihat |
|---|---|---|
| Publik (disetujui pengguna) | IGN, avatar, game, role, kota/kab, tim, prestasi, status verifikasi | Semua orang |
| Terbatas | Nama asli, kontak, sekolah detail | Pemilik + admin berwenang |
| Sensitif | Dokumen pendukung, tanggal lahir, kontak wali | Admin berwenang saja, penyimpanan privat |

Aturan:
- **Tidak meminta KTP/NIK.** Bukti cukup: kartu pelajar/mahasiswa, surat rekomendasi sekolah/kampus/komunitas, atau tangkapan layar akun game. Dokumen dihapus sesuai kebijakan retensi setelah verifikasi selesai.
- **Di bawah 18 tahun:** persetujuan orang tua/wali saat registrasi, profil publik default minimal (tanpa nama asli dan detail sekolah), tidak ada alamat rinci.
- Lokasi pribadi tidak pernah ditampilkan; venue memakai titik usaha.
- Hak pengguna: akses, koreksi, penghapusan, tarik persetujuan.
- Data pribadi tidak diperjualbelikan.

---

## 9. Keberlanjutan

| Sumber | Catatan |
|---|---|
| Sponsorship dan iklan | Brand gaming/teknologi di media dan halaman publik |
| Paket organisasi | Fitur tambahan untuk venue/komunitas/tim (dashboard, promosi) |
| Event dan turnamen | Kerja sama dan publikasi kompetisi |
| Kartu edisi event | Edisi khusus berbasis partisipasi, **bukan** pay-to-win rarity |

Strategi pertumbuhan: pemain dan pelatih sebagai pengguna utama, komunitas dan tim sebagai penggerak, ESI daerah sebagai penggerak pendataan. Kartu yang dibagikan ke media sosial jadi mesin pertumbuhan organik.

---

## 10. KPI

| KPI | Ukuran |
|---|---|
| Registered / Verified Profiles | Jumlah profil dan % terverifikasi |
| **Regional Data Coverage** (KPI strategis) | Berapa dari 19 wilayah punya data terverifikasi |
| Verification Time | Rata-rata hari dari Submitted sampai keputusan |
| Active Organizations | Tim/komunitas aktif |
| Card Shares | Kartu diunduh/dibagikan |
| Public Engagement | Kunjungan, pengguna kembali |
| Data Completeness | Rata-rata kelengkapan profil |

---

## 11. Arah Visual

- **Karakter:** esport yang energik + data yang profesional. Halaman publik lebih ekspresif/editorial; dashboard admin mengutamakan keterbacaan.
- **Palet:** dark mode dasar (Midnight/Hitam), aksen Emas (verifikasi/prestise), Merah Marawa (identitas Minang), Electric Blue/Violet untuk elemen interaktif. Warna status konsisten (hijau = regional checked, emas = verified).
- **Kartu:** modular, kedalaman visual, bingkai berbeda per tier.
- **Mobile-first:** penjelajahan dan kartu identitas adalah pengalaman utama.

---

## 12. Risiko dan Mitigasi

| Risiko | Mitigasi |
|---|---|
| Data palsu | Verifikasi berjenjang, bukti pendukung |
| Data ganda | ESPORT ID unik, deteksi duplikat, alat merge admin |
| Admin daerah tidak aktif | SLA, pengingat otomatis, mode fallback ke provinsi |
| Konflik kewenangan | MoU dan matriks akses tertulis |
| Kebocoran data pribadi | RLS, penyimpanan privat, minim data, enkripsi |
| Penyalahgunaan identitas | Fitur lapor, penangguhan, kebijakan akun |
| Data basi | Masa berlaku verifikasi, pengingat pembaruan |
| Sistem sulit dikembangkan | Skema modular, dokumentasi, Git, pengerjaan per modul |
| Cakupan membengkak | Fase ketat, MVP kecil |
| Konten media sepi | Ritme konten realistis |

---

## 13. Keputusan yang Harus Dikunci Sebelum Coding

| # | Keputusan | Rekomendasi default |
|---|---|---|
| D1 | Kebijakan registrasi | Terbuka untuk domisili Sumbar, semua kategori, verifikasi berjenjang |
| D2 | Wilayah pilot | Kota Padang + 1 kabupaten mitra (**tentukan**) |
| D3 | Posisi terhadap ESI | ESPORT SUMBAR pengelola platform, ESI otoritas verifikasi (MoU tertulis) |
| D4 | Kontak resmi ESI Sumbar | **Tentukan** satu penanggung jawab |
| D5 | Model bisnis awal | Gratis untuk pengguna, monetisasi via sponsor/paket organisasi |
| D6 | Masa berlaku verifikasi | 12 bulan |
| D7 | Kebijakan usia | Wajib persetujuan wali < 18 tahun |
| D8 | Daftar game resmi awal | **Tentukan** (misalnya Mobile Legends, Free Fire, PUBG Mobile, dll.) |

---

## 14. Produk Final

1. **ESPORT SUMBAR WEB:** informasi, berita, eksplorasi, direktori publik.
2. **ESPORT ID:** identitas digital dan kartu.
3. **ESPORT MANAGEMENT:** administrasi dan verifikasi ESI.
4. **ESPORT INSIGHT:** statistik dan persebaran ekosistem.

Keempatnya memakai satu sumber data dan satu sistem identitas.

> ESPORT SUMBAR dibangun sebagai infrastruktur ekosistem esport Sumatera Barat, bukan sekadar aplikasi yang bagus saat dipresentasikan.
