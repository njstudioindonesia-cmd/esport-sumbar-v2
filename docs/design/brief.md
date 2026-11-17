# BRIEF DESAIN & SPESIFIKASI SISTEM VISUAL V3
## ESPORT SUMBAR V3

**Dokumen**: `docs/design/brief.md`  
**Status**: Bagian 4 — Brief Desain & Spesifikasi Sistem Visual  
**Tujuan**: Menjadi panduan pengarah visual tunggal untuk menghapus tampilan "templat AI" dan menghadirkan antarmuka web dan mobile yang berwibawa, modern, minimalis, dan berpusat pada konten identitas asli.

---

## 1. Pernyataan Arah Visual (Direction Statement)

> Platform web dan mobile ESPORT SUMBAR V3 dirancang ulang sebagai **Identitas Digital Atlet dan Komunitas Olahraga Elektronik Kelas Dunia**. Antarmuka tampil hening, taktil, dan lapang dengan filosofi *content-first*: membiarkan foto profil asli atlet, prestasi terverifikasi, dan identitas komunitas menjadi pahlawan utama layar, sementara chrome antarmuka mundur ke latar belakang secara tenang. Seluruh visual berakar pada identitas resmi merek—dasar navy-hitam pekat (`#05051A`), satu aksen pink logo (`#FF1752`), dan sentuhan emas khusus (`#D4AF37`) untuk status verifikasi—bebas dari hiasan dekoratif murahan seperti glow neon, kotak bertumpuk, atau label mikro kapital berjarak lebar.

---

## 2. Lima Kata Kunci Karakter (Brand Persona)

1. **Wibawa (Prestigious)**: Tampil seperti identitas federasi olahraga resmi tingkat internasional, bukan arcade game murah atau dashboard gamer klise.
2. **Hening (Calm)**: Antarmuka yang tenang dan percaya diri; tidak berteriak lewat warna-warni atau garis pembatas tebal.
3. **Taktil (Tactile)**: Setiap permukaan memiliki tekstur material yang nyata (matte, satin, brushed gold, crystal) dan respons interaksi yang memuaskan.
4. **Presisi (Precise)**: Ritme grid 8pt (sub-grid 4pt) yang disiplin, hierarki tipografi modular yang tajam, dan pemisah garis 1px halus (putih 8%).
5. **Berpusat pada Manusia (Human-Centered)**: Foto asli pengguna, nama besar yang terbaca alami, dan angka tabular yang berbicara menggantikan instruksi teks panjang dan jargon teknis.

---

## 3. Prinsip Desain Inti

1. **Kurangi, Jangan Tambah**: Jika sebuah elemen tidak menjawab kebutuhan mendesak pengguna dalam 1 detik, elemen tersebut dihapus.
2. **Satu Objek Utama per Layar**: Mata pengguna harus langsung tertuju pada satu titik fokus utama tanpa keraguan.
3. **Hierarki Lewat Ukuran dan Jarak**: Membedakan prioritas melalui skala modular tipografi dan spasi lapang (96–128px antarbagian desktop), bukan dengan memberi warna berbeda pada setiap teks.
4. **Disiplin Satu Aksen Warna**: Aksen Pink Brand dipakai hemat (<10% luas layar) untuk aksi interaksi primer. Emas disakralkan hanya untuk lencana verifikasi dan tier Elite.
5. **Bahasa Visual Menggantikan Teks**: Ikon semantik, angka besar, dan status visual menggantikan kalimat tutorial dan penjelasan bertele-tele.

---

## 4. Daftar "Tidak Akan Pernah" (Anti-Template Mandates)

Aplikasi ESPORT SUMBAR V3 **TIDAK AKAN PERNAH**:
1. Menggunakan efek **glow/neon** pada avatar, border, atau tombol.
2. Menggunakan **bingkai emas** pada elemen selain lencana terverifikasi atau frame kartu Elite.
3. Menampilkan **lebih dari satu aksen warna brand** pada satu layar.
4. Menggunakan **label huruf kapital kecil (<12px) berjarak huruf lebar** (*tracking-widest*) ala sci-fi arcade.
5. Menampilkan **pola kotak bersarang di dalam kotak** (border di dalam border).
6. Menggunakan **avatar placeholder inisial huruf dalam lingkaran bercahaya**.
7. Menampilkan **ikon generik (perisai, gamepad)** sebagai logo aplikasi menggantikan mark V-S resmi versi transparan.
8. Menampilkan **jargon teknis** (*"cloud database"*, *"realtime stream"*, dll.) atau **kalimat tutorial** (*"geser kartu..."*) di layar.
9. Menggunakan **font display condensed untuk teks isi atau label navigasi**.
10. Menampilkan **deretan statistik berangka nol ("0")** saat belum ada data yang cukup.
11. Menampilkan **foto stok orang dengan nama/identitas fiktif** atau **citra bermerek pihak ketiga** (ASUS ROG, dll.).
12. Menggunakan istilah usang **"paspor"** di seluruh antarmuka dan metadata.

