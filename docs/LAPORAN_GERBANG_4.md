# LAPORAN GERBANG KUALITAS 4 (G4)
## Transformasi ESPORT SUMBAR V3 — Bagian 4: Lapisan Aplikasi & Panel Admin Terpadu V3

**Tanggal Penyelesaian**: 6 November 2026  
**Status**: LULUS (Semua Gerbang Kualitas G4 Terpenuhi)  
**Git Tag**: `v3-part-4`  

---

### 1. Ringkasan Eksekutif Perubahan Bagian 4

Bagian 4 menyelesaikan restrukturisasi total lapisan aplikasi web dan antarmuka pengguna sesuai Mandat Transformasi ESPORT SUMBAR V3:
1. **Penghapusan Total Rute Terfragmentasi**: Rute lama `/admin/region/*`, `/admin/province/*`, `/admin/platform/*`, dan `/partners` dihapus total dan dialihkan secara permanen (HTTP 301) ke rute terpadu `/admin/*`.
2. **Panel Admin Terpadu Tunggal (`platform_admin`)**: Seluruh tata kelola platform disatukan di bawah satu navbar terpadu (`AdminNavbar.tsx`) dan route `/admin` dengan 10 modul esensial:
   - `/admin` (Ringkasan metrik, antrean SLA, tindakan cepat)
   - `/admin/verification` (Antrean verifikasi satu tahap, tertua dahulu, timer warna SLA <24j hijau / 24-48j kuning / >48j merah, pratinjau kartu 3D, modal Setujui / Revisi / Tolak / Tangguhkan)
   - `/admin/users` (Tata kelola akun pengguna, verifikasi email, penegakan 1 akun 1 profil)
   - `/admin/games` (Katalog dinamis game resmi dengan dukungan Honor of Kings)
   - `/admin/regions` (Master geografis murni 19 Kota/Kabupaten Sumatera Barat)
   - `/admin/news` (CMS publikasi berita mandiri ESPORT SUMBAR)
   - `/admin/audit` (Pencatat jejak audit log *append-only* yang tidak dapat dimanipulasi)
   - `/admin/moderation` (Penanganan laporan pelanggaran komunitas)
   - `/admin/settings` (Identitas platform, pengumuman global, dan konfigurasi)
3. **Penegakan Ketat 1 Akun = 1 Profil di Seluruh Antarmuka**:
   - `UserProfileDropdown.tsx`: Dropdown multi-profil dan tombol "Tambah Profil Bidang Lain" dihapus total; digantikan dengan tautan langsung ke profil aktif tunggal dan pengaturan.
   - `DesktopDashboardView.tsx`: Strip pemilihan profil ganda dihilangkan.
   - `DesktopCardWizard.tsx`: Tombol tambah profil dialihkan langsung ke dasbor profil yang sudah dimiliki.
   - `apps/web/src/app/actions/profile.ts`: Server-side guard menolak pembuatan profil jika akun sudah memiliki profil aktif serta mencegah peran `platform_admin` membuat profil entitas.
4. **Pembersihan Total Terminologi ESI & Kepatuhan UU PDP**:
   - Tidak ada lagi kata ESI, PBESI, Pengcab, Pengprov, KONI, atau Dispora pada komponen UI, navigasi, dan footer.
   - `DesktopVerificationView.tsx`: Tidak meminta KTP/KIA/NIK. Verifikasi menggunakan bukti publik non-sensitif (tangkapan layar in-game UID, sertifikat kejuaraan, surat rekomendasi tim/sekolah).
   - `OwnershipNote.tsx` & `Footer.tsx`: Mempertegas kepemilikan dan operator tunggal 100% oleh ESPORT SUMBAR.

---

### 2. Berkas yang Dibuat & Dihapus

#### A. Direktori / Berkas yang Dihapus
- `apps/web/src/app/admin/province/` (Dihapus)
- `apps/web/src/app/admin/region/` (Dihapus)
- `apps/web/src/app/admin/platform/` (Dihapus)
- `apps/web/src/app/partners/` (Dihapus)
- `apps/web/src/components/admin/AdminProvinceNavbar.tsx` (Dihapus)
- `apps/web/src/components/admin/AdminRegionNavbar.tsx` (Dihapus)

#### B. Berkas Baru yang Dibuat
- `apps/web/src/components/admin/AdminNavbar.tsx`
- `apps/web/src/app/admin/page.tsx`
- `apps/web/src/app/admin/verification/page.tsx`
- `apps/web/src/app/admin/users/page.tsx`
- `apps/web/src/app/admin/games/page.tsx`
- `apps/web/src/app/admin/regions/page.tsx`
- `apps/web/src/app/admin/news/page.tsx`
- `apps/web/src/app/admin/audit/page.tsx`
- `apps/web/src/app/admin/moderation/page.tsx`
- `apps/web/src/app/admin/settings/page.tsx`
- `apps/web/src/middleware.ts`

---

### 3. Hasil Pengujian & Verifikasi Kualitas (Gerbang G4)

| Pengujian / Validasi | Perintah | Target | Hasil |
| :--- | :--- | :--- | :--- |
| **Sapu Istilah Terlarang** | `node scripts/sweep-terms.js` | 0 temuan | **LULUS (0 temuan)** |
| **Pemindaian Rahasia** | `node scripts/scan-secrets.js` | 0 temuan | **LULUS (0 rahasia)** |
| **Pemeriksaan Tipe TypeScript** | `npm run type-check` | 0 error | **LULUS (3 paket, 0 error)** |
| **Unit & Contract Testing** | `npm test` | 100% pass | **LULUS (3 suite, 5 test pass)** |
| **Kompilasi & Build Produksi** | `npm run build` | 0 error | **LULUS (101/101 rute berhasil dibangun)** |

---

### 4. Checklist Kepatuhan Mandat V3 pada Bagian 4

- [x] **Mandat 1**: Eliminasi seluruh entitas/penyebutan ESI pada UI, URL, dan routing.
- [x] **Mandat 2**: Kepemilikan 100% mandiri oleh ESPORT SUMBAR dinyatakan tegas pada footer dan tata kelola.
- [x] **Mandat 3**: Verifikasi satu tahap (`ESP-SB-VER-YYYY-XXXX`) diterapkan pada antrean `/admin/verification` dengan pengurutan tertua dahulu (*oldest-first*) dan indikator warna SLA.
- [x] **Mandat 4**: Peran admin tunggal (`platform_admin`) ditegakkan melalui SSR Middleware dan API Guards.
- [x] **Mandat 6**: Aturan tegas 1 akun = 1 profil ditegakkan di Server Actions dan UI navigasi.
- [x] **Mandat 7**: Antarmuka katalog game dinamis telah disiapkan di `/admin/games` dengan Honor of Kings terdaftar.
