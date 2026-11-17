# ADR-M04: Strategi Data Offline, Cache-First, dan Antrean Tulis Idempoten

**Status**: APPROVED  
**Tanggal**: November 2026  

---

## 1. Konteks
Kondisi sinyal seluler di berbagai daerah Sumatera Barat (pegunungan, arena turnamen yang padat) sering mengalami latensi tinggi atau putus koneksi (*flaky network*). Aplikasi mobile harus tetap dapat dioperasikan secara offline untuk membaca data profil, kartu atlet, dan QR code.

## 2. Keputusan Arsitektur
1. **Strategi Pembacaan Data (Cache-First dengan SWR)**:
   - Menggunakan **TanStack Query (React Query)** dengan penyimpanan persisten lokal cepat (`react-native-mmkv`).
   - Halaman direktori, detail profil, dan berita menampilkan data cache seketika saat dibuka, disusul background revalidation.
2. **Kartu Dompet Offline (Offline ID Pass)**:
   - Informasi kartu (`esport_id`, nama, cabang game, tier, status verifikasi) dan gambar QR code disimpan di penyimpanan persisten perangkat.
   - Kartu dapat ditampilkan 100% offline di arena pertandingan. Banner memperingatkan: *"Status verifikasi offline — validasi penuh memerlukan internet"*.
3. **Antrean Tulis Idempoten (Write Queue)**:
   - Aksi pengajuan relasi atau pembaruan profil saat koneksi terputus dimasukkan ke dalam antrean lokal dengan `idempotency_key` (UUIDv4).
   - Saat internet kembali online, antrean dikirim ulang secara otomatis dengan *exponential backoff & jitter*.