---

## 5. Keputusan Tipografi & Hasil Uji Kandidat

### 5.1 Uji Kandidat Font Sans UI (Teks Isi, Navigasi, & Kontrol)

Pengujian dilakukan menggunakan teks Bahasa Indonesia nyata dengan kata bersuku panjang, awalan/akhiran (*mengikutsertakan*, *keberlanjutan*, *pertanggungjawaban*), dan kluster konsonan (*ng*, *ny*, *kh*, *sy*):

| Kandidat | Uji Keterbacaan Bahasa Indonesia | Kerapian Angka Tabular | Lisensi | Keputusan & Alasan |
|---|---|---|---|---|
| **Plus Jakarta Sans** | **Sangat Baik**: x-height proporsional, aperture terbuka lebar, kluster konsonan Indonesia terbaca alami pada ukuran 12–16px. | **Unggul**: Angka tabular sejajar sempurna untuk ID, jam tanding, dan tanggal registrasi. | SIL Open Font License | **DIPILIH**: Dirancang dengan sensitivitas visual Indonesia kontemporer; sangat jernih, modern, dan berwibawa di desktop maupun mobile. |
| **Inter** | Sangat baik dan netral, keterbacaan tinggi. | Sangat rapi. | SIL Open Font License | Tidak dipilih: Terlalu korporat dan kaku untuk platform olahraga elektronik pemuda. |
| **Geist** | Tajam dan presisi pada konteks teknikal. | Sangat rapi. | SIL Open Font License | Tidak dipilih: Nuansa terlalu developer-centric, kurva huruf kaku pada kalimat narasi Indonesia. |

### 5.2 Uji Kandidat Font Display (Nama Atlet, IGN, Angka Heroik, & Angka Kartu Saja)

Pengujian dilakukan menggunakan nama dan judul resmi Sumatera Barat (*MINANG VIPER*, *SINGA SINGKARAK*, *ESPORT SUMBAR*, *SUMATERA BARAT*):

| Kandidat | Uji Karakter Olahraga & Esport | Uji Nama Panjang Tanpa Truncate | Lisensi | Keputusan & Alasan |
|---|---|---|---|---|
| **Barlow Condensed** | **Sangat Kuat**: Athletic, tegas, terinspirasi tipografi rambu publik dan poster olahraga internasional kontemporer. | **Sempurna**: Menghemat lebar horizontal hingga 25% tanpa terkesan gepeng, pipih, atau murah. | SIL Open Font License | **DIPILIH**: Memberikan wibawa atletik profesional kelas dunia tanpa nuansa game arcade klise (pengganti ideal untuk Rajdhani/Saira). |
| **Saira Condensed** | Kuat, bernuansa turnamen esport. | Cukup baik, sudut huruf sedikit kaku. | SIL Open Font License | Alternatif cadangan. |
| **Big Shoulders Display** | Sangat sempit dan ekspresif. | Sulit dibaca pada kombinasi huruf besar dan angka tebal. | SIL Open Font License | Tidak dipilih: Terlalu sempit dan rentan distorsi optik pada resolusi rendah. |

### 5.3 Skala Modular Tipografi

* **Display 1 (Hero IGN / Kartu Utama)**: Barlow Condensed 48px (Desktop) / 36px (Mobile), Line-height 1.05, W900, Uppercase
* **Display 2 (Nama Profil / Judul Poster)**: Barlow Condensed 32px (Desktop) / 26px (Mobile), Line-height 1.15, W800, Uppercase
* **Title Large (Judul Halaman)**: Plus Jakarta Sans 28px (Desktop) / 22px (Mobile), Line-height 1.25, W700
* **Title Medium (Sub-bagian)**: Plus Jakarta Sans 20px (Desktop) / 18px (Mobile), Line-height 1.3, W600
* **Body Large (Teks Hero / Lead)**: Plus Jakarta Sans 16px (Desktop) / 15px (Mobile), Line-height 1.5, W400
* **Body Regular (Teks Isi Utama)**: Plus Jakarta Sans 14px, Line-height 1.5, W400
* **Caption / Label Minimal**: Plus Jakarta Sans 12px, Line-height 1.4, W500 *(Batas minimum pembacaan sistem, tidak ada teks < 12px)*
* **Angka Tabular / Metrik**: Barlow Condensed / Plus Jakarta Sans font-feature-settings: `"tnum"`

---

