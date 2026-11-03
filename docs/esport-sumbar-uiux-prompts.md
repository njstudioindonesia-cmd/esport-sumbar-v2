# ESPORT SUMBAR: Prompt Vibe Coding UI/UX

Turunan dari `esport-sumbar-prd.md` (bagian 3, 4, 7, 9). Semua prompt berbahasa Indonesia dan bisa dipakai di tool desain/vibe coding apa pun (Stitch, v0, Lovable, Cursor, Claude, dll.).

## Cara pakai

1. **Mulai dengan Prompt 0** (design system + konteks produk). Tempel di awal setiap sesi baru, atau simpan sebagai konteks tetap/rules.
2. **Kerjakan satu prompt per layar/komponen.** Jangan minta semua layar sekaligus.
3. **Urutan yang disarankan:** 0 → 1 (kartu, komponen paling penting) → 2 (publik) → 3 (pengguna) → 4 (admin) → 5 (state dan responsif).
4. Setelah tiap hasil, cek dengan **Checklist Review** di bagian akhir sebelum lanjut.
5. Bagian dalam `[KURUNG SIKU]` perlu Anda isi atau sesuaikan.

---

## PROMPT 0: Design System dan Konteks Produk (wajib, selalu disertakan)

```
Kamu adalah desainer UI/UX senior dan front-end engineer. Kita mendesain ESPORT SUMBAR: platform media, direktori publik, dan identitas digital (ESPORT ID berupa kartu bergaya TCG) untuk ekosistem esport Sumatera Barat. Verifikasi dilakukan berjenjang oleh ESI Kota/Kabupaten lalu ESI Provinsi Sumbar. Pengguna utama: pemain muda (banyak pelajar), pelatih, manajer tim, admin ESI, dan publik.

STACK: Next.js (App Router, TypeScript), Tailwind CSS, shadcn/ui, Lucide Icons, Framer Motion. Bahasa UI: Bahasa Indonesia (nada: santai-profesional, tidak alay).

ARAH VISUAL:
- Karakter: esport yang energik + data yang profesional. Halaman publik lebih ekspresif/editorial; dashboard admin mengutamakan keterbacaan dan efisiensi.
- Dark mode sebagai dasar. Mobile-first (desain utama di lebar 360-390 px, lalu skala ke desktop).
- Rasa lokal Minang secara halus (aksen merah marawa, motif songket/ukiran sangat tipis sebagai tekstur latar). Jangan berlebihan atau klise.

DESIGN TOKENS (definisikan sebagai CSS variables / Tailwind theme):
- Background: #0B0D12 | Surface: #12151C | Surface-elevated: #1A1E28 | Border: #262B38
- Teks utama: #F3F4F6 | Teks sekunder: #9AA3B2
- Aksen utama (prestise/verifikasi): Emas #D4AF37
- Aksen identitas: Merah Marawa #C8102E
- Aksen interaktif: Electric Blue #3B82F6, Violet #7C3AED
- Status: hijau #22C55E (Regional Checked), emas (Verified), kuning #F59E0B (menunggu/verifikasi ulang), merah #EF4444 (ditolak), abu #6B7280 (Suspended/Unverified)
- Tipografi: heading Chakra Petch atau Rajdhani (tegas, techy); body Inter. Skala: 12/14/16/20/24/32/48.
- Radius: 12 px kartu UI, 16 px kartu TCG. Spasi kelipatan 4. Ikon Lucide, stroke 1.75.

PRINSIP UX WAJIB:
1. Dua konsep terpisah dan tampil sebagai dua elemen visual berbeda: FRAME kartu = rarity (Rookie/Contender/Elite/Legend, berdasarkan pencapaian) dan LENCANA = status verifikasi (Unverified/Regional Checked/Verified/Suspended). Jangan pernah menggabungkannya.
2. Privasi jelas: setiap field profil punya penanda "Publik" atau "Hanya admin & saya". Jangan tampilkan data sensitif (kontak, tanggal lahir, dokumen) di halaman publik.
3. Status verifikasi selalu terlihat jelas dengan warna + ikon + teks (bukan warna saja).
4. Aksi destruktif/penting (tolak, cabut verifikasi, hapus akun) selalu minta konfirmasi dan alasan.
5. Setiap layar punya state: loading (skeleton), kosong (dengan ajakan aksi), error (dengan cara memperbaiki), dan sukses.
6. Aksesibilitas: kontras WCAG AA, target sentuh ≥ 44 px, fokus keyboard terlihat, alt text pada gambar.
7. Performa: gambar dioptimalkan, animasi halus 60fps, hormati prefers-reduced-motion.

Pahami konteks ini. Jangan membuat layar apa pun sampai saya meminta. Balas dengan ringkasan singkat design system yang kamu pahami dan tanyakan jika ada yang ambigu.
```

