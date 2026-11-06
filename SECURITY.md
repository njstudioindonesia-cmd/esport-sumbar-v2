# Kebijakan Keamanan Sistem (SECURITY.md)

**Proyek**: ESPORT SUMBAR V3  
**Status**: Aktif & Ditegakkan  
**Standar Kepatuhan**: UU Perlindungan Data Pribadi No. 27/2022 & OWASP Top 10

---

## 1. Kebijakan Pelaporan Kerentanan (Vulnerability Disclosure)

Keamanan ekosistem atlet dan komunitas adalah prioritas utama ESPORT SUMBAR. Jika Anda menemukan kerentanan keamanan pada platform kami, mohon laporkan secara bertanggung jawab (*responsible disclosure*) kepada:

- **Email Keamanan**: `security@esportsumbar.id`
- **Enkripsi PGP**: Tersedia berdasarkan permintaan
- **SLA Respons Awal**: Maksimal 24 jam kerja
- **SLA Mitigasi Kerentanan Kritis**: Maksimal 72 jam

> **Catatan Penting**: Harap jangan mempublikasikan atau mengeksploitasi kerentanan terhadap data pengguna riil sebelum tim teknis ESPORT SUMBAR selesai melakukan perbaikan (*coordinated disclosure*).

---

## 2. Model Otorisasi & Peran Tunggal (Role Hierarchy)

ESPORT SUMBAR V3 mengadopsi model RBAC yang disederhanakan dan diperketat secara drastis untuk mencegah eskalasi hak istimewa (*privilege escalation*):

| Peran Akun | Hak Akses | Pembatasan Ketat |
|---|---|---|
| `platform_admin` | Akses penuh modul panel admin (Verifikasi, Moderasi, CMS Berita, Katalog Game, Audit Trail, Observabilitas). | **Tidak diperbolehkan** memiliki kartu/profil entitas kompetisi untuk mencegah benturan kepentingan (*Separation of Duties*). |
| `user` | Pengguna umum / pemilik profil terdaftar (Atlet, Pelatih, Tim, Komunitas, Venue, Sekolah, Kampus). | Dibatasi oleh aturan RLS (Row Level Security) murni pada baris datanya sendiri. |

*Peran-peran lama seperti `prov_admin`, `region_admin`, dan `platform_operator` telah dihapus secara permanen dari skema basis data dan logika aplikasi.*

---

## 3. Pelindungan Data Pribadi (UU PDP No. 27/2022)

Sebagai **Pengendali Data Pribadi Mandiri**, ESPORT SUMBAR menerapkan prinsip minimalisasi data:
1. **Zero NIK/KK/KTP Storage**:
   - Pendaftaran atlet dan entitas **tidak lagi mewajibkan atau mengumpulkan nomor NIK KTP atau Nomor KK**.
   - Verifikasi keabsahan atlet dilakukan melalui pencocokan Player ID in-game, tangkapan layar akun resmi, dan dokumen prestasi.
2. **Penyaringan Otomatis (Sanitization)**:
   - Lapisan layanan profil secara otomatis menghapus dan membuang atribut NIK/KTP dari payload sebelum disimpan ke basis data.
3. **Pemisahan Data Privat**:
   - Data kontak privat (nomor WhatsApp, email verifikasi) disimpan dalam tabel terpisah `profile_private` yang dilindungi kebijakan RLS ketat dan tidak pernah diekspos ke publik atau direktori.

---

## 4. Keamanan Arsitektur & Lapisan BFF

1. **Zero Direct DB Access dari Klien Browser**:
   - Komponen antarmuka peramban (`"use client"`) tidak diizinkan melakukan kueri langsung (`.from(...)`) ke basis data Supabase.
   - Seluruh mutasi dan pembacaan data privat dilakukan melalui Backend-for-Frontend (BFF) di `/api/*`.
2. **Isolasi Service Role Key**:
   - Kunci `SUPABASE_SERVICE_ROLE_KEY` **hanya berada di server runtime** (Server Actions dan Route Handlers terlindungi).
   - Bundle klien peramban 100% bebas dari referensi service role.
3. **Token Layanan Antar-Layanan Berumur Pendek**:
   - Komunikasi internal menggunakan token bertandatangan HMAC-SHA256 dengan masa berlaku 5 menit (`issueServiceToken`).
4. **Header Keamanan (OWASP Best Practices)**:
   - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
   - `X-Frame-Options: DENY` (Mencegah serangan Clickjacking)
   - `X-Content-Type-Options: nosniff` (Mencegah MIME-sniffing)
   - `Referrer-Policy: strict-origin-when-cross-origin`
   - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
5. **Kebijakan CORS Ketat**:
   - Larangan mutlak terhadap wildcard (`*`) pada rute yang membutuhkan otentikasi.
   - Pengecekan daftar origin terpercaya (*whitelisted origins*) dan pra-pemeriksaan aman `OPTIONS`.
6. **Batas Laju (Rate Limiting)**:
   - Sliding window rate limiting berbasis IP dan User ID untuk menangkal serangan brute force, DoS, dan scraping.

---

## 5. Prosedur Rotasi Rahasia & Kunci (Secret Rotation)

Rotasi rahasia wajib dijalankan secara berkala (minimal setiap 90 hari) atau segera setelah terjadi insiden:
- **Supabase JWT Secret & Service Role Key**: Dilakukan melalui dasbor Supabase Settings -> API -> Generate New Keys, diikuti dengan pembaruan variabel lingkungan di platform hosting.
- **Service Token Secret (`SERVICE_TOKEN_SECRET`)**: Diperbarui melalui platform hosting (Vercel Environment Variables) dengan masa transisi tumpang tindih (*dual-secret grace period*).
- **Prosedur Lengkap**: Lihat panduan di [`docs/runbooks/KEY_ROTATION.md`](file:///d:/AI%20AGENT/ESPORT%20SUMBAR%20V2/docs/runbooks/KEY_ROTATION.md).
