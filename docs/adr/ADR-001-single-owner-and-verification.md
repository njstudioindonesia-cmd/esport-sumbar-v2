# ADR-001: Satu Pemilik Tunggal dan Verifikasi Satu Tahap oleh ESPORT SUMBAR

## Status
Diterima (*Accepted*)

## Konteks & Masalah
Pada ESPORT SUMBAR V2, tata kelola sistem didasarkan pada struktur bertingkat warisan ESI (Pengcab di 19 kota/kabupaten dan Pengprov tingkat provinsi). Verifikasi atlet di V2 melibatkan alur dua tahap:
1. Tahap 1: Verifikasi awal oleh `region_admin` (Pengcab) mengubah status menjadi `regional_checked`.
2. Tahap 2: Verifikasi akhir oleh `prov_admin` (Pengprov) menerbitkan lencana bernomor `ESI-SB-VER-YYYY-XXXX` dengan klaim "Resmi PBESI/KONI".

Masalah:
1. Ketergantungan struktural pada organisasi eksternal memperlambat SLA verifikasi (banyak Pengcab tidak aktif sehingga terjadi penumpukan/stagnasi antrean).
2. Klaim legal "Resmi/Pengesahan PBESI & KONI" berisiko hukum tinggi tanpa dasar MoU yang mengikat.
3. Hak kepemilikan platform menjadi kabur antara inisiatif komunitas ESPORT SUMBAR dengan pengurus cabang olahraga.

## Keputusan Arsitektur
1. **Kepemilikan Penuh (100% Sole Ownership):**
   ESPORT SUMBAR adalah satu-satunya pemilik, pengelola, dan penerbit identitas digital pada platform.
2. **Penghapusan Verifikasi Berjenjang:**
   Menghapus alur 2-tier (Pengcab → Pengprov). Verifikasi atlet dan entitas lain disederhanakan menjadi **satu tahap langsung** yang dieksekusi oleh tim verifikator internal ESPORT SUMBAR (`platform_admin`).
3. **Mesin Status Baru (State Machine):**
   - Siklus status: `unverified` → `submitted` → `under_review` → (`revision_requested` ↔ `submitted`) → `verified` | `rejected`.
   - Status tambahan: `suspended` (pembekuan sementara dari verified) dan `expired` (masa berlaku 12 bulan habis).
4. **RPC Server Tunggal Transaksional:**
   Seluruh transisi status dieksekusi melalui satu fungsi basis data PostgreSQL `transition_verification(...)` yang menjamin:
   - Hanya dapat dipanggil oleh `platform_admin`.
   - Admin dilarang memverifikasi atau mengubah profil miliknya sendiri (*Separation of Duties*).
   - Setiap transisi menolak aksi tanpa alasan wajib untuk penolakan/revisi/penangguhan.
   - Menghasilkan ID sertifikat/badge digital dengan format netral: `ESP-SB-VER-YYYY-XXXX` (tanpa akronim ESI).
   - Menuliskan log perubahan status ke `audit_logs` dalam transaksi atomik yang sama.
5. **Bukti Tanpa Dokumen Kependudukan Sensitif:**
   Hentikan pengumpulan KTP, NIK, dan Kartu Keluarga. Bukti verifikasi diganti dengan:
   - Tangkapan layar in-game profile (IGN + ID game).
   - Kartu Pelajar / Kartu Mahasiswa (identitas akademik; NISN/NIM dapat disamarkan).
   - Foto papan nama tempat usaha (khusus Venue).
   - Surat keterangan / tautan media sosial resmi tim / komunitas.

## Konsekuensi
### Positif
- Alur verifikasi menjadi sangat cepat, transparan, dan tidak bergantung pada keaktifan admin lokal di 19 daerah.
- Risiko hukum atas klaim pihak ketiga (PBESI/KONI) hilang sepenuhnya.
- Privasi data pengguna terlindungi secara maksimal (memenuhi prinsip minimisasi data PDP tanpa menyimpan KTP/NIK).

### Negatif / Mitigasi
- Beban kerja verifikasi terpusat pada tim admin platform ESPORT SUMBAR.  
  *Mitigasi:* Disediakan filter antrean canggih (berdasarkan game, wilayah, dan entitas), SLA timer visual (hijau <48j, kuning 48-96j, merah >96j), serta template alasan penolakan/revisi sekali klik.