---

## BAGIAN 1: Komponen Kartu TCG (jantung produk, kerjakan lebih dulu)

### Prompt 1.1: Kartu Player

```
Buat komponen React `<EsportCard />` untuk tipe PLAYER, rasio kartu 5:7 (potret), lebar fleksibel.

SISI DEPAN:
- Frame kartu mengikuti prop `rarity`: "rookie" (perunggu), "contender" (perak), "elite" (emas dengan efek holografik/gradient shift halus), "legend" (kristal bertekstur dengan animasi kilau pelan). Frame hanya soal pencapaian, bukan verifikasi.
- Area atas: avatar/potret pemain (rasio 1:1 sampai 4:5, object-cover), dengan overlay gradien gelap di bawahnya.
- Pojok kanan atas: LENCANA VERIFIKASI terpisah dari frame (prop `verification`: "unverified" | "regional" | "verified" | "suspended" | "reverify"). regional = lencana perisai hijau + inisial wilayah; verified = lencana emas + logo ESI Sumbar (placeholder) + nomor lencana; suspended = abu-abu dengan ikon jeda; reverify = verified dengan titik kuning "menunggu verifikasi ulang"; unverified = tidak ada lencana.
- Tengah: IGN (besar, heading font), nama tampil (kecil).
- Baris info: ikon game + game utama, role, tim saat ini (logo kecil + nama), kota/kabupaten.
- Bawah: ESPORT ID (contoh ESB-PDG-PL-000124, font mono kecil) dan QR code kecil di sudut.

INTERAKSI:
- Efek tilt 3D mengikuti kursor (desktop) atau giroskop/sentuhan (mobile) dengan kilau cahaya (glare) yang bergerak. Gunakan Framer Motion + transform CSS. Matikan jika prefers-reduced-motion.
- Klik/ketuk atau tombol "Balik": animasi flip 3D ke SISI BELAKANG.

SISI BELAKANG:
- Judul "Rekam Jejak". Daftar prestasi pilihan (maks 3, dengan level: kota/provinsi/nasional), riwayat tim (maks 3), tanggal bergabung, penanda "Prestasi tervalidasi" jika ada.
- QR code lebih besar + teks "Pindai untuk memeriksa keaslian".

PROP: rarity, verification, data (ign, displayName, avatarUrl, game, role, team, region, esportId, achievements, history, joinedAt), size ("sm" | "md" | "lg"), interactive (boolean).
Sediakan 3 varian data contoh (berbeda rarity dan verifikasi) dan halaman demo yang menampilkan semuanya berdampingan. Pastikan teks tetap terbaca pada semua frame.
```

### Prompt 1.2: Kartu Pelatih dan Tim (varian dari komponen yang sama)

```
Perluas `<EsportCard />` agar mendukung `type="coach"` dan `type="team"` dengan layout berbeda tapi gaya, frame rarity, dan lencana yang sama persis.

PELATIH (depan): foto, nickname, spesialisasi game, status sertifikasi (ikon), tim saat ini, kota/kab, ESPORT ID (ESB-xxx-CO-xxxxxx), lencana, QR. (Belakang): riwayat tim yang dilatih, sertifikasi, prestasi kepelatihan.

TIM (depan): logo besar di tengah (tanpa foto potret), nama tim, divisi game, kapten/manajer, jumlah roster aktif (mis. "5/7"), homebase kota/kab, ESPORT ID (ESB-xxx-TM-xxxxxx), lencana, QR. (Belakang): daftar roster aktif sebagai deretan avatar mini + IGN + role (maksimal 8 terlihat, sisanya "+N lagi"), pelatih, prestasi tim.

Tambahkan halaman demo "Galeri Kartu" yang menampilkan 3 tipe x 4 rarity (12 kartu) dengan filter, serta panel legenda yang menjelaskan beda FRAME (rarity) vs LENCANA (verifikasi) dengan contoh visual berdampingan.
```

