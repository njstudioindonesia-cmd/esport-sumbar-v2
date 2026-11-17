# REFERENCE BOARD & ANALISIS PRINSIP DESAIN
## ESPORT SUMBAR V3

**Dokumen**: `docs/design/reference-board.md`  
**Status**: Bagian 4 — Riset Referensi & Sintesis Prinsip  
**Tujuan**: Menganalisis sistem desain kelas dunia dan aplikasi referensi terpilih sesuai Bagian 3.4 Dokumen Redesain ESPORT SUMBAR V3 untuk desktop dan mobile.

> **Prinsip Keras**: Mengadopsi prinsip desain (hierarki, tipografi, ritme, elevasi, keheningan chrome, taktilitas bahan), **BUKAN menyalin** tata letak, ikon, ilustrasi, atau aset visual. Identitas visual tetap 100% khas **ESPORT SUMBAR** (mark V-S versi transparan, latar ink pekat `#05051A`, satu aksen Pink Brand `#FF1752`, dan sentuhan emas status `#D4AF37` khusus untuk verifikasi dan tier Elite).

---

## 1. Analisis Referensi & Sintesis Prinsip (Desktop & Mobile)

| No | Referensi | Apa yang Dipelajari | Prinsip yang Diambil | Penerapan pada ESPORT SUMBAR V3 | Apa yang DILARANG Ditiru (Anti-Pattern) |
|---|---|---|---|---|---|
| 1 | **Stripe** | Ketenangan antarmuka, hierarki tipografi berlapis, gerak mikro yang sangat halus, kejelasan visual dalam menyampaikan informasi terstruktur. | *Calm Clarity & Seamless Motion*: Antarmuka tenang, pergerakan bertujuan menjelaskan alur, bukan menghibur. | Tata letak Beranda, penjelasan cara kerja, transisi antar-langkah formulir, navigasi dialog ⌘K. | Gradien pita neon multi-warna yang rumit; ilustrasi 3D isometrik abstrak generik. |
| 2 | **Linear** | Dark UI yang tenang, tipografi sans yang rapat namun sangat terbaca, disiplin garis pemisah 1px, satu warna aksen fungsional, kepadatan terkendali. | *Precision, Density & Restraint*: Antarmuka tidak berteriak; elemen kromium abu-abu/transparan memandu mata ke data. | Tampilan portal admin, daftar direktori 7 bidang, tabel data, baris riwayat aktivitas, pemisah halus `rgba(255,255,255,0.08)`. | Tampilan monokrom abu-abu datar tanpa jiwa olahraga; teks terlalu kecil (<12px). |
| 3 | **Vercel** | Minimalisme gelap radikal, ketajaman tipografi monokromatik, header dan footer yang sangat bersih dan hening, struktur grid geometris. | *Radical Monochromatic Minimalism*: Menghilangkan hiasan demi kecepatan visual dan kebersihan struktural. | Header transparan saat di puncak hero dan memadat saat scroll; footer 3 kolom bersih tanpa ornamen; grid 12 kolom lega. | Tampilan developer-tool klise; menghilangkan seluruh kepribadian olahraga daerah. |
| 4 | **Apple (Product Pages & HIG)** | Hero berbasis objek tunggal (*single-object hero*), ruang kosong (*negative space*) yang sangat lapang, hierarki optik tanpa kotak. | *Content as Hero & Spatial Breathing*: Satu fokus dominan di layar; biarkan objek berbicara sendiri. | Hero Beranda dengan kartu digital ESPORT SUMBAR sebagai objek pahlawan 3D subtil; halaman profil dengan potret atlet. | Efek kaca/blur di setiap panel; meniru ikon Apple SF Pro secara mentah. |
| 5 | **Nike / Adidas (Kampanye Digital)** | Tipografi display editorial besar berkarakter atletik, citra penuh tepi-ke-tepi, banner kampanye yang kuat dan menggerakkan. | *Athletic Drama & Editorial Power*: Energi kompetitif hadir lewat skala tipografi dan citra potret atlet yang berwibawa. | Banner slide kampanye resmi, judul headline berita, kartu panggung atlet di Beranda. | Tata letak brutalist acak-acakan yang merusak keterbacaan data resmi; teks miring berlebihan. |
| 6 | **Spotify** | Citra cover besar, kontras tipografi tajam, warna aksen hemat, karusel horizontal yang intuitif dan responsif. | *Atmospheric Immersion & Clear Rhythm*: Nuansa gelap yang hidup tanpa terlihat berdebu (*not muddy*). | Karusel banner slider di bawah hero Beranda; navigasi galeri kartu per bidang. | Kontrol pemutar audio; background noise berlebihan yang memperberat rendering. |
| 7 | **Raycast / Arc** | Dark UI dengan kepribadian tinggi, mikro-interaksi cepat dan menyenangkan, penanganan tombol keyboard (⌘K). | *Delightful Micro-interactions & Tactility*: Feedback instan pada interaksi pengguna. | Dialog pencarian cepat (⌘K) di header desktop; respons hover kartu dan efek klik tombol. | Popover sistem desktop yang tidak cocok di web mobile. |
| 8 | **FACEIT / HLTV / Liquipedia** | Ekosistem profil atlet dan tim berbasis data faktual, verifikasi status resmi, netralitas lintas cabang game. | *Esport Legitimacy & Data Integrity*: Representasi prestasi atlet yang terhormat dan terstandardisasi. | Profil publik atlet/tim (rekor divisi, wilayah kabupaten/kota di Sumbar, status verifikasi); integrasi 5 game resmi. | Layout tabel desktop super padat yang dijejalkan ke mobile tanpa hierarki; watermark logo game komersial tak berizin. |
| 9 | **Revolut / Monzo / Wise** | Presentasi kartu digital sebagai objek bernilai tinggi, status verifikasi yang tegas, angka metrik besar yang elegan. | *Status Integrity & Prestigious Collectibility*: Kartu digital terasa seperti aset identitas berharga. | Kartu digital 7 bidang, lencana verifikasi tunggal warna emas `#D4AF37`, angka registrasi unik. | Fitur perbankan/fintech (saldo uang, top-up, grafik trading); kartu kredit plastik imitasi. |
| 10 | **EA SPORTS FC Ultimate Team (FUT)** | Anatomi kartu koleksi kompetitif: foto potret di pusat, nama atlet tebal, klasifikasi tier lewat **bahan fisik**. | *Material Authenticity*: Rarity dibedakan oleh bahan tekstur fisik (Bronze, Silver, Gold, Crystal), BUKAN glow neon. | 4 Tier Kartu ESPORT SUMBAR V3: Rookie (Matte Bronze), Contender (Satin Silver), Elite (Brushed Gold), Legend (Prismatic Crystal). | Bentuk perisai FUT berlebihan; rating angka fiktif 99; aset copyright EA Sports. |
| 11 | **W3C ARIA Carousel & WCAG 2.2.2** | Pola karusel aksesibel: kontrol jeda/putar yang terlihat, pengumuman sopan pembaca layar, dukungan `prefers-reduced-motion`. | *Universal Accessibility & Predictable Motion*: Pengguna memiliki kontrol penuh atas pergerakan layar. | Slider banner otomatis di Beranda: tombol jeda terlihat, jeda saat hover/fokus, rasio gambar terkunci tanpa CLS. | Karusel liar yang berganti otomatis tanpa tombol jeda; auto-play yang mengabaikan preferensi pengguna. |
| 12 | **Refactoring UI & Laws of UX** | Fitts's Law (target sentuh ≥ 44px), Miller's Law (maks 5-7 opsi per grup), hierarki optik melalui kontras tonal bukan warna-warni. | *Human Ergonomics & Visual Discipline*: Kenyamanan mata dan efisiensi jari pengguna. | Target ketuk pada semua kontrol ≥ 44px; pembatasan anggaran teks (≤ 40 kata di Beranda); formulir satu kolom teratur. | Label teks di bawah 12px; warna aksen tersebar di lebih dari 10% luas layar. |
| 13 | **Google Fonts & Fontshare** | Pustaka tipografi terbuka berkualitas tinggi dengan lisensi bebas komersial (OFL). | *Typography Authenticity & Licensing Safety*: Tipografi modern, aman lisensi, dan teruji pada teks Indonesia. | Pasangan font: **Plus Jakarta Sans** (UI Sans) + **Barlow Condensed** (Display Atletik). Keduanya SIL Open Font License. | Menggunakan font proprietary tanpa lisensi; kombinasi font usang ala templat game 2015. |

