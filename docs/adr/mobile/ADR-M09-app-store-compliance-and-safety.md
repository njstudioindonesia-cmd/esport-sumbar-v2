# ADR-M09: Kepatuhan Toko Aplikasi (App Store & Google Play) dan Keamanan Pengguna

**Status**: APPROVED  
**Tanggal**: November 2026  

---

## 1. Konteks
Aplikasi mobile publik wajib memenuhi kebijakan ketat Apple App Store Review Guidelines (khususnya 5.1.1 Data Collection and Storage & 1.2 User-Generated Content) serta Google Play Developer Policies. Ketidakpatuhan pada fitur keselamatan (seperti penghapusan akun mandiri atau moderasi konten pengguna) akan berakibat penolakan peninjauan aplikasi (app review rejection).

## 2. Kebijakan Kepatuhan Utama

### 2.1 Penghapusan Akun Mandiri dari Dalam Aplikasi (In-App Account Deletion)
- **Persyaratan**: Sesuai Apple Guideline 5.1.1(v) dan Google Play Policy, jika aplikasi mendukung pembuatan akun, maka pengguna wajib dapat menghapus akunnya langsung dari dalam aplikasi dengan kemudahan yang setara.
- **Implementasi**:
  1. Lokasi: `Pengaturan` $\rightarrow$ `Keamanan & Akun` $\rightarrow$ `Hapus Akun`.
  2. Dialog konfirmasi dua langkah (*destructive confirmation modal*):
     - Langkah 1: Peringatan dampak permanen (penghapusan profil, kartu digital, dan pemutusan hubungan ekosistem).
     - Langkah 2: Masukkan kata sandi (atau konfirmasi biometrik/email OTP) sebelum permintaan dikirim.
  3. Aksi Backend via BFF:
     - Endpoint `DELETE /api/v1/auth/account`.
     - Revokasi instan semua sesi aktif di Supabase Auth (`supabase.auth.admin.deleteUser`).
     - Pembersihan token perangkat push di tabel `device_tokens`.
     - Anonimisasi atau soft-delete berjangka sesuai UU Pelindungan Data Pribadi (UU PDP).

### 2.2 Penanganan Konten Buatan Pengguna (UGC Moderation & Safety)
- **Persyaratan**: Apple Guideline 1.2 (User Generated Content).
- **Implementasi**:
  1. **Tombol Laporkan (Report)**: Tersedia pada setiap profil publik, kartu, dan media organisasi/tim. Pengguna dapat memilih kategori pelanggaran (Konten Tidak Pantas, Spam, Pelecehan, Peniruan Identitas).
  2. **Tombol Blokir (Block)**: Pengguna dapat memblokir pengguna lain secara mandiri. Begitu diblokir, relasi ekosistem terputus seketika dan profil target tidak muncul di hasil pencarian.
  3. **Syarat Layanan & Kebijakan Privasi**: Dapat diakses tanpa autentikasi langsung dari aplikasi (`Pengaturan` $\rightarrow$ `Legal`).
  4. **Tindakan Cepat**: Laporan diteruskan ke antrean moderasi dashboard web admin dengan SLA evaluasi $\le 24$ jam.

### 2.3 Pelindungan Pengguna di Bawah Umur (< 18 Tahun)
- **Persyaratan**: Google Families Policy & Apple Child Safety guidelines.
- **Implementasi**:
  1. Saat pendaftaran Player/Pelajar, sistem memeriksa tanggal lahir.
  2. Jika usia $< 18$ tahun, formulir mewajibkan pengisian nama wali/orang tua dan nomor kontak darurat terverifikasi.
  3. Foto profil dan informasi kontak siswa default diatur ke mode **Privat/Hanya Relasi Terhubung** untuk mencegah eksposur publik tanpa izin wali.

### 2.4 Label Privasi (Privacy Nutrition Labels & Data Safety)
- **Kamera**: Hanya digunakan untuk memotret foto profil/kartu dan memindai QR code verifikasi. String izin OS: *"ESPORT SUMBAR memerlukan akses kamera untuk memindai kode QR verifikasi dan mengambil foto profil Anda."*
- **Galeri/Penyimpanan**: Hanya untuk memilih foto profil dan menyimpan gambar kartu yang diekspor.
- **Token Perangkat**: Hanya untuk pengiriman push notification status verifikasi dan ekosistem.
- **Pelacakan**: **Nol (Zero) Cross-App Tracking**. Tidak menggunakan IDFA atau Google Advertising ID untuk pelacakan iklan.

### 2.5 Integritas Teks dan Aset Toko (Store Assets & Metadata)
- Judul, subtitle, dan deskripsi di listing Google Play dan Apple App Store **100% bebas dari istilah terlarang** (`PBESI`, `Pengprov`, `Pengcab`, `KONI`, `Dispora`, `resmi`, `official`, `sah`, `lisensi atlet`).
- Screenshot promosi toko menggunakan **data demo sintetis fiktif** (mis. *"Budi Pratama - Atlet Esport Kota Padang"*), bukan data asli individu tanpa izin tertulis.
- Ikon aplikasi menggunakan simbol resmi ESPORT SUMBAR (mark V-S) resolusi tinggi tanpa elemen lambang negara atau logo pihak ketiga.