### Prompt 1.3: Ekspor dan Bagikan Kartu

```
Buat fitur "Bagikan Kartu" pada halaman kartu pengguna.

- Tombol: "Unduh PNG", "Format Story (9:16)", "Format Feed (1:1)", "Salin tautan profil".
- Pratinjau sebelum unduh di bottom sheet (mobile) / modal (desktop).
- Hasil ekspor: kartu ditempatkan di latar bertema (gradien gelap, tekstur halus), watermark kecil "ESPORT SUMBAR x ESI Sumbar", dan QR yang tetap terbaca. Resolusi tinggi (2x).
- Gunakan html-to-image atau library setara. Tangani font dan gambar eksternal agar tidak kosong saat ekspor (preload, crossOrigin).
- Tampilkan toast sukses dan fallback jika unduhan gagal.
- Pengguna di bawah 18 tahun: ekspor hanya memuat data yang sudah diatur publik.
```

---

## BAGIAN 2: Situs Publik

### Prompt 2.1: Beranda

```
Buat halaman Beranda `/` (mobile-first lalu desktop).

URUTAN SEKSI:
1. Navbar: logo ESPORT SUMBAR, menu (Jelajah, Berita, Daerah, Cara Kerja), tombol "Masuk" dan "Daftar Sekarang" (emas). Menjadi menu hamburger/bottom-sheet di mobile.
2. Hero: judul kuat tentang pusat data dan identitas esport Sumatera Barat, subjudul satu kalimat, dua CTA ("Buat Kartu ESPORT ID-mu" dan "Jelajahi Ekosistem"), serta visual 3 kartu TCG miring bertumpuk yang bereaksi pada kursor.
3. Bilah statistik: jumlah pemain, tim, pelatih, wilayah aktif (hitung naik saat terlihat). Angka hanya data publik.
4. "Berita Terbaru": 1 berita utama besar + 3 berita kecil, dengan kategori dan wilayah.
5. "Profil Unggulan": carousel kartu terverifikasi (Player/Tim) yang bisa digeser.
6. "Cara Kerja": 3 langkah (Daftar → Diperiksa ESI Daerah → Diverifikasi ESI Sumbar) dengan ikon, dan catatan singkat bahwa frame kartu (rarity) berbeda dari lencana verifikasi.
7. Ajakan untuk ESI daerah, komunitas, venue (kartu CTA).
8. Footer: tautan, kontak, kebijakan privasi, syarat, mitra (ESI Sumbar).

Gunakan data contoh realistis dalam Bahasa Indonesia. Animasi masuk halus saat scroll. Skeleton untuk bagian yang memuat data.
```

### Prompt 2.2: Jelajah dan Direktori

```
Buat halaman `/explore` dan `/players` (pola yang sama dipakai untuk /coaches dan /teams).

- Bilah pencarian besar di atas (placeholder: "Cari pemain, tim, atau pelatih...") dengan saran otomatis.
- Tab entitas: Semua, Player, Pelatih, Tim (komunitas/venue/kampus/sekolah muncul sebagai tab nonaktif "Segera hadir").
- Filter: game, kota/kabupaten (19 wilayah, pencarian di dalam daftar), status verifikasi (Semua / Regional Checked / Verified), rarity. Di mobile: tombol "Filter" membuka bottom sheet; di desktop: panel samping.
- Hasil: grid kartu versi kecil (`size="sm"`) dengan mode tampil "Kartu" dan "Daftar" (baris ringkas: avatar, nama, game, wilayah, lencana).
- Urutan: Terbaru, Paling lengkap, Nama A-Z.
- Paginasi atau "Muat lebih banyak".
- State: skeleton saat memuat; kosong ("Belum ada hasil. Coba ubah filter" + tombol reset); error.
- Chip filter aktif yang bisa dihapus satu per satu.
```

### Prompt 2.3: Profil Publik

