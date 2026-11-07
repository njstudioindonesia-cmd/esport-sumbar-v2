# RENCANA HALAMAN BARU DAN PENGALIHAN RUTE (301 REDIRECTS) V3

> Dokumen Bagian 1.5: Spesifikasi Pembuatan Halaman Baru (Keputusan D5 & Bagian 3.3), Penghapusan Aset Mitra Lama, dan Matriks Pengalihan 301.

---

## 1. Daftar Halaman Baru yang Wajib Dibangun pada Bagian 3

| ID | Rute Baru | Kategori | Peran Akses | Tujuan & Deskripsi Fungsi | File Rencana |
|---|---|:---:|:---:|---|---|
| **NP1** | `/verification-standard` | Publik | Tamu / Publik | Menjelaskan kriteria verifikasi satu tahap mandiri ESPORT SUMBAR, standar keabsahan dokumen, nomor lencana (`ESP-SB-VER-YYYY-XXXX`), dan hak pemegang kartu terverifikasi. | `apps/web/src/app/verification-standard/page.tsx` |
| **NP2** | `/verify/[esport-id]` | Publik | Tamu / Publik | Halaman landing publik saat QR Code pada kartu fisik/digital dipindai. Menampilkan status keabsahan verifikasi, tanggal penerbitan, masa berlaku, dan cabang game. | `apps/web/src/app/verify/[esport-id]/page.tsx` |
| **NP3** | `/content-policy` | Legal | Tamu / Publik | Kebijakan konten platform dan pedoman UGC (D6): melarang pengguna mengklaim mewakili organisasi lain di bio/nama turnamen, larangan ujaran kebencian, dan hak moderasi admin. | `apps/web/src/app/content-policy/page.tsx` |
| **NP4** | `/contact` | Publik | Tamu / Publik | Formulir narahubung resmi platform, kontak pelindungan data pribadi (`privasi@esportsumbar.id`), dan layanan bantuan atlet/komunitas. | `apps/web/src/app/contact/page.tsx` |
| **NP5** | `/faq` | Publik | Tamu / Publik | Tanya Jawab umum seputar ESPORT ID, kartu TCG digital, tata cara verifikasi satu tahap, dan integrasi ekosistem 7 entitas. | `apps/web/src/app/faq/page.tsx` |
| **NP6** | `/games` | Publik | Tamu / Publik | Halaman publik katalog cabang game dinamis: daftar game resmi terdata, pengembang/publisher, role pertandingan, dan tier rank kompetitif. | `apps/web/src/app/games/page.tsx` |
| **NP7** | `/games/[slug]` | Publik | Tamu / Publik | Detail spesifik cabang game (misal: `/games/honor-of-kings`), aturan role, dan daftar atlet/tim terverifikasi pada nomor game tersebut. | `apps/web/src/app/games/[slug]/page.tsx` |
| **NP8** | `/forgot-password` | Auth | Tamu | Formulir permohonan pemulihan kata sandi dengan pengiriman tautan token Supabase Auth secara aman tanpa kebocoran status email. | `apps/web/src/app/forgot-password/page.tsx` |
| **NP9** | `/reset-password` | Auth | Tamu (Token) | Formulir entri kata sandi baru setelah pengguna mengklik tautan dari inbox email. | `apps/web/src/app/reset-password/page.tsx` |
| **NP10** | `/auth/check-email` | Auth | Tamu | Layar kaca transisi yang menginstruksikan pengguna baru untuk membuka inbox email guna konfirmasi akun. | `apps/web/src/app/auth/check-email/page.tsx` |
| **NP11** | `/403` | Sistem | Semua | Halaman penanganan kesalahan akses ditolak saat pengguna mencoba membuka rute di luar hak perannya. | `apps/web/src/app/403/page.tsx` |
| **NP12** | `/offline` | Sistem | Semua | Layar penanganan PWA ketika perangkat pengguna kehilangan koneksi internet, dengan opsi menampilkan kartu tersimpan di cache lokal. | `apps/web/src/app/offline/page.tsx` |
| **NP13** | `/admin/system` | Admin | `platform_admin` | Dashboard observabilitas admin: status kesehatan microservices, utilisasi kuota, metrik performa, dan kartu Info Build (commit hash + build time). | `apps/web/src/app/admin/system/page.tsx` |
| **NP14** | `/admin/verification/[id]` | Admin | `platform_admin` | Antarmuka fokus penelaahan satu berkas pengajuan verifikasi dengan viewer dokumen via signed URL pendek (60 detik) dan log riwayat telaah. | `apps/web/src/app/admin/verification/[id]/page.tsx` |
| **NP15** | `/admin/relation-rules` | Admin | `platform_admin` | Antarmuka pengelolaan matriks 17 aturan relasi deklaratif ekosistem (`relation_rules`). | `apps/web/src/app/admin/relation-rules/page.tsx` |

---

## 2. Matriks Pengalihan 301 (Permanent Redirects)

Untuk menjaga integritas SEO, mencegah 404 pada bookmark lama pengguna, dan menghapus seluruh rute warisan kemitraan/daerah, pengalihan 301 akan dikonfigurasi pada `next.config.ts` di Bagian 3:

| Rute Asal (Legacy / Salah) | Rute Tujuan Baru (V3) | Kode Status | Alasan & Justifikasi Pengalihan |
|---|---|:---:|---|
| `/partners` | `/ecosystem` | `301` | Menghilangkan halaman mitra ESI warisan; mengalihkan pengunjung ke peta ekosistem mandiri Sumbar. |
| `/admin/region` | `/admin` | `301` | Menghapus hierarki Admin Daerah warisan; seluruh pengelolaan kini terpusat pada Admin Tunggal. |
| `/admin/region/:path*` | `/admin` | `301` | Menghapus seluruh sub-rute daerah warisan. |
| `/admin/province` | `/admin` | `301` | Menghapus label kepengurusan provinsi warisan. |
| `/admin/province/:path*` | `/admin` | `301` | Menghapus seluruh sub-rute pengurus provinsi warisan. |
| `/me/memberships` | `/me/ecosystem` | `301` | Penyelarasan tata nama domain V3: dari "memberships" menjadi "ecosystem" (mencakup 7 entitas). |
| `/me/cards` | `/me/card` | `301` | Prinsip 1 akun = 1 profil tunggal (hanya ada 1 kartu utama per akun, bukan kartu jamak). |
| `/me/profile` | `/me` | `301` | Penyeragaman rute profil akun pengguna. |
| `/me/profile/:id/edit` | `/me/edit` | `301` | Penyederhanaan rute pengeditan profil mandiri. |
| `/admin/moderation` | `/admin/reports` | `301` | Konsolidasi antarmuka penanganan laporan pelanggaran konten. |

---

## 3. Rencana Penghapusan Aset & Komponen Warisan

1. **Penghapusan Komponen Stub:**
   - Hapus berkas `apps/web/src/components/brand/PartnerStrip.tsx`.
   - Bersihkan seluruh impor `PartnerStrip` dari `apps/web/src/components/brand/index.ts` dan halaman pemanggilnya.
2. **Penghapusan Teks Mitra di Layout:**
   - Bersihkan entri kata kunci `"ESI Sumbar"` dan `"Mitra ESI Sumatera Barat"` di `apps/web/src/app/layout.tsx`.
3. **Penyelarasan Tautan di Komponen Beranda:**
   - Ubah tautan mati `<Link href="/partners">` di `HomePageClient.tsx` menjadi `<Link href="/ecosystem">`.
