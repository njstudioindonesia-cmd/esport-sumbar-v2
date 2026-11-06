# ADR-002: Konsolidasi Peran Pengguna Menjadi `user` dan `platform_admin`

## Status
Diterima (*Accepted*)

## Konteks & Masalah
Di V2, sistem memiliki 4 peran akun dalam enum `account_role`:
- `user`: Pengguna umum yang mendaftarkan profil entitas esport.
- `region_admin`: Admin pengurus cabang (Pengcab) di 19 kabupaten/kota.
- `prov_admin`: Admin pengurus provinsi (Pengprov).
- `platform_operator`: Akun teknis yang awalnya diniatkan untuk pemeliharaan sistem.

Masalah:
1. Kompleksitas RLS sangat tinggi: setiap kueri membaca fungsi `public.get_auth_region_id()` dan mencocokkan `region_id` admin dengan entitas yang diperiksa.
2. Sering terjadi konflik akses di mana `platform_operator` justru diblokir oleh RPC verifikasi karena RPC hanya mengizinkan `prov_admin`.
3. Keberadaan 3 tingkat dasbor admin (`/admin/platform`, `/admin/province`, `/admin/region`) memicu duplikasi antarmuka dan komponen navigasi yang masif (menyumbang 6.07% duplikasi kode di repositori).

## Keputusan Arsitektur
1. **Penyederhanaan Menjadi Dua Peran Saja:**
   - `user`: Semua entitas publik (Player, Coach, Team, Community, Venue, School, Campus).
   - `platform_admin`: Tim pengelola tunggal ESPORT SUMBAR dengan hak kelola penuh atas verifikasi, katalog, audit, moderasi, dan regulasi ekosistem.
2. **Penghapusan Peran Wilayah:**
   Menghapus peran `region_admin`, `prov_admin`, dan `platform_operator`. Seluruh akun admin lama diturunkan (*downgraded*) menjadi `user`, dan hanya akun yang ditunjuk secara eksplisit oleh pemilik platform yang diangkat menjadi `platform_admin`.
3. **Pemisahan Kepentingan Mutlak (*Separation of Concerns*):**
   - Akun dengan peran `platform_admin` **TIDAK DIPERBOLEHKAN** membuat atau memiliki profil entitas esport di tabel `profiles`.
   - Admin yang ingin bermain game atau berpartisipasi dalam ekosistem wajib membuat akun terpisah berstatus `user` dengan email berbeda.
4. **Keamanan Ekstra Admin:**
   - Panel admin hanya berada di satu rute terpusat: `/admin/*`.
   - Akses admin wajib dilindungi Multi-Factor Authentication (MFA / TOTP) dan pembatasan laju (*rate limiting*).
   - Rute lama `/admin/region/*` dan `/admin/province/*` dihapus dan dialihkan permanen (301) ke `/admin`.

## Konsekuensi
### Positif
- Kebijakan RLS database menjadi sangat ringkas, cepat, dan mudah diaudit (hanya memeriksa `role = 'platform_admin'`).
- 14 rute admin lama yang redundan dapat dihapus, memangkas ribuan baris kode duplikat.
- Tidak ada lagi celah eskalasi hak istimewa antardaerah.

### Negatif / Mitigasi
- Akun mantan pengurus Pengcab/Pengprov kehilangan akses admin daerah.  
  *Mitigasi:* Disediakan prosedur migrasi data (D1) di mana akun mereka tetap utuh sebagai akun `user` normal sehingga data partisipasi mereka tidak hilang.