```
Buat halaman profil publik `/player/[slug]` (dipakai juga untuk coach dan team dengan penyesuaian).

- Header: kartu TCG besar interaktif di kiri/atas, di sebelahnya info ringkas: IGN, nama tampil, game, role, wilayah, lencana verifikasi dengan tooltip penjelasan, tombol "Bagikan Kartu" dan "Laporkan profil".
- Blok "Status": lencana + teks (contoh "Terverifikasi ESI Sumbar sampai [bulan tahun]") dan info rarity dengan penjelasan singkat kriterianya.
- Tab: Ringkasan | Prestasi | Riwayat Tim | Relasi.
- Prestasi: daftar dengan level, tahun, dan penanda "tervalidasi".
- Riwayat/relasi: tim saat ini dan sebelumnya (logo + nama + periode), hanya relasi yang sudah disetujui kedua pihak.
- Sidebar "Profil terkait" (tim yang sama, wilayah yang sama).
- Yang TIDAK boleh tampil: kontak pribadi, tanggal lahir, dokumen, nama asli jika pengguna memilih menyembunyikan, detail sekolah untuk pengguna di bawah 18 tahun.
- Meta Open Graph menggunakan gambar kartu. Halaman versi tim menampilkan roster aktif sebagai deretan kartu mini yang bisa diklik.
```

### Prompt 2.4: Halaman Daerah

```
Buat `/regions` (daftar 19 kota/kabupaten) dan `/regions/[slug]`.

- /regions: grid kartu daerah (lambang, nama, jenis Kota/Kabupaten, jumlah profil terverifikasi, penanda "Admin ESI aktif" atau "Ditangani ESI Provinsi"). Filter: Semua/Kota/Kabupaten. Pencarian nama.
- /regions/[slug]: header dengan lambang dan nama; statistik (jumlah Player, Pelatih, Tim yang dipublikasikan); kartu "Pengurus ESI Daerah" (nama kontak resmi) atau catatan fallback jika tidak ada admin; tab Berita lokal, Profil di wilayah ini (direktori ter-filter), Agenda (placeholder).
- Opsional tahap awal: versi sederhana "Peta Sumatera Barat" berupa SVG 19 area yang bisa diklik dan memunculkan ringkasan statistik; sediakan fallback daftar untuk mobile.
```

### Prompt 2.5: Berita dan Cara Kerja

```
Buat tiga halaman:
1. `/news`: daftar berita dengan artikel utama, filter kategori dan wilayah, kartu berita (gambar, kategori, judul, tanggal, wilayah). 
2. `/news/[slug]`: layout baca editorial nyaman (lebar baris 65-75 karakter, tipografi besar), penulis, tanggal, tombol bagikan, berita terkait.
3. `/how-it-works` ("Cara Kerja Kartu dan Verifikasi"): penjelasan visual alur Daftar → Pemeriksaan Daerah → Verifikasi Provinsi, tabel 4 tier rarity beserta kriterianya, tabel 4 status lencana, FAQ (apakah data saya aman, siapa yang bisa melihat profil saya, cara pindah wilayah, apa arti verifikasi ulang), dan ringkasan kebijakan privasi (termasuk perlindungan di bawah 18 tahun).
```

---

## BAGIAN 3: Aplikasi Pengguna

### Prompt 3.1: Registrasi dan Onboarding Wizard

```
Buat alur `/register` lalu onboarding pembuatan profil `/me/profile/new`.

REGISTRASI: form email + kata sandi dan tombol "Lanjut dengan Google". Validasi inline, indikator kekuatan kata sandi, persetujuan syarat dan kebijakan privasi (checkbox wajib), tautan masuk.

WIZARD (progress bar langkah, bisa simpan draft, bisa kembali):
1. Pilih peran: kartu pilihan Player, Pelatih, Tim (peran lain "Segera hadir"). Penjelasan singkat tiap peran dan catatan bahwa satu akun bisa punya lebih dari satu profil.
2. Data dasar: tanggal lahir. JIKA di bawah 18 tahun, tampilkan langkah tambahan "Persetujuan Orang Tua/Wali" (nama wali, kontak wali, kotak persetujuan dengan penjelasan bahasa sederhana tentang data apa yang disimpan dan siapa yang melihatnya). Profil publik anak default minimal, dan pengajuan verifikasi terkunci sampai persetujuan wali lengkap.
3. Identitas esport: nama tampil, IGN/nama tim, game utama (pilih dari daftar), role (menyesuaikan game), kota/kabupaten.
4. Foto/logo: unggah dengan crop, pratinjau di kartu langsung.
5. Privasi per field: daftar field dengan toggle "Publik" atau "Hanya admin & saya", dengan default aman.
6. Tinjau: pratinjau KARTU langsung (Rookie) yang berubah real-time sepanjang wizard (kartu tampil di sisi/atas), tombol "Buat Kartu".
7. Sukses: kartu muncul dengan animasi, tombol "Bagikan Kartu" dan "Ajukan Verifikasi".

Versi mobile: kartu pratinjau mengambang kecil di atas dan bisa dibuka penuh. Semua error ditampilkan dekat field dengan teks yang membantu.
```