---

## 2. Sintesis Karakter ESPORT SUMBAR V3

Menggabungkan ketenangan fungsional **Linear & Vercel**, wibawa atletik **Nike & Apple**, serta taktilitas materi **EA FC & Revolut**, identitas ESPORT SUMBAR V3 didefinisikan sebagai:

> **"Identitas Digital Olahraga Elektronik Sumatera Barat yang Modern, Hening, Taktil, dan Berwibawa."**  
> Sebuah rumah kredibel bagi ekosistem olahraga digital 19 Kota/Kabupaten Sumatera Barat yang menonjolkan prestasi atlet nyata, data faktual, dan integritas komunitas tanpa ornamen murahan.

---

## 3. Matriks Anti-Pola "Templat AI" yang Dilarang Keras

1. **Dilarang Glow Neon / Cahaya Berlebih**: Ganti dengan elevasi tonal bertingkat (`#05051A` → `#0C0C26` → `#14143A`) dan bayangan halus 1 tingkat.
2. **Dilarang Bingkai Emas pada Semua Hal**: Emas `#D4AF37` hanya hadir pada **Lencana Terverifikasi** dan frame tier **Elite**.
3. **Dilarang Lebih dari Satu Aksen Warna**: Satu aksen utama Pink Brand `#FF1752`, satu warna status Emas `#D4AF37`, dan warna semantik standar (Sukses `#2BB673`, Peringatan `#F2A33A`, Bahaya `#F04438`).
4. **Dilarang Label Huruf Kapital Mikro (<12px) Berjarak Lebar**: Teks minimum 12px; gantikan dengan ikon bermakna dan nilai data tabular.
5. **Dilarang Kotak di Dalam Kotak**: Pisahkan konten menggunakan spasi ritmis (basis 8px) dan garis tipis 1px (putih 8%).
6. **Dilarang Foto Stok Orang & Identitas Palsu**: Hanya foto asli pengguna atau siluet kartu grafis brand; dilarang mencantumkan persona palsu.
7. **Dilarang Teks Teknis & Jargon Tutorial**: Tidak ada kata "realtime", "cloud database", atau "geser untuk rotasi". Affordance visual menggantikan tutorial.
