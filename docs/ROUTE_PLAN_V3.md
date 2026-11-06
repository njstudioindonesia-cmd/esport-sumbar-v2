# Rencana Rute & Akses Kontrol V3 (Route & RBAC Plan)

Dokumen ini memetakan konsolidasi rute Next.js, penghapusan rute lama warisan ESI, pengalihan 301 (*Permanent Redirects*), dan matriks hak akses berbasis peran baru (`user` dan `platform_admin`).

---

## 1. Rute yang Dihapus & Pengalihan Permanen (301)

Sesuai Keputusan D10 dan mandat penghapusan struktur ESI daerah/provinsi, seluruh rute berikut dinonaktifkan di codebase dan dialihkan via `next.config.ts`:

| Rute Lama V2 | Status | Target Pengalihan 301 | Alasan |
|---|---|---|---|
| `/admin/region` | Dihapus | `/admin` | Konsolidasi panel admin tunggal |
| `/admin/region/*` (semua subrute) | Dihapus | `/admin` | Tidak ada lagi struktur admin per wilayah |
| `/admin/province` | Dihapus | `/admin` | Tidak ada lagi struktur admin provinsi |
| `/admin/province/*` (semua subrute) | Dihapus | `/admin` | Konsolidasi panel admin tunggal |
| `/partners` | Dihapus | `/about` | Menghapus klaim kemitraan kelembagaan ESI/KONI |
| `/admin/platform/regions` | Refactor | `/admin/regions` | Disederhanakan murni untuk kelola data geografis 19 kota/kabupaten |

Konfigurasi redirect di `next.config.ts`:
```typescript
async redirects() {
  return [
    {
      source: '/admin/region/:path*',
      destination: '/admin',
      permanent: true,
    },
    {
      source: '/admin/province/:path*',
      destination: '/admin',
      permanent: true,
    },
    {
      source: '/partners',
      destination: '/about',
      permanent: true,
    },
  ];
}
```

---

## 2. Struktur Rute Target V3

### 2.1 Rute Publik (Guest & User)
- `/`: Landing page utama (hero modern, showcase atlet berprestasi, statistik ekosistem Sumbar, berita).
- `/directory`: Direktori publik pencarian profil (filter per bidang, game, wilayah, tier, dan ekosistem).
- `/directory/[slug]`: Halaman profil publik entitas esport (3D Card viewer, bio, roster/ekosistem, sertifikat digital).
- `/about`: Profil inisiatif ESPORT SUMBAR, visi, misi, pedoman komunitas (tanpa klaim ESI).
- `/news`: Portal berita esport lokal dan liputan turnamen.
- `/news/[slug]`: Detail artikel berita.
- `/legal/terms`: Syarat & Ketentuan Penggunaan Layanan (ESPORT SUMBAR sebagai operator tunggal).
- `/legal/privacy`: Kebijakan Privasi (prinsip perlindungan data pribadi, tanpa KTP).

### 2.2 Rute Pengguna Terdaftar (`user`)
- `/dashboard`: Dasbor utama pengguna (status kartu, ID digital, pintasan aksi cepat).
- `/wizard`: Wizard registrasi bidang dan kustomisasi kartu 3D (final 1x pilih bidang).
- `/profile/edit`: Formulir penyuntingan profil entitas dan penggantian foto in-game.
- `/verification`: Halaman pelacakan status verifikasi (Upload bukti non-sensitif, riwayat catatan tim ESPORT SUMBAR).
- `/ecosystem`: Halaman "Ekosistem Saya" (daftar relasi aktif, undangan masuk, permintaan terkirim, cari relasi baru).

### 2.3 Rute Admin Platform Tunggal (`platform_admin`)
- `/admin`: Dasbor ringkasan analitik (jumlah entitas, SLA antrean verifikasi, grafik sebaran wilayah & game).
- `/admin/verification`: Antrean verifikasi satu tahap (indikator SLA warna, filter game/wilayah, viewer bukti in-game, aksi Setujui / Revisi / Tolak dengan alasan wajib).
- `/admin/users`: Manajemen akun pengguna (pencarian akun, suspensi profil, reset bidang darurat).
- `/admin/ecosystem`: Pemantauan relasi ekosistem & pengaturan parameter `relation_rules`.
- `/admin/games`: Pengelolaan katalog game dinamis (tambah game, roles, ranks, nonaktifkan game).
- `/admin/regions`: Pengelolaan data master 19 wilayah geografis Sumatera Barat.
- `/admin/news`: CMS publikasi dan kurasi berita esport.
- `/admin/audit`: Viewer append-only audit log (membaca `audit_logs_view` yang memetakan histori secara transparan).
- `/admin/settings`: Konfigurasi global platform (pengumuman banner, maintenance mode).

---

## 3. Matriks Otorisasi Akses (RBAC Matrix)

| Rute / Aksi | Guest (Anonim) | User (Terautentikasi) | Platform Admin |
|---|:---:|:---:|:---:|
| Baca Landing Page, Berita, Legal | ✅ | ✅ | ✅ |
| Baca Direktori & Profil Publik | ✅ | ✅ | ✅ |
| Registrasi Akun & Login | ✅ | ❌ (Redirect ke Dashboard) | ❌ (Redirect ke Admin) |
| Isi Wizard Kartu / Pilih Bidang | ❌ | ✅ (Hanya jika belum punya profil) | ❌ (Admin dilarang punya profil) |
| Kelola Profil Sendiri & Ekosistem | ❌ | ✅ (Profil miliknya saja) | ❌ |
| Ajukan Verifikasi Profil | ❌ | ✅ | ❌ |
| Akses Panel `/admin/*` | ❌ (403 / Redirect Login) | ❌ (403 Terlarang) | ✅ (Wajib lolos MFA) |
| Eksekusi RPC `transition_verification` | ❌ | ❌ | ✅ (Dilarang memverifikasi diri sendiri) |
| Mengubah Katalog Game & Aturan Relasi | ❌ | ❌ | ✅ |