### Prompt 3.2: Dashboard dan Kartu Saya

```
Buat `/dashboard` dan `/me/cards`.

DASHBOARD: sapaan, kartu profil utama (interaktif kecil), ringkasan "Status verifikasi" dengan langkah berikutnya yang jelas (contoh "Lengkapi bukti untuk mengajukan"), progres kelengkapan profil (bar + daftar yang kurang, dengan penjelasan efeknya pada tier Contender), permintaan bergabung/undangan yang menunggu, notifikasi terbaru.

/me/cards: daftar semua profil milik akun (Player, Pelatih, Tim) sebagai kartu besar yang bisa digeser; tiap kartu punya aksi Edit, Bagikan, Ajukan Verifikasi, Atur Privasi; tombol "Tambah Profil Baru". Setiap kartu menunjukkan frame (rarity) dan lencana secara terpisah, plus keterangan singkat "Kenapa tier ini?" yang membuka daftar kriteria terpenuhi dan belum.
```

### Prompt 3.3: Status Verifikasi dan Pengajuan

```
Buat `/me/verification`.

- Timeline vertikal status: Draft → Diajukan → Diperiksa Daerah → (Perlu Revisi) → Lolos Daerah → Diperiksa Provinsi → Terverifikasi / Ditolak / Ditangguhkan. Langkah aktif disorot; setiap langkah selesai punya tanggal dan pelaku peran (bukan nama pribadi admin).
- Panel "Perlu Revisi": alasan dari admin dalam kotak mencolok, daftar field yang perlu diperbaiki, tombol "Perbaiki dan ajukan ulang".
- Form pengajuan: unggah bukti pendukung (kartu pelajar/mahasiswa, surat rekomendasi sekolah/kampus/komunitas, tangkapan layar akun game) dengan penjelasan "File ini hanya dilihat admin berwenang dan dihapus sesuai kebijakan retensi". Tidak ada permintaan KTP/NIK. Validasi tipe dan ukuran file.
- Info masa berlaku (12 bulan) dan pengingat pembaruan 30 hari sebelumnya.
- Peringatan jelas: mengubah nama tampil, game utama, tim, atau kota/kabupaten pada profil terverifikasi akan memicu verifikasi ulang (tampilkan dialog konfirmasi saat pengguna mengedit field tersebut).
- State kosong, loading, dan error untuk semua panel.
```

### Prompt 3.4: Relasi (Tim dan Roster)

```
Buat `/me/memberships`.

- Tab: Permintaan Saya, Undangan Masuk, Tim/Organisasi Saya, Riwayat.
- Kartu permintaan menampilkan status Pending/Diterima/Ditolak dan tombol batalkan.
- Undangan masuk: kartu dengan logo tim, nama pengundang, peran yang ditawarkan, tombol Terima dan Tolak (konfirmasi).
- Untuk manajer tim: halaman `/me/team/[id]/roster` berisi daftar roster aktif (kartu mini), permintaan bergabung yang menunggu, tombol "Undang pemain" (cari profil terdaftar atau bagikan tautan undangan), penetapan peran (kapten, manajer, anggota, pelatih, cadangan), dan keluarkan anggota (dengan konfirmasi).
- Teks jelas bahwa nama seseorang baru tampil di roster publik setelah ia menyetujui.
```

### Prompt 3.5: Pengaturan Privasi dan Akun

```
Buat `/me/privacy` dan `/me/settings`.

- Privasi: tabel field profil dengan toggle Publik/Terbatas, dengan pratinjau langsung "Beginilah tampilan profilmu bagi pengunjung" (komponen profil publik read-only yang berubah saat toggle diubah).
- Kontrol data: unduh data saya, koreksi data, tarik persetujuan.
- Zona berbahaya: hapus profil/akun dengan penjelasan konsekuensi (profil hilang dari publik segera, riwayat teknis audit tetap tanpa data pribadi berlebih), dialog konfirmasi dua langkah.
- Akun: ubah email/kata sandi, daftar sesi aktif, preferensi notifikasi email.
```