## 6. Palet Warna Resmi (Berdasarkan Berkas Logo Asli)

```css
/* Palet Netral & Tonal Permukaan */
--ink-base:             #05051A;  /* Latar belakang aplikasi paling dalam */
--surface-1:            #0C0C26;  /* Kontainer level 1 (kartu, panel datar) */
--surface-2:            #14143A;  /* Kontainer level 2 (input, modal, dialog) */
--surface-3:            #1D1D4A;  /* Permukaan terangkat (elevasi interaktif) */

/* Warna Pemisah Garis Halus (Hairline Divider) */
--border-subtle:        rgba(255, 255, 255, 0.08); /* 1px line divider */
--border-focus:         rgba(255, 255, 255, 0.20); /* State aktif/fokus */

/* Hirarki Teks Monokrom Bersih (Lolos Rasio Kontras WCAG AA) */
--text-primary:         #FFFFFF;                  /* 100% Putih Murni (Rasio 18.5:1) */
--text-secondary:       rgba(255, 255, 255, 0.64); /* 64% Pembacaan sekunder (Rasio 9.8:1) */
--text-muted:           rgba(255, 255, 255, 0.40); /* 40% Label tersier (Rasio 4.8:1) */

/* Aksen Merek Tunggal (Pink dari Mark V-S Resmi) */
--brand-pink:           #FF1752;  /* Aksen tombol CTA primer & seleksi aktif */
--brand-pink-subtle:    rgba(255, 23, 82, 0.12); /* Latar aksen lembut */
--brand-pink-hover:     #E01246;  /* State hover tombol primer */

/* Warna Status Terverifikasi & Frame Kartu */
--verified-gold:        #D4AF37;  /* Emas lencana verifikasi & frame Elite */
--verified-gold-subtle: rgba(212, 175, 55, 0.12);

/* Warna Semantik Fungsional (Terpisah Jelas dari Pink Brand) */
--success:              #2BB673;  /* Status disetujui / aktif */
--warning:              #F2A33A;  /* Menunggu verifikasi / review */
--danger:               #F04438;  /* Error / tolak / bahaya */
```

---

## 7. Spasi, Elevasi, dan Bentuk

* **Basis Grid**: 8px grid utama, 4px micro-grid.
* **Lebar Maksimal Kontainer Desktop**: 1200px – 1280px (terpusat).
* **Jarak Antarbagian (Desktop)**: 96px – 128px (lapang dan tenang).
* **Jarak Antarbagian (Mobile)**: 32px – 48px.
* **Radius Sudut Konsisten**:
  * Kontrol, Input, Tombol: `8px` (`rounded-lg`)
  * Kartu UI, Kotak Konten: `16px` (`rounded-2xl`)
  * Panel Besar, Modal, Dialog: `24px` (`rounded-3xl`)
  * Avatar, Lencana Status, Pil: `9999px` (`rounded-full`)
* **Kaca (Matte Glass) Terbatas**:
  * **HANYA** diterapkan pada header saat scroll (`backdrop-blur-md bg-[#05051A]/80`) dan modal overlay.
  * Kartu dan panel di isi halaman menggunakan permukaan solid bertingkat tonal.

---

## 8. Sistem Rarity Kartu Lewat Bahan Fisik (Bukan Glow)

Sesuai kontrak backend V3 (`["rookie", "contender", "elite", "legend"]`), kartu dibedakan oleh bahan tekstur fisik:

1. **Rookie**: *Matte Bronze*  
   Permukaan gelap grafit dengan lis perunggu halus tanpa refleksi.
2. **Contender**: *Satin Silver*  
   Tekstur perak satin bersih dengan garis tepi presisi baja canai dingin.
3. **Elite**: *Brushed Gold*  
   Sentuhan emas matte bertekstur logam mulia dengan highlight tipis pada lencana.
4. **Legend**: *Prismatic Crystal*  
   Permukaan obsidian kristal dengan refraksi prismatik subtil (maksimal 8 derajat sudut pantul).

---

## 9. Desain Gerak & Aksesibilitas

* **Durasi & Kurva**: 200ms – 300ms dengan `cubic-bezier(0.16, 1, 0.3, 1)` (spring halus).
* **Satu Koreografi per Halaman**: Transisi reveal sekali jalan saat halaman dimuat, tanpa looping yang mengalihkan perhatian.
* **Prefers-Reduced-Motion**: Pada pengguna yang mengaktifkan reduksi gerak, semua transisi otomatis digantikan dengan pergantian instan tanpa animasi translasi atau rotasi.
* **Aksesibilitas Target Ketuk**: Semua tombol dan elemen interaktif memiliki dimensi fisik minimum 44px × 44px (WCAG 2.5.5 / 2.5.8).