---

## BAGIAN 4: Dashboard Admin

Prinsip bersama: desain padat dan efisien (bukan ekspresif), tabel yang mudah dipindai, status berwarna + ikon, pintasan keyboard untuk aksi utama, dan setiap aksi penting meminta alasan.

### Prompt 4.1: Admin ESI Kota/Kabupaten

```
Buat area `/admin/region` untuk peran ADMIN DAERAH (hanya melihat wilayahnya sendiri; tampilkan nama wilayah dan lambangnya di header agar jelas).

HALAMAN:
1. Ringkasan: kartu metrik (menunggu, dalam peninjauan, perlu revisi, lolos bulan ini), grafik kecil waktu peninjauan rata-rata, daftar "Mendekati batas SLA" dengan penanda merah.
2. `/admin/region/queue`: tabel pengajuan dengan kolom: nama/IGN, jenis, game, tanggal diajukan, lama menunggu (warna menurut SLA: hijau <5 hari, kuning 5-14, merah >14), status. Filter status/jenis/game, pencarian, urut terlama. Aksi massal terbatas (tandai, tetapkan ke saya).
3. `/admin/region/review/[id]`: layout dua kolom. Kiri: data lengkap profil, pratinjau kartu, riwayat status. Kanan: panel dokumen bukti (pratinjau aman, tautan kedaluwarsa singkat), daftar periksa verifikasi (identitas sesuai, domisili sesuai, bukti sah), dan tombol aksi: "Setujui (Lolos Daerah)", "Minta Revisi", "Tolak". Revisi/Tolak membuka dialog dengan alasan wajib dan templat alasan cepat. Konfirmasi sebelum kirim.
4. `/admin/region/logs`: tabel log aktivitas wilayah (waktu, pelaku, aksi, target, alasan) dengan filter dan ekspor CSV. Tidak ada tombol ubah/hapus.

State penting: antrean kosong ("Tidak ada pengajuan menunggu"), pengajuan yang sudah diambil admin lain, kesalahan akses ke data wilayah lain.
```

### Prompt 4.2: Admin ESI Provinsi

```
Buat area `/admin/province` untuk ADMIN PROVINSI.

1. Ringkasan: peta/daftar 19 wilayah dengan indikator (aktif, fallback, jumlah antrean), metrik provinsi, waktu verifikasi rata-rata, daftar wilayah dengan antrean menumpuk.
2. `/admin/province/queue`: tabel antrean dari semua wilayah dengan filter wilayah, jenis, status, dan penanda khusus "Wilayah tanpa admin (fallback)". Untuk item fallback, tampilkan tombol "Periksa tahap daerah" selain "Verifikasi resmi".
3. `/admin/province/review/[id]`: sama seperti halaman review daerah ditambah: riwayat pemeriksaan daerah (siapa meloloskan dan catatannya), aksi "Verifikasi Resmi" (menampilkan pratinjau lencana emas, nomor lencana, masa berlaku 12 bulan), "Minta Revisi", "Tolak", "Tangguhkan" (untuk profil yang sudah terverifikasi; alasan wajib).
4. `/admin/province/stats`: grafik jumlah profil per wilayah dan status, waktu verifikasi, pertumbuhan, cakupan data wilayah (berapa dari 19 wilayah punya data terverifikasi).
5. `/admin/province/logs`: log seluruh provinsi dengan filter pelaku, aksi, wilayah, tanggal, dan ekspor.

Pastikan perbedaan visual yang jelas antara aksi yang reversibel dan yang tidak.
```

### Prompt 4.3: Operator Platform (ESPORT SUMBAR)

```
Buat area `/admin/platform` untuk OPERATOR PLATFORM. Catatan penting UI: operator TIDAK memiliki tombol verifikasi resmi; jangan tampilkan aksi itu di mana pun.

1. Ringkasan sistem: metrik pengguna, profil, berita terbit, wilayah aktif, status layanan.
2. `/news`: manajemen berita (tabel, editor rich text dengan pratinjau, kategori, wilayah, jadwal terbit, draft/terbit).
3. `/admins`: kelola akun admin ESI (daftar admin daerah/provinsi, tambah/nonaktifkan, tetapkan wilayah). Setiap perubahan menampilkan dialog ringkasan dan alasan, dan hasilnya tercatat di audit log.
4. `/reference`: kelola daftar game (nama, role per game, aktif/nonaktif), kategori berita, dan status aktivasi wilayah (aktif/fallback).
5. `/audit`: audit log global (tabel dengan filter pelaku, peran, aksi, wilayah, tanggal; ekspor CSV). Tampilkan spanduk kecil "Log ini hanya-tambah dan tidak dapat diubah atau dihapus".
6. Moderasi: antrean laporan profil dengan aksi tinjau, hubungi ESI, dan teruskan permintaan penangguhan ke ESI Provinsi (bukan menangguhkan sendiri).
```

---

## BAGIAN 5: State, Responsif, dan Polesan

### Prompt 5.1: Komponen State dan Sistem Umpan Balik

```
Buat set komponen konsisten untuk seluruh aplikasi:
- Skeleton loader untuk kartu TCG, baris tabel, dan halaman profil.
- Empty state dengan ilustrasi sederhana, judul, deskripsi, dan satu CTA (varian untuk direktori, antrean admin, roster, notifikasi).
- Error state (gagal memuat, tidak punya akses, tidak ditemukan 404) dengan tombol coba lagi dan tautan bantuan.
- Toast dan banner (sukses, info, peringatan, error).
- Dialog konfirmasi standar (judul, konsekuensi, alasan wajib opsional, tombol utama dengan warna sesuai tingkat risiko).
- Komponen "StatusBadge" untuk status verifikasi (warna + ikon + teks) dan "RarityTag" untuk tier, dipakai di seluruh aplikasi.
- Komponen "PrivacyTag" ("Publik" / "Hanya admin & saya").
Tampilkan semuanya dalam satu halaman katalog komponen.
```

### Prompt 5.2: Audit Responsif dan Aksesibilitas

```
Audit semua halaman yang sudah dibuat pada lebar 360, 390, 768, dan 1280 px.
Periksa dan perbaiki: tidak ada scroll horizontal; target sentuh ≥ 44 px; tabel admin berubah menjadi daftar kartu di mobile; filter menjadi bottom sheet; kartu TCG tetap terbaca; kontras teks WCAG AA terutama di atas frame emas dan kristal; urutan fokus keyboard logis; label form dan aria; animasi dinonaktifkan saat prefers-reduced-motion; gambar memakai alt text dan ukuran responsif. Berikan daftar temuan lalu perbaiki satu per satu.
```

---

## Checklist Review UI/UX (jalankan setelah tiap prompt)

**Konsistensi konsep**
- [ ] Frame (rarity) dan lencana (verifikasi) tampil sebagai dua elemen terpisah di semua tempat
- [ ] Tidak ada aksi "verifikasi resmi" pada UI operator platform
- [ ] Status verifikasi selalu warna + ikon + teks

**Privasi**
- [ ] Tidak ada data sensitif (kontak, tanggal lahir, dokumen, KTP/NIK) di halaman publik atau kartu
- [ ] Profil di bawah 18 tahun default minimal; persetujuan wali ada di alur
- [ ] Tiap field di pengaturan privasi punya penanda jelas

**Kegunaan**
- [ ] Setiap layar punya state loading, kosong, error
- [ ] Aksi penting punya konfirmasi dan alasan
- [ ] Alur daftar sampai kartu bisa selesai < 5 menit di mobile
- [ ] Admin bisa memproses satu pengajuan dengan sedikit klik

**Kualitas visual**
- [ ] Teks terbaca di semua frame kartu
- [ ] Animasi halus dan bisa dimatikan
- [ ] Tidak ada scroll horizontal di 360 px
- [ ] Gaya konsisten dengan design tokens di Prompt 0

---

## Tips iterasi

- Jika hasil terlalu "generik", tambahkan referensi: "kartu seperti kartu koleksi olahraga/gim premium, tekstur halus, kedalaman berlapis".
- Jika AI mengubah design tokens, ingatkan: "Gunakan persis token pada Prompt 0".
- Minta perubahan kecil per iterasi ("ubah hanya sisi belakang kartu"), bukan mengulang seluruh layar.
- Simpan komponen yang sudah bagus (kartu, StatusBadge, RarityTag) dan referensikan dengan namanya di prompt berikutnya agar tidak dibuat ulang.
- Gunakan data contoh yang realistis (nama, IGN, wilayah Sumbar) agar desain diuji dengan teks nyata, termasuk nama panjang dan IGN panjang.
